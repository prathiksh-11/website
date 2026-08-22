import { useState, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { IMAGES } from './image_constant';
import {
  Sparkles,
  MapPin,
  Phone,
  Maximize2,
  X,
  Flame,
  Dumbbell,
  Music2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Zap,
  Activity,
  HeartPulse,
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';

const BELLANDUR_ADDRESS =
  '2nd & 3rd Floor, 71/1, Opp. EcoWorld South Gate, Bhoganahalli, Bellandur, Bengaluru 560103';

const PHONE_NUMBERS = [
  { display: '+91 91489 74009', raw: '919148974009' },
  { display: '+91 96063 69911', raw: '919606369911' },
  { display: '+91 96063 79911', raw: '919606379911' },
];

const SIGNATURE_CLASSES = [
  { name: 'Biggest Group Class Studio', icon: Sparkles, highlight: true },
  { name: 'Dance Fit', icon: Music2 },
  { name: 'CrossFit', icon: Dumbbell },
  { name: 'Zumba', icon: Activity },
  { name: 'Yoga', icon: HeartPulse },
  { name: 'HIIT', icon: Zap },
  { name: 'Kickboxing', icon: Flame },
];

const WHATSAPP_OFFER_URL =
  'https://wa.me/919148974009?text=' +
  encodeURIComponent(
    'Hi Game On Fitness! I saw the Bellandur announcement and want to claim the Grand Opening Offer (₹18,999/yr) before founder slots run out.'
  );

export default function BellandurComingSoon() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.08 });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsLightboxOpen(false);
    };
    if (isLightboxOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isLightboxOpen]);

  return (
    <section id="bellandur" className="relative py-16 md:py-24 overflow-hidden bg-[#f8f9fb] text-zinc-900 scroll-mt-20">
      {/* Ambient warm light & subtle orange mesh accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[480px] bg-gradient-to-b from-[#ff5000]/10 via-[#ff7a38]/5 to-transparent blur-[140px]" />
        <div className="absolute top-1/3 -left-32 w-[380px] h-[380px] rounded-full bg-[#ff5000]/8 blur-[120px]" />
        <div className="absolute bottom-10 -right-32 w-[380px] h-[380px] rounded-full bg-[#ff7a38]/8 blur-[120px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#16181f 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header & Main Punchy Intro */}
        <div
          ref={ref}
          className={`text-center max-w-4xl mx-auto mb-10 md:mb-14 reveal ${isVisible ? 'visible' : ''
            }`}
        >
          {/* Dear Bellandur Tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#ff5000]/30 shadow-[0_4px_20px_rgba(255,80,0,0.12)] mb-5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5000] opacity-75" />
              <span className="relative rounded-full h-2 w-2 bg-[#ff5000]" />
            </span>
            <span className="text-xs sm:text-sm font-extrabold uppercase tracking-[0.25em] text-[#ff5000]">
              DEAR BELLANDUR,
            </span>
          </div>

          {/* Main Hook Headline */}
          <h2 className="font-display text-3xl sm:text-5xl md:text-6xl lg:text-[3.75rem] font-black text-zinc-950 tracking-tight leading-[1.12] mb-5">
            Your “I’ll start Monday” era{' '}
            <span className="block sm:inline text-transparent bg-clip-text bg-gradient-to-r from-[#ff5000] via-[#ff6a1f] to-[#ff8c56]">
              is officially under threat. 🙂
            </span>
          </h2>

          {/* Subheading Statement */}
          <div className="space-y-1.5 text-base sm:text-xl md:text-2xl text-zinc-700 font-medium max-w-3xl mx-auto leading-snug">
            <p>
              Because <span className="font-extrabold text-zinc-950 underline decoration-[#ff5000] decoration-2 underline-offset-4">Game On Fitness Luxury Club</span> is coming.
            </p>
            <p className="text-sm sm:text-base md:text-lg text-zinc-500 font-normal">
              And we're not exactly coming quietly.
            </p>
          </div>

          {/* Quick Feature Highlights Bar */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-4xl mx-auto">
            <div className="px-4 py-2 rounded-xl bg-white border border-zinc-200/90 text-xs sm:text-sm font-bold text-zinc-800 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5000]" />
              Luxury Gym
            </div>
            <div className="px-4 py-2 rounded-xl bg-white border border-zinc-200/90 text-xs sm:text-sm font-bold text-zinc-800 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5000]" />
              Bigger Energy
            </div>
            <div className="px-4 py-2 rounded-xl bg-white border border-zinc-200/90 text-xs sm:text-sm font-bold text-zinc-800 shadow-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#ff5000]" />
              Dedicated Group Class Studio            </div>
            <div className="px-4 py-2 rounded-xl bg-[#fff4ed] border border-[#ff5000]/30 text-xs sm:text-sm font-bold text-[#ff5000] shadow-sm flex items-center gap-2">
              <Flame size={15} className="text-[#ff5000]" />
              Dance Fit · CrossFit · Zumba · Yoga · HIIT · Kickboxing
            </div>
          </div>
        </div>

        {/* Featured Elevation Banner Showcase */}
        <div className="relative mb-12 group">
          <div className="relative rounded-[1.75rem] sm:rounded-[2.25rem] overflow-hidden border border-zinc-200/90 bg-white shadow-[0_20px_50px_rgba(255,80,0,0.08),0_4px_20px_rgba(0,0,0,0.04)] p-2 sm:p-3">
            <div
              onClick={() => setIsLightboxOpen(true)}
              className="relative rounded-[1.25rem] sm:rounded-[1.75rem] overflow-hidden bg-zinc-950 cursor-pointer aspect-[16/9] w-full"
            >
              <img
                src={IMAGES.Bellandur.opening}
                alt="Game On Fitness Luxury Club Bellandur Elevation Banner"
                className="w-full h-full object-cover sm:object-contain transition-transform duration-700 group-hover:scale-[1.01]"
                loading="eager"
              />

              {/* Badges on the image */}
              <div className="absolute top-3 left-3 sm:top-5 sm:left-5 flex flex-wrap items-center gap-2 pointer-events-none">
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ff5000] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider shadow-lg">
                  <Sparkles size={12} className="fill-white" />
                  Coming Soon
                </div>
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-white/40 text-zinc-900 text-[11px] sm:text-xs font-bold shadow-md">
                  <MapPin size={13} className="text-[#ff5000]" />
                  Opp. EcoWorld South Gate
                </div>
              </div>

              {/* Expand button on image */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLightboxOpen(true);
                }}
                className="absolute bottom-3 right-3 sm:bottom-5 sm:right-5 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-full bg-white/90 hover:bg-[#ff5000] text-zinc-900 hover:text-white text-xs font-bold backdrop-blur-md border border-white/40 transition-all duration-300 shadow-xl"
              >
                <Maximize2 size={13} />
                <span>View Full Banner</span>
              </button>
            </div>
          </div>
        </div>

        {/* 3 Highlight Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-10">
          {/* Card 1: Exclusive Opening Offer */}
          <div className="relative rounded-[2rem] p-6 sm:p-7 bg-gradient-to-br from-[#fff7f2] via-white to-[#fff2e8] border-2 border-[#ff5000]/30 shadow-[0_15px_40px_rgba(255,80,0,0.12)] flex flex-col justify-between overflow-hidden">
            <div className="absolute -top-12 -right-12 w-36 h-36 bg-[#ff5000]/15 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ff5000]/15 border border-[#ff5000]/30 text-[#ff5000] text-[11px] font-black uppercase tracking-wider mb-4">
                <Sparkles size={12} />
                Exclusive Opening Offer
              </div>

              <div className="flex items-baseline gap-2 mb-1">
                <span className="font-display text-4xl sm:text-5xl font-black text-zinc-950">
                  ₹18,999
                </span>
                <span className="text-base text-zinc-400 line-through font-semibold">
                  ₹29,999
                </span>
              </div>
              <p className="text-xs font-bold text-[#ff5000] uppercase tracking-wider mb-4">
                Annual All-Access Pass · Limited Slots
              </p>

              <p className="text-xs text-zinc-600 leading-relaxed mb-6">
                Lock in Bengaluru's best pre-launch gym membership. Includes full access to group classes, functional rig, and luxury club facilities.
              </p>
            </div>

            <a
              href={WHATSAPP_OFFER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full group inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#ff5000] to-[#e04800] text-white text-xs sm:text-sm font-bold shadow-[0_10px_25px_rgba(255,80,0,0.35)] hover:shadow-[0_14px_35px_rgba(255,80,0,0.5)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <WhatsAppIcon size={18} />
              <span>Claim ₹18,999 Offer</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          {/* Card 2: Signature Group Classes & Studio */}
          <div className="relative rounded-[2rem] p-6 sm:p-7 bg-white border border-zinc-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-bold uppercase tracking-wider mb-4">
                <Activity size={12} className="text-[#ff5000]" />
                Dedicated Group Class Studio              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 mb-2">
                All-In-One Studios
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed mb-5">
                From high-tempo dance beats to intense barbell circuits and restorative yoga sessions.
              </p>

              <div className="grid grid-cols-2 gap-2 mb-6">
                {SIGNATURE_CLASSES.map(({ name, icon: Icon, highlight }) => (
                  <div
                    key={name}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold ${highlight
                      ? 'bg-[#fff4ed] border border-[#ff5000]/35 text-[#ff5000] col-span-2'
                      : 'bg-zinc-50 border border-zinc-200/70 text-zinc-800'
                      }`}
                  >
                    <Icon size={14} className="text-[#ff5000] shrink-0" />
                    <span className="truncate">{name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-zinc-500 pt-2 border-t border-zinc-100">
              <Clock size={13} className="text-[#ff5000]" />
              <span>24-7 Access for unrestricted training schedules</span>
            </div>
          </div>

          {/* Card 3: Location & Hotline Assistance */}
          <div className="relative rounded-[2rem] p-6 sm:p-7 bg-white border border-zinc-200/90 shadow-[0_10px_35px_rgba(0,0,0,0.04)] flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 text-zinc-800 text-[11px] font-bold uppercase tracking-wider mb-4">
                <MapPin size={12} className="text-[#ff5000]" />
                Prime Location
              </div>

              <h3 className="font-display text-xl sm:text-2xl font-bold text-zinc-950 mb-2">
                Opp. EcoWorld South Gate
              </h3>
              <p className="text-xs text-zinc-600 leading-relaxed mb-4">
                {BELLANDUR_ADDRESS}
              </p>

              <div className="space-y-2 mb-5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#ff5000]">
                  Founder Enquiry Hotlines:
                </p>
                <div className="flex flex-col gap-1.5">
                  {PHONE_NUMBERS.map((phone) => (
                    <a
                      key={phone.raw}
                      href={`tel:${phone.raw}`}
                      className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-zinc-50 hover:bg-[#fff4ed] hover:text-[#ff5000] text-zinc-800 border border-zinc-200/70 transition-colors"
                    >
                      <Phone size={12} className="text-[#ff5000]" />
                      <span>{phone.display}</span>
                    </a>
                  ))}
                </div>
              </div>
            </div>

            <a
              href="https://maps.app.goo.gl/JEuiCtcGDHGfoe4U8"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-xs font-bold text-zinc-800 hover:text-zinc-950 bg-zinc-100 hover:bg-zinc-200 px-4 py-2.5 rounded-xl border border-zinc-200/80 transition-all text-center"
            >
              <MapPin size={13} className="text-[#ff5000]" />
              <span>Get Directions on Google Maps</span>
            </a>
          </div>
        </div>

        {/* Punchline Banner: Your excuses have been notified. 👀 */}
        <div className="relative mb-10 overflow-hidden rounded-2xl bg-gradient-to-r from-[#fff4ed] via-white to-[#fff4ed] border border-[#ff5000]/30 p-5 sm:p-6 text-center shadow-[0_10px_30px_rgba(255,80,0,0.08)]">
          <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-4xl mx-auto">
            <div className="text-center sm:text-left">
              <p className="text-lg sm:text-xl md:text-2xl font-black text-zinc-950 tracking-tight">
                Your excuses have been notified. 👀
              </p>
              <p className="text-xs sm:text-sm text-zinc-600 mt-0.5">
                Join the VIP founder list before the launch slots fill up.
              </p>
            </div>
            <a
              href={WHATSAPP_OFFER_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff5000] hover:bg-[#e04800] text-white text-xs sm:text-sm font-bold shadow-[0_6px_20px_rgba(255,80,0,0.3)] transition-all whitespace-nowrap hover:scale-105"
            >
              <WhatsAppIcon size={16} />
              <span>Claim Launch Offer</span>
              <ArrowRight size={14} />
            </a>
          </div>
        </div>

        {/* Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-5xl mx-auto pt-4 border-t border-zinc-200/80">
          {[
            { title: '10,000+ Sq. Ft.', desc: 'High ceilings & elite machines' },
            { title: 'Certified Coaches', desc: 'Personalized guidance & diet' },
            { title: 'Biggest Dance Studio', desc: 'Sprung wood acoustic studio' },
            { title: 'Steam & Recovery', desc: 'Luxury lockers & shower zone' },
          ].map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-white border border-zinc-200/70 shadow-sm text-left">
              <ShieldCheck size={16} className="text-[#ff5000] shrink-0" />
              <div>
                <p className="text-xs font-bold text-zinc-900 leading-tight">{item.title}</p>
                <p className="text-[10px] text-zinc-500 leading-tight mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Full-Screen High-Res Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl animate-fade-in">
          <div
            className="absolute inset-0 cursor-pointer"
            onClick={() => setIsLightboxOpen(false)}
          />

          <div className="relative z-10 max-w-6xl w-full max-h-[92vh] flex flex-col rounded-3xl bg-white border border-zinc-200 shadow-[0_30px_90px_rgba(0,0,0,0.5)] overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 bg-zinc-50/80">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#ff5000] animate-pulse" />
                <h4 className="text-sm font-bold text-zinc-900">
                  Game On Fitness Luxury Club — Bellandur Elevation Banner
                </h4>
              </div>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-8 h-8 rounded-full bg-zinc-200 hover:bg-zinc-300 text-zinc-800 flex items-center justify-center transition-colors"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-auto p-4 sm:p-8 flex items-center justify-center bg-zinc-950">
              <img
                src={IMAGES.Bellandur.opening}
                alt="Game On Fitness Bellandur High Resolution Elevation"
                className="w-full h-auto max-h-[75vh] object-contain rounded-xl shadow-2xl"
              />
            </div>

            {/* Modal Footer */}
            <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-4 border-t border-zinc-100 bg-zinc-50/80">
              <p className="text-xs text-zinc-700">
                <span className="font-bold text-[#ff5000]">Limited Launch Offer:</span> Annual Membership at ₹18,999 (Regular ₹29,999)
              </p>
              <a
                href={WHATSAPP_OFFER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#ff5000] hover:bg-[#e04800] text-white text-xs font-bold transition-all shadow-lg"
              >
                <WhatsAppIcon size={16} />
                Reserve Founder Pass on WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
