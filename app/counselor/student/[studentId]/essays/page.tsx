"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

type Essay = {
  id: string;
  content: string;
  essay_type: string | null;
  school_name: string | null;
  word_count: number | null;
  created_at: string;
  updated_at: string;
};

type Feedback = {
  id: string;
  note_text: string;
  created_at: string;
  essay_id: string;
};

function timeAgo(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

function essayLabel(e: Essay): string {
  if (e.essay_type === "supplement" && e.school_name) return `${e.school_name} Supplement`;
  if (e.essay_type === "whyus" && e.school_name) return `Why ${e.school_name}`;
  return e.essay_type === "commonapp" ? "Common App" : e.essay_type ?? "Essay";
}

export default function EssayReviewPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;
  const { isDark, toggleTheme } = useTheme();

  const text    = isDark ? "#FAFAF5" : "#0a0a12";
  const gold    = isDark ? "#C9A96E" : "#9a7040";
  const border  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const muted   = isDark ? "rgba(250,250,245,0.45)" : "rgba(10,10,18,0.45)";
  const navBg   = isDark ? "rgba(8,8,16,0.95)" : "rgba(250,250,245,0.95)";
  const cardBg  = isDark ? "rgba(255,255,255,0.03)" : "#fff";
  const cardBdr = isDark ? "rgba(250,250,245,0.09)" : "rgba(0,0,0,0.09)";

  const [currentUserId, setCurrentUserId] = useState("");
  const [userEmail, setUserEmail]         = useState("");
  const [studentName, setStudentName]     = useState("");
  const [essays, setEssays]               = useState<Essay[]>([]);
  const [selected, setSelected]           = useState<Essay | null>(null);
  const [feedback, setFeedback]           = useState<Feedback[]>([]);
  const [newFeedback, setNewFeedback]     = useState("");
  const [fbSaving, setFbSaving]           = useState(false);
  const [fbSaved, setFbSaved]             = useState(false);
  const [loading, setLoading]             = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analysisResult, setAnalysisResult]   = useState<any>(null);

  const fetchFeedback = useCallback(async (essayId: string, counselorId: string) => {
    const { data } = await supabase
      .from("counselor_notes")
      .select("id, note_text, created_at, essay_id")
      .eq("counselor_id", counselorId)
      .eq("student_id", studentId)
      .eq("essay_id", essayId)
      .order("created_at", { ascending: false });
    if (data) setFeedback(data as Feedback[]);
  }, [studentId]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: sessionData }) => {
      if (!sessionData.session) { router.push("/signup"); return; }
      const uid = sessionData.session.user.id;
      setCurrentUserId(uid);
      setUserEmail(sessionData.session.user.email ?? "");

      const { data: myProfile } = await supabase
        .from("profiles").select("role").eq("user_id", uid).maybeSingle();
      if (!myProfile || myProfile.role !== "counselor") { router.push("/dashboard"); return; }

      const { data: link } = await supabase
        .from("counselor_students").select("invite_status")
        .eq("counselor_id", uid).eq("student_id", studentId).maybeSingle();
      if (!link) { router.push("/counselor/dashboard"); return; }

      const [{ data: studentProfile }, { data: essayData }] = await Promise.all([
        supabase.from("profiles").select("full_name").eq("user_id", studentId).maybeSingle(),
        supabase.from("essays").select("id, content, essay_type, school_name, word_count, created_at, updated_at")
          .eq("user_id", studentId).order("created_at", { ascending: false }),
      ]);

      if (studentProfile?.full_name) setStudentName(studentProfile.full_name);
      if (essayData) {
        setEssays(essayData as Essay[]);
        if (essayData.length > 0) {
          setSelected(essayData[0] as Essay);
          fetchFeedback(essayData[0].id, uid);
        }
      }
      setLoading(false);
    });
  }, [router, studentId, fetchFeedback]);

  async function handleSignOut() { await supabase.auth.signOut(); router.push("/"); }

  async function selectEssay(e: Essay) {
    setSelected(e);
    setAnalysisResult(null);
    setNewFeedback("");
    fetchFeedback(e.id, currentUserId);
  }

  async function saveFeedback() {
    if (!newFeedback.trim() || !selected) return;
    setFbSaving(true);
    await supabase.from("counselor_notes").insert({
      counselor_id: currentUserId,
      student_id: studentId,
      essay_id: selected.id,
      note_text: newFeedback.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setNewFeedback("");
    setFbSaving(false);
    setFbSaved(true);
    setTimeout(() => setFbSaved(false), 1500);
    fetchFeedback(selected.id, currentUserId);
  }

  async function analyzeEssay() {
    if (!selected) return;
    setAnalysisLoading(true);
    setAnalysisResult(null);
    try {
      const resp = await fetch("/api/annotate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay: selected.content, essayType: selected.essay_type ?? "commonapp" }),
      });
      if (resp.ok) {
        const json = await resp.json();
        setAnalysisResult(json);
      } else {
        setAnalysisResult({ error: "Analysis failed. Please try again." });
      }
    } catch {
      setAnalysisResult({ error: "Analysis failed. Please try again." });
    }
    setAnalysisLoading(false);
  }

  if (loading) return (
    <div style={{ minHeight: "100vh", background: isDark ? "#0a0a12" : "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: muted, fontSize: 14 }}>Loading…</div>
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#0a0a12" : "#FAFAF8", color: text, fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 28px", borderBottom: `0.5px solid ${border}`, background: navBg, backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 500, textDecoration: "none", color: text, letterSpacing: "-0.02em" }}>
          Sheldon<span style={{ color: gold }}>AI</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: muted }}>{userEmail}</span>
          <button onClick={() => router.push("/settings")} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
          <button onClick={handleSignOut} style={{ fontSize: 12, color: muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Sign out</button>
          <button onClick={toggleTheme} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: `0.5px solid ${border}`, background: "none", cursor: "pointer", color: muted, fontSize: 15 }}>
            {isDark ? "☀" : "☽"}
          </button>
        </div>
      </nav>

      {/* Body */}
      <div style={{ display: "grid", gridTemplateColumns: "300px 1fr", minHeight: "calc(100vh - 57px)" }}>

        {/* ── SIDEBAR ── */}
        <div style={{ borderRight: `0.5px solid ${border}`, padding: "24px 0", overflow: "auto" }}>
          <div style={{ padding: "0 20px 16px" }}>
            <Link href={`/counselor/student/${studentId}`} style={{ fontSize: 13, color: gold, textDecoration: "none", display: "block", marginBottom: 12 }}>
              ← {studentName || "Student"}
            </Link>
            <div style={{ fontSize: 15, fontWeight: 600, color: text }}>{studentName}&apos;s Essays</div>
            <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{essays.length} essay{essays.length !== 1 ? "s" : ""}</div>
          </div>

          {essays.length === 0 ? (
            <div style={{ padding: "20px", fontSize: 13, color: muted }}>No essays yet.</div>
          ) : (
            <div>
              {essays.map(e => (
                <button
                  key={e.id}
                  onClick={() => selectEssay(e)}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "12px 20px", border: "none",
                    cursor: "pointer", borderLeft: selected?.id === e.id ? `3px solid ${gold}` : "3px solid transparent",
                    background: selected?.id === e.id ? (isDark ? "rgba(154,112,64,0.08)" : "rgba(154,112,64,0.05)") : "none",
                  } as React.CSSProperties}
                >
                  <div style={{ fontSize: 13, fontWeight: 500, color: text, marginBottom: 3 }}>{essayLabel(e)}</div>
                  <div style={{ fontSize: 11, color: muted }}>{e.word_count ?? "?"} words · {timeAgo(e.updated_at ?? e.created_at)}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ── MAIN PANEL ── */}
        <div style={{ padding: "32px 40px", overflow: "auto" }}>
          {!selected ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: muted, fontSize: 14 }}>
              {essays.length === 0 ? "This student hasn't written any essays yet." : "Select an essay from the sidebar."}
            </div>
          ) : (
            <>
              {/* Essay header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 24, gap: 16 }}>
                <div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 500, color: text, marginBottom: 4 }}>{essayLabel(selected)}</div>
                  <div style={{ fontSize: 12, color: muted }}>{selected.word_count ?? "?"} words · Last edited {timeAgo(selected.updated_at ?? selected.created_at)}</div>
                </div>
                <button
                  onClick={analyzeEssay}
                  disabled={analysisLoading}
                  style={{ flexShrink: 0, padding: "9px 18px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: gold, color: "#fff", border: "none", cursor: analysisLoading ? "not-allowed" : "pointer", opacity: analysisLoading ? 0.7 : 1, fontFamily: "system-ui,sans-serif" }}
                >
                  {analysisLoading ? "Analyzing…" : "Analyze with SheldonAI"}
                </button>
              </div>

              {/* Essay text */}
              <div style={{ background: cardBg, border: `0.5px solid ${cardBdr}`, borderRadius: 14, padding: "28px 32px", marginBottom: 24, fontSize: 15, lineHeight: 1.8, color: text, whiteSpace: "pre-wrap", fontFamily: "Georgia, serif" }}>
                {selected.content}
              </div>

              {/* Analysis section */}
              <div style={{ background: cardBg, border: `0.5px solid ${cardBdr}`, borderRadius: 14, padding: 24, marginBottom: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 12 }}>SheldonAI Analysis</div>
                {analysisLoading ? (
                  <div style={{ fontSize: 13, color: muted }}>Analyzing essay…</div>
                ) : !analysisResult ? (
                  <div style={{ fontSize: 13, color: muted }}>Click &quot;Analyze with SheldonAI&quot; to run an analysis on this essay.</div>
                ) : analysisResult.error ? (
                  <div style={{ fontSize: 13, color: "#dc2626" }}>{analysisResult.error}</div>
                ) : (
                  <div>
                    {analysisResult.memorabilityScore != null && (
                      <div style={{ marginBottom: 12 }}>
                        <span style={{ fontSize: 12, color: muted }}>Memorability score: </span>
                        <span style={{ fontSize: 14, fontWeight: 600, color: gold }}>{analysisResult.memorabilityScore}/10</span>
                      </div>
                    )}
                    {analysisResult.hookVerdict && (
                      <div style={{ marginBottom: 8, fontSize: 13, color: text }}><strong>Hook:</strong> {analysisResult.hookVerdict}</div>
                    )}
                    {analysisResult.conclusionVerdict && (
                      <div style={{ marginBottom: 8, fontSize: 13, color: text }}><strong>Conclusion:</strong> {analysisResult.conclusionVerdict}</div>
                    )}
                    {analysisResult.catastrophicMistake && (
                      <div style={{ marginBottom: 8, fontSize: 13, color: "#dc2626" }}><strong>⚠ Catastrophic mistake:</strong> {analysisResult.catastrophicMistake}</div>
                    )}
                    {Array.isArray(analysisResult.annotations) && analysisResult.annotations.length > 0 && (
                      <div style={{ marginTop: 12 }}>
                        <div style={{ fontSize: 12, color: muted, marginBottom: 8 }}>Annotations ({analysisResult.annotations.length})</div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                          {analysisResult.annotations.slice(0, 8).map((ann: { sentence?: string; categories?: string[]; explanation?: string }, i: number) => (
                            <div key={i} style={{ padding: "10px 14px", borderRadius: 8, border: `0.5px solid ${cardBdr}`, fontSize: 13, lineHeight: 1.6 }}>
                              {ann.categories && <div style={{ fontSize: 11, fontWeight: 600, color: gold, marginBottom: 4 }}>{ann.categories.join(", ")}</div>}
                              {ann.sentence && <div style={{ color: muted, marginBottom: 4, fontStyle: "italic" }}>&ldquo;{ann.sentence.slice(0, 120)}{ann.sentence.length > 120 ? "…" : ""}&rdquo;</div>}
                              {ann.explanation && <div style={{ color: text }}>{ann.explanation}</div>}
                            </div>
                          ))}
                          {analysisResult.annotations.length > 8 && (
                            <div style={{ fontSize: 12, color: muted }}>+ {analysisResult.annotations.length - 8} more annotations</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Feedback section */}
              <div style={{ background: cardBg, border: `0.5px solid ${cardBdr}`, borderRadius: 14, padding: 24 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 12 }}>Your Feedback</div>

                <textarea
                  value={newFeedback}
                  onChange={e => setNewFeedback(e.target.value)}
                  placeholder="Add your feedback on this essay…"
                  rows={4}
                  style={{
                    display: "block", width: "100%", boxSizing: "border-box",
                    border: `0.5px solid ${cardBdr}`, borderRadius: 8, padding: "10px 12px",
                    fontSize: 13, color: text, background: isDark ? "rgba(255,255,255,0.04)" : "#fafaf8",
                    resize: "vertical", outline: "none", fontFamily: "system-ui,sans-serif", lineHeight: 1.6, marginBottom: 10,
                  }}
                  onFocus={e => (e.target.style.borderColor = gold)}
                  onBlur={e => (e.target.style.borderColor = cardBdr)}
                />
                <button
                  onClick={saveFeedback}
                  disabled={fbSaving || !newFeedback.trim()}
                  style={{ padding: "9px 20px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: fbSaved ? "#16a34a" : gold, color: "#fff", border: "none", cursor: fbSaving || !newFeedback.trim() ? "not-allowed" : "pointer", opacity: !newFeedback.trim() ? 0.5 : 1, fontFamily: "system-ui,sans-serif", transition: "background 0.2s" }}
                >
                  {fbSaved ? "Saved ✓" : fbSaving ? "Saving…" : "Save Feedback"}
                </button>

                {feedback.length > 0 && (
                  <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 0 }}>
                    <div style={{ fontSize: 12, color: muted, marginBottom: 12 }}>Previous feedback ({feedback.length})</div>
                    {feedback.map((fb, i) => (
                      <div key={fb.id}>
                        {i > 0 && <div style={{ height: "0.5px", background: cardBdr, margin: "12px 0" }} />}
                        <div style={{ fontSize: 13, color: text, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{fb.note_text}</div>
                        <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>{timeAgo(fb.created_at)}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
