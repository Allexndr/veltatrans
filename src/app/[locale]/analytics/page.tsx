import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import AnalyticsDashboard from '@/components/AnalyticsDashboard';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'analytics' });
  
  return {
    title: t('title'),
    description: t('description'),
  };
}

export default async function AnalyticsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              📊 Аналитика и метрики
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Комплексный анализ работы логистической системы, статистика заказов, 
              производительность водителей и системные метрики
            </p>
          </div>
        </div>
      </div>

      {/* Dashboard */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
