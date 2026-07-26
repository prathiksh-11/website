import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Phone,
  Mail,
  Clock,
  CheckCircle,
  Loader,
  MapPin,
  MessageCircle,
  Smartphone,
} from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';

type Status = 'idle' | 'loading' | 'success';

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
    email: '',
    phone: '',
    help: '',
    message: '',
  });
  const [status, setStatus] = useState<Status>('idle');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 1400));
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setForm({ name: '', email: '', phone: '', help: '', message: '' });
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
    <div className="min-h-screen bg-[#f7f8fb]">
      <Navbar />

      <section className="relative pt-36 pb-16 overflow-hidden atmosphere">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
              Start Your Journey
            </span>
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[#16181f] mb-5">
            The hardest step
            <br />
            <span className="italic text-[#e07a72]">is the first one.</span>
          </h1>
          <p className="text-[#6f7685] text-lg max-w-xl mx-auto leading-relaxed">
            You&apos;re already here. That means you&apos;ve taken it. Now let&apos;s take the
            next step together.
          </p>
        </div>
      </section>

      <section className="pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-center text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72] mb-10">
            Choose how you&apos;d like to begin
          </p>
          <div className="grid sm:grid-cols-2 gap-4 md:gap-5">
            {startOptions.map((opt) => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.title}
                  onClick={() => handleOption(opt.action)}
                  className="group text-left rounded-[1.75rem] border border-[rgba(22,24,31,0.06)] bg-white p-7 hover:border-[#e07a72]/30 hover:shadow-[0_20px_50px_rgba(22,24,31,0.08)] transition-all duration-400 hover:-translate-y-1"
                >
                  <div className="w-11 h-11 rounded-xl bg-[#f6e4e1] text-[#e07a72] flex items-center justify-center mb-5 group-hover:scale-105 transition-transform">
                    <Icon size={20} />
                  </div>
                  <h3 className="font-display text-xl font-bold text-[#16181f] mb-2">
                    {opt.title}
                  </h3>
                  <p className="text-[#6f7685] text-sm leading-relaxed mb-5">{opt.text}</p>
                  <span className="text-sm font-semibold text-[#e07a72]">{opt.cta} →</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="py-20 md:py-28 bg-white">
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
                  <Phone size={18} className="text-[#e07a72] mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#6f7685] mb-1">Phone</p>
                    <a
                      href="https://wa.me/919148974009"
                      className="text-[#16181f] font-semibold hover:text-[#e07a72] transition-colors"
                    >
                      +91 91489 74009
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-[rgba(22,24,31,0.06)] bg-[#f7f8fb] p-4">
                  <Mail size={18} className="text-[#e07a72] mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#6f7685] mb-1">Email</p>
                    <a
                      href="mailto:hello@gameonfitness.in"
                      className="text-[#16181f] font-semibold hover:text-[#e07a72] transition-colors"
                    >
                      hello@gameonfitness.in
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-4 rounded-2xl border border-[rgba(22,24,31,0.06)] bg-[#f7f8fb] p-4">
                  <Clock size={18} className="text-[#e07a72] mt-0.5" />
                  <div>
                    <p className="text-xs uppercase tracking-wider text-[#6f7685] mb-1">
                      Support Hours
                    </p>
                    <p className="text-[#16181f] text-sm">Mon – Sat · 6:00 AM – 10:00 PM</p>
                    <p className="text-[#16181f] text-sm">Sunday · 7:00 AM – 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:col-span-3">
              <div className="rounded-[1.75rem] border border-[rgba(22,24,31,0.06)] bg-[#f7f8fb] p-8 md:p-10">
                {status === 'success' ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 rounded-full bg-[#f6e4e1] flex items-center justify-center mx-auto mb-6">
                      <CheckCircle size={28} className="text-[#e07a72]" />
                    </div>
                    <h3 className="text-2xl font-bold text-[#16181f] mb-3">Message received!</h3>
                    <p className="text-[#6f7685] text-sm">Our team will get back to you soon.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <h3 className="font-display text-xl font-bold text-[#16181f] mb-1">
                        Send us a message
                      </h3>
                      <p className="text-xs text-[#6f7685]">
                        Tell us how we can help you begin.
                      </p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#6f7685] uppercase tracking-wider mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Your name"
                          className="input-premium w-full rounded-xl px-4 py-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#6f7685] uppercase tracking-wider mb-2">
                          Mobile Number *
                        </label>
                        <input
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          required
                          placeholder="+91"
                          className="input-premium w-full rounded-xl px-4 py-3 text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-[#6f7685] uppercase tracking-wider mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="you@email.com"
                          className="input-premium w-full rounded-xl px-4 py-3 text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-[#6f7685] uppercase tracking-wider mb-2">
                          How can we help you?
                        </label>
                        <select
                          name="help"
                          value={form.help}
                          onChange={handleChange}
                          className="input-premium w-full rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer"
                        >
                          <option value="">Select an option</option>
                          <option value="join">Ready to join</option>
                          <option value="branch">Choosing a branch</option>
                          <option value="tour">Book a tour</option>
                          <option value="career">Careers</option>
                          <option value="other">Something else</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-[#6f7685] uppercase tracking-wider mb-2">
                        Message
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Share a little about your goals..."
                        className="input-premium w-full rounded-xl px-4 py-3 text-sm resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="btn-premium-primary w-full font-semibold py-4 rounded-xl text-sm tracking-wider uppercase flex items-center justify-center gap-3 disabled:opacity-70"
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
          <p className="font-display italic text-[#e07a72] text-xl md:text-2xl mb-10">
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
