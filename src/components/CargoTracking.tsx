'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';

interface TrackingStatus {
  status: string;
  location: string;
  date: string;
  time: string;
  description: string;
}

interface TrackingResult {
  trackingNumber: string;
  status: string;
  estimatedDelivery: string;
  history: TrackingStatus[];
}

export default function CargoTracking() {
  const t = useTranslations('cargoTracking');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) {
      setError(t('errors.emptyNumber'));
      return;
    }

    setIsTracking(true);
    setError('');
    setResult(null);
    
    // Simulate API call with animated progress
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock tracking result
    const mockResult: TrackingResult = {
      trackingNumber: trackingNumber,
      status: 'В пути',
      estimatedDelivery: '2024-02-15',
      history: [
        {
          status: 'Доставлен',
          location: 'Москва',
          date: '2024-02-15',
          time: '14:30',
          description: 'Груз доставлен получателю'
        },
        {
          status: 'В пути',
          location: 'Москва',
          date: '2024-02-14',
          time: '08:15',
          description: 'Груз отправлен в доставку'
        },
        {
          status: 'На складе',
          location: 'Москва',
          date: '2024-02-13',
          time: '16:45',
          description: 'Груз прибыл на склад назначения'
        },
        {
          status: 'В пути',
          location: 'Санкт-Петербург',
          date: '2024-02-12',
          time: '12:20',
          description: 'Груз отправлен из Санкт-Петербурга'
        },
        {
          status: 'Принят',
          location: 'Санкт-Петербург',
          date: '2024-02-11',
          time: '10:30',
          description: 'Груз принят к перевозке'
        }
      ]
    };
    
    setResult(mockResult);
    setIsTracking(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Доставлен':
        return 'text-green-600 bg-green-100 border-green-300';
      case 'В пути':
        return 'text-blue-600 bg-blue-100 border-blue-300';
      case 'На складе':
        return 'text-yellow-600 bg-yellow-100 border-yellow-300';
      case 'Принят':
        return 'text-gray-600 bg-gray-100 border-gray-300';
      default:
        return 'text-gray-600 bg-gray-100 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Доставлен':
        return '✅';
      case 'В пути':
        return '🚛';
      case 'На складе':
        return '📦';
      case 'Принят':
        return '📋';
      default:
        return '📋';
    }
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 animate-fade-in-up" style={{animationDelay: '0.2s'}}>
            {t('title')}
          </h2>
          <p className="text-lg text-gray-700 max-w-2xl mx-auto animate-fade-in-up" style={{animationDelay: '0.4s'}}>
            {t('description')}
          </p>
        </div>

        <div className={`bg-white rounded-lg shadow-lg p-8 transform transition-all duration-700 ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="animate-fade-in-up" style={{animationDelay: '0.6s'}}>
              <label htmlFor="trackingNumber" className="block text-sm font-medium text-gray-700 mb-2">
                {t('form.trackingNumber')} *
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="trackingNumber"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder={t('form.placeholder')}
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500 transition-all duration-300 hover:shadow-md"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 animate-pulse">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              {error && (
                <p className="mt-2 text-red-600 text-sm animate-shake">
                  {error}
                </p>
              )}
            </div>

            <div className="animate-fade-in-up" style={{animationDelay: '0.8s'}}>
              <button
                type="submit"
                disabled={isTracking}
                className="w-full bg-custom-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-custom-blue-700 focus:outline-none focus:ring-2 focus:ring-custom-blue-500 focus:ring-offset-2 transition-all duration-300 transform hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isTracking ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white"></div>
                    <span>{t('form.tracking')}</span>
                  </div>
                ) : (
                                     <div className="flex items-center justify-center space-x-2">
                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-1.447-.894L15 4m0 13V4m-6 3l6-3" />
                     </svg>
                     <span>{t('form.track')}</span>
                   </div>
                )}
              </button>
            </div>
          </form>

          {/* Result section with animations */}
          {result && (
            <div className="mt-8 animate-slide-in-up">
              {/* Header info */}
              <div className="bg-gradient-to-r from-blue-50 to-green-50 rounded-lg p-6 mb-6 border border-blue-200">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm animate-fade-in-up" style={{animationDelay: '0.2s'}}>
                    <div className="text-sm text-gray-700 mb-1">{t('result.trackingNumber')}</div>
                    <div className="text-lg font-bold text-custom-blue-600">{result.trackingNumber}</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm animate-fade-in-up" style={{animationDelay: '0.4s'}}>
                    <div className="text-sm text-gray-700 mb-1">{t('result.status')}</div>
                    <div className="text-lg font-bold text-green-600">{result.status}</div>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg shadow-sm animate-fade-in-up" style={{animationDelay: '0.6s'}}>
                    <div className="text-sm text-gray-700 mb-1">{t('result.estimatedDelivery')}</div>
                    <div className="text-lg font-bold text-gray-700">{result.estimatedDelivery}</div>
                  </div>
                </div>
              </div>

              {/* Tracking history */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
                  <span className="mr-2">📋</span>
                  {t('result.history')}
                </h3>
                <div className="space-y-4">
                  {result.history.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex items-start space-x-4 p-4 rounded-lg border transition-all duration-300 hover:shadow-md animate-fade-in-up"
                      style={{animationDelay: `${0.8 + index * 0.1}s`}}
                    >
                      <div className="flex-shrink-0">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl animate-pulse`}>
                          {getStatusIcon(item.status)}
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                            {item.status}
                          </span>
                          <div className="text-sm text-gray-500">
                            {item.date} {item.time}
                          </div>
                        </div>
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          📍 {item.location}
                        </div>
                        <p className="text-sm text-gray-600">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

                             <p className="mt-6 text-sm text-gray-600 text-center animate-fade-in-up" style={{animationDelay: '1.5s'}}>
                 {t('note')}
               </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes slide-in-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }
        
        .animate-slide-in-up {
          animation: slide-in-up 0.6s ease-out forwards;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </section>
  );
} 