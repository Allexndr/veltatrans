import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import ServicesPreview from '@/components/ServicesPreview';
import CasesSection from '@/components/CasesSection';
import RecommendationsSection from '@/components/RecommendationsSection';
import Calculator from '@/components/Calculator';
import CargoTracking from '@/components/CargoTracking';
import ContactForm from '@/components/ContactForm';
import Footer from '@/components/Footer';

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const t = await getTranslations();
  const {locale} = await params;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero locale={locale} />
        <ServicesPreview locale={locale} />
        
        {/* Calculator and Tracking Section */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                {t('tools.title')}
              </h2>
                        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
            {t('tools.description')}
          </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Calculator />
              <CargoTracking />
            </div>
          </div>
        </section>

        <CasesSection locale={locale} />
        <RecommendationsSection locale={locale} />
        
        {/* CTA Section */}
        <section className="py-16 bg-custom-blue-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white mb-8">
              {t('home.description')}
            </h2>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/calculator"
                className="bg-white text-custom-blue-900 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                {t('home.cta')}
              </Link>
              <Link
                href="/contacts"
                className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-custom-blue-900 transition-colors"
              >
                {t('contact.title')}
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-custom-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('home.features.experience')}</h3>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-custom-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('home.features.geography')}</h3>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-custom-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">{t('home.features.support')}</h3>
              </div>
            </div>
          </div>
        </section>

        <ContactForm />
      </main>
      <Footer />
    </div>
  );
}
