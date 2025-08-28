import {useTranslations} from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const t = useTranslations('about');

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

        {/* Mission Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {t('mission')}
              </h2>
              <div className="max-w-4xl mx-auto space-y-6 text-lg text-gray-600 leading-relaxed">
                <p>{t('missionDescription1')}</p>
                <p>{t('missionDescription2')}</p>
                <p>{t('missionDescription3')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="text-center flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-4xl font-bold text-velta-navy mb-2 leading-tight">Высокое качество</div>
                <div className="text-gray-600 text-sm">{t('experience')}</div>
              </div>
              <div className="text-center flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-4xl font-bold text-velta-navy mb-2 leading-tight">Высокая оценка</div>
                <div className="text-gray-600 text-sm">{t('satisfiedClients')}</div>
              </div>
              <div className="text-center flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-4xl font-bold text-velta-navy mb-2 leading-tight">15+</div>
                <div className="text-gray-600 text-sm">{t('deliveryCountries')}</div>
              </div>
              <div className="text-center flex flex-col items-center justify-center min-h-[120px]">
                <div className="text-4xl font-bold text-velta-navy mb-2 leading-tight">5000+</div>
                <div className="text-gray-600 text-sm">{t('successfulDeliveries')}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {t('values')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('valuesDescription')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('reliability.title')}</h3>
                <p className="text-gray-600">{t('reliability.description')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 00-2 2v2m-8 0v2a2 2 0 002 2h8a2 2 0 002-2V8a2 2 0 00-2-2" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('professionalism.title')}</h3>
                <p className="text-gray-600">{t('professionalism.description')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('transparency.title')}</h3>
                <p className="text-gray-600">{t('transparency.description')}</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('innovation.title')}</h3>
                <p className="text-gray-600">{t('innovation.description')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Future Projects Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {t('futureProjects.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('futureProjects.description')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-velta-royal-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Офис в городе Иу</h3>
                <p className="text-gray-600">Открытие представительства в крупнейшем торговом центре Китая для прямого взаимодействия с поставщиками</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-velta-royal-blue rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Торговые коридоры</h3>
                <p className="text-gray-600">Налаживание прямых торговых маршрутов между Китаем, Казахстаном, Россией и странами СНГ</p>
              </div>
            </div>
          </div>
        </section>

        {/* Transit Routes Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {t('transitRoutes.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed">
                {t('transitRoutes.description')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Азия</h3>
                <p className="text-gray-600">Китай, Казахстан, Узбекистан, Киргизия</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m-6 3l6-3" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Евразия</h3>
                <p className="text-gray-600">Россия, транзит через Казахстан</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Европа</h3>
                <p className="text-gray-600">Страны Европейского союза</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">
                {t('team')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
                {t('teamDescription')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-24 h-24 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('logistics.title')}</h3>
                <p className="text-gray-600 mb-4">{t('logistics.description')}</p>
                <div className="text-velta-navy font-semibold">{t('logistics.specialists')}</div>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('customs.title')}</h3>
                <p className="text-gray-600 mb-4">{t('customs.description')}</p>
                <div className="text-velta-navy font-semibold">{t('customs.specialists')}</div>
              </div>
              
              <div className="text-center">
                <div className="w-24 h-24 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('support.title')}</h3>
                <p className="text-gray-600 mb-4">{t('support.description')}</p>
                <div className="text-velta-navy font-semibold">{t('support.specialists')}</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
