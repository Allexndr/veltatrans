'use client';

import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/routing';
import LanguageSwitcher from './LanguageSwitcher';
import {useState} from 'react';

export default function Header() {
  const t = useTranslations('navigation');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navigation = [
    {name: t('home'), href: '/'},
    {name: t('about'), href: '/about'},
    {name: t('services'), href: '/services'},
    {name: t('cases'), href: '/cases'},
    {name: t('calculator'), href: '/calculator'},
    {name: t('rates'), href: '/rates'},
    {name: t('directions'), href: '/directions'},
    {name: t('documents'), href: '/documents'},
    {name: t('contacts'), href: '/contacts'},
  ];

  return (
    <header className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="w-8 h-8 bg-custom-blue-600 rounded-lg flex items-center justify-center mr-2">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <span className="text-lg font-bold text-custom-blue-900">Velta Trans</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-custom-blue-900 px-2 py-1 text-xs font-medium transition-all duration-200 hover:bg-custom-blue-50 rounded-md"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Tablet Navigation - Compact */}
          <nav className="hidden md:flex lg:hidden space-x-1">
            {navigation.slice(0, 6).map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-custom-blue-900 px-1 py-1 text-xs font-medium transition-all duration-200 hover:bg-custom-blue-50 rounded-md"
              >
                {item.name}
              </Link>
            ))}
            <div className="relative group">
              <button className="text-gray-700 hover:text-custom-blue-900 px-1 py-1 text-xs font-medium transition-all duration-200 hover:bg-custom-blue-50 rounded-md">
                ...
              </button>
              <div className="absolute right-0 top-full mt-1 w-32 bg-white shadow-lg rounded-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {navigation.slice(6).map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-xs text-gray-700 hover:text-custom-blue-900 hover:bg-custom-blue-50 transition-colors"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          {/* Language Switcher and Mobile Menu Button */}
          <div className="flex items-center space-x-2">
            <LanguageSwitcher />
            
            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden inline-flex items-center justify-center p-1.5 rounded-md text-gray-700 hover:text-custom-blue-900 hover:bg-custom-blue-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-custom-blue-500 transition-all duration-200"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 hover:text-custom-blue-900 hover:bg-custom-blue-50 block px-3 py-2 rounded-md text-sm font-medium transition-all duration-200"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
