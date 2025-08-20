import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = '8414818778:AAG2QXqDu0WKwsClyMt5CpbpLQBL3QLVWUE';
const TELEGRAM_CHANNEL_ID = '-1002999769930';

interface TelegramUpdate {
  update_id: number;
  message?: {
    message_id: number;
    from: {
      id: number;
      is_bot: boolean;
      first_name: string;
      last_name?: string;
      username?: string;
      language_code?: string;
    };
    chat: {
      id: number;
      first_name?: string;
      last_name?: string;
      username?: string;
      type: string;
    };
    date: number;
    text?: string;
    contact?: {
      phone_number: string;
      first_name: string;
      last_name?: string;
      user_id?: number;
    };
  };
  callback_query?: {
    id: string;
    from: {
      id: number;
      first_name: string;
      last_name?: string;
      username?: string;
    };
    message?: {
      message_id: number;
      chat: {
        id: number;
        type: string;
      };
    };
    data?: string;
  };
}

interface DriverData {
  userId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  phone: string;
  registrationDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

// Временное хранилище водителей (в продакшене использовать БД)
const drivers: Map<number, DriverData> = new Map();

async function sendTelegramMessage(chatId: number, text: string, replyMarkup?: object) {
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
    }
    
    return response.json();
  } catch (error) {
    console.error('Error sending message:', error);
  }
}

async function sendToChannel(message: string) {
  return sendTelegramMessage(parseInt(TELEGRAM_CHANNEL_ID), message);
}

