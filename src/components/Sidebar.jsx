import {
  Activity, AudioLines, Database, History, Settings2, CircleHelp,
  Command, X, PanelLeftClose, ShieldCheck
} from "lucide-react";

const items = [
  { label: "Overview", icon: Activity },
  { label: "AI Assistant", icon: AudioLines },
  { label: "Database Explorer", icon: Database },
  { label: "Query History", icon: History },
];

export default function Sidebar({ activePage, onNavigate, mobileOpen, onClose }) {
  const go = (page) => { onNavigate(page); onClose(); };
  return (
    <>
      {mobileOpen && <button aria-label="Close navigation overlay" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden"/>}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-[272px] flex-col border-r border-white/10 bg-[#111b2e] text-white transition-transform duration-200 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-[78px] items-center justify-between border-b border-white/10 px-6">
          <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-xl bg-blue-500 shadow-lg shadow-blue-950/40"><Command size={21} strokeWidth={2.4}/></div><div><div className="font-[Manrope] text-[17px] font-extrabold tracking-tight">QueryMind <span className="text-blue-400">AI</span></div><div className="mt-0.5 text-[9px] font-semibold tracking-[.19em] text-slate-400">NATURAL LANGUAGE TO SQL</div></div></div>
          <button onClick={onClose} className="rounded-lg p-2 text-slate-400 hover:bg-white/10 lg:hidden" aria-label="Close menu"><X size={18}/></button><PanelLeftClose className="hidden text-slate-500 lg:block" size={17}/>
        </div>
        <div className="px-5 pt-7"><p className="mb-3 px-2 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Workspace</p><div className="rounded-xl border border-white/10 bg-white/[.045] p-3.5"><div className="flex items-center gap-2.5"><span className="h-2 w-2 rounded-full bg-emerald-400"/><span className="text-[13px] font-semibold text-slate-100">Private workspace</span></div><p className="mt-1.5 pl-[18px] text-[11px] text-slate-400">Administrator access</p></div></div>
        <nav className="flex-1 px-4 pt-8"><p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[.18em] text-slate-500">Explore</p><div className="space-y-1.5">{items.map(({label,icon:Icon})=>{const active=activePage===label;return <button key={label} onClick={()=>go(label)} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-left text-[13px] font-medium transition ${active?"bg-blue-500 text-white shadow-lg shadow-blue-950/30":"text-slate-400 hover:bg-white/[.07] hover:text-white"}`}><Icon size={17}/><span>{label}</span>{active&&<span className="ml-auto h-1.5 w-1.5 rounded-full bg-white"/>}</button>;})}</div></nav>
        <div className="space-y-1 border-t border-white/10 p-4">
          <button onClick={()=>go("Settings")} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] ${activePage==="Settings"?"bg-blue-500 text-white":"text-slate-400 hover:bg-white/[.07] hover:text-white"}`}><Settings2 size={17}/> Settings</button>
          <button onClick={()=>go("Help & Support")} className={`flex w-full items-center gap-3 rounded-xl px-3.5 py-3 text-[13px] ${activePage==="Help & Support"?"bg-blue-500 text-white":"text-slate-400 hover:bg-white/[.07] hover:text-white"}`}><CircleHelp size={17}/> Help & Support</button>
          <div className="mt-4 flex items-center gap-3 rounded-xl bg-white/[.06] p-3"><div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/15 text-emerald-200"><ShieldCheck size={17}/></div><div className="min-w-0"><p className="text-xs font-semibold text-slate-100">Secure session</p><p className="mt-0.5 text-[10px] text-slate-400">Administrator</p></div></div>
        </div>
      </aside>
    </>
  );
}
