"use client";

import { useState, useEffect } from "react";
import { AnnotationResult } from "@/lib/annotate";
import { HistoryItem, getHistory, deleteHistoryItem } from "@/lib/history";

type EssayHistoryProps = {
  onLoad: (essay: string, result: AnnotationResult) => void;
};

function scoreColor(s: number) {
  return s >= 8 ? "#4ade80" : s >= 5 ? "#f59e0b" : "#f87171";
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function EssayHistory({ onLoad }: EssayHistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    setHistory(getHistory());
  }, []);

  function handleDelete(id: string) {
    deleteHistoryItem(id);
    setHistory((prev) => prev.filter((item) => item.id !== id));
  }

  return (
    <div className="flex flex-col h-full" style={{ background: "#080810" }}>
      {/* Header */}
      <div className="px-4 py-4 border-b flex items-center gap-2" style={{ borderColor: "rgba(255,255,255,0.07)" }}>
        <span className="text-white/80 text-sm font-semibold tracking-tight">History</span>
        {history.length > 0 && (
          <span className="text-[11px] px-1.5 py-0.5 rounded-full font-medium"
            style={{ background: "rgba(201,169,110,0.15)", color: "#C9A96E" }}>
            {history.length}
          </span>
        )}
      </div>

      {/* Items */}
      <div className="flex-1 overflow-y-auto py-2">
        {history.length === 0 ? (
          <p className="text-white/20 text-xs text-center mt-8 px-4">No previous essays</p>
        ) : (
          history.map((item) => (
            <div key={item.id}
              className="group px-4 py-3 border-b transition-colors hover:bg-white/3"
              style={{ borderColor: "rgba(255,255,255,0.05)" }}>
              {/* Score + date */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold" style={{ color: scoreColor(item.result.memorabilityScore) }}>
                  {item.result.memorabilityScore}/10
                </span>
                <span className="text-[11px] text-white/25">{formatDate(item.createdAt)}</span>
              </div>

              {/* Essay preview */}
              <p className="text-[12px] text-white/45 leading-relaxed mb-2.5"
                style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
                {item.essay.trim().slice(0, 80)}{item.essay.trim().length > 80 ? "..." : ""}
              </p>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onLoad(item.essay, item.result)}
                  className="text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all"
                  style={{ background: "rgba(201,169,110,0.12)", color: "#C9A96E" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(201,169,110,0.22)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(201,169,110,0.12)")}>
                  Load
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-[11px] text-white/20 hover:text-red-400 transition-colors px-1">
                  ✕
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
