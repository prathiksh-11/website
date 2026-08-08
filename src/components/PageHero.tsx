import type { ReactNode } from 'react';

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  description: string;
  image: string;
  imagePosition?: string;
  actions?: ReactNode;
  /** Phone-framed app screenshot instead of a full-bleed photo */
  variant?: 'image' | 'app';
};

export default function PageHero({
  eyebrow,
  title,
  description,
  image,
  imagePosition = 'center center',
  actions,
  variant = 'image',
}: PageHeroProps) {
  const isApp = variant === 'app';

  if (isApp) {
    return (
      <section className="relative overflow-hidden bg-[#f7f8fb] min-h-[100svh] md:min-h-[92vh] flex items-center">
        <div className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-20 left-[-10%] w-[55%] h-[70%] rounded-full opacity-80 app-glow-breath"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,80,0,0.14) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute top-[20%] right-[-5%] w-[45%] h-[60%] rounded-full app-glow-breath"
            style={{
              background: 'radial-gradient(ellipse, rgba(255,176,137,0.22) 0%, transparent 68%)',
              animationDelay: '1.2s',
            }}
          />
          <div
            className="absolute inset-0 opacity-[0.03]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(22,24,31,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(22,24,31,0.8) 1px, transparent 1px)',
              backgroundSize: '64px 64px',
            }}
          />
        </div>

        <div className="relative w-full max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 pt-32 pb-16 md:pt-36 md:pb-24 grid lg:grid-cols-2 gap-10 lg:gap-8 items-center">
          {/* Copy — staggered aggressive reveals */}
          <div className="order-2 lg:order-1 max-w-xl mx-auto lg:mx-0 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(22,24,31,0.06)] shadow-sm mb-6 app-hero-reveal"
              style={{ animationDelay: '0.05s' }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5000] animate-soft-pulse" />
              <span className="text-[11px] font-semibold tracking-[0.28em] uppercase text-[#ff5000]">
                {eyebrow}
              </span>
            </div>

            <h1
              className="font-display font-bold tracking-tight leading-[1.08] text-[#16181f] text-[clamp(2.1rem,5vw,3.6rem)] mb-5 app-hero-reveal"
              style={{ animationDelay: '0.18s' }}
            >
              {title}
            </h1>

            <p
              className="text-[15px] sm:text-base md:text-lg text-[#6f7685] leading-relaxed mb-8 max-w-md mx-auto lg:mx-0 app-hero-reveal"
              style={{ animationDelay: '0.32s' }}
            >
              {description}
            </p>

            {actions && (
              <div
                className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center justify-center lg:justify-start gap-3 mb-8 app-hero-reveal"
                style={{ animationDelay: '0.45s' }}
              >
                {actions}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2">
              {['Book sessions', 'Track progress', 'Stay connected'].map((chip, i) => (
                <span
                  key={chip}
                  className="app-chip-in px-3.5 py-1.5 rounded-full bg-white border border-[rgba(22,24,31,0.06)] text-xs font-semibold text-[#3a3f4b] shadow-[0_6px_18px_rgba(22,24,31,0.04)] hover:-translate-y-0.5 hover:border-[#ff5000]/30 transition-all duration-300"
                  style={{ animationDelay: `${0.6 + i * 0.1}s` }}
                >
                  {chip}
                </span>
              ))}
            </div>
          </div>

          {/* Phone stage — orbit + float + shine */}
          <div className="order-1 lg:order-2 relative flex items-center justify-center min-h-[460px] sm:min-h-[540px] py-4 app-phone-stage">
            <div className="absolute w-[340px] h-[340px] md:w-[420px] md:h-[420px] rounded-full border border-dashed border-[#ff5000]/25 app-ring-spin" />
            <div className="absolute w-[280px] h-[280px] md:w-[340px] md:h-[340px] rounded-full border border-[#ff5000]/15 app-ring-spin-rev" />
            <div className="absolute w-[220px] h-[220px] md:w-[280px] md:h-[280px] rounded-full border border-[#ff5000]/20 app-ring-pulse" />
            <div
              className="absolute w-[300px] h-[300px] md:w-[380px] md:h-[380px] rounded-full app-glow-breath"
              style={{
                background: 'radial-gradient(circle, rgba(255,80,0,0.28) 0%, transparent 68%)',
                filter: 'blur(22px)',
              }}
            />

            <div className="relative z-10 app-phone-float">
              <div className="relative w-[min(240px,52vw)] sm:w-[270px] md:w-[290px]">
                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-8 rounded-full bg-[#16181f]/15 blur-xl" />

                <div className="relative rounded-[2.25rem] border-[7px] border-[#16181f] bg-[#16181f] shadow-[0_40px_80px_rgba(22,24,31,0.28)] overflow-hidden aspect-[503/1024] hover:scale-[1.03] transition-transform duration-500">
                  <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 rounded-full bg-[#0a0a0b] z-20" />
                  <img
                    src={image}
                    alt="Game On Fitness app"
                    className="block w-full h-full object-contain object-top bg-[#0a0a0b]"
                    loading="eager"
                  />
                  <div className="app-shine" />
                  <div className="absolute inset-x-0 bottom-3 z-20 flex justify-center pointer-events-none">
                    <span className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-[10px] font-semibold tracking-wide text-white/90">
                      Live in the app
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="absolute left-1 sm:left-6 top-20 sm:top-28 z-20 hidden sm:block app-badge-in"
              style={{ animationDelay: '0.85s' }}
            >
              <div className="px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur border border-white shadow-[0_12px_30px_rgba(22,24,31,0.1)] text-xs font-semibold text-[#16181f]">
                <span className="text-[#ff5000]">●</span> Subscription Active
              </div>
            </div>
            <div
              className="absolute right-1 sm:right-4 bottom-16 sm:bottom-24 z-20 hidden sm:block app-badge-in"
              style={{ animationDelay: '1.05s' }}
            >
              <div className="px-3.5 py-2 rounded-2xl bg-[#16181f] text-white shadow-[0_12px_30px_rgba(22,24,31,0.2)] text-xs font-semibold">
                Today&apos;s Plan ✓
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden gym-surface">
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            'radial-gradient(ellipse 55% 70% at 12% 40%, rgba(255,241,224,0.9), transparent 60%), radial-gradient(ellipse 40% 50% at 35% 80%, rgba(228,236,246,0.55), transparent 55%)',
        }}
      />

      <div className="relative grid md:grid-cols-2 min-h-[100svh] md:min-h-[88vh]">
        <div className="relative order-1 md:order-2 h-[48vh] min-h-[300px] sm:h-[52vh] md:h-auto md:min-h-full">
          <img
            src={image}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: imagePosition }}
            loading="eager"
          />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f7f8fb] to-transparent md:hidden" />
          <div className="absolute inset-y-0 left-0 w-16 lg:w-28 bg-gradient-to-r from-[#f7f8fb] to-transparent hidden md:block" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ff5000]/10 via-transparent to-transparent pointer-events-none" />
        </div>

        <div className="relative order-2 md:order-1 flex items-center px-5 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-12 md:py-28">
          <div className="w-full max-w-lg mx-auto md:mx-0 md:max-w-xl">
            <div className="section-ornament mb-4 sm:mb-5">
              <span className="text-[11px] sm:text-xs font-semibold tracking-[0.3em] uppercase text-[#ff5000]">
                {eyebrow}
              </span>
            </div>

            <h1 className="font-display font-bold tracking-tight leading-[1.1] text-[#16181f] text-[clamp(1.85rem,5vw,3.4rem)] mb-4 sm:mb-5">
              {title}
            </h1>

            <div className="h-[2px] w-14 sm:w-20 mb-4 sm:mb-5 rounded-full bg-gradient-to-r from-[#ff5000] via-[#ffb089] to-transparent" />

            <p className="text-[15px] sm:text-base md:text-lg text-[#6f7685] leading-relaxed mb-7 sm:mb-8 max-w-md">
              {description}
            </p>

            {actions && (
              <div className="flex flex-col xs:flex-row sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
                {actions}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
