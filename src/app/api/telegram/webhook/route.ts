import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8414818778:AAG2QXqDu0WKwsClyMt5CpbpLQBL3QLVWUE';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002999769930';
const ADMIN_ID = '5450018125'; // ID админа

// Пути к файлам данных (в serverless среде пишем в /tmp)
const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data', 'velta-data');
const driversFile = path.join(dataDir, 'drivers.json');
const ordersFile = path.join(dataDir, 'orders.json');
const userStatesFile = path.join(dataDir, 'user_states.json');
const staffUsersFile = path.join(dataDir, 'staff_users.json');

// Убеждаемся что папка data существует
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Инициализируем файлы если их нет
if (!fs.existsSync(driversFile)) {
  // Копируем и конвертируем данные из materials/Контакты водителей.json если он существует
  const sourceDriversPath = path.resolve(process.cwd(), 'materials', 'Контакты водителей.json');
  if (fs.existsSync(sourceDriversPath)) {
    try {
      const sourceData = fs.readFileSync(sourceDriversPath, 'utf8');
      const originalDrivers = JSON.parse(sourceData);
      
      // Конвертируем в нужный формат
              const convertedDrivers = originalDrivers.map((driver: Record<string, unknown>, index: number) => ({
        id: index + 1,
        name: driver['Водитель'] || driver['Водитель'] || 'Неизвестно',
        phone: driver['Телефон Водителя'] || driver['Телефон Водителя'] || '',
        carNumber: driver['Автотранспорт'] || driver['Автотранспорт'] || '',
        carType: driver['Вид подвижного состава'] || driver['Вид подвижного состава'] || '',
        registeredAt: new Date().toISOString(),
        status: 'active'
      }));
      
      // Сохраняем конвертированные данные
      fs.writeFileSync(driversFile, JSON.stringify(convertedDrivers, null, 2));
      console.log(`✅ Данные водителей конвертированы и скопированы из materials/Контакты водителей.json (${convertedDrivers.length} водителей)`);
    } catch (error) {
      console.error('❌ Ошибка конвертации данных водителей:', error);
      fs.writeFileSync(driversFile, '[]');
    }
  } else {
    fs.writeFileSync(driversFile, '[]');
  }
}
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, '[]');
}
if (!fs.existsSync(userStatesFile)) {
  fs.writeFileSync(userStatesFile, '{}');
}
if (!fs.existsSync(staffUsersFile)) {
  fs.writeFileSync(staffUsersFile, JSON.stringify({ test: { username: 'test', password: '1234' } }, null, 2));
}

interface Driver {
  id: number;
  name: string;
  phone: string;
  carNumber: string;
  carType: string;
  registeredAt: string;
  status: 'active' | 'inactive';
  rating: number; // Средний рейтинг водителя (0-5)
  totalOrders: number; // Общее количество заказов
  completedOrders: number; // Завершенные заказы
  ratingCount: number; // Количество оценок
  clientRating: number; // Средний рейтинг от клиентов (0-5)
  clientRatingCount: number; // Количество оценок от клиентов
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
  clientRating?: number; // Рейтинг клиента от водителя (1-5)
  driverRating?: number; // Рейтинг водителя от клиента (1-5)
  clientReview?: string; // Отзыв о клиенте
  driverReview?: string; // Отзыв о водителе
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
  staffStep?: 'login' | 'password';
  staffLogin?: string;
  staffAuthed?: boolean;
  name?: string;
  phone?: string;
  carNumber?: string;
  carType?: string;
  from?: string;
  to?: string;
  description?: string;
  loginStep?: 'phone';
  driverAuthed?: boolean;
  driverData?: {
    Имя: string;
    Телефон: string;
    Номер_авто: string;
    Тип_ТС: string;
  };
  adminStep?: 'add_driver_name' | 'add_driver_phone' | 'add_driver_car_number' | 'add_driver_car_type' | 'edit_driver';
  tempDriverName?: string;
  tempDriverPhone?: string;
  tempDriverCarNumber?: string;
  editingDriverId?: number;
  orderNumberForStatus?: string;
  driverId?: number;
}

function normalizePhone(raw: string): string | null {
  if (!raw) return null;
  
  console.log('📱 Нормализация телефона:', raw);
  
  // Убираем все символы кроме цифр
  const digits = raw.replace(/\D/g, '');
  console.log('📱 Только цифры:', digits);
  
  // Проверяем длину
  if (digits.length < 10 || digits.length > 15) {
    console.log('📱 Неправильная длина:', digits.length);
    return null;
  }
  
  // В Казахстане 870 и 770 - это один код страны
  if (digits.startsWith('870')) {
    // Заменяем 870 на 770 для единообразия
    const result = '+770' + digits.slice(3);
    console.log('📱 Нормализован (870→770):', result);
    return result;
  } else if (digits.startsWith('770')) {
    // Заменяем 770 на 870 для единообразия
    const result = '+870' + digits.slice(3);
    console.log('📱 Нормализован (770→870):', result);
    return result;
  }
  
  // Если номер начинается с 8 или 9, добавляем +
  if (digits.startsWith('8') || digits.startsWith('9')) {
    const result = '+' + digits;
    console.log('📱 Нормализован:', result);
    return result;
  }
  
  // Если номер начинается с 7, добавляем +
  if (digits.startsWith('7')) {
    const result = '+' + digits;
    console.log('📱 Нормализован:', result);
    return result;
  }
  
  // Если номер уже начинается с +, возвращаем как есть
  if (raw.startsWith('+')) {
    console.log('📱 Уже с +:', raw);
    return raw;
  }
  
  console.log('📱 Не удалось нормализовать');
  return null;
}

