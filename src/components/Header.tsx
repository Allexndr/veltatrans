'use client';

import { useState } from 'react'
import { useLocale } from 'next-intl'
import Link from 'next/link'
import Logo from './Logo'
import { useTranslations } from 'next-intl'

export default function Header() {
  const locale = useLocale()
  const t = useTranslations('navigation')
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white shadow-lg">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Логотип */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <Logo size="lg" />
          </Link>

          {/* Десктопная навигация */}
          <nav className="hidden lg:flex items-center space-x-8">
            <Link 
              href={`/${locale}`}
              className="text-gray-700 hover:text-velta-blue transition-colors duration-200 font-medium"
            >
              {t('home')}
            </Link>
            <Link 
              href={`/${locale}/services`}
              className="text-gray-700 hover:text-velta-blue transition-colors duration-200 font-medium"
            >
              {t('services')}
            </Link>
            <Link 
              href={`/${locale}/directions`}
              className="text-gray-700 hover:text-velta-blue transition-colors duration-200 font-medium"
            >
              {t('directions')}
            </Link>
            <Link 
              href={`/${locale}/cases`}
              className="text-gray-700 hover:text-velta-blue transition-colors duration-200 font-medium"
            >
              {t('cases')}
            </Link>
            <Link 
              href={`/${locale}/contacts`}
              className="text-gray-700 hover:text-velta-blue transition-colors duration-200 font-medium"
            >
              {t('contacts')}
            </Link>
            <Link 
              href={`/${locale}/analytics`}
              className="text-gray-700 hover:text-velta-blue transition-colors duration-200 font-medium"
            >
              {t('analytics')}
            </Link>
          </nav>

          {/* Мобильная кнопка меню */}
          <button
            onClick={toggleMobileMenu}
            className="lg:hidden p-2 rounded-md text-gray-700 hover:text-velta-blue hover:bg-gray-100 transition-colors duration-200"
            aria-label="Открыть меню"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {/* Мобильное меню */}
      <div className={`lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity duration-300 ${
        isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}>
        <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="flex items-center justify-between p-6 border-b">
            <Logo size="md" />
            <button
              onClick={closeMobileMenu}
              className="p-2 rounded-md text-gray-700 hover:text-velta-blue hover:bg-gray-100 transition-colors duration-200"
              aria-label="Закрыть меню"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <nav className="p-6">
            <div className="flex flex-col space-y-4">
              <Link 
                href={`/${locale}`}
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-velta-blue transition-colors duration-200 font-medium text-lg py-2 border-b border-gray-100"
              >
                {t('home')}
              </Link>
              <Link 
                href={`/${locale}/services`}
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-velta-blue transition-colors duration-200 font-medium text-lg py-2 border-b border-gray-100"
              >
                {t('services')}
              </Link>
              <Link 
                href={`/${locale}/directions`}
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-velta-blue transition-colors duration-200 font-medium text-lg py-2 border-b border-gray-100"
              >
                {t('directions')}
              </Link>
              <Link 
                href={`/${locale}/cases`}
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-velta-blue transition-colors duration-200 font-medium text-lg py-2 border-b border-gray-100"
              >
                {t('cases')}
              </Link>
              <Link 
                href={`/${locale}/contacts`}
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-velta-blue transition-colors duration-200 font-medium text-lg py-2 border-b border-gray-100"
              >
                {t('contacts')}
              </Link>
              <Link 
                href={`/${locale}/analytics`}
                onClick={closeMobileMenu}
                className="text-gray-700 hover:text-velta-blue transition-colors duration-200 font-medium text-lg py-2 border-b border-gray-100"
              >
                {t('analytics')}
              </Link>
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}
