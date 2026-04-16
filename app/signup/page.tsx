"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Mode = "signup" | "signin" | "forgot";
type View = "form" | "check-email" | "forgot-sent";

export default function SignupPage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("signup");
  const [view, setView] = useState<View>("form");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const gold   = "#9a7040";
  const bg     = "#FAFAF8";
  const text   = "#0a0a12";
  const muted  = "rgba(10,10,18,0.48)";
  const border = "rgba(10,10,18,0.11)";
  const inputBg = "rgba(10,10,18,0.04)";
  const cardBg  = "#ffffff";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/dashboard");
    });
  }, [router]);

  function reset() {
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  function switchMode(m: Mode) {
    setMode(m);
    reset();
  }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setView("check-email");
  }

  async function handleSignIn(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (err) { setError(err.message); return; }
    router.push("/dashboard");
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email) { setError("Enter your email address first."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/dashboard`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setView("forgot-sent");
  }

  const inputStyle: React.CSSProperties = {
    display: "block", width: "100%",
    background: inputBg, border: `1px solid ${border}`,
    color: text, borderRadius: 10, padding: "12px 14px",
    fontSize: 14, outline: "none", boxSizing: "border-box",
    fontFamily: "system-ui, -apple-system, sans-serif",
    transition: "border-color 0.15s",
  };

  const btnPrimary: React.CSSProperties = {
    display: "block", width: "100%",
    background: gold, border: "none", color: "#fff",
    borderRadius: 10, padding: "13px",
    fontSize: 14, fontWeight: 700, cursor: "pointer",
    fontFamily: "system-ui, -apple-system, sans-serif",
    transition: "opacity 0.15s", opacity: loading ? 0.55 : 1,
  };

  // ── Check email ─────────────────────────────────────────────────────────
  if (view === "check-email") {
    return (
      <Shell bg={bg} text={text} gold={gold} muted={muted} border={border} cardBg={cardBg} router={router}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📬</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: text }}>
            Check your email
          </h2>
          <p style={{ fontSize: 14, color: muted, lineHeight: 1.65, marginBottom: "1.5rem", fontFamily: "system-ui,sans-serif" }}>
            We sent a confirmation link to{" "}
            <strong style={{ color: text }}>{email}</strong>.<br />
            Click it to activate your account, then sign in.
          </p>
          <button onClick={() => { setView("form"); switchMode("signin"); }}
            style={{ background: "none", border: "none", color: gold, fontSize: 13, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, fontFamily: "system-ui,sans-serif" }}>
            Back to Sign In
          </button>
        </div>
      </Shell>
    );
  }

  // ── Forgot sent ─────────────────────────────────────────────────────────
  if (view === "forgot-sent") {
    return (
      <Shell bg={bg} text={text} gold={gold} muted={muted} border={border} cardBg={cardBg} router={router}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔑</div>
          <h2 style={{ fontFamily: "Georgia, serif", fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.75rem", color: text }}>
            Reset link sent
          </h2>
          <p style={{ fontSize: 14, color: muted, lineHeight: 1.65, marginBottom: "1.5rem", fontFamily: "system-ui,sans-serif" }}>
            Check <strong style={{ color: text }}>{email}</strong> for a password reset link.
          </p>
          <button onClick={() => { setView("form"); setMode("signin"); setError(""); }}
            style={{ background: "none", border: "none", color: gold, fontSize: 13, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, fontFamily: "system-ui,sans-serif" }}>
            Back to Sign In
          </button>
        </div>
      </Shell>
    );
  }

  // ── Main form ────────────────────────────────────────────────────────────
  return (
    <Shell bg={bg} text={text} gold={gold} muted={muted} border={border} cardBg={cardBg} router={router}>

      {/* Tabs */}
      <div style={{ display: "flex", borderBottom: `1px solid ${border}`, marginBottom: "1.75rem" }}>
        {(["signup", "signin"] as Mode[]).map(m => (
          <button key={m} onClick={() => switchMode(m)} style={{
            flex: 1, paddingBottom: 12, paddingTop: 4,
            background: "none", border: "none",
            borderBottom: mode === m ? `2px solid ${gold}` : "2px solid transparent",
            color: mode === m ? text : muted,
            fontSize: 14, fontWeight: mode === m ? 600 : 400,
            cursor: "pointer", transition: "color 0.15s",
            marginBottom: -1, fontFamily: "system-ui,sans-serif",
          }}>
            {m === "signup" ? "Create account" : "Sign in"}
          </button>
        ))}
      </div>

      {/* Sign up */}
      {mode === "signup" && (
        <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email address" required style={inputStyle} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" required style={inputStyle} />
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm password" required style={inputStyle} />
          {error && <p style={{ fontSize: 13, color: "#dc2626", margin: 0, fontFamily: "system-ui,sans-serif" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ ...btnPrimary, marginTop: "0.25rem" }}>
            {loading ? "Creating account..." : "Create account"}
          </button>
          <p style={{ fontSize: 12, color: muted, textAlign: "center", margin: "0.25rem 0 0", fontFamily: "system-ui,sans-serif" }}>
            Already have an account?{" "}
            <button type="button" onClick={() => switchMode("signin")}
              style={{ background: "none", border: "none", color: gold, fontSize: 12, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, padding: 0, fontFamily: "system-ui,sans-serif" }}>
              Sign in
            </button>
          </p>
        </form>
      )}

      {/* Sign in */}
      {mode === "signin" && (
        <form onSubmit={handleSignIn} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email address" required style={inputStyle} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" required style={inputStyle} />
          {error && <p style={{ fontSize: 13, color: "#dc2626", margin: 0, fontFamily: "system-ui,sans-serif" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ ...btnPrimary, marginTop: "0.25rem" }}>
            {loading ? "Signing in..." : "Sign in"}
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "0.25rem" }}>
            <button type="button" onClick={() => switchMode("signup")}
              style={{ background: "none", border: "none", color: muted, fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "system-ui,sans-serif" }}>
              Create account
            </button>
            <button type="button" onClick={() => { setMode("forgot"); setError(""); }}
              style={{ background: "none", border: "none", color: muted, fontSize: 12, cursor: "pointer", padding: 0, fontFamily: "system-ui,sans-serif" }}>
              Forgot password?
            </button>
          </div>
        </form>
      )}

      {/* Forgot password */}
      {mode === "forgot" && (
        <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={{ fontSize: 14, color: muted, margin: "0 0 0.25rem", fontFamily: "system-ui,sans-serif" }}>
            Enter your email and we&apos;ll send a reset link.
          </p>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email address" required style={inputStyle} />
          {error && <p style={{ fontSize: 13, color: "#dc2626", margin: 0, fontFamily: "system-ui,sans-serif" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ ...btnPrimary, marginTop: "0.25rem" }}>
            {loading ? "Sending..." : "Send reset link"}
          </button>
          <button type="button" onClick={() => { setMode("signin"); setError(""); }}
            style={{ background: "none", border: "none", color: muted, fontSize: 12, cursor: "pointer", padding: "0.25rem 0 0", textAlign: "center", fontFamily: "system-ui,sans-serif" }}>
            ← Back to Sign In
          </button>
        </form>
      )}

    </Shell>
  );
}

function Shell({ bg, text, gold, muted, border, cardBg, router, children }: {
  bg: string; text: string; gold: string; muted: string;
  border: string; cardBg: string;
  router: ReturnType<typeof useRouter>;
  children: React.ReactNode;
}) {
  return (
    <main style={{
      background: bg, color: text, minHeight: "100vh",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", padding: "1.5rem",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <button onClick={() => router.push("/")}
        style={{ position: "fixed", top: "1.25rem", left: "1.5rem", background: "none", border: "none", color: muted, fontSize: 13, cursor: "pointer", display: "flex", alignItems: "center", gap: "0.4rem", fontFamily: "system-ui,sans-serif" }}>
        ← Home
      </button>

      {/* Logo */}
      <h1 style={{ fontFamily: "Georgia, serif", fontSize: "2.25rem", fontWeight: 600, letterSpacing: "-0.03em", marginBottom: "2rem", textAlign: "center", color: text }}>
        Sheldon<span style={{ color: gold }}>AI</span>
      </h1>

      {/* Card */}
      <div style={{ width: "100%", maxWidth: 400, background: cardBg, border: `1px solid ${border}`, borderRadius: 18, padding: "2rem", boxShadow: "0 1px 20px rgba(10,10,18,0.06)" }}>
        {children}
      </div>

      <p style={{ marginTop: "1.5rem", fontSize: 12, color: "rgba(10,10,18,0.22)", textAlign: "center", fontFamily: "system-ui,sans-serif" }}>
        By signing up you agree to our Terms and Privacy Policy.
      </p>
    </main>
  );
}
