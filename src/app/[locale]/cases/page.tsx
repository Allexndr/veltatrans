import Header from '@/components/Header';
import CasesSection from '@/components/CasesSection';
import Footer from '@/components/Footer';

export default async function CasesPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main>
        <CasesSection locale={locale} />
      </main>
      <Footer />
    </div>
  );
} 