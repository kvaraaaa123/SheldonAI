"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

type ProfileData = {
  full_name: string | null;
  onboarding_complete: boolean;
};

type ActiveCard = "scholarships" | "interviews" | "deadlines" | null;

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

  const [userEmail,   setUserEmail]   = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [activeCard,  setActiveCard]  = useState<ActiveCard>(null);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/"); return; }
      setUserEmail(data.session.user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, onboarding_complete")
        .eq("user_id", data.session.user.id)
        .single();
      if (profile) setProfileData(profile as ProfileData);
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
    scholarships: "Coming soon — scholarship matching powered by your profile",
    interviews:   "Coming soon — AI-powered mock interviews tailored to your target schools",
    deadlines:    "Coming soon — deadline tracking synced with your school list",
  };

  const CARDS = [
    { id: "essays",      icon: "✦", label: "Essays",            desc: "Personal statements, supplements & Why Us essays", onClick: () => router.push("/annotate") },
    { id: "profile",     icon: "◈", label: "Profile",           desc: "Build your student profile",                       showDot: profileIncomplete, onClick: () => router.push("/profile") },
    { id: "activities",  icon: "✦", label: "Activities Advisor", desc: "Analyze and improve your activities list",          onClick: () => router.push("/activities") },
    { id: "scholarships",icon: "◆", label: "Scholarships",      desc: "Find scholarships that match your profile",        onClick: () => setActiveCard(p => p === "scholarships" ? null : "scholarships") },
    { id: "interviews",  icon: "◉", label: "AI Interviews",     desc: "Practice college interviews with AI",              onClick: () => setActiveCard(p => p === "interviews"   ? null : "interviews") },
    { id: "deadlines",   icon: "◷", label: "Deadlines",         desc: "Track application deadlines",                      onClick: () => setActiveCard(p => p === "deadlines"    ? null : "deadlines") },
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
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "48px 28px" }}>

        {/* Greeting */}
        <div style={{ marginBottom: 40 }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 36, fontWeight: 500, letterSpacing: "-0.5px", marginBottom: 8, color: text }}>
            {greeting}, {firstName}
          </h1>
          <p style={{ fontSize: 15, color: muted }}>What would you like to work on today?</p>
        </div>

        {/* Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 36 }}>
          {CARDS.map((card, i) => {
            const isLast = i === CARDS.length - 1 && CARDS.length % 2 !== 0;
            return (
              <div key={card.id}
                style={{ gridColumn: isLast ? "1 / -1" : undefined, display: isLast ? "flex" : undefined, justifyContent: isLast ? "center" : undefined }}
              >
                <CardButton
                  icon={card.icon}
                  label={card.label}
                  desc={card.desc}
                  showDot={"showDot" in card ? card.showDot : false}
                  gold={gold} surface={surface} border={border} text={text} muted={muted}
                  onClick={card.onClick}
                  style={isLast ? { maxWidth: 380, width: "100%" } : undefined}
                />
              </div>
            );
          })}
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

function CardButton({ icon, label, desc, showDot, gold, surface, border, text, muted, onClick, style }: {
  icon: string; label: string; desc: string; showDot: boolean;
  gold: string; surface: string; border: string; text: string; muted: string;
  onClick: () => void; style?: React.CSSProperties;
}) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative", display: "flex", flexDirection: "column", alignItems: "flex-start",
        width: "100%", minHeight: 140, padding: "24px",
        background: surface,
        border: `0.5px solid ${hovered ? gold : border}`,
        borderRadius: 16, cursor: "pointer", textAlign: "left",
        transition: "border-color 0.18s, box-shadow 0.18s",
        boxShadow: hovered ? `0 0 0 1px ${gold}22` : "none",
        ...style,
      }}
    >
      {showDot && (
        <span style={{
          position: "absolute", top: 14, right: 14,
          width: 8, height: 8, borderRadius: "50%", background: gold,
        }} />
      )}
      <span style={{ fontSize: 22, marginBottom: 12, color: gold }}>{icon}</span>
      <span style={{ fontSize: 17, fontWeight: 600, color: text, marginBottom: 6 }}>{label}</span>
      <span style={{ fontSize: 13, color: muted, lineHeight: 1.5 }}>{desc}</span>
    </button>
  );
}
