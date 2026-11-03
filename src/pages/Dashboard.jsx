
import { useState } from "react";
import {
  Activity,
  Database,
  Sparkles,
  CircleCheck,
  ArrowUpRight,
  Layers3,
} from "lucide-react";

import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import StatCard from "../components/StatCard";
import QueryAssistant from "../components/QueryAssistant";
import ResultsTable from "../components/ResultsTable";
import RecentQueries from "../components/RecentQueries";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("Overview");
  const [result, setResult] = useState(null);

  const handleRun = (question) => {
    // Temporary UI preview.
    // Actual Gemini and SQLite integration comes later.
    setResult({
      question,
      sql: `SELECT
    c.name,
    c.region,
    SUM(s.amount) AS total_revenue
FROM CUSTOMER c
JOIN SALES s
    ON c.customer_id = s.customer_id
GROUP BY c.customer_id
ORDER BY total_revenue DESC
LIMIT 5;`,
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="ml-64 min-h-screen">
        <Header activePage={activePage} />

        <main className="mx-auto max-w-[1600px] space-y-7 p-8">

          {/* Welcome section */}
          <section className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                Good morning, Monish 👋
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Here's what's happening with your database today.
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Local database
              <span className="text-slate-300">|</span>
              SQLite
            </div>
          </section>

          {/* Statistics */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Total Queries"
              value="128"
              description="Demo statistics"
              icon={Activity}
              color="bg-blue-50 text-blue-600"
            />

            <StatCard
              title="Successful Queries"
              value="116"
              description="Demo statistics"
              icon={CircleCheck}
              color="bg-emerald-50 text-emerald-600"
            />

            <StatCard
              title="Database Tables"
              value="03"
              description="Employee, Customer, Sales"
              icon={Database}
              color="bg-violet-50 text-violet-600"
            />

            <StatCard
              title="Records"
              value="30"
              description="Sample database records"
              icon={Layers3}
              color="bg-amber-50 text-amber-600"
            />
          </section>

          {/* AI assistant */}
          <section>
            <div className="mb-4 flex items-center gap-2">
              <Sparkles size={18} className="text-blue-600" />
              <h2 className="font-semibold text-slate-900">
                AI Query Assistant
              </h2>
            </div>

            <QueryAssistant onRun={handleRun} />
          </section>

          {/* Output */}
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-semibold text-slate-900">
                Query Workspace
              </h2>
              <span className="text-xs text-slate-400">
                Preview environment
              </span>
            </div>

            <ResultsTable result={result} />
          </section>

          {/* Recent activity */}
          <section className="grid gap-5 lg:grid-cols-2">
            <RecentQueries />

            <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-slate-900">
                    Database Overview
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Available data sources
                  </p>
                </div>
                <Database size={19} className="text-slate-400" />
              </div>

              {[
                { name: "EMPLOYEE", rows: "10 records" },
                { name: "CUSTOMER", rows: "10 records" },
                { name: "SALES", rows: "10 records" },
              ].map((table) => (
                <div
                  key={table.name}
                  className="mb-3 flex items-center justify-between rounded-lg border border-slate-100 p-3 last:mb-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg bg-blue-50 p-2 text-blue-600">
                      <Database size={17} />
                    </div>
                    <span className="text-sm font-medium text-slate-700">
                      {table.name}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">
                    {table.rows}
                  </span>
                </div>
              ))}

              <button className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-50 py-3 text-xs font-semibold text-blue-600 hover:bg-blue-50">
                Explore database <ArrowUpRight size={14} />
              </button>
            </div>
          </section>

          <footer className="border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
            QueryMind AI © 2026 · Intelligent Database Query Platform
          </footer>

        </main>
      </div>
    </div>
  );
}
