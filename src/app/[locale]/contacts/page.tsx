import {useTranslations} from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ContactForm from '@/components/ContactForm';

export default function ContactsPage() {
  const t = useTranslations('contact');

  const offices = [
    {
      city: 'Алматы',
      country: 'Казахстан',
      address: '8-й микрорайон 4а, БЦ Абай, 217 офис',
      phone: '+7 700 277 00 06 (Многоканальный)\n+7 701 070 40 11 (Sales)\n+7 701 070 40 22 (Логисты)',
      email: 'sales@velta.com.kz\nvelta@velta.com.kz',
      hours: 'Пн-Пт: 9:00-18:00',
      telegram: '@velta_logistics_bot',
    },
    {
      city: 'Пекин',
      country: 'Китай',
      address: '-',
      phone: '+7 700 277 00 06 (Многоканальный)\n+7 701 070 40 11 (Wechat)',
      email: 'china@velta.com\nvelta@velta.com.kz',
      hours: 'Пн-Пт: 9:00-18:00',
      telegram: '@velta_logistics_bot',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Отступ для фиксированного header */}
      <main>
        {/* Hero Section */}
        <section className="bg-velta-navy text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('title')}
              </h1>
              <p className="text-xl text-velta-100 max-w-3xl mx-auto">
                {t('description')}
              </p>
              </div>
          </div>
        </section>

        {/* Contact Information */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Наши офисы
              </h2>
              <p className="text-lg text-gray-600">
                Мы работаем в ключевых логистических центрах
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16 max-w-4xl mx-auto">
              {offices.map((office, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-velta-navy rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {office.city}, {office.country}
                      </h3>
                      <div className="space-y-2 text-gray-600">
                        <p className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          {office.address}
                        </p>
                        <div className="flex items-start">
                          <svg className="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                          </svg>
                          <div className="whitespace-pre-line">
                            {office.city === 'Алматы' ? (
                              <>
                                <a href="tel:+77002770006" className="text-velta-navy hover:text-velta-royal-blue transition-colors duration-200">+7 700 277 00 06 (Многоканальный)</a>
                                {'\n'}
                                <a href="https://wa.me/77010704011" target="_blank" rel="noopener noreferrer" className="text-velta-navy hover:text-velta-royal-blue transition-colors duration-200">+7 701 070 40 11 (Sales)</a>
                                {'\n'}
                                <a href="tel:+77010704022" className="text-velta-navy hover:text-velta-royal-blue transition-colors duration-200">+7 701 070 40 22 (Логисты)</a>
                              </>
                            ) : (
                              <>
                                <a href="tel:+77002770006" className="text-velta-navy hover:text-velta-royal-blue transition-colors duration-200">+7 700 277 00 06 (Многоканальный)</a>
                                {'\n'}
                                <a href="https://wa.me/77010704011" target="_blank" rel="noopener noreferrer" className="text-velta-navy hover:text-velta-royal-blue transition-colors duration-200">+7 701 070 40 11 (Wechat)</a>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start">
                          <svg className="w-4 h-4 mr-2 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          <div className="whitespace-pre-line">
                            {office.email}
                          </div>
                        </div>
                        {office.hours && (
                          <div className="flex items-center">
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {office.hours}
                          </div>
                        )}
                        <div className="flex items-center">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.14.18-.357.295-.6.295-.002 0-.003 0-.005 0l.213-3.054 5.56-5.022c.24-.213-.054-.334-.373-.121l-6.869 4.326-2.96-.924c-.64-.203-.658-.64.135-.954l11.566-4.458c.538-.196 1.006.128.832.941z"/>
                          </svg>
                          <a href="https://t.me/velta_logistics_bot" target="_blank" rel="noopener noreferrer" className="text-velta-navy hover:text-velta-royal-blue transition-colors duration-200">
                            {office.telegram}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Phone numbers with explanations */}
        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Наши номера телефонов</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="border rounded-lg p-5">
                <p className="text-gray-700 font-medium mb-1">Многоканальный номер</p>
                <a href="tel:+77002770006" className="text-velta-navy font-semibold hover:text-velta-royal-blue transition-colors duration-200">+7 700 277 00 06</a>
                <div className="mt-2">
                  <a href="https://wa.me/77002770006" target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-700">
                    WhatsApp на этом номере
                  </a>
                </div>
              </div>
              <div className="border rounded-lg p-5">
                <p className="text-gray-700 font-medium mb-1">Отдел продаж</p>
                <a href="tel:+77010704011" className="text-velta-navy font-semibold hover:text-velta-royal-blue transition-colors duration-200">+7 701 070 40 11</a>
                <div className="mt-2">
                  <a href="https://wa.me/77010704011" target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-700">
                    WhatsApp на этом номере
                  </a>
                </div>
              </div>
              <div className="border rounded-lg p-5">
                <p className="text-gray-700 font-medium mb-1">Отдел логистики</p>
                <a href="tel:+77010704022" className="text-velta-navy font-semibold hover:text-velta-royal-blue transition-colors duration-200">+7 701 070 40 22</a>
                <div className="mt-2">
                  <a href="https://wa.me/77010704022" target="_blank" rel="noopener noreferrer" className="text-sm text-green-600 hover:text-green-700">
                    WhatsApp на этом номере
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Methods */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('contactMethods.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('contactMethods.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.570-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">WhatsApp</h3>
                <p className="text-gray-600 mb-4">{t('contactMethods.whatsapp.description')}</p>
                <a
                  href="https://wa.me/77010704011"
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  {t('contactMethods.write')}
                </a>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Telegram</h3>
                <p className="text-gray-600 mb-4">{t('contactMethods.telegram.description')}</p>
                <a
                  href="https://t.me/velta_logistics_bot"
                  className="bg-velta-navy text-white px-6 py-2 rounded-lg hover:bg-velta-700 transition-colors"
                >
                  {t('contactMethods.write')}
                </a>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Email</h3>
                <p className="text-gray-600 mb-4">{t('contactMethods.email.description')}</p>
                <a
                  href="mailto:sales@velta.com.kz"
                  className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  {t('contactMethods.write')}
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Form */}
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
