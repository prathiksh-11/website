import { ArrowRight } from 'lucide-react';

const footerLinks = {
  Company: ['About GAME ON FITNESS', 'Our Story', 'Careers', 'Press', 'Investors'],
  Programs: ['Personal Training', 'Group Classes', 'Online Coaching', 'Nutrition Plans', 'Recovery'],
  Locations: ['New York', 'Los Angeles', 'Chicago', 'Miami', 'Seattle', 'Austin'],
  Support: ['FAQ', 'Contact Us', 'Member Portal', 'App Download', 'Privacy Policy'],
};

export default function Footer() {
  return (
    <footer className="relative bg-[#030303] overflow-hidden">
      {/* Top divider */}
      <div className="divider-glow" />

      {/* Newsletter strip */}
      <div className="border-b border-white/5 py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl md:text-2xl font-black text-white mb-1">
              Join 50,000+ members in our <span className="gradient-text-blue">newsletter</span>
            </h3>
            <p className="text-white/40 text-sm">Weekly training tips, nutrition science, and exclusive offers.</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="input-premium rounded-xl px-4 py-3 text-sm flex-1 md:w-64"
            />
            <button className="btn-glow-blue text-black font-bold px-6 py-3 rounded-xl text-sm flex items-center gap-2">
              Subscribe
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-2 mb-6">
              <img src="/logo.png" alt="Game On Fitness" className="w-8 h-8 rounded-lg" />
              <span className="text-xl font-bold tracking-widest gradient-text-blue">GAME ON FITNESS</span>
            </div>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              World-class fitness centers engineered for peak human performance.
              Elevate your body. Sharpen your mind. Reach GAME ON FITNESS.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#ff6b35] animate-pulse" />
              <span className="text-xs text-[#ff6b35]">12 locations open now</span>
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-5">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <button className="text-sm text-white/35 hover:text-white/80 transition-colors duration-300 text-left">
                      {link}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/25 text-xs">
            © 2024 GAME ON FITNESS Performance Centers. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {['Terms', 'Privacy', 'Cookies', 'Accessibility'].map((item) => (
              <button key={item} className="text-xs text-white/25 hover:text-white/60 transition-colors duration-300">
                {item}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Background glow */}
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
