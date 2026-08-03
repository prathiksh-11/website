import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, ArrowUpRight } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/', type: 'route' as const },
  { label: 'About', href: '/about', type: 'route' as const },
  { label: 'Locations', href: '/locations', type: 'route' as const },
  { label: 'Careers', href: '/careers', type: 'route' as const },
  { label: 'App', href: '/download', type: 'route' as const },
  { label: 'Contact', href: '/contact', type: 'route' as const },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hoveredLink, setHoveredLink] = useState('');
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  const handleNav = (link: (typeof navLinks)[0]) => {
    setMenuOpen(false);
    navigate(link.href);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isActive = (link: (typeof navLinks)[0]) => {
    if (link.href === '/') return location.pathname === '/';
    return location.pathname.startsWith(link.href);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'py-3' : 'py-4 md:py-5'
        }`}
      >
        <div
          className={`max-w-7xl mx-auto px-4 md:px-6 transition-all duration-700 ${
            mounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
          }`}
        >
          <div
            className={`navbar-shell flex items-center justify-between gap-4 px-3 md:px-5 py-2.5 md:py-3 rounded-[1.75rem] transition-all duration-500 ${
              scrolled
                ? 'bg-white/90 shadow-[0_16px_50px_rgba(22,24,31,0.1)] border border-white/80 backdrop-blur-xl'
                : 'bg-white/75 shadow-[0_10px_40px_rgba(22,24,31,0.06)] border border-white/90 backdrop-blur-lg'
            }`}
          >
            <button
              onClick={() => {
                navigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="flex items-center gap-2.5 group pl-1 flex-shrink-0"
            >
              <div className="relative">
                <div className="absolute -inset-1 rounded-2xl bg-[#ff5000]/20 blur-md opacity-0 group-hover:opacity-100 transition-all duration-500" />
                <img
                  src="/logo.png"
                  alt="Game On Fitness"
                  className="relative w-9 h-9 md:w-10 md:h-10 rounded-xl transition-transform duration-500 group-hover:scale-105 group-hover:rotate-[-3deg]"
                />
              </div>
              <span className="font-display text-[15px] md:text-lg font-semibold tracking-tight text-[#16181f] whitespace-nowrap">
                Game On{' '}
                <span className="italic text-[#ff5000] transition-colors duration-300 group-hover:text-[#e04800]">
                  Fitness
                </span>
              </span>
            </button>

            <div className="hidden lg:flex items-center gap-1 bg-[#f7f8fb]/80 rounded-full p-1.5 border border-[rgba(22,24,31,0.04)]">
              {navLinks.map((link, i) => {
                const active = isActive(link);
                const isHovered = hoveredLink === link.href;
                return (
                  <button
                    key={link.href}
                    onClick={() => handleNav(link)}
                    onMouseEnter={() => setHoveredLink(link.href)}
                    onMouseLeave={() => setHoveredLink('')}
                    className={`nav-link relative text-[13px] font-semibold px-3.5 py-2 rounded-full transition-all duration-300 ${
                      active ? 'text-[#e04800]' : 'text-[#3a3f4b] hover:text-[#16181f]'
                    }`}
                    style={{ transitionDelay: mounted ? `${i * 40}ms` : '0ms' }}
                  >
                    {(active || isHovered) && (
                      <span
                        className={`absolute inset-0 rounded-full transition-all duration-300 ${
                          active ? 'bg-[#fff0e8] shadow-sm' : 'bg-white shadow-sm'
                        }`}
                        style={{ animation: 'navPillIn 0.35s cubic-bezier(0.16,1,0.3,1)' }}
                      />
                    )}
                    <span className="relative z-10">{link.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="hidden md:flex items-center flex-shrink-0">
              <Link
                to="/contact"
                className="nav-cta group inline-flex items-center gap-1.5 text-sm font-semibold px-5 py-2.5 rounded-full text-white"
              >
                Find Your Game On
                <ArrowUpRight
                  size={15}
                  className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </div>

            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="lg:hidden relative w-11 h-11 rounded-full bg-[#f7f8fb] border border-[rgba(22,24,31,0.08)] flex items-center justify-center text-[#16181f] hover:bg-[#fff0e8] hover:text-[#ff5000] transition-all duration-300 active:scale-95"
              aria-label="Toggle menu"
            >
              <span
                className={`absolute transition-all duration-300 ${
                  menuOpen ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
                }`}
              >
                <Menu size={20} />
              </span>
              <span
                className={`absolute transition-all duration-300 ${
                  menuOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
                }`}
              >
                <X size={20} />
              </span>
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-40 lg:hidden transition-all duration-500 ${
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 bg-[#16181f]/40 backdrop-blur-md transition-opacity duration-500 ${
            menuOpen ? 'opacity-100' : 'opacity-0'
          }`}
          onClick={() => setMenuOpen(false)}
        />
        <div
          className={`absolute top-20 right-4 left-4 max-w-sm ml-auto rounded-[1.75rem] bg-white/95 backdrop-blur-2xl border border-white shadow-[0_30px_80px_rgba(22,24,31,0.18)] p-6 transition-all duration-500 ${
            menuOpen
              ? 'opacity-100 translate-y-0 scale-100'
              : 'opacity-0 -translate-y-4 scale-95'
          }`}
        >
          <p className="font-display italic text-[#ff5000] text-sm mb-4">Navigate</p>
          <div className="space-y-1.5">
            {navLinks.map((link, i) => (
              <button
                key={link.href}
                onClick={() => handleNav(link)}
                className={`mobile-nav-item flex w-full items-center justify-between text-left px-4 py-3.5 rounded-2xl text-lg font-display font-semibold transition-all duration-300 ${
                  isActive(link)
                    ? 'bg-[#fff0e8] text-[#e04800]'
                    : 'text-[#16181f] hover:bg-[#f7f8fb]'
                }`}
                style={{
                  transitionDelay: menuOpen ? `${i * 50 + 80}ms` : '0ms',
                  opacity: menuOpen ? 1 : 0,
                  transform: menuOpen ? 'translateX(0)' : 'translateX(16px)',
                }}
              >
                {link.label}
                <ArrowUpRight
                  size={16}
                  className={isActive(link) ? 'text-[#ff5000]' : 'text-[#c4c8d0]'}
                />
              </button>
            ))}
          </div>
          <Link
            to="/contact"
            onClick={() => setMenuOpen(false)}
            className="nav-cta w-full mt-5 font-semibold py-3.5 rounded-full text-sm text-white inline-flex items-center justify-center gap-2"
          >
            Find Your Game On
            <ArrowUpRight size={15} />
          </Link>
        </div>
      </div>
    </>
  );
}
