import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Пути к файлам данных
const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data', 'velta-data');
const ordersFile = path.join(dataDir, 'orders.json');

interface TestOrder {
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
  route: any[];
  clientPhone: string;
  clientEmail: string;
}

// Генерация случайного номера ТТН
function generateTrackingNumber(): string {
  const prefix = 'WT';
  const numbers = Math.floor(Math.random() * 900000) + 100000;
  return `${prefix}${numbers}`;
}

// Генерация случайных координат для маршрута
function generateRoute(from: string, to: string, status: string) {
  const baseRoutes = {
    'Алматы-Москва': [
      { lat: 43.2381, lng: 76.9452, location: 'Алматы', status: 'created', description: 'Заказ создан и принят к перевозке' },
      { lat: 43.8256, lng: 87.6168, location: 'Урумчи', status: 'in_transit', description: 'Груз в пути, прошел таможенный контроль' },
      { lat: 55.7558, lng: 37.6176, location: 'Москва', status: 'in_transit', description: 'Груз в пути, приближается к месту назначения' }
    ],
    'Шанхай-Астана': [
      { lat: 31.2304, lng: 121.4737, location: 'Шанхай', status: 'created', description: 'Заказ создан и принят к перевозке' },
      { lat: 43.8256, lng: 87.6168, location: 'Урумчи', status: 'in_transit', description: 'Груз в пути, прошел таможенный контроль' },
      { lat: 51.1694, lng: 71.4491, location: 'Астана', status: 'in_transit', description: 'Груз в пути, приближается к месту назначения' }
    ],
    'Гуанчжоу-Санкт-Петербург': [
      { lat: 23.1291, lng: 113.2644, location: 'Гуанчжоу', status: 'created', description: 'Заказ создан и принят к перевозке' },
      { lat: 55.7558, lng: 37.6176, location: 'Москва', status: 'in_transit', description: 'Груз в пути, прошел таможенный контроль' },
      { lat: 59.9311, lng: 30.3609, location: 'Санкт-Петербург', status: 'in_transit', description: 'Груз в пути, приближается к месту назначения' }
    ]
  };

  const routeKey = `${from}-${to}`;
  const baseRoute = baseRoutes[routeKey as keyof typeof baseRoutes] || baseRoutes['Алматы-Москва'];
  
  // Добавляем временные метки
  return baseRoute.map((point, index) => ({
    ...point,
    timestamp: new Date(Date.now() - (baseRoute.length - 1 - index) * 24 * 60 * 60 * 1000).toISOString()
  }));
}

