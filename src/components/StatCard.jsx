export default function StatCard({ title, value = "—", description, icon: Icon, tone = "blue" }) {
  const tones = {
    blue: "bg-blue-50 text-blue-600",
    green: "bg-emerald-50 text-emerald-600",
    violet: "bg-violet-50 text-violet-600",
    amber: "bg-amber-50 text-amber-600",
  };
  return (
    <article className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.025)]">
      <div className="flex items-center justify-between gap-3">
        <p className="text-[12px] font-semibold text-slate-500">{title}</p>
        <span className={`grid h-9 w-9 place-items-center rounded-xl ${tones[tone] || tones.blue}`}><Icon size={17}/></span>
      </div>
      <p className="mt-5 font-[Manrope] text-[29px] font-extrabold tracking-tight text-slate-900">{value}</p>
      <p className="mt-1.5 text-[11px] text-slate-400">{description}</p>
    </article>
  );
}
