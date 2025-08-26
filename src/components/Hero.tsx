'use client';

import SmoothLink from './SmoothLink';
import {useEffect, useState} from 'react';
import {motion} from 'framer-motion';
import HeroGallery from './HeroGallery';
import { useTranslations } from 'next-intl'

export default function Hero({}: {locale: string}) {
  const [isLoading, setIsLoading] = useState(true);
  const tHero = useTranslations('hero')
  const tCompany = useTranslations('company')
  const tHome = useTranslations('home')
  const tCargo = useTranslations('cargoTracking')

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-velta-900 via-velta-800 to-velta-700 animate-pulse">
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'auto' })
    }
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-velta-navy via-velta-700 to-velta-600 flex flex-col">
      {/* Content */}
      <div className="relative z-10 flex items-center flex-1 px-4 sm:px-6 lg:px-8 pt-4">
        <div className="max-w-7xl mx-auto w-full">
          <div className="flex flex-col lg:flex-row items-start lg:items-center gap-8 lg:gap-16 xl:gap-20">
            {/* Текст слева */}
            <motion.div
              className="text-left space-y-6 lg:space-y-8 flex-1 lg:max-w-[50%]"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div>
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-6xl xl:text-7xl font-bold text-white mb-4 lg:mb-6 leading-tight">
                  {tCompany('name')}
                </h1>

                <p className="text-lg sm:text-xl md:text-xl lg:text-xl text-white/90 mb-4 font-medium">
                  {tHero('title')}
                </p>

                <p className="text-base sm:text-lg md:text-lg lg:text-lg text-white/80 mb-4 lg:mb-6 leading-relaxed font-normal">
                  {tHero('subtitle')}
                </p>

                {tHero.has('content') && (
                  <p className="text-base sm:text-lg md:text-lg lg:text-lg text-white/80 mb-6 lg:mb-8 leading-relaxed font-normal">
                    {tHero('content')}
                  </p>
                )}
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-nowrap items-center gap-4 lg:gap-6 relative z-20 w-full">
                {/* Левая кнопка */}
                <button
                  onClick={() => document.getElementById('calculator-section')?.scrollIntoView()}
                  className="bg-white text-velta-navy px-4 lg:px-6 py-3 lg:py-4 rounded-full font-semibold text-sm lg:text-base hover:bg-gray-100 transition-colors duration-300 shadow-lg flex items-center justify-center whitespace-nowrap flex-shrink-0"
                >
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="whitespace-nowrap">{tHome.has('cta') ? tHome('cta') : (tHero.has('cta') ? tHero('cta') : 'Get quote')}</span>
                </button>
                
                {/* Две правые кнопки в одной группе, одинаковые отступы */}
                <div className="flex flex-row items-center gap-4 lg:gap-6">
                  <SmoothLink
                    href="/contacts"
                    className="border-2 border-white text-white px-4 lg:px-6 py-3 lg:py-4 rounded-full font-semibold text-sm lg:text-base hover:bg-white hover:text-velta-navy transition-colors duration-300 flex items-center justify-center whitespace-nowrap"
                  >
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    <span className="whitespace-nowrap">{tHome.has('contact.title') ? tHome('contact.title') : 'Contact us'}</span>
                  </SmoothLink>
                  
                  <button
                    onClick={() => document.getElementById('tracking-section')?.scrollIntoView()}
                    className="border-2 border-white text-white px-4 lg:px-6 py-3 lg:py-4 rounded-full font-semibold text-sm lg:text-base hover:bg-white hover:text-velta-navy transition-colors duration-300 flex items-center justify-center whitespace-nowrap"
                  >
                    <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="whitespace-nowrap">{tCargo('form.track')}</span>
                  </button>
                </div>
              </div>
            </motion.div>
            
            {/* Галерея справа */}
            <motion.div
              className="h-64 sm:h-80 md:h-96 lg:h-[450px] xl:h-[500px] rounded-2xl overflow-hidden shadow-2xl relative z-10 flex-1 lg:max-w-[45%] lg:ml-[100px]"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <HeroGallery />
            </motion.div>
          </div>
        </div>
      </div>

      {/* Key features highlight - внизу */}
      <motion.div 
        className="relative z-10 pb-8 sm:pb-12"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 text-center">
            <div className="text-white">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">50+</div>
              <div className="text-white/80 text-sm sm:text-base">{tHome.has('stats.countries') ? tHome('stats.countries') : 'countries'}</div>
            </div>
            <div className="text-white">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{tHome.has('features.experience') ? tHome('features.experience') : 'Experience'}</div>
              <div className="text-white/80 text-sm sm:text-base">{tHome.has('features.geography') ? tHome('features.geography') : ''}</div>
            </div>
            <div className="text-white">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-2">{tHome.has('features.support') ? tHome('features.support') : ''}</div>
              <div className="text-white/80 text-sm sm:text-base">{tCompany.has('tagline') ? tCompany('tagline') : ''}</div>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}