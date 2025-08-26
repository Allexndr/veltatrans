'use client';

import {useState} from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'footer';
  // Пропсы для управления расположением
  margin?: string;
  marginLeft?: string;
  marginRight?: string;
  marginTop?: string;
  marginBottom?: string;
  padding?: string;
  paddingLeft?: string;
  paddingRight?: string;
  paddingTop?: string;
  paddingBottom?: string;
  alignment?: 'left' | 'center' | 'right';
  position?: 'relative' | 'absolute' | 'fixed' | 'sticky';
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex?: string;
  transform?: string;
}

export default function Logo({
  className = '', 
  size = 'md',
  margin,
  marginLeft,
  marginRight,
  marginTop,
  marginBottom,
  padding,
  paddingLeft,
  paddingRight,
  paddingTop,
  paddingBottom,
  alignment = 'left',
  position = 'relative',
  top,
  left,
  right,
  bottom,
  zIndex,
  transform
}: LogoProps) {
  // Use the new Velta Trans logo from favicon.png
  const [src, setSrc] = useState('/favicon.png');
  
  // Увеличенные размеры для лучшего отображения (удвоены)
  const getDimensions = () => {
    switch (size) {
      case 'sm': return { width: 280, height: 84 };
      case 'md': return { width: 360, height: 108 };
      case 'lg': return { width: 480, height: 144 };
      case 'xl': return { width: 640, height: 192 };
      case 'footer': return { width: 800, height: 240 };
      default: return { width: 360, height: 108 };
    }
  };

  const { width, height } = getDimensions();

  // Создаем стили для позиционирования
  const positioningStyles = {
    margin,
    marginLeft,
    marginRight,
    marginTop,
    marginBottom,
    padding,
    paddingLeft,
    paddingRight,
    paddingTop,
    paddingBottom,
    position,
    top,
    left,
    right,
    bottom,
    zIndex,
    transform
  };

  // Фильтруем undefined значения
  const cleanStyles = Object.fromEntries(
    Object.entries(positioningStyles).filter(([_, value]) => value !== undefined)
  );

  // Определяем выравнивание
  const getAlignmentClass = () => {
    switch (alignment) {
      case 'center': return 'justify-center';
      case 'right': return 'justify-end';
      default: return 'justify-start';
    }
  };

  return (
    <div 
      className={`flex items-center ${getAlignmentClass()} ${className}`}
      style={cleanStyles}
    >
      {/* Новый логотип VELTA TRANS */}
      <div className="relative">
        <img
          src={src}
          alt="Velta Trans"
          width={width}
          height={height}
          className={`object-contain transition-all duration-300 hover:scale-105`}
          style={{
            height: `${height}px`,
            minHeight: `${height}px`
          }}
          onError={() => setSrc('/assets/logos/New Logo VELTA TRANS.png')}
        />
      </div>
    </div>
  );
}


