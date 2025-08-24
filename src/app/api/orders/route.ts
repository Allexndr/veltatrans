import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Пути к файлам данных
const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data', 'velta-data');
const ordersFile = path.join(dataDir, 'orders.json');
const driversFile = path.join(dataDir, 'drivers.json');

// Убеждаемся что папка data существует
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Инициализируем файлы если их нет
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, '[]');
}

interface Order {
  id: string;
  trackingNumber: string; // WT123456
  clientName: string;
  from: string;
  to: string;
  carType: string;
  description: string;
  weight: number;
  volume: number;
  createdAt: string;
  status: 'created' | 'assigned' | 'in_transit' | 'warehouse' | 'delivered' | 'delayed';
  assignedDriver?: number;
  finalPrice?: number;
  bids: Bid[];
  route: RoutePoint[];
  clientPhone: string;
  clientEmail: string;
}

interface Bid {
  driverId: number;
  driverName: string;
  driverPhone: string;
  carNumber: string;
  price: number;
  location: string;
  loadingDate: string;
  timestamp: string;
}

interface RoutePoint {
  lat: number;
  lng: number;
  location: string;
  status: string;
  description: string;
  timestamp: string;
}

// Генерация уникального номера ТТН
function generateTrackingNumber(): string {
  const prefix = 'WT';
  const numbers = Math.floor(Math.random() * 900000) + 100000; // 6 цифр
  return `${prefix}${numbers}`;
}

// GET - получение заказов
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const tracking = searchParams.get('tracking');
    const clientBin = searchParams.get('clientBin');
    
    if (!fs.existsSync(ordersFile)) {
      return NextResponse.json({ error: 'Orders file not found' }, { status: 404 });
    }
    
    const ordersData = fs.readFileSync(ordersFile, 'utf8');
    let orders: Order[] = JSON.parse(ordersData);
    
    // Фильтрация по параметрам
    if (tracking) {
      orders = orders.filter(order => order.trackingNumber === tracking);
    }
    
    if (clientBin) {
      // Здесь можно добавить фильтрацию по БИН клиента
      // Пока возвращаем все заказы
    }
    
    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error reading orders:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - создание нового заказа
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const newOrder: Order = {
      id: Date.now().toString(),
      trackingNumber: generateTrackingNumber(),
      clientName: body.clientName || '',
      from: body.from || '',
      to: body.to || '',
      carType: body.carType || 'tent',
      description: body.description || '',
      weight: body.weight || 0,
      volume: body.volume || 0,
      createdAt: new Date().toISOString(),
      status: 'created',
      bids: [],
      route: [],
      clientPhone: body.clientPhone || '',
      clientEmail: body.clientEmail || ''
    };
    
    // Читаем существующие заказы
    let orders: Order[] = [];
    if (fs.existsSync(ordersFile)) {
      const ordersData = fs.readFileSync(ordersFile, 'utf8');
      orders = JSON.parse(ordersData);
    }
    
    // Добавляем новый заказ
    orders.push(newOrder);
    
    // Сохраняем обновленный список
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    
    // Отправляем уведомление в Telegram канал
    try {
      await fetch('/api/telegram/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'new_order',
          data: newOrder
        })
      });
    } catch (telegramError) {
      console.error('Telegram notification error:', telegramError);
    }
    
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - обновление заказа
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId, ...updates } = body;
    
    if (!orderId) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }
    
    if (!fs.existsSync(ordersFile)) {
      return NextResponse.json({ error: 'Orders file not found' }, { status: 404 });
    }
    
    const ordersData = fs.readFileSync(ordersFile, 'utf8');
    let orders: Order[] = JSON.parse(ordersData);
    
    const orderIndex = orders.findIndex(order => order.id === orderId);
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Обновляем заказ
    orders[orderIndex] = { ...orders[orderIndex], ...updates };
    
    // Сохраняем обновленный список
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    
    return NextResponse.json(orders[orderIndex]);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

