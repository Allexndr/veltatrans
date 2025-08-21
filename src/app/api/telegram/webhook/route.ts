import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8414818778:AAG2QXqDu0WKwsClyMt5CpbpLQBL3QLVWUE';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002999769930';
const ADMIN_ID = '5450018125'; // ID админа

// Пути к файлам данных (в serverless среде пишем в /tmp)
const dataDir = process.env.DATA_DIR || path.join('/tmp', 'velta-data');
const driversFile = path.join(dataDir, 'drivers.json');
const ordersFile = path.join(dataDir, 'orders.json');
const userStatesFile = path.join(dataDir, 'user_states.json');

// Убеждаемся что папка data существует
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Инициализируем файлы если их нет
if (!fs.existsSync(driversFile)) {
  fs.writeFileSync(driversFile, '{}');
}
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, '{}');
}
if (!fs.existsSync(userStatesFile)) {
  fs.writeFileSync(userStatesFile, '{}');
}

interface Driver {
  id: number;
  name: string;
  phone: string;
  carNumber: string;
  carType: string;
  registeredAt: string;
  status: 'active' | 'inactive';
}

interface Order {
  id: string;
  from: string;
  to: string;
  carType: string;
  description: string;
  createdAt: string;
  status: 'active' | 'assigned' | 'completed';
  bids: Bid[];
  assignedDriver?: number;
  finalPrice?: number;
  trackingNumber?: string;
}

interface Bid {
  driverId: number;
  driverName: string;
  driverPhone: string;
  carNumber: string;
  price: number;
  timestamp: string;
}

interface UserState {
  step?: string;
  orderStep?: string;
  biddingOrderId?: string;
  name?: string;
  phone?: string;
  carNumber?: string;
  carType?: string;
  from?: string;
  to?: string;
  description?: string;
}

// Функции для работы с данными
function loadDrivers(): Record<string, Driver> {
  try {
    return JSON.parse(fs.readFileSync(driversFile, 'utf8'));
  } catch (e) {
    return {};
  }
}

function saveDrivers(drivers: Record<string, Driver>) {
  fs.writeFileSync(driversFile, JSON.stringify(drivers, null, 2));
}

function loadOrders(): Record<string, Order> {
  try {
    return JSON.parse(fs.readFileSync(ordersFile, 'utf8'));
  } catch (e) {
    return {};
  }
}

function saveOrders(orders: Record<string, Order>) {
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
}

function loadUserStates(): Record<string, UserState> {
  try {
    return JSON.parse(fs.readFileSync(userStatesFile, 'utf8'));
  } catch (e) {
    return {};
  }
}

function saveUserStates(states: Record<string, UserState>) {
  fs.writeFileSync(userStatesFile, JSON.stringify(states, null, 2));
}

// Генерация уникального номера заказа
function generateOrderNumber(driverId: number): string {
  const orderNumber = Math.floor(Math.random() * 100000);
  return `${driverId}-${orderNumber}`;
}

async function sendTelegramMessage(chatId: string | number, text: string, replyMarkup?: object) {
  try {
    const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: text,
        parse_mode: 'HTML',
        reply_markup: replyMarkup,
      }),
    });

    return await response.json();
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return { ok: false, error: error };
  }
}

// Подтверждение нажатия на inline-кнопку (снимает спиннер в Telegram)
async function answerCallbackQuery(callbackQueryId: string, text?: string, showAlert: boolean = false) {
  try {
    await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        callback_query_id: callbackQueryId,
        text,
        show_alert: showAlert
      })
    });
  } catch (error) {
    console.error('Error answering callback query:', error);
  }
}

