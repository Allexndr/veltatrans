import { useTranslations } from 'next-intl';
import { notFound } from 'next/navigation';
import { getCaseById } from '@/data/cases';
import Link from 'next/link';
import Image from 'next/image';

interface CasePageProps {
  params: {
    locale: string;
    category: string;
    id: string;
  };
}

export default function CasePage({ params }: CasePageProps) {
  const { locale, category, id } = params;
  const t = useTranslations('cases');
  
  const caseItem = getCaseById(id);
  if (!caseItem || caseItem.category !== category) {
    notFound();
  }
  
  const getCategoryName = (categoryId: string) => {
    const key = `categories.${categoryId}` as const;
    return t.has(key) ? t(key) : categoryId;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Заголовок */}
      <section className="bg-velta-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block px-4 py-2 bg-velta-500 text-white text-sm font-medium rounded-full mb-4">
            {getCategoryName(category)}
          </span>
          <h1 className="text-5xl font-bold mb-6">
            {caseItem.title}
          </h1>
          <p className="text-xl text-velta-100 max-w-4xl mx-auto">
            {caseItem.description}
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
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <Link
                    href={`/${locale}/cases/${category}`}
                    className="ml-1 text-sm font-medium text-gray-700 hover:text-velta-navy md:ml-2"
                  >
                    {getCategoryName(category)}
                  </Link>
                </div>
              </li>
              <li aria-current="page">
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">
                    {caseItem.title}
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </section>

      {/* Основной контент */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Левая колонка - Галерея */}
            <div className="lg:col-span-2">
              {/* Основное изображение */}
              <div className="relative h-96 mb-6 rounded-xl overflow-hidden">
                <Image
                  src={caseItem.images[0]}
                  alt={caseItem.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Галерея изображений */}
              {caseItem.images.length > 1 && (
                <div className="grid grid-cols-4 gap-4 mb-8">
                  {caseItem.images.map((image, index) => (
                    <div key={index} className="relative h-24 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                      <Image
                        src={image}
                        alt={`${caseItem.title} - ${t('image')} ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}

              {/* Видео материалы */}
              {caseItem.videos && caseItem.videos.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{t('videos')}</h3>
                  <div className="space-y-6">
                    {caseItem.videos.map((video, index) => (
                      <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                        <video
                          controls
                          className="w-full rounded-lg"
                          poster={caseItem.images[0]}
                        >
                          <source src={video} type="video/mp4" />
                          {t('videoNotSupported')}
                        </video>
                        <p className="text-sm text-gray-600 mt-2 text-center">
                          {t('video')} {index + 1} - {caseItem.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Подробное описание */}
              <div className="bg-white rounded-xl p-8 shadow-lg">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">{t('projectDetails')}</h3>
                <div className="prose prose-lg max-w-none">
                  <p className="text-gray-700 leading-relaxed mb-6">
                    {caseItem.details}
                  </p>
                  
                  {/* Дополнительная информация */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">{t('route')}</h4>
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 mr-3 text-velta-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {caseItem.location}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h4 className="font-semibold text-gray-900 mb-3">{t('cargoType')}</h4>
                      <div className="flex items-center text-gray-700">
                        <svg className="w-5 h-5 mr-3 text-velta-navy" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                        </svg>
                        {caseItem.cargo}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Правая колонка - Информация */}
            <div className="lg:col-span-1">
              {/* Карточка с информацией */}
              <div className="bg-white rounded-xl p-6 shadow-lg sticky top-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">{t('projectCard.title')}</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">{t('projectCard.date')}</span>
                    <span className="font-medium text-gray-900">
                      {new Date(caseItem.date).toLocaleDateString(locale)}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <span className="text-gray-600">{t('projectCard.category')}</span>
                    <span className="font-medium text-velta-navy">
                      {getCategoryName(category)}
                    </span>
                  </div>
                  
                  {caseItem.weight && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">{t('projectCard.weight')}</span>
                      <span className="font-medium text-gray-900">{caseItem.weight}</span>
                    </div>
                  )}
                  
                  {caseItem.volume && (
                    <div className="flex items-center justify-between py-3 border-b border-gray-200">
                      <span className="text-gray-600">{t('projectCard.volume')}</span>
                      <span className="font-medium text-gray-900">{caseItem.volume}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600">{t('projectCard.status')}</span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                      {t('projectCard.completed')}
                    </span>
                  </div>
                </div>

                {/* Кнопки действий */}
                <div className="mt-8 space-y-3">
                  <Link
                    href={`/${locale}/cases/${category}`}
                    className="w-full inline-flex items-center justify-center px-4 py-3 border border-velta-navy text-velta-navy font-medium rounded-lg hover:bg-velta-navy hover:text-white transition-colors"
                  >
                    ← {t('backToCategory', { category: getCategoryName(category) })}
                  </Link>
                  
                  <Link
                    href={`/${locale}/contacts`}
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-velta-navy text-white font-medium rounded-lg hover:bg-velta-700 transition-colors"
                  >
                    {t('orderSimilar')}
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
