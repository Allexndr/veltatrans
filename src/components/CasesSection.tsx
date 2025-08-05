'use client';

import {Link} from '@/i18n/routing';
import {useState, useEffect} from 'react';

interface Case {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

interface CasesSectionProps {
  locale: string;
}

export default function CasesSection({locale}: CasesSectionProps) {
  const [messages, setMessages] = useState<Record<string, unknown> | null>(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const loadMessages = async () => {
      const msg = (await import(`../../messages/${locale}.json`)).default;
      setMessages(msg);
      setIsVisible(true);
    };
    loadMessages();
  }, [locale]);

  if (!messages) {
    return <div className="py-16 bg-gray-50 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-96 bg-gray-200 rounded-lg"></div>
      </div>
    </div>;
  }

  const t = (key: string) => (messages?.cases as Record<string, string>)?.[key] || key;

  const cases: Case[] = [
    {
      id: 1,
      title: t('case1.title'),
      description: t('case1.description'),
      image: '/images/case1.jpg',
      category: 'general'
    },
    {
      id: 2,
      title: t('case2.title'),
      description: t('case2.description'),
      image: '/images/case2.jpg',
      category: 'container'
    },
    {
      id: 3,
      title: t('case3.title'),
      description: t('case3.description'),
      image: '/images/case3.jpg',
      category: 'oversized'
    },
    {
      id: 4,
      title: t('case4.title'),
      description: t('case4.description'),
      image: '/images/case4.jpg',
      category: 'dangerous'
    },
    {
      id: 5,
      title: t('case5.title'),
      description: t('case5.description'),
      image: '/images/case5.jpg',
      category: 'consolidated'
    },
    {
      id: 6,
      title: t('case6.title'),
      description: t('case6.description'),
      image: '/images/case6.jpg',
      category: 'project'
    }
  ];

  const categories = [
    {id: 'all', name: t('categories.all'), icon: '📦'},
    {id: 'general', name: t('categories.general'), icon: '🚛'},
    {id: 'container', name: t('categories.container'), icon: '📦'},
    {id: 'oversized', name: t('categories.oversized'), icon: '🚛'},
    {id: 'dangerous', name: t('categories.dangerous'), icon: '⚠️'},
    {id: 'consolidated', name: t('categories.consolidated'), icon: '📦'},
    {id: 'project', name: t('categories.project'), icon: '🏗️'}
  ];

  const filteredCases = activeCategory === 'all' 
    ? cases 
    : cases.filter(c => c.category === activeCategory);

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            {t('title')}
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            {t('description')}
          </p>
        </div>

        {/* Category Filters with animations */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`group px-6 py-3 rounded-full border-2 font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg animate-fade-in-up ${
                activeCategory === category.id
                  ? 'bg-custom-blue-600 text-white border-custom-blue-600 shadow-lg'
                  : 'bg-white text-gray-700 border-gray-300 hover:bg-custom-blue-50 hover:border-custom-blue-300 hover:text-custom-blue-700'
              }`}
              style={{animationDelay: `${0.6 + index * 0.1}s`}}
            >
              <span className="flex items-center space-x-2">
                <span className="text-lg transition-transform duration-300 group-hover:scale-110">
                  {category.icon}
                </span>
                <span>{category.name}</span>
              </span>
            </button>
          ))}
        </div>

        {/* Cases Grid with animations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCases.map((item, index) => (
            <div
              key={item.id}
              className={`group bg-white rounded-xl shadow-lg overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl animate-fade-in-up ${
                isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
              }`}
              style={{animationDelay: `${0.8 + index * 0.1}s`}}
            >
              {/* Image placeholder with animation */}
              <div className="relative h-48 bg-gradient-to-br from-custom-blue-100 to-custom-blue-200 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                                     <div className="text-6xl animate-bounce" style={{animationDuration: '2s'}}>
                     {item.category === 'general' && (
                       <svg className="w-16 h-16 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                       </svg>
                     )}
                     {item.category === 'container' && (
                       <svg className="w-16 h-16 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                       </svg>
                     )}
                     {item.category === 'oversized' && (
                       <svg className="w-16 h-16 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
                       </svg>
                     )}
                     {item.category === 'dangerous' && (
                       <svg className="w-16 h-16 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                       </svg>
                     )}
                     {item.category === 'consolidated' && (
                       <svg className="w-16 h-16 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                       </svg>
                     )}
                     {item.category === 'project' && (
                       <svg className="w-16 h-16 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                       </svg>
                     )}
                   </div>
                </div>
                
                {/* Floating elements */}
                <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full animate-pulse"></div>
                <div className="absolute bottom-4 left-4 w-6 h-6 bg-white/20 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-custom-blue-600/0 group-hover:bg-custom-blue-600/20 transition-all duration-300 flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
                    <span className="text-white text-lg font-semibold">Подробнее</span>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-custom-blue-600 transition-colors duration-300">
                  {item.title}
                </h3>
                                 <p className="text-gray-700 mb-4 line-clamp-3">
                   {item.description}
                 </p>
                
                {/* Category badge */}
                <div className="flex items-center justify-between">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                    item.category === 'dangerous' ? 'bg-red-100 text-red-800' :
                    item.category === 'oversized' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-custom-blue-100 text-custom-blue-800'
                  }`}>
                    <span className="mr-1">
                      {item.category === 'general' && '🚛'}
                      {item.category === 'container' && '📦'}
                      {item.category === 'oversized' && '🚛'}
                      {item.category === 'dangerous' && '⚠️'}
                      {item.category === 'consolidated' && '📦'}
                      {item.category === 'project' && '🏗️'}
                    </span>
                    {categories.find(c => c.id === item.category)?.name}
                  </span>
                  
                  <Link
                    href={`/cases/${item.id}`}
                    className="text-custom-blue-600 hover:text-custom-blue-800 font-medium transition-colors duration-300 flex items-center group/link"
                  >
                    Подробнее
                    <svg className="w-4 h-4 ml-1 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {filteredCases.length === 0 && (
          <div className="text-center py-12 animate-fade-in-up">
            <div className="text-6xl mb-4 animate-bounce">📦</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Кейсы не найдены
            </h3>
                         <p className="text-gray-700">
               Попробуйте выбрать другую категорию
             </p>
          </div>
        )}

        {/* CTA Button */}
        <div className="text-center mt-12 animate-fade-in-up" style={{animationDelay: '1.5s'}}>
          <Link
            href="/cases"
            className="inline-flex items-center px-8 py-4 bg-custom-blue-600 text-white rounded-lg font-semibold text-lg hover:bg-custom-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl"
          >
            <span className="mr-2">📋</span>
            Все кейсы
            <svg className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .line-clamp-3 {
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  );
} 