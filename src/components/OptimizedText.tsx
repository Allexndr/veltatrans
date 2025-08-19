'use client';

import {motion} from 'framer-motion';
import {ReactNode} from 'react';

interface OptimizedTextProps {
  children: ReactNode;
  className?: string;
  variant?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
  weight?: 'light' | 'normal' | 'medium' | 'semibold' | 'bold' | 'extrabold' | 'black';
  color?: 'default' | 'primary' | 'secondary' | 'muted' | 'white' | 'gradient';
  align?: 'left' | 'center' | 'right' | 'justify';
  animate?: boolean;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  gradient?: 'blue' | 'purple' | 'green' | 'orange' | 'custom';
}

export default function OptimizedText({
  children,
  className = '',
  variant = 'div',
  size = 'base',
  weight = 'normal',
  color = 'default',
  align = 'left',
  animate = false,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 30,
  gradient = 'blue'
}: OptimizedTextProps) {
  const getSizeClasses = () => {
    const sizeMap = {
      xs: 'text-xs',
      sm: 'text-sm',
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl',
      '5xl': 'text-5xl',
      '6xl': 'text-6xl',
      '7xl': 'text-7xl',
      '8xl': 'text-8xl',
      '9xl': 'text-9xl'
    };
    return sizeMap[size] || 'text-base';
  };

  const getWeightClasses = () => {
    const weightMap = {
      light: 'font-light',
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
      extrabold: 'font-extrabold',
      black: 'font-black'
    };
    return weightMap[weight] || 'font-normal';
  };

  const getColorClasses = () => {
    const colorMap = {
      default: 'text-gray-900',
      primary: 'text-custom-blue-600',
      secondary: 'text-gray-600',
      muted: 'text-gray-500',
      white: 'text-white',
      gradient: 'text-gray-900' // fallback for gradient
    };
    return colorMap[color] || 'text-gray-900';
  };

  const getGradientClasses = () => {
    const gradientMap = {
      blue: 'bg-gradient-to-r from-custom-blue-600 to-custom-blue-700 bg-clip-text text-transparent',
      purple: 'bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent',
      green: 'bg-gradient-to-r from-green-600 to-green-700 bg-clip-text text-transparent',
      orange: 'bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent',
      custom: 'bg-gradient-to-r from-custom-blue-900 to-custom-blue-700 bg-clip-text text-transparent'
    };
    return gradientMap[gradient] || gradientMap.blue;
  };

  const getAlignClasses = () => {
    const alignMap = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify'
    };
    return alignMap[align] || 'text-left';
  };

  const getInitialPosition = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 };
      case 'down':
        return { y: -distance, opacity: 0 };
      case 'left':
        return { x: distance, opacity: 0 };
      case 'right':
        return { x: -distance, opacity: 0 };
      case 'none':
        return { opacity: 0, scale: 0.95 };
      default:
        return { y: distance, opacity: 0 };
    }
  };

  const getFinalPosition = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: 0, opacity: 1 };
      case 'left':
      case 'right':
        return { x: 0, opacity: 1 };
      case 'none':
        return { opacity: 1, scale: 1 };
      default:
        return { y: 0, opacity: 1 };
    }
  };

  const variants = {
    hidden: getInitialPosition(),
    visible: {
      ...getFinalPosition(),
      transition: {
        duration,
        delay,
        ease: "easeOut" as const
      }
    }
  };

  const baseClasses = `${getSizeClasses()} ${getWeightClasses()} ${getAlignClasses()} ${className}`;
  const colorClasses = color === 'gradient' ? getGradientClasses() : getColorClasses();
  const finalClasses = `${baseClasses} ${colorClasses}`;

  const Component = variant as keyof React.JSX.IntrinsicElements;

  if (!animate) {
    return <Component className={finalClasses}>{children}</Component>;
  }

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
    >
      <Component className={finalClasses}>{children}</Component>
    </motion.div>
  );
} 