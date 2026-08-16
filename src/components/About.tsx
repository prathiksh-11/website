import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import PageHero from './PageHero';
import { IMAGES } from './image_constant';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const storyHighlights = [
  { value: '10+', label: 'Years of Experience' },
  { value: '10+', label: 'Clubs Across Bengaluru' },
  { value: '15K+', label: 'Active Members' },
];

const beliefs = [
  {
    title: 'People First.',
    text: 'Before equipment. Before memberships. Before numbers. People always come first.',
  },
  {
    title: 'Everyone Belongs.',
    text: "Whether you're walking into a gym for the first time or preparing for your next competition, you'll always find a place here.",
  },
  {
    title: 'Progress Over Perfection.',
    text: 'We celebrate every step forward. Every extra repetition. Every personal victory.',
  },
  {
    title: 'Community Over Competition.',
    text: "We don't compare people. We encourage them. Your only competition is who you were yesterday.",
  },
];

function OurStorySection() {
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: bodyRef, isVisible: bodyVisible } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.15,
  });

  return (
    <section className="py-24 md:py-32 atmosphere">
      <div className="max-w-6xl mx-auto px-6">
        <div
          ref={headRef}
          className={`text-center max-w-3xl mx-auto mb-14 reveal ${headVisible ? 'visible' : ''}`}
        >
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Our Story
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-5">
            From our first tenant to{' '}
            <span className="italic text-[#ff5000]">Bengaluru&apos;s fitness home.</span>
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed">
            Every great brand starts somewhere. Ours started with one club, one dream, and a
            commitment to make fitness feel welcoming for everyone.
          </p>
        </div>

        <div
          ref={bodyRef}
          className={`grid lg:grid-cols-2 gap-10 lg:gap-14 items-center reveal ${
            bodyVisible ? 'visible' : ''
          }`}
        >
          <div className="relative">
            <div className="rounded-[2rem] overflow-hidden border border-[rgba(22,24,31,0.06)] shadow-[0_24px_60px_rgba(22,24,31,0.1)]">
              <img
                src={IMAGES.Arekere.img1}
                alt="Game On Fitness — our first club at Arekere"
                className="w-full h-[300px] md:h-[400px] object-cover"
                loading="lazy"
              />
            </div>
            <div className="absolute -bottom-5 -right-3 md:right-6 px-6 py-4 rounded-2xl bg-white border border-[rgba(22,24,31,0.06)] shadow-[0_16px_40px_rgba(22,24,31,0.1)]">
              <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#ff5000] mb-1">
                Our First Tenant
              </p>
              <p className="font-display text-lg font-bold text-[#16181f]">Arekere, Bengaluru</p>
            </div>
          </div>

          <div>
            <p className="text-[#6f7685] text-base md:text-lg leading-relaxed mb-5">
              Game On Fitness began as the{' '}
              <strong className="text-[#16181f] font-semibold">first tenant</strong> in our very
              first location — a single club in Arekere with a simple belief: everyone deserves a
              gym that feels premium, supportive, and built for real results.
            </p>
            <p className="text-[#6f7685] text-base md:text-lg leading-relaxed mb-5">
              What started in one space has grown into{' '}
              <strong className="text-[#16181f] font-semibold">10+ clubs across Bengaluru</strong>,
              but the heart of who we are hasn&apos;t changed. We still greet every member by name.
              We still push people to show up. We still celebrate every small win along the way.
            </p>
            <p className="text-[#6f7685] text-base md:text-lg leading-relaxed mb-8">
              With{' '}
              <strong className="text-[#16181f] font-semibold">over a decade of experience</strong>,
              we&apos;ve helped thousands build strength, lose weight, gain confidence, and create
              habits that last — through expert coaching, premium equipment, and a community that
              never lets you quit on yourself.
            </p>

            <div className="grid grid-cols-3 gap-3 md:gap-4">
              {storyHighlights.map((item) => (
                <div
                  key={item.label}
                  className="text-center rounded-2xl bg-white border border-[rgba(22,24,31,0.06)] px-3 py-5 shadow-sm"
                >
                  <p className="font-display text-2xl md:text-3xl font-bold text-[#16181f]">
                    {item.value}
                  </p>
                  <p className="mt-1 text-[10px] md:text-xs font-semibold uppercase tracking-[0.1em] text-[#6f7685] leading-snug">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function About() {
  return (
    <div className="min-h-screen gym-surface">
      <Navbar />

      <PageHero
        eyebrow="About Game On"
        title={
          <>
            We didn&apos;t start to build gyms.
            <br />
            <span className="italic text-[#ff5000]">We started to build stronger people.</span>
          </>
        }
        description="Every great transformation begins with a single decision. Our mission is to create places where people become healthier, stronger, more confident, and more disciplined—one workout at a time."
        image="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&fit=crop"
        imagePosition="center center"
      />

      <OurStorySection />

      <section className="py-24 atmosphere">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Our Belief
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            Fitness isn&apos;t about looking better.
            <br />
            It&apos;s about <span className="italic text-[#ff5000]">living better.</span>
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto">
            It&apos;s about having the confidence to try. The discipline to continue. The courage
            to never give up. At Game On Fitness, every person deserves an environment that
            inspires progress, regardless of where they begin.
          </p>
        </div>
      </section>

      <section className="py-20 gym-surface">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Our Purpose
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#16181f] leading-tight mb-6">
            We exist to help people become the strongest version of themselves.
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed">
            Not through shortcuts. Not through promises. Through consistency. Expert coaching.
            Premium facilities. And a community that never lets you stop believing in yourself.
          </p>
        </div>
      </section>

      <section className="py-24 atmosphere">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="section-ornament justify-center mb-5">
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
                What Makes Us Different
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f]">
              More than a <span className="italic text-[#ff5000]">gym.</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-5">
            {beliefs.map((item) => (
              <div
                key={item.title}
                className="rounded-[1.75rem] border border-[rgba(22,24,31,0.06)] bg-white p-8 hover:border-[#ff5000]/25 hover:shadow-[0_20px_50px_rgba(22,24,31,0.08)] transition-all duration-400"
              >
                <h3 className="font-display text-2xl font-bold text-[#16181f] mb-3">
                  {item.title}
                </h3>
                <p className="text-[#6f7685] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 gym-surface">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              The Game On Experience
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            More than <span className="italic text-[#ff5000]">machines.</span>
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            Walk into any Game On Fitness branch and you&apos;ll discover more than machines.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {['Energy', 'Encouragement', 'Friendship', 'Discipline', 'Growth'].map((word) => (
              <span
                key={word}
                className="px-5 py-2.5 rounded-full bg-[#f7f8fb] border border-[rgba(22,24,31,0.06)] font-display font-semibold text-[#16181f]"
              >
                {word}
              </span>
            ))}
          </div>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto">
            You&apos;ll meet coaches who care. Members who motivate. And an environment designed
            to help you become your best.
          </p>
        </div>
      </section>

      <section className="py-24 atmosphere">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Our Promise
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            Welcomed. Supported. <span className="italic text-[#ff5000]">Inspired.</span>
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto mb-6">
            We promise to create spaces where people feel welcomed. Supported. Inspired. And
            challenged to become stronger every single day.
          </p>
          <p className="text-[#3a3f4b] text-lg leading-relaxed max-w-2xl mx-auto font-medium">
            No matter where your journey begins, we&apos;ll be there for every step that follows.
          </p>
        </div>
      </section>

      <section className="py-24 gym-surface">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              This Is Only The Beginning
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            The best chapters haven&apos;t been{' '}
            <span className="italic text-[#ff5000]">written yet.</span>
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Every new member. Every new branch. Every new transformation. Adds another chapter
            to our story.
          </p>
        </div>
      </section>

      <section className="py-24 atmosphere">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] mb-5">
            Join the <span className="italic text-[#ff5000]">movement.</span>
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed mb-10">
            This isn&apos;t about joining another gym. It&apos;s about joining a community that
            believes in progress.
          </p>
          <Link
            to="/contact"
            className="btn-premium-primary inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold"
          >
            Find Your Game On
            <ArrowRight size={16} />
          </Link>
          <p className="mt-12 text-[#9aa0ab] text-xs font-medium tracking-[0.2em] uppercase">
            Stronger than yesterday. Stronger for tomorrow.
          </p>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
