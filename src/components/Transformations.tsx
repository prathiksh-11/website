import { useEffect, useState } from 'react';
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
    <div className="relative flex-shrink-0 w-72 h-96 rounded-3xl overflow-hidden group cursor-pointer">
      {/* Image */}
      <img
        src={image}
        alt={`Transformation ${index} - ${label}`}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
      
      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: 'inset 0 0 0 2px rgba(255,184,0,0.4)',
        }}
      />
      
      {/* Label */}
      <div className="absolute top-5 left-5">
        <div className={`px-4 py-2 rounded-full backdrop-blur-md border ${
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
          <p className="text-white/60 text-xs tracking-wider uppercase mb-1">Transformation</p>
          <p className="text-white font-bold text-lg">Member #{String(index).padStart(2, '0')}</p>
        </div>
      </div>

      {/* Corner accent */}
      <div className="absolute top-0 right-0 w-20 h-20 opacity-20 group-hover:opacity-40 transition-opacity duration-500">
        <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-[#ffb800] rounded-tr-2xl" />
      </div>
    </div>
  );
}

export default function Transformations() {
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScrollPosition((prev) => {
        const newPosition = prev + 0.8;
        const cardWidth = 320; // 288px card + 32px gap
        const singleSetWidth = cardWidth * beforeImages.length;
        
        // Reset to create infinite loop effect
        if (newPosition >= singleSetWidth) {
          return 0;
        }
        return newPosition;
      });
    }, 25);

    return () => clearInterval(interval);
  }, []);

  return (
    <section id="trainers" className="relative py-32 overflow-hidden" style={{ background: '#060606' }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/3 left-1/4 w-[600px] h-[600px] rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, rgba(255,184,0,0.3) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full opacity-5"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headRef} className="text-center mb-20">
          <div className={`reveal ${headVisible ? 'visible' : ''}`}>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#ffb800] mb-4 block">Real Results</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-none mb-6">
              <span className="text-white">TRANSFORMATIONS</span>
              <br />
              <span className="gradient-text-gold">THAT INSPIRE.</span>
            </h2>
            <div className="divider-glow-gold max-w-xs mx-auto mb-8" />
            <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
              Real people. Real results. Witness the incredible journeys 
              of our members under expert guidance.
            </p>
          </div>
        </div>

        {/* Auto-scrolling carousel */}
        <div className="relative">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#060606] via-[#060606]/80 to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#060606] via-[#060606]/80 to-transparent z-10 pointer-events-none" />
          
          <div
            className="flex gap-8"
            style={{
              transform: `translateX(-${scrollPosition}px)`,
              willChange: 'transform',
            }}
          >
            {duplicatedImages.map((img, i) => (
              <TransformationCard
                key={i}
                image={img}
                index={(i % beforeImages.length) + 1}
                label={(i % 2 === 0) ? 'Before' : 'After'}
              />
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-20">
          <p className="text-white/40 text-sm mb-6">Ready to write your own success story?</p>
          <button
            onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-glow-gold text-black font-bold px-10 py-4 rounded-full text-sm tracking-wider uppercase"
          >
            Get Your Free Consultation
          </button>
        </div>
      </div>
    </section>
  );
}
