import {useTranslations} from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ServicesPage() {
  const t = useTranslations();

  const services = [
    {
      title: 'Автоперевозки',
      description: 'Мы организуем международные автомобильные перевозки из Китая в Россию, Казахстан и Европу. Работаем как с комплектными грузами (FTL), так и со сборными (LTL). У нас собственная сеть проверенных перевозчиков и надежная система отслеживания.',
      features: [
        'FTL и LTL перевозки',
        'Сеть проверенных перевозчиков',
        'Система отслеживания',
        'Таможенное оформление',
        'Доставка от двери до двери'
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M19 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M3 12h2m14 0h2M12 3v18" />
        </svg>
      ),
    },
    {
      title: 'Железнодорожные перевозки',
      description: 'Прямые контейнерные поезда из Китая в Россию и страны СНГ. Возможность отправки как полных контейнеров (FCL), так и сборных грузов (LCL). Оперативные сроки и конкурентные тарифы.',
      features: [
        'FCL и LCL контейнеры',
        'Прямые поезда Китай-СНГ',
        'Оперативные сроки',
        'Конкурентные тарифы',
        'Контейнерные решения'
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-2 0h4" />
        </svg>
      ),
    },
    {
      title: 'Мультимодальные перевозки',
      description: 'Комбинация морского, автомобильного и железнодорожного транспорта. Оптимальное решение по цене и срокам доставки. Подбираем маршрут под задачу клиента.',
      features: [
        'Море + авто комбинации',
        'ЖД + авто доставка',
        'Оптимизация маршрутов',
        'Единый договор',
        'Снижение рисков'
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: 'Проектные перевозки',
      description: 'Доставка негабаритных и тяжеловесных грузов. Разработка маршрута, организация спецтехники и согласования. Опыт перевозки оборудования для строительства и энергетики.',
      features: [
        'Негабаритные грузы',
        'Тяжеловесные перевозки',
        'Спецтехника',
        'Согласования маршрутов',
        'Опыт сложных проектов'
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
    },
    {
      title: t('services.customs.title'),
      description: t('services.customs.description'),
      features: [
        'Таможенное оформление',
        'Консультации по ВЭД',
        'Подготовка документов',
        'Сопровождение процедур',
        'Решение спорных вопросов'
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      title: t('services.consultation.title'),
      description: t('services.consultation.description'),
      features: [
        'Логистический аудит',
        'Оптимизация маршрутов',
        'Снижение затрат',
        'Анализ рисков',
        'Стратегическое планирование'
      ],
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Отступ для фиксированного header */}
      <div className="h-16 lg:h-20"></div>
      <main>
        {/* Hero Section */}
        <section className="bg-velta-navy text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('services.title')}
              </h1>
              <p className="text-xl text-velta-100 max-w-3xl mx-auto">
                Полный спектр логистических услуг для развития вашего бизнеса
              </p>
            </div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div key={index} className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="w-20 h-20 bg-velta-navy rounded-lg flex items-center justify-center mb-6 text-white">
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 mb-6">
                    {service.description}
                  </p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 text-velta-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Почему выбирают нас
              </h2>
              <p className="text-lg text-gray-600">
                Более 1175 выполненных перевозок ежегодно с гарантией сроков и круглосуточным отслеживанием
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Гарантия сроков</h3>
                <p className="text-gray-600">Круглосуточное 24/7 отслеживание и контроль сроков доставки</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Спецтехника</h3>
                <p className="text-gray-600">Профессиональные перевозки спецтехники и негабаритных грузов</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Конкурентные тарифы</h3>
                <p className="text-gray-600">Гибкие условия и конкурентные тарифы для всех видов перевозок</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-velta-navy rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Полное сопровождение</h3>
                <p className="text-gray-600">Профессиональная поддержка на всех этапах перевозки</p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
