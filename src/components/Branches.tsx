import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { MapPin, ArrowUpRight, Navigation, LocateFixed } from 'lucide-react';
import { IMAGES } from './image_constant';

const featuredBranches = [
  {
    id: 'btm-layout-1',
    name: 'BTM 1st stage',
    tagline: 'Premium',
    description: 'Heavy lifting. Functional training. Performance-focused environment.',
    city: 'BTM Layout 1st Stage',
    tag: 'Premium',
    image: IMAGES.Branches.btm1,
    lat: 12.9135,
    lng: 77.6089,
  },
  {
    id: 'btm-layout-2',
    name: 'BTM 2nd Stage',
    tagline: 'Premium',
    description: 'Premium equipment. Progressive training. Expert coaching.',
    city: 'BTM Layout, Bengaluru',
    tag: 'Premium',
    image: IMAGES.Branches.btm2,
    lat: 12.9142,
    lng: 77.6095,
  },
  {
    id: 'vijayanagar',
    name: 'Vijayanagar',
    tagline: 'Premium',
    description: 'Friendly. Energetic. Welcoming. A place where every member belongs.',
    city: 'MC Layout, Bengaluru',
    tag: 'Premium',
    image: IMAGES.Branches.jpNagar,
    lat: 12.9716,
    lng: 77.5375,
  },
  {
    id: 'sarjapur-road',
    name: 'Sarjapur Road',
    tagline: 'Premium',
    description: 'Strength. Speed. Endurance. Performance training for people who demand more.',
    city: 'Bellandur Gate, Bengaluru',
    tag: 'Premium',
    image: IMAGES.Branches.sarjapurRoad,
    lat: 12.9299,
    lng: 77.6838,
  },
  {
    id: 'wilson-garden',
    name: 'Wilson Garden',
    tagline: 'Standard',
    description: 'Whether you’re stepping in for the first time or chasing your next milestone.',
    city: 'Wilson Garden, Bengaluru',
    tag: 'Standard',
    image: IMAGES.Branches.wilsonGarden,
    lat: 12.9519,
    lng: 77.5944,
  },
  {
    id: 'akshayanagar',
    name: 'Akshayanagar',
    tagline: 'Luxury',
    description: 'Strength training. Functional fitness. Cardio. Personal coaching.',
    city: 'DLF Newtown, Bengaluru',
    tag: 'Luxury',
    image: IMAGES.Branches.akshayanagar,
    lat: 12.9077,
    lng: 77.6317,
  },
];

const filters = ['All', 'Luxury', 'Premium', 'Standard'] as const;

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

function formatDistance(km: number) {
  return km < 1 ? `${Math.round(km * 1000)}m` : `${km.toFixed(1)} km`;
}

