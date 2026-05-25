import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { CheckCircle } from 'lucide-react';



export default function About() {
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: leftRef, isVisible: leftVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: rightRef, isVisible: rightVisible } = useIntersectionObserver<HTMLDivElement>({ threshold: 0.1 });

  return (
    <section id="about" className="relative py-20 bg-[#050505] overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 pointer-events-none">
        <div
          className="w-full h-full rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.5) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Section header */}
        <div ref={headRef} className="mb-20 text-center">
          <div className={`reveal ${headVisible ? 'visible' : ''}`}>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#ff6b35] mb-4 block">About Game On Fitness</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-none mb-6">
              <span className="gradient-text-blue">WHO WE ARE</span>
            </h2>
            <div className="divider-glow max-w-xs mx-auto" />
          </div>
        </div>

        {/* Split layout */}
        <div className="grid md:grid-cols-2 gap-16 items-center ">
          {/* Left - Images */}
          <div ref={leftRef} className={`relative reveal-left ${leftVisible ? 'visible' : ''}`}>
            <div className="relative">
              <div className="rounded-2xl overflow-hidden">
                <img
                  src="https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
                  alt="Elite training facility"
                  className="w-full h-[400px] object-cover opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-black/60 via-transparent to-transparent" />
              </div>

              {/* Floating smaller card */}
              <div className="absolute md:-bottom-8 md:-right-8 -bottom-4 -right-4 w-40 md:w-48 glass-card rounded-xl overflow-hidden animate-float" style={{ animationDelay: '2s' }}>
                <img
                  src="https://images.pexels.com/photos/1431282/pexels-photo-1431282.jpeg?auto=compress&cs=tinysrgb&w=300&h=200&fit=crop"
                  alt="Training"
                  className="w-full h-28 object-cover opacity-70"
                />
                <div className="p-3">
                  <p className="text-xs font-bold text-white">Elite Programming</p>
                  <p className="text-xs text-white/40 mt-0.5">Personalized for you</p>
                </div>
              </div>

            
            </div>
          </div>

          {/* Right - Content */}
          <div ref={rightRef} className={`reveal-right ${rightVisible ? 'visible' : ''}`}>
            <p className="text-white/40 text-sm font-medium tracking-widest uppercase mb-3">Who We Are</p>
            <h3 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
              About Game On
              <br />
              <span className="gradient-text-blue">Fitness</span>
            </h3>
            <p className="text-white/60 leading-relaxed mb-6 text-lg">
              Game On Fitness is a health and fitness company offering experiences across fitness,
              nutrition, and mental well-being.
            </p>
            <p className="text-white/40 leading-relaxed mb-8">
              We are dedicated to covering the full fitness landscape, regularly introducing fans
              to new trends in training, nutrition, gear and technology. Game On Fitness is the
              essential training partner.
            </p>

            <div className="space-y-3">
              {[
                'Top of the line machines, weights and workout accessories',
                'High quality cardio & strength equipment in every club',
                'Exceptional ambience with high quality interiors',
                'Ace certified Advanced Personal Trainers',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle size={16} className="text-[#ff6b35] flex-shrink-0" />
                  <span className="text-white/70 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hidden lg:block fixed bottom-6 right-6 z-50 animate-float" style={{ animationDelay: '1s' }}>
        <div className="glass-card rounded-2xl p-5 max-w-[180px]">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-24 h-24 bg-white rounded-lg p-2">
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://play.google.com/store/apps/details?id=com.gameonfitness.app&pcampaignid=web_share"
                alt="QR Code for mobile app"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-white mb-1">Better Experience</p>
              <p className="text-xs text-white/60 leading-relaxed">
                For the best experience, use our mobile app
              </p>
              <div className="mt-2 flex items-center justify-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#00d4ff] animate-pulse" />
                <span className="text-xs text-[#00d4ff] font-semibold">Scan to download</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
