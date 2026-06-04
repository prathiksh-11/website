import { useEffect } from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';

function Maintenance() {
  useEffect(() => {
    document.title = 'Under Maintenance | Gym Web';
  }, []);

  return (
    <div className="min-h-screen bg-[#020207] text-white overflow-hidden px-6 py-10 sm:px-10">
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-[#ff005c]/40 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-96 w-96 rounded-full bg-[#4f46e5]/30 blur-3xl" />
        <div className="absolute left-1/2 bottom-10 h-80 w-80 rounded-full bg-[#14b8a6]/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 items-center text-center">
        <span className="inline-flex items-center gap-2 rounded-full border border-[#ffffff33] bg-white/5 px-4 py-2 text-sm uppercase tracking-[0.35em] text-[#f8fafc] shadow-lg shadow-[#0f172a]/30 backdrop-blur">
          <AlertTriangle size={18} className="text-[#fb7185]" />
          Site Under Maintenance
        </span>

        <div className="max-w-3xl">
          <h1 className="text-5xl font-black tracking-tight text-white sm:text-6xl">
            We&apos;re powering up your fit experience.
          </h1>
          <p className="mt-6 text-lg text-[#cbd5e1] sm:text-xl">
            The gym website is currently getting a fresh upgrade. We&apos;ll be back soon with a stronger, faster, and more powerful experience.
          </p>
        </div>

        <div className="grid gap-6 rounded-[2rem] border border-white/10 bg-white/5 p-8 shadow-[0_30px_90px_-50px_rgba(15,23,42,0.9)] backdrop-blur-xl sm:grid-cols-[1.3fr_0.9fr]">
          <div className="space-y-4 text-left">
            <div className="inline-flex items-center gap-3 rounded-full bg-[#ffffff0f] px-4 py-3 text-sm text-[#e2e8f0] shadow-sm">
              <Sparkles size={18} className="text-[#38bdf8]" />
              Fresh updates are in progress — thanks for your patience.
            </div>
            <div className="space-y-3">
              <p className="text-sm uppercase tracking-[0.3em] text-[#94a3b8]">Expected return</p>
              <p className="text-3xl font-semibold text-white">Within the next 24 hours</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-3xl bg-[#0f172a]/80 p-5 text-left">
                <p className="text-sm uppercase tracking-[0.2em] text-[#94a3b8]">Need help?</p>
                <p className="mt-3 text-base text-[#cbd5e1]">Reach out if you have a question or want a membership update.</p>
              </div>
              <div className="rounded-3xl bg-[#111827]/90 p-5 text-left">
                <p className="text-sm uppercase tracking-[0.2em] text-[#94a3b8]">Stay in the loop</p>
                <p className="mt-3 text-base text-[#cbd5e1]">Follow us on WhatsApp or email for the latest on reopening.</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] bg-[#0b1121]/90 p-6 text-left shadow-[0_0_0_1px_rgba(255,255,255,0.04)]">
            <p className="text-sm uppercase tracking-[0.25em] text-[#94a3b8]">Contact</p>
            <p className="mt-5 text-base text-[#cbd5e1]">
              For updates or questions, drop a message through WhatsApp or use our support form once the site is live.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 justify-center sm:justify-start">
              <a
                href="https://wa.me/919148974009"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-[#0f172a]/40 transition hover:bg-white/10"
              >
                Message us on WhatsApp
              </a>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-3 text-sm text-[#94a3b8]">
          <span className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3">New trainer lineup</span>
          <span className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3">Improved schedules</span>
          <span className="rounded-3xl border border-white/10 bg-white/5 px-4 py-3">Better member offers</span>
        </div>
      </div>
    </div>
  );
}

export default Maintenance;
