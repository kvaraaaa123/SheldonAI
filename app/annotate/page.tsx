"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { AnnotatedSentence } from "@/components/AnnotatedSentence";
import { EssayChat } from "@/components/EssayChat";
import { AnnotationResult, Annotation } from "@/lib/annotate";
import { UNIVERSITY_PROMPTS, University, Prompt } from "@/lib/universityPrompts";
import { UNIVERSITY_RESEARCH } from "@/lib/universityResearch";
import { supabase } from "@/lib/supabase";

const IVY_ORDER = ["harvard","yale","princeton","columbia","penn","brown","dartmouth","cornell"];
const OTHER_ORDER = ["stanford","mit","berkeley"];

const SAMPLE_ESSAY = `I have always been passionate about science and helping others. Growing up, I was deeply influenced by my family and community. My journey to becoming who I am today was shaped by many experiences that taught me important lessons about life.

One of the most important moments in my life was when I volunteered at a local hospital. I saw how doctors and nurses worked tirelessly to help patients, and I knew that I wanted to make a difference in the world just like them. It was an eye-opening experience that changed my perspective on everything.

I have always been a hard worker and a good student. I believe that with dedication and perseverance, anyone can achieve their dreams. My teachers have always told me that I have great potential, and I am determined to live up to that potential at your university.`;

