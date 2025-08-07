'use client';

import {motion, AnimatePresence} from 'framer-motion';
import {useState} from 'react';
import Image from 'next/image';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  quality?: number;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  onClick?: () => void;
  variant?: 'default' | 'rounded' | 'circle';
}

export default function OptimizedImage({
  src,
  alt,
  width = 400,
  height = 300,
  className = '',
  priority = false,
  quality = 85,
  placeholder = 'empty',
  blurDataURL,
  onClick,
  variant = 'default'
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);

  const getVariantClasses = () => {
    switch (variant) {
      case 'rounded':
        return 'rounded-2xl';
      case 'circle':
        return 'rounded-full';
      default:
        return 'rounded-lg';
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    },
    loaded: { 
      opacity: 1,
      transition: { duration: 0.3 }
    }
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 1.1 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  if (isError) {
    return (
      <motion.div
        className={`bg-gray-200 flex items-center justify-center ${getVariantClasses()} ${className}`}
        style={{ width, height }}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </motion.div>
    );
  }

  return (
    <motion.div
      className={`relative overflow-hidden ${getVariantClasses()} ${className}`}
      style={{ width, height }}
      variants={containerVariants}
      initial="hidden"
      animate={isLoaded ? "loaded" : "visible"}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      onClick={onClick}
    >
      {/* Loading skeleton */}
      {!isLoaded && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-gray-200 to-gray-300 animate-pulse"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Image */}
      <motion.div
        className="relative w-full h-full"
        variants={imageVariants}
        initial="hidden"
        animate="visible"
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`object-cover ${getVariantClasses()}`}
          priority={priority}
          quality={quality}
          placeholder={placeholder}
          blurDataURL={blurDataURL}
          onLoad={() => setIsLoaded(true)}
          onError={() => setIsError(true)}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />
      </motion.div>

      {/* Overlay on hover */}
      <motion.div
        className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />

      {/* Loading indicator */}
      {!isLoaded && !isError && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 1 }}
          animate={{ opacity: isLoaded ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className="w-8 h-8 border-2 border-custom-blue-600 border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          />
        </motion.div>
      )}
    </motion.div>
  );
} 