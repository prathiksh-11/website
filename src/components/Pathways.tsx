import { ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const pathways = [
  { title: 'The Warrior', line: 'Become stronger than yesterday.' },
  { title: 'The Athlete', line: 'Train to perform.' },
  { title: 'The Transformer', line: 'Rewrite your story.' },
  { title: 'The Disciplined', line: 'Build habits that never quit.' },
  { title: 'The Champion', line: 'Refuse average.' },
  { title: 'The Health Seeker', line: 'Live stronger every day.' },
];

export default function Pathways() {
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: gridRef, isVisible: gridVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
  });

  return (
    <section id="pathways" className="relative py-24 md:py-32 overflow-hidden bg-white">
      <div
        className="soft-blob w-[360px] h-[360px] top-10 -right-20 opacity-70"
        style={{ background: 'rgba(255, 80, 0,0.1)' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div
          ref={headRef}
          className={`text-center max-w-2xl mx-auto mb-14 reveal ${headVisible ? 'visible' : ''}`}
        >
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Who You Become
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#16181f] leading-[1.1]">
            Who are you <span className="italic text-[#ff5000]">becoming?</span>
          </h2>
          <div className="section-float-line mt-6" />
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {pathways.map((path, i) => (
            <button
              key={path.title}
              onClick={() =>
                document.querySelector('#branches')?.scrollIntoView({ behavior: 'smooth' })
              }
              className={`group text-left relative rounded-[1.75rem] p-7 md:p-8 border border-[rgba(22,24,31,0.06)] bg-gradient-to-br from-[#fff0e8]/40 to-white hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_28px_60px_rgba(22,24,31,0.1)] reveal ${
                gridVisible ? 'visible' : ''
              }`}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-[#ff5000]/80 mb-4">
                Path 0{i + 1}
              </p>
              <h3 className="font-display text-2xl font-bold text-[#16181f] mb-3">
                {path.title}
              </h3>
              <p className="text-[#6f7685] text-[15px] leading-relaxed mb-6">{path.line}</p>
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-[#ff5000] group-hover:gap-3 transition-all">
                Enter This Path
                <ArrowRight size={15} />
              </span>
            </button>
          ))}
        </div>

        <p
          className={`mt-14 text-center text-[#6f7685] text-base md:text-lg max-w-lg mx-auto reveal ${
            gridVisible ? 'visible' : ''
          }`}
          style={{ transitionDelay: '0.4s' }}
        >
          Every journey begins with choosing who you want to become.
        </p>
      </div>
    </section>
  );
}
