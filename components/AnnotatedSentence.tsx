"use client";

import { useState, useRef, useEffect } from "react";
import { Annotation, AnnotationCategory } from "@/lib/annotate";

const CATEGORY_STYLES: Record<AnnotationCategory, { highlight: string; badge: string; dot: string }> = {
  weak_hook:             { highlight: "bg-red-100/80 border-b-2 border-red-400",          badge: "bg-red-50 text-red-700 border-red-200",       dot: "bg-red-400" },
  cliched_phrasing:      { highlight: "bg-orange-100/70 border-b-2 border-orange-400",    badge: "bg-orange-50 text-orange-700 border-orange-200", dot: "bg-orange-400" },
  borrowed_voice:        { highlight: "bg-orange-200/70 border-b-2 border-orange-500",    badge: "bg-orange-50 text-orange-800 border-orange-300", dot: "bg-orange-500" },
  tautology:             { highlight: "bg-yellow-100/60 border-b-2 border-yellow-400",    badge: "bg-yellow-50 text-yellow-700 border-yellow-200", dot: "bg-yellow-400" },
  lacks_specificity:     { highlight: "bg-blue-100/70 border-b-2 border-blue-400",        badge: "bg-blue-50 text-blue-700 border-blue-200",      dot: "bg-blue-400" },
  show_dont_tell:        { highlight: "bg-indigo-100/70 border-b-2 border-indigo-400",    badge: "bg-indigo-50 text-indigo-700 border-indigo-200", dot: "bg-indigo-400" },
  wrong_topic:           { highlight: "bg-rose-100/70 border-b-2 border-rose-400",        badge: "bg-rose-50 text-rose-700 border-rose-200",      dot: "bg-rose-400" },
  too_long:              { highlight: "bg-yellow-100/60 border-b-2 border-yellow-300",    badge: "bg-yellow-50 text-yellow-600 border-yellow-200", dot: "bg-yellow-300" },
  passive_voice:         { highlight: "bg-purple-100/70 border-b-2 border-purple-400",    badge: "bg-purple-50 text-purple-700 border-purple-200", dot: "bg-purple-400" },
  weak_verb:             { highlight: "bg-violet-100/60 border-b-2 border-violet-300",    badge: "bg-violet-50 text-violet-700 border-violet-200", dot: "bg-violet-300" },
  adjective_overload:    { highlight: "bg-fuchsia-100/60 border-b-2 border-fuchsia-400",  badge: "bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200", dot: "bg-fuchsia-400" },
  rhythm:                { highlight: "bg-teal-100/60 border-b-2 border-teal-400",        badge: "bg-teal-50 text-teal-700 border-teal-200",      dot: "bg-teal-400" },
  word_choice:           { highlight: "bg-pink-100/60 border-b-2 border-pink-400",        badge: "bg-pink-50 text-pink-700 border-pink-200",      dot: "bg-pink-400" },
  vocabulary_performance:{ highlight: "bg-pink-200/60 border-b-2 border-pink-500",        badge: "bg-pink-50 text-pink-800 border-pink-300",      dot: "bg-pink-500" },
  vocabulary_generic:    { highlight: "bg-pink-100/50 border-b-2 border-pink-300",        badge: "bg-pink-50 text-pink-600 border-pink-200",      dot: "bg-pink-300" },
  voice_flat:            { highlight: "bg-slate-100/70 border-b-2 border-slate-400",      badge: "bg-slate-50 text-slate-700 border-slate-200",   dot: "bg-slate-400" },
  unclear:               { highlight: "bg-red-100/60 border-b-2 border-red-300",          badge: "bg-red-50 text-red-600 border-red-200",         dot: "bg-red-300" },
  redundant:             { highlight: "bg-gray-100/60 border-b-2 border-gray-400",        badge: "bg-gray-50 text-gray-600 border-gray-200",      dot: "bg-gray-400" },
  phony_transformation:  { highlight: "bg-red-200/80 border-b-2 border-red-600",          badge: "bg-red-50 text-red-800 border-red-400",         dot: "bg-red-600" },
  peachy_keen:           { highlight: "bg-amber-100/70 border-b-2 border-amber-400",      badge: "bg-amber-50 text-amber-700 border-amber-200",   dot: "bg-amber-400" },
  bandwagon:             { highlight: "bg-amber-200/70 border-b-2 border-amber-500",      badge: "bg-amber-50 text-amber-800 border-amber-300",   dot: "bg-amber-500" },
  forced_drama:          { highlight: "bg-fuchsia-100/60 border-b-2 border-fuchsia-300",  badge: "bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200", dot: "bg-fuchsia-300" },
  negative_signal:       { highlight: "bg-red-100/70 border-b-2 border-red-400",          badge: "bg-red-50 text-red-700 border-red-200",         dot: "bg-red-400" },
  metaphor_missed:       { highlight: "bg-cyan-100/70 border-b-2 border-cyan-400",        badge: "bg-cyan-50 text-cyan-700 border-cyan-200",      dot: "bg-cyan-400" },
  missing_kicker:        { highlight: "bg-amber-100/70 border-b-2 border-amber-500",      badge: "bg-amber-50 text-amber-700 border-amber-300",   dot: "bg-amber-500" },
  conclusion_weak:       { highlight: "bg-amber-200/70 border-b-2 border-amber-600",      badge: "bg-amber-50 text-amber-800 border-amber-400",   dot: "bg-amber-600" },
  context_heavy:         { highlight: "bg-teal-100/60 border-b border-teal-300 border-dashed", badge: "bg-teal-50 text-teal-700 border-teal-200", dot: "bg-teal-300" },
  strong:                { highlight: "bg-emerald-100/70 border-b-2 border-emerald-400",  badge: "bg-emerald-50 text-emerald-700 border-emerald-200", dot: "bg-emerald-400" },
};

