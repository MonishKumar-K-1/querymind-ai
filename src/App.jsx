
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";

export default function App() {
  const [session, setSession] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("querymind-session") || "null");
    } catch {
      return null;
    }
  });

  const [checking, setChecking] = useState(Boolean(session?.token));

  useEffect(() => {
    let active = true;

    async function verifySession() {
      if (!session?.token) {
        setChecking(false);
        return;
      }

      try {
        const response = await fetch("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${session.token}`,
          },
        });

        if (!response.ok) {
          throw new Error("Session expired");
        }

        const data = await response.json();
        const updatedSession = {
          ...session,
          user: data.user,
        };

        if (active) {
          setSession(updatedSession);
          localStorage.setItem(
            "querymind-session",
            JSON.stringify(updatedSession)
          );
        }
      } catch {
        if (active) {
          localStorage.removeItem("querymind-session");
          setSession(null);
        }
      } finally {
        if (active) setChecking(false);
      }
    }

    verifySession();

    return () => {
      active = false;
    };
  }, []);

  function handleLogin(data) {
    const newSession = {
      token: data.token,
      user: data.user,
    };

    localStorage.setItem(
      "querymind-session",
      JSON.stringify(newSession)
    );

    setSession(newSession);
  }

  function handleLogout() {
    localStorage.removeItem("querymind-session");
    setSession(null);
  }

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#f4f7fc] text-sm font-semibold text-slate-500">
        Verifying secure session...
      </div>
    );
  }

  if (!session?.token || !session?.user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Dashboard
      session={session}
      onLogout={handleLogout}
    />
  );
}
