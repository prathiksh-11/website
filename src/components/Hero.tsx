import { useEffect, useRef, useState } from 'react';
import { IMAGES } from './image_constant';
import { branchData } from './BranchDetail';
import { MapPin, Navigation, X, ArrowRight, Sparkles, Award, Users } from 'lucide-react';

const rotatingWords = [
  'Stronger.',
  'Unstoppable.',
  'Disciplined.',
  'Relentless.',
  'The person you promised yourself.',
];

const branchCoords: Record<string, { lat: number; lng: number }> = {
  arekere: { lat: 12.9077, lng: 77.6176 },
  'vijaya-bank-layout': { lat: 12.9165, lng: 77.6101 },
  'btm-layout-1': { lat: 12.9135, lng: 77.6089 },
  'btm-layout-2': { lat: 12.9142, lng: 77.6095 },
  'wilson-garden': { lat: 12.9519, lng: 77.5944 },
  vijayanagar: { lat: 12.9716, lng: 77.5375 },
  akshayanagar: { lat: 12.9077, lng: 77.6317 },
  'sarjapur-road': { lat: 12.9299, lng: 77.6838 },
  kasavanahalli: { lat: 12.9014, lng: 77.6725 },
};

const branches = Object.entries(branchData)
  .filter(([id]) => branchCoords[id])
  .map(([id, data]) => ({
    id,
    name: data.name,
    lat: branchCoords[id].lat,
    lng: branchCoords[id].lng,
  }));

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestBranch(userLat: number, userLng: number) {
  let nearest = branches[0];
  let minDistance = Infinity;

  branches.forEach((branch) => {
    const distance = calculateDistance(userLat, userLng, branch.lat, branch.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = branch;
    }
  });

  return { branch: nearest, distance: minDistance };
}

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const [nearestBranch, setNearestBranch] = useState<{
    id: string;
    name: string;
    distance: number;
  } | null>(null);
  const [showLocationBar, setShowLocationBar] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 80);
    return () => clearTimeout(timer);
  }, []);

  // Smooth word rotation timer (not aggressive, elegant 3.2s cadence)
  useEffect(() => {
    const interval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationLoading(false);
      setLocationDenied(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = findNearestBranch(latitude, longitude);
        setNearestBranch({
          id: nearest.branch.id,
          name: nearest.branch.name,
          distance: nearest.distance,
        });
        setLocationLoading(false);
        setTimeout(() => setShowLocationBar(true), 1500);
      },
      (error) => {
        setLocationLoading(false);
        if (error.code === 1) setLocationDenied(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const requestLocation = () => {
    setLocationDenied(false);
    setLocationLoading(true);

    if (!navigator.geolocation) {
      setLocationLoading(false);
      setLocationDenied(true);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = findNearestBranch(latitude, longitude);
        setNearestBranch({
          id: nearest.branch.id,
          name: nearest.branch.name,
          distance: nearest.distance,
        });
        setLocationLoading(false);
        setTimeout(() => setShowLocationBar(true), 1000);
      },
      () => {
        setLocationLoading(false);
        setLocationDenied(true);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-end overflow-hidden">
      {/* Background Image with Cinematic Zoom and Overlays */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.bannerImage}
          alt="Game On Fitness"
          className={`hero-banner-img w-full h-full object-cover object-[68%_center] transition-opacity duration-[1.4s] ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="eager"
        />
        {/* Soft Contrast Overlays */}
        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#16181f]/85 via-[#16181f]/35 to-[#16181f]/10 transition-opacity duration-[1.6s] ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r from-[#16181f]/70 via-[#16181f]/25 to-transparent transition-opacity duration-[1.8s] delay-100 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Subtle Ambient Orange Glow */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-[#ff5000]/15 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7f8fb] to-transparent" />
      </div>

      {/* Floating Ambient Sparks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(8)].map((_, i) => (
          <span
            key={i}
            className="hero-spark absolute rounded-full"
            style={{
              left: `${12 + i * 10}%`,
              top: `${20 + (i % 4) * 18}%`,
              width: i % 2 === 0 ? 4 : 3,
              height: i % 2 === 0 ? 4 : 3,
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${5 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-24 md:pb-32">
        <div className="max-w-2xl">
          {/* Eyebrow Ornament */}
          <div
            className={`section-ornament mb-6 ${loaded ? 'hero-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.15s' }}
          >
            <span className="font-display italic text-base md:text-lg text-[#f0a8a2] tracking-wide drop-shadow-sm">
              Game On Fitness
            </span>
          </div>

          {/* Animated Headline with Smooth Word Transition */}
          <h1
            className="font-display font-bold leading-[1.06] tracking-tight text-white mb-6"
            style={{ textShadow: '0 8px 40px rgba(0,0,0,0.4)' }}
          >
            <span
              className={`block text-[clamp(2.8rem,8vw,5.5rem)] font-black overflow-hidden ${
                loaded ? '' : 'opacity-0'
              }`}
            >
              <span
                className={`inline-block ${loaded ? 'hero-line-reveal' : ''}`}
                style={{ animationDelay: '0.35s' }}
              >
                BECOME.
              </span>
            </span>

            {/* Smooth Dynamic Rotating Highlight */}
            <span className="block text-[clamp(1.5rem,3.8vw,2.4rem)] font-extrabold italic text-[#ffb089] mt-2 min-h-[1.4em]">
              <span
                key={wordIndex}
                className="inline-block animate-fade-in text-[#ff5000] drop-shadow-[0_0_25px_rgba(255,80,0,0.5)] transition-all duration-500"
              >
                {rotatingWords[wordIndex]}
              </span>
            </span>
          </h1>

          {/* Accent Line with Shimmer */}
          <div
            className={`h-[2.5px] mb-6 rounded-full overflow-hidden max-w-sm ${
              loaded ? 'hero-accent-line' : 'opacity-0 w-0'
            }`}
          >
            <div className="h-full w-full bg-gradient-to-r from-[#ff5000] via-[#ffb089] to-transparent hero-accent-shimmer" />
          </div>

          {/* Body Text */}
          <p
            className={`text-base md:text-lg text-white/80 max-w-md leading-relaxed mb-8 ${
              loaded ? 'hero-fade-up' : 'opacity-0'
            }`}
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.35)',
              animationDelay: '0.75s',
            }}
          >
            No one becomes stronger by waiting. Everything changes the moment you step onto the floor.
          </p>

          {/* CTA Buttons */}
          <div
            className={`flex flex-wrap items-center gap-3.5 mb-10 ${
              loaded ? 'hero-fade-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.95s' }}
          >
            <button
              onClick={() =>
                document.querySelector('#branches')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="hero-cta-primary group inline-flex items-center gap-2 text-sm font-bold px-8 py-4 rounded-full text-white shadow-[0_12px_32px_rgba(255,80,0,0.45)] hover:shadow-[0_16px_40px_rgba(255,80,0,0.65)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
            >
              <span>Find Your Game On</span>
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <button
              onClick={() =>
                document.querySelector('#journey')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="hero-cta-secondary text-sm font-semibold px-8 py-4 rounded-full text-white hover:bg-white/20 transition-all duration-300 cursor-pointer"
            >
              Scroll to Explore
            </button>
          </div>

          {/* 3 Subtle Floating Trust Badges */}
          <div
            className={`flex flex-wrap items-center gap-2.5 sm:gap-3 ${
              loaded ? 'hero-fade-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '1.1s' }}
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90 font-semibold shadow-sm">
              <MapPin size={13} className="text-[#ff5000]" />
              <span>10+ Bengaluru Clubs</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90 font-semibold shadow-sm">
              <Award size={13} className="text-[#ff5000]" />
              <span>4.9★ Elite Rated</span>
            </div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs text-white/90 font-semibold shadow-sm">
              <Users size={13} className="text-[#ff5000]" />
              <span>Certified Coaches</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Indicator */}
      <button
        onClick={() =>
          document.querySelector('#journey')?.scrollIntoView({ behavior: 'smooth' })
        }
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/60 hover:text-white transition-colors cursor-pointer ${
          loaded ? 'hero-fade-up' : 'opacity-0'
        }`}
        style={{ animationDelay: '1.3s' }}
        aria-label="Scroll down"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-bold">Scroll</span>
        <span className="hero-scroll-mouse relative w-5 h-8 rounded-full border border-white/40">
          <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1.5 rounded-full bg-white/80" />
        </span>
      </button>

      {/* Location Permission Toast */}
      {locationDenied && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
          <div className="relative glass rounded-2xl p-4 min-w-[280px] shadow-2xl">
            <button
              onClick={() => setLocationDenied(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded-md hover:bg-black/5 flex items-center justify-center text-[#6f7685] cursor-pointer"
            >
              <X size={12} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fff0e8] flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-[#ff5000]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#6f7685] uppercase tracking-wider mb-0.5 font-bold">
                  Location
                </p>
                <h4 className="text-[#16181f] font-bold text-sm mb-2">
                  Enable to find nearest club
                </h4>
                <button
                  onClick={requestLocation}
                  className="w-full py-2 rounded-xl bg-[#16181f] text-white text-xs font-bold hover:bg-[#ff5000] transition-all cursor-pointer"
                >
                  Enable Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nearest Club Floating Toast */}
      {!locationLoading && nearestBranch && showLocationBar && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
          <div className="relative glass rounded-2xl p-4 min-w-[280px] shadow-2xl">
            <button
              onClick={() => setShowLocationBar(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded-md hover:bg-black/5 flex items-center justify-center text-[#6f7685] cursor-pointer"
            >
              <X size={12} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fff0e8] flex items-center justify-center flex-shrink-0">
                <Navigation size={18} className="text-[#ff5000]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#ff5000] uppercase tracking-wider mb-0.5 font-bold">
                  Nearest Club
                </p>
                <h4 className="text-[#16181f] font-bold text-sm truncate">
                  {nearestBranch.name}
                </h4>
                <p className="text-xs text-[#6f7685] flex items-center gap-1 mt-0.5 font-medium">
                  <MapPin size={11} className="text-[#ff5000] flex-shrink-0" />
                  {nearestBranch.distance < 1
                    ? `${Math.round(nearestBranch.distance * 1000)}m`
                    : `${nearestBranch.distance.toFixed(1)} km away`}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                window.location.hash = `#branch/${nearestBranch.id}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full mt-3 py-2 rounded-xl bg-[#16181f] text-white text-xs font-bold hover:bg-[#ff5000] transition-all cursor-pointer"
            >
              View Details →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
