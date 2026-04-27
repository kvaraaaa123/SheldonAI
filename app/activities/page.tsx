"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

type Phase = "major" | "input" | "results" | null;

type Activity = {
  activity_type: string;
  position: string;
  organization: string;
  description: string;
  grade_9: boolean;
  grade_10: boolean;
  grade_11: boolean;
  grade_12: boolean;
  grade_pg: boolean;
  timing_school_year: boolean;
  timing_school_break: boolean;
  timing_all_year: boolean;
  hours_per_week: string;
  weeks_per_year: string;
  continue_in_college: string;
};

type ActivityResult = {
  originalDescription: string;
  rewrittenDescription: string;
  overuseVerdict: string;
  descriptionScore: number;
  missingInfo: string;
  grade: "strong" | "needs_work" | "weak";
  essayPotential: "strong" | "weak" | "conditional";
  essayVerdict: string;
};

type GradeResults = {
  overallFeedback: string;
  packagingVerdict: string;
  orderingSuggestions: string;
  humanityCheck: string;
  activities: ActivityResult[];
};

type SavedGrade = {
  id: string;
  user_id: string;
  intended_majors: string[];
  activities: Activity[];
  results: GradeResults;
  created_at: string;
};

// ─── Constants ────────────────────────────────────────────────────────────────

const EMPTY_ACTIVITY: Activity = {
  activity_type: "", position: "", organization: "", description: "",
  grade_9: false, grade_10: false, grade_11: false, grade_12: false, grade_pg: false,
  timing_school_year: false, timing_school_break: false, timing_all_year: false,
  hours_per_week: "", weeks_per_year: "", continue_in_college: "",
};

const ACTIVITY_TYPES = [
  "Academic", "Art", "Athletics: Club", "Athletics: JV/Varsity", "Career-Oriented",
  "Community Service (Volunteer)", "Computer/Technology", "Cultural", "Dance",
  "Debate/Speech", "Environmental", "Family Responsibilities", "Foreign Language",
  "Internship", "Journalism/Publication", "Junior R.O.T.C.", "LGBT",
  "Music: Instrumental", "Music: Vocal", "Religious", "Research", "Robotics",
  "School Spirit", "Social Justice", "Student Govt./Politics", "Theatre/Drama",
  "Work (Paid)", "Other Club/Activity",
];

