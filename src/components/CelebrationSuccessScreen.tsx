import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Sparkles,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  Download,
  Flame,
  ShieldCheck,
  Zap,
  MapPin,
  Calendar,
  Share2,
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';

export interface CelebrationDetail {
  icon?: typeof Trophy;
  label: string;
  value: string;
}

export interface CelebrationSuccessScreenProps {
  /** Main celebratory headline */
  headline?: string;
  /** Sub-headline or congratulations quote */
  subheadline?: string;
  /** Pass / Confirmation code */
  passCode?: string;
  /** Event / Tier Badge */
  badgeText?: string;
  /** Detailed key-value rows displayed inside the gold card */
  details?: CelebrationDetail[];
  /** Primary CTA button */
  primaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Secondary CTA button */
  secondaryAction?: {
    label: string;
    href?: string;
    onClick?: () => void;
  };
  /** Whether to render as a full page (with Navbar/Footer) or as an embedded container */
  isFullPage?: boolean;
  /** Auto start curtain opening on mount */
  autoOpen?: boolean;
}

const DEFAULT_DETAILS: CelebrationDetail[] = [
  {
    icon: MapPin,
    label: 'Destination',
    value: 'Indiranagar Flagship Sanctuary',
  },
  {
    icon: Zap,
    label: 'Membership Tier',
    value: 'VIP Founder Access (Lifetime)',
  },
  {
    icon: ShieldCheck,
    label: 'Inauguration Status',
    value: 'Priority Induction Verified',
  },
  {
    icon: Calendar,
    label: 'Ceremony Access',
    value: 'Inaugural Launch Q3 2026',
  },
];

