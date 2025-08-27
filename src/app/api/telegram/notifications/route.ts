import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/mongodb';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8414818778:AAG2QXqDu0WKwsClyMt5CpbpLQBL3QLVWUE';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002999769930';

// Send message to Telegram
async function sendTelegramMessage(chatId: string, text: string, keyboard?: any) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
  const body: any = {
    chat_id: chatId,
    text: text,
    parse_mode: 'HTML'
  };
  
  if (keyboard) {
    body.reply_markup = keyboard;
  }
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      console.error('Telegram API error:', await response.text());
    }
    
    return response.ok;
  } catch (error) {
    console.error('Error sending Telegram message:', error);
    return false;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, userId, message, data } = body;
    
    const db = await getDb();
    const notificationsCollection = db.collection('notifications');
    
    let sent = false;
    let notificationData = {
      type,
      message,
      data,
      timestamp: new Date().toISOString(),
      sent: false
    };
    
    switch (type) {
      case 'driver_registered':
        // Notify channel about new driver
        if (CHANNEL_ID) {
          sent = await sendTelegramMessage(CHANNEL_ID, 
            `🚗 Новый водитель зарегистрирован!\n\n` +
            `Имя: ${data.name}\n` +
            `Автомобиль: ${data.carNumber}\n` +
            `Время: ${new Date().toLocaleString('ru-RU')}`
          );
        }
        break;
        
      case 'order_created':
        // Notify channel about new order
        if (CHANNEL_ID) {
          sent = await sendTelegramMessage(CHANNEL_ID,
            `📦 Новый заказ!\n\n` +
            `Маршрут: ${data.from} → ${data.to}\n` +
            `Описание: ${data.description}\n` +
            `Время: ${new Date().toLocaleString('ru-RU')}`
          );
        }
        break;
        
      case 'order_completed':
        // Notify client and channel
        if (userId) {
          sent = await sendTelegramMessage(userId.toString(),
            `✅ Заказ завершен!\n\n` +
            `Маршрут: ${data.from} → ${data.to}\n` +
            `Время доставки: ${data.deliveryTime}\n` +
            `Оцените водителя: /rate_driver_${data.orderId}`
          );
        }
        
        if (CHANNEL_ID) {
          await sendTelegramMessage(CHANNEL_ID,
            `🎉 Заказ завершен!\n\n` +
            `Маршрут: ${data.from} → ${data.to}\n` +
            `Водитель: ${data.driverName}\n` +
            `Время: ${new Date().toLocaleString('ru-RU')}`
          );
        }
        break;
        
      case 'driver_rating':
        // Notify driver about new rating
        if (userId) {
          sent = await sendTelegramMessage(userId.toString(),
            `⭐ Новая оценка!\n\n` +
            `Ваш рейтинг: ${data.rating}/5\n` +
            `Комментарий: ${data.comment || 'Без комментария'}\n` +
            `Заказ: ${data.from} → ${data.to}`
          );
        }
        break;
        
      case 'system_alert':
        // Send system alert to channel
        if (CHANNEL_ID) {
          sent = await sendTelegramMessage(CHANNEL_ID,
            `🚨 Системное уведомление\n\n${message}`
          );
        }
        break;
        
      default:
        return NextResponse.json({
          success: false,
          error: 'Unknown notification type'
        }, { status: 400 });
    }
    
    // Store notification in database
    notificationData.sent = sent;
    await notificationsCollection.insertOne(notificationData);
    
    return NextResponse.json({
      success: true,
      sent,
      message: 'Notification processed'
    });
    
  } catch (error) {
    console.error('Notifications error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to send notification'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const db = await getDb();
    const notificationsCollection = db.collection('notifications');
    
    // Get recent notifications
    const notifications = await notificationsCollection
      .find({})
      .sort({ timestamp: -1 })
      .limit(50)
      .toArray();
    
    return NextResponse.json({
      success: true,
      notifications
    });
    
  } catch (error) {
    console.error('Notifications GET error:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch notifications'
    }, { status: 500 });
  }
}
