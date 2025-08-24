import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Пути к файлам данных
const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data', 'velta-data');
const ordersFile = path.join(dataDir, 'orders.json');

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
  bids: any[];
  route: RoutePoint[];
  clientPhone: string;
  clientEmail: string;
}

interface RoutePoint {
  lat: number;
  lng: number;
  location: string;
  status: string;
  description: string;
  timestamp: string;
}

// GET - получение информации о грузе по номеру ТТН
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    const { trackingNumber } = await params;
    
    if (!fs.existsSync(ordersFile)) {
      return NextResponse.json({ error: 'Orders file not found' }, { status: 404 });
    }
    
         const ordersData = fs.readFileSync(ordersFile, 'utf8');
    const orders: Order[] = JSON.parse(ordersData);
    
    const order = orders.find(o => o.trackingNumber === trackingNumber);
    
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Формируем ответ для отслеживания
    const trackingInfo = {
      trackingNumber: order.trackingNumber,
      status: order.status,
      from: order.from,
      to: order.to,
      carType: order.carType,
      description: order.description,
      weight: order.weight,
      volume: order.volume,
      createdAt: order.createdAt,
      assignedDriver: order.assignedDriver,
      finalPrice: order.finalPrice,
      route: order.route,
      lastUpdate: order.route.length > 0 ? order.route[order.route.length - 1].timestamp : order.createdAt
    };
    
    return NextResponse.json(trackingInfo);
  } catch (error) {
    console.error('Error getting tracking info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - обновление местоположения груза
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ trackingNumber: string }> }
) {
  try {
    const { trackingNumber } = await params;
    const body = await request.json();
    
    if (!fs.existsSync(ordersFile)) {
      return NextResponse.json({ error: 'Orders file not found' }, { status: 404 });
    }
    
    const ordersData = fs.readFileSync(ordersFile, 'utf8');
    let orders: Order[] = JSON.parse(ordersData);
    
    const orderIndex = orders.findIndex(o => o.trackingNumber === trackingNumber);
    
    if (orderIndex === -1) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }
    
    // Добавляем новую точку маршрута
    const newRoutePoint: RoutePoint = {
      lat: body.lat || 0,
      lng: body.lng || 0,
      location: body.location || '',
      status: body.status || 'in_transit',
      description: body.description || '',
      timestamp: new Date().toISOString()
    };
    
    orders[orderIndex].route.push(newRoutePoint);
    
    // Обновляем статус заказа если передан
    if (body.status) {
      orders[orderIndex].status = body.status;
    }
    
    // Сохраняем обновленный список
    fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
    
    // Отправляем уведомление в Telegram канал
    try {
      await fetch('/api/telegram/notify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'location_update',
          data: {
            trackingNumber,
            location: body.location,
            status: body.status,
            driverId: body.driverId
          }
        })
      });
    } catch (telegramError) {
      console.error('Telegram notification error:', telegramError);
    }
    
    return NextResponse.json({ success: true, routePoint: newRoutePoint });
  } catch (error) {
    console.error('Error updating tracking info:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, { status: 200 });
}
