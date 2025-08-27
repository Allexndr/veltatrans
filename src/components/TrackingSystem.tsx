'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';
import {motion} from 'framer-motion';
import LeafletMap from './LeafletMap';

interface TrackingSystemProps {
  locale: string;
}

interface TrackingResult {
  ttn: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'warehouse';
  location: string;
  lastUpdate: string;
  route: Array<{
    location: string;
    date: string;
    status: string;
    description: string;
    lat?: number;
    lng?: number;
  }>;
}

export default function TrackingSystem({}: TrackingSystemProps) {
  const t = useTranslations('trackingSystem');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingNumbers, setTrackingNumbers] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<TrackingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Получение текста статуса
  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return t('status.pending');
      case 'in_transit': return t('status.in_transit');
      case 'delivered': return t('status.delivered');
      case 'warehouse': return t('status.warehouse');
      default: return t('status.unknown');
    }
  };

  // Получение реальных данных отслеживания
  const fetchTrackingData = async (ttn: string): Promise<TrackingResult | null> => {
    try {
      const response = await fetch(`/api/tracking/${ttn}`);
      if (!response.ok) {
        throw new Error(t('errors.notFound'));
      }
      
      const orderData = await response.json();
      
      // Конвертируем данные заказа в формат TrackingResult
      return {
        ttn: orderData.trackingNumber,
        status: orderData.status === 'created' ? 'pending' : 
               orderData.status === 'assigned' ? 'in_transit' : 
               orderData.status === 'delivered' ? 'delivered' : 
               orderData.status === 'warehouse' ? 'warehouse' : 'pending',
        location: orderData.route.length > 0 ? orderData.route[orderData.route.length - 1].location : orderData.from,
        lastUpdate: orderData.lastUpdate,
        route: orderData.route.map((point: any) => ({
          location: point.location,
          date: new Date(point.timestamp).toLocaleString('ru-RU'),
          status: getStatusText(point.status),
          description: point.description
        }))
      };
    } catch (error) {
      console.error('Error fetching tracking data:', error);
      return null;
    }
  };







  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'in_transit': return 'text-blue-600 bg-blue-50';
      case 'delivered': return 'text-green-600 bg-green-50';
      case 'warehouse': return 'text-purple-600 bg-purple-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const handleSingleTracking = async () => {
    if (!trackingNumber.trim()) {
      setError(t('errors.enterTtn'));
      return;
    }

    if (!trackingNumber.startsWith('WT') || trackingNumber.length !== 8) {
      setError(t('errors.invalidFormat'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Реальный запрос к API
      const result = await fetchTrackingData(trackingNumber);
      if (result) {
        setResults([result]);
        setTrackingNumbers([trackingNumber]);
        setCurrentIndex(0);
      } else {
        setError(t('errors.notFound'));
      }
    } catch (error) {
      setError(t('errors.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const numbers = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      if (numbers.length === 0) {
        setError(t('errors.emptyFile'));
        return;
      }

      if (numbers.length > 50) {
        setError(t('errors.tooManyNumbers'));
        return;
      }

      setLoading(true);
      setError('');

      // Обработка множественных номеров
      try {
        const trackingResults = [];
        for (const num of numbers) {
          const result = await fetchTrackingData(num);
          if (result) {
            trackingResults.push(result);
          }
        }
        setResults(trackingResults);
        setTrackingNumbers(numbers);
        setCurrentIndex(0);
      } catch (error) {
        setError(t('errors.fileProcessingError'));
      } finally {
        setLoading(false);
      }
    };

    reader.readAsText(file);
  };

  const navigateTracking = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    } else if (direction === 'next' && currentIndex < results.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const currentResult = results[currentIndex];

  return (
    <section className="py-16 bg-gradient-to-br from-gray-50 via-white to-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h1>
          <p className="text-lg text-gray-600">
            {t('description')}
          </p>

        </div>

        {/* Форма ввода */}
        <motion.div 
          className="bg-white rounded-2xl shadow-lg p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Одиночный номер */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('singleTracking.title')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('singleTracking.ttnFormat')}
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                    placeholder={t('singleTracking.placeholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-velta-500 focus:border-velta-500"
                    maxLength={8}
                  />
                </div>
                <button
                  onClick={handleSingleTracking}
                  disabled={loading}
                  className="w-full bg-velta-navy text-white py-3 px-6 rounded-lg font-medium hover:bg-velta-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      {t('singleTracking.searching')}
                    </div>
                  ) : (
                    t('singleTracking.trackButton')
                  )}
                </button>
              </div>
            </div>

            {/* Множественные номера */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                {t('multipleTracking.title')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('multipleTracking.uploadFile')}
                  </label>
                  <input
                    type="file"
                    accept=".txt,.csv"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-velta-500 focus:border-velta-500"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  {t('multipleTracking.formatInfo')}
                </p>
              </div>
            </div>
          </div>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </motion.div>

        {/* Результаты отслеживания */}
        {results.length > 0 && currentResult && (
          <motion.div 
            className="bg-white rounded-2xl shadow-lg p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {/* Навигация для множественных результатов */}
            {results.length > 1 && (
              <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                <button
                  onClick={() => navigateTracking('prev')}
                  disabled={currentIndex === 0}
                  className="flex items-center px-4 py-2 text-velta-600 hover:text-velta-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('navigation.previous')}
                </button>
                
                <span className="text-gray-600 font-medium">
                  {t('navigation.ofTotal', { current: currentIndex + 1, total: results.length })}
                </span>
                
                <button
                  onClick={() => navigateTracking('next')}
                  disabled={currentIndex === results.length - 1}
                  className="flex items-center px-4 py-2 text-velta-600 hover:text-velta-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t('navigation.next')}
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            )}

            {/* Информация о грузе */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {t('details.ttnNumber')} {currentResult.ttn}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">{t('details.status')}</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentResult.status)}`}>
                      {getStatusText(currentResult.status)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">{t('details.location')}</span>
                    <span className="font-medium">{currentResult.location}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">{t('details.lastUpdate')}</span>
                    <span className="text-sm text-gray-500">{currentResult.lastUpdate}</span>
                  </div>
                </div>
              </div>

              {/* Карта с маршрутом */}
              <div className="bg-gray-100 rounded-lg overflow-hidden">
                <LeafletMap
                  points={currentResult.route.map(point => ({
                    lat: point.lat || 0,
                    lng: point.lng || 0,
                    title: point.location,
                    status: point.status === t('status.pending') ? 'pending' : 
                           point.status === t('status.in_transit') ? 'in_transit' : 
                           point.status === t('status.delivered') ? 'delivered' : 
                           point.status === t('status.warehouse') ? 'warehouse' : 'pending',
                    timestamp: point.date
                  }))}
                  center={[51.1694, 71.4491]} // Алматы по умолчанию
                  zoom={6}
                  height="300px"
                />
              </div>
            </div>

            {/* Маршрут */}
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                {t('details.movementHistory')}
              </h4>
              <div className="space-y-4">
                {currentResult.route.map((point, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${index === currentResult.route.length - 1 ? 'bg-velta-600' : 'bg-gray-300'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-1">
                        <span className="font-medium text-gray-900">{point.location}</span>
                        <span className="text-sm text-gray-500">{point.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-velta-600">{point.status}</span>
                        <span className="text-sm text-gray-600">• {point.description}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
