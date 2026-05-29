import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import {
  ArrowRight,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Flame,
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
        const allBanners = response.data.data.filter(
          (item: Banner) => item.is_active
        );

        // Separate promo cards and carousel banners
        const promos = allBanners
          .filter((item: Banner) => item.banner_type === 'promo_card')
          .sort((a: Banner, b: Banner) => (a.display_order || 0) - (b.display_order || 0));

        const carousels = allBanners
          .filter((item: Banner) => item.banner_type === 'carousel')
          .sort((a: Banner, b: Banner) => (a.display_order || 0) - (b.display_order || 0));

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

  // Auto-play for promo cards
  useEffect(() => {
    if (promoCards.length <= 1 || isHovered) return;
    
    const interval = setInterval(() => {
      setCurrentPromoSlide((prev) => (prev + 1) % promoCards.length);
    }, 4000);
    
    return () => clearInterval(interval);
  }, [promoCards.length, isHovered]);

  // Auto-play for carousel banners
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
    setCurrentCarouselSlide((prev) => (prev - 1 + carouselBanners.length) % carouselBanners.length);
  };

  if (promoCards.length === 0 && carouselBanners.length === 0) return null;

  return (
    <section 
      className="relative py-8 bg-gradient-to-b from-[#050505] via-[#0a0a0a] to-[#050505] overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-[#ffb800]/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-[#ff6b35]/10 blur-[100px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,184,0,0.5) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-[#ffb800]/30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${4 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      <div className="relative max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 animate-fade-in-up">
          <div className="flex items-center gap-4">
            <div className="relative group">
              <div className="absolute inset-0 bg-[#ffb800]/30 blur-xl rounded-full animate-pulse" />
              <div className="relative w-12 h-12 rounded-xl bg-gradient-to-br from-[#ffb800] to-[#ff6b35] flex items-center justify-center transform group-hover:rotate-12 transition-transform duration-300">
                <Flame size={24} className="text-black animate-flame-flicker" />
              </div>
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">
                Hot <span className="gradient-text-gold animate-shimmer">Deals</span>
              </h2>
              <p className="text-xs text-white/40 font-medium tracking-wider uppercase">Limited Time Offers</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 hover:border-[#ffb800]/30 transition-all duration-300 hover:bg-white/10">
            <Sparkles size={14} className="text-[#ffb800] animate-pulse" />
            <span className="text-xs font-bold text-white/60 uppercase tracking-wider">
              {promoCards.length + carouselBanners.length} Active {(promoCards.length + carouselBanners.length) === 1 ? 'Offer' : 'Offers'}
            </span>
          </div>
        </div>

        {/* Carousel Container - Promo Cards */}
        {promoCards.length > 0 && (
          <div className="relative mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
                style={{ transform: `translateX(-${currentPromoSlide * 100}%)` }}
              >
                {promoCards.map((offer, index) => (
                  <div
                    key={offer.id}
                    className="flex-shrink-0 w-full"
                  >
                    <div
                      onClick={() => offer.redirect_url && (window.location.href = offer.redirect_url)}
                      className="group relative cursor-pointer mx-auto animate-slide-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      {/* Card Container */}
                      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#111] to-[#1a1a1a] border border-white/10 group-hover:border-[#ffb800]/50 transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(255,184,0,0.2)]">
                        
                        {/* Background Image - Full visibility, no cropping */}
                        <div className="relative w-full" style={{ aspectRatio: 'auto' }}>
                          <img
                            src={getFullImageUrl(offer.image_url)}
                            alt={offer.title}
                            crossOrigin="anonymous"
                            className="w-full h-auto object-contain opacity-95 group-hover:opacity-100 transition-all duration-700"
                          />
                        </div>
                        
                        {/* Light Gradient Overlays - Only on edges */}
                        <div className="absolute inset-0 bg-gradient-to-r from-black/30 via-transparent to-transparent pointer-events-none" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Decorative Elements */}
                        <div className="absolute top-4 right-4 flex gap-2 pointer-events-none">
                          <div className="px-3 py-1.5 rounded-full bg-[#ffb800]/20 backdrop-blur-md border border-[#ffb800]/30">
                            <div className="flex items-center gap-1.5">
                              <Gift size={12} className="text-[#ffb800]" />
                              <span className="text-[10px] font-bold text-[#ffb800] uppercase tracking-wider">Exclusive</span>
                            </div>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="absolute inset-0 p-8 md:p-12 flex flex-col justify-end pointer-events-none">
                          <div className="max-w-2xl pointer-events-auto">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#ffb800]/20 to-[#ff6b35]/20 backdrop-blur-md border border-[#ffb800]/30 mb-4">
                              <Tag size={14} className="text-[#ffb800]" />
                              <span className="text-xs font-bold text-[#ffb800] uppercase tracking-wider">Limited Offer</span>
                            </div>
                            
                            {/* Title */}
                            <h3 className="text-2xl md:text-4xl font-black text-white mb-3 group-hover:text-[#ffb800] transition-colors duration-300 leading-tight drop-shadow-lg">
                              {offer.title}
                            </h3>
                            
                            {/* CTA Button */}
                            <div className="flex items-center gap-4 mt-4">
                              <button className="group/btn flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#ffb800] to-[#ff6b35] text-black font-bold text-sm uppercase tracking-wider hover:scale-105 hover:shadow-[0_0_30px_rgba(255,184,0,0.5)] transition-all duration-300">
                                Claim Offer
                                <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                              </button>
                              
                              <div className="flex items-center gap-2 text-white/60 text-xs">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>Active Now</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Corner Decorations */}
                        <div className="absolute top-0 left-0 w-20 h-20 pointer-events-none">
                          <div className="absolute top-4 left-4 w-12 h-[2px] bg-gradient-to-r from-[#ffb800] to-transparent" />
                          <div className="absolute top-4 left-4 w-[2px] h-12 bg-gradient-to-b from-[#ffb800] to-transparent" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-20 h-20 pointer-events-none">
                          <div className="absolute bottom-4 right-4 w-12 h-[2px] bg-gradient-to-l from-[#ffb800] to-transparent" />
                          <div className="absolute bottom-4 right-4 w-[2px] h-12 bg-gradient-to-t from-[#ffb800] to-transparent" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              {promoCards.length > 1 && (
                <>
                  <button
                    onClick={goToPrevPromo}
                    className="absolute top-1/2 left-4 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#ffb800] hover:text-black hover:border-[#ffb800] transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNextPromo}
                    className="absolute top-1/2 right-4 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#ffb800] hover:text-black hover:border-[#ffb800] transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Progress Dots */}
              {promoCards.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {promoCards.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPromoSlide(index)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === currentPromoSlide 
                          ? 'bg-gradient-to-r from-[#ffb800] to-[#ff6b35] w-12' 
                          : 'bg-white/20 w-2 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Carousel Banners Slider */}
        {carouselBanners.length > 0 && (
          <div className="relative animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-2 h-8 bg-[#ff6b35] rounded-full animate-pulse-glow" />
                <h3 className="text-xl md:text-2xl font-black text-white tracking-tight">
                  Featured <span className="gradient-text-gold animate-shimmer">Banners</span>
                </h3>
              </div>
            </div>
            
            <div className="overflow-hidden rounded-2xl">
              <div
                className="flex transition-transform duration-700 cubic-bezier(0.4, 0, 0.2, 1)"
                style={{ transform: `translateX(-${currentCarouselSlide * 100}%)` }}
              >
                {carouselBanners.map((banner, index) => (
                  <div
                    key={banner.id}
                    className="flex-shrink-0 w-full animate-slide-in"
                    style={{ animationDelay: `${index * 0.15}s` }}
                  >
                    <div
                      onClick={() => banner.redirect_url && (window.location.href = banner.redirect_url)}
                      className="group relative cursor-pointer"
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-white/10 group-hover:border-[#ff6b35]/50 transition-all duration-500 group-hover:shadow-[0_0_60px_rgba(255,107,53,0.2)] bg-[#0a0a0a]">
                        <div className="relative w-full max-w-4xl mx-auto overflow-hidden" style={{ aspectRatio: 'auto' }}>
                          <img
                            src={getFullImageUrl(banner.image_url)}
                            alt={banner.title}
                            crossOrigin="anonymous"
                            className="w-full h-auto object-cover opacity-95 group-hover:opacity-100 transform scale-110 group-hover:scale-115 transition-all duration-700"
                          />
                        </div>
                        
                        {/* Light overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" />
                        
                        {/* Title overlay */}
                        {banner.title && (
                          <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
                            <h4 className="text-xl font-black text-white drop-shadow-lg">
                              {banner.title}
                            </h4>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              {carouselBanners.length > 1 && (
                <>
                  <button
                    onClick={goToPrevCarousel}
                    className="absolute top-[calc(50%+20px)] left-4 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#ff6b35] hover:text-black hover:border-[#ff6b35] transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={goToNextCarousel}
                    className="absolute top-[calc(50%+20px)] right-4 -translate-y-1/2 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-[#ff6b35] hover:text-black hover:border-[#ff6b35] transition-all duration-300 opacity-0 group-hover:opacity-100"
                  >
                    <ChevronRight size={20} />
                  </button>
                </>
              )}

              {/* Progress Dots */}
              {carouselBanners.length > 1 && (
                <div className="flex items-center justify-center gap-2 mt-6">
                  {carouselBanners.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentCarouselSlide(index)}
                      className={`h-2 rounded-full transition-all duration-500 ${
                        index === currentCarouselSlide 
                          ? 'bg-gradient-to-r from-[#ff6b35] to-[#ffb800] w-12' 
                          : 'bg-white/20 w-2 hover:bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Glow Effect */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#ffb800]/50 to-transparent" />
    </section>
  );
}