import { Clock3, History } from "lucide-react";

export default function RecentQueries({ queries = [], onSelect }) {
  return (
    <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.025)] sm:p-6">
      <div className="mb-5"><h3 className="text-[14px] font-bold text-slate-900">Recent queries</h3><p className="mt-0.5 text-[11px] text-slate-500">Your latest database activity</p></div>
      {queries.length ? <div className="space-y-3">{queries.slice(0, 5).map((item) => <button key={item.id} onClick={() => onSelect?.(item)} className="flex w-full items-center justify-between gap-3 rounded-xl border border-slate-100 p-3 text-left transition hover:border-blue-100 hover:bg-blue-50/40"><span className="min-w-0"><span className="block truncate text-xs font-semibold text-slate-700">{item.question}</span><span className="mt-1 flex items-center gap-1 text-[10px] text-slate-400"><Clock3 size={11}/>{item.createdAt || "Recently"}</span></span><span className={`shrink-0 rounded-full px-2 py-1 text-[9px] font-bold ${item.status === "success" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-600"}`}>{item.status}</span></button>)}</div> : <div className="flex min-h-[130px] flex-col items-center justify-center text-center"><History size={21} className="text-slate-300"/><p className="mt-3 text-xs font-semibold text-slate-600">No query history yet</p><p className="mt-1 text-[10px] text-slate-400">Your executed queries will be listed here.</p></div>}
    </section>
  );
}
