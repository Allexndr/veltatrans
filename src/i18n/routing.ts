import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['ru', 'en', 'zh', 'kz'],

  // Used when no locale matches
  defaultLocale: 'ru',

  // Always show locale prefix to ensure proper routing
  localePrefix: 'always'
});

// Lightweight wrappers around Next.js' navigation APIs
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
