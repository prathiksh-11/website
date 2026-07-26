import { ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function NewBeginning() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.25 });

  return (
    <section id="beginning" className="relative py-24 md:py-32 overflow-hidden bg-white">
      <div
        className="soft-blob w-[400px] h-[400px] top-10 right-0 opacity-60"
        style={{ background: 'rgba(224,122,114,0.12)' }}
      />

      <div
        ref={ref}
        className={`relative max-w-4xl mx-auto px-6 text-center reveal ${isVisible ? 'visible' : ''}`}
      >
        <div className="section-ornament justify-center mb-5">
          <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
            Chapter Four
          </span>
        </div>

        <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[#16181f] mb-6">
          This could be your
          <br />
          <span className="italic text-[#e07a72]">new beginning.</span>
        </h2>

        <p className="text-[#6f7685] text-lg leading-relaxed max-w-xl mx-auto mb-10">
          Natural light fills the space. People are training. Someone is encouraging a beginner.
          Someone is celebrating a personal best. No words — just moments.
        </p>

        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {['Train', 'Improve', 'Belong', 'Repeat'].map((word) => (
            <span
              key={word}
              className="px-6 py-3 rounded-full bg-[#f7f8fb] border border-[rgba(22,24,31,0.06)] font-display text-lg font-semibold text-[#16181f]"
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
    </section>
  );
}
