'use client';

import { useState, useEffect } from 'react';

export default function MobileGallery() {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Массив изображений для мобильной галереи
  const images = [
    {
      src: '/assets/images/авто.PNG',
      alt: 'Автомобильные перевозки'
    },
    {
      src: '/assets/images/жд.PNG', 
      alt: 'Железнодорожные перевозки'
    },
    {
      src: '/assets/images/склад.PNG',
      alt: 'Складские услуги'
    },
    {
      src: '/assets/images/auto-case.jpg',
      alt: 'Авто перевозки'
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
    <div className="relative w-full h-full overflow-hidden rounded-lg">
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
        <div className="absolute inset-0 bg-gradient-to-t from-velta-navy/20 via-transparent to-transparent" />
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
          />
        ))}
      </div>
    </div>
  );
}
