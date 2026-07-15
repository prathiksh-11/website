import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import AmenityMarquee from './components/AmenityMarquee';
import StatsStrip from './components/StatsStrip';
import WhyUs from './components/WhyUs';
import About from './components/About';
import Branches from './components/Branches';
import BranchDetail from './components/BranchDetail';
import Transformations from './components/Transformations';
import FAQ from './components/FAQ';
import JoinCTA from './components/JoinCTA';
import Footer from './components/Footer';
import BackToTop from './components/BackToTop';
import AdminOffers from './components/AdminOffers';
import Maintenance from './components/Maintenance';
import { MessageCircle } from 'lucide-react';
import PromotionalOffers from './components/PromotionalOffers';

function App() {
  const isMaintenanceMode = false;
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
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleBack = () => {
    window.location.hash = '';
    setCurrentBranch(null);
    setCurrentPage('home');
  };

  if (isMaintenanceMode) {
    return <Maintenance />;
  }

  if (currentBranch && currentPage === 'branch') {
    return <BranchDetail branchId={currentBranch} onBack={handleBack} />;
  }

  if (currentPage === 'admin') {
    return <AdminOffers />;
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <Navbar />
      <Hero />
      <AmenityMarquee />
      <StatsStrip />
      <WhyUs />
      <PromotionalOffers />
      <About />
      <Branches />
      <Transformations />
      <FAQ />
      <JoinCTA />
      <Footer />
      <BackToTop />

      <a
        href="https://wa.me/919148974009"
        target="_blank"
        rel="noopener noreferrer"
        className="whatsapp-fab group/wa fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center text-white"
        aria-label="Chat on WhatsApp"
      >
        <span className="whatsapp-ping absolute inset-0 rounded-full bg-[#25D366]" />
        <MessageCircle size={28} className="relative z-10" />
        <span className="absolute right-full mr-3 px-3 py-1.5 rounded-full bg-[#16181f] text-white text-xs font-semibold whitespace-nowrap opacity-0 translate-x-2 group-hover/wa:opacity-100 group-hover/wa:translate-x-0 transition-all duration-300 pointer-events-none">
          Chat with us
        </span>
      </a>
    </div>
  );
}

export default App;
