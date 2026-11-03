
import { Bell, Search, ChevronDown, Command } from "lucide-react";

export default function Header({ activePage }) {
  return (
    <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white/90 px-8 backdrop-blur">
      <div>
        <p className="text-xs text-slate-400">
          Workspace / QueryMind AI
        </p>
        <h2 className="mt-1 text-lg font-semibold text-slate-900">
          {activePage}
        </h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
          <Search size={16} className="text-slate-400" />
          <span className="text-xs text-slate-400">
            Search anything...
          </span>
          <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] text-slate-500">
            Ctrl K
          </kbd>
        </div>

        <button className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100">
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-blue-600" />
        </button>

        <div className="flex cursor-pointer items-center gap-2 border-l border-slate-200 pl-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            MK
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">
              My Account
            </p>
            <p className="text-xs text-slate-400">Administrator</p>
          </div>
          <ChevronDown size={15} className="text-slate-400" />
        </div>
      </div>
    </header>
  );
}