// Рассылка заказа водителям
async function broadcastOrderToDrivers(orderId: string, order: Order) {
  const drivers = loadDrivers();
  let sentCount = 0;
  
  for (const driver of Object.values(drivers)) {
    // Фильтруем по типу ТС
    if (driver.carType.toLowerCase().includes(order.carType.toLowerCase()) || 
        order.carType.toLowerCase().includes(driver.carType.toLowerCase())) {
      
      const orderText = `🚛 <b>Новый заказ!</b>

<b>Маршрут:</b> ${order.from} → ${order.to}
<b>Тип ТС:</b> ${order.carType}
<b>Описание:</b> ${order.description}

Хотите взять этот заказ?`;

      const keyboard = {
        inline_keyboard: [
          [{ text: '💰 Предложить цену', callback_data: `bid_${orderId}` }],
          [{ text: '❌ Пропустить', callback_data: 'skip' }]
        ]
      };

      await sendTelegramMessage(driver.id, orderText, keyboard);
      sentCount++;
    }
  }
  
  // Уведомляем в канал о рассылке
  await sendTelegramMessage(CHANNEL_ID, `📢 <b>Заказ ${orderId} разослан!</b>

<b>Маршрут:</b> ${order.from} → ${order.to}
<b>Тип ТС:</b> ${order.carType}
<b>Разослано водителям:</b> ${sentCount}

Ожидаем предложения цен...`);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id;
      const text = message.text || '';
      const userId = message.from.id;
      const userName = message.from.first_name || 'Пользователь';

      const drivers = loadDrivers();
      const userStates = loadUserStates();
      const userState = userStates[userId] || {};

      // Команда /start
      if (text === '/start') {
        if (drivers[userId]) {
          const driver = drivers[userId];
          const welcomeText = `🚛 <b>Добро пожаловать, ${driver.name}!</b>

<b>Ваши данные:</b>
📱 Телефон: ${driver.phone}
🚛 Автомобиль: ${driver.carNumber}
🔧 Тип ТС: ${driver.carType}

Ожидайте заказы. Когда появится подходящий заказ, вам придет уведомление.`;

          await sendTelegramMessage(chatId, welcomeText);
        } else {
          const welcomeText = `🚛 <b>Добро пожаловать в Velta Trans!</b>

Для работы с системой необходимо зарегистрироваться как водитель.

Нажмите кнопку ниже для регистрации:`;

          const keyboard = {
            inline_keyboard: [
              [{ text: '📝 Регистрация водителя', callback_data: 'register_driver' }],
              [{ text: 'ℹ️ Информация', callback_data: 'info' }]
            ]
          };

          await sendTelegramMessage(chatId, welcomeText, keyboard);
        }
      }
      
      // Быстрый старт регистрации (альтернатива кнопке)
      else if (text === '/register' || text.toLowerCase() === 'регистрация' || text.toLowerCase() === 'регистрация водителя') {
        const drivers = loadDrivers();
        if (drivers[userId]) {
          await sendTelegramMessage(chatId, 'Вы уже зарегистрированы как водитель. Используйте /orders или /status.');
        } else {
          await startDriverRegistration(userId, chatId);
        }
      }

      // Калькулятор (сайт)
      else if (text === '/calculate') {
        const calculateText = `💰 <b>Калькулятор стоимости перевозки</b>

Для расчета заполните форму на сайте:
🌐 <a href="https://velta-logistics.com">velta-logistics.com</a>

Или свяжитесь с менеджером:
📞 +7 700 277 00 06
📧 info@velta-logistics.com`;
        await sendTelegramMessage(chatId, calculateText);
      }
      
      // Отслеживание
      else if (text === '/track') {
        const trackText = `📦 <b>Отслеживание груза</b>

Отправьте номер для отслеживания в формате:
<code>WT123456-1700000000000</code>

Также вы можете воспользоваться формой на сайте:
🌐 <a href="https://velta-logistics.com">velta-logistics.com</a>`;
        await sendTelegramMessage(chatId, trackText);
      }
      
      // Контакты
      else if (text === '/contact') {
        const contactText = `📞 <b>Связаться с менеджером</b>

Телефон: +7 700 277 00 06
Email: info@velta-logistics.com
Сайт: <a href="https://velta-logistics.com">velta-logistics.com</a>`;
        await sendTelegramMessage(chatId, contactText);
      }
      
      // Админ панель
      else if (text === '/admin' && userId.toString() === ADMIN_ID) {
        const adminText = `👨‍💼 <b>Админ панель</b>

Выберите действие:`;

        const keyboard = {
          inline_keyboard: [
            [{ text: '📦 Создать заказ', callback_data: 'create_order' }],
            [{ text: '👥 Список водителей', callback_data: 'list_drivers' }],
            [{ text: '📋 Активные заказы', callback_data: 'list_orders' }]
          ]
        };

        await sendTelegramMessage(chatId, adminText, keyboard);
      }
      
      // Обработка состояний регистрации
      else if (userState.step) {
        await handleRegistrationStep(userId, chatId, text, userState, userStates);
      }
      
      // Обработка создания заказа
      else if (userState.orderStep) {
        await handleOrderCreationStep(userId, chatId, text, userState, userStates);
      }
      
      // Обработка предложения цены
      else if (userState.biddingOrderId) {
        await handleBidStep(userId, chatId, text, userState, userStates);
      }
    }
    
    // Обработка callback query
    else if (body.callback_query) {
      const callbackQuery = body.callback_query;
      const chatId = callbackQuery.message.chat.id;
      const data = callbackQuery.data;
      const userId = callbackQuery.from.id;
      const callbackQueryId = callbackQuery.id;

      if (data === 'register_driver') {
        await answerCallbackQuery(callbackQueryId);
        await startDriverRegistration(userId, chatId);
      } else if (data === 'info') {
        await answerCallbackQuery(callbackQueryId);
        const infoText = `ℹ️ <b>Информация о системе</b>

<b>Velta Trans</b> - логистическая компания, специализирующаяся на международных перевозках.

<b>Как это работает:</b>
1. Вы регистрируетесь как водитель
2. Получаете уведомления о новых заказах
3. Предлагаете свою цену
4. При выборе получаете контакты для связи

<b>Контакты:</b>
📞 +7 700 277 00 06
📧 info@velta-logistics.com
🌐 https://velta-logistics.com`;

        await sendTelegramMessage(chatId, infoText);
      } else if (data === 'create_order' && userId.toString() === ADMIN_ID) {
        await answerCallbackQuery(callbackQueryId);
        await startOrderCreation(userId, chatId);
      } else if (data === 'list_drivers' && userId.toString() === ADMIN_ID) {
        await answerCallbackQuery(callbackQueryId);
        await listDrivers(chatId);
      } else if (data === 'list_orders' && userId.toString() === ADMIN_ID) {
        await answerCallbackQuery(callbackQueryId);
        await listActiveOrders(chatId);
      } else if (data.startsWith('bid_')) {
        await answerCallbackQuery(callbackQueryId);
        const orderId = data.split('_')[1];
        await startBidding(userId, chatId, orderId);
      } else if (data.startsWith('select_driver_')) {
        await answerCallbackQuery(callbackQueryId, 'Водитель выбран');
        const parts = data.split('_');
        const orderId = parts[2];
        const driverId = parts[3];
        await selectDriver(chatId, orderId, parseInt(driverId));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Регистрация водителя
async function startDriverRegistration(userId: number, chatId: number) {
  const userStates = loadUserStates();
  userStates[userId] = { step: 'name' };
  saveUserStates(userStates);
  
  await sendTelegramMessage(chatId, `📝 <b>Регистрация водителя</b>

Введите ваше полное имя:`);
}

async function handleRegistrationStep(userId: number, chatId: number, text: string, userState: UserState, userStates: Record<string, UserState>) {
  const drivers = loadDrivers();
  
  if (userState.step === 'name') {
    userState.name = text;
    userState.step = 'phone';
    userStates[userId] = userState;
    saveUserStates(userStates);
    await sendTelegramMessage(chatId, 'Введите ваш номер телефона (например: +7 700 123 45 67):');
  } else if (userState.step === 'phone') {
    userState.phone = text;
    userState.step = 'carNumber';
    userStates[userId] = userState;
    saveUserStates(userStates);
    await sendTelegramMessage(chatId, 'Введите номер вашего автомобиля (например: А123БВ01):');
  } else if (userState.step === 'carNumber') {
    userState.carNumber = text;
    userState.step = 'carType';
    userStates[userId] = userState;
    saveUserStates(userStates);
    await sendTelegramMessage(chatId, 'Введите тип вашего автомобиля (например: Фура 20т, Газель, Тент 10т):');
  } else if (userState.step === 'carType') {
    userState.carType = text;
    
    // Сохраняем водителя
    drivers[userId] = {
      id: userId,
      name: userState.name!,
      phone: userState.phone!,
      carNumber: userState.carNumber!,
      carType: userState.carType!,
      registeredAt: new Date().toISOString(),
      status: 'active'
    };
    
    saveDrivers(drivers);
    delete userStates[userId];
    saveUserStates(userStates);
    
    const successText = `✅ <b>Регистрация завершена!</b>

<b>Ваши данные:</b>
👤 Имя: ${userState.name}
📱 Телефон: ${userState.phone}
🚛 Автомобиль: ${userState.carNumber}
🔧 Тип ТС: ${userState.carType}

Теперь вы будете получать уведомления о новых заказах!`;

    await sendTelegramMessage(chatId, successText);
    
    // Уведомляем админа о новом водителе
    await sendTelegramMessage(CHANNEL_ID, `🚛 <b>Новый водитель зарегистрирован!</b>

👤 <b>Имя:</b> ${userState.name}
📱 <b>Телефон:</b> ${userState.phone}
🚛 <b>Автомобиль:</b> ${userState.carNumber}
🔧 <b>Тип ТС:</b> ${userState.carType}
🆔 <b>Telegram ID:</b> ${userId}`);
  }
}

// Создание заказа
async function startOrderCreation(userId: number, chatId: number) {
  const userStates = loadUserStates();
  userStates[userId] = { orderStep: 'from' };
  saveUserStates(userStates);
  
  await sendTelegramMessage(chatId, `📦 <b>Создание нового заказа</b>

Введите город отправления:`);
}

async function handleOrderCreationStep(userId: number, chatId: number, text: string, userState: UserState, userStates: Record<string, UserState>) {
  if (userState.orderStep === 'from') {
    userState.from = text;
    userState.orderStep = 'to';
    userStates[userId] = userState;
    saveUserStates(userStates);
    await sendTelegramMessage(chatId, 'Введите город назначения:');
  } else if (userState.orderStep === 'to') {
    userState.to = text;
    userState.orderStep = 'carType';
    userStates[userId] = userState;
    saveUserStates(userStates);
    await sendTelegramMessage(chatId, 'Введите требуемый тип ТС (например: Фура 20т, Тент, Газель):');
  } else if (userState.orderStep === 'carType') {
    userState.carType = text;
    userState.orderStep = 'description';
    userStates[userId] = userState;
    saveUserStates(userStates);
    await sendTelegramMessage(chatId, 'Введите описание груза:');
  } else if (userState.orderStep === 'description') {
    userState.description = text;
    
    // Создаем заказ
    const orderId = Date.now().toString();
    const orders = loadOrders();
    
    orders[orderId] = {
      id: orderId,
      from: userState.from!,
      to: userState.to!,
      carType: userState.carType!,
      description: userState.description!,
      createdAt: new Date().toISOString(),
      status: 'active',
      bids: []
    };
    
    saveOrders(orders);
    delete userStates[userId];
    saveUserStates(userStates);
    
    // Отправляем заказ всем подходящим водителям
    await broadcastOrderToDrivers(orderId, orders[orderId]);
    
    await sendTelegramMessage(chatId, `✅ <b>Заказ создан!</b>

<b>ID заказа:</b> ${orderId}
<b>Маршрут:</b> ${userState.from} → ${userState.to}
<b>Тип ТС:</b> ${userState.carType}
<b>Описание:</b> ${userState.description}

Заказ отправлен водителям. Ожидайте предложения цен в канале.`);
  }
}

// Начало торгов
async function startBidding(userId: number, chatId: number, orderId: string) {
  const orders = loadOrders();
  const drivers = loadDrivers();
  
  if (!orders[orderId]) {
    await sendTelegramMessage(chatId, '❌ Заказ не найден.');
    return;
  }
  
  if (!drivers[userId]) {
    await sendTelegramMessage(chatId, '❌ Вы не зарегистрированы как водитель.');
    return;
  }
  
  const userStates = loadUserStates();
  userStates[userId] = { biddingOrderId: orderId };
  saveUserStates(userStates);
  
  const order = orders[orderId];
  await sendTelegramMessage(chatId, `💰 <b>Предложение цены</b>

<b>Заказ:</b> ${order.from} → ${order.to}

Введите вашу цену в тенге (например: 150000):`);
}

// Обработка ставки
async function handleBidStep(userId: number, chatId: number, text: string, userState: UserState, userStates: Record<string, UserState>) {
  const price = parseInt(text);
  
  if (isNaN(price) || price <= 0) {
    await sendTelegramMessage(chatId, '❌ Введите корректную цену числом.');
    return;
  }
  
  const orderId = userState.biddingOrderId!;
  const orders = loadOrders();
  const drivers = loadDrivers();
  const driver = drivers[userId];
  
  if (!orders[orderId] || !driver) {
    await sendTelegramMessage(chatId, '❌ Ошибка при обработке ставки.');
    delete userStates[userId];
    saveUserStates(userStates);
    return;
  }
  
  // Добавляем ставку к заказу
  orders[orderId].bids.push({
    driverId: userId,
    driverName: driver.name,
    driverPhone: driver.phone,
    carNumber: driver.carNumber,
    price: price,
    timestamp: new Date().toISOString()
  });
  
  saveOrders(orders);
  delete userStates[userId];
  saveUserStates(userStates);
  
  await sendTelegramMessage(chatId, `✅ <b>Ваше предложение отправлено!</b>

<b>Цена:</b> ${price.toLocaleString()} тенге

Ожидайте решения администратора.`);
  
  // Отправляем предложение в канал
  const order = orders[orderId];
  const bidText = `💰 <b>Новое предложение цены!</b>

<b>Заказ:</b> ${order.from} → ${order.to}
<b>Водитель:</b> ${driver.name}
<b>Телефон:</b> ${driver.phone}
<b>Автомобиль:</b> ${driver.carNumber}
<b>Цена:</b> ${price.toLocaleString()} тенге`;

  const keyboard = {
    inline_keyboard: [
      [{ text: `✅ Выбрать ${driver.name}`, callback_data: `select_driver_${orderId}_${userId}` }]
    ]
  };

  await sendTelegramMessage(CHANNEL_ID, bidText, keyboard);
}

// Выбор водителя
async function selectDriver(chatId: number, orderId: string, driverId: number) {
  const orders = loadOrders();
  const drivers = loadDrivers();
  
  const order = orders[orderId];
  const driver = drivers[driverId];
  
  if (!order || !driver) {
    await sendTelegramMessage(chatId, '❌ Заказ или водитель не найден.');
    return;
  }
  
  // Находим ставку водителя
  const bid = order.bids.find(b => b.driverId === driverId);
  if (!bid) {
    await sendTelegramMessage(chatId, '❌ Ставка не найдена.');
    return;
  }
  
  // Генерируем уникальный номер заказа (WTID-ORDERID)
  const trackingNumber = `WT${driverId}-${orderId}`;
  
  // Обновляем заказ
  orders[orderId].status = 'assigned';
  orders[orderId].assignedDriver = driverId;
  orders[orderId].finalPrice = bid.price;
  orders[orderId].trackingNumber = trackingNumber;
  
  saveOrders(orders);
  
  // Уведомляем выбранного водителя
  await sendTelegramMessage(driverId, `🎉 <b>Вас выбрали!</b>

<b>Заказ:</b> ${order.from} → ${order.to}
<b>Цена:</b> ${bid.price.toLocaleString()} тенге
<b>Номер заказа:</b> <code>${trackingNumber}</code>

С вами свяжется менеджер для оформления документов.`);
  
  // Уведомляем остальных водителей
  for (const otherBid of order.bids) {
    if (otherBid.driverId !== driverId) {
      await sendTelegramMessage(otherBid.driverId, `😔 <b>Заказ закрыт</b>

Заказ ${order.from} → ${order.to} взял другой водитель.
Ждите новые заказы!`);
    }
  }
  
  // Уведомляем в канал
  await sendTelegramMessage(CHANNEL_ID, `✅ <b>Заказ ${orderId} закрыт!</b>

<b>Выбран водитель:</b> ${driver.name}
<b>Телефон:</b> ${driver.phone}
<b>Автомобиль:</b> ${driver.carNumber}
<b>Цена:</b> ${bid.price.toLocaleString()} тенге
<b>Номер для отслеживания:</b> <code>${trackingNumber}</code>

Свяжитесь с водителем для оформления.`);
}

// Список водителей
async function listDrivers(chatId: number) {
  const drivers = loadDrivers();
  const driversList = Object.values(drivers);
  
  if (driversList.length === 0) {
    await sendTelegramMessage(chatId, '📋 Водители не зарегистрированы.');
    return;
  }
  
  let text = `👥 <b>Зарегистрированные водители (${driversList.length}):</b>\n\n`;
  
  driversList.forEach((driver, index) => {
    text += `${index + 1}. <b>${driver.name}</b>
📱 ${driver.phone}
🚛 ${driver.carNumber} (${driver.carType})
🆔 ${driver.id}

`;
  });
  
  await sendTelegramMessage(chatId, text);
}

// Список активных заказов
async function listActiveOrders(chatId: number) {
  const orders = loadOrders();
  const activeOrders = Object.values(orders).filter(order => order.status === 'active');
  
  if (activeOrders.length === 0) {
    await sendTelegramMessage(chatId, '📋 Активных заказов нет.');
    return;
  }
  
  let text = `📦 <b>Активные заказы (${activeOrders.length}):</b>\n\n`;
  
  activeOrders.forEach((order, index) => {
    text += `${index + 1}. <b>${order.from} → ${order.to}</b>
🔧 ${order.carType}
📝 ${order.description}
💰 Ставок: ${order.bids.length}
🆔 ${order.id}

`;
  });
  
  await sendTelegramMessage(chatId, text);
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Telegram bot webhook is running',
    timestamp: new Date().toISOString()
  });
}