
import {
  LayoutDashboard,
  Sparkles,
  Database,
  History,
  Settings,
  CircleHelp,
  PanelLeftClose,
  Command,
} from "lucide-react";

const navigation = [
  { name: "Overview", icon: LayoutDashboard },
  { name: "AI Assistant", icon: Sparkles },
  { name: "Database Explorer", icon: Database },
  { name: "Query History", icon: History },
];

export default function Sidebar({ activePage, setActivePage }) {
  return (
    <aside className="fixed left-0 top-0 z-30 flex h-screen w-64 flex-col border-r border-slate-800 bg-[#101828] text-white">

      {/* Brand */}
      <div className="flex h-20 items-center justify-between border-b border-slate-800 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
            <Command size={23} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">
              QueryMind<span className="text-blue-400"> AI</span>
            </h1>
            <p className="text-[10px] tracking-widest text-slate-400">
              INTELLIGENT DATA PLATFORM
            </p>
          </div>
        </div>
        <PanelLeftClose size={17} className="text-slate-500" />
      </div>

      {/* Workspace */}
      <div className="px-5 pt-7">
        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          Workspace
        </p>

        <div className="rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-3">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-emerald-400" />
            <span className="text-sm font-medium">My Workspace</span>
          </div>
          <p className="mt-1 pl-4 text-xs text-slate-400">
            Local environment
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 pt-8">
        <p className="mb-3 px-2 text-[10px] font-semibold uppercase tracking-[0.15em] text-slate-500">
          Menu
        </p>

        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = activePage === item.name;

            return (
              <button
                key={item.name}
                onClick={() => setActivePage(item.name)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm transition ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-950/30"
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom navigation */}
      <div className="space-y-1 border-t border-slate-800 p-4">
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
          <Settings size={18} />
          Settings
        </button>
        <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm text-slate-400 hover:bg-slate-800 hover:text-white">
          <CircleHelp size={18} />
          Help & Support
        </button>

        <div className="mt-4 flex items-center gap-3 rounded-lg bg-slate-800/70 p-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-500 text-sm font-bold">
            MK
          </div>
          <div>
            <p className="text-sm font-medium">Workspace User</p>
            <p className="text-xs text-slate-400">Free workspace</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
