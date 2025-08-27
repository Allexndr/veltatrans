import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8414818778:AAG2QXqDu0WKwsClyMt5CpbpLQBL3QLVWUE';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002999769930';

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
      if (!db) {
        console.warn('⚠️ MongoDB not available - running in demo mode');
        return;
      }
      
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
      console.warn('⚠️ Running in demo mode without database');
    }
  }
}

// Data access functions for MongoDB
async function getDrivers() {
  await initDB();
  if (!driversCollection) {
    console.warn('⚠️ MongoDB not available - returning demo data');
    return [
      { id: 'demo_1', name: 'Демо Водитель 1', carNumber: 'DEMO 001', rating: 5.0 },
      { id: 'demo_2', name: 'Демо Водитель 2', carNumber: 'DEMO 002', rating: 4.8 }
    ];
  }
  return await driversCollection.find({}).toArray();
}

async function saveDriver(driver: any) {
  await initDB();
  if (!driversCollection) {
    console.warn('⚠️ MongoDB not available - demo mode');
    return { acknowledged: true, insertedId: 'demo_' + Date.now() };
  }
  
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
  if (!ordersCollection) {
    console.warn('⚠️ MongoDB not available - returning demo data');
    return [];
  }
  return await ordersCollection.find({}).toArray();
}

async function saveOrder(order: any) {
  await initDB();
  if (!ordersCollection) {
    console.warn('⚠️ MongoDB not available - demo mode');
    return { acknowledged: true, insertedId: 'demo_order_' + Date.now() };
  }
  
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
  if (!userStatesCollection) {
    console.warn('⚠️ MongoDB not available - demo mode');
    return null;
  }
  const state = await userStatesCollection.findOne({ userId });
  return state ? state.state : null;
}

