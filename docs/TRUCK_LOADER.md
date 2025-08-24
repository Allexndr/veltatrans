# 🚛 Анимированный лоадер грузовика

Красивый и тематический лоадер для логистического сайта, где грузовик едет по дороге и оставляет за собой след из точек.

## 📦 Компоненты

### TruckLoader
Основной компонент анимированного грузовика.

```tsx
import TruckLoader from '@/components/TruckLoader';

<TruckLoader size="md" speed="normal" />
```

#### Пропсы:
- `size?: 'sm' | 'md' | 'lg'` - размер лоадера (по умолчанию: 'md')
- `speed?: 'slow' | 'normal' | 'fast'` - скорость анимации (по умолчанию: 'normal')
- `className?: string` - дополнительные CSS классы

### LoadingScreen
Полноэкранный лоадер с сообщением.

```tsx
import LoadingScreen from '@/components/LoadingScreen';

<LoadingScreen 
  message="Загружаем данные..." 
  size="lg" 
  speed="normal"
  className="min-h-[300px]"
/>
```

#### Пропсы:
- `message?: string` - сообщение загрузки (по умолчанию: 'Загрузка...')
- `size?: 'sm' | 'md' | 'lg'` - размер грузовика
- `speed?: 'slow' | 'normal' | 'fast'` - скорость анимации
- `className?: string` - дополнительные CSS классы

### SimpleLoader
Простой лоадер с опциональным текстом.

```tsx
import SimpleLoader from '@/components/SimpleLoader';

<SimpleLoader 
  size="md" 
  speed="normal" 
  showText={true}
  text="Загрузка..."
/>
```

#### Пропсы:
- `size?: 'sm' | 'md' | 'lg'` - размер грузовика
- `speed?: 'slow' | 'normal' | 'fast'` - скорость анимации
- `className?: string` - дополнительные CSS классы
- `showText?: boolean` - показывать ли текст (по умолчанию: false)
- `text?: string` - текст загрузки (по умолчанию: 'Загрузка...')

## 🎨 Особенности анимации

### Грузовик
- Плавное движение слева направо
- Подпрыгивание на неровностях дороги
- Детализированная кабина с окном и фарами
- Кузов с грузом
- Колеса с тенями
- Выхлопная труба

### Эффекты
- Дым из выхлопной трубы
- Пыль от колес
- Точки маршрута с плавным появлением и затуханием
- Градиентная дорога с тенями

### Точки маршрута
- 12 точек вдоль дороги
- Плавное появление при приближении грузовика
- Постепенное затухание при удалении
- Масштабирование для эффекта глубины

## 🚀 Использование

### В компонентах с состоянием загрузки
```tsx
if (!data) {
  return (
    <div className="py-16 bg-gray-50">
      <LoadingScreen 
        message="Загружаем кейсы..." 
        size="lg" 
        speed="normal"
        className="h-96"
      />
    </div>
  );
}
```

### В кнопках
```tsx
<button disabled={isLoading}>
  {isLoading ? (
    <div className="flex items-center justify-center">
      <TruckLoader size="sm" speed="fast" />
      <span className="ml-2">Загрузка...</span>
    </div>
  ) : (
    'Отправить'
  )}
</button>
```

### В модальных окнах
```tsx
{isSubmitting && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white rounded-lg p-8">
      <SimpleLoader 
        size="lg" 
        speed="normal" 
        showText={true}
        text="Отправляем данные..."
      />
    </div>
  </div>
)}
```

## 🎯 Демо

Посмотреть все варианты лоадера можно на странице: `/ru/loader-demo`

## 🔧 Настройка

### Скорости анимации
- `slow`: 150ms для грузовика, 100ms для точек, 800ms для подпрыгивания
- `normal`: 100ms для грузовика, 50ms для точек, 500ms для подпрыгивания  
- `fast`: 50ms для грузовика, 25ms для точек, 300ms для подпрыгивания

### Размеры
- `sm`: 20x10 (грузовик: 10x5)
- `md`: 32x16 (грузовик: 14x7)
- `lg`: 40x20 (грузовик: 18x9)

## 🎨 Кастомизация

Лоадер использует цветовую схему сайта:
- `custom-blue-400` до `custom-blue-900` для грузовика
- `gray-300` до `gray-900` для дороги и колес
- `yellow-300` для фар
- `blue-100` до `blue-200` для окон

Для изменения цветов отредактируйте классы в компоненте `TruckLoader.tsx`. 