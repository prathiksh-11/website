import { useState, useEffect, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { MapPin, Clock, ArrowUpRight, Navigation } from 'lucide-react';
import { IMAGES } from './image_constant';

const branches = [
  {
    id: 'arekere',
    name: 'Arekere',
    fullName: 'Game On Fitness - Arekere',
    city: 'Arekere, Bengaluru',
    tag: 'Standard',
    image: IMAGES.Branches.arekere,
    area: '6,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Weights', 'Cardio', 'Group Classes'],
    lat: 12.9077,
    lng: 77.6176,
  },
  {
    id: 'vijaya-bank-layout',
    name: 'Vijaya Bank Layout',
    fullName: 'Game On Fitness Premium Club - Vijaya Bank Layout',
    city: 'Bannerghatta Road',
    tag: 'Premium',
    image: IMAGES.Branches.vijayaBankLayout,
    area: '6,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['PT', 'Group Classes', 'Steam'],
    lat: 12.9165,
    lng: 77.6101,
  },
  {
    id: 'btm-layout-1',
    name: 'BTM 1st Stage',
    fullName: 'Game On Fitness Premium Club - BTM 1st Stage',
    city: 'BTM Layout',
    tag: 'Premium',
    image: IMAGES.Branches.btm1,
    area: '5,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Functional', 'Cardio', 'PT'],
    lat: 12.9135,
    lng: 77.6089,
  },
  {
    id: 'btm-layout-2',
    name: 'BTM 2nd Stage',
    fullName: 'Game On Fitness Premium Club - BTM 2nd Stage',
    city: 'BTM Layout',
    tag: 'Premium',
    image: IMAGES.Branches.btm2,
    area: '8,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Boxing', 'Pilates', 'Sauna'],
    lat: 12.9142,
    lng: 77.6095,
  },
  {
    id: 'wilson-garden',
    name: 'Wilson Garden',
    fullName: 'Game On Fitness - Wilson Garden',
    city: 'Wilson Garden',
    tag: 'Standard',
    image: IMAGES.Branches.wilsonGarden,
    area: '3,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Weights', 'PT', 'Steam'],
    lat: 12.9519,
    lng: 77.5944,
  },
  {
    id: 'vijayanagar',
    name: 'Vijayanagar',
    fullName: 'Game On Fitness Premium Club - Vijayanagar',
    city: 'MC Layout',
    tag: 'Premium',
    image: IMAGES.Branches.jpNagar,
    area: '8,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Cardio', 'Group Classes', 'Steam'],
    lat: 12.9716,
    lng: 77.5375,
  },
  {
    id: 'akshayanagar',
    name: 'Akshayanagar',
    fullName: 'Game On Fitness Luxury Club - Akshayanagar',
    city: 'DLF Newtown',
    tag: 'Luxury',
    image: IMAGES.Branches.akshayanagar,
    area: '9,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['GX Studio', 'PT', 'Steam'],
    lat: 12.9077,
    lng: 77.6317,
  },
  {
    id: 'sarjapur-road',
    name: 'Sarjapur Road',
    fullName: 'Game On Fitness Premium Club - Sarjapur Road',
    city: 'Bellandur Gate',
    tag: 'Premium',
    image: IMAGES.Branches.sarjapurRoad,
    area: '5,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Functional', 'PT', 'Steam'],
    lat: 12.9299,
    lng: 77.6838,
  },
  {
    id: 'kasavanahalli',
    name: 'Kasavanahalli',
    fullName: 'Game On Fitness Luxury Club - Kasavanahalli',
    city: 'Hosa Road',
    tag: 'Luxury',
    image: IMAGES.Branches.kasavanahalli,
    area: '9,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Group Classes', 'PT', 'Steam'],
    lat: 12.9014,
    lng: 77.6725,
  },
];

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

