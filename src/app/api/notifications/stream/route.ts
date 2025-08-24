import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Пути к файлам данных
const dataDir = process.env.DATA_DIR || path.join(process.cwd(), 'data', 'velta-data');
const ordersFile = path.join(dataDir, 'orders.json');

interface NotificationData {
  type: 'location_update' | 'status_change' | 'new_order' | 'driver_assigned';
  data: any;
  timestamp: string;
}

// GET - SSE stream для уведомлений
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const trackingNumber = searchParams.get('tracking');
  const orderId = searchParams.get('orderId');

  if (!trackingNumber && !orderId) {
    return NextResponse.json({ error: 'Missing tracking number or order ID' }, { status: 400 });
  }

  // Создаем SSE stream
  const stream = new ReadableStream({
    start(controller) {
      const sendNotification = (data: NotificationData) => {
        const message = `data: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(new TextEncoder().encode(message));
      };

      // Отправляем начальное уведомление
      sendNotification({
        type: 'status_change',
        data: { message: 'Connected to tracking stream' },
        timestamp: new Date().toISOString()
      });

      // Функция для проверки обновлений каждые 5 секунд
      const checkUpdates = async () => {
        try {
          if (fs.existsSync(ordersFile)) {
            const ordersData = fs.readFileSync(ordersFile, 'utf8');
            const orders = JSON.parse(ordersData);
            
            let targetOrder;
            if (trackingNumber) {
              targetOrder = orders.find((order: any) => order.trackingNumber === trackingNumber);
            } else if (orderId) {
              targetOrder = orders.find((order: any) => order.id === orderId);
            }

            if (targetOrder) {
              // Отправляем текущий статус
              sendNotification({
                type: 'status_change',
                data: {
                  orderId: targetOrder.id,
                  trackingNumber: targetOrder.trackingNumber,
                  status: targetOrder.status,
                  lastLocation: targetOrder.route[targetOrder.route.length - 1]
                },
                timestamp: new Date().toISOString()
              });
            }
          }
        } catch (error) {
          console.error('Error checking updates:', error);
        }
      };

      // Проверяем обновления каждые 5 секунд
      const interval = setInterval(checkUpdates, 5000);
      
      // Очистка при закрытии соединения
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    }
  });
}
