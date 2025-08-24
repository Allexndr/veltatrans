import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Пути к файлам данных
const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data', 'velta-data');
const ordersFile = path.join(dataDir, 'orders.json');
const driversFile = path.join(dataDir, 'drivers.json');

interface LocationUpdate {
  driverId: number;
  orderId: string;
  lat: number;
  lng: number;
  location: string;
  status: string;
  description: string;
  speed?: number;
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
  status: 'created' | 'assigned' | 'in_transit' | 'warehouse' | 'delivered' | 'delayed' | string;
  assignedDriver?: number;
  finalPrice?: number;
  bids: any[];
  route: RoutePoint[];
  clientPhone: string;
  clientEmail: string;
}

// POST - обновление местоположения водителя
export async function POST(request: NextRequest) {
  try {
    const body: LocationUpdate = await request.json();
    
    if (!body.driverId || !body.orderId || !body.lat || !body.lng) {
      return NextResponse.json({ 
        error: 'Missing required fields: driverId, orderId, lat, lng' 
      }, { status: 400 });
    }

    // Читаем существующие заказы
    if (!fs.existsSync(ordersFile)) {
      return NextResponse.json({ error: 'Orders file not found' }, { status: 404 });
    }

    const ordersData = fs.readFileSync(ordersFile, 'utf8');
    let orders: Order[] = JSON.parse(ordersData);

    // Находим заказ
    const orderIndex = orders.findIndex(order => order.id === body.orderId);
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    const order = orders[orderIndex];

    // Проверяем, что водитель назначен на этот заказ
    if (order.assignedDriver !== body.driverId) {
      return NextResponse.json({ error: 'Driver not assigned to this order' }, { status: 403 });
    }

    // Создаем новую точку маршрута
    const newRoutePoint: RoutePoint = {
      lat: body.lat,
      lng: body.lng,
      location: body.location,
      status: body.status,
      description: body.description,
      timestamp: body.timestamp || new Date().toISOString()
    };

    // Добавляем точку в маршрут
    order.route.push(newRoutePoint);

    // Обновляем статус заказа если нужно
    if (body.status === 'delivered') {
      order.status = 'delivered';
    } else if (body.status === 'warehouse') {
      order.status = 'warehouse';
    } else if (body.status === 'delayed') {
      order.status = 'delayed';
    } else if (body.status !== 'in_transit') {
      // Для кастомных статусов обновляем статус заказа
      order.status = body.status;
    }

    // Сохраняем обновленный заказ
    orders[orderIndex] = order;
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));

    // Отправляем уведомление в Telegram
    try {
      await fetch('/api/telegram/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'location_update',
          data: {
            orderId: order.id,
            trackingNumber: order.trackingNumber,
            driverId: body.driverId,
            location: body.location,
            status: body.status,
            timestamp: newRoutePoint.timestamp
          }
        })
      });
    } catch (telegramError) {
      console.error('Telegram notification error:', telegramError);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Location updated successfully',
      routePoint: newRoutePoint
    });

  } catch (error) {
    console.error('Error updating driver location:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - получение последнего местоположения водителя для заказа
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('orderId');
    const driverId = searchParams.get('driverId');

    if (!orderId || !driverId) {
      return NextResponse.json({ 
        error: 'Missing required parameters: orderId, driverId' 
      }, { status: 400 });
    }

    if (!fs.existsSync(ordersFile)) {
      return NextResponse.json({ error: 'Orders file not found' }, { status: 404 });
    }

    const ordersData = fs.readFileSync(ordersFile, 'utf8');
    const orders: Order[] = JSON.parse(ordersData);

    const order = orders.find(o => o.id === orderId);
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.assignedDriver !== parseInt(driverId)) {
      return NextResponse.json({ error: 'Driver not assigned to this order' }, { status: 403 });
    }

    // Возвращаем последнюю точку маршрута
    const lastLocation = order.route[order.route.length - 1];
    
    return NextResponse.json({
      orderId: order.id,
      trackingNumber: order.trackingNumber,
      lastLocation,
      orderStatus: order.status
    });

  } catch (error) {
    console.error('Error getting driver location:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
