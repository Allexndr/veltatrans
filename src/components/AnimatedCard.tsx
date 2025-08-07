'use client';

import {motion, AnimatePresence} from 'framer-motion';
import {ReactNode} from 'react';

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  variant?: 'default' | 'elevated' | 'gradient';
  onClick?: () => void;
}

export default function AnimatedCard({
  children,
  className = '',
  delay = 0,
  variant = 'default',
  onClick
}: AnimatedCardProps) {
  const cardVariants = {
    hidden: { 
      y: 60, 
      opacity: 0, 
      scale: 0.9,
      rotateX: 15
    },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      rotateX: 0,
      transition: {
        duration: 0.8,
        ease: "easeOut" as const,
        delay
      }
    },
    hover: {
      y: -10,
      scale: 1.02,
      rotateY: 2,
      transition: {
        duration: 0.3,
        ease: "easeOut" as const
      }
    }
  };

  const getCardClasses = () => {
    const baseClasses = "relative rounded-3xl p-8 shadow-lg transition-all duration-500 transform border border-gray-100 overflow-hidden";
    
    switch (variant) {
      case 'elevated':
        return `${baseClasses} bg-white hover:shadow-2xl hover:shadow-custom-blue-100/50`;
      case 'gradient':
        return `${baseClasses} bg-gradient-to-br from-white to-gray-50 hover:from-custom-blue-50 hover:to-custom-blue-100`;
      default:
        return `${baseClasses} bg-white hover:shadow-2xl`;
    }
  };

  const getBackgroundGradient = () => {
    switch (variant) {
      case 'gradient':
        return "bg-gradient-to-br from-custom-blue-50/50 to-custom-blue-100/50";
      default:
        return "bg-gradient-to-br from-gray-50 to-white";
    }
  };

  return (
    <motion.div
      className={`group ${getCardClasses()} ${className}`}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      whileHover="hover"
      viewport={{ once: true, margin: "-50px" }}
      onClick={onClick}
      style={{
        perspective: "1000px"
      }}
    >
      {/* Background gradient on hover */}
      <motion.div
        className={`absolute inset-0 ${getBackgroundGradient()} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        initial={{ scale: 0.8, opacity: 0 }}
        whileHover={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Content wrapper */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Decorative elements */}
      <motion.div 
        className="absolute top-4 right-4 w-2 h-2 bg-custom-blue-200 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      />
      <motion.div 
        className="absolute bottom-4 left-4 w-1 h-1 bg-custom-blue-300 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        initial={{ scale: 0 }}
        whileHover={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      />
      
      {/* Shimmer effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6, ease: "easeInOut" }}
      />

      {/* Border glow effect */}
      <motion.div
        className="absolute inset-0 rounded-3xl border border-transparent group-hover:border-custom-blue-200/30 transition-colors duration-300"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
} 