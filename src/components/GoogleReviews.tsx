import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Star, ExternalLink } from 'lucide-react';

const GOOGLE_REVIEWS_URL =
  'https://www.google.com/maps/search/Game+On+Fitness+Bengaluru/reviews';

const RATING = 4.8;
const MAX_RATING = '5.0';

function GoogleGIcon({ className = 'w-4 h-4' }: { className?: string }) {
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

function StarRating({ count = 5, size = 18 }: { count?: number; size?: number }) {
  return (
    <div className="inline-flex items-center gap-1">
      {[...Array(count)].map((_, i) => (
        <Star
          key={i}
          size={size}
          className="fill-[#ff5000] text-[#ff5000]"
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
      className="relative py-10 md:py-14 overflow-hidden atmosphere scroll-mt-28"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[450px] rounded-full opacity-30 blur-[140px]"
          style={{
            background:
              'radial-gradient(circle, rgba(255,80,0,0.12) 0%, rgba(255,140,0,0.05) 45%, transparent 70%)',
          }}
        />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6">
        <div
          ref={containerRef}
          className={`reveal ${isVisible ? 'visible' : ''} relative rounded-[2.25rem] bg-gradient-to-br from-white via-[#fffbf8] to-white/95 border border-[#ff5000]/15 p-7 sm:p-10 md:p-11 shadow-[0_20px_60px_rgba(22,24,31,0.06)] overflow-hidden`}
        >
          {/* Subtle decorative top hairline border */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#ff5000] to-transparent opacity-80" />

          {/* Main Horizontal Flex / Stack Layout */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8 md:gap-12">
            {/* Left Side: Eyebrow, Rating, Stars + Label, Subtext */}
            <div className="space-y-3">
              {/* Eyebrow Label */}
              <div className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#ff5000]">
                OVERALL BRANCH RATING
              </div>

              {/* Large Score with / 5.0 */}
              <div className="flex items-baseline gap-2.5">
                <span className="font-display text-6xl sm:text-7xl font-black text-[#16181f] tracking-tight leading-none">
                  {RATING}
                </span>
                <span className="font-display text-xl sm:text-2xl font-semibold text-[#6f7685]/80">
                  / {MAX_RATING}
                </span>
              </div>

              {/* Stars & Excellent Label (Dark typography) */}
              <div className="flex items-center gap-3">
                <StarRating count={5} size={18} />
                <span className="text-base font-bold text-[#16181f] font-display">
                  Excellent
                </span>
              </div>

              {/* Supporting Text & Google Badge */}
              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-[#6f7685]">
                <span>Based on</span>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white border border-[rgba(22,24,31,0.08)] shadow-[0_2px_8px_rgba(0,0,0,0.03)]">
                  <GoogleGIcon className="w-3.5 h-3.5" />
                  <span className="font-semibold text-[#16181f]">Google Reviews</span>
                </div>
              </div>
            </div>

            {/* Right Side: CTA Button */}
            <div className="shrink-0 w-full md:w-auto">
              <a
                href={GOOGLE_REVIEWS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 w-full md:w-auto py-3.5 px-7 rounded-full bg-[#16181f] text-white text-sm font-semibold shadow-[0_10px_25px_rgba(22,24,31,0.16)] hover:bg-[#ff5000] hover:shadow-[0_14px_32px_rgba(255,80,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 group cursor-pointer"
              >
                <span>View Google Reviews</span>
                <ExternalLink size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
