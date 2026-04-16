"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

type ProfileData = {
  full_name: string | null;
  onboarding_complete: boolean;
};

type ActiveCard = "interviews" | null;

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

  const [userEmail,      setUserEmail]      = useState("");
  const [profileData,    setProfileData]    = useState<ProfileData | null>(null);
  const [activeCard,     setActiveCard]     = useState<ActiveCard>(null);
  const [savedCollegeCount, setSavedCollegeCount] = useState(0);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/"); return; }
      const uid = data.session.user.id;
      setUserEmail(data.session.user.email ?? "");
      const [{ data: profile }, { data: colleges }] = await Promise.all([
        supabase.from("profiles").select("full_name, onboarding_complete").eq("user_id", uid).single(),
        supabase.from("college_lists").select("id").eq("user_id", uid),
      ]);
      if (profile) setProfileData(profile as ProfileData);
      if (colleges) setSavedCollegeCount(colleges.length);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const firstName = profileData?.full_name?.split(" ")[0] ?? "Scholar";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const profileIncomplete = !profileData || !profileData.onboarding_complete;

  const comingSoon: Record<string, string> = {
    interviews: "Coming soon — AI-powered mock interviews tailored to your target schools",
  };

  const CARDS = [
    { id: "essays",       svgIcon: <QuillIcon color={gold} />,       label: "Essays",             desc: savedCollegeCount > 0 ? `Personal statements, supplements & Why Us essays · ${savedCollegeCount} schools in your list` : "Personal statements, supplements & Why Us essays", showDot: savedCollegeCount > 0, onClick: () => router.push("/annotate") },
    { id: "colleges",     svgIcon: <GraduationCapIcon color={gold} />, label: "My Colleges",      desc: savedCollegeCount > 0 ? `Build your college list · ${savedCollegeCount} schools saved` : "Build your college list and get personalized matches", onClick: () => router.push("/colleges") },
    { id: "profile",      svgIcon: <PersonIcon color={gold} />,      label: "Profile",            desc: "Build your student profile",                            showDot: profileIncomplete, onClick: () => router.push("/profile") },
    { id: "activities",   svgIcon: <ChecklistIcon color={gold} />,   label: "Activities Advisor", desc: "Analyze and improve your activities list",              onClick: () => router.push("/activities") },
    { id: "scholarships", svgIcon: <DollarCircleIcon color={gold} />,label: "Scholarships",       desc: "Find scholarships matched to your profile",             onClick: () => router.push("/scholarships") },
    { id: "financial-aid",svgIcon: <DollarCircleIcon color={gold} />,label: "Financial Aid",      desc: "Estimate aid, navigate FAFSA, and appeal your offers",  onClick: () => router.push("/financial-aid") },
    { id: "interviews",   svgIcon: <MicIcon color={gold} />,         label: "AI Interviews",      desc: "Practice college interviews with AI",                   onClick: () => setActiveCard(p => p === "interviews" ? null : "interviews") },
    { id: "deadlines",    svgIcon: <CalendarIcon color={gold} />,    label: "Deadlines",          desc: "Track application deadlines, test dates, and essay milestones", onClick: () => router.push("/deadlines") },
  ] as const;

  return (
    <div style={{ minHeight: "100vh", background: bg, color: text, fontFamily: "var(--font-sans, system-ui, sans-serif)" }}>

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

      {/* Body */}
      <div style={{ maxWidth: 1080, margin: "0 auto", padding: "48px 28px" }}>

        {/* Hero */}
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 13, color: gold, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: 12 }}>
            SheldonAI
          </div>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 40, fontWeight: 500, letterSpacing: "-0.5px", marginBottom: 10, color: text, lineHeight: 1.1 }}>
            {greeting}, {firstName}
          </h1>
          <p style={{ fontSize: 15, color: muted, marginBottom: 20 }}>Your college admissions command center.</p>
          {profileIncomplete && (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              background: `${gold}12`, border: `0.5px solid ${gold}44`, borderRadius: 10,
              padding: "10px 16px", cursor: "pointer",
            }} onClick={() => router.push("/profile")}>
              <div style={{ width: 120, height: 4, borderRadius: 2, background: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)", overflow: "hidden" }}>
                <div style={{ width: "30%", height: "100%", background: gold, borderRadius: 2 }} />
              </div>
              <span style={{ fontSize: 12, color: gold }}>Complete your profile →</span>
            </div>
          )}
        </div>

        {/* Quick stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginBottom: 32 }}>
          {[
            { label: "Schools saved", value: savedCollegeCount, link: "/colleges" },
            { label: "Profile", value: profileIncomplete ? "Incomplete" : "Complete", link: "/profile" },
            { label: "Essays section", value: "Active", link: "/annotate" },
          ].map(stat => (
            <div key={stat.label}
              onClick={() => router.push(stat.link)}
              style={{
                background: surface, border: `0.5px solid ${border}`, borderRadius: 12,
                padding: "16px 20px", cursor: "pointer",
              }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 500, color: gold, marginBottom: 4 }}>
                {stat.value}
              </div>
              <div style={{ fontSize: 12, color: muted }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16, marginBottom: 36 }}>
          {CARDS.map((card) => (
            <CardButton
              key={card.id}
              svgIcon={card.svgIcon}
              label={card.label}
              desc={card.desc}
              showDot={"showDot" in card ? card.showDot : false}
              gold={gold} surface={surface} border={border} text={text} muted={muted}
              onClick={card.onClick}
            />
          ))}
        </div>

        {/* Coming soon */}
        {activeCard && (
          <div style={{
            background: surface, border: `0.5px solid ${border}`, borderRadius: 14,
            padding: "24px 28px", fontSize: 14, color: muted, textAlign: "center", lineHeight: 1.6,
          }}>
            {comingSoon[activeCard]}
          </div>
        )}

      </div>
    </div>
  );
}

