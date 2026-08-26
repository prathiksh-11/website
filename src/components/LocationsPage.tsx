import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ChevronDown,
  MapPin,
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import PageHero from './PageHero';
import GrandOpeningCeremony from './GrandOpeningCeremony';
import { IMAGES } from './image_constant';

const destinations = [
  {
    id: 'btm-layout-1',
    name: 'Game On Fitness Premium Club - BTM 1st Stage',
    address:
      'Gangotri Bar And Restaurant, Ground, 8th Cross Rd, Old Madiwala, Maruti Nagar, 1st Stage, BTM 1st Stage, Bengaluru, Karnataka 560068',
    image: IMAGES.Branches.btm1,
  },
  {
    id: 'btm-layout-2',
    name: 'Game On Fitness Premium Club - BTM 2nd Stage',
    address:
      '689-670, 2nd Floor, 7th Main, 7th Cross Rd, BTM Layout 2nd Stage, Bengaluru, Karnataka 560076',
    image: IMAGES.Branches.btm2,
  },
  {
    id: 'vijayanagar',
    name: 'Game On Fitness Premium Club - Vijayanagar',
    address:
      '119, 1st Floor, 6th Main, 8th Cross Rd, next to BGS Stadium, MC Layout, Vijayanagar, Bengaluru, Karnataka 560040',
    image: IMAGES.Branches.jpNagar,
  },
  {
    id: 'sarjapur-road',
    name: 'Game On Fitness Premium Club - Sarjapur Road (Bellandur gate)',
    address:
      'No. 648 E, 3rd Floor, next to More Mega Store, Marathahalli-Sarjapur Main Rd, Bellandur Gate, Bengaluru, Karnataka 560035',
    image: IMAGES.Branches.sarjapurRoad,
  },
  {
    id: 'wilson-garden',
    name: 'Game On Fitness - Wilson Garden',
    address:
      'No. 376, 21, 6th Cross Rd, opposite Traffic Police Station, Vinayaka Nagar, NGO Colony, Wilson Garden, Bengaluru, Karnataka 560027',
    image: IMAGES.Branches.wilsonGarden,
  },
  {
    id: 'akshayanagar',
    name: 'Game On Fitness Luxury Club - Akshayanagar',
    address:
      '2nd Floor, above Reliance Smart, Bhagyalakshmi Avenue, DLF Newtown, Akshayanagar, Bengaluru, Karnataka 560114',
    image: IMAGES.Branches.akshayanagar,
  },
  {
    id: 'arekere',
    name: 'Game On Fitness - Arekere',
    address:
      'No. 97, 1st & 2nd Floor, Saibaba Temple Road, 2nd Main, Royal Residency Layout, BTM 4th Stage, 80 Feet Rd, near Arekere, Bengaluru, Karnataka 560076',
    image: IMAGES.Branches.arekere,
  },
  {
    id: 'vijaya-bank-layout',
    name: 'Game On Fitness Premium Club - Vijaya Bank Layout',
    address:
      '3rd Floor, 8883 886, Bannerghatta Rd, Vijaya Bank Layout, Bilekahalli, Bengaluru, Karnataka 560076',
    image: IMAGES.Branches.vijayaBankLayout,
  },
  {
    id: 'kasavanahalli',
    name: 'Game On Fitness Luxury Club - Kasavanahalli',
    address:
      '3rd Floor, Hosa Rd, next to Vishal Mega Mart, Kasavanahalli, Bengaluru, Karnataka 560035',
    image: IMAGES.Branches.kasavanahalli,
  },
];

function openBranch(id: string) {
  window.location.href = `/#branch/${id}`;
}

export default function LocationsPage() {
  return (
    <div className="min-h-screen gym-surface">
      <Navbar />

      <PageHero
        eyebrow="Find Your Game On"
        title={
          <>
            Choose your
            <br />
            <span className="italic text-[#ff5000]">destination.</span>
          </>
        }
        description="Not every journey begins in the same place. But every great journey begins with the right one."
        image="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1600&h=1000&q=80"
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

      {/* Intro Header */}
      <section className="py-20 md:py-24 atmosphere">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Your City
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            10+ Premium Clubs. <span className="italic text-[#ff5000]">One More Coming.</span>
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto mb-4">
            Every Game On Fitness branch is custom-designed with imported biomechanical equipment, certified elite coaches, and a high-energy community. A brand-new luxury club is opening soon in Bellandur.
          </p>
        </div>
      </section>

      {/* GRAND OPENING CEREMONY • CINEMATIC THEATRE CURTAIN REVEAL */}
      <GrandOpeningCeremony />

      {/* ACTIVE DESTINATIONS */}
      <section id="destinations" className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-6 mb-10 text-center md:text-left">
          <div className="section-ornament mb-3">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Active Locations
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#16181f]">
            Explore All <span className="italic text-[#ff5000]">Active Clubs.</span>
          </h2>
        </div>

        <div className="max-w-6xl mx-auto px-6 space-y-8 md:space-y-10">
          {destinations.map((branch, index) => {
            const reverse = index % 2 === 1;
            return (
              <article
                key={branch.id}
                className="grid md:grid-cols-2 gap-0 overflow-hidden rounded-[2rem] border border-[rgba(22,24,31,0.06)] bg-white shadow-[0_18px_50px_rgba(22,24,31,0.06)] hover:border-[#ff5000]/30 hover:shadow-[0_24px_60px_rgba(255,80,0,0.12)] transition-all duration-400 group"
              >
                <div
                  className={`relative min-h-[260px] md:min-h-[360px] ${
                    reverse ? 'md:order-2' : ''
                  }`}
                >
                  <img
                    src={branch.image}
                    alt={branch.name}
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#16181f]/50 via-transparent to-transparent" />
                </div>

                <div
                  className={`flex flex-col justify-center p-8 md:p-12 ${
                    reverse ? 'md:order-1' : ''
                  }`}
                >
                  <h3 className="font-display text-2xl md:text-3xl font-bold text-[#16181f] leading-tight mb-5">
                    {branch.name}
                  </h3>
                  <div className="flex items-start gap-3 mb-8 text-[#6f7685]">
                    <MapPin size={20} className="mt-1 shrink-0 text-[#ff5000]" />
                    <p className="text-base md:text-lg leading-relaxed">{branch.address}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => openBranch(branch.id)}
                    className="btn-premium-primary inline-flex items-center justify-center gap-2 self-start text-sm font-semibold px-7 py-3.5 rounded-full shadow-[0_12px_28px_rgba(255,80,0,0.3)] hover:-translate-y-0.5 transition-all duration-300 cursor-pointer"
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
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              More Than A Location
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            The same Game On <span className="italic text-[#ff5000]">experience.</span>
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


      <section className="py-24 gym-surface">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Find Your Fit
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            Which Game On feels like <span className="italic text-[#ff5000]">yours?</span>
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto mb-4">
            There&apos;s no perfect branch. Only the perfect branch for you.
          </p>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto">
            Explore each location. Meet the people. Discover the atmosphere. Find the place where
            your next chapter begins.
          </p>
        </div>
      </section>

      <section className="py-24 atmosphere">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
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
          <p className="font-display text-2xl md:text-4xl italic text-[#ffb089] leading-tight">
            You&apos;re choosing where your transformation begins.
          </p>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
