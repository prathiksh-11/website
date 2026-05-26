import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Branches from './components/Branches';
import BranchDetail from './components/BranchDetail';
import Transformations from './components/Transformations';
import FAQ from './components/FAQ';
// import Contact from './components/Contact';
import Footer from './components/Footer';
import { MessageCircle } from 'lucide-react';

function App() {
  const [currentBranch, setCurrentBranch] = useState<string | null>(null);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#branch/')) {
        const branchId = hash.replace('#branch/', '');
        setCurrentBranch(branchId);
      } else {
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
  };

  if (currentBranch) {
    return <BranchDetail branchId={currentBranch} onBack={handleBack} />;
  }

  return (
    <div className="min-h-screen bg-[#050505]" style={{ fontFamily: "'Poppins', 'Inter', sans-serif" }}>
      <Navbar />
      <Hero />
      <About />
      <Branches />
      <Transformations />
      <FAQ />
      {/* <Contact /> */}
      <Footer />

      {/* WhatsApp Floating Button - Global */}
      <a
        href="https://wa.me/919876543210"
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-[9999] w-14 h-14 rounded-full bg-[#25D366] flex items-center justify-center shadow-lg hover:scale-110 transition-transform duration-300 animate-pulse-glow"
        style={{ boxShadow: '0 4px 20px rgba(37, 211, 102, 0.4)' }}
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle size={28} className="text-white" />
      </a>
    </div>
  );
}

export default App;
