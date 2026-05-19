"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";

type ProfileData = {
  full_name: string | null;
  onboarding_complete: boolean;
  gpa: number | null;
  passion_description: string | null;
  sat_score: number | null;
  act_score: number | null;
  role: string | null;
};

export default function DashboardPage() {
  const router = useRouter();
  const { isDark, toggleTheme } = useTheme();

  const text   = isDark ? "#FAFAF5" : "#0a0a12";
  const gold   = isDark ? "#C9A96E" : "#9a7040";
  const border = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const muted  = isDark ? "rgba(250,250,245,0.45)" : "rgba(10,10,18,0.45)";
  const navBg  = isDark ? "rgba(8,8,16,0.95)" : "rgba(250,250,245,0.95)";

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
        supabase.from("profiles").select("full_name, onboarding_complete, gpa, passion_description, sat_score, act_score, role").eq("user_id", uid).maybeSingle(),
        supabase.from("college_lists").select("id").eq("user_id", uid),
        supabase.from("essays").select("id", { count: "exact" }).eq("user_id", uid),
      ]);
      if (profile) {
        setProfileData(profile as ProfileData);
        if ((profile as ProfileData).role === "counselor") { router.push("/counselor/dashboard"); return; }
      }
      if (colleges) setSavedCollegeCount(colleges.length);
      setEssayCount(essays ?? 0);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  const firstName = profileData?.full_name?.split(" ")[0] ?? "Scholar";
  const profileComplete = !!(
    profileData?.full_name &&
    profileData?.gpa &&
    profileData?.passion_description &&
    (profileData?.sat_score || profileData?.act_score)
  );
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  void essayCount;
  void savedCollegeCount;

  const dimIconStroke = isDark ? "rgba(250,250,245,0.3)" : "rgba(10,10,18,0.3)";
  const dimIconBg     = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.04)";
  const dimStepBorder = isDark ? "rgba(250,250,245,0.15)" : "rgba(0,0,0,0.15)";
  const dimStepColor  = isDark ? "rgba(250,250,245,0.3)" : "rgba(10,10,18,0.3)";
  const dimLinkColor  = isDark ? "rgba(250,250,245,0.2)" : "rgba(10,10,18,0.2)";
  const dimDescColor  = isDark ? "rgba(250,250,245,0.45)" : "rgba(10,10,18,0.45)";
  const cardBorder2_4 = isDark ? "rgba(250,250,245,0.09)" : "rgba(0,0,0,0.09)";
  const cardBg2_4     = isDark ? "rgba(255,255,255,0.03)" : "#fff";

  return (
    <div style={{ minHeight: "100vh", background: isDark ? "#0a0a12" : "#FAFAF8", color: text, fontFamily: "system-ui, -apple-system, sans-serif" }}>

      <style>{`
        @keyframes sheldonPulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
        .sheldon-card { transition: all 0.2s ease; position: relative; overflow: hidden; }
        .sheldon-card::before { content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px; background: #9a7040; opacity: 0; transition: opacity 0.2s; }
        .sheldon-card:hover { border-color: rgba(154,112,64,0.5) !important; background: rgba(154,112,64,0.035) !important; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(154,112,64,0.09); }
        .sheldon-card:hover::before { opacity: 1; }
        .sheldon-card:hover .card-icon-inner { background: rgba(154,112,64,0.14) !important; }
        .sheldon-card:hover .card-icon-inner svg { stroke: #9a7040 !important; }
        .sheldon-card:hover .card-open-link { color: #9a7040 !important; }
        .sheldon-card:hover .card-step-num { border-color: rgba(154,112,64,0.55) !important; color: #9a7040 !important; }
      `}</style>

      {/* Nav */}
      <nav style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "12px 28px", borderBottom: `0.5px solid ${border}`,
        background: navBg, backdropFilter: "blur(12px)",
        position: "sticky", top: 0, zIndex: 50,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <Link href="/" style={{ color: 'rgba(10,10,18,0.45)', fontSize: '22px', textDecoration: 'none', marginRight: '14px', lineHeight: 1 }} onMouseEnter={e => (e.currentTarget.style.color = '#9a7040')} onMouseLeave={e => (e.currentTarget.style.color = 'rgba(10,10,18,0.45)')}>←</Link>
          <Link href="/" style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 500, textDecoration: "none", color: text, letterSpacing: "-0.02em" }}>
            Sheldon<span style={{ color: gold }}>AI</span>
          </Link>
        </div>
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

      {/* Main */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "40px 24px" }}>

        {/* Section 1: Greeting */}
        <div style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 500, color: text }}>
            {greeting}, {firstName}
          </div>
        </div>
        <div style={{ fontSize: 13, color: isDark ? "rgba(250,250,245,0.4)" : "rgba(10,10,18,0.45)", marginBottom: 32 }}>
          Your college admissions command center
        </div>

        {/* Section 2: Sequence header */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 6 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#9a7040", animation: "sheldonPulse 2s infinite", display: "inline-block", flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.1em", textTransform: "uppercase", color: "#9a7040" }}>Recommended sequence</span>
          </div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 17, fontWeight: 500, color: isDark ? "#fafaf5" : "#0a0a12", marginBottom: 4 }}>
            Your holistic application package
          </div>
          <div style={{ fontSize: 11, lineHeight: 1.65, color: isDark ? "rgba(250,250,245,0.42)" : "rgba(10,10,18,0.42)", marginBottom: 16 }}>
            Each step makes the next one smarter — but you can use any section on its own at any time.
          </div>
        </div>

        {/* Section 3: Insight bar */}
        <div style={{
          display: "flex", alignItems: "flex-start", gap: 0,
          borderRadius: 10,
          background: isDark ? "rgba(154,112,64,0.06)" : "rgba(154,112,64,0.03)",
          border: "0.5px solid rgba(154,112,64,0.2)",
          padding: "12px 16px",
          marginBottom: 28,
        }}>
          <div style={{ width: 2, borderRadius: 1, background: "#9a7040", opacity: 0.45, alignSelf: "stretch", flexShrink: 0, marginRight: 14 }} />
          <div style={{ fontSize: 12, lineHeight: 1.65, color: isDark ? "rgba(250,250,245,0.48)" : "rgba(10,10,18,0.48)" }}>
            This sequence is a{" "}
            <span style={{ fontWeight: 600, color: "#7a5230" }}>recommendation, not a requirement.</span>
            {" "}Your essays can be improved independently at any time. But when done in order, each step gives SheldonAI richer context — making every recommendation more specific and personal to you.
          </div>
        </div>

        {/* Section 4: Top 4 cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14, marginBottom: 10 }}>

          {/* Card 1 — Profile */}
          <div
            className="sheldon-card"
            onClick={() => router.push("/profile")}
            style={{
              padding: "26px 22px",
              border: profileComplete ? `0.5px solid ${cardBorder2_4}` : "0.5px solid rgba(154,112,64,0.4)",
              borderRadius: 16,
              background: profileComplete ? cardBg2_4 : (isDark ? "rgba(154,112,64,0.07)" : "rgba(154,112,64,0.03)"),
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              minHeight: 220,
              position: "relative",
            }}
          >
            {profileComplete && (
              <div style={{
                position: "absolute", top: 12, right: 12,
                width: 20, height: 20, borderRadius: "50%",
                background: "#16a34a",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none">
                  <polyline points="2,6 5,9 10,3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
            )}
            <div className="card-step-num" style={{ width: 26, height: 26, borderRadius: "50%", border: profileComplete ? `0.5px solid ${dimStepBorder}` : "0.5px solid #9a7040", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: profileComplete ? dimStepColor : "#9a7040", marginBottom: 16 }}>1</div>
            <div className="card-icon-inner" style={{ width: 42, height: 42, borderRadius: 11, background: profileComplete ? dimIconBg : "rgba(154,112,64,0.12)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, transition: "background 0.2s" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={profileComplete ? dimIconStroke : "#9a7040"} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: isDark ? "#fafaf5" : "#0a0a12", marginBottom: 6 }}>Profile</div>
            <div style={{ fontSize: 12, lineHeight: 1.65, color: profileComplete ? dimDescColor : (isDark ? "rgba(250,250,245,0.45)" : "rgba(10,10,18,0.45)"), flex: 1 }}>Your academics, background, interests, and goals. The foundation every other tool builds on — the more complete, the more personalized everything becomes.</div>
            <div className="card-open-link" style={{ fontSize: 11, fontWeight: 500, color: profileComplete ? dimLinkColor : "#9a7040", marginTop: 16, transition: "color 0.2s" }}>{profileComplete ? "Edit profile →" : "Start here →"}</div>
          </div>

          {/* Card 2 — Activities */}
          <div
            className="sheldon-card"
            onClick={() => router.push("/activities")}
            style={{
              padding: "26px 22px",
              border: `0.5px solid ${cardBorder2_4}`,
              borderRadius: 16,
              background: cardBg2_4,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              minHeight: 220,
            }}
          >
            <div className="card-step-num" style={{ width: 26, height: 26, borderRadius: "50%", border: `0.5px solid ${dimStepBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: dimStepColor, marginBottom: 16 }}>2</div>
            <div className="card-icon-inner" style={{ width: 42, height: 42, borderRadius: 11, background: dimIconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, transition: "background 0.2s" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={dimIconStroke} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
                <polyline points="9 11 12 14 22 4"/>
                <path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/>
              </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: isDark ? "#fafaf5" : "#0a0a12", marginBottom: 6 }}>Activities advisor</div>
            <div style={{ fontSize: 12, lineHeight: 1.65, color: dimDescColor, flex: 1 }}>Grade and rewrite your activities list. Identifies your spike, flags weak entries, and reveals which activities are strong enough to anchor an essay.</div>
            <div className="card-open-link" style={{ fontSize: 11, fontWeight: 500, color: dimLinkColor, marginTop: 16, transition: "color 0.2s" }}>Open →</div>
          </div>

          {/* Card 3 — My Colleges */}
          <div
            className="sheldon-card"
            onClick={() => router.push("/colleges")}
            style={{
              padding: "26px 22px",
              border: `0.5px solid ${cardBorder2_4}`,
              borderRadius: 16,
              background: cardBg2_4,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              minHeight: 220,
            }}
          >
            <div className="card-step-num" style={{ width: 26, height: 26, borderRadius: "50%", border: `0.5px solid ${dimStepBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: dimStepColor, marginBottom: 16 }}>3</div>
            <div className="card-icon-inner" style={{ width: 42, height: 42, borderRadius: 11, background: dimIconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, transition: "background 0.2s" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={dimIconStroke} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
                <circle cx="12" cy="12" r="10"/>
                <line x1="2" y1="12" x2="22" y2="12"/>
                <path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>
              </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: isDark ? "#fafaf5" : "#0a0a12", marginBottom: 6 }}>My colleges</div>
            <div style={{ fontSize: 12, lineHeight: 1.65, color: dimDescColor, flex: 1 }}>Get matched to universities based on your full profile. Research each school&apos;s essay requirements, traditions, and what their readers are really looking for.</div>
            <div className="card-open-link" style={{ fontSize: 11, fontWeight: 500, color: dimLinkColor, marginTop: 16, transition: "color 0.2s" }}>Open →</div>
          </div>

          {/* Card 4 — Essays */}
          <div
            className="sheldon-card"
            onClick={() => router.push("/annotate")}
            style={{
              padding: "26px 22px",
              border: `0.5px solid ${cardBorder2_4}`,
              borderRadius: 16,
              background: cardBg2_4,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              minHeight: 220,
            }}
          >
            <div className="card-step-num" style={{ width: 26, height: 26, borderRadius: "50%", border: `0.5px solid ${dimStepBorder}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 500, color: dimStepColor, marginBottom: 16 }}>4</div>
            <div className="card-icon-inner" style={{ width: 42, height: 42, borderRadius: 11, background: dimIconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, transition: "background 0.2s" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={dimIconStroke} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
                <path d="M12 20h9"/>
                <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
              </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: isDark ? "#fafaf5" : "#0a0a12", marginBottom: 6 }}>Essays</div>
            <div style={{ fontSize: 12, lineHeight: 1.65, color: dimDescColor, flex: 1 }}>Sentence-level annotation grounded in real admissions theory. With your profile loaded, every note is specific to you — not generic advice.</div>
            <div className="card-open-link" style={{ fontSize: 11, fontWeight: 500, color: dimLinkColor, marginTop: 16, transition: "color 0.2s" }}>Open →</div>
          </div>

        </div>

        {/* Section 5: Divider */}
        <div style={{ height: "0.5px", background: isDark ? "rgba(250,250,245,0.07)" : "rgba(0,0,0,0.07)", margin: "20px 0" }} />

        {/* Section 6: Bottom 4 tool cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 14 }}>

          {/* Financial Aid */}
          <div
            className="sheldon-card"
            onClick={() => router.push("/financial-aid")}
            style={{
              padding: "26px 22px",
              border: `0.5px solid ${cardBorder2_4}`,
              borderRadius: 16,
              background: cardBg2_4,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              minHeight: 220,
            }}
          >
            <div className="card-icon-inner" style={{ width: 42, height: 42, borderRadius: 11, background: dimIconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, transition: "background 0.2s" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={dimIconStroke} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
                <line x1="12" y1="1" x2="12" y2="23"/>
                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/>
              </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: isDark ? "#fafaf5" : "#0a0a12", marginBottom: 6 }}>Financial aid</div>
            <div style={{ fontSize: 12, lineHeight: 1.65, color: dimDescColor, flex: 1 }}>FAFSA and CSS Profile companion. Net price estimator across all saved schools. Professional appeal letters. Avoid the mistakes that cost families thousands.</div>
            <div className="card-open-link" style={{ fontSize: 11, fontWeight: 500, color: dimLinkColor, marginTop: 16, transition: "color 0.2s" }}>Open →</div>
          </div>

          {/* Scholarships */}
          <div
            className="sheldon-card"
            onClick={() => router.push("/scholarships")}
            style={{
              padding: "26px 22px",
              border: `0.5px solid ${cardBorder2_4}`,
              borderRadius: 16,
              background: cardBg2_4,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              minHeight: 220,
            }}
          >
            <div className="card-icon-inner" style={{ width: 42, height: 42, borderRadius: 11, background: dimIconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, transition: "background 0.2s" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={dimIconStroke} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
              </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: isDark ? "#fafaf5" : "#0a0a12", marginBottom: 6 }}>Scholarships</div>
            <div style={{ fontSize: 12, lineHeight: 1.65, color: dimDescColor, flex: 1 }}>70+ awards matched to your profile, background, intended major, and financial need. Updated with current deadlines.</div>
            <div className="card-open-link" style={{ fontSize: 11, fontWeight: 500, color: dimLinkColor, marginTop: 16, transition: "color 0.2s" }}>Open →</div>
          </div>

          {/* Deadlines */}
          <div
            className="sheldon-card"
            onClick={() => router.push("/deadlines")}
            style={{
              padding: "26px 22px",
              border: `0.5px solid ${cardBorder2_4}`,
              borderRadius: 16,
              background: cardBg2_4,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              minHeight: 220,
            }}
          >
            <div className="card-icon-inner" style={{ width: 42, height: 42, borderRadius: 11, background: dimIconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, transition: "background 0.2s" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={dimIconStroke} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
                <rect x="3" y="4" width="18" height="18" rx="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: isDark ? "#fafaf5" : "#0a0a12", marginBottom: 6 }}>Deadlines</div>
            <div style={{ fontSize: 12, lineHeight: 1.65, color: dimDescColor, flex: 1 }}>Application deadlines, financial aid dates, SAT and ACT test dates, and personalized essay writing milestones.</div>
            <div className="card-open-link" style={{ fontSize: 11, fontWeight: 500, color: dimLinkColor, marginTop: 16, transition: "color 0.2s" }}>Open →</div>
          </div>

          {/* AI Interviews */}
          <div
            className="sheldon-card"
            onClick={() => router.push("/interviews")}
            style={{
              padding: "26px 22px",
              border: `0.5px solid ${cardBorder2_4}`,
              borderRadius: 16,
              background: cardBg2_4,
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              minHeight: 220,
            }}
          >
            <div className="card-icon-inner" style={{ width: 42, height: 42, borderRadius: 11, background: dimIconBg, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14, transition: "background 0.2s" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke={dimIconStroke} strokeLinecap="round" strokeLinejoin="round" style={{ transition: "stroke 0.2s" }}>
                <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/>
                <path d="M19 10v2a7 7 0 01-14 0v-2"/>
                <line x1="12" y1="19" x2="12" y2="23"/>
                <line x1="8" y1="23" x2="16" y2="23"/>
              </svg>
            </div>
            <div style={{ fontSize: 15, fontWeight: 500, color: isDark ? "#fafaf5" : "#0a0a12", marginBottom: 6 }}>AI interviews</div>
            <div style={{ fontSize: 12, lineHeight: 1.65, color: dimDescColor, flex: 1 }}>Practice with alumni interviewers for Harvard, Yale, Princeton, Stanford, and MIT. Voice mode included with per-answer feedback.</div>
            <div className="card-open-link" style={{ fontSize: 11, fontWeight: 500, color: dimLinkColor, marginTop: 16, transition: "color 0.2s" }}>Open →</div>
          </div>

        </div>

      </div>
    </div>
  );
}
