'use client';

import {motion, AnimatePresence} from 'framer-motion';
import {ReactNode} from 'react';

interface AnimatedButtonProps {
  children: ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  onClick?: () => void;
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
}

export default function AnimatedButton({
  children,
  className = '',
  variant = 'primary',
  size = 'md',
  onClick,
  disabled = false,
  icon,
  iconPosition = 'right',
  fullWidth = false
}: AnimatedButtonProps) {
  const getButtonClasses = () => {
    const baseClasses = "relative inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    const sizeClasses = {
      sm: "px-4 py-2 text-sm",
      md: "px-6 py-3 text-base",
      lg: "px-8 py-4 text-lg",
      xl: "px-10 py-5 text-xl"
    };

    const variantClasses = {
      primary: "bg-gradient-to-r from-velta-600 to-velta-700 text-white hover:from-velta-700 hover:to-velta-800 focus:ring-velta-500 shadow-lg hover:shadow-xl",
      secondary: "bg-gradient-to-r from-gray-600 to-gray-700 text-white hover:from-gray-700 hover:to-gray-800 focus:ring-gray-500 shadow-lg hover:shadow-xl",
      outline: "border-2 border-velta-600 text-velta-600 hover:bg-velta-600 hover:text-white focus:ring-velta-500",
      ghost: "text-velta-600 hover:bg-velta-50 focus:ring-velta-500"
    };

    const widthClass = fullWidth ? "w-full" : "";
    const disabledClass = disabled ? "opacity-50 cursor-not-allowed" : "hover:scale-105 active:scale-95";

    return `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${widthClass} ${disabledClass} ${className}`;
  };

  const getBackgroundGradient = () => {
    switch (variant) {
      case 'primary':
        return "bg-gradient-to-r from-velta-700 to-velta-800";
      case 'secondary':
        return "bg-gradient-to-r from-gray-700 to-gray-800";
      case 'outline':
        return "bg-velta-600";
      default:
        return "bg-velta-50";
    }
  };

  const buttonVariants = {
    primary: "bg-velta-navy text-white hover:bg-velta-700 focus:ring-velta-500 shadow-lg hover:shadow-xl",
    secondary: "bg-white text-velta-navy border-2 border-velta-navy hover:bg-velta-navy hover:text-white focus:ring-velta-500 shadow-lg hover:shadow-xl",
    outline: "bg-transparent text-velta-navy border-2 border-velta-navy hover:bg-velta-navy hover:text-white focus:ring-velta-500 shadow-lg hover:shadow-xl",
    ghost: "bg-transparent text-velta-navy hover:bg-velta-50 focus:ring-velta-500",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-lg hover:shadow-xl",
    success: "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 shadow-lg hover:shadow-xl",
    warning: "bg-yellow-600 text-white hover:bg-yellow-700 focus:ring-yellow-500 shadow-lg hover:shadow-xl",
    info: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 shadow-lg hover:shadow-xl",
  };

  const sizeClasses = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-2 text-base",
    lg: "px-6 py-3 text-lg",
    xl: "px-8 py-4 text-xl",
  };

  const getDisabledClasses = () => {
    if (variant === 'primary') return "bg-velta-navy";
    if (variant === 'secondary') return "bg-white";
    return "";
  };

  const iconVariants = {
    initial: { x: 0 },
    hover: { 
      x: iconPosition === 'right' ? 4 : -4,
      transition: { duration: 0.2 }
    }
  };

  return (
    <motion.button
      className={getButtonClasses()}
      variants={buttonVariants}
      initial="initial"
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      disabled={disabled}
    >
      {/* Background gradient on hover */}
      <motion.div
        className={`absolute inset-0 ${getBackgroundGradient()} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`}
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Content wrapper */}
      <span className="relative z-10 flex items-center">
        {icon && iconPosition === 'left' && (
          <motion.div
            className="mr-3"
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
          >
            {icon}
          </motion.div>
        )}
        
        <span>{children}</span>
        
        {icon && iconPosition === 'right' && (
          <motion.div
            className="ml-3"
            variants={iconVariants}
            initial="initial"
            whileHover="hover"
          >
            {icon}
          </motion.div>
        )}
      </span>

      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Ripple effect */}
      <motion.div
        className="absolute inset-0 rounded-full bg-white/20"
        initial={{ scale: 0, opacity: 0 }}
        whileTap={{ scale: 2, opacity: 0 }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
} 