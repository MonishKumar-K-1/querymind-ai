
import { useState } from "react";
import {
  Command,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  ArrowRight,
  Database,
  Sparkles,
  Mic2,
  BarChart3,
} from "lucide-react";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setBusy(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Unable to sign in.");
      }

      onLogin(data);
    } catch (err) {
      setError(
        err.message || "Unable to reach the authentication service."
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#0b1220] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_.92fr]">

        {/* LEFT SIDE - BRAND AND PRODUCT INTRODUCTION */}

        <section className="relative hidden min-h-screen overflow-hidden bg-[#101d33] px-10 py-10 lg:flex lg:flex-col lg:justify-between xl:px-16 xl:py-12">

          <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-blue-600/20 blur-[100px]" />

          <div className="pointer-events-none absolute -bottom-40 right-0 h-[28rem] w-[28rem] rounded-full bg-cyan-500/10 blur-[110px]" />

          {/* Brand */}

          <div className="relative flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl border border-blue-300/20 bg-blue-500 text-white shadow-lg shadow-blue-950/40">
              <Command size={24} strokeWidth={2.2} />
            </div>

            <div>
              <p className="text-[21px] font-extrabold tracking-tight">
                QueryMind <span className="text-blue-400">AI</span>
              </p>

              <p className="mt-0.5 text-[10px] font-bold tracking-[.22em] text-slate-400">
                NATURAL LANGUAGE TO SQL
              </p>
            </div>
          </div>

          {/* Introduction */}

          <div className="relative my-10 w-full max-w-[680px] xl:my-12">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-blue-300/20 bg-blue-400/10 px-4 py-2.5 text-sm font-semibold text-blue-100">
              <Sparkles size={15} />
              A smarter way to work with data
            </div>

            <h1 className="max-w-[620px] text-[42px] font-extrabold leading-[1.1] tracking-tight xl:text-[58px]">
              Ask questions.
              <br />
              Understand your{" "}
              <span className="text-blue-400">data.</span>
            </h1>

            <p className="mt-6 max-w-[560px] text-[17px] leading-8 text-slate-300">
              QueryMind AI turns everyday language into secure SQL queries,
              so you can explore your database and understand results
              without writing SQL manually.
            </p>

            {/* Workflow */}

            <div className="mt-9 rounded-3xl border border-white/10 bg-[#172740]/90 p-5 shadow-2xl shadow-black/20 backdrop-blur-sm xl:mt-10 xl:p-6">

              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                    <p className="text-sm font-bold tracking-wide text-white">
                    HOW QUERYMIND WORKS
                  </p>

                  <p className="mt-1.5 text-sm leading-5 text-slate-400">
                    From a question to an understandable answer
                  </p>
                </div>

                <span className="inline-flex shrink-0 items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1.5 text-xs font-bold tracking-wide text-emerald-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  READ ONLY
                </span>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">

                <div className="rounded-2xl border border-white/10 bg-white/[.045] p-4 xl:p-5">
                  <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-blue-500/15 text-blue-300">
                    <Mic2 size={20} />
                  </div>

                  <p className="text-[15px] font-bold text-white">
                    Ask naturally
                  </p>

                  <p className="mt-2 text-[13px] leading-5 text-slate-400">
                    "Show top customers by sales."
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[.045] p-4 xl:p-5">
                  <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-violet-500/15 text-violet-300">
                    <Command size={20} />
                  </div>

                  <p className="text-[15px] font-bold text-white">
                    Generate SQL
                  </p>

                  <p className="mt-2 text-[13px] leading-5 text-slate-400">
                    Your question becomes a SQL query.
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[.045] p-4 xl:p-5">
                  <div className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-emerald-500/15 text-emerald-300">
                    <BarChart3 size={20} />
                  </div>

                  <p className="text-[15px] font-bold text-white">
                    Explore results
                  </p>

                  <p className="mt-2 text-[13px] leading-5 text-slate-400">
                    Review data and clear explanations.
                  </p>
                </div>

              </div>
            </div>

            {/* Feature cards */}

            <div className="mt-5 grid gap-3 sm:grid-cols-2">

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-4">
                <Database
                  size={21}
                  className="shrink-0 text-blue-300"
                />

                <div>
                  <p className="text-[15px] font-semibold text-white">
                    Database insights
                  </p>

                  <p className="mt-1 text-[13px] leading-5 text-slate-400">
                    Explore structured records.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[.04] p-4">
                <ShieldCheck
                  size={21}
                  className="shrink-0 text-emerald-300"
                />

                <div>
                  <p className="text-[15px] font-semibold text-white">
                    Read-only protection
                  </p>

                  <p className="mt-1 text-[13px] leading-5 text-slate-400">
                    Changes to data are blocked.
                  </p>
                </div>
              </div>

            </div>
          </div>

          {/* Footer */}

          <div className="relative flex items-center justify-between border-t border-white/10 pt-5 text-xs text-slate-500">
            <span>© 2026 QueryMind AI</span>
            <span>Intelligent database workspace</span>
          </div>
        </section>

        {/* RIGHT SIDE - LOGIN */}

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0b1220] px-5 py-8 sm:px-10 sm:py-10 lg:px-12 xl:px-16">

          <div className="pointer-events-none absolute -right-32 -top-24 h-80 w-80 rounded-full bg-blue-600/10 blur-[100px]" />

          <div className="relative w-full max-w-[480px]">

            {/* Mobile brand */}

            <div className="mb-8 flex items-center gap-3 sm:mb-10 lg:hidden">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-blue-600">
                <Command size={22} />
              </div>

              <div>
                <p className="text-xl font-extrabold">
                  QueryMind <span className="text-blue-400">AI</span>
                </p>

                <p className="mt-0.5 text-[10px] font-bold tracking-[.2em] text-slate-400">
                  DATABASE INTELLIGENCE
                </p>
              </div>
            </div>

            {/* Login card */}

            <div className="rounded-[28px] border border-white/10 bg-[#142137] p-6 shadow-2xl shadow-black/30 sm:p-9 lg:p-10">

              <div className="mb-8">

                <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl border border-blue-400/20 bg-blue-500/15 text-blue-300">
                  <LockKeyhole size={25} />
                </div>

                <p className="text-[13px] font-bold uppercase tracking-[.16em] text-blue-300 sm:text-sm">
                  Administrator access
                </p>

                <h2 className="mt-3 text-[32px] font-extrabold leading-tight tracking-tight text-white sm:text-[36px]">
                  Welcome back
                </h2>

                <p className="mt-3 text-base leading-7 text-slate-300">
                  Sign in to continue to your QueryMind AI workspace.
                </p>

              </div>

              {/* Login form */}

              <form onSubmit={submit} className="space-y-5 sm:space-y-6">

                {/* Email */}

                <label className="block">

                  <span className="mb-2.5 block text-[15px] font-semibold text-slate-100">
                    Email address
                  </span>

                  <span className="flex min-h-[58px] items-center gap-3 rounded-xl border border-slate-600/80 bg-[#0d182a] px-4 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/15">

                    <Mail
                      size={19}
                      className="shrink-0 text-slate-400"
                    />

                    <input
                      required
                      type="email"
                      autoComplete="username"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder="admin@yourcompany.com"
                      className="h-[56px] w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-slate-500"
                    />

                  </span>
                </label>

                {/* Password */}

                <label className="block">

                  <span className="mb-2.5 block text-[15px] font-semibold text-slate-100">
                    Password
                  </span>

                  <span className="flex min-h-[58px] items-center gap-3 rounded-xl border border-slate-600/80 bg-[#0d182a] px-4 transition focus-within:border-blue-400 focus-within:ring-4 focus-within:ring-blue-500/15">

                    <LockKeyhole
                      size={19}
                      className="shrink-0 text-slate-400"
                    />

                    <input
                      required
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="Enter your password"
                      className="h-[56px] w-full min-w-0 bg-transparent text-base text-white outline-none placeholder:text-slate-500"
                    />

                    <button
                      type="button"
                      onClick={() => setShowPassword((value) => !value)}
                      className="shrink-0 rounded-md p-1 text-slate-400 transition hover:text-white"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </span>
                </label>

                {/* Error message */}

                {error && (
                  <div
                    role="alert"
                    className="rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm leading-6 text-rose-200"
                  >
                    {error}
                  </div>
                )}

                {/* Submit */}

                <button
                  type="submit"
                  disabled={busy}
                  className="flex h-[58px] w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-base font-bold text-white shadow-lg shadow-blue-950/40 transition hover:bg-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-400/25 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {busy ? "Signing in..." : "Sign in to workspace"}

                  {!busy && <ArrowRight size={18} />}
                </button>

              </form>

              {/* Security information */}

              <div className="mt-7 flex items-start gap-3 rounded-2xl border border-emerald-400/15 bg-emerald-400/[.06] p-4">

                <ShieldCheck
                  size={20}
                  className="mt-0.5 shrink-0 text-emerald-300"
                />

                <div>
                  <p className="text-[15px] font-semibold text-slate-100">
                    Your workspace is protected
                  </p>

                  <p className="mt-1.5 text-[13px] leading-5 text-slate-300">
                    Access is limited to the administrator account configured
                    by your application owner.
                  </p>
                </div>

              </div>
            </div>

            <p className="mt-5 text-center text-sm text-slate-500 sm:mt-6">
              Secure access · QueryMind AI
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}
