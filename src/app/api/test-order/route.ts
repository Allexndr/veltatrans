import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Пути к файлам данных
const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data', 'velta-data');
const ordersFile = path.join(dataDir, 'orders.json');

// Убеждаемся что папка data существует
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Инициализируем файл orders.json если его нет
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, '[]');
}

interface Order {
  id: string;
  trackingNumber: string;
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

// POST - создание/обновление тестового заказа
export async function POST() {
  try {
    // Создаем тестовый заказ
    const testOrder = {
      id: Date.now().toString(),
      trackingNumber: 'WT123456',
      clientName: 'Тестовый клиент',
      from: 'Алматы',
      to: 'Москва',
      carType: 'tent',
      description: 'Тестовый груз для демонстрации',
      weight: 1000,
      volume: 5,
      createdAt: new Date().toISOString(),
      status: 'in_transit',
      assignedDriver: 1,
      finalPrice: 50000,
      bids: [
        {
          driverId: 1,
          driverName: 'Тестовый водитель',
          driverPhone: '+7 700 123 45 67',
          carNumber: 'А123БВ01',
          price: 50000,
          location: 'Алматы',
          loadingDate: '2024-02-15',
          timestamp: new Date().toISOString()
        }
      ],
      route: [
        {
          lat: 43.2381,
          lng: 76.9452,
          location: 'Алматы',
          status: 'created',
          description: 'Заказ создан и принят к перевозке',
          timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          lat: 43.8256,
          lng: 87.6168,
          location: 'Урумчи',
          status: 'in_transit',
          description: 'Груз в пути, прошел таможенный контроль',
          timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
        },
        {
          lat: 55.7558,
          lng: 37.6176,
          location: 'Москва',
          status: 'in_transit',
          description: 'Груз в пути, приближается к месту назначения',
          timestamp: new Date().toISOString()
        }
      ],
      clientPhone: '+7 700 123 45 67',
      clientEmail: 'test@example.com'
    };

    // Читаем существующие заказы
    let orders: Order[] = [];
    if (fs.existsSync(ordersFile)) {
      const ordersData = fs.readFileSync(ordersFile, 'utf8');
      const parsedData = JSON.parse(ordersData);
      // Убеждаемся что orders это массив
      orders = Array.isArray(parsedData) ? parsedData : [];
    }

    // Проверяем, есть ли уже тестовый заказ
    const existingOrderIndex = orders.findIndex((order: any) => order.trackingNumber === 'WT123456');
    
    if (existingOrderIndex !== -1) {
      // Обновляем существующий заказ
      orders[existingOrderIndex] = testOrder;
    } else {
      // Добавляем новый заказ
      orders.push(testOrder);
    }

    // Сохраняем обновленный список
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Тестовый заказ создан/обновлен',
      order: testOrder 
    });
  } catch (error) {
    console.error('Error creating test order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - получение тестового заказа
export async function GET() {
  try {
    if (!fs.existsSync(ordersFile)) {
      return NextResponse.json({ error: 'Orders file not found' }, { status: 404 });
    }

    const ordersData = fs.readFileSync(ordersFile, 'utf8');
    const orders = JSON.parse(ordersData);
    
    const testOrder = orders.find((order: any) => order.trackingNumber === 'WT123456');
    
    if (!testOrder) {
      return NextResponse.json({ error: 'Test order not found' }, { status: 404 });
    }

    return NextResponse.json(testOrder);
  } catch (error) {
    console.error('Error getting test order:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
