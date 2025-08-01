import {Link} from '@/i18n/routing';

export default async function Hero({locale}: {locale: string}) {
  // Import messages directly based on locale
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const t = (key: string) => messages.home[key] || key;
  const tNav = (key: string) => messages.navigation[key] || key;
  
  // Debug: Log the translations and locale
  console.log('Hero component - Locale:', locale);
  console.log('Hero component - title:', t('title'));
  console.log('Hero component - subtitle:', t('subtitle'));

  return (
    <section key={locale} className="relative bg-gradient-to-br from-custom-blue-900 via-custom-blue-800 to-custom-blue-700 text-white py-20">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-custom-blue-100">
            {t('subtitle')}
          </p>
          <p className="text-lg mb-10 text-custom-blue-100 max-w-3xl mx-auto">
            {t('description')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/calculator"
              className="bg-white text-custom-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {t('cta')}
            </Link>
            <Link
              href="/services"
              className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-custom-blue-900 transition-colors inline-flex items-center justify-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tNav('services')}
            </Link>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
          <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" fill="white"></path>
        </svg>
      </div>
    </section>
  );
}
