import {Metadata} from 'next';
import TruckLoader from '@/components/TruckLoader';
import LoadingScreen from '@/components/LoadingScreen';

export const metadata: Metadata = {
  title: 'Демо лоадера - Velta Trans',
  description: 'Демонстрация анимированного лоадера в виде грузовика',
};

export default function LoaderDemoPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Демо анимированного лоадера
          </h1>
          <p className="text-xl text-gray-600">
            Грузовик доставляет грузы и оставляет след из точек
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Маленький лоадер */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Маленький размер</h3>
            <div className="flex justify-center">
              <TruckLoader size="sm" speed="normal" />
            </div>
          </div>

          {/* Средний лоадер */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Средний размер</h3>
            <div className="flex justify-center">
              <TruckLoader size="md" speed="normal" />
            </div>
          </div>

          {/* Большой лоадер */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Большой размер</h3>
            <div className="flex justify-center">
              <TruckLoader size="lg" speed="normal" />
            </div>
          </div>

          {/* Медленная скорость */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Медленная скорость</h3>
            <div className="flex justify-center">
              <TruckLoader size="md" speed="slow" />
            </div>
          </div>

          {/* Нормальная скорость */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Нормальная скорость</h3>
            <div className="flex justify-center">
              <TruckLoader size="md" speed="normal" />
            </div>
          </div>

          {/* Быстрая скорость */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Быстрая скорость</h3>
            <div className="flex justify-center">
              <TruckLoader size="md" speed="fast" />
            </div>
          </div>
        </div>

        {/* Полный экран загрузки */}
        <div className="mt-12 bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Полный экран загрузки
          </h3>
          <LoadingScreen 
            message="Загружаем данные..." 
            size="lg" 
            speed="normal"
            className="min-h-[300px]"
          />
        </div>

        {/* Описание */}
        <div className="mt-12 bg-gradient-to-r from-custom-blue-50 to-custom-blue-100 rounded-xl p-8">
          <h3 className="text-2xl font-semibold text-custom-blue-900 mb-4">
            Особенности лоадера
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-lg font-medium text-custom-blue-800 mb-2">Анимации</h4>
              <ul className="text-custom-blue-700 space-y-1">
                <li>• Плавное движение грузовика</li>
                <li>• Подпрыгивание на неровностях</li>
                <li>• Дым из выхлопной трубы</li>
                <li>• Пыль от колес</li>
                <li>• Точки маршрута с затуханием</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-medium text-custom-blue-800 mb-2">Настройки</h4>
              <ul className="text-custom-blue-700 space-y-1">
                <li>• 3 размера: sm, md, lg</li>
                <li>• 3 скорости: slow, normal, fast</li>
                <li>• Кастомизируемые сообщения</li>
                <li>• Адаптивный дизайн</li>
                <li>• Плавные переходы</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 