import { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { MapPin, Clock, Dumbbell, ChevronRight, Navigation } from 'lucide-react';
import { IMAGES } from './image_constant';

const branches = [
  {
    id: 'arekere',
    name: 'Game On Fitness - Arekere',
    city: 'Arekere, Bengaluru',
    address: 'No.97,1st & 2nd floor, Saibaba Temple road, 2nd Main, Royal Residency Layout BTM 4th Stage, 80, Feet Rd, near Arekere, Bengaluru, Karnataka 560076',
    phone: '+91 8861737392',
    tag: 'Normal',
    image: IMAGES.Branches.arekere,
    area: '6,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Weight Training', 'Cardio Zone', 'Group Classes', 'Steam Room'],
    accentColor: '#38bdf8',
    gradient: 'from-[#38bdf8]/25 to-transparent',
    lat: 12.9077,
    lng: 77.6176,
  },
  {
    id: 'vijaya-bank-layout',
    name: 'Game On Fitness Premium Club - Vijaya Bank Layout',
    city: 'Vijaya Bank Layout, Bengaluru',
    address: '3rd floor, 8883 886, Bannerghatta Rd, Vijaya Bank Layout, Bilekahalli, Bengaluru, Karnataka 560076',
    phone: '+91 9035279516',
    tag: 'Premium',
    image: IMAGES.Branches.vijayaBankLayout,
    area: '6,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Weight Training & Cardio', 'Group Classes', 'Personal Training', 'Steam & Shower'],
    accentColor: '#ff6b35',
    gradient: 'from-[#ff6b35]/30 to-transparent',
    lat: 12.9165,
    lng: 77.6101,
  },
  {
    id: 'btm-layout-1',
    name: 'Game On Fitness Premium Club - BTM 1st Stage',
    city: 'BTM 1st Stage, Bengaluru',
    address: 'Gangotri Bar And Restaurant, Ground, 8th Cross Rd, Old Madiwala, Maruti Nagar, 1st Stage, BTM 1st Stage, Bengaluru, Karnataka 560068',
    phone: '+91 9036054799',
    tag: 'Premium',
    image: IMAGES.Branches.btm1,
    area: '5,000 sq ft',
    hours: '5:30 AM – 11 PM',
    facilities: ['Weight Training & Cardio', 'Functional Training', 'Group Classes', 'Personal Training'],
    accentColor: '#ff6b35',
    gradient: 'from-[#ff6b35]/20 to-transparent',
    lat: 12.9135,
    lng: 77.6089,
  },
  {
    id: 'btm-layout-2',
    name: 'Game On Fitness Premium Club - BTM 2nd Stage',
    city: 'BTM 2nd Stage, Bengaluru',
    address: '689-670 2nd floor , 7th main, 7th Cross Rd, BTM Layout 2nd Stage, Bengaluru, Karnataka 560076',
    phone: '+91 8951028839',
    tag: 'Premium',
    image: IMAGES.Branches.btm2,
    area: '8,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Boxing Ring', 'Pilates Studio', 'Sauna', 'Smoothie Bar'],
    accentColor: '#ff6b35',
    gradient: 'from-[#ff6b35]/25 to-transparent',
    lat: 12.9142,
    lng: 77.6095,
  },
  {
    id: 'wilson-garden',
    name: 'Game On Fitness - Wilson Garden',
    city: 'Wilson Garden, Bengaluru',
    address: 'No.376, 21, 6th Cross Rd, opp. to traffic police station, Vinayaka Nagar, NGO Colony, Wilson Garden, Bengaluru, Karnataka 560027',
    phone: '+91 9663995409',
    tag: 'Normal',
    image: IMAGES.Branches.wilsonGarden,
    area: '3,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Weight Training & Cardio', 'Personal Training', 'Functional Training', 'Steam & Shower'],
    accentColor: '#38bdf8',
    gradient: 'from-[#38bdf8]/25 to-transparent',
    lat: 12.9519,
    lng: 77.5944,
  },
  {
    id: 'vijayanagar',
    name: 'Game On Fitness Premium Club - Vijayanagar',
    city: 'Vijayanagar, Bengaluru',
    address: '119, 1st Floor 6th Main, 8th Cross Rd, next to BGS Stadium, MC Layout, Vijayanagar, Bengaluru, Karnataka 560040',
    phone: '+91 9008589955',
    tag: 'Premium',
    image: IMAGES.Branches.jpNagar,
    area: '8,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Weight Training & Cardio', 'Group Classes', 'Personal Training', 'Steam & Shower'],
    accentColor: '#ff6b35',
    gradient: 'from-[#ff6b35]/25 to-transparent',
    lat: 12.9716,
    lng: 77.5375,
  },
  {
    id: 'akshayanagar',
    name: 'Game On Fitness Luxury Club - Akshayanagar',
    city: 'Akshayanagar, Bengaluru',
    address: '2nd Floor, near, above Reliance Smart, Bhagyalakshmi Avenue, DLF Newtown, Akshayanagar, Bengaluru, Karnataka 560114',
    phone: '+91 8431198114',
    tag: 'Luxury',
    image: IMAGES.Branches.akshayanagar,
    area: '9,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Weight Training & Cardio', 'Personal Training', 'GX Studio', 'Steam & Shower'],
    accentColor: '#a78bfa',
    gradient: 'from-[#a78bfa]/25 to-transparent',
    lat: 12.9077,
    lng: 77.6317,
  },
  {
    id: 'sarjapur-road',
    name: 'Game On Fitness Premium Club - Sarjapur Road (Bellandur gate)',
    city: 'Sarjapur Road, Bengaluru',
    address: 'No 648 E 3rd floor, next to more mega store, Marathahalli - Sarjapur Main rd, gate, Bellandur, Bengaluru, Karnataka 560035',
    phone: '+91 8618086458',
    tag: 'Premium',
    image: IMAGES.Branches.sarjapurRoad,
    area: '5,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Weight Training & Cardio', 'Personal Training', 'Functional Training', 'Steam & Shower'],
    accentColor: '#ff6b35',
    gradient: 'from-[#ff6b35]/30 to-transparent',
    lat: 12.9299,
    lng: 77.6838,
  },
  {
    id: 'kasavanahalli',
    name: 'Game On Fitness Luxury Club - Kasavanahalli',
    city: 'Kasavanahalli, Bengaluru',
    address: '3rd Floor, Hosa Rd, next to Vishal Mega Mart, Kasavanahalli, Bengaluru, Karnataka 560035',
    phone: '+91 7259348811',
    tag: 'Luxury',
    image: IMAGES.Branches.kasavanahalli,
    area: '9,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Weight Training & Cardio', 'Personal Training', 'Group Classes', 'Steam & Shower'],
    accentColor: '#a78bfa',
    gradient: 'from-[#a78bfa]/25 to-transparent',
    lat: 12.9014,
    lng: 77.6725,
  },
];

