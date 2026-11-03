
import { Clock3, ArrowUpRight } from "lucide-react";

const queries = [
  {
    question: "Top five customers by revenue",
    time: "Today, 10:42 AM",
    status: "Success",
  },
  {
    question: "Average salary by department",
    time: "Today, 10:25 AM",
    status: "Success",
  },
  {
    question: "Total sales by region",
    time: "Yesterday, 4:18 PM",
    status: "Success",
  },
];

export default function RecentQueries() {
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-semibold text-slate-900">
            Recent Queries
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Your recent database activity
          </p>
        </div>
        <button className="flex items-center gap-1 text-xs font-medium text-blue-600">
          View all <ArrowUpRight size={14} />
        </button>
      </div>

      <div className="space-y-4">
        {queries.map((query) => (
          <div
            key={query.question}
            className="flex items-center justify-between gap-3 border-b border-slate-100 pb-4 last:border-0 last:pb-0"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">
                {query.question}
              </p>
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                <Clock3 size={12} />
                {query.time}
              </p>
            </div>

            <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
              {query.status}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
