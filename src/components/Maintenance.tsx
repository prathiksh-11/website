import { useEffect } from 'react';
import { AlertTriangle, Sparkles } from 'lucide-react';

function Maintenance() {
  useEffect(() => {
    document.title = 'Under Maintenance | Game On Fitness';
  }, []);

  return (
    <div className="min-h-screen atmosphere overflow-hidden px-6 py-10 sm:px-10 relative">
      <div className="relative mx-auto flex max-w-4xl flex-col gap-10 items-center text-center pt-16">
        <span className="inline-flex items-center gap-2 rounded-full border border-[rgba(18,20,26,0.08)] bg-white px-4 py-2 text-xs uppercase tracking-[0.3em] text-[#6f7685] shadow-sm">
          <AlertTriangle size={16} className="text-[#e07a72]" />
          Site Under Maintenance
        </span>

        <div className="max-w-2xl">
          <h1 className="font-display text-4xl sm:text-5xl font-extrabold tracking-tight text-[#16181f]">
            We&apos;re refreshing your fit experience.
          </h1>
          <p className="mt-6 text-lg text-[#6f7685]">
            The website is getting a clean upgrade. We&apos;ll be back soon with something
            smoother and more beautiful.
          </p>
        </div>

        <div className="w-full rounded-[1.75rem] border border-[rgba(18,20,26,0.06)] bg-white p-8 shadow-[0_28px_60px_rgba(18,20,26,0.08)] text-left">
          <div className="inline-flex items-center gap-3 rounded-full bg-[#f7f8fb] px-4 py-2.5 text-sm text-[#3a3f4b]">
            <Sparkles size={16} className="text-[#e07a72]" />
            Fresh updates in progress — thanks for your patience.
          </div>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-[#9aa0ab]">Expected return</p>
          <p className="mt-2 font-display text-3xl font-bold text-[#16181f]">Within the next 24 hours</p>
          <a
            href="https://wa.me/919148974009"
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center justify-center rounded-full bg-[#16181f] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1c1f28] transition"
          >
            Message us on WhatsApp
          </a>
        </div>
      </div>
    </div>
  );
}

export default Maintenance;
