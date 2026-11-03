import { Bell, Menu, ChevronDown, LogOut } from "lucide-react";
import { useState } from "react";

export default function Header({ activePage, onMenuClick, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <header className="sticky top-0 z-30 flex h-[78px] items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
      <div className="flex min-w-0 items-center gap-3">
        <button onClick={onMenuClick} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden" aria-label="Open navigation"><Menu size={20}/></button>
        <div className="min-w-0"><p className="hidden text-[11px] font-medium text-slate-400 sm:block">Workspace <span className="px-1.5">/</span> QueryMind AI</p><h2 className="truncate text-[17px] font-bold text-slate-900">{activePage}</h2></div>
      </div>
      <div className="flex items-center gap-3">
        <span className="hidden rounded-full bg-emerald-50 px-3 py-1.5 text-[10px] font-bold text-emerald-700 sm:inline-flex">Secure workspace</span>
        <div className="relative">
          <button onClick={()=>setMenuOpen(v=>!v)} className="flex items-center gap-2 rounded-xl p-1.5 text-left hover:bg-slate-50">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">{(user?.email||"A").slice(0,1).toUpperCase()}</span>
            <span className="hidden sm:block"><span className="block max-w-[170px] truncate text-xs font-semibold text-slate-800">{user?.email||"Administrator"}</span><span className="block text-[10px] text-slate-400">{user?.role||"Administrator"}</span></span><ChevronDown size={14} className="text-slate-400"/>
          </button>
          {menuOpen && <div className="absolute right-0 top-12 z-50 w-52 rounded-xl border border-slate-200 bg-white p-2 shadow-xl"><button onClick={()=>{setMenuOpen(false);onLogout();}} className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-rose-700 hover:bg-rose-50"><LogOut size={15}/> Sign out</button></div>}
        </div>
      </div>
    </header>
  );
}
