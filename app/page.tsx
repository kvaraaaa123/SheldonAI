"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

// ─── University data ──────────────────────────────────────────────────────────
const UNIS = [
  { initials: "H",   name: "Harvard",        bg: "#1e3a5f" },
  { initials: "Y",   name: "Yale",           bg: "#00356b" },
  { initials: "P",   name: "Princeton",      bg: "#e77500" },
  { initials: "C",   name: "Columbia",       bg: "#1a1a8e" },
  { initials: "S",   name: "Stanford",       bg: "#8c1515" },
  { initials: "MIT", name: "MIT",            bg: "#a31f34" },
  { initials: "Du",  name: "Duke",           bg: "#003087" },
  { initials: "NW",  name: "Northwestern",   bg: "#4E2A84" },
  { initials: "UP",  name: "UPenn",          bg: "#011F5B" },
  { initials: "UC",  name: "UChicago",       bg: "#800000" },
  { initials: "JH",  name: "Johns Hopkins",  bg: "#002D72" },
  { initials: "B",   name: "UC Berkeley",    bg: "#003262" },
  { initials: "Br",  name: "Brown",          bg: "#4e3629" },
  { initials: "Da",  name: "Dartmouth",      bg: "#00693e" },
  { initials: "Co",  name: "Cornell",        bg: "#b31b1b" },
  { initials: "LA",  name: "UCLA",           bg: "#2774AE" },
];

