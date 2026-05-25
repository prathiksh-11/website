import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver, useCountUp } from '../hooks/useIntersectionObserver';

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 8 + 6,
  opacity: Math.random() * 0.6 + 0.2,
}));

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  start: boolean;
}

function StatItem({ value, suffix, label, start }: StatItemProps) {
  const count = useCountUp(value, 2000, start);
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-black gradient-text-blue">
        {count}{suffix}
      </div>
      <div className="text-xs text-white/40 tracking-widest uppercase mt-1">{label}</div>
    </div>
  );
}

export default function Hero() {
  const { ref: statsRef, isVisible: statsVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.3 });
  const heroRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = el.getBoundingClientRect();
      const x = ((clientX - left) / width - 0.5) * 20;
      const y = ((clientY - top) / height - 0.5) * 20;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
    };
    el.addEventListener('mousemove', onMouseMove);
    return () => el.removeEventListener('mousemove', onMouseMove);
  }, []);

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#050505]">
      {/* Animated background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 animate-gradient"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 animate-float-slow"
          style={{
            background: 'radial-gradient(circle, rgba(255,184,0,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animationDelay: '3s',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 60%)',
            filter: 'blur(120px)',
          }}
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.id % 3 === 0 ? '#ff6b35' : p.id % 3 === 1 ? '#ffb800' : '#ffffff',
              opacity: p.opacity,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              boxShadow: `0 0 ${p.size * 3}px currentColor`,
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,107,53,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,53,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Hero image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop"
          alt=""
          className="w-full h-full object-cover opacity-[0.9]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent hidden md:block" />
        <div className="absolute inset-0 bg-black/60 md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-12 md:pt-24 flex flex-col items-center md:items-start text-center md:text-left">
        {/* Heading */}
        <div className="max-w-4xl">
          <h1
            className={`font-black leading-[1.15] tracking-tight mb-4 transition-all duration-1000 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <span className="block text-[clamp(1.5rem,8vw,4.5rem)] text-white">ELEVATE YOUR</span>
            <span className="block text-[clamp(1.5rem,8vw,4.5rem)] gradient-text-gold">PERFORMANCE</span>
            <span className="block text-[clamp(1.5rem,8vw,4.5rem)] text-white">TO THE</span>
            <span className="block text-[clamp(1.5rem,8vw,4.5rem)] shimmer-text">GAME ON FITNESS.</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className={`text-sm md:text-lg text-white/50 max-w-2xl leading-relaxed mb-10 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          World-class fitness centers engineered for peak human performance.
          Transform your body. Elevate your mind. Redefine your limits.
        </p>
        

        <div
          ref={statsRef}
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <StatItem value={12} suffix="+" label="Elite Branches" start={statsVisible} />
          <StatItem value={50} suffix="K+" label="Active Members" start={statsVisible} />
          <StatItem value={98} suffix="%" label="Success Rate" start={statsVisible} />
          <StatItem value={15} suffix="+" label="Years of Excellence" start={statsVisible} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="divider-glow mb-0" />
        <div className="glass py-3">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
              {['State-of-the-Art Equipment', '24/7 Access', 'Expert Trainers', 'Nutrition Plans', 'Personal Coaching'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                  <div className="w-1 h-1 rounded-full bg-[#ff6b35]" />
                  <span className="text-xs text-white/50 tracking-wider uppercase">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
