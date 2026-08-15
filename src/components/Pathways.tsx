import React, { useState } from 'react';
import {
  ArrowRight,
  Flame,
  Trophy,
  RefreshCw,
  Target,
  Shield,
  Heart,
  Sparkles,
  CheckCircle2,
  X,
  Zap,
} from 'lucide-react';
import WhatsAppIcon from './WhatsAppIcon';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface Pathway {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  tagline: string;
  category: string;
  filter: string;
  description: string;
  icon: React.ElementType;
  goal: string;
  pillars: string[];
  schedule: string;
  image: string;
}

const pathways: Pathway[] = [
  {
    id: 'warrior',
    number: '01',
    title: 'The Warrior',
    subtitle: 'Compound Power & Barbell Mastery',
    tagline: 'Forge unbreakable physical strength and mental resilience.',
    category: 'Raw Strength & Power',
    filter: 'Strength',
    description:
      'Heavy lifts, structured progressive overload, and a mindset that refuses to quit mid-rep. Built for those who measure progress in raw weight, barbell precision, and unwavering discipline.',
    icon: Flame,
    goal: '100% Strength Mastery',
    pillars: [
      'Olympic & Powerlifting Platforms',
      'Data-Driven Overload Tracking',
      '1-on-1 Biomechanical Form Coaching',
    ],
    schedule: '4 to 5 Days / Week • Heavy Compound Splits',
    image:
      'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
  },
  {
    id: 'athlete',
    number: '02',
    title: 'The Athlete',
    subtitle: 'Agility, Speed & High Performance',
    tagline: 'Speed, explosive velocity, and athletic conditioning.',
    category: 'Athletic Performance',
    filter: 'Performance',
    description:
      'Engineered for multi-planar agility, VO2 max endurance, and explosive power. Train on our 40m sprint turf with sled pushes, plyometric drills, and metabolic threshold conditioning.',
    icon: Trophy,
    goal: 'Explosive Velocity & Stamina',
    pillars: [
      '40m Sprint Turf & Sled Pushes',
      'Plyometric & Cardiovascular Drills',
      'Rotational Power & Core Stability',
    ],
    schedule: '4 Days / Week • Athletic Conditioning',
    image:
      'https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
  },
  {
    id: 'transformer',
    number: '03',
    title: 'The Transformer',
    subtitle: 'Total Body Recomposition & Fat Loss',
    tagline: 'Transform your body composition and build lean muscle.',
    category: 'Total Recomposition',
    filter: 'Transformation',
    description:
      'Targeted fat loss paired with sculpted muscle tone. A scientifically engineered combination of metabolic resistance training, bi-weekly InBody scans, and custom macro nutrition coaching.',
    icon: RefreshCw,
    goal: '-10kg to -15kg Fat Loss & Tone',
    pillars: [
      'Custom Macro & Nutrition Strategy',
      'Metabolic Resistance Training (MetCon)',
      'Bi-Weekly InBody Body Scans',
    ],
    schedule: '4 to 5 Days / Week • Hypertrophy & MetCon',
    image:
      'https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
  },
  {
    id: 'disciplined',
    number: '04',
    title: 'The Disciplined',
    subtitle: 'Habit Architecture & Consistency',
    tagline: 'Establish unshakeable routines that outlast fleeting motivation.',
    category: 'Habits & Longevity',
    filter: 'Habits',
    description:
      'Consistency is your greatest superpower. Structured workout splits, personal accountability check-ins, and realistic habit stacking designed to make fitness an effortless part of daily life.',
    icon: Target,
    goal: '100% Habit Consistency',
    pillars: [
      'Structured 4-Day Weekly Routines',
      'Trainer Accountability & Tracking',
      'High-Energy Community Motivation',
    ],
    schedule: '3 to 4 Days / Week • Sustainable Fitness',
    image:
      'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
  },
  {
    id: 'champion',
    number: '05',
    title: 'The Champion',
    subtitle: 'Peak PRs & Elite Mastery',
    tagline: 'Break through plateaus and elevate your competitive standard.',
    category: 'Elite Mastery',
    filter: 'Strength',
    description:
      'For experienced lifters looking to shatter personal bests. Periodized training blocks, specialized thermal contrast recovery (cold plunge + sauna), and biomechanical video form analysis.',
    icon: Shield,
    goal: 'Shatter Personal Records',
    pillars: [
      'Periodized High-Performance Blocks',
      'Cold Plunge & Infrared Sauna Recovery',
      'Biomechanical Video Form Analysis',
    ],
    schedule: '5 Days / Week • Advanced Periodization',
    image:
      'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
  },
  {
    id: 'health-seeker',
    number: '06',
    title: 'The Health Seeker',
    subtitle: 'Spine Health, Mobility & Vitality',
    tagline: 'Sustainable strength, joint mobility, and pain-free daily energy.',
    category: 'Mobility & Vitality',
    filter: 'Mobility',
    description:
      'Fix sedentary desk posture, rehab old joint aches, and build a body that feels energized and agile every single day. Low-impact progressive movements designed for long-term health.',
    icon: Heart,
    goal: 'Pain-Free Daily Vitality',
    pillars: [
      'Postural Alignment & Posterior Chain',
      'Joint Mobility & Functional Flexibility',
      'Core Rehabilitation Drills',
    ],
    schedule: '3 to 4 Days / Week • Mobility & Functional Strength',
    image:
      'https://images.pexels.com/photos/3757376/pexels-photo-3757376.jpeg?auto=compress&cs=tinysrgb&w=1200&h=1600&fit=crop',
  },
];

