# Velta Trans - Структура проекта

## 📁 Организация файлов

```
velta-trans/
├── 📁 src/                          # Исходный код
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📁 [locale]/            # Локализованные страницы
│   │   │   ├── 📄 page.tsx         # Главная страница
│   │   │   ├── 📄 about/           # О компании
│   │   │   ├── 📄 services/        # Услуги
│   │   │   ├── 📄 directions/      # Направления
│   │   │   ├── 📄 rates/           # Тарифы
│   │   │   ├── 📄 contacts/        # Контакты
│   │   │   └── 📄 layout.tsx       # Локализованный layout
│   │   ├── 📁 api/                 # API маршруты
│   │   │   ├── 📁 telegram/        # Telegram бот API
│   │   │   ├── 📁 contact/         # Контактные формы
│   │   │   └── 📁 tracking/        # Отслеживание грузов
│   │   ├── 📄 layout.tsx           # Корневой layout
│   │   └── 📄 globals.css          # Глобальные стили
│   ├── 📁 components/               # React компоненты
│   │   ├── 📄 Header.tsx           # Шапка сайта
│   │   ├── 📄 Footer.tsx           # Подвал сайта
│   │   ├── 📄 Logo.tsx             # Логотип
│   │   ├── 📄 Hero.tsx             # Главная секция
│   │   ├── 📄 HeroGallery.tsx      # Галерея изображений
│   │   ├── 📄 ServicesPreview.tsx  # Предварительный просмотр услуг
│   │   └── 📄 FloatingContacts.tsx # Плавающие контакты
│   ├── 📁 lib/                     # Библиотеки и утилиты
│   ├── 📁 utils/                   # Вспомогательные функции
│   └── 📁 i18n/                    # Интернационализация
├── 📁 assets/                       # Ресурсы проекта
│   ├── 📁 images/                  # Изображения
│   │   ├── 📄 truck-velta-trans.jpg
│   │   ├── 📄 railway-wagons.jpg
│   │   ├── 📄 warehouse-outdoor.jpg
│   │   ├── 📄 multimodal-transport.jpg
│   │   ├── 📄 project-cargo.jpg
│   │   └── 📄 customs-new.jpg
│   ├── 📁 logos/                   # Логотипы и иконки
│   │   ├── 📄 New Logo VELTA TRANS.png
│   │   ├── 📄 New Logo VELTA TRANS svg.svg
│   │   ├── 📄 New Logo VELTA TRANS favicon svg.svg
│   │   └── 📄 *.svg                # SVG иконки
│   ├── 📁 documents/               # Документы
│   │   ├── 📄 Презентация_*.pptx
│   │   ├── 📄 КП VT rus.pdf
│   │   └── 📄 *.pdf, *.docx, *.txt
│   └── 📁 data/                    # Данные
│       ├── 📄 drivers.json
│       ├── 📄 Контакты водителей.json
│       └── 📄 *.xlsx
├── 📁 public/                       # Публичные файлы
│   ├── 📄 manifest.json            # PWA манифест
│   └── 📄 robots.txt               # SEO robots
├── 📁 messages/                     # Переводы
│   ├── 📄 ru.json                  # Русский
│   ├── 📄 en.json                  # Английский
│   ├── 📄 kz.json                  # Казахский
│   └── 📄 zh.json                  # Китайский
├── 📁 docs/                         # Документация
│   ├── 📄 README.md
│   └── 📄 PROJECT_STRUCTURE.md
├── 📄 package.json                  # Зависимости
├── 📄 next.config.js               # Конфигурация Next.js
├── 📄 tailwind.config.js           # Конфигурация Tailwind CSS
├── 📄 tsconfig.json                # Конфигурация TypeScript
└── 📄 .gitignore                   # Git игнорируемые файлы
```

## 🚀 Технологии

- **Framework:** Next.js 14.2.32
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Internationalization:** next-intl
- **Deployment:** Vercel

## 🎯 Основные функции

- 🌍 Многоязычность (RU, EN, KZ, ZH)
- 🚛 Логистические услуги
- 📱 Адаптивный дизайн
- 🔍 SEO оптимизация
- 📊 Аналитика и отслеживание
- 🤖 Telegram бот интеграция

## 📱 Страницы

1. **Главная** - Обзор услуг и компании
2. **Услуги** - Детальное описание логистических услуг
3. **Направления** - География перевозок
4. **Тарифы** - Стоимость услуг
5. **О компании** - Информация о Velta Trans
6. **Контакты** - Способы связи

## 🔧 Разработка

```bash
# Установка зависимостей
npm install

# Запуск в режиме разработки
npm run dev

# Сборка для продакшена
npm run build

# Запуск продакшн версии
npm start
```
