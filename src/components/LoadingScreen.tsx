'use client';

import TruckLoader from './TruckLoader';

interface LoadingScreenProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  speed?: 'slow' | 'normal' | 'fast';
  className?: string;
}

export default function LoadingScreen({
  message = 'Загрузка...',
  size = 'md',
  speed = 'normal',
  className = ''
}: LoadingScreenProps) {
  return (
    <div className={`flex flex-col items-center justify-center min-h-[200px] p-8 ${className}`}>
      {/* Анимированный грузовик */}
      <div className="mb-6">
        <TruckLoader size={size} speed={speed} />
      </div>
      
      {/* Сообщение загрузки */}
      <div className="text-center">
        <p className="text-lg font-medium text-gray-700 mb-2">{message}</p>
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-velta-500 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-2 h-2 bg-velta-500 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-2 h-2 bg-velta-500 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      </div>
    </div>
  );
} 