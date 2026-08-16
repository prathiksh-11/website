import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
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
      id="offers"
      className="relative py-16 md:py-20 overflow-hidden atmosphere scroll-mt-28"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-70 blur-[90px]"
          style={{ background: 'radial-gradient(circle, rgba(255,80,0,0.18) 0%, transparent 70%)' }}
        />
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        {/* Highlighted header strip */}
        <div className="relative mb-8 md:mb-10">
          <div className="flex flex-col items-center text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#ff5000]/25 shadow-[0_8px_24px_rgba(255,80,0,0.12)] mb-5">
              <Sparkles size={15} className="text-[#ff5000]" />
              <span className="text-xs font-bold text-[#ff5000] uppercase tracking-[0.2em]">
                Limited Time Deals
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#ff5000] animate-pulse" />
            </div>

            <h2 className="font-display text-4xl md:text-6xl font-bold text-[#16181f] tracking-tight leading-[1.05] mb-4">
              Exclusive{' '}
              <span className="italic text-transparent bg-clip-text bg-gradient-to-r from-[#ff5000] via-[#e04800] to-[#ff5000]">
                Offers &amp; Deals
              </span>
            </h2>

            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#ff5000] to-[#e04800] text-white shadow-[0_12px_30px_rgba(255,80,0,0.35)]">
              <Gift size={15} />
              <span className="text-xs font-bold uppercase tracking-wider">
                {totalOffersCount} Active {totalOffersCount === 1 ? 'Offer' : 'Offers'} Live Now
              </span>
            </div>
          </div>
        </div>

        {/* Promo Cards Section */}
        {promoCards.length > 0 && (
          <div className="relative mb-12">
            <div className="relative rounded-[2rem] p-[3px] bg-gradient-to-br from-[#ff5000] via-[#ffb089] to-[#ff5000] shadow-[0_24px_60px_rgba(255,80,0,0.2)]">
              <div className="overflow-hidden rounded-[1.85rem] bg-white">
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
                        className="group relative cursor-pointer bg-[#fff8f5]"
                      >
                        <div className="relative w-full aspect-[2/1] overflow-hidden">
                          <img
                            src={getFullImageUrl(offer.image_url)}
                            alt={offer.title || 'Special offer'}
                            crossOrigin="anonymous"
                            className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-[1.02]"
                          />
                          <div className="absolute inset-0 ring-1 ring-inset ring-[#ff5000]/10 pointer-events-none rounded-[1.85rem]" />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
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
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="h-px w-12 bg-gradient-to-r from-transparent to-[#ff5000]/40" />
              <h3 className="font-display text-lg md:text-xl font-bold text-[#16181f] uppercase tracking-[0.15em]">
                Featured Highlights
              </h3>
              <span className="h-px w-12 bg-gradient-to-l from-transparent to-[#ff5000]/40" />
            </div>

            <div className="relative rounded-[2rem] p-[2px] bg-gradient-to-r from-[#ff5000]/40 via-[#ffb089]/60 to-[#ff5000]/40 shadow-[0_20px_50px_rgba(22,24,31,0.08)]">
              <div className="overflow-hidden rounded-[1.9rem] bg-white">
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
            </div>

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
              </>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
