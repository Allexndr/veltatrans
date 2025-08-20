// Автоматическая инициализация Telegram бота при старте приложения

const TELEGRAM_BOT_TOKEN = '8414818778:AAG2QXqDu0WKwsClyMt5CpbpLQBL3QLVWUE';
const WEBHOOK_URL = 'https://velta-logistics.com/api/telegram/webhook';
const TELEGRAM_CHANNEL_ID = '-1002999769930';

let initializationAttempted = false;

export async function initializeTelegramBot() {
  // Инициализируем только один раз и только в продакшене
  if (initializationAttempted || process.env.NODE_ENV !== 'production') {
    return;
  }

  initializationAttempted = true;

  try {
    console.log('🤖 Инициализация Telegram бота...');

    // Проверяем информацию о боте
    const botResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
    const botInfo = await botResponse.json();

    if (!botInfo.ok) {
      throw new Error('Неверный токен бота');
    }

    console.log(`✅ Бот подключен: @${botInfo.result.username}`);

    // Проверяем текущий webhook
    const webhookResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
    const webhookInfo = await webhookResponse.json();

    // Если webhook уже установлен правильно, не трогаем его
    if (webhookInfo.result?.url === WEBHOOK_URL) {
      console.log('✅ Webhook уже настроен корректно');
      return;
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

    const webhookResult = await setWebhookResponse.json();

    if (webhookResult.ok) {
      console.log('✅ Webhook установлен успешно');

      // Отправляем уведомление о запуске в канал
      try {
        await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            chat_id: TELEGRAM_CHANNEL_ID,
            text: `🚀 <b>VELTA TRANS - СИСТЕМА ЗАПУЩЕНА</b>

✅ Telegram бот активирован
✅ Webhook настроен автоматически  
✅ Канал подключен
✅ Готов к приему заявок

🤖 <b>Бот:</b> @veltatrans_bot
📢 <b>Канал:</b> ${TELEGRAM_CHANNEL_ID}
🌐 <b>Сайт:</b> velta-logistics.com

⏰ <b>Запущено:</b> ${new Date().toLocaleString('ru-RU')}

<i>Водители могут начинать регистрацию: /start</i>`,
            parse_mode: 'HTML'
          }),
        });
        console.log('✅ Уведомление о запуске отправлено в канал');
      } catch (notificationError) {
        console.error('❌ Ошибка отправки уведомления:', notificationError);
      }
    } else {
      throw new Error(webhookResult.description || 'Ошибка установки webhook');
    }
  } catch (error) {
    console.error('❌ Ошибка инициализации Telegram бота:', error);
  }
}

// Автоматический запуск при импорте в продакшене
if (typeof window === 'undefined' && process.env.NODE_ENV === 'production') {
  // Запускаем с задержкой, чтобы сервер успел стартовать
  setTimeout(() => {
    initializeTelegramBot().catch(console.error);
  }, 3000);
}