const CATEGORY_LABELS: Record<AnnotationCategory, string> = {
  weak_hook: "⚠ Weak Hook",
  cliched_phrasing: "Clichéd Phrasing",
  borrowed_voice: "Borrowed Voice",
  tautology: "Tautology",
  lacks_specificity: "Lacks Specificity",
  show_dont_tell: "Show, Don't Tell",
  wrong_topic: "Wrong Topic",
  too_long: "Too Long",
  passive_voice: "Passive Voice",
  weak_verb: "Weak Verb",
  adjective_overload: "Adjective Overload",
  rhythm: "Rhythm Issue",
  word_choice: "Word Choice",
  vocabulary_performance: "Too Showy",
  vocabulary_generic: "Too Generic",
  voice_flat: "Voice Too Flat",
  unclear: "Unclear",
  redundant: "Redundant",
  phony_transformation: "⚠ Phony Transformation",
  peachy_keen: "Peachy Keen",
  bandwagon: "Bandwagon",
  forced_drama: "Forced Drama",
  negative_signal: "Negative Signal",
  metaphor_missed: "💡 Metaphor Opportunity",
  missing_kicker: "⚠ Needs a Kicker",
  conclusion_weak: "⚠ Weak Conclusion",
  context_heavy: "? Possible: Context Heavy",
  strong: "✓ Strong",
};

type AnnotatedSentenceProps = {
  annotation: Annotation;
  onDiscuss: (prompt: string) => void;
};

