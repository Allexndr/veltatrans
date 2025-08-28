'use client';

import React, { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import Link from 'next/link';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';
import MobileNavigation from './MobileNavigation';

export default function Header() {
  const locale = useLocale();
  const t = useTranslations('navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Отслеживаем скролл для изменения стилей header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-sm shadow-lg border-b border-gray-100' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        {/* Top accent bar */}
        <div className="bg-gradient-to-r from-velta-navy via-velta-600 to-velta-500 h-0.5"></div>
        
        <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16 md:h-18 lg:h-20">
            {/* Logo - адаптивные размеры */}
            <div className="flex-shrink-0">
              <Link href={`/${locale}`} className="group block">
                <Logo 
                  size="sm" 
                  className="w-auto h-8 sm:h-9 md:h-10 lg:h-12 transition-all duration-200"
                />
              </Link>
            </div>

            {/* Desktop Navigation - скрыто на планшетах и мобильных */}
            <nav className="hidden lg:flex flex-1 max-w-4xl mx-4 lg:mx-8">
              <div className="flex flex-wrap gap-1 w-full justify-center items-center">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="relative px-2 lg:px-3 py-2 text-xs lg:text-sm font-medium text-gray-600 hover:text-velta-navy transition-all duration-300 rounded-md hover:bg-gray-50/80 border border-gray-200 hover:border-velta-navy/60 group flex items-center justify-center min-h-[32px] lg:min-h-[36px] whitespace-nowrap"
                  >
                    <span className="relative z-10 text-center">{item.name}</span>
                    <div className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-velta-navy transition-all duration-300 group-hover:w-full group-hover:left-0 rounded-full"></div>
                  </Link>
                ))}
              </div>
            </nav>

            {/* Language switcher + Mobile menu button */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Language switcher - всегда видимый, адаптивный */}
              <div className="flex items-center">
                <LanguageSwitcher />
              </div>

              {/* Mobile menu button - видимый на мобильных и планшетах */}
              <div className="block lg:hidden">
                <button
                  onClick={() => {
                    console.log('Menu button clicked, current state:', isMobileMenuOpen);
                    setIsMobileMenuOpen(!isMobileMenuOpen);
                  }}
                  className="relative z-50 p-2 sm:p-3 rounded-lg bg-velta-navy text-white hover:bg-velta-700 active:bg-velta-800 transition-all duration-200 touch-manipulation shadow-lg min-w-[44px] min-h-[44px] flex items-center justify-center border-2 border-white/20"
                  aria-label="Menu"
                >
                  <svg
                    className="w-5 h-5 sm:w-6 sm:h-6"
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
        </div>
      </header>
      
      {/* Mobile Navigation */}
      <MobileNavigation 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      {/* Spacer - адаптивная высота */}
      <div className="h-14 sm:h-16 md:h-18 lg:h-20" />
    </>
  );
}