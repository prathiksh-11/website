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
  id: number;
  title: string;
  image_url: string;
  redirect_url?: string;
  banner_type: string;
  is_active: boolean;
  display_order?: number;
}

export default function PromotionalOffers() {
  const [promoCards, setPromoCards] = useState<Banner[]>([]);
  const [carouselBanners, setCarouselBanners] = useState<Banner[]>([]);
  const [currentPromoSlide, setCurrentPromoSlide] = useState(0);
  const [currentCarouselSlide, setCurrentCarouselSlide] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

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

  const fetchOffers = useCallback(async () => {
    try {
      const apiUrl = `${
        import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
      }/api/get-banners`;

      const response = await axios.get(apiUrl);

      if (response.data.success) {
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
      console.error('Failed to fetch offers:', error);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  useEffect(() => {
    if (promoCards.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentPromoSlide((prev) => (prev + 1) % promoCards.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [promoCards.length, isHovered]);

  useEffect(() => {
    if (carouselBanners.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setCurrentCarouselSlide((prev) => (prev + 1) % carouselBanners.length);
    }, 5000);

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

  return (
    <section
      className="relative py-16 md:py-20 bg-white overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between mb-8 animate-fade-in-up">
          <div>
            <div className="section-ornament mb-3">
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
                Limited Time
              </span>
            </div>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-[#16181f] tracking-tight">
              Exclusive <span className="italic text-[#e07a72]">offers</span>
            </h2>
          </div>

          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#f7f8fb] border border-[rgba(18,20,26,0.06)]">
            <Sparkles size={14} className="text-[#e07a72]" />
            <span className="text-xs font-semibold text-[#6f7685] uppercase tracking-wider">
              {promoCards.length + carouselBanners.length} Active{' '}
              {promoCards.length + carouselBanners.length === 1 ? 'Offer' : 'Offers'}
            </span>
          </div>
        </div>

        {promoCards.length > 0 && (
          <div className="relative mb-12 animate-fade-in-up" style={{ animationDelay: '0.15s' }}>
            <div className="overflow-hidden rounded-[1.5rem]">
              <div
                className="flex transition-transform duration-700"
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
                      <div className="relative overflow-hidden rounded-[1.5rem] bg-[#f7f8fb] border border-[rgba(18,20,26,0.06)] group-hover:shadow-[0_28px_60px_rgba(18,20,26,0.1)] transition-all duration-500">
                        <div className="relative w-full">
                          <img
                            src={getFullImageUrl(offer.image_url)}
                            alt={offer.title}
                            crossOrigin="anonymous"
                            className="w-full h-auto object-contain"
                          />
                        </div>

                        <div className="absolute inset-0 bg-gradient-to-t from-[#16181f]/50 via-transparent to-transparent pointer-events-none" />

                        <div className="absolute top-4 right-4 pointer-events-none">
                          <div className="px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(18,20,26,0.06)]">
                            <div className="flex items-center gap-1.5">
                              <Gift size={12} className="text-[#e07a72]" />
                              <span className="text-[10px] font-bold text-[#16181f] uppercase tracking-wider">
                                Exclusive
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end pointer-events-none">
                          <div className="max-w-2xl pointer-events-auto">
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/90 backdrop-blur-md mb-4">
                              <Tag size={12} className="text-[#e07a72]" />
                              <span className="text-[10px] font-bold text-[#16181f] uppercase tracking-wider">
                                Limited Offer
                              </span>
                            </div>

                            <h3 className="font-display text-2xl md:text-4xl font-extrabold text-white mb-4 leading-tight drop-shadow-sm">
                              {offer.title}
                            </h3>

                            <button className="group/btn inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-[#16181f] font-semibold text-sm hover:bg-[#e07a72] hover:text-white transition-all duration-300">
                              Claim Offer
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

              {promoCards.length > 1 && (
                <>
                  <button
                    onClick={goToPrevPromo}
                    className="absolute top-1/2 left-4 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(18,20,26,0.08)] text-[#16181f] hover:bg-[#16181f] hover:text-white transition-all duration-300 shadow-lg"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNextPromo}
                    className="absolute top-1/2 right-4 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(18,20,26,0.08)] text-[#16181f] hover:bg-[#16181f] hover:text-white transition-all duration-300 shadow-lg"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {promoCards.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {promoCards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPromoSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === currentPromoSlide
                          ? 'bg-[#e07a72] w-10'
                          : 'bg-[#d4d7de] w-2 hover:bg-[#9aa0ab]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {carouselBanners.length > 0 && (
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-1.5 h-6 bg-[#e07a72] rounded-full" />
              <h3 className="font-display text-xl md:text-2xl font-bold text-[#16181f] tracking-tight">
                Featured banners
              </h3>
            </div>

            <div className="overflow-hidden rounded-[1.5rem]">
              <div
                className="flex transition-transform duration-700"
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
                      <div className="relative overflow-hidden rounded-[1.5rem] border border-[rgba(18,20,26,0.06)] bg-[#f7f8fb] group-hover:shadow-[0_28px_60px_rgba(18,20,26,0.1)] transition-all duration-500">
                        <div className="relative w-full max-w-4xl mx-auto overflow-hidden">
                          <img
                            src={getFullImageUrl(banner.image_url)}
                            alt={banner.title}
                            crossOrigin="anonymous"
                            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                          />
                        </div>

                        {banner.title && (
                          <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-[#16181f]/50 to-transparent">
                            <h4 className="font-display text-xl font-bold text-white drop-shadow-sm">
                              {banner.title}
                            </h4>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {carouselBanners.length > 1 && (
                <>
                  <button
                    onClick={goToPrevCarousel}
                    className="absolute top-[calc(50%+20px)] left-4 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(18,20,26,0.08)] text-[#16181f] hover:bg-[#16181f] hover:text-white transition-all duration-300 shadow-lg"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNextCarousel}
                    className="absolute top-[calc(50%+20px)] right-4 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-md border border-[rgba(18,20,26,0.08)] text-[#16181f] hover:bg-[#16181f] hover:text-white transition-all duration-300 shadow-lg"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {carouselBanners.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {carouselBanners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCarouselSlide(index)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${
                        index === currentCarouselSlide
                          ? 'bg-[#e07a72] w-10'
                          : 'bg-[#d4d7de] w-2 hover:bg-[#9aa0ab]'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
