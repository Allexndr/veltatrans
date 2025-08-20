import { NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = '8414818778:AAG2QXqDu0WKwsClyMt5CpbpLQBL3QLVWUE';
const WEBHOOK_URL = 'https://velta-logistics.com/api/telegram/webhook';

async function setupWebhookAutomatically() {
  try {
    // Проверяем текущий webhook
    const webhookInfoResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
    const webhookInfo = await webhookInfoResponse.json();
    
    // Если webhook уже установлен на правильный URL, ничего не делаем
    if (webhookInfo.result?.url === WEBHOOK_URL) {
      return {
        success: true,
        message: 'Webhook уже настроен корректно',
        url: WEBHOOK_URL
      };
    }

    // Устанавливаем webhook
    const setWebhookResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ['message', 'callback_query'],
        drop_pending_updates: true
      }),
    });

    const result = await setWebhookResponse.json();
    
    if (result.ok) {
      // Отправляем тестовое сообщение о запуске
      await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: '-1002999769930',
          text: `🚀 <b>СИСТЕМА ЗАПУЩЕНА</b>\n\n✅ Webhook автоматически настроен\n✅ Бот готов к работе\n✅ Канал подключен\n\n⏰ ${new Date().toLocaleString('ru-RU')}\n\n<i>Водители могут начинать регистрацию: /start</i>`,
          parse_mode: 'HTML'
        }),
      });

      return {
        success: true,
        message: 'Webhook успешно установлен автоматически',
        url: WEBHOOK_URL,
        telegram_response: result
      };
    } else {
      throw new Error(result.description || 'Ошибка установки webhook');
    }
  } catch (error) {
    console.error('Auto-setup error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Неизвестная ошибка',
      url: WEBHOOK_URL
    };
  }
}

export async function GET() {
  const result = await setupWebhookAutomatically();
  
  return NextResponse.json({
    ...result,
    timestamp: new Date().toISOString(),
    bot_username: '@veltatrans_bot'
  });
}

export async function POST() {
  // Принудительная переустановка webhook
  try {
    const setWebhookResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: WEBHOOK_URL,
        allowed_updates: ['message', 'callback_query'],
        drop_pending_updates: true
      }),
    });

    const result = await setWebhookResponse.json();
    
    return NextResponse.json({
      success: result.ok,
      message: result.ok ? 'Webhook принудительно переустановлен' : 'Ошибка установки webhook',
      url: WEBHOOK_URL,
      telegram_response: result
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Ошибка',
    }, { status: 500 });
  }
}
