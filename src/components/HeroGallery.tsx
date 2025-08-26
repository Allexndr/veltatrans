'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HeroGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Массив изображений логистики с новыми фотографиями
  const images = [
    // Авто
    {
      src: '/assets/images/auto-case.jpg',
      alt: 'Автомобильные перевозки — VELTA TRANS',
      title: 'Автомобильные перевозки',
      icon: '🚛'
    },
    // ЖД
    {
      src: '/assets/images/railway-case.jpg', 
      alt: 'Железнодорожные перевозки — VELTA TRANS',
      title: 'Железнодорожные перевозки',
      icon: '🚂'
    },
    // Склад
    {
      src: '/assets/images/warehouse-case.jpg',
      alt: 'Складские услуги — VELTA TRANS',
      title: 'Складские услуги',
      icon: '🏭'
    },
    // Мультимодальные
    {
      src: '/assets/images/multimodal-transport.jpg',
      alt: 'Мультимодальные перевозки',
      title: 'Мультимодальные перевозки',
      icon: '🚢✈️'
    },
    // Проектные
    {
      src: '/assets/images/project-cargo.jpg',
      alt: 'Проектные перевозки - крупногабаритные грузы',
      title: 'Проектные перевозки',
      icon: '🏗️'
    },
    // Таможенные
    {
      src: '/assets/images/customs-new.jpg',
      alt: 'Таможенное оформление и документооборот',
      title: 'Таможенные услуги',
      icon: '🏛️'
    }
  ];

  // Автоматическое листание каждые 4 секунды
  useEffect(() => {
    if (isPaused) return;
    
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [images.length, isPaused]);

  // Функция для перехода к конкретному слайду
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  // Функция для перехода к следующему слайду
  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  // Функция для перехода к предыдущему слайду
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div 
      className="relative w-full h-full overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Основное изображение */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="absolute inset-0"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          {/* Реальное изображение с градиентным оверлеем */}
          <div className="w-full h-full relative">
            <img 
              src={images[currentIndex].src} 
              alt={images[currentIndex].alt}
              className="w-full h-full object-cover"
              onError={(e) => {
                // Если изображение не загрузилось, показываем градиентную заглушку
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const fallback = target.nextElementSibling as HTMLElement;
                if (fallback) fallback.style.display = 'block';
              }}
            />
            {/* Градиентная заглушка на случай ошибки загрузки */}
            <div 
              className="absolute inset-0 bg-gradient-to-br from-velta-navy via-velta-700 to-velta-600 hidden"
              style={{ display: 'none' }}
            />
            {/* Градиентный оверлей */}
            <div className="absolute inset-0 bg-gradient-to-t from-velta-navy via-transparent to-transparent" />
            
            {/* Центральная иконка */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white/20">
              <div className="text-8xl md:text-9xl animate-pulse">
                {images[currentIndex].icon}
              </div>
            </div>
            
            {/* Заголовок изображения */}
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <h3 className="text-2xl md:text-3xl font-bold mb-2">
                {images[currentIndex].title}
              </h3>
              <p className="text-white/80 text-lg">
                {images[currentIndex].alt}
              </p>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Навигационные стрелки */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
        aria-label="Предыдущий слайд"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
        aria-label="Следующий слайд"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Индикаторы слайдов */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-20 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>

      {/* Прогресс-бар */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 z-20">
        <motion.div
          className="h-full bg-white"
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ duration: 4, ease: "linear" }}
          key={currentIndex}
        />
      </div>
    </div>
  );
}
