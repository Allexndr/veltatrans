'use client';

import {useState} from 'react';
import Link from 'next/link';

interface LogoProps {
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export default function Logo({href = '/', className = '', size = 'md'}: LogoProps) {
  // Use the new Velta Trans logo
  const [src, setSrc] = useState('/images/logo-velta.png');
  
  // Увеличенные размеры для лучшего отображения
  const getDimensions = () => {
    switch (size) {
      case 'sm': return { width: 140, height: 42 };
      case 'md': return { width: 180, height: 54 };
      case 'lg': return { width: 240, height: 72 };
      case 'xl': return { width: 320, height: 96 };
      default: return { width: 180, height: 54 };
    }
  };

  const { width, height } = getDimensions();

  return (
    <Link href={href} className={`flex items-center ${className}`}>
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
        onError={() => setSrc('/images/logo-velta.svg')}
      />
    </Link>
  );
}


