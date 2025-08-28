'use client';

import { useState } from 'react';
import { LoadingScreen } from './LoadingScreen';
import Link from 'next/link';
import Image from 'next/image';

export default function CasesSection() {
  const [activeCategory, setActiveCategory] = useState('all');

  const cases = [
    {
      id: 1,
      title: 'Железнодорожные перевозки',
      description: 'Перевозка оборудования и техники по железной дороге',
      image: '/images/cases/railway-case1.png',
      category: 'railway'
    },
    {
      id: 2,
      title: 'Железнодорожные перевозки',
      description: 'Контейнерные перевозки по железной дороге',
      image: '/images/cases/railway-case2.png',
      category: 'railway'
    },
    {
      id: 3,
      title: 'Железнодорожные перевозки',
      description: 'Перевозка негабаритных грузов по железной дороге',
      image: '/images/cases/railway-case3.png',
      category: 'railway'
    },
    {
      id: 4,
      title: 'Железнодорожные перевозки',
      description: 'Специальные железнодорожные перевозки',
      image: '/images/cases/railway-case4.png',
      category: 'railway'
    }
  ];

  const categories = [
    { id: 'all', name: 'Все кейсы', count: cases.length },
    { id: 'railway', name: 'Железнодорожные перевозки', count: cases.filter(c => c.category === 'railway').length }
  ];

  const filteredCases = activeCategory === 'all' 
    ? cases 
    : cases.filter(c => c.category === activeCategory);

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 xl:px-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            <span className="bg-gradient-to-r from-velta-900 to-velta-700 bg-clip-text text-transparent">
              Наши кейсы
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Успешные проекты и решения в области логистики
          </p>
        </div>
        
        <div className="space-y-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-3 justify-center">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  activeCategory === category.id
                    ? 'bg-velta-navy text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>

          {/* Cases Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCases.map((caseItem) => (
              <div key={caseItem.id} className="bg-white rounded-xl shadow-lg p-6 group hover:shadow-xl transition-all duration-300 border border-gray-100">
                <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden relative">
                  <Image
                    src={caseItem.image}
                    alt={caseItem.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-lg font-semibold text-velta-navy mb-2">
                  {caseItem.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {caseItem.description}
                </p>
                <Link
                  href={`/cases/${caseItem.id}`}
                  className="inline-flex items-center text-velta-navy hover:text-velta-700 font-medium transition-colors duration-200"
                >
                  Подробнее
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 