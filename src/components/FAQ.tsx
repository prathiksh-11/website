import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Plus, Minus } from 'lucide-react';

const faqs = [
  {
    q: 'What makes GAME ON FITNESS different from other gyms?',
    a: "GAME ON FITNESS is a complete performance ecosystem — not just a place to work out. We combine state-of-the-art equipment, evidence-based programming, expert coaches, and nutritional support under one roof. Our approach is rooted in sports science, personalized to each member, and relentlessly focused on measurable results. Think of it less as a gym membership and more as an investment in your peak performance.",
  },
  {
    q: 'How do I get started as a new member?',
    a: "Getting started is simple. Book a free 45-minute Performance Assessment with one of our coaches through the Contact form or call any branch directly. During your assessment, we'll evaluate your current fitness level, discuss your goals, and create a personalized roadmap. After that, you select the membership tier that fits you best and we get to work.",
  },
  {
    q: 'What membership options are available?',
    a: "We offer three main membership tiers: Essential (access to your home branch, standard equipment, group classes), Elite (multi-branch access, unlimited classes, monthly coaching check-in), and Game On Fitness Pro (all-access, dedicated trainer, nutrition planning, priority booking, performance testing). All tiers include our mobile app, towel service, and locker access.",
  },
  {
    q: 'Can I use multiple GAME ON FITNESS branches with one membership?',
    a: "Yes — our Elite and Game On Fitness Pro memberships include multi-branch access across all 12 locations nationwide. The Essential membership provides access to your designated home branch. You can upgrade your membership at any time with no penalty, and we'll prorate the difference.",
  },
  {
    q: 'Do you offer personal training?',
    a: "Absolutely. We have over 200 certified personal trainers across our network, each specializing in different disciplines — from strength and conditioning to athletic performance, body recomposition, and rehabilitation. Personal training packages are available as standalone or bundled add-ons to any membership tier.",
  },
  {
    q: 'What are your operating hours?',
    a: "Most GAME ON FITNESS locations operate 24/7. A small number of branches (Seattle and Austin) operate 5am–11pm Sunday through Thursday, and 5am–12am Friday–Saturday. Holiday hours may vary. All hours are listed on each branch's page and in our app.",
  },
  {
    q: 'Is there a free trial available?',
    a: "Yes. We offer a 7-day free trial for new members at any GAME ON FITNESS location. No credit card required. During your trial you'll have full access to your chosen branch, group fitness classes, and a complimentary 30-minute session with a coach to experience the GAME ON FITNESS difference firsthand.",
  },
  {
    q: 'What nutrition support do you provide?',
    a: "We have in-house certified nutritionists at every location. Depending on your membership tier, you'll have access to nutritional consultations, meal planning, macro tracking through our app, and our on-site nutrition bars stocked with premium supplements and fresh meals. Game On Fitness Pro members receive a comprehensive nutrition plan as part of their package.",
  },
];

interface FAQItemProps {
  faq: typeof faqs[0];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  isVisible: boolean;
}

function FAQItem({ faq, index, isOpen, onToggle, isVisible }: FAQItemProps) {
  return (
    <div
      className={`reveal ${isVisible ? 'visible' : ''}`}
      style={{ transitionDelay: `${index * 0.07}s` }}
    >
      <div
        className={`rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer group ${isOpen
            ? 'glass-strong border border-[#ff6b35]/20'
            : 'glass border border-white/5 hover:border-white/10'
          }`}
        onClick={onToggle}
        style={{
          boxShadow: isOpen ? '0 0 30px rgba(0, 212, 255, 0.05)' : 'none',
        }}
      >
        {/* Question row */}
        <div className="flex items-center gap-4 p-6">
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen
                ? 'bg-[#ff6b35]/20 border border-[#ff6b35]/40'
                : 'bg-white/5 border border-white/10 group-hover:border-white/20'
              }`}
          >
            {isOpen ? (
              <Minus size={14} className="text-[#ff6b35]" />
            ) : (
              <Plus size={14} className="text-white/50 group-hover:text-white/80 transition-colors" />
            )}
          </div>

          <h3
            className={`text-sm md:text-base font-semibold leading-relaxed transition-colors duration-300 ${isOpen ? 'text-white' : 'text-white/70 group-hover:text-white/90'
              }`}
          >
            {faq.q}
          </h3>

          {/* Index number */}
          <span className="ml-auto flex-shrink-0 text-xs font-mono text-white/20">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>

        {/* Answer */}
        <div className={`accordion-content ${isOpen ? 'open' : ''}`}>
          <div className="px-6 pb-6 ml-12">
            <div className="w-8 h-px bg-[#ff6b35]/30 mb-4" />
            <p className="text-white/55 leading-relaxed text-sm">{faq.a}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: listRef, isVisible: listVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.05 });

  return (
    <section id="faq" className="relative py-32 bg-[#050505] overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.5) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div ref={headRef} className="text-center mb-16">
          <div className={`reveal ${headVisible ? 'visible' : ''}`}>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#ff6b35] mb-4 block">Got Questions?</span>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight leading-none mb-6">
              <span className="text-white">EVERY</span>
              <br />
              <span className="gradient-text-blue">ANSWER.</span>
            </h2>
            <div className="divider-glow max-w-xs mx-auto mb-6" />
            <p className="text-white/50 max-w-md mx-auto leading-relaxed">
              Everything you need to know about GAME ON FITNESS membership, facilities, and programs.
            </p>
          </div>
        </div>

        {/* FAQ List */}
        <div ref={listRef} className="space-y-3">
          {faqs.map((faq, i) => (
            <FAQItem
              key={i}
              faq={faq}
              index={i}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
              isVisible={listVisible}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <div className={`reveal ${listVisible ? 'visible' : ''} text-center mt-16`}>
          <div className="glass-card rounded-2xl p-8">
            <h3 className="text-2xl font-bold text-white mb-3">Still have questions?</h3>
            <p className="text-white/50 text-sm mb-6">Our team is available 24/7 to help you.</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-glow-blue text-black font-bold px-8 py-3 rounded-full text-sm tracking-wider uppercase"
              >
                Contact Us
              </button>
              <button className="btn-outline-glow font-semibold px-8 py-3 rounded-full text-sm tracking-wider uppercase">
                Book a Tour
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
