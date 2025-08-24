'use client';

import { useState } from 'react';

interface DriverLocationUpdateProps {
  driverId: number;
  orderId: string;
  onLocationUpdate?: (location: any) => void;
}

export default function DriverLocationUpdate({ driverId, orderId, onLocationUpdate }: DriverLocationUpdateProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState('');
  const [locationData, setLocationData] = useState({
    lat: '',
    lng: '',
    location: '',
    status: 'in_transit',
    description: '',
    customStatus: ''
  });

  const handleLocationUpdate = async () => {
    if (!locationData.lat || !locationData.lng || !locationData.location) {
      setMessage('Пожалуйста, заполните все поля');
      return;
    }

    setIsUpdating(true);
    setMessage('');

    try {
      const response = await fetch('/api/driver/location', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driverId,
          orderId,
          lat: parseFloat(locationData.lat),
          lng: parseFloat(locationData.lng),
          location: locationData.location,
          status: locationData.status === 'custom' ? locationData.customStatus : locationData.status,
          description: locationData.description,
          timestamp: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setMessage('Местоположение обновлено успешно!');
        setLocationData({
          lat: '',
          lng: '',
          location: '',
          status: 'in_transit',
          description: '',
          customStatus: ''
        });
        
        if (onLocationUpdate) {
          onLocationUpdate(result.routePoint);
        }
      } else {
        const error = await response.json();
        setMessage(`Ошибка: ${error.error}`);
      }
    } catch (error) {
      setMessage('Ошибка соединения с сервером');
    } finally {
      setIsUpdating(false);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData(prev => ({
            ...prev,
            lat: position.coords.latitude.toString(),
            lng: position.coords.longitude.toString()
          }));
        },
        (error) => {
          setMessage('Ошибка получения геолокации: ' + error.message);
        }
      );
    } else {
      setMessage('Геолокация не поддерживается в вашем браузере');
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="mr-2">📍</span>
        Обновление местоположения
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Широта (Latitude)
          </label>
          <input
            type="number"
            step="any"
            value={locationData.lat}
            onChange={(e) => setLocationData(prev => ({ ...prev, lat: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-velta-royal-blue focus:border-velta-royal-blue"
            placeholder="43.2381"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Долгота (Longitude)
          </label>
          <input
            type="number"
            step="any"
            value={locationData.lng}
            onChange={(e) => setLocationData(prev => ({ ...prev, lng: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-velta-royal-blue focus:border-velta-royal-blue"
            placeholder="76.9452"
          />
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Название места
        </label>
        <input
          type="text"
          value={locationData.location}
          onChange={(e) => setLocationData(prev => ({ ...prev, location: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-velta-royal-blue focus:border-velta-royal-blue"
          placeholder="Например: Заправка, Склад, Таможня"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Статус
        </label>
        <select
          value={locationData.status}
          onChange={(e) => setLocationData(prev => ({ ...prev, status: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-velta-royal-blue focus:border-velta-royal-blue"
        >
          <option value="in_transit">В пути</option>
          <option value="warehouse">На складе</option>
          <option value="delivered">Доставлен</option>
          <option value="delayed">Задержка</option>
          <option value="custom">Кастомный статус</option>
        </select>
      </div>

      {locationData.status === 'custom' && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Введите свой статус
          </label>
          <input
            type="text"
            value={locationData.customStatus || ''}
            onChange={(e) => setLocationData(prev => ({ ...prev, customStatus: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-velta-royal-blue focus:border-velta-royal-blue"
            placeholder="Например: На таможне, Погрузка, Разгрузка, Ремонт"
          />
        </div>
      )}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Описание
        </label>
        <textarea
          value={locationData.description}
          onChange={(e) => setLocationData(prev => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-velta-royal-blue focus:border-velta-royal-blue"
          rows={3}
          placeholder="Например: Остановка на заправке, загрузка на складе, прохождение таможни"
        />
      </div>

      <div className="flex flex-wrap gap-3 mb-4">
        <button
          onClick={getCurrentLocation}
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          📍 Получить текущее местоположение
        </button>
        
        <button
          onClick={handleLocationUpdate}
          disabled={isUpdating}
          className="inline-flex items-center px-4 py-2 bg-velta-royal-blue text-white text-sm font-medium rounded-lg hover:bg-velta-navy transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isUpdating ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Обновление...
            </>
          ) : (
            'Обновить местоположение'
          )}
        </button>
      </div>

      {message && (
        <div className={`p-3 rounded-lg text-sm ${
          message.includes('Ошибка') 
            ? 'bg-red-100 text-red-800 border border-red-200' 
            : 'bg-green-100 text-green-800 border border-green-200'
        }`}>
          {message}
        </div>
      )}

      <div className="text-xs text-gray-500 mt-3">
        <p>• Используйте кнопку &quot;Получить текущее местоположение&quot; для автоматического заполнения координат</p>
        <p>• Или введите координаты вручную</p>
        <p>• Обновляйте местоположение при каждой остановке или изменении статуса</p>
      </div>
    </div>
  );
}
