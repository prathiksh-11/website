import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function Momentum() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section className="relative py-24 md:py-32 overflow-hidden bg-[#f7f8fb]">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,80,0,0.1) 0%, transparent 65%)',
          }}
        />
      </div>

      <div ref={ref} className="relative max-w-5xl mx-auto px-6 text-center">
        <p
          className={`text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000] mb-8 transition-all duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Keep Going
        </p>

        <div className="space-y-4 md:space-y-5 mb-10">
          <p
            className={`font-display text-xl md:text-3xl font-semibold text-[#9aa0ab] transition-all duration-1000 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Your body changes with training.
          </p>
          <p
            className={`font-display text-xl md:text-3xl font-semibold text-[#3a3f4b] transition-all duration-1000 delay-300 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
            }`}
          >
            Your life changes with discipline.
          </p>
        </div>

        <h2
          className={`font-display text-4xl md:text-6xl font-bold tracking-tight gradient-text-accent transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          KEEP SHOWING UP.
        </h2>
      </div>
    </section>
  );
}
