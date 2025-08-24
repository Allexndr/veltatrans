# 🚀 Настройка MongoDB Atlas для Velta Trans

## 📋 Предварительные требования

1. **MongoDB Atlas аккаунт** - зарегистрируйтесь на [mongodb.com/atlas](https://mongodb.com/atlas)
2. **Node.js проект** - убедитесь, что у вас установлен Node.js 18+
3. **Доступ к терминалу** - для выполнения команд

## 🔧 Пошаговая настройка

### 1. Создание кластера MongoDB Atlas

1. **Войдите в MongoDB Atlas**
   - Откройте [cloud.mongodb.com](https://cloud.mongodb.com)
   - Войдите в свой аккаунт

2. **Создайте новый кластер**
   - Нажмите "Build a Database"
   - Выберите "FREE" план (M0)
   - Выберите провайдера (AWS, Google Cloud, Azure)
   - Выберите регион (рекомендуется ближайший к вам)
   - Нажмите "Create"

3. **Настройте безопасность**
   - Создайте пользователя базы данных:
     - Username: `velta_user`
     - Password: `сложный_пароль_минимум_8_символов`
   - Добавьте IP адрес: `0.0.0.0/0` (для разработки) или ваш IP

### 2. Получение строки подключения

1. **В кластере нажмите "Connect"**
2. **Выберите "Connect your application"**
3. **Скопируйте строку подключения**
4. **Замените `<password>` на ваш пароль**

Пример строки:
```
mongodb+srv://velta_user:ваш_пароль@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
```

### 3. Настройка переменных окружения

1. **Создайте файл `.env.local` в корне проекта**
2. **Добавьте следующие переменные:**

```env
# MongoDB Atlas
MONGODB_URI=mongodb+srv://velta_user:ваш_пароль@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=velta_trans

# Telegram Bot (существующие)
TELEGRAM_BOT_TOKEN=ваш_токен
TELEGRAM_CHANNEL_ID=ваш_channel_id

# Google Analytics (существующие)
NEXT_PUBLIC_GA_ID=ваш_ga_id
```

### 4. Установка зависимостей

```bash
npm install mongodb
```

### 5. Миграция данных из JSON в MongoDB

1. **Запустите сервер разработки:**
   ```bash
   npm run dev
   ```

2. **Выполните миграцию данных:**
   ```bash
   curl -X POST http://localhost:3000/api/migrate/mongodb
   ```

3. **Проверьте статус миграции:**
   ```bash
   curl http://localhost:3000/api/migrate/mongodb
   ```

### 6. Тестирование подключения

1. **Откройте страницу аналитики:**
   ```
   http://localhost:3000/ru/analytics
   ```

2. **Проверьте, что данные загружаются**
3. **Убедитесь, что нет ошибок в консоли**

## 📊 Структура базы данных

После миграции в MongoDB будут созданы следующие коллекции:

### `orders` - Заказы
- `_id` - уникальный идентификатор MongoDB
- `trackingNumber` - номер для отслеживания
- `status` - статус заказа
- `from` / `to` - маршрут
- `route` - массив точек маршрута
- `finalPrice` - финальная цена
- `createdAt` - дата создания

### `drivers` - Водители
- `_id` - уникальный идентификатор MongoDB
- `name` - имя водителя
- `phone` - номер телефона
- `carNumber` - номер автомобиля
- `status` - статус (active/inactive)
- `rating` - рейтинг
- `completedOrders` - количество выполненных заказов

### `user_states` - Состояния пользователей
- `_id` - уникальный идентификатор MongoDB
- `userId` - ID пользователя Telegram
- `step` - текущий шаг в боте
- `driverAuthed` - авторизован ли как водитель
- `lastActivity` - последняя активность

### `staff_users` - Сотрудники
- `_id` - уникальный идентификатор MongoDB
- `name` - имя сотрудника
- `role` - роль (admin/manager/dispatcher)
- `permissions` - массив разрешений
- `isActive` - активен ли пользователь

## 🔍 Индексы для оптимизации

Автоматически создаются следующие индексы:

- `orders.trackingNumber` - уникальный индекс для номеров отслеживания
- `orders.status` - для быстрого поиска по статусу
- `orders.createdAt` - для сортировки по дате
- `orders.assignedDriver` - для поиска заказов водителя
- `drivers.phone` - уникальный индекс для телефонов
- `user_states.userId` - уникальный индекс для пользователей

## 🚨 Безопасность

### Для продакшена:

1. **Ограничьте IP адреса** - добавьте только IP вашего сервера
2. **Используйте сложные пароли** - минимум 16 символов
3. **Включите двухфакторную аутентификацию**
4. **Регулярно обновляйте пароли**
5. **Мониторьте доступ** - используйте встроенные инструменты Atlas

### Переменные окружения:

```env
# Продакшн
MONGODB_URI=mongodb+srv://velta_prod:сложный_пароль@cluster0.xxxxx.mongodb.net/velta_trans?retryWrites=true&w=majority
MONGODB_DB_NAME=velta_trans_prod
NODE_ENV=production
```

## 📈 Мониторинг и аналитика

### Встроенные инструменты Atlas:

1. **Charts** - создание дашбордов
2. **Performance Advisor** - оптимизация запросов
3. **Real-time Performance** - мониторинг в реальном времени
4. **Alerts** - уведомления о проблемах

### Настройка алертов:

1. **Database Performance** - медленные запросы
2. **Connection Count** - превышение лимита подключений
3. **Disk Usage** - использование диска
4. **Query Targeting** - неэффективные запросы

## 🛠️ Устранение неполадок

### Ошибка подключения:

```bash
# Проверьте строку подключения
echo $MONGODB_URI

# Проверьте доступность
ping cluster0.xxxxx.mongodb.net

# Проверьте логи
npm run dev
```

### Ошибка аутентификации:

1. **Проверьте пароль** - убедитесь, что он правильный
2. **Проверьте имя пользователя** - должно совпадать с созданным
3. **Проверьте права доступа** - пользователь должен иметь права на чтение/запись

### Ошибка сети:

1. **Проверьте IP адрес** - добавлен ли ваш IP в whitelist
2. **Проверьте регион** - выберите ближайший к вам
3. **Проверьте firewall** - убедитесь, что порт 27017 не заблокирован

## 📞 Поддержка

### MongoDB Atlas:
- **Документация**: [docs.atlas.mongodb.com](https://docs.atlas.mongodb.com)
- **Community**: [community.mongodb.com](https://community.mongodb.com)
- **Support**: доступен в платных планах

### Velta Trans:
- **Telegram**: @velta_logistics_bot
- **Email**: info@velta-logistics.com
- **Website**: [velta-logistics.com](https://velta-logistics.com)

---

**Версия**: 1.0.0  
**Последнее обновление**: Август 2024  
**Статус**: Готово к использованию
