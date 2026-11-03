
import { useState } from "react";
import {
  Sparkles,
  Mic,
  ArrowUp,
  Database,
  Lightbulb,
} from "lucide-react";

const suggestions = [
  "Show the top five customers by revenue",
  "Calculate average salary by department",
  "Show total sales by region",
];

export default function QueryAssistant({ onRun }) {
  const [question, setQuestion] = useState("");

  const handleSubmit = () => {
    if (!question.trim()) return;
    onRun(question);
  };

  return (
    <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Sparkles size={21} />
        </div>
        <div>
          <h3 className="font-semibold text-slate-900">
            Ask your database
          </h3>
          <p className="text-xs text-slate-500">
            Describe what you want to know in natural language.
          </p>
        </div>
        <div className="ml-auto hidden items-center gap-1 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 sm:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
          AI Ready
        </div>
      </div>

      <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 transition focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something like: Show the top five customers by revenue..."
          rows={3}
          className="w-full resize-none bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
        />

        <div className="mt-3 flex items-center justify-between border-t border-slate-200 pt-3">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Database size={14} />
            SQLite Database
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              title="Voice input will be connected later"
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-500 hover:bg-slate-100"
            >
              <Mic size={17} />
            </button>

            <button
              onClick={handleSubmit}
              disabled={!question.trim()}
              className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Generate SQL
              <ArrowUp size={16} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-slate-500">
          <Lightbulb size={15} className="text-amber-500" />
          TRY ASKING
        </div>

        <div className="flex flex-wrap gap-2">
          {suggestions.map((item) => (
            <button
              key={item}
              onClick={() => setQuestion(item)}
              className="rounded-full border border-slate-200 bg-white px-3 py-2 text-xs text-slate-600 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-700"
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
