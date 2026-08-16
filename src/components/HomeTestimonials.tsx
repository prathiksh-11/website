import { useState, useRef } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import {
  Star,
  Quote,
  MapPin,
  CheckCircle2,
  Pause,
  Play,
  Flame,
  Sparkles,
  Clock,
  Trophy,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';

interface Testimonial {
  id: string;
  name: string;
  role: string;
  result: string;
  quote: string;
  branch: string;
  photo: string;
  category: 'fat-loss' | 'muscle' | 'endurance' | 'mobility';
  categoryLabel: string;
  timeframe: string;
  metricLabel: string;
  metricValue: string;
}

const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Ananya Roy',
    role: 'Product Designer',
    result: 'Lost 8kg & dropped 2 dress sizes',
    quote:
      'The trainers structured a progressive plan without ever making me feel judged or overwhelmed. I lost 8kg in 60 days and finally feel confident walking into any room.',
    branch: 'BTM Layout',
    category: 'fat-loss',
    categoryLabel: 'Fat Loss',
    timeframe: '60 Days',
    metricLabel: 'Weight Drop',
    metricValue: '-8 kg',
    photo:
      'https://images.pexels.com/photos/775417/pexels-photo-775417.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  },
  {
    id: '2',
    name: 'Rahul Kulkarni',
    role: 'Software Architect',
    result: 'Gained 6kg muscle & hit 140kg deadlift',
    quote:
      'Structured strength training, proper recovery protocols, and practical nutrition guidance changed everything. My energy levels at work and posture have completely transformed.',
    branch: 'Arekere',
    category: 'muscle',
    categoryLabel: 'Muscle Building',
    timeframe: '4 Months',
    metricLabel: 'Lean Mass',
    metricValue: '+6 kg',
    photo:
      'https://images.pexels.com/photos/1229356/pexels-photo-1229356.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  },
  {
    id: '3',
    name: 'Meera Subramaniam',
    role: 'Marketing Lead',
    result: 'Lost 12kg & sustained healthy lifestyle',
    quote:
      'From day one, the coaches made me feel so welcome. The community here keeps me accountable — I never thought I would look forward to 6:30 AM workouts every day!',
    branch: 'Sarjapur Road',
    category: 'fat-loss',
    categoryLabel: 'Transformation',
    timeframe: '5 Months',
    metricLabel: 'Total Lost',
    metricValue: '-12 kg',
    photo:
      'https://images.pexels.com/photos/3764011/pexels-photo-3764011.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  },
  {
    id: '4',
    name: 'Vikram Menon',
    role: 'Fintech Consultant',
    result: 'Completed 1st Half-Marathon (1h 48m)',
    quote:
      "Game On's functional conditioning and VO2 max training took my cardiovascular stamina to a whole new level. Smashed my personal race target effortlessly.",
    branch: 'HSR Layout',
    category: 'endurance',
    categoryLabel: 'Endurance',
    timeframe: '90 Days',
    metricLabel: 'Half-Marathon',
    metricValue: '1h 48m',
    photo:
      'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  },
  {
    id: '5',
    name: 'Sneha Patel',
    role: 'HR Director & New Mom',
    result: 'Postpartum core rebuilt & 50% strength gain',
    quote:
      'Post-pregnancy fitness felt intimidating until I met my trainer here. Safe, progressive core rehabilitation gave me back my strength, posture, and daily energy.',
    branch: 'Kasavanahalli',
    category: 'mobility',
    categoryLabel: 'Postpartum & Core',
    timeframe: '6 Months',
    metricLabel: 'Strength Gain',
    metricValue: '+50%',
    photo:
      'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  },
  {
    id: '6',
    name: 'Arvind Nambiar',
    role: 'Tech Lead',
    result: 'Reversed chronic 3-year lower back pain',
    quote:
      'Sitting at a desk for 10 hours ruined my spine. With targeted posterior chain strengthening and mobility drills, I have been 100% pain-free for months.',
    branch: 'Electronic City',
    category: 'mobility',
    categoryLabel: 'Mobility & Rehab',
    timeframe: '90 Days',
    metricLabel: 'Pain Reduction',
    metricValue: '100% Free',
    photo:
      'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
  },
];

function TestimonialCard({ item }: { item: Testimonial }) {
  if (!item) return null;

  return (
    <article className="testimonial-card-float testimonial-shine group w-[320px] sm:w-[380px] md:w-[420px] shrink-0 rounded-[2rem] overflow-hidden bg-gradient-to-b from-white to-[#fff4ed] border border-[#ffd7c0] shadow-[0_20px_50px_rgba(255,112,51,0.14)] hover:shadow-[0_28px_70px_rgba(255,80,0,0.22)] hover:border-[#ffb089] transition-shadow duration-300 flex flex-col">
      <div className="relative h-44 sm:h-48 overflow-hidden">
        <img
          src={item.photo}
          alt={item.name}
          className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#5c3a2a]/75 via-[#5c3a2a]/15 to-transparent" />

        <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/92 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-[#c45a28] border border-white/80">
          <Clock size={10} />
          {item.timeframe}
        </span>
        <span className="absolute top-3 right-3 inline-flex items-center gap-0.5 px-2 py-1 rounded-full bg-white/92 backdrop-blur-md">
          {[...Array(5)].map((_, j) => (
            <Star key={j} size={11} className="fill-[#ff5000] text-[#ff5000]" />
          ))}
        </span>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-3">
          <div>
            <p className="font-display font-bold text-white text-lg leading-tight drop-shadow-sm">
              {item.name}
            </p>
            <p className="text-xs text-white/85 font-medium mt-0.5">{item.role}</p>
          </div>
          <p className="text-[11px] text-white font-semibold flex items-center gap-1 shrink-0 bg-[#ff5000]/90 px-2.5 py-1 rounded-full">
            <MapPin size={11} />
            {item.branch}
          </p>
        </div>
      </div>

      <div className="p-5 sm:p-6 flex flex-col flex-1">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-[#ff7a3d] to-[#ff5e1a] text-white text-xs font-bold tracking-tight shadow-[0_8px_18px_rgba(255,80,0,0.28)]">
            <Flame size={13} className="fill-white" />
            <span>{item.result}</span>
          </div>
          <span className="text-[11px] font-semibold text-[#c45a28] bg-[#fff0e8] px-2.5 py-1 rounded-full border border-[#ffd7c0]">
            {item.categoryLabel}
          </span>
        </div>

        <div className="relative flex-1">
          <Quote
            size={42}
            className="testimonial-quote-mark absolute -top-2 -left-1 text-[#ff5000] pointer-events-none"
          />
          <p className="relative z-10 text-[#5c3a2a] text-sm leading-relaxed italic pl-5">
            &ldquo;{item.quote}&rdquo;
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-[#ffeadc] flex items-center justify-between text-xs">
          <span className="text-[#8a6a58] font-medium flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#ff5000]" />
            Key metric
          </span>
          <span className="font-display font-bold text-white bg-gradient-to-r from-[#ff7a3d] to-[#ff5e1a] px-3.5 py-1 rounded-full text-xs shadow-[0_6px_16px_rgba(255,80,0,0.28)]">
            {item.metricValue}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function HomeTestimonials() {
  const [isPaused, setIsPaused] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: contentRef, isVisible: contentVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
  });

  const filteredTestimonials =
    activeCategory === 'all'
      ? testimonials
      : testimonials.filter((t) => t.category === activeCategory);

  const categories = [
    { id: 'all', label: 'All Stories (6)' },
    { id: 'fat-loss', label: 'Fat Loss' },
    { id: 'muscle', label: 'Muscle Building' },
    { id: 'endurance', label: 'Endurance' },
    { id: 'mobility', label: 'Rehab & Mobility' },
  ];

  const handleManualScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -420 : 420;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="testimonials"
      className="relative py-24 md:py-32 overflow-hidden scroll-mt-28 bg-gradient-to-b from-[#fff6ef] via-[#ffe8d6] to-[#fff4ed]"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="testimonial-orb absolute -top-10 -left-10 w-[420px] h-[420px] rounded-full bg-[#ffb089]/40 blur-[90px]" />
        <div className="testimonial-orb-delay absolute top-1/3 -right-16 w-[380px] h-[380px] rounded-full bg-[#f5d9a6]/50 blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[70%] h-[280px] rounded-full bg-white/50 blur-[80px]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div ref={headRef} className={`text-center mb-10 md:mb-14 reveal ${headVisible ? 'visible' : ''}`}>
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Member Stories
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[#5c3a2a] mb-5">
            Real members. Real{' '}
            <span className="italic text-[#ff5000]">transformations.</span>
          </h2>

          <p className="text-[#8a6a58] text-lg max-w-2xl mx-auto mb-8">
            Every fitness journey begins with a single step. See how our members across Bengaluru transformed their strength, health, and confidence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#ffd7c0] shadow-[0_8px_20px_rgba(255,176,137,0.2)] text-xs font-semibold text-[#5c3a2a]">
              <Trophy size={14} className="text-[#ff5000]" />
              <span>10,000+ Transformations</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#ffd7c0] shadow-[0_8px_20px_rgba(255,176,137,0.2)] text-xs font-semibold text-[#5c3a2a]">
              <Star size={14} className="text-[#ff5000] fill-[#ff5000]" />
              <span>4.9 / 5.0 Average Rating</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-[#ffd7c0] shadow-[0_8px_20px_rgba(255,176,137,0.2)] text-xs font-semibold text-[#5c3a2a]">
              <CheckCircle2 size={14} className="text-[#16a34a]" />
              <span>100% Verified Members</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 max-w-4xl mx-auto pt-4 border-t border-[#ffd7c0]">
            <div className="flex flex-wrap items-center justify-center gap-2 mx-auto sm:mx-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-gradient-to-r from-[#ff7a3d] to-[#ff5e1a] text-white shadow-[0_8px_18px_rgba(255,80,0,0.28)]'
                      : 'bg-white/80 text-[#8a6a58] hover:text-[#ff5000] border border-[#ffd7c0] hover:border-[#ffb089] shadow-sm'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 border border-[#ffd7c0] shadow-sm text-xs font-semibold text-[#5c3a2a] hover:text-[#ff5000] hover:border-[#ffb089] transition-all duration-300 cursor-pointer"
                title={isPaused ? 'Resume Auto-scroll' : 'Pause Auto-scroll'}
              >
                {isPaused ? <Play size={13} className="text-[#16a34a] fill-[#16a34a]" /> : <Pause size={13} className="text-[#ff5000]" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleManualScroll('left')}
                  className="w-8 h-8 rounded-full bg-white/80 border border-[#ffd7c0] shadow-sm flex items-center justify-center text-[#5c3a2a] hover:text-[#ff5000] hover:border-[#ffb089] transition-all duration-200 cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => handleManualScroll('right')}
                  className="w-8 h-8 rounded-full bg-white/80 border border-[#ffd7c0] shadow-sm flex items-center justify-center text-[#5c3a2a] hover:text-[#ff5000] hover:border-[#ffb089] transition-all duration-200 cursor-pointer"
                  aria-label="Scroll right"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div ref={contentRef} className={`relative reveal ${contentVisible ? 'visible' : ''}`}>
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 bg-gradient-to-r from-[#ffe8d6] via-[#ffe8d6]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 bg-gradient-to-l from-[#ffe8d6] via-[#ffe8d6]/80 to-transparent z-20 pointer-events-none" />

        <div className="overflow-hidden py-3" ref={scrollContainerRef}>
          <div
            className="marquee-track-slow flex w-max gap-6"
            style={{ animationPlayState: isPaused ? 'paused' : undefined }}
          >
            {[
              ...filteredTestimonials,
              ...filteredTestimonials,
              ...filteredTestimonials,
            ].map((item, idx) => (
              <TestimonialCard key={`testimonial-${item.id}-${idx}`} item={item} />
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 relative">
        <div
          className={`mt-14 md:mt-16 text-center reveal ${contentVisible ? 'visible' : ''}`}
          style={{ transitionDelay: '0.2s' }}
        >
          <p className="font-display text-2xl md:text-4xl font-bold tracking-tight text-[#5c3a2a]">
            Your story could be{' '}
            <span className="italic text-[#ff5000]">next.</span>
          </p>
          <p className="text-[#8a6a58] text-sm md:text-base mt-2 max-w-md mx-auto">
            Book a complimentary session with an elite coach at your nearest branch today.
          </p>
          <button
            onClick={() =>
              document.querySelector('#branches')?.scrollIntoView({ behavior: 'smooth' })
            }
            className="btn-premium-primary mt-6 font-semibold px-10 py-4 rounded-full text-sm tracking-wide shadow-[0_12px_32px_rgba(255,80,0,0.3)] hover:shadow-[0_16px_40px_rgba(255,80,0,0.45)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </section>
  );
}
