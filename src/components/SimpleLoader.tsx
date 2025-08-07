'use client';

import TruckLoader from './TruckLoader';

interface SimpleLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
  showText?: boolean;
  text?: string;
}

export default function SimpleLoader({
  size = 'md',
  speed = 'normal',
  className = '',
  showText = false,
  text = 'Загрузка...'
}: SimpleLoaderProps) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <TruckLoader size={size} speed={speed} />
      {showText && (
        <p className="mt-3 text-sm text-gray-600 font-medium">{text}</p>
      )}
    </div>
  );
} 