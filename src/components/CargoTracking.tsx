'use client';

import {useState, useEffect} from 'react';
import {useTranslations} from 'next-intl';
import LeafletMap from './LeafletMap';
import DriverLocationUpdate from './DriverLocationUpdate';

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

interface RoutePoint {
  status: 'pending' | 'in_transit' | 'delivered' | 'warehouse';
  location: string;
  description: string;
  timestamp: string;
  lat: number;
  lng: number;
}

interface MapPoint {
  lat: number;
  lng: number;
  title: string;
  status: 'pending' | 'in_transit' | 'delivered' | 'warehouse';
  timestamp?: string;
  description?: string;
  address?: string;
  speed?: string;
}

export default function CargoTracking() {
  const t = useTranslations('cargoTracking');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [error, setError] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [mapPoints, setMapPoints] = useState<MapPoint[]>([]);
  const [isLiveTracking, setIsLiveTracking] = useState(false);
  const [livePosition, setLivePosition] = useState<MapPoint | null>(null);

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
    
    try {
      // Call real API
      const response = await fetch(`/api/tracking/${trackingNumber}`);
      
      if (!response.ok) {
        if (response.status === 404) {
          setError(t('errors.notFound'));
        } else {
          setError(t('errors.fetchError'));
        }
        setIsTracking(false);
        return;
      }
      
      const trackingData = await response.json();
      
      // Convert API response to component format
      const mockResult: TrackingResult = {
        trackingNumber: trackingData.trackingNumber,
        status: getStatusText(trackingData.status),
        estimatedDelivery: trackingData.estimatedDelivery || t('result.inProgress'),
        history: trackingData.route.map((point: RoutePoint) => ({
          status: getStatusText(point.status),
          location: point.location,
          date: new Date(point.timestamp).toLocaleDateString('ru-RU'),
          time: new Date(point.timestamp).toLocaleTimeString('ru-RU', { 
            hour: '2-digit', 
            minute: '2-digit' 
          }),
          description: point.description
        })).reverse() // Show newest first
      };
      
      setResult(mockResult);
      setMapPoints(trackingData.route.map((point: RoutePoint) => ({
        lat: point.lat,
        lng: point.lng,
        title: point.location,
        description: point.description,
        status: point.status
      })));

      // Start live tracking if cargo is in transit
      if (trackingData.status === 'in_transit') {
        startLiveTracking(trackingNumber);
      }
      
    } catch (err) {
      setError(t('errors.connectionError'));
      console.error('Tracking error:', err);
    }
    setIsTracking(false);
  };

  const startLiveTracking = (trackingNum: string) => {
    setIsLiveTracking(true);
    
    const eventSource = new EventSource(`/api/tracking/${trackingNum}/stream`);
    
    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        
        if (data.type === 'position_update') {
          setLivePosition(data.position);
          
          // Update map with current position
          setMapPoints(prev => [
            ...prev,
            {
              lat: data.position.lat,
              lng: data.position.lng,
              title: t('result.currentPosition'),
              description: t('result.speed', { speed: data.position.speed }),
              status: 'in_transit'
            }
          ]);
        }
      } catch (error) {
        console.error('Error parsing SSE data:', error);
      }
    };

    eventSource.onerror = () => {
      console.log('SSE connection error, retrying...');
      eventSource.close();
      setIsLiveTracking(false);
    };

    // Cleanup on component unmount
    return () => {
      eventSource.close();
      setIsLiveTracking(false);
    };
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return t('status.pending');
      case 'in_transit': return t('status.inTransit');
      case 'delivered': return t('status.delivered');
      case 'warehouse': return t('status.warehouse');
      case 'delayed': return t('status.delayed');
      case 'assigned': return t('status.assigned');
      case 'created': return t('status.created');
      default: return status; // Возвращаем кастомный статус как есть
    }
  };

  const getStatusColor = (status: string) => {
    if (status === t('status.delivered')) {
      return 'text-green-600 bg-green-100 border-green-300';
    } else if (status === t('status.inTransit')) {
      return 'text-blue-600 bg-blue-100 border-blue-300';
    } else if (status === t('status.warehouse')) {
      return 'text-yellow-600 bg-yellow-100 border-yellow-300';
    } else if (status === t('status.pending')) {
      return 'text-gray-600 bg-gray-100 border-gray-300';
    } else if (status === t('status.delayed')) {
      return 'text-red-600 bg-red-100 border-red-300';
    } else if (status === t('status.assigned')) {
      return 'text-purple-600 bg-purple-100 border-purple-300';
    } else if (status === t('status.created')) {
      return 'text-gray-600 bg-gray-100 border-gray-300';
    } else {
      // Для кастомных статусов используем оранжевый цвет
      return 'text-orange-600 bg-orange-100 border-orange-300';
    }
  };

  const getStatusIcon = (status: string) => {
    if (status === t('status.delivered')) {
      return '✅';
    } else if (status === t('status.inTransit')) {
      return '🚛';
    } else if (status === t('status.warehouse')) {
      return '📦';
    } else if (status === t('status.pending')) {
      return '📋';
    } else if (status === t('status.delayed')) {
      return '⚠️';
    } else if (status === t('status.assigned')) {
      return '👤';
    } else if (status === t('status.created')) {
      return '📝';
    } else {
      // Для кастомных статусов используем универсальную иконку
      return '📍';
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
          <div className="mt-4 animate-fade-in-up" style={{animationDelay: '0.5s'}}>
            <p className="text-base text-gray-600 mb-3">
            Для удобства и автоматизации отслеживания вы можете перейти в Telegram Bot, либо введите номер накладной чтобы узнать текущий статус доставки.
            </p>
            <a
              href="https://t.me/velta_logistics_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9.03 14.67l-.38 5.36c.54 0 .77-.23 1.05-.5l2.52-2.42 5.22 3.82c.96.53 1.65.25 1.91-.89l3.46-16.21h.01c.31-1.47-.53-2.05-1.46-1.69L1.3 9.63C-.12 10.2-.1 11.03 1.05 11.39l5.08 1.58 11.79-7.43c.55-.34 1.06-.15.64.19" />
              </svg>
              Telegram Bot
            </a>
          </div>
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
                  className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-velta-royal-blue focus:border-velta-royal-blue transition-all duration-300 hover:shadow-md"
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
                className="w-full px-6 py-3 bg-velta-royal-blue text-white font-semibold rounded-lg border-2 border-velta-royal-blue hover:bg-velta-navy hover:border-velta-navy focus:ring-2 focus:ring-velta-royal-blue focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
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
                    <div className="text-lg font-bold text-velta-royal-blue">{result.trackingNumber}</div>
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

              {/* Interactive Map */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <span className="mr-2">🗺️</span>
                  {t('result.cargoRoute')}
                  {isLiveTracking && (
                    <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-2 h-2 bg-green-400 rounded-full mr-1 animate-pulse"></span>
                      Live
                    </span>
                  )}
                </h3>
                {livePosition && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center text-sm text-blue-800">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="font-medium">{t('result.currentPosition')}:</span>
                      <span className="ml-1">{livePosition.address}</span>
                      <span className="ml-2 text-blue-600">({t('result.speed', { speed: livePosition.speed })})</span>
                    </div>
                  </div>
                )}
                <LeafletMap
                  points={mapPoints}
                  center={mapPoints.length > 0 ? [mapPoints[0].lat, mapPoints[0].lng] : [55.7558, 37.6176]}
                  zoom={mapPoints.length > 1 ? 6 : 10}
                  height="300px"
                  className="shadow-lg"
                />
              </div>

              <p className="mt-6 text-sm text-gray-600 text-center animate-fade-in-up" style={{animationDelay: '1.5s'}}>
                {t('note')}
              </p>
              
              {/* Driver Location Update Section - для демонстрации */}
              {result && (
                <DriverLocationUpdate
                  driverId={1} // Тестовый водитель
                  orderId={result.trackingNumber}
                  onLocationUpdate={(newLocation) => {
                    // Обновляем карту с новой точкой
                    setMapPoints(prev => [...prev, {
                      lat: newLocation.lat,
                      lng: newLocation.lng,
                      title: newLocation.location,
                      description: newLocation.description,
                      status: newLocation.status
                    }]);
                    
                    // Обновляем историю
                    setResult(prev => prev ? {
                      ...prev,
                      history: [
                        {
                          status: getStatusText(newLocation.status),
                          location: newLocation.location,
                          date: new Date(newLocation.timestamp).toLocaleDateString('ru-RU'),
                          time: new Date(newLocation.timestamp).toLocaleTimeString('ru-RU', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          }),
                          description: newLocation.description
                        },
                        ...prev.history
                      ]
                    } : null);
                  }}
                />
              )}
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
