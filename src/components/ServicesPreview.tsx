'use client';

import {useTranslations} from 'next-intl';
import SmoothLink from './SmoothLink';
import {motion, useInView} from 'framer-motion';
import {useRef} from 'react';

export default function ServicesPreview({}: {locale: string}) {
  const t = useTranslations('services');
  const ref = useRef(null);
  const isInView = useInView(ref, {once: true, margin: "-100px"});

  const services = [
    {
      id: 1,
      title: t('air.title'),
      description: t('air.description'),
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
        </svg>
      ),
      href: '/services/air',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      id: 2,
      title: t('sea.title'),
      description: t('sea.description'),
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
      ),
      href: '/services/sea',
      gradient: 'from-indigo-500 to-purple-500'
    },
    {
      id: 3,
      title: t('land.title'),
      description: t('land.description'),
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      href: '/services/land',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 4,
      title: t('multimodal.title'),
      description: t('multimodal.description'),
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      href: '/services/multimodal',
      gradient: 'from-orange-500 to-red-500'
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-custom-blue-50 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-custom-blue-50 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


        {/* Services grid */}
        <motion.div 
          ref={ref}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12 items-stretch"
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
          transition={{ duration: 0.8, staggerChildren: 0.2 }}
        >
                      {services.map((service, index) => (
              <motion.div 
                key={service.id} 
                className="group relative"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
              <div className="relative bg-white rounded-3xl p-8 shadow-lg transition-all duration-500 transform border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-custom-blue-100/50 hover:-translate-y-2 flex flex-col h-full">
                {/* Background gradient on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500`} />
                
                {/* Content */}
                <div className="relative z-10">
                  {/* Icon */}
                  <div className={`w-20 h-20 bg-gradient-to-br ${service.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                    <div className="text-white group-hover:rotate-12 transition-transform duration-300">
                      {service.icon}
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-custom-blue-600 transition-colors duration-300 min-h-[64px]">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6 min-h-[84px]">
                    {service.description}
                  </p>
                  
                  {/* Link */}
                   <SmoothLink
                    href={service.href}
                    className="mt-auto inline-flex items-center text-custom-blue-600 font-semibold hover:text-custom-blue-700 transition-colors duration-300 group/link text-base md:text-lg"
                  >
                    {t('more')}
                    <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </SmoothLink>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-custom-blue-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-custom-blue-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              </div>
              </motion.div>
            ))}
          </motion.div>


      </div>
    </section>
  );
}
