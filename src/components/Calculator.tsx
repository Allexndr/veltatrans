'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

interface CalculationResult {
  cost: number;
  currency: string;
  deliveryTime: string;
  service: string;
}

export default function Calculator() {
  const t = useTranslations('calculator');
  const [formData, setFormData] = useState({
    fromCity: '',
    toCity: '',
    weight: '',
    volume: '',
    length: '',
    width: '',
    height: '',
    isOversized: false
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type, checked} = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    
    // Simulate calculation
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Mock calculation result
    const mockResult: CalculationResult = {
      cost: Math.floor(Math.random() * 50000) + 10000,
      currency: 'RUB',
      deliveryTime: '3-5 дней',
      service: 'Стандартная доставка'
    };
    
    setResult(mockResult);
    setIsCalculating(false);
  };

  const resetForm = () => {
    setFormData({
      fromCity: '',
      toCity: '',
      weight: '',
      volume: '',
      length: '',
      width: '',
      height: '',
      isOversized: false
    });
    setResult(null);
  };

  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('description')}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Cities */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fromCity" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.fromCity')} *
                </label>
                <input
                  type="text"
                  id="fromCity"
                  name="fromCity"
                  required
                  value={formData.fromCity}
                  onChange={handleChange}
                  placeholder={t('form.cityPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                />
              </div>

              <div>
                <label htmlFor="toCity" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.toCity')} *
                </label>
                <input
                  type="text"
                  id="toCity"
                  name="toCity"
                  required
                  value={formData.toCity}
                  onChange={handleChange}
                  placeholder={t('form.cityPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                />
              </div>
            </div>

            {/* Weight and Volume */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.weight')} (кг) *
                </label>
                <input
                  type="number"
                  id="weight"
                  name="weight"
                  required
                  min="0.1"
                  step="0.1"
                  value={formData.weight}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                />
              </div>

              <div>
                <label htmlFor="volume" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.volume')} (м³) *
                </label>
                <input
                  type="number"
                  id="volume"
                  name="volume"
                  required
                  min="0.001"
                  step="0.001"
                  value={formData.volume}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                />
              </div>
            </div>

            {/* Dimensions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label htmlFor="length" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.length')} (м)
                </label>
                <input
                  type="number"
                  id="length"
                  name="length"
                  min="0"
                  step="0.01"
                  value={formData.length}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                />
              </div>

              <div>
                <label htmlFor="width" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.width')} (м)
                </label>
                <input
                  type="number"
                  id="width"
                  name="width"
                  min="0"
                  step="0.01"
                  value={formData.width}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                />
              </div>

              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.height')} (м)
                </label>
                <input
                  type="number"
                  id="height"
                  name="height"
                  min="0"
                  step="0.01"
                  value={formData.height}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                />
              </div>
            </div>

            {/* Oversized Cargo */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isOversized"
                name="isOversized"
                checked={formData.isOversized}
                onChange={handleChange}
                className="h-4 w-4 text-custom-blue-600 focus:ring-custom-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isOversized" className="ml-2 block text-sm text-gray-700">
                {t('form.isOversized')}
              </label>
              <svg className="w-5 h-5 text-gray-400 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isCalculating}
                className="bg-custom-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-custom-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isCalculating ? t('form.calculating') : t('form.calculate')}
              </button>
            </div>
          </form>

          {/* Result */}
          {result && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-4">
                {t('result.title')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-sm text-green-600 mb-1">{t('result.cost')}</p>
                  <p className="text-2xl font-bold text-green-800">
                    {result.cost.toLocaleString()} {result.currency}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-600 mb-1">{t('result.deliveryTime')}</p>
                  <p className="text-lg font-semibold text-green-800">{result.deliveryTime}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-green-600 mb-1">{t('result.service')}</p>
                  <p className="text-lg font-semibold text-green-800">{result.service}</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <button
                  onClick={resetForm}
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  {t('result.calculateAgain')}
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            {t('note')}
          </p>
        </div>
      </div>
    </section>
  );
} 