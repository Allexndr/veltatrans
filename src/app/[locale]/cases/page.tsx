import { useTranslations } from 'next-intl';
import CasesGrid from '@/components/CasesGrid';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

interface CasesPageProps {
  params: {
    locale: string;
  };
}

export default function CasesPage({ params }: CasesPageProps) {
  const { locale } = params;
  const t = useTranslations('cases');

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero секция */}
      <section className="bg-velta-navy text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl font-bold mb-6">
            {t('title')}
          </h1>
          <p className="text-xl text-velta-100 max-w-3xl mx-auto">
            {t('description')}
          </p>
        </div>
      </section>

      {/* Сетка кейсов */}
      <CasesGrid locale={locale} />
      
      <Footer />
    </div>
  );
} 