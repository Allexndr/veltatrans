import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = '8414818778:AAG2QXqDu0WKwsClyMt5CpbpLQBL3QLVWUE';
const TELEGRAM_CHANNEL_ID = '-1002999769930';

interface OrderNotification {
  orderId: string;
  customerName: string;
  fromCity: string;
  toCity: string;
  cargoType: string;
  weight: string;
  volume: string;
  shipmentType: string;
  phone: string;
  urgency: 'low' | 'medium' | 'high';
  specialRequirements?: string;
}

async function sendTelegramMessage(chatId: string | number, text: string, replyMarkup?: object) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  const payload = {
    chat_id: chatId,
    text,
    parse_mode: 'HTML',
    ...replyMarkup && { reply_markup: replyMarkup }
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      console.error('Telegram API error:', await response.text());
      return null;
    }
    
    return response.json();
  } catch (error) {
    console.error('Error sending message:', error);
    return null;
  }
}

function getUrgencyEmoji(urgency: string): string {
  switch (urgency) {
    case 'high': return '🔴';
    case 'medium': return '🟡';
    case 'low': return '🟢';
    default: return '⚪';
  }
}

function getShipmentTypeEmoji(type: string): string {
  switch (type) {
    case 'auto': return '🚛';
    case 'railway': return '🚂';
    case 'multimodal': return '🔄';
    case 'project': return '🏗️';
    default: return '📦';
  }
}

export async function POST(request: NextRequest) {
  try {
    const { type, data } = await request.json();

    if (type === 'new_order') {
      const order: OrderNotification = data;
      
      const urgencyEmoji = getUrgencyEmoji(order.urgency);
      const shipmentEmoji = getShipmentTypeEmoji(order.shipmentType);
      
      const orderMessage = `
${urgencyEmoji} <b>НОВЫЙ ЗАКАЗ</b> ${shipmentEmoji}

📋 <b>ID заказа:</b> ${order.orderId}
👤 <b>Клиент:</b> ${order.customerName}
📞 <b>Телефон:</b> ${order.phone}

🛣️ <b>Маршрут:</b>
📍 Откуда: ${order.fromCity}
📍 Куда: ${order.toCity}

📦 <b>Груз:</b>
• Тип: ${order.cargoType}
• Вес: ${order.weight}
• Объем: ${order.volume}

🚛 <b>Тип перевозки:</b> ${order.shipmentType === 'auto' ? 'Автомобильные' : 
  order.shipmentType === 'railway' ? 'Железнодорожные' :
  order.shipmentType === 'multimodal' ? 'Мультимодальные' : 'Проектные'}

${order.specialRequirements ? `⚠️ <b>Особые требования:</b> ${order.specialRequirements}` : ''}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}

<i>Водители могут откликнуться через бота</i>
      `;

      // Отправляем в канал
      const result = await sendTelegramMessage(TELEGRAM_CHANNEL_ID, orderMessage);
      
      return NextResponse.json({ 
        success: !!result,
        message_id: result?.result?.message_id 
      });
    }

    if (type === 'calculation_request') {
      const calc = data;
      
      const calcMessage = `
📊 <b>ЗАПРОС НА РАСЧЕТ</b>

👤 <b>Клиент:</b> ${calc.senderName}
📞 <b>Телефон:</b> ${calc.phone}

🛣️ <b>Маршрут:</b>
📍 ${calc.fromCity} → ${calc.toCity}

📦 <b>Параметры груза:</b>
• Вес: ${calc.weight} кг
• Объем: ${calc.volume} м³
• Тип: ${calc.cargoType || 'Не указан'}

🚛 <b>Тип перевозки:</b> ${calc.shipmentType === 'auto' ? 'Автомобильные' : 
  calc.shipmentType === 'railway' ? 'Железнодорожные' :
  calc.shipmentType === 'multimodal' ? 'Мультимодальные' : 'Проектные'}

${calc.isOversized ? '⚠️ Негабаритный груз' : ''}
${calc.isDangerous ? '☢️ Опасный груз' : ''}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}

<i>❗ Требуется ответ в течение 1 часа</i>
      `;

      const result = await sendTelegramMessage(TELEGRAM_CHANNEL_ID, calcMessage);
      
      return NextResponse.json({ 
        success: !!result,
        message_id: result?.result?.message_id 
      });
    }

    if (type === 'contact_form') {
      const contact = data;
      
      const contactMessage = `
📧 <b>НОВОЕ ОБРАЩЕНИЕ</b>

👤 <b>Имя:</b> ${contact.name}
📞 <b>Телефон:</b> ${contact.phone}
📧 <b>Email:</b> ${contact.email}

💬 <b>Сообщение:</b>
${contact.message}

⏰ <b>Время:</b> ${new Date().toLocaleString('ru-RU')}
      `;

      const result = await sendTelegramMessage(TELEGRAM_CHANNEL_ID, contactMessage);
      
      return NextResponse.json({ 
        success: !!result,
        message_id: result?.result?.message_id 
      });
    }

    return NextResponse.json({ error: 'Unknown notification type' }, { status: 400 });
  } catch (error) {
    console.error('Notification error:', error);
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

    const result = await sendTelegramMessage(TELEGRAM_CHANNEL_ID, testMessage);
    
    return NextResponse.json({
      success: !!result,
      test_sent: true,
      channel_id: TELEGRAM_CHANNEL_ID
    });
  } catch (error) {
    console.error('Test error:', error);
    return NextResponse.json({ error: 'Test failed' }, { status: 500 });
  }
}