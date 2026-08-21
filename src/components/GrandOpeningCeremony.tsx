import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Scissors,
  RotateCcw,
  ArrowRight,
  MapPin,
  Dumbbell,
  Flame,
  Music2,
  Zap,
} from 'lucide-react';
import { IMAGES } from './image_constant';

const BELLANDUR_ADDRESS =
  '2nd & 3rd Floor, 71/1, Opp EcoWorld South Gate, Bhoganahalli, Bellandur, Bengaluru, Karnataka 560103';

const CLASS_PILLS = [
  'CrossFit',
  'HIIT',
  'Zumba',
  'Yoga',
  'Dance',
  'Kickboxing',
];

export default function GrandOpeningCeremony() {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const triggerCelebrationConfetti = () => {
    try {
      const count = 120;
      const defaults = {
        origin: { y: 0.55 },
        zIndex: 100,
        disableForReducedMotion: true,
      };

      const fire = (particleRatio: number, opts: confetti.Options) => {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
          colors: ['#ff5000', '#ff7a38', '#ffa366', '#ffffff', '#ffd1b8', '#f5d9a6'],
        });
      };

      fire(0.25, { spread: 40, startVelocity: 45 });
      fire(0.2, { spread: 60 });
      fire(0.35, { spread: 100, decay: 0.91, scalar: 0.85 });
      fire(0.1, { spread: 120, startVelocity: 25, decay: 0.92, scalar: 1.2 });
      fire(0.1, { spread: 120, startVelocity: 45 });
    } catch {
      // Graceful fallback
    }
  };

  const handleOpenCurtains = () => {
    if (curtainsOpen) return;
    setCurtainsOpen(true);
    setTimeout(() => triggerCelebrationConfetti(), 1300);
  };

  const handleReplayCeremony = () => {
    setCurtainsOpen(false);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAutoOpened) {
            setHasAutoOpened(true);
            setTimeout(() => handleOpenCurtains(), 500);
          }
        });
      },
      { threshold: 0.25 },
    );

    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [hasAutoOpened]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 1000);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 650);

    const handleResize = () => {
      if (!canvas?.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = Array.from({ length: 24 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2.2 + 0.6,
      speedY: -(Math.random() * 0.35 + 0.12),
      speedX: (Math.random() - 0.5) * 0.2,
      opacity: Math.random() * 0.5 + 0.15,
      fadeSpeed: Math.random() * 0.01 + 0.003,
      color: ['rgba(255,80,0,', 'rgba(255,122,56,', 'rgba(245,217,166,'][
        Math.floor(Math.random() * 3)
      ],
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fadeSpeed;
        if (p.opacity > 0.7 || p.opacity < 0.1) p.fadeSpeed = -p.fadeSpeed;
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.opacity))})`;
        ctx.fill();
      });
      animationFrameId = requestAnimationFrame(render);
    };

    render();
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 6, y: -y * 6 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  return (
    <section className="py-10 sm:py-14 md:py-20 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={containerRef}>
        <div className="relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden min-h-[580px] border border-[#ff5000]/20 shadow-[0_40px_100px_rgba(255,80,0,0.18),0_0_0_1px_rgba(255,255,255,0.6)_inset] bg-gradient-to-br from-[#fffaf7] via-[#fff3eb] to-[#ffe4d4]">
          {/* Ambient glow */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-32 -right-20 w-[500px] h-[500px] rounded-full bg-[#ff5000]/20 blur-[120px]" />
            <div className="absolute -bottom-32 -left-20 w-[400px] h-[400px] rounded-full bg-[#f5d9a6]/50 blur-[100px]" />
          </div>

          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-40" />

          {/* Top bar */}
          <div className="relative z-40 flex items-center justify-between px-5 sm:px-8 py-4 border-b border-[#ff5000]/10 bg-white/50 backdrop-blur-md">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5000] opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-[#ff5000]" />
              </span>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.28em] text-[#c45a28]">
                Grand Opening
              </span>
            </div>
            {curtainsOpen && (
              <button
                type="button"
                onClick={handleReplayCeremony}
                className="inline-flex items-center gap-1.5 text-[11px] font-bold text-[#ff5000] hover:text-white hover:bg-[#ff5000] px-3 py-1.5 rounded-full border border-[#ff5000]/30 transition-all duration-300"
              >
                <RotateCcw size={12} />
                Replay
              </button>
            )}
          </div>

          {curtainsOpen && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-[#ff5000]/25 rounded-full blur-[100px] pointer-events-none grand-light-burst z-[15]" />
          )}

          {/* Main content */}
          <div
            className={`relative z-20 p-5 sm:p-8 lg:p-10 transition-all duration-1000 ${
              curtainsOpen ? 'opacity-100 blur-0' : 'opacity-0 blur-md scale-[0.98]'
            }`}
          >
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-10 items-center">
              {/* Image — cinematic frame */}
              <div
                className={`go-reveal-1 relative ${curtainsOpen ? '' : 'pointer-events-none'}`}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className="absolute -inset-1 rounded-[1.75rem] bg-gradient-to-br from-[#ff5000] via-[#ff8c56] to-[#f5d9a6] opacity-60 blur-sm" />
                <div
                  className="relative rounded-[1.5rem] overflow-hidden go-image-shine shadow-[0_30px_70px_rgba(255,80,0,0.25)] ring-1 ring-white/80"
                  style={{
                    transform: `perspective(800px) rotateY(${tilt.x}deg) rotateX(${tilt.y}deg)`,
                    transition: 'transform 0.3s ease-out',
                  }}
                >
                  <div className="aspect-video w-full">
                    <img
                      src={IMAGES.Branches.bellandur}
                      alt="Game On Fitness Luxury Club Bellandur"
                      className="w-full h-full object-cover object-center"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#2a1410]/50 via-transparent to-transparent pointer-events-none" />

                  {/* Price sticker */}
                  <div className="go-price-pulse absolute bottom-4 left-4 flex items-end gap-2">
                    <div className="px-4 py-2.5 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-white">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#8a6a58] mb-0.5">
                        Annual
                      </p>
                      <p className="font-display text-2xl sm:text-3xl font-black text-[#ff5000] leading-none">
                        ₹18,999
                      </p>
                      <p className="text-xs text-[#8a6a58] line-through mt-0.5">₹29,999</p>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-[#ff5000] text-white text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-lg">
                    <Sparkles size={11} className="fill-white" />
                    New Branch
                  </div>
                </div>
              </div>

              {/* Copy — editorial */}
              <div className="space-y-5 sm:space-y-6">
                <div className={curtainsOpen ? 'go-reveal-2' : ''}>
                  <p className="text-[11px] font-bold uppercase tracking-[0.35em] text-[#ff5000] mb-3">
                    Coming Soon · Bellandur
                  </p>
                  <h3 className="font-display text-[2rem] sm:text-4xl lg:text-[2.6rem] font-black text-[#2a1410] leading-[1.08] tracking-tight mb-4">
                    Dear Bellandur,
                  </h3>
                  <p className="text-[#5c3a2a] text-base sm:text-lg leading-relaxed mb-2">
                    Your &ldquo;I&apos;ll start Monday&rdquo; era is officially under threat.{' '}
                    <span aria-hidden>🙂</span>
                  </p>
                  <p className="text-[#5c3a2a] text-base sm:text-lg leading-relaxed">
                    <span className="font-bold text-[#ff5000]">Game On Fitness Luxury Club</span>{' '}
                    is coming — and we&apos;re not exactly coming quietly.
                  </p>
                </div>

                {/* Highlights row */}
                <div className={`grid grid-cols-3 gap-2 sm:gap-3 ${curtainsOpen ? 'go-reveal-3' : ''}`}>
                  {[
                    { icon: Dumbbell, label: 'Big Gym' },
                    { icon: Flame, label: 'Bigger Energy' },
                    { icon: Music2, label: 'Dance Studio' },
                  ].map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-1.5 p-3 sm:p-4 rounded-2xl bg-white/70 border border-[#ffd7c0]/80 backdrop-blur-sm text-center shadow-sm"
                    >
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff7a3d] to-[#ff5e1a] flex items-center justify-center text-white shadow-md">
                        <Icon size={16} />
                      </div>
                      <span className="text-[10px] sm:text-xs font-bold text-[#5c3a2a] leading-tight">
                        {label}
                      </span>
                    </div>
                  ))}
                </div>

               

                {/* Location + tagline */}
                <div className={curtainsOpen ? 'go-reveal-4' : ''}>
                  <div className="flex items-start gap-3 p-4 rounded-2xl bg-gradient-to-r from-[#ff5000]/10 to-transparent border border-[#ff5000]/20">
                    <div className="w-10 h-10 rounded-xl bg-[#ff5000] flex items-center justify-center shrink-0 shadow-[0_8px_20px_rgba(255,80,0,0.35)]">
                      <MapPin size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#2a1410] mb-1">Opp. Eco World South Gate</p>
                      <p className="text-xs sm:text-sm text-[#6f5a4a] leading-relaxed">{BELLANDUR_ADDRESS}</p>
                    </div>
                  </div>
                  <p className="mt-4 text-sm text-[#8a6a58] italic font-medium">
                    Your excuses have been notified. <span aria-hidden>👀</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Curtains */}
          <div
            className={`absolute top-[53px] bottom-0 left-0 w-1/2 z-30 theatre-curtain-fabric-left transition-all duration-[1800ms] ease-[cubic-bezier(0.77,0,0.175,1)] pointer-events-none origin-left ${
              curtainsOpen ? '-translate-x-[92%] scale-x-[0.16] opacity-90' : 'translate-x-0 scale-x-100 opacity-100'
            }`}
          >
            <div className="absolute bottom-0 inset-x-0 h-5 curtain-gold-fringe" />
            <div className="absolute top-0 bottom-0 right-0 w-3 curtain-gold-trim" />
          </div>
          <div
            className={`absolute top-[53px] bottom-0 right-0 w-1/2 z-30 theatre-curtain-fabric-right transition-all duration-[1800ms] ease-[cubic-bezier(0.77,0,0.175,1)] pointer-events-none origin-right ${
              curtainsOpen ? 'translate-x-[92%] scale-x-[0.16] opacity-90' : 'translate-x-0 scale-x-100 opacity-100'
            }`}
          >
            <div className="absolute bottom-0 inset-x-0 h-5 curtain-gold-fringe" />
            <div className="absolute top-0 bottom-0 left-0 w-3 curtain-gold-trim" />
          </div>

          {/* Curtain overlay */}
          {!curtainsOpen && (
            <div className="absolute inset-0 z-[35] flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#fff6ef]/80 via-[#ffe8d6]/70 to-[#fff6ef]/80 backdrop-blur-sm">
              <div className="ribbon-sway-anim absolute inset-x-0 top-1/2 -translate-y-1/2 h-12 bg-gradient-to-r from-[#ff5000] via-[#ff7033] to-[#ff5000] opacity-90 pointer-events-none" />

              <div className="relative z-10 mb-5">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#ff8c56] to-[#ff5000] p-1 shadow-[0_0_40px_rgba(255,80,0,0.5)] seal-pulse-anim mx-auto flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                    <Sparkles size={32} className="text-[#ff5000] fill-[#ff5000]" />
                  </div>
                </div>
              </div>

              <p className="relative z-10 text-[11px] font-bold uppercase tracking-[0.35em] text-[#ff5000] mb-3">
                Something big is coming
              </p>

              <h3 className="relative z-10 font-display text-3xl sm:text-5xl font-black text-[#2a1410] leading-tight max-w-xl mb-3">
                Dear Bellandur,{' '}
                <span className="italic text-[#ff5000]">ready?</span>
              </h3>

              <p className="relative z-10 text-[#6f5a4a] text-sm sm:text-base max-w-md mb-8 leading-relaxed">
                Cut the ribbon. Draw the curtains. See Bengaluru&apos;s next luxury fitness club first.
              </p>

              <button
                type="button"
                onClick={handleOpenCurtains}
                className="relative z-10 group inline-flex items-center gap-2.5 px-8 py-4 rounded-full bg-[#ff5000] hover:bg-[#e04800] text-white font-bold text-sm sm:text-base shadow-[0_16px_40px_rgba(255,80,0,0.45)] hover:shadow-[0_20px_50px_rgba(255,80,0,0.55)] hover:scale-105 active:scale-95 transition-all duration-300"
              >
                <Scissors size={18} className="group-hover:rotate-45 transition-transform" />
                Cut Ribbon & Reveal
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
