'use client';

import {useTranslations} from 'next-intl';
import SmoothLink from './SmoothLink';
import {useEffect, useState} from 'react';
import {motion, AnimatePresence} from 'framer-motion';

export default function Hero({locale}: {locale: string}) {
  const t = useTranslations('home');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen bg-gradient-to-br from-custom-blue-900 via-custom-blue-800 to-custom-blue-700 animate-pulse">
        <div className="flex items-center justify-center h-full">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-custom-blue-900 via-custom-blue-800 to-custom-blue-700">
      {/* Background Elements */}
      <div className="absolute inset-0">
        {/* Floating geometric shapes */}
        <div className="absolute top-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl animate-pulse" />
        <div className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
        <div className="absolute bottom-40 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl animate-pulse" style={{animationDelay: '4s'}} />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-white/5 rounded-full blur-xl animate-pulse" style={{animationDelay: '6s'}} />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
              backgroundSize: '80px 80px',
            }}
          />
        </div>

        {/* Moving lines */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          <div className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" style={{animationDelay: '3s'}} />
          <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" style={{animationDelay: '6s'}} />
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Enhanced main title */}
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold mb-12 leading-tight">
            <span className="block bg-gradient-to-r from-white via-custom-blue-200 to-white bg-clip-text text-transparent">
              {t('title').split(' ').slice(0, 2).join(' ')}
            </span>
            <span className="block bg-gradient-to-r from-custom-blue-200 via-white to-custom-blue-200 bg-clip-text text-transparent">
              {t('title').split(' ').slice(2).join(' ')}
            </span>
          </h1>
          
          {/* Enhanced subtitle */}
          <p className="text-2xl md:text-3xl text-white/90 mb-16 max-w-4xl mx-auto leading-relaxed">
            {t('subtitle')}
          </p>

          {/* Enhanced CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-8 justify-center mb-20">
            <SmoothLink
              href="/services"
              className="group relative px-10 py-5 bg-white text-custom-blue-900 rounded-full font-semibold text-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-6 h-6 mr-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('cta')}
              </span>
            </SmoothLink>
            
            <SmoothLink
              href="/contacts"
              className="group relative px-10 py-5 border-2 border-white text-white rounded-full font-semibold text-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <span className="relative z-10 flex items-center">
                <svg className="w-6 h-6 mr-4 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {t('contact.title')}
              </span>
            </SmoothLink>
          </div>

          {/* Enhanced stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-custom-blue-200 to-white bg-clip-text text-transparent">
                  15+
                </span>
              </div>
              <p className="text-white/80 text-lg">
                {t('stats.years')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-custom-blue-200 to-white bg-clip-text text-transparent">
                  1000+
                </span>
              </div>
              <p className="text-white/80 text-lg">
                {t('stats.clients')}
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-4">
                <span className="bg-gradient-to-r from-custom-blue-200 to-white bg-clip-text text-transparent">
                  50+
                </span>
              </div>
              <p className="text-white/80 text-lg">
                {t('stats.countries')}
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="flex flex-col items-center text-white/60 animate-bounce">
          <span className="text-sm mb-2">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}
