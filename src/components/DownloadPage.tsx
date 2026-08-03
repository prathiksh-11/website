import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Check } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import PageHero from './PageHero';

const ANDROID_APP_URL =
  'https://play.google.com/store/apps/details?id=com.gameonfitness.app';
const IOS_APP_URL = 'https://apps.apple.com/app/id6773751865';

const features = [
  'Book your workouts',
  'Manage your membership',
  'Track your progress',
  'Join community challenges',
  'Stay updated with announcements',
  'Connect with your branch',
  'Celebrate milestones',
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
              className="btn-premium-primary inline-flex items-center justify-center gap-2 text-sm font-semibold px-7 py-3.5 rounded-full"
            >
              Download for Android
            </a>
            <a
              href={IOS_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium-secondary inline-flex items-center justify-center gap-2 text-sm font-semibold px-7 py-3.5 rounded-full"
            >
              Download for iPhone
            </a>
          </>
        }
      />

      {/* App screenshots */}
      <section className="py-20 md:py-28 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 md:mb-16">
            <div className="section-ornament justify-center mb-5">
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
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

          <div className="flex gap-5 md:gap-8 overflow-x-auto pb-6 px-1 snap-x snap-mandatory hide-scrollbar justify-start md:justify-center">
            {screenshots.map((shot) => (
              <figure
                key={shot.src}
                className="snap-center shrink-0 w-[200px] sm:w-[230px] md:w-[250px]"
              >
                <div className="relative rounded-[2rem] border-[6px] border-[#16181f] bg-[#16181f] shadow-[0_28px_60px_rgba(22,24,31,0.18)] overflow-hidden aspect-[9/19.5]">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-4 rounded-full bg-[#0a0a0b] z-10" />
                  <img
                    src={shot.src}
                    alt={`Game On Fitness app — ${shot.label}`}
                    className="w-full h-full object-cover object-top"
                    loading="lazy"
                  />
                </div>
                <figcaption className="mt-4 text-center text-sm font-semibold text-[#6f7685]">
                  {shot.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 atmosphere">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              {stories[0].label}
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            {stories[0].title}
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto">
            {stories[0].body}
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center mb-14">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Features
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] mb-5">
            Everything you need.
            <br />
            <span className="italic text-[#ff5000]">All in one place.</span>
          </h2>
          <p className="text-[#6f7685] text-lg max-w-xl mx-auto">
            No switching between apps. No searching for updates. Just one seamless experience.
          </p>
        </div>
        <div className="max-w-2xl mx-auto px-6 grid sm:grid-cols-2 gap-3">
          {features.map((f) => (
            <div
              key={f}
              className="flex items-center gap-3 rounded-2xl border border-[rgba(22,24,31,0.06)] bg-[#f7f8fb] px-4 py-3.5"
            >
              <Check size={16} className="text-[#ff5000] shrink-0" />
              <span className="text-[#3a3f4b] text-sm">{f}</span>
            </div>
          ))}
        </div>
      </section>

      {stories.slice(1).map((story, i) => (
        <section
          key={story.label}
          className={`py-24 ${i % 2 === 0 ? 'atmosphere' : 'bg-white'}`}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="section-ornament justify-center mb-5">
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
                {story.label}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
              {story.title}
            </h2>
            <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto">
              {story.body}
            </p>
          </div>
        </section>
      ))}

      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Get Started
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] mb-5">
            The journey doesn&apos;t stop at the gym.
            <br />
            <span className="italic text-[#ff5000]">
              It follows you wherever life takes you.
            </span>
          </h2>
          <p className="text-[#6f7685] mb-4 leading-relaxed">Take Game On with you.</p>
          <p className="text-[#6f7685] mb-10 leading-relaxed">
            Every workout. Every milestone. Every tomorrow.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <a
              href={ANDROID_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium-primary inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold"
            >
              Google Play
              <ArrowRight size={15} />
            </a>
            <a
              href={IOS_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-premium-secondary inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold"
            >
              App Store
            </a>
          </div>
          <Link to="/contact" className="text-[#ff5000] text-sm font-semibold hover:underline">
            Ready to begin? Start your journey →
          </Link>
          <p className="mt-12 text-[#9aa0ab] text-xs font-medium tracking-[0.2em] uppercase">
            Stronger every day. Wherever you are.
          </p>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
