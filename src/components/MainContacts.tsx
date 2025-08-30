'use client';

import { useTranslations } from 'next-intl';

export default function MainContacts() {
  const t = useTranslations('contactForm');

  return (
    <section className="py-16 bg-gradient-to-br from-velta-50 via-white to-velta-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600">
            {t('description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-6">
            {/* Phone */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-velta-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('phone.title')}</h3>
                <div className="space-y-2">
                  <a href="tel:+77002770006" className="block text-velta-navy hover:text-velta-royal-blue transition-colors duration-200">
                    +7 700 277 00 06 ({t('phone.multichannel')})
                  </a>
                  <a href="https://wa.me/77010704011" target="_blank" rel="noopener noreferrer" className="block text-velta-navy hover:text-velta-royal-blue transition-colors duration-200">
                    +7 701 070 40 11 (Sales)
                  </a>
                  <a href="tel:+77010704022" className="block text-velta-navy hover:text-velta-royal-blue transition-colors duration-200">
                    +7 701 070 40 22 (Логисты)
                  </a>
                </div>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-velta-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('email.title')}</h3>
                <div className="space-y-2">
                  <a href="mailto:sales@velta.com.kz" className="block text-velta-navy hover:text-velta-royal-blue transition-colors duration-200">
                    sales@velta.com.kz
                  </a>
                  <a href="mailto:velta@velta.com.kz" className="block text-velta-navy hover:text-velta-royal-blue transition-colors duration-200">
                    velta@velta.com.kz
                  </a>
                </div>
              </div>
            </div>

            {/* Address */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-velta-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('address.title')}</h3>
                <p className="text-gray-600">
                  8-й микрорайон 4а, БЦ Абай, 217 офис<br />
                  Алматы, Казахстан
                </p>
                <p className="text-sm text-gray-500 mt-2">Пн-Пт: 9:00-18:00</p>
              </div>
            </div>

            {/* Telegram */}
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-velta-navy rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.562 8.161c-.18 1.897-.962 6.502-1.359 8.627-.168.9-.5 1.201-.82 1.23-.697.064-1.226-.461-1.901-.903-1.056-.692-1.653-1.123-2.678-1.799-1.185-.781-.417-1.21.258-1.911.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.139-5.062 3.345-.48.33-.913.49-1.302.481-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.831-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635.099-.002.321.023.465.178.164.172.213.406.227.574-.001.06-.002.12-.003.18z"/>
                </svg>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Telegram</h3>
                <a href="https://t.me/velta_logistics_bot" target="_blank" rel="noopener noreferrer" className="text-velta-navy hover:text-velta-royal-blue transition-colors duration-200">
                  @velta_logistics_bot
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form Placeholder */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
            <div className="text-center">
              <div className="w-20 h-20 bg-velta-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-velta-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{t('form.title')}</h3>
              <p className="text-gray-600 mb-6">{t('form.description')}</p>
              <div className="bg-velta-50 rounded-lg p-6">
                <p className="text-velta-navy font-medium mb-3">{t('formUnavailable.title')}</p>
                <p className="text-sm text-gray-600">{t('formUnavailable.description')}</p>
              </div>
              <div className="mt-6">
                <a 
                  href="/contacts" 
                  className="inline-flex items-center px-6 py-3 bg-velta-navy text-white font-medium rounded-lg hover:bg-velta-royal-blue transition-colors duration-200"
                >
                  Перейти к контактам
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
