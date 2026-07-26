import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Trash2 } from 'lucide-react';

type Section = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  closing?: string;
};

const sections: Section[] = [
  {
    id: 'overview',
    title: 'Overview',
    paragraphs: [
      'This Account Deletion Policy explains how users of the Game On Fitness mobile application can request deletion of their account and associated personal data, and what happens after a request is completed.',
    ],
  },
  {
    id: 'who-can-request',
    title: 'Who Can Request Deletion',
    paragraphs: [
      'Any user who has registered an account in the Game On Fitness app using their name, email address, and/or mobile number may request account deletion at any time.',
    ],
  },
  {
    id: 'how-to-delete',
    title: 'How to Request Account Deletion',
    paragraphs: [
      'You can request deletion of your Game On Fitness account using any of the methods below:',
    ],
    bullets: [
      'In the App: Open Game On Fitness → Profile / Settings → Delete Account (or Account Deletion) and follow the on-screen steps.',
      'By Email: Send a deletion request to hello@gameonfitness.in from the email address linked to your account. Use the subject line “Account Deletion Request”.',
      'By Phone / WhatsApp: Contact us at +91 91489 74009 and clearly request account deletion.',
      'Through this Website: Visit the Contact page and submit a message selecting Careers/Something else and stating that you want your account deleted.',
    ],
    closing:
      'To verify your request, we may ask you to confirm your registered mobile number, email address, or membership details.',
  },
  {
    id: 'what-we-delete',
    title: 'What Data Is Deleted',
    paragraphs: [
      'When your account deletion request is completed, we delete or anonymize personal data associated with your app account, including:',
    ],
    bullets: [
      'Account profile details (name, email, mobile number)',
      'Login credentials and authentication data',
      'Optional profile information (date of birth, gender, height, weight, fitness goals, emergency contact, profile photo)',
      'App preferences and in-app activity linked to your account',
      'Membership preference and related profile records stored in the app account',
    ],
  },
  {
    id: 'what-we-retain',
    title: 'What Data May Be Retained',
    paragraphs: [
      'Some information may be retained for a limited period where required for legal, security, accounting, fraud prevention, or regulatory purposes. This may include:',
    ],
    bullets: [
      'Transaction or payment records required under applicable law',
      'Records needed to resolve disputes, prevent fraud, or enforce our terms',
      'Information we are legally required to keep for tax, audit, or compliance reasons',
    ],
    closing:
      'Retained data is stored securely and is not used for marketing. Where possible, retained records are minimized or anonymized.',
  },
  {
    id: 'timeline',
    title: 'Deletion Timeline',
    paragraphs: [
      'We aim to process account deletion requests within 7 business days after identity verification.',
      'In some cases, complete removal from backup systems may take up to 30 days. After that period, your personal account data will no longer be recoverable.',
    ],
  },
  {
    id: 'membership-note',
    title: 'Active Memberships & Bookings',
    paragraphs: [
      'Deleting your app account does not automatically cancel an active gym membership, pending payments, or branch-level membership contracts unless you specifically request that as well.',
      'If you also want membership cancellation or refund-related help, please mention this clearly in your deletion request so our team can guide you.',
    ],
  },
  {
    id: 'after-deletion',
    title: 'After Your Account Is Deleted',
    bullets: [
      'You will lose access to the Game On Fitness app account and related profile data.',
      'You will no longer receive account notifications linked to that profile.',
      'If you wish to use the app again later, you will need to create a new account.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    paragraphs: [
      'For account deletion requests or questions about this policy, contact Game On Fitness:',
    ],
    bullets: [
      'Email: hello@gameonfitness.in',
      'Phone / WhatsApp: +91 91489 74009',
      'Support Hours: Monday–Saturday 6:00 AM – 10:00 PM; Sunday 7:00 AM – 8:00 PM',
    ],
    closing: 'We will confirm when your deletion request has been received and completed.',
  },
];

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5 pt-1">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[#6f7685] text-[15px] md:text-base leading-relaxed">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#e07a72] shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function AccountDeletionPolicy() {
  const [visible, setVisible] = useState(false);
  const [activeId, setActiveId] = useState(sections[0].id);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((n): n is HTMLElement => Boolean(n));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleEntries[0]?.target?.id) {
          setActiveId(visibleEntries[0].target.id);
        }
      },
      { rootMargin: '-20% 0px -55% 0px', threshold: [0.1, 0.35, 0.6] }
    );

    nodes.forEach((n) => observer.observe(n));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    setActiveId(id);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-[#f7f8fb]">
      <div
        className="pointer-events-none absolute -top-32 -left-24 w-[520px] h-[520px] rounded-full opacity-70"
        style={{
          background: 'radial-gradient(circle, rgba(224,122,114,0.16) 0%, transparent 68%)',
        }}
      />
      <div
        className="pointer-events-none absolute top-40 -right-28 w-[480px] h-[480px] rounded-full opacity-80"
        style={{
          background: 'radial-gradient(circle, rgba(228,236,246,0.95) 0%, transparent 70%)',
        }}
      />

      <header className="relative border-b border-[rgba(22,24,31,0.06)] bg-white/55 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2.5 group">
            <img
              src="/logo.png"
              alt="Game On Fitness"
              className="w-9 h-9 rounded-xl transition-transform duration-300 group-hover:scale-105"
            />
            <span className="font-display text-lg font-semibold tracking-tight text-[#16181f]">
              Game On <span className="italic text-[#e07a72]">Fitness</span>
            </span>
          </Link>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-[#6f7685] hover:text-[#16181f] transition-colors duration-300"
          >
            <ArrowLeft size={15} />
            Home
          </Link>
        </div>
      </header>

      <div
        className={`relative max-w-6xl mx-auto px-6 pt-12 md:pt-16 pb-8 transition-all duration-700 ${
          visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#f6e4e1]/80 border border-[rgba(224,122,114,0.2)] mb-6">
          <Trash2 size={14} className="text-[#e07a72]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c45f58]">
            Account Deletion
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-[#16181f] leading-[1.05] max-w-3xl">
          Account <span className="italic text-[#e07a72]">Deletion Policy</span>
        </h1>
        <p className="mt-5 text-[#6f7685] text-base md:text-lg leading-relaxed max-w-2xl">
          How to request deletion of your Game On Fitness app account and what happens to your
          data.
        </p>
        <p className="mt-3 text-sm text-[#9aa0ab]">Last updated: July 26, 2026</p>
      </div>

      <div className="relative max-w-6xl mx-auto px-6 pb-20 md:pb-28">
        <div className="grid lg:grid-cols-[240px_minmax(0,1fr)] gap-10 lg:gap-14">
          <aside className="hidden lg:block">
            <nav className="sticky top-8">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[#9aa0ab] mb-4">
                On this page
              </p>
              <ul className="space-y-1 max-h-[70vh] overflow-y-auto pr-2">
                {sections.map((section, index) => {
                  const active = activeId === section.id;
                  return (
                    <li key={section.id}>
                      <button
                        type="button"
                        onClick={() => scrollToSection(section.id)}
                        className={`w-full text-left flex items-start gap-3 rounded-xl px-3 py-2 transition-all duration-300 ${
                          active
                            ? 'bg-white text-[#16181f] shadow-[0_10px_30px_rgba(22,24,31,0.06)]'
                            : 'text-[#6f7685] hover:text-[#16181f] hover:bg-white/60'
                        }`}
                      >
                        <span
                          className={`mt-0.5 text-[11px] font-semibold tabular-nums ${
                            active ? 'text-[#e07a72]' : 'text-[#c5c9d1]'
                          }`}
                        >
                          {String(index + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[13px] leading-snug">{section.title}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </aside>

          <article
            className={`transition-all duration-700 delay-150 ${
              visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
            }`}
          >
            <div className="lg:hidden mb-8 -mx-6 px-6 overflow-x-auto">
              <div className="flex gap-2 pb-2 min-w-max">
                {sections.map((section) => (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => scrollToSection(section.id)}
                    className={`shrink-0 px-3.5 py-2 rounded-full text-xs font-medium border transition-all duration-300 ${
                      activeId === section.id
                        ? 'bg-[#16181f] text-white border-[#16181f]'
                        : 'bg-white/70 text-[#6f7685] border-[rgba(22,24,31,0.08)]'
                    }`}
                  >
                    {section.title}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-10">
              {sections.map((section, index) => (
                <section
                  key={section.id}
                  id={section.id}
                  className="scroll-mt-10 rounded-[1.75rem] border border-[rgba(22,24,31,0.06)] bg-white/80 backdrop-blur-sm p-7 md:p-9 shadow-[0_18px_50px_rgba(22,24,31,0.04)]"
                >
                  <div className="flex items-start gap-4 mb-5">
                    <span className="font-display text-2xl md:text-3xl font-bold text-[#e07a72]/35 leading-none tabular-nums">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <h2 className="font-display text-2xl md:text-[1.75rem] font-bold text-[#16181f] tracking-tight leading-tight pt-0.5">
                      {section.title}
                    </h2>
                  </div>

                  <div className="space-y-4 pl-0 md:pl-12">
                    {section.paragraphs?.map((p) => (
                      <p key={p} className="text-[#6f7685] text-[15px] md:text-base leading-relaxed">
                        {p}
                      </p>
                    ))}

                    {section.bullets && <BulletList items={section.bullets} />}

                    {section.closing && (
                      <p className="text-[#6f7685] text-[15px] md:text-base leading-relaxed pt-1">
                        {section.closing}
                      </p>
                    )}
                  </div>
                </section>
              ))}
            </div>

            <div className="mt-10 rounded-[1.75rem] bg-[#16181f] text-white p-7 md:p-9 relative overflow-hidden">
              <div
                className="absolute -top-16 right-0 w-64 h-64 pointer-events-none"
                style={{
                  background: 'radial-gradient(circle, rgba(224,122,114,0.35) 0%, transparent 70%)',
                }}
              />
              <p className="relative font-display italic text-[#f2b4ae] text-lg mb-3">
                Request deletion
              </p>
              <p className="relative text-white/70 text-[15px] md:text-base leading-relaxed max-w-2xl">
                Ready to delete your Game On Fitness app account? Email us or message support
                and we will process your request after verification.
              </p>
              <div className="relative mt-6 flex flex-wrap gap-3">
                <a
                  href="mailto:hello@gameonfitness.in?subject=Account%20Deletion%20Request"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#e07a72] to-[#c45f58] text-sm font-semibold text-white hover:-translate-y-0.5 transition-all duration-300"
                >
                  Email deletion request
                  <ArrowUpRight size={15} />
                </a>
                <a
                  href="https://wa.me/919148974009?text=I%20want%20to%20delete%20my%20Game%20On%20Fitness%20app%20account"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/25 text-sm font-semibold text-white hover:bg-white/10 transition-all duration-300"
                >
                  WhatsApp support
                </a>
              </div>
            </div>

            <p className="mt-8 text-sm text-[#9aa0ab]">
              Related:{' '}
              <Link to="/privacy" className="text-[#e07a72] font-medium hover:underline">
                Privacy Policy
              </Link>
            </p>
          </article>
        </div>
      </div>

      <footer className="relative border-t border-[rgba(22,24,31,0.08)] bg-white/70">
        <div className="max-w-6xl mx-auto px-6 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-[#9aa0ab]">
            © {new Date().getFullYear()} Game On Fitness. All rights reserved.
          </p>
          <p className="text-xs text-[#c5c9d1] font-display italic">
            Stronger than yesterday.
          </p>
        </div>
      </footer>
    </div>
  );
}
