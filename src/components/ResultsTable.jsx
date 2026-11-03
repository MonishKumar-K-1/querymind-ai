
import { useState } from "react";
import {
  Code2,
  Table2,
  Copy,
  Check,
  Download,
  Clock3,
  CheckCircle2,
} from "lucide-react";

const sampleRows = [
  { name: "Acme Technologies", region: "South", revenue: "₹8,50,000" },
  { name: "Global Systems", region: "West", revenue: "₹7,20,000" },
  { name: "Nexus Solutions", region: "North", revenue: "₹6,80,000" },
  { name: "Vertex Digital", region: "East", revenue: "₹5,40,000" },
  { name: "Apex Industries", region: "South", revenue: "₹4,90,000" },
];

export default function ResultsTable({ result }) {
  const [activeTab, setActiveTab] = useState("results");
  const [copied, setCopied] = useState(false);

  const sql = result?.sql || `SELECT
    c.name,
    c.region,
    SUM(s.amount) AS total_revenue
FROM CUSTOMER c
JOIN SALES s
    ON c.customer_id = s.customer_id
GROUP BY c.customer_id
ORDER BY total_revenue DESC
LIMIT 5;`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(sql);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-4">
        <div>
          <h3 className="font-semibold text-slate-900">
            Query Output
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            SQL preview and execution results
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700">
          <CheckCircle2 size={14} />
          Demo data
        </div>
      </div>

      <div className="flex border-b border-slate-200 px-5">
        <button
          onClick={() => setActiveTab("results")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm ${
            activeTab === "results"
              ? "border-blue-600 font-semibold text-blue-600"
              : "border-transparent text-slate-500"
          }`}
        >
          <Table2 size={16} />
          Results
        </button>

        <button
          onClick={() => setActiveTab("sql")}
          className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm ${
            activeTab === "sql"
              ? "border-blue-600 font-semibold text-blue-600"
              : "border-transparent text-slate-500"
          }`}
        >
          <Code2 size={16} />
          Generated SQL
        </button>
      </div>

      {activeTab === "sql" ? (
        <div className="bg-[#101828] p-5">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-xs text-slate-400">SQLITE / SQL</span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 text-xs text-slate-300 hover:text-white"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              {copied ? "Copied" : "Copy SQL"}
            </button>
          </div>
          <pre className="overflow-x-auto whitespace-pre-wrap text-sm leading-7 text-blue-200">
            {sql}
          </pre>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-4 font-semibold">Customer</th>
                <th className="px-5 py-4 font-semibold">Region</th>
                <th className="px-5 py-4 font-semibold">Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sampleRows.map((row) => (
                <tr key={row.name} className="hover:bg-slate-50">
                  <td className="px-5 py-4 font-medium text-slate-800">
                    {row.name}
                  </td>
                  <td className="px-5 py-4 text-slate-500">
                    {row.region}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-800">
                    {row.revenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 px-5 py-3">
        <div className="flex items-center gap-4 text-xs text-slate-400">
          <span>5 demo records</span>
          <span className="flex items-center gap-1">
            <Clock3 size={13} /> Demo execution
          </span>
        </div>
        <button
          onClick={() => {
            const csv = [
              "Customer,Region,Revenue",
              ...sampleRows.map(r =>
                `"${r.name}","${r.region}","${r.revenue}"`
              ),
            ].join("\n");

            const blob = new Blob([csv], { type: "text/csv" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = "querymind-results.csv";
            link.click();
            URL.revokeObjectURL(url);
          }}
          className="flex items-center gap-2 text-xs font-medium text-blue-600 hover:text-blue-800"
        >
          <Download size={14} />
          Export CSV
        </button>
      </div>
    </section>
  );
}
