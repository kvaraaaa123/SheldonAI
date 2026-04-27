"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

type StudentProfile = {
  user_id: string;
  full_name: string | null;
  email: string | null;
  gpa: string | null;
  sat_score: string | null;
  sat_math: string | null;
  sat_reading: string | null;
  act_score: string | null;
  intended_major: string | null;
  academic_interests: string | null;
  academic_style: string | null;
  school_type: string | null;
  campus_environment: string | null;
  financial_aid_need: string | null;
  us_citizenship: string | null;
  country_of_origin: string | null;
  english_test_type: string | null;
  english_test_score: string | null;
  other_test_scores: string | null;
};

type Note = { id: string; note_text: string; created_at: string };
type CollegeEntry = { id: string; university_name: string; status: string };

function timeAgo(dateStr: string): string {
  const ms = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(ms / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.floor(hours / 24)}d ago`;
}

export default function StudentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const studentId = params.studentId as string;
  const { isDark, toggleTheme } = useTheme();

  const text      = isDark ? "#FAFAF5" : "#0a0a12";
  const gold      = isDark ? "#C9A96E" : "#9a7040";
  const border    = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const muted     = isDark ? "rgba(250,250,245,0.45)" : "rgba(10,10,18,0.45)";
  const navBg     = isDark ? "rgba(8,8,16,0.95)" : "rgba(250,250,245,0.95)";
  const cardBg    = isDark ? "rgba(255,255,255,0.03)" : "#fff";
  const cardBdr   = isDark ? "rgba(250,250,245,0.09)" : "rgba(0,0,0,0.09)";

  const [currentUserId, setCurrentUserId] = useState("");
  const [userEmail, setUserEmail]         = useState("");
  const [profile, setProfile]             = useState<StudentProfile | null>(null);
  const [notes, setNotes]                 = useState<Note[]>([]);
  const [colleges, setColleges]           = useState<CollegeEntry[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [activityData, setActivityData]   = useState<any>(null);
  const [newNote, setNewNote]             = useState("");
  const [noteSaving, setNoteSaving]       = useState(false);
  const [noteSaved, setNoteSaved]         = useState(false);
  const [loading, setLoading]             = useState(true);
  const [analysisLoading, setAnalysisLoading] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [analysisResult, setAnalysisResult]   = useState<any>(null);

  const fetchNotes = useCallback(async (counselorId: string) => {
    const { data } = await supabase
      .from("counselor_notes")
      .select("id, note_text, created_at")
      .eq("counselor_id", counselorId)
      .eq("student_id", studentId)
      .is("essay_id", null)
      .order("created_at", { ascending: false });
    if (data) setNotes(data as Note[]);
  }, [studentId]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: sessionData }) => {
      if (!sessionData.session) { router.push("/signup"); return; }
      const uid = sessionData.session.user.id;
      setCurrentUserId(uid);
      setUserEmail(sessionData.session.user.email ?? "");

      // Check counselor role
      const { data: myProfile } = await supabase
        .from("profiles").select("role").eq("user_id", uid).maybeSingle();
      if (!myProfile || myProfile.role !== "counselor") { router.push("/dashboard"); return; }

      // Verify student is linked to this counselor
      const { data: link } = await supabase
        .from("counselor_students")
        .select("invite_status")
        .eq("counselor_id", uid)
        .eq("student_id", studentId)
        .maybeSingle();
      if (!link) { router.push("/counselor/dashboard"); return; }

      // Fetch student data in parallel
      const [{ data: studentProfile }, { data: collegeData }, { data: actData }] = await Promise.all([
        supabase.from("profiles")
          .select("user_id, full_name, email, gpa, sat_score, sat_math, sat_reading, act_score, intended_major, academic_interests, academic_style, school_type, campus_environment, financial_aid_need, us_citizenship, country_of_origin, english_test_type, english_test_score, other_test_scores")
          .eq("user_id", studentId).maybeSingle(),
        supabase.from("college_lists").select("id, university_name, status").eq("user_id", studentId),
        supabase.from("activity_grades").select("grades").eq("user_id", studentId).maybeSingle(),
      ]);

      if (studentProfile) setProfile(studentProfile as StudentProfile);
      if (collegeData) setColleges(collegeData as CollegeEntry[]);
      if (actData?.grades) {
        try { setActivityData(typeof actData.grades === "string" ? JSON.parse(actData.grades) : actData.grades); }
        catch { setActivityData(null); }
      }
      fetchNotes(uid);
      setLoading(false);
    });
  }, [router, studentId, fetchNotes]);

  async function handleSignOut() { await supabase.auth.signOut(); router.push("/"); }

  async function saveNote() {
    if (!newNote.trim()) return;
    setNoteSaving(true);
    await supabase.from("counselor_notes").insert({
      counselor_id: currentUserId,
      student_id: studentId,
      note_text: newNote.trim(),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
    setNewNote("");
    setNoteSaving(false);
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1500);
    fetchNotes(currentUserId);
  }

  async function runActivitiesAnalysis() {
    setAnalysisLoading(true);
    setAnalysisResult(null);
    try {
      const resp = await fetch("/api/grade-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: studentId, counselorMode: true }),
      });
      if (resp.ok) {
        const json = await resp.json();
        setAnalysisResult(json);
      } else {
        setAnalysisResult({ error: "Analysis failed. Try again." });
      }
    } catch {
      setAnalysisResult({ error: "Analysis failed. Try again." });
    }
    setAnalysisLoading(false);
  }

  function parseInterests(raw: string | null): string[] {
    if (!raw) return [];
    return raw.split(",").map(s => s.trim()).filter(Boolean);
  }

  function parseOtherTests(raw: string | null): { name: string; score: string }[] {
    if (!raw) return [];
    try { return JSON.parse(raw); }
    catch { return []; }
  }

  const card: React.CSSProperties = {
    background: cardBg, border: `0.5px solid ${cardBdr}`, borderRadius: 14,
    padding: 24, marginBottom: 16,
  };
  const sectionLabel: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em",
    color: muted, marginBottom: 12, fontFamily: "system-ui,sans-serif",
  };
  const fieldVal: React.CSSProperties = { fontSize: 14, color: text, fontFamily: "system-ui,sans-serif" };
  const fieldMuted: React.CSSProperties = { fontSize: 12, color: muted, fontFamily: "system-ui,sans-serif", marginTop: 2 };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: isDark ? "#0a0a12" : "#FAFAF8", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: muted, fontSize: 14 }}>Loading…</div>
    </div>
  );

  const firstName = profile?.full_name?.split(" ")[0] ?? "Student";
  const otherTests = parseOtherTests(profile?.other_test_scores ?? null);

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
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* Breadcrumb */}
        <div style={{ fontSize: 13, color: muted, marginBottom: 24, display: "flex", alignItems: "center", gap: 8 }}>
          <Link href="/counselor/dashboard" style={{ color: gold, textDecoration: "none" }}>← Roster</Link>
          <span>/</span>
          <span>{profile?.full_name ?? "Student"}</span>
        </div>

        {/* Two-column layout */}
        <div style={{ display: "grid", gridTemplateColumns: "58% 42%", gap: 24, alignItems: "start" }}>

          {/* ── LEFT COLUMN ── */}
          <div>

            {/* Header card */}
            <div style={{ ...card, borderLeft: `3px solid ${gold}` }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 500, color: text, marginBottom: 4 }}>
                {profile?.full_name ?? "Student"}
              </div>
              <div style={{ fontSize: 13, color: muted, marginBottom: 16 }}>{profile?.email ?? "—"}</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12 }}>
                {[
                  { label: "GPA", val: profile?.gpa ?? "—" },
                  { label: "Intended Major", val: profile?.intended_major ?? "—" },
                  { label: "Citizenship", val: profile?.us_citizenship ?? "—" },
                ].map(f => (
                  <div key={f.label}>
                    <div style={fieldMuted}>{f.label}</div>
                    <div style={{ ...fieldVal, fontWeight: 500 }}>{f.val}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Academics */}
            <div style={card}>
              <div style={sectionLabel}>Academics</div>
              {profile?.academic_interests && (
                <div style={{ marginBottom: 12 }}>
                  <div style={fieldMuted}>Interests</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 6 }}>
                    {parseInterests(profile.academic_interests).map(i => (
                      <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, background: "rgba(154,112,64,0.1)", color: gold, fontWeight: 500 }}>{i}</span>
                    ))}
                  </div>
                </div>
              )}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <div style={fieldMuted}>Intended major</div>
                  <div style={fieldVal}>{profile?.intended_major ?? "—"}</div>
                </div>
                <div>
                  <div style={fieldMuted}>Learning style</div>
                  <div style={fieldVal}>{profile?.academic_style ?? "—"}</div>
                </div>
              </div>
            </div>

            {/* Testing */}
            <div style={card}>
              <div style={sectionLabel}>Test Scores</div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 12, marginBottom: otherTests.length > 0 ? 12 : 0 }}>
                {[
                  { label: "SAT Total", val: profile?.sat_score },
                  { label: "SAT Math", val: profile?.sat_math },
                  { label: "SAT Reading", val: profile?.sat_reading },
                  { label: "ACT", val: profile?.act_score },
                  profile?.english_test_type ? { label: profile.english_test_type, val: profile.english_test_score } : null,
                ].filter(Boolean).map((f, i) => f && (
                  <div key={i}>
                    <div style={fieldMuted}>{f.label}</div>
                    <div style={{ ...fieldVal, fontWeight: 500 }}>{f.val ?? "—"}</div>
                  </div>
                ))}
              </div>
              {otherTests.length > 0 && (
                <div>
                  <div style={fieldMuted}>Other tests</div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 6 }}>
                    {otherTests.map((t, i) => (
                      <span key={i} style={{ fontSize: 12, padding: "3px 10px", borderRadius: 99, border: `0.5px solid ${cardBdr}`, color: text }}>{t.name}: {t.score}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Activities */}
            {activityData && (
              <div style={card}>
                <div style={sectionLabel}>Activities (AI Graded)</div>
                {Array.isArray(activityData.activities) ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {activityData.activities.map((act: { name?: string; organization?: string; grade?: string; score?: number; commentary?: string }, i: number) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", padding: "10px 14px", borderRadius: 8, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `0.5px solid ${cardBdr}` }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 500, color: text }}>{act.name ?? act.organization ?? "Activity"}</div>
                          {act.commentary && <div style={{ fontSize: 12, color: muted, marginTop: 2, lineHeight: 1.5 }}>{act.commentary}</div>}
                        </div>
                        {(act.grade || act.score != null) && (
                          <span style={{ fontSize: 13, fontWeight: 600, color: gold, marginLeft: 12, flexShrink: 0 }}>
                            {act.grade ?? act.score}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: 13, color: muted }}>Analysis data available — check activities page.</div>
                )}
              </div>
            )}

            {/* Colleges */}
            {colleges.length > 0 && (
              <div style={card}>
                <div style={sectionLabel}>College List ({colleges.length})</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {colleges.map(c => (
                    <div key={c.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderRadius: 8, border: `0.5px solid ${cardBdr}` }}>
                      <span style={{ fontSize: 13, color: text }}>{c.university_name}</span>
                      <span style={{ fontSize: 11, padding: "2px 8px", borderRadius: 99, fontWeight: 500, background: c.status === "reach" ? "rgba(239,68,68,0.1)" : c.status === "safety" ? "rgba(22,163,74,0.1)" : "rgba(59,130,246,0.1)", color: c.status === "reach" ? "#dc2626" : c.status === "safety" ? "#16a34a" : "#2563eb" }}>
                        {c.status ?? "undecided"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Background */}
            <div style={card}>
              <div style={sectionLabel}>Background</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "US Citizenship", val: profile?.us_citizenship },
                  { label: "Country of Origin", val: profile?.country_of_origin },
                  { label: "Financial Aid Need", val: profile?.financial_aid_need },
                  { label: "School Preference", val: profile?.school_type },
                  { label: "Campus Environment", val: profile?.campus_environment },
                ].map(f => (
                  <div key={f.label}>
                    <div style={fieldMuted}>{f.label}</div>
                    <div style={fieldVal}>{f.val ?? "—"}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* ── RIGHT COLUMN ── */}
          <div style={{ position: "sticky", top: 80 }}>

            {/* Notes card */}
            <div style={{ ...card, marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: text }}>
                  Notes
                  {notes.length > 0 && (
                    <span style={{ fontSize: 11, marginLeft: 8, padding: "2px 8px", borderRadius: 99, background: "rgba(154,112,64,0.1)", color: gold }}>
                      {notes.length}
                    </span>
                  )}
                </div>
              </div>

              <textarea
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
                placeholder={`Add a note about ${firstName}…`}
                rows={4}
                style={{
                  display: "block", width: "100%", boxSizing: "border-box",
                  border: `0.5px solid ${cardBdr}`, borderRadius: 8, padding: "10px 12px",
                  fontSize: 13, color: text, background: isDark ? "rgba(255,255,255,0.04)" : "#fafaf8",
                  resize: "vertical", outline: "none", fontFamily: "system-ui,sans-serif",
                  lineHeight: 1.6, marginBottom: 10,
                }}
                onFocus={e => (e.target.style.borderColor = gold)}
                onBlur={e => (e.target.style.borderColor = cardBdr)}
              />
              <button
                onClick={saveNote}
                disabled={noteSaving || !newNote.trim()}
                style={{
                  width: "100%", padding: "9px 0", borderRadius: 8, fontSize: 13, fontWeight: 500,
                  background: noteSaved ? "#16a34a" : gold, color: "#fff", border: "none",
                  cursor: noteSaving || !newNote.trim() ? "not-allowed" : "pointer",
                  opacity: !newNote.trim() ? 0.5 : 1, fontFamily: "system-ui,sans-serif",
                  transition: "background 0.2s",
                }}
              >
                {noteSaved ? "Saved ✓" : noteSaving ? "Saving…" : "Save Note"}
              </button>

              {notes.length > 0 && (
                <div style={{ marginTop: 20, display: "flex", flexDirection: "column", gap: 0 }}>
                  {notes.map((note, i) => (
                    <div key={note.id}>
                      {i > 0 && <div style={{ height: "0.5px", background: cardBdr, margin: "12px 0" }} />}
                      <div style={{ fontSize: 13, color: text, lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{note.note_text}</div>
                      <div style={{ fontSize: 11, color: muted, marginTop: 4 }}>{timeAgo(note.created_at)}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions card */}
            <div style={card}>
              <div style={{ fontSize: 14, fontWeight: 600, color: text, marginBottom: 16 }}>Quick Actions</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={runActivitiesAnalysis}
                  disabled={analysisLoading}
                  style={{ width: "100%", padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: isDark ? "rgba(154,112,64,0.15)" : "rgba(154,112,64,0.08)", color: gold, border: `1px solid rgba(154,112,64,0.3)`, cursor: analysisLoading ? "not-allowed" : "pointer", fontFamily: "system-ui,sans-serif", textAlign: "left" }}
                >
                  {analysisLoading ? "Analyzing…" : "▶ Run Activities Analysis"}
                </button>
                <button
                  onClick={() => router.push(`/counselor/student/${studentId}/essays`)}
                  style={{ width: "100%", padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: "none", border: `1.5px solid ${gold}`, color: gold, cursor: "pointer", fontFamily: "system-ui,sans-serif", textAlign: "left" }}
                >
                  📝 View Essays
                </button>
                <a
                  href={`/api/counselor/export-pdf?studentId=${studentId}`}
                  download
                  style={{ display: "block", width: "100%", padding: "10px 16px", borderRadius: 8, fontSize: 13, fontWeight: 500, background: "none", border: `0.5px solid ${cardBdr}`, color: muted, textDecoration: "none", cursor: "pointer", fontFamily: "system-ui,sans-serif", boxSizing: "border-box" }}
                >
                  ↓ Export Student Report
                </a>
              </div>

              {/* Activities analysis inline result */}
              {analysisResult && (
                <div style={{ marginTop: 16, padding: 14, borderRadius: 8, background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.02)", border: `0.5px solid ${cardBdr}` }}>
                  {analysisResult.error ? (
                    <div style={{ fontSize: 13, color: "#dc2626" }}>{analysisResult.error}</div>
                  ) : (
                    <div style={{ fontSize: 13, color: text, lineHeight: 1.6 }}>
                      {analysisResult.overall && <div style={{ marginBottom: 8 }}><strong>Overall:</strong> {analysisResult.overall}</div>}
                      {analysisResult.spike && <div><strong>Spike:</strong> {analysisResult.spike}</div>}
                      {!analysisResult.overall && !analysisResult.spike && (
                        <div style={{ color: muted }}>Analysis complete. Check activities page for full results.</div>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
