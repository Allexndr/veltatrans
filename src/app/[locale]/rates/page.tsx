import {useTranslations} from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RatesPage() {
  const t = useTranslations();

  const rates = [
    {
      direction: 'Алматы → Пекин',
      weight: '1-100 кг',
      price: '$3.50',
      transit: '12-15 дней'
    },
    {
      direction: 'Алматы → Пекин',
      weight: '100-500 кг',
      price: '$3.20',
      transit: '12-15 дней'
    },
    {
      direction: 'Алматы → Пекин',
      weight: '500+ кг',
      price: '$2.80',
      transit: '12-15 дней'
    },
    {
      direction: 'Москва → Шанхай',
      weight: '1-100 кг',
      price: '$4.20',
      transit: '18-22 дня'
    },
    {
      direction: 'Москва → Шанхай',
      weight: '100-500 кг',
      price: '$3.80',
      transit: '18-22 дня'
    },
    {
      direction: 'Москва → Шанхай',
      weight: '500+ кг',
      price: '$3.40',
      transit: '18-22 дня'
    },
    {
      direction: 'Ташкент → Гуанчжоу',
      weight: '1-100 кг',
      price: '$3.80',
      transit: '14-18 дней'
    },
    {
      direction: 'Ташкент → Гуанчжоу',
      weight: '100-500 кг',
      price: '$3.50',
      transit: '14-18 дней'
    },
    {
      direction: 'Ташкент → Гуанчжоу',
      weight: '500+ кг',
      price: '$3.10',
      transit: '14-18 дней'
    },
    {
      direction: 'Бишкек → Урумчи',
      weight: '1-100 кг',
      price: '$2.20',
      transit: '3-5 дней'
    },
    {
      direction: 'Бишкек → Урумчи',
      weight: '100-500 кг',
      price: '$1.90',
      transit: '3-5 дней'
    },
    {
      direction: 'Бишкек → Урумчи',
      weight: '500+ кг',
      price: '$1.60',
      transit: '3-5 дней'
    },
  ];

  const services = [
    {
      name: 'Базовая доставка',
      description: 'Стандартная доставка с отслеживанием',
      features: [
        'Страхование груза',
        'Отслеживание онлайн',
        'SMS уведомления',
        'Доставка до склада'
      ]
    },
    {
      name: 'Экспресс доставка',
      description: 'Ускоренная доставка с приоритетом',
      features: [
        'Сокращенные сроки на 30%',
        'Приоритетная обработка',
        'Персональный менеджер',
        'Доставка до двери'
      ],
      premium: true
    },
    {
      name: 'Полный сервис',
      description: 'Полное сопровождение от двери до двери',
      features: [
        'Забор от отправителя',
        'Таможенное оформление',
        'Доставка получателю',
        'Консультационная поддержка'
      ]
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
                {t('rates.title')}
              </h1>
              <p className="text-xl text-custom-blue-100 max-w-3xl mx-auto">
                {t('rates.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Rates Table */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">Актуальные тарифы</h2>
                <p className="text-gray-600 mt-2">Цены указаны за килограмм груза</p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('rates.direction')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('rates.weight')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('rates.price')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Срок доставки
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {rates.map((rate, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {rate.direction}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rate.weight}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-custom-blue-600">
                          {rate.price}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {rate.transit}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  * Цены могут изменяться в зависимости от типа груза, упаковки и дополнительных услуг
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Service Types */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Тарифные планы
              </h2>
              <p className="text-lg text-gray-600">
                Выберите подходящий уровень сервиса
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-lg p-8 ${
                    service.premium ? 'ring-2 ring-custom-blue-600 relative' : ''
                  }`}
                >
                  {service.premium && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-custom-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        Популярный
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600">
                      {service.description}
                    </p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={`w-full py-3 px-6 rounded-lg font-semibold transition-colors ${
                      service.premium
                        ? 'bg-custom-blue-600 text-white hover:bg-custom-blue-700'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    Выбрать план
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Факторы ценообразования
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-custom-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">Вес и объем</h3>
                      <p className="text-gray-600">Расчет производится по наибольшему показателю</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-custom-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">Расстояние</h3>
                      <p className="text-gray-600">Километраж между пунктами отправления и назначения</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-custom-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">Тип груза</h3>
                      <p className="text-gray-600">Специальные требования к транспортировке</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-custom-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">Срочность</h3>
                      <p className="text-gray-600">Стандартная или экспресс доставка</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Дополнительные услуги
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Упаковка груза</span>
                      <span className="font-semibold">от $5</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Страхование</span>
                      <span className="font-semibold">0.5% от стоимости</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Забор груза</span>
                      <span className="font-semibold">от $10</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Доставка получателю</span>
                      <span className="font-semibold">от $15</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">Временное хранение</span>
                      <span className="font-semibold">$2/день за м³</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">Таможенное оформление</span>
                      <span className="font-semibold">от $50</span>
                    </div>
                  </div>
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
