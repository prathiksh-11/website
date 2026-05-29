import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Branches from './components/Branches';
import BranchDetail from './components/BranchDetail';
import Transformations from './components/Transformations';
import FAQ from './components/FAQ';
import Footer from './components/Footer';
import AdminOffers from './components/AdminOffers';
import { MessageCircle } from 'lucide-react';
import OffersPage from './components/PromotionalOffers';
import PromotionalOffers from './components/PromotionalOffers';

function App() {
  const [currentBranch, setCurrentBranch] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<
    'home' | 'branch' | 'admin' | 'offers'
  >('home');

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;

      if (hash.startsWith('#branch/')) {
        const branchId = hash.replace('#branch/', '');
        setCurrentBranch(branchId);
        setCurrentPage('branch');
      } else if (hash === '#admin') {
        setCurrentPage('admin');
        setCurrentBranch(null);
      } else {
        setCurrentPage('home');
        setCurrentBranch(null);
      }
    };

    handleHashChange();

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleBack = () => {
    window.location.hash = '';
    setCurrentBranch(null);
    setCurrentPage('home');
  };

  if (currentBranch && currentPage === 'branch') {
    return (
      <BranchDetail
        branchId={currentBranch}
        onBack={handleBack}
      />
    );
  }

  if (currentPage === 'admin') {
    return <AdminOffers />;
  }

  return (
    <div
      className="min-h-screen bg-[#050505]"
      style={{
        fontFamily: "'Poppins', 'Inter', sans-serif",
      }}
    >
      <Navbar />
      {/* Promotional Offers Carousel - Placed directly below the Navbar */}
      <PromotionalOffers /> {/* Moved here as requested: below header, above Hero */}

      <Hero />

      <About />

      <Branches />

      <Transformations />

      <FAQ />

      {/* Offers Preview Section */}
      <PromotionalOffers />

      <Footer />

      {/* WhatsApp Button */}
      <a
        href="https://wa.me/919148974009"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300"
        style={{
          boxShadow: '0 4px 20px rgba(37,211,102,0.4)',
        }}
      >
        <MessageCircle
          size={28}
          className="text-white"
        />
      </a>
    </div>
  );
}

export default App;