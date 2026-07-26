import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight, ChevronDown } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import PageHero from './PageHero';
import { IMAGES } from './image_constant';

const destinations = [
  {
    id: 'btm-layout-1',
    name: 'BTM Layout',
    tagline: 'Built for Strength.',
    lines: [
      'Heavy lifting.',
      'Functional training.',
      'Performance-focused environment.',
      'For people who love pushing limits.',
    ],
    image: IMAGES.Branches.btm1,
  },
  {
    id: 'btm-layout-2',
    name: 'BTM 2nd Stage',
    tagline: 'Built for Performance.',
    lines: [
      'Premium equipment.',
      'Progressive training.',
      'Expert coaching.',
      'Designed for serious fitness goals.',
    ],
    image: IMAGES.Branches.btm2,
  },
  {
    id: 'vijayanagar',
    name: 'Vijayanagar',
    tagline: 'Built for Community.',
    lines: [
      'Friendly.',
      'Energetic.',
      'Welcoming.',
      'A place where every member belongs.',
    ],
    image: IMAGES.Branches.jpNagar,
  },
  {
    id: 'sarjapur-road',
    name: 'Sarjapur Road',
    tagline: 'Built for Athletes.',
    lines: [
      'Strength.',
      'Speed.',
      'Endurance.',
      'Performance training for people who demand more.',
    ],
    image: IMAGES.Branches.sarjapurRoad,
  },
  {
    id: 'wilson-garden',
    name: 'Wilson Garden',
    tagline: 'Built for Everyone.',
    lines: [
      "Whether you're stepping into a gym for the first time or chasing your next milestone, this is where confidence grows.",
    ],
    image: IMAGES.Branches.wilsonGarden,
  },
  {
    id: 'akshayanagar',
    name: 'Akshayanagar',
    tagline: 'Built for Progress.',
    lines: [
      'Strength training.',
      'Functional fitness.',
      'Cardio.',
      'Personal coaching.',
      'Everything you need to keep moving forward.',
    ],
    image: IMAGES.Branches.akshayanagar,
  },
];

const moreBranches = [
  {
    id: 'arekere',
    name: 'Arekere',
    description: 'Train with intention in a focused neighbourhood club.',
    image: IMAGES.Branches.arekere,
  },
  {
    id: 'vijaya-bank-layout',
    name: 'Vijaya Bank Layout',
    description: 'A polished space for members who want more from every session.',
    image: IMAGES.Branches.vijayaBankLayout,
  },
  {
    id: 'kasavanahalli',
    name: 'Kasavanahalli',
    description: 'Elevated facilities designed to keep you moving forward.',
    image: IMAGES.Branches.kasavanahalli,
  },
];

function openBranch(id: string) {
  window.location.href = `/#branch/${id}`;
}

