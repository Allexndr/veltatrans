// Animation constants
export const ANIMATION_DURATIONS = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  slowest: 1.2
} as const;

export const ANIMATION_EASINGS = {
  easeOut: "easeOut",
  easeIn: "easeIn",
  easeInOut: "easeInOut",
  linear: "linear"
} as const;

// Breakpoints for responsive design
export const BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536
} as const;

// Performance constants
export const PERFORMANCE = {
  LAZY_LOAD_THRESHOLD: 0.1,
  IMAGE_QUALITY: 85,
  ANIMATION_REDUCED_MOTION: 'prefers-reduced-motion',
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 100
} as const;

// SEO constants
export const SEO = {
  DEFAULT_TITLE: 'Velta Trans - Международная логистика',
  DEFAULT_DESCRIPTION: 'Профессиональные услуги международной логистики, таможенного оформления и складского хранения',
  DEFAULT_KEYWORDS: 'логистика, таможенное оформление, складское хранение, международные перевозки',
  SITE_URL: 'https://velta-trans.com'
} as const;

// API constants
export const API = {
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
} as const;

// Form validation constants
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^[\+]?[1-9][\d]{0,15}$/,
  MIN_PASSWORD_LENGTH: 8,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
} as const;

// Localization constants
export const LOCALES = {
  RU: 'ru',
  EN: 'en',
  KZ: 'kz',
  ZH: 'zh'
} as const;

export const DEFAULT_LOCALE = LOCALES.RU;

// Theme constants
export const THEME = {
  COLORS: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a'
    },
    customBlue: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e'
    }
  },
  FONTS: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    serif: ['Georgia', 'serif'],
    mono: ['JetBrains Mono', 'monospace']
  },
  SPACING: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem'
  }
} as const;

// Error messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Ошибка сети. Проверьте подключение к интернету.',
  VALIDATION_ERROR: 'Пожалуйста, проверьте правильность введенных данных.',
  SERVER_ERROR: 'Ошибка сервера. Попробуйте позже.',
  NOT_FOUND: 'Страница не найдена.',
  UNAUTHORIZED: 'Необходима авторизация.',
  FORBIDDEN: 'Доступ запрещен.',
  RATE_LIMIT: 'Слишком много запросов. Попробуйте позже.',
  FILE_TOO_LARGE: 'Файл слишком большой.',
  INVALID_FILE_TYPE: 'Неподдерживаемый тип файла.',
  REQUIRED_FIELD: 'Это поле обязательно для заполнения.',
  INVALID_EMAIL: 'Введите корректный email адрес.',
  INVALID_PHONE: 'Введите корректный номер телефона.',
  PASSWORD_TOO_SHORT: 'Пароль должен содержать минимум 8 символов.',
  PASSWORDS_DONT_MATCH: 'Пароли не совпадают.'
} as const;

// Success messages
export const SUCCESS_MESSAGES = {
  FORM_SUBMITTED: 'Форма успешно отправлена.',
  DATA_SAVED: 'Данные успешно сохранены.',
  FILE_UPLOADED: 'Файл успешно загружен.',
  EMAIL_SENT: 'Email успешно отправлен.',
  PASSWORD_CHANGED: 'Пароль успешно изменен.',
  PROFILE_UPDATED: 'Профиль успешно обновлен.'
} as const;

// Loading states
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error'
} as const;

// Cache keys
export const CACHE_KEYS = {
  USER_PROFILE: 'user-profile',
  SETTINGS: 'settings',
  TRANSLATIONS: 'translations',
  API_RESPONSE: 'api-response'
} as const;

// Cache TTL (Time To Live) in milliseconds
export const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 24 * 60 * 60 * 1000, // 24 hours
  VERY_LONG: 7 * 24 * 60 * 60 * 1000 // 7 days
} as const; 