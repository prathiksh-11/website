import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Star, Award, TrendingUp, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

const trainers = [
  {
    id: 1,
    name: 'Marcus Williams',
    title: 'Head of Performance',
    specialty: 'Strength & Conditioning',
    experience: '12 Years',
    certifications: ['CSCS', 'NSCA', 'FMS Level 2'],
    achievements: ['Trained 3 Olympic Athletes', 'Published Researcher', '500+ Transformations'],
    rating: 4.9,
    reviews: 312,
    avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop&facepad=3',
    transformation: {
      clientName: 'James T.',
      duration: '4 Months',
      beforeWeight: '248 lbs',
      afterWeight: '195 lbs',
      lost: '53 lbs',
      beforeImg: 'https://images.pexels.com/photos/4162455/pexels-photo-4162455.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      afterImg: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      quote: "Marcus completely changed my relationship with fitness. I'm not just lighter — I'm stronger, faster, and more confident than I've ever been.",
    },
  },
  {
    id: 2,
    name: 'Sofia Reyes',
    title: 'Elite Physique Coach',
    specialty: 'Body Recomposition',
    experience: '9 Years',
    certifications: ['NASM-CPT', 'PN Level 2', 'Pilates Certified'],
    achievements: ['Bikini Pro Competitor', 'Nutrition Expert', '400+ Clients Transformed'],
    rating: 5.0,
    reviews: 241,
    avatar: 'https://images.pexels.com/photos/3757942/pexels-photo-3757942.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop&facepad=3',
    transformation: {
      clientName: 'Sarah M.',
      duration: '6 Months',
      beforeWeight: '185 lbs',
      afterWeight: '142 lbs',
      lost: '43 lbs',
      beforeImg: 'https://images.pexels.com/photos/4498191/pexels-photo-4498191.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      afterImg: 'https://images.pexels.com/photos/3094215/pexels-photo-3094215.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      quote: "Working with Sofia is life-changing. Her holistic approach to fitness and nutrition finally helped me achieve results I thought were impossible.",
    },
  },
  {
    id: 3,
    name: 'Daniel Kim',
    title: 'Athletic Performance Coach',
    specialty: 'HIIT & Sports Performance',
    experience: '11 Years',
    certifications: ['ACSM-EP', 'EXOS Performance', 'TRX Master'],
    achievements: ['Former NFL Trainer', 'Speed & Power Specialist', '350+ Athletes Coached'],
    rating: 4.8,
    reviews: 189,
    avatar: 'https://images.pexels.com/photos/2379005/pexels-photo-2379005.jpeg?auto=compress&cs=tinysrgb&w=300&h=400&fit=crop&facepad=3',
    transformation: {
      clientName: 'Ryan K.',
      duration: '3 Months',
      beforeWeight: '210 lbs',
      afterWeight: '182 lbs',
      lost: '28 lbs',
      beforeImg: 'https://images.pexels.com/photos/4162487/pexels-photo-4162487.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      afterImg: 'https://images.pexels.com/photos/1547248/pexels-photo-1547248.jpeg?auto=compress&cs=tinysrgb&w=400&h=500&fit=crop',
      quote: "Daniel's intensity and expertise pushed me beyond every limit I thought I had. The results speak for themselves.",
    },
  },
];

interface TransformationCardProps {
  trainer: typeof trainers[0];
}

