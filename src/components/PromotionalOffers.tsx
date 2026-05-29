import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  Calendar,
  ArrowRight,
  Sparkles,
  ChevronLeft, // Added for carousel navigation
  ChevronRight, // Added for carousel navigation
} from 'lucide-react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver'; // For section visibility animation

interface Banner {
  id: number;
  title: string;
  image_url: string;
  redirect_url: string;
  banner_type: string;
  is_active: boolean;
}

export default function PromotionalOffers() { // Renamed from OffersPage
  const [offers, setOffers] = useState<Banner[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0); // State for current slide index
  const { ref, isVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 }); // For section visibility animation

  const getFullImageUrl = useCallback((relativePath: string) => {
    if (!relativePath) return '';

    if (relativePath.startsWith('http')) {
      return relativePath;
    }

    let baseUrl =
      import.meta.env.VITE_IMAGE_BASE_URL ||
      import.meta.env.VITE_API_BASE_URL ||
      'http://localhost:5000';

    baseUrl = baseUrl.replace(/\/+$/, '');

    return `${baseUrl}/${relativePath.replace(/^\/+/, '')}`;
  }, []);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_API_BASE_URL
      }/api/get-banners`;

      const response = await axios.get(apiUrl);

      if (response.data.success) {
        const activeOffers = response.data.data.filter(
          (item: Banner) =>
            item.is_active &&
            item.banner_type === 'promo_card'
        );

        setOffers(activeOffers);
      }
    } catch (error) {
      console.error(error);
    }
  }, []); // Empty dependency array for useCallback

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // Auto-play for the carousel
  useEffect(() => {
    if (offers.length <= 1) return; // No need to auto-play if 0 or 1 offer

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % offers.length);
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [offers.length]); // Re-run effect if number of offers changes

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % offers.length);
  };

  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + offers.length) % offers.length);
  };

  return (
    <section className="relative py-12 bg-[#050505] overflow-hidden border-b border-white/5">
      {/* Background Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-[#ffb800]/5 blur-[100px] rounded-full" />
      </div>

      <div className="max-w-[100vw]" ref={ref}>
        {/* Section Header */}
        <div className={`px-6 mb-8 flex items-center justify-between transition-all duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
          <div className="flex items-center gap-4">
            <div className="w-2 h-8 bg-[#ffb800] rounded-full" />
            <h2 className="text-2xl md:text-4xl font-black text-white tracking-tighter uppercase italic">
              Hot <span className="gradient-text-gold">Deals.</span>
            </h2>
          </div>
          <div className="flex items-center gap-2 text-white/30 text-[10px] font-bold uppercase tracking-[0.3em]">
            <span>Exclusive Offers</span>
            <Sparkles size={12} className="text-[#ffb800] animate-pulse" />
          </div>
        </div>

        {/* Carousel Container */}
        <div className="relative w-full overflow-hidden">
          <div
            className="flex transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {/* Map over offers to create individual slides */}
            {offers.map((offer, index) => (
              <div
                key={offer.id}
                className="flex-shrink-0 w-full px-6" // Each slide takes full width
              >
                <div
                  onClick={() => offer.redirect_url && (window.location.href = offer.redirect_url)}
                  className={`group relative cursor-pointer mx-auto max-w-4xl`} // Center the card
                >
                  {/* The Card */}
                  <div className="relative aspect-[21/9] md:aspect-[16/8] overflow-hidden rounded-2xl bg-[#111] border border-white/5 transition-all duration-500 group-hover:border-[#ffb800]/40 group-hover:shadow-[0_0_50px_rgba(255,184,0,0.15)]">
                    {/* Image Binding */}
                    <img
                      src={getFullImageUrl(offer.image_url)}
                      alt={offer.title}
                      crossOrigin="anonymous"
                      className="w-full h-full object-cover opacity-60 transition-transform duration-1000 group-hover:scale-110"
                    />
                    
                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/20 to-transparent" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />

                    {/* Content */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles size={12} className="text-[#ffb800] fill-[#ffb800]" />
                        <span className="text-[10px] font-black tracking-[0.3em] text-[#ffb800] uppercase">Exclusive Offer</span>
                      </div>
                      
                      <h3 className="text-xl md:text-2xl font-black text-white mb-4 group-hover:text-[#ffb800] transition-colors leading-tight italic uppercase">
                        {offer.title}
                      </h3>

                      <div className="flex items-center justify-between">
                        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ffb800] text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all duration-300">
                          Claim
                          <ArrowRight size={12} />
                        </button>
                        
                        <div className="flex -space-x-2">
                           {/* Placeholder for some visual element, e.g., member count or limited stock */}
                           {[1,2,3].map(i => (
                             <div key={i} className="w-6 h-6 rounded-full border-2 border-black bg-zinc-800 flex items-center justify-center text-[8px] text-white/50 font-bold">
                               {i}
                             </div>
                           ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {offers.length > 1 && (
            <>
              <button
                onClick={goToPrevSlide}
                className="absolute top-1/2 left-2 md:left-6 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 z-10"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={goToNextSlide}
                className="absolute top-1/2 right-2 md:right-6 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md text-white hover:bg-white/20 transition-all duration-300 z-10"
              >
                <ChevronRight size={20} />
              </button>
            </>
          )}

          {/* Navigation Dots */}
          {offers.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 mt-4">
              {offers.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === currentSlide ? 'bg-[#ffb800] w-8' : 'bg-white/30 w-2 hover:bg-white/50'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Sexy horizontal divider */}
      <div className="absolute bottom-0 left-0 w-full">
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </section>
  );
}
          {offers.map((offer) => (
            <div
              key={offer.id}
              className="group overflow-hidden rounded-3xl bg-white/[0.03] border border-white/10 hover:border-[#ffb800]/40 transition-all duration-500 hover:-translate-y-2"
            >
              <div className="relative overflow-hidden">
                <img
                  src={getFullImageUrl(
                    offer.image_url
                  )}
                  alt={offer.title}
                  className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                <div className="absolute top-4 left-4">
                  <span className="bg-[#ffb800] text-black text-xs font-black px-4 py-2 rounded-full">
                    LIMITED OFFER
                  </span>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-black text-white mb-3">
                  {offer.title}
                </h3>

                <div className="flex items-center gap-2 text-white/40 text-sm mb-6">
                  <Calendar size={14} />
                  Active Promotion
                </div>

                <button
                  onClick={() => {
                    if (offer.redirect_url) {
                      window.open(
                        offer.redirect_url,
                        '_blank'
                      );
                    }
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff8c00] text-white font-black flex items-center justify-center gap-2 hover:scale-[1.02] transition"
                >
                  Claim Offer
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}