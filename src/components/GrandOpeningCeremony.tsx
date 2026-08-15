import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  MapPin,
  Flame,
  Zap,
  Layers,
  Shield,
  Send,
  CheckCircle2,
  Scissors,
  RotateCcw,
  ArrowRight,
} from 'lucide-react';
import { IMAGES } from './image_constant';

export default function GrandOpeningCeremony() {
  const [curtainsOpen, setCurtainsOpen] = useState(false);
  const [hasAutoOpened, setHasAutoOpened] = useState(false);
  const [waitlistPhone, setWaitlistPhone] = useState('');
  const [joinedWaitlist, setJoinedWaitlist] = useState(false);
  const [claimedPercentage, setClaimedPercentage] = useState(0);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Trigger celebration confetti with Game On brand colors: Electric Orange, Pure White & Amber
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
          colors: ['#ff5000', '#ff7a38', '#ffa366', '#ffffff', '#ffd1b8', '#ff3700'],
        });
      };

      fire(0.25, {
        spread: 40,
        startVelocity: 45,
      });
      fire(0.2, {
        spread: 60,
      });
      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.85,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });
      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    } catch {
      // Graceful fallback
    }
  };

  // Open curtains sequence
  const handleOpenCurtains = () => {
    if (curtainsOpen) return;
    setCurtainsOpen(true);

    // Stagger progress animation
    setTimeout(() => {
      setClaimedPercentage(84);
    }, 1000);

    // Fire celebration confetti when curtains are parted
    setTimeout(() => {
      triggerCelebrationConfetti();
    }, 1300);
  };

  // Re-draw curtains to allow replaying the grand opening experience
  const handleReplayCeremony = () => {
    setCurtainsOpen(false);
    setClaimedPercentage(0);
  };

  // Auto trigger reveal when scrolled into view
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

  // Floating orange ambient particles canvas
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
      'rgba(255, 180, 140, ',
      'rgba(255, 255, 255, ',
    ];

    for (let i = 0; i < 30; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 2.2 + 0.8,
        speedY: -(Math.random() * 0.4 + 0.15),
        speedX: (Math.random() - 0.5) * 0.25,
        opacity: Math.random() * 0.7 + 0.2,
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

        if (p.opacity > 0.85 || p.opacity < 0.15) {
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
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ff5000';
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

  // 3D Parallax Tilt on mouse movement over gym image
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: x * 8, y: -y * 8 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (waitlistPhone.trim().length >= 10) {
      setJoinedWaitlist(true);
      triggerCelebrationConfetti();
    }
  };

  return (
    <section className="py-8 sm:py-12 md:py-16 relative overflow-hidden bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10" ref={containerRef}>
        {/* THEATRICAL CEREMONY STAGE FRAME (Game On Signature #16181f Obsidian & Fiery #ff5000 Orange) */}
        <div className="relative rounded-[2.5rem] bg-[#16181f] border-2 border-[#ff5000]/30 shadow-[0_35px_100px_rgba(255,80,0,0.18),0_20px_60px_rgba(22,24,31,0.5)] overflow-hidden min-h-[640px]">
          {/* Internal Volumetric Orange Atmosphere */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            <div className="absolute top-0 right-1/4 w-[650px] h-[450px] bg-gradient-to-b from-[#ff5000]/25 via-[#ff5000]/10 to-transparent rounded-full blur-[120px]" />
            <div className="absolute -bottom-20 -left-20 w-[500px] h-[500px] bg-[#ff5000]/15 rounded-full blur-[100px]" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(15,17,23,0.85)_100%)]" />
          </div>

          {/* Canvas Floating Ambient Particles */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-10 opacity-70"
          />

          {/* Top Stage Header Bar */}
          <div className="relative z-40 bg-[#0f1015]/95 border-b border-white/10 py-4 px-6 sm:px-10 flex items-center justify-between shadow-xl">
            <div className="flex items-center gap-3">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5000] opacity-80" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff5000] shadow-[0_0_10px_#ff5000]" />
              </span>
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold uppercase tracking-[0.25em]">
                <span className="text-white/80 hidden sm:inline">Grand Inauguration Ceremony •</span>
                <span className="text-[#ff5000] font-black">Flagship Sanctuary</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {curtainsOpen && (
                <button
                  type="button"
                  onClick={handleReplayCeremony}
                  className="inline-flex items-center gap-2 text-xs font-bold text-white bg-white/10 hover:bg-[#ff5000] px-4 py-2 rounded-full border border-white/20 hover:border-[#ff5000] transition-all duration-300 cursor-pointer shadow-md hover:shadow-[0_0_20px_rgba(255,80,0,0.5)] hover:scale-105 active:scale-95"
                >
                  <RotateCcw size={13} className="text-[#ff7a38] group-hover:text-white" />
                  <span>Replay Reveal ↺</span>
                </button>
              )}
            </div>
          </div>

          {/* STAGE LIGHT BURST ON REVEAL */}
          {curtainsOpen && (
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-b from-[#ff5000]/30 via-[#ff7a38]/15 to-transparent rounded-full blur-[110px] pointer-events-none grand-light-burst z-15" />
          )}

          {/* MAIN UNVEILED CONTENT BEHIND THE CURTAINS */}
          <div
            className={`relative z-20 p-6 sm:p-10 lg:p-12 transition-all duration-1000 ${
              curtainsOpen ? 'opacity-100 blur-0 translate-y-0' : 'opacity-20 blur-sm translate-y-4'
            }`}
          >
            <div className="grid lg:grid-cols-[1.1fr_1.3fr] gap-8 lg:gap-12 items-center">
              {/* Left Column: Flagship Visual with 3D Tilt */}
              <div
                className="relative min-h-[360px] sm:min-h-[440px] lg:min-h-[500px] rounded-3xl overflow-hidden border-2 border-[#ff5000]/40 shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_40px_rgba(255,80,0,0.25)] group perspective-1000"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div
                  className="w-full h-full absolute inset-0 transition-transform duration-300 ease-out"
                  style={{
                    transform: `rotateY(${tilt.x}deg) rotateX(${tilt.y}deg) scale3d(1.02, 1.02, 1.02)`,
                  }}
                >
                  <img
                    src={IMAGES.Branches.kasavanahalli}
                    alt="Game On Indiranagar Flagship Club"
                    className={`w-full h-full object-cover brightness-100 group-hover:scale-105 transition-all duration-1000 ${
                      curtainsOpen ? 'scale-100 filter-none' : 'scale-105 blur-[2px]'
                    }`}
                  />
                  {/* Clean shadow overlays */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f1015] via-[#0f1015]/30 to-transparent" />

                  {/* Top Status Pill */}
                  <div className="absolute top-4 left-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#0f1015]/90 backdrop-blur-xl border border-[#ff5000]/60 text-white text-xs font-black tracking-[0.18em] uppercase shadow-2xl">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff5000] opacity-80" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#ff5000]" />
                    </span>
                    <span className="text-[#ff7a38]">Inauguration • Q3 2026</span>
                  </div>

                  {/* Top Right Live Badge */}
                  <div className="absolute top-4 right-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#ff5000] text-white text-[11px] font-black tracking-wider uppercase shadow-[0_0_20px_rgba(255,80,0,0.6)]">
                    <Sparkles size={13} className="fill-white" />
                    <span>FLAGSHIP</span>
                  </div>

                  {/* Bottom Glassmorphism Facility Ribbon */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 sm:p-5 rounded-2xl bg-[#0f1015]/90 backdrop-blur-xl border border-white/20 shadow-2xl group-hover:border-[#ff5000]/60 transition-colors">
                    <p className="text-[11px] font-black uppercase tracking-[0.22em] text-[#ff5000] mb-1">
                      Flagship Sanctuary • 100 Feet Road
                    </p>
                    <p className="font-display text-base sm:text-lg font-black text-white leading-snug">
                      18,000 Sq.Ft 3-Floor Arena • Thermal Plunge & Sauna
                    </p>
                  </div>
                </div>
              </div>

              {/* Right Column: Clean Game On Typography & VIP Founder Pass */}
              <div className="flex flex-col justify-between space-y-6">
                <div>
                  {/* Eyebrow Badge */}
                  <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#ff5000]/15 border border-[#ff5000]/40 text-xs font-black uppercase tracking-[0.25em] text-[#ff5000] mb-3.5 shadow-sm">
                    <Sparkles size={13} className="fill-[#ff5000]" />
                    <span>THE NEXT CHAPTER</span>
                  </div>

                  {/* Headline: Clean White + Radiant Orange Italic */}
                  <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.08] text-white mb-3">
                    <span>Indiranagar</span>{' '}
                    <span className="italic text-[#ff5000] drop-shadow-[0_0_25px_rgba(255,80,0,0.4)]">
                      Flagship Club
                    </span>
                  </h3>

                  {/* Address */}
                  <div className="flex items-start gap-2.5 text-white/90 text-sm sm:text-base font-medium mb-4">
                    <MapPin size={19} className="mt-0.5 shrink-0 text-[#ff5000]" />
                    <p className="leading-relaxed">
                      100 Feet Road, HAL 2nd Stage, Indiranagar • Bengaluru 560038
                    </p>
                  </div>

                  {/* Coming Soon Light-Sweep Announcement Banner */}
                  <div className="p-3.5 sm:p-4 rounded-2xl bg-gradient-to-r from-[#ff5000]/20 via-white/[0.04] to-transparent border border-[#ff5000]/40 mb-5 flex items-center justify-between shadow-md">
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#ff5000] animate-ping" />
                      <span className="text-xs sm:text-sm font-black uppercase tracking-[0.2em] text-white">
                        COMING SOON • Q3 2026 INAUGURATION
                      </span>
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-[#ff5000] text-white text-[11px] font-black tracking-wider hidden sm:inline shadow-sm">
                      EXCLUSIVE PREVIEW
                    </span>
                  </div>

                  <p className="text-white/80 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    Our most ambitious fitness club in Bengaluru. 18,000 sq.ft across 3 bespoke floors featuring imported Italian biomechanics, thermal contrast cold plunge pools, infrared sauna, and a 40m rooftop sprint turf.
                  </p>

                  {/* Clean 4-Grid Feature Cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#ff5000]/60 backdrop-blur-xl transition-all duration-300 group">
                      <div className="w-10 h-10 rounded-xl bg-[#ff5000] text-white flex items-center justify-center shadow-[0_4px_15px_rgba(255,80,0,0.35)] group-hover:scale-110 transition-transform shrink-0">
                        <Zap size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#ff7a38] transition-colors leading-tight">
                          18,000 Sq.Ft Club
                        </p>
                        <p className="text-[11px] font-medium text-white/60">3 Bespoke Floors</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#ff5000]/60 backdrop-blur-xl transition-all duration-300 group">
                      <div className="w-10 h-10 rounded-xl bg-[#ff5000] text-white flex items-center justify-center shadow-[0_4px_15px_rgba(255,80,0,0.35)] group-hover:scale-110 transition-transform shrink-0">
                        <Flame size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#ff7a38] transition-colors leading-tight">
                          Plunge & Sauna
                        </p>
                        <p className="text-[11px] font-medium text-white/60">Thermal Contrast Zone</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#ff5000]/60 backdrop-blur-xl transition-all duration-300 group">
                      <div className="w-10 h-10 rounded-xl bg-[#ff5000] text-white flex items-center justify-center shadow-[0_4px_15px_rgba(255,80,0,0.35)] group-hover:scale-110 transition-transform shrink-0">
                        <Layers size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#ff7a38] transition-colors leading-tight">
                          Sprint Turf
                        </p>
                        <p className="text-[11px] font-medium text-white/60">40m Rooftop Track</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 hover:border-[#ff5000]/60 backdrop-blur-xl transition-all duration-300 group">
                      <div className="w-10 h-10 rounded-xl bg-[#ff5000] text-white flex items-center justify-center shadow-[0_4px_15px_rgba(255,80,0,0.35)] group-hover:scale-110 transition-transform shrink-0">
                        <Shield size={18} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#ff7a38] transition-colors leading-tight">
                          Biomechanics
                        </p>
                        <p className="text-[11px] font-medium text-white/60">Imported Italian Gear</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* VIP FOUNDER PASS (Game On Signature Black + Electric Orange) */}
                <div className="relative p-6 sm:p-7 rounded-3xl bg-[#0f1015] border-2 border-[#ff5000]/50 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(255,80,0,0.2)] overflow-hidden">
                  <div className="flex items-center justify-between gap-2 mb-3.5">
                    <div className="flex items-center gap-2">
                      <Sparkles size={16} className="text-[#ff5000] fill-[#ff5000]" />
                      <p className="text-sm sm:text-base font-black uppercase tracking-[0.16em] text-white">
                        VIP Founder Golden Pass
                      </p>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#ff5000] text-white text-[11px] font-black uppercase tracking-wider shadow-[0_0_15px_rgba(255,80,0,0.5)] animate-pulse">
                      50 SPOTS ONLY
                    </span>
                  </div>

                  {/* High-Visibility Progress Bar */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-xs text-white/80 font-semibold mb-1.5">
                      <span>Inaugural Member Allocation</span>
                      <span className="text-[#ff5000] font-black text-sm">{claimedPercentage}% Claimed</span>
                    </div>
                    <div className="w-full h-2.5 rounded-full bg-black overflow-hidden border border-white/15">
                      <div
                        className="h-full bg-gradient-to-r from-[#ff5000] via-[#ff7a38] to-[#ff5000] rounded-full transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(255,80,0,0.8)]"
                        style={{ width: `${claimedPercentage}%` }}
                      />
                    </div>
                  </div>

                  {joinedWaitlist ? (
                    <div className="flex items-center gap-3 py-3.5 px-5 rounded-2xl bg-[#16a34a]/20 border-2 border-[#16a34a]/60 text-[#4ade80] text-sm font-bold shadow-lg">
                      <CheckCircle2 size={22} className="shrink-0 text-[#4ade80]" />
                      <span>Golden Pass Locked! You will receive your inaugural VIP invitation.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleWaitlistSubmit} className="flex flex-col sm:flex-row gap-2.5">
                      <input
                        type="tel"
                        required
                        placeholder="Enter phone number for VIP Invitation..."
                        value={waitlistPhone}
                        onChange={(e) => setWaitlistPhone(e.target.value)}
                        className="flex-1 px-5 py-3.5 rounded-full bg-black/80 border border-white/20 text-white placeholder-gray-400 text-sm font-medium focus:outline-none focus:border-[#ff5000] focus:ring-2 focus:ring-[#ff5000]/40 transition-all"
                      />
                      <button
                        type="submit"
                        className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full bg-gradient-to-r from-[#ff5000] to-[#e04800] hover:from-[#ff6a1a] hover:to-[#ff5000] text-white text-sm font-black tracking-wide shadow-[0_10px_28px_rgba(255,80,0,0.5)] hover:shadow-[0_14px_36px_rgba(255,80,0,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer shrink-0"
                      >
                        <span>Claim VIP Pass</span>
                        <Send size={15} />
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* LEFT REALISTIC THEATRE VELVET CURTAIN (Royal Crimson & Fiery Orange Sheen) */}
          <div
            className={`absolute top-[52px] bottom-0 left-0 w-1/2 z-30 theatre-curtain-fabric-left transition-all duration-[1800ms] ease-[cubic-bezier(0.77,0,0.175,1)] pointer-events-none origin-left ${
              curtainsOpen ? '-translate-x-[92%] scale-x-[0.16] opacity-90' : 'translate-x-0 scale-x-100 opacity-100'
            }`}
          >
            <div className="absolute bottom-0 inset-x-0 h-5 curtain-gold-fringe" />
            <div className="absolute top-0 bottom-0 right-0 w-3 curtain-gold-trim" />
            <div className="absolute top-1/4 right-3 w-4 h-32 rounded-full border-r-2 border-dashed border-[#ff5000] opacity-75 hidden sm:block" />
          </div>

          {/* RIGHT REALISTIC THEATRE VELVET CURTAIN (Royal Crimson & Fiery Orange Sheen) */}
          <div
            className={`absolute top-[52px] bottom-0 right-0 w-1/2 z-30 theatre-curtain-fabric-right transition-all duration-[1800ms] ease-[cubic-bezier(0.77,0,0.175,1)] pointer-events-none origin-right ${
              curtainsOpen ? 'translate-x-[92%] scale-x-[0.16] opacity-90' : 'translate-x-0 scale-x-100 opacity-100'
            }`}
          >
            <div className="absolute bottom-0 inset-x-0 h-5 curtain-gold-fringe" />
            <div className="absolute top-0 bottom-0 left-0 w-3 curtain-gold-trim" />
            <div className="absolute top-1/4 left-3 w-4 h-32 rounded-full border-l-2 border-dashed border-[#ff5000] opacity-75 hidden sm:block" />
          </div>

          {/* CLOSED CURTAIN CEREMONY INAUGURATION OVERLAY & ACTION BUTTON */}
          {!curtainsOpen && (
            <div className="absolute inset-0 z-35 flex flex-col items-center justify-center p-6 text-center bg-black/60 backdrop-blur-[2px]">
              {/* Ceremonial Crimson Ribbon */}
              <div className="ribbon-sway-anim absolute inset-x-0 top-1/2 -translate-y-1/2 h-16 bg-gradient-to-r from-[#881337] via-[#e11d48] to-[#881337] border-y-2 border-[#ff5000] shadow-[0_0_40px_rgba(225,29,72,0.8)] pointer-events-none flex items-center justify-center opacity-95">
                <div className="curtain-gold-trim h-1 w-full" />
              </div>

              {/* 3D Wax Seal */}
              <div className="relative z-10 w-22 h-22 rounded-full bg-gradient-to-br from-[#ff5000] via-[#ff7a38] to-[#b91c1c] p-1.5 shadow-[0_0_60px_rgba(255,80,0,0.9)] seal-pulse-anim mb-4 flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-[#16181f] border-2 border-[#ff5000] flex items-center justify-center text-[#ff5000]">
                  <Sparkles size={36} className="fill-[#ff5000] animate-spin" style={{ animationDuration: '8s' }} />
                </div>
              </div>

              {/* Stage Pill */}
              <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/85 border border-[#ff5000]/70 text-[#ff7a38] text-xs font-black tracking-[0.25em] uppercase mb-4 shadow-2xl backdrop-blur-md">
                <span>Grand Inauguration Ceremony</span>
              </div>

              {/* Main Headline */}
              <h3 className="relative z-10 font-display text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight max-w-2xl mb-3 drop-shadow-[0_4px_25px_rgba(0,0,0,0.95)]">
                Behind this velvet curtain lies the{' '}
                <span className="italic text-[#ff5000] drop-shadow-[0_0_30px_rgba(255,80,0,0.6)]">
                  next flagship sanctuary.
                </span>
              </h3>

              <p className="relative z-10 text-white/90 text-sm sm:text-base max-w-lg mx-auto mb-7 drop-shadow leading-relaxed font-medium">
                Step up to the ceremonial stage, snip the inaugural ribbon, and unveil Karnataka's most ambitious luxury club.
              </p>

              {/* Action Trigger Button */}
              <button
                type="button"
                onClick={handleOpenCurtains}
                className="relative z-10 group inline-flex items-center gap-3 px-8 sm:px-10 py-4 sm:py-4.5 rounded-full bg-gradient-to-r from-[#ff5000] via-[#ff6a1a] to-[#ff5000] hover:from-[#e04800] hover:to-[#ff5000] text-white font-display font-black text-sm sm:text-base tracking-wide shadow-[0_15px_45px_rgba(255,80,0,0.65)] hover:shadow-[0_20px_65px_rgba(255,80,0,0.9)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
              >
                <Scissors size={20} className="fill-white group-hover:rotate-45 transition-transform" />
                <span>CUT RIBBON & DRAW CURTAINS</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
