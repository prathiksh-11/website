import { useState, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { MapPin, Clock, Dumbbell, ChevronRight, Users } from 'lucide-react';

const branches = [
  {
    id: 'arekere',
    name: 'GAME ON FITNESS AREKERE',
    city: 'Arekere, Bengaluru',
    address: 'Above Poorvika Mobiles, near Sai Baba temple, Arekere, Bengaluru - 560076',
    phone: '+91 8861737392',
    tag: 'Premium',
    image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    members: '2,500+',
    area: '15,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Weight Training', 'Cardio Zone', 'Group Classes', 'Steam Room'],
    accentColor: '#ff6b35',
    gradient: 'from-[#ff6b35]/30 to-transparent',
  },
  {
    id: 'vijaya-bank-layout',
    name: 'GAME ON FITNESS VIJAYA BANK LAYOUT',
    city: 'Vijaya Bank Layout, Bengaluru',
    address: '3rd floor, Vijaya Bank Layout circle, near Indian Oil petrol bunk, Bilekahalli, Bengaluru - 560076',
    phone: '+91 9035279516',
    tag: 'Flagship',
    image: 'https://images.pexels.com/photos/1534438/pexels-photo-1534438.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    members: '3,200+',
    area: '18,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Olympic Pool', 'CrossFit Box', 'Yoga Studio', 'Recovery Center'],
    accentColor: '#ffb800',
    gradient: 'from-[#ffb800]/30 to-transparent',
  },
  {
    id: 'btm-layout-1',
    name: 'GAME ON FITNESS BTM LAYOUT - 1',
    city: 'BTM Layout, Bengaluru',
    address: 'Opp to Canara Bank, 18th Main Road BTM 2nd Stage, Bengaluru - 560076',
    phone: '+91 8722299457',
    tag: 'Elite',
    image: 'https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    members: '2,800+',
    area: '16,500 sq ft',
    hours: '5:30 AM – 11 PM',
    facilities: ['Functional Training', 'Zumba Studio', 'Personal Training', 'Cafe'],
    accentColor: '#00ff8a',
    gradient: 'from-[#00ff8a]/20 to-transparent',
  },
  {
    id: 'btm-layout-2',
    name: 'GAME ON FITNESS BTM LAYOUT - 2',
    city: 'BTM Layout, Bengaluru',
    address: 'Above Indian Bank, 7th Main Road BTM 2nd Stage, Bengaluru - 560076',
    phone: '+91 8951028839',
    tag: 'Luxury',
    image: 'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    members: '2,100+',
    area: '12,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Boxing Ring', 'Pilates Studio', 'Sauna', 'Smoothie Bar'],
    accentColor: '#a78bfa',
    gradient: 'from-[#a78bfa]/25 to-transparent',
  },
  {
    id: 'wilson-garden',
    name: 'GAME ON FITNESS WILSON GARDEN',
    city: 'Wilson Garden, Bengaluru',
    address: 'Opp to Traffic Police Station, Vinayaka Nagar, Wilson Garden, Bengaluru - 560027',
    phone: '+91 9663995409',
    tag: 'Premium',
    image: 'https://images.pexels.com/photos/1440727/pexels-photo-1440727.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    members: '1,900+',
    area: '14,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['AI Training', 'VR Fitness', 'Biometric Lab', 'Recovery Suite'],
    accentColor: '#ff6b35',
    gradient: 'from-[#ff6b35]/25 to-transparent',
  },
  {
    id: 'jp-nagar',
    name: 'GAME ON FITNESS JP NAGAR',
    city: 'JP Nagar, Bengaluru',
    address: 'Above Poorvika Mobiles, Opp to RBI Layout Bus Stop, JP Nagar 7th phase, Bengaluru - 560078',
    phone: '+91 9980615580',
    tag: 'Elite',
    image: 'https://images.pexels.com/photos/3253499/pexels-photo-3253499.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    members: '1,600+',
    area: '13,500 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Rock Climbing', 'Martial Arts', 'Outdoor Deck', 'Juice Bar'],
    accentColor: '#ffb800',
    gradient: 'from-[#ffb800]/25 to-transparent',
  },
  {
    id: 'akshayanagar',
    name: 'GAME ON FITNESS AKSHAYANAGAR',
    city: 'Akshayanagar, Bengaluru',
    address: 'Above Reliance Smart, near DLF, Akshayanagar, Bengaluru - 560068',
    phone: '+91 8431198114',
    tag: 'Flagship',
    image: 'https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    members: '2,200+',
    area: '14,500 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Weight Training', 'Group Classes', 'Steam Room', 'Cardio Zone'],
    accentColor: '#00ff8a',
    gradient: 'from-[#00ff8a]/25 to-transparent',
  },
  {
    id: 'sarjapur-road',
    name: 'GAME ON FITNESS SARJAPUR ROAD',
    city: 'Sarjapur Road, Bengaluru',
    address: '3rd floor above Baby Store, opp to Divyasree Elan, next to More Mega Store, Bellandur gate, Sarjapur Main Road, Bengaluru - 560035',
    phone: '+91 8618086458',
    tag: 'Premium',
    image: 'https://images.pexels.com/photos/1534438/pexels-photo-1534438.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop',
    members: '2,500+',
    area: '15,000 sq ft',
    hours: '5 AM – 11 PM',
    facilities: ['Weight Training', 'Cardio Zone', 'Group Classes', 'Steam Room'],
    accentColor: '#ff6b35',
    gradient: 'from-[#ff6b35]/30 to-transparent',
  },
];

