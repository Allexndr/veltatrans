'use client';

import { useEffect, useState } from 'react';

export default function AnimatedCursor() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseEnter = () => setIsVisible(true);
    const handleMouseLeave = () => setIsVisible(false);

    // Эффекты для интерактивных элементов
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'BUTTON' || target.tagName === 'A' || target.closest('button') || target.closest('a')) {
        setIsHovering(true);
      }
    };

    const handleMouseOut = () => {
      setIsHovering(false);
    };

    document.addEventListener('mousemove', updateMousePosition);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseover', handleMouseOver);
    document.addEventListener('mouseout', handleMouseOut);

    return () => {
      document.removeEventListener('mousemove', updateMousePosition);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseover', handleMouseOver);
      document.removeEventListener('mouseout', handleMouseOut);
    };
  }, []);

  return (
    <>
      {/* Основной курсор */}
      <div
        className={`fixed top-0 left-0 rounded-full pointer-events-none z-[9999] mix-blend-difference transition-all duration-200 ease-out ${
          isHovering ? 'w-6 h-6 bg-velta-500' : 'w-4 h-4 bg-velta-navy'
        }`}
        style={{
          transform: `translate(${mousePosition.x - (isHovering ? 12 : 8)}px, ${mousePosition.y - (isHovering ? 12 : 8)}px)`,
          opacity: isVisible ? 1 : 0,
        }}
      />
      
      {/* Внешний круг */}
      <div
        className={`fixed top-0 left-0 border-2 rounded-full pointer-events-none z-[9998] transition-all duration-500 ease-out ${
          isHovering ? 'w-12 h-12 border-velta-500/50' : 'w-8 h-8 border-velta-navy/30'
        }`}
        style={{
          transform: `translate(${mousePosition.x - (isHovering ? 24 : 16)}px, ${mousePosition.y - (isHovering ? 24 : 16)}px)`,
          opacity: isVisible ? 1 : 0,
        }}
      />
      
      {/* Точка в центре */}
      <div
        className="fixed top-0 left-0 w-1 h-1 bg-white rounded-full pointer-events-none z-[10000] transition-transform duration-150 ease-out"
        style={{
          transform: `translate(${mousePosition.x - 0.5}px, ${mousePosition.y - 0.5}px)`,
          opacity: isVisible ? 1 : 0,
        }}
      />
      
      {/* Дополнительный эффект для кнопок */}
      {isHovering && (
        <div
          className="fixed top-0 left-0 w-16 h-16 bg-velta-500/10 rounded-full pointer-events-none z-[9997] animate-ping"
          style={{
            transform: `translate(${mousePosition.x - 32}px, ${mousePosition.y - 32}px)`,
            opacity: isVisible ? 1 : 0,
          }}
        />
      )}
    </>
  );
}
