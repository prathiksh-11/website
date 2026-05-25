import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Branches from './components/Branches';
import BranchDetail from './components/BranchDetail';
import Transformations from './components/Transformations';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';

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
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
