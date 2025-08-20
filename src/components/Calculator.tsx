'use client';

import {useState} from 'react';
import {useTranslations} from 'next-intl';

interface CalculationResult {
  cost: number;
  currency: string;
  deliveryTime: string;
  service: string;
  distance?: number;
  breakdown?: {
    baseCost: number;
    weightCost: number;
    volumeCost: number;
    oversizedSurcharge: number;
    total: number;
  };
}

export default function Calculator() {
  const t = useTranslations('calculator');
  const [formData, setFormData] = useState({
    senderName: '',
    fromCity: '',
    fromCountry: '',
    toCity: '',
    toCountry: '',
    shipmentType: 'auto',
    cargoType: '',
    weight: '',
    volume: '',
    length: '',
    width: '',
    height: '',
    features: '',
    phone: '',
    isOversized: false,
    isDangerous: false
  });
  const [result, setResult] = useState<CalculationResult | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value, type, checked} = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalculating(true);
    setError('');

    // Валидация обязательных полей
    const requiredFields = [
      { field: 'senderName', name: 'Имя грузоотправителя' },
      { field: 'fromCity', name: 'Город отправления' },
      { field: 'toCity', name: 'Город назначения' },
      { field: 'weight', name: 'Вес груза' },
      { field: 'volume', name: 'Объем груза' },
      { field: 'phone', name: 'Номер телефона' }
    ];

    for (const { field, name } of requiredFields) {
      if (!formData[field as keyof typeof formData] || formData[field as keyof typeof formData] === '') {
        setError(`Поле "${name}" обязательно для заполнения`);
        setIsCalculating(false);
        return;
      }
    }

    // Валидация телефона
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phone.replace(/\s/g, ''))) {
      setError('Введите корректный номер телефона');
      setIsCalculating(false);
      return;
    }

    try {
      // Отправка данных в Bitrix24
      const bitrixData = {
        senderName: formData.senderName,
        fromCity: formData.fromCity,
        fromCountry: formData.fromCountry,
        toCity: formData.toCity,
        toCountry: formData.toCountry,
        shipmentType: formData.shipmentType,
        cargoType: formData.cargoType,
        weight: formData.weight,
        volume: formData.volume,
        length: formData.length,
        width: formData.width,
        height: formData.height,
        phone: formData.phone,
        isOversized: formData.isOversized,
        isDangerous: formData.isDangerous,
        features: formData.features,
        requestType: 'calculation',
        timestamp: new Date().toISOString()
      };

      // Отправка в Bitrix24 через их API
      if (typeof window !== 'undefined' && (window as typeof window & {b24form?: {sendData: (data: object) => void}}).b24form) {
        (window as typeof window & {b24form: {sendData: (data: object) => void}}).b24form.sendData(bitrixData);
      }

      // Отправка уведомления в Telegram канал
      try {
        await fetch('/api/telegram/notify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'calculation_request',
            data: bitrixData
          }),
        });
      } catch (error) {
        console.error('Telegram notification error:', error);
        // Не прерываем процесс, если уведомление не отправилось
      }

      // Показываем сообщение об успешной отправке
      setResult({
        cost: 0,
        currency: 'USD',
        deliveryTime: '1 час',
        service: 'Расчет стоимости',
        distance: 0
      });

      // Сброс формы через 3 секунды
      setTimeout(() => {
        resetForm();
      }, 3000);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Произошла ошибка при отправке заявки';
      setError(errorMessage);
      console.error('Submission error:', err);
    } finally {
      setIsCalculating(false);
    }
  };

  const resetForm = () => {
    setFormData({
      senderName: '',
      fromCity: '',
      fromCountry: '',
      toCity: '',
      toCountry: '',
      shipmentType: 'auto',
      cargoType: '',
      weight: '',
      volume: '',
      length: '',
      width: '',
      height: '',
      features: '',
      phone: '',
      isOversized: false,
      isDangerous: false
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
            {/* Sender and phone */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.senderName')}
                </label>
                <input
                  type="text"
                  id="senderName"
                  name="senderName"
                  value={formData.senderName}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.phone')}
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="+7 700 000 00 00"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                />
              </div>
            </div>
            {/* Cities and countries */}
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="fromCountry" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.fromCountry')}
                </label>
                <input
                  type="text"
                  id="fromCountry"
                  name="fromCountry"
                  value={formData.fromCountry}
                  onChange={handleChange}
                  placeholder={t('form.countryPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                />
              </div>
              <div>
                <label htmlFor="toCountry" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.toCountry')}
                </label>
                <input
                  type="text"
                  id="toCountry"
                  name="toCountry"
                  value={formData.toCountry}
                  onChange={handleChange}
                  placeholder={t('form.countryPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                />
              </div>
            </div>

            {/* Shipment type and cargo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="shipmentType" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.shipmentType')}
                </label>
                <select
                  id="shipmentType"
                  name="shipmentType"
                  value={formData.shipmentType}
                  onChange={handleSelectChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500 bg-white"
                  required
                >
                  <option value="auto">Автомобильные перевозки</option>
                  <option value="railway">Железнодорожные перевозки</option>
                  <option value="multimodal">Мультимодальные перевозки</option>
                  <option value="project">Проектные перевозки</option>
                </select>
              </div>
              <div>
                <label htmlFor="cargoType" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.cargoType')}
                </label>
                <input
                  type="text"
                  id="cargoType"
                  name="cargoType"
                  value={formData.cargoType}
                  onChange={handleChange}
                  placeholder={t('form.cargoPlaceholder')}
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

            {/* Oversized and features */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              <div className="space-y-4">
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
                    Негабаритный груз
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isDangerous"
                    name="isDangerous"
                    checked={formData.isDangerous}
                    onChange={handleChange}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isDangerous" className="ml-2 block text-sm text-gray-700">
                    Опасный груз
                  </label>
                </div>
              </div>
              <div>
                <label htmlFor="features" className="block text-sm font-medium text-gray-700 mb-2">
                  {t('form.features')}
                </label>
                <input
                  type="text"
                  id="features"
                  name="features"
                  value={formData.features}
                  onChange={handleChange}
                  placeholder={t('form.featuresPlaceholder')}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-blue-500 focus:border-custom-blue-500"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                disabled={isCalculating}
                className="btn-primary w-full"
              >
                {isCalculating ? t('form.calculating') : t('form.calculate')}
              </button>
            </div>
          </form>

          {/* Error */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-red-700 font-medium">{error}</p>
              </div>
            </div>
          )}

          {/* Result */}
          {result && (
            <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <div className="mb-4">
                <svg className="w-16 h-16 mx-auto text-green-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-green-800 mb-4">
                Заявка отправлена успешно!
              </h3>
              <p className="text-green-700 mb-6">
                Мы вернемся к вам с ответом в течение <strong>1 часа</strong>.<br />
                Наш менеджер свяжется с вами по указанному номеру телефона.
              </p>
              <div className="bg-white rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-600">
                  <strong>Ваш номер:</strong> {formData.phone}<br />
                  <strong>Маршрут:</strong> {formData.fromCity} → {formData.toCity}<br />
                  <strong>Тип перевозки:</strong> {formData.shipmentType === 'auto' ? 'Автомобильные' : 
                    formData.shipmentType === 'railway' ? 'Железнодорожные' :
                    formData.shipmentType === 'multimodal' ? 'Мультимодальные' : 'Проектные'}
                </p>
              </div>
              <button
                onClick={resetForm}
                className="bg-custom-blue-600 text-white px-6 py-2 rounded-lg hover:bg-custom-blue-700 transition-colors"
              >
                Сделать новый расчет
              </button>
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