function getMainMenuKeyboard() {
  return {
    keyboard: [
      [{ text: '🚛 Регистрация водителя' }],
      [{ text: '📋 Мои заказы' }, { text: '📍 Мой статус' }],
      [{ text: '📞 Поддержка' }, { text: '❓ Помощь' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: false
  };
}

function getContactKeyboard() {
  return {
    keyboard: [
      [{ text: '📱 Поделиться номером', request_contact: true }],
      [{ text: '◀️ Назад' }]
    ],
    resize_keyboard: true,
    one_time_keyboard: true
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: TelegramUpdate = await request.json();
    
    // Обработка обычных сообщений
    if (body.message) {
      const message = body.message;
      const chatId = message.chat.id;
      const text = message.text;
      const userId = message.from.id;

      // Команда /start
      if (text === '/start') {
        const welcomeMessage = `
🚛 <b>Добро пожаловать в Velta Trans!</b>

Система управления заказами для водителей.

<b>Доступные функции:</b>
• Регистрация в системе
• Получение новых заказов  
• Отслеживание статуса
• Связь с диспетчером

Выберите действие из меню ⬇️
        `;
        
        await sendTelegramMessage(chatId, welcomeMessage, { reply_markup: getMainMenuKeyboard() });
        return NextResponse.json({ ok: true });
      }

      // Регистрация водителя
      if (text === '🚛 Регистрация водителя') {
        if (drivers.has(userId)) {
          const driver = drivers.get(userId)!;
          let statusText = '';
          
          switch (driver.status) {
            case 'pending':
              statusText = '⏳ Ваша заявка на рассмотрении';
              break;
            case 'approved':
              statusText = '✅ Вы уже зарегистрированы в системе';
              break;
            case 'rejected':
              statusText = '❌ Ваша заявка отклонена. Обратитесь в поддержку.';
              break;
          }
          
          await sendTelegramMessage(chatId, statusText);
          return NextResponse.json({ ok: true });
        }

        const registrationMessage = `
📝 <b>Регистрация водителя</b>

Для регистрации в системе Velta Trans необходимо поделиться своим номером телефона.

Нажмите кнопку ниже ⬇️
        `;
        
        await sendTelegramMessage(chatId, registrationMessage, { reply_markup: getContactKeyboard() });
        return NextResponse.json({ ok: true });
      }

      // Обработка контакта
      if (message.contact) {
        const contact = message.contact;
        const driverData: DriverData = {
          userId,
          firstName: message.from.first_name,
          lastName: message.from.last_name,
          username: message.from.username,
          phone: contact.phone_number,
          registrationDate: new Date().toISOString(),
          status: 'pending'
        };

        drivers.set(userId, driverData);

        // Уведомление в канал
        const channelMessage = `
🚛 <b>НОВАЯ РЕГИСТРАЦИЯ ВОДИТЕЛЯ</b>

👤 <b>Имя:</b> ${driverData.firstName} ${driverData.lastName || ''}
📞 <b>Телефон:</b> ${driverData.phone}
👨‍💼 <b>Username:</b> ${driverData.username ? '@' + driverData.username : 'Не указан'}
🆔 <b>ID:</b> ${userId}
📅 <b>Дата:</b> ${new Date().toLocaleString('ru-RU')}

<b>Статус:</b> ⏳ Ожидает подтверждения
        `;

        await sendToChannel(channelMessage);

        const confirmationMessage = `
✅ <b>Заявка отправлена!</b>

Ваши данные:
👤 <b>Имя:</b> ${driverData.firstName} ${driverData.lastName || ''}
📞 <b>Телефон:</b> ${driverData.phone}

⏳ <b>Статус:</b> На рассмотрении

Мы свяжемся с вами в ближайшее время для подтверждения регистрации.
        `;

        await sendTelegramMessage(chatId, confirmationMessage, { reply_markup: getMainMenuKeyboard() });
        return NextResponse.json({ ok: true });
      }

      // Мои заказы
      if (text === '📋 Мои заказы') {
        const driver = drivers.get(userId);
        
        if (!driver || driver.status !== 'approved') {
          await sendTelegramMessage(chatId, '❌ Сначала пройдите регистрацию!');
          return NextResponse.json({ ok: true });
        }

        // Заглушка для заказов
        const ordersMessage = `
📋 <b>Ваши заказы</b>

🚛 <b>Активные заказы:</b> 0
📦 <b>В ожидании:</b> 0
✅ <b>Выполнено сегодня:</b> 0

<i>Новые заказы будут появляться здесь автоматически.</i>
        `;

        await sendTelegramMessage(chatId, ordersMessage);
        return NextResponse.json({ ok: true });
      }

      // Мой статус
      if (text === '📍 Мой статус') {
        const driver = drivers.get(userId);
        
        if (!driver) {
          await sendTelegramMessage(chatId, '❌ Сначала пройдите регистрацию!');
          return NextResponse.json({ ok: true });
        }

        let statusText = '';
        let statusEmoji = '';
        
        switch (driver.status) {
          case 'pending':
            statusEmoji = '⏳';
            statusText = 'На рассмотрении';
            break;
          case 'approved':
            statusEmoji = '✅';
            statusText = 'Подтвержден';
            break;
          case 'rejected':
            statusEmoji = '❌';
            statusText = 'Отклонен';
            break;
        }

        const statusMessage = `
📍 <b>Ваш статус</b>

👤 <b>Имя:</b> ${driver.firstName} ${driver.lastName || ''}
📞 <b>Телефон:</b> ${driver.phone}
📅 <b>Регистрация:</b> ${new Date(driver.registrationDate).toLocaleDateString('ru-RU')}

${statusEmoji} <b>Статус:</b> ${statusText}
        `;

        await sendTelegramMessage(chatId, statusMessage);
        return NextResponse.json({ ok: true });
      }

      // Поддержка
      if (text === '📞 Поддержка') {
        const supportMessage = `
📞 <b>Служба поддержки</b>

<b>Контакты диспетчерской:</b>
📱 +77002770006
📱 +77010704011  
📱 +77010704022

<b>Email:</b> info@velta-logistics.com

<b>Режим работы:</b>
🕐 Круглосуточно, 7 дней в неделю

<i>Для экстренных вопросов звоните по указанным номерам.</i>
        `;

        await sendTelegramMessage(chatId, supportMessage);
        return NextResponse.json({ ok: true });
      }

      // Помощь
      if (text === '❓ Помощь') {
        const helpMessage = `
❓ <b>Справка по боту</b>

<b>🚛 Регистрация водителя</b>
Подать заявку на регистрацию в системе

<b>📋 Мои заказы</b>  
Просмотр активных и завершенных заказов

<b>📍 Мой статус</b>
Проверить статус регистрации

<b>📞 Поддержка</b>
Контакты службы поддержки

<b>Как это работает:</b>
1. Пройдите регистрацию
2. Дождитесь подтверждения
3. Получайте заказы в боте
4. Выполняйте и отмечайте статус

<i>По всем вопросам обращайтесь в поддержку.</i>
        `;

        await sendTelegramMessage(chatId, helpMessage);
        return NextResponse.json({ ok: true });
      }

      // Кнопка "Назад"
      if (text === '◀️ Назад') {
        await sendTelegramMessage(chatId, 'Выберите действие:', { reply_markup: getMainMenuKeyboard() });
        return NextResponse.json({ ok: true });
      }

      // Неизвестная команда
      await sendTelegramMessage(chatId, 'Используйте кнопки меню для навигации 👇', { reply_markup: getMainMenuKeyboard() });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ 
    status: 'Telegram bot webhook is running',
    timestamp: new Date().toISOString()
  });
}