import { ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function NewBeginning() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section id="beginning" className="relative overflow-hidden bg-[#f7f8fb]">
      <div
        ref={ref}
        className={`grid lg:grid-cols-2 min-h-[70vh] lg:min-h-[78vh] reveal ${
          isVisible ? 'visible' : ''
        }`}
      >
        {/* Light content side */}
        <div className="relative order-2 lg:order-1 flex items-center px-6 sm:px-10 lg:px-14 xl:px-20 py-16 lg:py-24">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 20% 40%, rgba(255,80,0,0.06), transparent 60%)',
            }}
          />
          <div className="relative max-w-lg">
            <div className="section-ornament mb-5">
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
                Your Beginning
              </span>
            </div>

            <h2 className="font-display text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08] text-[#16181f] mb-6">
              This could be your
              <br />
              <span className="italic text-[#ff5000]">new beginning.</span>
            </h2>

            <p className="text-[#6f7685] text-base md:text-lg leading-relaxed mb-8 max-w-md">
              Walk into a space full of energy — coaches who care, members who motivate, and
              moments that push you forward every day.
            </p>

            <div className="flex flex-wrap gap-2.5 mb-10">
              {['Train', 'Improve', 'Belong', 'Repeat'].map((word) => (
                <span
                  key={word}
                  className="px-4 py-2 rounded-full bg-white border border-[rgba(22,24,31,0.06)] font-display text-sm font-semibold text-[#16181f] shadow-[0_8px_24px_rgba(22,24,31,0.04)]"
                >
                  {word}
                </span>
              ))}
            </div>

            <button
              onClick={() =>
                document.querySelector('#branches')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="btn-premium-primary group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold"
            >
              Explore This Branch
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        {/* Dumbbell image — real visual, not wallpaper */}
        <div className="relative order-1 lg:order-2 h-[42vh] min-h-[280px] sm:h-[48vh] lg:h-auto lg:min-h-full">
          <img
            src="/bg/dumbbell-hold.jpg"
            alt="Training with dumbbells"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
            loading="lazy"
          />
          {/* Soft fade into light content */}
          <div className="absolute inset-y-0 left-0 w-24 lg:w-36 bg-gradient-to-r from-[#f7f8fb] to-transparent hidden lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#f7f8fb] to-transparent lg:hidden" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#16181f]/15 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>
    </section>
  );
}