const LEGEND_ITEMS = [
  { label: "⚠ Weak Hook",       cls: "bg-red-100 text-red-700 border-red-200" },
  { label: "Lacks Specificity",  cls: "bg-blue-100 text-blue-700 border-blue-200" },
  { label: "Show Don't Tell",    cls: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { label: "Weak Verb",          cls: "bg-violet-100 text-violet-700 border-violet-200" },
  { label: "Voice Too Flat",     cls: "bg-slate-100 text-slate-700 border-slate-200" },
  { label: "⚠ Phony Transform.", cls: "bg-red-200 text-red-800 border-red-400" },
  { label: "💡 Metaphor",        cls: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { label: "? Context Heavy",    cls: "bg-teal-100 text-teal-700 border-teal-200" },
  { label: "✓ Strong",           cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

type EssayRecord = {
  id: string;
  essay: string;
  result: AnnotationResult;
  essay_type: string;
  university_name: string;
  created_at: string;
};

type SuppResearchData = {
  essayWarning?: string;
  philosophy?: string;
  targetStudent?: string;
  uniqueFeatures?: string;
  categories?: { label: string; emoji: string; items: { name: string; detail: string }[] }[];
  supplementalPrompts?: { title: string; text: string; wordLimit: number; isWhyUs?: boolean }[];
};

export default function AnnotatePage() {
  const { isDark, toggleTheme } = useTheme();
  const router = useRouter();
  const [userEmail,          setUserEmail]          = useState("");
  const [userId,             setUserId]             = useState("");
  const [essayHistory,       setEssayHistory]       = useState<EssayRecord[]>([]);
  const [tab,                setTab]                = useState<"personal" | "supplemental">("personal");

  // Read ?tab= from URL on mount to support deep-linking from whyus page
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("tab") === "supplemental") setTab("supplemental");
  }, []);
  const [profileData,        setProfileData]        = useState<Record<string, unknown> | null>(null);
  const [activityGradesData, setActivityGradesData] = useState<Record<string, unknown> | null>(null);
  const [openAdvisorId,      setOpenAdvisorId]      = useState<string | null>(null);
  const [advisorContent,     setAdvisorContent]     = useState<Record<string, string>>({});
  const [advisorLoading,     setAdvisorLoading]     = useState<Record<string, boolean>>({});
  const [savedColleges,      setSavedColleges]      = useState<{ university_name: string }[]>([]);
  const [suppResearch,       setSuppResearch]       = useState<SuppResearchData | null>(null);
  const [isSuppResearchLoading, setIsSuppResearchLoading] = useState(false);
  const [openSuppCats,       setOpenSuppCats]       = useState<Set<string>>(new Set());
  const [uniSearch,          setUniSearch]          = useState("");

  // Theme-derived colors
  const bg          = isDark ? "#080810"                    : "#FAFAF5";
  const text        = isDark ? "#FAFAF5"                    : "#080810";
  const gold        = isDark ? "#C9A96E"                    : "#9a7040";
  const muted       = isDark ? "rgba(250,250,245,0.40)"     : "rgba(8,8,16,0.40)";
  const borderCol   = isDark ? "rgba(255,255,255,0.07)"     : "rgba(0,0,0,0.09)";
  const cardBg      = isDark ? "rgba(255,255,255,0.03)"     : "rgba(0,0,0,0.03)";
  const inputBg     = isDark ? "rgba(255,255,255,0.04)"     : "rgba(0,0,0,0.04)";
  const inputBorder = isDark ? "rgba(255,255,255,0.09)"     : "rgba(0,0,0,0.12)";
  const subtleBg    = isDark ? "rgba(255,255,255,0.015)"    : "rgba(0,0,0,0.02)";
  const navBg       = isDark ? "rgba(8,8,16,0.95)"          : "rgba(250,250,245,0.95)";

  // Auth check + history load
  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/"); return; }
      const { user } = data.session;
      setUserEmail(user.email ?? "");
      setUserId(user.id);
      const [{ data: rows }, { data: profileRow }, { data: gradesRow }, { data: collegeRows }] = await Promise.all([
        supabase.from("essays").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("profiles").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("activity_grades").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(1).maybeSingle(),
        supabase.from("college_lists").select("university_name").eq("user_id", user.id),
      ]);
      if (rows) setEssayHistory(rows as EssayRecord[]);
      if (profileRow) setProfileData(profileRow as Record<string, unknown>);
      if (gradesRow) setActivityGradesData(gradesRow as Record<string, unknown>);
      if (collegeRows) setSavedColleges(collegeRows as { university_name: string }[]);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  // ── Personal Statement state ──────────────────────────────────────────────
  const [psEssay,      setPsEssay]      = useState("");
  const [psResult,     setPsResult]     = useState<AnnotationResult | null>(null);
  const [psLoading,    setPsLoading]    = useState(false);
  const [psError,      setPsError]      = useState("");
  const [psChatPrompt, setPsChatPrompt] = useState<string | undefined>(undefined);
  const psChatRef  = useRef<HTMLDivElement>(null);
  const psEssayRef = useRef<HTMLTextAreaElement>(null);

  async function handlePsAnnotate() {
    if (!psEssay.trim()) return;
    setPsLoading(true); setPsError(""); setPsResult(null);
    try {
      const res = await fetch("/api/annotate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay: psEssay, essayType: "common_app", universityName: "" }),
      });
      const data = await res.json();
      if (!res.ok) { setPsError(data.error || "Something went wrong."); return; }
      setPsResult(data);
      const { data: inserted } = await supabase.from("essays").insert({
        user_id: userId,
        essay: psEssay,
        result: data,
        essay_type: "common_app",
        university_name: "",
      }).select().single();
      if (inserted) setEssayHistory(prev => [inserted as EssayRecord, ...prev]);
    } catch {
      setPsError("Network error. Make sure your dev server is running.");
    } finally {
      setPsLoading(false);
    }
  }

  function handleLoadHistory(loadedEssay: string, loadedResult: AnnotationResult) {
    setPsEssay(loadedEssay);
    setPsResult(loadedResult);
    setPsChatPrompt(undefined);
  }

  function handlePsDiscuss(prompt: string) {
    setPsChatPrompt(prompt);
    setTimeout(() => psChatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  // ── Supplemental state ───────────────────────────────────────────────────
  const [suppUniversity,  setSuppUniversity]  = useState<University | null>(null);
  const [suppPrompt,      setSuppPrompt]      = useState<Prompt | null>(null);
  const [suppEssay,       setSuppEssay]       = useState("");
  const [suppResult,      setSuppResult]      = useState<AnnotationResult | null>(null);
  const [suppLoading,     setSuppLoading]     = useState(false);
  const [suppError,       setSuppError]       = useState("");
  const [suppChatPrompt,  setSuppChatPrompt]  = useState<string | undefined>(undefined);
  const suppChatRef  = useRef<HTMLDivElement>(null);
  const suppEssayRef = useRef<HTMLDivElement>(null);

  const ivies  = UNIVERSITY_PROMPTS.filter(u => IVY_ORDER.includes(u.id))
    .sort((a, b) => IVY_ORDER.indexOf(a.id) - IVY_ORDER.indexOf(b.id));
  const others = UNIVERSITY_PROMPTS.filter(u => OTHER_ORDER.includes(u.id))
    .sort((a, b) => OTHER_ORDER.indexOf(a.id) - OTHER_ORDER.indexOf(b.id));
  const remaining = UNIVERSITY_PROMPTS
    .filter(u => !IVY_ORDER.includes(u.id) && !OTHER_ORDER.includes(u.id))
    .sort((a, b) => a.name.localeCompare(b.name));
  const suppWordCount = suppEssay.trim().split(/\s+/).filter(Boolean).length;

  const promptUniversityNames = new Set(UNIVERSITY_PROMPTS.map(u => u.name));

  // For the currently-selected custom university, use real prompts from research if available
  const customResearchPrompts: Prompt[] | null = (() => {
    const sp = suppResearch?.supplementalPrompts;
    if (!sp || sp.length === 0) return null;
    return sp.map((p, i) => ({
      id: `custom_prompt_${i}`,
      title: p.title,
      wordLimit: p.wordLimit || 650,
      text: p.text,
      intent: "Use the essay annotator to get sentence-level feedback on your supplemental essay.",
      isWhyUs: p.isWhyUs ?? false,
    }));
  })();

  const savedCustomUniversities: University[] = savedColleges
    .filter(c => !promptUniversityNames.has(c.university_name))
    .map(c => {
      const isSelected = suppUniversity?.name === c.university_name;
      const prompts = isSelected && customResearchPrompts
        ? customResearchPrompts
        : [{
            id: `${c.university_name.toLowerCase().replace(/\s+/g, "_")}_supp`,
            title: "Supplemental Essay",
            wordLimit: 650,
            text: "Paste your supplemental essay prompt here and annotate it below.",
            intent: "Use the essay annotator to get sentence-level feedback on your supplemental essay.",
            isWhyUs: false,
          }];
      return {
        id: c.university_name.toLowerCase().replace(/\s+/g, "_"),
        name: c.university_name,
        shortName: c.university_name.split(" ").slice(0, 2).join(" "),
        classYear: "Class of 2030",
        applicationCycle: "2025–2026",
        color: gold,
        philosophy: suppResearch?.targetStudent || `${c.university_name} supplemental essay workspace.`,
        prompts,
      };
    });

  async function loadSuppResearch(universityName: string) {
    // Step 1: Check lib/universityResearch.ts FIRST — instant, no API call
    const localMatch = UNIVERSITY_RESEARCH.find(r =>
      r.name.toLowerCase() === universityName.toLowerCase() ||
      universityName.toLowerCase().includes(r.name.toLowerCase()) ||
      r.name.toLowerCase().includes(universityName.toLowerCase()) ||
      r.id === universityName.toLowerCase().replace(/\s+/g, "-")
    );

    if (localMatch) {
      setSuppResearch(localMatch as SuppResearchData);
      setIsSuppResearchLoading(false);
      return;
    }

    // Step 2: Check Supabase cache
    setIsSuppResearchLoading(true);
    try {
      const { data: cached } = await supabase
        .from("university_research_cache")
        .select("*")
        .eq("university_name", universityName)
        .maybeSingle();
      if (cached?.research_data) {
        setSuppResearch(cached.research_data as SuppResearchData);
        setIsSuppResearchLoading(false);
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
          setSuppResearch(data.research as SuppResearchData);
          supabase.from("university_research_cache").insert({
            university_name: universityName,
            research_data: data.research,
          }).then(() => {});
        }
      }
    } catch (e) {
      console.error("loadSuppResearch error:", e);
    }
    setIsSuppResearchLoading(false);
  }

  function selectUniversity(u: University) {
    setSuppUniversity(u); setSuppPrompt(null); setSuppEssay(""); setSuppResult(null); setSuppError("");
    setOpenSuppCats(new Set());
    loadSuppResearch(u.name);
  }

  async function handleSuppAnnotate() {
    if (!suppEssay.trim()) return;
    setSuppLoading(true); setSuppError(""); setSuppResult(null);
    try {
      const res = await fetch("/api/annotate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          essay: suppEssay,
          essayType: suppPrompt?.isWhyUs ? "why_us" : "supplemental",
          universityName: suppUniversity?.name ?? "",
        }),
      });
      const data = await res.json();
      if (!res.ok) { setSuppError(data.error || "Something went wrong."); return; }
      setSuppResult(data);
      const { data: inserted } = await supabase.from("essays").insert({
        user_id: userId,
        essay: suppEssay,
        result: data,
        essay_type: "supplemental",
        university_name: suppUniversity?.name ?? "",
      }).select().single();
      if (inserted) setEssayHistory(prev => [inserted as EssayRecord, ...prev]);
    } catch {
      setSuppError("Network error. Make sure your dev server is running.");
    } finally {
      setSuppLoading(false);
    }
  }

  function handleSuppDiscuss(prompt: string) {
    setSuppChatPrompt(prompt);
    setTimeout(() => suppChatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  async function fetchPromptAdvice(promptId: string, promptText: string, promptTitle: string, universityName: string, regenerate = false) {
    setAdvisorLoading(prev => ({ ...prev, [promptId]: true }));
    if (regenerate) setAdvisorContent(prev => ({ ...prev, [promptId]: "" }));
    try {
      const res = await fetch("/api/prompt-advisor", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: promptText,
          promptTitle,
          universityName,
          profile: profileData,
          activityGrades: activityGradesData,
          regenerate,
        }),
      });
      if (!res.ok) {
        console.error("Prompt advisor HTTP error:", res.status, res.statusText);
        const errData = await res.json().catch(() => ({}));
        setAdvisorContent(prev => ({ ...prev, [promptId]: `Error ${res.status}: ${errData.error || res.statusText}` }));
        return;
      }
      const data = await res.json();
      setAdvisorContent(prev => ({ ...prev, [promptId]: data.advice || "No advice returned." }));
    } catch (err) {
      console.error("Prompt advisor fetch error:", err);
      setAdvisorContent(prev => ({ ...prev, [promptId]: `Network error: ${err instanceof Error ? err.message : String(err)}` }));
    } finally {
      setAdvisorLoading(prev => ({ ...prev, [promptId]: false }));
    }
  }

  async function handlePromptAdvise(promptId: string, promptText: string, promptTitle: string, universityName: string) {
    if (openAdvisorId === promptId) {
      setOpenAdvisorId(null);
      return;
    }
    setOpenAdvisorId(promptId);
    if (advisorContent[promptId]) return;
    fetchPromptAdvice(promptId, promptText, promptTitle, universityName);
  }

  // ── Essay rendering helpers ───────────────────────────────────────────────
  function normalize(s: string) { return s.replace(/\s+/g, " ").trim(); }

  function findInPara(para: string, normPara: string, sentNorm: string): { idx: number; len: number } | null {
    const exactIdx = normPara.indexOf(sentNorm);
    if (exactIdx !== -1) return { idx: exactIdx, len: sentNorm.length };
    const prefix = sentNorm.slice(0, 40);
    if (prefix.length < 10) return null;
    const prefixIdx = normPara.indexOf(prefix);
    if (prefixIdx === -1) return null;
    const suffix = sentNorm.slice(-20);
    const suffixIdx = normPara.indexOf(suffix, prefixIdx + prefix.length - 1);
    if (suffixIdx !== -1) return { idx: prefixIdx, len: suffixIdx + suffix.length - prefixIdx };
    return { idx: prefixIdx, len: sentNorm.length };
  }

  function renderAnnotatedEssay(essayText: string, annotations: Annotation[], onDiscuss: (p: string) => void) {
    return essayText.split(/\n\n+/).map((para, pIdx) => {
      const normPara = normalize(para);
      const paraAnnotations = annotations
        .map(a => ({ annotation: a, match: findInPara(para, normPara, normalize(a.sentence)) }))
        .filter(({ match }) => match !== null)
        .sort((a, b) => a.match!.idx - b.match!.idx);
      if (paraAnnotations.length === 0) return <p key={pIdx} className={pIdx > 0 ? "mt-7" : ""}>{para}</p>;
      const parts: React.ReactNode[] = [];
      let cursor = 0, key = 0;
      for (const { annotation, match } of paraAnnotations) {
        const { idx, len } = match!;
        if (idx < cursor) continue;
        if (idx > cursor) parts.push(<span key={key++}>{normPara.slice(cursor, idx)}</span>);
        parts.push(<AnnotatedSentence key={key++} annotation={annotation} onDiscuss={onDiscuss} />);
        cursor = idx + len;
      }
      if (cursor < normPara.length) parts.push(<span key={key++}>{normPara.slice(cursor)}</span>);
      return <p key={pIdx} className={pIdx > 0 ? "mt-7" : ""}>{parts}</p>;
    });
  }

  const scoreColor = (s: number) => s >= 8 ? "#4ade80" : s >= 5 ? "#f59e0b" : "#f87171";

  function ResultsDisplay({ result, essay, onDiscuss, onReset, chatPromptVal, chatRef, label }: {
    result: AnnotationResult;
    essay: string;
    onDiscuss: (p: string) => void;
    onReset: () => void;
    chatPromptVal: string | undefined;
    chatRef: React.RefObject<HTMLDivElement | null>;
    label: string;
  }) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl p-6 flex items-center gap-6 border" style={{ background: cardBg, borderColor: borderCol }}>
          <div className="text-center min-w-fit">
            <div className="text-5xl font-bold" style={{ color: scoreColor(result.memorabilityScore) }}>
              {result.memorabilityScore}<span className="text-xl" style={{ color: muted }}>/10</span>
            </div>
            <div className="text-[10px] mt-1 uppercase tracking-widest" style={{ color: muted }}>Memorability</div>
          </div>
          <p className="text-sm leading-relaxed" style={{ color: muted }}>{result.memorabilityReason}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { label: "Hook Verdict",       value: result.hookVerdict,       color: "#f87171" },
            { label: "Conclusion Verdict", value: result.conclusionVerdict, color: "#f59e0b" },
          ].map(({ label: l, value, color }) => (
            <div key={l} className="rounded-2xl p-5 border" style={{ background: cardBg, borderColor: borderCol }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>{l}</p>
              <p className="text-sm leading-relaxed" style={{ color: muted }}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: "Overall",               value: result.overallFeedback,    color: "#a78bfa" },
            { label: "Application Alignment", value: result.applicationAlignment, color: "#60a5fa" },
            { label: "Biggest Problem",       value: result.catastrophicMistake, color: "#f87171" },
          ].map(({ label: l, value, color }) => (
            <div key={l} className="rounded-2xl p-5 border" style={{ background: cardBg, borderColor: borderCol }}>
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>{l}</p>
              <p className="text-[13px] leading-relaxed" style={{ color: muted }}>{value}</p>
            </div>
          ))}
        </div>

        {result.metaphorOpportunity && result.metaphorOpportunity !== "none detected." && (
          <div className="rounded-2xl p-5 border" style={{ background: "rgba(6,182,212,0.06)", borderColor: "rgba(6,182,212,0.2)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-cyan-400">💡 Metaphor Opportunity</p>
            <p className="text-cyan-200/80 text-sm leading-relaxed">{result.metaphorOpportunity}</p>
          </div>
        )}

        {result.strongestSentence && (
          <div className="rounded-2xl p-5 border" style={{ background: "rgba(52,211,153,0.06)", borderColor: "rgba(52,211,153,0.2)" }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-emerald-400">Your Strongest Sentence</p>
            <p className="text-emerald-200/80 text-sm leading-relaxed italic">"{result.strongestSentence}"</p>
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {LEGEND_ITEMS.map(item => (
            <span key={item.label} className={`text-xs px-2.5 py-1 rounded-full border ${item.cls}`}>{item.label}</span>
          ))}
        </div>

        <div className="rounded-2xl overflow-hidden shadow-xl">
          <div className="px-10 py-4 flex items-center justify-between" style={{ background: "#f5f0e8", borderBottom: "1px solid #e8e0d0" }}>
            <span className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">{label}</span>
            <span className="text-[11px] text-gray-400">Click any highlight for feedback</span>
          </div>
          <div className="px-10 py-10" style={{ background: "#FAFAF5" }}>
            <div className="text-gray-800 text-[16px] leading-[1.9]" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
              {renderAnnotatedEssay(essay, result.annotations, onDiscuss)}
            </div>
          </div>
        </div>

        <button onClick={onReset} className="text-sm transition-colors" style={{ color: muted }}>
          ← Annotate a different essay
        </button>

        <div ref={chatRef}>
          <EssayChat essay={essay} annotationResult={result} initialMessage={chatPromptVal} />
        </div>
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen transition-colors duration-300" style={{ background: bg, color: text }}>

      {/* Sidebar — Supabase-backed history */}
      {tab === "personal" && (
        <div className="hidden md:flex flex-col fixed left-0 top-0 h-full w-64 border-r z-30"
          style={{ borderColor: borderCol, background: bg }}>
          <div className="px-5 py-4 border-b" style={{ borderColor: borderCol }}>
            <p className="text-[11px] font-bold uppercase tracking-widest" style={{ color: muted }}>Essay History</p>
          </div>
          <div className="flex-1 overflow-y-auto">
            {essayHistory.length === 0 ? (
              <p className="text-[13px] px-5 py-4" style={{ color: muted }}>No essays yet.</p>
            ) : essayHistory.map(item => (
              <button key={item.id}
                onClick={() => { setPsEssay(item.essay); setPsResult(item.result); setPsChatPrompt(undefined); }}
                className="w-full text-left px-5 py-3 border-b transition-opacity hover:opacity-80"
                style={{ borderColor: borderCol }}>
                <p className="text-[12px] font-medium truncate" style={{ color: text }}>
                  {item.university_name || "Personal Statement"}
                </p>
                <p className="text-[11px] mt-0.5 flex items-center gap-1.5" style={{ color: muted }}>
                  <span style={{
                    fontSize: 9, fontWeight: 600, letterSpacing: "0.05em", flexShrink: 0,
                    padding: "1px 4px", borderRadius: 3,
                    background: item.essay_type === "common_app" ? "rgba(201,169,110,0.15)" : item.essay_type === "why_us" ? "rgba(139,94,60,0.15)" : "rgba(128,128,128,0.12)",
                    color: item.essay_type === "common_app" ? gold : item.essay_type === "why_us" ? "#8B5E3C" : muted,
                    border: `0.5px solid ${item.essay_type === "common_app" ? "rgba(201,169,110,0.35)" : item.essay_type === "why_us" ? "rgba(139,94,60,0.35)" : borderCol}`,
                  }}>
                    {item.essay_type === "common_app" ? "PS" : item.essay_type === "why_us" ? "Why Us" : "Supp"}
                  </span>
                  <span className="truncate">{item.essay.slice(0, 50)}…</span>
                </p>
                <p className="text-[10px] mt-1" style={{ color: muted, opacity: 0.7 }}>
                  {item.result.memorabilityScore}/10 · {new Date(item.created_at).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Nav */}
      <nav className={`sticky top-0 z-40 border-b px-6 py-4 flex items-center justify-between ${tab === "personal" ? "md:pl-72" : ""}`}
        style={{ borderColor: borderCol, background: navBg, backdropFilter: "blur(12px)" }}>
        <div className="flex items-center gap-4">
          <a href="/dashboard" className="text-[12px] transition-colors" style={{ color: muted, textDecoration: "none" }}>
            ← Dashboard
          </a>
          <a href="/" className="text-lg font-bold tracking-tight font-serif" style={{ color: text, letterSpacing: "-0.02em" }}>
            Sheldon<span style={{ color: gold }}>AI</span>
          </a>
        </div>

        <div className="flex items-center gap-4">
          {userEmail && (
            <span className="hidden sm:flex items-center gap-3">
              <span className="text-[12px]" style={{ color: muted }}>{userEmail}</span>
              <button onClick={handleSignOut}
                className="text-[12px] transition-colors underline underline-offset-2"
                style={{ color: muted }}>
                Sign out
              </button>
            </span>
          )}
          <button onClick={toggleTheme} aria-label="Toggle theme"
            className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
            style={{ background: inputBg, border: `1px solid ${inputBorder}`, color: muted }}>
            {isDark ? (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Right sidebar — research arsenal (supplemental tab) */}
      {tab === "supplemental" && suppUniversity && (
        <div className="hidden md:flex flex-col fixed right-0 top-0 h-full w-72 border-l z-30 overflow-y-auto"
          style={{ borderColor: borderCol, background: bg }}>
          <div className="px-5 pt-6 pb-4 border-b" style={{ borderColor: borderCol }}>
            <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: muted }}>Research Arsenal</p>
            <p className="text-[17px] font-bold leading-tight" style={{ color: suppUniversity.color }}>{suppUniversity.name}</p>
          </div>

          {isSuppResearchLoading && (
            <div className="px-5 py-5">
              <p style={{ fontSize: 12, color: gold, fontStyle: "italic" }}>Researching {suppUniversity.name}...</p>
            </div>
          )}

          {!isSuppResearchLoading && suppResearch && (
            <div className="px-5 py-4">
              {suppResearch.essayWarning && (
                <div style={{ background: isDark ? "rgba(250,206,117,0.08)" : "rgba(250,206,117,0.15)", border: "0.5px solid rgba(250,206,117,0.4)", borderRadius: 8, padding: "8px 10px", fontSize: 11, color: muted, lineHeight: 1.55, marginBottom: 14 }}>
                  ⚠ {suppResearch.essayWarning}
                </div>
              )}
              {suppResearch.targetStudent && (
                <div style={{ marginBottom: 10 }}>
                  <p className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: gold }}>Who They Want</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: muted }}>{suppResearch.targetStudent}</p>
                </div>
              )}
              {suppResearch.uniqueFeatures && (
                <div style={{ marginBottom: 10 }}>
                  <p className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: gold }}>What Makes Them Different</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: muted }}>{suppResearch.uniqueFeatures}</p>
                </div>
              )}
              {suppResearch.philosophy && (
                <div style={{ marginBottom: 12 }}>
                  <p className="text-[9px] font-semibold uppercase tracking-widest mb-1" style={{ color: gold }}>Philosophy</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: muted }}>{suppResearch.philosophy}</p>
                </div>
              )}
              {(suppResearch.categories || []).map((cat, ci) => {
                const key = ci.toString();
                const isOpen = openSuppCats.has(key);
                return (
                  <div key={ci} style={{ borderTop: `0.5px solid ${borderCol}` }}>
                    <button
                      onClick={() => setOpenSuppCats(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; })}
                      style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", background: "none", border: "none", cursor: "pointer" }}
                    >
                      <span className="text-[12px] font-medium" style={{ color: text }}>{cat.emoji} {cat.label}</span>
                      <span className="text-[11px]" style={{ color: muted, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s", display: "inline-block" }}>▾</span>
                    </button>
                    {isOpen && (
                      <div style={{ paddingBottom: 6 }}>
                        {cat.items.map((item, ii) => (
                          <div key={ii} style={{ padding: "5px 0", borderTop: `0.5px solid ${borderCol}` }}>
                            <div className="text-[11px] font-semibold mb-0.5" style={{ color: text }}>{item.name}</div>
                            <div className="text-[11px] leading-relaxed" style={{ color: muted }}>{item.detail}</div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {!isSuppResearchLoading && !suppResearch && suppPrompt && (
            <div className="px-5 py-5">
              <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: gold }}>Why They're Asking This</p>
              <p className="text-[11px] font-semibold mb-3" style={{ color: suppUniversity.color }}>{suppPrompt.title}</p>
              <p className="text-[12px] leading-relaxed" style={{ color: muted }}>{suppPrompt.intent}</p>
            </div>
          )}
        </div>
      )}

      {/* Main */}
      <div className={`max-w-4xl mx-auto px-6 py-12 ${tab === "personal" ? "md:pl-[calc(16rem+3rem)]" : ""} ${tab === "supplemental" && suppUniversity ? "md:pr-[19rem]" : ""}`}>

        {/* Tabs */}
        <div className="flex gap-0 mb-10 border-b" style={{ borderColor: borderCol }}>
          {([["personal", "Personal Statement"], ["supplemental", "Supplemental Essays"]] as const).map(([value, label]) => {
            const active = tab === value;
            return (
              <button key={value} onClick={() => setTab(value)}
                className="px-5 py-3 text-[14px] font-medium transition-all relative"
                style={{ color: active ? text : muted }}>
                {label}
                {active && (
                  <span className="absolute bottom-0 left-0 right-0 h-[2px] rounded-t-full" style={{ background: gold }} />
                )}
              </button>
            );
          })}
          <a href="/whyus"
            className="px-5 py-3 text-[14px] font-medium transition-all relative"
            style={{ color: muted, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
            Why Us?
          </a>
        </div>

        {/* ── Personal Statement Tab ── */}
        {tab === "personal" && (
          <div>
            {!psResult && (
              <div className="space-y-4">
                <div className="mb-8">
                  <h1 className="text-3xl font-bold mb-2 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                    Personal Statement
                  </h1>
                  <p className="text-[15px] leading-relaxed max-w-xl" style={{ color: muted }}>
                    Sentence-by-sentence feedback at the standard of elite admissions coaching.
                    Click any highlighted sentence to discuss it in the chat below.
                  </p>
                </div>

                <div className="relative">
                  <textarea
                    ref={psEssayRef}
                    value={psEssay}
                    onChange={e => setPsEssay(e.target.value)}
                    placeholder="Paste your Common App personal statement here..."
                    rows={16}
                    className="w-full rounded-2xl px-7 py-6 text-[15px] resize-none focus:outline-none transition-all"
                    style={{
                      background: inputBg,
                      border: `1px solid ${inputBorder}`,
                      color: text,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      lineHeight: "1.85",
                    }}
                  />
                  <span className="absolute bottom-4 right-5 text-[12px]" style={{ color: muted }}>{psEssay.length}/10,000</span>
                </div>

                <div className="flex items-center gap-4 flex-wrap">
                  <button onClick={handlePsAnnotate} disabled={psLoading || psEssay.trim().length < 100}
                    className="text-[14px] font-semibold px-7 py-3 rounded-xl transition-all disabled:opacity-30"
                    style={{ background: `linear-gradient(135deg, ${gold}, ${isDark ? "#a07840" : "#7a5830"})`, color: isDark ? "#080810" : "#FAFAF5" }}>
                    {psLoading ? "Annotating..." : "Annotate My Essay"}
                  </button>
                  <button onClick={() => setPsEssay(SAMPLE_ESSAY)}
                    className="text-sm transition-colors underline underline-offset-4"
                    style={{ color: muted }}>
                    Use sample essay
                  </button>
                  {profileData && (
                    <span style={{ fontSize: 11, color: gold, display: "flex", alignItems: "center", gap: 4 }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: gold, display: "inline-block" }} />
                      Profile loaded ✓
                    </span>
                  )}
                </div>

                {psError && (
                  <div className="rounded-xl p-4 text-sm text-red-300 border border-red-800/50" style={{ background: "rgba(239,68,68,0.08)" }}>
                    {psError}
                  </div>
                )}

                {psLoading && (
                  <div className="rounded-2xl p-10 text-center border" style={{ background: subtleBg, borderColor: borderCol }}>
                    <div className="flex justify-center gap-1.5 mb-4">
                      {[0, 150, 300].map(d => (
                        <span key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ background: gold, animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                    <p className="text-sm mb-1" style={{ color: muted }}>Reading every sentence carefully...</p>
                    <p className="text-xs" style={{ color: muted, opacity: 0.6 }}>20–40 seconds</p>
                  </div>
                )}
              </div>
            )}

            {psResult && (
              <ResultsDisplay
                result={psResult}
                essay={psEssay}
                onDiscuss={handlePsDiscuss}
                onReset={() => { setPsResult(null); setPsEssay(""); setPsChatPrompt(undefined); }}
                chatPromptVal={psChatPrompt}
                chatRef={psChatRef}
                label="Common App Personal Statement"
              />
            )}
          </div>
        )}

        {/* ── Supplemental Essays Tab ── */}
        {tab === "supplemental" && (
          <div>
            <div className="mb-8">
              <h1 className="text-3xl font-bold mb-2 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
                Supplemental Essays
              </h1>
              <p className="text-[15px] leading-relaxed max-w-xl" style={{ color: muted }}>
                Select a university, choose a prompt, and annotate your essay.
                2025–2026 cycle · Class of 2030.
              </p>
            </div>

            {/* University grid — only saved colleges */}
            {(() => {
              const savedNames = new Set(savedColleges.map(c => c.university_name));

              // Universities in UNIVERSITY_PROMPTS that the student saved
              const savedWithPrompts = UNIVERSITY_PROMPTS.filter(u => savedNames.has(u.name));

              // Saved custom universities (not in UNIVERSITY_PROMPTS)
              const customSaved = savedCustomUniversities;

              const allSavedUniversities = [...savedWithPrompts, ...customSaved];

              // Empty state: no colleges at all
              if (savedColleges.length === 0) {
                return (
                  <div className="rounded-2xl border text-center py-16 px-8 mb-8" style={{ borderColor: borderCol, background: cardBg }}>
                    <p className="text-4xl mb-4">🎓</p>
                    <p className="text-[17px] font-semibold mb-2" style={{ color: text }}>No colleges in your list yet</p>
                    <p className="text-[14px] leading-relaxed mb-6 max-w-sm mx-auto" style={{ color: muted }}>
                      Go to My Colleges to add universities — their supplemental essays will appear here automatically.
                    </p>
                    <a href="/colleges"
                      className="inline-block px-6 py-3 rounded-xl text-[14px] font-semibold"
                      style={{ background: gold, color: isDark ? "#080810" : "#FAFAF5", textDecoration: "none" }}>
                      Go to My Colleges →
                    </a>
                  </div>
                );
              }

              // State: has saved colleges but none have prompts
              if (allSavedUniversities.length === 0) {
                return (
                  <div className="rounded-2xl border text-center py-12 px-8 mb-8" style={{ borderColor: borderCol, background: cardBg }}>
                    <p className="text-[15px] font-medium mb-2" style={{ color: text }}>Essay prompts loading</p>
                    <p className="text-[13px] leading-relaxed max-w-sm mx-auto" style={{ color: muted }}>
                      We are loading essay prompts for your saved colleges. Check back shortly or visit each college&#39;s page for their current prompts.
                    </p>
                    <a href="/colleges" className="inline-block mt-4 text-[13px]" style={{ color: gold, textDecoration: "none" }}>
                      View My Colleges →
                    </a>
                  </div>
                );
              }

              // Render saved university button
              const renderUniButton = (u: University) => {
                const active = suppUniversity?.id === u.id;
                const promptCount = u.prompts.filter(p => !p.id.endsWith("0")).length;
                return (
                  <button key={u.id} onClick={() => selectUniversity(u)}
                    className="rounded-xl px-4 py-4 text-left transition-all border"
                    style={{
                      background: active ? `${u.color}22` : inputBg,
                      borderColor: active ? u.color : borderCol,
                    }}>
                    <div className="text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ color: u.color }}>
                      {u.shortName}
                    </div>
                    <div className="text-[11px]" style={{ color: muted }}>{promptCount} prompt{promptCount !== 1 ? "s" : ""}</div>
                  </button>
                );
              };

              return (
                <div className="mb-8">
                  <p className="text-[11px] uppercase tracking-widest mb-3 font-medium" style={{ color: muted }}>
                    My Saved Colleges · {allSavedUniversities.length} with essay prompts
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {allSavedUniversities.map(renderUniButton)}
                  </div>
                  <p className="text-[11px] mt-3" style={{ color: muted }}>
                    <a href="/colleges" style={{ color: gold, textDecoration: "none" }}>+ Add more colleges</a>
                    {" "}to see their prompts here
                  </p>
                </div>
              );
            })()}

            {/* Prompt list */}
            {suppUniversity && !suppResult && (
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full" style={{ background: suppUniversity.color }} />
                  <span className="text-[15px] font-semibold">{suppUniversity.name}</span>
                  <span className="text-[13px]" style={{ color: muted }}>{suppUniversity.applicationCycle}</span>
                </div>
                <div className="space-y-2">
                  {suppUniversity.prompts.map(prompt => {
                    const isInstruction = prompt.id.endsWith("0");
                    const isActive = suppPrompt?.id === prompt.id;
                    const whyUsBrown = "#8B5E3C";
                    const activeColor = prompt.isWhyUs ? whyUsBrown : gold;
                    const activeBg = prompt.isWhyUs
                      ? `rgba(139,94,60,0.09)`
                      : `rgba(${isDark ? "201,169,110" : "154,112,64"},0.08)`;
                    return (
                      <div key={prompt.id} className="rounded-xl border transition-all"
                        style={{
                          background: isInstruction ? subtleBg : isActive ? activeBg : inputBg,
                          borderColor: isInstruction ? borderCol : isActive ? activeColor : borderCol,
                        }}>
                        <div className={`px-4 py-3 ${!isInstruction ? "cursor-pointer" : ""}`}
                          onClick={() => { if (!isInstruction) { setSuppPrompt(isActive ? null : prompt); setSuppEssay(""); setSuppResult(null); setTimeout(() => suppEssayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 80); } }}>
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[11px] font-bold uppercase tracking-widest"
                                  style={{ color: isInstruction ? muted : isActive ? activeColor : muted }}>
                                  {prompt.title}
                                </span>
                                {prompt.isWhyUs && (
                                  <span className="text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                                    style={{ background: "rgba(139,94,60,0.15)", color: whyUsBrown, border: `1px solid rgba(139,94,60,0.3)` }}>
                                    Why Us
                                  </span>
                                )}
                                {prompt.wordLimit > 0 && (
                                  <span className="text-[10px] px-1.5 py-0.5 rounded-full border" style={{ color: muted, borderColor: borderCol }}>
                                    {prompt.wordLimit}w
                                  </span>
                                )}
                              </div>
                              <p className="text-[12px] leading-relaxed line-clamp-2" style={{ color: muted }}>{prompt.text}</p>
                              {prompt.note && (
                                <p className="text-[11px] mt-1 italic" style={{ color: `${gold}99` }}>↳ {prompt.note}</p>
                              )}
                            </div>
                            {!isInstruction && (
                              <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                                <button
                                  onClick={e => { e.stopPropagation(); handlePromptAdvise(prompt.id, prompt.text, prompt.title, suppUniversity?.name ?? ""); }}
                                  style={{
                                    background: "rgba(184,134,11,0.12)",
                                    border: "0.5px solid rgba(184,134,11,0.5)",
                                    borderRadius: 6, padding: "4px 10px",
                                    fontSize: 11, color: gold, cursor: "pointer", fontWeight: 500,
                                    flexShrink: 0, whiteSpace: "nowrap" as const,
                                  }}
                                >
                                  💡 Topic Ideas
                                </button>
                                <div className="text-[10px] w-5 h-5 rounded-full border flex items-center justify-center flex-shrink-0"
                                  style={{ borderColor: isActive ? gold : borderCol, color: isActive ? gold : muted }}>
                                  {isActive ? "✓" : "+"}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        {/* Inline advisor panel */}
                        {!isInstruction && openAdvisorId === prompt.id && (
                          <div style={{
                            margin: "0 12px 12px",
                            border: `0.5px solid ${gold}`,
                            borderRadius: 8,
                            padding: 14,
                            background: isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)",
                            position: "relative",
                          }}>
                            <button
                              onClick={e => { e.stopPropagation(); setOpenAdvisorId(null); }}
                              style={{
                                position: "absolute", top: 8, right: 10,
                                background: "none", border: "none", cursor: "pointer",
                                color: muted, fontSize: 16, lineHeight: 1, padding: 0,
                              }}
                            >
                              ×
                            </button>
                            <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: gold, margin: "0 0 8px 0" }}>
                              Topic Ideas
                            </p>
                            {advisorLoading[prompt.id] ? (
                              <p style={{ fontSize: 12, color: muted, fontStyle: "italic", margin: 0 }}>
                                {advisorContent[prompt.id] === "" ? "Getting new ideas..." : "Getting personalized advice..."}
                              </p>
                            ) : (
                              <>
                                <p style={{ fontSize: 13, color: text, lineHeight: 1.7, margin: "0 0 10px 0", paddingRight: 16 }}>
                                  {advisorContent[prompt.id]}
                                </p>
                                <button
                                  onClick={e => { e.stopPropagation(); fetchPromptAdvice(prompt.id, prompt.text, prompt.title, suppUniversity?.name ?? "", true); }}
                                  style={{
                                    fontSize: 12, color: gold, background: "transparent",
                                    border: `0.5px solid ${borderCol}`, borderRadius: 6,
                                    padding: "4px 10px", cursor: "pointer",
                                  }}
                                >
                                  Generate different ideas ↺
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Mobile context panel — shown below prompt list on small screens */}
            {suppUniversity && !suppResult && (
              <div className="md:hidden rounded-2xl border mb-6 overflow-hidden" style={{ borderColor: borderCol, background: cardBg }}>
                <div className="px-4 pt-4 pb-3 border-b" style={{ borderColor: borderCol }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5" style={{ color: muted }}>Selected University</p>
                  <p className="text-[16px] font-bold" style={{ color: suppUniversity.color }}>{suppUniversity.name}</p>
                </div>
                <div className={`px-4 py-4 ${suppPrompt && !suppPrompt.id.endsWith("0") ? "border-b" : ""}`} style={{ borderColor: borderCol }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: gold }}>What They're Really Looking For</p>
                  <p className="text-[12px] leading-relaxed" style={{ color: muted }}>{suppUniversity.philosophy}</p>
                </div>
                {suppPrompt && !suppPrompt.id.endsWith("0") && (
                  <div className="px-4 py-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color: gold }}>Why They're Asking This</p>
                    <p className="text-[11px] font-semibold mb-2" style={{ color: suppUniversity.color }}>{suppPrompt.title}</p>
                    <p className="text-[12px] leading-relaxed" style={{ color: muted }}>{suppPrompt.intent}</p>
                  </div>
                )}
              </div>
            )}

            {/* Essay box */}
            {suppPrompt && !suppResult && (
              <div ref={suppEssayRef} className="rounded-2xl overflow-hidden border mb-4" style={{ borderColor: `${gold}44` }}>
                <div className="px-5 py-3 flex items-center justify-between border-b"
                  style={{ background: `${gold}0d`, borderColor: `${gold}22` }}>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ color: gold }}>
                      {suppUniversity?.shortName} · {suppPrompt.title}
                    </p>
                    <p className="text-[12px]" style={{ color: muted }}>
                      {suppPrompt.wordLimit > 0 ? `${suppPrompt.wordLimit} word limit` : "No word limit specified"}
                    </p>
                  </div>
                  <span className="text-[12px] font-mono"
                    style={{ color: suppPrompt.wordLimit > 0 && suppWordCount > suppPrompt.wordLimit ? "#f87171" : muted }}>
                    {suppWordCount} words
                  </span>
                </div>
                <div className="p-5" style={{ background: inputBg }}>
                  <textarea
                    value={suppEssay}
                    onChange={e => setSuppEssay(e.target.value)}
                    placeholder="Paste your supplemental essay here..."
                    rows={12}
                    className="w-full rounded-xl px-5 py-4 text-[15px] resize-none focus:outline-none transition-all"
                    style={{
                      background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)",
                      border: `1px solid ${inputBorder}`,
                      color: text,
                      fontFamily: "Georgia, 'Times New Roman', serif",
                      lineHeight: "1.85",
                    }}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <p className="text-[12px]">
                      {suppPrompt.wordLimit > 0 && suppWordCount > suppPrompt.wordLimit && (
                        <span className="text-red-400">{suppWordCount - suppPrompt.wordLimit} words over limit</span>
                      )}
                      {suppPrompt.wordLimit > 0 && suppWordCount <= suppPrompt.wordLimit && suppEssay.length > 0 && (
                        <span style={{ color: "#4ade80" }}>✓ Within {suppPrompt.wordLimit} word limit</span>
                      )}
                    </p>
                    <button onClick={handleSuppAnnotate}
                      disabled={suppLoading || suppEssay.trim().length < 50}
                      className="text-[13px] font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-30"
                      style={{ background: `linear-gradient(135deg, ${gold}, ${isDark ? "#a07840" : "#7a5830"})`, color: isDark ? "#080810" : "#FAFAF5" }}>
                      {suppLoading ? "Annotating..." : "Annotate This Essay →"}
                    </button>
                  </div>
                  {suppError && (
                    <div className="mt-3 rounded-xl p-3 text-sm text-red-300 border border-red-800/50" style={{ background: "rgba(239,68,68,0.08)" }}>
                      {suppError}
                    </div>
                  )}
                  {suppLoading && (
                    <div className="mt-4 rounded-2xl p-8 text-center border" style={{ background: subtleBg, borderColor: borderCol }}>
                      <div className="flex justify-center gap-1.5 mb-3">
                        {[0, 150, 300].map(d => (
                          <span key={d} className="w-2 h-2 rounded-full animate-bounce" style={{ background: gold, animationDelay: `${d}ms` }} />
                        ))}
                      </div>
                      <p className="text-sm" style={{ color: muted }}>Reading every sentence carefully... 20–40 seconds</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {suppResult && suppUniversity && suppPrompt && (
              <ResultsDisplay
                result={suppResult}
                essay={suppEssay}
                onDiscuss={handleSuppDiscuss}
                onReset={() => { setSuppResult(null); setSuppEssay(""); setSuppChatPrompt(undefined); }}
                chatPromptVal={suppChatPrompt}
                chatRef={suppChatRef}
                label={`${suppUniversity.name} · ${suppPrompt.title}`}
              />
            )}

            {!suppUniversity && (
              <div className="text-center py-24" style={{ color: muted }}>
                <p className="text-4xl mb-3">🎓</p>
                <p className="text-[15px]">Select a university above to see its prompts</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
