interface Recommendation {
  id: number;
  company: string;
  position: string;
  name: string;
  text: string;
  rating: number;
  date: string;
}

interface RecommendationsSectionProps {
  locale: string;
}

export default async function RecommendationsSection({locale}: RecommendationsSectionProps) {
  // Import messages directly based on locale
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const t = (key: string) => messages.recommendations?.[key] || key;

  const recommendations: Recommendation[] = [
    {
      id: 1,
      company: t('rec1.company'),
      position: t('rec1.position'),
      name: t('rec1.name'),
      text: t('rec1.text'),
      rating: 5,
      date: '2024'
    },
    {
      id: 2,
      company: t('rec2.company'),
      position: t('rec2.position'),
      name: t('rec2.name'),
      text: t('rec2.text'),
      rating: 5,
      date: '2024'
    },
    {
      id: 3,
      company: t('rec3.company'),
      position: t('rec3.position'),
      name: t('rec3.name'),
      text: t('rec3.text'),
      rating: 5,
      date: '2024'
    },
    {
      id: 4,
      company: t('rec4.company'),
      position: t('rec4.position'),
      name: t('rec4.name'),
      text: t('rec4.text'),
      rating: 5,
      date: '2024'
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({length: 5}, (_, i) => (
      <svg
        key={i}
        className={`w-5 h-5 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* Banner */}
        <div className="bg-gradient-to-r from-custom-blue-50 to-custom-blue-100 rounded-lg p-8 mb-12">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h3 className="text-2xl font-bold text-custom-blue-900 mb-2">
                {t('banner.title')}
              </h3>
              <p className="text-custom-blue-800">
                {t('banner.subtitle')}
              </p>
            </div>
            <div className="flex space-x-2">
              {Array.from({length: 5}, (_, i) => (
                <svg key={i} className="w-8 h-8 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {recommendations.map((rec) => (
            <div key={rec.id} className="bg-gray-50 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">
                    {rec.company}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {rec.position}
                  </p>
                </div>
                <div className="flex">
                  {renderStars(rec.rating)}
                </div>
              </div>
              
              <blockquote className="text-gray-700 mb-4 italic">
                &ldquo;{rec.text}&rdquo;
              </blockquote>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">
                    {rec.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {rec.date}
                  </p>
                </div>
                <div className="w-12 h-12 bg-custom-blue-100 rounded-full flex items-center justify-center">
                  <svg className="w-6 h-6 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Certificates Section */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">
            {t('certificates.title')}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-lg p-4 text-center hover:shadow-md transition-shadow">
                <div className="w-16 h-16 bg-custom-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">
                  {t(`certificates.cert${i}.title`)}
                </h4>
                <p className="text-sm text-gray-600">
                  {t(`certificates.cert${i}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
} 