function CardButton({ svgIcon, label, desc, showDot, gold, surface, border, text, muted, onClick }: {
  svgIcon: React.ReactNode; label: string; desc: string; showDot: boolean;
  gold: string; surface: string; border: string; text: string; muted: string;
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start",
        width: "100%", minHeight: 160, padding: "24px",
        background: surface,
        border: `0.5px solid ${hovered ? gold : border}`,
        borderRadius: 16, cursor: "pointer", textAlign: "left",
        transition: "border-color 0.18s, box-shadow 0.18s, transform 0.18s",
        boxShadow: hovered ? `0 4px 20px ${gold}18` : "none",
        transform: hovered ? "translateY(-2px)" : "none",
      }}
    >
      {showDot && (
        <span style={{
          position: "absolute", top: 14, right: 14,
          width: 8, height: 8, borderRadius: "50%", background: gold,
        }} />
      )}
      <span style={{ marginBottom: 14 }}>{svgIcon}</span>
      <span style={{ fontSize: 17, fontWeight: 600, color: text, marginBottom: 6 }}>{label}</span>
      <span style={{ fontSize: 13, color: muted, lineHeight: 1.5 }}>{desc}</span>
    </button>
  );
}

// ── SVG Icons ─────────────────────────────────────────────────────────────────
function QuillIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 2C17 2 13 4 11 8L7 18L9 20L19 16C23 14 24 10 22 7" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M11 8L9 20" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M4 20L7 17" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function GraduationCapIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 3L2 8L12 13L22 8L12 3Z" stroke={color} strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M6 10.5V16C6 16 8 19 12 19C16 19 18 16 18 16V10.5" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M22 8V14" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function PersonIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="7" r="4" stroke={color} strokeWidth="1.5"/>
      <path d="M4 21C4 17 7.6 14 12 14C16.4 14 20 17 20 21" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function ChecklistIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 5H7C5.9 5 5 5.9 5 7V19C5 20.1 5.9 21 7 21H17C18.1 21 19 20.1 19 19V7C19 5.9 18.1 5 17 5H15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M9 5C9 3.9 9.9 3 11 3H13C14.1 3 15 3.9 15 5V6H9V5Z" stroke={color} strokeWidth="1.5"/>
      <path d="M9 12L11 14L15 10" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function DollarCircleIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.5"/>
      <path d="M12 7V17M9.5 9.5C9.5 8.4 10.6 7.5 12 7.5C13.4 7.5 14.5 8.4 14.5 9.5C14.5 10.6 13.4 11.5 12 11.5C10.6 11.5 9.5 12.4 9.5 13.5C9.5 14.6 10.6 15.5 12 15.5C13.4 15.5 14.5 14.6 14.5 13.5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function MicIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="2" width="6" height="11" rx="3" stroke={color} strokeWidth="1.5"/>
      <path d="M5 10C5 14.4 8.1 18 12 18C15.9 18 19 14.4 19 10" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M12 18V22M9 22H15" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
    </svg>
  );
}

function CalendarIcon({ color }: { color: string }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="4" width="18" height="17" rx="2" stroke={color} strokeWidth="1.5"/>
      <path d="M3 9H21" stroke={color} strokeWidth="1.5"/>
      <path d="M8 2V5M16 2V5" stroke={color} strokeWidth="1.5" strokeLinecap="round"/>
      <rect x="7" y="12" width="3" height="3" rx="0.5" fill={color}/>
      <rect x="14" y="12" width="3" height="3" rx="0.5" fill={color}/>
    </svg>
  );
}
