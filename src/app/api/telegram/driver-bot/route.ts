import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

// Простые сообщения для водителей
const MESSAGES = {
  welcome: `🚛 <b>Добро пожаловать в Velta Trans!</b>

Я помогу вам найти заказы и управлять доставкой.

<b>Как это работает:</b>
1️⃣ Введите ваш номер телефона
2️⃣ Просматривайте доступные заказы
3️⃣ Обновляйте статус доставки

<b>Начнем?</b> Введите ваш номер телефона:`,

  phoneNotFound: `❌ <b>Номер не найден в базе</b>

<b>Возможные причины:</b>
• Вы новый водитель (нужна регистрация)
• Неправильный формат номера
• Номер не зарегистрирован

<b>Попробуйте:</b>
• +7 705 406 06 74
• 8 705 406 06 74
• 87054060674
• 77054060674

Или нажмите "📝 Регистрация"`,

  driverFound: (driver: any) => `✅ <b>Вход выполнен успешно!</b>

👤 <b>${driver.name}</b>
📱 <b>${driver.phone}</b>
🚛 <b>${driver.carNumber}</b> (${driver.carType})
⭐ <b>Рейтинг: ${driver.rating}</b>
📍 <b>${driver.location}</b>

<b>Что хотите сделать?</b>`,

  mainMenu: `🚛 <b>Главное меню водителя</b>

Выберите действие:`,

  noActiveOrders: `📋 <b>Активные заказы</b>

У вас нет активных заказов в данный момент.

<b>Хотите посмотреть доступные заказы?</b>`,

  noAvailableOrders: `🚛 <b>Доступные заказы</b>

В данный момент нет доступных заказов.

<b>Попробуйте позже или свяжитесь с диспетчером.</b>`
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, callback_query } = body;
    
    if (callback_query) {
      return await handleCallback(callback_query);
    }
    
    if (message) {
      return await handleMessage(message);
    }
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Ошибка в driver-bot:', error);
    return NextResponse.json({ error: 'Внутренняя ошибка' }, { status: 500 });
  }
}

// Обработка callback'ов (кнопки)
async function handleCallback(callback: any) {
  const { data, from, message } = callback;
  const chatId = message?.chat?.id;
  const userId = from?.id;
  
  if (!chatId || !userId) {
    return NextResponse.json({ error: 'Неверные данные' }, { status: 400 });
  }
  
  const db = await getDb();
  
  switch (data) {
    case 'start':
      return await sendMainMenu(chatId);
      
    case 'driver_login':
      return await sendPhoneRequest(chatId);
      
    case 'view_orders':
      return await showDriverOrders(chatId, userId, db);
      
    case 'available_orders':
      return await showAvailableOrders(chatId, db);
      
    case 'update_status':
      return await sendStatusUpdateRequest(chatId);
      
    case 'driver_profile':
      return await showDriverProfile(chatId, userId, db);
      
    case 'back_main':
      return await sendMainMenu(chatId);
      
    default:
      return await sendMainMenu(chatId);
  }
}

// Обработка текстовых сообщений
async function handleMessage(message: any) {
  const { text, from, chat } = message;
  const chatId = chat?.id;
  const userId = from?.id;
  
  if (!chatId || !userId) {
    return NextResponse.json({ error: 'Неверные данные' }, { status: 400 });
  }
  
  const db = await getDb();
  
  // Проверяем, авторизован ли водитель
  const userState = await db.collection('user_states').findOne({ userId });
  
  if (!userState?.driverAuthed) {
    // Водитель не авторизован - просим номер телефона
    return await handlePhoneInput(chatId, userId, text, db);
  }
  
  // Водитель авторизован - обрабатываем команды
  return await handleDriverCommand(chatId, userId, text, db);
}

// Обработка ввода номера телефона
async function handlePhoneInput(chatId: number, userId: number, phone: string, db: any) {
  try {
    // Нормализуем номер
    const normalizedPhone = normalizePhone(phone);
    
    // Ищем водителя
    const driver = await db.collection('drivers').findOne({
      $or: [
        { phone: normalizedPhone },
        { phoneVariants: normalizedPhone }
      ]
    });
    
    if (!driver) {
      return await sendTelegramMessage(chatId, MESSAGES.phoneNotFound, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '📝 Регистрация', callback_data: 'register_driver' }],
            [{ text: '🔄 Попробовать снова', callback_data: 'driver_login' }]
          ]
        }
      });
    }
    
    // Сохраняем состояние пользователя
    await db.collection('user_states').updateOne(
      { userId },
      {
        $set: {
          driverAuthed: true,
          driverData: {
            id: driver.id,
            name: driver.name,
            phone: driver.phone,
            carNumber: driver.carNumber,
            carType: driver.carType
          },
          updatedAt: new Date()
        }
      },
      { upsert: true }
    );
    
    // Отправляем приветствие
    return await sendTelegramMessage(chatId, MESSAGES.driverFound(driver), {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📋 Мои заказы', callback_data: 'view_orders' }],
          [{ text: '🚛 Доступные заказы', callback_data: 'available_orders' }],
          [{ text: '📍 Обновить статус', callback_data: 'update_status' }],
          [{ text: '👤 Мой профиль', callback_data: 'driver_profile' }]
        ]
      }
    });
    
  } catch (error) {
    console.error('Ошибка при поиске водителя:', error);
    return await sendTelegramMessage(chatId, '❌ Ошибка при поиске. Попробуйте позже.');
  }
}

