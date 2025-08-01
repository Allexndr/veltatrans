'use client';

import {useTranslations} from 'next-intl';
import {Link, usePathname} from '@/i18n/routing';
import {useState} from 'react';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const t = useTranslations();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: t('navigation.services'), href: '/services' as const },
    { name: t('navigation.documents'), href: '/documents' as const },
    { name: t('navigation.rates'), href: '/rates' as const },
    { name: t('navigation.calculator'), href: '/calculator' as const },
    { name: t('navigation.directions'), href: '/directions' as const },
    { name: t('navigation.about'), href: '/about' as const },
    { name: t('navigation.contacts'), href: '/contacts' as const },
  ];

  return (
    <header className="bg-white shadow-lg">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-blue-900">
                {t('company.name')}
              </span>
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-gray-600 hover:text-blue-900 px-3 py-2 text-sm font-medium transition-colors ${ 
                  pathname === item.href ? 'text-blue-900 border-b-2 border-blue-900' : ''
                }`}
              >
                {item.name}
              </Link>
            ))}
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <LanguageSwitcher />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="ml-2 text-gray-600 hover:text-blue-900 focus:outline-none focus:text-blue-900"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`block px-3 py-2 text-base font-medium transition-colors ${
                    pathname === item.href 
                      ? 'text-blue-900 bg-blue-50' 
                      : 'text-gray-600 hover:text-blue-900 hover:bg-gray-50'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
