import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { ArrowRight } from 'lucide-react';
import { IMAGES } from './image_constant';

const highlights = [
  { value: '10+', label: 'Years of Experience' },
  { value: '10+', label: 'Clubs Across Bengaluru' },
  { value: '15K+', label: 'Active Members' },
];

export default function HomeAboutUs() {
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: bodyRef, isVisible: bodyVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.15,
  });

  return (
    <section id="about" className="relative py-24 md:py-32 overflow-hidden atmosphere scroll-mt-28">
      <div className="max-w-7xl mx-auto px-6 relative">
        <div
          ref={headRef}
          className={`text-center max-w-3xl mx-auto mb-14 reveal ${headVisible ? 'visible' : ''}`}
        >
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              About Us
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-[#16181f] leading-[1.1] mb-5">
            From our first club to{' '}
            <span className="italic text-[#ff5000]">Bengaluru&apos;s fitness home.</span>
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed">
            Game On Fitness began with a single vision — create a gym where every member feels
            welcomed, coached, and challenged to become stronger.
          </p>
        </div>

        <div
          ref={bodyRef}
          className={`grid lg:grid-cols-2 gap-10 lg:gap-14 items-center reveal ${
            bodyVisible ? 'visible' : ''
          }`}
        >
          <div className="relative">
            <div className="rounded-[2rem] overflow-hidden border border-[rgba(22,24,31,0.06)] shadow-[0_24px_60px_rgba(22,24,31,0.1)]">
              <img
                src={IMAGES.Arekere.img1}
                alt="Game On Fitness gym interior"
                className="w-full h-[320px] md:h-[420px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-6 -right-4 md:right-6 px-6 py-4 rounded-2xl bg-white border border-[rgba(22,24,31,0.06)] shadow-[0_16px_40px_rgba(22,24,31,0.1)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff5000] mb-1">
                Our First Club
              </p>
              <p className="font-display text-lg font-bold text-[#16181f]">Arekere, Bengaluru</p>
            </div>
          </div>

          <div>
            <p className="text-[#6f7685] text-base md:text-lg leading-relaxed mb-6">
              What started as our very first tenant gym has grown into one of Bengaluru&apos;s most
              trusted fitness brands — with premium equipment, expert trainers, and a community
              that shows up for each other every single day.
            </p>
            <p className="text-[#6f7685] text-base md:text-lg leading-relaxed mb-8">
              For over a decade, we&apos;ve helped thousands transform their bodies and build
              discipline that lasts — through weight training, functional fitness, Kettlebell
              workouts, Battle Rope sessions, and personalised coaching.
            </p>

            <div className="grid grid-cols-3 gap-4 mb-8">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="text-center rounded-2xl bg-white border border-[rgba(22,24,31,0.06)] px-3 py-5 shadow-sm"
                >
                  <p className="font-display text-2xl md:text-3xl font-bold text-[#16181f]">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[10px] md:text-xs font-semibold uppercase tracking-[0.12em] text-[#6f7685] leading-snug">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>

            <button
              onClick={() =>
                document.querySelector('#branches')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="group inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#ff5000] text-white text-sm font-semibold shadow-[0_14px_40px_rgba(255,80,0,0.3)] hover:-translate-y-0.5 transition-all duration-300"
            >
              Visit a Club Near You
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
