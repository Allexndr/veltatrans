interface Document {
  id: number;
  title: string;
  description: string;
  category: string;
  fileType: string;
  fileSize: string;
  downloadUrl: string;
}

interface DocumentsSectionProps {
  locale: string;
}

export default async function DocumentsSection({locale}: DocumentsSectionProps) {
  // Import messages directly based on locale
  const messages = (await import(`../../messages/${locale}.json`)).default;
  const t = (key: string) => {
    const keys = key.split('.');
    let value = messages;
    for (const k of keys) {
      value = value?.[k];
    }
    return value || key;
  };

  const documents: Document[] = [
    {
      id: 1,
      title: t('doc1.title'),
      description: t('doc1.description'),
      category: 'contracts',
      fileType: 'PDF',
      fileSize: '245 KB',
      downloadUrl: '#'
    },
    {
      id: 2,
      title: t('doc2.title'),
      description: t('doc2.description'),
      category: 'contracts',
      fileType: 'PDF',
      fileSize: '189 KB',
      downloadUrl: '#'
    },
    {
      id: 3,
      title: t('doc3.title'),
      description: t('doc3.description'),
      category: 'powers',
      fileType: 'PDF',
      fileSize: '156 KB',
      downloadUrl: '#'
    },
    {
      id: 4,
      title: t('doc4.title'),
      description: t('doc4.description'),
      category: 'powers',
      fileType: 'PDF',
      fileSize: '178 KB',
      downloadUrl: '#'
    },
    {
      id: 5,
      title: t('doc5.title'),
      description: t('doc5.description'),
      category: 'powers',
      fileType: 'PDF',
      fileSize: '134 KB',
      downloadUrl: '#'
    },
    {
      id: 6,
      title: t('doc6.title'),
      description: t('doc6.description'),
      category: 'requisites',
      fileType: 'PDF',
      fileSize: '89 KB',
      downloadUrl: '#'
    }
  ];

  const categories = [
    {id: 'all', name: t('categories.all')},
    {id: 'contracts', name: t('categories.contracts')},
    {id: 'powers', name: t('categories.powers')},
    {id: 'requisites', name: t('categories.requisites')},
    {id: 'changes', name: t('categories.changes')},
    {id: 'additional', name: t('categories.additional')}
  ];

  const getFileIcon = (fileType: string) => {
    switch (fileType) {
      case 'PDF':
        return (
          <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      case 'DOC':
        return (
          <svg className="w-6 h-6 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
          </svg>
        );
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              className="px-6 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-custom-blue-50 hover:border-custom-blue-300 hover:text-custom-blue-700 transition-colors"
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Documents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getFileIcon(doc.fileType)}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {doc.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {doc.fileType} • {doc.fileSize}
                    </p>
                  </div>
                </div>
              </div>
              
              <p className="text-gray-600 mb-4">
                {doc.description}
              </p>
              
              <button
                className="w-full bg-custom-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-custom-blue-700 transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                {t('download')}
              </button>
            </div>
          ))}
        </div>

        {/* Additional Information */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('info1.title')}
            </h3>
            <p className="text-gray-600">
              {t('info1.description')}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('info2.title')}
            </h3>
            <p className="text-gray-600">
              {t('info2.description')}
            </p>
          </div>
          
          <div className="bg-white rounded-lg p-6 shadow-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              {t('info3.title')}
            </h3>
            <p className="text-gray-600">
              {t('info3.description')}
            </p>
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {t('note')}
          </p>
        </div>
      </div>
    </section>
  );
} 