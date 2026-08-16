import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Check,
  CalendarDays,
  CreditCard,
  TrendingUp,
  Users,
  Bell,
  MapPin,
  Trophy,
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import PageHero from './PageHero';

const ANDROID_APP_URL =
  'https://play.google.com/store/apps/details?id=com.gameonfitness.app';
const IOS_APP_URL = 'https://apps.apple.com/app/id6773751865';

const featureCards = [
  { icon: CalendarDays, title: 'Book your workouts', text: 'Reserve sessions in seconds.' },
  { icon: CreditCard, title: 'Manage membership', text: 'Plans, renewals, and status — clear.' },
  { icon: TrendingUp, title: 'Track your progress', text: 'See every check-in and milestone.' },
  { icon: Users, title: 'Community challenges', text: 'Train with people on the same path.' },
  { icon: Bell, title: 'Branch updates', text: 'Announcements when they matter.' },
  { icon: MapPin, title: 'Connect with your branch', text: 'Your gym, always in your pocket.' },
  { icon: Trophy, title: 'Celebrate milestones', text: 'Wins deserve to be recorded.' },
];

const screenshots = [
  { src: '/app-screenshots/screen-1.jpg', label: 'Explore' },
  { src: '/app-screenshots/screen-2.jpg', label: 'Home' },
  { src: '/app-screenshots/screen-3.jpg', label: 'Profile' },
];

const stories = [
  {
    label: 'Daily Habits',
    title: (
      <>
        Fitness isn&apos;t
        <br />
        <span className="italic text-[#ff5000]">a one-hour habit.</span>
      </>
    ),
    body: "It's the choices you make every day. The Game On App is designed to keep you moving, motivated, and focused—whether you're inside the gym or anywhere else.",
  },
  {
    label: 'Progress',
    title: (
      <>
        Every workout
        <br />
        <span className="italic text-[#ff5000]">moves you forward.</span>
      </>
    ),
    body: "Every check-in. Every completed session. Every milestone. Every personal best. Becomes part of your journey. Progress isn't remembered. It's recorded.",
  },
  {
    label: 'Stay Connected',
    title: (
      <>
        Stay connected.
        <br />
        <span className="italic text-[#ff5000]">Even when you&apos;re away.</span>
      </>
    ),
    body: "Receive reminders that keep you consistent. Get updates from your branch. Discover new challenges. Celebrate achievements with your community. Because motivation grows when you're connected.",
  },
  {
    label: 'Community',
    title: (
      <>
        Your community.
        <br />
        <span className="italic text-[#ff5000]">Always with you.</span>
      </>
    ),
    body: "You're never training alone. Celebrate victories. Cheer others on. Take part in community events. Stay inspired by people walking the same path. Great journeys are built together.",
  },
  {
    label: 'Simple Design',
    title: (
      <>
        Simple. Fast.
        <br />
        <span className="italic text-[#ff5000]">Always ready.</span>
      </>
    ),
    body: 'Designed for speed. Built for simplicity. Focused on what matters most. No clutter. No distractions. Just everything you need to keep moving forward.',
  },
];

