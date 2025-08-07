'use client';

import {motion, AnimatePresence} from 'framer-motion';
import {useEffect, useState} from 'react';

interface AnimatedBackgroundProps {
  variant?: 'hero' | 'section' | 'minimal';
  className?: string;
}

export default function AnimatedBackground({variant = 'section', className = ''}: AnimatedBackgroundProps) {
  const [particles, setParticles] = useState<Array<{id: number; x: number; y: number; size: number; delay: number}>>([]);

  useEffect(() => {
    const generateParticles = () => {
      const count = variant === 'hero' ? 30 : variant === 'section' ? 20 : 10;
      const newParticles = Array.from({length: count}, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
    };

    generateParticles();
  }, [variant]);

  const floatingVariants = {
    animate: {
      y: [0, -40, 0],
      x: [0, 15, 0],
      transition: {
        duration: variant === 'hero' ? 10 : 8,
        repeat: Infinity,
        ease: "easeInOut" as const
      }
    }
  };

  const particleVariants = {
    animate: {
      y: [0, -150],
      opacity: [1, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  const lineVariants = {
    animate: {
      x: ['-100%', '100%'],
      transition: {
        duration: variant === 'hero' ? 15 : 12,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  const reverseLineVariants = {
    animate: {
      x: ['100%', '-100%'],
      transition: {
        duration: variant === 'hero' ? 18 : 15,
        repeat: Infinity,
        ease: "linear" as const
      }
    }
  };

  return (
    <div className={`absolute inset-0 overflow-hidden ${className}`}>
      {/* Floating geometric shapes */}
      <motion.div 
        className="absolute top-20 left-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"
        variants={floatingVariants}
        animate="animate"
        style={{animationDelay: '0s'}}
      />
      <motion.div 
        className="absolute top-40 right-20 w-32 h-32 bg-white/5 rounded-full blur-2xl"
        variants={floatingVariants}
        animate="animate"
        style={{animationDelay: '2s'}}
      />
      <motion.div 
        className="absolute bottom-40 left-1/4 w-24 h-24 bg-white/5 rounded-full blur-2xl"
        variants={floatingVariants}
        animate="animate"
        style={{animationDelay: '4s'}}
      />
      <motion.div 
        className="absolute top-1/2 right-1/3 w-20 h-20 bg-white/5 rounded-full blur-xl"
        variants={floatingVariants}
        animate="animate"
        style={{animationDelay: '6s'}}
      />

      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, white 1px, transparent 1px)`,
            backgroundSize: variant === 'hero' ? '80px 80px' : '60px 60px',
            animation: `moveGrid ${variant === 'hero' ? '40s' : '30s'} linear infinite`
          }}
        />
      </div>

      {/* Moving lines */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          variants={lineVariants}
          animate="animate"
        />
        <motion.div 
          className="absolute top-3/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"
          variants={reverseLineVariants}
          animate="animate"
          style={{animationDelay: '3s'}}
        />
        {variant === 'hero' && (
          <motion.div 
            className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
            variants={lineVariants}
            animate="animate"
            style={{animationDelay: '6s'}}
          />
        )}
      </div>

      {/* Floating particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-white/30 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          variants={particleVariants}
          animate="animate"
          transition={{
            duration: 4 + Math.random() * 2,
            repeat: Infinity,
            delay: particle.delay
          }}
        />
      ))}

      {/* Additional decorative elements for hero variant */}
      {variant === 'hero' && (
        <>
          <motion.div 
            className="absolute top-1/3 left-1/6 w-16 h-16 bg-white/3 rounded-full blur-lg"
            variants={floatingVariants}
            animate="animate"
            style={{animationDelay: '8s'}}
          />
          <motion.div 
            className="absolute bottom-1/3 right-1/6 w-12 h-12 bg-white/3 rounded-full blur-lg"
            variants={floatingVariants}
            animate="animate"
            style={{animationDelay: '10s'}}
          />
        </>
      )}

      <style jsx>{`
        @keyframes moveGrid {
          0% { transform: translate(0, 0); }
          100% { transform: translate(${variant === 'hero' ? '80px' : '60px'}, ${variant === 'hero' ? '80px' : '60px'}); }
        }
      `}</style>
    </div>
  );
} 