async function tryQuickRegister(userId: number, chatId: number, text: string) {
  const drivers = loadDrivers();
  if (drivers[userId]) return false;
  const parts = text.split(/[;\n,]/).map(p => p.trim()).filter(Boolean);
  if (parts.length < 4) return false;
  const [name, phoneRaw, carNumber, carType] = parts;
  const phone = normalizePhone(phoneRaw);
  if (!phone) return false;

  drivers[userId] = {
    id: userId,
    name,
    phone,
    carNumber,
    carType,
    registeredAt: new Date().toISOString(),
    status: 'active'
  };
  saveDrivers(drivers);

  await sendTelegramMessage(chatId, `✅ <b>Регистрация завершена!</b>

<b>Ваши данные:</b>
👤 Имя: ${name}
📱 Телефон: ${phone}
🚛 Автомобиль: ${carNumber}
🔧 Тип ТС: ${carType}

Теперь вы будете получать уведомления о новых заказах!`);
  await sendTelegramMessage(CHANNEL_ID, `🚛 <b>Новый водитель зарегистрирован!</b>

👤 <b>Имя:</b> ${name}
📱 <b>Телефон:</b> ${phone}
🚛 <b>Автомобиль:</b> ${carNumber}
🔧 <b>Тип ТС:</b> ${carType}
🆔 <b>Telegram ID:</b> ${userId}`);
  return true;
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

function loadStaffUsers(): Record<string, { username: string; password: string }> {
  try {
    return JSON.parse(fs.readFileSync(staffUsersFile, 'utf8'));
  } catch (e) {
          return {} as Record<string, { username: string; password: string }>;
  }
}

async function sendMainMenu(chatId: number) {
  const keyboard = {
    inline_keyboard: [
      [{ text: '🚛 Водителям', callback_data: 'menu_drivers' }],
      [{ text: '📦 Клиентам', callback_data: 'menu_clients' }],
      [{ text: '⭐ Рейтинг водителей', callback_data: 'show_rating' }],
      [{ text: '👨\u200d💼 Сотрудникам', callback_data: 'menu_staff' }]
    ]
  };
  await sendTelegramMessage(chatId, 'Выберите раздел:', keyboard);
}

async function sendDriversMenu(chatId: number) {
  const keyboard = {
    inline_keyboard: [
      [{ text: '📝 Регистрация водителя', callback_data: 'register_driver' }],
      [{ text: '🔐 Вход в систему', callback_data: 'driver_login' }],
      [{ text: '📱 Поделиться номером', callback_data: 'share_phone' }],
      [{ text: '⬅️ Назад', callback_data: 'back_main' }]
    ]
  };
  await sendTelegramMessage(chatId, '🚛 <b>Раздел «Водителям»</b>\n\nВыберите действие:', keyboard);
}

async function sendDriverMenu(chatId: number) {
  const keyboard = {
    inline_keyboard: [
      [{ text: '📋 Активные заказы', callback_data: 'view_active_orders' }],
      [{ text: '📚 Закрытые заказы', callback_data: 'view_closed_orders' }],
      [{ text: '🚛 Доступные заказы', callback_data: 'view_available_orders' }],
      [{ text: '📍 Обновить статус', callback_data: 'update_order_status' }],
      [{ text: '⭐ Мой рейтинг', callback_data: 'my_driver_rating' }],
      [{ text: '🔔 Уведомления', callback_data: 'configure_notifications' }],
      [{ text: '👤 Мой профиль', callback_data: 'driver_profile' }],
      [{ text: '🔐 Выйти из системы', callback_data: 'driver_logout' }],
      [{ text: '⬅️ Назад', callback_data: 'back_main' }]
    ]
  };
  await sendTelegramMessage(chatId, '🚛 <b>Меню водителя</b>\n\nВыберите действие:', keyboard);
}

async function sendOrderStatusUpdateMenu(chatId: number, userId: number, userStates: Record<string, UserState>) {
  const userState = userStates[userId] || {};
  userState.step = 'select_order_for_status';
  userStates[userId] = userState;
  saveUserStates(userStates);
  
  const keyboard = {
    inline_keyboard: [
      [{ text: '📝 Ввести номер заказа вручную', callback_data: 'manual_order_number' }],
      [{ text: '⬅️ Назад', callback_data: 'back_driver_menu' }]
    ]
  };
  
  await sendTelegramMessage(chatId, '📍 <b>Обновление статуса заказа</b>\n\nВыберите способ указания заказа:', keyboard);
}

async function sendClientsMenu(chatId: number) {
  const keyboard = {
    inline_keyboard: [
      [{ text: '🔎 Отследить груз', callback_data: 'client_track' }],
      [{ text: '⬅️ Назад', callback_data: 'back_main' }]
    ]
  };
  await sendTelegramMessage(chatId, 'Раздел «Клиентам». Введите номер для отслеживания при нажатии.', keyboard);
}

async function sendStaffLogin(chatId: number, userStates: Record<string, UserState>, userId: number) {
  userStates[userId] = { ...userStates[userId], staffStep: 'login', staffAuthed: false };
  saveUserStates(userStates);
  await sendTelegramMessage(chatId, '👨\u200d💼 Вход сотрудника\n\nВведите логин:');
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
        // Очищаем все состояния пользователя при старте
        delete userStates[userId];
        saveUserStates(userStates);
        await sendMainMenu(chatId);
        return NextResponse.json({ success: true }); // Прерываем дальнейшую обработку
      }
      
      // Обработка обычных кнопок
      else if (text === '⬅️ Назад') {
        // контекстный назад: если в регистрации — шаг назад, иначе главное меню
        if (userState.step === 'phone') {
          userState.step = 'name';
          userStates[userId] = userState;
          saveUserStates(userStates);
          await sendTelegramMessage(chatId, 'Введите ваше имя и фамилию:', { keyboard: [[{ text: '⬅️ Назад' }]], resize_keyboard: true });
        } else if (userState.step === 'carNumber') {
          userState.step = 'phone';
          userStates[userId] = userState;
          saveUserStates(userStates);
          await sendTelegramMessage(chatId, 'Введите ваш номер телефона (например: +7 700 123 45 67):', { keyboard: [[{ text: '⬅️ Назад' }]], resize_keyboard: true });
        } else if (userState.step === 'carType') {
          userState.step = 'carNumber';
          userStates[userId] = userState;
          saveUserStates(userStates);
          await sendTelegramMessage(chatId, 'Введите номер вашего автомобиля (например: А123БВ01):', { keyboard: [[{ text: '⬅️ Назад' }]], resize_keyboard: true });
        } else {
          await sendDriversMenu(chatId);
        }
      }
      
      // Обработка контактов
      else if (message.contact) {
        const contact = message.contact;
        if (contact.user_id === userId) {
          const phone = contact.phone_number;
          const normalizedPhone = normalizePhone(phone);
          if (normalizedPhone) {
            await sendTelegramMessage(chatId, `📱 <b>Номер получен!</b>\n\nТелефон: ${normalizedPhone}\n\nТеперь введите остальные данные для регистрации:`, {
              keyboard: {
                keyboard: [
                  [{ text: '📝 Завершить регистрацию' }],
                  [{ text: '⬅️ Назад' }]
                ],
                resize_keyboard: true,
                one_time_keyboard: false
              }
            });
            // Сохраняем номер в состоянии пользователя
            userState.phone = normalizedPhone;
            userStates[userId] = userState;
            saveUserStates(userStates);
          } else {
            await sendTelegramMessage(chatId, '❌ Неверный формат номера телефона. Попробуйте еще раз.');
            return NextResponse.json({ success: true });
          }
        } else {
          await sendTelegramMessage(chatId, '❌ Это не ваш номер телефона. Поделитесь своим номером.');
        }
      }
      
      // Обработка кнопки завершения регистрации
      else if (text === '📝 Завершить регистрацию') {
        if (userState.phone) {
          userState.step = 'name';
          userStates[userId] = userState;
          saveUserStates(userStates);
          await sendTelegramMessage(chatId, 'Введите ваше имя и фамилию:', {
            keyboard: {
              keyboard: [
                [{ text: '⬅️ Назад' }]
              ],
              resize_keyboard: true,
              one_time_keyboard: false
            }
          });
        } else {
          await sendTelegramMessage(chatId, '❌ Сначала поделитесь номером телефона.');
          return NextResponse.json({ success: true });
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

      // Рейтинги и статистика
      else if (text === '/rating' || text.toLowerCase() === 'рейтинг') {
        await showTopDrivers(chatId);
      }
      else if (text === '/myrating' || text.toLowerCase() === 'мой рейтинг') {
        if (userState.driverAuthed && userState.driverData) {
          const driverPhone = userState.driverData.Телефон;
          const drivers = loadDrivers();
          const driver = Object.values(drivers).find(d => d.phone === driverPhone);
          if (driver) {
            await showDriverRating(chatId, driver.id);
          } else {
            await sendTelegramMessage(chatId, '❌ Ваш профиль не найден. Попробуйте войти в систему заново.');
          }
        } else {
          await sendTelegramMessage(chatId, '❌ Сначала войдите в систему как водитель.');
        }
      }

      // Аналитика
      else if (text === '/analytics' || text.toLowerCase() === 'аналитика') {
        if (userId.toString() === ADMIN_ID) {
          await showAnalytics(chatId);
        } else {
          await sendTelegramMessage(chatId, '❌ Доступ к аналитике только для администраторов.');
        }
      }
      else if (text === '/stats' || text.toLowerCase() === 'статистика') {
        if (userId.toString() === ADMIN_ID) {
          await showAnalytics(chatId);
        } else {
          await sendTelegramMessage(chatId, '❌ Доступ к статистике только для администраторов.');
        }
      }

      // Уведомления в реальном времени
      else if (text === '/notifications' || text.toLowerCase() === 'уведомления') {
        if (userState.driverAuthed && userState.driverData) {
          const driverPhone = userState.driverData.Телефон;
          const drivers = loadDrivers();
          const driver = Object.values(drivers).find(d => d.phone === driverPhone);
          if (driver) {
            await showNotificationSettings(chatId, driver.id);
          } else {
            await sendTelegramMessage(chatId, '❌ Ваш профиль не найден.');
          }
        } else {
          await showNotificationSettings(chatId);
        }
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
      
      // Обработка входа водителя по телефону (Excel) - ПЕРВЫМ ПРИОРИТЕТОМ
      if (userState.loginStep === 'phone') {
        const phone = normalizePhone(text) || text.trim();
        const found = findDriverInJsonByPhone(phone);
        if (found) {
          // Записываем в локальную JSON базу, если нет
          const d = loadDrivers();
          if (!d[userId]) {
            d[userId] = {
              id: userId,
              name: found.name,
              phone: found.phone,
              carNumber: found.carNumber,
              carType: found.carType,
              registeredAt: new Date().toISOString(),
              status: 'active',
              rating: 0,
              totalOrders: 0,
              completedOrders: 0,
              ratingCount: 0,
              clientRating: 0,
              clientRatingCount: 0
            };
            saveDrivers(d);
          } else {
            // Обновляем поля рейтинга у существующего водителя, если их нет
            const driver = d[userId];
            if (typeof driver.rating === 'undefined') {
              driver.rating = 0;
              driver.totalOrders = 0;
              driver.completedOrders = 0;
              driver.ratingCount = 0;
              driver.clientRating = 0;
              driver.clientRatingCount = 0;
              saveDrivers(d);
            }
          }
          
          // Сохраняем данные водителя в userState
          userState.driverAuthed = true;
          userState.driverData = {
            Имя: found.name,
            Телефон: found.phone,
            Номер_авто: found.carNumber,
            Тип_ТС: found.carType
          };
          delete userState.loginStep;
          userStates[userId] = userState;
          saveUserStates(userStates);
          
          await sendTelegramMessage(chatId, `✅ <b>Вход выполнен успешно!</b>\n\n👤 <b>${found.name}</b>\n📱 <b>${found.phone}</b>\n🚛 <b>${found.carNumber}</b> (${found.carType})`, { reply_markup: { remove_keyboard: true } });
          
          // Показываем меню водителя
          await sendDriverMenu(chatId);
        } else {
          // Очищаем состояние входа и возвращаемся к меню водителя
          delete userState.loginStep;
          userStates[userId] = userState;
          saveUserStates(userStates);
          
          await sendTelegramMessage(chatId, '❌ Телефон не найден в базе данных.\n\nПроверьте:\n• Правильность номера\n• Формат номера (например: +7 705 406 06 74)\n\nЕсли вы новый водитель, используйте кнопку "📝 Регистрация водителя"');
          
          // Возвращаемся к меню водителя
          await sendDriversMenu(chatId);
        }
      }
      
      // Сотрудники: обработка логина/пароля
      else if (userState.staffStep === 'login') {
        userState.staffLogin = text.trim();
        userState.staffStep = 'password';
        userStates[userId] = userState;
        saveUserStates(userStates);
        await sendTelegramMessage(chatId, 'Введите пароль:');
      } else if (userState.staffStep === 'password') {
        const staffUsers = loadStaffUsers();
        const login = userState.staffLogin || '';
        const pass = text.trim();
        const valid = Object.values(staffUsers).some(u => u.username === login && u.password === pass);
        if (valid) {
          userState.staffAuthed = true;
          userState.staffStep = undefined;
          userStates[userId] = userState;
          saveUserStates(userStates);
          const keyboard = { 
            inline_keyboard: [
              [{ text: '📦 Создать заказ', callback_data: 'create_order' }], 
              [{ text: '📋 Активные заказы', callback_data: 'list_orders' }], 
              [{ text: '👥 Водители', callback_data: 'list_drivers' }], 
              [{ text: '🚛 Управление водителями', callback_data: 'admin_manage_drivers' }], 
              [{ text: '⬅️ Назад', callback_data: 'back_main' }]
            ] 
          };
          await sendTelegramMessage(chatId, '✅ Вход выполнен. Панель сотрудника:', keyboard);
        } else {
          await sendTelegramMessage(chatId, '❌ Неверный логин или пароль. Попробуйте снова.');
          await sendStaffLogin(chatId, userStates, userId);
        }
      }
      
      // Обработка состояний регистрации - ПОСЛЕ проверки входа
      else if (userState.step) {
        await handleRegistrationStep(userId, chatId, text, userState, userStates);
      }
      
      // Попытка быстрой регистрации одной строкой: Имя; +7700...; А123БВ01; Фура 20т
      else if (await tryQuickRegister(userId, chatId, text)) {
        // уже обработано
      }
      
      // Обработка создания заказа
      else if (userState.orderStep) {
        await handleOrderCreationStep(userId, chatId, text, userState, userStates);
      }
      
      // Обработка предложения цены
      else if (userState.biddingOrderId) {
        await handleBidStep(userId, chatId, text, userState, userStates);
      }
      
      // Обработка админских состояний
      else if (userState.adminStep) {
        await handleAdminStep(userId, chatId, text, userState, userStates);
      }
      
      // Обработка обновления статуса заказа
      else if (userState.step === 'enter_order_number') {
        // Пользователь ввел номер заказа
        const orderNumber = text.trim();
        userState.orderNumberForStatus = orderNumber;
        userState.step = 'enter_order_status';
        userStates[userId] = userState;
        saveUserStates(userStates);
        
        const keyboard = {
          inline_keyboard: [
            [{ text: '🚛 В пути', callback_data: 'status_in_transit' }],
            [{ text: '📦 На складе', callback_data: 'status_warehouse' }],
            [{ text: '✅ Доставлен', callback_data: 'status_delivered' }],
            [{ text: '⚠️ Задержка', callback_data: 'status_delayed' }],
            [{ text: '📝 Кастомный статус', callback_data: 'status_custom' }],
            [{ text: '⬅️ Назад', callback_data: 'back_driver_menu' }]
          ]
        };
        
        await sendTelegramMessage(chatId, `📝 <b>Обновление статуса заказа</b>\n\nЗаказ: <code>${orderNumber}</code>\n\nВыберите новый статус:`, keyboard);
      }
      
      // Обработка ввода кастомного статуса
      else if (userState.step === 'enter_custom_status') {
        const customStatus = text.trim();
        if (customStatus.length < 3) {
          await sendTelegramMessage(chatId, '❌ Статус должен содержать минимум 3 символа. Попробуйте еще раз:');
          return NextResponse.json({ success: true });
        }
        
        // Обновляем статус заказа через API
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/driver/location`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              driverId: userState.driverId,
              orderId: userState.orderNumberForStatus,
              lat: 0, // Водитель может указать координаты позже
              lng: 0,
              location: 'Обновлено через Telegram',
              status: customStatus,
              description: `Статус обновлен водителем: ${customStatus}`,
              timestamp: new Date().toISOString()
            })
          });
          
          if (response.ok) {
            await sendTelegramMessage(chatId, `✅ Статус заказа <code>${userState.orderNumberForStatus}</code> успешно обновлен на: <b>${customStatus}</b>`);
          } else {
            await sendTelegramMessage(chatId, '❌ Ошибка при обновлении статуса. Проверьте номер заказа и попробуйте еще раз.');
          }
        } catch (error) {
          await sendTelegramMessage(chatId, '❌ Ошибка соединения с сервером. Попробуйте позже.');
        }
        
        // Очищаем состояние
        delete userState.step;
        delete userState.orderNumberForStatus;
        delete userState.driverId;
        userStates[userId] = userState;
        saveUserStates(userStates);
        
        await sendDriverMenu(chatId);
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
      } else if (data === 'menu_drivers') {
        await answerCallbackQuery(callbackQueryId);
        await sendDriversMenu(chatId);
      } else if (data === 'menu_clients') {
        await answerCallbackQuery(callbackQueryId);
        await sendClientsMenu(chatId);
      } else if (data === 'menu_staff') {
        await answerCallbackQuery(callbackQueryId);
        const userStates = loadUserStates();
        await sendStaffLogin(chatId, userStates, userId);
      } else if (data === 'back_main') {
        await answerCallbackQuery(callbackQueryId);
        await sendMainMenu(chatId);
      } else if (data === 'show_rating') {
        await answerCallbackQuery(callbackQueryId);
        await showTopDrivers(chatId);
      } else if (data === 'driver_login') {
        await answerCallbackQuery(callbackQueryId);
        const userStates = loadUserStates();
        userStates[userId] = { ...(userStates[userId] || {}), loginStep: 'phone' };
        saveUserStates(userStates);
        await sendTelegramMessage(chatId, '🔐 <b>Вход для водителей</b>\n\nВведите номер телефона, как в базе данных (пример: +7 705 406 06 74):\n\n<i>Пароль не требуется - вход только по номеру телефона</i>');
      } else if (data === 'share_phone') {
        await answerCallbackQuery(callbackQueryId);
        const keyboard = {
          keyboard: [
            [{ text: '📱 Поделиться номером', request_contact: true }],
            [{ text: '⬅️ Назад' }]
          ],
          resize_keyboard: true,
          one_time_keyboard: false
        };
        await sendTelegramMessage(chatId, '📱 <b>Поделиться номером телефона</b>\n\nНажмите кнопку ниже, чтобы автоматически поделиться вашим номером телефона:', keyboard);
      } else if (data === 'client_track') {
        await answerCallbackQuery(callbackQueryId);
        await sendTelegramMessage(chatId, 'Введите номер для отслеживания, например: <code>WT123456-1700000000000</code>');
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
        await listActiveOrders(chatId, userId);
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
      } else if (data === 'view_orders') {
        await answerCallbackQuery(callbackQueryId);
        const userStates = loadUserStates();
        const userState = userStates[userId] || {};
        if (userState.driverAuthed) {
          await listActiveOrders(chatId, userId);
        } else {
          await sendTelegramMessage(chatId, '❌ Сначала войдите в систему как водитель.');
          await sendDriversMenu(chatId);
        }
      } else if (data === 'view_active_orders') {
        await answerCallbackQuery(callbackQueryId);
        const userStates = loadUserStates();
        const userState = userStates[userId] || {};
        if (userState.driverAuthed && userState.driverData) {
          // Получаем ID водителя из базы по телефону
          const driverPhone = userState.driverData.Телефон;
          const drivers = loadDrivers();
          const driver = Object.values(drivers).find(d => d.phone === driverPhone);
          
          if (driver) {
            await showDriverActiveOrders(chatId, driver.id);
          } else {
            await sendTelegramMessage(chatId, '❌ Ошибка: водитель не найден в базе.');
            await sendDriverMenu(chatId);
          }
        } else {
          await sendTelegramMessage(chatId, '❌ Сначала войдите в систему как водитель.');
          await sendDriversMenu(chatId);
        }
      } else if (data === 'view_closed_orders') {
        await answerCallbackQuery(callbackQueryId);
        const userStates = loadUserStates();
        const userState = userStates[userId] || {};
        if (userState.driverAuthed && userState.driverData) {
          // Получаем ID водителя из базы по телефону
          const driverPhone = userState.driverData.Телефон;
          const drivers = loadDrivers();
          const driver = Object.values(drivers).find(d => d.phone === driverPhone);
          
          if (driver) {
            await showDriverClosedOrders(chatId, driver.id);
          } else {
            await sendTelegramMessage(chatId, '❌ Ошибка: водитель не найден в базе.');
            await sendDriverMenu(chatId);
          }
        } else {
          await sendTelegramMessage(chatId, '❌ Сначала войдите в систему как водитель.');
          await sendDriversMenu(chatId);
        }
      } else if (data === 'view_available_orders') {
        await answerCallbackQuery(callbackQueryId);
        await showAvailableOrders(chatId);
      } else if (data === 'refresh_available_orders') {
        await answerCallbackQuery(callbackQueryId);
        await showAvailableOrders(chatId);
      } else if (data === 'update_order_status') {
        await answerCallbackQuery(callbackQueryId);
        const userStates = loadUserStates();
        const userState = userStates[userId] || {};
        if (userState.driverAuthed) {
          await sendOrderStatusUpdateMenu(chatId, userId, userStates);
        } else {
          await sendTelegramMessage(chatId, '❌ Сначала войдите в систему как водитель.');
          await sendDriversMenu(chatId);
        }
      } else if (data === 'manual_order_number') {
        await answerCallbackQuery(callbackQueryId);
        const userStates = loadUserStates();
        const userState = userStates[userId] || {};
        userState.step = 'enter_order_number';
        userStates[userId] = userState;
        saveUserStates(userStates);
        await sendTelegramMessage(chatId, '📝 Введите номер заказа для обновления статуса:');
      } else if (data.startsWith('status_')) {
        await answerCallbackQuery(callbackQueryId);
        const userStates = loadUserStates();
        const userState = userStates[userId] || {};
        const statusType = data.split('_')[1];
        
        if (statusType === 'custom') {
          userState.step = 'enter_custom_status';
          userStates[userId] = userState;
          saveUserStates(userStates);
          await sendTelegramMessage(chatId, '📝 Введите свой кастомный статус заказа:');
        } else {
          // Обновляем статус заказа через API
          const statusMap: Record<string, string> = {
            'in_transit': 'В пути',
            'warehouse': 'На складе',
            'delivered': 'Доставлен',
            'delayed': 'Задержка'
          };
          
          const newStatus = statusMap[statusType] || statusType;
          
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/driver/location`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                driverId: userState.driverId || 1, // Временно используем ID 1
                orderId: userState.orderNumberForStatus,
                lat: 0,
                lng: 0,
                location: 'Обновлено через Telegram',
                status: newStatus,
                description: `Статус обновлен водителем: ${newStatus}`,
                timestamp: new Date().toISOString()
              })
            });
            
            if (response.ok) {
              await sendTelegramMessage(chatId, `✅ Статус заказа <code>${userState.orderNumberForStatus}</code> успешно обновлен на: <b>${newStatus}</b>`);
            } else {
              await sendTelegramMessage(chatId, '❌ Ошибка при обновлении статуса. Проверьте номер заказа и попробуйте еще раз.');
            }
          } catch (error) {
            await sendTelegramMessage(chatId, '❌ Ошибка соединения с сервером. Попробуйте позже.');
          }
          
          // Очищаем состояние
          delete userState.step;
          delete userState.orderNumberForStatus;
          delete userState.driverId;
          userStates[userId] = userState;
          saveUserStates(userStates);
          
          await sendDriverMenu(chatId);
        }
      } else if (data === 'my_driver_rating') {
        await answerCallbackQuery(callbackQueryId);
        const userStates = loadUserStates();
        const userState = userStates[userId] || {};
        if (userState.driverData) {
          const driverPhone = userState.driverData.Телефон;
          const drivers = loadDrivers();
          const driver = Object.values(drivers).find(d => d.phone === driverPhone);
          if (driver) {
            await showDriverRating(chatId, driver.id);
          } else {
            await sendTelegramMessage(chatId, '❌ Ваш профиль не найден. Попробуйте войти в систему заново.');
          }
        } else {
          await sendTelegramMessage(chatId, '❌ Сначала войдите в систему как водитель.');
        }
      } else if (data === 'driver_profile') {
        await answerCallbackQuery(callbackQueryId);
        const userStates = loadUserStates();
        const userState = userStates[userId] || {};
        if (userState.driverData) {
          const driver = userState.driverData;
          await sendTelegramMessage(chatId, `👤 <b>Мой профиль</b>\n\n<b>Имя:</b> ${driver.Имя}\n<b>Телефон:</b> ${driver.Телефон}\n<b>Автомобиль:</b> ${driver.Номер_авто}\n<b>Тип ТС:</b> ${driver.Тип_ТС}`);
        } else {
          await sendTelegramMessage(chatId, '❌ Профиль не найден. Попробуйте войти в систему заново.');
        }
      } else if (data === 'driver_logout') {
        await answerCallbackQuery(callbackQueryId);
        const userStates = loadUserStates();
        delete userStates[userId];
        saveUserStates(userStates);
        await sendTelegramMessage(chatId, '✅ Вы вышли из системы.');
        await sendMainMenu(chatId);
      } else if (data === 'skip_order') {
        await answerCallbackQuery(callbackQueryId, 'Заказ пропущен');
        await sendTelegramMessage(chatId, '✅ Заказ пропущен. Переходим к следующему...');
      }

      // Обработка рейтингов
      else if (data.startsWith('rate_')) {
        await answerCallbackQuery(callbackQueryId, 'Спасибо за оценку!');
        const rating = parseInt(data.split('_')[1]);
        const userStates = loadUserStates();
        await processRating(chatId, rating, userStates);
      }
      else if (data === 'skip_rating') {
        await answerCallbackQuery(callbackQueryId, 'Оценка пропущена');
        const userStates = loadUserStates();
        const userId = chatId.toString();
        const userState = userStates[userId];
        if (userState) {
          delete userState.ratingOrderId;
          delete userState.ratingType;
          userStates[userId] = userState;
          saveUserStates(userStates);
        }
        await sendTelegramMessage(chatId, '✅ Оценка пропущена.');
      }
      else if (data === 'driver_stats') {
        await answerCallbackQuery(callbackQueryId);
        await showTopDrivers(chatId, 20); // Показать больше водителей
      }
      else if (data.startsWith('rate_driver_')) {
        await answerCallbackQuery(callbackQueryId);
        const orderId = data.split('_')[2];
        const userStates = loadUserStates();
        await requestOrderRating(chatId, orderId, false); // Клиент оценивает водителя
      }

      // Обработка аналитики
      else if (data === 'show_analytics') {
        await answerCallbackQuery(callbackQueryId);
        await showAnalytics(chatId);
      }
      else if (data === 'detailed_analytics') {
        await answerCallbackQuery(callbackQueryId);
        await showDetailedAnalytics(chatId);
      }
      else if (data === 'drivers_analytics') {
        await answerCallbackQuery(callbackQueryId);
        await showDriversAnalytics(chatId);
      }
      else if (data === 'finance_analytics') {
        await answerCallbackQuery(callbackQueryId);
        await showFinanceAnalytics(chatId);
      }

      // Обработка уведомлений
      else if (data === 'enable_notifications') {
        await answerCallbackQuery(callbackQueryId);
        const subscriberId = subscribeToNotifications(chatId);
        await sendTelegramMessage(chatId, `✅ <b>Уведомления включены!</b>\n\nТеперь вы будете получать:\n• Новые заказы\n• Обновления статуса\n• Системные оповещения`);
      }
      else if (data === 'disable_notifications') {
        await answerCallbackQuery(callbackQueryId);
        unsubscribeFromNotifications(chatId);
        await sendTelegramMessage(chatId, '🔕 <b>Уведомления отключены</b>\n\nВы больше не будете получать автоматические уведомления.');
      }
      else if (data === 'configure_filters') {
        await answerCallbackQuery(callbackQueryId);
        await sendTelegramMessage(chatId, '⚙️ <b>Настройка фильтров</b>\n\nФункция настройки фильтров будет доступна в следующих обновлениях.');
      }
      else if (data === 'configure_notifications') {
        await answerCallbackQuery(callbackQueryId);
        const userStates = loadUserStates();
        const userState = userStates[userId] || {};
        if (userState.driverAuthed && userState.driverData) {
          const driverPhone = userState.driverData.Телефон;
          const drivers = loadDrivers();
          const driver = Object.values(drivers).find(d => d.phone === driverPhone);
          if (driver) {
            await showNotificationSettings(chatId, driver.id);
          } else {
            await sendTelegramMessage(chatId, '❌ Ваш профиль не найден.');
          }
        } else {
          await showNotificationSettings(chatId);
        }
      }

      // ===== Админские callback'и для управления водителями =====
      else if (data === 'admin_manage_drivers') {
        await answerCallbackQuery(callbackQueryId);
        await sendDriversManagementMenu(chatId);
      } else if (data === 'admin_list_drivers') {
        await answerCallbackQuery(callbackQueryId);
        await sendDriversList(chatId);
      } else if (data === 'admin_add_driver') {
        await answerCallbackQuery(callbackQueryId);
        await sendAddDriverForm(chatId);
      } else if (data === 'admin_edit_driver') {
        await answerCallbackQuery(callbackQueryId);
        await sendEditDriverForm(chatId);
      } else if (data === 'admin_delete_driver') {
        await answerCallbackQuery(callbackQueryId);
        await sendDeleteDriverForm(chatId);
      } else if (data === 'admin_drivers_stats') {
        await answerCallbackQuery(callbackQueryId);
        await sendDriversStats(chatId);
      } else if (data.startsWith('admin_edit_driver_')) {
        await answerCallbackQuery(callbackQueryId);
        const driverId = parseInt(data.split('_')[3]);
        await startEditDriver(chatId, driverId);
      } else if (data.startsWith('admin_delete_driver_')) {
        await answerCallbackQuery(callbackQueryId);
        const driverId = parseInt(data.split('_')[3]);
        await confirmDeleteDriver(chatId, driverId);
      } else if (data.startsWith('confirm_delete_driver_')) {
        await answerCallbackQuery(callbackQueryId);
        const driverId = parseInt(data.split('_')[3]);
        const success = deleteDriverById(driverId);
        
        if (success) {
          await sendTelegramMessage(chatId, '✅ Водитель успешно удален!');
        } else {
          await sendTelegramMessage(chatId, '❌ Ошибка при удалении водителя.');
        }
        
        await sendDriversManagementMenu(chatId);
      } else if (data === 'back_to_admin') {
        await answerCallbackQuery(callbackQueryId);
        await sendAdminMenu(chatId);
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
  userStates[userId] = { ...(userStates[userId] || {}), step: 'name' };
  saveUserStates(userStates);
  const keyboard = {
    keyboard: [[{ text: '⬅️ Назад' }]],
    resize_keyboard: true,
    one_time_keyboard: false
  };
  await sendTelegramMessage(chatId, '📝 <b>Регистрация водителя</b>\n\nВведите ваше имя и фамилию:', keyboard);
}

