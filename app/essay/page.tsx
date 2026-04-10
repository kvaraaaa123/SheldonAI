"use client";

import { useState, useRef } from "react";
import { usePathname } from "next/navigation";
import { AnnotatedSentence } from "@/components/AnnotatedSentence";
import { EssayChat } from "@/components/EssayChat";
import { EssayHistory } from "@/components/EssayHistory";
import { AnnotationResult, Annotation } from "@/lib/annotate";
import { saveAnnotation } from "@/lib/history";
import { UNIVERSITY_PROMPTS } from "@/lib/universityPrompts";

const SAMPLE_ESSAY = `I have always been passionate about science and helping others. Growing up, I was deeply influenced by my family and community. My journey to becoming who I am today was shaped by many experiences that taught me important lessons about life.

One of the most important moments in my life was when I volunteered at a local hospital. I saw how doctors and nurses worked tirelessly to help patients, and I knew that I wanted to make a difference in the world just like them. It was an eye-opening experience that changed my perspective on everything.

I have always been a hard worker and a good student. I believe that with dedication and perseverance, anyone can achieve their dreams. My teachers have always told me that I have great potential, and I am determined to live up to that potential at your university.`;

const LEGEND_ITEMS = [
  { label: "⚠ Weak Hook", cls: "bg-red-100 text-red-700 border-red-200" },
  { label: "Lacks Specificity", cls: "bg-blue-100 text-blue-700 border-blue-200" },
  { label: "Show Don't Tell", cls: "bg-indigo-100 text-indigo-700 border-indigo-200" },
  { label: "Weak Verb", cls: "bg-violet-100 text-violet-700 border-violet-200" },
  { label: "Voice Too Flat", cls: "bg-slate-100 text-slate-700 border-slate-200" },
  { label: "⚠ Phony Transform.", cls: "bg-red-200 text-red-800 border-red-400" },
  { label: "💡 Metaphor", cls: "bg-cyan-100 text-cyan-700 border-cyan-200" },
  { label: "? Context Heavy", cls: "bg-teal-100 text-teal-700 border-teal-200" },
  { label: "✓ Strong", cls: "bg-emerald-100 text-emerald-700 border-emerald-200" },
];

