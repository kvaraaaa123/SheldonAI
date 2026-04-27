"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

type Mode = "signup" | "signin" | "forgot";
type View = "form" | "check-email" | "forgot-sent";

export default function SignupPage() {
  const router = useRouter();
  const [mode, setMode]                   = useState<Mode>("signup");
  const [view, setView]                   = useState<View>("form");
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError]                 = useState("");
  const [loading, setLoading]             = useState(false);
  const [role, setRole]           = useState<'student' | 'counselor'>('student');
  const [honeypot,  setHoneypot]  = useState("");
  const [num1,      setNum1]      = useState(0);
  const [num2,      setNum2]      = useState(0);
  const [mathAnswer,setMathAnswer]= useState("");

  const gold   = "#9a7040";
  const bg     = "#FAFAF8";
  const text   = "#0a0a12";
  const muted  = "rgba(10,10,18,0.46)";
  const border = "rgba(10,10,18,0.11)";

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.push("/dashboard");
    });
    setNum1(Math.floor(Math.random() * 9) + 1);
    setNum2(Math.floor(Math.random() * 9) + 1);
  }, [router]);

  function reset() { setError(""); setPassword(""); setConfirmPassword(""); }
  function switchMode(m: Mode) { setMode(m); reset(); }

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    // Bot protection 1: honeypot
    if (honeypot) return;
    // Bot protection 2: math verification
    if (mathAnswer.trim() !== String(num1 + num2)) {
      setError("Please answer the verification question correctly.");
      return;
    }
    // Bot protection 3: client-side rate limit
    const now = Date.now();
    const raw = localStorage.getItem("signup_attempts");
    const attempts: number[] = raw ? JSON.parse(raw) : [];
    const recent = attempts.filter((t: number) => now - t < 5 * 60 * 1000);
    if (recent.length >= 3) {
      setError("Too many attempts. Please wait a few minutes before trying again.");
      return;
    }
    localStorage.setItem("signup_attempts", JSON.stringify([...recent, now]));

    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    setLoading(true);
    const { data, error: err } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: 'https://sheldon-ai-red.vercel.app/dashboard' } });
    setLoading(false);
    if (err) { setError(err.message); return; }
    if (data?.user) {
      await supabase.from('profiles').upsert({
        user_id: data.user.id,
        email: data.user.email,
        role: role,
        updated_at: new Date().toISOString()
      }, { onConflict: 'user_id' })

      if (role === 'counselor') {
        router.push('/counselor/dashboard')
      } else {
        router.push('/dashboard')
      }
    }
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
    if (!email) { setError("Enter your email first."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'https://sheldon-ai-red.vercel.app/dashboard',
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setView("forgot-sent");
  }

  const input: React.CSSProperties = {
    display: "block", width: "100%",
    background: "rgba(10,10,18,0.04)", border: `1px solid ${border}`,
    borderRadius: 10, padding: "12px 14px", fontSize: 14, color: text,
    outline: "none", fontFamily: "system-ui,-apple-system,sans-serif",
    boxSizing: "border-box", transition: "border-color .15s",
  };

  const btnGold: React.CSSProperties = {
    display: "block", width: "100%",
    background: gold, border: "none", color: "#fff",
    borderRadius: 10, padding: "13px", fontSize: 14, fontWeight: 700,
    cursor: loading ? "not-allowed" : "pointer",
    opacity: loading ? 0.55 : 1,
    fontFamily: "system-ui,-apple-system,sans-serif",
    transition: "opacity .15s",
  };

  // ── Post-submit views ─────────────────────────────────────────────────────
  if (view === "check-email") return (
    <Shell bg={bg} text={text} gold={gold} muted={muted} border={border} router={router}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>📬</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "1.2rem", fontWeight: 600, color: text, marginBottom: "0.75rem" }}>Check your email</h2>
        <p style={{ fontSize: 14, color: muted, lineHeight: 1.65, marginBottom: "1.5rem", fontFamily: "system-ui,sans-serif" }}>
          We sent a confirmation link to <strong style={{ color: text }}>{email}</strong>.<br />
          Click it to activate your account, then sign in.
        </p>
        <button onClick={() => { setView("form"); switchMode("signin"); }}
          style={{ background: "none", border: "none", color: gold, fontSize: 13, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, fontFamily: "system-ui,sans-serif" }}>
          Back to sign in
        </button>
      </div>
    </Shell>
  );

  if (view === "forgot-sent") return (
    <Shell bg={bg} text={text} gold={gold} muted={muted} border={border} router={router}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>🔑</div>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "1.2rem", fontWeight: 600, color: text, marginBottom: "0.75rem" }}>Reset link sent</h2>
        <p style={{ fontSize: 14, color: muted, lineHeight: 1.65, marginBottom: "1.5rem", fontFamily: "system-ui,sans-serif" }}>
          Check <strong style={{ color: text }}>{email}</strong> for a password reset link.
        </p>
        <button onClick={() => { setView("form"); setMode("signin"); setError(""); }}
          style={{ background: "none", border: "none", color: gold, fontSize: 13, cursor: "pointer", textDecoration: "underline", textUnderlineOffset: 3, fontFamily: "system-ui,sans-serif" }}>
          Back to sign in
        </button>
      </div>
    </Shell>
  );

  // ── Main form ─────────────────────────────────────────────────────────────
  return (
    <Shell bg={bg} text={text} gold={gold} muted={muted} border={border} router={router}>

      {/* Mode toggle */}
      <div style={{ display: "flex", borderBottom: `1px solid ${border}`, marginBottom: "1.75rem" }}>
        {(["signup","signin"] as Mode[]).map(m => (
          <button key={m} onClick={() => switchMode(m)} style={{
            flex: 1, background: "none", border: "none",
            paddingTop: 4, paddingBottom: 12,
            borderBottom: mode === m ? `2px solid ${gold}` : "2px solid transparent",
            color: mode === m ? text : muted, fontSize: 14,
            fontWeight: mode === m ? 600 : 400, cursor: "pointer",
            fontFamily: "system-ui,sans-serif", marginBottom: -1, transition: "color .15s",
          }}>
            {m === "signup" ? "Create account" : "Sign in"}
          </button>
        ))}
      </div>

      {/* Sign up */}
      {mode === "signup" && (
        <form onSubmit={handleSignUp} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {/* Honeypot — hidden from humans, bots fill it */}
          <input
            type="text"
            name="website"
            value={honeypot}
            onChange={e => setHoneypot(e.target.value)}
            tabIndex={-1}
            autoComplete="off"
            style={{ display: "none", position: "absolute", left: -9999 }}
          />
          <input type="email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)} style={input} />
          <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} style={input} />
          <input type="password" placeholder="Confirm password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={input} />

          {/* Role selection */}
          <div style={{ marginBottom: 20 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: '#0a0a12', marginBottom: 10, letterSpacing: '0.03em' }}>
              I am a...
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div
                onClick={() => setRole('student')}
                style={{
                  border: role === 'student' ? '2px solid #9a7040' : '1.5px solid rgba(0,0,0,0.12)',
                  background: role === 'student' ? 'rgba(154,112,64,0.07)' : '#fff',
                  borderRadius: 12,
                  padding: '18px 14px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 6 }}>🎓</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0a0a12', marginBottom: 3 }}>Student</div>
                <div style={{ fontSize: 11, color: 'rgba(10,10,18,0.45)', lineHeight: 1.5 }}>Get personalized college admissions guidance</div>
              </div>
              <div
                onClick={() => setRole('counselor')}
                style={{
                  border: role === 'counselor' ? '2px solid #9a7040' : '1.5px solid rgba(0,0,0,0.12)',
                  background: role === 'counselor' ? 'rgba(154,112,64,0.07)' : '#fff',
                  borderRadius: 12,
                  padding: '18px 14px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.15s'
                }}
              >
                <div style={{ fontSize: 26, marginBottom: 6 }}>📋</div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#0a0a12', marginBottom: 3 }}>Counselor</div>
                <div style={{ fontSize: 11, color: 'rgba(10,10,18,0.45)', lineHeight: 1.5 }}>Manage students and supercharge your workflow</div>
              </div>
            </div>
          </div>

          {/* Math verification */}
          <div>
            <label style={{ display: "block", fontSize: 13, color: muted, marginBottom: 6, fontFamily: "system-ui,sans-serif" }}>
              Quick check: what is {num1} + {num2}?
            </label>
            <input
              type="text"
              value={mathAnswer}
              onChange={e => setMathAnswer(e.target.value)}
              style={{ ...input, width: 80, display: "inline-block" }}
              placeholder="?"
            />
          </div>
          {error && <p style={{ fontSize: 13, color: "#dc2626", margin: 0, fontFamily: "system-ui,sans-serif" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ ...btnGold, marginTop: "0.25rem" }}>
            {loading ? "Creating account…" : "Create account"}
          </button>
          <p style={{ textAlign: "center", fontSize: 12, color: muted, margin: "0.25rem 0 0", fontFamily: "system-ui,sans-serif" }}>
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
          <input type="email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)} style={input} />
          <input type="password" placeholder="Password" required value={password} onChange={e => setPassword(e.target.value)} style={input} />
          {error && <p style={{ fontSize: 13, color: "#dc2626", margin: 0, fontFamily: "system-ui,sans-serif" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ ...btnGold, marginTop: "0.25rem" }}>
            {loading ? "Signing in…" : "Sign in"}
          </button>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.25rem" }}>
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

      {/* Forgot */}
      {mode === "forgot" && (
        <form onSubmit={handleForgot} style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          <p style={{ fontSize: 14, color: muted, margin: "0 0 0.25rem", fontFamily: "system-ui,sans-serif" }}>
            Enter your email and we&apos;ll send a reset link.
          </p>
          <input type="email" placeholder="Email address" required value={email} onChange={e => setEmail(e.target.value)} style={input} />
          {error && <p style={{ fontSize: 13, color: "#dc2626", margin: 0, fontFamily: "system-ui,sans-serif" }}>{error}</p>}
          <button type="submit" disabled={loading} style={{ ...btnGold, marginTop: "0.25rem" }}>
            {loading ? "Sending…" : "Send reset link"}
          </button>
          <button type="button" onClick={() => { setMode("signin"); setError(""); }}
            style={{ background: "none", border: "none", color: muted, fontSize: 12, cursor: "pointer", textAlign: "center", padding: "0.25rem 0 0", fontFamily: "system-ui,sans-serif" }}>
            ← Back to sign in
          </button>
        </form>
      )}

    </Shell>
  );
}

// ── Shell ─────────────────────────────────────────────────────────────────────
function Shell({ bg, text, gold, muted, border, router, children }: {
  bg: string; text: string; gold: string; muted: string; border: string;
  router: ReturnType<typeof useRouter>;
  children: React.ReactNode;
}) {
  return (
    <main style={{ background: bg, minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "1.5rem" }}>
      <button onClick={() => router.push("/")}
        style={{ position: "fixed", top: "1.25rem", left: "1.5rem", background: "none", border: "none", color: muted, fontSize: 13, cursor: "pointer", fontFamily: "system-ui,sans-serif" }}>
        ← Home
      </button>

      <h1 style={{ fontFamily: "Georgia,serif", fontSize: "2.2rem", fontWeight: 600, letterSpacing: "-0.03em", color: text, marginBottom: "2rem", textAlign: "center" }}>
        Sheldon<span style={{ color: gold }}>AI</span>
      </h1>

      <div style={{ width: "100%", maxWidth: 400, background: "#fff", border: `1px solid ${border}`, borderRadius: 18, padding: "2rem", boxShadow: "0 1px 24px rgba(10,10,18,0.06)" }}>
        {children}
      </div>

      <p style={{ marginTop: "1.5rem", fontSize: 12, color: "rgba(10,10,18,0.22)", textAlign: "center", fontFamily: "system-ui,sans-serif" }}>
        By signing up you agree to our Terms and Privacy Policy.
      </p>
    </main>
  );
}
