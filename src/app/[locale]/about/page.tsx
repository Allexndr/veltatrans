import {useTranslations} from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  const t = useTranslations();

  const values = [
    {
      title: 'Надежность',
      description: 'Гарантируем сохранность груза и соблюдение сроков доставки',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Профессионализм',
      description: 'Команда экспертов с многолетним опытом в логистике',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
    {
      title: 'Прозрачность',
      description: 'Открытая отчетность и полная информация о статусе доставки',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
    },
    {
      title: 'Инновации',
      description: 'Используем современные технологии для оптимизации процессов',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
  ];

  const timeline = [
    {
      year: '2014',
      title: 'Основание компании',
      description: 'Velta Trans была основана группой профессионалов с опытом в международной логистике'
    },
    {
      year: '2016',
      title: 'Расширение в Китай',
      description: 'Открытие первого офиса в Пекине и налаживание торговых коридоров'
    },
    {
      year: '2018',
      title: 'Цифровизация',
      description: 'Внедрение системы онлайн отслеживания и автоматизации процессов'
    },
    {
      year: '2020',
      title: 'Пандемийная стабильность',
      description: 'Обеспечение бесперебойных поставок в условиях COVID-19'
    },
    {
      year: '2022',
      title: 'Новые маршруты',
      description: 'Освоение дополнительных направлений в Европу и Азию'
    },
    {
      year: '2024',
      title: 'Технологическое лидерство',
      description: 'Запуск нового сайта и современных цифровых решений'
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
                {t('about.title')}
              </h1>
              <p className="text-xl text-velta-100 max-w-3xl mx-auto">
                {t('about.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('about.mission')}
                </h2>
                <p className="text-lg text-gray-600 mb-6">
                  Наша миссия заключается в создании надежных логистических мостов между странами и континентами, 
                  обеспечивая предприятиям эффективные и экономичные решения для международной торговли.
                </p>
                <p className="text-lg text-gray-600 mb-6">
                  Мы стремимся стать ведущей логистической компанией в регионе, предоставляя услуги высочайшего 
                  качества и способствуя развитию международного бизнеса наших клиентов.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-velta-50 rounded-lg">
                    <div className="text-2xl font-bold text-velta-600">10+</div>
                    <div className="text-sm text-gray-600">лет опыта</div>
                  </div>
                  <div className="text-center p-4 bg-velta-50 rounded-lg">
                    <div className="text-2xl font-bold text-velta-600">5000+</div>
                    <div className="text-sm text-gray-600">довольных клиентов</div>
                  </div>
                  <div className="text-center p-4 bg-velta-50 rounded-lg">
                    <div className="text-2xl font-bold text-velta-600">20+</div>
                    <div className="text-sm text-gray-600">стран доставки</div>
                  </div>
                  <div className="text-center p-4 bg-velta-50 rounded-lg">
                    <div className="text-2xl font-bold text-velta-600">98%</div>
                    <div className="text-sm text-gray-600">успешных доставок</div>
                  </div>
                </div>
              </div>
              <div className="relative">
                <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                  <svg className="w-32 h-32 text-velta-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('about.values')}
              </h2>
              <p className="text-lg text-gray-600">
                Принципы, которыми мы руководствуемся в работе
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="w-16 h-16 bg-velta-600 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600">
                    {value.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                История развития
              </h2>
              <p className="text-lg text-gray-600">
                Ключевые этапы нашего пути
              </p>
            </div>

            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-velta-200"></div>

              <div className="space-y-12">
                {timeline.map((event, index) => (
                  <div key={index} className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-1/2 ${index % 2 === 0 ? 'pr-8 text-right' : 'pl-8'}`}>
                      <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="text-sm font-semibold text-velta-600 mb-1">{event.year}</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{event.title}</h3>
                        <p className="text-gray-600">{event.description}</p>
                      </div>
                    </div>
                    <div className="relative">
                      <div className="w-6 h-6 bg-velta-600 rounded-full border-4 border-white shadow-lg"></div>
                    </div>
                    <div className="w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('about.team')}
              </h2>
              <p className="text-lg text-gray-600">
                Профессионалы, которые делают возможным ваш успех
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Логистика</h3>
                <p className="text-gray-600 mb-4">
                  Наша команда логистов обеспечивает оптимальные маршруты и своевременную доставку
                </p>
                <div className="text-sm text-velta-600">15+ специалистов</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Таможня</h3>
                <p className="text-gray-600 mb-4">
                  Эксперты по таможенному оформлению решают любые вопросы документооборота
                </p>
                <div className="text-sm text-velta-600">8+ специалистов</div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Поддержка</h3>
                <p className="text-gray-600 mb-4">
                  Клиентский сервис работает 24/7 для решения любых вопросов
                </p>
                <div className="text-sm text-velta-600">12+ специалистов</div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
