import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Phone,
  Mail,
  Clock,
  Loader,
  MapPin,
  MessageCircle,
  Smartphone,
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import CelebrationSuccessScreen from './CelebrationSuccessScreen';

type Status = 'idle' | 'loading' | 'success';

const WHATSAPP_NUMBER = '919148974009';

const goals = [
  'Weight Loss',
  'Muscle Gain',
  'Body Toning',
  'General Fitness',
  'Strength Training',
  'Other',
];

const startOptions = [
  {
    icon: MapPin,
    title: 'Find Your Nearest Branch',
    text: 'Experience the energy. Meet the coaches. See the space.',
    cta: 'Explore Branches',
    action: 'branches' as const,
  },
  {
    icon: MessageCircle,
    title: 'Book a Free Gym Tour',
    text: 'Walk through the gym. Meet our team. Experience Game On before you begin.',
    cta: 'Book Your Visit',
    action: 'whatsapp' as const,
  },
  {
    icon: Phone,
    title: 'Talk to Our Team',
    text: "We'll help you choose the right branch and guide you toward your goals.",
    cta: 'Talk to Us',
    action: 'whatsapp' as const,
  },
  {
    icon: Smartphone,
    title: 'Download the App',
    text: 'Take the first step today. Discover everything Game On has to offer.',
    cta: 'Download App',
    action: 'download' as const,
  },
];

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    goal: '',
  });
  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim() || !form.goal) return;

    setStatus('loading');
    await new Promise((r) => setTimeout(r, 600));

    if (typeof window !== 'undefined' && typeof (window as unknown as { gtag?: Function }).gtag === 'function') {
      (window as unknown as { gtag: Function }).gtag('event', 'conversion', {
        send_to: 'AW-18403934534/x6wECK6kwOYcEMaC18dE',
      });
    }

    const message = `Hi, I'd like to get in touch.\n\nName: ${form.name.trim()}\nPhone: ${form.phone.trim()}\nGoal: ${form.goal}`;
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      '_blank',
      'noopener,noreferrer',
    );

    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setForm({ name: '', phone: '', goal: '' });
    }, 4000);
  };

  const handleOption = (action: 'branches' | 'whatsapp' | 'download') => {
    if (action === 'branches') {
      window.location.href = '/#branches';
      return;
    }
    if (action === 'download') {
      window.location.href = '/download';
      return;
    }
    window.open('https://wa.me/919148974009', '_blank');
  };

  return (
    <div className="min-h-screen gym-surface">
      <Navbar />

      <section className="relative pt-36 pb-16 overflow-hidden atmosphere">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000]">
              Start Your Journey
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[#16181f] mb-5">
            The hardest step
            <br />
            <span className="italic text-[#ff5000]">is the first one.</span>
          </h1>
          <p className="text-[#6f7685] text-lg max-w-xl mx-auto leading-relaxed">
            You&apos;re already here. That means you&apos;ve taken it. Now let&apos;s take the
            next step together.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs font-semibold tracking-[0.35em] uppercase text-[#ff5000] mb-10">
            Choose how you&apos;d like to begin
          </p>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {startOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.title}
                  onClick={() => handleOption(opt.action)}
                  className="group text-left rounded-[1.75rem] border border-[rgba(22,24,31,0.06)] bg-white p-7 hover:border-[#ff5000]/30 hover:shadow-[0_20px_50px_rgba(22,24,31,0.08)] transition-all duration-400 hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#fff0e8] text-[#ff5000] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#16181f] mb-2">
                    {opt.title}
                  </h3>
                  <p className="text-[#6f7685] text-sm leading-relaxed mb-5">{opt.text}</p>
                  <span className="text-sm font-semibold text-[#ff5000]">{opt.cta} →</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 md:py-28 gym-surface">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-5 gap-12 items-start">
            <div className="lg:col-span-2">
              <h2 className="font-display text-3xl md:text-4xl font-bold text-[#16181f] mb-4">
                We&apos;d love to hear from you
              </h2>
              <p className="text-[#6f7685] leading-relaxed mb-10">
                Whether you&apos;re ready to join, looking for the right branch, exploring career
                opportunities, or simply have a question — we&apos;re here to help.
              </p>

              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-2xl border border-[rgba(22,24,31,0.06)] bg-[#f7f8fb] p-4">
                  <Phone size={18} className="text-[#ff5000] mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#6f7685] mb-1">Phone</p>
                    <a
                      href="https://wa.me/919148974009"
                      className="text-[#16181f] font-semibold hover:text-[#ff5000] transition-colors"
                    >
                      +91 91489 74009
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-[rgba(22,24,31,0.06)] bg-[#f7f8fb] p-4">
                  <Mail size={18} className="text-[#ff5000] mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#6f7685] mb-1">Email</p>
                    <a
                      href="mailto:gameonfitness88@gmail.com"
                      className="text-[#16181f] font-semibold hover:text-[#ff5000] transition-colors"
                    >
                      gameonfitness88@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-[rgba(22,24,31,0.06)] bg-[#f7f8fb] p-4">
                  <Clock size={18} className="text-[#ff5000] mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#6f7685] mb-1">
                      Business Hours
                    </p>
                    <p className="text-[#16181f] text-sm">Mon – Sat · 5:00 AM – 11:00 PM</p>
                    <p className="text-[#16181f] text-sm">Sunday · 6:00 AM – 10:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-[1.75rem] border border-[rgba(22,24,31,0.06)] bg-[#f7f8fb] p-8 md:p-10">
                {status === 'success' ? (
                  <div className="overflow-hidden rounded-2xl -m-4 sm:-m-6">
                    <CelebrationSuccessScreen
                      isFullPage={false}
                      headline="Inquiry Confirmed!"
                      subheadline="Your message has been received with highest priority. Our elite coaching staff will reach out to you shortly."
                      passCode={`GO-INQ-${Math.floor(1000 + Math.random() * 9000)}`}
                      badgeText="Priority Request • Verified & Logged"
                      details={[
                        { label: 'Athlete Name', value: form.name || 'Game On Athlete' },
                        { label: 'Fitness Goal', value: form.goal || 'General Fitness' },
                        { label: 'Contact Number', value: form.phone || '+91' },
                        { label: 'Response Priority', value: 'Within 2 Working Hours' },
                      ]}
                      primaryAction={{
                        label: 'Explore All Clubs',
                        href: '/locations',
                      }}
                      secondaryAction={{
                        label: 'Send Another Message',
                        onClick: () => {
                          setStatus('idle');
                          setForm({ name: '', phone: '', goal: '' });
                        },
                      }}
                    />
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#16181f] mb-1">
                        Send us a message
                      </h3>
                    </div>

                    <div>
                      <label
                        htmlFor="contact-name"
                        className="block text-xs font-medium text-[#6f7685] uppercase tracking-wider mb-2"
                      >
                        Name *
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="input-premium w-full rounded-xl px-4 py-3 text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-phone"
                        className="block text-xs font-medium text-[#6f7685] uppercase tracking-wider mb-2"
                      >
                        Phone *
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 98765 43210"
                        className="input-premium w-full rounded-xl px-4 py-3 text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="contact-goal"
                        className="block text-xs font-medium text-[#6f7685] uppercase tracking-wider mb-2"
                      >
                        Goal *
                      </label>
                      <select
                        id="contact-goal"
                        name="goal"
                        value={form.goal}
                        onChange={handleChange}
                        required
                        className="input-premium w-full rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer"
                      >
                        <option value="">Select your fitness goal</option>
                        {goals.map((goal) => (
                          <option key={goal} value={goal}>
                            {goal}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-premium-primary w-full font-semibold py-4 rounded-xl text-sm tracking-wide flex items-center justify-center gap-3 disabled:opacity-70"
                    >
                      {status === 'loading' ? (
                        <>
                          <Loader size={16} className="animate-spin" />
                          Sending...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send size={14} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 atmosphere">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <p className="text-[#6f7685] text-lg leading-relaxed mb-6">
            Remember why you came here. Not to find a gym — to become stronger. More confident.
            More disciplined. More resilient.
          </p>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] mb-4">
            Today is Day One.
          </h2>
          <p className="font-display italic text-[#ff5000] text-xl md:text-2xl mb-10">
            Everything else can wait.
          </p>
          <Link
            to="/"
            className="btn-premium-primary inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold"
          >
            Find Your Game On
          </Link>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
