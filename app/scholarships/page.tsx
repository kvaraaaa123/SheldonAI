"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { Scholarship } from "@/lib/scholarships";
import ScholarshipEmblem from "@/components/ScholarshipEmblem";

type MatchedScholarship = Scholarship & {
  matchScore?: number;
  whyMatch?: string;
  priority?: "high" | "medium" | "low";
};

type SavedScholarship = {
  id: string;
  scholarship_id: string;
  scholarship_name: string;
  scholarship_data: Scholarship;
  status: string;
  created_at: string;
};

export default function ScholarshipsPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  const bg      = isDark ? "#080810"                : "#FAFAF5";
  const surface = isDark ? "#0f0f1a"                : "#ffffff";
  const border  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const text     = isDark ? "#FAFAF5"               : "#0a0a12";
  const muted    = isDark ? "rgba(250,250,245,0.45)": "rgba(10,10,18,0.45)";
  const gold     = isDark ? "#C9A96E"               : "#9a7040";
  const navBg    = isDark ? "rgba(8,8,16,0.95)"     : "rgba(250,250,245,0.95)";
  const inputBg  = isDark ? "rgba(255,255,255,0.04)": "rgba(0,0,0,0.04)";

  const [userEmail,         setUserEmail]         = useState("");
  const [userId,            setUserId]            = useState("");
  const [profile,           setProfile]           = useState<Record<string, unknown> | null>(null);
  const [activityGrades,    setActivityGrades]    = useState<Record<string, unknown> | null>(null);
  const [scholarships,      setScholarships]      = useState<MatchedScholarship[]>([]);
  const [savedScholarships, setSavedScholarships] = useState<SavedScholarship[]>([]);
  const [searchQuery,       setSearchQuery]       = useState("");
  const [searchResults,     setSearchResults]     = useState<MatchedScholarship[]>([]);
  const [isLoading,         setIsLoading]         = useState(true);
  const [isSearching,       setIsSearching]       = useState(false);
  const [activeScholarship, setActiveScholarship] = useState<MatchedScholarship | null>(null);
  const [advisorAdvice,     setAdvisorAdvice]     = useState("");
  const [isGettingAdvice,   setIsGettingAdvice]   = useState(false);
  const [activeTab,         setActiveTab]         = useState<"matched" | "search" | "saved">("matched");
  const [essayText,         setEssayText]         = useState("");
  const [showEssayHelper,   setShowEssayHelper]   = useState(false);
  const [savedIds,          setSavedIds]          = useState<Set<string>>(new Set());
  const [justSaved,         setJustSaved]         = useState<string | null>(null);
  const [essaySaved,        setEssaySaved]        = useState(false);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Mount ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { router.push("/"); return; }
      const uid = session.user.id;
      setUserId(uid);
      setUserEmail(session.user.email ?? "");

      const [{ data: profileRow }, { data: gradesRow }, { data: savedRows }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle(),
        supabase.from("activity_grades").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("saved_scholarships").select("*").eq("user_id", uid),
      ]);

      const prof = profileRow as Record<string, unknown> | null;
      const grades = gradesRow as Record<string, unknown> | null;
      if (prof) setProfile(prof);
      if (grades) setActivityGrades(grades);
      if (savedRows) {
        setSavedScholarships(savedRows as SavedScholarship[]);
        setSavedIds(new Set(savedRows.map((s: SavedScholarship) => s.scholarship_id)));
      }

      // Auto-fetch matches
      try {
        const res = await fetch("/api/scholarship-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile: prof, activityGrades: grades }),
        });
        if (res.ok) {
          const data = await res.json();
          setScholarships(data.scholarships || []);
        }
      } catch (err) {
        console.error("Scholarship match error:", err);
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Search debounce ───────────────────────────────────────────────────────
  useEffect(() => {
    if (activeTab !== "search") return;
    if (searchTimer.current) clearTimeout(searchTimer.current);
    if (!searchQuery.trim()) { setSearchResults([]); return; }
    searchTimer.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch("/api/scholarship-match", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ profile, activityGrades, searchQuery }),
        });
        if (res.ok) {
          const data = await res.json();
          setSearchResults(data.scholarships || []);
        }
      } catch (err) {
        console.error("Search error:", err);
      } finally {
        setIsSearching(false);
      }
    }, 400);
  }, [searchQuery, activeTab]); // eslint-disable-line react-hooks/exhaustive-deps

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleSave(s: MatchedScholarship) {
    if (!userId || savedIds.has(s.id)) return;
    await supabase.from("saved_scholarships").insert({
      user_id: userId,
      scholarship_id: s.id,
      scholarship_name: s.name,
      scholarship_data: s,
    });
    setSavedIds(prev => new Set([...prev, s.id]));
    setJustSaved(s.id);
    setTimeout(() => setJustSaved(null), 2000);
  }

  async function getAdvice(regenerate = false) {
    if (!activeScholarship) return;
    setIsGettingAdvice(true);
    if (regenerate) setAdvisorAdvice("");
    try {
      const res = await fetch("/api/scholarship-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          scholarshipName: activeScholarship.name,
          scholarshipDescription: activeScholarship.description,
          essayPrompt: activeScholarship.essayPrompt,
          profile,
          activityGrades,
          regenerate,
        }),
      });
      const data = await res.json();
      setAdvisorAdvice(data.advice || "Unable to load advice.");
    } catch {
      setAdvisorAdvice("Network error — please try again.");
    } finally {
      setIsGettingAdvice(false);
    }
  }

  async function handleSaveEssay() {
    if (!userId || !essayText.trim() || !activeScholarship) return;
    await supabase.from("essays").insert({
      user_id: userId,
      essay: essayText,
      result: { overallFeedback: "Scholarship essay saved" },
      essay_type: "scholarship",
      university_name: activeScholarship.name,
    });
    setEssaySaved(true);
    setTimeout(() => setEssaySaved(false), 2500);
  }

  function selectScholarship(s: MatchedScholarship) {
    setActiveScholarship(s);
    setShowEssayHelper(false);
    setAdvisorAdvice("");
    setEssayText("");
    setEssaySaved(false);
  }

  // ── Deadline color ────────────────────────────────────────────────────────
  function deadlineColor(month: number) {
    const now = new Date();
    const diff = (month - (now.getMonth() + 1) + 12) % 12;
    if (diff <= 2) return "#f87171";
    if (diff <= 4) return "#fbbf24";
    return "#4ade80";
  }

  // ── Score color ───────────────────────────────────────────────────────────
  function scoreColor(score: number) {
    if (score >= 80) return "#4ade80";
    if (score >= 60) return "#fbbf24";
    return "#f87171";
  }

  // ── Scholarship list item ─────────────────────────────────────────────────
  function ScholarshipRow({ s }: { s: MatchedScholarship }) {
    const isActive = activeScholarship?.id === s.id;
    return (
      <button
        onClick={() => selectScholarship(s)}
        style={{
          width: "100%", textAlign: "left", padding: "12px 14px",
          background: isActive ? (isDark ? "rgba(201,169,110,0.1)" : "rgba(154,112,64,0.08)") : "transparent",
          border: "none", borderBottom: `0.5px solid ${border}`,
          cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12,
          position: "relative",
        }}
      >
        {/* Match score badge — top right */}
        {s.matchScore !== undefined && (
          <div style={{
            position: "absolute", top: 10, right: 10,
            width: 36, height: 36, borderRadius: "50%",
            border: `2px solid ${scoreColor(s.matchScore)}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            flexDirection: "column", flexShrink: 0,
          }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: scoreColor(s.matchScore), lineHeight: 1 }}>
              {s.matchScore}
            </span>
            <span style={{ fontSize: 7, color: muted, lineHeight: 1 }}>%</span>
          </div>
        )}
        {/* Emblem */}
        <div style={{ flexShrink: 0 }}>
          <ScholarshipEmblem name={s.name} size={40} />
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0, paddingRight: s.matchScore !== undefined ? 40 : 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: isActive ? gold : text, lineHeight: 1.3, marginBottom: 2 }}>
            {s.name}
          </div>
          <div style={{ fontSize: 13, fontWeight: 500, color: gold, marginBottom: 2 }}>{s.amount}</div>
          <div style={{ fontSize: 11, color: muted, marginBottom: 4 }}>{s.provider}</div>
          {s.tags?.length > 0 && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
              {s.tags.slice(0, 3).map(tag => (
                <span key={tag} style={{ fontSize: 9, padding: "1px 6px", borderRadius: 999, border: `0.5px solid ${border}`, color: muted }}>
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </button>
    );
  }

  // ── Eligibility check ─────────────────────────────────────────────────────
  function EligibilityChecklist({ s }: { s: Scholarship }) {
    const items: { label: string; met: boolean | null }[] = [];
    if (s.eligibility.gpaMin) {
      const gpa = parseFloat(String(profile?.gpa || "0"));
      items.push({ label: `GPA ≥ ${s.eligibility.gpaMin}`, met: gpa > 0 ? gpa >= s.eligibility.gpaMin : null });
    }
    if (s.eligibility.ethnicity?.length) {
      items.push({ label: `Ethnicity: ${s.eligibility.ethnicity.join(" or ")}`, met: null });
    }
    if (s.eligibility.religion?.length) {
      items.push({ label: `Religion: ${s.eligibility.religion.join(" or ")}`, met: null });
    }
    if (s.eligibility.nationality?.length) {
      items.push({ label: `Nationality: ${s.eligibility.nationality.join(" or ")}`, met: null });
    }
    if (s.eligibility.major?.length) {
      items.push({ label: `Major: ${s.eligibility.major.slice(0, 3).join(", ")}${s.eligibility.major.length > 3 ? "..." : ""}`, met: null });
    }
    if (s.eligibility.financialNeed) {
      items.push({ label: "Financial need required", met: null });
    }
    if (s.eligibility.firstGen) {
      items.push({ label: "First-generation student", met: null });
    }
    if (items.length === 0) return <p style={{ fontSize: 12, color: muted }}>Open to all eligible students.</p>;
    return (
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: muted }}>
            <span style={{ color: item.met === true ? "#4ade80" : item.met === false ? "#f87171" : muted, fontSize: 11 }}>
              {item.met === true ? "✓" : item.met === false ? "✗" : "·"}
            </span>
            {item.label}
          </div>
        ))}
      </div>
    );
  }

  const listToShow = activeTab === "search" ? searchResults : scholarships;
  const wordCount = essayText.trim().split(/\s+/).filter(Boolean).length;

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
          <button onClick={handleSignOut} style={{ fontSize: 12, color: muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Sign out
          </button>
          <button onClick={() => router.push("/settings")} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
          <button onClick={toggleTheme} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: `0.5px solid ${border}`, background: "none", cursor: "pointer", color: muted, fontSize: 15 }}>
            {isDark ? "☀" : "☽"}
          </button>
        </div>
      </nav>

      {/* Loading */}
      {isLoading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 57px)", gap: 16 }}>
          <p style={{ fontFamily: "Georgia, serif", fontSize: 18, color: gold, fontStyle: "italic" }}>
            Finding scholarships matched to your profile...
          </p>
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", background: gold, animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite`, opacity: 0.5 }} />
            ))}
          </div>
          <style>{`@keyframes pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
        </div>
      ) : (
        <div style={{ display: "flex", minHeight: "calc(100vh - 57px)" }}>

          {/* Left sidebar */}
          <div style={{ width: 280, flexShrink: 0, borderRight: `0.5px solid ${border}`, display: "flex", flexDirection: "column", position: "sticky", top: 57, height: "calc(100vh - 57px)", overflowY: "auto" }}>

            {/* Sidebar header */}
            <div style={{ padding: "20px 16px 14px", borderBottom: `0.5px solid ${border}` }}>
              <h1 style={{ fontFamily: "Georgia, serif", fontSize: 22, color: gold, margin: 0, fontWeight: 500 }}>Scholarships</h1>
              <p style={{ fontSize: 12, color: muted, margin: "4px 0 0" }}>Matched to your profile</p>
            </div>

            {/* Tabs */}
            <div style={{ display: "flex", borderBottom: `0.5px solid ${border}`, padding: "0 4px" }}>
              {(["matched", "search", "saved"] as const).map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  style={{
                    flex: 1, padding: "10px 4px", fontSize: 11, fontWeight: 600,
                    textTransform: "uppercase", letterSpacing: "0.06em",
                    background: "none", border: "none", cursor: "pointer",
                    color: activeTab === tab ? gold : muted,
                    borderBottom: activeTab === tab ? `2px solid ${gold}` : "2px solid transparent",
                    transition: "color 0.15s",
                  }}>
                  {tab === "matched" ? "For You" : tab === "search" ? "Search" : "Saved"}
                  {tab === "saved" && savedScholarships.length > 0 && (
                    <span style={{ marginLeft: 4, fontSize: 10, background: `${gold}33`, color: gold, padding: "1px 5px", borderRadius: 999 }}>
                      {savedScholarships.length}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search input */}
            {activeTab === "search" && (
              <div style={{ padding: "10px 12px", borderBottom: `0.5px solid ${border}` }}>
                <input
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search scholarships..."
                  style={{
                    width: "100%", padding: "9px 12px", fontSize: 13,
                    border: `0.5px solid ${border}`, borderRadius: 8,
                    background: inputBg, color: text, outline: "none", boxSizing: "border-box",
                  }}
                />
              </div>
            )}

            {/* List */}
            <div style={{ flex: 1, overflowY: "auto" }}>
              {activeTab === "saved" ? (
                savedScholarships.length === 0 ? (
                  <p style={{ fontSize: 12, color: muted, padding: "20px 16px" }}>No saved scholarships yet.</p>
                ) : savedScholarships.map(saved => (
                  <button key={saved.id} onClick={() => selectScholarship(saved.scholarship_data as MatchedScholarship)}
                    style={{ width: "100%", textAlign: "left", padding: "12px 14px", background: "transparent", border: "none", borderBottom: `0.5px solid ${border}`, cursor: "pointer", display: "flex", alignItems: "flex-start", gap: 12 }}>
                    <div style={{ flexShrink: 0 }}>
                      <ScholarshipEmblem name={saved.scholarship_name} size={40} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: text, lineHeight: 1.3, marginBottom: 2 }}>{saved.scholarship_name}</div>
                      <div style={{ fontSize: 13, fontWeight: 500, color: gold, marginBottom: 4 }}>{saved.scholarship_data.amount}</div>
                      <div style={{ fontSize: 10, color: muted, display: "inline-block", padding: "1px 6px", border: `0.5px solid ${border}`, borderRadius: 999 }}>
                        {saved.status}
                      </div>
                    </div>
                  </button>
                ))
              ) : activeTab === "search" && !searchQuery.trim() ? (
                <p style={{ fontSize: 12, color: muted, padding: "20px 16px" }}>Type to search scholarships...</p>
              ) : isSearching ? (
                <p style={{ fontSize: 12, color: muted, padding: "20px 16px", fontStyle: "italic" }}>Searching...</p>
              ) : listToShow.length === 0 ? (
                <p style={{ fontSize: 12, color: muted, padding: "20px 16px" }}>
                  {activeTab === "matched" ? "No matches found. Complete your profile for better results." : "No results found."}
                </p>
              ) : listToShow.map(s => <ScholarshipRow key={s.id} s={s} />)}
            </div>
          </div>

          {/* Main content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "32px 36px 64px" }}>
            {!activeScholarship ? (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 400, color: muted, fontStyle: "italic", fontSize: 15 }}>
                Select a scholarship to see details and get essay help
              </div>
            ) : (
              <div style={{ maxWidth: 700 }}>

                {/* Top section */}
                <div style={{ marginBottom: 24 }}>
                  {/* Emblem centered */}
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
                    <ScholarshipEmblem name={activeScholarship.name} size={80} />
                  </div>

                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <h2 style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 500, color: text, margin: "0 0 4px" }}>
                        {activeScholarship.name}
                      </h2>
                      <p style={{ fontSize: 14, color: muted, margin: 0 }}>{activeScholarship.provider}</p>
                    </div>
                    {activeScholarship.matchScore !== undefined && (
                      <div style={{ textAlign: "center", flexShrink: 0 }}>
                        <div style={{
                          width: 56, height: 56, borderRadius: "50%",
                          border: `2.5px solid ${scoreColor(activeScholarship.matchScore)}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          flexDirection: "column",
                        }}>
                          <span style={{ fontSize: 16, fontWeight: 700, color: scoreColor(activeScholarship.matchScore), lineHeight: 1 }}>
                            {activeScholarship.matchScore}
                          </span>
                          <span style={{ fontSize: 9, color: muted }}>match</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ fontSize: 28, fontWeight: 600, color: gold, marginBottom: 10 }}>
                    {activeScholarship.amount}
                  </div>

                  <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", marginBottom: 12 }}>
                    <span style={{
                      fontSize: 11, fontWeight: 600, padding: "3px 10px", borderRadius: 999,
                      background: `${deadlineColor(activeScholarship.deadlineMonth)}22`,
                      color: deadlineColor(activeScholarship.deadlineMonth),
                      border: `0.5px solid ${deadlineColor(activeScholarship.deadlineMonth)}44`,
                    }}>
                      Deadline: {activeScholarship.deadline}
                    </span>
                    {activeScholarship.essayRequired && (
                      <span style={{ fontSize: 11, padding: "3px 10px", borderRadius: 999, border: `0.5px solid ${border}`, color: muted }}>
                        Essay required
                      </span>
                    )}
                  </div>

                  {activeScholarship.whyMatch && (
                    <p style={{ fontSize: 13, color: muted, fontStyle: "italic", fontFamily: "Georgia, serif", lineHeight: 1.6, margin: "0 0 16px" }}>
                      {activeScholarship.whyMatch}
                    </p>
                  )}

                  {/* Tags */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
                    {activeScholarship.tags.map(tag => (
                      <span key={tag} style={{ fontSize: 10, padding: "3px 9px", borderRadius: 999, border: `0.5px solid ${border}`, color: muted }}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 14, color: text, lineHeight: 1.7, marginBottom: 20 }}>
                    {activeScholarship.description}
                  </p>

                  {/* Eligibility */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: gold, marginBottom: 10 }}>
                      Eligibility Requirements
                    </div>
                    <EligibilityChecklist s={activeScholarship} />
                  </div>

                  {/* Action buttons */}
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <button
                      onClick={() => handleSave(activeScholarship)}
                      disabled={savedIds.has(activeScholarship.id)}
                      style={{
                        fontSize: 13, padding: "9px 18px", borderRadius: 8, cursor: savedIds.has(activeScholarship.id) ? "default" : "pointer",
                        border: `0.5px solid ${border}`, background: "transparent", color: savedIds.has(activeScholarship.id) ? gold : muted,
                      }}>
                      {justSaved === activeScholarship.id ? "Saved ✓" : savedIds.has(activeScholarship.id) ? "Bookmarked ✓" : "☆ Save Scholarship"}
                    </button>
                    <a
                      href={activeScholarship.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        fontSize: 13, padding: "9px 18px", borderRadius: 8,
                        border: `0.5px solid ${border}`, background: "transparent", color: muted,
                        textDecoration: "none", display: "inline-flex", alignItems: "center",
                      }}>
                      Visit Website →
                    </a>
                    {activeScholarship.essayRequired && (
                      <button
                        onClick={() => setShowEssayHelper(v => !v)}
                        style={{
                          fontSize: 13, padding: "9px 20px", borderRadius: 8, cursor: "pointer",
                          border: `1px solid ${gold}`,
                          background: `linear-gradient(135deg, ${gold}, ${isDark ? "#a07840" : "#7a5830"})`,
                          color: isDark ? "#080810" : "#FAFAF5", fontWeight: 600,
                        }}>
                        {showEssayHelper ? "Hide Essay Help" : "Get Essay Help →"}
                      </button>
                    )}
                  </div>
                </div>

                {/* Essay helper */}
                {showEssayHelper && (
                  <div style={{ border: `1px solid ${gold}44`, borderRadius: 12, overflow: "hidden", marginTop: 8 }}>
                    <div style={{ padding: "14px 20px", background: `${gold}0d`, borderBottom: `0.5px solid ${gold}22` }}>
                      <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: gold, margin: 0 }}>
                        Essay Help — {activeScholarship.name}
                      </p>
                    </div>

                    <div style={{ padding: "20px" }}>
                      {!activeScholarship.essayPrompt ? (
                        <p style={{ fontSize: 13, color: muted }}>This scholarship does not require an essay.</p>
                      ) : (
                        <>
                          {/* The prompt */}
                          <div style={{ marginBottom: 20 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, marginBottom: 8 }}>
                              The Prompt
                            </div>
                            <div style={{ fontSize: 13, color: text, background: inputBg, border: `0.5px solid ${border}`, borderRadius: 8, padding: "12px 14px", lineHeight: 1.6 }}>
                              {activeScholarship.essayPrompt}
                            </div>
                          </div>

                          {/* Topic ideas */}
                          <div style={{ marginBottom: 24 }}>
                            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: gold, marginBottom: 10 }}>
                              Topic Ideas
                            </div>
                            {!advisorAdvice && !isGettingAdvice && (
                              <button
                                onClick={() => getAdvice(false)}
                                style={{
                                  fontSize: 13, padding: "9px 20px", borderRadius: 8, cursor: "pointer",
                                  border: `1px solid ${gold}`,
                                  background: `linear-gradient(135deg, ${gold}, ${isDark ? "#a07840" : "#7a5830"})`,
                                  color: isDark ? "#080810" : "#FAFAF5", fontWeight: 600,
                                }}>
                                Get Topic Ideas
                              </button>
                            )}
                            {isGettingAdvice && (
                              <p style={{ fontSize: 13, color: muted, fontStyle: "italic" }}>
                                {advisorAdvice === "" ? "Getting new ideas..." : "Getting personalized ideas..."}
                              </p>
                            )}
                            {advisorAdvice && !isGettingAdvice && (
                              <>
                                <p style={{ fontSize: 13, color: text, fontFamily: "Georgia, serif", lineHeight: 1.7, margin: "0 0 12px" }}>
                                  {advisorAdvice}
                                </p>
                                <button
                                  onClick={() => getAdvice(true)}
                                  style={{ fontSize: 12, color: gold, background: "transparent", border: `0.5px solid ${border}`, borderRadius: 6, padding: "4px 12px", cursor: "pointer" }}>
                                  Different ideas ↺
                                </button>
                              </>
                            )}
                          </div>

                          {/* Essay textarea */}
                          <div>
                            <div style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, marginBottom: 8 }}>
                              Your Essay
                            </div>
                            <textarea
                              value={essayText}
                              onChange={e => setEssayText(e.target.value)}
                              placeholder="Write your scholarship essay here..."
                              style={{
                                width: "100%", minHeight: 200, padding: "14px", fontSize: 14,
                                fontFamily: "Georgia, 'Times New Roman', serif", lineHeight: 1.7,
                                border: `0.5px solid ${border}`, borderRadius: 8,
                                background: inputBg, color: text, resize: "vertical",
                                outline: "none", boxSizing: "border-box",
                              }}
                            />
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 10 }}>
                              <span style={{ fontSize: 12, color: muted }}>{wordCount} words</span>
                              <button
                                onClick={handleSaveEssay}
                                disabled={!essayText.trim()}
                                style={{
                                  fontSize: 13, padding: "8px 18px", borderRadius: 8, cursor: essayText.trim() ? "pointer" : "not-allowed",
                                  border: `1px solid ${gold}`,
                                  background: `linear-gradient(135deg, ${gold}, ${isDark ? "#a07840" : "#7a5830"})`,
                                  color: isDark ? "#080810" : "#FAFAF5", fontWeight: 600,
                                  opacity: essayText.trim() ? 1 : 0.4,
                                }}>
                                {essaySaved ? "Essay saved ✓" : "Analyze Essay →"}
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
