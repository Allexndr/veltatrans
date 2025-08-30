'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { casesData, categories } from '@/data/cases';
import ImageModal from './ImageModal';

interface CasesGridProps {
  locale: string;
}

export default function CasesGrid({ locale }: CasesGridProps) {
  const t = useTranslations('cases');
  const tx = useTranslations('cases.items');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCaseTitle, setSelectedCaseTitle] = useState('');
  
  const filteredCases = activeCategory === 'all' 
    ? casesData 
    : casesData.filter(caseItem => caseItem.category === activeCategory);

  const getCategoryName = (categoryId: string) => {
    const key = `categories.${categoryId}` as const;
    return t.has(key) ? t(key) : categoryId;
  };

  const tt = (id: string, field: string, fallback: string | undefined) => {
    const key = `${id}.${field}`;
    return tx.has(key) ? (tx(key) as string) : (fallback ?? '');
  };

  const openImageModal = (images: string[], title: string) => {
    setSelectedImages(images);
    setSelectedCaseTitle(title);
    setCurrentImageIndex(0);
    setIsModalOpen(true);
  };

  const closeImageModal = () => {
    setIsModalOpen(false);
    setSelectedImages([]);
    setCurrentImageIndex(0);
    setSelectedCaseTitle('');
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Фильтры */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          <motion.button
            key="all"
            onClick={() => setActiveCategory('all')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
              activeCategory === 'all'
                ? 'bg-velta-navy text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {t('categories.all')} ({casesData.length})
          </motion.button>
          
          {categories.map((category) => (
            <motion.button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-velta-navy text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {getCategoryName(category.id)} ({category.count})
            </motion.button>
          ))}
        </div>

        {/* Сетка кейсов */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          {filteredCases.map((caseItem, index) => (
            <motion.div
              key={caseItem.id}
              className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
              whileHover={{ y: -5 }}
            >
              {/* Изображение */}
              <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => openImageModal(caseItem.images, tt(caseItem.id, 'title', caseItem.title))}>
                <img
                  src={caseItem.images[0]}
                  alt={tt(caseItem.id, 'title', caseItem.title)}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <div className="absolute bottom-4 left-4">
                  <span className="inline-block px-3 py-1 bg-velta-navy text-white text-sm font-medium rounded-full">
                    {getCategoryName(caseItem.category)}
                  </span>
                </div>
                {/* Индикатор кликабельности */}
                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>

              {/* Контент */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-velta-navy transition-colors">
                  {tt(caseItem.id, 'title', caseItem.title)}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {tt(caseItem.id, 'description', caseItem.description)}
                </p>
                
                {/* Детали */}
                <div className="space-y-2 mb-6 text-sm text-gray-500">
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    {tt(caseItem.id, 'location', caseItem.location)}
                  </div>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    {tt(caseItem.id, 'cargo', caseItem.cargo)}
                  </div>
                  {caseItem.weight && (
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                      </svg>
                      {tt(caseItem.id, 'weight', caseItem.weight)}
                    </div>
                  )}
                </div>

                {/* Кнопки действий */}
                <div className="flex items-center justify-between">
                  <Link
                    href={`/${locale}/cases/${caseItem.category}/${caseItem.id}`}
                    className="inline-flex items-center text-velta-navy font-medium hover:text-velta-700 transition-colors group-hover:translate-x-1"
                  >
                    {t('viewDetails')} →
                  </Link>
                  

                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Кнопка "Все кейсы" */}
        {activeCategory !== 'all' && (
          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Link
              href={`/${locale}/cases/${activeCategory}`}
              className="inline-flex items-center px-8 py-4 bg-velta-navy text-white font-medium rounded-lg hover:bg-velta-700 transition-colors shadow-lg hover:shadow-xl"
            >
              {t('viewAll')} {getCategoryName(activeCategory)}
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </motion.div>
        )}
      </div>

      {/* Модальное окно для просмотра изображений */}
      <ImageModal
        isOpen={isModalOpen}
        onClose={closeImageModal}
        images={selectedImages}
        currentIndex={currentImageIndex}
        onImageChange={setCurrentImageIndex}
        title={selectedCaseTitle}
      />
    </section>
  );
}
