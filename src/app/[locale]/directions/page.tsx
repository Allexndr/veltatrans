import {useTranslations} from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DirectionsPage() {
  const t = useTranslations();

  const regions = [
    {
      name: t('directions.cis'),
      description: 'Страны СНГ - наш основной регион работы',
      countries: [
        'Россия', 'Казахстан', 'Узбекистан', 'Кыргызстан', 
        'Таджикистан', 'Туркменистан', 'Азербайджан', 'Армения', 'Беларусь'
      ],
      features: [
        'Упрощенное таможенное оформление',
        'Единое экономическое пространство',
        'Знание местных особенностей',
        'Развитая партнерская сеть'
      ],
      color: 'blue'
    },
    {
      name: t('directions.china'),
      description: 'Китай - ключевой торговый партнер',
      countries: [
        'Пекин', 'Шанхай', 'Гуанчжоу', 'Шэньчжэнь', 
        'Тяньцзинь', 'Урумчи', 'Харбин', 'Далянь'
      ],
      features: [
        'Прямые маршруты через КПП',
        'Работа с китайскими производителями',
        'Консолидация грузов',
        'Мультимодальные перевозки'
      ],
      color: 'red'
    },
    {
      name: t('directions.europe'),
      description: 'Европа - расширяющееся направление',
      countries: [
        'Германия', 'Польша', 'Нидерланды', 'Франция', 
        'Италия', 'Чехия', 'Литва', 'Латвия'
      ],
      features: [
        'Соблюдение европейских стандартов',
        'Сертифицированные склады',
        'Экологические требования',
        'Интеграция с EU системами'
      ],
      color: 'green'
    }
  ];

  const routes = [
    {
      from: 'Алматы',
      to: 'Пекин',
      distance: '3,800 км',
      time: '12-15 дней',
      type: 'Автомобильный',
      price: 'от $3.50/кг'
    },
    {
      from: 'Москва',
      to: 'Шанхай',
      distance: '8,100 км',
      time: '18-22 дня',
      type: 'Ж/д + авто',
      price: 'от $4.20/кг'
    },
    {
      from: 'Ташкент',
      to: 'Гуанчжоу',
      distance: '4,200 км',
      time: '14-18 дней',
      type: 'Автомобильный',
      price: 'от $3.80/кг'
    },
    {
      from: 'Бишкек',
      to: 'Урумчи',
      distance: '700 км',
      time: '3-5 дней',
      type: 'Автомобильный',
      price: 'от $2.20/кг'
    },
    {
      from: 'Алматы',
      to: 'Варшава',
      distance: '4,500 км',
      time: '15-20 дней',
      type: 'Автомобильный',
      price: 'от $5.50/кг'
    },
    {
      from: 'Москва',
      to: 'Гамбург',
      distance: '2,100 км',
      time: '10-14 дней',
      type: 'Автомобильный',
      price: 'от $4.80/кг'
    }
  ];

  const borderCrossings = [
    {
      name: 'Хоргос',
      countries: 'Казахстан - Китай',
      description: 'Крупнейший пограничный переход в регионе',
      features: ['24/7 работа', 'Ускоренное оформление', 'Современная инфраструктура']
    },
    {
      name: 'Алашанькоу',
      countries: 'Китай - Казахстан',
      description: 'Железнодорожный и автомобильный переход',
      features: ['Ж/д терминал', 'Таможенный склад', 'Контейнерные операции']
    },
    {
      name: 'Достык',
      countries: 'Казахстан - Китай',
      description: 'Альтернативный маршрут для грузов',
      features: ['Меньшие очереди', 'Специализация на авто', 'Быстрое оформление']
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('directions.title')}
              </h1>
              <p className="text-xl text-custom-blue-100 max-w-3xl mx-auto">
                {t('directions.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Regions */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Регионы доставки
              </h2>
              <p className="text-lg text-gray-600">
                Мы работаем в трех ключевых экономических зонах
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {regions.map((region, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-custom-blue-600">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {region.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {region.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Страны и города:</h4>
                    <div className="flex flex-wrap gap-2">
                      {region.countries.map((country, countryIndex) => (
                        <span
                          key={countryIndex}
                          className="px-3 py-1 bg-blue-100 text-custom-blue-800 rounded-full text-sm"
                        >
                          {country}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Преимущества:</h4>
                    <ul className="space-y-2">
                      {region.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-gray-700">
                          <svg className="w-4 h-4 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Routes */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Популярные маршруты
              </h2>
              <p className="text-lg text-gray-600">
                Наиболее востребованные направления доставки
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {routes.map((route, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {route.from} → {route.to}
                    </h3>
                    <svg className="w-6 h-6 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                  
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Расстояние:</span>
                      <span className="font-medium">{route.distance}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Время доставки:</span>
                      <span className="font-medium">{route.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Тип перевозки:</span>
                      <span className="font-medium">{route.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Стоимость:</span>
                      <span className="font-medium text-custom-blue-600">{route.price}</span>
                    </div>
                  </div>

                  <button className="w-full mt-4 bg-custom-blue-600 text-white py-2 px-4 rounded-lg hover:bg-custom-blue-700 transition-colors">
                    Рассчитать доставку
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Border Crossings */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Пограничные переходы
              </h2>
              <p className="text-lg text-gray-600">
                Ключевые пункты пропуска для международных грузов
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {borderCrossings.map((crossing, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-custom-blue-600 rounded-lg flex items-center justify-center mr-4">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900">{crossing.name}</h3>
                      <p className="text-sm text-gray-600">{crossing.countries}</p>
                    </div>
                  </div>

                  <p className="text-gray-600 mb-4">
                    {crossing.description}
                  </p>

                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">Особенности:</h4>
                    <ul className="space-y-1">
                      {crossing.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-gray-700">
                          <svg className="w-3 h-3 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                География работы
              </h2>
              <p className="text-lg text-gray-600">
                Наша логистическая сеть охватывает три континента
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8">
              <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-24 h-24 text-custom-blue-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-700">Интерактивная карта</h3>
                  <p className="text-gray-600">Здесь будет размещена карта с маршрутами</p>
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
