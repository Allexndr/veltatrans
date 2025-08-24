# Настройка Яндекс.Карт для Velta Trans

## Переменные окружения

Создайте файл `.env.local` в корне проекта:

```bash
# SEO Configuration
NEXT_PUBLIC_SEO_GOOGLE=your-google-verification-code
NEXT_PUBLIC_SEO_YANDEX=your-yandex-verification-code

# Maps Configuration - Yandex Maps API Key
NEXT_PUBLIC_YANDEX_MAPS_KEY=e9cd5906-fd49-4f64-84f7-2b6b374d4765

# Optional: Alternative map providers (uncomment as needed)
# NEXT_PUBLIC_GOOGLE_MAPS_KEY=your-google-maps-key
# NEXT_PUBLIC_2GIS_KEY=your-2gis-key

# Database (for future use)
# DATABASE_URL=your-database-connection-string

# Telegram Bot (for future notifications)
# TELEGRAM_BOT_TOKEN=your-telegram-bot-token
# TELEGRAM_CHAT_ID=your-chat-id
```

## Что реализовано

### ✅ Яндекс.Карты интеграция
- Компонент `YandexMap` с поддержкой маркеров и маршрутов
- Автоматическое масштабирование карты под точки
- Цветовая индикация статусов грузов
- Обработка ошибок и состояний загрузки

### ✅ Геокодинг
- API endpoint `/api/geocode` для преобразования адресов в координаты
- Интеграция с Яндекс.Геокодер API
- Обработка ошибок и fallback

### ✅ Калькулятор расстояний
- API endpoint `/api/calculate-distance` 
- Расчет расстояния по формуле Haversine
- Детализированная стоимость (базовая, по весу, объему, негабарит)
- Интеграция с геокодингом для определения координат городов

### ✅ Трекинг грузов
- Mock API `/api/tracking/[trackingNumber]` с демо-данными
- Интерактивная карта с маршрутом груза
- История статусов с временными метками

### ✅ Real-time обновления
- SSE endpoint `/api/tracking/[trackingNumber]/stream`
- Live-позиция груза с обновлением каждые 5 секунд
- Индикатор "Live" и текущая скорость
- Автоматическое добавление точек на карту

## Тестовые данные

Для демонстрации используйте номера:
- `VT123456` - груз в пути (Санкт-Петербург → Москва)
- `VT789012` - доставленный груз (Пекин → Алматы)

## Лимиты Яндекс.Карт

- **25,000 запросов/день** (бесплатно)
- Подходит для старта проекта
- При превышении можно перейти на платный тариф

## Следующие шаги

1. **Подключение к реальному API** - замените mock-данные на вашу систему
2. **База данных** - добавьте PostgreSQL/Supabase для хранения грузов
3. **Telegram уведомления** - интеграция бота для push-уведомлений
4. **Админ-панель SEO** - простая форма для управления метатегами

## Безопасность

- API ключ Яндекс.Карт безопасен для фронтенда (NEXT_PUBLIC_*)
- Рекомендуется настроить ограничения по доменам в Яндекс.Кабинете
- Для продакшена добавьте домен `velta-trans.com` в разрешенные


