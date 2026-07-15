import { useState } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';
import { Send, Phone, Mail, MapPin, Instagram, Twitter, Youtube, Facebook, CheckCircle, Loader } from 'lucide-react';

const socials = [
  { Icon: Instagram, label: 'Instagram', handle: '@gameonfitness', color: '#E1306C' },
  { Icon: Twitter, label: 'Twitter', handle: '@gameonfitness_gyms', color: '#1DA1F2' },
  { Icon: Youtube, label: 'YouTube', handle: 'GAME ON FITNESS Performance', color: '#FF0000' },
  { Icon: Facebook, label: 'Facebook', handle: 'GAME ON FITNESS Centers', color: '#1877F2' },
];

const contactInfo = [
  { Icon: Phone, label: 'Call Us', value: '+1 (800) GAME-ON-FIT', sub: 'Available 24/7' },
  { Icon: Mail, label: 'Email Us', value: 'hello@gameonfitness.com', sub: 'Response within 2 hours' },
  { Icon: MapPin, label: 'HQ', value: '450 Fifth Ave, NY', sub: 'New York, NY 10018' },
];

const goals = ['Lose Weight', 'Build Muscle', 'Improve Performance', 'Sport-Specific Training', 'General Fitness', 'Rehabilitation'];

type Status = 'idle' | 'loading' | 'success';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', goal: '', message: '' });
  const [status, setStatus] = useState<Status>('idle');
  const { ref: headRef, isVisible: headVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: leftRef, isVisible: leftVisible } = useIntersectionObserver<HTMLDivElement>();
  const { ref: rightRef, isVisible: rightVisible } = useIntersectionObserver<HTMLDivElement>();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    await new Promise(r => setTimeout(r, 1800));
    setStatus('success');
    setTimeout(() => {
      setStatus('idle');
      setForm({ name: '', email: '', phone: '', goal: '', message: '' });
    }, 4000);
  };

  return (
    <section id="contact" className="relative py-32 overflow-hidden" style={{ background: '#060606' }}>
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute bottom-0 left-1/4 w-[600px] h-[400px] rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(0,212,255,0.4) 0%, transparent 70%)',
            filter: 'blur(100px)',
          }}
        />
        <div
          className="absolute top-1/4 right-0 w-[400px] h-[400px] rounded-full opacity-8"
          style={{
            background: 'radial-gradient(circle, rgba(245,200,66,0.3) 0%, transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div ref={headRef} className="text-center mb-20">
          <div className={`reveal ${headVisible ? 'visible' : ''}`}>
            <span className="text-xs font-semibold tracking-[0.4em] uppercase text-[#e07a72] mb-4 block">Begin Today</span>
            <h2 className="text-4xl md:text-7xl font-black tracking-tight leading-none mb-6">
              <span className="text-[#16181f]">START YOUR</span>
              <br />
              <span className="gradient-text-blue">TRANSFORMATION.</span>
            </h2>
            <div className="divider-glow max-w-xs mx-auto" />
          </div>
        </div>

        <div className="grid lg:grid-cols-5 gap-12 items-start">
          {/* Left — Info */}
          <div ref={leftRef} className={`lg:col-span-2 reveal-left ${leftVisible ? 'visible' : ''}`}>
            <h3 className="text-2xl font-bold text-[#16181f] mb-3">Let's Talk.</h3>
            <p className="text-[#6f7685] leading-relaxed mb-10 text-sm">
              Whether you're ready to join, want a tour, or just have questions — our team is here to help
              you take the first step.
            </p>

            {/* Contact info cards */}
            <div className="space-y-4 mb-10">
              {contactInfo.map(({ Icon, label, value, sub }, i) => (
                <div
                  key={i}
                  className="flex items-center gap-4 bg-white border border-[rgba(18,20,26,0.06)] rounded-xl p-4 card-hover"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#e07a72]/10 border border-[#e07a72]/20 flex items-center justify-center flex-shrink-0">
                    <Icon size={18} className="text-[#e07a72]" />
                  </div>
                  <div>
                    <p className="text-xs text-[#6f7685] uppercase tracking-wider">{label}</p>
                    <p className="text-sm font-semibold text-[#16181f]">{value}</p>
                    <p className="text-xs text-[#9aa0ab]">{sub}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Social links */}
            <div>
              <p className="text-xs text-[#6f7685] uppercase tracking-widest mb-4">Follow Us</p>
              <div className="grid grid-cols-2 gap-3">
                {socials.map(({ Icon, label, handle, color }, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 bg-white border border-[rgba(18,20,26,0.06)] rounded-xl p-3 cursor-pointer group card-hover"
                  >
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300"
                      style={{
                        background: `${color}15`,
                        border: `1px solid ${color}30`,
                      }}
                    >
                      <Icon size={14} style={{ color }} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-[#3a3f4b] group-hover:text-[#16181f] transition-colors">{label}</p>
                      <p className="text-xs text-[#9aa0ab]">{handle}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div ref={rightRef} className={`lg:col-span-3 reveal-right ${rightVisible ? 'visible' : ''}`}>
            <div className="bg-white border border-[rgba(18,20,26,0.06)]-card rounded-3xl p-8 md:p-10 relative overflow-hidden">
              {/* Corner glow */}
              <div
                className="absolute -top-20 -right-20 w-40 h-40 rounded-full pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(0,212,255,0.15) 0%, transparent 70%)',
                  filter: 'blur(20px)',
                }}
              />

              {status === 'success' ? (
                <div className="text-center py-16">
                  <div className="w-16 h-16 rounded-full bg-[#e07a72]/10 border border-[#e07a72]/30 flex items-center justify-center mx-auto mb-6 animate-pulse-glow">
                    <CheckCircle size={28} className="text-[#e07a72]" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#16181f] mb-3">Message Received!</h3>
                  <p className="text-[#6f7685] text-sm">Our team will reach out within 2 hours to schedule your free assessment.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div>
                    <h3 className="text-xl font-bold text-[#16181f] mb-1">Free Performance Assessment</h3>
                    <p className="text-xs text-[#6f7685]">No commitment required. Just results-driven conversation.</p>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#6f7685] uppercase tracking-wider mb-2">Full Name *</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        placeholder="John Smith"
                        className="input-premium w-full rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#6f7685] uppercase tracking-wider mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        placeholder="john@example.com"
                        className="input-premium w-full rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-[#6f7685] uppercase tracking-wider mb-2">Phone</label>
                      <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 000-0000"
                        className="input-premium w-full rounded-xl px-4 py-3 text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#6f7685] uppercase tracking-wider mb-2">Primary Goal</label>
                      <select
                        name="goal"
                        value={form.goal}
                        onChange={handleChange}
                        className="input-premium w-full rounded-xl px-4 py-3 text-sm appearance-none cursor-pointer"
                        style={{ background: 'rgba(255,255,255,0.04)' }}
                      >
                        <option value="" className="bg-[#111]">Select a goal</option>
                        {goals.map(g => (
                          <option key={g} value={g} className="bg-[#111]">{g}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#6f7685] uppercase tracking-wider mb-2">Tell Us About Yourself</label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Share your current fitness level, goals, and any questions you have..."
                      className="input-premium w-full rounded-xl px-4 py-3 text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={status === 'loading'}
                    className="btn-glow-blue w-full text-black font-bold py-4 rounded-xl text-sm tracking-wider uppercase flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? (
                      <>
                        <Loader size={16} className="animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        Book Free Assessment
                        <Send size={14} />
                      </>
                    )}
                  </button>

                  <p className="text-center text-xs text-[#9aa0ab]">
                    By submitting, you agree to our Privacy Policy. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
