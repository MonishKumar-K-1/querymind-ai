import { useEffect, useState } from "react";
import { Activity, CheckCircle2, Database, Layers3, Sparkles, Server, ShieldCheck, AlertCircle, ShieldAlert, AudioLines } from "lucide-react";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import QueryAssistant from "../components/QueryAssistant";
import ResultsTable from "../components/ResultsTable";
import RecentQueries from "../components/RecentQueries";

export default function Dashboard({ session, onLogout }) {
  const [activePage, setActivePage] = useState("Overview");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [notice, setNotice] = useState("");
  const [noticeType, setNoticeType] = useState("info");
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);
  const [health, setHealth] = useState(null);
  const [schema, setSchema] = useState(null);
  const [queryCount, setQueryCount] = useState(0);
  const [successCount, setSuccessCount] = useState(0);
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("querymind-history") || "[]"); }
    catch { return []; }
  });

  useEffect(() => {
    let mounted = true;
    const loadStatus = async () => {
      try {
        const authHeaders = { Authorization: `Bearer ${session.token}` };
        const [healthResponse, schemaResponse] = await Promise.all([
          fetch("/api/health"),
          fetch("/api/schema", { headers: authHeaders }),
        ]);
        const healthData = await healthResponse.json();
        const schemaData = await schemaResponse.json();
        if (!mounted) return;
        setHealth(healthData);
        if (schemaResponse.ok) setSchema(schemaData);
      } catch {
        if (mounted) setHealth({ status: "offline", error: "Cannot reach the Node API." });
      }
    };
    loadStatus();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    localStorage.setItem("querymind-history", JSON.stringify(history.slice(0, 20)));
  }, [history]);

  const handleRun = async (question) => {
    setBusy(true);
    setNotice("");
    setNoticeType("info");
    setResult(null);
    setQueryCount((count) => count + 1);

    try {
      const response = await fetch("/api/query", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${session.token}` },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      if (!response.ok) {
        const blocked = data.code === "SECURITY_BLOCKED";
        setNotice(data.error || "The query could not be completed.");
        setNoticeType(blocked ? "security" : "error");
        setHistory((items) => [{
          id: `${Date.now()}`,
          question,
          status: blocked ? "blocked" : "failed",
          createdAt: new Date().toLocaleString(),
        }, ...items].slice(0, 20));
        return;
      }

      setResult(data);
      setSuccessCount((count) => count + 1);
      setNotice(data.explanation || "Query executed successfully.");
      setNoticeType("success");
      setHistory((items) => [{
        id: `${Date.now()}`,
        question,
        status: "success",
        createdAt: new Date().toLocaleString(),
        sql: data.sql,
      }, ...items].slice(0, 20));
    } catch (error) {
      setNotice(error.message || "Unable to connect to QueryMind services.");
      setNoticeType("error");
      setHistory((items) => [{
        id: `${Date.now()}`,
        question,
        status: "failed",
        createdAt: new Date().toLocaleString(),
      }, ...items].slice(0, 20));
    } finally {
      setBusy(false);
    }
  };

  const selectHistoryItem = (item) => {
    if (item.sql) {
      setNotice(`Previous question: ${item.question}`);
      setNoticeType("info");
    }
  };

  const pageIntro = {
    Overview: ["Welcome to QueryMind AI", "A smarter way to explore your database using natural language, voice and secure read-only SQL."],
    "AI Assistant": ["AI Query Assistant", "Translate everyday questions into secure, read-only SQL queries."],
    "Database Explorer": ["Database Explorer", "Inspect your live database tables, columns and relationships."],
    "Query History": ["Query History", "Review the questions submitted during this browser session."],
    Settings: ["Workspace settings", "Manage your QueryMind workspace configuration."],
    "Help & Support": ["Help & Support", "Guidance for using the QueryMind AI workspace."],
  };
  const [title, subtitle] = pageIntro[activePage] || pageIntro.Overview;
  const serviceOnline = health?.status === "ok";

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      <Sidebar activePage={activePage} onNavigate={setActivePage} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)}/>
      <div className="min-h-screen lg:pl-[272px]">
        <Header activePage={activePage} onMenuClick={() => setMobileOpen(true)} user={session.user} onLogout={onLogout}/>
        <main className="mx-auto max-w-[1500px] space-y-6 px-4 py-6 sm:px-7 sm:py-8 lg:px-9">
          <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[.16em] text-blue-600"><span className="h-1.5 w-1.5 rounded-full bg-blue-500"/>{activePage === "Overview" ? "Workspace overview" : "QueryMind workspace"}</div>
              <h1 className="text-[25px] font-extrabold tracking-tight text-slate-900 sm:text-[30px]">{title}</h1>
              <p className="mt-2 max-w-2xl text-[12px] leading-5 text-slate-500">{subtitle}</p>
            </div>
            <div className={`inline-flex w-fit items-center gap-2 rounded-xl border px-3.5 py-2.5 text-[10px] font-semibold ${serviceOnline ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}>
              <span className={`h-1.5 w-1.5 rounded-full ${serviceOnline ? "bg-emerald-500" : "bg-amber-500"}`}/>
              {serviceOnline ? "Workspace services available" : "Workspace temporarily unavailable"}
            </div>
          </section>

          {activePage === "Overview" && <>
            <section className="relative overflow-hidden rounded-3xl bg-[#111b2e] px-6 py-7 text-white shadow-xl shadow-slate-900/10 sm:px-8 sm:py-9">
              <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full bg-blue-500/20 blur-3xl"/>
              <div className="relative grid gap-7 lg:grid-cols-[1.2fr_.8fr] lg:items-center">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-3 py-1.5 text-[10px] font-bold tracking-wide text-blue-200"><Sparkles size={13}/> YOUR INTELLIGENT DATABASE WORKSPACE</span>
                  <h2 className="mt-5 max-w-xl font-[Manrope] text-2xl font-extrabold leading-tight sm:text-3xl">Ask questions. Understand your data. Make better decisions.</h2>
                  <p className="mt-3 max-w-xl text-xs leading-6 text-slate-300 sm:text-sm">QueryMind AI converts everyday questions into SQL, securely executes read-only queries and explains the results in plain language. Use text or your voice to get started.</p>
                  <button onClick={()=>setActivePage("AI Assistant")} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-blue-500 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-blue-950/30 transition hover:bg-blue-400">Start asking questions <Sparkles size={14}/></button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4"><Database size={20} className="text-blue-300"/><p className="mt-4 text-xl font-extrabold">{schema?.table_count ?? "—"}</p><p className="mt-1 text-[10px] text-slate-400">Available tables</p></div>
                  <div className="rounded-2xl border border-white/10 bg-white/[.07] p-4"><Layers3 size={20} className="text-indigo-300"/><p className="mt-4 text-xl font-extrabold">{schema?.total_records ?? "—"}</p><p className="mt-1 text-[10px] text-slate-400">Database records</p></div>
                  <div className="col-span-2 rounded-2xl border border-emerald-300/15 bg-emerald-400/[.08] p-4"><div className="flex items-center gap-2 text-xs font-bold text-emerald-200"><ShieldCheck size={16}/> Read-only data protection</div><p className="mt-1.5 text-[10px] leading-5 text-slate-400">Database write operations and schema changes are blocked by the SQL execution service.</p></div>
                </div>
              </div>
            </section>
            <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatCard title="Queries submitted" value={queryCount} description="This page session" icon={Activity} tone="blue"/>
              <StatCard title="Successful queries" value={successCount} description="Successfully executed" icon={CheckCircle2} tone="green"/>
              <StatCard title="Database tables" value={schema?.table_count ?? "—"} description="Read from SQLite schema" icon={Database} tone="violet"/>
              <StatCard title="Total records" value={schema?.total_records ?? "—"} description="Across available tables" icon={Layers3} tone="amber"/>
            </section>
            <section className="grid gap-3 md:grid-cols-3">
              <FeatureCard icon={AudioLines} title="Ask naturally" text="Type a question or use voice input. No need to write SQL manually."/>
              <FeatureCard icon={Database} title="Explore relationships" text="Query connected tables with joins, filters and aggregations."/>
              <FeatureCard icon={ShieldCheck} title="Read-only execution" text="Queries are validated and executed with database write protections."/>
            </section>
            <div className="flex items-center gap-2 pt-1"><Sparkles size={16} className="text-blue-600"/><h2 className="text-[14px] font-bold text-slate-800">Try the AI query assistant</h2></div>
            <QueryAssistant onRun={handleRun} busy={busy}/>
            {notice && <Notice type={noticeType}>{notice}</Notice>}
            <ResultsTable result={result}/>
            <section className="grid gap-4 lg:grid-cols-2">
              <RecentQueries queries={history} onSelect={selectHistoryItem}/>
              <DatabaseStatus schema={schema} health={health}/>
            </section>
          </>}

          {activePage === "AI Assistant" && <>
            <QueryAssistant onRun={handleRun} busy={busy}/>
            {notice && <Notice type={noticeType}>{notice}</Notice>}
            <ResultsTable result={result}/>
          </>}

          {activePage === "Database Explorer" && <DatabaseExplorer schema={schema}/>}
          {activePage === "Query History" && <RecentQueries queries={history} onSelect={selectHistoryItem}/>}
          {activePage === "Settings" && <SettingsPage user={session.user} onLogout={onLogout}/>}
          {activePage === "Help & Support" && <InfoPanel icon={ShieldCheck} title="Read-only SQL safety" message="SQL is executed through a read-only SQLite connection and a SQLite authorizer. Write operations, schema changes, multiple statements and long-running queries are rejected by the Python service."/>}

          <footer className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/80 pt-5 text-[10px] text-slate-400 sm:flex-row"><span>© 2026 QueryMind AI. Intelligent database querying.</span><span className="flex items-center gap-1.5"><span className={`h-1.5 w-1.5 rounded-full ${serviceOnline ? "bg-emerald-500" : "bg-amber-400"}`}/>{serviceOnline ? "Connected environment" : "Development environment"}</span></footer>
        </main>
      </div>
    </div>
  );
}

function Notice({ type, children }) {
  const security = type === "security";
  const isError = type === "error" || security;
  const styles = security
    ? "border-rose-300 bg-rose-50 text-rose-800"
    : type === "error"
      ? "border-rose-200 bg-rose-50 text-rose-800"
      : type === "success"
        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
        : "border-blue-100 bg-blue-50 text-blue-800";
  const Icon = security ? ShieldAlert : isError ? AlertCircle : CheckCircle2;
  return <div role={isError ? "alert" : "status"} className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-[11px] leading-5 ${styles}`}><Icon size={15} className="mt-0.5 shrink-0"/><span>{children}</span></div>;
}

function FeatureCard({ icon: Icon, title, text }) {
  return <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.025)]"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon size={19}/></span><h3 className="mt-4 text-xs font-extrabold text-slate-900">{title}</h3><p className="mt-2 text-[11px] leading-5 text-slate-500">{text}</p></div>;
}

function SettingsPage({ user, onLogout }) {
  return <div className="grid gap-4 lg:grid-cols-[1.1fr_.9fr]">
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6">
      <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><ShieldCheck size={19}/></span><div><h3 className="text-sm font-extrabold text-slate-900">Account & security</h3><p className="text-[11px] text-slate-500">Manage your signed-in workspace session.</p></div></div>
      <div className="mt-6 divide-y divide-slate-100">
        <div className="flex items-center justify-between gap-4 py-4"><div><p className="text-xs font-bold text-slate-700">Signed in as</p><p className="mt-1 text-[11px] text-slate-500">{user?.email || "Administrator"}</p></div><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700">Active session</span></div>
        <div className="flex items-center justify-between gap-4 py-4"><div><p className="text-xs font-bold text-slate-700">Access role</p><p className="mt-1 text-[11px] text-slate-500">Administrator workspace access</p></div><span className="text-[11px] font-semibold text-slate-600">{user?.role || "Administrator"}</span></div>
        <div className="flex items-center justify-between gap-4 py-4"><div><p className="text-xs font-bold text-slate-700">Session security</p><p className="mt-1 text-[11px] text-slate-500">Server-verified token with an eight-hour expiry.</p></div><ShieldCheck size={18} className="text-emerald-600"/></div>
      </div>
      <button onClick={onLogout} className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-bold text-rose-700 transition hover:bg-rose-100">Sign out of QueryMind AI</button>
    </section>
    <section className="rounded-2xl border border-slate-200/80 bg-white p-6">
      <div className="flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600"><Sparkles size={19}/></span><div><h3 className="text-sm font-extrabold text-slate-900">Application preferences</h3><p className="text-[11px] text-slate-500">About this QueryMind workspace.</p></div></div>
      <div className="mt-6 space-y-4">
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-700">Application</p><p className="mt-1 text-xs text-slate-500">QueryMind AI</p></div>
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-700">Query mode</p><p className="mt-1 text-xs text-slate-500">Natural language to read-only SQL</p></div>
        <div className="rounded-xl bg-slate-50 p-4"><p className="text-xs font-bold text-slate-700">Database engine</p><p className="mt-1 text-xs text-slate-500">SQLite · protected query execution</p></div>
        <p className="text-[10px] leading-5 text-slate-400">Sensitive integration credentials and server configuration are managed securely on the backend, not displayed in this workspace.</p>
      </div>
    </section>
  </div>;
}

function DatabaseStatus({ schema, health }) {
  const connected = health?.status === "ok" && schema;
  return <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_2px_10px_rgba(15,23,42,.025)] sm:p-6">
    <div className="flex items-center justify-between"><div><h3 className="text-[14px] font-bold text-slate-900">Database connection</h3><p className="mt-0.5 text-[11px] text-slate-500">Local SQLite environment</p></div><Database size={19} className="text-slate-400"/></div>
    {connected ? <div className="mt-5 space-y-2">{schema.tables.map((table) => <div key={table.name} className="flex items-center justify-between rounded-xl border border-slate-100 p-3"><span className="text-xs font-semibold text-slate-700">{table.name}</span><span className="text-[10px] text-slate-400">{table.row_count} rows</span></div>)}</div> : <div className="mt-5 rounded-xl border border-dashed border-slate-200 bg-slate-50/70 p-5 text-center"><Server size={18} className="mx-auto text-slate-400"/><p className="mt-3 text-xs font-bold text-slate-700">Waiting for database connection</p><p className="mt-1 text-[10px] text-slate-400">Start the Python and Node services to load SQLite metadata.</p></div>}
  </section>;
}

function DatabaseExplorer({ schema }) {
  return <section className="rounded-2xl border border-slate-200/80 bg-white p-6">
    <div className="mb-5 flex items-center gap-3"><span className="grid h-10 w-10 place-items-center rounded-xl bg-violet-50 text-violet-600"><Database size={19}/></span><div><h3 className="text-sm font-bold text-slate-900">Live database schema</h3><p className="text-[11px] text-slate-500">Table and column metadata retrieved from SQLite.</p></div></div>
    {schema?.tables?.length ? <div className="grid gap-3 md:grid-cols-3">{schema.tables.map((table) => <div key={table.name} className="rounded-xl border border-slate-200 p-4"><div className="flex items-center justify-between gap-2"><div className="flex items-center gap-2 text-xs font-bold text-slate-700"><Database size={15} className="text-blue-500"/>{table.name}</div><span className="text-[9px] text-slate-400">{table.row_count} rows</span></div><div className="mt-4 space-y-2">{table.columns.map((column) => <div key={column.name} className="flex items-center justify-between gap-2 border-t border-slate-100 pt-2"><span className="text-[10px] text-slate-600">{column.name}{column.primary_key && <span className="ml-1 text-[8px] font-bold text-blue-600">PK</span>}</span><span className="text-[9px] text-slate-400">{column.type || "—"}</span></div>)}</div></div>)}</div> : <div className="rounded-xl border border-dashed border-slate-200 p-8 text-center text-xs text-slate-400">Database schema unavailable. Check that both backend services are running.</div>}
  </section>;
}

function InfoPanel({ icon: Icon, title, message }) {
  return <section className="rounded-2xl border border-slate-200/80 bg-white p-8"><span className="grid h-11 w-11 place-items-center rounded-xl bg-blue-50 text-blue-600"><Icon size={20}/></span><h3 className="mt-4 text-sm font-bold text-slate-900">{title}</h3><p className="mt-2 max-w-xl text-xs leading-6 text-slate-500">{message}</p></section>;
}
