import { ArrowRight } from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

export default function JoinCTA() {
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.3 });

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0">
        <img
          src="https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1600&h=900&fit=crop"
          alt=""
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#16181f]/70" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#16181f]/80 via-[#16181f]/50 to-[#e07a72]/25" />
      </div>

      <div
        ref={ref}
        className={`relative max-w-4xl mx-auto px-6 text-center reveal ${isVisible ? 'visible' : ''}`}
      >
        <p className="font-display italic text-[#f0a8a2] text-lg mb-4">Ready when you are</p>
        <h2 className="font-display text-4xl md:text-6xl font-bold text-white tracking-tight leading-[1.08] mb-5">
          Your strongest era
          <br />
          <span className="italic text-[#f2b4ae]">starts here.</span>
        </h2>
        <p className="text-white/70 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed">
          Join Game On Fitness and train in spaces designed for results, recovery, and real
          confidence.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() =>
              document.querySelector('#branches')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="group inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-white bg-gradient-to-r from-[#e07a72] to-[#c45f58] shadow-[0_16px_40px_rgba(224,122,114,0.4)] hover:-translate-y-1 transition-all duration-300"
          >
            Find Your Club
            <ArrowRight
              size={16}
              className="transition-transform duration-300 group-hover:translate-x-1"
            />
          </button>
          <a
            href="https://wa.me/919148974009"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold text-white border border-white/35 bg-white/10 backdrop-blur-md hover:bg-white/20 transition-all duration-300"
          >
            Chat on WhatsApp
          </a>
        </div>

        <div className="mt-12 mx-auto inline-flex items-center gap-4 rounded-2xl bg-white/10 border border-white/15 backdrop-blur-md px-5 py-4 text-left">
          <div className="w-16 h-16 rounded-xl bg-white p-1.5 shrink-0">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://gameonfitness.in/download"
              alt="Download app QR"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <p className="text-sm font-semibold text-white">Get the app</p>
            <p className="text-xs text-white/60 mt-0.5">Scan to download Game On Fitness</p>
          </div>
        </div>
      </div>
    </section>
  );
}
