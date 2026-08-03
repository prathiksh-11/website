import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function Momentum() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.4 });

  return (
    <section className="relative py-28 md:py-36 overflow-hidden atmosphere">
      <div
        className="soft-blob w-[400px] h-[400px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
        style={{ background: 'rgba(255, 80, 0,0.12)' }}
      />

      <div ref={ref} className="relative max-w-3xl mx-auto px-6 text-center">
        <p
          className={`text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000] mb-10 transition-all duration-700 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
        >
          Keep Going
        </p>
        <p
          className={`font-display text-xl md:text-3xl font-semibold text-[#6f7685] mb-6 transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Your body changes with training.
        </p>
        <p
          className={`font-display text-xl md:text-3xl font-semibold text-[#3a3f4b] mb-10 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          Your life changes with discipline.
        </p>
        <h2
          className={`font-display text-4xl md:text-6xl font-bold tracking-tight gradient-text-accent transition-all duration-1000 delay-700 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
          }`}
        >
          KEEP SHOWING UP.
        </h2>
      </div>
    </section>
  );
}
