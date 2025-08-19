import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: false });

export async function POST(request: NextRequest) {
  try {
    const { chatId, trackingNumber, status, location } = await request.json();

    if (!chatId || !trackingNumber) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const statusEmoji = getStatusEmoji(status);
    const message = 
      `${statusEmoji} Обновление по грузу ${trackingNumber}\n\n` +
      `📍 Статус: ${getStatusText(status)}\n` +
      `🌍 Местоположение: ${location}\n` +
      `⏰ Время: ${new Date().toLocaleString('ru-RU')}\n\n` +
      `🔗 Подробнее: https://velta-trans.com/ru/calculator`;

    await bot.sendMessage(chatId, message);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Telegram notification error:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}

function getStatusEmoji(status: string): string {
  switch (status) {
    case 'pending': return '⏳';
    case 'in_transit': return '🚚';
    case 'delivered': return '✅';
    case 'warehouse': return '🏭';
    default: return '📦';
  }
}

function getStatusText(status: string): string {
  switch (status) {
    case 'pending': return 'Ожидает отправки';
    case 'in_transit': return 'В пути';
    case 'delivered': return 'Доставлен';
    case 'warehouse': return 'На складе';
    default: return 'Неизвестный статус';
  }
}

