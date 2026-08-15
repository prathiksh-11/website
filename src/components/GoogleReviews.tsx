import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import {
  Star,
  ExternalLink,
  MapPin,
  CheckCircle2,
  Sparkles,
  Award,
  ShieldCheck,
  Building2,
  TrendingUp,
} from 'lucide-react';

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/search/Game+On+Fitness+Bengaluru/reviews';

const RATING = 4.8;
const TOTAL_REVIEWS_COUNT = '2,500+';
const TOTAL_BRANCHES_COUNT = '10+';

function GoogleGIcon({ className = 'w-5 h-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
      />
      <path
        fill="#34A853"
        d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
      />
      <path
        fill="#FBBC05"
        d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
      />
      <path
        fill="#EA4335"
        d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
      />
    </svg>
  );
}

function StarRating({ count = 5, size = 22 }: { count?: number; size?: number }) {
  return (
    <div className="inline-flex items-center gap-1.5">
      {[...Array(count)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className="fill-[#ff5000] text-[#ff5000] drop-shadow-[0_2px_8px_rgba(255,80,0,0.35)]"
        />
      ))}
    </div>
  );
}

export default function GoogleReviews() {
  const { ref: containerRef, isVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.12,
  });

  return (
    <section
      id="reviews"
      className="relative py-16 md:py-24 overflow-hidden atmosphere scroll-mt-28"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[920px] h-[580px] rounded-full opacity-40 blur-[140px]"
          style={{
            background:
              'radial-gradient(circle, rgba(255,80,0,0.14) 0%, rgba(255,140,0,0.06) 45%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div
          ref={containerRef}
          className={`reveal ${isVisible ? 'visible' : ''} relative rounded-[2.5rem] bg-gradient-to-br from-white via-[#fffbf8] to-white/95 border border-[#ff5000]/20 p-8 sm:p-12 md:p-14 shadow-[0_30px_90px_rgba(22,24,31,0.07)] overflow-hidden`}
        >
          {/* Subtle decorative glow accents */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-[#ff5000]/10 via-[#ff5000]/5 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gradient-to-tr from-[#ff5000]/10 to-transparent rounded-full blur-2xl pointer-events-none" />
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-transparent via-[#ff5000] to-transparent" />

          {/* Content Grid */}
          <div className="relative z-10 grid lg:grid-cols-[1.25fr_1fr] gap-10 lg:gap-14 items-center">
            {/* Left side: Google Rating Hero Display */}
            <div>
              {/* Header Pill */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white border border-[rgba(22,24,31,0.08)] shadow-[0_4px_16px_rgba(0,0,0,0.04)] mb-6">
                <GoogleGIcon className="w-4 h-4" />
                <span className="text-[11px] font-bold tracking-[0.2em] uppercase text-[#16181f]">
                  Official Google Rating
                </span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16a34a] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#16a34a]" />
                </span>
              </div>

              {/* Main Rating Number & Stars */}
              <div className="flex flex-wrap items-baseline gap-4 mb-4">
                <span className="font-display text-6xl sm:text-7xl md:text-8xl font-black text-[#16181f] tracking-tight leading-none">
                  {RATING}
                </span>
                <div className="flex flex-col justify-center">
                  <StarRating count={5} size={24} />
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-[#ff5000] bg-[#fff0e8] px-2.5 py-0.5 rounded-full mt-2 w-fit border border-[#ff5000]/15">
                    out of 5.0 Stars
                  </span>
                </div>
              </div>

              {/* Tagline */}
              <h3 className="font-display text-2xl sm:text-3xl font-bold text-[#16181f] leading-snug mb-3">
                Bengaluru's Highest Rated{' '}
                <span className="italic text-[#ff5000]">Luxury Fitness Club.</span>
              </h3>

              <p className="text-[#6f7685] text-base leading-relaxed max-w-lg mb-6">
                Backed by <strong className="text-[#16181f] font-semibold">{TOTAL_REVIEWS_COUNT} verified reviews</strong> across{' '}
                <strong className="text-[#16181f] font-semibold">{TOTAL_BRANCHES_COUNT} premium clubs</strong> in Bengaluru.
              </p>

              {/* Trust Metric Chips */}
              <div className="flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[rgba(22,24,31,0.08)] shadow-sm text-xs font-semibold text-[#16181f]">
                  <CheckCircle2 size={14} className="text-[#16a34a]" />
                  <span>100% Verified Members</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[rgba(22,24,31,0.08)] shadow-sm text-xs font-semibold text-[#16181f]">
                  <MapPin size={14} className="text-[#ff5000]" />
                  <span>All Bengaluru Locations</span>
                </div>
              </div>
            </div>

            {/* Right side: Rating Breakdown Bars & CTA */}
            <div className="flex flex-col justify-between rounded-[2rem] bg-white/95 backdrop-blur-xl border border-[rgba(22,24,31,0.08)] p-7 sm:p-8 shadow-[0_20px_50px_rgba(22,24,31,0.06)]">
              <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#6f7685] mb-6 flex items-center gap-2">
                <TrendingUp size={14} className="text-[#ff5000]" />
                Member Satisfaction Breakdown
              </h4>

              {/* Progress Bars */}
              <div className="space-y-4 mb-7">
                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#16181f] mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Sparkles size={14} className="text-[#ff5000]" />
                      Cleanliness & Hygiene
                    </span>
                    <span className="font-display font-bold text-[#e04800] bg-[#fff0e8] px-2 py-0.5 rounded text-xs">
                      4.9 / 5.0
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#f1f3f6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff5000] via-[#ff6a1a] to-[#ff8c42] rounded-full shadow-[0_0_10px_rgba(255,80,0,0.35)]"
                      style={{ width: '98%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#16181f] mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Award size={14} className="text-[#ff5000]" />
                      Imported Biomechanical Equipment
                    </span>
                    <span className="font-display font-bold text-[#e04800] bg-[#fff0e8] px-2 py-0.5 rounded text-xs">
                      4.9 / 5.0
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#f1f3f6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff5000] via-[#ff6a1a] to-[#ff8c42] rounded-full shadow-[0_0_10px_rgba(255,80,0,0.35)]"
                      style={{ width: '98%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#16181f] mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <ShieldCheck size={14} className="text-[#ff5000]" />
                      Elite Certified Personal Trainers
                    </span>
                    <span className="font-display font-bold text-[#e04800] bg-[#fff0e8] px-2 py-0.5 rounded text-xs">
                      4.8 / 5.0
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#f1f3f6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff5000] via-[#ff6a1a] to-[#ff8c42] rounded-full shadow-[0_0_10px_rgba(255,80,0,0.35)]"
                      style={{ width: '96%' }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold text-[#16181f] mb-1.5">
                    <span className="flex items-center gap-1.5">
                      <Building2 size={14} className="text-[#ff5000]" />
                      Ambiance, Music & Vibe
                    </span>
                    <span className="font-display font-bold text-[#e04800] bg-[#fff0e8] px-2 py-0.5 rounded text-xs">
                      4.9 / 5.0
                    </span>
                  </div>
                  <div className="h-2 w-full bg-[#f1f3f6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#ff5000] via-[#ff6a1a] to-[#ff8c42] rounded-full shadow-[0_0_10px_rgba(255,80,0,0.35)]"
                      style={{ width: '97%' }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full py-3.5 px-6 rounded-full bg-[#16181f] text-white text-sm font-semibold shadow-[0_12px_28px_rgba(22,24,31,0.18)] hover:bg-[#ff5000] hover:shadow-[0_16px_36px_rgba(255,80,0,0.35)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
              >
                <span>Read all 2,500+ Google Reviews</span>
                <ExternalLink size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}



