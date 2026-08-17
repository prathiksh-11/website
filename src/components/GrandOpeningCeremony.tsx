import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Scissors,
  RotateCcw,
  ArrowRight,
  MapPin,
  EyeOff,
} from 'lucide-react';

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

    setTimeout(() => {
      triggerCelebrationConfetti();
    }, 1300);
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
            setTimeout(() => {
              handleOpenCurtains();
            }, 500);
          }
        });
      },
      { threshold: 0.25 }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

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
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles: Array<{
      x: number;
      y: number;
      size: number;
      speedY: number;
      speedX: number;
      opacity: number;
      fadeSpeed: number;
      color: string;
    }> = [];

    const colors = [
      'rgba(255, 80, 0, ',
      'rgba(255, 122, 56, ',
      'rgba(245, 217, 166, ',
      'rgba(255, 180, 140, ',
    ];

    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.4 + 0.8,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.55 + 0.2,
        fadeSpeed: Math.random() * 0.01 + 0.003,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;
        p.opacity += p.fadeSpeed;

        if (p.opacity > 0.75 || p.opacity < 0.12) {
          p.fadeSpeed = -p.fadeSpeed;
        }

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color}${Math.max(0, Math.min(1, p.opacity))})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ffb089';
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
    setTilt({ x: x * 8, y: -y * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={containerRef}>
        <div className="relative rounded-[2.5rem] bg-gradient-to-br from-[#fffdfb] via-[#fff6ef] to-[#ffe8d6] border border-[#ffd7c0] shadow-[0_30px_90px_rgba(255,112,51,0.16),0_12px_40px_rgba(232,184,109,0.18)] overflow-hidden min-h-[640px]">
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-16 right-0 w-[620px] h-[420px] bg-gradient-to-b from-[#ffb089]/45 via-[#ffd7c0]/25 to-transparent rounded-full blur-[110px]" />
            <div className="absolute -bottom-24 -left-16 w-[480px] h-[480px] bg-[#f5d9a6]/40 rounded-full blur-[100px]" />
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[70%] h-[50%] bg-white/50 rounded-full blur-[90px]" />
          </div>

          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-60"
          />

          <div className="relative z-40 bg-white/70 backdrop-blur-xl border-b border-[#ffd7c0] py-4 px-6 sm:px-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5000] opacity-70" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff7033] shadow-[0_0_10px_#ffb089]" />
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.22em]">
                <span className="text-[#8a6a58] hidden sm:inline">Grand Opening •</span>
                <span className="text-[#ff5000] font-black">A New Chapter</span>
              </div>
            </div>

            {curtainsOpen && (
              <button
                type="button"
                onClick={handleReplayCeremony}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#c45a28] bg-white hover:bg-[#ff5000] hover:text-white px-4 py-2 rounded-full border border-[#ffd7c0] hover:border-[#ff5000] transition-all duration-300 cursor-pointer shadow-sm hover:shadow-[0_8px_24px_rgba(255,80,0,0.28)] hover:scale-105 active:scale-95"
              >
                <RotateCcw size={13} />
                <span>Replay Reveal</span>
              </button>
            )}
          </div>

          {curtainsOpen && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-b from-[#ffb089]/40 via-[#f5d9a6]/20 to-transparent rounded-full blur-[110px] pointer-events-none grand-light-burst z-15" />
          )}

          <div
            className={`relative z-20 p-6 sm:p-10 lg:p-12 transition-all duration-1000 ${
              curtainsOpen ? 'opacity-100 blur-0 translate-y-0' : 'opacity-20 blur-sm translate-y-4'
            }`}
          >
            <div className="grid lg:grid-cols-[1.1fr_1.3fr] gap-8 lg:gap-12 items-center">
              <div
                className="relative min-h-[360px] sm:min-h-[440px] lg:min-h-[500px] rounded-3xl overflow-hidden border border-[#ffd7c0] shadow-[0_24px_60px_rgba(255,112,51,0.22)] group perspective-1000"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="w-full h-full absolute inset-0 transition-transform duration-300 ease-out"
                  style={{
                    transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
                  }}
                >
                  <div
                    className={`absolute inset-0 bg-gradient-to-br from-[#2a1410] via-[#4a2218] to-[#1a0c08] transition-all duration-1000 ${
                      curtainsOpen ? 'scale-100' : 'scale-105'
                    }`}
                  />

                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      backgroundImage:
                        'repeating-linear-gradient(45deg, #ff5000 0, #ff5000 1px, transparent 0, transparent 50%), repeating-linear-gradient(-45deg, #f5d9a6 0, #f5d9a6 1px, transparent 0, transparent 50%)',
                      backgroundSize: '28px 28px',
                    }}
                  />

                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,80,0,0.35),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(245,217,166,0.2),transparent_40%)]" />

                  <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                    <div className="relative w-[78%] max-w-[320px] aspect-square">
                      <div className="absolute inset-0 rounded-[2rem] border-2 border-dashed border-[#ff8c56]/50 rotate-6 animate-pulse" />
                      <div className="absolute inset-4 rounded-[1.75rem] border border-[#f5d9a6]/30 -rotate-3" />
                      <div className="absolute inset-0 flex flex-col items-center justify-center rounded-[2rem] bg-black/35 backdrop-blur-md border border-white/10 shadow-[inset_0_0_60px_rgba(255,80,0,0.15)]">
                        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-[#ff8c56] to-[#ff5e1a] flex items-center justify-center shadow-[0_0_40px_rgba(255,80,0,0.5)] mb-4">
                          <EyeOff size={36} className="text-white" />
                        </div>
                        <p className="text-[10px] sm:text-xs font-black uppercase tracking-[0.35em] text-[#ffb089] mb-2">
                          Under Wraps
                        </p>
                        <p className="font-display text-2xl sm:text-3xl font-black text-white/90 tracking-tight">
                          ???
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute inset-0 bg-gradient-to-t from-[#1a0c08]/90 via-transparent to-[#2a1410]/40 pointer-events-none" />

                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/90 backdrop-blur-xl border border-[#ffd7c0] text-xs font-black tracking-[0.16em] uppercase shadow-[0_8px_24px_rgba(255,176,137,0.35)]">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5000] opacity-70" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff7033]" />
                    </span>
                    <span className="text-[#c45a28]">Coming Soon • Q3 2026</span>
                  </div>

                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#ff7a3d] to-[#ff5e1a] text-white text-[11px] font-black tracking-wider uppercase shadow-[0_8px_20px_rgba(255,80,0,0.35)]">
                    <EyeOff size={13} />
                    <span>Classified</span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 p-4 sm:p-5 rounded-2xl bg-white/88 backdrop-blur-xl border border-white/80 shadow-[0_12px_32px_rgba(255,176,137,0.28)]">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff5000] mb-1">
                      Luxury Club
                    </p>
                    <p className="font-display text-base sm:text-lg font-black text-[#5c3a2a] leading-snug">
                      Game On Fitness Luxury Club Bellandur
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#ffd7c0] text-xs font-black uppercase tracking-[0.25em] text-[#ff5000] mb-3.5 shadow-sm">
                    <Sparkles size={13} className="fill-[#ff5000]" />
                    <span>The Next Chapter</span>
                  </div>

                  <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.08] text-[#5c3a2a] mb-4">
                    Game On Fitness
                    <br />
                    <span className="italic text-[#ff5000]">Luxury Club Bellandur</span>
                  </h3>

                  <div className="p-3.5 sm:p-4 rounded-2xl bg-white/80 border border-[#ffd7c0] mb-5 flex items-center justify-between shadow-sm">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#ff5000] animate-ping" />
                      <span className="text-xs sm:text-sm font-black uppercase tracking-[0.18em] text-[#c45a28]">
                        Inauguration • Q3 2026
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#ff7a3d] to-[#ff5e1a] text-white text-[11px] font-black tracking-wider hidden sm:inline">
                      Exclusive
                    </span>
                  </div>

                  <p className="text-[#8a6a58] text-sm sm:text-base leading-relaxed mb-6">
                    A new luxury destination is taking shape in Bellandur. The full experience stays
                    under wraps for now — draw the curtains and be among the first to glimpse what&apos;s
                    coming.
                  </p>

                  <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-white/80 border border-[#ffeadc] backdrop-blur-xl shadow-sm">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#ff8c56] to-[#ff5e1a] text-white flex items-center justify-center shadow-[0_6px_16px_rgba(255,80,0,0.28)] shrink-0">
                      <MapPin size={18} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#5c3a2a] leading-tight">
                        Bellandur, Bengaluru
                      </p>
                      <p className="text-[11px] font-medium text-[#8a6a58]">
                        Details revealed at inauguration
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div
            className={`absolute top-[52px] bottom-0 left-0 w-1/2 z-30 theatre-curtain-fabric-left transition-all duration-[1800ms] ease-[cubic-bezier(0.77,0,0.175,1)] pointer-events-none origin-left ${
              curtainsOpen ? '-translate-x-[92%] scale-x-[0.16] opacity-90' : 'translate-x-0 scale-x-100 opacity-100'
            }`}
          >
            <div className="absolute bottom-0 inset-x-0 h-5 curtain-gold-fringe" />
            <div className="absolute top-0 bottom-0 right-0 w-3 curtain-gold-trim" />
          </div>

          <div
            className={`absolute top-[52px] bottom-0 right-0 w-1/2 z-30 theatre-curtain-fabric-right transition-all duration-[1800ms] ease-[cubic-bezier(0.77,0,0.175,1)] pointer-events-none origin-right ${
              curtainsOpen ? 'translate-x-[92%] scale-x-[0.16] opacity-90' : 'translate-x-0 scale-x-100 opacity-100'
            }`}
          >
            <div className="absolute bottom-0 inset-x-0 h-5 curtain-gold-fringe" />
            <div className="absolute top-0 bottom-0 left-0 w-3 curtain-gold-trim" />
          </div>

          {!curtainsOpen && (
            <div className="absolute inset-0 z-35 flex flex-col items-center justify-center p-6 text-center bg-[#fff6ef]/55 backdrop-blur-[3px]">
              <div className="ribbon-sway-anim absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 bg-gradient-to-r from-[#ffb089] via-[#ff7033] to-[#ffb089] border-y-2 border-[#f5d9a6] shadow-[0_0_36px_rgba(255,112,51,0.45)] pointer-events-none flex items-center justify-center opacity-90">
                <div className="curtain-gold-trim h-1 w-full" />
              </div>

              <div className="relative z-10 w-22 h-22 rounded-full bg-gradient-to-br from-[#f5d9a6] via-[#ff8c56] to-[#ff5e1a] p-1.5 shadow-[0_0_50px_rgba(255,140,86,0.7)] seal-pulse-anim mb-4 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-white border-2 border-[#f5d9a6] flex items-center justify-center text-[#ff5000]">
                  <Sparkles size={36} className="fill-[#ff5000] animate-spin" style={{ animationDuration: '8s' }} />
                </div>
              </div>

              <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#ffd7c0] text-[#c45a28] text-xs font-black tracking-[0.25em] uppercase mb-4 shadow-md">
                <span>Grand Inauguration</span>
              </div>

              <h3 className="relative z-10 font-display text-3xl sm:text-5xl font-black text-[#5c3a2a] tracking-tight leading-tight max-w-2xl mb-3">
                Game On Fitness{' '}
                <span className="italic text-[#ff5000]">Luxury Club Bellandur</span>
              </h3>

              <p className="relative z-10 text-[#8a6a58] text-sm sm:text-base max-w-lg mx-auto mb-7 leading-relaxed">
                Cut the ribbon, draw the curtains, and be first to see what we have been building.
              </p>

              <button
                type="button"
                onClick={handleOpenCurtains}
                className="relative z-10 group inline-flex items-center gap-3 px-8 sm:px-10 py-4 rounded-full bg-gradient-to-r from-[#ff7a3d] via-[#ff8c56] to-[#ff7a3d] hover:from-[#ff6e2e] hover:to-[#ff7a3d] text-white font-display font-black text-sm sm:text-base tracking-wide shadow-[0_15px_45px_rgba(255,112,51,0.45)] hover:shadow-[0_20px_65px_rgba(255,112,51,0.6)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <Scissors size={20} className="fill-white group-hover:rotate-45 transition-transform" />
                <span>Cut Ribbon & Draw Curtains</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
