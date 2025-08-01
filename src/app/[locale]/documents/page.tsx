import {useTranslations} from 'next-intl';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function DocumentsPage() {
  const t = useTranslations();

  const documentCategories = [
    {
      title: 'Договоры и соглашения',
      description: 'Типовые формы договоров на оказание логистических услуг',
      documents: [
        {
          name: 'Договор на транспортно-экспедиционные услуги',
          type: 'PDF',
          size: '245 KB',
          language: 'RU'
        },
        {
          name: 'Агентское соглашение',
          type: 'DOCX',
          size: '180 KB',
          language: 'RU'
        },
        {
          name: 'Service Agreement Template',
          type: 'PDF',
          size: '210 KB',
          language: 'EN'
        }
      ]
    },
    {
      title: 'Доверенности',
      description: 'Бланки доверенностей для таможенного оформления',
      documents: [
        {
          name: 'Доверенность на таможенное оформление',
          type: 'PDF',
          size: '120 KB',
          language: 'RU'
        },
        {
          name: 'Доверенность на получение груза',
          type: 'DOCX',
          size: '95 KB',
          language: 'RU'
        },
        {
          name: 'Генеральная доверенность',
          type: 'PDF',
          size: '150 KB',
          language: 'RU'
        }
      ]
    },
    {
      title: 'Транспортные документы',
      description: 'Бланки и формы для оформления перевозок',
      documents: [
        {
          name: 'Транспортная накладная CMR',
          type: 'PDF',
          size: '85 KB',
          language: 'RU/EN'
        },
        {
          name: 'Товарно-транспортная накладная',
          type: 'DOCX',
          size: '110 KB',
          language: 'RU'
        },
        {
          name: 'Акт приема-передачи груза',
          type: 'PDF',
          size: '75 KB',
          language: 'RU'
        }
      ]
    },
    {
      title: 'Таможенные документы',
      description: 'Формы для таможенного декларирования и оформления',
      documents: [
        {
          name: 'Декларация на товары (ДТ)',
          type: 'PDF',
          size: '200 KB',
          language: 'RU'
        },
        {
          name: 'Инвойс (коммерческий счет)',
          type: 'XLSX',
          size: '45 KB',
          language: 'RU/EN'
        },
        {
          name: 'Упаковочный лист (Packing List)',
          type: 'XLSX',
          size: '38 KB',
          language: 'RU/EN'
        }
      ]
    },
    {
      title: 'Страхование',
      description: 'Документы по страхованию грузов',
      documents: [
        {
          name: 'Заявление на страхование груза',
          type: 'PDF',
          size: '130 KB',
          language: 'RU'
        },
        {
          name: 'Условия страхования',
          type: 'PDF',
          size: '280 KB',
          language: 'RU'
        }
      ]
    },
    {
      title: 'Справочная информация',
      description: 'Полезная информация и инструкции',
      documents: [
        {
          name: 'Справочник таможенных кодов ТН ВЭД',
          type: 'PDF',
          size: '1.2 MB',
          language: 'RU'
        },
        {
          name: 'Инструкция по упаковке грузов',
          type: 'PDF',
          size: '450 KB',
          language: 'RU'
        },
        {
          name: 'Список запрещенных к перевозке товаров',
          type: 'PDF',
          size: '180 KB',
          language: 'RU'
        }
      ]
    }
  ];

  const getFileIcon = (type: string) => {
    switch (type.toUpperCase()) {
      case 'PDF':
        return (
          <svg className="w-8 h-8 text-red-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      case 'DOCX':
      case 'DOC':
        return (
          <svg className="w-8 h-8 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      case 'XLSX':
      case 'XLS':
        return (
          <svg className="w-8 h-8 text-green-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
      default:
        return (
          <svg className="w-8 h-8 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
            <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z" />
          </svg>
        );
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('documents.title')}
              </h1>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto">
                {t('documents.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Documents Sections */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="space-y-12">
              {documentCategories.map((category, categoryIndex) => (
                <div key={categoryIndex} className="bg-white rounded-lg shadow-lg p-8">
                  <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {category.title}
                    </h2>
                    <p className="text-gray-600">
                      {category.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {category.documents.map((document, docIndex) => (
                      <div key={docIndex} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            {getFileIcon(document.type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                              {document.name}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4">
                              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                {document.type}
                              </span>
                              <span>{document.size}</span>
                              <span>{document.language}</span>
                            </div>
                            <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              {t('documents.download')}
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Requirements */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Требования к документам
                </h2>
                <div className="space-y-6">
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">Правильное заполнение</h3>
                      <p className="text-gray-600">Все поля документов должны быть заполнены четко и без ошибок</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">Подписи и печати</h3>
                      <p className="text-gray-600">Документы должны содержать подписи уполномоченных лиц и печати организаций</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">Актуальность</h3>
                      <p className="text-gray-600">Используйте только актуальные версии документов</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <svg className="w-6 h-6 text-blue-600 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <h3 className="font-semibold text-gray-900">Переводы</h3>
                      <p className="text-gray-600">Документы на иностранных языках должны иметь нотариальные переводы</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">
                  Помощь в оформлении
                </h2>
                <div className="bg-white rounded-lg shadow-md p-6">
                  <p className="text-gray-600 mb-6">
                    Наши специалисты помогут вам правильно оформить все необходимые документы 
                    для международных перевозок.
                  </p>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Консультации по документообороту</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Проверка заполненных документов</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Помощь в получении разрешений</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Сопровождение на всех этапах</span>
                    </div>
                  </div>

                  <button className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
                    Получить консультацию
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contact for Documents */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Нужна помощь с документами?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Свяжитесь с нашими специалистами для получения персональной консультации
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="tel:+77011234567"
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Позвонить
              </a>
              <a
                href="mailto:docs@veltatrans.com"
                className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-600 hover:text-white transition-colors inline-flex items-center justify-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Написать
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