const filterCategories = [
  { id: 'All', label: 'All Pathways (6)' },
  { id: 'Strength', label: 'Strength & Power' },
  { id: 'Performance', label: 'Athletic Agility' },
  { id: 'Transformation', label: 'Fat Loss & Recomp' },
  { id: 'Habits', label: 'Habit & Routine' },
  { id: 'Mobility', label: 'Spine & Mobility' },
];

export default function Pathways() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedPathway, setSelectedPathway] = useState<Pathway | null>(null);

  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: gridRef, isVisible: gridVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.05,
  });

  const filteredPathways =
    activeFilter === 'All'
      ? pathways
      : pathways.filter((p) => p.filter === activeFilter);

  const handleStartPathway = (path: Pathway) => {
    const text = encodeURIComponent(
      `Hi Game On Fitness! I want to start my journey with the ${path.title} pathway (${path.category}). Please book my free trial session.`
    );
    window.open(`https://wa.me/919148974009?text=${text}`, '_blank');
  };

  return (
    <section id="pathways" className="relative py-24 md:py-32 overflow-hidden atmosphere scroll-mt-24">
      {/* Background Ambient Aura */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-[#ff5000]/6 rounded-full blur-[140px]" />
        <div className="absolute -bottom-20 right-0 w-[500px] h-[500px] bg-[#ff5000]/5 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div
          ref={headRef}
          className={`text-center mb-12 md:mb-16 reveal ${headVisible ? 'visible' : ''}`}
        >
          <div className="section-ornament justify-center mb-4">
            <span className="text-xs font-bold tracking-[0.35em] uppercase text-[#ff5000]">
              Training Archetypes
            </span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[#16181f] mb-5">
            Every journey has a <span className="italic text-[#ff5000]">blueprint.</span>
          </h2>

          <p className="text-[#6f7685] text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
            Choose your training archetype. Our elite coaches engineer the exact progressive overload, biomechanics, and nutrition strategy for your goal.
          </p>

          {/* Interactive Filter Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-8">
            {filterCategories.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 cursor-pointer ${
                  activeFilter === tab.id
                    ? 'bg-gradient-to-r from-[#ff7a3d] to-[#ff5e1a] text-white shadow-[0_8px_24px_rgba(255,112,51,0.35)] scale-105'
                    : 'bg-white text-[#6f7685] border border-[rgba(22,24,31,0.08)] hover:border-[#ff7033]/40 hover:text-[#16181f]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 6-Card High-Fashion Magazine Poster Grid */}
        <div
          ref={gridRef}
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 reveal ${
            gridVisible ? 'visible' : ''
          }`}
        >
          {filteredPathways.map((path) => {
            const Icon = path.icon;
            return (
              <article
                key={path.id}
                onClick={() => setSelectedPathway(path)}
                className="group relative rounded-[2rem] overflow-hidden min-h-[520px] sm:min-h-[560px] flex flex-col justify-between p-6 sm:p-7 bg-[#16181f] border border-white/10 shadow-[0_20px_50px_rgba(22,24,31,0.1)] hover:shadow-[0_30px_70px_rgba(255,112,51,0.25)] hover:border-[#ff7033]/50 hover:-translate-y-2 transition-all duration-500 cursor-pointer"
              >
                {/* Full Bleed Athletic Background Photography */}
                <div className="absolute inset-0 z-0 overflow-hidden">
                  <img
                    src={path.image}
                    alt={path.title}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 brightness-90"
                    loading="lazy"
                  />
                  {/* Cinematic Dark Gradient Layers */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16181f] via-[#16181f]/60 to-[#16181f]/30" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#16181f]/80 via-transparent to-transparent" />
                </div>

                {/* Top Row: Index Badge & Icon */}
                <div className="relative z-10 flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white text-xs font-black tracking-widest uppercase shadow-md">
                    <span className="text-[#ff7a3d]">{path.number}</span>
                    <span className="w-1 h-1 rounded-full bg-white/40" />
                    <span>{path.category}</span>
                  </span>

                  <div className="w-10 h-10 rounded-full bg-[#ff7033] text-white flex items-center justify-center shadow-[0_0_15px_rgba(255,112,51,0.5)] group-hover:scale-110 transition-transform">
                    <Icon size={18} />
                  </div>
                </div>

                {/* Center / Goal Chip */}
                <div className="relative z-10 my-auto py-6">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ff7033]/15 border border-[#ff7033]/40 text-[#ff8c56] text-xs font-bold shadow-sm backdrop-blur-md">
                    <Sparkles size={13} className="text-[#ff7033] fill-[#ff7033]" />
                    <span>{path.goal}</span>
                  </div>
                </div>

                {/* Bottom Content Area */}
                <div className="relative z-10 pt-4">
                  <h3 className="font-display text-2xl sm:text-3xl font-black text-white tracking-tight leading-tight group-hover:text-[#ff7a3d] transition-colors duration-300 mb-1">
                    {path.title}
                  </h3>
                  <p className="text-xs sm:text-sm font-semibold text-[#ff8c56] mb-3">
                    {path.subtitle}
                  </p>

                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-5 line-clamp-2">
                    {path.tagline}
                  </p>

                  {/* 3 Core Pillar Badges */}
                  <div className="space-y-1.5 mb-5">
                    {path.pillars.map((pillar, pIdx) => (
                      <div
                        key={pIdx}
                        className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-gray-200"
                      >
                        <CheckCircle2 size={13} className="text-[#ff7033] shrink-0" />
                        <span className="truncate">{pillar}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA Row */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/15">
                    <span className="text-xs font-bold text-gray-400 group-hover:text-white transition-colors">
                      View Blueprint
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#ff7033] text-white text-xs font-bold uppercase tracking-wider shadow-[0_4px_15px_rgba(255,112,51,0.4)] group-hover:bg-[#ff8044] group-hover:gap-2.5 transition-all">
                      <span>Explore</span>
                      <ArrowRight size={13} />
                    </span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Head Coach Matching Banner */}
        <div className="mt-14 sm:mt-16 rounded-3xl bg-gradient-to-r from-[#16181f] via-[#1f222d] to-[#16181f] border border-[#ff5000]/30 p-6 sm:p-8 md:p-10 shadow-[0_20px_50px_rgba(22,24,31,0.15)] flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#ff5000] to-[#d43c00] text-white flex items-center justify-center shrink-0 shadow-[0_0_25px_rgba(255,80,0,0.45)]">
              <Zap size={26} />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-[#ff7a38] mb-1">
                Not sure which pathway fits you?
              </p>
              <h4 className="font-display text-xl sm:text-2xl font-bold text-white">
                Get Matched with a Game On Head Coach
              </h4>
              <p className="text-gray-300 text-xs sm:text-sm mt-0.5">
                We analyze your lifestyle, injury history, and target goals during your free trial.
              </p>
            </div>
          </div>

          <a
            href="https://wa.me/919148974009?text=Hi%20Game%20On%20Fitness!%20Help%20me%20choose%20the%20right%20training%20pathway%20for%20my%20goals."
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white text-sm font-bold shadow-[0_10px_28px_rgba(37,211,102,0.4)] hover:scale-105 transition-all duration-300 cursor-pointer shrink-0"
          >
            <WhatsAppIcon size={18} />
            <span>Get Free Assessment</span>
            <ArrowRight size={16} />
          </a>
        </div>
      </div>

      {/* Interactive Detail Modal Drawer */}
      {selectedPathway && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-2xl rounded-3xl bg-[#16181f] border-2 border-[#ff5000]/40 p-6 sm:p-8 text-white shadow-[0_25px_80px_rgba(0,0,0,0.9)] overflow-hidden max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setSelectedPathway(null)}
              className="absolute top-5 right-5 w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X size={18} />
            </button>

            {/* Modal Header */}
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#ff5000] text-white flex items-center justify-center shadow-[0_0_20px_rgba(255,80,0,0.6)] shrink-0">
                {React.createElement(selectedPathway.icon, { size: 24 })}
              </div>
              <div>
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#ff7a38]">
                  Pathway {selectedPathway.number} • {selectedPathway.category}
                </span>
                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
                  {selectedPathway.title}
                </h3>
              </div>
            </div>

            <p className="text-[#ff7a38] text-sm sm:text-base font-bold mb-3">
              {selectedPathway.tagline}
            </p>

            <p className="text-gray-300 text-sm leading-relaxed mb-6">
              {selectedPathway.description}
            </p>

            {/* Target Goal Pill */}
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 mb-6 flex items-center justify-between">
              <span className="text-xs font-semibold text-gray-300">Target Outcome:</span>
              <span className="text-xs sm:text-sm font-bold text-[#ff5000]">
                {selectedPathway.goal}
              </span>
            </div>

            {/* 3 Core Pillars */}
            <div className="space-y-2 mb-6">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
                What Your Roadmap Includes:
              </p>
              {selectedPathway.pillars.map((pillar, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-white/5 border border-white/10 text-sm text-gray-200"
                >
                  <CheckCircle2 size={16} className="text-[#ff5000] shrink-0" />
                  <span>{pillar}</span>
                </div>
              ))}
            </div>

            {/* Schedule */}
            <div className="text-xs text-gray-400 mb-6">
              <span className="font-semibold text-white">Weekly Split: </span>
              {selectedPathway.schedule}
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => handleStartPathway(selectedPathway)}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#ff7a3d] to-[#ff5e1a] hover:from-[#ff8c56] hover:to-[#ff6e2e] text-white font-bold text-sm shadow-[0_10px_25px_rgba(255,112,51,0.35)] transition-all cursor-pointer"
              >
                <span>Start {selectedPathway.title} Pathway</span>
                <ArrowRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setSelectedPathway(null)}
                className="px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
