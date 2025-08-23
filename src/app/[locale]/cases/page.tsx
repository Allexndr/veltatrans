import Header from '@/components/Header';
import CasesSection from '@/components/CasesSection';
import Footer from '@/components/Footer';

export default async function CasesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Отступ для фиксированного header */}
      <div className="h-16 lg:h-20"></div>
      <main>
        <CasesSection />
      </main>
      <Footer />
    </div>
  );
} 