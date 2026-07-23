import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Shield } from 'lucide-react';

type Category = {
  heading: string;
  items: string[];
  note?: string;
};

type Section = {
  id: string;
  title: string;
  paragraphs?: string[];
  bullets?: string[];
  categories?: Category[];
  afterBullets?: string[];
  secondaryBullets?: string[];
  closing?: string;
};

const sections: Section[] = [
  {
    id: 'introduction',
    title: 'Introduction',
    paragraphs: [
      'Welcome to our website and mobile application. We respect your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, store, and safeguard your information when you use our services.',
      'By accessing or using our website or mobile application, you agree to the practices described in this Privacy Policy.',
    ],
  },
  {
    id: 'information-we-collect',
    title: 'Information We Collect',
    paragraphs: ['When you register or use our services, we may collect the following information:'],
    categories: [
      {
        heading: 'Personal Information',
        items: ['Full Name', 'Email Address', 'Mobile Number'],
      },
      {
        heading: 'Membership Information',
        items: ['Membership Details', 'Membership Status', 'Branch Preference', 'Membership History'],
      },
      {
        heading: 'Optional Profile Information',
        items: [
          'Date of Birth',
          'Gender',
          'Height',
          'Weight',
          'Fitness Goals',
          'Emergency Contact',
          'Profile Photo',
        ],
      },
      {
        heading: 'Technical Information',
        items: [
          'Device Information',
          'Browser Information',
          'Operating System',
          'IP Address',
          'Login Activity',
          'App Usage Information',
        ],
      },
      {
        heading: 'Location Information',
        items: [],
        note: 'With your permission, we may collect your device location to provide nearby branch information and location-based services.',
      },
    ],
  },
  {
    id: 'how-we-use',
    title: 'How We Use Your Information',
    paragraphs: ['We use your information to:'],
    bullets: [
      'Create and manage your account.',
      'Verify your identity.',
      'Provide secure login access.',
      'Manage memberships.',
      'Process payments.',
      'Enable bookings and other services.',
      'Send important account notifications.',
      'Respond to customer support requests.',
      'Improve our website and mobile application.',
      'Maintain security and prevent unauthorized access.',
      'Comply with applicable legal requirements.',
    ],
  },
  {
    id: 'login-information',
    title: 'Login Information',
    paragraphs: [
      'To access our website and mobile application, users are required to register using:',
    ],
    bullets: ['Full Name', 'Email Address', 'Mobile Number'],
    closing:
      'These details are used only for authentication, account management, communication, and providing our services.',
  },
  {
    id: 'communications',
    title: 'Communications',
    paragraphs: ['We may communicate with you through:'],
    bullets: ['Email', 'SMS', 'WhatsApp', 'Push Notifications', 'Phone Calls'],
    afterBullets: ['These communications may include:'],
    secondaryBullets: [
      'Login Verification',
      'Account Notifications',
      'Membership Updates',
      'Payment Confirmations',
      'Booking Confirmations',
      'Renewal Reminders',
      'Service Announcements',
      'Promotional Offers (where permitted)',
    ],
    closing: 'You may opt out of promotional communications at any time.',
  },
  {
    id: 'sharing',
    title: 'Sharing of Information',
    paragraphs: [
      'We do not sell, rent, or trade your personal information.',
      'Your information may be shared only with trusted service providers that help us operate our website, mobile application, payment processing, communication services, or where required by applicable law.',
    ],
  },
  {
    id: 'data-security',
    title: 'Data Security',
    paragraphs: [
      'We use appropriate technical and organizational security measures to protect your information, including:',
    ],
    bullets: [
      'Secure encrypted connections',
      'Protected databases',
      'Restricted system access',
      'Security monitoring',
      'Regular security updates',
    ],
    closing:
      'Although we take reasonable precautions, no method of electronic storage or internet transmission can be guaranteed to be completely secure.',
  },
  {
    id: 'data-retention',
    title: 'Data Retention',
    paragraphs: [
      'Your information is retained only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our policies.',
    ],
  },
  {
    id: 'cookies',
    title: 'Cookies',
    paragraphs: ['Our website may use cookies and similar technologies to:'],
    bullets: [
      'Keep users logged in.',
      'Remember user preferences.',
      'Improve website performance.',
      'Analyze website usage.',
    ],
    closing:
      'You may disable cookies through your browser settings; however, certain features may not function properly.',
  },
  {
    id: 'third-party',
    title: 'Third-Party Services',
    paragraphs: [
      'Our website or mobile application may integrate with trusted third-party services for payment processing, analytics, authentication, notifications, communication, or other essential functionality.',
      'These third-party services operate under their own privacy policies.',
    ],
  },
  {
    id: 'your-rights',
    title: 'Your Rights',
    paragraphs: ['Depending on applicable laws, you may have the right to:'],
    bullets: [
      'Access your personal information.',
      'Update your information.',
      'Correct inaccurate information.',
      'Request deletion of your account.',
      'Withdraw consent where applicable.',
      'Opt out of promotional communications.',
    ],
  },
  {
    id: 'childrens-privacy',
    title: "Children's Privacy",
    paragraphs: [
      'Our services are intended for users who are legally permitted to use them. If we become aware that personal information has been collected from a child without appropriate consent, we will take reasonable steps to remove such information.',
    ],
  },
  {
    id: 'account-deletion',
    title: 'Account Deletion',
    paragraphs: [
      'Users may request deletion of their account at any time.',
      'Upon verification, personal information will be deleted wherever legally permissible. Certain records may be retained where required to comply with applicable laws.',
    ],
  },
  {
    id: 'changes',
    title: 'Changes to This Privacy Policy',
    paragraphs: [
      'We may update this Privacy Policy from time to time. Any changes will be published on our website and mobile application. Continued use of our services after updates indicates your acceptance of the revised Privacy Policy.',
    ],
  },
  {
    id: 'contact',
    title: 'Contact Us',
    paragraphs: [
      'If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact our support team through the contact options available on our website or mobile application.',
    ],
  },
];

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-2 mt-3">
      {items.map((item) => (
        <span
          key={item}
          className="inline-flex items-center px-3 py-1.5 rounded-full text-[13px] text-[#16181f]/80 bg-[#f6e4e1]/70 border border-[rgba(224,122,114,0.18)]"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-[#6f7685] text-[15px] leading-relaxed">
          <span className="mt-2 w-1.5 h-1.5 rounded-full bg-[#e07a72] shrink-0" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function PrivacyPolicy() {
  const [activeId, setActiveId] = useState(sections[0].id);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    const t = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(t);
  }, []);

  useEffect(() => {
    const nodes = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (!nodes.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visibleEntries[0]?.target.id) {
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
          <Shield size={14} className="text-[#e07a72]" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[#c45f58]">
            Privacy
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight text-[#16181f] leading-[1.05] max-w-2xl">
          Privacy <span className="italic text-[#e07a72]">Policy</span>
        </h1>
        <p className="mt-5 text-[#6f7685] text-base md:text-lg leading-relaxed max-w-2xl">
          How Game On Fitness collects, uses, and protects your personal information across our
          website and mobile application.
        </p>
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

                    {section.afterBullets?.map((p) => (
                      <p key={p} className="text-[#6f7685] text-[15px] md:text-base leading-relaxed pt-2">
                        {p}
                      </p>
                    ))}

                    {section.secondaryBullets && <BulletList items={section.secondaryBullets} />}

                    {section.categories?.map((cat) => (
                      <div key={cat.heading} className="pt-2">
                        <h3 className="font-display text-base font-semibold text-[#16181f]">
                          {cat.heading}
                        </h3>
                        {cat.items.length > 0 && <TagList items={cat.items} />}
                        {cat.note && (
                          <p className="mt-3 text-[#6f7685] text-[15px] leading-relaxed">{cat.note}</p>
                        )}
                      </div>
                    ))}

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
              <p className="relative font-display italic text-[#f2b4ae] text-lg mb-3">Acknowledgement</p>
              <p className="relative text-white/70 text-[15px] md:text-base leading-relaxed max-w-2xl">
                By using our website or mobile application, you acknowledge that you have read,
                understood, and agreed to this Privacy Policy.
              </p>
              <a
                href="https://wa.me/919148974009"
                target="_blank"
                rel="noopener noreferrer"
                className="relative mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full bg-gradient-to-r from-[#e07a72] to-[#c45f58] text-sm font-semibold text-white hover:-translate-y-0.5 transition-all duration-300"
              >
                Contact support
                <ArrowUpRight size={15} />
              </a>
            </div>
          </article>
        </div>
      </div>

      <footer className="relative border-t border-[rgba(22,24,31,0.08)] bg-white/70">
        <div className="max-w-6xl mx-auto px-6 py-7 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <p className="text-xs text-[#9aa0ab]">
            © {new Date().getFullYear()} Game On Fitness. All rights reserved.
          </p>
          <p className="text-xs text-[#c5c9d1] font-display italic">Move beautifully.</p>
        </div>
      </footer>
    </div>
  );
}
