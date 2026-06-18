const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Branches', href: '#branches' },
  { label: 'Trainers', href: '#trainers' },
  { label: 'FAQ', href: '#faq' },
];

const contactLinks = [
  { label: 'WhatsApp', href: 'https://wa.me/919148974009', external: true },
];

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
