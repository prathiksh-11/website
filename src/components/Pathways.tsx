import { useEffect, useState } from 'react';
import { ArrowRight, ArrowLeft, Flame, Trophy, RefreshCw, Target, Shield, Heart } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const pathways = [
  {
    title: 'The Warrior',
    line: 'Become stronger than yesterday.',
    detail: 'Heavy lifts. Hard sets. A mindset that refuses to quit mid-rep.',
    icon: Flame,
  },
  {
    title: 'The Athlete',
    line: 'Train to perform.',
    detail: 'Speed, power, and precision — built for people who compete with themselves.',
    icon: Trophy,
  },
  {
    title: 'The Transformer',
    line: 'Rewrite your story.',
    detail: 'Body recomposition with coaching that keeps you accountable every week.',
    icon: RefreshCw,
  },
  {
    title: 'The Disciplined',
    line: 'Build habits that never quit.',
    detail: 'Consistency systems, check-ins, and routines that stick long after motivation fades.',
    icon: Target,
  },
  {
    title: 'The Champion',
    line: 'Refuse average.',
    detail: 'Push past plateaus with progressive training and a community that raises the bar.',
    icon: Shield,
  },
  {
    title: 'The Health Seeker',
    line: 'Live stronger every day.',
    detail: 'Sustainable strength, mobility, and energy — for life, not just a season.',
    icon: Heart,
  },
];

