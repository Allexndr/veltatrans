'use client';

import { useEffect, useState, useCallback, useRef } from 'react';

export default function AnimatedTruck() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [truckPosition, setTruckPosition] = useState({ x: 0, y: 0 });
  const [isMovingRight, setIsMovingRight] = useState(true);
  const [isIdle, setIsIdle] = useState(true);
  const [lastDirection, setLastDirection] = useState<'left' | 'right'>('right');
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Обновление позиции мыши
  const updateMousePosition = useCallback((e: MouseEvent) => {
    setMousePosition({ x: e.clientX, y: e.clientY });
    setIsIdle(false);

    // Reset idle timer
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    idleTimerRef.current = setTimeout(() => {
      setIsIdle(true);
    }, 150); // Уменьшил время до 150ms для более быстрой реакции
  }, []);

  useEffect(() => {
    document.addEventListener('mousemove', updateMousePosition, { passive: true });

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
    };
  }, [updateMousePosition]);

  // Следование грузовика за мышью (ближе к курсору)
  useEffect(() => {
    let animationId: number;

    const animate = () => {
      setTruckPosition(prev => {
        // Увеличил скорость следования (0.15 вместо 0.1) для более близкого положения
        const newX = prev.x + (mousePosition.x - prev.x) * 0.15;
        const newY = prev.y + (mousePosition.y - prev.y) * 0.15;

        // Определяем направление движения
        if (Math.abs(mousePosition.x - prev.x) > 0.5) {
          const movingRight = mousePosition.x > prev.x;
          setIsMovingRight(movingRight);
          setLastDirection(movingRight ? 'right' : 'left');
        }

        return { x: newX, y: newY };
      });

      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);
    return () => { if (animationId) { cancelAnimationFrame(animationId); } };
  }, [mousePosition]);

  // Определяем какое изображение использовать
  const getTruckImage = () => {
    if (isIdle) {
      // Когда курсор не двигается
      if (lastDirection === 'right') {
        return "/truck-svgrepo-com.svg"; // Шел справа налево
      } else {
        return "/Слой 1.png"; // Шел слева направо
      }
    } else {
      // Когда курсор движется
      if (isMovingRight) {
        return "/truck-speed-svgrepo-com (1).svg"; // Движется вправо
      } else {
        return "/truck-speed-svgrepo-com (1).svg"; // Движется влево
      }
    }
  };

  // Вычисляем угол поворота грузовика к курсору
  const getTruckRotation = () => {
    if (isIdle) return 0; // Не поворачиваем когда стоит
    
    const deltaX = mousePosition.x - truckPosition.x;
    const deltaY = mousePosition.y - truckPosition.y;
    const angle = Math.atan2(deltaY, deltaX) * (180 / Math.PI);
    
    // Поворачиваем кабину в сторону курсора
    return angle;
  };

  const imageSrc = getTruckImage();
  const isPng = imageSrc.endsWith('.png');
  const rotation = getTruckRotation();

  return (
    <div className="fixed pointer-events-none z-[9999]">
      {/* Грузовик с SVG иконками */}
      <div
        style={{
          position: 'fixed',
          left: `${truckPosition.x - 18}px`,
          top: `${truckPosition.y - 12}px`,
          width: '36px', // единый размер для всех ассетов
          height: '24px',
          zIndex: 99999,
          pointerEvents: 'none',
          transform: `rotate(${rotation}deg)`, // Поворачиваем грузовик
          transformOrigin: 'center center',
        }}
      >
        <img
          src={imageSrc}
          alt="Грузовик"
          className={`w-full h-full`}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'contain',
            // Принудительно белый + тонкая темная окантовка, чтобы не терялся на светлом фоне
            filter: 'invert(1) brightness(2) drop-shadow(0 0 2px rgba(0,0,0,0.55)) drop-shadow(0 0 1px rgba(0,0,0,0.55))' as any,
          }}
        />
      </div>
    </div>
  );
}
