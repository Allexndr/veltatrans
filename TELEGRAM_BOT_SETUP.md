# 🚛 Telegram Bot Setup Guide - Velta Trans

## 📋 Обзор

Telegram бот для логистической компании Velta Trans с интеграцией MongoDB и расширенной функциональностью.

## ✨ Возможности

- **Регистрация водителей** - сбор данных о водителях и автомобилях
- **Создание заказов** - клиенты могут создавать заказы на перевозку
- **Система рейтингов** - взаимные оценки водителей и клиентов
- **Аналитика** - статистика по водителям, заказам и эффективности
- **Уведомления** - автоматические уведомления в канал и пользователям
- **MongoDB интеграция** - надежное хранение данных

## 🚀 Быстрый старт

### 1. Переменные окружения

Создайте `.env.local` файл:

```bash
# MongoDB
MONGODB_URI=mongodb://localhost:27017/velta_trans
MONGODB_DB_NAME=velta_trans

# Telegram Bot
TELEGRAM_BOT_TOKEN=YOUR_BOT_TOKEN
TELEGRAM_CHANNEL_ID=YOUR_CHANNEL_ID

# Environment
NODE_ENV=development
```

### 2. Установка зависимостей

```bash
npm install
```

### 3. Запуск MongoDB

```bash
# macOS
brew services start mongodb/brew/mongodb-community

# Linux
sudo systemctl start mongod

# Windows
net start MongoDB
```

### 4. Запуск приложения

```bash
npm run dev
```

## 🔧 Настройка Webhook

### Локальная разработка

Для локального тестирования используйте ngrok:

```bash
# Установка ngrok
brew install ngrok

# Запуск туннеля
ngrok http 3000

# Получите публичный URL (например: https://abc123.ngrok.io)
```

### Продакшен (Vercel/Netlify)

1. Разверните приложение на Vercel:
```bash
npm install -g vercel
vercel --prod
```

2. Получите URL (например: `https://your-app.vercel.app`)

### Установка Webhook

Замените `YOUR_BOT_TOKEN` и `YOUR_WEBHOOK_URL`:

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "YOUR_WEBHOOK_URL/api/telegram/webhook",
    "allowed_updates": ["message", "callback_query"]
  }'
```

### Проверка Webhook

```bash
curl "https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo"
```

## 📊 API Endpoints

### Webhook
- `POST /api/telegram/webhook` - основной webhook для Telegram
- `GET /api/telegram/webhook` - проверка здоровья бота

### Аналитика
- `GET /api/telegram/analytics` - статистика и аналитика
- `POST /api/telegram/analytics` - сохранение аналитических событий

### Уведомления
- `POST /api/telegram/notifications` - отправка уведомлений
- `GET /api/telegram/notifications` - история уведомлений

### Миграция
- `POST /api/migrate/mongodb` - миграция данных в MongoDB
- `GET /api/migrate/mongodb` - статистика коллекций

## 🧪 Тестирование

Запустите тесты:

```bash
node test-bot.js
```

Или протестируйте вручную:

```bash
# Проверка здоровья
curl http://localhost:3000/api/telegram/webhook

# Аналитика
curl http://localhost:3000/api/telegram/analytics

# Уведомления
curl -X POST http://localhost:3000/api/telegram/notifications \
  -H "Content-Type: application/json" \
  -d '{"type":"system_alert","message":"Тест"}'
```

## 📱 Команды бота

- `/start` - главное меню
- `🚗 Зарегистрироваться как водитель` - регистрация водителя
- `📦 Создать заказ` - создание заказа на перевозку
- `📊 Мои заказы` - просмотр заказов пользователя
- `⭐ Оценить водителя` - оценка водителя
- `📈 Аналитика` - статистика системы

## 🔍 Мониторинг

### Логи MongoDB
```bash
tail -f /var/log/mongodb/mongod.log
```

### Логи приложения
```bash
# В терминале где запущен npm run dev
```

### Статистика MongoDB
```bash
curl http://localhost:3000/api/migrate/mongodb
```

## 🚨 Устранение неполадок

### Ошибка подключения к MongoDB
```bash
# Проверьте статус MongoDB
brew services list | grep mongodb

# Перезапустите MongoDB
brew services restart mongodb/brew/mongodb-community
```

### Webhook не работает
```bash
# Проверьте токен бота
curl "https://api.telegram.org/botYOUR_BOT_TOKEN/getMe"

# Проверьте webhook
curl "https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo"
```

### Ошибки в логах
```bash
# Проверьте .env.local
cat .env.local

# Перезапустите приложение
pkill -f "npm run dev"
npm run dev
```

## 📈 Производительность

- **Водители**: 8,852+ в базе данных
- **Заказы**: поддержка неограниченного количества
- **Уведомления**: мгновенная доставка
- **Аналитика**: реальное время

## 🔐 Безопасность

- Валидация входящих данных
- Проверка токенов Telegram
- Безопасное подключение к MongoDB
- Логирование всех операций

## 📞 Поддержка

При возникновении проблем:

1. Проверьте логи приложения
2. Убедитесь в корректности переменных окружения
3. Проверьте статус MongoDB
4. Протестируйте API endpoints

---

**Velta Trans** - Надежная логистика для вашего бизнеса! 🚛✨
