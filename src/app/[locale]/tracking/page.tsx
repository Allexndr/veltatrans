import {getTranslations} from 'next-intl/server';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import TrackingSystem from '@/components/TrackingSystem';

export default async function TrackingPage({params}: {params: Promise<{locale: string}>}) {
  const t = await getTranslations();
  const {locale} = await params;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <TrackingSystem locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
