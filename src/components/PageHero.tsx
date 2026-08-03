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

  return (
    <section className="relative overflow-hidden bg-[#f7f8fb]">
      <div
        className="pointer-events-none absolute inset-0 hidden md:block"
        style={{
          background:
            'radial-gradient(ellipse 55% 70% at 12% 40%, rgba(255,241,224,0.9), transparent 60%), radial-gradient(ellipse 40% 50% at 35% 80%, rgba(228,236,246,0.55), transparent 55%)',
        }}
      />

      <div className="relative grid md:grid-cols-2 min-h-[100svh] md:min-h-[88vh]">
        <div
          className={`relative order-1 md:order-2 h-[48vh] min-h-[300px] sm:h-[52vh] md:h-auto md:min-h-full ${
            isApp ? 'flex items-center justify-center px-6 py-8 md:py-16' : ''
          }`}
        >
          {isApp ? (
            <>
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 60% 55% at 55% 45%, rgba(255, 80, 0,0.18), transparent 65%), radial-gradient(ellipse 50% 60% at 70% 70%, rgba(22,24,31,0.06), transparent 60%)',
                }}
              />
              <div className="relative w-[min(220px,42vw)] sm:w-[240px] md:w-[260px] lg:w-[280px]">
                <div className="relative rounded-[2rem] border-[6px] border-[#16181f] bg-[#16181f] shadow-[0_28px_60px_rgba(22,24,31,0.22)] overflow-hidden aspect-[9/19.5]">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-[#0a0a0b] z-10" />
                  <img
                    src={image}
                    alt="Game On Fitness app"
                    className="w-full h-full object-cover object-top"
                    loading="eager"
                  />
                </div>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#f7f8fb] to-transparent md:hidden" />
            </>
          ) : (
            <>
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
            </>
          )}
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
