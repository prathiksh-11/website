import { useEffect, useRef, useState } from 'react';
import { useIntersectionObserver, useCountUp } from '../hooks/useIntersectionObserver';
import { IMAGES } from './image_constant';
import { MapPin, Navigation, X } from 'lucide-react';

const branches = [
  { id: 'arekere', name: 'Arekere', lat: 12.9077, lng: 77.6176 },
  { id: 'vijaya-bank-layout', name: 'Vijaya Bank Layout', lat: 12.9165, lng: 77.6101 },
  { id: 'btm-layout-1', name: 'BTM Layout 1', lat: 12.9135, lng: 77.6089 },
  { id: 'btm-layout-2', name: 'BTM Layout 2', lat: 12.9142, lng: 77.6095 },
  { id: 'wilson-garden', name: 'Wilson Garden', lat: 12.9519, lng: 77.5944 },
  { id: 'jp-nagar', name: 'JP Nagar', lat: 12.9063, lng: 77.5857 },
  { id: 'akshayanagar', name: 'Akshayanagar', lat: 12.9077, lng: 77.6317 },
  { id: 'sarjapur-road', name: 'Sarjapur Road', lat: 12.9299, lng: 77.6838 },
];

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function findNearestBranch(userLat: number, userLng: number) {
  let nearest = branches[0];
  let minDistance = Infinity;

  branches.forEach(branch => {
    const distance = calculateDistance(userLat, userLng, branch.lat, branch.lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = branch;
    }
  });

  return { branch: nearest, distance: minDistance };
}

const particles = Array.from({ length: 30 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 3 + 1,
  delay: Math.random() * 5,
  duration: Math.random() * 8 + 6,
  opacity: Math.random() * 0.6 + 0.2,
}));

interface StatItemProps {
  value: number;
  suffix: string;
  label: string;
  start: boolean;
}

function StatItem({ value, suffix, label, start }: StatItemProps) {
  const count = useCountUp(value, 2000, start);
  return (
    <div className="text-center">
      <div className="text-3xl md:text-4xl font-black gradient-text-blue">
        {count}{suffix}
      </div>
      <div className="text-xs text-white/40 tracking-widest uppercase mt-1">{label}</div>
    </div>
  );
}

