'use client';

import {useTranslations} from 'next-intl';
import {useState} from 'react';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';
import {z} from 'zod';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const calculatorSchema = z.object({
  from: z.string().min(1, 'From location is required'),
  to: z.string().min(1, 'To location is required'),
  weight: z.number().min(1, 'Weight must be greater than 0'),
  volume: z.number().min(0, 'Volume must be 0 or greater'),
  cargoType: z.string().min(1, 'Cargo type is required'),
});

type CalculatorFormData = z.infer<typeof calculatorSchema>;

export default function CalculatorPage() {
  const t = useTranslations();
  const [isCalculating, setIsCalculating] = useState(false);
  const [result, setResult] = useState<{price: number; currency: string; details: string[]} | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CalculatorFormData>({
    resolver: zodResolver(calculatorSchema),
  });

  const onSubmit = async (data: CalculatorFormData) => {
    setIsCalculating(true);
    setResult(null);

    // Simulate calculation
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mock calculation logic
    const basePrice = data.weight * 2.5; // $2.5 per kg
    const volumePrice = data.volume * 50; // $50 per m³
    const totalPrice = Math.max(basePrice, volumePrice);

    setResult({
      price: Math.round(totalPrice),
      currency: 'USD',
      details: [
        `Вес: ${data.weight} кг`,
        `Объем: ${data.volume} м³`,
        `Маршрут: ${data.from} → ${data.to}`,
        `Тип груза: ${data.cargoType}`,
      ]
    });

    setIsCalculating(false);
  };

  const popularRoutes = [
    { from: 'Москва', to: 'Пекин', days: '12-15 дней' },
    { from: 'Алматы', to: 'Шанхай', days: '10-12 дней' },
    { from: 'Ташкент', to: 'Гуанчжоу', days: '14-18 дней' },
    { from: 'Бишкек', to: 'Урумчи', days: '3-5 дней' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-custom-blue-900 via-custom-blue-800 to-custom-blue-700 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {t('calculator.title')}
              </h1>
              <p className="text-xl text-custom-blue-100 max-w-3xl mx-auto">
                {t('calculator.description')}
              </p>
            </div>
          </div>
        </section>

        {/* Calculator Form */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-white rounded-lg shadow-lg p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="from" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('calculator.from')}
                    </label>
                    <input
                      {...register('from')}
                      type="text"
                      id="from"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-transparent"
                      placeholder="Город отправления"
                    />
                    {errors.from && (
                      <p className="mt-1 text-sm text-red-600">{errors.from.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="to" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('calculator.to')}
                    </label>
                    <input
                      {...register('to')}
                      type="text"
                      id="to"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-transparent"
                      placeholder="Город назначения"
                    />
                    {errors.to && (
                      <p className="mt-1 text-sm text-red-600">{errors.to.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('calculator.weight')}
                    </label>
                    <input
                      {...register('weight', { valueAsNumber: true })}
                      type="number"
                      id="weight"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-transparent"
                      placeholder="Вес в килограммах"
                    />
                    {errors.weight && (
                      <p className="mt-1 text-sm text-red-600">{errors.weight.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-2">
                      {t('calculator.volume')}
                    </label>
                    <input
                      {...register('volume', { valueAsNumber: true })}
                      type="number"
                      step="0.01"
                      id="volume"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-transparent"
                      placeholder="Объем в кубических метрах"
                    />
                    {errors.volume && (
                      <p className="mt-1 text-sm text-red-600">{errors.volume.message}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label htmlFor="cargoType" className="block text-sm font-medium text-gray-700 mb-2">
                      Тип груза
                    </label>
                    <select
                      {...register('cargoType')}
                      id="cargoType"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-transparent"
                    >
                      <option value="">Выберите тип груза</option>
                      <option value="general">Генеральный груз</option>
                      <option value="fragile">Хрупкий груз</option>
                      <option value="liquid">Жидкий груз</option>
                      <option value="bulk">Насыпной груз</option>
                      <option value="dangerous">Опасный груз</option>
                    </select>
                    {errors.cargoType && (
                      <p className="mt-1 text-sm text-red-600">{errors.cargoType.message}</p>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isCalculating}
                  className="w-full bg-custom-blue-600 text-white px-6 py-4 rounded-lg font-semibold text-lg hover:bg-custom-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isCalculating ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Расчет...
                    </div>
                  ) : (
                    t('calculator.calculate')
                  )}
                </button>
              </form>

              {/* Result */}
              {result && (
                <div className="mt-8 p-6 bg-green-50 border border-green-200 rounded-lg">
                  <h3 className="text-lg font-semibold text-green-800 mb-4">{t('calculator.result')}</h3>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-2xl font-bold text-green-900">
                      ${result.price} {result.currency}
                    </span>
                    <span className="text-sm text-green-700">Ориентировочная стоимость</span>
                  </div>
                  <div className="space-y-2">
                    {result.details.map((detail, index) => (
                      <p key={index} className="text-green-700">{detail}</p>
                    ))}
                  </div>
                  <p className="text-sm text-green-600 mt-4">
                    * Окончательная стоимость может варьироваться в зависимости от дополнительных условий
                  </p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Popular Routes */}
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Популярные направления
              </h2>
              <p className="text-lg text-gray-600">
                Наиболее востребованные маршруты наших клиентов
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {popularRoutes.map((route, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-between mb-4">
                    <svg className="w-8 h-8 text-custom-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-sm text-gray-500">{route.days}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2">{route.from}</h3>
                  <div className="flex items-center text-gray-600">
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    {route.to}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
