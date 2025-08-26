import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { getCasesByCategory, categories } from '@/data/cases';
import Link from 'next/link';
import Image from 'next/image';

interface CategoryPageProps {
  params: {
    locale: string;
    category: string;
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { locale, category } = params;
  const t = useTranslations('cases');
  
  // Проверяем существование категории
  const categoryData = categories.find(c => c.id === category);
  if (!categoryData) {
    notFound();
  }
  
  const cases = getCasesByCategory(category);
  
  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || categoryId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <section className="bg-velta-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {getCategoryName(category)}
          </h1>
          <p className="text-xl text-velta-100 max-w-3xl mx-auto">
            {t('category.subtitle', { category: getCategoryName(category) })}
          </p>
        </div>
      </section>

      {/* Хлебные крошки */}
      <section className="py-6 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link
                  href={`/${locale}`}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-velta-navy"
                >
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                  </svg>
                  {t('home')}
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link
                    href={`/${locale}/cases`}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-velta-navy md:ml-2"
                  >
                    {t('title')}
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {getCategoryName(category)}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Сетка кейсов */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {cases.length === 0 ? (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('empty.title')}</h3>
              <p className="text-gray-600 mb-8">{t('empty.description')}</p>
              <Link
                href={`/${locale}/cases`}
                className="inline-flex items-center px-6 py-3 bg-velta-navy text-white font-medium rounded-lg hover:bg-velta-700 transition-colors"
              >
                ← {t('empty.back')}
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {cases.map((caseItem, index) => (
                <article
                  key={caseItem.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  {/* Галерея изображений */}
                  <div className="relative h-80 overflow-hidden">
                    <div className="flex overflow-x-auto snap-x snap-mandatory">
                      {caseItem.images.map((image, imgIndex) => (
                        <div key={imgIndex} className="flex-shrink-0 w-full h-full snap-start">
                          <Image
                            src={image}
                            alt={`${caseItem.title} - ${imgIndex + 1}`}
                            width={600}
                            height={400}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                    
                    {/* Индикаторы слайдера */}
                    {caseItem.images.length > 1 && (
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
                        {caseItem.images.map((_, imgIndex) => (
                          <div
                            key={imgIndex}
                            className="w-2 h-2 bg-white rounded-full opacity-60"
                          />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Контент */}
                  <div className="p-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {caseItem.title}
                    </h2>
                    <p className="text-gray-600 mb-6 text-lg">
                      {caseItem.description}
                    </p>

                    {/* Детальная информация */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-5 h-5 mr-3 text-velta-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {new Date(caseItem.date).toLocaleDateString(locale)}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-5 h-5 mr-3 text-velta-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {caseItem.location}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-5 h-5 mr-3 text-velta-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {caseItem.cargo}
                      </div>
                      {caseItem.weight && (
                        <div className="flex items-center text-sm text-gray-600">
                          <svg className="w-5 h-5 mr-3 text-velta-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
                          </svg>
                          {caseItem.weight}
                        </div>
                      )}
                    </div>

                    {/* Подробное описание */}
                    <div className="bg-gray-50 rounded-lg p-6 mb-6">
                      <h4 className="font-semibold text-gray-900 mb-3">Описание проекта</h4>
                      <p className="text-gray-700 leading-relaxed">
                        {caseItem.details}
                      </p>
                    </div>

                    {/* Видео (если есть) */}
                    {caseItem.videos && caseItem.videos.length > 0 && (
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">Видео материалы</h4>
                        <div className="space-y-4">
                          {caseItem.videos.map((video, videoIndex) => (
                            <video
                              key={videoIndex}
                              controls
                              className="w-full rounded-lg"
                              poster={caseItem.images[0]}
                            >
                              <source src={video} type="video/mp4" />
                              Ваш браузер не поддерживает видео.
                            </video>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Кнопка подробнее */}
                    <Link
                      href={`/${locale}/cases/${caseItem.category}/${caseItem.id}`}
                      className="inline-flex items-center px-6 py-3 bg-velta-navy text-white font-medium rounded-lg hover:bg-velta-700 transition-colors"
                    >
                      {t('moreAbout')}
                      <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
