import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = '8414818778:AAG2QXqDu0WKwsClyMt5CpbpLQBL3QLVWUE';
const WEBHOOK_URL = 'https://velta-logistics.com/api/telegram/webhook';

export async function POST(request: NextRequest) {
  try {
    const { action } = await request.json();

    if (action === 'setWebhook') {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/setWebhook`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: WEBHOOK_URL,
          allowed_updates: ['message', 'callback_query']
        }),
      });

      const result = await response.json();
      
      return NextResponse.json({
        success: true,
        webhook_set: result.ok,
        description: result.description
      });
    }

    if (action === 'getWebhookInfo') {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
      const result = await response.json();
      
      return NextResponse.json(result);
    }

    if (action === 'deleteWebhook') {
      const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook`, {
        method: 'POST'
      });
      const result = await response.json();
      
      return NextResponse.json(result);
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    // Получаем информацию о боте
    const botResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getMe`);
    const botInfo = await botResponse.json();

    // Получаем информацию о webhook
    const webhookResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/getWebhookInfo`);
    const webhookInfo = await webhookResponse.json();

    return NextResponse.json({
      bot: botInfo.result,
      webhook: webhookInfo.result,
      webhook_url: WEBHOOK_URL
    });
  } catch (error) {
    console.error('Get info error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
