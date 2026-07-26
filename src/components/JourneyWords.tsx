import { useEffect, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const words = ['Discipline', 'Confidence', 'Consistency', 'Courage', 'Strength', 'YOU.'];

export default function JourneyWords() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.35 });
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!isVisible) return;
    setStarted(true);
  }, [isVisible]);

  useEffect(() => {
    if (!started) return;
    if (index >= words.length - 1) return;
    const t = setTimeout(() => setIndex((i) => i + 1), 2200);
    return () => clearTimeout(t);
  }, [started, index]);

  const isFinal = index === words.length - 1;

  return (
    <section
      id="journey"
      className="relative min-h-[75vh] flex items-center justify-center overflow-hidden atmosphere"
    >
      <div
        className="soft-blob w-[420px] h-[420px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bloom"
        style={{ background: 'rgba(224,122,114,0.16)' }}
      />

      <div ref={ref} className="relative z-10 max-w-4xl mx-auto px-6 text-center py-24">
        <div
          className={`section-ornament justify-center mb-5 reveal ${isVisible ? 'visible' : ''}`}
        >
          <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
            The Journey
          </span>
        </div>
        <h2
          className={`font-display text-2xl md:text-4xl font-bold text-[#16181f] mb-14 reveal ${
            isVisible ? 'visible' : ''
          }`}
          style={{ transitionDelay: '0.1s' }}
        >
          It was never about the weights.
        </h2>

        <div className="relative h-24 md:h-32 flex items-center justify-center">
          {started && (
            <p
              key={words[index]}
              className={`animate-fade-in-up font-display font-bold tracking-tight ${
                isFinal
                  ? 'text-[clamp(3.5rem,12vw,7rem)] gradient-text-accent'
                  : 'text-[clamp(2.5rem,9vw,5.5rem)] text-[#16181f]'
              }`}
            >
              {words[index]}
            </p>
          )}
        </div>

        <p
          className={`mt-14 text-[#6f7685] text-base md:text-lg max-w-md mx-auto leading-relaxed transition-opacity duration-1000 ${
            isFinal ? 'opacity-100' : 'opacity-0'
          }`}
        >
          This journey has always been about you.
        </p>
      </div>
    </section>
  );
}
