import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Gift,
  Tag,
} from 'lucide-react';

interface Banner {
  id: number | string;
  title: string;
  image_url: string;
  redirect_url?: string;
  banner_type: string;
  is_active: boolean;
  display_order?: number;
}

// Helper to safely compose API URLs without double or missing slashes
const getApiUrl = (endpoint: string) => {
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api/').replace(/\/+$/, '');
  const cleanEndpoint = endpoint.replace(/^\/+/, '').replace(/^api\//, '');
  return `${base}/${cleanEndpoint}`;
};

export default function PromotionalOffers() {
  const [promoCards, setPromoCards] = useState<Banner[]>([]);
  const [carouselBanners, setCarouselBanners] = useState<Banner[]>([]);
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const getFullImageUrl = useCallback((relativePath: string) => {
    if (!relativePath) return '';

    const withoutApiUploads = (url: string) =>
      url.replace(/\/api\/uploads\//i, '/uploads/');

    if (relativePath.startsWith('http://') || relativePath.startsWith('https://')) {
      return withoutApiUploads(relativePath);
    }

    const imageBase = import.meta.env.VITE_IMAGE_BASE_URL;
    const apiBase =
      import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';
    const origin = (imageBase || apiBase)
      .replace(/\/+$/, '')
      .replace(/\/api$/i, '');
    const cleanPath = relativePath
      .replace(/^\/+/, '')
      .replace(/^api\/uploads\//i, 'uploads/');

    return `${origin}/${cleanPath}`;
  }, []);

  const fetchOffers = useCallback(async () => {
    try {
      const apiUrl = getApiUrl('get-banners');
      const response = await axios.get(apiUrl);

      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        const allBanners = response.data.data.filter((item: Banner) => item.is_active);

        const promos = allBanners
          .filter((item: Banner) => item.banner_type === 'promo_card')
          .sort(
            (a: Banner, b: Banner) => (a.display_order || 0) - (b.display_order || 0)
          );

        const carousels = allBanners
          .filter((item: Banner) => item.banner_type === 'carousel')
          .sort(
            (a: Banner, b: Banner) => (a.display_order || 0) - (b.display_order || 0)
          );

        setPromoCards(promos);
        setCarouselBanners(carousels);
      }
    } catch (error) {
      console.error('Failed to fetch promotional offers:', error);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  useEffect(() => {
    if (promoCards.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentPromoSlide((prev) => (prev + 1) % promoCards.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [promoCards.length, isHovered]);

  useEffect(() => {
    if (carouselBanners.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentCarouselSlide((prev) => (prev + 1) % carouselBanners.length);
    }, 5500);

    return () => clearInterval(interval);
  }, [carouselBanners.length, isHovered]);

  const goToNextPromo = () => {
    setCurrentPromoSlide((prev) => (prev + 1) % promoCards.length);
  };

  const goToPrevPromo = () => {
    setCurrentPromoSlide((prev) => (prev - 1 + promoCards.length) % promoCards.length);
  };

  const goToNextCarousel = () => {
    setCurrentCarouselSlide((prev) => (prev + 1) % carouselBanners.length);
  };

  const goToPrevCarousel = () => {
    setCurrentCarouselSlide(
      (prev) => (prev - 1 + carouselBanners.length) % carouselBanners.length
    );
  };

  if (promoCards.length === 0 && carouselBanners.length === 0) return null;

  const totalOffersCount = promoCards.length + carouselBanners.length;

  return (
    <section
      className="relative py-16 md:py-24 bg-[#f7f8fb] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Background Decorative Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-[#ff5000]/10 via-transparent to-transparent pointer-events-none blur-3xl" />

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#fff0e8] border border-[#ff5000]/20 mb-3">
              <Sparkles size={14} className="text-[#ff5000]" />
              <span className="text-xs font-bold text-[#ff5000] uppercase tracking-wider">
                Limited Time Deals
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-extrabold text-[#16181f] tracking-tight">
              Exclusive <span className="text-[#ff5000] italic">Offers & Deals</span>
            </h2>
          </div>

          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-white border border-[rgba(22,24,31,0.08)] shadow-sm">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff5000] animate-pulse" />
            <span className="text-xs font-bold text-[#16181f] uppercase tracking-wider">
              {totalOffersCount} Active {totalOffersCount === 1 ? 'Offer' : 'Offers'}
            </span>
          </div>
        </div>

        {/* Promo Cards Section (2:1 Ratio) */}
        {promoCards.length > 0 && (
          <div className="relative mb-14">
            <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(22,24,31,0.06)] border border-[rgba(22,24,31,0.08)] bg-white">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentPromoSlide * 100}%)` }}
              >
                {promoCards.map((offer) => (
                  <div key={offer.id} className="flex-shrink-0 w-full">
                    <div
                      onClick={() =>
                        offer.redirect_url && (window.location.href = offer.redirect_url)
                      }
                      className="group relative cursor-pointer"
                    >
                      <div className="relative w-full aspect-[2/1] overflow-hidden bg-[#16181f]">
                        <img
                          src={getFullImageUrl(offer.image_url)}
                          alt={offer.title}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#16181f]/80 via-[#16181f]/20 to-transparent pointer-events-none" />

                        {/* Top Badge */}
                        <div className="absolute top-6 right-6 pointer-events-none">
                          <div className="px-4 py-2 rounded-full bg-white/90 backdrop-blur-md border border-white/20 shadow-md">
                            <div className="flex items-center gap-2">
                              <Gift size={14} className="text-[#ff5000]" />
                              <span className="text-xs font-bold text-[#16181f] uppercase tracking-wider">
                                Special Offer
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Card Content Overlay */}
                        <div className="absolute inset-0 p-8 md:p-14 flex flex-col justify-end pointer-events-none">
                          <div className="max-w-2xl pointer-events-auto">
                            {offer.title && (
                              <h3 className="font-display text-2xl md:text-4xl font-extrabold text-white mb-4 leading-tight drop-shadow-md">
                                {offer.title}
                              </h3>
                            )}

                            <button className="group/btn inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full bg-[#ff5000] text-white font-bold text-sm shadow-lg hover:bg-white hover:text-[#16181f] transition-all duration-300">
                              <span>Claim Offer Now</span>
                              <ArrowRight
                                size={16}
                                className="group-hover/btn:translate-x-1 transition-transform"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {promoCards.length > 1 && (
              <>
                <button
                  onClick={goToPrevPromo}
                  className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(22,24,31,0.1)] text-[#16181f] flex items-center justify-center hover:bg-[#ff5000] hover:text-white transition-all duration-300 shadow-xl z-10"
                  aria-label="Previous Offer"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={goToNextPromo}
                  className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(22,24,31,0.1)] text-[#16181f] flex items-center justify-center hover:bg-[#ff5000] hover:text-white transition-all duration-300 shadow-xl z-10"
                  aria-label="Next Offer"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Pagination Dots */}
            {promoCards.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {promoCards.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentPromoSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === currentPromoSlide
                        ? 'bg-[#ff5000] w-10'
                        : 'bg-[#d4d7de] w-2.5 hover:bg-[#9aa0ab]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Carousel Banners Section (16:9 Ratio) */}
        {carouselBanners.length > 0 && (
          <div className="relative">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-2 h-7 bg-[#ff5000] rounded-full" />
              <h3 className="font-display text-xl md:text-3xl font-extrabold text-[#16181f] tracking-tight">
                Featured Highlights
              </h3>
            </div>

            <div className="overflow-hidden rounded-[2rem] shadow-[0_20px_50px_rgba(22,24,31,0.06)] border border-[rgba(22,24,31,0.08)] bg-white">
              <div
                className="flex transition-transform duration-700 ease-out"
                style={{ transform: `translateX(-${currentCarouselSlide * 100}%)` }}
              >
                {carouselBanners.map((banner) => (
                  <div key={banner.id} className="flex-shrink-0 w-full">
                    <div
                      onClick={() =>
                        banner.redirect_url && (window.location.href = banner.redirect_url)
                      }
                      className="group relative cursor-pointer"
                    >
                      <div className="relative w-full aspect-[16/9] overflow-hidden bg-[#16181f]">
                        <img
                          src={getFullImageUrl(banner.image_url)}
                          alt={banner.title}
                          crossOrigin="anonymous"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                        />

                        {banner.title && (
                          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10 bg-gradient-to-t from-[#16181f]/80 via-[#16181f]/30 to-transparent">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md mb-2">
                              <Tag size={12} className="text-[#ff5000]" />
                              <span className="text-[10px] font-bold text-white uppercase tracking-wider">
                                Featured
                              </span>
                            </div>
                            <h4 className="font-display text-xl md:text-3xl font-bold text-white leading-snug drop-shadow-md">
                              {banner.title}
                            </h4>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation Arrows */}
            {carouselBanners.length > 1 && (
              <>
                <button
                  onClick={goToPrevCarousel}
                  className="absolute top-1/2 left-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(22,24,31,0.1)] text-[#16181f] flex items-center justify-center hover:bg-[#ff5000] hover:text-white transition-all duration-300 shadow-xl z-10"
                  aria-label="Previous Highlight"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={goToNextCarousel}
                  className="absolute top-1/2 right-4 -translate-y-1/2 w-12 h-12 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(22,24,31,0.1)] text-[#16181f] flex items-center justify-center hover:bg-[#ff5000] hover:text-white transition-all duration-300 shadow-xl z-10"
                  aria-label="Next Highlight"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            {/* Pagination Dots */}
            {carouselBanners.length > 1 && (
              <div className="flex items-center justify-center gap-2 mt-6">
                {carouselBanners.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentCarouselSlide(index)}
                    aria-label={`Go to slide ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === currentCarouselSlide
                        ? 'bg-[#ff5000] w-10'
                        : 'bg-[#d4d7de] w-2.5 hover:bg-[#9aa0ab]'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
