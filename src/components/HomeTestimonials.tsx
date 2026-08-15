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
    <div className="w-[340px] sm:w-[390px] md:w-[430px] shrink-0 rounded-[2rem] border border-[rgba(22,24,31,0.07)] bg-white/95 backdrop-blur-sm p-7 sm:p-8 shadow-[0_16px_45px_rgba(22,24,31,0.05)] hover:border-[#ff5000]/30 hover:shadow-[0_24px_60px_rgba(255,80,0,0.12)] hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group">
      <div>
        <div className="flex items-start justify-between gap-4 mb-5">
          <div className="flex items-center gap-3.5">
            <div className="relative">
              <img
                src={item.photo}
                alt={item.name}
                className="w-14 h-14 rounded-full object-cover border-2 border-[#fff0e8] group-hover:border-[#ff5000]/40 transition-colors duration-300"
                loading="lazy"
              />
              <span
                className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full bg-[#16a34a] text-white flex items-center justify-center border-2 border-white shadow-sm"
                title="Verified Member"
              >
                <CheckCircle2 size={12} strokeWidth={3} />
              </span>
            </div>
            <div>
              <p className="font-display font-bold text-[#16181f] text-base leading-tight">
                {item.name}
              </p>
              <p className="text-xs text-[#6f7685] font-medium mt-0.5">{item.role}</p>
              <p className="text-[11px] text-[#ff5000] font-semibold flex items-center gap-1 mt-1">
                <MapPin size={11} />
                {item.branch}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={13} className="fill-[#ff5000] text-[#ff5000]" />
              ))}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#6f7685] flex items-center gap-1 bg-[#f7f8fb] px-2.5 py-0.5 rounded-full border border-[rgba(22,24,31,0.06)]">
              <Clock size={10} className="text-[#ff5000]" />
              {item.timeframe}
            </span>
          </div>
        </div>

        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-[#fff0e8] to-[#ffe8de] border border-[#ff5000]/20 text-[#ff5000] text-xs font-bold tracking-tight shadow-sm">
            <Flame size={13} className="text-[#ff5000] fill-[#ff5000]" />
            <span>{item.result}</span>
          </div>
          <span className="text-[11px] font-semibold text-[#6f7685] bg-[#f7f8fb] px-2.5 py-1 rounded-full border border-[rgba(22,24,31,0.06)]">
            {item.categoryLabel}
          </span>
        </div>

        <div className="relative">
          <Quote
            size={24}
            className="absolute -top-1.5 -left-1 text-[#ff5000]/10 -z-0 pointer-events-none"
          />
          <p className="relative z-10 text-[#474d5b] text-sm leading-relaxed italic">
            &ldquo;{item.quote}&rdquo;
          </p>
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-[rgba(22,24,31,0.06)] flex items-center justify-between text-xs">
        <span className="text-[#6f7685] font-medium flex items-center gap-1.5">
          <Sparkles size={13} className="text-[#ff5000]" />
          Key Metric Achieved
        </span>
        <span className="font-display font-bold text-[#e04800] bg-[#fff0e8] border border-[#ff5000]/15 px-3 py-0.5 rounded-full text-xs">
          {item.metricValue}
        </span>
      </div>
    </div>
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
      className="relative py-24 md:py-32 overflow-hidden section-mist scroll-mt-28"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full opacity-40 blur-[120px]"
          style={{ background: 'radial-gradient(circle, rgba(255,80,0,0.1) 0%, transparent 70%)' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative">
        <div ref={headRef} className={`text-center mb-10 md:mb-14 reveal ${headVisible ? 'visible' : ''}`}>
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Member Stories
            </span>
          </div>

          <h2 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[#16181f] mb-5">
            Real members. Real{' '}
            <span className="italic text-[#ff5000]">transformations.</span>
          </h2>

          <p className="text-[#6f7685] text-lg max-w-2xl mx-auto mb-8">
            Every fitness journey begins with a single step. See how our members across Bengaluru transformed their strength, health, and confidence.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[rgba(22,24,31,0.06)] shadow-sm text-xs font-semibold text-[#16181f]">
              <Trophy size={14} className="text-[#ff5000]" />
              <span>10,000+ Transformations</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[rgba(22,24,31,0.06)] shadow-sm text-xs font-semibold text-[#16181f]">
              <Star size={14} className="text-[#ff5000] fill-[#ff5000]" />
              <span>4.9 / 5.0 Average Rating</span>
            </div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[rgba(22,24,31,0.06)] shadow-sm text-xs font-semibold text-[#16181f]">
              <CheckCircle2 size={14} className="text-[#16a34a]" />
              <span>100% Verified Members</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 max-w-4xl mx-auto pt-4 border-t border-[rgba(22,24,31,0.06)]">
            <div className="flex flex-wrap items-center justify-center gap-2 mx-auto sm:mx-0">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 cursor-pointer ${
                    activeCategory === cat.id
                      ? 'bg-[#16181f] text-white shadow-md'
                      : 'bg-white text-[#6f7685] hover:text-[#16181f] border border-[rgba(22,24,31,0.06)] hover:border-[#ff5000]/30 shadow-sm'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2.5 mx-auto sm:mx-0">
              <button
                onClick={() => setIsPaused((prev) => !prev)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(22,24,31,0.08)] shadow-sm text-xs font-semibold text-[#3a3f4b] hover:text-[#ff5000] hover:border-[#ff5000]/40 transition-all duration-300 cursor-pointer"
                title={isPaused ? 'Resume Auto-scroll' : 'Pause Auto-scroll'}
              >
                {isPaused ? <Play size={13} className="text-[#16a34a] fill-[#16a34a]" /> : <Pause size={13} className="text-[#ff5000]" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleManualScroll('left')}
                  className="w-8 h-8 rounded-full bg-white border border-[rgba(22,24,31,0.08)] shadow-sm flex items-center justify-center text-[#3a3f4b] hover:text-[#ff5000] hover:border-[#ff5000]/40 transition-all duration-200 cursor-pointer"
                  aria-label="Scroll left"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => handleManualScroll('right')}
                  className="w-8 h-8 rounded-full bg-white border border-[rgba(22,24,31,0.08)] shadow-sm flex items-center justify-center text-[#3a3f4b] hover:text-[#ff5000] hover:border-[#ff5000]/40 transition-all duration-200 cursor-pointer"
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
        <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 bg-gradient-to-r from-[#f7f8fb] via-[#f7f8fb]/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-32 md:w-48 bg-gradient-to-l from-[#f7f8fb] via-[#f7f8fb]/80 to-transparent z-20 pointer-events-none" />

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
          <p className="font-display text-2xl md:text-4xl font-bold tracking-tight text-[#16181f]">
            Your story could be{' '}
            <span className="italic text-[#ff5000]">next.</span>
          </p>
          <p className="text-[#6f7685] text-sm md:text-base mt-2 max-w-md mx-auto">
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
