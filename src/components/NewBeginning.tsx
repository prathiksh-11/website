import { ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import dumbbellAthlete from '../assets/bg/dumbbell-hold.jpg';

const words = ['Train', 'Improve', 'Belong', 'Repeat'];

export default function NewBeginning() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.2 });

  return (
    <section
      id="beginning"
      className="relative overflow-hidden bg-[#f7f8fb] scroll-mt-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[22%] top-[45%] -translate-x-1/2 -translate-y-1/2 w-[480px] h-[480px] rounded-full border border-[#ff5000]/10 hidden lg:block" />
        <div className="absolute left-[22%] top-[45%] -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full border border-dashed border-[#ff5000]/20 app-ring-spin hidden lg:block" />
        <div
          className="absolute left-[18%] top-[40%] w-[280px] h-[280px] rounded-full app-glow-breath"
          style={{ background: 'radial-gradient(circle, rgba(255,80,0,0.12) 0%, transparent 70%)' }}
        />
      </div>

      <div
        ref={ref}
        className={`grid lg:grid-cols-2 min-h-[72vh] lg:min-h-[80vh] reveal ${
          isVisible ? 'visible' : ''
        }`}
      >
        <div className="relative order-2 lg:order-1 flex items-center px-6 sm:px-10 lg:px-14 xl:px-20 py-16 lg:py-24">
          <div className="relative max-w-lg">
            <div
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#ff5000]/15 shadow-sm mb-6 transition-all duration-700 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5000] animate-soft-pulse" />
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
                Your Beginning
              </span>
            </div>

            <h2
              className={`font-display text-4xl md:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.08] text-[#16181f] mb-6 transition-all duration-700 delay-100 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              This could be your
              <br />
              <span className="italic text-[#ff5000]">new beginning.</span>
            </h2>

            <p
              className={`text-[#6f7685] text-base md:text-lg leading-relaxed mb-8 max-w-md transition-all duration-700 delay-200 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              Walk into a space full of energy — coaches who care, members who motivate, and
              moments that push you forward every day.
            </p>

            <div
              className={`flex flex-wrap gap-2.5 mb-10 transition-all duration-700 delay-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
            >
              {words.map((word) => (
                <span
                  key={word}
                  className="px-4 py-2 rounded-full bg-white border border-[#ff5000]/15 font-display text-sm font-semibold text-[#16181f] shadow-[0_8px_24px_rgba(255,80,0,0.06)] hover:border-[#ff5000]/40 hover:text-[#ff5000] transition-all duration-300"
                >
                  {word}
                </span>
              ))}
            </div>

            <button
              onClick={() =>
                document.querySelector('#branches')?.scrollIntoView({ behavior: 'smooth' })
              }
              className={`group inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#ff5000] text-white text-sm font-semibold shadow-[0_14px_40px_rgba(255,80,0,0.35)] hover:-translate-y-0.5 hover:shadow-[0_18px_48px_rgba(255,80,0,0.45)] transition-all duration-300 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
              }`}
              style={{ transitionDelay: '400ms' }}
            >
              Explore This Branch
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>

        <div className="relative order-1 lg:order-2 h-[44vh] min-h-[300px] sm:h-[50vh] lg:h-auto lg:min-h-full">
          <img
            src={dumbbellAthlete}
            alt="Athlete training with dumbbell"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 20%' }}
            loading="lazy"
          />
          <div className="absolute inset-y-0 left-0 w-10 lg:w-16 bg-gradient-to-r from-[#f7f8fb]/70 to-transparent hidden lg:block" />
          <div className="absolute inset-x-0 bottom-0 h-10 bg-gradient-to-t from-[#f7f8fb]/60 to-transparent lg:hidden" />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#ff5000]/08 via-transparent to-transparent pointer-events-none" />

          <div
            className="absolute top-8 right-6 sm:top-12 sm:right-10 hidden sm:block app-badge-in"
            style={{ animationDelay: '0.5s' }}
          >
            <div className="px-3.5 py-2 rounded-2xl bg-white/95 backdrop-blur border border-white shadow-[0_12px_30px_rgba(22,24,31,0.12)] text-xs font-semibold text-[#16181f]">
              <span className="text-[#ff5000]">●</span> Energy starts here
            </div>
          </div>
          <div
            className="absolute bottom-10 left-6 sm:bottom-16 sm:left-10 hidden sm:block app-badge-in"
            style={{ animationDelay: '0.75s' }}
          >
            <div className="px-3.5 py-2 rounded-2xl bg-[#ff5000] text-white shadow-[0_12px_30px_rgba(255,80,0,0.35)] text-xs font-semibold">
              Coaches who care ✓
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
