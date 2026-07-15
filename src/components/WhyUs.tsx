import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Dumbbell, HeartPulse, Users } from 'lucide-react';

const pillars = [
  {
    icon: Dumbbell,
    title: 'Train with intention',
    text: 'World-class equipment and programming built for real strength, not just sweat.',
    accent: 'from-[#e07a72]/20 to-[#f6e4e1]',
  },
  {
    icon: HeartPulse,
    title: 'Recover beautifully',
    text: 'Steam, coaching, and calm interiors that make recovery feel as premium as the workout.',
    accent: 'from-[#e4ecf6] to-white',
  },
  {
    icon: Users,
    title: 'Belong somewhere',
    text: 'A community that pushes you forward — trainers and members who take fitness seriously.',
    accent: 'from-[#f6e4e1] to-[#e4ecf6]',
  },
];

export default function WhyUs() {
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: gridRef, isVisible: gridVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.15,
  });

  return (
    <section className="relative py-20 md:py-28 overflow-hidden bg-white">
      <div
        className="soft-blob w-[360px] h-[360px] top-10 -right-20 opacity-70"
        style={{ background: 'rgba(224,122,114,0.1)' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div ref={headRef} className={`text-center max-w-2xl mx-auto mb-14 reveal ${headVisible ? 'visible' : ''}`}>
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
              The Experience
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#16181f] leading-[1.1]">
            Designed to feel <span className="italic text-[#e07a72]">different.</span>
          </h2>
          <div className="section-float-line mt-6" />
        </div>

        <div ref={gridRef} className="grid md:grid-cols-3 gap-6 md:gap-8">
          {pillars.map((p, i) => {
            const Icon = p.icon;
            return (
              <div
                key={p.title}
                className={`why-card reveal ${gridVisible ? 'visible' : ''} group relative rounded-[1.75rem] p-8 border border-[rgba(22,24,31,0.06)] bg-gradient-to-br ${p.accent} hover:-translate-y-2 transition-all duration-500 hover:shadow-[0_28px_60px_rgba(22,24,31,0.1)]`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#e07a72] mb-6 transition-transform duration-500 group-hover:scale-110 group-hover:rotate-[-4deg]">
                  <Icon size={24} />
                </div>
                <h3 className="font-display text-2xl font-bold text-[#16181f] mb-3">{p.title}</h3>
                <p className="text-[#6f7685] leading-relaxed text-[15px]">{p.text}</p>
                <div className="mt-6 h-px w-12 bg-[#e07a72]/40 transition-all duration-500 group-hover:w-20" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
