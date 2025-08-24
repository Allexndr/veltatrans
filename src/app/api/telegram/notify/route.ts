import { NextRequest, NextResponse } from 'next/server';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8414818778:AAG2QXqDu0WKwsClyMt5CpbpLQBL3QLVWUE';
const CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID || '-1002999769930';

// Отправка сообщения в Telegram
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

// POST - отправка уведомления
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;

    let message = '';
    let replyMarkup;

    switch (type) {
      case 'new_order':
        message = `📦 <b>Новый заказ!</b>

<b>Номер ТТН:</b> ${data.trackingNumber}
<b>Клиент:</b> ${data.clientName}
<b>Маршрут:</b> ${data.from} → ${data.to}
<b>Тип ТС:</b> ${data.carType}
<b>Описание:</b> ${data.description}
<b>Вес:</b> ${data.weight} кг
<b>Объем:</b> ${data.volume} м³

Заказ автоматически разослан подходящим водителям.`;

        replyMarkup = {
          inline_keyboard: [
            [{ text: '👁️ Просмотреть заказ', callback_data: `view_order_${data.id}` }],
            [{ text: '📊 Статистика', callback_data: 'stats' }]
          ]
        };
        break;

      case 'location_update':
        message = `📍 <b>Обновление местоположения</b>

<b>Номер ТТН:</b> ${data.trackingNumber}
<b>Местоположение:</b> ${data.location}
<b>Статус:</b> ${data.status}
<b>Время:</b> ${new Date().toLocaleString('ru-RU')}

Водитель обновил информацию о грузе.`;

        replyMarkup = {
          inline_keyboard: [
            [{ text: '🗺️ Показать на карте', callback_data: `map_${data.trackingNumber}` }],
            [{ text: '📱 Связаться с водителем', callback_data: `contact_driver_${data.driverId}` }]
          ]
        };
        break;

      case 'driver_bid':
        message = `💰 <b>Новая ставка от водителя!</b>

<b>Заказ:</b> ${data.orderId}
<b>Водитель:</b> ${data.driverName}
<b>Телефон:</b> ${data.driverPhone}
<b>Номер авто:</b> ${data.carNumber}
<b>Цена:</b> ${data.price} тенге
<b>Местоположение:</b> ${data.location}
<b>Дата погрузки:</b> ${data.loadingDate}

Выберите действие:`;

        replyMarkup = {
          inline_keyboard: [
            [{ text: '✅ Принять', callback_data: `accept_bid_${data.bidId}` }],
            [{ text: '❌ Отклонить', callback_data: `reject_bid_${data.bidId}` }],
            [{ text: '📞 Позвонить', callback_data: `call_${data.driverPhone}` }]
          ]
        };
        break;

      case 'order_completed':
        message = `✅ <b>Заказ завершен!</b>

<b>Номер ТТН:</b> ${data.trackingNumber}
<b>Маршрут:</b> ${data.from} → ${data.to}
<b>Водитель:</b> ${data.driverName}
<b>Финальная цена:</b> ${data.finalPrice} тенге
<b>Время завершения:</b> ${new Date().toLocaleString('ru-RU')}

Груз успешно доставлен получателю.`;

        replyMarkup = {
          inline_keyboard: [
            [{ text: '📊 Отчет', callback_data: `report_${data.trackingNumber}` }],
            [{ text: '⭐ Оценить', callback_data: `rate_${data.trackingNumber}` }]
          ]
        };
        break;

      default:
        message = `ℹ️ <b>Уведомление</b>

${data.message || 'Новое уведомление от системы'}`;
    }

    // Отправляем сообщение в канал
    const result = await sendTelegramMessage(CHANNEL_ID, message, replyMarkup);

    if (result.ok) {
      return NextResponse.json({ success: true, message: 'Notification sent successfully' });
    } else {
      return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
    }

  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// Тестовая отправка
export async function GET() {
  try {
    const testMessage = `
🤖 <b>ТЕСТ СИСТЕМЫ УВЕДОМЛЕНИЙ</b>

✅ Telegram бот работает
✅ Webhook настроен  
✅ Канал подключен

⏰ ${new Date().toLocaleString('ru-RU')}
    `;

    const result = await sendTelegramMessage(CHANNEL_ID, testMessage);
    
    return NextResponse.json({
      success: !!result,
      test_sent: true,
      channel_id: CHANNEL_ID
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}