// Показ заказов водителя
async function showDriverOrders(chatId: number, userId: number, db: any) {
  try {
    const userState = await db.collection('user_states').findOne({ userId });
    if (!userState?.driverData?.id) {
      return await sendTelegramMessage(chatId, '❌ Ошибка: данные водителя не найдены.');
    }
    
    const driverId = userState.driverData.id;
    
    // Ищем активные заказы водителя
    const activeOrders = await db.collection('orders').find({
      driverId,
      status: { $in: ['assigned', 'in_transit', 'warehouse', 'delayed'] }
    }).toArray();
    
    if (activeOrders.length === 0) {
      return await sendTelegramMessage(chatId, MESSAGES.noActiveOrders, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🚛 Доступные заказы', callback_data: 'available_orders' }],
            [{ text: '⬅️ Назад', callback_data: 'back_main' }]
          ]
        }
      });
    }
    
    let message = `📋 <b>Ваши активные заказы</b>\n\nУ вас ${activeOrders.length} заказов в работе:\n\n`;
    
    activeOrders.forEach((order, index) => {
      message += `${index + 1}. <b>${order.trackingNumber}</b>\n`;
      message += `   📍 ${order.route.from} → ${order.route.to}\n`;
      message += `   📦 ${order.description}\n`;
      message += `   💰 ${order.price} ${order.currency}\n`;
      message += `   📅 Срок: ${new Date(order.deadline).toLocaleDateString('ru-RU')}\n\n`;
    });
    
    return await sendTelegramMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '📍 Обновить статус', callback_data: 'update_status' }],
          [{ text: '⬅️ Назад', callback_data: 'back_main' }]
        ]
      }
    });
    
  } catch (error) {
    console.error('Ошибка при показе заказов:', error);
    return await sendTelegramMessage(chatId, '❌ Ошибка при загрузке заказов.');
  }
}

// Показ доступных заказов
async function showAvailableOrders(chatId: number, db: any) {
  try {
    const availableOrders = await db.collection('orders').find({
      status: 'new',
      driverId: null
    }).limit(10).toArray();
    
    if (availableOrders.length === 0) {
      return await sendTelegramMessage(chatId, MESSAGES.noAvailableOrders, {
        reply_markup: {
          inline_keyboard: [
            [{ text: '🔄 Обновить', callback_data: 'available_orders' }],
            [{ text: '⬅️ Назад', callback_data: 'back_main' }]
          ]
        }
      });
    }
    
    let message = `🚛 <b>Доступные заказы</b>\n\nДоступно ${availableOrders.length} заказов:\n\n`;
    
    availableOrders.forEach((order, index) => {
      message += `${index + 1}. <b>${order.trackingNumber}</b>\n`;
      message += `   📍 ${order.route.from} → ${order.route.to}\n`;
      message += `   📦 ${order.description}\n`;
      message += `   ⚖️ ${order.weight} кг, ${order.volume} м³\n`;
      message += `   💰 ${order.price} ${order.currency}\n`;
      message += `   📅 Срок: ${new Date(order.deadline).toLocaleDateString('ru-RU')}\n\n`;
    });
    
    return await sendTelegramMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '🔄 Обновить', callback_data: 'available_orders' }],
          [{ text: '⬅️ Назад', callback_data: 'back_main' }]
          ]
        }
      }
    });
    
  } catch (error) {
    console.error('Ошибка при показе доступных заказов:', error);
    return await sendTelegramMessage(chatId, '❌ Ошибка при загрузке заказов.');
  }
}

// Отправка главного меню
async function sendMainMenu(chatId: number) {
  const keyboard = {
    inline_keyboard: [
      [{ text: '🚛 Войти как водитель', callback_data: 'driver_login' }],
      [{ text: '📋 Мои заказы', callback_data: 'view_orders' }],
      [{ text: '🚛 Доступные заказы', callback_data: 'available_orders' }],
      [{ text: '📍 Обновить статус', callback_data: 'update_status' }],
      [{ text: '👤 Мой профиль', callback_data: 'driver_profile' }]
    ]
  };
  
  return await sendTelegramMessage(chatId, MESSAGES.mainMenu, { reply_markup: keyboard });
}

// Отправка запроса номера телефона
async function sendPhoneRequest(chatId: number) {
  return await sendTelegramMessage(chatId, MESSAGES.welcome);
}

// Вспомогательные функции
function normalizePhone(phone: string): string {
  let digits = phone.replace(/[^\d]/g, '');
  
  if (digits.startsWith('8')) {
    digits = '7' + digits.slice(1);
  }
  
  return `+${digits}`;
}

async function sendTelegramMessage(chatId: number, text: string, options: any = {}) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text: text,
      parse_mode: 'HTML',
      ...options
    })
  });
  
  return NextResponse.json({ success: true });
}

// Остальные функции-заглушки
async function sendStatusUpdateRequest(chatId: number) {
  return await sendTelegramMessage(chatId, '📍 <b>Обновление статуса</b>\n\nВведите номер заказа:');
}

async function showDriverProfile(chatId: number, userId: number, db: any) {
  try {
    const userState = await db.collection('user_states').findOne({ userId });
    if (!userState?.driverData) {
      return await sendTelegramMessage(chatId, '❌ Ошибка: профиль не найден.');
    }
    
    const driver = userState.driverData;
    const message = `👤 <b>Ваш профиль</b>\n\n👤 <b>Имя:</b> ${driver.name}\n📱 <b>Телефон:</b> ${driver.phone}\n🚛 <b>Автомобиль:</b> ${driver.carNumber}\n🔧 <b>Тип:</b> ${driver.carType}`;
    
    return await sendTelegramMessage(chatId, message, {
      reply_markup: {
        inline_keyboard: [
          [{ text: '⬅️ Назад', callback_data: 'back_main' }]
        ]
      }
    });
    
  } catch (error) {
    console.error('Ошибка при показе профиля:', error);
    return await sendTelegramMessage(chatId, '❌ Ошибка при загрузке профиля.');
  }
}