export default function Pathways() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: bodyRef, isVisible: bodyVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.12,
  });

  const path = pathways[active];
  const Icon = path.icon;

  useEffect(() => {
    if (!bodyVisible || paused) return;
    const t = setInterval(() => {
      setActive((i) => (i + 1) % pathways.length);
    }, 3500);
    return () => clearInterval(t);
  }, [bodyVisible, paused]);

  const goPrev = () => {
    setPaused(true);
    setActive((i) => (i - 1 + pathways.length) % pathways.length);
  };

  const goNext = () => {
    setPaused(true);
    setActive((i) => (i + 1) % pathways.length);
  };

  return (
    <section
      id="pathways"
      className="relative pt-28 pb-20 md:pt-32 md:pb-28 overflow-hidden bg-[#f7f8fb] scroll-mt-28"
    >
      {/* Circle share / orb background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-[18%] top-[42%] -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] md:w-[640px] md:h-[640px] rounded-full border border-[#ff5000]/10" />
        <div className="absolute left-[18%] top-[42%] -translate-x-1/2 -translate-y-1/2 w-[360px] h-[360px] md:w-[440px] md:h-[440px] rounded-full border border-dashed border-[#ff5000]/20 app-ring-spin" />
        <div
          className="absolute left-[20%] top-[40%] -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full app-glow-breath"
          style={{ background: 'radial-gradient(circle, rgba(255,80,0,0.14) 0%, transparent 70%)' }}
        />
        <div
          className="absolute right-[-80px] bottom-[-60px] w-[380px] h-[380px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,240,232,0.95) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div
          ref={headRef}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10 md:mb-14 reveal ${
            headVisible ? 'visible' : ''
          }`}
        >
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#ff5000]/15 shadow-sm mb-5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5000] animate-soft-pulse" />
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
                Who You Become
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-[#16181f] leading-[1.05]">
              Who are you <span className="italic text-[#ff5000]">becoming?</span>
            </h2>
          </div>
          <p className="text-[#6f7685] text-sm md:text-base max-w-xs md:text-right leading-relaxed">
            Pick a path. Walk in differently. Walk out as someone new.
          </p>
        </div>

        {/* Progress track */}
        <div className="mb-6 md:mb-8 flex items-center gap-2">
          {pathways.map((p, i) => (
            <button
              key={p.title}
              type="button"
              aria-label={`Go to ${p.title}`}
              onClick={() => {
                setPaused(true);
                setActive(i);
              }}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === active
                  ? 'flex-[2] bg-[#ff5000]'
                  : i < active
                    ? 'flex-1 bg-[#ffb089]'
                    : 'flex-1 bg-[rgba(22,24,31,0.08)]'
              }`}
            />
          ))}
        </div>

        <div
          ref={bodyRef}
          className={`grid lg:grid-cols-[1.2fr_0.8fr] gap-5 md:gap-6 reveal ${
            bodyVisible ? 'visible' : ''
          }`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {/* Featured spotlight */}
          <div className="relative overflow-hidden rounded-[2rem] border border-white bg-white min-h-[400px] md:min-h-[480px] flex flex-col justify-between p-8 md:p-11 shadow-[0_20px_50px_rgba(22,24,31,0.06)]">
            <div
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(ellipse 75% 60% at 100% 0%, rgba(255,80,0,0.12), transparent 55%), radial-gradient(ellipse 50% 40% at 0% 100%, rgba(255,240,232,0.8), transparent 60%)',
              }}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-8">
                <span className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#ff5000]">
                  Path 0{active + 1}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-[#fff0e8] border border-[#ff5000]/20 flex items-center justify-center text-[#ff5000] shadow-sm">
                  <Icon size={22} />
                </div>
              </div>

              <p
                key={`title-${path.title}`}
                className="animate-fade-in-up font-display text-4xl md:text-6xl font-bold text-[#16181f] tracking-tight leading-[0.98] mb-5"
              >
                {path.title}
              </p>
              <p
                key={`line-${path.title}`}
                className="animate-fade-in-up text-[#ff5000] text-lg md:text-xl font-medium mb-4"
                style={{ animationDelay: '0.08s' }}
              >
                {path.line}
              </p>
              <p
                key={`detail-${path.title}`}
                className="animate-fade-in-up text-[#6f7685] text-base md:text-lg leading-relaxed max-w-md"
                style={{ animationDelay: '0.14s' }}
              >
                {path.detail}
              </p>
            </div>

            <div className="relative mt-10 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={goPrev}
                className="w-11 h-11 rounded-full border border-[rgba(22,24,31,0.08)] bg-[#f7f8fb] text-[#16181f] flex items-center justify-center hover:border-[#ff5000]/40 hover:text-[#ff5000] transition-all"
                aria-label="Previous path"
              >
                <ArrowLeft size={16} />
              </button>
              <button
                type="button"
                onClick={goNext}
                className="w-11 h-11 rounded-full border border-[rgba(22,24,31,0.08)] bg-[#f7f8fb] text-[#16181f] flex items-center justify-center hover:border-[#ff5000]/40 hover:text-[#ff5000] transition-all"
                aria-label="Next path"
              >
                <ArrowRight size={16} />
              </button>
              <button
                onClick={() =>
                  document.querySelector('#branches')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#ff5000] text-white text-sm font-semibold shadow-[0_14px_40px_rgba(255,80,0,0.3)] hover:-translate-y-0.5 transition-all duration-300"
              >
                Enter This Path
                <ArrowRight
                  size={16}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </button>
              <span className="text-[#9aa0ab] text-xs tracking-[0.2em] uppercase ml-1">
                {active + 1} / {pathways.length}
              </span>
            </div>
          </div>

          {/* Icon orb dial — not list cards */}
          <div className="flex flex-col gap-5">
            <div className="relative rounded-[2rem] bg-white border border-[rgba(22,24,31,0.06)] p-5 md:p-6 shadow-[0_18px_50px_rgba(22,24,31,0.06)] overflow-hidden">
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(circle at 70% 20%, rgba(255,80,0,0.08), transparent 45%)',
                }}
              />

              <p className="relative text-[10px] font-bold uppercase tracking-[0.28em] text-[#ff5000] mb-5">
                Choose your path
              </p>

              <div className="relative grid grid-cols-3 gap-3 md:gap-4">
                {pathways.map((item, i) => {
                  const ItemIcon = item.icon;
                  const selected = i === active;
                  return (
                    <button
                      key={item.title}
                      type="button"
                      onClick={() => {
                        setPaused(true);
                        setActive(i);
                      }}
                      className="group flex flex-col items-center text-center gap-2.5"
                    >
                      <span
                        className={`relative w-16 h-16 md:w-[4.5rem] md:h-[4.5rem] rounded-full flex items-center justify-center transition-all duration-500 ${
                          selected
                            ? 'bg-[#ff5000] text-white scale-110 shadow-[0_14px_36px_rgba(255,80,0,0.45)]'
                            : 'bg-[#f7f8fb] text-[#ff5000] border border-[rgba(22,24,31,0.06)] hover:border-[#ff5000]/35 hover:scale-105'
                        }`}
                      >
                        {selected && (
                          <span className="absolute -inset-1.5 rounded-full border border-[#ff5000]/35 animate-soft-pulse" />
                        )}
                        <ItemIcon size={22} />
                        <span
                          className={`absolute -top-1 -right-1 w-5 h-5 rounded-full text-[9px] font-bold flex items-center justify-center ${
                            selected
                              ? 'bg-white text-[#ff5000] shadow-sm'
                              : 'bg-white text-[#9aa0ab] border border-[rgba(22,24,31,0.08)]'
                          }`}
                        >
                          {i + 1}
                        </span>
                      </span>
                      <span
                        className={`text-[11px] md:text-xs font-semibold leading-tight max-w-[72px] transition-colors ${
                          selected ? 'text-[#ff5000]' : 'text-[#6f7685] group-hover:text-[#16181f]'
                        }`}
                      >
                        {item.title.replace(/^The /, '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Next-move panel — white + orange only */}
            <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-[#fff0e8] via-white to-[#f7f8fb] border border-[#ff5000]/20 p-5 md:p-6 shadow-[0_16px_40px_rgba(255,80,0,0.1)]">
              <div className="pointer-events-none absolute -right-8 -top-8 w-32 h-32 rounded-full border border-[#ff5000]/15" />
              <div className="pointer-events-none absolute -right-2 top-4 w-20 h-20 rounded-full border border-dashed border-[#ff5000]/25 app-ring-spin" />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    'radial-gradient(ellipse 70% 60% at 100% 0%, rgba(255,80,0,0.12), transparent 55%)',
                }}
              />

              <div className="relative flex items-center gap-4">
                <div className="relative w-16 h-16 shrink-0">
                  <svg viewBox="0 0 64 64" className="w-full h-full -rotate-90">
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="rgba(255,80,0,0.15)"
                      strokeWidth="5"
                    />
                    <circle
                      cx="32"
                      cy="32"
                      r="26"
                      fill="none"
                      stroke="#ff5000"
                      strokeWidth="5"
                      strokeLinecap="round"
                      strokeDasharray={`${((active + 1) / pathways.length) * 163.4} 163.4`}
                      className="transition-all duration-700 ease-out"
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-[#ff5000] text-xs font-bold">
                    {active + 1}/{pathways.length}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#ff5000] mb-1">
                    Your next move
                  </p>
                  <p
                    key={`side-${path.title}`}
                    className="animate-fade-in-up font-display text-lg font-bold text-[#16181f] leading-tight truncate"
                  >
                    {path.title}
                  </p>
                  <p className="text-[#6f7685] text-xs mt-1 line-clamp-1">{path.line}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  document.querySelector('#branches')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="relative mt-5 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#ff5000] text-white text-sm font-semibold shadow-[0_12px_30px_rgba(255,80,0,0.35)] hover:-translate-y-0.5 hover:shadow-[0_16px_36px_rgba(255,80,0,0.45)] transition-all duration-300"
              >
                Find your branch
                <ArrowRight size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
