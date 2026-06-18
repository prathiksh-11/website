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
    <div className="relative flex-shrink-0 w-80 h-[450px] rounded-[2.5rem] overflow-hidden group cursor-pointer transform transition-all duration-700 hover:scale-[1.02] hover:-translate-y-2 shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 hover:border-[#ffb800]/30 bg-[#111]">
      {/* Image */}
      <img
        src={image}
        alt={`Transformation ${index} - ${label}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
      
      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{
          boxShadow: 'inset 0 0 40px rgba(255,184,0,0.1), inset 0 0 0 1px rgba(255,184,0,0.2)',
        }}
      />
      
      {/* Label */}
      <div className="absolute top-5 left-5">
        <div className={`px-5 py-2 rounded-full backdrop-blur-xl border shadow-xl ${
          label === 'Before' 
            ? 'bg-orange-500/20 border-orange-500/40' 
            : 'bg-emerald-500/20 border-emerald-500/40'
        }`}>
          <span className="text-white font-bold text-xs tracking-wider uppercase">{label}</span>
        </div>
      </div>

      {/* Bottom info */}
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <div className="transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
          <p className="text-orange-400/80 text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Success Story</p>
          <p className="text-white font-black text-xl tracking-tight">Member #{String(index).padStart(2, '0')}</p>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-x-4 group-hover:translate-x-0">
        <div className="w-8 h-8 border-t-2 border-r-2 border-[#ffb800]/50 rounded-tr-xl" />
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

  // measure card width (including gap)
  useEffect(() => {
    function measure() {
      const el = cardRef.current;
      if (el) {
        // card width + gap (gap-8 ~= 32px)
        setCardWidth(el.clientWidth + 32);
      }
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // smooth auto-scroll using requestAnimationFrame
  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const singleSetWidth = cardWidth * beforeImages.length;
    const speedPxPerMs = 0.06; // tune for smooth speed

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
    <section id="transformations" className="relative py-32 overflow-hidden" style={{ background: '#060606' }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-0 w-[800px] h-[800px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255,184,0,0.12) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-0 w-[600px] h-[600px] rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.08) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="w-full">
        <div ref={headRef} className="text-center mb-20 max-w-7xl mx-auto px-8 md:px-12">
          <div className={`reveal ${headVisible ? 'visible' : ''}`}>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#ffb800] mb-4 block">Real Results</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-none mb-6">
              <span className="text-white">TRANSFORMATIONS</span>
              <br />
              <span className="gradient-text-gold">THAT INSPIRE.</span>
            </h2>
            <div className="divider-glow-gold max-w-[120px] mx-auto mb-8" />
            <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
              Real people. Real results. Witness the incredible journeys 
              of our members under expert guidance.
            </p>
          </div>
        </div>

        {/* Auto-scrolling carousel */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-r from-[#060606] via-[#060606]/40 to-transparent z-20 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 md:w-48 bg-gradient-to-l from-[#060606] via-[#060606]/40 to-transparent z-20 pointer-events-none" />
          
          <div
            ref={carouselRef}
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            className="flex gap-12 transition-transform"
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
                  label={(i % 2 === 0) ? 'Before' : 'After'}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-28 max-w-7xl mx-auto px-8 md:px-12">
          <div className="inline-block p-1 rounded-full bg-gradient-to-r from-orange-500/20 via-[#ffb800]/20 to-orange-500/20 backdrop-blur-sm">
            <button
              onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
              className="group relative bg-[#ffb800] hover:bg-orange-500 text-black font-black px-12 py-5 rounded-full text-xs tracking-[0.2em] uppercase transition-all duration-500 hover:shadow-[0_0_50px_rgba(255,184,0,0.4)] hover:scale-105 active:scale-95"
            >
              Start Your Story
              <div className="absolute inset-0 rounded-full bg-white/20 scale-0 group-hover:scale-100 transition-transform duration-700 pointer-events-none" />
            </button>
          </div>
          <p className="mt-8 text-white/30 text-[10px] font-bold tracking-[0.4em] uppercase">No commitments. Just results.</p>
        </div>
      </div>
    </section>
  );
}
