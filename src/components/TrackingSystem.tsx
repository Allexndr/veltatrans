'use client';

import {useState} from 'react';
import {motion} from 'framer-motion';

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
  }>;
}

export default function TrackingSystem({}: TrackingSystemProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingNumbers, setTrackingNumbers] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [results, setResults] = useState<TrackingResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Заглушка для демонстрации функционала
  const mockTrackingData = (ttn: string): TrackingResult => {
    const statuses: Array<'pending' | 'in_transit' | 'delivered' | 'warehouse'> = ['pending', 'in_transit', 'delivered', 'warehouse'];
    const locations = ['Алматы', 'Астана', 'Москва', 'Пекин', 'Урумчи', 'Ташкент'];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomLocation = locations[Math.floor(Math.random() * locations.length)];
    
    return {
      ttn,
      status: randomStatus,
      location: randomLocation,
      lastUpdate: new Date().toLocaleString('ru-RU'),
      route: [
        {
          location: 'Алматы',
          date: '2024-08-15 10:00',
          status: 'Груз принят',
          description: 'Груз принят к перевозке'
        },
        {
          location: 'Астана',
          date: '2024-08-16 14:30',
          status: 'В пути',
          description: 'Груз в пути, прошел таможенный контроль'
        },
        {
          location: randomLocation,
          date: new Date().toLocaleString('ru-RU'),
          status: getStatusText(randomStatus),
          description: 'Текущее местоположение'
        }
      ]
    };
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'pending': return 'Ожидает отправки';
      case 'in_transit': return 'В пути';
      case 'delivered': return 'Доставлено';
      case 'warehouse': return 'На складе';
      default: return 'Неизвестно';
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
      setError('Введите номер ТТН');
      return;
    }

    if (!trackingNumber.startsWith('WT') || trackingNumber.length !== 8) {
      setError('Номер ТТН должен быть в формате WT123456');
      return;
    }

    setLoading(true);
    setError('');

    // Имитация запроса к API
    setTimeout(() => {
      const result = mockTrackingData(trackingNumber);
      setResults([result]);
      setTrackingNumbers([trackingNumber]);
      setCurrentIndex(0);
      setLoading(false);
    }, 1000);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      const numbers = content.split('\n').map(line => line.trim()).filter(line => line.length > 0);
      
      if (numbers.length === 0) {
        setError('Файл пуст или не содержит номеров ТТН');
        return;
      }

      if (numbers.length > 50) {
        setError('Максимальное количество номеров: 50');
        return;
      }

      setLoading(true);
      setError('');

      // Имитация обработки множественных номеров
      setTimeout(() => {
        const trackingResults = numbers.map(num => mockTrackingData(num));
        setResults(trackingResults);
        setTrackingNumbers(numbers);
        setCurrentIndex(0);
        setLoading(false);
      }, 2000);
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
            Отслеживание грузов
          </h1>
          <p className="text-lg text-gray-600">
            Введите номер ТТН или загрузите файл со списком номеров
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
                Отследить один груз
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Номер ТТН (формат: WT123456)
                  </label>
                  <input
                    type="text"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value.toUpperCase())}
                    placeholder="WT123456"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                    maxLength={8}
                  />
                </div>
                <button
                  onClick={handleSingleTracking}
                  disabled={loading}
                  className="w-full bg-custom-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-custom-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Поиск...
                    </div>
                  ) : (
                    'Отследить'
                  )}
                </button>
              </div>
            </div>

            {/* Множественные номера */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Отследить несколько грузов
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Загрузить файл с номерами ТТН
                  </label>
                  <input
                    type="file"
                    accept=".txt,.csv"
                    onChange={handleFileUpload}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  Формат файла: каждый номер ТТН на новой строке (максимум 50 номеров)
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
                  className="flex items-center px-4 py-2 text-custom-blue-600 hover:text-custom-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Предыдущий
                </button>
                
                <span className="text-gray-600 font-medium">
                  {currentIndex + 1} из {results.length}
                </span>
                
                <button
                  onClick={() => navigateTracking('next')}
                  disabled={currentIndex === results.length - 1}
                  className="flex items-center px-4 py-2 text-custom-blue-600 hover:text-custom-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Следующий
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
                  Номер ТТН: {currentResult.ttn}
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Статус:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentResult.status)}`}>
                      {getStatusText(currentResult.status)}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Местоположение:</span>
                    <span className="font-medium">{currentResult.location}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-600 w-32">Обновлено:</span>
                    <span className="text-sm text-gray-500">{currentResult.lastUpdate}</span>
                  </div>
                </div>
              </div>

              {/* Заглушка карты */}
              <div className="bg-gray-100 rounded-lg p-6 flex items-center justify-center">
                <div className="text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <p className="text-gray-500">Карта будет добавлена позже</p>
                  <p className="text-sm text-gray-400 mt-1">OpenStreetMap интеграция</p>
                </div>
              </div>
            </div>

            {/* Маршрут */}
            <div>
              <h4 className="text-xl font-semibold text-gray-900 mb-4">
                История перемещений
              </h4>
              <div className="space-y-4">
                {currentResult.route.map((point, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className={`w-3 h-3 rounded-full ${index === currentResult.route.length - 1 ? 'bg-custom-blue-600' : 'bg-gray-300'}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-1">
                        <span className="font-medium text-gray-900">{point.location}</span>
                        <span className="text-sm text-gray-500">{point.date}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium text-custom-blue-600">{point.status}</span>
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