const MAJORS = [
  "Pre-Law", "Pre-Medicine / Pre-Health", "Political Science / Government",
  "International Relations", "Economics / Finance", "Business / Entrepreneurship",
  "Computer Science", "Engineering", "Mathematics / Statistics",
  "Biology / Life Sciences", "Chemistry / Physics", "Environmental Science",
  "Psychology / Neuroscience", "Sociology / Anthropology", "History", "Philosophy",
  "Literature / Creative Writing", "Journalism / Media", "Architecture",
  "Art / Design", "Film / Theatre / Performing Arts", "Education",
  "Social Work / Public Policy", "Foreign Languages", "Religious Studies", "Undecided",
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function ActivitiesPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  const bg      = isDark ? "#080810"                : "#FAFAF5";
  const surface = isDark ? "#0f0f1a"                : "#ffffff";
  const border  = isDark ? "rgba(255,255,255,0.09)" : "rgba(0,0,0,0.09)";
  const text    = isDark ? "#FAFAF5"                : "#0a0a12";
  const muted   = isDark ? "rgba(250,250,245,0.5)"  : "rgba(10,10,18,0.5)";
  const gold    = isDark ? "#C9A96E"                : "#9a7040";
  const navBg   = isDark ? "rgba(8,8,16,0.95)"      : "rgba(250,250,245,0.95)";

  // ── State ──────────────────────────────────────────────────────────────────
  const [phase,          setPhase]          = useState<Phase>(null);
  const [userEmail,      setUserEmail]      = useState("");
  const [profile,        setProfile]        = useState<Record<string, unknown> | null>(null);
  const [selectedMajors, setSelectedMajors] = useState<string[]>([]);
  const [activities,     setActivities]     = useState<Activity[]>([
    { ...EMPTY_ACTIVITY }, { ...EMPTY_ACTIVITY }, { ...EMPTY_ACTIVITY },
  ]);
  const [expandedCards,  setExpandedCards]  = useState<boolean[]>([true, true, true]);
  const [gradeResults,   setGradeResults]   = useState<GradeResults | null>(null);
  const [isGrading,      setIsGrading]      = useState(false);
  const [savedGrade,     setSavedGrade]     = useState<SavedGrade | null>(null);
  const [isUploading,    setIsUploading]    = useState(false);
  const [uploadedFiles,  setUploadedFiles]  = useState<{name: string; base64: string}[]>([]);
  const [dragOver,       setDragOver]       = useState(false);
  const [copiedIndex,    setCopiedIndex]    = useState<number | null>(null);
  const [hasDefiningActivity, setHasDefiningActivity] = useState<boolean | null>(null);
  const [definingActivity,    setDefiningActivity]    = useState("");
  const [hoursWarning,   setHoursWarning]   = useState<{ totalHours: number; flagged: string[] } | null>(null);

  const fileInputRef  = useRef<HTMLInputElement>(null);
  const userIdRef     = useRef<string>("");

  // ── Mount ──────────────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) { router.push("/"); return; }

        const uid = session.user.id;
        userIdRef.current = uid;
        setUserEmail(session.user.email ?? "");

        const { data: profileData } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", uid)
          .maybeSingle();
        if (profileData) setProfile(profileData);

        const { data: gradeData } = await supabase
          .from("activity_grades")
          .select("*")
          .eq("user_id", uid)
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        console.log("Activity grade fetch:", gradeData);

        if (gradeData && gradeData.results) {
          setSelectedMajors(gradeData.intended_majors || []);
          if (gradeData.activities?.length) {
            setActivities(gradeData.activities);
            setExpandedCards(gradeData.activities.map((_: Activity, i: number) => i === 0));
          }
          setGradeResults(gradeData.results);
          setSavedGrade(gradeData as SavedGrade);
          setPhase("results");
        } else {
          setPhase("major");
        }
      } catch (err) {
        console.error("Activities mount error:", err);
        setPhase("major");
      }
    };
    load();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Handlers ───────────────────────────────────────────────────────────────
  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  function toggleMajor(major: string) {
    if (major === "Undecided") {
      setSelectedMajors(prev => prev.includes("Undecided") ? [] : ["Undecided"]);
      return;
    }
    setSelectedMajors(prev => {
      const without = prev.filter(m => m !== "Undecided");
      return without.includes(major) ? without.filter(m => m !== major) : [...without, major];
    });
  }

  function updateActivity(index: number, key: keyof Activity, value: string | boolean) {
    setActivities(prev => prev.map((a, i) => i === index ? { ...a, [key]: value } : a));
  }

  function toggleCard(index: number) {
    setExpandedCards(prev => prev.map((e, i) => i === index ? !e : e));
  }

  function addActivity() {
    if (activities.length >= 10) return;
    setActivities(prev => [...prev, { ...EMPTY_ACTIVITY }]);
    setExpandedCards(prev => [...prev, true]);
  }

  async function toBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => resolve((e.target?.result as string).split(",")[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function addFiles(fileList: FileList | File[]) {
    const pdfs = Array.from(fileList).filter(f => f.type === "application/pdf");
    if (pdfs.length === 0) return;
    const converted = await Promise.all(pdfs.map(async f => ({ name: f.name, base64: await toBase64(f) })));
    setUploadedFiles(prev => [...prev, ...converted]);
  }

  async function parseFiles() {
    if (uploadedFiles.length === 0) return;
    setIsUploading(true);
    try {
      const res = await fetch("/api/parse-common-app", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ files: uploadedFiles, mode: "activities" }),
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.activities) && data.activities.length > 0) {
        const mapped: Activity[] = data.activities.slice(0, 10).map((a: Record<string, unknown>) => ({
          activity_type: String(a.activity_type || ""),
          position:      String(a.position || ""),
          organization:  String(a.organization || ""),
          description:   String(a.description || ""),
          grade_9:  Array.isArray(a.grade_levels) && (a.grade_levels as string[]).includes("9"),
          grade_10: Array.isArray(a.grade_levels) && (a.grade_levels as string[]).includes("10"),
          grade_11: Array.isArray(a.grade_levels) && (a.grade_levels as string[]).includes("11"),
          grade_12: Array.isArray(a.grade_levels) && (a.grade_levels as string[]).includes("12"),
          grade_pg: Array.isArray(a.grade_levels) && (a.grade_levels as string[]).includes("Post-graduate"),
          timing_school_year:  Array.isArray(a.timing) && (a.timing as string[]).some((t: string) => t.toLowerCase().includes("school year")),
          timing_school_break: Array.isArray(a.timing) && (a.timing as string[]).some((t: string) => t.toLowerCase().includes("break")),
          timing_all_year:     Array.isArray(a.timing) && (a.timing as string[]).some((t: string) => t.toLowerCase().includes("all year")),
          hours_per_week:  a.hours_per_week  != null ? String(a.hours_per_week)  : "",
          weeks_per_year:  a.weeks_per_year  != null ? String(a.weeks_per_year)  : "",
          continue_in_college: a.continue_in_college === true ? "Yes" : a.continue_in_college === false ? "No" : "",
        }));
        setActivities(mapped);
        setExpandedCards(mapped.map((_, i) => i === 0));
      }
    } finally {
      setIsUploading(false);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const saveGrades = async (gradedData: any) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const uid = session?.user?.id;
      if (!uid) { console.error("No uid for save"); return; }

      const { error: deleteError } = await supabase
        .from("activity_grades")
        .delete()
        .eq("user_id", uid);

      console.log("Delete error:", deleteError);

      const { error: insertError } = await supabase
        .from("activity_grades")
        .insert({
          user_id: uid,
          intended_majors: selectedMajors,
          activities: activities,
          results: gradedData,
        });

      console.log("Insert error:", insertError);

      if (insertError) {
        console.error("Error saving grades:", insertError.message);
      }
    } catch (err) {
      console.error("Save error:", err);
    }
  };

  async function gradeActivities() {
    const filled = activities.filter(a => !!a.activity_type);
    if (filled.length === 0) return;

    // Hours realism check
    const totalHours = filled.reduce((sum, a) => sum + (parseFloat(a.hours_per_week) || 0), 0);
    const flagged = filled
      .filter(a => (parseFloat(a.hours_per_week) || 0) > 25)
      .map(a => `${a.activity_type || "Activity"} (${a.hours_per_week}h/week)`);
    const warning = totalHours > 50 ? { totalHours, flagged } : null;
    setHoursWarning(warning);

    setIsGrading(true);
    setGradeResults(null);
    setPhase("results");
    try {
      const res = await fetch("/api/grade-activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          activities: filled,
          intendedMajors: selectedMajors,
          profile,
          hasDefiningActivity: hasDefiningActivity === true,
          definingActivityDescription: definingActivity,
          hoursWarning: warning,
        }),
      });
      if (!res.ok) return;
      const data: GradeResults = await res.json();
      await saveGrades(data);
      setGradeResults(data);
    } finally {
      setIsGrading(false);
    }
  }

  async function copyToClipboard(txt: string, index: number) {
    await navigator.clipboard.writeText(txt);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  }

  function downloadActivities() {
    const filled = activities.filter(a => !!a.activity_type);
    if (!gradeResults) return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head><title>Revised Activities List</title>
<style>
  body { font-family: Georgia, serif; max-width: 700px; margin: 48px auto; padding: 0 24px; color: #111; line-height: 1.6; }
  h1 { font-size: 22px; font-weight: 500; margin-bottom: 8px; }
  .subtitle { color: #666; font-size: 13px; margin-bottom: 32px; }
  .activity { margin-bottom: 24px; padding-bottom: 20px; border-bottom: 1px solid #eee; }
  .activity:last-child { border-bottom: none; }
  .num { font-size: 11px; font-weight: 600; color: #999; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 4px; }
  .type { font-size: 13px; font-weight: 600; color: #555; margin-bottom: 2px; }
  .role { font-size: 13px; color: #555; margin-bottom: 8px; }
  .desc { font-size: 14px; color: #111; }
</style>
</head><body>
<h1>Revised Activities List</h1>
<div class="subtitle">Generated by SheldonAI — rewritten descriptions</div>`);
    gradeResults.activities.forEach((result, i) => {
      const act = filled[i];
      if (!act) return;
      win.document.write(`<div class="activity">
  <div class="num">Activity ${i + 1}</div>
  <div class="type">${act.activity_type}</div>
  <div class="role">${[act.position, act.organization].filter(Boolean).join(" · ")}</div>
  <div class="desc">${result.rewrittenDescription}</div>
</div>`);
    });
    win.document.write("</body></html>");
    win.document.close();
    win.print();
  }

  // ── Styles ─────────────────────────────────────────────────────────────────
  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", fontSize: 13,
    fontFamily: "system-ui, -apple-system, sans-serif",
    borderStyle: "solid", borderWidth: "0.5px", borderColor: border,
    borderRadius: 8, backgroundColor: surface, color: text,
    outline: "none", boxSizing: "border-box",
  };
  const selectStyle: React.CSSProperties = {
    ...inputStyle, cursor: "pointer",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath fill='none' stroke='%23888' stroke-width='1.5' d='M1 1l5 5 5-5'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat", backgroundPosition: "right 12px center",
    paddingRight: 32, WebkitAppearance: "none", appearance: "none",
  };
  const labelStyle: React.CSSProperties = {
    fontSize: 11, fontWeight: 600, textTransform: "uppercase" as const,
    letterSpacing: "0.08em", color: muted, marginBottom: 6,
    fontFamily: "system-ui, -apple-system, sans-serif",
  };
  const cbStyle: React.CSSProperties = { accentColor: gold, width: 13, height: 13, cursor: "pointer" };

  // ── Sub-components ─────────────────────────────────────────────────────────
  function GradeBadge({ grade }: { grade: string }) {
    const cfgs: Record<string, { bg: string; color: string; label: string }> = {
      strong:     { bg: isDark ? "rgba(34,197,94,0.18)"   : "rgba(22,163,74,0.12)",  color: isDark ? "#4ade80" : "#15803d", label: "Strong" },
      needs_work: { bg: isDark ? "rgba(251,191,36,0.18)"  : "rgba(217,119,6,0.12)",  color: isDark ? "#fbbf24" : "#92400e", label: "Needs Work" },
      weak:       { bg: isDark ? "rgba(248,113,113,0.18)" : "rgba(220,38,38,0.12)",  color: isDark ? "#f87171" : "#b91c1c", label: "Weak" },
    };
    const cfg = cfgs[grade] ?? cfgs.needs_work;
    return (
      <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, backgroundColor: cfg.bg, color: cfg.color, fontFamily: "system-ui, -apple-system, sans-serif", letterSpacing: "0.04em" }}>
        {cfg.label}
      </span>
    );
  }

  function EssayBadge({ potential }: { potential: string }) {
    if (potential === "strong") return (
      <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, backgroundColor: isDark ? "rgba(34,197,94,0.18)" : "rgba(22,163,74,0.12)", color: isDark ? "#4ade80" : "#15803d", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        Strong essay topic
      </span>
    );
    if (potential === "weak") return (
      <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, backgroundColor: isDark ? "rgba(248,113,113,0.18)" : "rgba(220,38,38,0.12)", color: isDark ? "#f87171" : "#b91c1c", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        Weak essay topic — find a different story
      </span>
    );
    return (
      <span style={{ fontSize: 10, fontWeight: 600, padding: "3px 8px", borderRadius: 4, backgroundColor: isDark ? "rgba(251,191,36,0.18)" : "rgba(217,119,6,0.12)", color: isDark ? "#fbbf24" : "#92400e", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        Conditional
      </span>
    );
  }

  function ScoreDots({ score }: { score: number }) {
    return (
      <div style={{ display: "flex", gap: 3, alignItems: "center" }}>
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: i < score ? gold : (isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.1)") }} />
        ))}
        <span style={{ fontSize: 11, color: muted, marginLeft: 4, fontFamily: "system-ui, -apple-system, sans-serif" }}>{score}/10</span>
      </div>
    );
  }

  function renderActivityCard(act: Activity, index: number) {
    const isExpanded = expandedCards[index] ?? true;
    return (
      <div key={index} style={{
        border: isExpanded ? "1px solid rgba(154,112,64,0.3)" : "1px solid rgba(0,0,0,0.08)",
        borderRadius: 12, marginBottom: 10, overflow: "hidden",
        backgroundColor: "#fff",
        boxShadow: isExpanded ? "0 4px 16px rgba(154,112,64,0.08)" : "none",
        transition: "border-color 0.2s, box-shadow 0.2s",
      }}>
        <div onClick={() => toggleCard(index)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", cursor: "pointer", backgroundColor: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: gold, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", fontFamily: "system-ui, -apple-system, sans-serif" }}>{index + 1}</span>
            </div>
            <div style={{ fontSize: 13, fontWeight: 600, color: act.activity_type ? text : muted, fontFamily: "system-ui, -apple-system, sans-serif" }}>
              {act.activity_type ? act.activity_type : `Activity ${index + 1}`}
            </div>
          </div>
          <div style={{ color: gold, fontSize: 11, fontWeight: 600 }}>{isExpanded ? "▲" : "▼"}</div>
        </div>
        {isExpanded && (
          <div style={{ padding: "0 20px 18px", backgroundColor: "#fff", borderTop: "1px solid rgba(154,112,64,0.15)", display: "flex", flexDirection: "column", gap: 13 }}>
            <div style={{ paddingTop: 13 }}>
              <div style={labelStyle}>Activity type</div>
              <select style={selectStyle} value={act.activity_type} onChange={e => updateActivity(index, "activity_type", e.target.value)}>
                <option value="">Select type…</option>
                {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <div style={labelStyle}>Position / Leadership description</div>
              <input style={inputStyle} type="text" maxLength={50} placeholder="e.g. Team Captain, Club President"
                value={act.position} onChange={e => updateActivity(index, "position", e.target.value)} />
              <div style={{ textAlign: "right", fontSize: 11, color: muted, marginTop: 3, fontFamily: "system-ui, -apple-system, sans-serif" }}>{act.position.length}/50</div>
            </div>
            <div>
              <div style={labelStyle}>Organization name</div>
              <input style={inputStyle} type="text" maxLength={100} placeholder="e.g. Lincoln High School Debate Team"
                value={act.organization} onChange={e => updateActivity(index, "organization", e.target.value)} />
              <div style={{ textAlign: "right", fontSize: 11, color: muted, marginTop: 3, fontFamily: "system-ui, -apple-system, sans-serif" }}>{act.organization.length}/100</div>
            </div>
            <div>
              <div style={labelStyle}>Describe what you did — be specific, use numbers, use semicolons</div>
              <textarea style={{ ...inputStyle, resize: "vertical" as const, minHeight: 70, lineHeight: "1.5" }} maxLength={150}
                placeholder="Led 30-person team; raised $4,200 for local shelter; organized 3 fundraising events per semester"
                value={act.description} onChange={e => updateActivity(index, "description", e.target.value)} />
              <div style={{ textAlign: "right", fontSize: 11, color: muted, marginTop: 3, fontFamily: "system-ui, -apple-system, sans-serif" }}>{act.description.length}/150</div>
            </div>
            <div>
              <div style={labelStyle}>Grade levels</div>
              <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
                {([["grade_9","9"],["grade_10","10"],["grade_11","11"],["grade_12","12"],["grade_pg","Post-grad"]] as [keyof Activity, string][]).map(([key, lbl]) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: 5, cursor: "pointer", fontSize: 13, color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    <input type="checkbox" style={cbStyle} checked={act[key] as boolean} onChange={e => updateActivity(index, key, e.target.checked)} />
                    {lbl}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <div style={labelStyle}>Timing</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {([["timing_school_year","During school year"],["timing_school_break","During school break"],["timing_all_year","All year"]] as [keyof Activity, string][]).map(([key, lbl]) => (
                  <label key={key} style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: 13, color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    <input type="checkbox" style={cbStyle} checked={act[key] as boolean} onChange={e => updateActivity(index, key, e.target.checked)} />
                    {lbl}
                  </label>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", gap: 14 }}>
              <div>
                <div style={labelStyle}>Hours / week</div>
                <input style={{ ...inputStyle, width: 80 }} type="number" min={0} max={168} placeholder="5"
                  value={act.hours_per_week} onChange={e => updateActivity(index, "hours_per_week", e.target.value)} />
              </div>
              <div>
                <div style={labelStyle}>Weeks / year</div>
                <input style={{ ...inputStyle, width: 80 }} type="number" min={0} max={52} placeholder="36"
                  value={act.weeks_per_year} onChange={e => updateActivity(index, "weeks_per_year", e.target.value)} />
              </div>
            </div>
            <div>
              <div style={labelStyle}>Continue in college?</div>
              <div style={{ display: "flex", gap: 8 }}>
                {["Yes", "No"].map(opt => (
                  <button key={opt} type="button"
                    onClick={() => updateActivity(index, "continue_in_college", act.continue_in_college === opt ? "" : opt)}
                    style={{
                      padding: "6px 18px", fontSize: 13, borderRadius: 999, borderStyle: "solid", borderWidth: "0.5px",
                      borderColor: act.continue_in_college === opt ? gold : (isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.25)"),
                      backgroundColor: act.continue_in_college === opt ? (isDark ? "rgba(201,169,110,0.12)" : "rgba(154,112,64,0.10)") : "transparent",
                      color: act.continue_in_college === opt ? gold : text,
                      cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif",
                      WebkitAppearance: "none", appearance: "none",
                    }}>
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  const filledActivities = activities.filter(a => !!a.activity_type);

  // ── Nav ────────────────────────────────────────────────────────────────────
  const nav = (
    <nav style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 28px", borderBottom: `0.5px solid ${border}`, background: navBg, backdropFilter: "blur(12px)", position: "sticky", top: 0, zIndex: 50 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 500, textDecoration: "none", color: text, letterSpacing: "-0.02em" }}>
          Sheldon<span style={{ color: gold }}>AI</span>
        </Link>
        <a href="/dashboard" style={{ fontSize: 13, color: muted, textDecoration: "none" }}>← Dashboard</a>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <span style={{ fontSize: 12, color: muted }}>{userEmail}</span>
        <button onClick={() => router.push("/settings")} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 6 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
        </button>
        <button onClick={handleSignOut} style={{ fontSize: 12, color: muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline", fontFamily: "system-ui, -apple-system, sans-serif" }}>Sign out</button>
        <button onClick={toggleTheme} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", border: `0.5px solid ${border}`, background: "none", cursor: "pointer", color: muted, fontSize: 15 }}>
          {isDark ? "☀" : "☽"}
        </button>
      </div>
    </nav>
  );

  // ── Loading ────────────────────────────────────────────────────────────────
  if (phase === null) {
    return (
      <div style={{ minHeight: "100vh", background: bg, color: text, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "system-ui, -apple-system, sans-serif" }}>
        <span style={{ fontSize: 15, color: gold }}>Loading...</span>
      </div>
    );
  }

  // ── Phase 1 ────────────────────────────────────────────────────────────────
  if (phase === "major") {
    return (
      <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {nav}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 57px)", padding: "48px 24px" }}>
          <div style={{ maxWidth: 600, width: "100%" }}>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 500, color: text, marginBottom: 10, marginTop: 0, textAlign: "center", letterSpacing: "-0.3px" }}>
              What are you planning to study?
            </h1>
            <p style={{ fontSize: 14, color: muted, textAlign: "center", marginBottom: 32, marginTop: 0, lineHeight: "1.6", fontFamily: "system-ui, -apple-system, sans-serif" }}>
              This helps us understand your goals — you can always change your mind
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginBottom: 36 }}>
              {MAJORS.map(major => {
                const isUndecided = major === "Undecided";
                const isSelected  = selectedMajors.includes(major);
                if (isUndecided) return (
                  <button key={major} type="button" onClick={() => toggleMajor(major)}
                    style={{ padding: "9px 22px", fontSize: 14, borderRadius: 999, cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 500, border: `1px solid ${gold}`, backgroundColor: isSelected ? gold : "transparent", color: isSelected ? (isDark ? "#080810" : "#FAFAF5") : gold, transition: "all 0.15s", WebkitAppearance: "none", appearance: "none" }}>
                    I have no idea yet 🤷
                  </button>
                );
                return (
                  <button key={major} type="button" onClick={() => toggleMajor(major)}
                    style={{ padding: "8px 18px", fontSize: 13, borderRadius: 999, cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 400, borderStyle: "solid", borderWidth: "0.5px", borderColor: isSelected ? gold : (isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.25)"), backgroundColor: isSelected ? (isDark ? "rgba(201,169,110,0.10)" : "rgba(154,112,64,0.10)") : "transparent", color: isSelected ? gold : text, transition: "all 0.15s", WebkitAppearance: "none", appearance: "none" }}>
                    {major}
                  </button>
                );
              })}
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <button type="button" disabled={selectedMajors.length === 0} onClick={() => setPhase("input")}
                style={{ width: "100%", maxWidth: 400, padding: "13px 0", fontSize: 15, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 500, borderRadius: 10, border: `1px solid ${gold}`, color: isDark ? "#080810" : "#FAFAF5", backgroundColor: gold, cursor: selectedMajors.length === 0 ? "not-allowed" : "pointer", opacity: selectedMajors.length === 0 ? 0.35 : 1, WebkitAppearance: "none", appearance: "none", transition: "opacity 0.15s" }}>
                Continue →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Phase 2 ────────────────────────────────────────────────────────────────
  if (phase === "input") {
    const hasActivities = activities.some(a => !!a.activity_type);
    return (
      <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
        {nav}
        <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px 80px" }}>
          <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>

            {/* Left column */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Upload zone */}
              <div style={{ marginBottom: 28 }}>
                <div
                  onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
                  style={{
                    border: `2px dashed ${dragOver ? gold : "rgba(154,112,64,0.4)"}`,
                    borderRadius: 14, padding: "36px 24px", textAlign: "center",
                    background: dragOver
                      ? (isDark ? "rgba(201,169,110,0.07)" : "rgba(154,112,64,0.06)")
                      : (isDark ? "linear-gradient(135deg, rgba(154,112,64,0.06) 0%, rgba(154,112,64,0.02) 100%)" : "linear-gradient(135deg, rgba(154,112,64,0.04) 0%, rgba(154,112,64,0.01) 100%)"),
                    transition: "border-color 0.2s, background 0.2s",
                    marginBottom: 10,
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
                    <div style={{ width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                        <polyline points="17 8 12 3 7 8"/>
                        <line x1="12" y1="3" x2="12" y2="15"/>
                      </svg>
                    </div>
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 600, color: text, marginBottom: 6, fontFamily: "system-ui, -apple-system, sans-serif" }}>Upload your Common App Activities PDF</div>
                  <div style={{ fontSize: 13, color: muted, marginBottom: 20, fontFamily: "system-ui, -apple-system, sans-serif" }}>Drop your PDF here or click to browse — we&apos;ll fill everything in automatically</div>
                  <button type="button" onClick={() => fileInputRef.current?.click()}
                    style={{ fontSize: 13, color: isDark ? "#080810" : "#FAFAF5", backgroundColor: gold, border: "none", borderRadius: 8, padding: "9px 22px", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 600, WebkitAppearance: "none", appearance: "none" }}>
                    Browse files
                  </button>
                  <input ref={fileInputRef} type="file" accept="application/pdf" multiple style={{ display: "none" }}
                    onChange={e => { if (e.target.files) { addFiles(e.target.files); e.target.value = ""; } }} />
                </div>
                {uploadedFiles.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {uploadedFiles.map((f, i) => (
                      <div key={i} style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 6px 3px 10px", border: `0.5px solid ${border}`, borderRadius: 999, fontSize: 11, color: text, fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}>
                        <span style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{f.name}</span>
                        <button type="button" onClick={() => setUploadedFiles(prev => prev.filter((_, j) => j !== i))} style={{ background: "none", border: "none", cursor: "pointer", color: muted, fontSize: 15, lineHeight: "1", padding: "0 2px", display: "flex", alignItems: "center", WebkitAppearance: "none", appearance: "none" }}>×</button>
                      </div>
                    ))}
                  </div>
                )}
                {uploadedFiles.length > 0 && (
                  <button type="button" onClick={parseFiles} disabled={isUploading}
                    style={{ fontSize: 13, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 500, color: isDark ? "#080810" : "#FAFAF5", backgroundColor: gold, border: "none", borderRadius: 8, padding: "9px 20px", cursor: isUploading ? "not-allowed" : "pointer", opacity: isUploading ? 0.7 : 1, WebkitAppearance: "none", appearance: "none" }}>
                    {isUploading ? "Analyzing…" : "Analyze & Fill →"}
                  </button>
                )}
                <div style={{ marginTop: 14 }}>
                  <button type="button" onClick={() => document.getElementById("activity-form-section")?.scrollIntoView({ behavior: "smooth" })}
                    style={{ fontSize: 13, color: gold, backgroundColor: "transparent", border: "none", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", textDecoration: "underline", textUnderlineOffset: "2px", padding: 0 }}>
                    Skip — fill manually →
                  </button>
                </div>
              </div>

              {/* Activity form */}
              <div id="activity-form-section">
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: muted, marginBottom: 3, fontFamily: "system-ui, -apple-system, sans-serif" }}>Your activities</div>
                <div style={{ fontSize: 12, color: muted, marginBottom: 14, fontFamily: "system-ui, -apple-system, sans-serif" }}>List in order of importance — most impressive first</div>
                {activities.map((act, i) => renderActivityCard(act, i))}
                {activities.length < 10 && (
                  <div style={{ display: "flex", justifyContent: "center", margin: "10px 0 20px" }}>
                    <button type="button" onClick={addActivity}
                      style={{ width: 36, height: 36, borderRadius: "50%", border: `1.5px solid ${gold}`, backgroundColor: "transparent", color: gold, fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", WebkitAppearance: "none", appearance: "none" }}>
                      +
                    </button>
                  </div>
                )}
                {/* One more thing */}
                <div style={{ margin: "24px 0", padding: "20px 0", borderTop: `0.5px solid ${border}` }}>
                  <div style={{ fontSize: 16, fontWeight: 500, color: text, marginBottom: 6, fontFamily: "system-ui, -apple-system, sans-serif" }}>One more thing</div>
                  <div style={{ fontSize: 13, color: muted, marginBottom: 18, fontFamily: "system-ui, -apple-system, sans-serif" }}>This helps SheldonAI give you much smarter essay recommendations.</div>
                  <div style={{ fontSize: 14, color: text, marginBottom: 14, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: 1.6 }}>
                    Was any activity on this list especially defining — something that fundamentally shaped your character, your leadership, or your story as an applicant?
                  </div>
                  <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                    {[{ val: true, label: "Yes, one stands out" }, { val: false, label: "No, they are all roughly equal importance" }].map(({ val, label }) => (
                      <button key={label} type="button" onClick={() => setHasDefiningActivity(val)}
                        style={{
                          padding: "8px 18px", fontSize: 13, borderRadius: 999, cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif",
                          borderStyle: "solid", borderWidth: "0.5px",
                          borderColor: hasDefiningActivity === val ? gold : (isDark ? "rgba(255,255,255,0.28)" : "rgba(0,0,0,0.25)"),
                          backgroundColor: hasDefiningActivity === val ? (isDark ? "rgba(201,169,110,0.12)" : "rgba(154,112,64,0.10)") : "transparent",
                          color: hasDefiningActivity === val ? gold : text,
                          WebkitAppearance: "none", appearance: "none",
                        }}>
                        {label}
                      </button>
                    ))}
                  </div>
                  {hasDefiningActivity === true && (
                    <div>
                      <div style={labelStyle}>Briefly describe why this activity was especially important to you as an applicant (2-3 sentences is enough)</div>
                      <textarea
                        style={{ ...inputStyle, resize: "vertical" as const, minHeight: 70, lineHeight: "1.5" }}
                        maxLength={400}
                        placeholder="e.g. My internship at the President's administration was where I first understood what it means to hold real responsibility — it changed how I think about leadership and public service."
                        rows={3}
                        value={definingActivity}
                        onChange={e => setDefiningActivity(e.target.value)}
                      />
                      <div style={{ textAlign: "right", fontSize: 11, color: muted, marginTop: 3, fontFamily: "system-ui, -apple-system, sans-serif" }}>{definingActivity.length}/400</div>
                      <div style={{ background: "rgba(154,112,64,0.04)", border: "0.5px solid rgba(154,112,64,0.2)", borderRadius: 8, padding: "12px 14px", marginTop: 10 }}>
                        <p style={{ fontSize: 12, color: muted, lineHeight: 1.65, margin: 0, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                          SheldonAI uses this to evaluate whether this activity is extraordinary enough to anchor a personal statement or supplemental essay. Most activities are not — and that is perfectly fine. The goal is for your essays to reveal something your activities list cannot show, giving admissions officers a fuller picture of who you are.
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <button type="button" onClick={gradeActivities} disabled={!hasActivities}
                  style={{ width: "100%", maxWidth: 500, display: "block", padding: "14px 0", fontSize: 15, fontFamily: "system-ui, -apple-system, sans-serif", fontWeight: 500, borderRadius: 10, border: `1px solid ${gold}`, color: isDark ? "#080810" : "#FAFAF5", backgroundColor: gold, cursor: !hasActivities ? "not-allowed" : "pointer", opacity: !hasActivities ? 0.35 : 1, WebkitAppearance: "none", appearance: "none", transition: "opacity 0.15s" }}>
                  Analyze My Activities →
                </button>
              </div>
            </div>

            {/* Right column */}
            <div style={{ width: 240, flexShrink: 0, position: "sticky", top: 80 }}>
              <div style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #0a0a12 100%)", border: "0.5px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "14px" }}>
                <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(250,250,245,0.45)", marginBottom: 12, fontFamily: "system-ui, -apple-system, sans-serif" }}>How to write great descriptions</div>
                <div style={{ fontSize: 12, color: "rgba(250,250,245,0.65)", lineHeight: "1.7", fontFamily: "system-ui, -apple-system, sans-serif", display: "flex", flexDirection: "column", gap: 8 }}>
                  <div>✦ Use semicolons to separate points — pack maximum info in minimum characters</div>
                  <div>✦ Describe exactly what you DID, not just your title</div>
                  <div>✦ Include numbers — how many people, how much money, what rank</div>
                  <div>✦ Most impressive activity goes first</div>
                  <div>✦ Fill all 10 slots if you can — every slot is an opportunity</div>
                  <div>✦ 3–4 activities should show genuine leadership</div>
                  <div>✦ Your list should tell a coherent story about who you are</div>
                </div>
                {selectedMajors.length > 0 && (
                  <div style={{ marginTop: 18 }}>
                    <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: "rgba(250,250,245,0.35)", marginBottom: 8, fontFamily: "system-ui, -apple-system, sans-serif" }}>Grading for</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                      {selectedMajors.map(m => (
                        <span key={m} style={{ fontSize: 11, padding: "3px 9px", borderRadius: 999, border: "0.5px solid rgba(201,169,110,0.4)", color: "#C9A96E", backgroundColor: "rgba(201,169,110,0.08)", fontFamily: "system-ui, -apple-system, sans-serif" }}>
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {savedGrade && (
                  <div style={{ marginTop: 18, paddingTop: 14, borderTop: "0.5px solid rgba(255,255,255,0.08)" }}>
                    <div style={{ fontSize: 11, color: "rgba(250,250,245,0.4)", marginBottom: 8, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      Last graded: {new Date(savedGrade.created_at).toLocaleDateString()}
                    </div>
                    <button type="button" onClick={() => setPhase("results")}
                      style={{ fontSize: 12, color: "#C9A96E", backgroundColor: "transparent", border: "0.5px solid #C9A96E", borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", WebkitAppearance: "none", appearance: "none" }}>
                      View saved results →
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Phase 3 — Results ─────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <style>{`@keyframes sheldon-pulse { 0%,100%{opacity:0.3} 50%{opacity:1} }`}</style>
      {nav}

      {isGrading ? (
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "calc(100vh - 57px)" }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 22, color: gold, marginBottom: 24 }}>Analyzing your activities...</div>
          <div style={{ display: "flex", gap: 6 }}>
            {[0, 1, 2].map(i => (
              <div key={i} style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: gold, animation: `sheldon-pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
            ))}
          </div>
        </div>
      ) : gradeResults ? (
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "40px 24px 80px" }}>

          {/* Overall card */}
          <div style={{ border: `1.5px solid ${isDark ? "rgba(201,169,110,0.5)" : "rgba(154,112,64,0.4)"}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20, backgroundColor: isDark ? "rgba(201,169,110,0.03)" : "rgba(154,112,64,0.02)" }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 500, color: text, marginBottom: 20 }}>Your Application Package Analysis</div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: gold, marginBottom: 6, fontFamily: "system-ui, -apple-system, sans-serif" }}>Packaging Verdict</div>
              <p style={{ fontSize: 14, fontFamily: "Georgia, serif", lineHeight: "1.8", color: text, margin: 0 }}>{gradeResults.packagingVerdict}</p>
            </div>
            <hr style={{ border: "none", borderTop: `0.5px solid ${border}`, margin: "14px 0" }} />
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: gold, marginBottom: 6, fontFamily: "system-ui, -apple-system, sans-serif" }}>Story Coherence</div>
              <p style={{ fontSize: 14, fontFamily: "Georgia, serif", lineHeight: "1.8", color: text, margin: 0 }}>{gradeResults.overallFeedback}</p>
            </div>
            {gradeResults.humanityCheck && (
              <>
                <hr style={{ border: "none", borderTop: `0.5px solid ${border}`, margin: "14px 0" }} />
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: gold, marginBottom: 6, fontFamily: "system-ui, -apple-system, sans-serif" }}>Humanizing Your Application</div>
                  <p style={{ fontSize: 14, fontFamily: "Georgia, serif", lineHeight: "1.8", color: text, margin: 0 }}>{gradeResults.humanityCheck}</p>
                </div>
              </>
            )}
            <hr style={{ border: "none", borderTop: `0.5px solid ${border}`, margin: "14px 0" }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" as const, color: gold, marginBottom: 6, fontFamily: "system-ui, -apple-system, sans-serif" }}>Ordering</div>
              <p style={{ fontSize: 14, fontFamily: "Georgia, serif", lineHeight: "1.8", color: text, margin: 0 }}>{gradeResults.orderingSuggestions}</p>
            </div>
          </div>

          {/* Download button */}
          <div style={{ marginBottom: 24 }}>
            <button type="button" onClick={downloadActivities}
              style={{ fontSize: 13, color: gold, backgroundColor: "transparent", border: `0.5px solid ${gold}`, borderRadius: 8, padding: "8px 18px", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", WebkitAppearance: "none", appearance: "none" }}>
              Download Revised Activities List ↓
            </button>
          </div>

          {/* Hours warning card */}
          {hoursWarning && (
            <div style={{ border: `1.5px solid ${isDark ? "rgba(251,191,36,0.5)" : "rgba(217,119,6,0.5)"}`, borderRadius: 12, padding: "20px 24px", marginBottom: 20, backgroundColor: isDark ? "rgba(251,191,36,0.06)" : "rgba(251,191,36,0.08)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                <span style={{ fontSize: 18 }}>⚠</span>
                <div style={{ fontSize: 15, fontWeight: 600, color: isDark ? "#fbbf24" : "#92400e", fontFamily: "system-ui, -apple-system, sans-serif" }}>Hours &amp; Commitment Check</div>
              </div>
              <p style={{ fontSize: 14, color: isDark ? "#fde68a" : "#78350f", fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1.65", margin: "0 0 10px" }}>
                You&apos;re claiming <strong>{hoursWarning.totalHours}h/week</strong> of structured activities.{hoursWarning.totalHours > 60 ? " This is a CRITICAL red flag." : " This exceeds the recommended 50h/week maximum."} Admissions officers at selective schools know a student cannot sustainably do more than 50 hours/week of structured activities alongside school.
              </p>
              {hoursWarning.flagged.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isDark ? "#fbbf24" : "#92400e", marginBottom: 4, fontFamily: "system-ui, -apple-system, sans-serif", textTransform: "uppercase" as const, letterSpacing: "0.07em" }}>Activities claiming over 30h/week</div>
                  {hoursWarning.flagged.map((a, i) => (
                    <div key={i} style={{ fontSize: 13, color: isDark ? "#fde68a" : "#78350f", fontFamily: "system-ui, -apple-system, sans-serif" }}>• {a}</div>
                  ))}
                </div>
              )}
              <p style={{ fontSize: 13, color: isDark ? "#fde68a" : "#78350f", fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1.6", margin: 0 }}>
                Claiming 70+ hours/week of activities signals either dishonesty or a lack of self-awareness. Consider revising your hours to reflect realistic averages. The AI&apos;s Hours &amp; Commitment Realism section below shows the full breakdown.
              </p>
            </div>
          )}

          {/* Per-activity cards */}
          {gradeResults.activities.map((result, i) => {
            const act = filledActivities[i];
            if (!act) return null;
            return (
              <div key={i} style={{ border: `0.5px solid ${border}`, borderRadius: 12, padding: "20px 24px", marginBottom: 14, backgroundColor: surface }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    Activity {i + 1} — {act.activity_type}
                  </div>
                  <GradeBadge grade={result.grade} />
                </div>
                <div style={{ marginBottom: 12 }}><ScoreDots score={result.descriptionScore} /></div>

                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 10, fontWeight: 500, color: muted, textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: 5, fontFamily: "system-ui, -apple-system, sans-serif" }}>Your description</div>
                  <div style={{ fontSize: 12, color: muted, padding: "9px 11px", borderRadius: 6, backgroundColor: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)", lineHeight: "1.5", fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    {result.originalDescription || act.description || "(no description)"}
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 5 }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: gold, textTransform: "uppercase" as const, letterSpacing: "0.07em", fontFamily: "system-ui, -apple-system, sans-serif" }}>Suggested rewrite ✦</div>
                    <button type="button" onClick={() => copyToClipboard(result.rewrittenDescription, i)}
                      style={{ fontSize: 11, color: copiedIndex === i ? gold : muted, backgroundColor: "transparent", border: `0.5px solid ${copiedIndex === i ? gold : border}`, borderRadius: 5, padding: "3px 10px", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", WebkitAppearance: "none", appearance: "none", transition: "color 0.2s, border-color 0.2s" }}>
                      {copiedIndex === i ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div style={{ fontSize: 13, color: text, padding: "9px 11px", borderRadius: 6, border: `0.5px solid ${isDark ? "rgba(201,169,110,0.3)" : "rgba(154,112,64,0.3)"}`, backgroundColor: isDark ? "rgba(201,169,110,0.06)" : "rgba(154,112,64,0.05)", lineHeight: "1.5", fontFamily: "system-ui, -apple-system, sans-serif" }}>
                    {result.rewrittenDescription}
                  </div>
                </div>

                {result.essayPotential && (
                  <div style={{ marginBottom: 8 }}>
                    <EssayBadge potential={result.essayPotential} />
                    {result.essayVerdict && (
                      <div style={{ fontSize: 11, color: muted, fontStyle: "italic", marginTop: 5, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1.5" }}>
                        {result.essayVerdict}
                      </div>
                    )}
                  </div>
                )}

                {result.overuseVerdict && !result.overuseVerdict.toLowerCase().includes("distinctive") && (
                  <div style={{ fontSize: 12, color: isDark ? "#fbbf24" : "#92400e", marginBottom: 8, fontFamily: "system-ui, -apple-system, sans-serif", lineHeight: "1.5" }}>
                    ⚠ {result.overuseVerdict}
                  </div>
                )}

                {result.missingInfo && (
                  <div style={{ marginTop: 8 }}>
                    <div style={{ fontSize: 10, fontWeight: 500, color: muted, textTransform: "uppercase" as const, letterSpacing: "0.07em", marginBottom: 5, fontFamily: "system-ui, -apple-system, sans-serif" }}>Strengthen this</div>
                    <div style={{ fontSize: 12, color: muted, lineHeight: "1.6", fontFamily: "system-ui, -apple-system, sans-serif" }}>
                      {result.missingInfo.split("?").filter((s: string) => s.trim()).map((q: string, qi: number) => (
                        <div key={qi} style={{ marginBottom: 3 }}>• {q.trim()}?</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {/* Footer buttons */}
          <div style={{ display: "flex", gap: 10, justifyContent: "center", marginTop: 24 }}>
            <button type="button" onClick={() => { setGradeResults(null); setPhase("input"); }}
              style={{ fontSize: 13, color: gold, backgroundColor: "transparent", border: `0.5px solid ${gold}`, borderRadius: 8, padding: "9px 20px", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", WebkitAppearance: "none", appearance: "none" }}>
              Re-analyze Activities
            </button>
            <button type="button" onClick={() => setPhase("major")}
              style={{ fontSize: 13, color: muted, backgroundColor: "transparent", border: `0.5px solid ${border}`, borderRadius: 8, padding: "9px 20px", cursor: "pointer", fontFamily: "system-ui, -apple-system, sans-serif", WebkitAppearance: "none", appearance: "none" }}>
              Change Majors
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
