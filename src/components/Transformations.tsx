import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { IMAGES } from './image_constant';

const beforeImages = Object.values(IMAGES.Before);

interface TransformationCardProps {
  image: string;
  index: number;
  label: string;
}

function TransformationCard({ image, index, label }: TransformationCardProps) {
  return (
    <div className="glass-card rounded-2xl overflow-hidden group hover:border-orange-500/30 transition-all duration-500">
      <div className="relative h-80 overflow-hidden">
        <img
          src={image}
          alt={`Transformation ${index} - ${label}`}
          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-[2s] ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        
        {/* Label */}
        <div className="absolute top-4 left-4">
          <div className={`px-4 py-2 rounded-full ${
            label === 'Before' 
              ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
              : 'bg-gradient-to-r from-emerald-500 to-emerald-600'
          }`}>
            <span className="text-white font-black text-xs tracking-wider uppercase">{label}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Transformations() {
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: gridRef, isVisible: gridVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.05 });

  return (
    <section id="trainers" className="relative py-32 overflow-hidden" style={{ background: '#060606' }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(245,200,66,0.4) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      {/* Decorative dots grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
        }}
      />

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headRef} className="text-center mb-20">
          <div className={`reveal ${headVisible ? 'visible' : ''}`}>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#ffb800] mb-4 block">Real Results</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-none mb-6">
              <span className="text-white">PROOF IN</span>
              <br />
              <span className="gradient-text-gold">EVERY BODY.</span>
            </h2>
            <div className="divider-glow-gold max-w-xs mx-auto mb-8" />
            <p className="text-white/50 max-w-xl mx-auto leading-relaxed">
              Drag the slider to reveal real transformations achieved by our members
              under the guidance of our elite coaching team.
            </p>
          </div>
        </div>

        {/* Success stats banner */}

        {/* Transformation Cards - All Separate */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {beforeImages.map((img, i) => (
            <div
              key={i}
              className={`reveal-scale ${gridVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 0.1}s` }}
            >
              <TransformationCard
                image={img}
                index={i + 1}
                label={i % 2 === 0 ? 'Before' : 'After'}
              />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`reveal ${gridVisible ? 'visible' : ''} text-center mt-16`}>
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