export function AnnotatedSentence({ annotation, onDiscuss }: AnnotatedSentenceProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const triggerRef = useRef<HTMLSpanElement>(null);
  const dragRef = useRef<{ dragging: boolean; startX: number; startY: number; origX: number; origY: number }>({
    dragging: false, startX: 0, startY: 0, origX: 0, origY: 0,
  });

  const styles = CATEGORY_STYLES[annotation.category] ?? CATEGORY_STYLES.strong;
  const isStrong = annotation.category === "strong";
  const isOpportunity = annotation.category === "metaphor_missed";
  const isUncertain = annotation.category === "context_heavy";

  function onDragMove(e: MouseEvent) {
    if (!dragRef.current.dragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    setPos({ x: Math.max(8, dragRef.current.origX + dx), y: Math.max(8, dragRef.current.origY + dy) });
  }

  function onDragEnd() {
    dragRef.current.dragging = false;
    window.removeEventListener("mousemove", onDragMove);
    window.removeEventListener("mouseup", onDragEnd);
  }

  function onDragStart(e: React.MouseEvent) {
    e.preventDefault();
    if (!pos) return;
    dragRef.current = { dragging: true, startX: e.clientX, startY: e.clientY, origX: pos.x, origY: pos.y };
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);
  }

  useEffect(() => {
    return () => {
      window.removeEventListener("mousemove", onDragMove);
      window.removeEventListener("mouseup", onDragEnd);
    };
  }, []);

  function handleOpen() {
    if (!isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPos({ x: rect.left, y: rect.bottom + 8 });
    }
    setIsOpen(!isOpen);
  }

  function handleDiscuss() {
    const prompt = isStrong
      ? `You marked this sentence as strong: "${annotation.sentence}"\n\n${annotation.feedback}\n\nI want to understand this technique deeply. Can you show me a real example from a successful college essay that uses this exact technique, and explain in detail why it works and how I can apply it deliberately elsewhere in my essay?`
      : `You flagged this sentence: "${annotation.sentence}"\n\n${annotation.feedback}\n\nCan you show me a real example from a successful college essay that demonstrates exactly what the stronger version of this looks like — and explain in detail why that approach works and how I could apply it to my specific story here?`;
    onDiscuss(prompt);
    setIsOpen(false);
  }

  return (
    <span className="relative inline">
      <span
        ref={triggerRef}
        className={`cursor-pointer rounded-sm px-0.5 transition-opacity leading-[1.9] ${styles.highlight} ${isOpen ? "opacity-100" : "opacity-90 hover:opacity-100"}`}
        onClick={handleOpen}
      >
        {annotation.sentence}
      </span>

      {isOpen && pos && (
        <>
          <span className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <span className="fixed z-20 w-[22rem] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden block"
            style={{ left: pos.x, top: pos.y, boxShadow: "0 20px 60px rgba(0,0,0,0.15), 0 4px 16px rgba(0,0,0,0.08)" }}>

            {/* Category header */}
            <span className="block px-4 pt-4 pb-3 border-b border-gray-100 cursor-move select-none" onMouseDown={onDragStart}>
              <span className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border ${styles.badge}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${styles.dot}`} />
                  {CATEGORY_LABELS[annotation.category]}
                </span>
                {!isStrong && !isOpportunity && !isUncertain && (
                  <span className={`text-xs font-mono tracking-widest ${
                    annotation.severity === "high" ? "text-red-400"
                    : annotation.severity === "medium" ? "text-amber-400"
                    : "text-gray-300"}`}>
                    {"●".repeat(annotation.severity === "high" ? 3 : annotation.severity === "medium" ? 2 : 1)}
                  </span>
                )}
              </span>
            </span>

            {/* Feedback */}
            <span className="block px-4 py-3">
              <p className="text-[13px] text-gray-700 leading-relaxed">
                {annotation.feedback}
              </p>
            </span>

            {/* Think about this */}
            {annotation.question && (
              <span className="block mx-4 mb-3 bg-slate-50 rounded-xl p-3 border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {isOpportunity ? "Explore this" : isUncertain ? "Ask yourself" : "Think about this"}
                </p>
                <p className="text-[13px] text-slate-700 leading-relaxed">
                  {annotation.question}
                </p>
              </span>
            )}

            {/* Discuss button */}
            <span className="block px-4 pb-4">
              <button
                onClick={handleDiscuss}
                className={`w-full text-[13px] font-medium py-2.5 px-4 rounded-xl transition-all border ${
                  isStrong
                    ? "bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border-emerald-200"
                    : isUncertain
                    ? "bg-teal-50 hover:bg-teal-100 text-teal-700 border-teal-200"
                    : "bg-[#1a1a2e] hover:bg-[#252545] text-white border-transparent"
                }`}
              >
                {isStrong
                  ? "→ See this technique in a real essay"
                  : isUncertain
                  ? "→ Help me decide if I should cut this"
                  : "→ Show me the fix with a real example"}
              </button>
              <button
                className="mt-2 text-[11px] text-gray-300 hover:text-gray-500 w-full text-center transition-colors"
                onMouseDown={e => e.stopPropagation()}
                onClick={() => setIsOpen(false)}
              >
                close
              </button>
            </span>
          </span>
        </>
      )}
    </span>
  );
}
