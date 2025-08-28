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
let orderOffersCollection: any;
let wizardStatesCollection: any;
let trackingUpdatesCollection: any;

// Temp in-memory stores (demo mode friendly)
const tempOrders: Record<number, any> = {};
const userLanguage: Record<number, 'ru' | 'kz' | 'en' | 'zh'> = {};
const tempOffers: Record<string, { driverId: number; price: number; at: string; status?: string }[]> = {};

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
      orderOffersCollection = db.collection('order_offers');
      wizardStatesCollection = db.collection('wizard_states');
      trackingUpdatesCollection = db.collection('tracking_updates');
      
      // Create indexes for better performance
      await driversCollection.createIndex({ phone: 1 });
      await ordersCollection.createIndex({ status: 1 });
      await userStatesCollection.createIndex({ userId: 1 });
      await orderOffersCollection.createIndex({ orderId: 1 });
      await wizardStatesCollection.createIndex({ userId: 1 });
      await trackingUpdatesCollection.createIndex({ orderId: 1 }, { expireAfterSeconds: 3600 }); // TTL for tracking updates
      await trackingUpdatesCollection.createIndex({ createdAt: 1 }, { expireAfterSeconds: 15552000 }); // 180 дней
      
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
      { id: 'demo_1', name: 'Хабдулманап', carNumber: 'ГАЗ 161AFH03', rating: null, phone: '+87054060674', userId: null },
      { id: 'demo_2', name: 'Демо Водитель 2', carNumber: 'DEMO 002', rating: null, phone: '+77051234567', userId: null }
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
    return [
      {
        id: 'order_1',
        from: 'Алматы',
        to: 'Ташкент',
        cargo: 'Pepsi',
        weight: '10 тонн',
        volume: '25 м³',
        status: 'active',
        driverId: null,
        clientId: 'client_1',
        createdAt: new Date().toISOString(),
        price: null,
        driverLocation: null,
        lastStatusUpdate: null
      }
    ];
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

async function getAvailableOrders() {
  const orders = await getOrders();
  return orders.filter((order: any) => order.status === 'active' && !order.driverId);
}

async function assignOrderToDriver(orderId: string, driverId: string, price: number) {
  const orders = await getOrders();
  const targetOrder = orders.find((o: any) => o.id === orderId);
  
  if (targetOrder) {
    // Get driver info
    const drivers = await getDrivers();
    const driver = drivers.find((d: any) => d.userId === parseInt(driverId));
    
    if (driver) {
      // Send notification to staff channel
      const message = `💰 <b>Новое предложение цены!</b>\n\n` +
        `📋 <b>Заказ:</b> ${targetOrder.from} → ${targetOrder.to}\n` +
        `👤 <b>Водитель:</b> ${driver.name}\n` +
        `📱 <b>Телефон:</b> ${driver.phone}\n` +
        `🚗 <b>Автомобиль:</b> ${driver.carNumber}\n` +
        `💵 <b>Цена:</b> ${price.toLocaleString()} тенге\n\n` +
        `⏰ ${new Date().toLocaleString('ru-RU')}`;
      await sendNotificationToChannel(message);
    }
    
    targetOrder.driverId = driverId;
    targetOrder.price = price;
    targetOrder.status = 'assigned';
    targetOrder.assignedAt = new Date().toISOString();
    await saveOrder(targetOrder);
    return true;
  }
  return false;
}

async function updateDriverStatus(driverId: string, status: string, location?: string) {
  const drivers = await getDrivers();
  const driver = drivers.find((d: any) => d.userId === driverId);
  
  if (driver) {
    driver.currentStatus = status;
    driver.lastStatusUpdate = new Date().toISOString();
    if (location) {
      driver.currentLocation = location;
    }
    await saveDriver(driver);
    return true;
  }
  return false;
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

async function answerCallbackQuery(callbackQueryId: string, text?: string, showAlert: boolean = false) {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text, show_alert: showAlert })
    });
  } catch (e) {
    console.error('answerCallbackQuery error', e);
  }
}

async function sendNotificationToChannel(message: string) {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHANNEL_ID, text: message, parse_mode: 'HTML' })
    });
  } catch (e) {
    console.error('Channel notify error', e);
  }
}

