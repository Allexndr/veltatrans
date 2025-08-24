'use client';

import { useTranslations } from 'next-intl'
import Logo from './Logo'

export default function Footer() {
  const t = useTranslations('footer')

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Информация о компании */}
          <div className="col-span-1 md:col-span-2 lg:col-span-1">
            <div className="mb-6">
              <Logo size="lg" className="filter brightness-0 invert" />
            </div>
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed mb-6">
              {t('description')}
            </p>
            <div className="flex space-x-4">
              <a
                href="https://wa.me/77010704011"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-green-400 transition-colors duration-200"
                aria-label="WhatsApp"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                </svg>
              </a>
              <a
                href="https://t.me/velta_logistics_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-blue-400 transition-colors duration-200"
                aria-label="Telegram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                </svg>
              </a>
            </div>
          </div>
          
          {/* Быстрые ссылки */}
          <div className="col-span-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{t('quickLinks')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="/services" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('services')}
                </a>
              </li>
              <li>
                <a href="/directions" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('directions')}
                </a>
              </li>
              <li>
                <a href="/cases" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('cases')}
                </a>
              </li>
              <li>
                <a href="/contacts" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('contacts')}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Услуги */}
          <div className="col-span-1">
            <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">{t('services')}</h3>
            <ul className="space-y-2 sm:space-y-3">
              <li>
                <a href="/services#auto" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('autoTransport')}
                </a>
              </li>
              <li>
                <a href="/services#railway" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('railwayTransport')}
                </a>
              </li>
              <li>
                <a href="/services#multimodal" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('multimodalTransport')}
                </a>
              </li>
              <li>
                <a href="/services#project" className="text-gray-300 hover:text-white transition-colors duration-200 text-sm sm:text-base">
                  {t('projectTransport')}
                </a>
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
              <a href="/privacy" className="hover:text-white transition-colors duration-200">
                {t('privacy')}
              </a>
              <a href="/terms" className="hover:text-white transition-colors duration-200">
                {t('terms')}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
