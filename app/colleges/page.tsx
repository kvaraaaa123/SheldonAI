"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { UNIVERSITY_DATABASE, UniversityEntry } from "@/lib/universityDatabase";
import { UNIVERSITY_RESEARCH } from "@/lib/universityResearch";
import UniversityEmblem from "@/components/UniversityEmblem";

type SavedCollege = {
  id?: string;
  user_id?: string;
  university_name: string;
  university_data: UniversityEntry | null;
  status: "reach" | "match" | "safety" | "undecided";
  added_at?: string;
};

type MatchResult = UniversityEntry & {
  matchScore: number;
  status: "reach" | "match" | "safety";
  whyMajor: string;
  whyProfile: string;
  whyPreferences: string;
  rank: number;
};

type ResearchCategory = {
  label: string;
  emoji: string;
  items: { name: string; detail: string }[];
};

type UniversityResearch = {
  essayWarning: string;
  philosophy?: string;
  targetStudent?: string;
  uniqueFeatures?: string;
  categories: ResearchCategory[];
};

type ChatMessage = { role: "user" | "assistant"; content: string };

const LOADING_MESSAGES = [
  "Analyzing your academic profile...",
  "Matching campus preferences...",
  "Ranking universities by fit...",
  "Finalizing your personalized list...",
];

