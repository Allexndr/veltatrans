/*
 Local polling bot for development.
 - Deletes webhook to allow polling
 - Polls updates and forwards raw updates to local Next.js API route
 Usage: npm run bot:poll
*/

const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN || '8414818778:AAG2QXqDu0WKwsClyMt5CpbpLQBL3QLVWUE';
const TARGET_URL = process.env.LOCAL_WEBHOOK_URL || 'http://localhost:3000/api/telegram/webhook';

if (!BOT_TOKEN) {
  console.error('TELEGRAM_BOT_TOKEN is not set. Set env or edit scripts/polling-bot.js');
  process.exit(1);
}

async function deleteWebhook() {
  try {
    const url = `https://api.telegram.org/bot${BOT_TOKEN}/deleteWebhook`;
    const { data } = await axios.post(url, { drop_pending_updates: false });
    console.log('deleteWebhook:', data);
  } catch (e) {
    console.error('Failed to delete webhook:', e?.response?.data || e.message);
  }
}

async function main() {
  await deleteWebhook();
  const bot = new TelegramBot(BOT_TOKEN, { polling: true });
  console.log('Polling bot started. Forwarding updates to', TARGET_URL);

  bot.on('message', async (message) => {
    try {
      await axios.post(TARGET_URL, { message });
      console.log('> message forwarded:', message.text || message.contact ? 'contact' : 'non-text');
    } catch (e) {
      console.error('Forward message failed:', e?.response?.data || e.message);
    }
  });

  bot.on('callback_query', async (callback_query) => {
    try {
      await axios.post(TARGET_URL, { callback_query });
      console.log('> callback forwarded:', callback_query.data);
    } catch (e) {
      console.error('Forward callback failed:', e?.response?.data || e.message);
    }
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});


