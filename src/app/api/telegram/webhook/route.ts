import { NextRequest, NextResponse } from 'next/server';
import TelegramBot from 'node-telegram-bot-api';

const bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN || '', { polling: false });

export async function POST(request: NextRequest) {
  try {
    const update = await request.json();
    
    if (update.message) {
      const chatId = update.message.chat.id;
      const text = update.message.text;

      if (text?.startsWith('/start')) {
        await bot.sendMessage(chatId, 
          '🚚 Добро пожаловать в Velta Trans!\n\n' +
          'Я помогу вам отслеживать грузы и получать уведомления.\n\n' +
          'Команды:\n' +
          '📦 /track VT123456 - отследить груз\n' +
          '📞 /contact - связаться с нами\n' +
          '💰 /calculate - рассчитать стоимость'
        );
      } else if (text?.startsWith('/track')) {
        const trackingNumber = text.split(' ')[1];
        if (trackingNumber) {
          // Получаем данные трекинга
          const trackingData = await getTrackingData(trackingNumber);
          if (trackingData) {
            await bot.sendMessage(chatId, 
              `📦 Груз: ${trackingNumber}\n` +
              `📍 Статус: ${trackingData.status}\n` +
              `🌍 Местоположение: ${trackingData.currentLocation}\n` +
              `📅 Обновлено: ${trackingData.lastUpdate}\n\n` +
              `🔗 Подробнее: https://velta-trans.com/ru/calculator`
            );
          } else {
            await bot.sendMessage(chatId, '❌ Груз не найден. Проверьте номер.');
          }
        } else {
          await bot.sendMessage(chatId, '❌ Укажите номер груза: /track VT123456');
        }
      } else if (text?.startsWith('/contact')) {
        await bot.sendMessage(chatId, 
          '📞 Контакты Velta Trans:\n\n' +
          '🌐 Сайт: https://velta-trans.com\n' +
          '📧 Email: info@velta-trans.com\n' +
          '📱 Telegram: @velta_trans\n' +
          '☎️ Телефон: +7 (XXX) XXX-XX-XX'
        );
      } else if (text?.startsWith('/calculate')) {
        await bot.sendMessage(chatId, 
          '💰 Калькулятор стоимости:\n\n' +
          '🔗 https://velta-trans.com/ru/calculator\n\n' +
          'Укажите маршрут, вес и размеры груза для расчета стоимости доставки.'
        );
      } else {
        await bot.sendMessage(chatId, 
          '❓ Не понял команду. Доступные команды:\n\n' +
          '📦 /track - отследить груз\n' +
          '📞 /contact - контакты\n' +
          '💰 /calculate - калькулятор'
        );
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook error:', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}

async function getTrackingData(trackingNumber: string) {
  try {
    // Используем наш API трекинга
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/tracking/${trackingNumber}`);
    if (response.ok) {
      const data = await response.json();
      return {
        status: data.status,
        currentLocation: data.currentLocation,
        lastUpdate: new Date(data.lastUpdate).toLocaleString('ru-RU')
      };
    }
  } catch (error) {
    console.error('Error fetching tracking data:', error);
  }
  return null;
}