interface BranchCardProps {
  branch: typeof branches[0];
  index: number;
  isVisible: boolean;
  userLocation: { lat: number; lng: number } | null;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

function BranchCard({ branch, index, isVisible, userLocation }: BranchCardProps) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState<number | null>(null);

  useEffect(() => {
    if (userLocation) {
      const dist = calculateDistance(userLocation.lat, userLocation.lng, branch.lat, branch.lng);
      setDistance(dist);
    }
  }, [userLocation, branch.lat, branch.lng]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    cardRef.current.style.transform = `perspective(1000px) rotateX(${-y * 6}deg) rotateY(${x * 6}deg) translateY(-8px)`;
  };

  const handleMouseLeave = () => {
    if (!cardRef.current) return;
    cardRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
    setHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={`reveal-scale ${isVisible ? 'visible' : ''} relative group cursor-pointer h-full`}
      style={{
        transitionDelay: `${index * 0.1}s`,
        transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setHovered(true)}
      onClick={() => {
        window.location.hash = `#branch/${branch.id}`;
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }}
    >
      <div
        className="relative rounded-2xl overflow-hidden branch-card-glow h-full flex flex-col"
        style={{
          background: '#0d0d0d',
          border: `1px solid ${hovered ? branch.accentColor + '40' : 'rgba(255,255,255,0.07)'}`,
          boxShadow: hovered ? `0 0 50px ${branch.accentColor}20, 0 30px 80px rgba(0,0,0,0.6)` : 'none',
          transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        }}
      >
        {/* Image */}
        <div className="relative overflow-hidden h-48 flex-shrink-0">
          <img
            src={branch.image}
            alt={branch.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70"
          />
          <div className={`absolute inset-0 bg-gradient-to-b ${branch.gradient} via-transparent`} />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent" />

          {/* Tag */}
          <div
            className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold tracking-wider"
            style={{
              background: `${branch.accentColor}20`,
              border: `1px solid ${branch.accentColor}40`,
              color: branch.accentColor,
            }}
          >
            {branch.tag}
          </div>

        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-base font-bold text-white">{branch.name}</h3>
            <ChevronRight
              size={16}
              className="text-white/20 transition-all duration-300 group-hover:text-white/60 group-hover:translate-x-1 flex-shrink-0"
            />
          </div>

          <div className="flex items-center gap-1.5 mb-4">
            <MapPin size={12} style={{ color: branch.accentColor }} />
            <span className="text-xs text-white/50">{branch.city}</span>
          </div>

          {/* Distance badge */}
          {distance !== null && (
            <div className="flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-white/5 border border-white/10">
              <Navigation size={12} className="text-[#ffb800]" />
              <span className="text-xs font-semibold text-white">
                {distance < 1 
                  ? `${Math.round(distance * 1000)}m away`
                  : `${distance.toFixed(1)} km away`
                }
              </span>
              {index === 0 && distance === Math.min(...branches.map(b => {
                if (!userLocation) return Infinity;
                return calculateDistance(userLocation.lat, userLocation.lng, b.lat, b.lng);
              })) && (
                <span className="text-xs text-[#ffb800] font-bold">• Nearest</span>
              )}
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-4 mb-5 pb-5 border-b border-white/5">
            <div className="flex items-center gap-1.5">
              <Dumbbell size={12} className="text-white/30" />
              <span className="text-xs text-white/50">{branch.area}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={12} className="text-white/30" />
              <span className="text-xs text-white/50">{branch.hours}</span>
            </div>
          </div>

          {/* CTA */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.hash = `#branch/${branch.id}`;
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="mt-auto w-full py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300"
            style={{
              background: hovered ? `${branch.accentColor}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${hovered ? branch.accentColor + '50' : 'rgba(255,255,255,0.08)'}`,
              color: hovered ? branch.accentColor : 'rgba(255,255,255,0.5)',
            }}
          >
            Explore Branch
          </button>
        </div>

        {/* Bottom glow line */}
        <div
          className="absolute bottom-0 left-0 right-0 h-px transition-opacity duration-300"
          style={{
            background: `linear-gradient(90deg, transparent, ${branch.accentColor}60, transparent)`,
            opacity: hovered ? 1 : 0,
          }}
        />
      </div>
    </div>
  );
}

export default function Branches() {
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: gridRef, isVisible: gridVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.05 });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

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

  return (
    <section id="branches" className="relative py-20 bg-[#050505] overflow-hidden">
      {/* Background */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] pointer-events-none">
        <div
          className="w-full h-full rounded-full opacity-8"
          style={{
            background: 'radial-gradient(circle, rgba(245,200,66,0.15) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headRef} className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className={`reveal ${headVisible ? 'visible' : ''}`}>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#ffb800] mb-4 block">Locations</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-none">
              <span className="text-white">FIND YOUR</span>
              <br />
              <span className="gradient-text-gold">ARENA.</span>
            </h2>
          </div>

        </div>

        {/* Branches Grid */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {branches.map((branch, i) => (
            <BranchCard key={branch.id} branch={branch} index={i} isVisible={gridVisible} userLocation={userLocation} />
          ))}
        </div>

      </div>
    </section>
  );
}
