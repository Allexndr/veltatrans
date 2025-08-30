'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  currentIndex: number;
  onImageChange: (index: number) => void;
  title?: string;
}

export default function ImageModal({ 
  isOpen, 
  onClose, 
  images, 
  currentIndex, 
  onImageChange,
  title 
}: ImageModalProps) {
  
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const nextImage = () => {
    const nextIndex = (currentIndex + 1) % images.length;
    onImageChange(nextIndex);
  };

  const prevImage = () => {
    const prevIndex = currentIndex === 0 ? images.length - 1 : currentIndex - 1;
    onImageChange(prevIndex);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <div className="relative max-w-7xl max-h-full p-4">
          {/* Заголовок */}
          {title && (
            <motion.h3 
              className="text-white text-xl font-bold mb-4 text-center"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {title}
            </motion.h3>
          )}

          {/* Основное изображение */}
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[currentIndex]}
              alt={`Image ${currentIndex + 1}`}
              className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
            />

            {/* Навигационные кнопки */}
            {images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
                  aria-label="Previous image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
                  aria-label="Next image"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            {/* Счетчик изображений */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-full backdrop-blur-sm">
                {currentIndex + 1} / {images.length}
              </div>
            )}
          </motion.div>

          {/* Миниатюры */}
          {images.length > 1 && (
            <motion.div 
              className="flex justify-center gap-2 mt-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
            >
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={(e) => {
                    e.stopPropagation();
                    onImageChange(index);
                  }}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${
                    index === currentIndex 
                      ? 'border-velta-navy shadow-lg' 
                      : 'border-white/30 hover:border-white/60'
                  }`}
                >
                  <img
                    src={image}
                    alt={`Thumbnail ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </motion.div>
          )}

          {/* Кнопка закрытия */}
          <motion.button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            aria-label="Close modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </motion.button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
