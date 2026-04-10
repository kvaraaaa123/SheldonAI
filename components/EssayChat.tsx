"use client";

import { useState, useRef, useEffect } from "react";
import { AnnotationResult } from "@/lib/annotate";

type Message = { role: "user" | "assistant"; content: string };

type EssayChatProps = {
  essay: string;
  annotationResult: AnnotationResult;
  initialMessage?: string;
};

export function EssayChat({ essay, annotationResult, initialMessage }: EssayChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (initialMessage) {
      setInput(initialMessage);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [initialMessage]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  async function handleSend() {
    if (!input.trim() || loading) return;
    const userMessage: Message = { role: "user", content: input.trim() };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages, essay, annotationResult }),
      });
      const data = await res.json();
      setMessages([...newMessages, {
        role: "assistant",
        content: res.ok ? data.message : (data.error || "Something went wrong."),
      }]);
    } catch {
      setMessages([...newMessages, { role: "assistant", content: "Network error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  }

  function isEssayQuote(para: string) {
    const trimmed = para.trim();
    return (
      (trimmed.startsWith("\u201c") || trimmed.startsWith('"')) &&
      (trimmed.endsWith("\u201d") || trimmed.endsWith('"'))
    ) || (
      trimmed.startsWith("\u201c") || trimmed.startsWith('"')
    ) && trimmed.length > 40;
  }

  function renderContent(text: string) {
    return text.split("\n\n").map((para, i) => {
      if (isEssayQuote(para)) {
        return (
          <p key={i} className={i > 0 ? "mt-3" : ""}
            style={{
              whiteSpace: "pre-wrap",
              fontFamily: "Georgia, 'Times New Roman', serif",
              fontStyle: "italic",
              color: "#C9A96E",
              borderLeft: "3px solid rgba(201,169,110,0.4)",
              paddingLeft: "12px",
              lineHeight: "1.7",
            }}>
            {para}
          </p>
        );
      }
      return (
        <p key={i} className={i > 0 ? "mt-3" : ""} style={{ whiteSpace: "pre-wrap" }}>{para}</p>
      );
    });
  }

  const STARTERS = [
    "Why is my hook weak? Show me a real example from a successful college essay.",
    "I disagree with one of the annotations — let's debate it.",
    "What does 'show don't tell' actually look like in a college essay? Give me a concrete example.",
    "How do I write a kicker that lands? Show me what the great ones do.",
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-white/8"
      style={{ background: "linear-gradient(160deg, #0f0f1a 0%, #0a0a12 100%)" }}>

      {/* Header */}
      <div className="px-6 py-5 border-b border-white/8 flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-[15px] tracking-tight">Discuss This Essay</h3>
          <p className="text-white/40 text-xs mt-0.5">
            Push back · request real examples · go deeper on any annotation
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-white/30 text-xs">Full context loaded</span>
        </div>
      </div>

      {/* Starters */}
      {messages.length === 0 && (
        <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-2 border-b border-white/5">
          {STARTERS.map((q) => (
            <button key={q}
              onClick={() => { setInput(q); setTimeout(() => inputRef.current?.focus(), 50); }}
              className="text-left text-[13px] text-white/50 hover:text-white/80 rounded-xl px-4 py-3 transition-all leading-relaxed border border-white/8 hover:border-white/15 hover:bg-white/5">
              {q}
            </button>
          ))}
        </div>
      )}

      {/* Messages */}
      {messages.length > 0 && (
        <div className="p-5 space-y-4 max-h-[560px] overflow-y-auto">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
              {msg.role === "assistant" && (
                <div className="w-7 h-7 rounded-full flex-shrink-0 mt-0.5 flex items-center justify-center text-[11px] font-bold text-white"
                  style={{ background: "linear-gradient(135deg, #C9A96E, #a07840)" }}>
                  C
                </div>
              )}
              <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-[13px] leading-relaxed ${
                msg.role === "user"
                  ? "text-white rounded-tr-sm"
                  : "text-white/85 rounded-tl-sm border border-white/8"
              }`}
                style={msg.role === "user"
                  ? { background: "linear-gradient(135deg, #2d2d6b, #1e1e50)" }
                  : { background: "rgba(255,255,255,0.04)" }}>
                {renderContent(msg.content)}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-[11px] font-bold text-white"
                style={{ background: "linear-gradient(135deg, #C9A96E, #a07840)" }}>
                C
              </div>
              <div className="rounded-2xl rounded-tl-sm px-4 py-3 border border-white/8"
                style={{ background: "rgba(255,255,255,0.04)" }}>
                <div className="flex gap-1.5 items-center h-4">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-1.5 h-1.5 rounded-full bg-white/30 animate-bounce"
                      style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      )}

      {/* Input */}
      <div className="px-5 py-4 border-t border-white/8">
        <div className="flex gap-3 items-end">
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask why something matters, push back, request a real example..."
            rows={3}
            className="flex-1 rounded-xl px-4 py-3 text-[13px] text-white/85 placeholder-white/25 resize-none focus:outline-none focus:ring-1 focus:ring-white/20 leading-relaxed transition-all"
            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}
          />
          <button onClick={handleSend} disabled={loading || !input.trim()}
            className="text-[13px] font-semibold px-5 py-3 rounded-xl transition-all self-end disabled:opacity-30 text-white"
            style={{ background: "linear-gradient(135deg, #C9A96E, #a07840)" }}>
            Send →
          </button>
        </div>
        <p className="text-[11px] text-white/20 mt-2">Enter to send · Shift+Enter for new line</p>
      </div>
    </div>
  );
}
