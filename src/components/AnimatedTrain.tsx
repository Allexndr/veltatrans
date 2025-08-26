'use client';

import { useEffect, useState, useCallback } from 'react';

export default function AnimatedTruck() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [truckPosition, setTruckPosition] = useState({ x: 0, y: 0 });
  const [truckAngle, setTruckAngle] = useState(0);
  const [isMovingRight, setIsMovingRight] = useState(true);
  const [trail, setTrail] = useState<Array<{ x: number; y: number; angle: number; opacity: number }>>([]);

  // Оптимизированное обновление позиции мыши
  const updateMousePosition = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', updateMousePosition, { passive: true });
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [updateMousePosition]);

  // Плавное следование грузовика за мышью с поворотом и следом
  useEffect(() => {
    let animationId: number;
    
    const animate = () => {
      setTruckPosition(prev => {
        const newX = prev.x + (mousePosition.x - prev.x) * 0.08;
        const newY = prev.y + (mousePosition.y - prev.y) * 0.08;
        
        // Определяем направление движения
        const movingRight = newX > prev.x;
        setIsMovingRight(movingRight);
        
        // Вычисляем угол поворота к новой позиции
        if (Math.abs(mousePosition.x - prev.x) > 1 || Math.abs(mousePosition.y - prev.y) > 1) {
          const deltaX = mousePosition.x - prev.x;
          const deltaY = mousePosition.y - prev.y;
          const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
          setTruckAngle(angle);
          
          // Добавляем новый след
          setTrail(prevTrail => {
            const newTrail = [
              { x: prev.x, y: prev.y, angle: angle, opacity: 0.8 },
              ...prevTrail.slice(0, 14) // Ограничиваем длину следа
            ];
            return newTrail;
          });
        }
        
        return { x: newX, y: newY };
      });
      
      // Обновляем прозрачность следа
      setTrail(prevTrail => 
        prevTrail.map((point, index) => ({
          ...point,
          opacity: Math.max(0, 0.8 - (index * 0.05))
        }))
      );
      
      animationId = requestAnimationFrame(animate);
    };
    
    animationId = requestAnimationFrame(animate);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [mousePosition]);

  if (!isVisible) return null;

  return (
    <div className="fixed pointer-events-none z-[9999]">
      {/* След за грузовиком */}
      {trail.map((point, index) => (
        <div
          key={index}
          className="absolute transition-all duration-300 ease-out"
          style={{
            left: point.x - 20,
            top: point.y - 20,
            transform: `rotate(${point.angle}deg)`,
            opacity: point.opacity,
          }}
        >
          <div className="w-10 h-6 bg-white/20 rounded-lg border border-white/30 shadow-sm" />
        </div>
      ))}

      {/* Грузовик */}
      <div
        className="absolute transition-transform duration-75 ease-out"
        style={{
          left: truckPosition.x - 20,
          top: truckPosition.y - 20,
          transform: `rotate(${truckAngle}deg)`,
        }}
      >
        {/* Основной корпус грузовика */}
        <div className="w-10 h-6 bg-white rounded-lg shadow-lg relative border border-gray-200">
          {/* Кабина (прямоугольник слева) */}
          <div className="absolute top-1 left-1 w-3 h-4 bg-gray-800 rounded" />
          
          {/* Кузов (прямоугольник справа) */}
          <div className="absolute top-1 right-1 w-5 h-4 bg-blue-600 rounded" />
          
          {/* Окна кабины */}
          <div className="absolute top-1.5 left-1.5 w-1.5 h-1.5 bg-blue-300 rounded" />
          
          {/* Фары */}
          <div className="absolute top-0.5 left-0.5 w-1 h-1 bg-yellow-400 rounded-full" />
          <div className="absolute top-0.5 right-0.5 w-1 h-1 bg-yellow-400 rounded-full" />
          
          {/* Колеса */}
          <div className="absolute -bottom-1 left-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600" />
          <div className="absolute -bottom-1 right-1 w-2 h-2 bg-gray-800 rounded-full border border-gray-600" />
        </div>
      </div>

      {/* Анимированный след движения */}
      <div
        className="absolute transition-all duration-500 ease-out"
        style={{
          left: truckPosition.x - 25,
          top: truckPosition.y - 15,
          transform: `rotate(${truckAngle}deg)`,
        }}
      >
        {/* След от колес */}
        <div className="w-12 h-2 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-full animate-pulse" />
      </div>
    </div>
  );
}
