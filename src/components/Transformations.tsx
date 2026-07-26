import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const stories = [
  {
    before: 'I came here to lose weight.',
    after: 'I stayed because I found confidence.',
  },
  {
    before: "I thought I wasn't strong enough.",
    after: 'Now I inspire others.',
  },
  {
    before: 'My first workout lasted ten minutes.',
    after: 'I never stopped coming back.',
  },
];

export default function Transformations() {
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: gridRef, isVisible: gridVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.15,
  });

  return (
    <section id="transformations" className="relative py-24 md:py-32 overflow-hidden bg-[#f7f8fb]">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-0 w-[600px] h-[600px] rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(224,122,114,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <div ref={headRef} className={`text-center mb-16 reveal ${headVisible ? 'visible' : ''}`}>
            <div className="section-ornament justify-center mb-5">
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
                Chapter Five
              </span>
            </div>
          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[#16181f] mb-5">
            Hundreds of stories.
          </h2>
          <p className="text-[#6f7685] max-w-xl mx-auto leading-relaxed text-lg">
            No ratings. No stars. Only journeys.
          </p>
        </div>

        <div ref={gridRef} className="grid md:grid-cols-3 gap-5 md:gap-6">
          {stories.map((story, i) => (
            <div
              key={i}
              className={`reveal ${gridVisible ? 'visible' : ''} relative rounded-[1.75rem] border border-[rgba(22,24,31,0.06)] bg-white p-8 md:p-9 shadow-[0_18px_50px_rgba(22,24,31,0.06)]`}
              style={{ transitionDelay: `${i * 120}ms` }}
            >
              <p className="font-display text-lg md:text-xl italic text-[#6f7685] leading-relaxed mb-6">
                “{story.before}”
              </p>
              <div className="h-px w-12 bg-[#e07a72]/40 mb-6" />
              <p className="font-display text-xl md:text-2xl font-bold text-[#16181f] leading-snug">
                “{story.after}”
              </p>
            </div>
          ))}
        </div>

        <div
          className={`mt-16 text-center reveal ${gridVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.4s' }}
        >
          <p className="font-display text-2xl md:text-4xl font-bold tracking-tight text-[#16181f]">
            Every transformation starts with a{' '}
            <span className="italic text-[#e07a72]">decision.</span>
          </p>
          <button
            onClick={() =>
              document.querySelector('#branches')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="btn-premium-primary mt-8 font-semibold px-10 py-4 rounded-full text-sm tracking-wide"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
}
