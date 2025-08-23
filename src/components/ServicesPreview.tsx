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
      title: 'Автоперевозки',
      description: 'Мы организуем международные автомобильные перевозки из Китая в Россию, Казахстан и Европу. Работаем как с комплектными грузами (FTL), так и со сборными (LTL). У нас собственная сеть проверенных перевозчиков и надежная система отслеживания.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M19 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0 -4 0M3 12h2m14 0h2M12 3v18" />
        </svg>
      ),
      href: '/services/land',
      gradient: 'from-green-500 to-emerald-500'
    },
    {
      id: 2,
      title: 'Железнодорожные перевозки',
      description: 'Прямые контейнерные поезда из Китая в Россию и страны СНГ. Возможность отправки как полных контейнеров (FCL), так и сборных грузов (LCL). Оперативные сроки и конкурентные тарифы.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M3 14h18m-9-4v8m-2 0h4" />
        </svg>
      ),
      href: '/services/railway',
      gradient: 'from-gray-500 to-slate-500'
    },
    {
      id: 3,
      title: 'Мультимодальные перевозки',
      description: 'Комбинация морского, автомобильного и железнодорожного транспорта. Оптимальное решение по цене и срокам доставки. Подбираем маршрут под задачу клиента.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      href: '/services/multimodal',
      gradient: 'from-orange-500 to-red-500'
    },
    {
      id: 4,
      title: 'Проектные перевозки',
      description: 'Доставка негабаритных и тяжеловесных грузов. Разработка маршрута, организация спецтехники и согласования. Опыт перевозки оборудования для строительства и энергетики.',
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      ),
      href: '/services/project',
      gradient: 'from-purple-500 to-indigo-500'
    }
  ];

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-velta-50 rounded-full blur-2xl animate-pulse" />
      <div className="absolute bottom-20 right-10 w-40 h-40 bg-velta-50 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
      
      <div className="relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">


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
              <div className="relative bg-white rounded-3xl p-8 shadow-lg transition-all duration-500 transform border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-velta-100/50 hover:-translate-y-2 flex flex-col h-full">
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
                  <h3 className="text-2xl font-bold text-gray-900 mb-4 group-hover:text-velta-600 transition-colors duration-300 min-h-[64px]">
                    {service.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 leading-relaxed mb-6 flex-1">
                    {service.description}
                  </p>
                  
                  {/* Link */}
                   <SmoothLink
                    href={service.href}
                    className="inline-flex items-center text-velta-600 font-semibold hover:text-velta-700 transition-colors duration-300 group/link text-base md:text-lg"
                  >
                    {t('more')}
                    <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                    </svg>
                  </SmoothLink>
                </div>
                
                {/* Decorative elements */}
                <div className="absolute top-4 right-4 w-2 h-2 bg-velta-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-4 left-4 w-1 h-1 bg-velta-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                              </div>
              </motion.div>
            ))}
          </motion.div>


      </div>
    </section>
  );
}