const facilityIcons: Record<string, any> = {
  'Weight Training': Dumbbell,
  'Cardio Zone': Dumbbell,
  'Group Classes': Users,
  'Steam Room': Clock,
  'Olympic Pool': Dumbbell,
  'CrossFit Box': Dumbbell,
  'Yoga Studio': Users,
  'Recovery Center': Clock,
  'Functional Training': Dumbbell,
  'Zumba Studio': Users,
  'Personal Training': Dumbbell,
  'Cafe': Clock,
  'default': Dumbbell,
};

interface BranchCardProps {
  branch: typeof branches[0];
  index: number;
  isVisible: boolean;
}

function BranchCard({ branch, index, isVisible }: BranchCardProps) {
  const [hovered, setHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

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
    
          {/* Members badge */}
          <div className="absolute top-4 right-4 glass-card rounded-lg px-3 py-1.5 flex items-center gap-1.5">
            <Users size={12} className="text-white/60" />
            <span className="text-xs font-semibold text-white">{branch.members}</span>
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
    
          {/* Facilities */}
          <div className="grid grid-cols-2 gap-2 mb-auto">
            {branch.facilities.map((facility, fi) => {
              const Icon = facilityIcons[facility] || facilityIcons.default;
              return (
                <div key={fi} className="flex items-center gap-2">
                  <div
                    className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: `${branch.accentColor}15` }}
                  >
                    <Icon size={10} className="text-white/60" />
                  </div>
                  <span className="text-xs text-white/50 truncate">{facility}</span>
                </div>
              );
            })}
          </div>
    
          {/* CTA */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              window.location.hash = `#branch/${branch.id}`;
            }}
            className="mt-5 w-full py-2.5 rounded-xl text-xs font-bold tracking-wider uppercase transition-all duration-300"
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
          <div className={`reveal-right ${headVisible ? 'visible' : ''} max-w-sm`}>
            <p className="text-white/50 leading-relaxed">
              12 world-class facilities across the country. Each branch engineered
              for peak performance with unique features tailored to its city.
            </p>
          </div>
        </div>

        {/* Branches Grid */}
        <div
          ref={gridRef}
          className="grid md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {branches.map((branch, i) => (
            <BranchCard key={branch.id} branch={branch} index={i} isVisible={gridVisible} />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`reveal ${headVisible ? 'visible' : ''} text-center mt-16`}>
          <p className="text-white/40 text-sm mb-4">Don't see your city? We're expanding.</p>
          <button className="btn-outline-glow px-8 py-3 rounded-full text-sm font-bold tracking-wider uppercase">
            Request a Branch
          </button>
        </div>
      </div>
    </section>
  );
}
