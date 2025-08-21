'use client';

import SmoothLink from './SmoothLink';
import {useEffect, useState} from 'react';
import {motion} from 'framer-motion';

export default function Hero({}: {locale: string}) {
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
    <section className="relative min-h-screen bg-gradient-to-br from-custom-blue-900 via-custom-blue-800 to-custom-blue-700 flex flex-col">
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
      <div className="relative z-10 flex items-center justify-center flex-1 px-4">
        <motion.div 
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center w-full"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          {/* Main title: Velta Trans larger, International smaller */}
          <h1 className="mb-4 sm:mb-6 md:mb-8 leading-tight">
            <span className="block text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold bg-gradient-to-r from-white via-custom-blue-200 to-white bg-clip-text text-transparent">
              Velta Trans
            </span>
            <span className="block text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-medium text-white/80 mt-2">
              Международная логистическая компания
            </span>
          </h1>
          
          {/* Updated subtitle with new text */}
          <p className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-white/90 mb-4 max-w-4xl mx-auto leading-relaxed px-4">
            B2B грузоперевозки по СНГ, Китаю и Европе
          </p>
          
          {/* Additional subtitle */}
          <p className="text-base sm:text-lg md:text-xl text-white/70 mb-8 sm:mb-12 md:mb-16 max-w-3xl mx-auto leading-relaxed px-4">
            Экспортные, импортные и транзитные перевозки
          </p>

          {/* Three main action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16 md:mb-20 px-4">
            <button
              onClick={() => document.getElementById('calculator-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-6 sm:px-8 py-4 sm:py-5 bg-white text-custom-blue-900 rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full sm:w-auto border-2 border-white shadow-lg"
            >
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 sm:mr-3 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
                Получить расчет
              </span>
            </button>
            
            <SmoothLink
              href="/contacts"
              className="group relative px-6 sm:px-8 py-4 sm:py-5 border-2 border-white text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 sm:mr-3 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Связаться с нами
              </span>
            </SmoothLink>
            
            <button
              onClick={() => document.getElementById('tracking-section')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative px-6 sm:px-8 py-4 sm:py-5 bg-transparent border-2 border-white/50 text-white rounded-full font-semibold text-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:border-white w-full sm:w-auto"
            >
              <span className="relative z-10 flex items-center justify-center">
                <svg className="w-5 h-5 mr-2 sm:mr-3 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Отследить груз
              </span>
            </button>
          </div>

          {/* Updated stats according to requirements */}
          <div className="grid grid-cols-3 gap-4 sm:gap-8 md:gap-12 max-w-4xl mx-auto px-4">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-4">
                <span className="bg-gradient-to-r from-custom-blue-200 to-white bg-clip-text text-transparent">
                  50+
                </span>
              </div>
              <p className="text-white/80 text-sm sm:text-base md:text-lg">
                стран доставки
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
                <span className="bg-gradient-to-r from-custom-blue-200 to-white bg-clip-text text-transparent">
                  Экспорт
                </span>
              </div>
              <p className="text-white/80 text-sm sm:text-base md:text-lg">
                Импорт • Транзит
              </p>
            </div>
            
            <div className="text-center">
              <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 sm:mb-4">
                <span className="bg-gradient-to-r from-custom-blue-200 to-white bg-clip-text text-transparent">
                  Под ключ
                </span>
              </div>
              <p className="text-white/80 text-sm sm:text-base md:text-lg">
                перевозки
              </p>
            </div>
          </div>
        </motion.div>
      </div>

          {/* Scroll indicator moved lower under stats */}
          <div className="absolute bottom-4 md:bottom-8 left-1/2 transform -translate-x-1/2">
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
