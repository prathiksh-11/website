const items = [
  'State-of-the-Art Equipment',
  '18/7 Access',
  'Expert Trainers',
  'Nutrition Plans',
  'Personal Coaching',
  'Steam & Recovery',
  'Group Classes',
  'Premium Interiors',
];

export default function AmenityMarquee() {
  const row = [...items, ...items];

  return (
    <section className="relative py-5 overflow-hidden border-y border-[rgba(22,24,31,0.05)] bg-white/70 backdrop-blur-sm">
      <div className="absolute left-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-16 md:w-28 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

      <div className="marquee-track flex w-max gap-10">
        {row.map((item, i) => (
          <div key={`${item}-${i}`} className="flex items-center gap-10 shrink-0">
            <span className="text-xs md:text-sm font-semibold tracking-[0.18em] uppercase text-[#3a3f4b] whitespace-nowrap">
              {item}
            </span>
            <span className="w-1.5 h-1.5 rounded-full bg-[#e07a72]/70 shrink-0" />
          </div>
        ))}
      </div>
    </section>
  );
}
