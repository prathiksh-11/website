import { Link } from 'react-router-dom';
import { Instagram, Facebook, Youtube, ArrowUpRight } from 'lucide-react';

const exploreLinks = [
  { label: 'Home', to: '/' },
  { label: 'Find Your Game On', to: '/#branches' },
  { label: 'About', to: '/about' },
  { label: 'Careers', to: '/careers' },
  { label: 'Download App', to: '/download' },
  { label: 'Contact', to: '/contact' },
];

const locations = [
  { id: 'arekere', name: 'Arekere' },
  { id: 'vijaya-bank-layout', name: 'Vijaya Bank Layout' },
  { id: 'btm-layout-1', name: 'BTM 1st Stage' },
  { id: 'btm-layout-2', name: 'BTM 2nd Stage' },
  { id: 'wilson-garden', name: 'Wilson Garden' },
  { id: 'vijayanagar', name: 'Vijayanagar' },
  { id: 'akshayanagar', name: 'Akshayanagar' },
  { id: 'sarjapur-road', name: 'Sarjapur Road' },
  { id: 'kasavanahalli', name: 'Kasavanahalli' },
];

const APP_STORE_URL = 'https://apps.apple.com/app/id6773751865';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.gameonfitness.app';

export default function Footer() {
  return (
    <footer className="relative bg-[#16181f] overflow-hidden text-white">
      <div
        className="absolute -top-24 left-1/2 -translate-x-1/2 w-[520px] h-[220px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(224,122,114,0.22) 0%, transparent 70%)',
          filter: 'blur(20px)',
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6 pt-16 pb-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-12 border-b border-white/10">
          <div className="max-w-lg">
            <Link to="/" className="flex items-center gap-2.5 mb-5 text-left group">
              <img
                src="/logo.png"
                alt="Game On Fitness"
                className="w-10 h-10 rounded-xl transition-transform duration-300 group-hover:scale-105"
              />
              <span className="font-display text-xl font-semibold tracking-tight">
                Game On <span className="italic text-[#e07a72]">Fitness</span>
              </span>
            </Link>
            <p className="text-white/50 text-sm md:text-base leading-relaxed">
              Every transformation begins with one decision.
            </p>
          </div>

          <Link
            to="/contact"
            className="inline-flex items-center gap-2 self-start lg:self-auto px-6 py-3.5 rounded-full bg-gradient-to-r from-[#e07a72] to-[#c45f58] text-sm font-semibold text-white shadow-[0_12px_30px_rgba(224,122,114,0.3)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Find Your Game On
            <ArrowUpRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 pt-12">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">
              Explore
            </h4>
            <ul className="space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to === '/#branches' ? '/' : link.to}
                    onClick={() => {
                      if (link.to === '/#branches') {
                        setTimeout(() => {
                          document.querySelector('#branches')?.scrollIntoView({
                            behavior: 'smooth',
                          });
                        }, 80);
                      }
                    }}
                    className="text-sm text-white/50 hover:text-[#f2b4ae] transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  to="/privacy"
                  className="text-sm text-white/50 hover:text-[#f2b4ae] transition-colors duration-300"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/account-deletion"
                  className="text-sm text-white/50 hover:text-[#f2b4ae] transition-colors duration-300"
                >
                  Account Deletion
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">
              Locations
            </h4>
            <ul className="space-y-3">
              {locations.map((branch) => (
                <li key={branch.id}>
                  <a
                    href={`/#branch/${branch.id}`}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-sm text-white/50 hover:text-[#f2b4ae] transition-colors duration-300"
                  >
                    {branch.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-5">
              Follow Us
            </h4>
            <div className="flex gap-3 mb-5">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#e07a72] hover:text-white hover:border-transparent transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#e07a72] hover:text-white hover:border-transparent transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:bg-[#e07a72] hover:text-white hover:border-transparent transition-all duration-300"
                aria-label="YouTube"
              >
                <Youtube size={18} />
              </a>
            </div>
            <p className="text-xs text-white/35 leading-relaxed">
              Become part of a community that&apos;s getting stronger every day.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-4">
              Download App
            </h4>
            <div className="flex flex-col gap-3">
              <a
                href={APP_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Download on the App Store"
                className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:border-[#e07a72]/40 hover:bg-white/10 transition-all duration-300"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="w-7 h-7 text-white shrink-0"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M16.365 1.43c0 1.14-.42 2.28-1.26 3.17-.9.96-2.37 1.7-3.78 1.6-.14-1.09.45-2.24 1.2-3.03.9-.98 2.46-1.68 3.84-1.74ZM20.88 17.13c-.57 1.31-.85 1.9-1.59 3.06-1.03 1.58-2.48 3.55-4.28 3.57-1.6.02-2.01-1.04-4.18-1.03-2.17.01-2.63 1.05-4.23 1.03-1.8-.02-3.18-1.8-4.21-3.38-2.88-4.4-3.18-9.56-1.4-12.3 1.26-1.92 3.26-3.04 5.13-3.04 1.91 0 3.11 1.04 4.69 1.04 1.52 0 2.44-1.04 4.62-1.04 1.65 0 3.4.9 4.66 2.45-4.1 2.23-3.44 8.05.79 9.64Z" />
                </svg>
                <span className="text-left leading-tight">
                  <span className="block text-[10px] text-white/50">Download on the</span>
                  <span className="block text-sm font-semibold text-white">App Store</span>
                </span>
              </a>
              <a
                href={PLAY_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Get it on Google Play"
                className="inline-flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 hover:border-[#e07a72]/40 hover:bg-white/10 transition-all duration-300"
              >
                <img
                  src="/play-store.png"
                  alt=""
                  className="w-8 h-8 shrink-0 object-contain"
                />
                <span className="text-left leading-tight">
                  <span className="block text-[10px] text-white/50">Get it on</span>
                  <span className="block text-sm font-semibold text-white">Google Play</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/8">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} Game On Fitness. All Rights Reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              to="/privacy"
              className="text-white/35 text-xs hover:text-[#f2b4ae] transition-colors duration-300"
            >
              Privacy
            </Link>
            <Link
              to="/account-deletion"
              className="text-white/35 text-xs hover:text-[#f2b4ae] transition-colors duration-300"
            >
              Delete Account
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