// POST - создание тестовых данных
export async function POST() {
  try {
    const testOrders: TestOrder[] = [
      {
        id: Date.now().toString(),
        trackingNumber: 'WT123456',
        clientName: 'ООО "Торговый Дом"',
        from: 'Алматы',
        to: 'Москва',
        carType: 'tent',
        description: 'Электроника и бытовая техника',
        weight: 1500,
        volume: 8,
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'in_transit',
        assignedDriver: 1,
        finalPrice: 75000,
        bids: [
          {
            driverId: 1,
            driverName: 'Тестовый водитель',
            driverPhone: '+7 700 123 45 67',
            carNumber: 'А123БВ01',
            price: 75000,
            location: 'Алматы',
            loadingDate: '2024-02-15',
            timestamp: new Date().toISOString()
          }
        ],
        route: generateRoute('Алматы', 'Москва', 'in_transit'),
        clientPhone: '+7 700 123 45 67',
        clientEmail: 'info@torgdom.kz'
      },
      {
        id: (Date.now() + 1).toString(),
        trackingNumber: 'WT789012',
        clientName: 'ИП Иванов',
        from: 'Шанхай',
        to: 'Астана',
        carType: 'refrigerator',
        description: 'Свежие овощи и фрукты',
        weight: 2000,
        volume: 12,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'assigned',
        assignedDriver: 2,
        finalPrice: 95000,
        bids: [
          {
            driverId: 2,
            driverName: 'Иван Петров',
            driverPhone: '+7 700 234 56 78',
            carNumber: 'В456ГД02',
            price: 95000,
            location: 'Шанхай',
            loadingDate: '2024-02-20',
            timestamp: new Date().toISOString()
          }
        ],
        route: generateRoute('Шанхай', 'Астана', 'assigned'),
        clientPhone: '+7 700 234 56 78',
        clientEmail: 'ivanov@example.com'
      },
      {
        id: (Date.now() + 2).toString(),
        trackingNumber: 'WT345678',
        clientName: 'ООО "СтройМаркет"',
        from: 'Гуанчжоу',
        to: 'Санкт-Петербург',
        carType: 'flatbed',
        description: 'Строительные материалы',
        weight: 5000,
        volume: 25,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'created',
        assignedDriver: undefined,
        finalPrice: undefined,
        bids: [
          {
            driverId: 3,
            driverName: 'Алексей Сидоров',
            driverPhone: '+7 700 345 67 89',
            carNumber: 'Е789ЖЗ03',
            price: 120000,
            location: 'Гуанчжоу',
            loadingDate: '2024-02-25',
            timestamp: new Date().toISOString()
          }
        ],
        route: generateRoute('Гуанчжоу', 'Санкт-Петербург', 'created'),
        clientPhone: '+7 700 345 67 89',
        clientEmail: 'stroy@example.com'
      },
      {
        id: (Date.now() + 3).toString(),
        trackingNumber: 'WT901234',
        clientName: 'ООО "ТехноСервис"',
        from: 'Алматы',
        to: 'Москва',
        carType: 'container',
        description: 'Промышленное оборудование',
        weight: 3000,
        volume: 15,
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'delivered',
        assignedDriver: 4,
        finalPrice: 85000,
        bids: [
          {
            driverId: 4,
            driverName: 'Дмитрий Козлов',
            driverPhone: '+7 700 456 78 90',
            carNumber: 'И012КЛ04',
            price: 85000,
            location: 'Алматы',
            loadingDate: '2024-02-18',
            timestamp: new Date().toISOString()
          }
        ],
        route: [
          { lat: 43.2381, lng: 76.9452, location: 'Алматы', status: 'created', description: 'Заказ создан и принят к перевозке', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
          { lat: 43.8256, lng: 87.6168, location: 'Урумчи', status: 'in_transit', description: 'Груз в пути, прошел таможенный контроль', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
          { lat: 55.7558, lng: 37.6176, location: 'Москва', status: 'delivered', description: 'Груз доставлен получателю', timestamp: new Date().toISOString() }
        ],
        clientPhone: '+7 700 456 78 90',
        clientEmail: 'tech@example.com'
      }
    ];

    // Сохраняем тестовые заказы
    fs.writeFileSync(ordersFile, JSON.stringify(testOrders, null, 2));

    return NextResponse.json({ 
      success: true, 
      message: 'Тестовые данные созданы',
      ordersCount: testOrders.length,
      orders: testOrders.map(order => ({
        id: order.id,
        trackingNumber: order.trackingNumber,
        status: order.status,
        from: order.from,
        to: order.to
      }))
    });

  } catch (error) {
    console.error('Error creating test data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// GET - получение списка тестовых заказов
export async function GET() {
  try {
    if (!fs.existsSync(ordersFile)) {
      return NextResponse.json({ error: 'Orders file not found' }, { status: 404 });
    }

    const ordersData = fs.readFileSync(ordersFile, 'utf8');
    const orders = JSON.parse(ordersData);
    
    return NextResponse.json({
      success: true,
      ordersCount: orders.length,
      orders: orders.map((order: any) => ({
        id: order.id,
        trackingNumber: order.trackingNumber,
        status: order.status,
        from: order.from,
        to: order.to,
        clientName: order.clientName,
        assignedDriver: order.assignedDriver
      }))
    });

  } catch (error) {
    console.error('Error getting test data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
