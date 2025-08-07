'use client';

import {motion, useInView, AnimatePresence} from 'framer-motion';
import {useRef, ReactNode} from 'react';

interface LazyLoadProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'none';
  distance?: number;
  once?: boolean;
}

export default function LazyLoad({
  children,
  className = '',
  threshold = 0.1,
  delay = 0,
  duration = 0.6,
  direction = 'up',
  distance = 50,
  once = true
}: LazyLoadProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { 
    once, 
    margin: `-${threshold * 100}px` 
  });

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
        return { opacity: 0, scale: 0.9 };
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
        ease: "easeOut"
      }
    }
  };

  return (
    <motion.div
      ref={ref}
      className={className}
      variants={variants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
    >
      {children}
    </motion.div>
  );
} 