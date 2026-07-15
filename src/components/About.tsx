import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Check, Sparkles } from 'lucide-react';

export default function About() {
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: leftRef, isVisible: leftVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: rightRef, isVisible: rightVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
  });

  return (
    <section id="about" className="relative py-24 md:py-36 atmosphere overflow-hidden">
      <div
        className="soft-blob w-[420px] h-[420px] top-20 -left-32 animate-bloom"
        style={{ background: 'rgba(224,122,114,0.18)' }}
      />
      <div
        className="soft-blob w-[360px] h-[360px] bottom-10 right-0 animate-float-slow"
        style={{ background: 'rgba(168,190,220,0.22)' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div ref={headRef} className="mb-16 md:mb-20 text-center max-w-2xl mx-auto">
          <div className={`reveal ${headVisible ? 'visible' : ''}`}>
            <div className="section-ornament justify-center mb-5">
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
                About Us
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[#16181f]">
              Fitness, <span className="italic text-[#e07a72]">refined.</span>
            </h2>
            <div className="section-float-line mt-6 mb-2" />
            <p className="mt-5 text-[#6f7685] leading-relaxed text-lg">
              A modern home for strength, wellness, and everyday excellence.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-14 md:gap-20 items-center">
          <div ref={leftRef} className={`relative reveal-left ${leftVisible ? 'visible' : ''}`}>
            <div className="relative">
              <div className="pretty-frame rounded-[2rem] overflow-hidden group/img">
                <img
                  src="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=900&h=700&fit=crop"
                  alt="Elite training facility"
                  className="w-full h-[440px] object-cover transition-transform duration-700 group-hover/img:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16181f]/40 via-transparent to-transparent" />
              </div>

              <div className="absolute -bottom-6 -right-4 md:-right-8 glass-card rounded-2xl p-4 w-44 animate-float shadow-[0_20px_50px_rgba(22,24,31,0.12)]">
                <img
                  src="https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=400&h=280&fit=crop"
                  alt="Training"
                  className="w-full h-24 object-cover rounded-xl mb-3"
                />
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-[#e07a72]" />
                  <div>
                    <p className="text-xs font-bold text-[#16181f]">Elite Programming</p>
                    <p className="text-[10px] text-[#6f7685]">Personalized for you</p>
                  </div>
                </div>
              </div>

              <div className="about-ring absolute -top-6 -left-6 w-24 h-24 rounded-full border border-dashed border-[#e07a72]/30" />
              <div className="absolute top-12 -left-8 w-10 h-10 rounded-full bg-[#f6e4e1] animate-soft-pulse" />
            </div>
          </div>

          <div ref={rightRef} className={`reveal-right ${rightVisible ? 'visible' : ''}`}>
            <p className="font-display italic text-[#e07a72] text-lg mb-3">Who we are</p>
            <h3 className="font-display text-3xl md:text-4xl font-bold text-[#16181f] leading-tight mb-5">
              Built for people who want more than a gym.
            </h3>
            <p className="text-[#6f7685] leading-relaxed mb-5 text-lg">
              Game On Fitness is a health and fitness company offering experiences across
              fitness, nutrition, and mental well-being.
            </p>
            <p className="text-[#8a90a0] leading-relaxed mb-9">
              We cover the full fitness landscape — training, nutrition, gear, and technology —
              so you always have an essential training partner.
            </p>

            <div className="space-y-3">
              {[
                'Top-of-the-line machines, weights and accessories',
                'High quality cardio & strength equipment in every club',
                'Beautiful interiors with exceptional ambience',
                'Certified advanced personal trainers',
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-start gap-3 p-3 rounded-2xl bg-white/60 border border-[rgba(22,24,31,0.04)] hover:border-[#e07a72]/25 hover:bg-white transition-all duration-300"
                >
                  <div className="mt-0.5 w-6 h-6 rounded-full bg-gradient-to-br from-[#f6e4e1] to-[#e07a72]/30 flex items-center justify-center flex-shrink-0">
                    <Check size={12} className="text-[#c45f58]" strokeWidth={3} />
                  </div>
                  <span className="text-[#3a3f4b] text-sm md:text-[15px] leading-relaxed pt-0.5">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