export default function Hero() {
  const { ref: statsRef, isVisible: statsVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.3 });
  const heroRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [currentTransformation, setCurrentTransformation] = useState(0);
  const [nearestBranch, setNearestBranch] = useState<{ name: string, distance: number } | null>(null);
  const [showLocationBar, setShowLocationBar] = useState(false);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationDenied, setLocationDenied] = useState(false);

  const beforeImages = Object.values(IMAGES.Before);

  // Auto-rotate transformations
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTransformation((prev) => (prev + 1) % beforeImages.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [beforeImages.length]);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Detect user location and find nearest branch
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
          name: nearest.branch.name,
          distance: nearest.distance,
        });
        setLocationLoading(false);
        setTimeout(() => setShowLocationBar(true), 1500);
      },
      (error) => {
        setLocationLoading(false);
        if (error.code === 1) { // Permission denied
          setLocationDenied(true);
        }
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

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { width, height, left, top } = el.getBoundingClientRect();
      const x = ((clientX - left) / width - 0.5) * 20;
      const y = ((clientY - top) / height - 0.5) * 20;
      el.style.setProperty('--mouse-x', `${x}px`);
      el.style.setProperty('--mouse-y', `${y}px`);
    };
    el.addEventListener('mousemove', onMouseMove);
    return () => el.removeEventListener('mousemove', onMouseMove);
  }, []);

  const scrollToAbout = () => {
    document.querySelector('#about')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section ref={heroRef} className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#050505]">
      {/* Animated background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[600px] h-[600px] rounded-full opacity-20 animate-gradient"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.4) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full opacity-15 animate-float-slow"
          style={{
            background: 'radial-gradient(circle, rgba(255,184,0,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
            animationDelay: '3s',
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,53,0.2) 0%, transparent 60%)',
            filter: 'blur(120px)',
          }}
        />
      </div>

      {/* Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              background: p.id % 3 === 0 ? '#ff6b35' : p.id % 3 === 1 ? '#ffb800' : '#ffffff',
              opacity: p.opacity,
              animation: `float ${p.duration}s ease-in-out ${p.delay}s infinite`,
              boxShadow: `0 0 ${p.size * 3}px currentColor`,
            }}
          />
        ))}
      </div>

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-5"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,107,53,0.3) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,107,53,0.3) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Hero image */}
      <div className="absolute inset-0 pointer-events-none">
        <img
          src={IMAGES.bannerImage}
          alt=""
          className="w-full h-full object-cover opacity-[0.9]"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/60 to-transparent hidden md:block" />
        <div className="absolute inset-0 bg-black/60 md:hidden" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 pt-32 pb-12 md:pt-24 flex flex-col items-center md:items-start text-center md:text-left">
        {/* Heading */}
        <div className="max-w-4xl">
          <h1
            className={`font-black leading-[1.15] tracking-tight mb-4 transition-all duration-1000 delay-100 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
          >
            <span className="block text-[clamp(1.5rem,8vw,4.5rem)] text-white">ELEVATE YOUR</span>
            <span className="block text-[clamp(1.5rem,8vw,4.5rem)] gradient-text-gold">PERFORMANCE</span>
            <span className="block text-[clamp(1.5rem,8vw,4.5rem)] text-white">TO THE</span>
            <span className="block text-[clamp(1.5rem,8vw,4.5rem)] shimmer-text">GAME ON FITNESS.</span>
          </h1>
        </div>

        {/* Subtitle */}
        <p
          className={`text-sm md:text-lg text-white/50 max-w-2xl leading-relaxed mb-10 transition-all duration-1000 delay-300 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          World-class fitness centers engineered for peak human performance.
          Transform your body. Elevate your mind. Redefine your limits.
        </p>


        <div
          ref={statsRef}
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-12 transition-all duration-1000 delay-700 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
            }`}
        >
          <StatItem value={12} suffix="+" label="Elite Branches" start={statsVisible} />
          <StatItem value={50} suffix="K+" label="Active Members" start={statsVisible} />
          <StatItem value={98} suffix="%" label="Success Rate" start={statsVisible} />
          <StatItem value={15} suffix="+" label="Years of Excellence" start={statsVisible} />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0">
        <div className="divider-glow mb-0" />
        <div className="glass py-3">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
            <div className="flex items-center gap-6 overflow-x-auto hide-scrollbar">
              {['State-of-the-Art Equipment', '24/7 Access', 'Expert Trainers', 'Nutrition Plans', 'Personal Coaching'].map((item, i) => (
                <div key={i} className="flex items-center gap-2 whitespace-nowrap">
                  <div className="w-1 h-1 rounded-full bg-[#ff6b35]" />
                  <span className="text-xs text-white/50 tracking-wider uppercase">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Location Permission Prompt */}
      {locationDenied && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="relative glass rounded-xl p-4 min-w-[280px] border border-white/10 shadow-xl">
            <button
              onClick={() => setLocationDenied(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-all"
            >
              <X size={12} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ffb800]/15 border border-[#ffb800]/30 flex items-center justify-center flex-shrink-0">
                <MapPin size={18} className="text-[#ffb800]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Location Required</p>
                <h4 className="text-white font-bold text-sm mb-2">Enable to find nearest branch</h4>
                <button
                  onClick={requestLocation}
                  className="w-full py-2 rounded-lg bg-[#ffb800]/15 border border-[#ffb800]/30 text-[#ffb800] text-xs font-semibold hover:bg-[#ffb800]/25 transition-all duration-200"
                >
                  Enable Location
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Nearest Branch Notification */}
      {!locationLoading && nearestBranch && showLocationBar && (
        <div className="fixed top-20 right-4 z-50 animate-slide-in-right">
          <div className="relative glass rounded-xl p-4 min-w-[280px] border border-white/10 shadow-xl">
            <button
              onClick={() => setShowLocationBar(false)}
              className="absolute top-2 right-2 w-6 h-6 rounded-md hover:bg-white/10 flex items-center justify-center text-white/30 hover:text-white/60 transition-all"
            >
              <X size={12} />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ffb800]/15 border border-[#ffb800]/30 flex items-center justify-center flex-shrink-0">
                <Navigation size={18} className="text-[#ffb800]" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-white/40 uppercase tracking-wider mb-0.5">Nearest Branch</p>
                <h4 className="text-white font-bold text-sm truncate">{nearestBranch.name}</h4>
                <p className="text-xs text-white/50 flex items-center gap-1 mt-0.5">
                  <MapPin size={11} className="text-[#ffb800] flex-shrink-0" />
                  {nearestBranch.distance < 1
                    ? `${Math.round(nearestBranch.distance * 1000)}m`
                    : `${nearestBranch.distance.toFixed(1)} km`
                  }
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                window.location.hash = `#branch/${branches.find(b => b.name === nearestBranch.name)?.id || 'arekere'}`;
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="w-full mt-3 py-2 rounded-lg bg-[#ffb800]/15 border border-[#ffb800]/30 text-[#ffb800] text-xs font-semibold hover:bg-[#ffb800]/25 transition-all duration-200"
            >
              View Details →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
