import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Branches', href: '#branches' },
  { label: 'Trainers', href: '#trainers' },
  { label: 'FAQ', href: '#faq' },
  // { label: 'Contact', href: '#contact' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNav = (href: string) => {
    setActiveLink(href);
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
            ? 'py-3 glass border-b border-white/5'
            : 'py-6 bg-transparent'
          }`}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2 group"
          >
            <img src="/logo.png" alt="Game On Fitness" className="w-8 h-8 rounded-lg" />
            <span className="text-xl font-bold tracking-widest gradient-text-blue">GAME ON FITNESS</span>
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className={`text-sm font-medium tracking-wide transition-all duration-300 relative group ${activeLink === link.href
                    ? 'text-[#ff6b35]'
                    : 'text-white/60 hover:text-white'
                  }`}
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#ff6b35] transition-all duration-300 group-hover:w-full" />
              </button>
            ))}
          </div>

          {/* CTA */}
          {/* <div className="hidden md:flex items-center gap-3">
            <button className="text-sm font-medium text-white/60 hover:text-white transition-colors duration-300 px-4 py-2">
              Sign In
            </button>
            <button
              onClick={() => handleNav('#contact')}
              className="btn-glow-blue text-black text-sm font-bold px-6 py-2.5 rounded-full tracking-wide"
            >
              Join Now
            </button>
          </div> */}

          {/* Mobile Menu Toggle */}
          {/* <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white/80 hover:text-white transition-colors p-1"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button> */}
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 md:hidden transition-all duration-500 ${menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
          }`}
      >
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-xl"
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-0 right-0 w-72 h-full glass-strong flex flex-col pt-24 px-8 pb-8 transition-transform duration-500 ${menuOpen ? 'translate-x-0' : 'translate-x-full'
            }`}
        >
          <div className="space-y-1">
            {navLinks.map((link, i) => (
              <button
                key={link.href}
                onClick={() => handleNav(link.href)}
                className="block w-full text-left py-4 text-lg font-medium text-white/70 hover:text-white border-b border-white/5 transition-all duration-300 hover:pl-2"
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                {link.label}
              </button>
            ))}
          </div>
          <div className="mt-8 space-y-3">
            <button className="w-full py-3 text-center text-white/60 hover:text-white transition-colors text-sm font-medium">
              Sign In
            </button>
            <button
              onClick={() => handleNav('#contact')}
              className="w-full btn-glow-blue text-black font-bold py-3 rounded-full text-sm tracking-wide"
            >
              Join Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
