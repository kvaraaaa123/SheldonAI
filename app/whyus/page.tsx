"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/context/ThemeContext";
import { UNIVERSITY_PROMPTS, University, Prompt } from "@/lib/universityPrompts";
import { UNIVERSITY_RESEARCH, UniversityResearch } from "@/lib/universityResearch";
import { annotateEssay, AnnotationResult, Annotation } from "@/lib/annotate";
import { AnnotatedSentence } from "@/components/AnnotatedSentence";
import { EssayChat } from "@/components/EssayChat";

type ChatMessage = { role: "user" | "assistant"; content: string };

type EssayRecord = {
  id: string;
  essay: string;
  result: AnnotationResult;
  essay_type: string;
  university_name: string;
  created_at: string;
};

export default function WhyUsPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();
  const [userEmail, setUserEmail] = useState("");
  const [selectedUni, setSelectedUni] = useState<University | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState<AnnotationResult | null>(null);
  const [isAnnotating, setIsAnnotating] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isChatting, setIsChatting] = useState(false);
  const [openCats, setOpenCats] = useState<Set<string>>(new Set());
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [essayHistory, setEssayHistory] = useState<EssayRecord[]>([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [savedCollegeNames, setSavedCollegeNames] = useState<Set<string> | null>(null);
  const [whyUsResearch, setWhyUsResearch] = useState<UniversityResearch | null>(null);
  const [isResearchLoading, setIsResearchLoading] = useState(false);

  const gold = isDark ? "#C9A96E" : "#9a7040";
  const bg = isDark ? "#080810" : "#FAFAF5";
  const surface = isDark ? "#0f0f1a" : "#ffffff";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const text = isDark ? "#FAFAF5" : "#0a0a12";
  const muted = isDark ? "rgba(250,250,245,0.5)" : "rgba(10,10,18,0.5)";

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/"); return; }
      setUserEmail(data.session.user.email ?? "");
      const [{ data: rows }, { data: colleges }] = await Promise.all([
        supabase.from("essays").select("*").eq("user_id", data.session.user.id)
          .eq("essay_type", "why_us").order("created_at", { ascending: false }).limit(10),
        supabase.from("college_lists").select("university_name").eq("user_id", data.session.user.id),
      ]);
      if (rows) setEssayHistory(rows as EssayRecord[]);
      setSavedCollegeNames(new Set((colleges || []).map((c: { university_name: string }) => c.university_name)));
    });
  }, [router]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  const whyUsUniversities = UNIVERSITY_PROMPTS.filter(u =>
    u.prompts.some(p => p.isWhyUs) &&
    (savedCollegeNames === null || savedCollegeNames.has(u.name))
  );

  const whyUsPrompts = selectedUni?.prompts.filter(p => p.isWhyUs) ?? [];

  async function loadWhyUsResearch(universityName: string) {
    // Step 1: Check lib/universityResearch.ts FIRST — instant, no API call
    const localMatch = UNIVERSITY_RESEARCH.find(r =>
      r.name.toLowerCase() === universityName.toLowerCase() ||
      universityName.toLowerCase().includes(r.name.toLowerCase()) ||
      r.name.toLowerCase().includes(universityName.toLowerCase()) ||
      r.id === universityName.toLowerCase().replace(/\s+/g, "-")
    );

    if (localMatch) {
      setWhyUsResearch(localMatch);
      setIsResearchLoading(false);
      return;
    }

    // Step 2: Check Supabase cache
    setIsResearchLoading(true);
    try {
      const { data: cached } = await supabase
        .from("university_research_cache")
        .select("*")
        .eq("university_name", universityName)
        .maybeSingle();
      if (cached?.research_data) {
        setWhyUsResearch(cached.research_data as UniversityResearch);
        setIsResearchLoading(false);
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
          setWhyUsResearch(data.research as UniversityResearch);
          supabase.from("university_research_cache").insert({
            university_name: universityName,
            research_data: data.research,
          }).then(() => {});
        }
      }
    } catch (e) {
      console.error("loadWhyUsResearch error:", e);
    }
    setIsResearchLoading(false);
  }

  function toggleCat(key: string) {
    setOpenCats(prev => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }

  async function handleAnnotate() {
    if (!essay.trim() || !selectedUni) return;
    setIsAnnotating(true);
    setResult(null);
    try {
      const res = await fetch("/api/annotate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          essay,
          essayType: "why_us",
          universityName: selectedUni.name,
        }),
      });
      const data = await res.json();
      setResult(data);
      const session = await supabase.auth.getSession();
      if (session.data.session) {
        await supabase.from("essays").insert({
          user_id: session.data.session.user.id,
          essay,
          result: data,
          essay_type: "why_us",
          university_name: selectedUni?.name ?? "",
        });
      }
    } catch (e) { console.error(e); }
    setIsAnnotating(false);
  }

  async function handleChat() {
    if (!chatInput.trim() || !selectedUni) return;
    const q = chatInput.trim();
    setChatInput("");
    const newMessages: ChatMessage[] = [...chatMessages, { role: "user", content: q }];
    setChatMessages(newMessages);
    setIsChatting(true);
    try {
      const res = await fetch("/api/whyus-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          university: selectedUni.name,
          question: q,
          messages: chatMessages.slice(-6),
        }),
      });
      const data = await res.json();
      setChatMessages([...newMessages, { role: "assistant", content: data.answer }]);
    } catch {
      setChatMessages([...newMessages, { role: "assistant", content: "Something went wrong. Please try again." }]);
    }
    setIsChatting(false);
  }

  function handleDiscuss(prompt: string) {
    setChatMessages(prev => [...prev, { role: "user", content: prompt }]);
    handleChat();
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  function renderAnnotatedEssay() {
    if (!result) return null;
    const norm = (s: string) => s.replace(/\s+/g, " ").trim();
    return essay.split(/\n\n+/).map((para, pIdx) => {
      const normPara = norm(para);
      const paraAnnotations = result.annotations
        .map((a: Annotation) => {
          const sentNorm = norm(a.sentence);
          const exactIdx = normPara.indexOf(sentNorm);
          if (exactIdx !== -1) return { annotation: a, idx: exactIdx, len: sentNorm.length };
          const prefix = sentNorm.slice(0, 40);
          if (prefix.length < 10) return null;
          const prefixIdx = normPara.indexOf(prefix);
          if (prefixIdx === -1) return null;
          const suffix = sentNorm.slice(-20);
          const suffixIdx = normPara.indexOf(suffix, prefixIdx + prefix.length - 1);
          if (suffixIdx !== -1) return { annotation: a, idx: prefixIdx, len: suffixIdx + suffix.length - prefixIdx };
          return { annotation: a, idx: prefixIdx, len: sentNorm.length };
        })
        .filter((x): x is { annotation: Annotation; idx: number; len: number } => x !== null)
        .sort((a, b) => a.idx - b.idx);
      if (paraAnnotations.length === 0) {
        return <p key={pIdx} style={{ marginTop: pIdx > 0 ? 28 : 0 }}>{para}</p>;
      }
      const parts: React.ReactNode[] = [];
      let cursor = 0, key = 0;
      for (const { annotation, idx, len } of paraAnnotations) {
        if (idx < cursor) continue;
        if (idx > cursor) parts.push(<span key={key++}>{normPara.slice(cursor, idx)}</span>);
        parts.push(<AnnotatedSentence key={key++} annotation={annotation} onDiscuss={handleDiscuss} />);
        cursor = idx + len;
      }
      if (cursor < normPara.length) parts.push(<span key={key++}>{normPara.slice(cursor)}</span>);
      return <p key={pIdx} style={{ marginTop: pIdx > 0 ? 28 : 0 }}>{parts}</p>;
    });
  }

  const wordCount = essay.trim() ? essay.trim().split(/\s+/).length : 0;

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>
      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "10px 20px", borderBottom: `0.5px solid ${border}`,
        background: surface, position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="/dashboard" style={{ fontSize: 13, color: muted, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>← Dashboard</a>
          <a href="/annotate" style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 500, textDecoration: "none", color: text }}>
            Sheldon<span style={{ color: gold }}>AI</span>
          </a>
          <div style={{ display: "flex", gap: 4 }}>
            {[
              { label: "Personal Statement", href: "/annotate?tab=personal" },
              { label: "Supplemental Essays", href: "/annotate?tab=supplemental" },
              { label: "Why Us?", href: "/whyus" },
            ].map(({ label, href }) => {
              const active = label === "Why Us?";
              return (
                <a
                  key={label}
                  href={href}
                  style={{
                    padding: "5px 12px", fontSize: 12, borderRadius: 8,
                    border: `0.5px solid ${active ? border : "transparent"}`,
                    color: active ? text : muted,
                    fontWeight: active ? 500 : 400,
                    textDecoration: "none",
                    background: active ? (isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)") : "transparent",
                  }}
                >{label}</a>
              );
            })}
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={toggleTheme} style={{ background: "none", border: "none", cursor: "pointer", color: muted, fontSize: 16 }}>
            {isDark ? "☀" : "☽"}
          </button>
          <span style={{ fontSize: 12, color: muted }}>{userEmail}</span>
          <button onClick={handleSignOut} style={{ fontSize: 12, color: muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Sign out
          </button>
          <button onClick={() => router.push("/settings")} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
        </div>
      </nav>

      {/* Body: three columns */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr 272px", minHeight: "calc(100vh - 50px)" }}>

        {/* LEFT — Theory Guide */}
        <div style={{ borderRight: `0.5px solid ${border}`, padding: "18px 14px", overflowY: "auto", maxHeight: "calc(100vh - 50px)", position: "sticky", top: 50 }}>
          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.09em", textTransform: "uppercase", color: muted, marginBottom: 14 }}>Why Us? Theory</div>

          <div style={{ borderLeft: `2px solid ${gold}`, paddingLeft: 10, marginBottom: 16, fontFamily: "Georgia, serif", fontStyle: "italic", fontSize: 12, lineHeight: 1.65, color: text }}>
            "Us" ≠ the school. "Us" = the school + you. Every sentence must prove a two-way match.
          </div>

          {[
            {
              label: "The Two-Column Method", color: gold,
              content: `Before writing, create two columns: "What I want" and "What they have." Generate 10–15 specific reasons. Every reason must connect both columns. Generic praise of the school with no connection to you fails immediately.`,
            },
            {
              label: "The Three Tests", color: gold,
              content: null,
              tests: ["Am I showing genuine research?", "Am I demonstrating intelligence through connections?", "Have I connected this detail back to who I am specifically?"],
            },
            {
              label: "The Structure", color: gold,
              content: "Academics inside classroom → extracurriculars on campus → opportunities off campus. Each paragraph: clear topic sentence, specific school detail, personal connection.",
            },
            {
              label: "7 Fatal Mistakes", color: "#D4380D",
              mistakes: [
                "Size, location, reputation, or weather",
                "Emotional language with no specifics",
                "Copy-paste with only the school name swapped",
                "Only praising the school, never connecting to yourself",
                "Name-dropping professors without knowing their research",
                'Using "myriad," "world-class," "prestigious"',
                "Never mentioning what you will contribute back",
              ],
            },
            {
              label: "The Bowdoin Principle", color: gold,
              content: "The most powerful Why Us essays find one deep alignment between your defining quality and the school's defining value — and prove it with craft and vulnerability.",
            },
            {
              label: "The Three-Word Trick", color: gold,
              content: "Find a professor's actual syllabus. Read their course description. Rephrase what they say they will teach you — and explain why that specific learning connects to what you are trying to become.",
            },
          ].map((section, i) => (
            <div key={i} style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `0.5px solid ${border}` }}>
              <div style={{ fontSize: 11, fontWeight: 500, color: section.color, marginBottom: 5 }}>{section.label}</div>
              {section.content && <div style={{ fontSize: 11, lineHeight: 1.65, color: muted }}>{section.content}</div>}
              {section.tests && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {section.tests.map((t, j) => (
                    <div key={j} style={{ fontSize: 11, color: muted }}>
                      <strong style={{ color: text }}>{j + 1}.</strong> {t}
                    </div>
                  ))}
                </div>
              )}
              {section.mistakes && (
                <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  {section.mistakes.map((m, j) => (
                    <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: 6, fontSize: 11, color: muted }}>
                      <div style={{ width: 5, height: 5, borderRadius: "50%", background: "#D4380D", marginTop: 4, flexShrink: 0 }} />
                      <span>{m}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CENTER — University selector + essay */}
        <div style={{ padding: "24px 24px", overflowY: "auto", maxHeight: "calc(100vh - 50px)" }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 500, letterSpacing: "-0.5px", marginBottom: 4 }}>
            Why Us?
          </h1>
          <p style={{ fontSize: 13, color: muted, marginBottom: 24 }}>
            The most research-dependent essay in college admissions
          </p>

          {/* University grid — only saved colleges */}
          {savedCollegeNames !== null && savedCollegeNames.size === 0 && (
            <div style={{ border: `0.5px solid ${border}`, borderRadius: 14, padding: "32px 24px", textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🎓</div>
              <div style={{ fontSize: 16, fontWeight: 600, color: text, marginBottom: 8 }}>No colleges in your list yet</div>
              <div style={{ fontSize: 13, color: muted, lineHeight: 1.6, marginBottom: 20, maxWidth: 320, margin: "0 auto 20px" }}>
                Go to My Colleges to add universities — their supplemental essays will appear here automatically.
              </div>
              <a href="/colleges" style={{
                display: "inline-block", padding: "10px 24px", borderRadius: 10,
                background: gold, color: isDark ? "#080810" : "#FAFAF5",
                textDecoration: "none", fontSize: 14, fontWeight: 600,
              }}>Go to My Colleges →</a>
            </div>
          )}

          {savedCollegeNames !== null && savedCollegeNames.size > 0 && whyUsUniversities.length === 0 && (
            <div style={{ border: `0.5px solid ${border}`, borderRadius: 14, padding: "28px 24px", textAlign: "center", marginBottom: 24 }}>
              <div style={{ fontSize: 14, color: muted, lineHeight: 1.6 }}>
                None of your saved colleges require a Why Us essay, or their prompts are still loading.
              </div>
              <a href="/colleges" style={{ display: "inline-block", marginTop: 12, fontSize: 13, color: gold, textDecoration: "none" }}>
                View My Colleges →
              </a>
            </div>
          )}

          {whyUsUniversities.length > 0 && (
            <>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.09em", textTransform: "uppercase", color: muted, marginBottom: 10 }}>
                My saved colleges with Why Us essays
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 24 }}>
                {whyUsUniversities.map(uni => (
                  <button
                    key={uni.id}
                    onClick={() => {
                      setSelectedUni(uni);
                      setSelectedPrompt(null);
                      setResult(null);
                      setChatMessages([]);
                      setOpenCats(new Set(["0"]));
                      loadWhyUsResearch(uni.name);
                    }}
                    style={{
                      border: selectedUni?.id === uni.id
                        ? `1.5px solid ${uni.color}`
                        : `0.5px solid ${border}`,
                      borderRadius: 10,
                      padding: "10px 12px",
                      textAlign: "left",
                      cursor: "pointer",
                      background: selectedUni?.id === uni.id
                        ? isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)"
                        : surface,
                      transition: "all 0.15s",
                    }}
                  >
                    <div style={{ fontSize: 13, fontWeight: 500, color: uni.color, marginBottom: 2 }}>{uni.name}</div>
                    <div style={{ fontSize: 11, color: muted }}>{uni.applicationCycle}</div>
                    <div style={{
                      display: "inline-block", marginTop: 5, fontSize: 9, fontWeight: 500,
                      letterSpacing: "0.06em", padding: "2px 5px", borderRadius: 3,
                      background: "rgba(139,94,60,0.12)", color: "#8B5E3C",
                      border: "0.5px solid rgba(139,94,60,0.3)",
                    }}>WHY US</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Previous Why Us Essays */}
          {essayHistory.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <button
                onClick={() => setHistoryOpen(o => !o)}
                style={{
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  width: "100%", background: "none", border: "none", cursor: "pointer",
                  padding: "6px 0", marginBottom: historyOpen ? 8 : 0,
                }}
              >
                <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.09em", textTransform: "uppercase", color: muted }}>
                  Previous Why Us Essays
                </span>
                <span style={{ fontSize: 12, color: muted, transform: historyOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
              </button>
              {historyOpen && (
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  {essayHistory.map(item => (
                    <button
                      key={item.id}
                      onClick={() => { setEssay(item.essay); setResult(item.result as AnnotationResult); }}
                      style={{
                        display: "flex", flexDirection: "column", alignItems: "flex-start",
                        width: "100%", textAlign: "left", background: "none",
                        border: `0.5px solid ${border}`, borderRadius: 8,
                        padding: "8px 10px", cursor: "pointer",
                        transition: "opacity 0.15s",
                      }}
                      onMouseEnter={e => (e.currentTarget.style.opacity = "0.75")}
                      onMouseLeave={e => (e.currentTarget.style.opacity = "1")}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%", marginBottom: 2 }}>
                        <span style={{ fontSize: 12, fontWeight: 500, color: "#8B5E3C" }}>
                          {item.university_name || "Unknown University"}
                        </span>
                        <span style={{ fontSize: 10, color: muted }}>
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      <span style={{ fontSize: 11, color: muted, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", width: "100%" }}>
                        {item.essay.slice(0, 60)}…
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Prompts */}
          {selectedUni && whyUsPrompts.length > 0 && (
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.09em", textTransform: "uppercase", color: muted, marginBottom: 8 }}>
                Why Us Prompts — {selectedUni.name}
              </div>
              {whyUsPrompts.map(prompt => (
                <div
                  key={prompt.id}
                  onClick={() => setSelectedPrompt(prompt)}
                  style={{
                    border: selectedPrompt?.id === prompt.id
                      ? "1.5px solid rgba(139,94,60,0.6)"
                      : "0.5px solid rgba(139,94,60,0.35)",
                    borderRadius: 8,
                    padding: "10px 12px",
                    cursor: "pointer",
                    background: selectedPrompt?.id === prompt.id
                      ? "rgba(139,94,60,0.1)"
                      : "rgba(139,94,60,0.04)",
                    marginBottom: 6,
                    transition: "all 0.15s",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 5 }}>
                    <div style={{
                      fontSize: 9, fontWeight: 500, letterSpacing: "0.06em",
                      padding: "2px 5px", borderRadius: 3,
                      background: "rgba(139,94,60,0.12)", color: "#8B5E3C",
                      border: "0.5px solid rgba(139,94,60,0.3)",
                    }}>WHY US</div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "#7A5230" }}>{prompt.title}</span>
                    <span style={{ marginLeft: "auto", fontSize: 10, color: muted, background: border, padding: "1px 6px", borderRadius: 4 }}>
                      {prompt.wordLimit}w
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: muted, lineHeight: 1.55 }}>{prompt.text}</div>
                  {prompt.intent && (
                    <div style={{ marginTop: 8, fontSize: 11, color: isDark ? "rgba(250,250,245,0.4)" : "rgba(10,10,18,0.4)", fontStyle: "italic", lineHeight: 1.5 }}>
                      Why they ask this: {prompt.intent}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Essay area */}
          {selectedUni && (
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.09em", textTransform: "uppercase", color: muted, marginBottom: 8 }}>
                {selectedPrompt ? `Your essay — ${selectedPrompt.title}` : "Paste your essay"}
              </div>

              {!result ? (
                <>
                  <textarea
                    value={essay}
                    onChange={e => setEssay(e.target.value)}
                    placeholder="Paste your Why Us essay here..."
                    style={{
                      width: "100%", minHeight: 200, border: `0.5px solid ${border}`,
                      borderRadius: 8, padding: "12px", fontSize: 13,
                      fontFamily: "Georgia, serif", lineHeight: 1.8, resize: "vertical",
                      background: surface, color: text,
                    }}
                  />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 6 }}>
                    <span style={{ fontSize: 11, color: muted }}>{wordCount} words</span>
                    <button
                      onClick={handleAnnotate}
                      disabled={!essay.trim() || isAnnotating}
                      style={{
                        padding: "9px 20px", fontSize: 13, fontWeight: 500,
                        border: `0.5px solid ${gold}`, borderRadius: 8,
                        background: "transparent", color: gold, cursor: "pointer",
                        opacity: !essay.trim() || isAnnotating ? 0.5 : 1,
                      }}
                    >
                      {isAnnotating ? "Analyzing..." : "Analyze This Essay →"}
                    </button>
                  </div>
                </>
              ) : (
                <div>
                  {/* Scores */}
                  <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                    {[
                      { label: "Memorability", value: result.memorabilityScore + "/10" },
                      { label: "Hook", value: result.hookVerdict.includes("works") ? "✓" : "⚠" },
                      { label: "Conclusion", value: result.conclusionVerdict.includes("lands") ? "✓" : "⚠" },
                    ].map(s => (
                      <div key={s.label} style={{ flex: 1, background: surface, border: `0.5px solid ${border}`, borderRadius: 8, padding: "10px 12px" }}>
                        <div style={{ fontSize: 10, color: muted, marginBottom: 3 }}>{s.label}</div>
                        <div style={{ fontSize: 18, fontWeight: 500 }}>{s.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Overall feedback */}
                  <div style={{ background: surface, border: `0.5px solid ${border}`, borderRadius: 8, padding: "12px 14px", marginBottom: 16, fontSize: 13, lineHeight: 1.7, color: text }}>
                    {result.overallFeedback}
                  </div>

                  {/* Annotated essay */}
                  <div style={{
                    background: isDark ? "#0d0d1a" : "#fafaf5",
                    border: `0.5px solid ${border}`, borderRadius: 10,
                    padding: "20px 24px", fontFamily: "Georgia, serif",
                    fontSize: 15, lineHeight: 1.9, color: text, marginBottom: 20,
                  }}>
                    {renderAnnotatedEssay()}
                  </div>

                  <button
                    onClick={() => { setResult(null); }}
                    style={{
                      padding: "8px 16px", fontSize: 12, border: `0.5px solid ${border}`,
                      borderRadius: 8, background: "transparent", color: muted, cursor: "pointer",
                    }}
                  >
                    ← Edit Essay
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT — Research Arsenal */}
        <div style={{
          borderLeft: `0.5px solid ${border}`,
          display: "flex", flexDirection: "column",
          maxHeight: "calc(100vh - 50px)", position: "sticky", top: 50,
          overflow: "hidden",
        }}>
          {!selectedUni ? (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", padding: 24, textAlign: "center" }}>
              <div>
                <div style={{ fontSize: 24, marginBottom: 10 }}>🔍</div>
                <div style={{ fontSize: 12, color: muted, lineHeight: 1.6 }}>
                  Select a university to see specific courses, professors, clubs, traditions, and research institutes you can use in your essay
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ padding: "12px 14px", borderBottom: `0.5px solid ${border}`, flexShrink: 0 }}>
                <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.09em", textTransform: "uppercase", color: muted, marginBottom: 2 }}>Research Arsenal</div>
                <div style={{ fontSize: 13, fontWeight: 500, color: selectedUni.color }}>{selectedUni.name}</div>
              </div>

              {/* Scrollable content */}
              <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column" }}>
                {/* Warning */}
                {whyUsResearch && (
                  <div style={{
                    margin: "10px 12px", background: isDark ? "rgba(250,206,117,0.08)" : "rgba(250,206,117,0.15)",
                    border: "0.5px solid rgba(250,206,117,0.4)", borderRadius: 8,
                    padding: "8px 10px", fontSize: 11, color: muted, lineHeight: 1.55,
                  }}>
                    ⚠ {whyUsResearch.essayWarning}
                  </div>
                )}

                {/* Research categories */}
                {whyUsResearch && (
                  <div style={{ padding: "0 12px" }}>
                    {whyUsResearch.categories.map((cat, ci) => {
                      const key = `${selectedUni.id}-${ci}`;
                      const isOpen = openCats.has(key);
                      return (
                        <div key={ci} style={{ borderBottom: `0.5px solid ${border}` }}>
                          <button
                            onClick={() => toggleCat(key)}
                            style={{
                              width: "100%", display: "flex", alignItems: "center",
                              justifyContent: "space-between", padding: "9px 0",
                              background: "none", border: "none", cursor: "pointer", color: text,
                            }}
                          >
                            <span style={{ fontSize: 12, fontWeight: 500, display: "flex", alignItems: "center", gap: 5 }}>
                              <span style={{ fontSize: 13 }}>{cat.emoji}</span> {cat.label}
                            </span>
                            <span style={{ fontSize: 13, color: muted, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▾</span>
                          </button>
                          {isOpen && (
                            <div style={{ paddingBottom: 8 }}>
                              {cat.items.map((item, ii) => (
                                <div key={ii} style={{ padding: "7px 0", borderTop: `0.5px solid ${border}` }}>
                                  <div style={{ fontSize: 12, fontWeight: 500, marginBottom: 3 }}>{item.name}</div>
                                  <div style={{ fontSize: 11, color: muted, lineHeight: 1.55 }}>{item.detail}</div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Chat */}
                <div style={{ borderTop: `0.5px solid ${border}`, padding: "10px 12px", marginTop: "auto" }}>
                  <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.08em", textTransform: "uppercase", color: muted, marginBottom: 8 }}>
                    Ask the Research Assistant
                  </div>
                  <div style={{ maxHeight: 160, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, marginBottom: 8 }}>
                    {chatMessages.length === 0 && (
                      <div style={{ fontSize: 11, color: muted, fontStyle: "italic", lineHeight: 1.5 }}>
                        Ask anything about {selectedUni.name} — clubs, professors, traditions, courses...
                      </div>
                    )}
                    {chatMessages.map((msg, i) => (
                      <div
                        key={i}
                        style={{
                          fontSize: 11, lineHeight: 1.55, padding: "7px 9px", borderRadius: 8,
                          alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                          maxWidth: "90%",
                          background: msg.role === "user"
                            ? isDark ? "rgba(184,134,11,0.15)" : "rgba(184,134,11,0.12)"
                            : isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)",
                          border: msg.role === "user"
                            ? "0.5px solid rgba(184,134,11,0.3)"
                            : `0.5px solid ${border}`,
                          color: text,
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {msg.content}
                      </div>
                    ))}
                    {isChatting && (
                      <div style={{ fontSize: 11, color: muted, fontStyle: "italic", alignSelf: "flex-start" }}>
                        Researching...
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div style={{ display: "flex", gap: 6 }}>
                    <input
                      value={chatInput}
                      onChange={e => setChatInput(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleChat()}
                      placeholder="Ask about any club, course, tradition..."
                      style={{
                        flex: 1, border: `0.5px solid ${border}`, borderRadius: 8,
                        padding: "6px 8px", fontSize: 11,
                        background: surface, color: text,
                      }}
                    />
                    <button
                      onClick={handleChat}
                      disabled={!chatInput.trim() || isChatting}
                      style={{
                        padding: "6px 10px", fontSize: 11,
                        border: `0.5px solid ${gold}`, borderRadius: 8,
                        background: "transparent", color: gold, cursor: "pointer",
                        opacity: !chatInput.trim() || isChatting ? 0.5 : 1,
                      }}
                    >
                      Ask ↗
                    </button>
                  </div>
                </div>

                {/* Coming soon */}
                <div style={{
                  margin: "8px 12px 12px", border: `0.5px dashed ${border}`, borderRadius: 8,
                  padding: "8px 10px", fontSize: 11, color: muted, textAlign: "center",
                }}>
                  🔮 Coming soon — Personalized Recommendations based on your Counselor Profile
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
