import { useMemo, useState } from "react";
import { Check, Clock3, Code2, Copy, Download, FileText, Table2 } from "lucide-react";

export default function ResultsTable({ result }) {
  const [tab, setTab] = useState("results");
  const [copied, setCopied] = useState(false);
  const columns = result?.columns || [];
  const rows = result?.rows || [];
  const sql = result?.sql || "";

  const csv = useMemo(() => {
    if (!columns.length) return "";
    const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
    return [columns.map(escape).join(","), ...rows.map((row) => columns.map((col) => escape(row[col])).join(","))].join("\n");
  }, [columns, rows]);

  const copySql = async () => {
    if (!sql) return;
    try { await navigator.clipboard.writeText(sql); setCopied(true); setTimeout(() => setCopied(false), 1400); } catch { setCopied(false); }
  };
  const exportCsv = () => {
    if (!csv) return;
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a"); link.href = url; link.download = "querymind-results.csv"; link.click(); URL.revokeObjectURL(url);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_2px_10px_rgba(15,23,42,.025)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div><h3 className="text-[14px] font-bold text-slate-900">Query workspace</h3><p className="mt-0.5 text-[11px] text-slate-500">Generated SQL and execution output</p></div>
        {result?.executionTime != null && <span className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-semibold text-emerald-700"><Clock3 size={12}/>{result.executionTime} ms</span>}
      </div>
      <div className="flex items-center justify-between border-b border-slate-100 px-4 sm:px-6">
        <div className="flex gap-5">
          <button onClick={() => setTab("results")} className={`flex items-center gap-2 border-b-2 py-3 text-xs font-semibold ${tab === "results" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}><Table2 size={14}/> Results</button>
          <button onClick={() => setTab("sql")} className={`flex items-center gap-2 border-b-2 py-3 text-xs font-semibold ${tab === "sql" ? "border-blue-600 text-blue-600" : "border-transparent text-slate-400 hover:text-slate-700"}`}><Code2 size={14}/> Generated SQL</button>
        </div>
        {tab === "sql" && sql && <button onClick={copySql} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 hover:text-blue-600">{copied ? <Check size={13}/> : <Copy size={13}/>} {copied ? "Copied" : "Copy SQL"}</button>}
        {tab === "results" && rows.length > 0 && <button onClick={exportCsv} className="flex items-center gap-1.5 text-[10px] font-semibold text-slate-500 hover:text-blue-600"><Download size={13}/> Export CSV</button>}
      </div>
      {tab === "sql" ? (
        sql ? <pre className="max-h-[330px] overflow-auto bg-[#111b2e] p-5 text-[12px] leading-6 text-blue-100">{sql}</pre> :
          <EmptyState icon={Code2} title="No SQL generated yet" message="Your generated SQL will appear here after the backend is connected."/>
      ) : rows.length > 0 && columns.length > 0 ? (
        <div className="overflow-x-auto"><table className="w-full text-left text-xs"><thead className="bg-slate-50 text-[10px] uppercase tracking-wider text-slate-500"><tr>{columns.map((col) => <th key={col} className="whitespace-nowrap px-5 py-3.5 font-bold">{col.replaceAll("_", " ")}</th>)}</tr></thead><tbody className="divide-y divide-slate-100">{rows.map((row, i) => <tr key={i} className="hover:bg-slate-50/70">{columns.map((col) => <td key={col} className="whitespace-nowrap px-5 py-3.5 text-slate-700">{String(row[col] ?? "—")}</td>)}</tr>)}</tbody></table></div>
      ) : <EmptyState icon={FileText} title="Your results will appear here" message="Submit a natural-language question to generate SQL and view live database results."/>}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 px-5 py-3.5 text-[10px] text-slate-400 sm:px-6">
        <span>{rows.length ? `${rows.length} rows returned` : "Waiting for your first query"}</span>
        <span className="flex items-center gap-1.5"><Clock3 size={12}/> {result?.executionTime != null ? "Execution completed" : "No execution yet"}</span>
      </div>
    </section>
  );
}

function EmptyState({ icon: Icon, title, message }) {
  return <div className="flex min-h-[210px] flex-col items-center justify-center px-5 py-10 text-center"><span className="grid h-11 w-11 place-items-center rounded-2xl bg-slate-100 text-slate-400"><Icon size={20}/></span><h4 className="mt-4 text-[13px] font-bold text-slate-700">{title}</h4><p className="mt-1.5 max-w-sm text-[11px] leading-5 text-slate-400">{message}</p></div>;
}