// Inline keyboard builders
function buildMainMenu() {
  return {
    inline_keyboard: [
      [{ text: '🚛 Водителям', callback_data: 'section_drivers' }],
      [{ text: '📦 Клиентам', callback_data: 'section_clients' }],
      [{ text: '👤 Сотрудникам', callback_data: 'section_staff' }],
      [{ text: '🌐 Смена языка', callback_data: 'change_language' }]
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

function buildUnregisteredDriverMenu() {
  return {
    inline_keyboard: [
      [{ text: '📝 Регистрация', callback_data: 'driver_register' }],
      [{ text: '🔐 Вход в систему', callback_data: 'driver_login' }],
      [{ text: '← Назад', callback_data: 'back_main' }]
    ]
  };
}

function buildRegisteredDriverMenu() {
  return {
    inline_keyboard: [
      [{ text: '📊 Мои заказы', callback_data: 'driver_orders' }],
      [{ text: '🚚 Доступные заказы', callback_data: 'driver_available_orders' }],
      [{ text: '📍 Обновить статус', callback_data: 'driver_update_status' }],
      [{ text: '⭐ Мой рейтинг', callback_data: 'driver_rating' }],
      [{ text: '💰 Заработок', callback_data: 'driver_earnings' }],
      [{ text: '👤 Мой профиль', callback_data: 'driver_profile' }],
      [{ text: '🚪 Выйти из системы', callback_data: 'driver_logout' }],
      [{ text: '← Назад', callback_data: 'back_main' }]
    ]
  };
}

function buildClientMenu() {
  return {
    inline_keyboard: [
      [{ text: '🚚 Создать заказ', callback_data: 'client_create_order' }],
      [{ text: '📋 Мои заказы', callback_data: 'client_orders' }],
      [{ text: '📍 Отследить груз', callback_data: 'client_track' }],
      [{ text: '💳 Оплата', callback_data: 'client_payment' }],
      [{ text: '← Назад', callback_data: 'back_main' }]
    ]
  };
}

function buildStaffMenu() {
  return {
    inline_keyboard: [
      [{ text: '📋 Создать заказ', callback_data: 'staff_create_order' }],
      [{ text: '📊 Статистика', callback_data: 'staff_stats' }],
      [{ text: '👥 Управление заказами', callback_data: 'staff_manage_orders' }],
      [{ text: '🚚 Управление водителями', callback_data: 'staff_manage_drivers' }],
      [{ text: '📢 Уведомления', callback_data: 'staff_notifications' }],
      [{ text: '⚙️ Настройки', callback_data: 'staff_settings' }],
      [{ text: '← Назад', callback_data: 'back_main' }]
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
  const text = '🚛 Добро пожаловать в Velta Trans!\n\nВыберите раздел:';
  const keyboard = buildMainMenu();
  
  if (messageId) {
    await editTelegramMessage(chatId, messageId, text, keyboard);
  } else {
    await sendTelegramMessage(chatId, text, keyboard);
  }
}

async function showDriverMenu(chatId: string, messageId: number, userId?: number) {
  // Check if driver is registered
  if (userId) {
    const drivers = await getDrivers();
    const driver = drivers.find((d: any) => d.userId === userId);
    
    if (driver) {
      // Driver is registered - show full menu
      const ratingText = driver.rating ? `⭐ Рейтинг: ${driver.rating.toFixed(2)}/5` : '⭐ Рейтинг: Н/Д';
      const text = `🚛 Раздел для водителей\n\n👤 ${driver.name}\n🚗 ${driver.carNumber}\n${ratingText}`;
      const keyboard = buildRegisteredDriverMenu();
      await editTelegramMessage(chatId, messageId, text, keyboard);
      return;
    }
  }
  
  // Driver is not registered or logged out - show registration/login menu
  const text = '🚛 Раздел для водителей\n\nДля доступа к функциям необходимо войти в систему:';
  const keyboard = buildUnregisteredDriverMenu();
  await editTelegramMessage(chatId, messageId, text, keyboard);
}

async function showClientMenu(chatId: string, messageId: number) {
  const text = '📦 Раздел для клиентов\n\nВыберите действие:';
  const keyboard = buildClientMenu();
  await editTelegramMessage(chatId, messageId, text, keyboard);
}

async function showStaffMenu(chatId: string, messageId: number) {
  const text = '👤 Раздел для сотрудников\n\nВыберите действие:';
  const keyboard = {
    inline_keyboard: [
      [{ text: '📋 Создать заказ', callback_data: 'staff_create_order' }],
      [{ text: '📊 Статистика', callback_data: 'staff_stats' }],
      [{ text: '👥 Управление заказами', callback_data: 'staff_manage_orders' }],
      [{ text: '🚚 Управление водителями', callback_data: 'staff_manage_drivers' }],
      [{ text: '📢 Уведомления', callback_data: 'staff_notifications' }],
      [{ text: '⚙️ Настройки', callback_data: 'staff_settings' }],
      [{ text: '← Назад', callback_data: 'back_main' }]
    ]
  };
  await editTelegramMessage(chatId, messageId, text, keyboard);
}

async function showLanguageMenu(chatId: string, messageId: number) {
  const text = '🌐 Выберите язык / Choose language / 选择语言 / Тілді таңдаңыз:';
  const keyboard = {
    inline_keyboard: [
      [{ text: '🇷🇺 Русский', callback_data: 'lang_ru' }],
      [{ text: '🇰🇿 Қазақша', callback_data: 'lang_kz' }],
      [{ text: '🇺🇸 English', callback_data: 'lang_en' }],
      [{ text: '🇨🇳 中文', callback_data: 'lang_zh' }],
      [{ text: '← Назад', callback_data: 'back_main' }]
    ]
  };
  await editTelegramMessage(chatId, messageId, text, keyboard);
}

// Staff login credentials (в реальном проекте это должно быть в базе данных)
const STAFF_CREDENTIALS = {
  'admin': 'velta2024',
  'manager': 'velta2024',
  'logist': 'velta2024'
};

// Check if user is staff
function isStaffUser(userId: number): boolean {
  // В реальном проекте здесь должна быть проверка в базе данных
  return true; // Пока разрешаем всем для тестирования
}

// Show staff login menu
async function showStaffLoginMenu(chatId: string, messageId: number) {
  const text = '👤 Раздел для сотрудников\n\nДля доступа необходимо войти в систему:';
  const keyboard = {
    inline_keyboard: [
      [{ text: '🔐 Вход в систему', callback_data: 'staff_login' }],
      [{ text: '← Назад', callback_data: 'back_main' }]
    ]
  };
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
      try { await answerCallbackQuery(body.callback_query.id); } catch {}
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
      
    case 'waiting_for_phone_login':
      // Handle driver login by phone number
      const drivers = await getDrivers();
      const driver = findDriverByPhone(text, drivers);
      
      if (driver) {
        // Driver found - link user ID to driver and show success
        await saveDriver({ ...driver, userId });
        await setUserState(userId, null);
        const ratingText = driver.rating ? `⭐ Рейтинг: ${driver.rating.toFixed(2)}/5` : '⭐ Рейтинг: Н/Д';
        await sendTelegramMessage(chatId, `✅ Вход выполнен успешно!\n\n👤 ${driver.name}\n🚗 ${driver.carNumber}\n${ratingText}`);
        
        // Show driver menu with full access
        setTimeout(async () => {
          await showMainMenu(chatId);
        }, 1000);
      } else {
        // Driver not found
        await sendTelegramMessage(chatId, '❌ Водитель с таким номером телефона не найден в базе данных. Пожалуйста, зарегистрируйтесь или проверьте номер.');
      }
      break;
      
    case 'waiting_for_custom_price':
      const price = parseInt(text);
      if (isNaN(price) || price <= 0) {
        await sendTelegramMessage(chatId, '❌ Пожалуйста, введите корректную цену в тенге (только цифры).');
        return;
      }
      
      // Get the order ID from user state or use a default
      const userState = await getUserState(userId);
      if (userState && userState.includes('custom_price_')) {
        const orderId = userState.replace('custom_price_', '');
        await assignOrderToDriver(orderId, userId.toString(), price);
        await setUserState(userId, null);
        await sendTelegramMessage(chatId, `✅ Вы успешно взяли заказ!\n💰 Ваша цена: ${price} тенге\n\nЗаявка отправлена, ожидайте подтверждения.`);
      } else {
        await sendTelegramMessage(chatId, '❌ Ошибка: не удалось определить заказ. Попробуйте еще раз.');
      }
      break;
      
    case 'waiting_for_staff_username':
      // Store username and ask for password
      await setUserState(userId, `waiting_for_staff_password_${text}`);
      await sendTelegramMessage(chatId, '🔐 Введите пароль:', buildBackButton('back_main'));
      break;
      
    case 'waiting_for_staff_password_':
      // Extract username from state and check password
      const username = state.replace('waiting_for_staff_password_', '');
      const password = text;
      
      if (STAFF_CREDENTIALS[username as keyof typeof STAFF_CREDENTIALS] === password) {
        await setUserState(userId, 'staff_logged_in');
        await sendTelegramMessage(chatId, `✅ Вход выполнен успешно!\n👤 Сотрудник: ${username}\n\nТеперь у вас есть доступ к функциям управления.`);
        
        // Show staff menu
        setTimeout(async () => {
          await showMainMenu(chatId);
        }, 1000);
      } else {
        await sendTelegramMessage(chatId, '❌ Неверный логин или пароль. Попробуйте еще раз.');
      }
      break;

    case 'waiting_staff_from_custom':
      await setWizard(userId, { ...(await getWizard(userId)), from: text });
      await setUserState(userId, null);
      await showOrderCreationForm(chatId, undefined as any, 'to', userId);
      break;

    case 'waiting_staff_to_custom':
      await setWizard(userId, { ...(await getWizard(userId)), to: text });
      await setUserState(userId, null);
      await showOrderCreationForm(chatId, undefined as any, 'cargo', userId);
      break;

    case 'waiting_staff_cargo':
      await setWizard(userId, { ...(await getWizard(userId)), cargo: text });
      await setUserState(userId, null);
      await showOrderCreationForm(chatId, undefined as any, 'weight', userId);
      break;

    case 'waiting_staff_weight':
      await setWizard(userId, { ...(await getWizard(userId)), weight: text });
      await setUserState(userId, null);
      await showOrderCreationForm(chatId, undefined as any, 'volume', userId);
      break;

    case 'waiting_staff_volume':
      await setWizard(userId, { ...(await getWizard(userId)), volume: text });
      await setUserState(userId, null);
      await showOrderCreationForm(chatId, undefined as any, 'confirm', userId);
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
    case 'change_language':
      await showLanguageMenu(chatId, messageId);
      break;
      
    case 'back_main':
      await showMainMenu(chatId, messageId);
      break;
      
    case 'section_drivers':
      await showDriverMenu(chatId, messageId, userId);
      break;
      
    case 'section_clients':
      await showClientMenu(chatId, messageId);
      break;
      
    case 'section_staff':
      if (isStaffUser(userId)) {
        await showStaffMenu(chatId, messageId);
      } else {
        await showStaffLoginMenu(chatId, messageId);
      }
      break;
      
    case 'section_rating':
      await showDriverRating(chatId, messageId);
      break;
      
    case 'driver_register':
      await setUserState(userId, 'waiting_for_name');
      await editTelegramMessage(chatId, messageId, '👤 Введите ваше имя:', buildBackButton('back_driver_menu'));
      break;
      
    case 'driver_login':
      await setUserState(userId, 'waiting_for_phone_login');
      await editTelegramMessage(chatId, messageId, '📱 Введите ваш номер телефона для входа в систему:', buildBackButton('back_driver_menu'));
      break;
      
    case 'driver_orders':
      await showDriverOrders(chatId, messageId, userId);
      break;
      
    case 'driver_available_orders':
      await showAvailableOrders(chatId, messageId, userId);
      break;
      
    case 'driver_update_status':
      await setUserState(userId, 'waiting_for_status');
      await editTelegramMessage(chatId, messageId, '📍 Выберите ваш текущий статус:', {
        inline_keyboard: [
          [{ text: '🚗 В пути', callback_data: 'status_in_transit' }],
          [{ text: '⛽ На заправке', callback_data: 'status_refueling' }],
          [{ text: '🛑 Остановка', callback_data: 'status_stopped' }],
          [{ text: '🏁 Прибыл', callback_data: 'status_arrived' }],
          [{ text: '← Назад', callback_data: 'back_driver_menu' }]
        ]
      });
      break;
      
    case 'driver_rating':
      const drivers = await getDrivers();
      const currentDriver = drivers.find((d: any) => d.userId === userId);
      if (currentDriver && currentDriver.rating) {
        await editTelegramMessage(chatId, messageId, `⭐ Ваш текущий рейтинг: ${currentDriver.rating.toFixed(2)}/5`, buildBackButton('back_driver_menu'));
      } else {
        await editTelegramMessage(chatId, messageId, '⭐ У вас пока нет рейтинга. Выполните заказы для получения рейтинга.', buildBackButton('back_driver_menu'));
      }
      break;
      
    case 'driver_earnings':
      await editTelegramMessage(chatId, messageId, '💰 Ваш заработок за месяц: 150,000 тенге', buildBackButton('back_driver_menu'));
      break;
      
    case 'driver_profile':
      await showDriverProfile(chatId, messageId, userId);
      break;
      
    case 'driver_logout':
      await setUserState(userId, null);
      await showMainMenu(chatId);
      break;
      
    case 'back_driver_menu':
      await showDriverMenu(chatId, messageId, userId);
      break;
      
    case 'staff_login':
      await setUserState(userId, 'waiting_for_staff_username');
      await editTelegramMessage(chatId, messageId, '👤 Введите логин сотрудника:', buildBackButton('back_main'));
      break;
      
    case 'status_in_transit':
      await updateDriverStatus(userId.toString(), 'В пути');
      await editTelegramMessage(chatId, messageId, '✅ Статус обновлен: 🚗 В пути', buildBackButton('back_driver_menu'));
      break;
      
    case 'status_refueling':
      await updateDriverStatus(userId.toString(), 'На заправке');
      await editTelegramMessage(chatId, messageId, '✅ Статус обновлен: ⛽ На заправке', buildBackButton('back_driver_menu'));
      break;
      
    case 'status_stopped':
      await updateDriverStatus(userId.toString(), 'Остановка');
      await editTelegramMessage(chatId, messageId, '✅ Статус обновлен: 🛑 Остановка', buildBackButton('back_driver_menu'));
      break;
      
    case 'status_arrived':
      await updateDriverStatus(userId.toString(), 'Прибыл');
      await editTelegramMessage(chatId, messageId, '✅ Статус обновлен: 🏁 Прибыл', buildBackButton('back_driver_menu'));
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
      
    case 'staff_manage_orders':
      await showStaffOrdersManagement(chatId, messageId);
      break;
      
    case 'staff_manage_drivers':
      await showStaffDriversManagement(chatId, messageId);
      break;
      
    case 'staff_notifications':
      await editTelegramMessage(chatId, messageId, '📢 Управление уведомлениями', buildBackButton('back_staff_menu'));
      break;
      
    case 'staff_settings':
      await showStaffSettings(chatId, messageId);
      break;
      
    case 'staff_create_order':
      await setWizard(userId, {});
      await showOrderCreationForm(chatId, messageId, 'from', userId);
      break;

    case 'order_create_from':
      await showOrderCreationForm(chatId, messageId, 'from', userId);
      break;

    case 'order_from_custom':
      await setUserState(userId, 'waiting_staff_from_custom');
      await editTelegramMessage(chatId, messageId, '✏️ Введите город отправления вручную:', buildBackButton('order_create_from'));
      break;

    case 'order_to_custom':
      await setUserState(userId, 'waiting_staff_to_custom');
      await editTelegramMessage(chatId, messageId, '✏️ Введите город назначения вручную:', buildBackButton('order_create_to'));
      break;

    case 'order_create_to':
      await showOrderCreationForm(chatId, messageId, 'to', userId);
      break;

    case 'order_create_cargo':
      await showOrderCreationForm(chatId, messageId, 'cargo', userId);
      await setUserState(userId, 'waiting_staff_cargo');
      break;

    case 'order_create_weight':
      await showOrderCreationForm(chatId, messageId, 'weight', userId);
      await setUserState(userId, 'waiting_staff_weight');
      break;

    case 'order_create_volume':
      await showOrderCreationForm(chatId, messageId, 'volume', userId);
      await setUserState(userId, 'waiting_staff_volume');
      break;

    case 'order_send': {
      const state = await getWizard(userId);
      if (!state?.from || !state?.to || !state?.cargo || !state?.weight || !state?.volume) {
        await editTelegramMessage(chatId, messageId, '❌ Не все поля заполнены. Вернитесь и заполните форму полностью.', buildBackButton('order_create_from'));
        break;
      }
      const newOrder = {
        id: `order_${Date.now()}`,
        ...state,
        status: 'active',
        createdAt: new Date().toISOString()
      };
      await saveOrder(newOrder);
      await setWizard(userId, {});
      await editTelegramMessage(chatId, messageId, '✅ Заказ создан и разослан водителям.', buildBackButton('back_staff_menu'));
      await broadcastOrderToDrivers(newOrder);
      break;
    }

    case 'offer_price_': {
      const [, ordId, priceStr] = data.split('_');
      const price = parseInt(priceStr);
      if (isNaN(price) || price <= 0) {
        await editTelegramMessage(chatId, messageId, '❌ Укажите корректную цену.', buildBackButton('back_available_orders'));
        break;
      }
      await recordDriverOffer(ordId, userId, price);
      await editTelegramMessage(chatId, messageId, `✅ Ваша цена ${price} отправлена. Ожидайте подтверждения.`, buildBackButton('back_available_orders'));
      break;
    }

    case 'custom_price_': {
      const ordId = data.replace('custom_price_', '');
      await setUserState(userId, `waiting_for_custom_price_${ordId}`);
      await editTelegramMessage(chatId, messageId, '💰 Введите вашу цену в тенге:', buildBackButton('back_available_orders'));
      break;
    }

    case 'staff_offers_': {
      const [, orderId, pageStr] = data.split('_');
      await showOrderOffersPager(chatId, messageId, orderId, parseInt(pageStr || '1'));
    return;
  }
  
    case 'offers_prev_': {
      const [, orderId, pageStr] = data.split('_');
      await showOrderOffersPager(chatId, messageId, orderId, parseInt(pageStr || '1'));
      return;
    }

    case 'offers_next_': {
      const [, orderId, pageStr] = data.split('_');
      await showOrderOffersPager(chatId, messageId, orderId, parseInt(pageStr || '1'));
      return;
    }

    // Predefined selections for from/to
    default:
      if (data.startsWith('order_from_')) {
        const val = data.replace('order_from_', '');
        const wiz = await getWizard(userId);
        await setWizard(userId, { ...wiz, from: val });
        await showOrderCreationForm(chatId, messageId, 'to', userId);
        return;
      }
      if (data.startsWith('order_to_')) {
        const val = data.replace('order_to_', '');
        const wiz = await getWizard(userId);
        await setWizard(userId, { ...wiz, to: val });
        await showOrderCreationForm(chatId, messageId, 'cargo', userId);
        return;
      }
      if (data.startsWith('order_create_cargo_')) {
        const cargo = data.replace('order_create_cargo_', '');
        const wiz = await getWizard(userId);
        await setWizard(userId, { ...wiz, cargo });
        await setUserState(userId, null);
        await showOrderCreationForm(chatId, messageId, 'weight', userId);
        return;
      }
      if (data.startsWith('order_create_weight_')) {
        const weight = data.replace('order_create_weight_', '');
        const wiz = await getWizard(userId);
        await setWizard(userId, { ...wiz, weight });
        await setUserState(userId, null);
        await showOrderCreationForm(chatId, messageId, 'volume', userId);
        return;
      }
      if (data.startsWith('order_create_volume_')) {
        const volume = data.replace('order_create_volume_', '');
        const wiz = await getWizard(userId);
        await setWizard(userId, { ...wiz, volume });
        await setUserState(userId, null);
        await showOrderCreationForm(chatId, messageId, 'confirm', userId);
        return;
      }
      if (data.startsWith('choose_driver_')) {
        const [, orderId, driverUserId, priceStr] = data.split('_');
        await chooseDriverForOrder(orderId, parseInt(driverUserId), parseInt(priceStr));
        await editTelegramMessage(chatId, messageId, `✅ Водитель выбран. Tracking присвоен.`, buildBackButton('back_staff_menu'));
    return;
  }
  
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
    text += `   Груз: ${order.cargo}\n`;
    text += `   Статус: ${order.status}\n`;
    text += `   Создан: ${new Date(order.createdAt).toLocaleDateString()}\n\n`;
  });
  
  await editTelegramMessage(chatId, messageId, text, buildBackButton('back_driver_menu'));
}

// Show available orders for drivers
async function showAvailableOrders(chatId: string, messageId: number, userId: number) {
  const availableOrders = await getAvailableOrders();
  
  if (availableOrders.length === 0) {
    await editTelegramMessage(chatId, messageId, '📭 Сейчас нет доступных заказов.', buildBackButton('back_driver_menu'));
    return;
  }
  
  let text = '🚚 Доступные заказы:\n\n';
  const keyboard: any = {
    inline_keyboard: []
  };
  
  availableOrders.forEach((order: any, index: number) => {
    text += `${index + 1}. ${order.from} → ${order.to}\n`;
    text += `   Груз: ${order.cargo}\n`;
    text += `   Вес: ${order.weight}, Объем: ${order.volume}\n\n`;
    
    keyboard.inline_keyboard.push([
      { text: `📝 Взять заказ ${index + 1}`, callback_data: `take_order_${order.id}` }
    ]);
  });
  
  keyboard.inline_keyboard.push([{ text: '← Назад', callback_data: 'back_driver_menu' }]);
  
  await editTelegramMessage(chatId, messageId, text, keyboard);
}

// Show order details for driver to take
async function showOrderDetails(chatId: string, messageId: number, orderId: string) {
  const orders = await getOrders();
  const order = orders.find((o: any) => o.id === orderId);
  
  if (!order) {
    await editTelegramMessage(chatId, messageId, '❌ Заказ не найден.', buildBackButton('back_available_orders'));
    return;
  }
  
  const text = `📋 Детали заказа:\n\n` +
    `📍 Маршрут: ${order.from} → ${order.to}\n` +
    `📦 Груз: ${order.cargo}\n` +
    `⚖️ Вес: ${order.weight}\n` +
    `📏 Объем: ${order.volume}\n` +
    `📅 Создан: ${new Date(order.createdAt).toLocaleDateString()}\n\n` +
    `💬 Предложите вашу цену:`;
  
  const keyboard = {
        inline_keyboard: [
      [{ text: '💰 5000 тенге', callback_data: `offer_price_${orderId}_5000` }],
      [{ text: '💰 6000 тенге', callback_data: `offer_price_${orderId}_6000` }],
      [{ text: '💰 7000 тенге', callback_data: `offer_price_${orderId}_7000` }],
      [{ text: '💰 8000 тенге', callback_data: `offer_price_${orderId}_8000` }],
      [{ text: '💰 Другая цена', callback_data: `custom_price_${orderId}` }],
      [{ text: '← Назад', callback_data: 'back_available_orders' }]
    ]
  };
  
  await editTelegramMessage(chatId, messageId, text, keyboard);
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

// Show staff orders management
async function showStaffOrdersManagement(chatId: string, messageId: number) {
  const orders = await getOrders();
  const activeOrders = orders.filter((o: any) => o.status === 'active' || o.status === 'assigned');
  
  let text = '📋 <b>Управление заказами</b>\n\n';
  
  if (activeOrders.length === 0) {
    text += '📭 Активных заказов нет';
  } else {
    activeOrders.forEach((order: any, index: number) => {
      text += `${index + 1}. ${order.from} → ${order.to}\n`;
      text += `   Статус: ${order.status}\n`;
      text += `   Груз: ${order.cargo}\n`;
      if (order.driverId) {
        text += `   Водитель: ${order.driverId}\n`;
        text += `   Цена: ${order.price} тенге\n`;
      }
      text += `   Офферы: staff_offers_${order.id}_1\n`;
      text += '\n';
    });
  }
  
  const keyboard = {
        inline_keyboard: [
      ...activeOrders.slice(0, 10).map((o: any, i: number) => [{ text: `📑 Офферы по заказу ${i + 1}`, callback_data: `staff_offers_${o.id}_1` }]),
      [{ text: '📊 Обновить список', callback_data: 'staff_refresh_orders' }],
      [{ text: '← Назад', callback_data: 'back_staff_menu' }]
    ]
  };
  
  await editTelegramMessage(chatId, messageId, text, keyboard);
}

// Show staff drivers management
async function showStaffDriversManagement(chatId: string, messageId: number) {
  const drivers = await getDrivers();
  
  let text = '🚛 <b>Управление водителями</b>\n\n';
  
  if (drivers.length === 0) {
    text += '📭 Водителей в базе нет';
    } else {
          drivers.forEach((driver: any, index: number) => {
        text += `${index + 1}. ${driver.name}\n`;
        text += `   🚗 ${driver.carNumber}\n`;
        text += `   ⭐ Рейтинг: ${driver.rating ? driver.rating.toFixed(2) : 'Н/Д'}/5\n`;
        text += `   📱 ${driver.phone}\n`;
        if (driver.currentStatus) {
          text += `   📍 Статус: ${driver.currentStatus}\n`;
        }
        text += '\n';
      });
  }
  
  const keyboard = {
        inline_keyboard: [
      [{ text: '📊 Обновить статистику', callback_data: 'staff_refresh_drivers' }],
      [{ text: '← Назад', callback_data: 'back_staff_menu' }]
    ]
  };
  
  await editTelegramMessage(chatId, messageId, text, keyboard);
}

// Show driver profile
async function showDriverProfile(chatId: string, messageId: number, userId: number) {
  const drivers = await getDrivers();
  const driver = drivers.find((d: any) => d.userId === userId);
  
  if (!driver) {
    await editTelegramMessage(chatId, messageId, '❌ Профиль не найден', buildBackButton('back_driver_menu'));
    return;
  }
  
  const text = `👤 <b>Профиль водителя</b>\n\n` +
    `📝 <b>Имя:</b> ${driver.name}\n` +
    `🚗 <b>Автомобиль:</b> ${driver.carNumber}\n` +
    `📱 <b>Телефон:</b> ${driver.phone}\n` +
    `⭐ <b>Рейтинг:</b> ${driver.rating ? driver.rating.toFixed(2) : 'Н/Д'}/5\n` +
    `📅 <b>Дата регистрации:</b> ${driver.createdAt ? new Date(driver.createdAt).toLocaleDateString() : 'Н/Д'}\n` +
    `📍 <b>Текущий статус:</b> ${driver.currentStatus || 'Не указан'}`;
  
  const keyboard = {
    inline_keyboard: [
      [{ text: '✏️ Редактировать профиль', callback_data: 'driver_edit_profile' }],
      [{ text: '← Назад', callback_data: 'back_driver_menu' }]
    ]
  };
  
  await editTelegramMessage(chatId, messageId, text, keyboard);
}

// Show staff settings
async function showStaffSettings(chatId: string, messageId: number) {
  const text = '⚙️ Настройки сотрудников';
  const keyboard = {
    inline_keyboard: [
      [{ text: '🔐 Сменить пароль', callback_data: 'change_staff_password' }],
      [{ text: '← Назад', callback_data: 'back_staff_menu' }]
    ]
  };
  await editTelegramMessage(chatId, messageId, text, keyboard);
}

// Show order creation form
async function showOrderCreationForm(chatId: string, messageId: number, field: string, userId: number) {
  let text = '';
  let keyboard: any;

  if (field === 'from') {
    text = '📍 Откуда забрать груз?';
    keyboard = {
      inline_keyboard: [
        [{ text: 'Алматы', callback_data: 'order_from_Алматы' }],
        [{ text: 'Астана', callback_data: 'order_from_Астана' }],
        [{ text: 'Другой город', callback_data: 'order_from_custom' }],
        [{ text: '← Назад', callback_data: 'back_staff_menu' }]
      ]
    };
  } else if (field === 'to') {
    text = '✏️ Введите город назначения вручную:';
    keyboard = {
      inline_keyboard: [
        [{ text: 'Алматы', callback_data: 'order_to_Алматы' }],
        [{ text: 'Астана', callback_data: 'order_to_Астана' }],
        [{ text: 'Другой город', callback_data: 'order_to_custom' }],
        [{ text: '← Назад', callback_data: 'back_staff_menu' }]
      ]
    };
  } else if (field === 'cargo') {
    text = '📦 Введите тип груза:';
    keyboard = {
      inline_keyboard: [
        [{ text: 'Песок', callback_data: 'order_create_cargo_Песок' }],
        [{ text: 'Щебень', callback_data: 'order_create_cargo_Щебень' }],
        [{ text: 'Бетон', callback_data: 'order_create_cargo_Бетон' }],
        [{ text: 'Другой груз', callback_data: 'order_create_cargo_Другой' }],
        [{ text: '← Назад', callback_data: 'back_staff_menu' }]
      ]
    };
  } else if (field === 'weight') {
    text = '⚖️ Введите вес груза (в тоннах):';
    keyboard = {
      inline_keyboard: [
        [{ text: '1 тонна', callback_data: 'order_create_weight_1' }],
        [{ text: '5 тонн', callback_data: 'order_create_weight_5' }],
        [{ text: '10 тонн', callback_data: 'order_create_weight_10' }],
        [{ text: 'Другой вес', callback_data: 'order_create_weight_custom' }],
        [{ text: '← Назад', callback_data: 'back_staff_menu' }]
      ]
    };
  } else if (field === 'volume') {
    text = '📏 Введите объем груза (в м³):';
    keyboard = {
      inline_keyboard: [
        [{ text: '1 м³', callback_data: 'order_create_volume_1' }],
        [{ text: '5 м³', callback_data: 'order_create_volume_5' }],
        [{ text: '10 м³', callback_data: 'order_create_volume_10' }],
        [{ text: 'Другой объем', callback_data: 'order_create_volume_custom' }],
        [{ text: '← Назад', callback_data: 'back_staff_menu' }]
      ]
    };
  } else if (field === 'confirm') {
    text = '✅ Подтвердите создание заказа:';
    keyboard = {
      inline_keyboard: [
        [{ text: 'Да', callback_data: 'order_send' }],
        [{ text: 'Нет', callback_data: 'back_staff_menu' }]
      ]
    };
  }

  if (messageId) {
    await editTelegramMessage(chatId, messageId, text, keyboard);
  } else {
    await sendTelegramMessage(chatId, text, keyboard);
  }
}

// Broadcast order to all drivers
async function broadcastOrderToDrivers(order: any) {
  const drivers = await getDrivers();
  for (const driver of drivers) {
    if (driver.currentStatus === 'В пути' || driver.currentStatus === 'На заправке') {
      const message = `🚚 <b>Новый заказ!</b>\n\n` +
        `📋 <b>Заказ:</b> ${order.from} → ${order.to}\n` +
        `👤 <b>Клиент:</b> ${order.clientId}\n` +
        `📦 <b>Груз:</b> ${order.cargo}\n` +
        `⚖️ <b>Вес:</b> ${order.weight}\n` +
        `📏 <b>Объем:</b> ${order.volume}\n` +
        `💰 <b>Цена:</b> ${order.price} тенге\n\n` +
        `🔗 <a href="https://t.me/china_bot?start=track_${order.id}">Отследить заказ</a>`;
      await sendTelegramMessage(driver.phone, message, { parse_mode: 'HTML' });
    }
  }
}

// Send offer message with inline keyboard to staff group
async function sendDriverOfferToGroup(order: any, driver: any, price: number) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const text = `💰 <b>Новое предложение цены</b>\n\n` +
    `📋 <b>Заказ:</b> ${order.from} → ${order.to}\n` +
    `📦 <b>Груз:</b> ${order.cargo || '—'}\n` +
    `💵 <b>Цена:</b> ${price.toLocaleString()}\n\n` +
    `👤 <b>Водитель:</b> ${driver.name}\n🚗 ${driver.carNumber}\n📱 ${driver.phone}`;
  const keyboard = {
    inline_keyboard: [
      [{ text: `✅ Выбрать ${driver.name} — ${price.toLocaleString()}`, callback_data: `choose_driver_${order.id}_${driver.userId}_${price}` }]
    ]
  };
  try {
    await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ chat_id: CHANNEL_ID, text, parse_mode: 'HTML', reply_markup: keyboard }) });
  } catch (e) {
    console.error('sendDriverOfferToGroup error', e);
  }
}