function BranchCard({
  branch,
  index,
  isVisible,
  userLocation,
}: {
  branch: (typeof branches)[0];
  index: number;
  isVisible: boolean;
  userLocation: { lat: number; lng: number } | null;
}) {
  const [distance, setDistance] = useState<number | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardInnerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!userLocation) return;
    setDistance(
      calculateDistance(userLocation.lat, userLocation.lng, branch.lat, branch.lng)
    );
  }, [userLocation, branch.lat, branch.lng]);

  const openBranch = () => {
    window.location.hash = `#branch/${branch.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardInnerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setTilt({
      x: (py - 0.5) * -8,
      y: (px - 0.5) * 10,
    });
    el.style.setProperty('--mx', `${px * 100}%`);
    el.style.setProperty('--my', `${py * 100}%`);
  };

  const onLeave = () => setTilt({ x: 0, y: 0 });

  const tagStyle =
    branch.tag === 'Luxury'
      ? 'bg-gradient-to-r from-[#e07a72] to-[#c45f58] text-white'
      : branch.tag === 'Premium'
        ? 'bg-white/95 text-[#16181f]'
        : 'bg-[#16181f]/70 text-white backdrop-blur-md';

  return (
    <article
      className={`branch-card reveal-scale ${isVisible ? 'visible' : ''} group cursor-pointer`}
      style={{ transitionDelay: `${index * 0.08}s` }}
      onClick={openBranch}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        ref={cardInnerRef}
        className="branch-card-inner relative h-[420px] md:h-[460px] rounded-[1.75rem] overflow-hidden shadow-[0_18px_50px_rgba(22,24,31,0.1)] transition-all duration-500 ease-out group-hover:shadow-[0_36px_80px_rgba(22,24,31,0.2)]"
        style={{
          transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateY(${tilt.x || tilt.y ? -6 : 0}px)`,
        }}
      >
        <img
          src={branch.image}
          alt={branch.fullName}
          className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#16181f] via-[#16181f]/50 to-[#16181f]/10 opacity-95" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#e07a72]/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="branch-shine pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-4 left-4 right-4 flex items-start justify-between gap-3">
          <span
            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.16em] shadow-sm transition-transform duration-500 group-hover:scale-105 ${tagStyle}`}
          >
            {branch.tag}
          </span>
          {distance !== null && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-white/20 text-white text-[10px] font-semibold animate-fade-in-up">
              <Navigation size={11} className="text-[#f2b4ae]" />
              {distance < 1
                ? `${Math.round(distance * 1000)}m`
                : `${distance.toFixed(1)} km`}
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 p-5 md:p-6 transition-transform duration-500 group-hover:translate-y-[-4px]">
          <div className="flex items-center gap-1.5 text-white/70 text-xs mb-2">
            <MapPin size={12} className="text-[#f2b4ae]" />
            <span>{branch.city}</span>
            <span className="text-white/30">·</span>
            <span>{branch.area}</span>
          </div>

          <h3 className="font-display text-2xl md:text-[1.75rem] font-bold text-white leading-tight mb-3 pr-4">
            {branch.name}
          </h3>

          <div className="flex flex-wrap gap-1.5 mb-5 max-h-0 overflow-hidden opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">
            {branch.facilities.map((f) => (
              <span
                key={f}
                className="px-2.5 py-1 rounded-full text-[10px] font-semibold tracking-wide uppercase bg-white/10 border border-white/15 text-white/85 backdrop-blur-sm"
              >
                {f}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/10">
            <div className="flex items-center gap-1.5 text-white/60 text-xs">
              <Clock size={12} />
              <span>{branch.hours}</span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                openBranch();
              }}
              className="branch-explore inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white"
            >
              Explore
              <ArrowUpRight
                size={14}
                className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </button>
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
  const [filter, setFilter] = useState<'All' | 'Premium' | 'Luxury' | 'Standard'>('All');

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

  const filtered =
    filter === 'All' ? branches : branches.filter((b) => b.tag === filter);

  return (
    <section id="branches" className="relative py-24 md:py-36 overflow-hidden atmosphere">
      <div
        className="soft-blob w-[420px] h-[420px] -top-24 right-0 opacity-70"
        style={{ background: 'rgba(246,228,225,0.75)' }}
      />
      <div
        className="soft-blob w-[340px] h-[340px] bottom-10 -left-20 opacity-60"
        style={{ background: 'rgba(228,236,246,0.85)' }}
      />

      <div className="max-w-7xl mx-auto px-6 relative">
        <div
          ref={headRef}
          className="mb-10 md:mb-12 flex flex-col lg:flex-row lg:items-end justify-between gap-8"
        >
          <div className={`reveal ${headVisible ? 'visible' : ''} max-w-xl`}>
            <div className="section-ornament mb-5">
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
                Locations
              </span>
            </div>
            <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[#16181f]">
              Find your <span className="italic text-[#e07a72]">club.</span>
            </h2>
            <p className="mt-4 text-[#6f7685] leading-relaxed text-lg">
              Nine carefully designed spaces across Bengaluru — pick the one closest to you.
            </p>
          </div>

          <div
            className={`reveal ${headVisible ? 'visible' : ''} flex flex-wrap gap-2`}
            style={{ transitionDelay: '0.15s' }}
          >
            {(['All', 'Luxury', 'Premium', 'Standard'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 ${
                  filter === tab
                    ? 'filter-active bg-[#16181f] text-white shadow-lg'
                    : 'bg-white text-[#6f7685] border border-[rgba(22,24,31,0.08)] hover:text-[#16181f] hover:border-[#e07a72]/35 hover:-translate-y-0.5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div ref={gridRef} className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6 md:gap-7">
          {filtered.map((branch, i) => (
            <BranchCard
              key={branch.id}
              branch={branch}
              index={i}
              isVisible={gridVisible}
              userLocation={userLocation}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
