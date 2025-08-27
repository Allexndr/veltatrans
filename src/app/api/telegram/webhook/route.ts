import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8414818778:AAG2QXqDu0WKwsClyMt5CpbpLQBL3QLVWUE';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002999769930';
const ADMIN_ID = '5450018125'; // ID админа

// MongoDB collections
let db: any;
let driversCollection: any;
let ordersCollection: any;
let userStatesCollection: any;
let staffUsersCollection: any;

// Initialize MongoDB connection
async function initDB() {
  if (!db) {
    try {
      db = await getDb();
      driversCollection = db.collection('drivers');
      ordersCollection = db.collection('orders');
      userStatesCollection = db.collection('user_states');
      staffUsersCollection = db.collection('staff_users');
      
      // Create indexes for better performance
      await driversCollection.createIndex({ phone: 1 });
      await ordersCollection.createIndex({ status: 1 });
      await userStatesCollection.createIndex({ userId: 1 });
      
      console.log('✅ MongoDB connected successfully');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }
}

// Data access functions for MongoDB
async function getDrivers() {
  await initDB();
  return await driversCollection.find({}).toArray();
}

async function saveDriver(driver: any) {
  await initDB();
  if (driver.id) {
    return await driversCollection.updateOne(
      { id: driver.id },
      { $set: driver },
      { upsert: true }
    );
  } else {
    driver.id = Date.now();
    driver.createdAt = new Date().toISOString();
    return await driversCollection.insertOne(driver);
  }
}

async function getOrders() {
  await initDB();
  return await ordersCollection.find({}).toArray();
}

async function saveOrder(order: any) {
  await initDB();
  if (order.id) {
    return await ordersCollection.updateOne(
      { id: order.id },
      { $set: order },
      { upsert: true }
    );
  } else {
    order.id = `order_${Date.now()}`;
    order.createdAt = new Date().toISOString();
    return await ordersCollection.insertOne(order);
  }
}

async function getUserState(userId: number) {
  await initDB();
  const state = await userStatesCollection.findOne({ userId });
  return state ? state.state : null;
}

async function setUserState(userId: number, state: any) {
  await initDB();
  return await userStatesCollection.updateOne(
    { userId },
    { $set: { userId, state, lastActivity: new Date().toISOString() } },
    { upsert: true }
  );
}

async function getStaffUsers() {
  await initDB();
  return await staffUsersCollection.find({}).toArray();
}

async function saveStaffUser(staff: any) {
  await initDB();
  if (staff.id) {
    return await staffUsersCollection.updateOne(
      { id: staff.id },
      { $set: staff },
      { upsert: true }
    );
  } else {
    staff.id = Date.now();
    staff.createdAt = new Date().toISOString();
    return await staffUsersCollection.insertOne(staff);
  }
}

// Helper functions
async function sendTelegramMessage(chatId: string, text: string, keyboard?: any) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const body: any = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  };
  
  if (keyboard) {
    body.reply_markup = keyboard;
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      console.error('Telegram API error:', await response.text());
    }
    
    return response.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

async function sendNotificationToChannel(text: string) {
  if (CHANNEL_ID) {
    await sendTelegramMessage(CHANNEL_ID, text);
  }
}

