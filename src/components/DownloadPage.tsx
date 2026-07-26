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

const chapters = [
  {
    num: 'Chapter One',
    title: (
      <>
        Fitness isn&apos;t
        <br />
        <span className="italic text-[#e07a72]">a one-hour habit.</span>
      </>
    ),
    body: "It's the choices you make every day. The Game On App is designed to keep you moving, motivated, and focused—whether you're inside the gym or anywhere else.",
  },
  {
    num: 'Chapter Three',
    title: (
      <>
        Every workout
        <br />
        <span className="italic text-[#e07a72]">moves you forward.</span>
      </>
    ),
    body: "Every check-in. Every completed session. Every milestone. Every personal best. Becomes part of your journey. Progress isn't remembered. It's recorded.",
  },
  {
    num: 'Chapter Four',
    title: (
      <>
        Stay connected.
        <br />
        <span className="italic text-[#e07a72]">Even when you&apos;re away.</span>
      </>
    ),
    body: "Receive reminders that keep you consistent. Get updates from your branch. Discover new challenges. Celebrate achievements with your community. Because motivation grows when you're connected.",
  },
  {
    num: 'Chapter Five',
    title: (
      <>
        Your community.
        <br />
        <span className="italic text-[#e07a72]">Always with you.</span>
      </>
    ),
    body: "You're never training alone. Celebrate victories. Cheer others on. Take part in community events. Stay inspired by people walking the same path. Great journeys are built together.",
  },
  {
    num: 'Chapter Six',
    title: (
      <>
        Simple. Fast.
        <br />
        <span className="italic text-[#e07a72]">Always ready.</span>
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
            <div className="w-10 h-10 border-4 border-[#e07a72] border-t-transparent rounded-full animate-spin" />
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
            <span className="italic text-[#e07a72]">when you leave the gym.</span>
          </>
        }
        description="The workout ends. The journey doesn't. Stay connected to your goals, progress, and community—every single day."
        image="https://images.pexels.com/photos/4498155/pexels-photo-4498155.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&fit=crop"
        imagePosition="center top"
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

      {/* Chapter One */}
      <section className="py-24 atmosphere">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
              {chapters[0].num}
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            {chapters[0].title}
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto">
            {chapters[0].body}
          </p>
        </div>
      </section>

      {/* Chapter Two — features */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center mb-14">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
              Chapter Two
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] mb-5">
            Everything you need.
            <br />
            <span className="italic text-[#e07a72]">All in one place.</span>
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
              <Check size={16} className="text-[#e07a72] shrink-0" />
              <span className="text-[#3a3f4b] text-sm">{f}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Chapters 3–6 */}
      {chapters.slice(1).map((chapter, i) => (
        <section
          key={chapter.num}
          className={`py-24 ${i % 2 === 0 ? 'atmosphere' : 'bg-white'}`}
        >
          <div className="max-w-4xl mx-auto px-6 text-center">
            <div className="section-ornament justify-center mb-5">
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
                {chapter.num}
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
              {chapter.title}
            </h2>
            <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto">
              {chapter.body}
            </p>
          </div>
        </section>
      ))}

      {/* Final Chapter */}
      <section className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
              Final Chapter
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] mb-5">
            The gym may close for the day.
            <br />
            <span className="italic text-[#e07a72]">Your journey never does.</span>
          </h2>
          <p className="text-[#6f7685] mb-4 leading-relaxed">
            Take Game On with you.
          </p>
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
          <Link to="/contact" className="text-[#e07a72] text-sm font-semibold hover:underline">
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
