import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { IMAGES } from './image_constant';

const beforeImages = Object.values(IMAGES.Before);
const duplicatedImages = [...beforeImages, ...beforeImages, ...beforeImages];

interface TransformationCardProps {
  image: string;
  index: number;
  label: string;
}

function TransformationCard({ image, index, label }: TransformationCardProps) {
  return (
    <div className="relative flex-shrink-0 w-72 md:w-80 h-[420px] rounded-[1.75rem] overflow-hidden group cursor-pointer transform transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 shadow-[0_20px_50px_rgba(18,20,26,0.12)] border border-[rgba(18,20,26,0.06)] bg-white">
      <img
        src={image}
        alt={`Transformation ${index} - ${label}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-[#16181f]/75 via-[#16181f]/15 to-transparent opacity-70 group-hover:opacity-55 transition-opacity duration-500" />

  <div className="absolute top-5 left-5 flex items-center gap-2">
        <div
          className={`px-4 py-1.5 rounded-full backdrop-blur-xl border shadow-sm transition-transform duration-500 group-hover:scale-105 ${
            label === 'Before'
              ? 'bg-white/90 border-[rgba(18,20,26,0.08)]'
              : 'bg-[#e07a72]/90 border-[#e07a72]/30'
          }`}
        >
          <span
            className={`font-semibold text-xs tracking-wider uppercase ${
              label === 'Before' ? 'text-[#16181f]' : 'text-white'
            }`}
          >
            {label}
          </span>
        </div>
      </div>

      <div className="absolute inset-0 ring-0 group-hover:ring-2 group-hover:ring-[#e07a72]/40 rounded-[1.75rem] transition-all duration-500 pointer-events-none" />

      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="transform translate-y-3 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
          <p className="text-white/60 text-[10px] font-bold tracking-[0.25em] uppercase mb-1">
            Success Story
          </p>
          <p className="text-white font-display font-bold text-xl tracking-tight">
            Member #{String(index).padStart(2, '0')}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function Transformations() {
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const [scrollPosition, setScrollPosition] = useState(0);
  const [cardWidth, setCardWidth] = useState(320);
  const [paused, setPaused] = useState(false);
  const cardRef = useRef<HTMLDivElement | null>(null);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function measure() {
      const el = cardRef.current;
      if (el) {
        setCardWidth(el.clientWidth + 32);
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const singleSetWidth = cardWidth * beforeImages.length;
    const speedPxPerMs = 0.06;

    function step(now: number) {
      const delta = now - last;
      last = now;
      if (!paused) {
        setScrollPosition((prev) => {
          let next = prev + delta * speedPxPerMs;
          if (next >= singleSetWidth) next -= singleSetWidth;
          return next;
        });
      }
      raf = requestAnimationFrame(step);
    }

    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [cardWidth, paused]);

  return (
    <section id="transformations" className="relative py-24 md:py-32 overflow-hidden bg-[#f7f8fb]">
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-0 w-[600px] h-[600px] rounded-full opacity-60"
          style={{
            background: 'radial-gradient(circle, rgba(224,122,114,0.12) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="w-full">
        <div ref={headRef} className="text-center mb-16 max-w-7xl mx-auto px-8 md:px-12">
          <div className={`reveal ${headVisible ? 'visible' : ''}`}>
            <div className="section-ornament justify-center mb-5">
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
                Real Results
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[#16181f] mb-5">
              Transformations that <span className="italic text-[#e07a72]">inspire.</span>
            </h2>
            <p className="text-[#6f7685] max-w-xl mx-auto leading-relaxed text-lg">
              Real people. Real results. Witness the journeys of our members under expert
              guidance.
            </p>
          </div>
        </div>

        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-r from-[#f7f8fb] via-[#f7f8fb]/60 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-16 md:w-40 bg-gradient-to-l from-[#f7f8fb] via-[#f7f8fb]/60 to-transparent z-20 pointer-events-none" />

          <div
            ref={carouselRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="flex gap-8 transition-transform"
            style={{
              transform: `translateX(-${scrollPosition}px)`,
              willChange: 'transform',
            }}
          >
            {duplicatedImages.map((img, i) => (
              <div key={i} ref={i === 0 ? cardRef : undefined}>
                <TransformationCard
                  image={img}
                  index={(i % beforeImages.length) + 1}
                  label={i % 2 === 0 ? 'Before' : 'After'}
                />
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-20 max-w-7xl mx-auto px-8 md:px-12">
          <button
            onClick={() =>
              document.querySelector('#branches')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="btn-premium-primary font-semibold px-10 py-4 rounded-full text-sm tracking-wide"
          >
            Start Your Journey
          </button>
          <p className="mt-6 text-[#9aa0ab] text-xs font-medium tracking-[0.2em] uppercase">
            No commitments. Just results.
          </p>
        </div>
      </div>
    </section>
  );
}
