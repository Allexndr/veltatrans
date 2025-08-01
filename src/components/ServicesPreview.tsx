import {Link} from '@/i18n/routing';

export default async function ServicesPreview({locale}: {locale: string}) {
  // Import messages directly based on locale
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const t = (key: string) => messages.services[key] || key;
  const tNav = (key: string) => messages.navigation[key] || key;

  const services = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
        </svg>
      ),
      title: t('logistics.title'),
      description: t('logistics.description'),
      href: "/services"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      title: t('customs.title'),
      description: t('customs.description'),
      href: "/services"
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
        </svg>
      ),
      title: t('consultation.title'),
      description: t('consultation.description'),
      href: "/services"
    }
  ];

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">{t('title')}</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">{t('description')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div key={index} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-custom-blue-600 rounded-lg flex items-center justify-center mb-4 text-white">
                {service.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 mb-4">{service.description}</p>
              <Link
                href={service.href}
                className="text-custom-blue-600 hover:text-custom-blue-800 font-medium inline-flex items-center"
              >
                {t('more')}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <Link
            href="/services"
            className="bg-custom-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-custom-blue-700 transition-colors"
          >
            {tNav('services')}
          </Link>
        </div>
      </div>
    </section>
  );
}
