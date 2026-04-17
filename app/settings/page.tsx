"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  const bg      = isDark ? "#080810"                : "#FAFAF8";
  const surface = isDark ? "#0f0f1a"                : "#ffffff";
  const border  = isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)";
  const text    = isDark ? "#FAFAF5"                : "#0a0a12";
  const muted   = isDark ? "rgba(250,250,245,0.5)"  : "rgba(10,10,18,0.5)";
  const gold    = isDark ? "#C9A96E"                : "#9a7040";
  const navBg   = isDark ? "rgba(8,8,16,0.95)"      : "rgba(250,250,245,0.95)";

  const [userEmail,      setUserEmail]      = useState("");
  const [userId,         setUserId]         = useState("");
  const [feedbackStyle,  setFeedbackStyle]  = useState("");
  const [feedbackDepth,  setFeedbackDepth]  = useState("");
  const [savedFlash,     setSavedFlash]     = useState(false);
  const [pwResetSent,    setPwResetSent]    = useState(false);
  const [deleteInput,    setDeleteInput]    = useState("");
  const [showDeleteConf, setShowDeleteConf] = useState(false);
  const [deadlineReminders, setDeadlineReminders] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/"); return; }
      const { user } = data.session;
      setUserEmail(user.email ?? "");
      setUserId(user.id);
      const { data: profile } = await supabase
        .from("profiles").select("feedback_style, essay_feedback_depth")
        .eq("user_id", user.id).maybeSingle();
      if (profile) {
        setFeedbackStyle(profile.feedback_style ?? "");
        setFeedbackDepth(profile.essay_feedback_depth ?? "");
      }
      setDeadlineReminders(localStorage.getItem("deadline_reminders") === "true");
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function savePreference(field: string, value: string) {
    await supabase.from("profiles").update({ [field]: value, updated_at: new Date().toISOString() }).eq("user_id", userId);
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  }

  async function handlePasswordReset() {
    await supabase.auth.resetPasswordForEmail(userEmail, { redirectTo: `${window.location.origin}/dashboard` });
    setPwResetSent(true);
  }

  async function handleExportData() {
    const [{ data: profile }, { data: colleges }, { data: essays }, { data: grades }] = await Promise.all([
      supabase.from("profiles").select("*").eq("user_id", userId).maybeSingle(),
      supabase.from("college_lists").select("*").eq("user_id", userId),
      supabase.from("essays").select("*").eq("user_id", userId),
      supabase.from("activity_grades").select("*").eq("user_id", userId),
    ]);
    const blob = new Blob([JSON.stringify({ profile, colleges, essays, activityGrades: grades }, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = "sheldonai-profile.json"; a.click();
    URL.revokeObjectURL(url);
  }

  async function handleDeleteAccount() {
    if (deleteInput !== "DELETE") return;
    await supabase.from("profiles").delete().eq("user_id", userId);
    await supabase.auth.signOut();
    router.push("/");
  }

  const card: React.CSSProperties = {
    background: surface, border: `0.5px solid ${border}`, borderRadius: 12,
    padding: 24, display: "flex", flexDirection: "column", gap: 20,
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.08em",
    color: muted, marginBottom: 8, fontFamily: "system-ui, sans-serif",
  };
  const pillStyle = (active: boolean): React.CSSProperties => ({
    padding: "7px 16px", fontSize: 13, borderRadius: 999, cursor: "pointer",
    fontFamily: "system-ui, sans-serif", borderStyle: "solid", borderWidth: "0.5px",
    borderColor: active ? gold : (isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.25)"),
    backgroundColor: active ? (isDark ? "rgba(201,169,110,0.12)" : "rgba(154,112,64,0.10)") : "transparent",
    color: active ? gold : text,
    WebkitAppearance: "none" as const, appearance: "none" as const,
  });

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 28px", borderBottom: `0.5px solid ${border}`,
        background: navBg, backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <a href="/dashboard" style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 500, textDecoration: "none", color: text, letterSpacing: "-0.02em" }}>
            Sheldon<span style={{ color: gold }}>AI</span>
          </a>
          <a href="/dashboard" style={{ fontSize: 13, color: muted, textDecoration: "none" }}>← Dashboard</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: muted }}>{userEmail}</span>
          <button onClick={handleSignOut} style={{ fontSize: 12, color: muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "system-ui, sans-serif" }}>
            Sign out
          </button>
          <button onClick={toggleTheme} style={{
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", border: `0.5px solid ${border}`, background: "none",
            cursor: "pointer", color: muted, fontSize: 15,
          }}>
            {isDark ? "☀" : "☽"}
          </button>
        </div>
      </nav>

      {/* Body */}
      <div style={{ maxWidth: 680, margin: "0 auto", padding: "32px 24px 80px", display: "flex", flexDirection: "column", gap: 24 }}>

        <div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 500, color: text, margin: "0 0 6px" }}>Settings</h1>
          <p style={{ fontSize: 13, color: muted, margin: 0 }}>Manage your account and preferences</p>
        </div>

        {savedFlash && (
          <div style={{ background: "rgba(154,112,64,0.1)", border: `0.5px solid ${gold}`, borderRadius: 8, padding: "10px 16px", fontSize: 13, color: gold }}>
            Saved ✓
          </div>
        )}

        {/* Section 1 — Account */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 500, color: text }}>Account</div>

          <div>
            <div style={labelStyle}>Email address</div>
            <div style={{ fontSize: 14, color: text, marginBottom: 4 }}>{userEmail}</div>
            <div style={{ fontSize: 12, color: muted }}>Cannot be changed</div>
          </div>

          <div>
            <div style={labelStyle}>Password</div>
            {pwResetSent ? (
              <div style={{ fontSize: 13, color: gold }}>Password reset email sent to your inbox.</div>
            ) : (
              <button onClick={handlePasswordReset} style={{
                fontSize: 13, color: gold, background: "transparent",
                border: `0.5px solid ${gold}`, borderRadius: 7, padding: "7px 16px",
                cursor: "pointer", fontFamily: "system-ui, sans-serif",
              }}>
                Change password
              </button>
            )}
          </div>
        </div>

        {/* Section 2 — Preferences */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 500, color: text }}>Preferences</div>

          <div>
            <div style={labelStyle}>Appearance</div>
            <div style={{ display: "flex", gap: 8 }}>
              <button style={pillStyle(!isDark)} onClick={() => { if (isDark) toggleTheme(); }}>Light</button>
              <button style={pillStyle(isDark)}  onClick={() => { if (!isDark) toggleTheme(); }}>Dark</button>
            </div>
          </div>

          <div>
            <div style={labelStyle}>How SheldonAI talks to you</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Direct and blunt — give it to me straight", "Encouraging — soften the feedback"].map(opt => (
                <button key={opt} style={pillStyle(feedbackStyle === opt)} onClick={async () => {
                  setFeedbackStyle(opt);
                  await savePreference("feedback_style", opt);
                }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={labelStyle}>Preferred language</div>
            <div style={{ fontSize: 14, color: text, marginBottom: 4 }}>English</div>
            <div style={{ fontSize: 12, color: muted }}>More languages coming soon</div>
          </div>
        </div>

        {/* Section 3 — Counselor Preferences */}
        <div style={card}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 500, color: text, marginBottom: 4 }}>Counselor Preferences</div>
            <div style={{ fontSize: 12, color: muted }}>These help SheldonAI give you more relevant advice</div>
          </div>

          <div>
            <div style={labelStyle}>Deadline reminders</div>
            <div
              onClick={() => {
                const next = !deadlineReminders;
                setDeadlineReminders(next);
                localStorage.setItem("deadline_reminders", String(next));
              }}
              style={{
                width: 44, height: 24, borderRadius: 12, cursor: "pointer",
                background: deadlineReminders ? gold : (isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.15)"),
                position: "relative", transition: "background 0.2s",
              }}
            >
              <div style={{
                width: 18, height: 18, borderRadius: "50%", background: "#fff",
                position: "absolute", top: 3,
                left: deadlineReminders ? 23 : 3, transition: "left 0.2s",
              }} />
            </div>
          </div>

          <div>
            <div style={labelStyle}>Essay feedback detail level</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["Quick overview", "Detailed analysis", "Exhaustive line-by-line"].map(opt => (
                <button key={opt} style={pillStyle(feedbackDepth === opt)} onClick={async () => {
                  setFeedbackDepth(opt);
                  await savePreference("essay_feedback_depth", opt);
                }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4 — Your Data */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 500, color: text }}>Your Data</div>

          <div>
            <button onClick={handleExportData} style={{
              fontSize: 13, color: gold, background: "transparent",
              border: `0.5px solid ${gold}`, borderRadius: 7, padding: "8px 18px",
              cursor: "pointer", fontFamily: "system-ui, sans-serif",
            }}>
              Download my profile data ↓
            </button>
          </div>

          <div>
            {!showDeleteConf ? (
              <button onClick={() => setShowDeleteConf(true)} style={{
                fontSize: 13, color: isDark ? "#f87171" : "#b91c1c", background: "transparent",
                border: `0.5px solid ${isDark ? "#f87171" : "#b91c1c"}`, borderRadius: 7,
                padding: "8px 18px", cursor: "pointer", fontFamily: "system-ui, sans-serif",
              }}>
                Delete my account
              </button>
            ) : (
              <div style={{ border: `0.5px solid ${isDark ? "#f87171" : "#b91c1c"}`, borderRadius: 10, padding: "16px 20px", background: isDark ? "rgba(248,113,113,0.06)" : "rgba(185,28,28,0.04)" }}>
                <div style={{ fontSize: 14, color: isDark ? "#f87171" : "#b91c1c", marginBottom: 12, lineHeight: 1.55 }}>
                  This permanently deletes all your data. Type <strong>DELETE</strong> to confirm.
                </div>
                <div style={{ fontSize: 12, color: muted, marginBottom: 14, lineHeight: 1.6 }}>
                  Note: You may need to contact support to fully remove your authentication record.
                </div>
                <input
                  value={deleteInput} onChange={e => setDeleteInput(e.target.value)}
                  placeholder="Type DELETE"
                  style={{
                    display: "block", width: "100%", padding: "9px 12px", fontSize: 14,
                    background: surface, border: `0.5px solid ${border}`, borderRadius: 7,
                    color: text, outline: "none", boxSizing: "border-box", marginBottom: 12,
                    fontFamily: "system-ui, sans-serif",
                  }}
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={handleDeleteAccount} disabled={deleteInput !== "DELETE"} style={{
                    fontSize: 13, color: "#fff", background: isDark ? "#f87171" : "#b91c1c",
                    border: "none", borderRadius: 7, padding: "8px 18px", cursor: deleteInput !== "DELETE" ? "not-allowed" : "pointer",
                    opacity: deleteInput !== "DELETE" ? 0.4 : 1, fontFamily: "system-ui, sans-serif",
                  }}>
                    Delete permanently
                  </button>
                  <button onClick={() => { setShowDeleteConf(false); setDeleteInput(""); }} style={{
                    fontSize: 13, color: muted, background: "transparent",
                    border: `0.5px solid ${border}`, borderRadius: 7, padding: "8px 16px",
                    cursor: "pointer", fontFamily: "system-ui, sans-serif",
                  }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Section 5 — About */}
        <div style={card}>
          <div style={{ fontSize: 14, fontWeight: 500, color: text }}>About</div>
          <div style={{ fontSize: 13, color: muted }}>Version 1.0 · Built by Harvard students</div>
          <div style={{ fontSize: 13, color: muted, lineHeight: 1.65 }}>
            SheldonAI helps you package your college application — essays, activities, and profile — into one coherent story.
          </div>
          <div style={{ display: "flex", gap: 16 }}>
            <a href="#" style={{ fontSize: 13, color: gold, textDecoration: "none" }}>Privacy Policy</a>
            <a href="#" style={{ fontSize: 13, color: gold, textDecoration: "none" }}>Terms of Service</a>
          </div>
        </div>

      </div>
    </div>
  );
}
