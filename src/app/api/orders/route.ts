import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8414818778:AAG2QXqDu0WKwsClyMt5CpbpLQBL3QLVWUE';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002999769930';

// Пути к файлам данных
const dataDir = path.join(process.cwd(), 'data');
const ordersFile = path.join(dataDir, 'orders.json');
const driversFile = path.join(dataDir, 'drivers.json');

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

interface Driver {
  id: number;
  name: string;
  phone: string;
  carNumber: string;
  carType: string;
  registeredAt: string;
  status: 'active' | 'inactive';
}

// Убеждаемся что папка data существует
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, '{}');
}

if (!fs.existsSync(driversFile)) {
  fs.writeFileSync(driversFile, '{}');
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

// Генерация номера заказа в формате: WTID_водителя-номер_заказа
function generateTrackingNumber(driverId: number, orderId: string): string {
  return `WT${driverId}-${orderId}`;
}

function loadDrivers(): Record<string, Driver> {
  try {
    return JSON.parse(fs.readFileSync(driversFile, 'utf8'));
  } catch (e) {
    return {};
  }
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

// GET - получить список заказов
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const trackingNumber = searchParams.get('tracking');
    
    const orders = loadOrders();
    
    // Поиск по номеру отслеживания
    if (trackingNumber) {
      const order = Object.values(orders).find(o => o.trackingNumber === trackingNumber);
      if (order) {
        return NextResponse.json({
          success: true,
          order: {
            id: order.id,
            from: order.from,
            to: order.to,
            status: order.status,
            trackingNumber: order.trackingNumber,
            createdAt: order.createdAt,
            assignedDriver: order.assignedDriver,
            finalPrice: order.finalPrice
          }
        });
      } else {
        return NextResponse.json({
          success: false,
          message: 'Заказ не найден'
        }, { status: 404 });
      }
    }
    
    // Фильтрация по статусу
    let filteredOrders = Object.values(orders);
    if (status) {
      filteredOrders = filteredOrders.filter(order => order.status === status);
    }
    
    return NextResponse.json({
      success: true,
      orders: filteredOrders.map(order => ({
        id: order.id,
        from: order.from,
        to: order.to,
        carType: order.carType,
        description: order.description,
        status: order.status,
        createdAt: order.createdAt,
        bidsCount: order.bids.length,
        trackingNumber: order.trackingNumber,
        finalPrice: order.finalPrice
      }))
    });
  } catch (error) {
    console.error('Error getting orders:', error);
    return NextResponse.json({
      success: false,
      message: 'Ошибка сервера'
    }, { status: 500 });
  }
}

// POST - создать новый заказ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, carType, description, source } = body;
    
    // Валидация
    if (!from || !to || !carType || !description) {
      return NextResponse.json({
        success: false,
        message: 'Все поля обязательны для заполнения'
      }, { status: 400 });
    }
    
    // Создаем заказ
    const orderId = Date.now().toString();
    const orders = loadOrders();
    
    const newOrder: Order = {
      id: orderId,
      from,
      to,
      carType,
      description,
      createdAt: new Date().toISOString(),
      status: 'active',
      bids: []
    };
    
    orders[orderId] = newOrder;
    saveOrders(orders);
    
    // Отправляем заказ водителям
    await broadcastOrderToDrivers(orderId, newOrder);
    
    // Уведомляем в канал о новом заказе
    const sourceText = source === 'calculator' ? '(из калькулятора сайта)' : '(из формы сайта)';
    await sendTelegramMessage(CHANNEL_ID, `📦 <b>Новый заказ с сайта!</b> ${sourceText}

<b>ID заказа:</b> ${orderId}
<b>Маршрут:</b> ${from} → ${to}
<b>Тип ТС:</b> ${carType}
<b>Описание:</b> ${description}

Заказ автоматически разослан подходящим водителям.`);
    
    return NextResponse.json({
      success: true,
      message: 'Заказ создан и отправлен водителям',
      orderId: orderId
    });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({
      success: false,
      message: 'Ошибка при создании заказа'
    }, { status: 500 });
  }
}

// PUT - обновить заказ
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, status, trackingNumber } = body;
    
    if (!orderId) {
      return NextResponse.json({
        success: false,
        message: 'ID заказа обязателен'
      }, { status: 400 });
    }
    
    const orders = loadOrders();
    
    if (!orders[orderId]) {
      return NextResponse.json({
        success: false,
        message: 'Заказ не найден'
      }, { status: 404 });
    }
    
    // Обновляем заказ
    if (status) {
      orders[orderId].status = status;
    }
    
    if (trackingNumber) {
      orders[orderId].trackingNumber = trackingNumber;
    }
    
    saveOrders(orders);
    
    return NextResponse.json({
      success: true,
      message: 'Заказ обновлен'
    });
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({
      success: false,
      message: 'Ошибка при обновлении заказа'
    }, { status: 500 });
  }
}

