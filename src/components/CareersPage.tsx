import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import Navbar from './Navbar';
import Footer from './Footer';
import BackToTop from './BackToTop';
import PageHero from './PageHero';

const values = [
  { title: 'Respect.', text: 'Everyone deserves encouragement.' },
  { title: 'Ownership.', text: "Treat every member's journey like it's your own." },
  { title: 'Excellence.', text: 'Small improvements create extraordinary results.' },
  { title: 'Teamwork.', text: 'Great things happen when people grow together.' },
  { title: 'Integrity.', text: 'Do the right thing, even when nobody is watching.' },
];

const openRoles = [
  {
    title: 'Personal Trainer',
    text: 'Coach members one-on-one, build personalized programs, and guide real transformations on the floor.',
  },
  {
    title: 'General Trainer',
    text: 'Support everyday training sessions, help members with form, and keep the gym floor energised and safe.',
  },
  {
    title: 'Member Coordinator',
    text: 'Welcome members, manage enquiries and tours, and create a smooth, friendly experience from day one.',
  },
];

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-[#f7f8fb]">
      <Navbar />

      <PageHero
        eyebrow="Careers"
        title={
          <>
            Build people.
            <br />
            <span className="italic text-[#e07a72]">Including yourself.</span>
          </>
        }
        description="The strongest teams build the strongest communities. At Game On Fitness, your impact goes far beyond the gym floor."
        image="https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=1600&h=1000&fit=crop"
        imagePosition="center center"
        actions={
          <a
            href="#open-roles"
            className="btn-premium-primary inline-flex items-center justify-center gap-2 text-sm font-semibold px-8 py-4 rounded-full"
          >
            Explore Opportunities
            <ArrowRight size={16} />
          </a>
        }
      />

      <section className="py-24 atmosphere">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
              Why Game On?
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            We&apos;re building places where confidence grows.
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed">
            Discipline is shaped, and lives are transformed. That journey starts with the people
            who wear the Game On name.
          </p>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
              Who We&apos;re Looking For
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-[#16181f] text-center mb-10">
            Not just experience. <span className="italic text-[#e07a72]">Character.</span>
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-left">
            {[
              'People who lead with positivity',
              'Who inspire through action',
              'Who care about others',
              'Who believe progress is earned',
              'Who show up every day ready to make a difference',
            ].map((line) => (
              <div
                key={line}
                className="rounded-2xl border border-[rgba(22,24,31,0.06)] bg-[#f7f8fb] px-5 py-4 text-[#3a3f4b] text-sm md:text-base"
              >
                {line}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 atmosphere">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
              Life at Game On
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            Every day is <span className="italic text-[#e07a72]">different.</span>
          </h2>
          <div className="space-y-3 mb-8 max-w-2xl mx-auto text-left sm:text-center">
            {[
              'A member reaches a milestone.',
              'A beginner completes their first workout.',
              'A team celebrates a victory.',
              "A coach changes someone's mindset.",
            ].map((line) => (
              <p key={line} className="text-[#6f7685] text-lg leading-relaxed">
                {line}
              </p>
            ))}
          </div>
          <p className="text-[#3a3f4b] text-lg font-medium leading-relaxed max-w-xl mx-auto">
            These aren&apos;t just moments. They&apos;re reasons we love what we do.
          </p>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <div className="section-ornament justify-center mb-5">
            <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
              Grow With Us
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] leading-tight mb-6">
            We invest in people who invest in{' '}
            <span className="italic text-[#e07a72]">themselves.</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {['Learn', 'Lead', 'Take responsibility', 'Build your career'].map((word) => (
              <span
                key={word}
                className="px-5 py-2.5 rounded-full bg-[#f7f8fb] border border-[rgba(22,24,31,0.06)] font-display font-semibold text-[#16181f]"
              >
                {word}
              </span>
            ))}
          </div>
          <p className="text-[#6f7685] text-lg leading-relaxed max-w-2xl mx-auto">
            Grow alongside a team that believes success is shared.
          </p>
        </div>
      </section>

      <section className="py-24 atmosphere">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-ornament justify-center mb-5">
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
                Our Values
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f]">
              What we stand for
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-[1.75rem] border border-[rgba(22,24,31,0.06)] bg-white p-7"
              >
                <h3 className="font-display text-xl font-bold text-[#e07a72] mb-2">{v.title}</h3>
                <p className="text-[#6f7685] leading-relaxed">{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="open-roles" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="section-ornament justify-center mb-5">
              <span className="text-xs font-semibold tracking-[0.35em] uppercase text-[#e07a72]">
                Open Roles
              </span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] mb-4">
              Opportunities to <span className="italic text-[#e07a72]">grow with us.</span>
            </h2>
            <p className="text-[#6f7685] text-lg max-w-2xl mx-auto leading-relaxed">
              Whether you&apos;re coaching on the gym floor or supporting members behind the
              scenes, every role plays a part in building something bigger.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {openRoles.map((role) => (
              <div
                key={role.title}
                className="rounded-[1.75rem] border border-[rgba(22,24,31,0.06)] bg-[#f7f8fb] p-7 flex flex-col"
              >
                <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#e07a72] mb-3">
                  Now hiring
                </p>
                <h3 className="font-display text-2xl font-bold text-[#16181f] mb-3">
                  {role.title}
                </h3>
                <p className="text-[#6f7685] leading-relaxed text-sm mb-6 flex-1">{role.text}</p>
                <a
                  href={`https://wa.me/919148974009?text=${encodeURIComponent(
                    `Hi Game On Fitness, I'd like to apply for the ${role.title} role.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#e07a72] hover:gap-3 transition-all"
                >
                  Apply for this role
                  <ArrowRight size={15} />
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 atmosphere">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="font-display text-3xl md:text-5xl font-bold text-[#16181f] mb-5">
            The future is built by people who show up.
          </h2>
          <p className="text-[#6f7685] text-lg leading-relaxed mb-4">
            Every member starts with Day One. So does every great career.
          </p>
          <p className="text-[#6f7685] mb-10">
            Don&apos;t see the right role? Great people don&apos;t always fit into predefined job
            descriptions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a
              href="mailto:hello@gameonfitness.in?subject=Resume%20-%20Game%20On%20Fitness"
              className="btn-premium-primary inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold"
            >
              Send Your Resume
              <ArrowRight size={16} />
            </a>
            <Link
              to="/contact"
              className="btn-premium-secondary inline-flex items-center gap-2 px-8 py-4 rounded-full text-sm font-semibold"
            >
              Apply Now
            </Link>
          </div>
          <p className="mt-12 text-[#9aa0ab] text-xs font-medium tracking-[0.2em] uppercase">
            Don&apos;t just build a career. Build a legacy.
          </p>
        </div>
      </section>

      <Footer />
      <BackToTop />
    </div>
  );
}