async function setUserState(userId: number, state: any) {
  await initDB();
  if (!userStatesCollection) {
    console.warn('⚠️ MongoDB not available - demo mode');
    return { acknowledged: true, modifiedCount: 1 };
  }
  
  return await userStatesCollection.updateOne(
    { userId },
    { $set: { userId, state, lastActivity: new Date().toISOString() } },
    { upsert: true }
  );
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

async function editTelegramMessage(chatId: string, messageId: number, text: string, keyboard?: any) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/editMessageText`;
  const body: any = {
    chat_id: chatId,
    message_id: messageId,
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
      console.error('Telegram API edit error:', await response.text());
    }
    
    return response.ok;
  } catch (error) {
    console.error('Error editing Telegram message:', error);
    return false;
  }
}

// Inline keyboard builders
function buildMainMenu() {
  return {
    inline_keyboard: [
      [
        { text: '🔐 Вход в систему', callback_data: 'main_login' },
        { text: '📱 Поделиться номером', callback_data: 'main_share_phone' }
      ]
    ]
  };
}

function buildSectionsMenu() {
  return {
    inline_keyboard: [
      [
        { text: '🚛 Водителям', callback_data: 'section_drivers' },
        { text: '📦 Клиентам', callback_data: 'section_clients' }
      ],
      [
        { text: '⭐ Рейтинг водителей', callback_data: 'section_rating' },
        { text: '👤 Сотрудникам', callback_data: 'section_staff' }
      ],
      [
        { text: '← Назад', callback_data: 'back_main' }
      ]
    ]
  };
}

function buildDriverMenu() {
  return {
    inline_keyboard: [
      [
        { text: '📝 Регистрация', callback_data: 'driver_register' },
        { text: '📊 Мои заказы', callback_data: 'driver_orders' }
      ],
      [
        { text: '⭐ Мой рейтинг', callback_data: 'driver_rating' },
        { text: '💰 Заработок', callback_data: 'driver_earnings' }
      ],
      [
        { text: '← Назад', callback_data: 'back_sections' }
      ]
    ]
  };
}

function buildClientMenu() {
  return {
    inline_keyboard: [
      [
        { text: '🚚 Создать заказ', callback_data: 'client_create_order' },
        { text: '📋 Мои заказы', callback_data: 'client_orders' }
      ],
      [
        { text: '📍 Отследить груз', callback_data: 'client_track' },
        { text: '💳 Оплата', callback_data: 'client_payment' }
      ],
      [
        { text: '← Назад', callback_data: 'back_sections' }
      ]
    ]
  };
}

function buildStaffMenu() {
  return {
    inline_keyboard: [
      [
        { text: '📊 Статистика', callback_data: 'staff_stats' },
        { text: '👥 Управление', callback_data: 'staff_manage' }
      ],
      [
        { text: '📢 Уведомления', callback_data: 'staff_notifications' },
        { text: '⚙️ Настройки', callback_data: 'staff_settings' }
      ],
      [
        { text: '← Назад', callback_data: 'back_sections' }
      ]
    ]
  };
}

function buildBackButton(callbackData: string) {
  return {
    inline_keyboard: [
      [{ text: '← Назад', callback_data: callbackData }]
    ]
  };
}

// Menu handlers
async function showMainMenu(chatId: string, messageId?: number) {
  const text = '🚛 Добро пожаловать в Velta Trans!\n\nВыберите действие:';
  const keyboard = buildMainMenu();
  
  if (messageId) {
    await editTelegramMessage(chatId, messageId, text, keyboard);
  } else {
    await sendTelegramMessage(chatId, text, keyboard);
  }
}

async function showSectionsMenu(chatId: string, messageId: number) {
  const text = 'Выберите раздел:';
  const keyboard = buildSectionsMenu();
  await editTelegramMessage(chatId, messageId, text, keyboard);
}

async function showDriverMenu(chatId: string, messageId: number) {
  const text = '🚛 Раздел для водителей\n\nВыберите действие:';
  const keyboard = buildDriverMenu();
  await editTelegramMessage(chatId, messageId, text, keyboard);
}

async function showClientMenu(chatId: string, messageId: number) {
  const text = '📦 Раздел для клиентов\n\nВыберите действие:';
  const keyboard = buildClientMenu();
  await editTelegramMessage(chatId, messageId, text, keyboard);
}

async function showStaffMenu(chatId: string, messageId: number) {
  const text = '👤 Раздел для сотрудников\n\nВыберите действие:';
  const keyboard = buildStaffMenu();
  await editTelegramMessage(chatId, messageId, text, keyboard);
}

// Health check endpoint
export async function GET(request: NextRequest) {
  // Skip execution during build time
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return NextResponse.json({
      success: true,
      message: 'Telegram bot webhook is running (demo mode)',
      mongodb: 'not configured'
    });
  }

  try {
    await initDB();
    return NextResponse.json({
      success: true,
      message: 'Telegram bot webhook is running',
      mongodb: db ? 'connected' : 'demo mode'
    });
  } catch (error) {
    console.error('❌ Health check error:', error);
    return NextResponse.json({
      success: true,
      message: 'Telegram bot webhook is running (demo mode)',
      mongodb: 'error'
    });
  }
}

// Main webhook handler
export async function POST(request: NextRequest) {
  // Skip execution during build time
  if (process.env.NODE_ENV === 'production' && !process.env.MONGODB_URI) {
    return NextResponse.json({ success: true });
  }

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
  
  if (text === '/start') {
    await showMainMenu(chat.id);
  } else {
    // Handle other text messages
    const userState = await getUserState(userId);
    if (userState) {
      await handleUserState(userId, text, chat.id, userState);
    }
  }
}

// Handle user states
async function handleUserState(userId: number, text: string, chatId: string, state: string) {
  switch (state) {
    case 'waiting_for_name':
      await setUserState(userId, 'waiting_for_phone');
      await sendTelegramMessage(chatId, '📱 Введите ваш номер телефона:', buildBackButton('back_driver_register'));
      break;
      
    case 'waiting_for_phone':
      await setUserState(userId, 'waiting_for_car');
      await sendTelegramMessage(chatId, '🚗 Введите номер вашего автомобиля:', buildBackButton('back_driver_register'));
      break;
      
    case 'waiting_for_car':
      await setUserState(userId, null);
      await sendTelegramMessage(chatId, '✅ Регистрация завершена! Теперь вы можете получать заказы.');
      break;
  }
}

// Handle callback queries
async function handleCallbackQuery(callbackQuery: any) {
  const { data, from, message } = callbackQuery;
  const userId = from.id;
  const chatId = message.chat.id;
  const messageId = message.message_id;
  
  console.log('🔘 Callback query received:', data);
  
  switch (data) {
    case 'main_login':
      await showSectionsMenu(chatId, messageId);
      break;
      
    case 'main_share_phone':
      await sendTelegramMessage(chatId, '📱 Пожалуйста, поделитесь своим номером телефона:', {
        reply_markup: {
          keyboard: [[{ text: '📱 Поделиться номером', request_contact: true }]],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
      break;
      
    case 'back_main':
      await showMainMenu(chatId, messageId);
      break;
      
    case 'back_sections':
      await showSectionsMenu(chatId, messageId);
      break;
      
    case 'section_drivers':
      await showDriverMenu(chatId, messageId);
      break;
      
    case 'section_clients':
      await showClientMenu(chatId, messageId);
      break;
      
    case 'section_staff':
      await showStaffMenu(chatId, messageId);
      break;
      
    case 'section_rating':
      await showDriverRating(chatId, messageId);
      break;
      
    case 'driver_register':
      await setUserState(userId, 'waiting_for_name');
      await editTelegramMessage(chatId, messageId, '👤 Введите ваше имя:', buildBackButton('back_driver_menu'));
      break;
      
    case 'driver_orders':
      await showDriverOrders(chatId, messageId, userId);
      break;
      
    case 'driver_rating':
      await editTelegramMessage(chatId, messageId, '⭐ Ваш текущий рейтинг: 4.8/5', buildBackButton('back_driver_menu'));
      break;
      
    case 'driver_earnings':
      await editTelegramMessage(chatId, messageId, '💰 Ваш заработок за месяц: 150,000 тенге', buildBackButton('back_driver_menu'));
      break;
      
    case 'client_create_order':
      await setUserState(userId, 'waiting_for_order_from');
      await editTelegramMessage(chatId, messageId, '📍 Откуда забрать груз?', buildBackButton('back_client_menu'));
      break;
      
    case 'client_orders':
      await showClientOrders(chatId, messageId, userId);
      break;
      
    case 'client_track':
      await editTelegramMessage(chatId, messageId, '📍 Введите номер отслеживания:', buildBackButton('back_client_menu'));
      break;
      
    case 'client_payment':
      await editTelegramMessage(chatId, messageId, '💳 Выберите способ оплаты:', buildBackButton('back_client_menu'));
      break;
      
    case 'staff_stats':
      await showAnalytics(chatId, messageId);
      break;
      
    case 'staff_manage':
      await editTelegramMessage(chatId, messageId, '👥 Управление персоналом', buildBackButton('back_staff_menu'));
      break;
      
    case 'staff_notifications':
      await editTelegramMessage(chatId, messageId, '📢 Управление уведомлениями', buildBackButton('back_staff_menu'));
      break;
      
    case 'staff_settings':
      await editTelegramMessage(chatId, messageId, '⚙️ Настройки системы', buildBackButton('back_staff_menu'));
      break;
      
    case 'back_driver_menu':
      await showDriverMenu(chatId, messageId);
      break;
      
    case 'back_client_menu':
      await showClientMenu(chatId, messageId);
      break;
      
    case 'back_staff_menu':
      await showStaffMenu(chatId, messageId);
      break;
      
    case 'back_driver_register':
      await showDriverMenu(chatId, messageId);
      break;
      
    default:
      console.log('❓ Unknown callback data:', data);
  }
}

// Show driver rating
async function showDriverRating(chatId: string, messageId: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/telegram/analytics`);
    const data = await response.json();
    
    if (data.success && data.analytics.topDrivers) {
      let text = '⭐ Рейтинг водителей Velta Trans\n\n';
      
      data.analytics.topDrivers.forEach((driver: any, index: number) => {
        text += `${index + 1}. ${driver.name}\n`;
        text += `   🚗 ${driver.carNumber}\n`;
        text += `   ⭐ ${driver.rating}/5\n\n`;
      });
      
      await editTelegramMessage(chatId, messageId, text, buildBackButton('back_sections'));
    } else {
      await editTelegramMessage(chatId, messageId, '📊 Рейтинг водителей временно недоступен', buildBackButton('back_sections'));
    }
  } catch (error) {
    console.error('Rating error:', error);
    await editTelegramMessage(chatId, messageId, '❌ Ошибка при загрузке рейтинга', buildBackButton('back_sections'));
  }
}

