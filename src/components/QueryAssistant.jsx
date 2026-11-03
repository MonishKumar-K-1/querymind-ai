import { useEffect, useRef, useState } from "react";
import { ArrowUp, AudioLines, Database, Lightbulb, Mic, MicOff, Sparkles } from "lucide-react";

const suggestions = [
  "Show the top five customers by total sales",
  "Find the average salary in each department",
  "List employees who joined after 1 January 2024",
];

export default function QueryAssistant({ onRun, busy = false }) {
  const [question, setQuestion] = useState("");
  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const recognitionRef = useRef(null);

  useEffect(() => () => recognitionRef.current?.stop(), []);

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setVoiceError("Voice input is not supported in this browser. Try Chrome or Edge.");
      return;
    }
    setVoiceError("");
    const recognition = new SpeechRecognition();
    recognition.lang = "en-IN";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognition.onstart = () => setListening(true);
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results).map((item) => item[0].transcript).join("");
      setQuestion(transcript);
    };
    recognition.onerror = (event) => {
      setVoiceError(event.error === "not-allowed" ? "Microphone permission was denied." : "Voice recognition could not complete. Please try again.");
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
  };

  const submit = (event) => {
    event.preventDefault();
    if (!question.trim() || busy) return;
    onRun(question.trim());
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_3px_16px_rgba(15,23,42,.035)]">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-blue-50 text-blue-600"><Sparkles size={20}/></span>
          <div><h3 className="text-[14px] font-bold text-slate-900">Ask your database</h3><p className="mt-0.5 text-[11px] text-slate-500">Ask in plain English. QueryMind will translate it into SQL.</p></div>
        </div>
        <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-[10px] font-semibold text-amber-700"><span className="h-1.5 w-1.5 rounded-full bg-amber-500"/> Backend not connected yet</span>
      </div>

      <form onSubmit={submit} className="p-4 sm:p-6">
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition focus-within:border-blue-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-blue-50">
          <textarea value={question} onChange={(e) => setQuestion(e.target.value)} rows={3}
            placeholder="For example: Show the top five customers by total sales..."
            className="min-h-[86px] w-full resize-y bg-transparent text-[13px] leading-6 text-slate-800 outline-none placeholder:text-slate-400"/>
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3">
            <div className="flex items-center gap-2 text-[11px] text-slate-400"><Database size={14}/> Connected database: <span className="font-semibold text-slate-500">SQLite · pending</span></div>
            <div className="flex items-center gap-2">
              <button type="button" onClick={listening ? () => recognitionRef.current?.stop() : startVoiceInput}
                className={`flex h-9 items-center gap-2 rounded-lg border px-3 text-xs font-semibold transition ${listening ? "border-rose-200 bg-rose-50 text-rose-600" : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-600"}`}>
                {listening ? <MicOff size={15}/> : <Mic size={15}/>}<span className="hidden xs:inline">{listening ? "Stop listening" : "Voice input"}</span>
              </button>
              <button type="submit" disabled={!question.trim() || busy} className="flex h-9 items-center gap-2 rounded-lg bg-blue-600 px-4 text-xs font-bold text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 disabled:opacity-45">
                {busy ? "Processing..." : "Generate SQL"} <ArrowUp size={15}/>
              </button>
            </div>
          </div>
        </div>
        {listening && <p className="mt-2 flex items-center gap-2 text-[11px] font-medium text-rose-600"><AudioLines size={14}/> Listening… speak your question.</p>}
        {voiceError && <p role="alert" className="mt-2 text-[11px] text-rose-600">{voiceError}</p>}
        <div className="mt-5">
          <div className="mb-3 flex items-center gap-2 text-[10px] font-bold tracking-[.13em] text-slate-400"><Lightbulb size={14} className="text-amber-500"/> TRY AN EXAMPLE</div>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((item) => <button key={item} type="button" onClick={() => setQuestion(item)} className="rounded-full border border-slate-200 bg-white px-3 py-2 text-[10px] font-medium text-slate-600 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">{item}</button>)}
          </div>
        </div>
      </form>
    </section>
  );
}
