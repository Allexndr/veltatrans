'use client';

import { useState, useEffect } from 'react';

interface BotInfo {
  id: number;
  is_bot: boolean;
  first_name: string;
  username: string;
  can_join_groups: boolean;
  can_read_all_group_messages: boolean;
  supports_inline_queries: boolean;
}

interface WebhookInfo {
  url: string;
  has_custom_certificate: boolean;
  pending_update_count: number;
  last_error_date?: number;
  last_error_message?: string;
  max_connections: number;
  allowed_updates: string[];
}

export default function TelegramAdminPage() {
  const [botInfo, setBotInfo] = useState<BotInfo | null>(null);
  const [webhookInfo, setWebhookInfo] = useState<WebhookInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchBotInfo();
  }, []);

  const fetchBotInfo = async () => {
    try {
      const response = await fetch('/api/telegram/setup');
      const data = await response.json();
      setBotInfo(data.bot);
      setWebhookInfo(data.webhook);
    } catch (error) {
      console.error('Error fetching bot info:', error);
      setMessage('Ошибка загрузки информации о боте');
    } finally {
      setLoading(false);
    }
  };

  const setWebhook = async () => {
    setActionLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/telegram/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'setWebhook' }),
      });
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Webhook успешно установлен!');
        fetchBotInfo();
      } else {
        setMessage('❌ Ошибка установки webhook: ' + data.description);
      }
    } catch (error) {
      setMessage('❌ Ошибка установки webhook');
    } finally {
      setActionLoading(false);
    }
  };

  const deleteWebhook = async () => {
    setActionLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/telegram/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action: 'deleteWebhook' }),
      });
      const data = await response.json();
      
      if (data.ok) {
        setMessage('✅ Webhook успешно удален!');
        fetchBotInfo();
      } else {
        setMessage('❌ Ошибка удаления webhook');
      }
    } catch (error) {
      setMessage('❌ Ошибка удаления webhook');
    } finally {
      setActionLoading(false);
    }
  };

  const sendTestNotification = async () => {
    setActionLoading(true);
    setMessage('');
    try {
      const response = await fetch('/api/telegram/notify');
      const data = await response.json();
      
      if (data.success) {
        setMessage('✅ Тестовое уведомление отправлено!');
      } else {
        setMessage('❌ Ошибка отправки тестового уведомления');
      }
    } catch (error) {
      setMessage('❌ Ошибка отправки тестового уведомления');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка информации о боте...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex items-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center mr-4">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.374 0 0 5.373 0 12s5.374 12 12 12 12-5.373 12-12S18.626 0 12 0zm5.568 8.16c-.169 1.858-.896 6.728-.896 6.728-.896 6.728-1.268 8.046-1.268 8.046-.16.708-.534.855-.534.855s-.913.048-1.898-.537c-.987-.585-2.271-1.455-2.271-1.455l-2.055-1.31s-.547-.414-.547-1.046c0-.631.547-1.046.547-1.046l8.53-7.861s.632-.547 1.046-.547c.414 0 .632.547.632.547l1.046 8.53z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Управление Telegram ботом</h1>
              <p className="text-gray-600">Панель администрирования бота Velta Trans</p>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${
              message.includes('✅') ? 'bg-green-50 text-green-800 border border-green-200' : 
              'bg-red-50 text-red-800 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* Информация о боте */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Информация о боте</h2>
            {botInfo ? (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Имя:</span>
                    <p className="text-gray-900">{botInfo.first_name}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Username:</span>
                    <p className="text-gray-900">@{botInfo.username}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">ID:</span>
                    <p className="text-gray-900">{botInfo.id}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Статус:</span>
                    <p className="text-green-600">✅ Активен</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-red-600">❌ Не удалось загрузить информацию о боте</p>
            )}
          </div>

          {/* Информация о webhook */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Webhook</h2>
            {webhookInfo ? (
              <div className="bg-gray-50 rounded-lg p-6">
                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">URL:</span>
                    <p className="text-gray-900 break-all">{webhookInfo.url || 'Не установлен'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Ожидающие обновления:</span>
                    <p className="text-gray-900">{webhookInfo.pending_update_count}</p>
                  </div>
                  {webhookInfo.last_error_message && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Последняя ошибка:</span>
                      <p className="text-red-600">{webhookInfo.last_error_message}</p>
                    </div>
                  )}
                  <div>
                    <span className="text-sm font-medium text-gray-500">Максимум соединений:</span>
                    <p className="text-gray-900">{webhookInfo.max_connections}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Разрешенные обновления:</span>
                    <p className="text-gray-900">{webhookInfo.allowed_updates.join(', ')}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-red-600">❌ Не удалось загрузить информацию о webhook</p>
            )}
          </div>

          {/* Действия */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900">Управление</h2>
            
            <div className="flex flex-wrap gap-4">
              <button
                onClick={setWebhook}
                disabled={actionLoading}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Обработка...' : '🔗 Установить Webhook'}
              </button>

              <button
                onClick={deleteWebhook}
                disabled={actionLoading}
                className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Обработка...' : '🗑️ Удалить Webhook'}
              </button>

              <button
                onClick={sendTestNotification}
                disabled={actionLoading}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Отправка...' : '📨 Тест уведомления'}
              </button>

              <button
                onClick={fetchBotInfo}
                disabled={actionLoading}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {actionLoading ? 'Обновление...' : '🔄 Обновить данные'}
              </button>
            </div>
          </div>

          {/* Инструкции */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">📋 Инструкции</h3>
            <div className="space-y-2 text-blue-800">
              <p><strong>1.</strong> Убедитесь, что webhook установлен для получения сообщений от пользователей</p>
              <p><strong>2.</strong> Бот автоматически отправляет уведомления в канал при новых заявках</p>
              <p><strong>3.</strong> Водители могут регистрироваться через бота: /start</p>
              <p><strong>4.</strong> Все уведомления дублируются в канал: -1002999769930</p>
              <p><strong>5.</strong> Для тестирования используйте кнопку &quot;Тест уведомления&quot;</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
