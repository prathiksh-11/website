import { useEffect, useRef, useState } from 'react';
import { IMAGES } from './image_constant';
import { branchData } from './BranchDetail';
import { MapPin, Navigation, X, ArrowRight } from 'lucide-react';

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
      {/* Full-bleed banner */}
      <div className="absolute inset-0">
        <img
          src={IMAGES.bannerImage}
          alt=""
          className={`hero-banner-img w-full h-full object-cover object-[68%_center] transition-opacity duration-[1.4s] ease-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          loading="eager"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-t from-[#16181f]/75 via-[#16181f]/20 to-[#16181f]/10 transition-opacity duration-[1.6s] ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r from-[#16181f]/55 via-[#16181f]/15 to-transparent transition-opacity duration-[1.8s] delay-100 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-transparent to-[#e07a72]/12" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#f7f8fb] to-transparent" />
      </div>

      {/* Soft floating light sparks */}
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

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-24 md:pb-32">
        <div className="max-w-2xl">
          <div
            className={`section-ornament mb-6 ${loaded ? 'hero-fade-up' : 'opacity-0'}`}
            style={{ animationDelay: '0.15s' }}
          >
            <span className="font-display italic text-base md:text-lg text-[#f0a8a2] tracking-wide drop-shadow-sm">
              Game On Fitness
            </span>
          </div>

          <h1
            className="font-display font-bold leading-[1.08] tracking-tight text-white mb-7"
            style={{ textShadow: '0 8px 40px rgba(0,0,0,0.35)' }}
          >
            <span
              className={`block text-[clamp(2.6rem,7.5vw,5.2rem)] overflow-hidden ${
                loaded ? '' : 'opacity-0'
              }`}
            >
              <span
                className={`inline-block ${loaded ? 'hero-line-reveal' : ''}`}
                style={{ animationDelay: '0.35s' }}
              >
                Move beautifully.
              </span>
            </span>
            <span
              className={`block text-[clamp(2.6rem,7.5vw,5.2rem)] italic text-[#f2b4ae] overflow-hidden ${
                loaded ? '' : 'opacity-0'
              }`}
            >
              <span
                className={`inline-block ${loaded ? 'hero-line-reveal' : ''}`}
                style={{ animationDelay: '0.55s' }}
              >
                Train powerfully.
              </span>
            </span>
          </h1>

          <div
            className={`h-[2px] mb-7 rounded-full overflow-hidden ${
              loaded ? 'hero-accent-line' : 'opacity-0 w-0'
            }`}
          >
            <div className="h-full w-full bg-gradient-to-r from-[#e07a72] via-[#f2b4ae] to-transparent hero-accent-shimmer" />
          </div>

          <p
            className={`text-base md:text-lg text-white/75 max-w-md leading-relaxed mb-10 ${
              loaded ? 'hero-fade-up' : 'opacity-0'
            }`}
            style={{
              textShadow: '0 4px 20px rgba(0,0,0,0.35)',
              animationDelay: '0.75s',
            }}
          >
            Premium fitness clubs across Bengaluru — designed for people who take their
            body, mind, and style seriously.
          </p>

          <div
            className={`flex flex-wrap items-center gap-4 ${
              loaded ? 'hero-fade-up' : 'opacity-0'
            }`}
            style={{ animationDelay: '0.95s' }}
          >
            <button
              onClick={() =>
                document.querySelector('#branches')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="hero-cta-primary group inline-flex items-center gap-2 text-sm font-semibold px-8 py-4 rounded-full text-white"
            >
              Explore Clubs
              <ArrowRight
                size={16}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </button>
            <button
              onClick={() =>
                document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
              }
              className="hero-cta-secondary text-sm font-semibold px-8 py-4 rounded-full text-white"
            >
              Our Story
            </button>
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <button
        onClick={() =>
          document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' })
        }
        className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-2 text-white/50 hover:text-white/80 transition-colors ${
          loaded ? 'hero-fade-up' : 'opacity-0'
        }`}
        style={{ animationDelay: '1.3s' }}
        aria-label="Scroll down"
      >
        <span className="text-[10px] uppercase tracking-[0.25em] font-medium">Scroll</span>
        <span className="hero-scroll-mouse relative w-5 h-8 rounded-full border border-white/35">
          <span className="absolute top-1.5 left-1/2 -translate-x-1/2 w-1 h-1.5 rounded-full bg-white/70" />
        </span>
      </button>

      {locationDenied && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
          <div className="relative glass rounded-2xl p-4 min-w-[280px]">
            <button
              onClick={() => setLocationDenied(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded-md hover:bg-black/5 flex items-center justify-center text-[#6f7685]"
            >
              <X size={12} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f6e4e1] flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-[#e07a72]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#6f7685] uppercase tracking-wider mb-0.5">
                  Location
                </p>
                <h4 className="text-[#16181f] font-semibold text-sm mb-2">
                  Enable to find nearest club
                </h4>
                <button
                  onClick={requestLocation}
                  className="w-full py-2 rounded-xl bg-[#16181f] text-white text-xs font-semibold hover:bg-[#e07a72] transition-all"
                >
                  Enable Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {!locationLoading && nearestBranch && showLocationBar && (
        <div className="fixed top-24 right-4 z-50 animate-slide-in-right">
          <div className="relative glass rounded-2xl p-4 min-w-[280px]">
            <button
              onClick={() => setShowLocationBar(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded-md hover:bg-black/5 flex items-center justify-center text-[#6f7685]"
            >
              <X size={12} />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#f6e4e1] flex items-center justify-center flex-shrink-0">
                <Navigation size={18} className="text-[#e07a72]" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-[#6f7685] uppercase tracking-wider mb-0.5">
                  Nearest Club
                </p>
                <h4 className="text-[#16181f] font-semibold text-sm truncate">
                  {nearestBranch.name}
                </h4>
                <p className="text-xs text-[#6f7685] flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-[#e07a72] flex-shrink-0" />
                  {nearestBranch.distance < 1
                    ? `${Math.round(nearestBranch.distance * 1000)}m`
                    : `${nearestBranch.distance.toFixed(1)} km`}
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                window.location.hash = `#branch/${nearestBranch.id}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full mt-3 py-2 rounded-xl bg-[#16181f] text-white text-xs font-semibold hover:bg-[#e07a72] transition-all"
            >
              View Details →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
