'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('home'), href: `/${locale}` },
    { name: t('about'), href: `/${locale}/about` },
    { name: t('services'), href: `/${locale}/services` },
    { name: t('cases'), href: `/${locale}/cases` },
    { name: t('rates'), href: `/${locale}/rates` },
    { name: t('directions'), href: `/${locale}/directions` },
    { name: t('documents'), href: `/${locale}/documents` },
    { name: t('contacts'), href: `/${locale}/contacts` },
  ];

  return (
    <>
    <header className="bg-white/95 backdrop-blur-sm border-b border-gray-100 fixed top-0 left-0 right-0 z-50 shadow-sm">
      {/* Top accent bar */}
      <div className="bg-gradient-to-r from-velta-navy via-velta-600 to-velta-500 h-0.5"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-14">
          {/* Logo - немного левее на десктопе, без отрицательного отступа на мобиле */}
          <div className="flex-shrink-0 ml-0 lg:-ml-[150px]">
            <Link href={`/${locale}`} className="group">
              <Logo size="lg" />
            </Link>
          </div>

          {/* Desktop Navigation - растягиваем до баланса с логотипом */}
          <nav className="hidden lg:flex flex-1 ml-[60px]">
            <div className="flex space-x-1 w-full justify-start items-center">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="relative px-3 py-2 text-sm font-medium text-gray-600 hover:text-velta-navy transition-all duration-300 rounded-md hover:bg-gray-50/80 border border-gray-200 hover:border-velta-navy/60 group flex items-center justify-center min-h-[36px] whitespace-nowrap"
                >
                  <span className="relative z-10 text-center">{item.name}</span>
                  {/* Подчеркивание при наведении */}
                  <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-velta-navy transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></div>
                </Link>
              ))}
            </div>
          </nav>

          {/* Language switcher (desktop) */}
          <div className="hidden lg:flex items-center ml-4">
            <LanguageSwitcher />
          </div>

          {/* Mobile menu button - правая часть */}
          <div className="lg:hidden ml-auto">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-600 hover:text-velta-navy hover:bg-gray-50 transition-all duration-200"
              aria-label={t('openMenu')}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-100 bg-white/95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block px-4 py-3 text-gray-600 hover:text-velta-navy hover:bg-gray-50/80 rounded-lg font-medium transition-all duration-200 text-center whitespace-nowrap"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
    {/* Spacer to prevent content from jumping under fixed header */}
    <div className="h-16" />
    </>
  );
}