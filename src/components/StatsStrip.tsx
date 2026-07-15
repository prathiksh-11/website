import { useIntersectionObserver, useCountUp } from '../hooks/useIntersectionObserver';
import { Building2, Users, Trophy, Calendar } from 'lucide-react';

const stats = [
  { value: 10, suffix: '+', label: 'Elite Clubs', icon: Building2 },
  { value: 15, suffix: 'K+', label: 'Active Members', icon: Users },
  { value: 98, suffix: '%', label: 'Success Rate', icon: Trophy },
  { value: 10, suffix: '+', label: 'Years Strong', icon: Calendar },
];

function StatItem({
  value,
  suffix,
  label,
  icon: Icon,
  start,
  delay,
}: {
  value: number;
  suffix: string;
  label: string;
  icon: typeof Building2;
  start: boolean;
  delay: number;
}) {
  const count = useCountUp(value, 1800, start);
  return (
    <div
      className={`stat-item text-center reveal ${start ? 'visible' : ''} group`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="mx-auto mb-4 w-12 h-12 rounded-2xl bg-[#f6e4e1] flex items-center justify-center text-[#e07a72] transition-all duration-400 group-hover:scale-110 group-hover:bg-[#e07a72] group-hover:text-white group-hover:shadow-[0_12px_28px_rgba(224,122,114,0.35)]">
        <Icon size={20} />
      </div>
      <p className="font-display text-4xl md:text-5xl font-bold text-[#16181f] tracking-tight">
        {count}
        <span className="text-[#e07a72]">{suffix}</span>
      </p>
      <p className="mt-2 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-[#6f7685]">
        {label}
      </p>
    </div>
  );
}

export default function StatsStrip() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.35 });

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-[#f7f8fb] via-white to-white" />
      <div
        className="soft-blob w-[300px] h-[300px] top-0 left-1/4 opacity-60 animate-bloom"
        style={{ background: 'rgba(224,122,114,0.12)' }}
      />

      <div ref={ref} className="relative max-w-5xl mx-auto px-6">
        <div className="rounded-[2rem] bg-white/90 border border-[rgba(22,24,31,0.06)] shadow-[0_20px_60px_rgba(22,24,31,0.06)] backdrop-blur-sm px-6 py-10 md:px-10 md:py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {stats.map((s, i) => (
              <div key={s.label} className="relative">
                <StatItem
                  value={s.value}
                  suffix={s.suffix}
                  label={s.label}
                  icon={s.icon}
                  start={isVisible}
                  delay={i * 120}
                />
                {i < stats.length - 1 && (
                  <div className="hidden md:block absolute top-1/2 -right-2 w-px h-16 -translate-y-1/2 bg-gradient-to-b from-transparent via-[#e07a72]/25 to-transparent" />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