export default function Home() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(() => {
      setReady(true);
    });
  }, []);

  if (!ready) return (
    <div style={{ background: "#FAFAF8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <style>{`@keyframes _sp{to{transform:rotate(360deg)}}`}</style>
      <div style={{ width: 28, height: 28, border: "2px solid rgba(154,112,64,0.2)", borderTop: "2px solid #9a7040", borderRadius: "50%", animation: "_sp 0.8s linear infinite" }} />
    </div>
  );

  return <Landing />;
}

function Landing() {
  const router = useRouter();

  // ── palette ──────────────────────────────────────────────────────────────
  const gold   = "#9a7040";
  const goldLt = "#C9A96E";
  const bg     = "#FAFAF8";
  const text   = "#0a0a12";
  const darkBg = "#0a0a12";
  const darkTx = "#FAFAF5";
  const muted  = "rgba(10,10,18,0.50)";
  const dMuted = "rgba(250,250,245,0.48)";
  const border = "rgba(10,10,18,0.10)";
  const white  = "#ffffff";

  // ── reusable style fragments ─────────────────────────────────────────────
  const pill = {
    display: "inline-block", background: "rgba(154,112,64,0.10)",
    border: "1px solid rgba(154,112,64,0.28)", borderRadius: 100,
    padding: "4px 14px", fontSize: 11, color: gold,
    letterSpacing: "0.07em", textTransform: "uppercase" as const,
    fontFamily: "system-ui,sans-serif", marginBottom: "1.5rem",
  };

  return (
    <div style={{ background: bg, color: text, fontFamily: "Georgia,'Times New Roman',serif", minHeight: "100vh", overflowX: "hidden" }}>
      <style>{`
        @keyframes marquee{0%{transform:translateX(0)}100%{transform:translateX(-50%)}}
        @keyframes fadeUp{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}
        .fu{animation:fadeUp .65s ease both}
        .fu2{animation:fadeUp .65s .12s ease both}
        .fu3{animation:fadeUp .65s .24s ease both}
        *{box-sizing:border-box}
        a{text-decoration:none}
      `}</style>

      {/* ═══════════════════════════════════════════════════════════════
          NAV
      ════════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(1.5rem,4vw,3rem)", height: 58,
        background: "rgba(250,250,248,0.93)", backdropFilter: "blur(14px)",
        borderBottom: `1px solid ${border}`,
      }}>
        <span style={{ fontFamily: "Georgia,serif", fontSize: "1.25rem", fontWeight: 600, letterSpacing: "-0.02em", color: text }}>
          Sheldon<span style={{ color: gold }}>AI</span>
        </span>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(1rem,2.5vw,2rem)" }}>
          {[["Features","#features"],["How it works","#how-it-works"],["Pricing","#pricing"]].map(([label, href]) => (
            <a key={label} href={href} style={{ fontSize: 13, color: muted, fontFamily: "system-ui,sans-serif", transition: "color .15s" }}
              onMouseOver={e=>(e.currentTarget.style.color=text)}
              onMouseOut={e=>(e.currentTarget.style.color=muted)}>
              {label}
            </a>
          ))}
          <button onClick={() => router.push("/signup")} style={{
            background: text, color: bg, border: "none", borderRadius: 8,
            padding: "8px 20px", fontSize: 13, fontWeight: 600, cursor: "pointer",
            fontFamily: "system-ui,sans-serif", transition: "opacity .15s",
          }}
            onMouseOver={e=>(e.currentTarget.style.opacity="0.82")}
            onMouseOut={e=>(e.currentTarget.style.opacity="1")}>
            Get started
          </button>
        </div>
      </nav>

      {/* ═══════════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ paddingTop: 158, paddingBottom: 100, paddingLeft: 40, paddingRight: 40 }}>
        <div style={{ maxWidth: 820, margin: "0 auto", textAlign: "center" }}>
          <div className="fu" style={pill}>Your personal college admissions advisor</div>

          <h1 className="fu2" style={{ fontSize: "clamp(2.2rem,5.2vw,52px)", fontWeight: 600, lineHeight: 1.09, letterSpacing: "-0.03em", margin: "0 0 1.5rem", color: text }}>
            The counselor every student deserves,<br />
            <em style={{ color: gold, fontStyle: "italic" }}>but few can afford</em>
          </h1>

          <p className="fu3" style={{ fontSize: 17, color: muted, lineHeight: 1.70, maxWidth: 640, margin: "0 auto 2.25rem", fontFamily: "system-ui,sans-serif" }}>
            SheldonAI analyzes your essays line by line, grades your activities list, matches you to the right universities, and packages your entire application into one coherent story — at a fraction of the cost of a human counselor.
          </p>

          <div className="fu3" style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => router.push("/signup")} style={{
              background: text, color: white, border: "none", borderRadius: 10,
              padding: "14px 28px", fontSize: 15, fontWeight: 600, cursor: "pointer",
              fontFamily: "system-ui,sans-serif", transition: "opacity .15s",
            }}
              onMouseOver={e=>(e.currentTarget.style.opacity="0.82")}
              onMouseOut={e=>(e.currentTarget.style.opacity="1")}>
              Build my profile — it&apos;s free
            </button>
            <a href="#how-it-works" style={{
              background: "none", color: text, border: `1.5px solid ${border}`, borderRadius: 10,
              padding: "14px 28px", fontSize: 15, cursor: "pointer", display: "inline-block",
              fontFamily: "system-ui,sans-serif", transition: "border-color .15s",
            }}
              onMouseOver={e=>(e.currentTarget.style.borderColor=gold)}
              onMouseOut={e=>(e.currentTarget.style.borderColor=border)}>
              See how it works
            </a>
          </div>

          <p style={{ marginTop: "1.1rem", fontSize: 12, color: "rgba(10,10,18,0.32)", fontFamily: "system-ui,sans-serif" }}>
            No credit card required · Takes 5 minutes
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          ANIMATED UNIVERSITY SCROLL
      ════════════════════════════════════════════════════════════════ */}
      <div style={{ borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, background: white, paddingBottom: 0 }}>
        <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.09em", color: "rgba(10,10,18,0.35)", textAlign: "center", padding: "10px 0 0", fontFamily: "system-ui,sans-serif" }}>
          Students applying to
        </p>
        <div style={{ overflow: "hidden", position: "relative" }}>
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to right,${white},transparent)`, zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to left,${white},transparent)`, zIndex: 2, pointerEvents: "none" }} />
          <div style={{ display: "flex", width: "max-content", animation: "marquee 28s linear infinite", padding: "12px 0" }}>
            {[...UNIS, ...UNIS].map((u, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 24px", flexShrink: 0, whiteSpace: "nowrap" }}>
                <div style={{ width: 28, height: 28, borderRadius: 5, background: u.bg, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: u.initials.length > 2 ? 7 : 9, fontWeight: 700, color: "#fff", fontFamily: "Georgia,serif", letterSpacing: "0.01em" }}>
                  {u.initials}
                </div>
                <span style={{ fontSize: 14, color: muted, fontFamily: "system-ui,sans-serif", fontWeight: 500 }}>{u.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          DARK PACKAGING SECTION
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: darkBg, color: darkTx, padding: "96px 40px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.09em", color: goldLt, fontFamily: "system-ui,sans-serif", marginBottom: "1.25rem" }}>
            The SheldonAI difference
          </p>
          <h2 style={{ fontSize: "clamp(1.9rem,4vw,44px)", fontWeight: 600, lineHeight: 1.12, letterSpacing: "-0.03em", marginBottom: "1rem", color: darkTx }}>
            Your application is not a collection of documents.{" "}
            <em style={{ color: goldLt, fontStyle: "italic" }}>It is one story.</em>
          </h2>
          <p style={{ fontSize: 16, color: dMuted, lineHeight: 1.65, maxWidth: 600, marginBottom: "3.5rem", fontFamily: "system-ui,sans-serif" }}>
            Most students submit four essays, ten activities, and a list of schools — with no thread connecting them. Admissions officers notice.
          </p>

          {/* Flow diagram */}
          <div style={{ display: "flex", alignItems: "center", marginBottom: "3.5rem", overflowX: "auto", paddingBottom: 8 }}>
            {["Profile", "Activities", "My Colleges", "Essays", "One perfect package"].map((node, i) => (
              <div key={node} style={{ display: "flex", alignItems: "center", flexShrink: 0 }}>
                <div style={{
                  padding: "14px 22px", borderRadius: 10, fontSize: 14, fontWeight: i === 4 ? 600 : 400, fontFamily: "system-ui,sans-serif",
                  background: i === 4 ? "rgba(201,169,110,0.14)" : "rgba(250,250,245,0.06)",
                  border: `1px solid ${i === 4 ? "rgba(201,169,110,0.40)" : "rgba(250,250,245,0.10)"}`,
                  color: i === 4 ? goldLt : darkTx,
                }}>
                  {node}
                </div>
                {i < 4 && (
                  <div style={{ width: 36, height: 1, background: "rgba(250,250,245,0.15)", margin: "0 4px", flexShrink: 0, position: "relative" }}>
                    <span style={{ position: "absolute", right: -4, top: "50%", transform: "translateY(-50%)", color: "rgba(250,250,245,0.25)", fontSize: 12 }}>›</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 2x2 grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1px", background: "rgba(250,250,245,0.08)", borderRadius: 12, overflow: "hidden", marginBottom: "3rem" }}>
            {[
              { n: "01", title: "Essays must add, not repeat", body: "Each essay should reveal a different facet of you. If your Common App essay and a supplemental tell the same story, one of them is wasted." },
              { n: "02", title: "Activities must tell one story", body: "Ten activities with no coherent theme signal a resume-padder. The same ten, framed around a single driving identity, signal someone with purpose." },
              { n: "03", title: "Universities must match your identity", body: "Applying to schools because they are ranked highly is the most common — and most expensive — strategic mistake students make." },
              { n: "04", title: "You must be a full human being", body: "Admissions officers read thousands of applications. They remember the student who came alive on the page. Not the one with the most activities." },
            ].map(c => (
              <div key={c.n} style={{ background: "rgba(250,250,245,0.03)", padding: "2rem", backdropFilter: "none" }}>
                <div style={{ fontSize: 11, color: goldLt, fontFamily: "system-ui,sans-serif", marginBottom: "0.75rem", letterSpacing: "0.05em" }}>{c.n}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: darkTx, lineHeight: 1.3 }}>{c.title}</h3>
                <p style={{ fontSize: 13, color: dMuted, lineHeight: 1.65, fontFamily: "system-ui,sans-serif" }}>{c.body}</p>
              </div>
            ))}
          </div>

          {/* Quote */}
          <div style={{ borderLeft: `3px solid ${goldLt}`, paddingLeft: "1.5rem" }}>
            <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: "1.05rem", color: dMuted, lineHeight: 1.7, margin: 0 }}>
              &ldquo;The strongest applications we see are not the ones with the most impressive credentials. They are the ones where every piece points to the same person.&rdquo;
            </p>
            <p style={{ fontSize: 12, color: "rgba(250,250,245,0.30)", fontFamily: "system-ui,sans-serif", marginTop: "0.75rem" }}>
              — Admissions officer perspective, synthesized from published interviews
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURES GRID
      ════════════════════════════════════════════════════════════════ */}
      <section id="features" style={{ background: white, padding: "96px 40px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.09em", color: gold, fontFamily: "system-ui,sans-serif", marginBottom: "1rem" }}>
            What SheldonAI does
          </p>
          <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,38px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "3.5rem", color: text }}>
            Not AI writing your essays.<br />
            <em style={{ color: gold, fontStyle: "italic" }}>AI helping you write better ones.</em>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", borderTop: `1px solid ${border}`, borderLeft: `1px solid ${border}` }}>
            {[
              {
                icon: "✦",
                title: "Essay annotator",
                body: "Every sentence highlighted and tagged with one of 27 named diagnostic categories — from weak_hook to phony_transformation. Surgical feedback, not vague suggestions.",
              },
              {
                icon: "◆",
                title: "Activities advisor",
                body: "Your activities list graded against what top schools actually look for. Reordering and reframing recommendations that change how officers read your profile.",
              },
              {
                icon: "▲",
                title: "College matching",
                body: "Strategic school list built around your GPA, scores, essays, activities, and financial constraints — with reasoning for every recommendation.",
              },
              {
                icon: "●",
                title: "Why Us research arsenal",
                body: "School-specific intelligence for Why Us supplementals: programs, professors, courses, traditions, and language that signals genuine fit rather than generic flattery.",
              },
              {
                icon: "◇",
                title: "Financial aid: FAFSA & CSS Profile",
                body: "A question-by-question FAFSA companion covering the mistakes that cost families $10,000+. Plus a full CSS Profile guide — home equity traps, non-custodial parent rules, retirement gotchas.",
              },
              {
                icon: "○",
                title: "AI mock interviews",
                body: "School-specific interview simulations for 100+ universities. Real questions from recent cycles, evaluations after each answer, and coaching on tone and structure.",
              },
            ].map((f, i) => (
              <div key={f.title} style={{
                borderRight: `1px solid ${border}`, borderBottom: `1px solid ${border}`,
                padding: "2rem 1.75rem",
                transition: "background .2s",
              }}
                onMouseOver={e=>(e.currentTarget.style.background="rgba(154,112,64,0.04)")}
                onMouseOut={e=>(e.currentTarget.style.background="transparent")}>
                <div style={{ fontSize: "1.1rem", color: gold, marginBottom: "0.875rem" }}>{f.icon}</div>
                <h3 style={{ fontSize: "0.975rem", fontWeight: 600, marginBottom: "0.5rem", color: text, lineHeight: 1.3 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: muted, lineHeight: 1.65, fontFamily: "system-ui,sans-serif", margin: 0 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          HOW IT WORKS
      ════════════════════════════════════════════════════════════════ */}
      <section id="how-it-works" style={{ background: bg, padding: "96px 40px", borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.09em", color: gold, fontFamily: "system-ui,sans-serif", marginBottom: "1rem" }}>
            How it works
          </p>
          <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,38px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.15, marginBottom: "4rem", color: text }}>
            From zero to complete application strategy
          </h2>

          {/* Step row */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 0, position: "relative" }}>
            {/* Connecting line */}
            <div style={{ position: "absolute", top: 20, left: "calc(20px + 2px)", right: "calc(20px + 2px)", height: 1, background: border, zIndex: 0 }} />

            {[
              { n: "1", title: "Build your profile", body: "Enter your grades, test scores, activities, and the schools you're thinking about. Takes 5 minutes." },
              { n: "2", title: "Get your strategy", body: "SheldonAI analyzes your full profile and returns a detailed admissions strategy: school list, essay angles, activities framing, financial aid roadmap." },
              { n: "3", title: "Execute with AI coaching", body: "Work through each component with AI tools built for that exact task — essay annotator, interview simulator, Why Us builder, financial aid companion." },
            ].map((step) => (
              <div key={step.n} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "flex-start", position: "relative", zIndex: 1, paddingRight: "2rem" }}>
                <div style={{ width: 40, height: 40, borderRadius: "50%", background: white, border: `1.5px solid ${border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginBottom: "1.25rem" }}>
                  <span style={{ fontFamily: "Georgia,serif", fontSize: 15, fontWeight: 600, color: gold }}>{step.n}</span>
                </div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", color: text, lineHeight: 1.3 }}>{step.title}</h3>
                <p style={{ fontSize: 13, color: muted, lineHeight: 1.65, fontFamily: "system-ui,sans-serif", margin: 0 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          PRICING
      ════════════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ background: white, padding: "96px 40px", borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <p style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: "0.09em", color: gold, fontFamily: "system-ui,sans-serif", marginBottom: "1rem" }}>
            Pricing
          </p>
          <h2 style={{ fontSize: "clamp(1.6rem,3.5vw,38px)", fontWeight: 600, letterSpacing: "-0.03em", marginBottom: "0.75rem", color: text }}>
            Simple pricing. No hidden fees.
          </h2>
          <p style={{ fontSize: 15, color: muted, fontFamily: "system-ui,sans-serif", marginBottom: "3.5rem" }}>
            A private counselor charges $150–300 per hour. We charge $29 per month.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem", alignItems: "start" }}>

            {/* Explorer */}
            <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: "2rem" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, fontFamily: "system-ui,sans-serif", marginBottom: "0.875rem" }}>Explorer</div>
              <div style={{ fontFamily: "Georgia,serif", fontSize: "2.5rem", fontWeight: 600, color: text, marginBottom: "0.2rem" }}>$0</div>
              <div style={{ fontSize: 13, color: muted, fontFamily: "system-ui,sans-serif", marginBottom: "1.75rem" }}>free forever</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {["Essay annotator (unlimited)", "27 annotation categories", "Memorability score & verdict", "Basic college matching", "Deadline tracker"].map(item => (
                  <li key={item} style={{ fontSize: 13, color: text, display: "flex", gap: "0.5rem", alignItems: "flex-start", fontFamily: "system-ui,sans-serif" }}>
                    <span style={{ color: gold, flexShrink: 0, marginTop: 1 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push("/signup")} style={{ width: "100%", background: "none", border: `1.5px solid ${border}`, color: text, borderRadius: 9, padding: "11px", fontSize: 14, cursor: "pointer", fontFamily: "system-ui,sans-serif", transition: "border-color .15s" }}
                onMouseOver={e=>(e.currentTarget.style.borderColor=gold)}
                onMouseOut={e=>(e.currentTarget.style.borderColor=border)}>
                Get started free
              </button>
            </div>

            {/* Scholar — featured */}
            <div style={{ background: darkBg, border: `1.5px solid rgba(201,169,110,0.40)`, borderRadius: 16, padding: "2rem", position: "relative" }}>
              <div style={{ position: "absolute", top: -1, right: "1.5rem", background: gold, color: white, fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "0 0 8px 8px", fontFamily: "system-ui,sans-serif" }}>
                Most popular
              </div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: goldLt, fontFamily: "system-ui,sans-serif", marginBottom: "0.875rem" }}>Scholar</div>
              <div style={{ fontFamily: "Georgia,serif", fontSize: "2.5rem", fontWeight: 600, color: darkTx, marginBottom: "0.2rem" }}>$29</div>
              <div style={{ fontSize: 13, color: dMuted, fontFamily: "system-ui,sans-serif", marginBottom: "1.75rem" }}>per month</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {["Everything in Explorer", "Activities advisor & grader", "Full college matching strategy", "Why Us research arsenal", "FAFSA & CSS Profile companion", "Student profile persistence"].map(item => (
                  <li key={item} style={{ fontSize: 13, color: darkTx, display: "flex", gap: "0.5rem", alignItems: "flex-start", fontFamily: "system-ui,sans-serif" }}>
                    <span style={{ color: goldLt, flexShrink: 0, marginTop: 1 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push("/signup")} style={{ width: "100%", background: gold, border: "none", color: white, borderRadius: 9, padding: "11px", fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "system-ui,sans-serif", transition: "opacity .15s" }}
                onMouseOver={e=>(e.currentTarget.style.opacity="0.85")}
                onMouseOut={e=>(e.currentTarget.style.opacity="1")}>
                Build my profile
              </button>
            </div>

            {/* Counselor */}
            <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 16, padding: "2rem" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, fontFamily: "system-ui,sans-serif", marginBottom: "0.875rem" }}>Counselor</div>
              <div style={{ fontFamily: "Georgia,serif", fontSize: "2.5rem", fontWeight: 600, color: text, marginBottom: "0.2rem" }}>$99</div>
              <div style={{ fontSize: 13, color: muted, fontFamily: "system-ui,sans-serif", marginBottom: "1.75rem" }}>per month</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {["Everything in Scholar", "AI mock interviews (100+ schools)", "Priority support & strategy reviews", "School-specific insider research", "Deadline alerts & reminders", "Stripe payments & receipts"].map(item => (
                  <li key={item} style={{ fontSize: 13, color: text, display: "flex", gap: "0.5rem", alignItems: "flex-start", fontFamily: "system-ui,sans-serif" }}>
                    <span style={{ color: gold, flexShrink: 0, marginTop: 1 }}>✓</span>{item}
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push("/signup")} style={{ width: "100%", background: "none", border: `1.5px solid ${border}`, color: text, borderRadius: 9, padding: "11px", fontSize: 14, cursor: "pointer", fontFamily: "system-ui,sans-serif", transition: "border-color .15s" }}
                onMouseOver={e=>(e.currentTarget.style.borderColor=gold)}
                onMouseOut={e=>(e.currentTarget.style.borderColor=border)}>
                Get started
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA
      ════════════════════════════════════════════════════════════════ */}
      <section style={{ background: darkBg, padding: "96px 40px", textAlign: "center" }}>
        <div style={{ maxWidth: 700, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.75rem,4vw,44px)", fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.12, color: darkTx, marginBottom: "1.75rem" }}>
            Your counselor was always{" "}
            <em style={{ color: goldLt, fontStyle: "italic" }}>supposed to do this.</em>
          </h2>
          <p style={{ fontSize: 16, color: dMuted, lineHeight: 1.7, marginBottom: "2.5rem", fontFamily: "system-ui,sans-serif" }}>
            Most students never get one. Now they don&apos;t need one.
          </p>
          <button onClick={() => router.push("/signup")} style={{
            background: gold, color: white, border: "none", borderRadius: 10,
            padding: "15px 38px", fontSize: 16, fontWeight: 600, cursor: "pointer",
            fontFamily: "system-ui,sans-serif", transition: "opacity .15s",
          }}
            onMouseOver={e=>(e.currentTarget.style.opacity="0.85")}
            onMouseOut={e=>(e.currentTarget.style.opacity="1")}>
            Build my profile — it&apos;s free
          </button>
          <p style={{ marginTop: "1rem", fontSize: 12, color: "rgba(250,250,245,0.28)", fontFamily: "system-ui,sans-serif" }}>
            No credit card required · Takes 5 minutes
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FOOTER
      ════════════════════════════════════════════════════════════════ */}
      <footer style={{
        background: darkBg, borderTop: "1px solid rgba(250,250,245,0.07)",
        padding: "1.75rem clamp(1.5rem,4vw,3rem)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: "1rem",
      }}>
        <span style={{ fontFamily: "Georgia,serif", fontSize: "1.15rem", fontWeight: 600, color: darkTx, letterSpacing: "-0.02em" }}>
          Sheldon<span style={{ color: gold }}>AI</span>
        </span>
        <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: 11, color: "rgba(250,250,245,0.28)", margin: 0, textAlign: "center", flex: 1 }}>
          Designed and built by Harvard University students who know what it takes to get in.
        </p>
        <p style={{ fontSize: 12, color: "rgba(250,250,245,0.25)", margin: 0, fontFamily: "system-ui,sans-serif", whiteSpace: "nowrap" }}>
          © 2025 SheldonAI
        </p>
      </footer>

    </div>
  );
}
