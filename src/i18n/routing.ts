import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ru', 'en', 'zh', 'kz'],

  // Used when no locale matches
  defaultLocale: 'ru',

  // Show locale prefix as needed, but redirect / to /ru
  localePrefix: 'as-needed'
});

// Lightweight wrappers around Next.js' navigation APIs
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
