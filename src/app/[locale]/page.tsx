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
// import AnimatedBackground from '@/components/AnimatedBackground';
// import AnimatedCard from '@/components/AnimatedCard';
// import AnimatedButton from '@/components/AnimatedButton';
// import {motion, AnimatePresence} from 'framer-motion';

export default async function HomePage({params}: {params: Promise<{locale: string}>}) {
  const t = await getTranslations();
  const {locale} = await params;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <Hero locale={locale} />
        <ServicesPreview locale={locale} />
        
        {/* Enhanced Calculator and Tracking Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
          {/* <AnimatedBackground variant="section" /> */}
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16 md:mb-20">
              <div className="inline-flex items-center px-3 sm:px-4 py-2 bg-gradient-to-r from-custom-blue-50 to-custom-blue-100 rounded-full text-custom-blue-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Полезные инструменты
              </div>
              
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 sm:mb-8 leading-tight">
                <span className="bg-gradient-to-r from-custom-blue-900 to-custom-blue-700 bg-clip-text text-transparent">
                  {t('tools.title')}
                </span>
              </h2>
              
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed px-4">
                {t('tools.description')}
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
              <div>
                <Calculator />
              </div>
              <div>
                <CargoTracking />
              </div>
            </div>
          </div>
        </section>

        <CasesSection locale={locale} />
        <RecommendationsSection locale={locale} />
        
        {/* Enhanced CTA Section */}
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-gradient-to-br from-custom-blue-900 via-custom-blue-800 to-custom-blue-700 relative overflow-hidden">
          {/* <AnimatedBackground variant="hero" className="opacity-20" /> */}
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8 sm:mb-12 leading-tight px-4">
              {t('home.description')}
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 justify-center px-4">
              <Link
                href="/calculator"
                className="group relative px-6 sm:px-8 md:px-10 py-4 sm:py-5 bg-white text-custom-blue-900 rounded-full font-semibold text-lg sm:text-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center sm:justify-start">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {t('home.cta')}
                </span>
              </Link>
              
              <Link
                href="/contacts"
                className="group relative px-6 sm:px-8 md:px-10 py-4 sm:py-5 border-2 border-white text-white rounded-full font-semibold text-lg sm:text-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full sm:w-auto"
              >
                <span className="relative z-10 flex items-center justify-center sm:justify-start">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  {t('contact.title')}
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Enhanced Features Section */}
        <section className="py-24 bg-gradient-to-br from-gray-50 via-white to-gray-50 relative overflow-hidden">
          {/* <AnimatedBackground variant="section" /> */}
          
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center group">
                <div className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-r from-custom-blue-600 to-custom-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <svg 
                      className="w-12 h-12 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-custom-blue-600 transition-colors duration-300">
                    {t('home.features.experience')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Более 15 лет успешной работы в сфере международной логистики
                  </p>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-r from-custom-blue-600 to-custom-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <svg 
                      className="w-12 h-12 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-custom-blue-600 transition-colors duration-300">
                    {t('home.features.geography')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Работаем по всему миру: СНГ, Китай, Европа
                  </p>
                </div>
              </div>
              
              <div className="text-center group">
                <div className="text-center group">
                  <div className="w-24 h-24 bg-gradient-to-r from-custom-blue-600 to-custom-blue-700 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:scale-110 transition-transform duration-300 shadow-xl">
                    <svg 
                      className="w-12 h-12 text-white" 
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-custom-blue-600 transition-colors duration-300">
                    {t('home.features.support')}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-lg">
                    Круглосуточная поддержка и сопровождение грузов
                  </p>
                </div>
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