export default function CelebrationSuccessScreen({
  headline = 'Congratulations!',
  subheadline = 'You have officially stepped into the next era of high-performance luxury fitness. Your VIP Founder Invitation is confirmed.',
  passCode = 'GO-FOUNDER-8842',
  badgeText = 'Grand Inauguration Ceremony • VIP Access Granted',
  details = DEFAULT_DETAILS,
  primaryAction = {
    label: 'Explore All Clubs',
    href: '/locations',
  },
  secondaryAction = {
    label: 'Download Mobile App',
    href: '/download',
  },
  isFullPage = true,
  autoOpen = true,
}: CelebrationSuccessScreenProps) {
  const [curtainsDrawn, setCurtainsDrawn] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);

  // Trigger curtain opening with smooth timing
  useEffect(() => {
    if (autoOpen) {
      const openTimer = setTimeout(() => {
        setCurtainsDrawn(true);
      }, 400);

      const confettiTimer = setTimeout(() => {
        setShowConfetti(true);
      }, 1000);

      return () => {
        clearTimeout(openTimer);
        clearTimeout(confettiTimer);
      };
    }
  }, [autoOpen]);

  const handleReplay = () => {
    setCurtainsDrawn(false);
    setShowConfetti(false);
    setTimeout(() => {
      setCurtainsDrawn(true);
      setTimeout(() => {
        setShowConfetti(true);
      }, 700);
    }, 450);
  };

  const handleCopyPass = () => {
    navigator.clipboard.writeText(passCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Generate 42 random confetti pieces with rich festive colors & physics
  const confettiPieces = useMemo(() => {
    const colors = [
      '#ff5000', // Game On flame
      '#fbbf24', // Gold
      '#f59e0b', // Amber
      '#ffffff', // Diamond white
      '#e11d48', // Royal crimson
      '#ff8c42', // Warm orange
      '#4ade80', // Emerald green
    ];

    return Array.from({ length: 42 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 96 + 2}%`,
      color: colors[i % colors.length],
      size: `${Math.floor(Math.random() * 8 + 6)}px`,
      aspectRatio: Math.random() > 0.4 ? '1/1' : '3/1',
      animationDuration: `${(Math.random() * 2.5 + 2.8).toFixed(2)}s`,
      animationDelay: `${(Math.random() * 1.5).toFixed(2)}s`,
      borderRadius: Math.random() > 0.6 ? '999px' : '2px',
    }));
  }, []);

  const content = (
    <div className="relative min-h-[92vh] flex items-center justify-center py-16 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#0a0b0e] text-white">
      {/* 1. THEATRICAL BACKSTAGE LIGHTING & ROTATING RAYS */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Deep ambient red-carpet glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[550px] bg-gradient-to-b from-[#ff5000]/25 via-[#fbbf24]/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute -bottom-24 left-1/4 w-[500px] h-[500px] bg-[#e11d48]/15 rounded-full blur-[100px]" />
        <div className="absolute -bottom-24 right-1/4 w-[500px] h-[500px] bg-[#ff5000]/15 rounded-full blur-[100px]" />

        {/* Rotating golden light rays behind the trophy */}
        <div className="celebration-rays absolute top-1/2 left-1/2 w-[900px] h-[900px] opacity-25">
          <div className="w-full h-full rounded-full bg-[radial-gradient(circle,rgba(251,191,36,0.35)_0%,rgba(255,80,0,0.15)_40%,transparent_70%)]" />
          <div
            className="w-full h-full absolute inset-0"
            style={{
              background:
                'conic-gradient(from 0deg at 50% 50%, rgba(251,191,36,0.2) 0deg, transparent 20deg, rgba(255,80,0,0.2) 45deg, transparent 65deg, rgba(251,191,36,0.2) 90deg, transparent 110deg, rgba(255,80,0,0.2) 135deg, transparent 155deg, rgba(251,191,36,0.2) 180deg, transparent 200deg, rgba(255,80,0,0.2) 225deg, transparent 245deg, rgba(251,191,36,0.2) 270deg, transparent 290deg, rgba(255,80,0,0.2) 315deg, transparent 335deg, rgba(251,191,36,0.2) 360deg)',
            }}
          />
        </div>

        {/* Subtle stage floor reflection grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.7) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.7) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* 2. CONFETTI RAIN BURST (TRIGGERED WHEN CURTAINS DRAW) */}
      {showConfetti && (
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-25">
          {confettiPieces.map((piece) => (
            <div
              key={piece.id}
              className="confetti-piece absolute top-0 shadow-sm"
              style={{
                left: piece.left,
                width: piece.size,
                height: piece.aspectRatio === '3/1' ? `calc(${piece.size} * 2.8)` : piece.size,
                backgroundColor: piece.color,
                borderRadius: piece.borderRadius,
                animation: `confettiDrift ${piece.animationDuration} cubic-bezier(0.25, 1, 0.5, 1) infinite`,
                animationDelay: piece.animationDelay,
                boxShadow: `0 0 10px ${piece.color}80`,
              }}
            />
          ))}
        </div>
      )}

      {/* 3. REVEALED SUCCESS CEREMONY STAGE */}
      <div className="relative z-20 max-w-2xl w-full mx-auto text-center">
        {/* Fireworks Spark Bursts */}
        <div className="firework-1 absolute -top-12 -left-12 w-28 h-28 rounded-full border-2 border-dashed border-[#fbbf24] pointer-events-none hidden sm:block">
          <div className="w-full h-full rounded-full bg-gradient-to-tr from-[#fbbf24]/20 to-transparent blur-sm" />
        </div>
        <div className="firework-2 absolute top-20 -right-10 w-32 h-32 rounded-full border-2 border-dashed border-[#ff5000] pointer-events-none hidden sm:block">
          <div className="w-full h-full rounded-full bg-gradient-to-bl from-[#ff5000]/20 to-transparent blur-sm" />
        </div>
        <div className="firework-3 absolute bottom-24 -left-14 w-36 h-36 rounded-full border-2 border-dashed border-[#fbbf24] pointer-events-none hidden sm:block">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-[#fbbf24]/20 to-transparent blur-sm" />
        </div>

        {/* Floating Golden Sparks */}
        <div className="celebration-sparkle absolute -top-8 left-12 text-[#fbbf24] hidden sm:block pointer-events-none">
          <Sparkles size={28} className="fill-[#fbbf24]" />
        </div>
        <div className="celebration-sparkle absolute top-16 right-8 text-[#ff5000] hidden sm:block pointer-events-none" style={{ animationDelay: '1.2s' }}>
          <Sparkles size={24} className="fill-[#ff5000]" />
        </div>

        {/* Grand Ceremony Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#ff5000]/20 via-[#fbbf24]/20 to-[#ff5000]/20 border border-[#fbbf24]/40 text-[#fbbf24] text-xs font-bold tracking-[0.25em] uppercase mb-6 shadow-[0_0_25px_rgba(251,191,36,0.3)]">
          <Sparkles size={14} className="fill-[#fbbf24] animate-spin" style={{ animationDuration: '6s' }} />
          <span>{badgeText}</span>
        </div>

        {/* 3D Animated Trophy / Celebration Icon */}
        <div className="celebration-trophy relative w-24 h-24 sm:w-28 sm:h-28 mx-auto mb-6 flex items-center justify-center">
          {/* Pulsing Outer Rings */}
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#ff5000] via-[#fbbf24] to-[#f59e0b] animate-ping opacity-25" />
          <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-[#ff5000]/30 via-[#fbbf24]/30 to-[#ff5000]/30 blur-md" />

          {/* Main Gold Emblem Container */}
          <div className="relative w-full h-full rounded-3xl bg-gradient-to-br from-[#1c1815] via-[#2a1a0f] to-[#120e0a] border-2 border-[#fbbf24] shadow-[0_15px_40px_rgba(251,191,36,0.4)] flex items-center justify-center transform hover:scale-105 transition-transform duration-300">
            <Trophy size={48} className="text-[#fbbf24] drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]" />
            <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-[#16a34a] border-2 border-[#0a0b0e] flex items-center justify-center text-white shadow-md">
              <CheckCircle2 size={18} />
            </div>
          </div>
        </div>

        {/* Headline & Narrative */}
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.06] mb-4">
          <span className="bg-gradient-to-r from-white via-white to-gray-200 bg-clip-text text-transparent">
            {headline.split(' ')[0]}{' '}
          </span>
          <span className="italic bg-gradient-to-r from-[#ff5000] via-[#fbbf24] to-[#ff8c42] bg-clip-text text-transparent">
            {headline.split(' ').slice(1).join(' ') || 'You’re In!'}
          </span>
        </h1>

        <p className="text-gray-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-xl mx-auto mb-8 font-medium">
          {subheadline}
        </p>

        {/* 4. VIP GOLD FOIL RESULT CARD */}
        <div className="relative rounded-3xl bg-gradient-to-b from-white/10 via-white/5 to-[#16181f]/80 border-2 border-[#fbbf24]/40 p-6 sm:p-8 backdrop-blur-2xl shadow-[0_30px_70px_rgba(0,0,0,0.6)] mb-8 overflow-hidden text-left">
          {/* Metallic Gold Shimmer Sweep */}
          <div className="gold-sweep-active absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none" />

          {/* Card Header & Pass Code */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-white/10 mb-6">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flame size={16} className="text-[#ff5000]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#fbbf24]">
                  VIP Founder Pass
                </span>
              </div>
              <p className="font-display text-xl sm:text-2xl font-black text-white tracking-wide">
                {passCode}
              </p>
            </div>

            <button
              onClick={handleCopyPass}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/15 text-xs font-semibold text-gray-200 transition-all cursor-pointer self-start sm:self-center"
            >
              <Share2 size={13} />
              <span>{copiedCode ? 'Pass Copied! ✓' : 'Copy Pass Code'}</span>
            </button>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {details.map((item, idx) => {
              const ItemIcon = item.icon || CheckCircle2;
              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3.5 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-sm"
                >
                  <div className="p-2 rounded-xl bg-[#ff5000]/15 text-[#ff7a38] shrink-0 mt-0.5">
                    <ItemIcon size={16} />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">
                      {item.label}
                    </p>
                    <p className="text-sm font-bold text-white leading-snug">{item.value}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 5. CALLS TO ACTION */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-6">
          {primaryAction.href ? (
            <Link
              to={primaryAction.href}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#ff5000] via-[#ff6a1a] to-[#e04800] text-white font-display font-extrabold text-sm sm:text-base tracking-wide shadow-[0_12px_35px_rgba(255,80,0,0.45)] hover:shadow-[0_16px_45px_rgba(255,80,0,0.6)] hover:-translate-y-0.5 transition-all duration-300"
            >
              <span>{primaryAction.label}</span>
              <ArrowRight size={18} />
            </Link>
          ) : (
            <button
              onClick={primaryAction.onClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-gradient-to-r from-[#ff5000] via-[#ff6a1a] to-[#e04800] text-white font-display font-extrabold text-sm sm:text-base tracking-wide shadow-[0_12px_35px_rgba(255,80,0,0.45)] hover:shadow-[0_16px_45px_rgba(255,80,0,0.6)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>{primaryAction.label}</span>
              <ArrowRight size={18} />
            </button>
          )}

          {secondaryAction.href ? (
            <Link
              to={secondaryAction.href}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm shadow-sm hover:-translate-y-0.5 transition-all duration-300"
            >
              <Download size={16} />
              <span>{secondaryAction.label}</span>
            </Link>
          ) : (
            <button
              onClick={secondaryAction.onClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-full bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-sm shadow-sm hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <Download size={16} />
              <span>{secondaryAction.label}</span>
            </button>
          )}

          {/* Replay Ceremony Button */}
          <button
            onClick={handleReplay}
            className="w-full sm:w-auto p-4 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all cursor-pointer flex items-center justify-center gap-2 text-xs font-semibold"
            title="Replay Celebration Ceremony"
          >
            <RotateCcw size={16} />
            <span className="sm:hidden">Replay Ceremony</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          6. THEATRICAL VELVET CURTAINS (LEFT & RIGHT)
          ======================================================== */}
      {/* Left Curtain */}
      <div
        className={`absolute inset-y-0 left-0 w-1/2 z-40 transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] pointer-events-none ${
          curtainsDrawn ? '-translate-x-full' : 'translate-x-0'
        }`}
        style={{
          background:
            'repeating-linear-gradient(90deg, #1c0f08 0px, #361709 25px, #1c0f08 50px, #421c0b 75px, #180c06 100px)',
          boxShadow: 'inset -35px 0 60px rgba(0,0,0,0.95), 15px 0 40px rgba(0,0,0,0.9)',
        }}
      >
        {/* Golden Fringe along bottom */}
        <div className="absolute bottom-0 inset-x-0 h-5 bg-gradient-to-r from-[#d97706] via-[#fbbf24] to-[#d97706] shadow-lg opacity-90" />
        {/* Golden Center Trim */}
        <div className="absolute top-0 bottom-0 right-0 w-3 bg-gradient-to-b from-[#d97706] via-[#fbbf24] to-[#d97706] shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
      </div>

      {/* Right Curtain */}
      <div
        className={`absolute inset-y-0 right-0 w-1/2 z-40 transition-transform duration-1000 ease-[cubic-bezier(0.77,0,0.175,1)] pointer-events-none ${
          curtainsDrawn ? 'translate-x-full' : 'translate-x-0'
        }`}
        style={{
          background:
            'repeating-linear-gradient(90deg, #180c06 0px, #421c0b 25px, #1c0f08 50px, #361709 75px, #1c0f08 100px)',
          boxShadow: 'inset 35px 0 60px rgba(0,0,0,0.95), -15px 0 40px rgba(0,0,0,0.9)',
        }}
      >
        {/* Golden Fringe along bottom */}
        <div className="absolute bottom-0 inset-x-0 h-5 bg-gradient-to-r from-[#d97706] via-[#fbbf24] to-[#d97706] shadow-lg opacity-90" />
        {/* Golden Center Trim */}
        <div className="absolute top-0 bottom-0 left-0 w-3 bg-gradient-to-b from-[#d97706] via-[#fbbf24] to-[#d97706] shadow-[0_0_20px_rgba(251,191,36,0.8)]" />
      </div>

      {/* Closed Curtain Center Seal & Trigger (when curtains are closed) */}
      {!curtainsDrawn && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center p-6 text-center bg-black/40 backdrop-blur-[2px]">
          {/* Ceremonial Red Ribbon Sash across the curtains */}
          <div className="ribbon-sway absolute inset-x-0 top-1/2 -translate-y-1/2 h-14 bg-gradient-to-r from-[#991b1b] via-[#dc2626] to-[#991b1b] border-y-2 border-[#fbbf24] shadow-[0_0_35px_rgba(220,38,38,0.7)] pointer-events-none flex items-center justify-center opacity-80" />

          {/* Golden Wax Seal Emblem */}
          <div className="relative z-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#d97706] via-[#fbbf24] to-[#b45309] p-1.5 shadow-[0_0_70px_rgba(251,191,36,0.9)] animate-soft-pulse mb-6 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#180d07] border-2 border-[#fbbf24] flex items-center justify-center text-[#fbbf24]">
              <Sparkles size={38} className="fill-[#fbbf24]" />
            </div>
          </div>

          <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-[#fbbf24]/50 text-[#fbbf24] text-xs font-bold tracking-[0.3em] uppercase mb-4 shadow-xl backdrop-blur-md">
            <span>Grand Inauguration Ceremony</span>
          </div>

          <h2 className="relative z-10 font-display text-3xl sm:text-5xl md:text-6xl font-black text-white mb-6 tracking-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)]">
            Unveiling Your VIP Confirmation...
          </h2>

          <p className="relative z-10 text-gray-200 text-sm sm:text-base max-w-md mx-auto mb-8 drop-shadow">
            Tap below to cut the ceremonial ribbon and draw the curtains to reveal your confirmed pass.
          </p>

          <button
            onClick={() => setCurtainsDrawn(true)}
            className="relative z-10 inline-flex items-center gap-3 px-9 py-4 rounded-full bg-gradient-to-r from-[#d97706] via-[#fbbf24] to-[#f59e0b] text-[#1a0f08] font-display font-black text-sm sm:text-base tracking-wider shadow-[0_15px_45px_rgba(251,191,36,0.7)] hover:shadow-[0_20px_60px_rgba(251,191,36,0.9)] hover:scale-105 transition-all duration-300 cursor-pointer"
          >
            <Sparkles size={18} className="fill-[#1a0f08]" />
            <span>CUT RIBBON & DRAW CURTAINS</span>
            <ArrowRight size={18} />
          </button>
        </div>
      )}
    </div>
  );

  if (!isFullPage) {
    return content;
  }

  return (
    <div className="min-h-screen bg-[#0a0b0e]">
      <Navbar />
      {content}
      <Footer />
    </div>
  );
}
