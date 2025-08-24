# Velta Trans - Структура проекта

## 📁 Основная структура

```
china/
├── src/                    # Исходный код
│   ├── app/               # Next.js App Router
│   │   ├── [locale]/      # Локализованные страницы
│   │   └── layout.tsx     # Корневой layout
│   ├── components/        # React компоненты
│   ├── i18n/             # Интернационализация
│   └── styles/            # Стили и CSS
├── public/                # Статические файлы
│   ├── images/            # Изображения
│   │   └── logistics/     # Фотографии логистики
│   └── favicon.ico        # Иконка сайта
├── messages/              # Переводы
│   └── ru.json           # Русский язык
├── materials/             # Исходные материалы
├── scripts/               # Скрипты и утилиты
└── docs/                  # Документация
```

## 🎯 Основные компоненты

### Header
- **Файл:** `src/components/Header.tsx`
- **Описание:** Навигационная панель с логотипом и меню
- **Особенности:** 
  - Адаптивный дизайн
  - Локализация
  - Стильные hover эффекты
  - Аккуратные обводки кнопок

### HeroGallery
- **Файл:** `src/components/HeroGallery.tsx`
- **Описание:** Карусель изображений логистики
- **Изображения:**
  - Морские перевозки
  - Железнодорожные перевозки
  - Складские услуги
  - Международная логистика
  - Автомобильные перевозки
  - Таможенные услуги

### Logo
- **Файл:** `src/components/Logo.tsx`
- **Описание:** Логотип компании с адаптивными размерами

## 🌐 Интернационализация

- **Поддержка языков:** RU, EN, KZ, ZH
- **Файлы переводов:** `messages/ru.json`
- **Роутинг:** `src/i18n/routing.ts`

## 🎨 Стилизация

- **CSS Framework:** Tailwind CSS
- **Анимации:** Framer Motion
- **Цветовая схема:** Velta brand colors
- **Адаптивность:** Mobile-first подход

## 🚀 Запуск проекта

```bash
npm run dev          # Разработка
npm run build        # Сборка
npm run start        # Продакшн
```

## 📱 Адаптивность

- **Mobile:** 320px+
- **Tablet:** 768px+
- **Desktop:** 1024px+
- **Large:** 1280px+

## 🔧 Технологии

- **Frontend:** Next.js 15, React 18
- **Styling:** Tailwind CSS
- **Animations:** Framer Motion
- **Internationalization:** next-intl
- **TypeScript:** Полная поддержка
