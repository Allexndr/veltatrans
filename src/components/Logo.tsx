'use client';

import {useState} from 'react';
import Link from 'next/link';

interface LogoProps {
  href?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Logo({href = '/', className = '', size = 'md'}: LogoProps) {
  // Use the mark-only image next to the brand text to avoid duplicating the wordmark
  const [src, setSrc] = useState('/images/logo-mark.png');
  const dimension = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;

  return (
    <Link href={href} className={`flex items-center ${className}`}>
      {/* Runtime fallback to placeholder if image not yet uploaded */}
      <img
        src={src}
        alt="Velta Trans"
        width={dimension}
        height={dimension}
        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 mr-2 sm:mr-3 object-contain"
        onError={() => setSrc('/file.svg')}
      />
      <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-custom-blue-900 to-custom-blue-700 bg-clip-text text-transparent">
        Velta Trans
      </span>
    </Link>
  );
}