// Show analytics
async function showAnalytics(chatId: string, messageId: number) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/telegram/analytics`);
    const data = await response.json();
    
    if (data.success) {
      const { overview, topDrivers } = data.analytics;
      
      let text = '📈 Статистика Velta Trans\n\n';
      text += `👥 Всего водителей: ${overview.totalDrivers}\n`;
      text += `✅ Активных водителей: ${overview.activeDrivers}\n`;
      text += `📦 Всего заказов: ${overview.totalOrders}\n`;
      text += `🎯 Завершенных заказов: ${overview.completedOrders}\n`;
      text += `📊 Процент успеха: ${overview.successRate}\n\n`;
      
      if (topDrivers && topDrivers.length > 0) {
        text += '🏆 Топ водители:\n';
        topDrivers.forEach((driver: any, index: number) => {
          text += `${index + 1}. ${driver.name} - ⭐${driver.rating}/5 (${driver.totalOrders} заказов)\n`;
        });
      }
      
      await editTelegramMessage(chatId, messageId, text, buildBackButton('back_staff_menu'));
    } else {
      await editTelegramMessage(chatId, messageId, '❌ Не удалось загрузить аналитику', buildBackButton('back_staff_menu'));
    }
  } catch (error) {
    console.error('Analytics error:', error);
    await editTelegramMessage(chatId, messageId, '❌ Ошибка при загрузке аналитики', buildBackButton('back_staff_menu'));
  }
}

// Show driver orders
async function showDriverOrders(chatId: string, messageId: number, userId: number) {
  const orders = await getOrders();
  const userOrders = orders.filter((o: any) => o.driverId === userId);
  
  if (userOrders.length === 0) {
    await editTelegramMessage(chatId, messageId, '📭 У вас пока нет заказов.', buildBackButton('back_driver_menu'));
    return;
  }
  
  let text = '📋 Ваши заказы:\n\n';
  userOrders.forEach((order: any, index: number) => {
    text += `${index + 1}. ${order.from} → ${order.to}\n`;
    text += `   Статус: ${order.status}\n`;
    text += `   Создан: ${new Date(order.createdAt).toLocaleDateString()}\n\n`;
  });
  
  await editTelegramMessage(chatId, messageId, text, buildBackButton('back_driver_menu'));
}

// Show client orders
async function showClientOrders(chatId: string, messageId: number, userId: number) {
  const orders = await getOrders();
  const userOrders = orders.filter((o: any) => o.clientId === userId);
  
  if (userOrders.length === 0) {
    await editTelegramMessage(chatId, messageId, '📭 У вас пока нет заказов.', buildBackButton('back_client_menu'));
    return;
  }
  
  let text = '📋 Ваши заказы:\n\n';
  userOrders.forEach((order: any, index: number) => {
    text += `${index + 1}. ${order.from} → ${order.to}\n`;
    text += `   Статус: ${order.status}\n`;
    text += `   Создан: ${new Date(order.createdAt).toLocaleDateString()}\n\n`;
  });
  
  await editTelegramMessage(chatId, messageId, text, buildBackButton('back_client_menu'));
}

