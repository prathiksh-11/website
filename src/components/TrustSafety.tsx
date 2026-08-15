import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Shield, Camera, UserCheck, Car, Sparkles } from 'lucide-react';

const safetyPoints = [
  {
    icon: Camera,
    title: 'CCTV Monitored',
    text: 'Every corner watched — train with complete peace of mind.',
    tint: 'from-[#fff0e8] to-white',
    iconBg: 'bg-[#fff0e8] text-[#ff5000]',
  },
  {
    icon: UserCheck,
    title: 'Female Trainers',
    text: 'Certified female coaches available at select branches.',
    tint: 'from-white to-[#fff8f5]',
    iconBg: 'bg-gradient-to-br from-[#ff5000] to-[#e04800] text-white',
  },
  {
    icon: Car,
    title: 'Secure Parking',
    text: 'Safe, dedicated parking so your focus stays on the workout.',
    tint: 'from-[#f7f8fb] to-white',
    iconBg: 'bg-[#fff0e8] text-[#ff5000]',
  },
  {
    icon: Sparkles,
    title: 'Premium Hygiene',
    text: 'Spotless floors, sanitised equipment, and a premium feel.',
    tint: 'from-white to-[#fff0e8]',
    iconBg: 'bg-gradient-to-br from-[#ff5000] to-[#e04800] text-white',
  },
];

export default function TrustSafety() {
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: gridRef, isVisible: gridVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.12,
  });

  return (
    <section id="trust-safety" className="relative py-24 md:py-32 overflow-hidden atmosphere scroll-mt-28">
      {/* Soft light ambience */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -top-20 right-0 w-[480px] h-[480px] rounded-full opacity-70 blur-[90px]"
          style={{ background: 'radial-gradient(circle, rgba(255,80,0,0.12) 0%, transparent 70%)' }}
        />
        <div
          className="absolute bottom-0 left-0 w-[360px] h-[360px] rounded-full opacity-60 blur-[80px]"
          style={{ background: 'radial-gradient(circle, rgba(200,212,228,0.4) 0%, transparent 70%)' }}
        />
        <div className="absolute top-1/2 left-[12%] -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-[#ff5000]/10 hidden lg:block" />
        <div className="absolute top-1/2 left-[12%] -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-dashed border-[#ff5000]/15 app-ring-spin hidden lg:block" />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-12 lg:gap-16 items-center">
          {/* Left — headline + image */}
          <div ref={headRef} className={`reveal ${headVisible ? 'visible' : ''}`}>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#ff5000]/15 shadow-sm mb-6">
              <Shield size={14} className="text-[#ff5000]" />
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
                Trust &amp; Safety
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl xl:text-6xl font-bold text-[#16181f] tracking-tight leading-[1.05] mb-5">
              Your safety is our{' '}
              <span className="italic text-[#ff5000]">priority.</span>
            </h2>
            <p className="text-[#6f7685] text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Walk into every Game On club knowing you&apos;re in a space built for comfort,
              security, and premium care.
            </p>

            {/* Trust tags */}
            <div className="flex flex-wrap gap-2.5 mb-10">
              {['Monitored 24/7', 'Women-friendly', 'Sanitised daily'].map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#ff5000]/12 text-xs font-semibold text-[#3a3f4b] shadow-[0_6px_20px_rgba(255,80,0,0.06)]"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ff5000]" />
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Right — feature cards */}
          <div
            ref={gridRef}
            className={`grid sm:grid-cols-2 gap-4 reveal ${gridVisible ? 'visible' : ''}`}
          >
            {safetyPoints.map((point, i) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className={`group relative rounded-[1.75rem] bg-gradient-to-br ${point.tint} border border-[rgba(22,24,31,0.06)] p-6 shadow-[0_16px_40px_rgba(22,24,31,0.05)] hover:border-[#ff5000]/25 hover:shadow-[0_24px_55px_rgba(255,80,0,0.12)] hover:-translate-y-1.5 transition-all duration-500`}
                  style={{ transitionDelay: `${i * 90}ms` }}
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${point.iconBg} flex items-center justify-center mb-5 shadow-sm transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-3deg]`}
                  >
                    <Icon size={22} />
                  </div>

                  <p className="font-display text-lg md:text-xl font-bold text-[#16181f] mb-2 group-hover:text-[#ff5000] transition-colors duration-300">
                    {point.title}
                  </p>
                  <p className="text-[#6f7685] text-sm leading-relaxed">{point.text}</p>

                  <div className="mt-5 flex items-center gap-1.5 text-[#ff5000] text-xs font-bold uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span>✓</span>
                    <span>Included</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
