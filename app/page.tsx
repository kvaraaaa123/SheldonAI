"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

type AuthTab = "signin" | "signup";
type View = "auth" | "check-email" | "forgot-sent";

export default function Home() {
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();

  const [tab,             setTab]             = useState<AuthTab>("signin");
  const [view,            setView]            = useState<View>("auth");
  const [email,           setEmail]           = useState("");
  const [password,        setPassword]        = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error,           setError]           = useState("");
  const [loading,         setLoading]         = useState(false);
  const [showForgot,      setShowForgot]      = useState(false);
  const [existingEmail,   setExistingEmail]   = useState<string | null>(null);

  // Theme colors
  const bg          = isDark ? "#080810"                : "#FAFAF5";
  const text        = isDark ? "#FAFAF5"                : "#080810";
  const gold        = isDark ? "#C9A96E"                : "#9a7040";
  const muted       = isDark ? "rgba(250,250,245,0.40)" : "rgba(8,8,16,0.40)";
  const borderCol   = isDark ? "rgba(255,255,255,0.10)" : "rgba(0,0,0,0.12)";
  const inputBg     = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";
  const cardBg      = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";

  // Check for existing session — show "Continue as" prompt instead of auto-redirecting
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session?.user.email) setExistingEmail(data.session.user.email);
    });
  }, []);

  function resetForm() {
    setError("");
    setPassword("");
    setConfirmPassword("");
  }

  function switchTab(t: AuthTab) {
    setTab(t);
    setShowForgot(false);
    resetForm();
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

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (!email) { setError("Enter your email address above first."); return; }
    setLoading(true);
    const { error: err } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/annotate`,
    });
    setLoading(false);
    if (err) { setError(err.message); return; }
    setView("forgot-sent");
  }

  const inputStyle: React.CSSProperties = {
    background: inputBg,
    border: `1px solid ${borderCol}`,
    color: text,
    borderRadius: "0.75rem",
    padding: "0.75rem 1rem",
    fontSize: "14px",
    width: "100%",
    outline: "none",
    transition: "border-color 0.15s",
  };

  // ── Already logged in ────────────────────────────────────────────────────
  if (existingEmail) {
    return (
      <Shell isDark={isDark} bg={bg} text={text} gold={gold} muted={muted} toggleTheme={toggleTheme}>
        <div className="text-center space-y-5">
          <p className="text-[13px]" style={{ color: muted }}>Signed in as</p>
          <p className="text-[15px] font-medium" style={{ color: text }}>{existingEmail}</p>
          <button onClick={() => router.push("/dashboard")}
            className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all"
            style={{ background: gold, color: isDark ? "#080810" : "#FAFAF5" }}>
            Continue →
          </button>
          <button
            onClick={async () => {
              await supabase.auth.signOut();
              setExistingEmail(null);
            }}
            className="w-full text-[13px] transition-colors underline underline-offset-2"
            style={{ color: muted }}>
            Sign in as someone else
          </button>
        </div>
      </Shell>
    );
  }

  // ── Post-submit views ────────────────────────────────────────────────────
  if (view === "check-email") {
    return (
      <Shell isDark={isDark} bg={bg} text={text} gold={gold} muted={muted} toggleTheme={toggleTheme}>
        <div className="text-center space-y-4">
          <div className="text-4xl">📬</div>
          <h2 className="text-xl font-semibold">Check your email</h2>
          <p className="text-[14px] leading-relaxed max-w-xs mx-auto" style={{ color: muted }}>
            We sent a confirmation link to <strong style={{ color: text }}>{email}</strong>.
            Click it to activate your account, then sign in. You will be redirected to your dashboard after confirming your email.
          </p>
          <button onClick={() => { setView("auth"); setTab("signin"); }}
            className="text-[13px] underline underline-offset-4 transition-colors"
            style={{ color: gold }}>
            Back to Sign In
          </button>
        </div>
      </Shell>
    );
  }

  if (view === "forgot-sent") {
    return (
      <Shell isDark={isDark} bg={bg} text={text} gold={gold} muted={muted} toggleTheme={toggleTheme}>
        <div className="text-center space-y-4">
          <div className="text-4xl">🔑</div>
          <h2 className="text-xl font-semibold">Reset link sent</h2>
          <p className="text-[14px] leading-relaxed max-w-xs mx-auto" style={{ color: muted }}>
            Check <strong style={{ color: text }}>{email}</strong> for a password reset link.
          </p>
          <button onClick={() => { setView("auth"); setShowForgot(false); }}
            className="text-[13px] underline underline-offset-4 transition-colors"
            style={{ color: gold }}>
            Back to Sign In
          </button>
        </div>
      </Shell>
    );
  }

  // ── Main auth view ────────────────────────────────────────────────────────
  return (
    <Shell isDark={isDark} bg={bg} text={text} gold={gold} muted={muted} toggleTheme={toggleTheme}>

      {/* Tabs */}
      <div className="flex mb-6 border-b" style={{ borderColor: borderCol }}>
        {(["signin", "signup"] as AuthTab[]).map(t => (
          <button key={t} onClick={() => switchTab(t)}
            className="flex-1 py-2.5 text-[14px] font-medium transition-colors relative"
            style={{ color: tab === t ? text : muted }}>
            {t === "signin" ? "Sign In" : "Sign Up"}
            {tab === t && (
              <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full" style={{ background: gold }} />
            )}
          </button>
        ))}
      </div>

      {/* Sign In */}
      {tab === "signin" && !showForgot && (
        <form onSubmit={handleSignIn} className="space-y-3">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required style={inputStyle} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" required style={inputStyle} />

          {error && <p className="text-[13px] text-red-400">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all disabled:opacity-40"
            style={{ background: gold, color: isDark ? "#080810" : "#FAFAF5" }}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-center pt-1">
            <button type="button" onClick={() => { setShowForgot(true); setError(""); }}
              className="text-[12px] transition-colors"
              style={{ color: muted }}>
              Forgot password?
            </button>
          </div>
        </form>
      )}

      {/* Forgot password */}
      {tab === "signin" && showForgot && (
        <form onSubmit={handleForgotPassword} className="space-y-3">
          <p className="text-[13px] mb-1" style={{ color: muted }}>
            Enter your email and we'll send a reset link.
          </p>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required style={inputStyle} />

          {error && <p className="text-[13px] text-red-400">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all disabled:opacity-40"
            style={{ background: gold, color: isDark ? "#080810" : "#FAFAF5" }}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>

          <div className="text-center pt-1">
            <button type="button" onClick={() => { setShowForgot(false); setError(""); }}
              className="text-[12px] transition-colors"
              style={{ color: muted }}>
              ← Back to Sign In
            </button>
          </div>
        </form>
      )}

      {/* Sign Up */}
      {tab === "signup" && (
        <form onSubmit={handleSignUp} className="space-y-3">
          <input type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email" required style={inputStyle} />
          <input type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" required style={inputStyle} />
          <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
            placeholder="Confirm password" required style={inputStyle} />

          {error && <p className="text-[13px] text-red-400">{error}</p>}

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl text-[14px] font-semibold transition-all disabled:opacity-40"
            style={{ background: gold, color: isDark ? "#080810" : "#FAFAF5" }}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
      )}

    </Shell>
  );
}

// ── Layout shell shared across all views ─────────────────────────────────────
function Shell({ isDark, bg, text, gold, muted, toggleTheme, children }: {
  isDark: boolean;
  bg: string;
  text: string;
  gold: string;
  muted: string;
  toggleTheme: () => void;
  children: React.ReactNode;
}) {
  const cardBg    = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const cardBorder = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.10)";
  const inputBg   = isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.04)";

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-4 transition-colors duration-300 relative"
      style={{ background: bg, color: text }}>

      {/* Theme toggle */}
      <button onClick={toggleTheme} aria-label="Toggle theme"
        className="absolute top-6 right-6 w-9 h-9 flex items-center justify-center rounded-full transition-all"
        style={{ background: inputBg, border: `1px solid ${cardBorder}`, color: muted }}>
        {isDark ? (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="5"/>
            <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
            <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
          </svg>
        ) : (
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
          </svg>
        )}
      </button>

      {/* Logo */}
      <h1 className="font-serif font-semibold mb-8 tracking-tight"
        style={{ fontSize: "clamp(2.5rem, 6vw, 3.75rem)", letterSpacing: "-0.03em", lineHeight: 1 }}>
        Sheldon<span style={{ color: gold }}>AI</span>
      </h1>

      {/* Card */}
      <div className="w-full max-w-sm rounded-2xl p-7"
        style={{ background: cardBg, border: `1px solid ${cardBorder}` }}>
        {children}
      </div>

    </main>
  );
}