export default function LocationsPage() {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <Navbar />

      <PageHero
        eyebrow="Find Your Game On"
        title={
          <>
            Choose your
            <br />
            <span className="italic text-[#e07a72]">destination.</span>
          </>
        }
        description="Not every journey begins in the same place. But every great journey begins with the right one."
        image="https://images.pexels.com/photos/1552252/pexels-photo-1552252.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&fit=crop"
        imagePosition="center center"
        actions={
          <a
            href="#destinations"
            className="btn-premium-primary inline-flex items-center justify-center gap-2 text-sm font-semibold px-8 py-4 rounded-full"
          >
            Scroll to explore
            <ChevronDown size={16} />
          </a>
        }
      />

      <section className="py-24 atmosphere">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
              Your City
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            Your journey.
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Every Game On Fitness branch has its own personality. Different atmosphere. Different
            energy. Different community.
          </p>
          <p className="text-[#3a3f4b] text-lg leading-relaxed max-w-xl mx-auto font-medium">
            One commitment. Helping you become stronger every day.
          </p>
        </div>
      </section>

      <section id="destinations" className="py-8 md:py-12">
        <div className="max-w-6xl mx-auto px-6 space-y-8 md:space-y-10">
          {destinations.map((branch, index) => {
            const reverse = index % 2 === 1;
            return (
              <article
                key={branch.id}
                className={`grid md:grid-cols-2 gap-0 overflow-hidden rounded-[2rem] border border-[rgba(22,24,31,0.06)] bg-white shadow-[0_18px_50px_rgba(22,24,31,0.06)]`}
              >
                <div
                  className={`relative min-h-[260px] md:min-h-[360px] ${
                    reverse ? 'md:order-2' : ''
                  }`}
                >
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16181f]/50 via-transparent to-transparent" />
                </div>

                <div
                  className={`flex flex-col justify-center p-8 md:p-12 ${
                    reverse ? 'md:order-1' : ''
                  }`}
                >
                  <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#e07a72] mb-3">
                    {branch.name}
                  </span>
                  <h3 className="font-display text-3xl md:text-4xl font-bold text-[#16181f] leading-tight mb-5">
                    {branch.tagline.replace(/\.$/, '')}
                    <span className="italic text-[#e07a72]">.</span>
                  </h3>
                  <div className="space-y-1.5 mb-8">
                    {branch.lines.map((line) => (
                      <p key={line} className="text-[#6f7685] text-base md:text-lg leading-relaxed">
                        {line}
                      </p>
                    ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => openBranch(branch.id)}
                    className="btn-premium-primary inline-flex items-center justify-center gap-2 self-start text-sm font-semibold px-7 py-3.5 rounded-full"
                  >
                    Experience This Branch
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="py-24 atmosphere">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
              More Than A Location
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            The same Game On <span className="italic text-[#e07a72]">experience.</span>
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto mb-4">
            Every branch offers something different. Different coaches. Different facilities.
            Different training environments.
          </p>
          <p className="text-[#3a3f4b] text-lg leading-relaxed max-w-xl mx-auto font-medium">
            The same commitment to your journey.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
              Find Your Fit
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            Which Game On feels like <span className="italic text-[#e07a72]">yours?</span>
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto mb-4">
            There&apos;s no perfect branch. Only the perfect branch for you.
          </p>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto mb-10">
            Explore each location. Meet the people. Discover the atmosphere. Find the place where
            your next chapter begins.
          </p>

          <button
            type="button"
            onClick={() => setShowAll((v) => !v)}
            className="btn-premium-secondary inline-flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-semibold"
          >
            {showAll ? 'Hide Extra Branches' : 'Explore All Branches'}
            <ArrowUpRight size={16} />
          </button>

          {showAll && (
            <div className="mt-12 grid sm:grid-cols-3 gap-5 text-left">
              {moreBranches.map((branch) => (
                <button
                  key={branch.id}
                  type="button"
                  onClick={() => openBranch(branch.id)}
                  className="group text-left rounded-[1.5rem] border border-[rgba(22,24,31,0.06)] bg-[#f7f8fb] overflow-hidden hover:border-[#e07a72]/30 hover:shadow-[0_16px_40px_rgba(22,24,31,0.08)] transition-all duration-300"
                >
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={branch.image}
                      alt={branch.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-display text-xl font-bold text-[#16181f] mb-2">
                      {branch.name}
                    </h3>
                    <p className="text-[#6f7685] text-sm leading-relaxed mb-3">
                      {branch.description}
                    </p>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-[#e07a72]">
                      Experience This Branch
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="py-24 atmosphere">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
              Still Not Sure?
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            Tell us your goals.
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed mb-10">
            We&apos;ll help you choose the branch that&apos;s right for you.
          </p>
          <Link
            to="/contact"
            className="btn-premium-primary inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold"
          >
            Help Me Choose
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      <section className="py-24 bg-[#16181f] text-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold leading-tight mb-5">
            You aren&apos;t choosing a gym.
          </h2>
          <p className="font-display text-2xl md:text-4xl italic text-[#f2b4ae] leading-tight">
            You&apos;re choosing where your transformation begins.
          </p>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