function BranchCard({
  branch,
  index,
  isVisible,
  distance,
  isNearest,
}: {
  branch: (typeof featuredBranches)[0];
  index: number;
  isVisible: boolean;
  distance: number | null;
  isNearest: boolean;
}) {
  const openBranch = () => {
    window.location.hash = `#branch/${branch.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const tagStyle =
    branch.tag === 'Luxury'
      ? 'bg-[#ff5000] text-white'
      : branch.tag === 'Premium'
        ? 'bg-[#16181f] text-white'
        : 'bg-[#fff0e8] text-[#e04800]';

  return (
    <article
      className={`reveal ${isVisible ? 'visible' : ''} group cursor-pointer`}
      style={{ transitionDelay: `${index * 80}ms` }}
      onClick={openBranch}
    >
      <div
        className={`relative h-full flex flex-col rounded-[1.75rem] overflow-hidden bg-white border transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_28px_60px_rgba(22,24,31,0.12)] ${
          isNearest
            ? 'border-[#ff5000]/40 shadow-[0_20px_50px_rgba(255,80,0,0.12)]'
            : 'border-[rgba(22,24,31,0.06)] shadow-[0_14px_40px_rgba(22,24,31,0.06)]'
        }`}
      >
        {/* Image panel — framed, no text on dark wash */}
        <div className="relative h-52 sm:h-56 overflow-hidden bg-[#eef1f6]">
          <img
            src={branch.image}
            alt={branch.name}
            className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#16181f]/35 via-transparent to-transparent" />

          <div className="absolute top-3.5 left-3.5 right-3.5 flex items-start justify-between gap-2">
            <span
              className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.14em] shadow-sm ${tagStyle}`}
            >
              {branch.tag}
            </span>
            {distance !== null && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-white/95 backdrop-blur text-[#16181f] text-[10px] font-semibold shadow-sm">
                <Navigation size={11} className="text-[#ff5000]" />
                {formatDistance(distance)}
              </span>
            )}
          </div>

          {isNearest && (
            <span className="absolute bottom-3 left-3.5 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#ff5000] text-white text-[10px] font-bold uppercase tracking-wider shadow-[0_10px_24px_rgba(255,80,0,0.35)]">
              <LocateFixed size={12} />
              Nearest
            </span>
          )}
        </div>

        {/* White content — always readable */}
        <div className="flex flex-col flex-1 p-5 md:p-6">
          <div className="flex items-center gap-1.5 text-[#6f7685] text-xs mb-2">
            <MapPin size={13} className="text-[#ff5000] shrink-0" />
            <span className="truncate">{branch.city}</span>
          </div>

          <h3 className="font-display text-2xl font-bold text-[#16181f] leading-tight mb-2 group-hover:text-[#ff5000] transition-colors duration-300">
            {branch.name}
          </h3>
          <p className="text-[#6f7685] text-sm leading-relaxed mb-5 line-clamp-2 flex-1">
            {branch.description}
          </p>

          <div className="flex items-center justify-between gap-3 pt-4 border-t border-[rgba(22,24,31,0.06)]">
            <span className="text-[#9aa0ab] text-xs">Your journey has a place.</span>
            <span className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#ff5000] text-white text-xs font-bold uppercase tracking-wider shadow-[0_10px_24px_rgba(255,80,0,0.25)] group-hover:gap-2.5 transition-all duration-300">
              Explore
              <ArrowUpRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function Branches() {
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: gridRef, isVisible: gridVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.05,
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [filter, setFilter] = useState<(typeof filters)[number]>('All');

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }, []);

  const branchesWithDistance = useMemo(() => {
    return featuredBranches.map((branch) => {
      const distance = userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, branch.lat, branch.lng)
        : null;
      return { branch, distance };
    });
  }, [userLocation]);

  const nearestId = useMemo(() => {
    const withDist = branchesWithDistance.filter((b) => b.distance !== null);
    if (!withDist.length) return null;
    return withDist.reduce((best, cur) =>
      (cur.distance as number) < (best.distance as number) ? cur : best
    ).branch.id;
  }, [branchesWithDistance]);

  const visible = branchesWithDistance.filter(
    ({ branch }) => filter === 'All' || branch.tag === filter
  );

  const nearest = branchesWithDistance.find((b) => b.branch.id === nearestId);

  return (
    <section id="branches" className="relative py-20 md:py-28 overflow-hidden bg-[#f7f8fb]">
      {/* Soft circle accents */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-24 top-20 w-[420px] h-[420px] rounded-full border border-[#ff5000]/10" />
        <div className="absolute -right-10 top-36 w-[280px] h-[280px] rounded-full border border-dashed border-[#ff5000]/15" />
        <div
          className="absolute -left-20 bottom-10 w-[360px] h-[360px] rounded-full"
          style={{ background: 'radial-gradient(circle, rgba(255,80,0,0.08) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div
          ref={headRef}
          className={`mb-10 md:mb-12 reveal ${headVisible ? 'visible' : ''}`}
        >
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-8">
            <div className="max-w-2xl">
              <div className="section-ornament mb-5">
                <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
                  Locations
                </span>
              </div>
              <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[#16181f]">
                Your journey <span className="italic text-[#ff5000]">has a place.</span>
              </h2>
              <p className="mt-4 text-[#6f7685] leading-relaxed text-lg">
                Choose the destination that feels like yours. Every branch has its own energy —
                one commitment to help you become stronger every day.
              </p>
            </div>

            {/* Filter pills */}
            <div className="flex flex-wrap gap-2">
              {filters.map((f) => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setFilter(f)}
                  className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                    filter === f
                      ? 'bg-[#ff5000] text-white shadow-[0_10px_24px_rgba(255,80,0,0.3)]'
                      : 'bg-white text-[#6f7685] border border-[rgba(22,24,31,0.06)] hover:border-[#ff5000]/30 hover:text-[#16181f]'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Nearest club banner — clean, not overlapping cards */}
          {nearest && nearest.distance !== null && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-[1.5rem] bg-white border border-[#ff5000]/20 px-5 py-4 shadow-[0_14px_40px_rgba(255,80,0,0.08)]">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-2xl bg-[#fff0e8] text-[#ff5000] flex items-center justify-center shrink-0">
                  <LocateFixed size={20} />
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#ff5000] mb-0.5">
                    Nearest Club
                  </p>
                  <p className="font-display text-lg font-bold text-[#16181f] truncate">
                    {nearest.branch.name}
                  </p>
                  <p className="text-xs text-[#6f7685]">
                    {formatDistance(nearest.distance)} away · {nearest.branch.city}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.location.hash = `#branch/${nearest.branch.id}`;
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-[#16181f] text-white text-sm font-semibold hover:bg-[#ff5000] transition-colors duration-300 shrink-0"
              >
                View Details
                <ArrowUpRight size={15} />
              </button>
            </div>
          )}
        </div>

        <div
          ref={gridRef}
          className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6"
        >
          {visible.map(({ branch, distance }, i) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              index={i}
              isVisible={gridVisible}
              distance={distance}
              isNearest={branch.id === nearestId}
            />
          ))}
        </div>

        <div className="mt-12 text-center">
          <Link
            to="/locations"
            className="btn-premium-secondary inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold"
          >
            Explore All Locations
            <ArrowUpRight size={16} />
          </Link>
          <p className="mt-8 text-[#6f7685] text-sm max-w-md mx-auto">
            You aren&apos;t choosing a gym. You&apos;re choosing where your transformation
            begins.
          </p>
        </div>
      </div>
    </section>
  );
}
