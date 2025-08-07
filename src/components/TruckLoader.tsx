'use client';

import {useState, useEffect} from 'react';

interface TruckLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

export default function TruckLoader({size = 'md', className = '', speed = 'normal'}: TruckLoaderProps) {
  const [dots, setDots] = useState<Array<{id: number; opacity: number; scale: number}>>([]);
  const [truckPosition, setTruckPosition] = useState(0);
  const [bounceOffset, setBounceOffset] = useState(0);

  const speedConfig = {
    slow: {truck: 150, dots: 100, bounce: 800},
    normal: {truck: 100, dots: 50, bounce: 500},
    fast: {truck: 50, dots: 25, bounce: 300}
  };

  useEffect(() => {
    // Создаем точки маршрута
    const initialDots = Array.from({length: 12}, (_, i) => ({
      id: i,
      opacity: 0,
      scale: 0
    }));
    setDots(initialDots);

    // Анимация грузовика
    const truckInterval = setInterval(() => {
      setTruckPosition(prev => {
        if (prev >= 100) {
          return 0;
        }
        return prev + 1.5;
      });
    }, speedConfig[speed].truck);

    // Анимация подпрыгивания
    const bounceInterval = setInterval(() => {
      setBounceOffset(prev => prev === 0 ? 1 : 0);
    }, speedConfig[speed].bounce);

    // Анимация точек
    const dotsInterval = setInterval(() => {
      setDots(prev => 
        prev.map((dot, index) => {
          const dotPosition = 5 + index * 7.5;
          const distance = Math.abs(truckPosition - dotPosition);
          
          if (distance < 5) {
            return {
              ...dot,
              opacity: Math.min(1, (5 - distance) / 2),
              scale: Math.min(1, (5 - distance) / 2)
            };
          } else if (distance < 15) {
            return {
              ...dot,
              opacity: Math.max(0, 1 - (distance - 5) / 10),
              scale: Math.max(0.3, 1 - (distance - 5) / 10)
            };
          } else {
            return {
              ...dot,
              opacity: 0,
              scale: 0
            };
          }
        })
      );
    }, speedConfig[speed].dots);

    return () => {
      clearInterval(truckInterval);
      clearInterval(bounceInterval);
      clearInterval(dotsInterval);
    };
  }, [truckPosition, speed]);

  const sizeClasses = {
    sm: 'w-20 h-10',
    md: 'w-32 h-16', 
    lg: 'w-40 h-20'
  };

  const truckSizeClasses = {
    sm: 'w-10 h-5',
    md: 'w-14 h-7',
    lg: 'w-18 h-9'
  };

  const dotSizeClasses = {
    sm: 'w-1 h-1',
    md: 'w-1.5 h-1.5',
    lg: 'w-2 h-2'
  };

  return (
    <div className={`relative ${sizeClasses[size]} ${className}`}>
      {/* Фоновая дорога */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 rounded-full shadow-inner"></div>
      
      {/* Точки маршрута */}
      {dots.map((dot, index) => (
        <div
          key={dot.id}
          className={`absolute bottom-1 ${dotSizeClasses[size]} bg-gradient-to-r from-custom-blue-400 to-custom-blue-600 rounded-full transition-all duration-300 shadow-sm`}
          style={{
            left: `${5 + index * 7.5}%`,
            opacity: dot.opacity,
            transform: `scale(${dot.scale})`,
            filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))'
          }}
        />
      ))}
      
      {/* Грузовик */}
      <div
        className={`absolute bottom-1.5 ${truckSizeClasses[size]} transition-all duration-75 ease-linear`}
        style={{
          left: `${truckPosition}%`,
          transform: `translateY(${bounceOffset * -0.5}px)`
        }}
      >
        {/* Кабина грузовика */}
        <div className="w-3/5 h-full bg-gradient-to-br from-custom-blue-600 to-custom-blue-700 rounded-l-lg relative shadow-lg">
          {/* Окно */}
          <div className="absolute top-1 left-1 w-2 h-1.5 bg-gradient-to-br from-blue-100 to-blue-200 rounded-sm shadow-inner"></div>
          {/* Фары */}
          <div className="absolute top-1 right-1 w-0.5 h-0.5 bg-yellow-300 rounded-full shadow-sm animate-pulse"></div>
          {/* Дверная ручка */}
          <div className="absolute top-2 left-0.5 w-0.5 h-0.5 bg-gray-600 rounded-full"></div>
        </div>
        
        {/* Кузов */}
        <div className="absolute top-0 right-0 w-2/5 h-full bg-gradient-to-br from-custom-blue-700 to-custom-blue-800 rounded-r-lg shadow-lg">
          {/* Груз в кузове */}
          <div className="absolute top-1 left-1 right-1 bottom-1 bg-gradient-to-br from-custom-blue-800 to-custom-blue-900 rounded-sm">
            {/* Детали груза */}
            <div className="absolute top-0.5 left-0.5 w-1 h-0.5 bg-custom-blue-600 rounded-sm"></div>
            <div className="absolute top-0.5 right-0.5 w-1 h-0.5 bg-custom-blue-600 rounded-sm"></div>
          </div>
        </div>
        
        {/* Колеса */}
        <div className="absolute -bottom-0.5 left-1.5 w-1.5 h-1.5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full shadow-lg border border-gray-700"></div>
        <div className="absolute -bottom-0.5 right-1.5 w-1.5 h-1.5 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full shadow-lg border border-gray-700"></div>
        
        {/* Выхлопная труба */}
        <div className="absolute bottom-0.5 left-0 w-0.5 h-1 bg-gray-700 rounded-t-sm"></div>
      </div>
      
      {/* Дым из выхлопной трубы */}
      <div
        className="absolute bottom-3 w-1 h-1 bg-gray-400 rounded-full opacity-40 animate-pulse"
        style={{
          left: `${truckPosition - 1}%`,
          animationDelay: '0.1s'
        }}
      />
      <div
        className="absolute bottom-2.5 w-0.5 h-0.5 bg-gray-300 rounded-full opacity-30 animate-pulse"
        style={{
          left: `${truckPosition - 0.5}%`,
          animationDelay: '0.3s'
        }}
      />
      
      {/* Пыль от колес */}
      <div
        className="absolute bottom-0.5 w-1 h-0.5 bg-gray-200 rounded-full opacity-20 animate-pulse"
        style={{
          left: `${truckPosition + 1}%`,
          animationDelay: '0.2s'
        }}
      />
    </div>
  );
} 