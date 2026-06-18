const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Branches', href: '#branches' },
  { label: 'Transformations', href: '#transformations' },
  { label: 'FAQ', href: '#faq' },
];

const contactLinks = [
  { label: 'WhatsApp', href: 'https://wa.me/919148974009', external: true },
];

const APP_STORE_URL = 'https://apps.apple.com/app/id6773751865';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.gameonfitness.app';

function scrollToSection(href: string) {
  const el = document.querySelector(href);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth' });
    return;
  }
  window.location.hash = href;
}

export default function Footer() {
  return (
    <footer className="relative bg-[#030303] overflow-hidden">
      <div className="divider-glow" />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          <div className="sm:col-span-2">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="flex items-center gap-2 mb-6 text-left"
            >
              <img src="/logo.png" alt="Game On Fitness" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold tracking-widest gradient-text-blue">GAME ON FITNESS</span>
            </button>
            <p className="text-white/40 text-sm leading-relaxed max-w-xs">
              World-class fitness centers engineered for peak human performance.
              Elevate your body. Sharpen your mind. Reach GAME ON FITNESS.
            </p>

            <div className="mt-6">
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4">Download App</h4>
              <div className="flex flex-wrap gap-3">
                <a
                  href={APP_STORE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Download on the App Store"
                  className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 hover:border-white/25 hover:bg-white/10 transition-all duration-300"
                >
                  <svg viewBox="0 0 24 24" className="w-7 h-7 text-white shrink-0" fill="currentColor" aria-hidden="true">
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
                  className="inline-flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 hover:border-white/25 hover:bg-white/10 transition-all duration-300"
                >
                  <img
                    src="/play-store.png"
                    alt="Google Play"
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

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-5">Quick Links</h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="text-sm text-white/35 hover:text-white/80 transition-colors duration-300 text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-5">Contact</h4>
            <ul className="space-y-3">
              {contactLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-white/35 hover:text-white/80 transition-colors duration-300"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-white/25 text-xs text-center sm:text-left">
            © {new Date().getFullYear()} GAME ON FITNESS Performance Centers. All rights reserved.
          </p>
        </div>
      </div>

      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(0,212,255,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
    </footer>
  );
}
