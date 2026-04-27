"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import {
  DeadlineItem,
  SAT_DATES_2025_2026,
  ACT_DATES_2025_2026,
  TOEFL_INFO,
  IELTS_INFO,
  UNIVERSITY_DEADLINES,
  generateEssayMilestones,
} from "@/lib/deadlineData";

type View = "timeline" | "calendar";

type CategoryFilter = {
  key: DeadlineItem["category"];
  label: string;
  color: string;
};

const CATEGORY_FILTERS: CategoryFilter[] = [
  { key: "application",     label: "Application Deadlines", color: "#ef4444" },
  { key: "financial_aid",   label: "Financial Aid",         color: "#f59e0b" },
  { key: "sat",             label: "SAT Dates",             color: "#2563eb" },
  { key: "act",             label: "ACT Dates",             color: "#16a34a" },
  { key: "toefl",          label: "TOEFL/IELTS",           color: "#7c3aed" },
  { key: "ielts",          label: "TOEFL/IELTS",           color: "#7c3aed" },
  { key: "essay_milestone", label: "Essay Milestones",      color: "#b8860b" },
  { key: "custom",          label: "Custom",                color: "#6b7280" },
];

const UNIQUE_FILTERS = [
  { key: "application" as const,     label: "Application Deadlines", color: "#ef4444" },
  { key: "financial_aid" as const,   label: "Financial Aid",         color: "#f59e0b" },
  { key: "sat" as const,             label: "SAT Dates",             color: "#2563eb" },
  { key: "act" as const,             label: "ACT Dates",             color: "#16a34a" },
  { key: "toefl" as const,           label: "TOEFL/IELTS",           color: "#7c3aed" },
  { key: "essay_milestone" as const,  label: "Essay Milestones",      color: "#b8860b" },
  { key: "custom" as const,           label: "Custom",                color: "#6b7280" },
];

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateFull(dateStr: string): string {
  const d = new Date(dateStr + "T12:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function getDaysUntil(dateStr: string): number {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const d = new Date(dateStr + "T12:00:00");
  d.setHours(0, 0, 0, 0);
  return Math.round((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function getCategoryColor(category: DeadlineItem["category"]): string {
  const f = CATEGORY_FILTERS.find(c => c.key === category);
  return f?.color ?? "#6b7280";
}

export default function DeadlinesPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  const bg      = isDark ? "#080810" : "#FAFAF5";
  const text    = isDark ? "#FAFAF5" : "#0a0a12";
  const gold    = isDark ? "#C9A96E" : "#9a7040";
  const surface = isDark ? "#0f0f1a" : "#ffffff";
  const border  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const muted   = isDark ? "rgba(250,250,245,0.45)" : "rgba(10,10,18,0.45)";
  const navBg   = isDark ? "rgba(8,8,16,0.95)" : "rgba(250,250,245,0.95)";

  const [userEmail, setUserEmail] = useState("");
  const [userId, setUserId] = useState("");
  const [view, setView] = useState<View>("timeline");
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [allDeadlines, setAllDeadlines] = useState<DeadlineItem[]>([]);
  const [showCategories, setShowCategories] = useState<Set<string>>(
    new Set(["application", "financial_aid", "sat", "act", "toefl", "ielts", "essay_milestone", "custom"])
  );
  const [selectedDeadline, setSelectedDeadline] = useState<DeadlineItem | null>(null);
  const [selectedDay, setSelectedDay] = useState<string | null>(null);
  const [showAddCustom, setShowAddCustom] = useState(false);
  const [customTitle, setCustomTitle] = useState("");
  const [customDate, setCustomDate] = useState("");
  const [customCategory, setCustomCategory] = useState("custom");
  const [customDeadlines, setCustomDeadlines] = useState<DeadlineItem[]>([]);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/"); return; }
      const uid = data.session.user.id;
      setUserEmail(data.session.user.email ?? "");
      setUserId(uid);

      const [{ data: profile }, { data: colleges }, { data: custom }] = await Promise.all([
        supabase.from("profiles").select("is_international").eq("user_id", uid).maybeSingle(),
        supabase.from("college_lists").select("university_name").eq("user_id", uid),
        supabase.from("custom_deadlines").select("*").eq("user_id", uid),
      ]);

      const deadlines: DeadlineItem[] = [
        ...SAT_DATES_2025_2026,
        ...ACT_DATES_2025_2026,
      ];

      if (profile?.is_international === "Yes") {
        deadlines.push(...TOEFL_INFO, ...IELTS_INFO);
      }

      const savedColleges = (colleges || []).map((c: { university_name: string }) => c.university_name);
      let earliestEarlyDeadline = "2025-11-01";

      savedColleges.forEach((name: string) => {
        const uni = UNIVERSITY_DEADLINES[name];
        if (!uni) return;

        const earlyDate = uni.ed || uni.ea;
        if (earlyDate) {
          deadlines.push({
            id: `${name}-early`,
            title: uni.ed ? "Early Decision Deadline" : "Early Action Deadline",
            date: earlyDate,
            category: "application",
            universityName: name,
            description: uni.ed ? "Early Decision is binding — you commit to attend if admitted." : "Early Action is non-binding.",
            color: "#ef4444",
          });
          if (earlyDate < earliestEarlyDeadline) earliestEarlyDeadline = earlyDate;
        }

        deadlines.push({
          id: `${name}-rd`,
          title: "Regular Decision Deadline",
          date: uni.rd,
          category: "application",
          universityName: name,
          description: "Regular Decision application deadline.",
          color: "#ef4444",
        });

        if (uni.financialAid) {
          deadlines.push({
            id: `${name}-aid`,
            title: "Financial Aid Deadline",
            date: uni.financialAid,
            category: "financial_aid",
            universityName: name,
            description: "Missing this deadline may significantly reduce your aid eligibility.",
            color: "#f59e0b",
          });
        }

        if (uni.requiresCss && uni.cssProfile) {
          deadlines.push({
            id: `${name}-css`,
            title: "CSS Profile Deadline",
            date: uni.cssProfile,
            category: "financial_aid",
            universityName: name,
            description: "CSS Profile required for institutional aid. Submit at cssprofile.collegeboard.org.",
            color: "#f59e0b",
          });
        }
      });

      const milestones = generateEssayMilestones(earliestEarlyDeadline);
      deadlines.push(...milestones);

      const customItems: DeadlineItem[] = (custom || []).map((c: { id: string; title: string; date: string; category: string; description?: string }) => ({
        id: `custom-${c.id}`,
        title: c.title,
        date: c.date,
        category: "custom" as const,
        description: c.description,
        color: "#6b7280",
      }));
      deadlines.push(...customItems);
      setCustomDeadlines(customItems);

      deadlines.sort((a, b) => a.date.localeCompare(b.date));
      setAllDeadlines(deadlines);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  async function handleAddCustom() {
    if (!customTitle.trim() || !customDate) return;
    const { data, error } = await supabase.from("custom_deadlines").insert({
      user_id: userId,
      title: customTitle,
      date: customDate,
      category: customCategory,
      created_at: new Date().toISOString(),
    }).select().single();
    if (!error && data) {
      const newItem: DeadlineItem = {
        id: `custom-${data.id}`,
        title: customTitle,
        date: customDate,
        category: "custom",
        color: "#6b7280",
      };
      setAllDeadlines(prev => [...prev, newItem].sort((a, b) => a.date.localeCompare(b.date)));
      setCustomTitle("");
      setCustomDate("");
      setCustomCategory("custom");
      setShowAddCustom(false);
    }
  }

  function toggleCategory(key: string) {
    setShowCategories(prev => {
      const next = new Set(prev);
      // toefl and ielts are shown/hidden together
      if (key === "toefl") {
        if (next.has("toefl")) { next.delete("toefl"); next.delete("ielts"); }
        else { next.add("toefl"); next.add("ielts"); }
      } else {
        next.has(key) ? next.delete(key) : next.add(key);
      }
      return next;
    });
  }

  const filteredDeadlines = allDeadlines.filter(d => showCategories.has(d.category));

  // Group by month for timeline
  const byMonth: Record<string, DeadlineItem[]> = {};
  filteredDeadlines.forEach(d => {
    const key = d.date.slice(0, 7); // YYYY-MM
    if (!byMonth[key]) byMonth[key] = [];
    byMonth[key].push(d);
  });

  const today = new Date().toISOString().split("T")[0];

  // Next upcoming deadline
  const upcoming = filteredDeadlines.find(d => d.date >= today);
  const daysToUpcoming = upcoming ? getDaysUntil(upcoming.date) : null;

  // Calendar helpers
  const calYear = currentMonth.getFullYear();
  const calMonth = currentMonth.getMonth();
  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const monthLabel = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  function getDeadlinesForDay(day: number): DeadlineItem[] {
    const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return filteredDeadlines.filter(d => d.date === dateStr);
  }

  const inputStyle: React.CSSProperties = {
    background: surface, border: `0.5px solid ${border}`, borderRadius: 8,
    padding: "8px 12px", fontSize: 13, color: text, outline: "none",
  };

  // Count unique schools in deadlines
  const schoolCount = new Set(allDeadlines.filter(d => d.universityName).map(d => d.universityName)).size;

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 28px", borderBottom: `0.5px solid ${border}`,
        background: navBg, backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 500, textDecoration: "none", color: text, letterSpacing: "-0.02em" }}>
            Sheldon<span style={{ color: gold }}>AI</span>
          </Link>
          <a href="/dashboard" style={{ fontSize: 12, color: muted, textDecoration: "none" }}>← Dashboard</a>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: muted }}>{userEmail}</span>
          <button onClick={handleSignOut} style={{ fontSize: 12, color: muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>Sign out</button>
          <button onClick={() => router.push("/settings")} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
          <button onClick={toggleTheme} style={{
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", border: `0.5px solid ${border}`, background: "none",
            cursor: "pointer", color: muted, fontSize: 15,
          }}>{isDark ? "☀" : "☽"}</button>
        </div>
      </nav>

      <div style={{ maxWidth: 860, margin: "0 auto", padding: "36px 28px" }}>

        {/* Header row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 28, flexWrap: "wrap", gap: 16 }}>
          <div>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 500, color: gold, marginBottom: 4, letterSpacing: "-0.3px" }}>
              Deadlines
            </h1>
            <p style={{ fontSize: 13, color: muted }}>
              {filteredDeadlines.length} deadlines{schoolCount > 0 ? ` across ${schoolCount} school${schoolCount !== 1 ? "s" : ""}` : ""}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {(["timeline", "calendar"] as View[]).map(v => (
              <button key={v} onClick={() => setView(v)} style={{
                padding: "7px 18px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                border: `0.5px solid ${view === v ? gold : border}`,
                background: view === v ? `${gold}18` : surface,
                color: view === v ? gold : muted,
                fontWeight: view === v ? 600 : 400,
                textTransform: "capitalize",
              }}>{v}</button>
            ))}
          </div>
        </div>

        {/* Countdown card */}
        {upcoming && daysToUpcoming !== null && (
          <div style={{
            background: surface, border: `1px solid ${gold}55`, borderRadius: 14,
            padding: "20px 24px", marginBottom: 24,
            display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.09em", textTransform: "uppercase", color: muted, marginBottom: 4 }}>
                Next Deadline
              </div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 500, color: text }}>
                {daysToUpcoming === 0 ? "Today" : daysToUpcoming === 1 ? "Tomorrow" : `${daysToUpcoming} days`}
                <span style={{ fontSize: 14, color: muted, fontFamily: "system-ui", marginLeft: 10 }}>
                  until {upcoming.title}{upcoming.universityName ? ` — ${upcoming.universityName}` : ""}
                </span>
              </div>
            </div>
            <div style={{ fontSize: 13, color: muted }}>{formatDate(upcoming.date)}</div>
          </div>
        )}

        {/* Category filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
          {UNIQUE_FILTERS.map(f => {
            const active = showCategories.has(f.key);
            return (
              <button key={f.key} onClick={() => toggleCategory(f.key)} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "5px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                border: `0.5px solid ${active ? f.color + "88" : border}`,
                background: active ? f.color + "18" : surface,
                color: active ? f.color : muted,
                opacity: active ? 1 : 0.6,
                transition: "all 0.15s",
              }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: active ? f.color : muted, flexShrink: 0 }} />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* ── TIMELINE VIEW ── */}
        {view === "timeline" && (
          <div>
            {Object.keys(byMonth).sort().map(monthKey => {
              const [y, m] = monthKey.split("-").map(Number);
              const monthName = new Date(y, m - 1, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
              const items = byMonth[monthKey];
              const isPast = monthKey < today.slice(0, 7);

              return (
                <div key={monthKey} style={{ marginBottom: 28 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase",
                    color: isPast ? muted : text, marginBottom: 10, paddingBottom: 6,
                    borderBottom: `0.5px solid ${border}`,
                  }}>{monthName}</div>

                  {items.map((item, i) => {
                    const daysLeft = getDaysUntil(item.date);
                    const isPastItem = daysLeft < 0;
                    const isToday = item.date === today;
                    const catColor = getCategoryColor(item.category);

                    let badgeColor = muted;
                    if (!isPastItem) {
                      if (daysLeft <= 14) badgeColor = "#ef4444";
                      else if (daysLeft <= 30) badgeColor = "#f59e0b";
                      else if (daysLeft <= 60) badgeColor = "#4ade80";
                    }

                    return (
                      <div key={`${item.id}-${i}`}>
                        {isToday && (
                          <div style={{ display: "flex", alignItems: "center", gap: 8, margin: "4px 0", color: gold, fontSize: 11, fontWeight: 500 }}>
                            <div style={{ flex: 1, height: 1, background: gold, opacity: 0.4 }} />
                            Today
                            <div style={{ flex: 1, height: 1, background: gold, opacity: 0.4 }} />
                          </div>
                        )}
                        <div
                          onClick={() => setSelectedDeadline(selectedDeadline?.id === item.id ? null : item)}
                          style={{
                            display: "flex", alignItems: "center", gap: 12, padding: "10px 0",
                            borderBottom: `0.5px solid ${border}`, cursor: "pointer",
                            opacity: isPastItem ? 0.45 : 1,
                            transition: "opacity 0.15s",
                          }}
                        >
                          <div style={{ width: 8, height: 8, borderRadius: "50%", background: catColor, flexShrink: 0 }} />
                          <div style={{ width: 54, fontSize: 12, color: muted, flexShrink: 0 }}>{formatDate(item.date)}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 14, fontWeight: 500, color: text }}>{item.title}</div>
                            {item.universityName && (
                              <div style={{ fontSize: 12, color: muted, marginTop: 2 }}>{item.universityName}</div>
                            )}
                          </div>
                          {!isPastItem && (
                            <div style={{
                              fontSize: 11, fontWeight: 600, color: badgeColor, flexShrink: 0,
                              padding: "2px 8px", borderRadius: 4,
                              background: badgeColor === muted ? "transparent" : badgeColor + "18",
                            }}>
                              {daysLeft === 0 ? "Today" : `${daysLeft}d`}
                            </div>
                          )}
                          {isPastItem && (
                            <div style={{ fontSize: 11, color: muted, flexShrink: 0 }}>Past</div>
                          )}
                        </div>

                        {/* Inline detail */}
                        {selectedDeadline?.id === item.id && (
                          <div style={{
                            margin: "4px 0 12px 20px",
                            background: surface, borderRadius: 10, padding: "16px",
                            border: `0.5px solid ${item.category === "essay_milestone" ? gold : item.category === "application" ? "#ef4444" : border}`,
                          }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
                              <div>
                                <span style={{
                                  fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
                                  padding: "2px 8px", borderRadius: 4,
                                  background: catColor + "20", color: catColor,
                                  border: `0.5px solid ${catColor}55`,
                                }}>
                                  {item.category.replace(/_/g, " ").toUpperCase()}
                                </span>
                                <div style={{ fontFamily: "Georgia, serif", fontSize: 16, fontWeight: 500, marginTop: 8, color: text }}>{item.title}</div>
                              </div>
                              <button onClick={e => { e.stopPropagation(); setSelectedDeadline(null); }} style={{
                                background: "none", border: "none", cursor: "pointer", color: muted, fontSize: 16, padding: 0,
                              }}>✕</button>
                            </div>
                            <div style={{ fontSize: 12, color: muted, marginBottom: 8 }}>{formatDateFull(item.date)}</div>
                            {item.description && (
                              <div style={{ fontSize: 13, color: muted, lineHeight: 1.6, marginBottom: 10 }}>
                                {item.description}
                                {item.category === "financial_aid" && item.universityName && (
                                  <div style={{ marginTop: 6, color: "#f59e0b", fontWeight: 500 }}>
                                    ⚠ Missing this deadline may significantly reduce your aid eligibility.
                                  </div>
                                )}
                              </div>
                            )}
                            {item.link && (
                              <a href={item.link} target="_blank" rel="noopener noreferrer" style={{
                                fontSize: 12, color: gold, textDecoration: "none", fontWeight: 500,
                              }}>Register / Learn More →</a>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              );
            })}

            {filteredDeadlines.length === 0 && (
              <div style={{ textAlign: "center", padding: "60px 0", color: muted, fontSize: 14 }}>
                No deadlines match your current filters. Add colleges to your list or adjust filters above.
              </div>
            )}
          </div>
        )}

        {/* ── CALENDAR VIEW ── */}
        {view === "calendar" && (
          <div>
            {/* Month nav */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
              <button onClick={() => setCurrentMonth(new Date(calYear, calMonth - 1, 1))} style={{
                background: surface, border: `0.5px solid ${border}`, borderRadius: 8,
                padding: "6px 14px", cursor: "pointer", color: text, fontSize: 16,
              }}>‹</button>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 500, color: text }}>{monthLabel}</div>
              <button onClick={() => setCurrentMonth(new Date(calYear, calMonth + 1, 1))} style={{
                background: surface, border: `0.5px solid ${border}`, borderRadius: 8,
                padding: "6px 14px", cursor: "pointer", color: text, fontSize: 16,
              }}>›</button>
            </div>

            {/* Day headers */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 2 }}>
              {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
                <div key={d} style={{ textAlign: "center", fontSize: 11, color: muted, fontWeight: 500, padding: "4px 0" }}>{d}</div>
              ))}
            </div>

            {/* Calendar grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
              {/* Empty cells for first week */}
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} style={{ minHeight: 72, background: surface, borderRadius: 6, opacity: 0.3 }} />
              ))}

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const dateStr = `${calYear}-${String(calMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
                const events = getDeadlinesForDay(day);
                const isToday = dateStr === today;
                const isSelected = selectedDay === dateStr;

                return (
                  <div
                    key={day}
                    onClick={() => { if (events.length > 0) setSelectedDay(isSelected ? null : dateStr); }}
                    style={{
                      minHeight: 72, background: surface, borderRadius: 6, padding: "6px 8px",
                      cursor: events.length > 0 ? "pointer" : "default",
                      border: `0.5px solid ${isSelected ? gold : border}`,
                      transition: "border-color 0.15s",
                    }}
                  >
                    <div style={{
                      fontSize: 12, fontWeight: 600, marginBottom: 4,
                      width: 22, height: 22, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      background: isToday ? gold : "transparent",
                      color: isToday ? "#fff" : text,
                    }}>{day}</div>

                    <div style={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                      {events.slice(0, 3).map((e, ei) => (
                        <div key={ei} style={{
                          width: 8, height: 8, borderRadius: "50%",
                          background: getCategoryColor(e.category),
                          flexShrink: 0,
                        }} />
                      ))}
                    </div>
                    {events.length > 3 && (
                      <div style={{ fontSize: 9, color: muted, marginTop: 2 }}>+{events.length - 3} more</div>
                    )}

                    {/* Day popover */}
                    {isSelected && events.length > 0 && (
                      <div style={{
                        position: "absolute", zIndex: 20, left: 0, right: 0, marginTop: 4,
                        background: surface, border: `0.5px solid ${gold}`,
                        borderRadius: 10, padding: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
                      }}>
                        {events.map((e, ei) => (
                          <div key={ei} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                            <div style={{ width: 8, height: 8, borderRadius: "50%", background: getCategoryColor(e.category), marginTop: 3, flexShrink: 0 }} />
                            <div>
                              <div style={{ fontSize: 12, fontWeight: 500, color: text }}>{e.title}</div>
                              {e.universityName && <div style={{ fontSize: 11, color: muted }}>{e.universityName}</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Selected day events list */}
            {selectedDay && (
              <div style={{ marginTop: 20, background: surface, border: `0.5px solid ${gold}`, borderRadius: 12, padding: "16px" }}>
                <div style={{ fontFamily: "Georgia, serif", fontSize: 15, fontWeight: 500, marginBottom: 12, color: text }}>
                  {formatDateFull(selectedDay)}
                </div>
                {getDeadlinesForDay(parseInt(selectedDay.split("-")[2])).map((e, ei) => (
                  <div key={ei} style={{ display: "flex", alignItems: "flex-start", gap: 10, paddingBottom: 10, marginBottom: 10, borderBottom: ei < getDeadlinesForDay(parseInt(selectedDay.split("-")[2])).length - 1 ? `0.5px solid ${border}` : "none" }}>
                    <div style={{ width: 8, height: 8, borderRadius: "50%", background: getCategoryColor(e.category), marginTop: 4, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 500, color: text }}>{e.title}</div>
                      {e.universityName && <div style={{ fontSize: 12, color: muted }}>{e.universityName}</div>}
                      {e.description && <div style={{ fontSize: 12, color: muted, marginTop: 4, lineHeight: 1.5 }}>{e.description}</div>}
                      {e.link && (
                        <a href={e.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: gold, textDecoration: "none", marginTop: 4, display: "inline-block" }}>
                          Register / Learn More →
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Add custom deadline */}
        <div style={{ marginTop: 32 }}>
          {!showAddCustom ? (
            <button onClick={() => setShowAddCustom(true)} style={{
              fontSize: 13, color: muted, background: "none", border: `0.5px solid ${border}`,
              borderRadius: 8, padding: "8px 16px", cursor: "pointer",
            }}>+ Add deadline</button>
          ) : (
            <div style={{ background: surface, border: `0.5px solid ${border}`, borderRadius: 12, padding: "20px" }}>
              <div style={{ fontSize: 14, fontWeight: 500, color: text, marginBottom: 14 }}>Add Custom Deadline</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <input
                  type="text"
                  placeholder="Deadline title"
                  value={customTitle}
                  onChange={e => setCustomTitle(e.target.value)}
                  style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                />
                <input
                  type="date"
                  value={customDate}
                  onChange={e => setCustomDate(e.target.value)}
                  style={{ ...inputStyle, width: "100%", boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    onClick={handleAddCustom}
                    disabled={!customTitle.trim() || !customDate}
                    style={{
                      padding: "8px 20px", background: gold, color: "#fff",
                      border: "none", borderRadius: 8, fontSize: 13, cursor: "pointer",
                      opacity: !customTitle.trim() || !customDate ? 0.5 : 1,
                    }}
                  >Save</button>
                  <button onClick={() => setShowAddCustom(false)} style={{
                    padding: "8px 20px", background: "none", border: `0.5px solid ${border}`,
                    borderRadius: 8, fontSize: 13, cursor: "pointer", color: muted,
                  }}>Cancel</button>
                </div>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