async function createOffer(orderId: string, driverId: number, price: number) {
    await initDB();
  if (!orderOffersCollection) {
    const list = tempOffers[orderId] || [];
    list.push({ driverId, price, at: new Date().toISOString(), status: 'pending' });
    tempOffers[orderId] = list;
    return { acknowledged: true };
  }
  return await orderOffersCollection.insertOne({ orderId, driverId, price, status: 'pending', createdAt: new Date().toISOString() });
}

async function listOffers(orderId: string) {
  await initDB();
  if (!orderOffersCollection) {
    return tempOffers[orderId] || [];
  }
  return await orderOffersCollection.find({ orderId }).toArray();
}

async function acceptOffer(orderId: string, driverId: number) {
  await initDB();
  if (!orderOffersCollection) {
    const list = (tempOffers[orderId] || []).map(o => ({ ...o, status: o.driverId === driverId ? 'accepted' : 'rejected' }));
    tempOffers[orderId] = list;
    return { acknowledged: true };
  }
  await orderOffersCollection.updateMany({ orderId }, { $set: { status: 'rejected' } });
  return await orderOffersCollection.updateOne({ orderId, driverId }, { $set: { status: 'accepted' } });
}

// Accept driver for order
async function chooseDriverForOrder(orderId: string, driverUserId: number, price: number) {
  const orders = await getOrders();
  const order = orders.find((o: any) => o.id === orderId);
  if (!order) return false;
  order.driverId = driverUserId;
  order.price = price;
  order.status = 'assigned';
  order.assignedAt = new Date().toISOString();
  const short = (Math.abs(Number(String(order.id).replace(/\D/g, '').slice(-8))) || Date.now()).toString(36).toUpperCase();
  order.trackingCode = `${driverUserId}-${short}`;
  await saveOrder(order);
  await acceptOffer(orderId, driverUserId);
  await sendTelegramMessage(String(driverUserId), `✅ Вы наняты на заказ ${order.from} → ${order.to}.\nTracking: <code>${order.trackingCode}</code>`, undefined);
  return true;
}