async function handleRegistrationStep(userId: number, chatId: number, text: string, userState: UserState, userStates: Record<string, UserState>) {
  const drivers = loadDrivers();
  
  if (userState.step === 'name') {
    userState.name = text;
    userState.step = 'phone';
    userStates[userId] = userState;
    saveUserStates(userStates);
    await sendTelegramMessage(chatId, 'Введите ваш номер телефона (например: +7 700 123 45 67):', { keyboard: [[{ text: '⬅️ Назад' }]], resize_keyboard: true });
  } else if (userState.step === 'phone') {
    userState.phone = text;
    userState.step = 'carNumber';
    userStates[userId] = userState;
    saveUserStates(userStates);
    await sendTelegramMessage(chatId, 'Введите номер вашего автомобиля (например: А123БВ01):', { keyboard: [[{ text: '⬅️ Назад' }]], resize_keyboard: true });
  } else if (userState.step === 'carNumber') {
    userState.carNumber = text;
    userState.step = 'carType';
    userStates[userId] = userState;
    saveUserStates(userStates);
    await sendTelegramMessage(chatId, 'Введите тип вашего автомобиля (например: Фура 20т, Газель, Тент 10т):', { keyboard: [[{ text: '⬅️ Назад' }]], resize_keyboard: true });
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
      status: 'active',
      rating: 0,
      totalOrders: 0,
      completedOrders: 0,
      ratingCount: 0,
      clientRating: 0,
      clientRatingCount: 0
    };
    
    saveDrivers(drivers);
    // Добавляем в Excel БД
    try {
              appendDriverToJson({
          name: userState.name!,
          phone: userState.phone!,
          carNumber: userState.carNumber!,
          carType: userState.carType!
        });
    } catch {}
    delete userStates[userId];
    saveUserStates(userStates);
    
    const successText = `✅ <b>Регистрация завершена!</b>

<b>Ваши данные:</b>
👤 Имя: ${userState.name}
📱 Телефон: ${userState.phone}
🚛 Автомобиль: ${userState.carNumber}
🔧 Тип ТС: ${userState.carType}

Теперь вы будете получать уведомления о новых заказах!`;

    await sendTelegramMessage(chatId, successText, {
      reply_markup: { remove_keyboard: true }
    });
    
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

    // Отправляем уведомление всем подписчикам о новом заказе
    const orderMessage = `📦 <b>Новый заказ</b> ${order.from} → ${order.to}\nТип ТС: ${order.carType}\nВес: ${order.weight} кг\nЦена: ${order.finalPrice} тенге`;
    await broadcastNotification('new_order', orderMessage, { orderId, order: orders[orderId] });

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
    return NextResponse.json({ success: true });
  }
  
  if (!drivers[userId]) {
    await sendTelegramMessage(chatId, '❌ Вы не зарегистрированы как водитель.');
    return NextResponse.json({ success: true });
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
  if (isNaN(parseInt(text)) || parseInt(text) <= 0) {
    await sendTelegramMessage(chatId, '❌ Введите корректную цену числом.');
    return NextResponse.json({ success: true });
  }
  
  const price = parseInt(text);
  
  const orderId = userState.biddingOrderId!;
  const orders = loadOrders();
  const drivers = loadDrivers();
  const driver = drivers[userId];
  
  if (!orders[orderId] || !driver) {
    await sendTelegramMessage(chatId, '❌ Ошибка при обработке ставки.');
    delete userStates[userId];
    saveUserStates(userStates);
    return NextResponse.json({ success: true });
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
    return NextResponse.json({ success: true });
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
    return NextResponse.json({ success: true });
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
async function listActiveOrders(chatId: number, userId?: number) {
  const orders = loadOrders();
  const activeOrders = Object.values(orders).filter(order => order.status === 'active');
  
  if (activeOrders.length === 0) {
    await sendTelegramMessage(chatId, '📋 Активных заказов нет.');
    return NextResponse.json({ success: true });
  }
  
  // Если это водитель, показываем заказы с кнопками для предложения цены
  const userStates = loadUserStates();
  const userState = userId ? userStates[userId] : userStates[chatId] || {};
  
  if (userState.driverAuthed && userState.driverData) {
    // Показываем заказы по одному с кнопками
    for (const order of activeOrders) {
      const orderText = `📦 <b>Заказ ${order.id}</b>

<b>Маршрут:</b> ${order.from} → ${order.to}
<b>Тип ТС:</b> ${order.carType}
<b>Описание:</b> ${order.description}
<b>Ставок:</b> ${order.bids.length}`;

      const keyboard = {
        inline_keyboard: [
          [{ text: '💰 Предложить цену', callback_data: `bid_${order.id}` }],
          [{ text: '❌ Пропустить', callback_data: 'skip_order' }]
        ]
      };

      await sendTelegramMessage(chatId, orderText, keyboard);
    }
  } else {
    // Для админов показываем общий список
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
}



export async function GET() {
  return NextResponse.json({ 
    status: 'Telegram bot webhook is running',
    timestamp: new Date().toISOString()
  });
}

// ===== JSON helpers =====
function readDriversFromJson(): Array<{ id: number; name: string; phone: string; carNumber: string; carType: string }> {
  try {
    console.log('📁 Читаю JSON файл водителей:', driversFile);
    console.log('📁 Файл существует:', fs.existsSync(driversFile));
    
    if (!fs.existsSync(driversFile)) {
      console.log('❌ JSON файл водителей не найден');
      return [];
    }
    
    const jsonContent = fs.readFileSync(driversFile, 'utf8');
    const drivers = JSON.parse(jsonContent);
    
    console.log('👥 Найдено водителей:', drivers.length);
    if (drivers.length > 0) {
      console.log('👤 Первый водитель:', drivers[0]);
    }
    
    return drivers;
  } catch (error) {
    console.error('❌ Ошибка чтения JSON файла водителей:', error);
    console.error('❌ Детали ошибки:', error instanceof Error ? error.message : String(error));
    return [];
  }
}

// Функция для поиска водителя по номеру телефона
function findDriverInJsonByPhone(phone: string): any {
  try {
    console.log(`📱 Нормализация телефона: ${phone}`);
    
    // Убираем все символы кроме цифр
    const digitsOnly = phone.replace(/[^\d]/g, '');
    console.log(`📱 Только цифры: ${digitsOnly}`);
    
    // В Казахстане 870 и 770 - это один код страны
    let normalizedPhone = phone;
    if (digitsOnly.startsWith('870')) {
      // Заменяем 870 на 770 для единообразия
      normalizedPhone = `+770${digitsOnly.slice(3)}`;
    } else if (digitsOnly.startsWith('770')) {
      // Заменяем 770 на 870 для единообразия
      normalizedPhone = `+870${digitsOnly.slice(3)}`;
    } else {
      // Для остальных номеров добавляем + если его нет
      if (!phone.startsWith('+')) {
        normalizedPhone = `+${digitsOnly}`;
      }
    }
    
    console.log(`📱 Нормализован: ${normalizedPhone}`);
    
    // Ищем водителя по оригинальному номеру
    const driver = readDriversFromJson().find(d => d.phone === normalizedPhone);
    if (driver) {
      console.log(`✅ Водитель найден: ${driver.name}`);
      return driver;
    }
    
    // Ищем по вариантам номеров (если есть)
    const driverByVariants = readDriversFromJson().find(d => {
      if (d.phoneVariants && Array.isArray(d.phoneVariants)) {
        return d.phoneVariants.includes(normalizedPhone);
      }
      return false;
    });
    
    if (driverByVariants) {
      console.log(`✅ Водитель найден по вариантам: ${driverByVariants.name}`);
      return driverByVariants;
    }
    
    // Ищем по точному совпадению цифр
    const driverByDigits = readDriversFromJson().find(d => {
      const driverDigits = d.phone.replace(/[^\d]/g, '');
      return driverDigits === digitsOnly;
    });
    
    if (driverByDigits) {
      console.log(`✅ Водитель найден по цифрам: ${driverByDigits.name}`);
      return driverByDigits;
    }
    
    // Ищем по номеру с заменой 870/770
    if (digitsOnly.startsWith('870')) {
      const searchPhone = `+770${digitsOnly.slice(3)}`;
      const driverBy870 = readDriversFromJson().find(d => d.phone === searchPhone);
      if (driverBy870) {
        console.log(`✅ Водитель найден по 870→770: ${driverBy870.name}`);
        return driverBy870;
      }
    } else if (digitsOnly.startsWith('770')) {
      const searchPhone = `+870${digitsOnly.slice(3)}`;
      const driverBy770 = readDriversFromJson().find(d => d.phone === searchPhone);
      if (driverBy770) {
        console.log(`✅ Водитель найден по 770→870: ${driverBy770.name}`);
        return driverBy770;
      }
    }
    
    console.log('❌ Водитель не найден');
    return null;
    
  } catch (error) {
    console.error('Ошибка при поиске водителя:', error);
    return null;
  }
}

function appendDriverToJson(entry: { name: string; phone: string; carNumber: string; carType: string }) {
  try {
    const drivers = readDriversFromJson();
    
    // Добавляем нового водителя
    const newDriver = {
      id: drivers.length + 1,
      name: entry.name,
      phone: entry.phone,
      carNumber: entry.carNumber,
      carType: entry.carType
    };
    
    drivers.push(newDriver);
    
    // Сохраняем обратно в JSON
    fs.writeFileSync(driversFile, JSON.stringify(drivers, null, 2), 'utf8');
    console.log('✅ Новый водитель добавлен в JSON:', newDriver.name);
  } catch (error) {
    console.error('❌ Ошибка при добавлении водителя в JSON:', error);
  }
}

// ===== Админские функции для управления водителями =====
function getAllDrivers(): Array<{ id: number; name: string; phone: string; carNumber: string; carType: string }> {
  return readDriversFromJson();
}

function deleteDriverById(driverId: number): boolean {
  try {
    const drivers = readDriversFromJson();
    const initialCount = drivers.length;
    
    const filteredDrivers = drivers.filter(driver => driver.id !== driverId);
    
    if (filteredDrivers.length === initialCount) {
      console.log(`❌ Водитель с ID ${driverId} не найден`);
      return false;
    }
    
    // Пересчитываем ID для оставшихся водителей
    const updatedDrivers = filteredDrivers.map((driver, index) => ({
      ...driver,
      id: index + 1
    }));
    
    fs.writeFileSync(driversFile, JSON.stringify(updatedDrivers, null, 2), 'utf8');
    console.log(`✅ Водитель с ID ${driverId} удален. Осталось водителей: ${updatedDrivers.length}`);
    return true;
  } catch (error) {
    console.error('❌ Ошибка при удалении водителя:', error);
    return false;
  }
}

function updateDriverById(driverId: number, updates: Partial<{ name: string; phone: string; carNumber: string; carType: string }>): boolean {
  try {
    const drivers = readDriversFromJson();
    const driverIndex = drivers.findIndex(driver => driver.id === driverId);
    
    if (driverIndex === -1) {
      console.log(`❌ Водитель с ID ${driverId} не найден`);
      return false;
    }
    
    // Обновляем данные водителя
    drivers[driverIndex] = {
      ...drivers[driverIndex],
      ...updates
    };
    
    fs.writeFileSync(driversFile, JSON.stringify(drivers, null, 2), 'utf8');
    console.log(`✅ Водитель с ID ${driverId} обновлен`);
    return true;
  } catch (error) {
    console.error('❌ Ошибка при обновлении водителя:', error);
    return false;
  }
}

function getDriverById(driverId: number): { id: number; name: string; phone: string; carNumber: string; carType: string } | null {
  const drivers = readDriversFromJson();
  return drivers.find(driver => driver.id === driverId) || null;
}

// ===== Функции для админского меню управления водителями =====
async function sendDriversManagementMenu(chatId: number) {
  const keyboard = {
    inline_keyboard: [
      [{ text: '👥 Список всех водителей', callback_data: 'admin_list_drivers' }],
      [{ text: '➕ Добавить водителя', callback_data: 'admin_add_driver' }],
      [{ text: '✏️ Редактировать водителя', callback_data: 'admin_edit_driver' }],
      [{ text: '🗑️ Удалить водителя', callback_data: 'admin_delete_driver' }],
      [{ text: '📊 Статистика водителей', callback_data: 'admin_drivers_stats' }],
      [{ text: '⬅️ Назад к админке', callback_data: 'back_to_admin' }]
    ]
  };
  
  await sendTelegramMessage(chatId, '🚛 <b>Управление водителями</b>\n\nВыберите действие:', keyboard);
}

async function sendDriversList(chatId: number) {
  const drivers = getAllDrivers();
  
  if (drivers.length === 0) {
    await sendTelegramMessage(chatId, '📋 <b>Список водителей</b>\n\nВ базе нет водителей.');
    return NextResponse.json({ success: true });
  }
  
  let message = `📋 <b>Список всех водителей</b>\n\nВсего водителей: ${drivers.length}\n\n`;
  
  drivers.forEach((driver, index) => {
    message += `${index + 1}. <b>${driver.name}</b>\n`;
    message += `   📱 ${driver.phone}\n`;
    message += `   🚗 ${driver.carNumber}\n`;
    message += `   🚛 ${driver.carType}\n`;
    message += `   🆔 ID: ${driver.id}\n\n`;
  });
  
  const keyboard = {
    inline_keyboard: [
      [{ text: '⬅️ Назад к управлению', callback_data: 'admin_manage_drivers' }]
    ]
  };
  
  await sendTelegramMessage(chatId, message, keyboard);
}

async function sendAddDriverForm(chatId: number) {
  const keyboard = {
    keyboard: [
      ['⬅️ Назад к управлению']
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  };
  
  await sendTelegramMessage(chatId, '➕ <b>Добавление нового водителя</b>\n\nВведите имя водителя:', keyboard);
  
  // Устанавливаем состояние для добавления водителя
  const userId = chatId.toString();
  const userStates = loadUserStates();
  if (!userStates[userId]) userStates[userId] = {};
  userStates[userId].adminStep = 'add_driver_name';
  saveUserStates(userStates);
}

async function sendEditDriverForm(chatId: number) {
  const drivers = getAllDrivers();
  
  if (drivers.length === 0) {
    await sendTelegramMessage(chatId, '❌ Нет водителей для редактирования.');
    return NextResponse.json({ success: true });
  }
  
  // Создаем кнопки для каждого водителя
  const keyboard = {
    inline_keyboard: [
      ...drivers.map(driver => [{
        text: `${driver.name} (${driver.phone})`,
        callback_data: `admin_edit_driver_${driver.id}`
      }]),
      [{ text: '⬅️ Назад к управлению', callback_data: 'admin_manage_drivers' }]
    ]
  };
  
  await sendTelegramMessage(chatId, '✏️ <b>Редактирование водителя</b>\n\nВыберите водителя для редактирования:', keyboard);
}

async function sendDeleteDriverForm(chatId: number) {
  const drivers = getAllDrivers();
  
  if (drivers.length === 0) {
    await sendTelegramMessage(chatId, '❌ Нет водителей для удаления.');
    return NextResponse.json({ success: true });
  }
  
  // Создаем кнопки для каждого водителя
  const keyboard = {
    inline_keyboard: [
      ...drivers.map(driver => [{
        text: `🗑️ ${driver.name} (${driver.phone})`,
        callback_data: `admin_delete_driver_${driver.id}`
      }]),
      [{ text: '⬅️ Назад к управлению', callback_data: 'admin_manage_drivers' }]
    ]
  };
  
  await sendTelegramMessage(chatId, '🗑️ <b>Удаление водителя</b>\n\n⚠️ Внимание! Это действие нельзя отменить!\n\nВыберите водителя для удаления:', keyboard);
}

async function sendDriversStats(chatId: number) {
  const drivers = getAllDrivers();
  
  if (drivers.length === 0) {
    await sendTelegramMessage(chatId, '📊 <b>Статистика водителей</b>\n\nВ базе нет водителей.');
    return NextResponse.json({ success: true });
  }
  
  // Группируем по типу ТС
  const carTypeStats: { [key: string]: number } = {};
  drivers.forEach(driver => {
    carTypeStats[driver.carType] = (carTypeStats[driver.carType] || 0) + 1;
  });
  
  let message = `📊 <b>Статистика водителей</b>\n\n`;
  message += `👥 Всего водителей: ${drivers.length}\n\n`;
  message += `<b>По типам ТС:</b>\n`;
  
  Object.entries(carTypeStats).forEach(([carType, count]) => {
    message += `🚛 ${carType}: ${count}\n`;
  });
  
  const keyboard = {
    inline_keyboard: [
      [{ text: '⬅️ Назад к управлению', callback_data: 'admin_manage_drivers' }]
    ]
  };
  
  await sendTelegramMessage(chatId, message, keyboard);
}

// ===== Функции для редактирования и удаления водителей =====
async function startEditDriver(chatId: number, driverId: number) {
  const driver = getDriverById(driverId);
  if (!driver) {
    await sendTelegramMessage(chatId, '❌ Водитель не найден.');
    return NextResponse.json({ success: true });
  }
  
  const keyboard = {
    keyboard: [
      ['⬅️ Назад к управлению']
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  };
  
  let message = `✏️ <b>Редактирование водителя</b>\n\n<b>Текущие данные:</b>\n`;
  message += `👤 Имя: ${driver.name}\n`;
  message += `📱 Телефон: ${driver.phone}\n`;
  message += `🚗 Номер авто: ${driver.carNumber}\n`;
  message += `🚛 Тип ТС: ${driver.carType}\n\n`;
  message += `Введите новые данные в формате:\n`;
  message += `<code>Имя;Телефон;Номер авто;Тип ТС</code>\n\n`;
  message += `Например:\n`;
  message += `<code>Нурбек;+77054060674;А123БВ01;Фура 20т</code>`;
  
  await sendTelegramMessage(chatId, message, keyboard);
  
  // Устанавливаем состояние для редактирования
  const userId = chatId.toString();
  if (!userStates[userId]) userStates[userId] = {};
  userStates[userId].adminStep = 'edit_driver';
  userStates[userId].editingDriverId = driverId;
  saveUserStates(userStates);
}

async function confirmDeleteDriver(chatId: number, driverId: number) {
  const driver = getDriverById(driverId);
  if (!driver) {
    await sendTelegramMessage(chatId, '❌ Водитель не найден.');
    return NextResponse.json({ success: true });
  }
  
  const keyboard = {
    inline_keyboard: [
      [{ text: '🗑️ Да, удалить', callback_data: `confirm_delete_driver_${driverId}` }],
      [{ text: '❌ Отмена', callback_data: 'admin_manage_drivers' }]
    ]
  };
  
  let message = `🗑️ <b>Подтверждение удаления</b>\n\n`;
  message += `Вы действительно хотите удалить водителя?\n\n`;
  message += `👤 Имя: ${driver.name}\n`;
  message += `📱 Телефон: ${driver.phone}\n`;
  message += `🚗 Номер авто: ${driver.carNumber}\n`;
  message += `🚛 Тип ТС: ${driver.carType}\n\n`;
  message += `⚠️ <b>Это действие нельзя отменить!</b>`;
  
  await sendTelegramMessage(chatId, message, keyboard);
}

async function sendAdminMenu(chatId: number) {
  const keyboard = {
    inline_keyboard: [
      [{ text: '📦 Создать заказ', callback_data: 'create_order' }],
      [{ text: '📋 Активные заказы', callback_data: 'list_orders' }],
      [{ text: '👥 Водители', callback_data: 'list_drivers' }],
      [{ text: '🚛 Управление водителями', callback_data: 'admin_manage_drivers' }],
      [{ text: '📊 Аналитика', callback_data: 'show_analytics' }],
      [{ text: '⬅️ Назад', callback_data: 'back_main' }]
    ]
  };

  await sendTelegramMessage(chatId, '✅ Панель сотрудника:', keyboard);
}

// ===== Обработка состояний админки =====
async function handleAdminStep(userId: number, chatId: number, text: string, userState: UserState, userStates: Record<string, UserState>) {
  if (userState.adminStep === 'add_driver_name') {
    userState.adminStep = 'add_driver_phone';
    userState.tempDriverName = text;
    userStates[userId] = userState;
    saveUserStates(userStates);
    await sendTelegramMessage(chatId, 'Введите номер телефона водителя:');
  } else if (userState.adminStep === 'add_driver_phone') {
    userState.adminStep = 'add_driver_car_number';
    userState.tempDriverPhone = text;
    userStates[userId] = userState;
    saveUserStates(userStates);
    await sendTelegramMessage(chatId, 'Введите номер автомобиля водителя:');
  } else if (userState.adminStep === 'add_driver_car_number') {
    userState.adminStep = 'add_driver_car_type';
    userState.tempDriverCarNumber = text;
    userStates[userId] = userState;
    saveUserStates(userStates);
    await sendTelegramMessage(chatId, 'Введите тип автомобиля водителя:');
  } else if (userState.adminStep === 'add_driver_car_type') {
    // Сохраняем нового водителя
    const newDriver = {
      name: userState.tempDriverName!,
      phone: userState.tempDriverPhone!,
      carNumber: userState.tempDriverCarNumber!,
      carType: text
    };
    
    appendDriverToJson(newDriver);
    
    // Очищаем временные данные
    delete userState.adminStep;
    delete userState.tempDriverName;
    delete userState.tempDriverPhone;
    delete userState.tempDriverCarNumber;
    userStates[userId] = userState;
    saveUserStates(userStates);
    
    await sendTelegramMessage(chatId, `✅ Водитель ${newDriver.name} успешно добавлен!`);
    await sendDriversManagementMenu(chatId);
  } else if (userState.adminStep === 'edit_driver') {
    // Парсим данные в формате "Имя;Телефон;Номер авто;Тип ТС"
    const parts = text.split(';');
    if (parts.length === 4) {
      const [name, phone, carNumber, carType] = parts.map(p => p.trim());
      const driverId = userState.editingDriverId!;
      
      const success = updateDriverById(driverId, { name, phone, carNumber, carType });
      
      if (success) {
        await sendTelegramMessage(chatId, `✅ Водитель ${name} успешно обновлен!`);
      } else {
        await sendTelegramMessage(chatId, '❌ Ошибка при обновлении водителя.');
      }
      
      // Очищаем состояние
      delete userState.adminStep;
      delete userState.editingDriverId;
      userStates[userId] = userState;
      saveUserStates(userStates);
      
      await sendDriversManagementMenu(chatId);
    } else {
      await sendTelegramMessage(chatId, '❌ Неверный формат. Используйте формат: Имя;Телефон;Номер авто;Тип ТС');
    }
  }
}

// ===== Helper функции =====
function getStatusText(status: string): string {
  switch (status) {
    case 'created': return 'Создан';
    case 'assigned': return 'Назначен водителю';
    case 'in_transit': return 'В пути';
    case 'warehouse': return 'На складе';
    case 'delivered': return 'Доставлен';
    case 'delayed': return 'Задержка';
    case 'cancelled': return 'Отменен';
    default: return 'Неизвестно';
  }
}

// ===== Функции уведомлений в реальном времени =====
interface NotificationSubscriber {
  id: string;
  chatId: number;
  lastNotification: Date;
  filters: {
    driverId?: number;
    orderUpdates?: boolean;
    newOrders?: boolean;
    systemAlerts?: boolean;
  };
}

let notificationSubscribers: NotificationSubscriber[] = [];
let notificationHistory: Array<{
  id: string;
  type: string;
  message: string;
  timestamp: Date;
  data?: any;
}> = [];

// Функция подписки на уведомления
function subscribeToNotifications(chatId: number, driverId?: number): string {
  const subscriberId = `sub_${chatId}_${Date.now()}`;

  // Удаляем существующую подписку для этого чата
  notificationSubscribers = notificationSubscribers.filter(sub => sub.chatId !== chatId);

  const subscriber: NotificationSubscriber = {
    id: subscriberId,
    chatId,
    lastNotification: new Date(),
    filters: {
      driverId,
      orderUpdates: true,
      newOrders: true,
      systemAlerts: true
    }
  };

  notificationSubscribers.push(subscriber);
  return subscriberId;
}

// Функция отписки от уведомлений
function unsubscribeFromNotifications(chatId: number): void {
  notificationSubscribers = notificationSubscribers.filter(sub => sub.chatId !== chatId);
}

// Функция отправки уведомления всем подписчикам
async function broadcastNotification(type: string, message: string, data?: any, targetDriverId?: number): Promise<void> {
  const notificationId = `notif_${Date.now()}`;
  const notification = {
    id: notificationId,
    type,
    message,
    timestamp: new Date(),
    data
  };

  // Сохраняем в историю
  notificationHistory.push(notification);

  // Ограничим историю последними 100 уведомлениями
  if (notificationHistory.length > 100) {
    notificationHistory = notificationHistory.slice(-100);
  }

  // Отправляем уведомления подписчикам
  for (const subscriber of notificationSubscribers) {
    // Проверяем фильтры
    if (targetDriverId && subscriber.filters.driverId && subscriber.filters.driverId !== targetDriverId) {
      continue; // Пропускаем если это уведомление для конкретного водителя
    }

    if (type === 'new_order' && !subscriber.filters.newOrders) continue;
    if (type === 'order_update' && !subscriber.filters.orderUpdates) continue;
    if (type === 'system' && !subscriber.filters.systemAlerts) continue;

    try {
      let notificationText = '';

      switch (type) {
        case 'new_order':
          notificationText = `🚨 <b>НОВЫЙ ЗАКАЗ!</b>\n\n${message}`;
          break;
        case 'order_update':
          notificationText = `📍 <b>Обновление заказа</b>\n\n${message}`;
          break;
        case 'system':
          notificationText = `ℹ️ <b>Системное уведомление</b>\n\n${message}`;
          break;
        default:
          notificationText = message;
      }

      // Отправляем через Telegram
      await sendTelegramMessage(subscriber.chatId, notificationText);

      // Обновляем время последней отправки
      subscriber.lastNotification = new Date();
    } catch (error) {
      console.error(`Ошибка отправки уведомления подписчику ${subscriber.id}:`, error);
    }
  }
}

// Функция для управления подписками
async function showNotificationSettings(chatId: number, driverId?: number): Promise<void> {
  const existingSubscriber = notificationSubscribers.find(sub => sub.chatId === chatId);

  let message = `🔔 <b>Настройки уведомлений</b>\n\n`;

  if (existingSubscriber) {
    message += `✅ Уведомления <b>включены</b>\n\n`;
    message += `<b>Фильтры:</b>\n`;
    message += `📦 Новые заказы: ${existingSubscriber.filters.newOrders ? '✅' : '❌'}\n`;
    message += `📍 Обновления заказов: ${existingSubscriber.filters.orderUpdates ? '✅' : '❌'}\n`;
    message += `⚙️ Системные оповещения: ${existingSubscriber.filters.systemAlerts ? '✅' : '❌'}\n`;
  } else {
    message += `❌ Уведомления <b>отключены</b>\n\n`;
    message += `Включите уведомления, чтобы получать:\n`;
    message += `• Новые заказы в реальном времени\n`;
    message += `• Обновления статуса заказов\n`;
    message += `• Системные оповещения\n`;
  }

  const keyboard = {
    inline_keyboard: [
      existingSubscriber
        ? [
            { text: '🔕 Отключить уведомления', callback_data: 'disable_notifications' },
            { text: '⚙️ Настроить фильтры', callback_data: 'configure_filters' }
          ]
        : [
            { text: '🔔 Включить уведомления', callback_data: 'enable_notifications' }
          ],
      [{ text: '⬅️ Назад', callback_data: 'back_main' }]
    ]
  };

  await sendTelegramMessage(chatId, message, keyboard);
}

// ===== Функции аналитики =====
function getAnalyticsData() {
  const orders = loadOrders();
  const drivers = loadDrivers();

  const allOrders = Object.values(orders);
  const allDrivers = Object.values(drivers).filter(d => d.status === 'active');

  // Статистика заказов
  const totalOrders = allOrders.length;
  const activeOrders = allOrders.filter(o => o.status === 'active').length;
  const completedOrders = allOrders.filter(o => o.status === 'delivered').length;
  const inTransitOrders = allOrders.filter(o => ['assigned', 'in_transit'].includes(o.status)).length;

  // Статистика водителей
  const totalDrivers = allDrivers.length;
  const driversWithOrders = allDrivers.filter(d => d.totalOrders > 0).length;
  const avgRating = allDrivers.length > 0
    ? allDrivers.reduce((sum, d) => sum + d.clientRating, 0) / allDrivers.length
    : 0;

  // Популярные маршруты
  const routes = allOrders.reduce((acc, order) => {
    const route = `${order.from} → ${order.to}`;
    acc[route] = (acc[route] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topRoutes = Object.entries(routes)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5);

  // Статистика по типам ТС
  const carTypes = allDrivers.reduce((acc, driver) => {
    acc[driver.carType] = (acc[driver.carType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Финансовая статистика
  const totalRevenue = allOrders
    .filter(o => o.status === 'delivered')
    .reduce((sum, o) => sum + (o.finalPrice || 0), 0);

  const avgOrderValue = completedOrders > 0 ? totalRevenue / completedOrders : 0;

  return {
    orders: {
      total: totalOrders,
      active: activeOrders,
      completed: completedOrders,
      inTransit: inTransitOrders,
      completionRate: totalOrders > 0 ? (completedOrders / totalOrders * 100).toFixed(1) : 0
    },
    drivers: {
      total: totalDrivers,
      active: driversWithOrders,
      avgRating: avgRating.toFixed(1),
      utilizationRate: totalDrivers > 0 ? (driversWithOrders / totalDrivers * 100).toFixed(1) : 0
    },
    routes: topRoutes,
    carTypes: Object.entries(carTypes).sort(([,a], [,b]) => b - a),
    finance: {
      totalRevenue: totalRevenue.toLocaleString(),
      avgOrderValue: avgOrderValue.toFixed(0),
      currency: 'тенге'
    },
    period: {
      start: allOrders.length > 0 ? new Date(Math.min(...allOrders.map(o => new Date(o.createdAt).getTime()))).toLocaleDateString('ru-RU') : 'Нет данных',
      end: new Date().toLocaleDateString('ru-RU')
    }
  };
}

async function showAnalytics(chatId: number) {
  const analytics = getAnalyticsData();

  let message = `📊 <b>Аналитика Velta Trans</b>\n\n`;

  // Заказы
  message += `<b>📦 Заказы:</b>\n`;
  message += `Всего: ${analytics.orders.total}\n`;
  message += `Активных: ${analytics.orders.active}\n`;
  message += `Завершенных: ${analytics.orders.completed}\n`;
  message += `В пути: ${analytics.orders.inTransit}\n`;
  message += `Успешность: ${analytics.orders.completionRate}%\n\n`;

  // Водители
  message += `<b>🚛 Водители:</b>\n`;
  message += `Всего: ${analytics.drivers.total}\n`;
  message += `Активных: ${analytics.drivers.active}\n`;
  message += `Средний рейтинг: ⭐ ${analytics.drivers.avgRating}\n`;
  message += `Загруженность: ${analytics.drivers.utilizationRate}%\n\n`;

  // Финансы
  message += `<b>💰 Финансы:</b>\n`;
  message += `Общая выручка: ${analytics.finance.totalRevenue} ${analytics.finance.currency}\n`;
  message += `Средний чек: ${analytics.finance.avgOrderValue} ${analytics.finance.currency}\n\n`;

  // Популярные маршруты
  message += `<b>🗺️ Популярные маршруты:</b>\n`;
  analytics.routes.slice(0, 3).forEach(([route, count], index) => {
    message += `${index + 1}. ${route}: ${count} заказов\n`;
  });
  message += '\n';

  // Типы ТС
  message += `<b>🚛 Типы ТС:</b>\n`;
  analytics.carTypes.slice(0, 3).forEach(([carType, count], index) => {
    message += `${index + 1}. ${carType}: ${count} водителей\n`;
  });

  const keyboard = {
    inline_keyboard: [
      [{ text: '📈 Детальная статистика', callback_data: 'detailed_analytics' }],
      [{ text: '📊 Статистика водителей', callback_data: 'drivers_analytics' }],
      [{ text: '💰 Финансовая аналитика', callback_data: 'finance_analytics' }],
      [{ text: '⬅️ Назад', callback_data: 'back_main' }]
    ]
  };

  await sendTelegramMessage(chatId, message, keyboard);
}

async function showDetailedAnalytics(chatId: number) {
  const analytics = getAnalyticsData();

  let message = `📈 <b>Детальная аналитика</b>\n\n`;

  message += `<b>📅 Период анализа:</b>\n`;
  message += `с ${analytics.period.start} по ${analytics.period.end}\n\n`;

  message += `<b>📦 Детализация заказов:</b>\n`;
  message += `• Создано: ${analytics.orders.total}\n`;
  message += `• В работе: ${analytics.orders.active + analytics.orders.inTransit}\n`;
  message += `• Доставлено: ${analytics.orders.completed}\n`;
  message += `• Конверсия: ${analytics.orders.completionRate}%\n\n`;

  message += `<b>🚛 Детализация водителей:</b>\n`;
  message += `• Всего зарегистрировано: ${analytics.drivers.total}\n`;
  message += `• Выполняют заказы: ${analytics.drivers.active}\n`;
  message += `• Коэффициент использования: ${analytics.drivers.utilizationRate}%\n`;
  message += `• Средняя оценка: ⭐ ${analytics.drivers.avgRating}\n\n`;

  message += `<b>🗺️ Все маршруты:</b>\n`;
  analytics.routes.forEach(([route, count]) => {
    message += `• ${route}: ${count}\n`;
  });

  const keyboard = {
    inline_keyboard: [
      [{ text: '⬅️ К общей аналитике', callback_data: 'show_analytics' }]
    ]
  };

  await sendTelegramMessage(chatId, message, keyboard);
}

async function showDriversAnalytics(chatId: number) {
  const drivers = loadDrivers();
  const activeDrivers = Object.values(drivers).filter(d => d.status === 'active');

  if (activeDrivers.length === 0) {
    await sendTelegramMessage(chatId, '📊 <b>Статистика водителей</b>\n\nНет активных водителей для анализа.');
    return NextResponse.json({ success: true });
  }

  // Сортируем по количеству выполненных заказов
  activeDrivers.sort((a, b) => b.completedOrders - a.completedOrders);

  let message = `📊 <b>Статистика водителей</b>\n\n`;
  message += `Всего активных водителей: ${activeDrivers.length}\n\n`;

  message += `<b>🏆 Топ по выполненным заказам:</b>\n`;
  activeDrivers.slice(0, 5).forEach((driver, index) => {
    const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📍';
    message += `${medal} ${driver.name}\n`;
    message += `   ✅ ${driver.completedOrders} заказов\n`;
    message += `   ⭐ ${driver.clientRating.toFixed(1)} (${driver.clientRatingCount} оценок)\n`;
    message += `   🚛 ${driver.carType}\n\n`;
  });

  // Статистика по типам ТС
  const carTypeStats = activeDrivers.reduce((acc, driver) => {
    acc[driver.carType] = (acc[driver.carType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  message += `<b>🚛 Распределение по типам ТС:</b>\n`;
  Object.entries(carTypeStats).forEach(([carType, count]) => {
    message += `• ${carType}: ${count} водителей\n`;
  });

  const keyboard = {
    inline_keyboard: [
      [{ text: '⬅️ К общей аналитике', callback_data: 'show_analytics' }]
    ]
  };

  await sendTelegramMessage(chatId, message, keyboard);
}

async function showFinanceAnalytics(chatId: number) {
  const analytics = getAnalyticsData();
  const orders = loadOrders();
  const completedOrders = Object.values(orders).filter(o => o.status === 'delivered');

  let message = `💰 <b>Финансовая аналитика</b>\n\n`;

  message += `<b>💵 Общие показатели:</b>\n`;
  message += `Общая выручка: ${analytics.finance.totalRevenue} ${analytics.finance.currency}\n`;
  message += `Средний чек: ${analytics.finance.avgOrderValue} ${analytics.finance.currency}\n`;
  message += `Количество транзакций: ${completedOrders.length}\n\n`;

  if (completedOrders.length > 0) {
    // Анализ по диапазонам цен
    const priceRanges = {
      'до 50к': completedOrders.filter(o => o.finalPrice < 50000).length,
      '50к-100к': completedOrders.filter(o => o.finalPrice >= 50000 && o.finalPrice < 100000).length,
      '100к-200к': completedOrders.filter(o => o.finalPrice >= 100000 && o.finalPrice < 200000).length,
      '200к-500к': completedOrders.filter(o => o.finalPrice >= 200000 && o.finalPrice < 500000).length,
      '500к+': completedOrders.filter(o => o.finalPrice >= 500000).length
    };

    message += `<b>📊 Распределение по суммам:</b>\n`;
    Object.entries(priceRanges).forEach(([range, count]) => {
      if (count > 0) {
        const percentage = ((count / completedOrders.length) * 100).toFixed(1);
        message += `• ${range}: ${count} заказов (${percentage}%)\n`;
      }
    });
  }

  const keyboard = {
    inline_keyboard: [
      [{ text: '⬅️ К общей аналитике', callback_data: 'show_analytics' }]
    ]
  };

  await sendTelegramMessage(chatId, message, keyboard);
}

function getStatusIcon(status: string): string {
  switch (status) {
    case 'created': return '📝';
    case 'assigned': return '👤';
    case 'in_transit': return '🚛';
    case 'warehouse': return '🏭';
    case 'delivered': return '✅';
    case 'delayed': return '⚠️';
    case 'cancelled': return '❌';
    default: return '❓';
  }
}

// ===== Функции для работы с рейтингами =====
async function showDriverRating(chatId: number, driverId: number) {
  const drivers = loadDrivers();
  const driver = drivers[driverId];

  if (!driver) {
    await sendTelegramMessage(chatId, '❌ Водитель не найден.');
    return NextResponse.json({ success: true });
  }

  let message = `⭐ <b>Рейтинг водителя</b>\n\n`;
  message += `👤 <b>${driver.name}</b>\n`;
  message += `📱 ${driver.phone}\n`;
  message += `🚛 ${driver.carNumber} (${driver.carType})\n\n`;

  message += `<b>📊 Статистика:</b>\n`;
  message += `⭐ Средний рейтинг: ${driver.clientRating > 0 ? driver.clientRating.toFixed(1) : 'Нет оценок'}\n`;
  message += `📈 Всего заказов: ${driver.totalOrders}\n`;
  message += `✅ Завершенных: ${driver.completedOrders}\n`;
  message += `📝 Оценок: ${driver.clientRatingCount}\n\n`;

  const successRate = driver.totalOrders > 0 ? ((driver.completedOrders / driver.totalOrders) * 100).toFixed(1) : 0;
  message += `🎯 Успешность: ${successRate}%\n\n`;

  message += `<b>🏆 Уровень:</b>\n`;
  if (driver.clientRating >= 4.5) message += '👑 Мастер';
  else if (driver.clientRating >= 4.0) message += '🥇 Профессионал';
  else if (driver.clientRating >= 3.5) message += '🥈 Опытный';
  else if (driver.clientRating >= 3.0) message += '🥉 Надежный';
  else if (driver.clientRating > 0) message += '🔰 Начинающий';
  else message += '📈 Без рейтинга';

  await sendTelegramMessage(chatId, message);
}

async function showTopDrivers(chatId: number, limit: number = 10) {
  const drivers = loadDrivers();
  const activeDrivers = Object.values(drivers).filter(d => d.status === 'active' && d.clientRating > 0);

  if (activeDrivers.length === 0) {
    await sendTelegramMessage(chatId, '📋 <b>Топ водителей</b>\n\nВодители еще не имеют оценок.');
    return NextResponse.json({ success: true });
  }

  // Сортируем по рейтингу и количеству заказов
  activeDrivers.sort((a, b) => {
    if (a.clientRating !== b.clientRating) {
      return b.clientRating - a.clientRating;
    }
    return b.completedOrders - a.completedOrders;
  });

  let message = `🏆 <b>Топ ${Math.min(limit, activeDrivers.length)} водителей</b>\n\n`;

  activeDrivers.slice(0, limit).forEach((driver, index) => {
    const medal = index === 0 ? '��' : index === 1 ? '🥈' : index === 2 ? '🥉' : '📍';
    message += `${medal} <b>${driver.name}</b>\n`;
    message += `   ⭐ ${driver.clientRating.toFixed(1)} (${driver.clientRatingCount} оценок)\n`;
    message += `   ✅ ${driver.completedOrders} заказов\n`;
    message += `   🚛 ${driver.carType}\n\n`;
  });

  const keyboard = {
    inline_keyboard: [
      [{ text: '📊 Подробная статистика', callback_data: 'driver_stats' }],
      [{ text: '⬅️ Назад', callback_data: 'back_main' }]
    ]
  };

  await sendTelegramMessage(chatId, message, keyboard);
}

async function requestOrderRating(chatId: number, orderId: string, isDriverRating: boolean = false) {
  const orders = loadOrders();
  const order = orders[orderId];

  if (!order) {
    await sendTelegramMessage(chatId, '❌ Заказ не найден.');
    return NextResponse.json({ success: true });
  }

  const userStates = loadUserStates();
  const userId = chatId.toString();

  if (isDriverRating) {
    // Водитель оценивает клиента
    if (!userStates[userId] || !userStates[userId].driverAuthed) {
      await sendTelegramMessage(chatId, '❌ Только водители могут оценивать клиентов.');
      return NextResponse.json({ success: true });
    }

    userStates[userId] = {
      ...userStates[userId],
      ratingOrderId: orderId,
      ratingType: 'client_rating'
    };
    saveUserStates(userStates);

    const keyboard = {
      inline_keyboard: [
        [
          { text: '⭐⭐⭐⭐⭐', callback_data: 'rate_5' },
          { text: '⭐⭐⭐⭐', callback_data: 'rate_4' }
        ],
        [
          { text: '⭐⭐⭐', callback_data: 'rate_3' },
          { text: '⭐⭐', callback_data: 'rate_2' },
          { text: '⭐', callback_data: 'rate_1' }
        ],
        [{ text: '❌ Пропустить', callback_data: 'skip_rating' }]
      ]
    };

    await sendTelegramMessage(chatId,
      `⭐ <b>Оцените клиента</b>\n\n` +
      `Заказ: <code>${order.trackingNumber}</code>\n` +
      `Маршрут: ${order.from} → ${order.to}\n\n` +
      `Пожалуйста, оцените работу с клиентом:`,
      keyboard
    );
  } else {
    // Клиент оценивает водителя
    userStates[userId] = {
      ...userStates[userId],
      ratingOrderId: orderId,
      ratingType: 'driver_rating'
    };
    saveUserStates(userStates);

    const keyboard = {
      inline_keyboard: [
        [
          { text: '⭐⭐⭐⭐⭐', callback_data: 'rate_5' },
          { text: '⭐⭐⭐⭐', callback_data: 'rate_4' }
        ],
        [
          { text: '⭐⭐⭐', callback_data: 'rate_3' },
          { text: '⭐⭐', callback_data: 'rate_2' },
          { text: '⭐', callback_data: 'rate_1' }
        ],
        [{ text: '❌ Пропустить', callback_data: 'skip_rating' }]
      ]
    };

    await sendTelegramMessage(chatId,
      `⭐ <b>Оцените водителя</b>\n\n` +
      `Заказ: <code>${order.trackingNumber}</code>\n` +
      `Маршрут: ${order.from} → ${order.to}\n\n` +
      `Пожалуйста, оцените работу водителя:`,
      keyboard
    );
  }
}

async function processRating(chatId: number, rating: number, userStates: Record<string, UserState>) {
  const userId = chatId.toString();
  const userState = userStates[userId];

  if (!userState || !userState.ratingOrderId) {
    await sendTelegramMessage(chatId, '❌ Ошибка: заказ для оценки не найден.');
    return NextResponse.json({ success: true });
  }

  const orderId = userState.ratingOrderId;
  const ratingType = userState.ratingType;

  const orders = loadOrders();
  const order = orders[orderId];

  if (!order) {
    await sendTelegramMessage(chatId, '❌ Заказ не найден.');
    return NextResponse.json({ success: true });
  }

  if (ratingType === 'driver_rating') {
    // Обновляем рейтинг водителя
    order.driverRating = rating;

    const drivers = loadDrivers();
    if (order.assignedDriver && drivers[order.assignedDriver]) {
      const driver = drivers[order.assignedDriver];

      // Обновляем статистику водителя
      driver.totalOrders += 1;
      if (order.status === 'delivered') {
        driver.completedOrders += 1;
      }

      // Пересчитываем средний рейтинг
      const oldRatingSum = driver.clientRating * driver.clientRatingCount;
      driver.clientRatingCount += 1;
      driver.clientRating = (oldRatingSum + rating) / driver.clientRatingCount;

      saveDrivers(drivers);
    }

    await sendTelegramMessage(chatId, `✅ Спасибо за оценку!\n\nВы поставили водителю ${'⭐'.repeat(rating)} (${rating}/5)`);
  } else if (ratingType === 'client_rating') {
    // Обновляем рейтинг клиента (сохраняем в заказе)
    order.clientRating = rating;
    await sendTelegramMessage(chatId, `✅ Спасибо за оценку!\n\nВы оценили клиента на ${'⭐'.repeat(rating)} (${rating}/5)`);
  }

  saveOrders(orders);

  // Очищаем состояние
  delete userState.ratingOrderId;
  delete userState.ratingType;
  userStates[userId] = userState;
  saveUserStates(userStates);
}

// Функция для показа активных заказов водителя
async function showDriverActiveOrders(chatId: number, driverId: number) {
  try {
    const orders = loadOrders();
    const driverOrders = Object.values(orders).filter(order =>
      order.assignedDriver === driverId &&
      ['assigned', 'in_transit', 'warehouse', 'delayed'].includes(order.status)
    );

    if (driverOrders.length === 0) {
      await sendTelegramMessage(chatId, '📋 <b>Активные заказы</b>\n\nУ вас нет активных заказов в данный момент.');
      return NextResponse.json({ success: true });
    }

    let message = `📋 <b>Активные заказы</b>\n\nУ вас ${driverOrders.length} активных заказов:\n\n`;
    
    driverOrders.forEach((order, index) => {
      const statusText = getStatusText(order.status);
      const statusIcon = getStatusIcon(order.status);
      
      message += `${index + 1}. <b>${order.trackingNumber}</b>\n`;
      message += `   📍 ${order.route.from} → ${order.route.to}\n`;
      message += `   📦 ${order.description}\n`;
      message += `   ⚖️ ${order.weight} кг, ${order.volume} м³\n`;
      message += `   💰 ${order.price} ${order.currency}\n`;
      message += `   ${statusIcon} ${statusText}\n`;
      message += `   📅 Срок: ${new Date(order.deadline).toLocaleDateString('ru-RU')}\n\n`;
    });

    const keyboard = {
      inline_keyboard: [
        [{ text: '📍 Обновить статус', callback_data: 'update_order_status' }],
        [{ text: '⬅️ Назад', callback_data: 'back_driver_menu' }]
      ]
    };

    await sendTelegramMessage(chatId, message, keyboard);
  } catch (error) {
    console.error('Ошибка при показе активных заказов:', error);
    await sendTelegramMessage(chatId, '❌ Ошибка при загрузке заказов. Попробуйте позже.');
  }
}

// Функция для показа закрытых заказов водителя
async function showDriverClosedOrders(chatId: number, driverId: number) {
  try {
    const orders = loadOrders();
    const driverOrders = Object.values(orders).filter(order =>
      order.assignedDriver === driverId &&
      ['delivered', 'cancelled'].includes(order.status)
    );

    if (driverOrders.length === 0) {
      await sendTelegramMessage(chatId, '📚 <b>Закрытые заказы</b>\n\nУ вас нет завершенных заказов.');
      return NextResponse.json({ success: true });
    }

    let message = `📚 <b>Закрытые заказы</b>\n\nУ вас ${driverOrders.length} завершенных заказов:\n\n`;
    
    driverOrders.forEach((order, index) => {
      const statusText = getStatusText(order.status);
      const statusIcon = getStatusIcon(order.status);
      const completionDate = order.routePoints && order.routePoints.length > 0 
        ? new Date(order.routePoints[order.routePoints.length - 1].timestamp).toLocaleDateString('ru-RU')
        : 'Не указана';
      
      message += `${index + 1}. <b>${order.trackingNumber}</b>\n`;
      message += `   📍 ${order.route.from} → ${order.route.to}\n`;
      message += `   📦 ${order.description}\n`;
      message += `   💰 ${order.price} ${order.currency}\n`;
      message += `   ${statusIcon} ${statusText}\n`;
      message += `   ✅ Завершен: ${completionDate}\n\n`;
    });

    const keyboard = {
      inline_keyboard: [
        [{ text: '📋 Активные заказы', callback_data: 'view_active_orders' }],
        [{ text: '⬅️ Назад', callback_data: 'back_driver_menu' }]
      ]
    };

    await sendTelegramMessage(chatId, message, keyboard);
  } catch (error) {
    console.error('Ошибка при показе закрытых заказов:', error);
    await sendTelegramMessage(chatId, '❌ Ошибка при загрузке заказов. Попробуйте позже.');
  }
}

// Функция для показа доступных заказов (для всех водителей)
async function showAvailableOrders(chatId: number) {
  try {
    const orders = loadOrders();
    const availableOrders = Object.values(orders).filter(order =>
      order.status === 'active' && !order.assignedDriver
    );

    if (availableOrders.length === 0) {
      await sendTelegramMessage(chatId, '📋 <b>Доступные заказы</b>\n\nВ данный момент нет доступных заказов.');
      return NextResponse.json({ success: true });
    }

    let message = `📋 <b>Доступные заказы</b>\n\nДоступно ${availableOrders.length} заказов:\n\n`;

    availableOrders.forEach((order, index) => {
      message += `${index + 1}. <b>${order.trackingNumber}</b>\n`;
      message += `   📍 ${order.from} → ${order.to}\n`;
      message += `   📦 ${order.description}\n`;
      message += `   ⚖️ ${order.weight} кг, ${order.volume} м³\n`;
      message += `   💰 ${order.finalPrice} тенге\n`;
      message += `   📅 Создан: ${new Date(order.createdAt).toLocaleDateString('ru-RU')}\n\n`;
    });

    const keyboard = {
      inline_keyboard: [
        [{ text: '🔄 Обновить список', callback_data: 'refresh_available_orders' }],
        [{ text: '⬅️ Назад', callback_data: 'back_driver_menu' }]
      ]
    };

    await sendTelegramMessage(chatId, message, keyboard);
  } catch (error) {
    console.error('Ошибка при показе доступных заказов:', error);
    await sendTelegramMessage(chatId, '❌ Ошибка при загрузке заказов. Попробуйте позже.');
  }
}