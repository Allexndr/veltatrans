'use client';

import { useState, useEffect } from 'react';

export default function MobileGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Массив изображений для мобильной галереи
  const images = [
    {
      src: '/assets/images/авто.PNG',
      alt: 'Автомобильные перевозки',
      title: 'Авто перевозки'
    },
    {
      src: '/assets/images/жд.PNG', 
      alt: 'Железнодорожные перевозки',
      title: 'ЖД перевозки'
    },
    {
      src: '/assets/images/склад.PNG',
      alt: 'Складские услуги',
      title: 'Складские услуги'
    },
    {
      src: '/assets/images/auto-case.jpg',
      alt: 'Авто перевозки',
      title: 'Авто перевозки'
    }
  ];

  // Автоматическое листание каждые 3 секунды
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg bg-gradient-to-br from-velta-navy to-velta-600">
      {/* Основное изображение */}
      <div className="absolute inset-0">
        <img 
          src={images[currentIndex].src} 
          alt={images[currentIndex].alt}
          className="w-full h-full object-cover transition-opacity duration-500"
          onError={(e) => {
            // Заглушка на случай ошибки загрузки
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            target.parentElement!.style.background = 'linear-gradient(135deg, #1e3a8a, #3b82f6)';
          }}
        />
        {/* Градиентный оверлей */}
        <div className="absolute inset-0 bg-gradient-to-t from-velta-navy/60 via-transparent to-transparent" />
      </div>

      {/* Заголовок изображения */}
      <div className="absolute top-2 left-2 right-2 z-10">
        <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1 text-center">
          <p className="text-xs sm:text-sm font-medium text-velta-navy truncate">
            {images[currentIndex].title}
          </p>
        </div>
      </div>

      {/* Индикаторы слайдов */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 z-10 flex space-x-1.5">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white/50'
            }`}
            aria-label={`Перейти к слайду ${index + 1}`}
          />
        ))}
      </div>

      {/* Кнопки навигации */}
      <button
        onClick={() => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)}
        className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-6 h-6 sm:w-8 sm:h-8 bg-white/80 hover:bg-white text-velta-navy rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Предыдущий слайд"
      >
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      <button
        onClick={() => setCurrentIndex((prev) => (prev + 1) % images.length)}
        className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-6 h-6 sm:w-8 sm:h-8 bg-white/80 hover:bg-white text-velta-navy rounded-full flex items-center justify-center transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label="Следующий слайд"
      >
        <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
