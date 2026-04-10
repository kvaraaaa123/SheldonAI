"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useTheme } from "@/context/ThemeContext";

type FormData = {
  full_name: string;
  birthday: string;
  gender: string;
  ethnicity: string;
  ethnicity_other: string;
  religion: string;
  religion_other: string;
  ability_to_pay: string;
  education_status: string;
  high_school_name: string;
  gpa: string;
  graduation_year: string;
  class_rank: string;
  start_semester: string;
  sat_math: string;
  sat_english: string;
  act: string;
  country: string;
  state: string;
  zip_code: string;
  phone: string;
};

const INITIAL: FormData = {
  full_name: "", birthday: "", gender: "",
  ethnicity: "", ethnicity_other: "", religion: "", religion_other: "",
  ability_to_pay: "", education_status: "",
  high_school_name: "", gpa: "", graduation_year: "", class_rank: "", start_semester: "",
  sat_math: "", sat_english: "", act: "",
  country: "", state: "", zip_code: "", phone: "",
};

export default function ProfileOnboarding({ userId, onComplete }: { userId: string; onComplete: () => void }) {
  const { isDark } = useTheme();
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormData>(INITIAL);
  const [transitioning, setTransitioning] = useState(false);
  const [saving, setSaving] = useState(false);

  const gold    = isDark ? "#C9A96E" : "#9a7040";
  const bg      = isDark ? "#080810" : "#FAFAF5";
  const surface = isDark ? "#0f0f1a" : "#ffffff";
  const border  = isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.09)";
  const text    = isDark ? "#FAFAF5" : "#0a0a12";
  const muted   = isDark ? "rgba(250,250,245,0.45)" : "rgba(10,10,18,0.45)";

  const inputStyle: React.CSSProperties = {
    border: `0.5px solid ${border}`, borderRadius: 8,
    padding: "10px 12px", fontSize: 14, width: "100%",
    background: surface, color: text, outline: "none",
    boxSizing: "border-box",
  };

  const selectStyle: React.CSSProperties = { ...inputStyle, cursor: "pointer" };

  function set(key: keyof FormData, value: string) {
    setFormData(prev => ({ ...prev, [key]: value }));
  }

  function Pill({ label, field, value }: { label: string; field: keyof FormData; value: string }) {
    const selected = formData[field] === value;
    return (
      <button
        type="button"
        onClick={() => set(field, selected ? "" : value)}
        style={{
          border: `0.5px solid ${selected ? gold : border}`,
          borderRadius: 20, padding: "6px 14px", fontSize: 13,
          background: selected ? (isDark ? "rgba(201,169,110,0.12)" : "rgba(154,112,64,0.10)") : "transparent",
          color: selected ? gold : muted,
          cursor: "pointer", transition: "all 0.15s",
        }}
      >
        {label}
      </button>
    );
  }

  function Label({ children }: { children: React.ReactNode }) {
    return (
      <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", color: muted, marginBottom: 8 }}>
        {children}
      </div>
    );
  }

  function Field({ children }: { children: React.ReactNode }) {
    return <div style={{ marginBottom: 22 }}>{children}</div>;
  }

  async function advance() {
    if (step < 3) {
      setTransitioning(true);
      setTimeout(() => { setStep(s => s + 1); setTransitioning(false); }, 200);
    } else {
      setSaving(true);
      await supabase.from("profiles").upsert({
        user_id: userId,
        full_name: formData.full_name || null,
        birthday: formData.birthday || null,
        gender: formData.gender || null,
        ethnicity: formData.ethnicity || null,
        ethnicity_other: formData.ethnicity_other || null,
        religion: formData.religion || null,
        religion_other: formData.religion_other || null,
        ability_to_pay: formData.ability_to_pay || null,
        education_status: formData.education_status || null,
        high_school_name: formData.high_school_name || null,
        gpa: formData.gpa ? parseFloat(formData.gpa) : null,
        graduation_year: formData.graduation_year || null,
        class_rank: formData.class_rank || null,
        start_semester: formData.start_semester || null,
        sat_math: formData.sat_math ? parseInt(formData.sat_math) : null,
        sat_english: formData.sat_english ? parseInt(formData.sat_english) : null,
        act: formData.act ? parseInt(formData.act) : null,
        country: formData.country || null,
        state: formData.state || null,
        zip_code: formData.zip_code || null,
        phone: formData.phone || null,
        onboarding_complete: true,
        updated_at: new Date().toISOString(),
      });
      setSaving(false);
      onComplete();
    }
  }

  function skip() {
    if (step < 3) {
      setTransitioning(true);
      setTimeout(() => { setStep(s => s + 1); setTransitioning(false); }, 200);
    } else {
      onComplete();
    }
  }

  const steps = ["About you", "Background", "High school", "Scores & location"];

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 0 40px" }}>

      {/* Progress dots */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 32 }}>
        <div style={{ display: "flex", gap: 10, marginBottom: 8 }}>
          {steps.map((_, i) => (
            <div key={i} style={{
              borderRadius: "50%",
              width: i === step ? 10 : i < step ? 8 : 8,
              height: i === step ? 10 : i < step ? 8 : 8,
              background: i <= step ? gold : border,
              opacity: i > step ? 0.4 : 1,
              transition: "all 0.2s",
            }} />
          ))}
        </div>
        <div style={{ fontSize: 11, color: muted }}>Step {step + 1} of 4</div>
      </div>

      {/* Content with fade+slide animation */}
      <div style={{
        opacity: transitioning ? 0 : 1,
        transform: transitioning ? "translateY(8px)" : "translateY(0)",
        transition: "opacity 0.2s, transform 0.2s",
      }}>

        {/* Step 0 — About you */}
        {step === 0 && (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 500, marginBottom: 28, color: text }}>
              First, tell us about yourself
            </h2>
            <Field>
              <Label>Full name</Label>
              <input style={inputStyle} type="text" placeholder="Your full name"
                value={formData.full_name} onChange={e => set("full_name", e.target.value)} />
            </Field>
            <Field>
              <Label>Date of birth</Label>
              <input style={inputStyle} type="date"
                value={formData.birthday} onChange={e => set("birthday", e.target.value)} />
            </Field>
            <Field>
              <Label>Gender</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Male", "Female", "Non-binary", "Prefer not to say", "N/A"].map(v => (
                  <Pill key={v} label={v} field="gender" value={v} />
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* Step 1 — Background */}
        {step === 1 && (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 500, marginBottom: 28, color: text }}>
              A little about your background
            </h2>
            <Field>
              <Label>Ethnicity</Label>
              <select style={selectStyle} value={formData.ethnicity} onChange={e => set("ethnicity", e.target.value)}>
                <option value="">Select…</option>
                {["American Indian/Alaska Native","Asian","Black/African American","Hispanic/Latino","Native Hawaiian/Pacific Islander","White/Caucasian","Two or more races","Prefer not to say","N/A"].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              {formData.ethnicity === "N/A" && (
                <input style={{ ...inputStyle, marginTop: 8 }} type="text" placeholder="Please specify"
                  value={formData.ethnicity_other} onChange={e => set("ethnicity_other", e.target.value)} />
              )}
            </Field>
            <Field>
              <Label>Religion</Label>
              <select style={selectStyle} value={formData.religion} onChange={e => set("religion", e.target.value)}>
                <option value="">Select…</option>
                {["Agnostic","Atheist","Buddhist","Catholic","Christian (Protestant)","Eastern Orthodox","Hindu","Jewish","Muslim","Sikh","Other","Prefer not to say","N/A"].map(v => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
              {formData.religion === "N/A" && (
                <input style={{ ...inputStyle, marginTop: 8 }} type="text" placeholder="Please specify"
                  value={formData.religion_other} onChange={e => set("religion_other", e.target.value)} />
              )}
            </Field>
            <Field>
              <Label>Ability to pay for college</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Full Pay", "Need Financial Aid", "Partial Aid", "Not Sure", "N/A"].map(v => (
                  <Pill key={v} label={v} field="ability_to_pay" value={v} />
                ))}
              </div>
            </Field>
            <Field>
              <Label>Current grade</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Sophomore", "Junior", "Senior", "Gap Year", "Other", "N/A"].map(v => (
                  <Pill key={v} label={v} field="education_status" value={v} />
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* Step 2 — High school */}
        {step === 2 && (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 500, marginBottom: 28, color: text }}>
              Tell us about your high school
            </h2>
            <Field>
              <Label>High school name</Label>
              <input style={inputStyle} type="text" placeholder="e.g. Milton Academy"
                value={formData.high_school_name} onChange={e => set("high_school_name", e.target.value)} />
            </Field>
            <Field>
              <Label>GPA (out of 4.0)</Label>
              <input style={inputStyle} type="number" min={0} max={4} step={0.01} placeholder="e.g. 3.85"
                value={formData.gpa} onChange={e => set("gpa", e.target.value)} />
            </Field>
            <Field>
              <Label>Graduation year</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["2025", "2026", "2027", "2028", "Other"].map(v => (
                  <Pill key={v} label={v} field="graduation_year" value={v} />
                ))}
              </div>
            </Field>
            <Field>
              <Label>Class rank</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Top 1%", "Top 5%", "Top 10%", "Top 25%", "Top 50%", "Not ranked", "N/A"].map(v => (
                  <Pill key={v} label={v} field="class_rank" value={v} />
                ))}
              </div>
            </Field>
            <Field>
              <Label>When do you hope to start college?</Label>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["Fall 2025", "Spring 2026", "Fall 2026", "Spring 2027", "Fall 2027", "Not sure"].map(v => (
                  <Pill key={v} label={v} field="start_semester" value={v} />
                ))}
              </div>
            </Field>
          </div>
        )}

        {/* Step 3 — Scores & location */}
        {step === 3 && (
          <div>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 500, marginBottom: 28, color: text }}>
              Test scores & where you&apos;re from
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field>
                <Label>SAT Math</Label>
                <input style={inputStyle} type="number" min={200} max={800} placeholder="200–800"
                  value={formData.sat_math} onChange={e => set("sat_math", e.target.value)} />
              </Field>
              <Field>
                <Label>SAT Reading/Writing</Label>
                <input style={inputStyle} type="number" min={200} max={800} placeholder="200–800"
                  value={formData.sat_english} onChange={e => set("sat_english", e.target.value)} />
              </Field>
            </div>
            <Field>
              <Label>ACT</Label>
              <input style={{ ...inputStyle, maxWidth: 160 }} type="number" min={1} max={36} placeholder="1–36"
                value={formData.act} onChange={e => set("act", e.target.value)} />
            </Field>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field>
                <Label>Country</Label>
                <input style={inputStyle} type="text" placeholder="e.g. United States"
                  value={formData.country} onChange={e => set("country", e.target.value)} />
              </Field>
              <Field>
                <Label>State / Province</Label>
                <input style={inputStyle} type="text" placeholder="e.g. Massachusetts"
                  value={formData.state} onChange={e => set("state", e.target.value)} />
              </Field>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <Field>
                <Label>ZIP / Postal code</Label>
                <input style={inputStyle} type="text" placeholder="e.g. 02138"
                  value={formData.zip_code} onChange={e => set("zip_code", e.target.value)} />
              </Field>
              <Field>
                <Label>Phone number</Label>
                <input style={inputStyle} type="text" placeholder="e.g. +1 617 555 0100"
                  value={formData.phone} onChange={e => set("phone", e.target.value)} />
              </Field>
            </div>
          </div>
        )}

      </div>

      {/* Actions */}
      <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
        <button
          onClick={advance}
          disabled={saving}
          style={{
            width: "100%", padding: "13px 0", fontSize: 14, fontWeight: 600,
            borderRadius: 10, border: `1px solid ${gold}`,
            background: gold, color: isDark ? "#080810" : "#FAFAF5",
            cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.6 : 1,
            transition: "opacity 0.15s",
          }}
        >
          {saving ? "Saving…" : step === 3 ? "Complete Profile" : "Continue →"}
        </button>
        <button
          onClick={skip}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: 13, color: muted, textDecoration: "underline" }}
        >
          Skip this step →
        </button>
      </div>
    </div>
  );
}
