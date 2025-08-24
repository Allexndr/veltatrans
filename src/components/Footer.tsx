'use client';

import { useTranslations } from 'next-intl'
import Link from 'next/link'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Основная часть футера */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
          {/* О компании */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-10 h-10 bg-velta-royal-blue rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-white">Velta Trans</h2>
                <p className="text-sm text-gray-400">{t('tagline')}</p>
              </div>
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              {t('description')}
            </p>
            <div className="flex space-x-4">
              <a href="https://t.me/velta_logistics_bot" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-velta-royal-blue hover:bg-velta-navy transition-colors duration-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                </svg>
              </a>
              <a href="https://wa.me/77010704011" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-green-600 hover:bg-green-700 transition-colors duration-200 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Быстрые ссылки */}
          <div className="col-span-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{t('quickLinks')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('services')}
                </Link>
              </li>
              <li>
                <Link href="/directions" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('directions')}
                </Link>
              </li>
              <li>
                <Link href="/cases" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('cases')}
                </Link>
              </li>
              <li>
                <Link href="/contacts" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('contacts')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Услуги */}
          <div className="col-span-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{t('services')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <Link href="/services#auto" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('autoTransport')}
                </Link>
              </li>
              <li>
                <Link href="/services#railway" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('railwayTransport')}
                </Link>
              </li>
              <li>
                <Link href="/services#multimodal" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('multimodalTransport')}
                </Link>
              </li>
              <li>
                <Link href="/services#project" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('projectTransport')}
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Контакты */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{t('contacts')}</h3>
            <div className="space-y-3 sm:space-y-4">
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-velta-royal-blue mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div>
                  <p className="text-gray-300 text-sm sm:text-base font-medium">{t('mainPhone')}</p>
                  <a href="tel:+77010704011" className="text-white hover:text-velta-royal-blue transition-colors duration-200 text-sm sm:text-base">
                    +7 701 070 40 11
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-velta-royal-blue mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <div>
                  <p className="text-gray-300 text-sm sm:text-base font-medium">{t('email')}</p>
                  <a href="mailto:info@velta-trans.kz" className="text-white hover:text-velta-royal-blue transition-colors duration-200 text-sm sm:text-base">
                    info@velta-trans.kz
                  </a>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <svg className="w-5 h-5 text-velta-royal-blue mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="text-gray-300 text-sm sm:text-base font-medium">{t('address')}</p>
                  <p className="text-white text-sm sm:text-base">
                    {t('addressText')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Нижняя часть футера */}
        <div className="border-t border-gray-800 mt-8 sm:mt-12 pt-8 sm:pt-12">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <p className="text-gray-400 text-sm text-center sm:text-left">
              © 2024 Velta Trans. {t('allRightsReserved')}
            </p>
            <div className="flex space-x-6 text-sm text-gray-400">
              <Link href="/privacy" className="hover:text-white transition-colors duration-200">
                {t('privacy')}
              </Link>
              <Link href="/terms" className="hover:text-white transition-colors duration-200">
                {t('terms')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
