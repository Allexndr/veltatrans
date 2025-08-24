'use client';

import {useState} from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'footer';
}

export default function Logo({className = '', size = 'md'}: LogoProps) {
  // Use the new Velta Trans logo from assets
  const [src, setSrc] = useState('/assets/logos/New Logo VELTA TRANS.png');
  
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

  return (
    <div className={`flex items-center ${className}`}>
      {/* New Velta Trans logo */}
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
        onError={() => setSrc('/assets/logos/New Logo VELTA TRANS svg.svg')}
      />
    </div>
  );
}


