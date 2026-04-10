"use client";

import { useState } from "react";
import { UNIVERSITY_PROMPTS, University, Prompt } from "@/lib/universityPrompts";

const IVY_ORDER = ["harvard","yale","princeton","columbia","penn","brown","dartmouth","cornell"];
const OTHER_ORDER = ["stanford","mit","berkeley"];

export default function SupplementalPage() {
  const [selected, setSelected] = useState<University | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [essay, setEssay] = useState("");

  function selectUniversity(u: University) {
    setSelected(u);
    setSelectedPrompt(null);
    setEssay("");
  }

  const ivies = UNIVERSITY_PROMPTS.filter(u => IVY_ORDER.includes(u.id))
    .sort((a,b) => IVY_ORDER.indexOf(a.id) - IVY_ORDER.indexOf(b.id));
  const others = UNIVERSITY_PROMPTS.filter(u => OTHER_ORDER.includes(u.id))
    .sort((a,b) => OTHER_ORDER.indexOf(a.id) - OTHER_ORDER.indexOf(b.id));

  const wordCount = essay.trim().split(/\s+/).filter(Boolean).length;

  return (
    <div className="min-h-screen text-white" style={{ background: "#080810" }}>

      <nav className="border-b px-8 py-4 flex items-center justify-between"
        style={{ borderColor: "rgba(255,255,255,0.07)", background: "rgba(8,8,16,0.95)" }}>
        <div className="flex items-center gap-3">
          <a href="/essay" className="text-lg font-bold tracking-tight text-white">
            counsel<span style={{ color: "#C9A96E" }}>or</span>
          </a>
          <span className="text-white/20 text-xs">·</span>
          <span className="text-white/40 text-xs">Supplemental Essays</span>
        </div>
        <span className="text-xs px-3 py-1 rounded-full border"
          style={{ color: "#C9A96E", borderColor: "rgba(201,169,110,0.3)", background: "rgba(201,169,110,0.08)" }}>
          2025–2026 · Class of 2030
        </span>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-12">

        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-3 tracking-tight" style={{ letterSpacing: "-0.02em" }}>
            Supplemental Essays
          </h1>
          <p className="text-white/45 text-[15px] leading-relaxed max-w-xl">
            Select a university to see its exact 2025–2026 prompts for the Class of 2030.
            Choose a prompt, paste your essay below, and annotate it.
          </p>
        </div>

        {/* Ivy League grid */}
        <div className="mb-10">
          <p className="text-[11px] text-white/30 uppercase tracking-widest mb-3 font-medium">The Ivy League</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            {ivies.map(u => (
              <button key={u.id} onClick={() => selectUniversity(u)}
                className="rounded-2xl px-4 py-5 text-left transition-all border"
                style={{
                  background: selected?.id === u.id ? `${u.color}22` : "rgba(255,255,255,0.03)",
                  borderColor: selected?.id === u.id ? u.color : "rgba(255,255,255,0.08)",
                }}>
                <div className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: u.color }}>
                  {u.shortName}
                </div>
                <div className="text-[12px] text-white/40">{u.prompts.length} prompts</div>
              </button>
            ))}
          </div>

          <p className="text-[11px] text-white/30 uppercase tracking-widest mb-3 font-medium">Stanford · MIT · Berkeley</p>
          <div className="grid grid-cols-3 gap-3">
            {others.map(u => (
              <button key={u.id} onClick={() => selectUniversity(u)}
                className="rounded-2xl px-4 py-5 text-left transition-all border"
                style={{
                  background: selected?.id === u.id ? `${u.color}22` : "rgba(255,255,255,0.03)",
                  borderColor: selected?.id === u.id ? u.color : "rgba(255,255,255,0.08)",
                }}>
                <div className="text-[11px] font-bold uppercase tracking-widest mb-1" style={{ color: u.color }}>
                  {u.shortName}
                </div>
                <div className="text-[12px] text-white/40">{u.prompts.filter(p => p.wordLimit !== 0 || !p.id.endsWith("0")).length} prompts</div>
              </button>
            ))}
          </div>
        </div>

        {/* Prompts */}
        {selected && (
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-2 h-2 rounded-full" style={{ background: selected.color }} />
              <h2 className="text-lg font-semibold">{selected.name}</h2>
              <span className="text-white/30 text-sm">{selected.applicationCycle} · {selected.classYear}</span>
            </div>

            <div className="space-y-3">
              {selected.prompts.map(prompt => {
                const isSelected = selectedPrompt?.id === prompt.id;
                const isInstruction = prompt.id.endsWith("0");
                return (
                  <div key={prompt.id}
                    className="rounded-2xl border transition-all"
                    style={{
                      background: isInstruction ? "rgba(255,255,255,0.015)" : isSelected ? "rgba(201,169,110,0.06)" : "rgba(255,255,255,0.02)",
                      borderColor: isInstruction ? "rgba(255,255,255,0.05)" : isSelected ? "rgba(201,169,110,0.3)" : "rgba(255,255,255,0.07)",
                    }}>
                    <div
                      className={`px-5 py-4 ${!isInstruction ? "cursor-pointer" : ""}`}
                      onClick={() => { if (!isInstruction) { setSelectedPrompt(isSelected ? null : prompt); setEssay(""); } }}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-[11px] font-bold uppercase tracking-widest"
                              style={{ color: isInstruction ? "rgba(255,255,255,0.25)" : "#C9A96E" }}>
                              {prompt.title}
                            </span>
                            {prompt.wordLimit > 0 && (
                              <span className="text-[10px] text-white/25 px-2 py-0.5 rounded-full border border-white/10">
                                {prompt.wordLimit} words
                              </span>
                            )}
                          </div>
                          <p className="text-[13px] text-white/60 leading-relaxed whitespace-pre-line">{prompt.text}</p>
                          {prompt.note && (
                            <p className="text-[12px] mt-2 italic leading-relaxed" style={{ color: "rgba(201,169,110,0.55)" }}>
                              ↳ {prompt.note}
                            </p>
                          )}
                        </div>
                        {!isInstruction && (
                          <div className="w-5 h-5 rounded-full border flex-shrink-0 mt-1 flex items-center justify-center text-[10px]"
                            style={{
                              borderColor: isSelected ? "#C9A96E" : "rgba(255,255,255,0.15)",
                              color: isSelected ? "#C9A96E" : "rgba(255,255,255,0.3)",
                              background: isSelected ? "rgba(201,169,110,0.1)" : "transparent",
                            }}>
                            {isSelected ? "✓" : "+"}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Essay box */}
        {selectedPrompt && (
          <div className="rounded-2xl overflow-hidden border" style={{ borderColor: "rgba(201,169,110,0.25)" }}>
            <div className="px-6 py-4 flex items-center justify-between"
              style={{ background: "rgba(201,169,110,0.06)", borderBottom: "1px solid rgba(201,169,110,0.12)" }}>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "#C9A96E" }}>
                  {selected?.shortName} · {selectedPrompt.title}
                </p>
                <p className="text-[12px] text-white/35">
                  {selectedPrompt.wordLimit > 0 ? `${selectedPrompt.wordLimit} word limit` : "No word limit specified"}
                </p>
              </div>
              <span className={`text-[12px] font-mono ${
                selectedPrompt.wordLimit > 0 && wordCount > selectedPrompt.wordLimit ? "text-red-400" : "text-white/30"
              }`}>
                {wordCount} words
              </span>
            </div>

            <div className="p-5">
              <textarea
                value={essay}
                onChange={e => setEssay(e.target.value)}
                placeholder="Paste your supplemental essay here..."
                rows={14}
                className="w-full rounded-xl px-5 py-4 text-[15px] text-white/85 placeholder-white/20 resize-none focus:outline-none focus:ring-1 transition-all"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.08)",
                  fontFamily: "Georgia, 'Times New Roman', serif",
                  lineHeight: "1.85",
                }}
              />

              <div className="flex items-center justify-between mt-4">
                <p className="text-[12px]">
                  {selectedPrompt.wordLimit > 0 && wordCount > selectedPrompt.wordLimit && (
                    <span className="text-red-400">{wordCount - selectedPrompt.wordLimit} words over limit</span>
                  )}
                  {selectedPrompt.wordLimit > 0 && wordCount <= selectedPrompt.wordLimit && essay.length > 0 && (
                    <span style={{ color: "#4ade80" }}>✓ Within {selectedPrompt.wordLimit} word limit</span>
                  )}
                </p>

                <a href={`/essay?type=supplemental&university=${encodeURIComponent(selected?.name || "")}`}
                  className="text-[13px] font-semibold px-6 py-3 rounded-xl transition-all text-white"
                  style={{
                    background: essay.trim().length > 50 ? "linear-gradient(135deg, #C9A96E, #a07840)" : "rgba(255,255,255,0.08)",
                    opacity: essay.trim().length > 50 ? 1 : 0.4,
                    pointerEvents: essay.trim().length > 50 ? "auto" : "none",
                  }}>
                  Annotate This Essay →
                </a>
              </div>
            </div>
          </div>
        )}

        {!selected && (
          <div className="text-center py-20 text-white/20">
            <p className="text-4xl mb-3">🎓</p>
            <p className="text-[15px]">Select a university above to see its prompts</p>
          </div>
        )}

      </div>
    </div>
  );
}