// Main webhook handler
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('📨 Webhook received:', JSON.stringify(body, null, 2));
    
    // Handle different types of updates
    if (body.message) {
      await handleMessage(body.message);
    } else if (body.callback_query) {
      await handleCallbackQuery(body.callback_query);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

// Handle incoming messages
async function handleMessage(message: any) {
  const { chat, text, from } = message;
  const userId = from.id;
  
  if (!text) return;
  
  const userState = await getUserState(userId);
  
  // Handle different states
  if (userState === 'waiting_for_name') {
    await handleDriverRegistration(userId, text, 'name');
  } else if (userState === 'waiting_for_phone') {
    await handleDriverRegistration(userId, text, 'phone');
  } else if (userState === 'waiting_for_car') {
    await handleDriverRegistration(userId, text, 'car');
  } else if (userState === 'waiting_for_order_from') {
    await handleOrderCreation(userId, text, 'from');
  } else if (userState === 'waiting_for_order_to') {
    await handleOrderCreation(userId, text, 'to');
  } else if (userState === 'waiting_for_order_description') {
    await handleOrderCreation(userId, text, 'description');
  } else {
    // Default command handling
    await handleCommand(userId, text, chat.id);
  }
}

// Handle driver registration
async function handleDriverRegistration(userId: number, text: string, field: string) {
  const drivers = await getDrivers();
  let driver = drivers.find((d: any) => d.telegramId === userId);
  
  if (!driver) {
    driver = {
      telegramId: userId,
      name: '',
      phone: '',
      carNumber: '',
      carType: '',
      registeredAt: new Date().toISOString(),
      status: 'active',
      rating: 0,
      totalOrders: 0,
      completedOrders: 0,
      ratingCount: 0,
      clientRating: 0,
      clientRatingCount: 0
    };
  }
  
  switch (field) {
    case 'name':
      driver.name = text;
      await setUserState(userId, 'waiting_for_phone');
      await sendTelegramMessage(userId.toString(), '📱 Введите ваш номер телефона:');
      break;
    case 'phone':
      driver.phone = text;
      await setUserState(userId, 'waiting_for_car');
      await sendTelegramMessage(userId.toString(), '🚗 Введите номер вашего автомобиля:');
      break;
    case 'car':
      driver.carNumber = text;
      await saveDriver(driver);
      await setUserState(userId, null);
      await sendTelegramMessage(userId.toString(), '✅ Регистрация завершена! Теперь вы можете получать заказы.');
      await sendNotificationToChannel(`🚗 Новый водитель зарегистрирован: ${driver.name} (${driver.carNumber})`);
      break;
  }
}

// Handle order creation
async function handleOrderCreation(userId: number, text: string, field: string) {
  const orders = await getOrders();
  let order = orders.find((o: any) => o.clientId === userId && o.status === 'active');
  
  if (!order) {
    order = {
      clientId: userId,
      from: '',
      to: '',
      description: '',
      status: 'active',
      createdAt: new Date().toISOString(),
      bids: []
    };
  }
  
  switch (field) {
    case 'from':
      order.from = text;
      await setUserState(userId, 'waiting_for_order_to');
      await sendTelegramMessage(userId.toString(), '📍 Куда доставить груз?');
      break;
    case 'to':
      order.to = text;
      await setUserState(userId, 'waiting_for_order_description');
      await sendTelegramMessage(userId.toString(), '📦 Опишите груз:');
      break;
    case 'description':
      order.description = text;
      await saveOrder(order);
      await setUserState(userId, null);
      await sendTelegramMessage(userId.toString(), '✅ Заказ создан! Водители увидят ваш заказ и смогут предложить свои услуги.');
      await sendNotificationToChannel(`📦 Новый заказ: ${order.from} → ${order.to}\n${order.description}`);
      break;
  }
}

// Handle commands
async function handleCommand(userId: number, text: string, chatId: string) {
  switch (text.toLowerCase()) {
    case '/start':
      await sendTelegramMessage(chatId, 
        '🚛 Добро пожаловать в Velta Trans!\n\n' +
        'Выберите действие:',
        {
          keyboard: {
            resize_keyboard: true,
            keyboard: [
              [{ text: '🚗 Зарегистрироваться как водитель' }],
              [{ text: '📦 Создать заказ' }],
              [{ text: '📊 Мои заказы' }],
              [{ text: '⭐ Оценить водителя' }]
            ]
          }
        }
      );
      break;
      
    case '🚗 зарегистрироваться как водитель':
      await setUserState(userId, 'waiting_for_name');
      await sendTelegramMessage(chatId, '👤 Введите ваше имя:');
      break;
      
    case '📦 создать заказ':
      await setUserState(userId, 'waiting_for_order_from');
      await sendTelegramMessage(chatId, '📍 Откуда забрать груз?');
      break;
      
    case '📊 мои заказы':
      await showUserOrders(userId, chatId);
      break;
      
    case '⭐ оценить водителя':
      await showRatingForm(userId, chatId);
      break;
      
    default:
      await sendTelegramMessage(chatId, '❓ Неизвестная команда. Используйте /start для начала работы.');
  }
}

// Show user orders
async function showUserOrders(userId: number, chatId: string) {
  const orders = await getOrders();
  const userOrders = orders.filter((o: any) => o.clientId === userId);
  
  if (userOrders.length === 0) {
    await sendTelegramMessage(chatId, '📭 У вас пока нет заказов.');
    return;
  }
  
  let message = '📋 Ваши заказы:\n\n';
  userOrders.forEach((order: any, index: number) => {
    message += `${index + 1}. ${order.from} → ${order.to}\n`;
    message += `   Статус: ${order.status}\n`;
    message += `   Создан: ${new Date(order.createdAt).toLocaleDateString()}\n\n`;
  });
  
  await sendTelegramMessage(chatId, message);
}

// Show rating form
async function showRatingForm(userId: number, chatId: string) {
  const orders = await getOrders();
  const completedOrders = orders.filter((o: any) => 
    o.clientId === userId && o.status === 'completed' && !o.clientRating
  );
  
  if (completedOrders.length === 0) {
    await sendTelegramMessage(chatId, '📭 У вас нет завершенных заказов для оценки.');
    return;
  }
  
  let message = '⭐ Выберите заказ для оценки:\n\n';
  completedOrders.forEach((order: any, index: number) => {
    message += `${index + 1}. ${order.from} → ${order.to}\n`;
  });
  
  await sendTelegramMessage(chatId, message);
}

// Handle callback queries
async function handleCallbackQuery(callbackQuery: any) {
  const { data, from } = callbackQuery;
  const userId = from.id;
  
  if (data.startsWith('rate_driver_')) {
    const orderId = data.replace('rate_driver_', '');
    await handleDriverRating(userId, orderId);
  }
}

// Handle driver rating
async function handleDriverRating(userId: number, orderId: string) {
  // Implementation for rating drivers
  await sendTelegramMessage(userId.toString(), '⭐ Введите оценку от 1 до 5:');
}

// Health check endpoint
export async function GET() {
  try {
    await initDB();
    return NextResponse.json({ 
      success: true, 
      message: 'Telegram bot webhook is running',
      mongodb: 'connected'
    });
  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      message: 'Telegram bot webhook error',
      error: error instanceof Error ? error.message : 'Unknown error',
      mongodb: 'disconnected'
    }, { status: 500 });
  }
}