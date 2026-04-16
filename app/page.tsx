"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const router = useRouter();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) {
        router.push("/dashboard");
      } else {
        setReady(true);
      }
    });
  }, [router]);

  if (!ready) {
    return (
      <div style={{ background: "#FAFAF8", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <style>{`@keyframes _spin { to { transform: rotate(360deg); } }`}</style>
        <div style={{ width: 28, height: 28, border: "2px solid rgba(154,112,64,0.2)", borderTop: "2px solid #9a7040", borderRadius: "50%", animation: "_spin 0.8s linear infinite" }} />
      </div>
    );
  }

  return <LandingPage />;
}

// ─── University colours ───────────────────────────────────────────────────────
const UNIS = [
  { initials: "H",  name: "Harvard",        color: "#A51C30" },
  { initials: "MIT",name: "MIT",            color: "#750014" },
  { initials: "S",  name: "Stanford",       color: "#8C1515" },
  { initials: "P",  name: "Princeton",      color: "#FF8F00" },
  { initials: "Y",  name: "Yale",           color: "#00356B" },
  { initials: "C",  name: "Columbia",       color: "#003087" },
  { initials: "U",  name: "Penn",           color: "#011F5B" },
  { initials: "B",  name: "Brown",          color: "#4E3629" },
  { initials: "D",  name: "Duke",           color: "#003087" },
  { initials: "NW", name: "Northwestern",   color: "#4E2A84" },
  { initials: "G",  name: "Georgetown",     color: "#041E42" },
  { initials: "V",  name: "Vanderbilt",     color: "#866D4B" },
  { initials: "D",  name: "Dartmouth",      color: "#00693E" },
  { initials: "Co", name: "Cornell",        color: "#B31B1B" },
  { initials: "R",  name: "Rice",           color: "#003C71" },
  { initials: "T",  name: "Tufts",          color: "#3E8EDE" },
  { initials: "JH", name: "Johns Hopkins",  color: "#002D72" },
  { initials: "W",  name: "WashU",          color: "#A51417" },
  { initials: "E",  name: "Emory",          color: "#012169" },
  { initials: "N",  name: "Notre Dame",     color: "#0C2340" },
];

function LandingPage() {
  const router = useRouter();

  const gold    = "#9a7040";
  const goldLt  = "rgba(154,112,64,0.12)";
  const bg      = "#FAFAF8";
  const darkBg  = "#0a0a12";
  const text    = "#0a0a12";
  const textDk  = "#FAFAF8";
  const muted   = "rgba(10,10,18,0.50)";
  const mutedDk = "rgba(250,250,245,0.55)";
  const border  = "rgba(10,10,18,0.10)";
  const surface = "#ffffff";

  return (
    <div style={{ background: bg, color: text, fontFamily: "Georgia, 'Times New Roman', serif", minHeight: "100vh", overflowX: "hidden" }}>

      {/* ── keyframes ──────────────────────────────────────────────────────── */}
      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hero-fade { animation: fadeUp 0.7s ease both; }
        .hero-fade-2 { animation: fadeUp 0.7s 0.15s ease both; }
        .hero-fade-3 { animation: fadeUp 0.7s 0.3s ease both; }
        a { text-decoration: none; }
        * { box-sizing: border-box; }
      `}</style>

      {/* ════════════════════════════════════════════════════════════════════
          NAV
      ═════════════════════════════════════════════════════════════════════ */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 clamp(1.25rem,4vw,3rem)", height: 60,
        background: "rgba(250,250,248,0.92)", backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${border}`,
      }}>
        <span style={{ fontFamily: "Georgia, serif", fontSize: "1.3rem", fontWeight: 600, letterSpacing: "-0.02em", color: text }}>
          Sheldon<span style={{ color: gold }}>AI</span>
        </span>

        <div style={{ display: "flex", gap: "clamp(0.75rem,2vw,1.5rem)", alignItems: "center" }}>
          <a href="#features" style={{ fontSize: 13, color: muted, fontFamily: "system-ui,sans-serif" }}
            onMouseOver={e => (e.currentTarget.style.color = text)}
            onMouseOut={e => (e.currentTarget.style.color = muted)}>Features</a>
          <a href="#pricing" style={{ fontSize: 13, color: muted, fontFamily: "system-ui,sans-serif" }}
            onMouseOver={e => (e.currentTarget.style.color = text)}
            onMouseOut={e => (e.currentTarget.style.color = muted)}>Pricing</a>
          <button onClick={() => router.push("/signup")}
            style={{ background: "none", border: `1px solid ${border}`, color: text, borderRadius: 8, padding: "6px 18px", fontSize: 13, cursor: "pointer", fontFamily: "system-ui,sans-serif", transition: "border-color 0.15s" }}
            onMouseOver={e => (e.currentTarget.style.borderColor = gold)}
            onMouseOut={e => (e.currentTarget.style.borderColor = border)}>
            Sign in
          </button>
          <button onClick={() => router.push("/signup")}
            style={{ background: gold, border: "none", color: "#fff", borderRadius: 8, padding: "7px 18px", fontSize: 13, fontWeight: 600, cursor: "pointer", fontFamily: "system-ui,sans-serif" }}>
            Get started free
          </button>
        </div>
      </nav>

      {/* ════════════════════════════════════════════════════════════════════
          HERO
      ═════════════════════════════════════════════════════════════════════ */}
      <section style={{
        paddingTop: "clamp(130px,16vw,190px)", paddingBottom: "clamp(80px,10vw,120px)",
        paddingLeft: "clamp(1.25rem,4vw,3rem)", paddingRight: "clamp(1.25rem,4vw,3rem)",
        textAlign: "center", maxWidth: 920, margin: "0 auto",
      }}>
        <div className="hero-fade" style={{
          display: "inline-block", background: goldLt,
          border: `1px solid rgba(154,112,64,0.30)`, borderRadius: 100,
          padding: "4px 14px", fontSize: 11, color: gold,
          letterSpacing: "0.07em", textTransform: "uppercase",
          fontFamily: "system-ui,sans-serif", marginBottom: "1.75rem",
        }}>
          Harvard-founded · AI college counselor
        </div>

        <h1 className="hero-fade-2" style={{
          fontSize: "clamp(2.6rem,7vw,5rem)", fontWeight: 600,
          lineHeight: 1.08, letterSpacing: "-0.03em", margin: "0 0 1.5rem", color: text,
        }}>
          Every sentence in your essay,<br />
          <em style={{ color: gold, fontStyle: "italic" }}>surgically annotated.</em>
        </h1>

        <p className="hero-fade-3" style={{
          fontSize: "clamp(1rem,2vw,1.15rem)", color: muted, lineHeight: 1.7,
          maxWidth: 560, margin: "0 auto 2.5rem",
          fontFamily: "system-ui,sans-serif",
        }}>
          SheldonAI reads every sentence of your college essay and tells you exactly
          what is weak, what is strong, and why — with the precision of an elite
          private counselor charging $500 an hour.
        </p>

        <div className="hero-fade-3" style={{ display: "flex", gap: "0.875rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={() => router.push("/signup")}
            style={{ background: gold, color: "#fff", border: "none", borderRadius: 10, padding: "14px 32px", fontSize: 15, fontWeight: 600, cursor: "pointer", fontFamily: "system-ui,sans-serif", transition: "opacity 0.15s" }}
            onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
            onMouseOut={e => (e.currentTarget.style.opacity = "1")}>
            Annotate my essay — free
          </button>
          <button onClick={() => router.push("/signup")}
            style={{ background: "none", color: text, border: `1px solid ${border}`, borderRadius: 10, padding: "14px 32px", fontSize: 15, cursor: "pointer", fontFamily: "system-ui,sans-serif", transition: "border-color 0.15s" }}
            onMouseOver={e => (e.currentTarget.style.borderColor = gold)}
            onMouseOut={e => (e.currentTarget.style.borderColor = border)}>
            See how it works ↓
          </button>
        </div>

        <p style={{ marginTop: "1.25rem", fontSize: 12, color: "rgba(10,10,18,0.30)", fontFamily: "system-ui,sans-serif" }}>
          No credit card required · Free forever on the essay annotator
        </p>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          ANIMATED UNIVERSITY SCROLL
      ═════════════════════════════════════════════════════════════════════ */}
      <div style={{ borderTop: `1px solid ${border}`, borderBottom: `1px solid ${border}`, padding: "0", overflow: "hidden", background: surface }}>
        <div style={{ overflow: "hidden", position: "relative" }}>
          {/* Fade edges */}
          <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to right, ${surface}, transparent)`, zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", right: 0, top: 0, bottom: 0, width: 80, background: `linear-gradient(to left, ${surface}, transparent)`, zIndex: 2, pointerEvents: "none" }} />

          <div style={{
            display: "flex", alignItems: "center",
            animation: "marquee 35s linear infinite",
            width: "max-content",
          }}>
            {/* Duplicate list for seamless loop */}
            {[...UNIS, ...UNIS].map((u, i) => (
              <div key={i} style={{
                display: "flex", alignItems: "center", gap: 8,
                padding: "14px 28px", flexShrink: 0, whiteSpace: "nowrap",
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: 4, flexShrink: 0,
                  background: u.color, display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 8, fontWeight: 700, color: "#fff", letterSpacing: "0.02em",
                  fontFamily: "system-ui,sans-serif",
                }}>
                  {u.initials}
                </div>
                <span style={{ fontSize: 13, color: muted, fontFamily: "system-ui,sans-serif", fontWeight: 500 }}>{u.name}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{ textAlign: "center", fontSize: 11, color: "rgba(10,10,18,0.25)", padding: "6px 0 10px", fontFamily: "system-ui,sans-serif" }}>
          Used by admitted students at top universities
        </p>
      </div>

      {/* ════════════════════════════════════════════════════════════════════
          DARK PACKAGING SECTION — The Difference
      ═════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: darkBg, color: textDk, padding: "clamp(80px,10vw,120px) clamp(1.25rem,4vw,3rem)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <p style={{ fontSize: 11, color: gold, textTransform: "uppercase", letterSpacing: "0.09em", textAlign: "center", fontFamily: "system-ui,sans-serif", marginBottom: "0.75rem" }}>
            Why it works
          </p>
          <h2 style={{ fontSize: "clamp(1.8rem,4vw,3rem)", fontWeight: 600, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "clamp(2.5rem,4vw,4rem)", color: textDk }}>
            Other tools give you feedback.<br />
            <span style={{ color: gold }}>We give you a diagnosis.</span>
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: "1.5rem" }}>

            {/* Everyone else */}
            <div style={{ background: "rgba(250,250,248,0.04)", border: "1px solid rgba(250,250,248,0.09)", borderRadius: 16, padding: "2rem" }}>
              <div style={{ fontSize: 10, color: mutedDk, textTransform: "uppercase", letterSpacing: "0.09em", fontFamily: "system-ui,sans-serif", marginBottom: "1rem" }}>
                Every competitor
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem", lineHeight: 1.3, color: textDk }}>Paragraph-level vagueness</h3>
              <p style={{ fontSize: 14, color: mutedDk, lineHeight: 1.7, fontFamily: "system-ui,sans-serif" }}>
                &ldquo;Your second paragraph lacks specificity.&rdquo; Useful for an English teacher.
                Useless for a student with 10 days until the Common App deadline.
                Which sentence? What word? What do I actually change?
              </p>
            </div>

            {/* SheldonAI */}
            <div style={{ background: "rgba(154,112,64,0.08)", border: "1px solid rgba(154,112,64,0.30)", borderRadius: 16, padding: "2rem", position: "relative" }}>
              <div style={{ position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)", background: gold, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", padding: "3px 12px", borderRadius: "0 0 8px 8px", fontFamily: "system-ui,sans-serif" }}>
                SheldonAI
              </div>
              <div style={{ fontSize: 10, color: gold, textTransform: "uppercase", letterSpacing: "0.09em", fontFamily: "system-ui,sans-serif", marginBottom: "1rem" }}>
                Sentence-level precision
              </div>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: "0.75rem", lineHeight: 1.3, color: textDk }}>27 named diagnostic categories</h3>
              <p style={{ fontSize: 14, color: mutedDk, lineHeight: 1.7, fontFamily: "system-ui,sans-serif" }}>
                Every sentence is tagged — <em style={{ color: "#e8d5b7" }}>weak_hook</em>,{" "}
                <em style={{ color: "#e8d5b7" }}>show_dont_tell</em>,{" "}
                <em style={{ color: "#e8d5b7" }}>lacks_specificity</em> — plus a Socratic question
                and a directional structural example. Never your sentence rewritten. Always your thinking sharpened.
              </p>
            </div>

          </div>

          {/* 5 catastrophic mistakes */}
          <div style={{ marginTop: "3rem", background: "rgba(250,250,248,0.03)", border: "1px solid rgba(250,250,248,0.08)", borderRadius: 14, padding: "1.75rem 2rem" }}>
            <div style={{ fontSize: 12, color: mutedDk, fontFamily: "system-ui,sans-serif", marginBottom: "1rem", letterSpacing: "0.02em" }}>
              Five catastrophic mistakes detected automatically:
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}>
              {["Phony transformation", "Peachy keen", "Bandwagon", "Forced drama", "Borrowed voice"].map(m => (
                <span key={m} style={{ background: "rgba(248,113,113,0.12)", border: "0.5px solid rgba(248,113,113,0.30)", borderRadius: 6, padding: "4px 12px", fontSize: 12, color: "#fca5a5", fontFamily: "system-ui,sans-serif" }}>
                  {m}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FEATURES GRID
      ═════════════════════════════════════════════════════════════════════ */}
      <section id="features" style={{ padding: "clamp(80px,10vw,120px) clamp(1.25rem,4vw,3rem)" }}>
        <div style={{ maxWidth: 1080, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 600, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "0.75rem", color: text }}>
            Everything a great counselor does,
          </h2>
          <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 600, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "3.5rem", color: gold, fontStyle: "italic" }}>
            available at 2am.
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px,1fr))", gap: "1.25rem" }}>
            {[
              {
                icon: "✦",
                title: "Sentence-level essay annotator",
                body: "27 named diagnostic categories — from weak_hook to phony_transformation. Every annotated sentence gets a Socratic question and a structural example. Never your essay rewritten. Always your thinking sharpened.",
              },
              {
                icon: "◆",
                title: "Memorability score & verdict",
                body: "A single 0–100 score that predicts whether admissions officers will remember your essay in committee. Plus pass/fail verdicts on your hook and conclusion — the two sentences that matter most.",
              },
              {
                icon: "▲",
                title: "Catastrophic mistake detector",
                body: "Five essay-killers — phony transformation, peachy keen, bandwagon, forced drama, borrowed voice — checked automatically on every submission. Knowing you have one is the entire battle.",
              },
              {
                icon: "●",
                title: "Financial aid: FAFSA & CSS Profile",
                body: "A question-by-question FAFSA companion covering the mistakes that cost families $10,000+. Plus a full CSS Profile guide — home equity traps, non-custodial parent rules, retirement account gotchas.",
              },
              {
                icon: "◇",
                title: "Mock interviewer (100+ schools)",
                body: "School-specific interview simulations for Harvard, Stanford, MIT, Penn, Georgetown, and 100+ other schools. Real questions from recent cycles with evaluations after each answer.",
              },
              {
                icon: "○",
                title: "Strategic school list builder",
                body: "AI-powered college match that weighs GPA, test scores, activities, essays, and financial constraints. Every recommendation explains its reasoning — not just a list, but a strategy.",
              },
            ].map(f => (
              <div key={f.title} style={{
                background: surface, border: `1px solid ${border}`, borderRadius: 14,
                padding: "1.75rem", transition: "border-color 0.2s, box-shadow 0.2s",
              }}
                onMouseOver={e => { e.currentTarget.style.borderColor = gold; e.currentTarget.style.boxShadow = "0 4px 20px rgba(154,112,64,0.10)"; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = border; e.currentTarget.style.boxShadow = "none"; }}
              >
                <div style={{ fontSize: "1.1rem", color: gold, marginBottom: "0.75rem" }}>{f.icon}</div>
                <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "0.5rem", lineHeight: 1.3, color: text }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: muted, lineHeight: 1.65, fontFamily: "system-ui,sans-serif" }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          HOW IT WORKS
      ═════════════════════════════════════════════════════════════════════ */}
      <section style={{ padding: "clamp(60px,8vw,100px) clamp(1.25rem,4vw,3rem)", borderTop: `1px solid ${border}`, background: surface }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 600, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "0.75rem", color: text }}>
            From draft to annotated in
          </h2>
          <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 600, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "3.5rem", color: gold, fontStyle: "italic" }}>
            sixty seconds.
          </h2>

          {[
            { n: "01", title: "Paste your essay", body: "Common App personal statement or any supplemental. 100–650 words. No account required for your first annotation." },
            { n: "02", title: "AI reads every sentence", body: "Claude Opus — the most capable model available — analyzes each sentence against 27 named categories. This takes about 30 seconds." },
            { n: "03", title: "Annotated essay appears", body: "Every sentence is color-coded by severity. Click any highlight for the full annotation: the diagnosis, a Socratic question, and a directional structural example." },
          ].map((step, i) => (
            <div key={step.n} style={{
              display: "flex", gap: "2rem", alignItems: "flex-start",
              padding: "2rem 0",
              borderBottom: i < 2 ? `1px solid ${border}` : "none",
            }}>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "3rem", fontWeight: 600, color: "rgba(154,112,64,0.18)", lineHeight: 1, flexShrink: 0, minWidth: "3.5rem" }}>
                {step.n}
              </div>
              <div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "0.4rem", color: text }}>{step.title}</h3>
                <p style={{ fontSize: 14, color: muted, lineHeight: 1.65, fontFamily: "system-ui,sans-serif" }}>{step.body}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          PRICING
      ═════════════════════════════════════════════════════════════════════ */}
      <section id="pricing" style={{ padding: "clamp(80px,10vw,120px) clamp(1.25rem,4vw,3rem)", borderTop: `1px solid ${border}` }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.5rem)", fontWeight: 600, letterSpacing: "-0.03em", textAlign: "center", marginBottom: "0.75rem", color: text }}>
            Simple pricing
          </h2>
          <p style={{ textAlign: "center", color: muted, fontSize: 15, marginBottom: "3.5rem", fontFamily: "system-ui,sans-serif" }}>
            The annotator is free forever. Upgrade when you need more.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px,1fr))", gap: "1.5rem" }}>

            {/* Free */}
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: "2rem" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, fontFamily: "system-ui,sans-serif", marginBottom: "0.875rem" }}>Free</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "2.5rem", fontWeight: 600, marginBottom: "0.25rem", color: text }}>$0</div>
              <div style={{ fontSize: 13, color: muted, fontFamily: "system-ui,sans-serif", marginBottom: "1.75rem" }}>forever</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {["Essay annotator (unlimited)", "27 annotation categories", "Memorability score", "Hook & conclusion verdict", "Basic school list", "Deadline tracker"].map(item => (
                  <li key={item} style={{ fontSize: 13, display: "flex", alignItems: "flex-start", gap: "0.6rem", fontFamily: "system-ui,sans-serif", color: text }}>
                    <span style={{ color: gold, flexShrink: 0, marginTop: 1 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push("/signup")}
                style={{ width: "100%", background: "none", border: `1px solid ${border}`, color: text, borderRadius: 9, padding: 11, fontSize: 14, cursor: "pointer", fontFamily: "system-ui,sans-serif", transition: "border-color 0.15s" }}
                onMouseOver={e => (e.currentTarget.style.borderColor = gold)}
                onMouseOut={e => (e.currentTarget.style.borderColor = border)}>
                Get started free
              </button>
            </div>

            {/* Premium — highlighted */}
            <div style={{ background: darkBg, border: `1px solid rgba(154,112,64,0.35)`, borderRadius: 16, padding: "2rem", position: "relative" }}>
              <div style={{ position: "absolute", top: -1, right: "1.5rem", background: gold, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.07em", textTransform: "uppercase", padding: "3px 10px", borderRadius: "0 0 8px 8px", fontFamily: "system-ui,sans-serif" }}>
                Most popular
              </div>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: gold, fontFamily: "system-ui,sans-serif", marginBottom: "0.875rem" }}>Premium</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "2.5rem", fontWeight: 600, marginBottom: "0.25rem", color: textDk }}>$25</div>
              <div style={{ fontSize: 13, color: mutedDk, fontFamily: "system-ui,sans-serif", marginBottom: "1.75rem" }}>per month</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {["Everything in Free", "Mock interviewer (100+ schools)", "Full strategic counseling", "Student profile persistence", "Unlimited essay sessions", "FAFSA & CSS Profile companion", "Deadline tracker & alerts"].map(item => (
                  <li key={item} style={{ fontSize: 13, display: "flex", alignItems: "flex-start", gap: "0.6rem", fontFamily: "system-ui,sans-serif", color: textDk }}>
                    <span style={{ color: gold, flexShrink: 0, marginTop: 1 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push("/signup")}
                style={{ width: "100%", background: gold, border: "none", color: "#fff", borderRadius: 9, padding: 11, fontSize: 14, fontWeight: 700, cursor: "pointer", fontFamily: "system-ui,sans-serif", transition: "opacity 0.15s" }}
                onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
                onMouseOut={e => (e.currentTarget.style.opacity = "1")}>
                Build my profile
              </button>
            </div>

            {/* School */}
            <div style={{ background: surface, border: `1px solid ${border}`, borderRadius: 16, padding: "2rem" }}>
              <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: muted, fontFamily: "system-ui,sans-serif", marginBottom: "0.875rem" }}>For schools</div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: "2.5rem", fontWeight: 600, marginBottom: "0.25rem", color: text }}>$5–10</div>
              <div style={{ fontSize: 13, color: muted, fontFamily: "system-ui,sans-serif", marginBottom: "1.75rem" }}>per student / year</div>
              <ul style={{ listStyle: "none", padding: 0, margin: "0 0 2rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                {["Full platform for all students", "Counselor dashboard & oversight", "Bulk school list management", "Progress tracking & reports", "White-label option available", "Volume pricing for districts"].map(item => (
                  <li key={item} style={{ fontSize: 13, display: "flex", alignItems: "flex-start", gap: "0.6rem", fontFamily: "system-ui,sans-serif", color: text }}>
                    <span style={{ color: gold, flexShrink: 0, marginTop: 1 }}>✓</span> {item}
                  </li>
                ))}
              </ul>
              <button onClick={() => router.push("/signup")}
                style={{ width: "100%", background: "none", border: `1px solid ${border}`, color: text, borderRadius: 9, padding: 11, fontSize: 14, cursor: "pointer", fontFamily: "system-ui,sans-serif", transition: "border-color 0.15s" }}
                onMouseOver={e => (e.currentTarget.style.borderColor = gold)}
                onMouseOut={e => (e.currentTarget.style.borderColor = border)}>
                Contact us
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FINAL CTA
      ═════════════════════════════════════════════════════════════════════ */}
      <section style={{ background: darkBg, padding: "clamp(80px,10vw,120px) clamp(1.25rem,4vw,3rem)", textAlign: "center" }}>
        <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 600, letterSpacing: "-0.03em", marginBottom: "1rem", color: textDk }}>
          Your essay has one job:
        </h2>
        <h2 style={{ fontSize: "clamp(1.75rem,4vw,2.75rem)", fontWeight: 600, letterSpacing: "-0.03em", marginBottom: "1.75rem", color: gold, fontStyle: "italic" }}>
          make them remember you.
        </h2>
        <p style={{ color: mutedDk, fontSize: 15, maxWidth: 480, margin: "0 auto 2.5rem", lineHeight: 1.7, fontFamily: "system-ui,sans-serif" }}>
          Paste your draft. Get back exactly what to fix. Ship the best version of your story.
        </p>
        <button onClick={() => router.push("/signup")}
          style={{ background: gold, color: "#fff", border: "none", borderRadius: 10, padding: "15px 40px", fontSize: 16, fontWeight: 600, cursor: "pointer", fontFamily: "system-ui,sans-serif", transition: "opacity 0.15s" }}
          onMouseOver={e => (e.currentTarget.style.opacity = "0.85")}
          onMouseOut={e => (e.currentTarget.style.opacity = "1")}>
          Annotate my essay — it&apos;s free
        </button>
        <p style={{ marginTop: "1rem", fontSize: 12, color: "rgba(250,250,248,0.25)", fontFamily: "system-ui,sans-serif" }}>
          No credit card · No writing for you · Just surgical feedback
        </p>
      </section>

      {/* ════════════════════════════════════════════════════════════════════
          FOOTER
      ═════════════════════════════════════════════════════════════════════ */}
      <footer style={{
        background: darkBg, borderTop: "1px solid rgba(250,250,248,0.08)",
        padding: "2rem clamp(1.25rem,4vw,3rem)",
        display: "flex", flexDirection: "column", gap: "1.25rem",
      }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
          <span style={{ fontFamily: "Georgia, serif", fontSize: "1.15rem", fontWeight: 600, color: textDk, letterSpacing: "-0.02em" }}>
            Sheldon<span style={{ color: gold }}>AI</span>
          </span>
          <div style={{ display: "flex", gap: "1.5rem" }}>
            {["Privacy", "Terms", "Contact"].map(item => (
              <a key={item} href="#" style={{ fontSize: 12, color: "rgba(250,250,248,0.30)", fontFamily: "system-ui,sans-serif", transition: "color 0.15s" }}
                onMouseOver={e => (e.currentTarget.style.color = mutedDk)}
                onMouseOut={e => (e.currentTarget.style.color = "rgba(250,250,248,0.30)")}>
                {item}
              </a>
            ))}
          </div>
          <p style={{ fontSize: 12, color: "rgba(250,250,248,0.25)", margin: 0, fontFamily: "system-ui,sans-serif" }}>
            © 2026 SheldonAI
          </p>
        </div>
        <p style={{ fontSize: 11, color: "rgba(250,250,248,0.22)", fontStyle: "italic", fontFamily: "Georgia, serif", textAlign: "center", margin: 0 }}>
          Designed and built by Harvard University students who know what it takes to get in.
        </p>
      </footer>

    </div>
  );
}
