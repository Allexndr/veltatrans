import {useTranslations} from 'next-intl';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DirectionsPage() {
  const t = useTranslations();

  const directions = [
    {
      name: 'Китай - Казахстан',
      description: 'Прямые перевозки из Китая в Казахстан через ключевые пограничные переходы',
      routes: ['Хоргос - Алматы', 'Алтынколь - Нур-Султан', 'Шэньчжэнь - Алматы', 'Гуанчжоу - Астана'],
      features: ['Пограничные переходы', 'Таможенное оформление', 'Контейнерные перевозки', 'Сборные грузы'],
      color: 'blue'
    },
    {
      name: 'Китай - Россия',
      description: 'Международные перевозки из Китая в ключевые города России',
      routes: ['Москва - Шанхай', 'Екатеринбург - Гуанчжоу', 'Новосибирск - Шэньчжэнь', 'Ростов - Пекин'],
      features: ['Железнодорожные маршруты', 'Автомобильные перевозки', 'Мультимодальные решения', 'Полное сопровождение'],
      color: 'green'
    },
    {
      name: 'Китай - Европа',
      description: 'Трансконтинентальные перевозки из Китая в Европу',
      routes: ['Варшава - Шанхай', 'Гамбург - Гуанчжоу', 'Стамбул - Шэньчжэнь', 'Будапешт - Пекин'],
      features: ['Мультимодальные маршруты', 'Контейнерные поезда', 'Автомобильные перевозки', 'Европейская логистика'],
      color: 'orange'
    },
    {
      name: 'Проектные перевозки',
      description: 'Специализированные перевозки негабаритных и тяжеловесных грузов',
      routes: ['Негабаритные грузы', 'Тяжеловесные перевозки', 'Специальное оборудование', 'Проектные решения'],
      features: ['Индивидуальный подход', 'Спецтехника', 'Согласования маршрутов', 'Полное сопровождение'],
      color: 'purple'
    }
  ];

  const routes = [
    {
      from: 'Хоргос',
      to: 'Алматы',
      distance: '380 км',
      time: '1-2 дня',
      type: 'Автомобильный',
      price: 'от $2.50/кг'
    },
    {
      from: 'Алтынколь',
      to: 'Нур-Султан',
      distance: '450 км',
      time: '1-2 дня',
      type: 'Автомобильный',
      price: 'от $2.80/кг'
    },
    {
      from: 'Шэньчжэнь',
      to: 'Москва',
      distance: '8,100 км',
      time: '18-22 дня',
      type: 'Ж/д + авто',
      price: 'от $4.20/кг'
    },
    {
      from: 'Гуанчжоу',
      to: 'Екатеринбург',
      distance: '7,800 км',
      time: '16-20 дней',
      type: 'Ж/д + авто',
      price: 'от $4.00/кг'
    },
    {
      from: 'Шанхай',
      to: 'Новосибирск',
      distance: '7,200 км',
      time: '15-19 дней',
      type: 'Ж/д + авто',
      price: 'от $3.80/кг'
    },
    {
      from: 'Шэньчжэнь',
      to: 'Варшава',
      distance: '9,500 км',
      time: '20-25 дней',
      type: 'Мультимодальный',
      price: 'от $5.50/кг'
    },
    {
      from: 'Гуанчжоу',
      to: 'Гамбург',
      distance: '9,800 км',
      time: '22-28 дней',
      type: 'Мультимодальный',
      price: 'от $5.80/кг'
    }
  ];

  const borderCrossings = [
    {
      name: 'Хоргос',
      countries: 'Казахстан - Китай',
      description: 'Крупнейший пограничный переход в регионе',
      features: ['24/7 работа', 'Ускоренное оформление', 'Современная инфраструктура', 'Контейнерные операции']
    },
    {
      name: 'Алтынколь',
      countries: 'Казахстан - Китай',
      description: 'Железнодорожный и автомобильный переход',
      features: ['Ж/д терминал', 'Таможенный склад', 'Контейнерные операции', 'Сборные грузы']
    },
    {
      name: 'Алашанькоу',
      countries: 'Китай - Казахстан',
      description: 'Железнодорожный и автомобильный переход',
      features: ['Ж/д терминал', 'Таможенный склад', 'Контейнерные операции', 'FCL/LCL услуги']
    }
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
                {t('directions.title')}
              </h1>
              <p className="text-xl text-velta-100 max-w-3xl mx-auto">
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
                Основные направления
              </h2>
              <p className="text-lg text-gray-600">
                Четыре ключевых направления работы нашей компании
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {directions.map((direction, index) => (
                <div key={index} className="bg-white rounded-lg shadow-lg p-6 border-t-4 border-velta-600">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {direction.name}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {direction.description}
                  </p>

                  <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Основные маршруты:</h4>
                    <div className="flex flex-wrap gap-2">
                      {direction.routes.map((route, routeIndex) => (
                        <span
                          key={routeIndex}
                          className="px-3 py-1 bg-velta-100 text-velta-800 rounded-full text-sm"
                        >
                          {route}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-lg font-semibold text-gray-900 mb-3">Преимущества:</h4>
                    <ul className="space-y-2">
                      {direction.features.map((feature, featureIndex) => (
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
                    <svg className="w-6 h-6 text-velta-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                      <span className="font-medium text-velta-600">{route.price}</span>
                    </div>
                  </div>

                  <Link 
                    href="/#calculator-section" 
                    className="w-full mt-4 bg-velta-navy text-white py-2 px-4 rounded-lg hover:bg-velta-700 transition-colors text-center block"
                  >
                    Рассчитать доставку
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Border Crossings */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
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
                    <div className="w-12 h-12 bg-velta-navy rounded-lg flex items-center justify-center mr-4">
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
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
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
                  <svg className="w-24 h-24 text-velta-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
