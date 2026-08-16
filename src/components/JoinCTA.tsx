import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const APP_STORE_URL = 'https://apps.apple.com/app/id6773751865';
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.gameonfitness.app';

export default function JoinCTA() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.25 });

  return (
    <section className="relative overflow-hidden">
      <div className="relative py-20 md:py-28">
        <div className="absolute inset-0">
          <img
            src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-[#16181f]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#16181f]/80 via-[#16181f]/50 to-[#ff5000]/25" />
        </div>

        <div
          ref={ref}
          className={`relative max-w-4xl mx-auto px-6 text-center reveal ${isVisible ? 'visible' : ''}`}
        >
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-[#f0a8a2] mb-4">
            Ready When You Are
          </p>
          <h2 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-5">
            The next version of you
            <br />
            <span className="italic text-[#ffb089]">is waiting.</span>
          </h2>
          <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
            Don&apos;t wait for motivation. Create momentum.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={() =>
                document.querySelector('#branches')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#ff7a3d] to-[#ff5e1a] shadow-[0_16px_40px_rgba(255,112,51,0.35)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              Find Your Game On
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-white border border-white/35 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </div>

      <div className="relative py-16 md:py-20 section-mist border-t border-[rgba(22,24,31,0.05)]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Download the App
            </span>
          </div>
          <h3 className="font-display text-3xl md:text-4xl font-bold text-[#16181f] tracking-tight mb-4">
            Your journey <span className="italic text-[#ff5000]">continues.</span>
          </h3>
          <p className="text-[#6f7685] max-w-md mx-auto mb-8 leading-relaxed">
            Morning reminder. Workout completed. Community challenge. Goal achieved. See you
            tomorrow.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href={PLAY_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Get it on Google Play"
              className="btn-premium-secondary inline-flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold"
            >
              <img
                src="/play-store.png"
                alt=""
                className="w-8 h-8 shrink-0 object-contain"
              />
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-medium text-[#6f7685]">Get it on</span>
                <span className="block text-sm font-semibold text-[#16181f]">Google Play</span>
              </span>
            </a>
            <a
              href={APP_STORE_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Download on the App Store"
              className="btn-premium-secondary inline-flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-semibold"
            >
              <svg
                viewBox="0 0 24 24"
                className="w-7 h-7 text-[#16181f] shrink-0"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M16.365 1.43c0 1.14-.42 2.28-1.26 3.17-.9.96-2.37 1.7-3.78 1.6-.14-1.09.45-2.24 1.2-3.03.9-.98 2.46-1.68 3.84-1.74ZM20.88 17.13c-.57 1.31-.85 1.9-1.59 3.06-1.03 1.58-2.48 3.55-4.28 3.57-1.6.02-2.01-1.04-4.18-1.03-2.17.01-2.63 1.05-4.23 1.03-1.8-.02-3.18-1.8-4.21-3.38-2.88-4.4-3.18-9.56-1.4-12.3 1.26-1.92 3.26-3.04 5.13-3.04 1.91 0 3.11 1.04 4.69 1.04 1.52 0 2.44-1.04 4.62-1.04 1.65 0 3.4.9 4.66 2.45-4.1 2.23-3.44 8.05.79 9.64Z" />
              </svg>
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-medium text-[#6f7685]">Download on the</span>
                <span className="block text-sm font-semibold text-[#16181f]">App Store</span>
              </span>
            </a>
          </div>
          <p className="mt-10 text-[#9aa0ab] text-xs font-medium tracking-[0.2em] uppercase">
            Stronger than yesterday. Ready for tomorrow.
          </p>
        </div>
      </div>
    </section>
  );
}