function TransformationCard({ trainer }: TransformationCardProps) {
  const [sliderPos, setSliderPos] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPos(Number(e.target.value));
  };

  return (
    <div className="glass-card rounded-2xl overflow-hidden trainer-card-border">
      {/* Transformation slider */}
      <div className="relative h-64 overflow-hidden select-none">
        {/* Before image */}
        <img
          src={trainer.transformation.beforeImg}
          alt="Before"
          className="absolute inset-0 w-full h-full object-cover opacity-80"
        />
        {/* After image with clip */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ width: `${sliderPos}%` }}
        >
          <img
            src={trainer.transformation.afterImg}
            alt="After"
            className="absolute inset-0 h-full object-cover opacity-90"
            style={{ width: `${10000 / sliderPos}%`, maxWidth: 'none' }}
          />
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 z-10"
          style={{
            left: `${sliderPos}%`,
            background: 'rgba(245,200,66,0.9)',
            boxShadow: '0 0 10px rgba(245,200,66,0.5)',
          }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#ffb800] flex items-center justify-center shadow-lg cursor-grab active:cursor-grabbing">
            <ChevronLeft size={10} className="text-black -mr-0.5" />
            <ChevronRight size={10} className="text-black -ml-0.5" />
          </div>
        </div>

        {/* Range input */}
        <input
          type="range"
          min="5"
          max="95"
          value={sliderPos}
          onChange={handleSliderChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize z-20"
        />

        {/* Labels */}
        <div className="absolute top-4 left-4 glass rounded-lg px-2.5 py-1 z-10">
          <span className="text-xs font-bold text-white/70">BEFORE</span>
        </div>
        <div className="absolute top-4 right-4 glass rounded-lg px-2.5 py-1 z-10">
          <span className="text-xs font-bold text-[#ffb800]">AFTER</span>
        </div>

        {/* Stats overlay */}
        <div className="absolute bottom-4 left-4 right-4 flex justify-between z-10">
          <div className="glass rounded-lg px-3 py-1.5">
            <div className="text-xs text-white/50">Duration</div>
            <div className="text-sm font-bold text-white">{trainer.transformation.duration}</div>
          </div>
          <div className="glass rounded-lg px-3 py-1.5 text-right">
            <div className="text-xs text-white/50">Lost</div>
            <div className="text-sm font-bold text-[#ffb800]">{trainer.transformation.lost}</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Quote */}
        <div className="mb-6">
          <Quote size={20} className="text-[#ffb800]/40 mb-2" />
          <p className="text-sm text-white/60 leading-relaxed italic">{trainer.transformation.quote}</p>
          <div className="flex items-center gap-2 mt-3">
            <div className="w-6 h-6 rounded-full bg-[#ffb800]/20 flex items-center justify-center">
              <span className="text-xs font-bold text-[#ffb800]">{trainer.transformation.clientName[0]}</span>
            </div>
            <span className="text-xs font-semibold text-white/70">— {trainer.transformation.clientName}</span>
          </div>
        </div>

        <div className="divider-glow-gold mb-5" />

        {/* Trainer info */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#ffb800]/30">
              <img src={trainer.avatar} alt={trainer.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#ffb800] flex items-center justify-center">
              <Award size={10} className="text-black" />
            </div>
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">{trainer.name}</h4>
            <p className="text-xs text-white/40">{trainer.title}</p>
            <div className="flex items-center gap-1 mt-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={10}
                  className={i < Math.floor(trainer.rating) ? 'star-rating fill-current' : 'text-white/20 fill-current'}
                />
              ))}
              <span className="text-xs text-white/40 ml-1">{trainer.rating} ({trainer.reviews})</span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-xs text-white/40">Experience</div>
            <div className="text-sm font-bold gradient-text-gold">{trainer.experience}</div>
          </div>
        </div>

        {/* Certifications */}
        <div className="mt-4 flex flex-wrap gap-1.5">
          {trainer.certifications.map((cert, i) => (
            <span
              key={i}
              className="text-xs px-2 py-0.5 rounded-full"
              style={{
                background: 'rgba(245,200,66,0.08)',
                border: '1px solid rgba(245,200,66,0.2)',
                color: 'rgba(245,200,66,0.7)',
              }}
            >
              {cert}
            </span>
          ))}
        </div>

        {/* Achievements */}
        <div className="mt-4 space-y-1.5">
          {trainer.achievements.map((ach, i) => (
            <div key={i} className="flex items-center gap-2">
              <TrendingUp size={11} className="text-[#ff6b35]/60 flex-shrink-0" />
              <span className="text-xs text-white/50">{ach}</span>
            </div>
          ))}
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

        {/* Trainer Cards */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-8"
        >
          {trainers.map((trainer, i) => (
            <div
              key={trainer.id}
              className={`reveal-scale ${gridVisible ? 'visible' : ''}`}
              style={{ transitionDelay: `${i * 0.15}s` }}
            >
              <TransformationCard trainer={trainer} />
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
