import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const stops = [
  { word: 'Discipline', line: 'Show up when it’s hard.' },
  { word: 'Confidence', line: 'Believe before you see it.' },
  { word: 'Consistency', line: 'Small steps. Every day.' },
  { word: 'Courage', line: 'Start anyway.' },
  { word: 'Strength', line: 'Built one rep at a time.' },
  { word: 'YOU.', line: 'This journey was always about you.' },
];

export default function JourneyWords() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.15 });
  const videoRef = useRef<HTMLVideoElement>(null);
  const [index, setIndex] = useState(0);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.defaultMuted = true;
    video.playsInline = true;
    video.setAttribute('muted', '');
    video.setAttribute('playsinline', '');

    const tryPlay = () => {
      const playPromise = video.play();
      if (playPromise) {
        playPromise.catch(() => {
          setTimeout(() => {
            video.muted = true;
            video.play().catch(() => {});
          }, 300);
        });
      }
    };

    tryPlay();
    video.addEventListener('loadeddata', tryPlay);
    video.addEventListener('canplay', tryPlay);

    return () => {
      video.removeEventListener('loadeddata', tryPlay);
      video.removeEventListener('canplay', tryPlay);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    setStarted(true);
    const video = videoRef.current;
    if (video) {
      video.muted = true;
      video.play().catch(() => {});
    }
  }, [isVisible]);

  useEffect(() => {
    if (!started) return;
    if (index >= stops.length - 1) return;
    const t = setTimeout(() => setIndex((i) => i + 1), 2200);
    return () => clearTimeout(t);
  }, [started, index]);

  const current = stops[index];
  const isFinal = index === stops.length - 1;

  return (
    <section
      id="journey"
      className="relative min-h-[82vh] md:min-h-[88vh] flex items-center justify-center overflow-hidden bg-[#16181f]"
    >
      {/* Live gym video */}
      <div className="absolute inset-0">
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          src="/bg/journey.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/bg/dumbbell-hold.jpg"
        />
        <div className="absolute inset-0 bg-[#16181f]/45" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#16181f]/55 via-[#16181f]/30 to-[#16181f]/70" />
        <div className="absolute inset-0 bg-gradient-to-tr from-[#ff5000]/20 via-transparent to-transparent" />
      </div>

      <div
        className="soft-blob w-[420px] h-[420px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-bloom opacity-50"
        style={{ background: 'rgba(255, 80, 0, 0.28)' }}
      />

      <div ref={ref} className="relative z-10 w-full max-w-5xl mx-auto px-6 py-16 md:py-24">
        {/* Header */}
        <div
          className={`text-center mb-10 md:mb-14 reveal ${isVisible ? 'visible' : ''}`}
        >
          <div className="inline-flex items-center gap-3 mb-5">
            <span className="h-px w-10 bg-gradient-to-r from-transparent to-[#ff5000]" />
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#ffb089]">
              Your Journey Tour
            </span>
            <span className="h-px w-10 bg-gradient-to-l from-transparent to-[#ff5000]" />
          </div>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-white">
            It was never about the weights.
          </h2>
        </div>

        {/* Tour path stops */}
        <div className="relative mb-12 md:mb-16">
          <div className="hidden md:block absolute top-5 left-[8%] right-[8%] h-px bg-white/15" />
          <div
            className="hidden md:block absolute top-5 left-[8%] h-px bg-gradient-to-r from-[#ff5000] to-[#ffb089] transition-all duration-700 ease-out"
            style={{ width: `${(index / (stops.length - 1)) * 84}%` }}
          />

          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 md:gap-2">
            {stops.map((stop, i) => {
              const active = i === index;
              const done = i < index;
              return (
                <button
                  key={stop.word}
                  type="button"
                  onClick={() => {
                    setStarted(true);
                    setIndex(i);
                  }}
                  className="group relative flex flex-col items-center text-center"
                >
                  <span
                    className={`relative z-10 w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                      active
                        ? 'bg-[#ff5000] text-white scale-110 shadow-[0_0_28px_rgba(255,80,0,0.55)]'
                        : done
                          ? 'bg-white text-[#16181f]'
                          : 'bg-white/10 text-white/50 border border-white/20'
                    }`}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={`mt-3 text-[10px] md:text-xs font-semibold tracking-[0.12em] uppercase transition-colors duration-300 ${
                      active ? 'text-[#ffb089]' : done ? 'text-white/70' : 'text-white/35'
                    }`}
                  >
                    {stop.word.replace('.', '')}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active stop spotlight */}
        <div className="text-center min-h-[160px] md:min-h-[180px] flex flex-col items-center justify-center">
          {started && (
            <div key={current.word} className="animate-fade-in-up">
              <p
                className={`font-display font-bold tracking-tight drop-shadow-[0_16px_50px_rgba(0,0,0,0.55)] ${
                  isFinal
                    ? 'text-[clamp(3.5rem,12vw,7rem)] text-transparent bg-clip-text bg-gradient-to-br from-white via-[#ffb089] to-[#ff5000]'
                    : 'text-[clamp(2.5rem,9vw,5.25rem)] text-white'
                }`}
              >
                {current.word}
              </p>
              <p className="mt-5 text-white/70 text-base md:text-lg max-w-md mx-auto leading-relaxed">
                {current.line}
              </p>
            </div>
          )}
        </div>

        <p className="mt-10 text-center text-[11px] tracking-[0.2em] uppercase text-white/40">
          Step {index + 1} of {stops.length}
        </p>
      </div>
    </section>
  );
}