export default function DownloadPage() {
  const [autoRedirect, setAutoRedirect] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('go') !== '1') return;

    setAutoRedirect(true);
    const ua = navigator.userAgent.toLowerCase();
    let redirectUrl = ANDROID_APP_URL;
    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
      redirectUrl = IOS_APP_URL;
    } else if (!ua.includes('android')) {
      return;
    }

    const t = setTimeout(() => {
      window.location.replace(redirectUrl);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  if (autoRedirect) {
    return (
      <div className="min-h-screen atmosphere flex items-center justify-center px-6">
        <div className="max-w-md w-full rounded-3xl border border-[rgba(18,20,26,0.08)] bg-white p-8 text-center shadow-[0_28px_60px_rgba(18,20,26,0.08)]">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-[#16181f] flex items-center justify-center mb-6">
            <span className="text-white font-display font-bold text-xl">GO</span>
          </div>
          <h1 className="font-display text-3xl font-extrabold text-[#16181f] mb-3">
            Game On Fitness
          </h1>
          <p className="text-[#6f7685] mb-6">Redirecting you to the app store...</p>
          <div className="flex justify-center">
            <div className="w-10 h-10 border-4 border-[#ff5000] border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <Navbar />

      <PageHero
        eyebrow="Download the Game On App"
        title={
          <>
            Your journey doesn&apos;t end
            <br />
            <span className="italic text-[#ff5000]">when you leave the gym.</span>
          </>
        }
        description="The workout ends. The journey doesn't. Stay connected to your goals, progress, and community—every single day."
        image="/app-screenshots/screen-2.jpg"
        variant="app"
        actions={
          <>
            <a
              href={ANDROID_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group app-cta-pulse inline-flex items-center justify-center gap-3 rounded-2xl bg-[#16181f] text-white px-5 py-3.5 text-sm font-semibold hover:bg-[#ff5000] hover:-translate-y-0.5 transition-all duration-300"
            >
              <img src="/play-store.png" alt="" className="w-7 h-7 object-contain" />
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-medium text-white/60 uppercase tracking-wider">
                  Get it on
                </span>
                Google Play
              </span>
            </a>
            <a
              href={IOS_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-white border border-[rgba(22,24,31,0.1)] text-[#16181f] px-5 py-3.5 text-sm font-semibold shadow-[0_10px_28px_rgba(22,24,31,0.06)] hover:border-[#ff5000]/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" aria-hidden>
                <path d="M18.71 19.5C17.88 20.74 17 21.95 15.66 21.97C14.32 22 13.89 21.18 12.37 21.18C10.84 21.18 10.37 21.95 9.1 22C7.79 22.05 6.8 20.68 5.96 19.47C4.25 16.97 2.93 12.45 4.7 9.39C5.57 7.87 7.13 6.91 8.82 6.88C10.1 6.86 11.32 7.75 12.11 7.75C12.89 7.75 14.37 6.68 15.92 6.84C16.57 6.87 18.39 7.1 19.56 8.82C19.47 8.88 17.39 10.1 17.41 12.63C17.44 15.65 20.06 16.66 20.09 16.67C20.06 16.74 19.67 18.11 18.71 19.5ZM13 3.5C13.73 2.67 14.94 2.04 15.94 2C16.07 3.17 15.6 4.35 14.9 5.19C14.21 6.04 13.07 6.7 11.95 6.61C11.8 5.46 12.36 4.26 13 3.5Z" />
              </svg>
              <span className="text-left leading-tight">
                <span className="block text-[10px] font-medium text-[#6f7685] uppercase tracking-wider">
                  Download on the
                </span>
                App Store
              </span>
            </a>
          </>
        }
      />

      {/* Screenshots showcase */}
      <section
        id="app-preview"
        className="relative pt-28 pb-24 md:pt-32 md:pb-32 scroll-mt-28 overflow-hidden"
      >
        {/* Sexy circle / orb background — white + orange */}
        <div className="absolute inset-0 bg-[#f7f8fb]" />
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[720px] h-[720px] md:w-[980px] md:h-[980px] rounded-full border border-[#ff5000]/10" />
          <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[520px] h-[520px] md:w-[720px] md:h-[720px] rounded-full border border-[#ff5000]/15" />
          <div className="absolute left-1/2 top-[58%] -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] md:w-[460px] md:h-[460px] rounded-full border border-dashed border-[#ff5000]/25 app-ring-spin" />
          <div
            className="absolute left-1/2 top-[52%] -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] md:w-[560px] md:h-[560px] rounded-full app-glow-breath"
            style={{
              background: 'radial-gradient(circle, rgba(255,80,0,0.16) 0%, transparent 68%)',
            }}
          />
          <div
            className="absolute -left-24 top-10 w-64 h-64 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,240,232,0.95) 0%, transparent 70%)' }}
          />
          <div
            className="absolute -right-20 bottom-10 w-72 h-72 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(255,80,0,0.08) 0%, transparent 70%)' }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#ff5000]/15 shadow-sm mb-5">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#ff5000]">
                App Preview
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] mb-4">
              See the app in <span className="italic text-[#ff5000]">action.</span>
            </h2>
            <p className="text-[#6f7685] text-lg max-w-xl mx-auto">
              Book sessions, track progress, and stay connected with your branch — all in one place.
            </p>
          </div>

          {/* Phones — full screenshot, no crop */}
          <div className="relative flex flex-col md:flex-row items-center md:items-end justify-center gap-8 md:gap-6 lg:gap-10 px-2">
            {screenshots.map((shot, i) => {
              const lift =
                i === 1
                  ? 'md:-translate-y-8 md:scale-110 z-20'
                  : i === 0
                    ? 'md:translate-y-4 md:-rotate-2 z-10'
                    : 'md:translate-y-4 md:rotate-2 z-10';

              return (
                <figure
                  key={shot.src}
                  className={`relative w-[220px] sm:w-[240px] md:w-[250px] lg:w-[270px] transition-transform duration-500 ${lift}`}
                >
                  <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[70%] h-8 rounded-full bg-[#16181f]/12 blur-xl" />

                  {/* Phone bezel matches real screenshot ratio (503×1024) */}
                  <div className="relative rounded-[2.2rem] border-[7px] border-[#16181f] bg-[#16181f] shadow-[0_30px_70px_rgba(22,24,31,0.2)] overflow-hidden aspect-[503/1024] hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(255,80,0,0.18)] transition-all duration-500">
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-black z-20" />
                    <img
                      src={shot.src}
                      alt={`Game On Fitness app — ${shot.label}`}
                      className="block w-full h-full object-cover object-top bg-[#0a0a0b]"
                      loading="lazy"
                    />
                  </div>

                  <figcaption className="mt-7 text-center">
                    <span className="inline-flex items-center px-3.5 py-1.5 rounded-full bg-white border border-[rgba(22,24,31,0.06)] shadow-sm text-sm font-semibold text-[#3a3f4b]">
                      {shot.label}
                    </span>
                  </figcaption>
                </figure>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story band */}
      <section className="py-20 md:py-28 bg-[#16181f] relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,80,0,0.22), transparent 60%)',
          }}
        />
        <div className="relative max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ffb089] mb-5">
            {stories[0].label}
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-white leading-tight mb-6">
            {stories[0].title}
          </h2>
          <p className="text-white/60 text-lg leading-relaxed max-w-2xl mx-auto">
            {stories[0].body}
          </p>
        </div>
      </section>

      {/* Bento features */}
      <section className="py-20 md:py-28 bg-[#f7f8fb]">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-14">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[rgba(22,24,31,0.06)] mb-5">
              <span className="text-xs font-semibold tracking-[0.3em] uppercase text-[#ff5000]">
                Features
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] mb-4">
              Everything you need.
              <br />
              <span className="italic text-[#ff5000]">All in one place.</span>
            </h2>
            <p className="text-[#6f7685] text-lg max-w-xl mx-auto">
              No switching between apps. No searching for updates. Just one seamless experience.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {featureCards.map((f, i) => {
              const Icon = f.icon;
              const wide = i === 0 || i === 3;
              return (
                <div
                  key={f.title}
                  className={`group rounded-[1.5rem] border border-[rgba(22,24,31,0.06)] bg-white p-6 md:p-7 hover:-translate-y-1 hover:shadow-[0_24px_50px_rgba(22,24,31,0.08)] hover:border-[#ff5000]/25 transition-all duration-400 ${
                    wide ? 'lg:col-span-1' : ''
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-[#fff0e8] text-[#ff5000] flex items-center justify-center mb-5 group-hover:bg-[#ff5000] group-hover:text-white transition-colors duration-300">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#16181f] mb-2">{f.title}</h3>
                  <p className="text-[#6f7685] text-sm leading-relaxed">{f.text}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {stories.slice(1).map((story, i) => (
        <section
          key={story.label}
          className={`py-20 md:py-24 ${i % 2 === 0 ? 'bg-white' : 'bg-[#f7f8fb]'}`}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000] mb-5">
              {story.label}
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
              {story.title}
            </h2>
            <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto">{story.body}</p>
          </div>
        </section>
      ))}

      {/* Final CTA */}
      <section className="py-20 md:py-28 px-6">
        <div className="max-w-4xl mx-auto relative overflow-hidden rounded-[2rem] md:rounded-[2.5rem] bg-[#16181f] px-6 py-14 md:px-14 md:py-16 text-center shadow-[0_30px_80px_rgba(22,24,31,0.18)]">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 70% 60% at 50% 0%, rgba(255,80,0,0.28), transparent 60%)',
            }}
          />
          <div className="relative">
            <p className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ffb089] mb-5">
              Get Started
            </p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-5 leading-tight">
              The journey doesn&apos;t stop at the gym.
              <br />
              <span className="italic text-[#ffb089]">It follows you wherever life takes you.</span>
            </h2>
            <p className="text-white/55 mb-8 leading-relaxed max-w-lg mx-auto">
              Take Game On with you. Every workout. Every milestone. Every tomorrow.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              <a
                href={ANDROID_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#ff5000] text-white text-sm font-semibold shadow-[0_14px_36px_rgba(255,80,0,0.35)] hover:-translate-y-0.5 transition-all"
              >
                Google Play
                <ArrowRight size={15} />
              </a>
              <a
                href={IOS_APP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 border border-white/20 text-white text-sm font-semibold hover:bg-white/15 transition-all"
              >
                App Store
              </a>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1 text-[#ffb089] text-sm font-semibold hover:text-white transition-colors"
            >
              Ready to begin? Start your journey
              <ArrowRight size={14} />
            </Link>
            <div className="mt-10 flex flex-wrap justify-center gap-2">
              {['Book', 'Track', 'Belong'].map((t) => (
                <span
                  key={t}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[11px] font-semibold tracking-wide text-white/50"
                >
                  <Check size={12} className="text-[#ff5000]" />
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
