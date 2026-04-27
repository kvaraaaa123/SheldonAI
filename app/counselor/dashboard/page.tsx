"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

type StudentRecord = {
  student_id: string;
  invite_status: string;
  full_name: string | null;
  email: string | null;
  gpa: number | null;
  intended_major: string | null;
  sat_score: number | null;
  essay_count: number;
  school_count: number;
};

export default function CounselorDashboard() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  const text   = isDark ? "#FAFAF5" : "#0a0a12";
  const gold   = isDark ? "#C9A96E" : "#9a7040";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const muted  = isDark ? "rgba(250,250,245,0.45)" : "rgba(10,10,18,0.45)";
  const navBg  = isDark ? "rgba(8,8,16,0.95)" : "rgba(250,250,245,0.95)";
  const cardBg = isDark ? "rgba(255,255,255,0.03)" : "#fff";
  const cardBorder = isDark ? "rgba(250,250,245,0.09)" : "rgba(0,0,0,0.09)";

  const [userEmail,    setUserEmail]    = useState("");
  const [counselorName, setCounselorName] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");
  const [students,     setStudents]     = useState<StudentRecord[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [showModal,    setShowModal]    = useState(false);
  const [inviteEmail,  setInviteEmail]  = useState("");
  const [inviteError,  setInviteError]  = useState("");
  const [inviteSuccess, setInviteSuccess] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const fetchStudents = useCallback(async (userId: string) => {
    const { data: csData } = await supabase
      .from("counselor_students")
      .select("student_id, invite_status")
      .eq("counselor_id", userId);

    if (!csData || csData.length === 0) { setStudents([]); setLoading(false); return; }

    const studentIds = csData.map((cs) => cs.student_id);

    const [{ data: profilesData }, essayResults, schoolResults] = await Promise.all([
      supabase
        .from("profiles")
        .select("user_id, full_name, email, gpa, intended_major, sat_score")
        .in("user_id", studentIds),
      Promise.all(
        studentIds.map((id) =>
          supabase.from("essays").select("id", { count: "exact", head: true }).eq("user_id", id)
        )
      ),
      Promise.all(
        studentIds.map((id) =>
          supabase.from("college_lists").select("id", { count: "exact", head: true }).eq("user_id", id)
        )
      ),
    ]);

    const combined: StudentRecord[] = csData.map((cs, i) => {
      const profile = profilesData?.find((p) => p.user_id === cs.student_id);
      return {
        student_id: cs.student_id,
        invite_status: cs.invite_status,
        full_name: profile?.full_name ?? null,
        email: profile?.email ?? null,
        gpa: profile?.gpa ?? null,
        intended_major: profile?.intended_major ?? null,
        sat_score: profile?.sat_score ?? null,
        essay_count: essayResults[i].count ?? 0,
        school_count: schoolResults[i].count ?? 0,
      };
    });

    setStudents(combined);
    setLoading(false);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/signup"); return; }
      const uid = data.session.user.id;
      setUserEmail(data.session.user.email ?? "");
      setCurrentUserId(uid);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, role")
        .eq("user_id", uid)
        .maybeSingle();

      if (!profile || profile.role !== "counselor") {
        router.push("/dashboard");
        return;
      }
      setCounselorName(profile.full_name ?? "");
      fetchStudents(uid);
    });
  }, [router, fetchStudents]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleInvite(e: React.FormEvent) {
    e.preventDefault();
    setInviteError("");
    setInviteLoading(true);

    const { data: found } = await supabase
      .from("profiles")
      .select("user_id, full_name")
      .eq("email", inviteEmail.trim().toLowerCase())
      .maybeSingle();

    if (!found) {
      setInviteError("No SheldonAI account found with that email. Ask your student to sign up first.");
      setInviteLoading(false);
      return;
    }

    await supabase.from("counselor_students").upsert({
      counselor_id: currentUserId,
      student_id: found.user_id,
      invite_status: "pending",
    });

    setInviteLoading(false);
    setInviteSuccess(true);
    setTimeout(() => {
      setShowModal(false);
      setInviteEmail("");
      setInviteSuccess(false);
      fetchStudents(currentUserId);
    }, 1500);
  }

  function profileCompleteness(s: StudentRecord) {
    const fields = [s.full_name, s.gpa, s.intended_major, s.sat_score];
    return fields.filter(Boolean).length;
  }

  const inputStyle: React.CSSProperties = {
    display: "block", width: "100%", boxSizing: "border-box",
    border: "1px solid rgba(0,0,0,0.12)", borderRadius: 8,
    padding: "10px 14px", fontSize: 14,
    fontFamily: "system-ui,-apple-system,sans-serif",
    outline: "none", color: "#0a0a12", background: "#fff",
  };

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#0a0a12" : "#FAFAF8", color: text, fontFamily: "system-ui,-apple-system,sans-serif" }}>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 28px", borderBottom: `0.5px solid ${border}`,
        background: navBg, backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 500, textDecoration: "none", color: text, letterSpacing: "-0.02em" }}>
          Sheldon<span style={{ color: gold }}>AI</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: muted }}>{userEmail}</span>
          <button onClick={() => router.push("/settings")} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
          <button onClick={handleSignOut} style={{ fontSize: 12, color: muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
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

      {/* Main */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 500, color: text }}>
              {greeting}, {counselorName || "Counselor"}
            </div>
            <div style={{ fontSize: 13, color: muted, marginTop: 4 }}>Your student roster</div>
          </div>
          <button
            onClick={() => { setShowModal(true); setInviteEmail(""); setInviteError(""); setInviteSuccess(false); }}
            style={{
              background: gold, color: "#fff", border: "none",
              borderRadius: 8, padding: "10px 20px", fontSize: 14, fontWeight: 500,
              cursor: "pointer", fontFamily: "system-ui,sans-serif",
            }}
          >
            Add Student +
          </button>
        </div>

        {/* Student roster */}
        {loading ? (
          <div style={{ color: muted, fontSize: 14, marginTop: 60, textAlign: "center" }}>Loading…</div>
        ) : students.length === 0 ? (
          /* Empty state */
          <div style={{ textAlign: "center", marginTop: 80 }}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke={isDark ? "rgba(250,250,245,0.2)" : "rgba(0,0,0,0.18)"} strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 16, display: "block", margin: "0 auto 16px" }}>
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
              <line x1="19" y1="8" x2="19" y2="14"/>
              <line x1="16" y1="11" x2="22" y2="11"/>
            </svg>
            <div style={{ fontSize: 18, fontWeight: 500, color: text, marginBottom: 8 }}>No students yet</div>
            <div style={{ fontSize: 13, color: muted }}>Click &apos;Add Student&apos; to invite your first student</div>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 32 }}>
            {students.map((s) => {
              const complete = profileCompleteness(s);
              const isPending = s.invite_status === "pending";
              return (
                <div
                  key={s.student_id}
                  style={{
                    border: `1px solid ${cardBorder}`,
                    borderRadius: 14,
                    background: cardBg,
                    padding: 24,
                  }}
                >
                  {/* Top row: name + status badge */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                    <div style={{ fontSize: 15, fontWeight: 500, color: text }}>
                      {s.full_name || "Student"}
                    </div>
                    {isPending ? (
                      <span style={{
                        fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 99,
                        background: "rgba(217,119,6,0.1)", color: "#d97706",
                      }}>Pending</span>
                    ) : (
                      <span style={{
                        fontSize: 11, fontWeight: 500, padding: "2px 10px", borderRadius: 99,
                        background: "rgba(22,163,74,0.1)", color: "#16a34a",
                      }}>Active</span>
                    )}
                  </div>

                  {/* Email */}
                  <div style={{ fontSize: 12, color: muted, marginBottom: 16 }}>{s.email ?? "—"}</div>

                  {/* Stats row */}
                  <div style={{ display: "flex", gap: 0, borderRadius: 8, overflow: "hidden", border: `1px solid ${cardBorder}`, marginBottom: 16 }}>
                    {[
                      { label: "Profile", value: `${complete}/4` },
                      { label: "Essays", value: String(s.essay_count) },
                      { label: "Schools", value: String(s.school_count) },
                    ].map((stat, i) => (
                      <div
                        key={stat.label}
                        style={{
                          flex: 1, textAlign: "center", padding: "10px 0",
                          borderLeft: i > 0 ? `1px solid ${cardBorder}` : "none",
                        }}
                      >
                        <div style={{ fontSize: 15, fontWeight: 600, color: text }}>{stat.value}</div>
                        <div style={{ fontSize: 11, color: muted, marginTop: 2 }}>{stat.label}</div>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  {isPending ? (
                    <button disabled style={{
                      width: "100%", padding: "9px 0", borderRadius: 8, fontSize: 13,
                      background: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)",
                      color: muted, border: "none", cursor: "default",
                      fontFamily: "system-ui,sans-serif",
                    }}>
                      Invitation Pending
                    </button>
                  ) : (
                    <div style={{ display: "flex", gap: 8 }}>
                      <button
                        onClick={() => router.push(`/counselor/student/${s.student_id}`)}
                        style={{
                          flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13,
                          background: "none", border: `1.5px solid ${gold}`, color: gold,
                          cursor: "pointer", fontFamily: "system-ui,sans-serif", fontWeight: 500,
                        }}
                      >
                        View Profile
                      </button>
                      <button
                        onClick={() => router.push(`/counselor/student/${s.student_id}/essays`)}
                        style={{
                          flex: 1, padding: "9px 0", borderRadius: 8, fontSize: 13,
                          background: gold, border: "none", color: "#fff",
                          cursor: "pointer", fontFamily: "system-ui,sans-serif", fontWeight: 500,
                        }}
                      >
                        View Essays
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Student Modal */}
      {showModal && (
        <div
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}
          style={{
            position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)",
            zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center",
          }}
        >
          <div style={{
            background: "#fff", borderRadius: 16, padding: 32, width: 440,
            maxWidth: "calc(100vw - 48px)", position: "relative",
            boxShadow: "0 8px 40px rgba(0,0,0,0.18)",
          }}>
            {/* Close */}
            <button
              onClick={() => setShowModal(false)}
              style={{
                position: "absolute", top: 16, right: 16,
                background: "none", border: "none", fontSize: 20, cursor: "pointer",
                color: "rgba(10,10,18,0.4)", lineHeight: 1,
              }}
            >
              ×
            </button>

            <div style={{ fontSize: 18, fontWeight: 600, color: "#0a0a12", marginBottom: 20, fontFamily: "system-ui,sans-serif" }}>
              Add a Student
            </div>

            {inviteSuccess ? (
              <div style={{ textAlign: "center", padding: "20px 0", color: "#16a34a", fontSize: 15, fontWeight: 500 }}>
                Invitation sent!
              </div>
            ) : (
              <form onSubmit={handleInvite} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="email"
                  placeholder="Student's email address"
                  required
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  style={inputStyle}
                />
                {inviteError && (
                  <p style={{ fontSize: 13, color: "#dc2626", margin: 0, fontFamily: "system-ui,sans-serif" }}>
                    {inviteError}
                  </p>
                )}
                <button
                  type="submit"
                  disabled={inviteLoading}
                  style={{
                    width: "100%", height: 44, borderRadius: 8, fontSize: 14, fontWeight: 500,
                    background: "#9a7040", color: "#fff", border: "none",
                    cursor: inviteLoading ? "not-allowed" : "pointer",
                    opacity: inviteLoading ? 0.6 : 1,
                    fontFamily: "system-ui,sans-serif",
                  }}
                >
                  {inviteLoading ? "Sending…" : "Send Invitation"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
