import Header from '@/components/Header';
import DocumentsSection from '@/components/DocumentsSection';
import Footer from '@/components/Footer';

export default async function DocumentsPage({params}: {params: Promise<{locale: string}>}) {
  const {locale} = await params;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Отступ для фиксированного header */}
      <main>
        <DocumentsSection locale={locale} />
      </main>
      <Footer />
    </div>
  );
}
