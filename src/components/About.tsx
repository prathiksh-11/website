import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import PageHero from './PageHero';

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
