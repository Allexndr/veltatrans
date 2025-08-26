import {useTranslations} from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DirectionsPage() {
  const t = useTranslations('directions');

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

        {/* Main Directions */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('mainDirections.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('mainDirections.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-velta-navy rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('china_cis.title')}</h3>
                <p className="text-gray-600 mb-6">{t('china_cis.description')}</p>
                <ul className="space-y-2">
                  {(t.raw('china_cis.features') as string[]).map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-velta-navy rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('russia_kazakhstan.title')}</h3>
                <p className="text-gray-600 mb-6">{t('russia_kazakhstan.description')}</p>
                <ul className="space-y-2">
                  {(t.raw('russia_kazakhstan.features') as string[]).map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-velta-navy rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('kazakhstan.title')}</h3>
                <p className="text-gray-600 mb-6">{t('kazakhstan.description')}</p>
                <ul className="space-y-2">
                  {(t.raw('kazakhstan.features') as string[]).map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow">
                <div className="w-16 h-16 bg-velta-navy rounded-lg flex items-center justify-center mx-auto mb-6">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{t('project_cargo.title')}</h3>
                <p className="text-gray-600 mb-6">{t('project_cargo.description')}</p>
                <ul className="space-y-2">
                  {(t.raw('project_cargo.features') as string[]).map((feature: string, index: number) => (
                    <li key={index} className="flex items-center text-gray-700">
                      <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Routes */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('popularRoutes.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('popularRoutes.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Алматы → Пекин</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('popularRoutes.distance')}</span>
                    <span className="font-semibold">4,200 км</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('popularRoutes.deliveryTime')}</span>
                    <span className="font-semibold">12-15 дней</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('popularRoutes.transportType')}</span>
                    <span className="font-semibold">Авто + ЖД</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('popularRoutes.cost')}</span>
                    <span className="font-semibold">от $2.80/кг</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-velta-navy text-white py-3 rounded-lg hover:bg-velta-700 transition-colors">
                  {t('popularRoutes.calculateDelivery')}
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Москва → Шанхай</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('popularRoutes.distance')}</span>
                    <span className="font-semibold">7,800 км</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('popularRoutes.deliveryTime')}</span>
                    <span className="font-semibold">18-22 дня</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('popularRoutes.transportType')}</span>
                    <span className="font-semibold">ЖД + Море</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('popularRoutes.cost')}</span>
                    <span className="font-semibold">от $3.40/кг</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-velta-navy text-white py-3 rounded-lg hover:bg-velta-700 transition-colors">
                  {t('popularRoutes.calculateDelivery')}
                </button>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Ташкент → Гуанчжоу</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('popularRoutes.distance')}</span>
                    <span className="font-semibold">5,600 км</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('popularRoutes.deliveryTime')}</span>
                    <span className="font-semibold">14-18 дней</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('popularRoutes.transportType')}</span>
                    <span className="font-semibold">Авто + ЖД</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">{t('popularRoutes.cost')}</span>
                    <span className="font-semibold">от $3.10/кг</span>
                  </div>
                </div>
                <button className="w-full mt-6 bg-velta-navy text-white py-3 rounded-lg hover:bg-velta-700 transition-colors">
                  {t('popularRoutes.calculateDelivery')}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Border Crossings */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('borderCrossings.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('borderCrossings.subtitle')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Хоргос (Китай-Казахстан)</h3>
                <p className="text-gray-600 mb-4">Основной сухопутный переход между Китаем и Казахстаном</p>
                <div className="text-sm text-gray-500">
                  <strong>{t('borderCrossings.features')}</strong> 24/7 работа, электронное декларирование
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Алашанькоу (Китай-Казахстан)</h3>
                <p className="text-gray-600 mb-4">Альтернативный переход для грузовых перевозок</p>
                <div className="text-sm text-gray-500">
                  <strong>{t('borderCrossings.features')}</strong> Специализация на контейнерных перевозках
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">Забайкальск (Россия-Китай)</h3>
                <p className="text-gray-600 mb-4">Крупнейший железнодорожный переход</p>
                <div className="text-sm text-gray-500">
                  <strong>{t('borderCrossings.features')}</strong> Железнодорожные перевозки, контейнеры
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Geography */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                {t('geography.title')}
              </h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                {t('geography.subtitle')}
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('geography.interactiveMap')}
                </h3>
                <p className="text-gray-600">
                  {t('geography.mapDescription')}
                </p>
                <div className="w-full h-64 bg-gray-200 rounded-lg mt-6 flex items-center justify-center">
                  <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