async function recordDriverOffer(orderId: string, driverUserId: number, price: number) {
  const orders = await getOrders();
  const order = orders.find((o: any) => o.id === orderId);
  if (!order) return false;
  const drivers = await getDrivers();
  const driver = drivers.find((d: any) => d.userId === driverUserId);
  if (!driver) return false;
  await createOffer(orderId, driverUserId, price);
  await sendDriverOfferToGroup(order, driver, price);
  return true;
}

// Update status for all active orders of driver
async function updateOrdersStatusForDriver(driverUserId: number, status: string, note?: string) {
  const orders = await getOrders();
  const active = orders.filter((o: any) => o.driverId === driverUserId && o.status !== 'closed' && o.status !== 'cancelled');
  for (const o of active) {
    o.logs = o.logs || [];
    o.logs.push({ at: new Date().toISOString(), actor: 'driver', action: 'status', payload: { status, note } });
    // Move overall status if финальный
    if (status === 'Delivered') o.status = 'delivered';
    await saveOrder(o);
  }
}

// Helper to normalize and find driver by phone number
function normalizePhoneNumber(phone: string): string {
  const digits = (phone || '').replace(/\D/g, '');
  if (digits.startsWith('8') && digits.length === 11) return '7' + digits.slice(1);
  if (digits.startsWith('7') && digits.length === 11) return digits;
  if (digits.length === 10) return '7' + digits;
  return digits;
}

