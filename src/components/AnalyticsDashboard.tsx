'use client';

import { useState, useEffect } from 'react';
import { OrderMetrics, DriverMetrics, SystemMetrics } from '@/lib/models';

interface AnalyticsData {
  orders: OrderMetrics;
  drivers: DriverMetrics;
  system: SystemMetrics;
  timestamp: string;
}

export default function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    fetchAnalytics();
  }, [refreshKey]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/analytics/overview');
      
      if (!response.ok) {
        throw new Error('Ошибка загрузки аналитики');
      }
      
      const result = await response.json();
      setData(result.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-velta-royal-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button
          onClick={refreshData}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и кнопка обновления */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Аналитический дашборд</h2>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            Последнее обновление: {new Date(data.timestamp).toLocaleString('ru-RU')}
          </span>
          <button
            onClick={refreshData}
            className="px-4 py-2 bg-velta-royal-blue text-white rounded-lg hover:bg-velta-navy transition-colors"
          >
            🔄 Обновить
          </button>
        </div>
      </div>

      {/* Основные метрики */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Заказы */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 rounded-lg">
              <span className="text-2xl">📦</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Всего заказов</p>
              <p className="text-2xl font-bold text-gray-900">{data.orders.totalOrders}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Активные:</span>
              <span className="font-medium text-blue-600">{data.orders.activeOrders}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Завершенные:</span>
              <span className="font-medium text-green-600">{data.orders.completedOrders}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Задержки:</span>
              <span className="font-medium text-red-600">{data.orders.delayedOrders}</span>
            </div>
          </div>
        </div>

        {/* Финансы */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 rounded-lg">
              <span className="text-2xl">💰</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Общий доход</p>
              <p className="text-2xl font-bold text-gray-900">
                {data.orders.totalRevenue.toLocaleString('ru-RU')} ₸
              </p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Средний чек:</span>
              <span className="font-medium text-green-600">
                {data.orders.averageOrderValue.toLocaleString('ru-RU')} ₸
              </span>
            </div>
          </div>
        </div>

        {/* Водители */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 rounded-lg">
              <span className="text-2xl">🚛</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Водители</p>
              <p className="text-2xl font-bold text-gray-900">{data.drivers.totalDrivers}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Активные:</span>
              <span className="font-medium text-purple-600">{data.drivers.activeDrivers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Средний рейтинг:</span>
              <span className="font-medium text-purple-600">{data.drivers.averageRating.toFixed(1)}</span>
            </div>
          </div>
        </div>

        {/* Система */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-orange-100 rounded-lg">
              <span className="text-2xl">⚙️</span>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Пользователи</p>
              <p className="text-2xl font-bold text-gray-900">{data.system.totalUsers}</p>
            </div>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Активные:</span>
              <span className="font-medium text-orange-600">{data.system.activeUsers}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Uptime:</span>
              <span className="font-medium text-orange-600">{data.system.systemUptime}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Детальная аналитика */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Статистика по статусам */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Заказы по статусам</h3>
          <div className="space-y-3">
            {Object.entries(data.orders.ordersByStatus).map(([status, count]) => (
              <div key={status} className="flex items-center justify-between">
                <span className="text-sm text-gray-600 capitalize">{status}</span>
                <div className="flex items-center space-x-2">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-velta-royal-blue h-2 rounded-full"
                      style={{ width: `${(count / data.orders.totalOrders) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Топ маршрутов */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Топ маршрутов</h3>
          <div className="space-y-3">
            {data.orders.topRoutes.slice(0, 5).map((route, index) => (
              <div key={route.route} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-500 w-6">#{index + 1}</span>
                  <span className="text-sm text-gray-600">{route.route}</span>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">{route.count}</div>
                  <div className="text-xs text-gray-500">
                    {route.revenue.toLocaleString('ru-RU')} ₸
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Топ водителей */}
      {data.drivers.topDrivers.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Топ водителей</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Место
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Водитель
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Заказов
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Рейтинг
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Заработок
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.drivers.topDrivers.map((driver, index) => (
                  <tr key={driver.driverId}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                          index === 0 ? 'bg-yellow-100 text-yellow-800' :
                          index === 1 ? 'bg-gray-100 text-gray-800' :
                          index === 2 ? 'bg-orange-100 text-orange-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {index + 1}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {driver.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.completedOrders}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ⭐ {driver.rating}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {driver.totalEarnings.toLocaleString('ru-RU')} ₸
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* График по месяцам */}
      {data.orders.ordersByMonth.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Динамика заказов по месяцам</h3>
          <div className="h-64 flex items-end justify-between space-x-2">
            {data.orders.ordersByMonth.map((month) => {
              const maxCount = Math.max(...data.orders.ordersByMonth.map(m => m.count));
              const height = maxCount > 0 ? (month.count / maxCount) * 100 : 0;
              
              return (
                <div key={month.month} className="flex-1 flex flex-col items-center">
                  <div className="w-full bg-gray-200 rounded-t">
                    <div
                      className="bg-velta-royal-blue rounded-t transition-all duration-300"
                      style={{ height: `${height}%` }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 text-center">
                    <div>{month.count}</div>
                    <div className="text-xs text-gray-400">{month.month}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
