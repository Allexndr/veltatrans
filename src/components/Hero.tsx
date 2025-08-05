'use client';

import {Link} from '@/i18n/routing';
import SmoothLink from './SmoothLink';
import {useEffect, useState} from 'react';

export default function Hero({locale}: {locale: string}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState<any>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const msg = (await import(`../../messages/${locale}.json`)).default;
      setMessages(msg);
      setIsLoaded(true);
    };
    loadMessages();
  }, [locale]);

  if (!isLoaded || !messages) {
    return <div className="h-96 bg-gradient-to-br from-custom-blue-900 to-custom-blue-700 animate-pulse"></div>;
  }

  const t = (key: string) => messages.home?.[key] || key;
  const tNav = (key: string) => messages.navigation?.[key] || key;

  return (
    <section className="relative bg-gradient-to-br from-custom-blue-900 via-custom-blue-800 to-custom-blue-700 text-white py-20 overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating containers */}
        <div className="absolute top-10 left-10 animate-bounce" style={{animationDelay: '0s', animationDuration: '3s'}}>
          <div className="w-16 h-12 bg-white/10 rounded-lg transform rotate-12"></div>
        </div>
        <div className="absolute top-20 right-20 animate-bounce" style={{animationDelay: '1s', animationDuration: '4s'}}>
          <div className="w-20 h-14 bg-white/10 rounded-lg transform -rotate-12"></div>
        </div>
        <div className="absolute bottom-20 left-1/4 animate-bounce" style={{animationDelay: '2s', animationDuration: '3.5s'}}>
          <div className="w-12 h-8 bg-white/10 rounded-lg transform rotate-45"></div>
        </div>
        
        {/* Moving trucks */}
        <div className="absolute top-1/3 left-0 animate-pulse" style={{animationDuration: '2s'}}>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-6 bg-white/20 rounded-lg"></div>
            <div className="w-4 h-4 bg-white/20 rounded-full"></div>
            <div className="w-4 h-4 bg-white/20 rounded-full"></div>
          </div>
        </div>
        
        <div className="absolute bottom-1/3 right-0 animate-pulse" style={{animationDuration: '2.5s', animationDelay: '1s'}}>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-white/20 rounded-full"></div>
            <div className="w-4 h-4 bg-white/20 rounded-full"></div>
            <div className="w-8 h-6 bg-white/20 rounded-lg"></div>
          </div>
        </div>

        {/* Animated grid pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            animation: 'moveGrid 20s linear infinite'
          }}></div>
        </div>
      </div>

      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Animated title */}
          <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in-up" style={{animationDelay: '0.3s'}}>
            <span className="inline-block animate-slide-in-left" style={{animationDelay: '0.5s'}}>
              {t('title').split(' ').slice(0, 2).join(' ')}
            </span>
            <br />
            <span className="inline-block animate-slide-in-right" style={{animationDelay: '0.8s'}}>
              {t('title').split(' ').slice(2).join(' ')}
            </span>
          </h1>
          
          {/* Animated subtitle */}
          <p className="text-xl md:text-2xl mb-8 text-custom-blue-100 animate-fade-in-up" style={{animationDelay: '1s'}}>
            {t('subtitle')}
          </p>
          
          {/* Animated description */}
          <p className="text-lg mb-10 text-custom-blue-100 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '1.2s'}}>
            {t('description')}
          </p>
          
          {/* Animated buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up" style={{animationDelay: '1.5s'}}>
            <SmoothLink
              href="/calculator"
              className="group bg-white text-custom-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              {t('cta')}
            </SmoothLink>
            <SmoothLink
              href="/services"
              className="group border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-custom-blue-900 transition-all duration-300 inline-flex items-center justify-center transform hover:scale-105 hover:shadow-xl"
            >
              <svg className="w-5 h-5 mr-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {tNav('services')}
            </SmoothLink>
          </div>
        </div>
      </div>

      {/* Animated wave */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="relative block w-full h-16">
          <path 
            d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" 
            fill="white"
            className="animate-wave"
          ></path>
        </svg>
      </div>



      <style jsx>{`
        @keyframes moveGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
        
        @keyframes wave {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(-10px); }
        }
        
        @keyframes slide-in-left {
          from { transform: translateX(-100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-in-right {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-wave {
          animation: wave 3s ease-in-out infinite;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out forwards;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 1s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out forwards;
          opacity: 0;
        }
      `}</style>
    </section>
  );
}
