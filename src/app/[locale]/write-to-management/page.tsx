import Header from '@/components/Header';
import WriteToManagement from '@/components/WriteToManagement';
import Footer from '@/components/Footer';

export default function WriteToManagementPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      {/* Отступ для фиксированного header */}
      <main>
        <WriteToManagement />
      </main>
      <Footer />
    </div>
  );
} 