export default function EssayPage() {
  const [essay, setEssay] = useState("");
  const [result, setResult] = useState<AnnotationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [chatPrompt, setChatPrompt] = useState<string | undefined>(undefined);
  const [essayType, setEssayType] = useState<"common_app" | "supplemental" | "">("");
  const [universityName, setUniversityName] = useState("");
  const [selectedPromptText, setSelectedPromptText] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const essayRef = useRef<HTMLTextAreaElement>(null);
  const pathname = usePathname();

  async function handleAnnotate() {
    if (!essay.trim()) return;
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const res = await fetch("/api/annotate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ essay, essayType, universityName }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data);
      saveAnnotation(essay, data);
    } catch {
      setError("Network error. Make sure your dev server is running.");
    } finally {
      setLoading(false);
    }
  }

  function handleLoadHistory(loadedEssay: string, loadedResult: AnnotationResult) {
    setEssay(loadedEssay);
    setResult(loadedResult);
    setChatPrompt(undefined);
  }

  function handleDiscuss(prompt: string) {
    setChatPrompt(prompt);
    setTimeout(() => chatRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
  }

  function normalize(s: string) {
    return s.replace(/\s+/g, " ").trim();
  }

  function findInPara(para: string, normPara: string, sentNorm: string): { idx: number; len: number } | null {
    // 1. Exact match on normalized paragraph
    const exactIdx = normPara.indexOf(sentNorm);
    if (exactIdx !== -1) return { idx: exactIdx, len: sentNorm.length };
    // 2. First-40-chars prefix match
    const prefix = sentNorm.slice(0, 40);
    if (prefix.length < 10) return null;
    const prefixIdx = normPara.indexOf(prefix);
    if (prefixIdx === -1) return null;
    // Find the end by matching up to the last 20 chars of the sentence
    const suffix = sentNorm.slice(-20);
    const suffixIdx = normPara.indexOf(suffix, prefixIdx + prefix.length - 1);
    if (suffixIdx !== -1) return { idx: prefixIdx, len: suffixIdx + suffix.length - prefixIdx };
    // Fall back: use prefix match and estimate length from original sentence
    return { idx: prefixIdx, len: sentNorm.length };
  }

  function renderAnnotatedEssay(essayText: string, annotations: Annotation[]) {
    const paragraphs = essayText.split(/\n\n+/);
    return paragraphs.map((para, pIdx) => {
      const normPara = normalize(para);

      const paraAnnotations = annotations
        .map(a => ({ annotation: a, match: findInPara(para, normPara, normalize(a.sentence)) }))
        .filter(({ match }) => match !== null)
        .sort((a, b) => a.match!.idx - b.match!.idx);

      if (paraAnnotations.length === 0) {
        return <p key={pIdx} className={pIdx > 0 ? "mt-7" : ""}>{para}</p>;
      }

      // Build parts by walking the normalized paragraph and mapping back to original
      // Since normPara and para may differ in whitespace runs, we reconstruct from normPara positions
      const parts: React.ReactNode[] = [];
      let cursor = 0;
      let key = 0;
      for (const { annotation, match } of paraAnnotations) {
        const { idx, len } = match!;
        if (idx < cursor) continue;
        if (idx > cursor) parts.push(<span key={key++}>{normPara.slice(cursor, idx)}</span>);
        parts.push(<AnnotatedSentence key={key++} annotation={annotation} onDiscuss={handleDiscuss} />);
        cursor = idx + len;
      }
      if (cursor < normPara.length) parts.push(<span key={key++}>{normPara.slice(cursor)}</span>);

      return <p key={pIdx} className={pIdx > 0 ? "mt-7" : ""}>{parts}</p>;
    });
  }

  const scoreColor = (s: number) => s >= 8 ? "#4ade80" : s >= 5 ? "#f59e0b" : "#f87171";

  return (
    <div className="min-h-screen text-white" style={{ background: "#080810" }}>

      {/* Sidebar */}
      <div className="hidden md:block fixed left-0 top-0 h-full w-64 border-r z-30"
        style={{ borderColor: "rgba(255,255,255,0.07)", background: "#080810" }}>
        <EssayHistory onLoad={handleLoadHistory} />
      </div>

      {/* Nav */}
      <nav className="border-b px-8 py-4 flex items-center justify-between md:pl-72" style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(8,8,16,0.95)" }}>
        <div className="flex items-center gap-3">
          <span className="text-lg font-bold tracking-tight text-white">
            counsel<span style={{ color: "#C9A96E" }}>or</span>
          </span>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-white/40 text-xs">Essay Annotator</span>
        </div>
        <div className="flex items-center gap-5">
          {([[ "/essay", "Common App"], ["/supplemental", "Supplemental Essays"]] as const).map(([href, label]) => {
            const active = pathname === href;
            return (
              <a key={href} href={href}
                className="text-[13px] transition-colors"
                style={{ color: active ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.4)" }}
                onMouseEnter={e => { if (!active) (e.target as HTMLElement).style.color = "#C9A96E"; }}
                onMouseLeave={e => { if (!active) (e.target as HTMLElement).style.color = "rgba(255,255,255,0.4)"; }}>
                {label}
              </a>
            );
          })}
          <span className="text-xs px-3 py-1 rounded-full border" style={{ color: "#C9A96E", borderColor: "rgba(201,169,110,0.3)", background: "rgba(201,169,110,0.08)" }}>
            Beta
          </span>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-14">

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Essay Annotator
          </h1>
          <p className="text-white/45 leading-relaxed text-[15px] max-w-xl mb-6">
            Sentence-by-sentence feedback at the standard of elite admissions coaching.
            Click any highlighted sentence, then discuss in the chat below for full examples and theory.
          </p>
          {/* Essay type toggle — always visible */}
          <div className="flex gap-2">
            {([["common_app", "Common App Essay"], ["supplemental", "Supplemental Essay"]] as const).map(([value, label]) => {
              const selected = essayType === value;
              return (
                <button key={value}
                  onClick={() => { setEssayType(selected ? "" : value); setUniversityName(""); setSelectedPromptText(""); }}
                  className="text-[13px] font-medium px-5 py-2.5 rounded-xl transition-all border"
                  style={{
                    background: selected ? "rgba(201,169,110,0.15)" : "rgba(255,255,255,0.04)",
                    borderColor: selected ? "rgba(201,169,110,0.5)" : "rgba(255,255,255,0.09)",
                    color: selected ? "#C9A96E" : "rgba(255,255,255,0.4)",
                  }}>
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Input */}
        {!result && (
          <div className="space-y-4">
            {essayType === "supplemental" && (
                <div className="space-y-4">
                  {/* University grid */}
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                    {UNIVERSITY_PROMPTS.map(u => {
                      const isSelected = universityName === u.name;
                      return (
                        <button key={u.id}
                          onClick={() => { setUniversityName(isSelected ? "" : u.name); setSelectedPromptText(""); }}
                          className="rounded-xl px-3 py-3 text-left transition-all border"
                          style={{
                            background: isSelected ? `${u.color}22` : "rgba(255,255,255,0.03)",
                            borderColor: isSelected ? u.color : "rgba(255,255,255,0.08)",
                          }}>
                          <div className="text-[11px] font-bold uppercase tracking-widest" style={{ color: isSelected ? u.color : "rgba(255,255,255,0.4)" }}>
                            {u.shortName}
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  {/* Prompt list for selected university */}
                  {universityName && (() => {
                    const uni = UNIVERSITY_PROMPTS.find(u => u.name === universityName);
                    if (!uni) return null;
                    return (
                      <div className="space-y-2">
                        <p className="text-[11px] text-white/30 uppercase tracking-widest font-medium">
                          {uni.shortName} Prompts — select one
                        </p>
                        {uni.prompts.filter(p => !p.id.endsWith("0")).map(prompt => {
                          const isSelected = selectedPromptText === prompt.text;
                          return (
                            <button key={prompt.id}
                              onClick={() => {
                                setSelectedPromptText(isSelected ? "" : prompt.text);
                                setTimeout(() => essayRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }), 50);
                              }}
                              className="w-full rounded-xl px-4 py-3 text-left transition-all border"
                              style={{
                                background: isSelected ? "rgba(201,169,110,0.08)" : "rgba(255,255,255,0.02)",
                                borderColor: isSelected ? "rgba(201,169,110,0.35)" : "rgba(255,255,255,0.07)",
                              }}>
                              <div className="flex items-start justify-between gap-3">
                                <div className="flex-1">
                                  <span className="text-[11px] font-bold uppercase tracking-widest" style={{ color: isSelected ? "#C9A96E" : "rgba(255,255,255,0.35)" }}>
                                    {prompt.title}
                                  </span>
                                  {prompt.wordLimit > 0 && (
                                    <span className="ml-2 text-[10px] text-white/20">{prompt.wordLimit}w</span>
                                  )}
                                  <p className="text-[12px] text-white/45 mt-1 leading-relaxed line-clamp-2">{prompt.text}</p>
                                </div>
                                <div className="text-[10px] mt-0.5 flex-shrink-0"
                                  style={{ color: isSelected ? "#C9A96E" : "rgba(255,255,255,0.2)" }}>
                                  {isSelected ? "✓" : "+"}
                                </div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    );
                  })()}
                </div>
              )}

            <div className="relative">
              {selectedPromptText && (
                <div className="mb-3 rounded-xl px-4 py-3 border text-[12px] text-white/50 leading-relaxed"
                  style={{ background: "rgba(201,169,110,0.05)", borderColor: "rgba(201,169,110,0.2)" }}>
                  <span className="text-[10px] font-bold uppercase tracking-widest block mb-1" style={{ color: "rgba(201,169,110,0.6)" }}>Prompt</span>
                  {selectedPromptText}
                </div>
              )}
              <textarea
                ref={essayRef}
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                placeholder={selectedPromptText ? "Paste your essay for this prompt here..." : "Paste your college essay here..."}
                className="w-full h-80 rounded-2xl px-7 py-6 text-[15px] text-white/85 placeholder-white/20 resize-none focus:outline-none focus:ring-1 leading-8 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  lineHeight: "1.85",
                  // @ts-ignore
                  "--tw-ring-color": "rgba(201,169,110,0.4)",
                }}
              />
              <span className="absolute bottom-4 right-5 text-white/20 text-xs">{essay.length}/10,000</span>
            </div>

            <div className="flex items-center gap-4">
              <button onClick={handleAnnotate} disabled={loading || essay.trim().length < 100}
                className="text-[14px] font-semibold px-7 py-3 rounded-xl transition-all disabled:opacity-30 text-white"
                style={{ background: "linear-gradient(135deg, #C9A96E, #a07840)" }}>
                {loading ? "Annotating..." : "Annotate My Essay"}
              </button>
              <button onClick={() => setEssay(SAMPLE_ESSAY)}
                className="text-white/35 hover:text-white/60 text-sm transition-colors underline underline-offset-4">
                Use sample essay
              </button>
            </div>

            {error && (
              <div className="rounded-xl p-4 text-sm text-red-300 border border-red-800/50" style={{ background: "rgba(239,68,68,0.08)" }}>
                {error}
              </div>
            )}

            {loading && (
              <div className="rounded-2xl p-10 text-center border" style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.06)" }}>
                <div className="flex justify-center gap-1.5 mb-4">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-2 h-2 rounded-full animate-bounce"
                      style={{ background: "#C9A96E", animationDelay: `${d}ms` }} />
                  ))}
                </div>
                <p className="text-white/40 text-sm mb-1">Reading every sentence carefully...</p>
                <p className="text-white/20 text-xs">20–40 seconds</p>
              </div>
            )}
          </div>
        )}

        {/* Results */}
        {result && (
          <div className="space-y-5">

            {/* Score */}
            <div className="rounded-2xl p-6 flex items-center gap-6 border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
              <div className="text-center min-w-fit">
                <div className="text-5xl font-bold" style={{ color: scoreColor(result.memorabilityScore) }}>
                  {result.memorabilityScore}<span className="text-xl text-white/20">/10</span>
                </div>
                <div className="text-[10px] text-white/30 mt-1 uppercase tracking-widest">Memorability</div>
              </div>
              <p className="text-white/55 text-sm leading-relaxed">{result.memorabilityReason}</p>
            </div>

            {/* Hook + Conclusion */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Hook Verdict", value: result.hookVerdict, color: "#f87171" },
                { label: "Conclusion Verdict", value: result.conclusionVerdict, color: "#f59e0b" },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-2xl p-5 border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>{label}</p>
                  <p className="text-white/60 text-sm leading-relaxed">{value}</p>
                </div>
              ))}
            </div>

            {/* Three col */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Overall", value: result.overallFeedback, color: "#a78bfa" },
                { label: "Application Alignment", value: result.applicationAlignment, color: "#60a5fa" },
                { label: "Biggest Problem", value: result.catastrophicMistake, color: "#f87171" },
              ].map(({ label, value, color }) => (
                <div key={label} className="rounded-2xl p-5 border" style={{ background: "rgba(255,255,255,0.03)", borderColor: "rgba(255,255,255,0.07)" }}>
                  <p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{ color }}>{label}</p>
                  <p className="text-white/55 text-[13px] leading-relaxed">{value}</p>
                </div>
              ))}
            </div>

            {/* Metaphor */}
            {result.metaphorOpportunity && result.metaphorOpportunity !== "none detected." && (
              <div className="rounded-2xl p-5 border" style={{ background: "rgba(6,182,212,0.06)", borderColor: "rgba(6,182,212,0.2)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-cyan-400">💡 Metaphor Opportunity</p>
                <p className="text-cyan-200/80 text-sm leading-relaxed">{result.metaphorOpportunity}</p>
              </div>
            )}

            {/* Strongest sentence */}
            {result.strongestSentence && (
              <div className="rounded-2xl p-5 border" style={{ background: "rgba(52,211,153,0.06)", borderColor: "rgba(52,211,153,0.2)" }}>
                <p className="text-[10px] font-bold uppercase tracking-widest mb-1.5 text-emerald-400">Your Strongest Sentence</p>
                <p className="text-emerald-200/80 text-sm leading-relaxed italic">"{result.strongestSentence}"</p>
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap gap-2">
              {LEGEND_ITEMS.map((item) => (
                <span key={item.label} className={`text-xs px-2.5 py-1 rounded-full border ${item.cls}`}>
                  {item.label}
                </span>
              ))}
            </div>

            {/* Essay — rendered as the AO sees it */}
            <div className="rounded-2xl overflow-hidden shadow-xl">
              {/* Paper header */}
              <div className="px-10 py-4 flex items-center justify-between" style={{ background: "#f5f0e8", borderBottom: "1px solid #e8e0d0" }}>
                <span className="text-[11px] text-gray-400 uppercase tracking-widest font-medium">Common App Personal Statement</span>
                <span className="text-[11px] text-gray-400">Click any highlight for feedback</span>
              </div>
              {/* Paper body */}
              <div className="px-10 py-10" style={{ background: "#FAFAF5" }}>
                <div className="text-gray-800 text-[16px] leading-[1.9]"
                  style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                  {renderAnnotatedEssay(essay, result.annotations)}
                </div>
              </div>
            </div>

            {/* Back */}
            <button onClick={() => { setResult(null); setEssay(""); setChatPrompt(undefined); }}
              className="text-white/30 hover:text-white/55 text-sm transition-colors">
              ← Annotate a different essay
            </button>

            {/* Chat */}
            <div ref={chatRef}>
              <EssayChat essay={essay} annotationResult={result} initialMessage={chatPrompt} />
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