export default function CollegesPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  const bg      = isDark ? "#080810" : "#FAFAF5";
  const text     = isDark ? "#FAFAF5" : "#0a0a12";
  const gold     = isDark ? "#C9A96E" : "#9a7040";
  const surface  = isDark ? "#0f0f1a" : "#ffffff";
  const border   = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const muted    = isDark ? "rgba(250,250,245,0.45)" : "rgba(10,10,18,0.45)";
  const navBg    = isDark ? "rgba(8,8,16,0.95)" : "rgba(250,250,245,0.95)";
  const inputBg  = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";

  const [phase, setPhase]                           = useState<null | "ready">(null);
  const [profile, setProfile]                       = useState<Record<string, unknown> | null>(null);
  const [activityGrades, setActivityGrades]         = useState<Record<string, unknown> | null>(null);
  const [savedColleges, setSavedColleges]           = useState<SavedCollege[]>([]);
  const [matches, setMatches]                       = useState<MatchResult[]>([]);
  const [searchQuery, setSearchQuery]               = useState("");
  const [searchResults, setSearchResults]           = useState<UniversityEntry[]>([]);
  const [activeTab, setActiveTab]                   = useState<"match" | "search">("match");
  const [selectedUniversity, setSelectedUniversity] = useState<(UniversityEntry & Partial<MatchResult>) | null>(null);
  const [isMatching, setIsMatching]                 = useState(false);
  const [universityResearch, setUniversityResearch] = useState<UniversityResearch | null>(null);
  const [isLoadingResearch, setIsLoadingResearch]   = useState(false);
  const [userEmail, setUserEmail]                   = useState("");
  const [addedConfirm, setAddedConfirm]             = useState<string | null>(null);
  const [openCats, setOpenCats]                     = useState<Set<string>>(new Set());
  const [openResearchCats, setOpenResearchCats]     = useState<Set<string>>(new Set(["0"]));
  const [loadingMsgIdx, setLoadingMsgIdx]           = useState(0);
  const [matchError, setMatchError]                 = useState("");

  // Research chat
  const [chatMessages, setChatMessages]             = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput]                   = useState("");
  const [isChatting, setIsChatting]                 = useState(false);
  const chatEndRef                                  = useRef<HTMLDivElement>(null);

  // Search debounce
  const searchTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const matchesTriggered = useRef(false);

  // Cycle loading messages while matching
  useEffect(() => {
    if (!isMatching) { setLoadingMsgIdx(0); return; }
    const iv = setInterval(() => {
      setLoadingMsgIdx(prev => (prev + 1) % LOADING_MESSAGES.length);
    }, 3000);
    return () => clearInterval(iv);
  }, [isMatching]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/"); return; }
      const uid = data.session.user.id;
      setUserEmail(data.session.user.email ?? "");

      const [{ data: profileRow }, { data: gradesRow }, { data: collegesData }] = await Promise.all([
        supabase.from("profiles").select("*").eq("user_id", uid).maybeSingle(),
        supabase.from("activity_grades").select("*").eq("user_id", uid).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("college_lists").select("*").eq("user_id", uid).order("added_at", { ascending: false }),
      ]);

      const prof = profileRow as Record<string, unknown> | null;
      const grades = gradesRow as Record<string, unknown> | null;
      const cols: SavedCollege[] = (collegesData || []) as SavedCollege[];

      setProfile(prof);
      setActivityGrades(grades);
      setSavedColleges(cols);
      setPhase("ready");

      if (cols.length === 0 && prof) {
        matchesTriggered.current = true;
      }
    });
  }, [router]);

  // Auto-trigger match after state is set (only on first load with no saved colleges)
  useEffect(() => {
    if (matchesTriggered.current && phase === "ready" && profile && savedColleges.length === 0 && matches.length === 0) {
      matchesTriggered.current = false;
      getMatches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, profile]);

  // Initialize search results
  useEffect(() => {
    setSearchResults([...UNIVERSITY_DATABASE].sort((a, b) => a.name.localeCompare(b.name)));
  }, []);

  async function getMatches() {
    setIsMatching(true);
    setMatchError("");
    try {
      const res = await fetch("/api/college-match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, activityGrades, savedColleges }),
      });
      const data = await res.json();
      if (data.error) {
        setMatchError(data.error);
      } else if (data.matches) {
        setMatches(data.matches);
      }
    } catch (e) {
      setMatchError("Network error. Please try again.");
      console.error("Match error:", e);
    } finally {
      setIsMatching(false);
    }
  }

  function searchUniversities(query: string) {
    const q = query.toLowerCase().trim();
    if (!q) {
      setSearchResults([...UNIVERSITY_DATABASE].sort((a, b) => a.name.localeCompare(b.name)));
      return;
    }
    const filtered = UNIVERSITY_DATABASE.filter(u =>
      u.name.toLowerCase().includes(q) ||
      u.location.toLowerCase().includes(q) ||
      u.state.toLowerCase().includes(q) ||
      u.type.toLowerCase().includes(q) ||
      u.tags.some(t => t.toLowerCase().includes(q))
    );
    setSearchResults(filtered.slice(0, 30));
  }

  // FIX 1: Robust addToList with error surfacing
  const addToList = async (university: UniversityEntry, status?: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;
      if (!uid) { console.error("No uid"); return; }

      const alreadySaved = savedColleges.some(c => c.university_name === university.name);
      if (alreadySaved) { return; }

      const insertData = {
        user_id: uid,
        university_name: university.name,
        university_data: university,
        status: status || "undecided",
      };

      const { data, error } = await supabase
        .from("college_lists")
        .insert(insertData)
        .select()
        .single();

      if (error) {
        alert("Error saving: " + error.message);
        return;
      }

      setSavedColleges(prev => [...prev, { ...insertData, id: (data as { id: string }).id, status: (status || "undecided") as SavedCollege["status"] }]);
      setAddedConfirm(university.name);
      setTimeout(() => setAddedConfirm(null), 2000);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("addToList error:", err);
      alert("Error: " + msg);
    }
  };

  async function removeFromList(universityName: string) {
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id;
    if (!uid) return;
    await supabase.from("college_lists").delete().eq("user_id", uid).eq("university_name", universityName);
    setSavedColleges(prev => prev.filter(c => c.university_name !== universityName));
    if (selectedUniversity?.name === universityName) setSelectedUniversity(null);
  }

  async function updateStatus(universityName: string, newStatus: SavedCollege["status"]) {
    const { data: { session } } = await supabase.auth.getSession();
    const uid = session?.user?.id;
    if (!uid) return;
    await supabase.from("college_lists").update({ status: newStatus }).eq("user_id", uid).eq("university_name", universityName);
    setSavedColleges(prev => prev.map(c =>
      c.university_name === universityName ? { ...c, status: newStatus } : c
    ));
  }

  const loadUniversityResearch = async (universityName: string) => {
    if (!universityName) return;

    // Step 1: Check lib/universityResearch.ts FIRST — instant, no API call
    const localMatch = UNIVERSITY_RESEARCH.find(r =>
      r.name.toLowerCase() === universityName.toLowerCase() ||
      universityName.toLowerCase().includes(r.name.toLowerCase()) ||
      r.name.toLowerCase().includes(universityName.toLowerCase()) ||
      r.id === universityName.toLowerCase().replace(/\s+/g, "-")
    );

    if (localMatch) {
      setUniversityResearch(localMatch as UniversityResearch);
      setIsLoadingResearch(false);
      return;
    }

    // Step 2: Check Supabase cache
    setIsLoadingResearch(true);
    try {
      const { data: cached } = await supabase
        .from("university_research_cache")
        .select("*")
        .eq("university_name", universityName)
        .maybeSingle();

      if (cached?.research_data) {
        setUniversityResearch(cached.research_data);
        setIsLoadingResearch(false);
        return;
      }

      // Step 3: Call API as last resort
      const res = await fetch("/api/university-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ universityName }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.research) {
          setUniversityResearch(data.research);
          supabase.from("university_research_cache").insert({
            university_name: universityName,
            research_data: data.research,
          }).then(() => {});
        }
      }
    } catch (err) {
      console.error("Research load error:", err);
    }
    setIsLoadingResearch(false);
  };

  async function sendChat() {
    if (!chatInput.trim() || !selectedUniversity) return;
    const userMsg: ChatMessage = { role: "user", content: chatInput };
    setChatMessages(prev => [...prev, userMsg]);
    setChatInput("");
    setIsChatting(true);
    try {
      const res = await fetch("/api/whyus-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university: selectedUniversity.name,
          question: chatInput,
          messages: [...chatMessages, userMsg],
        }),
      });
      const data = await res.json();
      setChatMessages(prev => [...prev, { role: "assistant", content: data.reply || data.error || "No response." }]);
    } catch {
      setChatMessages(prev => [...prev, { role: "assistant", content: "Network error." }]);
    } finally {
      setIsChatting(false);
    }
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  function cycleStatus(current: SavedCollege["status"]): SavedCollege["status"] {
    const order: SavedCollege["status"][] = ["undecided", "reach", "match", "safety"];
    return order[(order.indexOf(current) + 1) % order.length];
  }

  function statusColor(s: string) {
    if (s === "reach") return isDark ? "#f87171" : "#b91c1c";
    if (s === "match") return isDark ? "#fbbf24" : "#92400e";
    if (s === "safety") return isDark ? "#4ade80" : "#166534";
    return muted;
  }

  // FIX 3: Human-readable label functions
  function typeLabelFull(t: string) {
    if (t === "private") return "Private University";
    if (t === "public") return "Public University";
    if (t === "liberal_arts") return "Liberal Arts College";
    return t;
  }

  function sizeLabelFull(s: string) {
    if (s === "small") return "Small (under 3,000 students)";
    if (s === "medium") return "Medium (3,000–10,000 students)";
    if (s === "large") return "Large (10,000–20,000 students)";
    if (s === "very_large") return "Very Large (20,000+ students)";
    return s;
  }

  function envLabelFull(e: string) {
    if (e === "college_town") return "College town";
    if (e === "urban") return "Urban campus";
    if (e === "suburban") return "Suburban";
    if (e === "rural") return "Rural setting";
    return e;
  }

  function climateLabelFull(c: string) {
    if (c === "warm") return "Warm climate";
    if (c === "cold") return "Cold winters";
    if (c === "mild") return "Mild climate";
    return c;
  }

  // Compact labels for search cards
  function typeLabel(t: string) {
    if (t === "private") return "Private";
    if (t === "public") return "Public";
    if (t === "liberal_arts") return "Liberal Arts";
    return t;
  }

  function sizeLabel(s: string) {
    if (s === "small") return "Small";
    if (s === "medium") return "Medium";
    if (s === "large") return "Large";
    if (s === "very_large") return "Very Large";
    return s;
  }

  const isSaved = (name: string) => savedColleges.some(c => c.university_name === name);

  const pillStyle = (color?: string): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center",
    padding: "3px 10px", borderRadius: 999, fontSize: 11,
    fontFamily: "system-ui, -apple-system, sans-serif",
    border: `0.5px solid ${border}`,
    background: "transparent",
    color: color || muted,
    fontWeight: 400,
  });

  if (phase === null) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", background: bg }}>
        <div style={{ color: gold, fontSize: 14 }}>Loading...</div>
      </div>
    );
  }

  const displayedSearch = searchQuery.trim()
    ? searchResults
    : [...UNIVERSITY_DATABASE].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 28px", borderBottom: `0.5px solid ${border}`,
        background: navBg, backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <a href="/dashboard" style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 500, textDecoration: "none", color: text, letterSpacing: "-0.02em" }}>
            Sheldon<span style={{ color: gold }}>AI</span>
          </a>
          <a href="/dashboard" style={{ fontSize: 12, color: muted, textDecoration: "none" }}>← Dashboard</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: muted }}>{userEmail}</span>
          <button onClick={async () => { await supabase.auth.signOut(); router.push("/"); }}
            style={{ fontSize: 12, color: muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Sign out
          </button>
          <button onClick={toggleTheme} style={{
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", border: `0.5px solid ${border}`, background: "none", cursor: "pointer", color: muted, fontSize: 15,
          }}>{isDark ? "☀" : "☽"}</button>
        </div>
      </nav>

      {/* Three-column layout */}
      <div style={{ display: "flex", height: "calc(100vh - 57px)", overflow: "hidden" }}>

        {/* LEFT SIDEBAR */}
        <div style={{
          width: 260, flexShrink: 0, borderRight: `0.5px solid ${border}`,
          background: surface, padding: "20px 16px", overflowY: "auto",
          display: "flex", flexDirection: "column",
        }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 500, color: gold, marginBottom: 4 }}>My Colleges</div>
          <div style={{ fontSize: 12, color: muted, marginBottom: 16 }}>{savedColleges.length} schools saved</div>

          {savedColleges.length === 0 ? (
            <div style={{ fontSize: 12, color: muted, fontStyle: "italic", textAlign: "center", padding: "20px 0", lineHeight: 1.6 }}>
              No colleges saved yet. Use Match Me or Search to find universities.
            </div>
          ) : (
            <div style={{ flex: 1 }}>
              {savedColleges.map((col) => {
                const uniData = col.university_data || UNIVERSITY_DATABASE.find(u => u.name === col.university_name) || null;
                return (
                  <div
                    key={col.university_name}
                    onClick={() => {
                      if (uniData) {
                        setSelectedUniversity(uniData);
                        loadUniversityResearch(col.university_name);
                      }
                    }}
                    style={{
                      position: "relative", border: `0.5px solid ${border}`, borderRadius: 8,
                      padding: "10px 12px", marginBottom: 6, cursor: "pointer",
                      background: selectedUniversity?.name === col.university_name
                        ? (isDark ? "rgba(201,169,110,0.06)" : "rgba(154,112,64,0.04)")
                        : "transparent",
                      display: "flex", alignItems: "center", gap: 10,
                    }}
                  >
                    <div style={{ flexShrink: 0 }}>
                      <UniversityEmblem name={col.university_name} color={uniData?.color || "#2C3E50"} size={36} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: 16 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: text, lineHeight: 1.3, marginBottom: 4 }}>
                        {col.university_name}
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          updateStatus(col.university_name, cycleStatus(col.status));
                        }}
                        style={{
                          padding: "2px 10px", borderRadius: 999, fontSize: 11,
                          border: `0.5px solid ${statusColor(col.status)}`,
                          color: statusColor(col.status),
                          background: "none", cursor: "pointer",
                          fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                      >
                        {col.status.charAt(0).toUpperCase() + col.status.slice(1)}
                      </button>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); removeFromList(col.university_name); }}
                      style={{
                        position: "absolute", top: 6, right: 8, background: "none", border: "none",
                        cursor: "pointer", fontSize: 12, color: isDark ? "#f87171" : "#b91c1c",
                        lineHeight: 1, padding: 0,
                      }}
                    >×</button>
                  </div>
                );
              })}
            </div>
          )}

          {savedColleges.length > 0 && (
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${border}` }}>
              <a href="/annotate" style={{ fontSize: 12, color: gold, textDecoration: "none" }}>View in Essays →</a>
            </div>
          )}
        </div>

        {/* CENTER COLUMN */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 24px" }}>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
            {(["match", "search"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: "8px 18px", borderRadius: 8, fontSize: 13, cursor: "pointer",
                  fontFamily: "system-ui, -apple-system, sans-serif",
                  border: `0.5px solid ${activeTab === tab ? gold : border}`,
                  background: activeTab === tab ? (isDark ? "rgba(201,169,110,0.1)" : "rgba(154,112,64,0.07)") : "transparent",
                  color: activeTab === tab ? gold : muted,
                  fontWeight: activeTab === tab ? 500 : 400,
                }}
              >
                {tab === "match" ? "Match Me 🎯" : "Search 🔍"}
              </button>
            ))}
          </div>

          {/* MATCH TAB */}
          {activeTab === "match" && (
            <>
              {matches.length === 0 && !isMatching && (
                <div style={{
                  border: `1px solid ${gold}44`, borderRadius: 12, padding: "36px 32px",
                  textAlign: "center", maxWidth: 480, margin: "40px auto",
                }}>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 500, color: text, marginBottom: 12 }}>
                    Get Personalized Matches
                  </div>
                  <div style={{ fontSize: 13, color: muted, lineHeight: 1.65, marginBottom: 24 }}>
                    We analyze your GPA, test scores, intended major, campus preferences, activities profile, and financial aid needs to rank the best universities for you specifically.
                  </div>
                  {matchError && (
                    <div style={{ fontSize: 12, color: isDark ? "#f87171" : "#b91c1c", marginBottom: 16, lineHeight: 1.5 }}>
                      {matchError}
                    </div>
                  )}
                  <button
                    onClick={getMatches}
                    style={{
                      padding: "12px 28px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                      background: gold, color: isDark ? "#080810" : "#FAFAF5",
                      border: "none", cursor: "pointer",
                      fontFamily: "system-ui, -apple-system, sans-serif",
                    }}
                  >
                    Find My Best Matches →
                  </button>
                </div>
              )}

              {/* FIX 2: Cycling loading messages */}
              {isMatching && (
                <div style={{ textAlign: "center", padding: "80px 0" }}>
                  <div style={{ marginBottom: 24, fontSize: 32 }}>🎓</div>
                  <div style={{
                    fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 15, color: gold,
                    animation: "pulse 2s ease-in-out infinite",
                    transition: "opacity 0.5s ease",
                  }}>
                    {LOADING_MESSAGES[loadingMsgIdx]}
                  </div>
                  <div style={{ marginTop: 16, fontSize: 12, color: muted }}>
                    This takes about 20–30 seconds
                  </div>
                </div>
              )}

              {matches.length > 0 && !isMatching && (
                <>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                    <span style={{ fontSize: 12, color: muted }}>{matches.length} universities ranked for you</span>
                    <button
                      onClick={getMatches}
                      style={{ fontSize: 12, color: gold, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}
                    >Re-analyze</button>
                  </div>
                  {matches.map((m) => {
                    const alreadySaved = isSaved(m.name);
                    return (
                      <div
                        key={m.name}
                        onClick={() => { setSelectedUniversity(m); loadUniversityResearch(m.name); }}
                        style={{
                          border: `0.5px solid ${selectedUniversity?.name === m.name ? gold : border}`,
                          borderRadius: 10, padding: "16px", marginBottom: 10, cursor: "pointer",
                          background: selectedUniversity?.name === m.name
                            ? (isDark ? "rgba(201,169,110,0.04)" : "rgba(154,112,64,0.03)")
                            : surface,
                        }}
                      >
                        {/* Match card header: emblem + rank + name + match score */}
                        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 10 }}>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>
                            <div style={{ position: "relative", flexShrink: 0 }}>
                              <UniversityEmblem name={m.name} color={m.color || "#2C3E50"} size={56} />
                              <span style={{
                                position: "absolute", top: -6, right: -8,
                                fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 500, color: gold, lineHeight: 1,
                              }}>
                                {m.rank}
                              </span>
                            </div>
                            <div>
                              <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 500, color: text, lineHeight: 1.2 }}>{m.name}</div>
                              <span style={{
                                fontSize: 11, padding: "2px 8px", borderRadius: 999,
                                border: `0.5px solid ${statusColor(m.status)}`,
                                color: statusColor(m.status), display: "inline-block", marginTop: 4,
                              }}>
                                {m.status.charAt(0).toUpperCase() + m.status.slice(1)}
                              </span>
                            </div>
                          </div>
                          <div style={{
                            fontSize: 13, fontWeight: 500, padding: "4px 10px", borderRadius: 6,
                            background: m.matchScore >= 85
                              ? (isDark ? "rgba(74,222,128,0.12)" : "rgba(22,101,52,0.08)")
                              : m.matchScore >= 70
                              ? (isDark ? "rgba(251,191,36,0.12)" : "rgba(146,64,14,0.08)")
                              : (isDark ? "rgba(248,113,113,0.12)" : "rgba(185,28,28,0.08)"),
                            color: m.matchScore >= 85
                              ? (isDark ? "#4ade80" : "#166534")
                              : m.matchScore >= 70
                              ? (isDark ? "#fbbf24" : "#92400e")
                              : (isDark ? "#f87171" : "#b91c1c"),
                          }}>
                            {m.matchScore}% match
                          </div>
                        </div>

                        <div style={{ marginBottom: 10 }}>
                          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: gold, marginBottom: 4 }}>WHY FOR YOUR MAJOR</div>
                          <div style={{ fontSize: 13, color: text, lineHeight: 1.65 }}>{m.whyMajor}</div>
                        </div>

                        <div style={{ marginBottom: 8 }}>
                          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: muted, marginBottom: 4 }}>YOUR PROFILE</div>
                          <div style={{ fontSize: 12, color: muted, lineHeight: 1.55 }}>{m.whyProfile}</div>
                        </div>

                        <div style={{ marginBottom: 12 }}>
                          <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: muted, marginBottom: 4 }}>CAMPUS FIT</div>
                          <div style={{ fontSize: 12, color: muted, lineHeight: 1.55 }}>{m.whyPreferences}</div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <div style={{ fontSize: 11, color: muted }}>
                            {m.acceptanceRate}% acceptance · {m.enrollment?.toLocaleString()} students · {m.location}
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); if (!alreadySaved) addToList(m, m.status); }}
                            style={{
                              fontSize: 12, padding: "5px 14px", borderRadius: 6, cursor: alreadySaved ? "default" : "pointer",
                              border: `0.5px solid ${alreadySaved ? (isDark ? "#4ade80" : "#166534") : gold}`,
                              color: alreadySaved ? (isDark ? "#4ade80" : "#166534") : gold,
                              background: "none", fontFamily: "system-ui, -apple-system, sans-serif",
                              opacity: alreadySaved ? 0.8 : 1,
                            }}
                          >
                            {alreadySaved || addedConfirm === m.name ? "Saved ✓" : "Add →"}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </>
              )}
            </>
          )}

          {/* SEARCH TAB */}
          {activeTab === "search" && (
            <>
              <input
                type="text"
                placeholder="Search any university by name, location, or type..."
                value={searchQuery}
                onChange={(e) => {
                  const q = e.target.value;
                  setSearchQuery(q);
                  if (searchTimeout.current) clearTimeout(searchTimeout.current);
                  searchTimeout.current = setTimeout(() => searchUniversities(q), 300);
                }}
                style={{
                  width: "100%", boxSizing: "border-box" as const,
                  border: `0.5px solid ${border}`, borderRadius: 8, padding: "10px 14px",
                  fontSize: 14, background: inputBg, color: text, outline: "none",
                  fontFamily: "system-ui, -apple-system, sans-serif", marginBottom: 16,
                }}
              />

              {displayedSearch.map((u) => {
                const alreadySaved = isSaved(u.name);
                return (
                  <div
                    key={u.name}
                    onClick={() => { setSelectedUniversity(u); loadUniversityResearch(u.name); }}
                    style={{
                      border: `0.5px solid ${selectedUniversity?.name === u.name ? gold : border}`,
                      borderRadius: 8, padding: "12px", marginBottom: 8, cursor: "pointer",
                      background: selectedUniversity?.name === u.name
                        ? (isDark ? "rgba(201,169,110,0.04)" : "rgba(154,112,64,0.03)")
                        : surface,
                      display: "flex", alignItems: "center", gap: 12,
                    }}
                  >
                    <div style={{ flexShrink: 0 }}>
                      <UniversityEmblem name={u.name} color={u.color || "#2C3E50"} size={40} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: text, marginBottom: 2 }}>{u.name}</div>
                      <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>{u.location}</div>
                      <div style={{ display: "flex", gap: 6, flexWrap: "wrap" as const }}>
                        <span style={pillStyle()}>{typeLabel(u.type)}</span>
                        <span style={pillStyle()}>{sizeLabel(u.size)}</span>
                        <span style={{ ...pillStyle(), color: isDark ? "#fbbf24" : "#92400e" }}>
                          {u.acceptanceRate}% accept
                        </span>
                        <span style={pillStyle()}>{u.enrollment.toLocaleString()} students</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); if (!alreadySaved) addToList(u); }}
                      style={{
                        fontSize: 12, padding: "6px 14px", borderRadius: 6,
                        cursor: alreadySaved ? "default" : "pointer",
                        border: `0.5px solid ${alreadySaved ? (isDark ? "#4ade80" : "#166534") : gold}`,
                        color: alreadySaved ? (isDark ? "#4ade80" : "#166534") : gold,
                        background: "none", flexShrink: 0,
                        fontFamily: "system-ui, -apple-system, sans-serif",
                      }}
                    >
                      {alreadySaved || addedConfirm === u.name ? "Saved ✓" : "Add →"}
                    </button>
                  </div>
                );
              })}
            </>
          )}
        </div>

        {/* RIGHT PANEL */}
        <div style={{
          width: 300, flexShrink: 0, borderLeft: `0.5px solid ${border}`,
          background: surface, overflowY: "auto", padding: "20px 16px",
        }}>
          {!selectedUniversity ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: "0 16px" }}>
              <div style={{ fontSize: 13, color: muted, fontStyle: "italic", textAlign: "center", lineHeight: 1.6 }}>
                Select a university to see details and research
              </div>
            </div>
          ) : (
            <div>
              {/* University header with emblem */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 16, textAlign: "center" }}>
                <UniversityEmblem name={selectedUniversity.name} color={selectedUniversity.color || "#2C3E50"} size={72} />
                <div style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 500, color: text, marginTop: 12, lineHeight: 1.2 }}>
                  {selectedUniversity.name}
                </div>
                {selectedUniversity.acceptanceRate != null && (
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 500, color: gold, marginTop: 4 }}>
                    {selectedUniversity.acceptanceRate}%
                    <span style={{ fontSize: 13, fontWeight: 400, color: muted, marginLeft: 6 }}>acceptance</span>
                  </div>
                )}
              </div>

              {/* Two-column labeled facts grid */}
              <div style={{ marginBottom: 16 }}>
                {[
                  { label: "Location", value: selectedUniversity.location },
                  { label: "Type", value: typeLabelFull(selectedUniversity.type || "") },
                  { label: "Enrollment", value: selectedUniversity.enrollment ? `${selectedUniversity.enrollment.toLocaleString()} undergrads` : "—" },
                  { label: "Acceptance Rate", value: selectedUniversity.acceptanceRate != null ? `${selectedUniversity.acceptanceRate}%` : "—" },
                  { label: "Annual Tuition", value: selectedUniversity.tuition ? `$${selectedUniversity.tuition.toLocaleString()}` : "—" },
                  { label: "Campus Setting", value: envLabelFull(selectedUniversity.environment || "") },
                  { label: "Campus Size", value: sizeLabelFull(selectedUniversity.size || "") },
                  { label: "Climate", value: climateLabelFull(selectedUniversity.climate || "") },
                  { label: "Athletics", value: selectedUniversity.divisionI ? "Division I" : "No Division I" },
                  { label: "Greek Life", value: selectedUniversity.greekLife ? "Active" : "Not present" },
                  { label: "SAT Range", value: selectedUniversity.satRange ? `${selectedUniversity.satRange[0]}–${selectedUniversity.satRange[1]}` : "—" },
                  { label: "ACT Range", value: selectedUniversity.actRange ? `${selectedUniversity.actRange[0]}–${selectedUniversity.actRange[1]}` : "—" },
                ].map(row => (
                  <div key={row.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", paddingTop: 6, paddingBottom: 6, borderBottom: `0.5px solid ${border}` }}>
                    <div style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase" as const, letterSpacing: "0.06em", color: muted, flexShrink: 0, paddingRight: 8 }}>
                      {row.label}
                    </div>
                    <div style={{ fontSize: 13, color: text, textAlign: "right" as const }}>
                      {row.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Interview policy */}
              {selectedUniversity.interviewPolicy && (
                <div style={{ border: `0.5px solid ${border}`, borderRadius: 8, padding: "10px 12px", marginBottom: 14 }}>
                  <div style={{ fontSize: 9, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: gold, marginBottom: 6 }}>INTERVIEW POLICY</div>
                  <div style={{ fontSize: 12, color: text, lineHeight: 1.55 }}>{selectedUniversity.interviewPolicy}</div>
                </div>
              )}

              {/* Essay info */}
              <div style={{ fontSize: 12, color: muted, marginBottom: 6 }}>
                Supplemental Essays: <span style={{ color: text }}>{selectedUniversity.supplementalEssays}</span>
              </div>
              <div style={{ fontSize: 12, color: muted, marginBottom: 14 }}>
                Why Us Essay: <span style={{ color: text }}>{selectedUniversity.hasWhyUs ? "Yes" : "No"}</span>
              </div>

              {/* Add/Remove */}
              {isSaved(selectedUniversity.name) ? (
                <button
                  onClick={() => removeFromList(selectedUniversity.name)}
                  style={{
                    width: "100%", padding: "9px 0", borderRadius: 8, marginBottom: 10,
                    border: `0.5px solid ${isDark ? "#f87171" : "#b91c1c"}`,
                    color: isDark ? "#f87171" : "#b91c1c",
                    background: "none", cursor: "pointer", fontSize: 13,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >Remove from List</button>
              ) : (
                <button
                  onClick={() => addToList(selectedUniversity as UniversityEntry)}
                  style={{
                    width: "100%", padding: "9px 0", borderRadius: 8, marginBottom: 10,
                    border: `0.5px solid ${gold}`, color: gold,
                    background: "none", cursor: "pointer", fontSize: 13,
                    fontFamily: "system-ui, -apple-system, sans-serif",
                  }}
                >Add to My List →</button>
              )}

              {/* Status selector if saved */}
              {isSaved(selectedUniversity.name) && (
                <div style={{ display: "flex", gap: 6, marginBottom: 16 }}>
                  {(["reach", "match", "safety"] as const).map(s => {
                    const saved = savedColleges.find(c => c.university_name === selectedUniversity.name);
                    const active = saved?.status === s;
                    return (
                      <button
                        key={s}
                        onClick={() => updateStatus(selectedUniversity.name, s)}
                        style={{
                          flex: 1, padding: "5px 0", borderRadius: 6, fontSize: 11, cursor: "pointer",
                          border: `0.5px solid ${active ? statusColor(s) : border}`,
                          color: active ? statusColor(s) : muted,
                          background: "none", fontFamily: "system-ui, -apple-system, sans-serif",
                        }}
                      >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                      </button>
                    );
                  })}
                </div>
              )}

              <div style={{ borderTop: `0.5px solid ${border}`, marginBottom: 14, paddingTop: 14 }}>
                <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: muted, marginBottom: 12 }}>
                  Research Arsenal
                </div>

                {isLoadingResearch && (
                  <div style={{ fontSize: 12, color: gold, fontStyle: "italic", padding: "12px 0" }}>
                    Researching {selectedUniversity?.name}...
                  </div>
                )}

                {!isLoadingResearch && universityResearch && (
                  <div>
                    {universityResearch.essayWarning && (
                      <div style={{ background: isDark ? "rgba(250,206,117,0.08)" : "rgba(250,206,117,0.15)", border: "0.5px solid rgba(250,206,117,0.4)", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: muted, lineHeight: 1.55, marginBottom: 12 }}>
                        ⚠ {universityResearch.essayWarning}
                      </div>
                    )}

                    {universityResearch.targetStudent && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: gold, marginBottom: 4 }}>Who They Want</div>
                        <div style={{ fontSize: 12, color: muted, lineHeight: 1.6 }}>{universityResearch.targetStudent}</div>
                      </div>
                    )}

                    {universityResearch.uniqueFeatures && (
                      <div style={{ marginBottom: 10 }}>
                        <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: gold, marginBottom: 4 }}>What Makes Them Different</div>
                        <div style={{ fontSize: 12, color: muted, lineHeight: 1.6 }}>{universityResearch.uniqueFeatures}</div>
                      </div>
                    )}

                    {universityResearch.philosophy && (
                      <div style={{ marginBottom: 12 }}>
                        <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase" as const, color: gold, marginBottom: 4 }}>Philosophy</div>
                        <div style={{ fontSize: 12, color: muted, lineHeight: 1.6 }}>{universityResearch.philosophy}</div>
                      </div>
                    )}

                    {(universityResearch.categories || []).map((cat, ci) => {
                      const isOpen = openResearchCats.has(ci.toString());
                      return (
                        <div key={ci} style={{ borderTop: `0.5px solid ${border}` }}>
                          <button
                            onClick={() => {
                              setOpenResearchCats(prev => {
                                const next = new Set(prev);
                                next.has(ci.toString()) ? next.delete(ci.toString()) : next.add(ci.toString());
                                return next;
                              });
                            }}
                            style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 0", background: "none", border: "none", cursor: "pointer", color: text }}
                          >
                            <span style={{ fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
                              <span>{cat.emoji}</span> {cat.label}
                            </span>
                            <span style={{ fontSize: 12, color: muted, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                          </button>
                          {isOpen && (
                            <div style={{ paddingBottom: 8 }}>
                              {(cat.items || []).map((item, ii) => (
                                <div key={ii} style={{ padding: "6px 0", borderTop: `0.5px solid ${border}` }}>
                                  <div style={{ fontSize: 11, fontWeight: 500, marginBottom: 2 }}>{item.name}</div>
                                  <div style={{ fontSize: 11, color: muted, lineHeight: 1.55 }}>{item.detail}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}

                    {/* Chat */}
                    <div style={{ borderTop: `0.5px solid ${border}`, paddingTop: 14, marginTop: 4 }}>
                      <div style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const, letterSpacing: "0.08em", color: muted, marginBottom: 10 }}>
                        Ask the Research Assistant
                      </div>
                      {chatMessages.length > 0 && (
                        <div style={{ maxHeight: 200, overflowY: "auto", marginBottom: 10 }}>
                          {chatMessages.map((msg, i) => (
                            <div key={i} style={{
                              marginBottom: 8, padding: "8px 10px", borderRadius: 6,
                              background: msg.role === "user"
                                ? (isDark ? "rgba(201,169,110,0.08)" : "rgba(154,112,64,0.06)")
                                : (isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"),
                              fontSize: 12, color: msg.role === "user" ? gold : text, lineHeight: 1.55,
                            }}>
                              {msg.content}
                            </div>
                          ))}
                          <div ref={chatEndRef} />
                        </div>
                      )}
                      <div style={{ display: "flex", gap: 6 }}>
                        <input
                          type="text"
                          placeholder="Ask about essays, programs..."
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyDown={e => e.key === "Enter" && !isChatting && sendChat()}
                          style={{
                            flex: 1, padding: "8px 10px", borderRadius: 6, fontSize: 12,
                            border: `0.5px solid ${border}`, background: inputBg, color: text,
                            outline: "none", fontFamily: "system-ui, -apple-system, sans-serif",
                          }}
                        />
                        <button
                          onClick={sendChat}
                          disabled={isChatting || !chatInput.trim()}
                          style={{
                            padding: "8px 12px", borderRadius: 6, border: `0.5px solid ${gold}`,
                            color: gold, background: "none", cursor: "pointer", fontSize: 12,
                            opacity: isChatting || !chatInput.trim() ? 0.5 : 1,
                          }}
                        >→</button>
                      </div>
                    </div>
                  </div>
                )}

                {!isLoadingResearch && !universityResearch && selectedUniversity && (
                  <div style={{ fontSize: 12, color: muted, fontStyle: "italic" }}>
                    Click a university to load research
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