function findDriverByPhone(phone: string, drivers: any[]) {
  const normalized = normalizePhoneNumber(phone);
  return drivers.find(d => normalizePhoneNumber(d.phone) === normalized);
}

async function showOrderOffersPager(chatId: string, messageId: number, orderId: string, page: number = 1) {
  const perPage = 1;
  const offers = await listOffers(orderId);
  if (!offers || offers.length === 0) {
    await editTelegramMessage(chatId, messageId, '📭 Офферов пока нет', buildBackButton('back_staff_menu'));
    return;
  }
  const total = offers.length;
  const maxPage = Math.max(1, Math.ceil(total / perPage));
  const cur = Math.min(Math.max(1, page), maxPage);
  const idx = (cur - 1) * perPage;
  const offer = offers[idx];
  const drivers = await getDrivers();
  const driver = drivers.find((d: any) => d.userId === offer.driverId) || { name: 'Водитель', carNumber: '—', phone: '—' };

  const text = `📑 Оффер ${cur} из ${total}\n\n` +
    `👤 ${driver.name}\n🚗 ${driver.carNumber}\n📱 ${driver.phone}\n` +
    `💵 Цена: ${offer.price.toLocaleString()}\n` +
    `⏰ ${new Date(offer.at || offer.createdAt).toLocaleString('ru-RU')}\n` +
    `Статус: ${offer.status || 'pending'}`;

  const keyboard = { inline_keyboard: [] as any[] };
  const navRow: any[] = [];
  if (cur > 1) navRow.push({ text: '◀', callback_data: `offers_prev_${orderId}_${cur - 1}` });
  if (cur < maxPage) navRow.push({ text: '▶', callback_data: `offers_next_${orderId}_${cur + 1}` });
  if (navRow.length) keyboard.inline_keyboard.push(navRow);
  keyboard.inline_keyboard.push([{ text: `✅ Подтвердить найм за ${offer.price.toLocaleString()}`, callback_data: `choose_driver_${orderId}_${offer.driverId}_${offer.price}` }]);
  keyboard.inline_keyboard.push([{ text: '← Назад', callback_data: 'back_staff_menu' }]);

  await editTelegramMessage(chatId, messageId, text, keyboard);
}

async function setWizard(userId: number, data: any) {
  await initDB();
  if (!wizardStatesCollection) { tempOrders[userId] = data; return; }
  await wizardStatesCollection.updateOne({ userId }, { $set: { userId, data, updatedAt: new Date().toISOString() } }, { upsert: true });
}

async function getWizard(userId: number) {
  await initDB();
  if (!wizardStatesCollection) return tempOrders[userId] || {};
  const row = await wizardStatesCollection.findOne({ userId });
  return row?.data || {};
}