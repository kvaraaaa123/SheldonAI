"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

type ProfileData = {
  full_name: string | null;
  onboarding_complete: boolean;
};

export default function DashboardPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  const bg      = isDark ? "#080810" : "#FAFAF5";
  const text    = isDark ? "#FAFAF5" : "#0a0a12";
  const gold    = isDark ? "#C9A96E" : "#9a7040";
  const surface = isDark ? "#0f0f1a" : "#ffffff";
  const border  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const muted   = isDark ? "rgba(250,250,245,0.45)" : "rgba(10,10,18,0.45)";
  const navBg   = isDark ? "rgba(8,8,16,0.95)" : "rgba(250,250,245,0.95)";

  const [userEmail,         setUserEmail]         = useState("");
  const [profileData,       setProfileData]       = useState<ProfileData | null>(null);
  const [savedCollegeCount, setSavedCollegeCount] = useState(0);
  const [essayCount,        setEssayCount]        = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/"); return; }
      const uid = data.session.user.id;
      setUserEmail(data.session.user.email ?? "");
      const [{ data: profile }, { data: colleges }, { count: essays }] = await Promise.all([
        supabase.from("profiles").select("full_name, onboarding_complete").eq("user_id", uid).maybeSingle(),
        supabase.from("college_lists").select("id").eq("user_id", uid),
        supabase.from("essays").select("id", { count: "exact" }).eq("user_id", uid),
      ]);
      if (profile) setProfileData(profile as ProfileData);
      if (colleges) setSavedCollegeCount(colleges.length);
      setEssayCount(essays ?? 0);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const firstName = profileData?.full_name?.split(" ")[0] ?? "Scholar";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  const dimTitle = isDark ? "rgba(250,250,245,0.35)" : "rgba(10,10,18,0.45)";
  const dimDesc  = isDark ? "rgba(250,250,245,0.25)" : "rgba(10,10,18,0.3)";
  const dimLink  = isDark ? "rgba(250,250,245,0.2)"  : "rgba(10,10,18,0.2)";
  const dimIcon  = isDark ? "rgba(250,250,245,0.2)"  : "rgba(10,10,18,0.2)";
  const dimIconBg = isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.04)";

  void essayCount;
  void savedCollegeCount;

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>

      <style>{`
        @keyframes dot-pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 28px", borderBottom: `0.5px solid ${border}`,
        background: navBg, backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <a href="/dashboard" style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 500, textDecoration: "none", color: text, letterSpacing: "-0.02em" }}>
          Sheldon<span style={{ color: gold }}>AI</span>
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{ fontSize: 12, color: muted }}>{userEmail}</span>
          <button onClick={() => router.push("/settings")} style={{ width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center", background: "none", border: "none", cursor: "pointer", padding: 6 }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={muted} strokeWidth="1.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </button>
          <button onClick={handleSignOut} style={{ fontSize: 12, color: muted, background: "none", border: "none", cursor: "pointer", textDecoration: "underline" }}>
            Sign out
          </button>
          <button onClick={toggleTheme} style={{
            width: 32, height: 32, display: "flex", alignItems: "center", justifyContent: "center",
            borderRadius: "50%", border: `0.5px solid ${border}`, background: "none",
            cursor: "pointer", color: muted, fontSize: 15,
          }}>
            {isDark ? "☀" : "☽"}
          </button>
        </div>
      </nav>

      {/* Main body */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 24px" }}>

        {/* PART 1 — Greeting row */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 36 }}>
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 500, color: text, marginBottom: 5 }}>
              {greeting}, {firstName}
            </div>
            <div style={{ fontSize: 13, color: muted }}>
              Your application package is waiting to be built
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 7, marginBottom: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: gold, animation: "dot-pulse 2s infinite", flexShrink: 0 }} />
              <span style={{ fontSize: 10, textTransform: "uppercase", color: gold, letterSpacing: "0.1em" }}>Holistic application package</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: text, marginBottom: 4 }}>Four steps. One coherent story.</div>
            <div style={{ fontSize: 12, color: muted, maxWidth: 300 }}>Follow this sequence for the most personalized experience</div>
          </div>
        </div>

        {/* PART 2 — Package strip */}
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(4,1fr)",
          border: "1px solid rgba(154,112,64,0.25)", borderRadius: 14, overflow: "hidden",
          marginBottom: 20, background: surface,
        }}>
          {/* Cell 1 — Profile */}
          <div
            onClick={() => router.push("/profile")}
            style={{
              padding: "18px 16px 20px", cursor: "pointer",
              background: "rgba(154,112,64,0.06)",
              borderRight: "0.5px solid rgba(154,112,64,0.2)",
            }}
          >
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: gold, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600, color: "#fff" }}>1</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: text, marginTop: 10, marginBottom: 5 }}>Profile</div>
            <div style={{ fontSize: 11, color: muted, lineHeight: 1.55 }}>Your academics, background, interests, and goals — the foundation everything is built on</div>
            <div style={{ display: "inline-block", background: "rgba(154,112,64,0.12)", color: "#7a5230", fontSize: 10, padding: "3px 8px", borderRadius: 999, marginTop: 10 }}>● Start here</div>
          </div>

          {/* Cell 2 — Activities */}
          <div
            onClick={() => router.push("/activities")}
            style={{ padding: "18px 16px 20px", cursor: "pointer", borderRight: `0.5px solid ${border}` }}
          >
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: muted }}>2</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: dimTitle, marginTop: 10, marginBottom: 5 }}>Activities</div>
            <div style={{ fontSize: 11, color: dimDesc, lineHeight: 1.55 }}>Grade and rewrite your list. SheldonAI identifies your spike and essay potential</div>
            <div style={{ display: "inline-block", background: "rgba(0,0,0,0.05)", color: "rgba(10,10,18,0.3)", fontSize: 10, padding: "3px 8px", borderRadius: 999, marginTop: 10 }}>After profile</div>
          </div>

          {/* Cell 3 — My Colleges */}
          <div
            onClick={() => router.push("/colleges")}
            style={{ padding: "18px 16px 20px", cursor: "pointer", borderRight: `0.5px solid ${border}` }}
          >
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: muted }}>3</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: dimTitle, marginTop: 10, marginBottom: 5 }}>My colleges</div>
            <div style={{ fontSize: 11, color: dimDesc, lineHeight: 1.55 }}>Get matched to universities and research each school&apos;s specific essay requirements</div>
            <div style={{ display: "inline-block", background: "rgba(0,0,0,0.05)", color: "rgba(10,10,18,0.3)", fontSize: 10, padding: "3px 8px", borderRadius: 999, marginTop: 10 }}>After activities</div>
          </div>

          {/* Cell 4 — Essays */}
          <div
            onClick={() => router.push("/annotate")}
            style={{ padding: "18px 16px 20px", cursor: "pointer" }}
          >
            <div style={{ width: 24, height: 24, borderRadius: "50%", border: "0.5px solid rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: muted }}>4</div>
            <div style={{ fontSize: 14, fontWeight: 500, color: dimTitle, marginTop: 10, marginBottom: 5 }}>Essays</div>
            <div style={{ fontSize: 11, color: dimDesc, lineHeight: 1.55 }}>With your profile and activities known, every essay recommendation is truly yours</div>
            <div style={{ display: "inline-block", background: "rgba(0,0,0,0.05)", color: "rgba(10,10,18,0.3)", fontSize: 10, padding: "3px 8px", borderRadius: 999, marginTop: 10 }}>After colleges</div>
          </div>
        </div>

        {/* PART 3 — Insight bar */}
        <div style={{
          border: "0.5px solid rgba(154,112,64,0.2)", borderRadius: 10,
          padding: "13px 16px", marginBottom: 28,
          background: "rgba(154,112,64,0.02)",
          display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <div style={{ width: 2, background: "#9a7040", opacity: 0.5, borderRadius: 1, alignSelf: "stretch", flexShrink: 0 }} />
          <div style={{ fontSize: 12, lineHeight: 1.65, color: muted }}>
            Your essays should{" "}
            <span style={{ color: "#7a5230", fontWeight: 500 }}>reveal what your activities list cannot show.</span>
            {" "}SheldonAI uses your profile and activities to ensure every essay opens a new window — not repeats what admissions officers already read.
          </div>
        </div>

        {/* PART 4 — Main 4 cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>

          {/* Card 1 — Profile */}
          <MainCard
            onClick={() => router.push("/profile")}
            borderStyle="1px solid rgba(154,112,64,0.4)"
            surface={surface}
            border={border}
          >
            <div style={{ width: 36, height: 36, borderRadius: 10, background: "rgba(154,112,64,0.1)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={gold} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: text, marginBottom: 5 }}>Profile</div>
            <div style={{ fontSize: 12, color: muted, lineHeight: 1.55, flex: 1 }}>Build your complete student profile — academics, background, passions, and more</div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${border}`, fontSize: 11, fontWeight: 500, color: gold }}>Start here →</div>
          </MainCard>

          {/* Card 2 — Activities */}
          <MainCard onClick={() => router.push("/activities")} borderStyle={`0.5px solid ${border}`} surface={surface} border={border}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: dimIconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={dimIcon} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: dimTitle, marginBottom: 5 }}>Activities advisor</div>
            <div style={{ fontSize: 12, color: dimDesc, lineHeight: 1.55, flex: 1 }}>Grade and rewrite your activities list with real admissions logic</div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${border}`, fontSize: 11, fontWeight: 500, color: dimLink }}>Step 2 →</div>
          </MainCard>

          {/* Card 3 — My Colleges */}
          <MainCard onClick={() => router.push("/colleges")} borderStyle={`0.5px solid ${border}`} surface={surface} border={border}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: dimIconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={dimIcon} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
              </svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: dimTitle, marginBottom: 5 }}>My colleges</div>
            <div style={{ fontSize: 12, color: dimDesc, lineHeight: 1.55, flex: 1 }}>Get matched to universities and research their specific essays</div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${border}`, fontSize: 11, fontWeight: 500, color: dimLink }}>Step 3 →</div>
          </MainCard>

          {/* Card 4 — Essays */}
          <MainCard onClick={() => router.push("/annotate")} borderStyle={`0.5px solid ${border}`} surface={surface} border={border}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: dimIconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={dimIcon} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <div style={{ fontSize: 14, fontWeight: 500, color: dimTitle, marginBottom: 5 }}>Essays</div>
            <div style={{ fontSize: 12, color: dimDesc, lineHeight: 1.55, flex: 1 }}>Analyze your essays line by line with personalized, packaged feedback</div>
            <div style={{ marginTop: 12, paddingTop: 12, borderTop: `0.5px solid ${border}`, fontSize: 11, fontWeight: 500, color: dimLink }}>Step 4 →</div>
          </MainCard>

        </div>

        {/* PART 5 — Divider */}
        <div style={{ height: "0.5px", background: "rgba(0,0,0,0.07)", margin: "8px 0 20px" }} />

        {/* PART 6 — Bottom 4 tool cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12 }}>

          {/* Financial Aid */}
          <ToolCard onClick={() => router.push("/financial-aid")} surface={surface} border={border}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(22,163,74,0.08)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: text, marginBottom: 3 }}>Financial aid</div>
              <div style={{ fontSize: 11, color: muted, lineHeight: 1.5 }}>FAFSA, CSS Profile, net price estimator, appeal letters</div>
            </div>
          </ToolCard>

          {/* Scholarships */}
          <ToolCard onClick={() => router.push("/scholarships")} surface={surface} border={border}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(37,99,235,0.08)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: text, marginBottom: 3 }}>Scholarships</div>
              <div style={{ fontSize: 11, color: muted, lineHeight: 1.5 }}>70+ awards matched to your profile and background</div>
            </div>
          </ToolCard>

          {/* Deadlines */}
          <ToolCard onClick={() => router.push("/deadlines")} surface={surface} border={border}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(220,38,38,0.08)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: text, marginBottom: 3 }}>Deadlines</div>
              <div style={{ fontSize: 11, color: muted, lineHeight: 1.5 }}>Application dates, test dates, essay milestones</div>
            </div>
          </ToolCard>

          {/* AI Interviews */}
          <ToolCard onClick={() => router.push("/interviews")} surface={surface} border={border}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: "rgba(124,58,237,0.08)", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 500, color: text, marginBottom: 3 }}>AI interviews</div>
              <div style={{ fontSize: 11, color: muted, lineHeight: 1.5 }}>Practice with Harvard, Yale, Stanford alumni — voice mode</div>
            </div>
          </ToolCard>

        </div>

      </div>
    </div>
  );
}

function MainCard({ children, onClick, borderStyle, surface, border }: {
  children: React.ReactNode;
  onClick: () => void;
  borderStyle: string;
  surface: string;
  border: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 20,
        border: hovered ? "0.5px solid rgba(154,112,64,0.4)" : borderStyle,
        borderRadius: 14,
        background: surface,
        cursor: "pointer",
        transition: "all 0.15s",
        display: "flex",
        flexDirection: "column",
        minHeight: 160,
        transform: hovered ? "translateY(-1px)" : "none",
      }}
    >
      {children}
    </div>
  );
}

function ToolCard({ children, onClick, surface, border }: {
  children: React.ReactNode;
  onClick: () => void;
  surface: string;
  border: string;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        padding: 16,
        border: `0.5px solid ${hovered ? "rgba(0,0,0,0.18)" : border}`,
        borderRadius: 12,
        background: surface,
        cursor: "pointer",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        transition: "border-color 0.15s",
      }}
    >
      {children}
    </div>
  );
}
