import createMiddleware from 'next-intl/middleware';
import {routing} from './src/i18n/routing';
import { NextRequest } from 'next/server';

let webhookInitialized = false;

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  // Автоматическая настройка Telegram webhook при первом запросе в продакшене
  if (!webhookInitialized && process.env.NODE_ENV === 'production') {
    try {
      const response = await fetch(`${request.nextUrl.origin}/api/telegram/auto-setup`);
      if (response.ok) {
        webhookInitialized = true;
        console.log('✅ Telegram webhook автоматически настроен');
      }
    } catch (error) {
      console.error('❌ Ошибка автонастройки Telegram webhook:', error);
    }
  }

  // Применяем интернационализацию
  return intlMiddleware(request);
}
 
export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next`, `/_vercel`, `/admin`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|admin|.*\\..*).*)'
  ]
};
