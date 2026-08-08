import { useState } from 'react';
import { ArrowRight, Flame, Trophy, RefreshCw, Target, Shield, Heart } from 'lucide-react';
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
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: bodyRef, isVisible: bodyVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.12,
  });

  const path = pathways[active];
  const Icon = path.icon;

  return (
    <section id="pathways" className="relative py-20 md:py-28 overflow-hidden bg-white">
      <div className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-20 -left-16 w-[420px] h-[420px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,80,0,0.1) 0%, transparent 68%)',
          }}
        />
        <div
          className="absolute bottom-0 right-0 w-[380px] h-[380px] rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(255,240,232,0.9) 0%, transparent 70%)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div
          ref={headRef}
          className={`flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12 md:mb-16 reveal ${
            headVisible ? 'visible' : ''
          }`}
        >
          <div className="max-w-xl">
            <div className="section-ornament mb-5">
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

        <div
          ref={bodyRef}
          className={`grid lg:grid-cols-[1.15fr_0.85fr] gap-5 md:gap-6 reveal ${
            bodyVisible ? 'visible' : ''
          }`}
        >
          {/* Featured panel — soft white + orange */}
          <div className="relative overflow-hidden rounded-[2rem] border border-[rgba(22,24,31,0.06)] bg-gradient-to-br from-[#fff0e8]/70 via-white to-[#f7f8fb] min-h-[420px] md:min-h-[520px] flex flex-col justify-between p-8 md:p-12 shadow-[0_18px_50px_rgba(22,24,31,0.05)]">
            <div
              className="absolute inset-0 opacity-90"
              style={{
                background:
                  'radial-gradient(ellipse 70% 55% at 90% 10%, rgba(255,80,0,0.12), transparent 55%)',
              }}
            />

            <div className="relative">
              <div className="flex items-center justify-between mb-10">
                <span className="text-[11px] font-bold tracking-[0.35em] uppercase text-[#ff5000]">
                  Path 0{active + 1}
                </span>
                <div className="w-12 h-12 rounded-2xl bg-white border border-[rgba(255,80,0,0.2)] shadow-sm flex items-center justify-center text-[#ff5000]">
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

            <div className="relative mt-10 flex flex-wrap items-center gap-4">
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
              <span className="text-[#9aa0ab] text-xs tracking-[0.2em] uppercase">
                {active + 1} / {pathways.length}
              </span>
            </div>
          </div>

          {/* Path list */}
          <div className="flex flex-col gap-2.5">
            {pathways.map((item, i) => {
              const ItemIcon = item.icon;
              const selected = i === active;
              return (
                <button
                  key={item.title}
                  type="button"
                  onClick={() => setActive(i)}
                  onMouseEnter={() => setActive(i)}
                  className={`group relative text-left rounded-2xl px-5 py-4 border transition-all duration-400 ${
                    selected
                      ? 'bg-[#fff0e8] border-[#ff5000]/30 shadow-[0_12px_32px_rgba(255,80,0,0.1)] scale-[1.01]'
                      : 'bg-[#f7f8fb] border-[rgba(22,24,31,0.05)] hover:bg-white hover:border-[rgba(22,24,31,0.1)]'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        selected
                          ? 'bg-[#ff5000] text-white'
                          : 'bg-white text-[#ff5000] border border-[rgba(22,24,31,0.06)]'
                      }`}
                    >
                      <ItemIcon size={18} />
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="font-display text-lg font-bold truncate text-[#16181f]">
                          {item.title}
                        </h3>
                        <span
                          className={`text-[10px] font-bold tracking-widest ${
                            selected ? 'text-[#ff5000]' : 'text-[#9aa0ab]'
                          }`}
                        >
                          0{i + 1}
                        </span>
                      </div>
                      <p className="text-sm mt-0.5 truncate text-[#6f7685]">{item.line}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
