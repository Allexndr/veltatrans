import {useTranslations} from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function RatesPage() {
  const t = useTranslations('rates');



  const services = [
    {
      name: t('servicePlans.basic.name'),
      description: t('servicePlans.basic.description'),
      features: [
        t('servicePlans.basic.features.insurance'),
        t('servicePlans.basic.features.tracking'),
        t('servicePlans.basic.features.sms'),
        t('servicePlans.basic.features.warehouse')
      ]
    },
    {
      name: t('servicePlans.express.name'),
      description: t('servicePlans.express.description'),
      features: [
        t('servicePlans.express.features.faster'),
        t('servicePlans.express.features.priority'),
        t('servicePlans.express.features.manager'),
        t('servicePlans.express.features.door')
      ],
      premium: true
    },
    {
      name: t('servicePlans.full.name'),
      description: t('servicePlans.full.description'),
      features: [
        t('servicePlans.full.features.pickup'),
        t('servicePlans.full.features.customs'),
        t('servicePlans.full.features.delivery'),
        t('servicePlans.full.features.support')
      ]
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
                {t('title')}
              </h1>
              <p className="text-xl text-velta-100 max-w-3xl mx-auto">
                {t('description')}
              </p>
              </div>
          </div>
        </section>



        {/* Service Types */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('servicePlans.title')}
              </h2>
              <p className="text-lg text-gray-600">
                {t('servicePlans.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <div
                  key={index}
                  className={`bg-white rounded-lg shadow-lg p-8 ${
                    service.premium ? 'ring-2 ring-velta-600 relative' : ''
                  }`}
                >
                  {service.premium && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-velta-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                        {t('servicePlans.popular')}
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
                    className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                      service.premium
                        ? 'bg-velta-navy text-white hover:bg-velta-700'
                        : 'bg-white text-gray-900 border-2 border-gray-200 hover:border-velta-navy hover:bg-velta-50'
                    }`}
                  >
                    {t('servicePlans.select')}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Additional Information */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('pricingFactors.title')}
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-velta-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('pricingFactors.weight.title')}</h3>
                      <p className="text-gray-600">{t('pricingFactors.weight.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-velta-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('pricingFactors.distance.title')}</h3>
                      <p className="text-gray-600">{t('pricingFactors.distance.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-velta-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('pricingFactors.cargoType.title')}</h3>
                      <p className="text-gray-600">{t('pricingFactors.cargoType.description')}</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-velta-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">{t('pricingFactors.urgency.title')}</h3>
                      <p className="text-gray-600">{t('pricingFactors.urgency.description')}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  {t('additionalServices.title')}
                </h2>
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">{t('additionalServices.packaging')}</span>
                      <span className="font-semibold">{t('additionalServices.prices.packaging')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">{t('additionalServices.insurance')}</span>
                      <span className="font-semibold">{t('additionalServices.prices.insurance')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">{t('additionalServices.pickup')}</span>
                      <span className="font-semibold">{t('additionalServices.prices.pickup')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">{t('additionalServices.delivery')}</span>
                      <span className="font-semibold">{t('additionalServices.prices.delivery')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-gray-200">
                      <span className="text-gray-700">{t('additionalServices.storage')}</span>
                      <span className="font-semibold">{t('additionalServices.prices.storage')}</span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-gray-700">{t('additionalServices.customs')}</span>
                      <span className="font-semibold">{t('additionalServices.prices.customs')}</span>
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
