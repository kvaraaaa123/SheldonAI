"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { supabase } from "@/lib/supabase";
import { UNIVERSITY_DATABASE } from "@/lib/universityDatabase";

type ActiveTab = "estimator" | "fafsa" | "css-profile" | "appeal";

type FinancialData = {
  parentIncome: string;
  parentAssets: string;
  studentIncome: string;
  studentAssets: string;
  householdSize: string;
  numberInCollege: string;
  parentMaritalStatus: string;
  hasSmallBusiness: string;
  hasFarmAssets: string;
  hasRetirementAssets: string;
  grandparent529: string;
  untaxedIncome: string;
  untaxedIncomeDesc: string;
};

type AppealData = {
  schoolName: string;
  aidOffered: string;
  reasons: string[];
  competingSchool: string;
  competingOfferAmount: string;
  circumstances: string;
};

type SavedCollege = {
  university_name: string;
};

const FAFSA_CARDS = [
  {
    id: "parent-definition",
    title: "Who is your parent for FAFSA purposes?",
    severity: "HIGH RISK" as const,
    summary: "If your parents are divorced or separated, this is the single most misunderstood question on the form.",
    content: [
      { heading: "The rule", body: "Use the parent you lived with MORE during the past 12 months. NOT the parent who claims you on taxes. NOT the higher-earning parent. NOT the parent who pays child support." },
      { heading: null, body: "If you lived equally with both parents (exactly 50/50), use the parent who provided more financial support." },
      { heading: null, body: "If that parent has since remarried, their new spouse's (your stepparent's) income and assets MUST be included — even if you have never met them." },
      { heading: "Common mistake", body: "Students use the higher-earning parent's information because they assume that is what the form wants. This is wrong and can result in receiving far less aid than you qualify for." },
      { heading: "Action", body: "Calculate which parent's home you spent more nights in during the past 12 months. Count it precisely if needed." },
    ],
  },
  {
    id: "retirement-accounts",
    title: "Do NOT report retirement accounts as assets",
    severity: "HIGH RISK" as const,
    summary: "Reporting retirement accounts is one of the most expensive FAFSA mistakes made every year.",
    content: [
      { heading: "What does NOT count", body: "401(k) plans, 403(b) plans, IRA accounts (traditional and Roth), pension plans, annuities, the net value of your primary home." },
      { heading: "What DOES count", body: "Savings accounts, checking accounts, money market accounts, investment accounts (stocks, bonds, mutual funds), certificates of deposit, 529 plans owned by the student or parent, real estate that is NOT your primary home." },
      { heading: "Common mistake", body: "Parents list their 401(k) balance under assets. A family with $300,000 in retirement savings would report $300,000 in extra assets — potentially reducing their aid by $17,000 per year." },
      { heading: "Action", body: "Before completing the assets section, make a list of every account your family has. For each one, determine: is this a retirement account? If yes, do not report it." },
    ],
  },
  {
    id: "small-business",
    title: "Small business and farm exemption",
    severity: "HIGH RISK" as const,
    summary: "If a parent owns a small business, you may not need to report it as an asset at all.",
    content: [
      { heading: "The exemption", body: "If a parent owns and controls a small business with fewer than 100 full-time equivalent employees, that business does NOT need to be reported as an asset on FAFSA." },
      { heading: null, body: "Similarly, the net value of a family farm that the family lives on and operates does not need to be reported." },
      { heading: "Common mistake", body: "Students with family-owned small businesses or farms report the full value of those businesses as assets — sometimes $50,000 to $500,000 — which dramatically reduces their aid eligibility. Most of these families qualified for the exemption and didn't know it." },
      { heading: "Action", body: "If a parent owns a business, ask: Does the family own more than 50% of it? Does it have fewer than 100 full-time employees? If both yes — do not report its net worth as an asset." },
    ],
  },
  {
    id: "dependency",
    title: "Dependency status — you are probably dependent",
    severity: "HIGH RISK" as const,
    summary: "Most students under 24 are dependent for FAFSA purposes regardless of what their parents do on taxes.",
    content: [
      { heading: "FAFSA independent criteria", body: "You are independent ONLY if: you are 24 or older, you are married, you are a graduate student, you are a veteran or active duty military, you are an orphan or ward of the court, you have legal dependents of your own, you are homeless or at risk of homelessness, or you are an emancipated minor." },
      { heading: "Common mistake", body: "Students whose parents do not claim them on taxes, or who are financially self-supporting, assume they are independent. They are not unless they meet one of the above criteria. Filing as independent when you are not is FAFSA fraud and can result in aid cancellation and repayment demands." },
      { heading: "Action", body: "Check this list carefully. If you do not meet any of these criteria, you are dependent — report your parent's information regardless of your relationship with them." },
    ],
  },
  {
    id: "grandparent-529",
    title: "Grandparent-owned 529 plans",
    severity: "MEDIUM RISK" as const,
    summary: "The rules changed in 2024 — grandparent 529 plans no longer affect your FAFSA.",
    content: [
      { heading: "Old rule (before 2024)", body: "529 plans owned by grandparents were reported as student income when withdrawn — counted at 50% against aid eligibility. This was devastating for families who had saved this way." },
      { heading: "New rule (2024 FAFSA and forward)", body: "Grandparent-owned 529 plans are no longer reported on FAFSA at all. Distributions from grandparent 529 plans no longer count as student income." },
      { heading: null, body: "However: 529 plans owned by a PARENT are still reported as a parent asset (counted at 5.64% — much more favorable than student assets which count at 20%)." },
      { heading: "Common mistake", body: "Families still operating on the old rules are unnecessarily delaying 529 distributions from grandparents, or structuring accounts inefficiently." },
      { heading: "Action", body: "If grandparents have a 529 for you, you do not need to report it and distributions from it will not affect your aid starting with the 2024-25 FAFSA." },
    ],
  },
  {
    id: "untaxed-income",
    title: "Untaxed income — things you didn't think were income",
    severity: "MEDIUM RISK" as const,
    summary: "Several types of non-taxed money must still be reported as income on FAFSA.",
    content: [
      { heading: "Must be reported", body: "Child support RECEIVED (not paid), housing allowance or utility payments from employer or military, veterans non-education benefits, workers' compensation, disability payments not on a tax return, untaxed HSA distributions, money received from a person not living in your household." },
      { heading: "Common mistake", body: 'Families skip this section because they think "untaxed means I don\'t report it." Skipping it and being caught during verification can result in aid cancellation.' },
      { heading: "Action", body: "Go through each category above. If your family receives any of these, report them." },
    ],
  },
  {
    id: "asset-timing",
    title: "Asset timing — when you report matters",
    severity: "MEDIUM RISK" as const,
    summary: "Assets are reported as of the day you submit FAFSA — timing your submission can affect your aid.",
    content: [
      { heading: "The snapshot rule", body: "Assets are reported as of the exact date you submit the FAFSA form. Money you spend before submission does not need to be reported." },
      { heading: null, body: "If you have money in savings that you plan to use to pay tuition, medical bills, or other large expenses — pay those expenses BEFORE submitting FAFSA, not after." },
      { heading: "Common mistake", body: "Submitting FAFSA with a high savings balance that will immediately be spent on tuition. The form sees the money as available for education costs and reduces aid accordingly." },
      { heading: "Action", body: "Review your family's current account balances. Identify any planned large expenses and consider whether paying them before FAFSA submission makes sense." },
    ],
  },
  {
    id: "selective-service",
    title: "Selective Service registration",
    severity: "HIGH RISK" as const,
    summary: "Male students who haven't registered with Selective Service may be ineligible for all federal aid.",
    content: [
      { heading: "Who must register", body: "Male US citizens and eligible non-citizens born on or after January 1, 1960 must register with the Selective Service System. Registration is required to be eligible for federal student aid." },
      { heading: "The deadline", body: "You must register between ages 18 and 25. Once you turn 26, you can no longer register — you will be permanently ineligible for federal aid for your entire undergraduate career." },
      { heading: "How to register", body: "SelectiveService.gov — takes 2 minutes online." },
      { heading: "Common mistake", body: "Students who grew up outside the US or whose families were not aware of this requirement arrive at FAFSA completion and discover they are permanently ineligible for federal aid. This is devastating and irreversible after age 26." },
      { heading: "Action", body: "If you are male and between 18 and 25 and have not registered — stop reading and register right now before completing FAFSA." },
    ],
  },
  {
    id: "css-profile",
    title: "CSS Profile — the form private universities use",
    severity: "HIGH RISK" as const,
    summary: "If you are applying to private universities, the CSS Profile is separate from FAFSA and asks much more.",
    content: [
      { heading: "What it is", body: "The CSS Profile is administered by College Board and used by approximately 400 private colleges and universities to award institutional (non-federal) aid." },
      { heading: "What it asks that FAFSA does not", body: "Home equity, retirement account balances, non-custodial parent's income, business and farm valuations in more detail, medical expenses and unusual financial circumstances, siblings' educational expenses." },
      { heading: "Cost and deadline", body: "$25 for the first school, $16 for each additional school. CSS Profile deadlines are typically earlier than FAFSA deadlines — often November 1 for Early Decision applicants." },
      { heading: "Common mistake", body: "Students only complete FAFSA and assume they are done. Schools that require the CSS Profile will not process your financial aid application without it — you will receive no institutional aid even if you qualify." },
      { heading: "Action", body: "Check whether each school in your college list requires the CSS Profile. If yes, submit it by the school's stated deadline — not the FAFSA deadline." },
    ],
  },
  {
    id: "verification",
    title: "Verification — what happens if you are selected",
    severity: "MEDIUM RISK" as const,
    summary: "About 30% of FAFSA applicants are selected for verification — here is what to expect.",
    content: [
      { heading: "What verification means", body: "The Department of Education selects approximately 30% of FAFSA applicants for verification — a process where the school asks you to prove the information you submitted was accurate." },
      { heading: "What you will need", body: "Tax transcripts (from IRS directly, not your own copy), W-2 forms, proof of household size, proof of untaxed income reported." },
      { heading: "Timeline", body: "Verification can take 4-8 weeks. Schools will not disburse aid until verification is complete — which can delay enrollment." },
      { heading: "Common mistake", body: "Students who estimated income figures or made errors on FAFSA face verification requests and may have aid reduced or cancelled if the verified figures are significantly different." },
      { heading: "Action", body: "Use the IRS Data Retrieval Tool (DRT) within FAFSA when available — it pulls your tax information directly from IRS records and significantly reduces your chance of being selected for verification." },
    ],
  },
  {
    id: "divorced-parent",
    title: "Divorced parent — what if I can't get their information?",
    severity: "MEDIUM RISK" as const,
    summary: "If a divorced parent refuses to provide their financial information, you have options.",
    content: [
      { heading: "The problem", body: "FAFSA requires the custodial parent's information. If that parent refuses to cooperate, many students assume they cannot complete FAFSA." },
      { heading: "Option 1", body: "Contact the financial aid office directly. Explain the situation. Many schools have procedures for students with uncooperative parents and can grant exceptions or adjustments." },
      { heading: "Option 2", body: "Dependency override. Financial aid administrators have authority to change a student's dependency status in cases of unusual circumstances — including documented parental abuse, abandonment, or refusal to cooperate." },
      { heading: "Option 3", body: "If your other parent is willing to cooperate and you spent equal time with both, you may be able to use their information." },
      { heading: "Common mistake", body: "Students give up and don't submit FAFSA at all. This is the worst outcome — always contact the financial aid office first." },
      { heading: "Action", body: "If a parent is uncooperative, call the financial aid office of each school you are applying to and explain the situation before the deadline. Document everything in writing." },
    ],
  },
  {
    id: "professional-judgment",
    title: "Professional judgment — asking for more aid",
    severity: "MEDIUM RISK" as const,
    summary: "Financial aid administrators can adjust your aid package — but only if you ask.",
    content: [
      { heading: "What professional judgment means", body: "Federal law gives financial aid administrators the authority to adjust a student's Expected Family Contribution or cost of attendance based on documented special circumstances." },
      { heading: "Circumstances that qualify", body: "Job loss or significant income reduction since the tax year used, medical expenses not reflected in taxes, natural disaster, death of a parent, separation or divorce since taxes were filed, one-time income that will not recur." },
      { heading: "How to request it", body: "Write a letter to the financial aid office explaining your circumstances and attaching documentation. Be specific about what changed and when." },
      { heading: "Common mistake", body: "Families assume the aid offer is final. It is not. Approximately 60% of families who appeal receive additional aid, with average increases of $2,000-$5,000 per year." },
      { heading: "Action", body: "If any of the above circumstances apply, write a professional judgment request letter. Use the Appeal Letter Generator tab in this tool." },
    ],
  },
];

const CSS_PROFILE_CARDS = [
  {
    id: "css-home-equity",
    title: "Home equity",
    severity: "HIGH RISK" as const,
    summary: "The CSS Profile asks for your home's current market value minus the outstanding mortgage. FAFSA does not ask this.",
    content: [
      { heading: "What it asks", body: "The CSS Profile asks for your home's current market value minus the outstanding mortgage balance. This figure — your home equity — is used to assess ability to pay." },
      { heading: "Why it costs families money", body: "Private universities use home equity to assess ability to pay. A family with $400,000 in home equity may see their institutional aid reduced significantly — even if their income is modest." },
      { heading: "What FAFSA does", body: "FAFSA does not ask about primary home equity at all. This is one of the biggest differences between the two forms." },
      { heading: "Action", body: "Families who own their home should research each school's home equity cap policy before submitting the CSS Profile. Many schools cap the home equity they will count at 1.2x or 2x the parent's income. Contact the financial aid office directly to ask about their policy." },
    ],
  },
  {
    id: "css-noncustodial",
    title: "Non-custodial parent income",
    severity: "HIGH RISK" as const,
    summary: "The CSS Profile requires BOTH parents' financial information even if they are divorced and one parent is completely absent from your life.",
    content: [
      { heading: "What it asks", body: "Unlike FAFSA — which only requires the custodial parent's information for divorced families — the CSS Profile requires both parents' complete financial information regardless of the custody arrangement." },
      { heading: "Why this matters", body: "A student raised solely by their mother may still be expected to submit their father's income and assets, even if he has not been involved in their life for years. Schools use both parents' finances to calculate expected family contribution." },
      { heading: "Non-custodial parent waiver", body: "Some schools offer a non-custodial parent waiver for documented cases of abandonment, abuse, or long-term estrangement. This is not automatic — you must request it." },
      { heading: "Action", body: "Contact the financial aid office of each school before submitting the CSS Profile if the non-custodial parent is absent, abusive, or uncooperative. Ask specifically about their waiver process and what documentation they require. Do not wait until after you submit." },
    ],
  },
  {
    id: "css-retirement",
    title: "Retirement account balances",
    severity: "HIGH RISK" as const,
    summary: "The CSS Profile DOES ask about retirement account balances (401k, IRA) even though FAFSA does not.",
    content: [
      { heading: "What FAFSA does", body: "FAFSA explicitly excludes retirement accounts (401k, 403b, IRA, pension plans) from asset calculations. This is one of FAFSA's most student-friendly rules." },
      { heading: "What the CSS Profile does", body: "The CSS Profile asks about retirement account balances and reports them as assets. A family with $500,000 in retirement savings will have that counted — at least partially — against institutional aid at CSS Profile schools." },
      { heading: "Impact", body: "These are reported as assets and can significantly reduce institutional aid at CSS Profile schools. The exact impact depends on the school's methodology — some apply a discount, others count the full balance." },
      { heading: "Action", body: "Do not leave the retirement asset questions blank on the CSS Profile. They are required. The impact varies by school — some schools are more generous than others with retirement assets. Research each school's methodology before assuming the worst." },
    ],
  },
  {
    id: "css-business",
    title: "Business and farm valuations",
    severity: "HIGH RISK" as const,
    summary: "CSS Profile requires more detailed business and farm valuations than FAFSA.",
    content: [
      { heading: "FAFSA's small business exemption", body: "FAFSA exempts small businesses with fewer than 100 full-time equivalent employees that a family owns and controls. This is a significant benefit for family business owners." },
      { heading: "What the CSS Profile does", body: "The CSS Profile requires more detailed business and farm valuations than FAFSA. A family business worth $500,000 could significantly reduce aid at CSS Profile schools even if it qualifies for FAFSA's small business exemption." },
      { heading: "Farm assets", body: "Family farms that qualify for FAFSA's exemption may still need to be reported in detail on the CSS Profile. The valuation methodology matters significantly." },
      { heading: "Action", body: "If your family owns a business or farm, consider consulting with a financial aid advisor or accountant who understands CSS Profile reporting before submitting. The valuation approach you use can significantly affect the outcome. Document the business carefully." },
    ],
  },
  {
    id: "css-unusual-expenses",
    title: "Unusual expenses — a section most families skip",
    severity: "MEDIUM RISK" as const,
    summary: "The CSS Profile has a section for unusual expenses that can reduce your expected contribution — and most families skip it without realizing it.",
    content: [
      { heading: "What qualifies", body: "High medical costs not covered by insurance, elder care expenses for a dependent relative, private school tuition for younger siblings, unusually high commuting costs, significant unreimbursed business expenses." },
      { heading: "Why families miss it", body: "The section is easy to overlook or dismiss. Many families assume it does not apply to them or that the amounts are too small to matter. They are often wrong on both counts." },
      { heading: "The opportunity", body: "These can reduce your expected contribution. Most families skip this section without realizing it could significantly increase their aid. A family paying $30,000 per year in elder care expenses, for example, could meaningfully reduce their expected contribution by documenting it here." },
      { heading: "Action", body: "Before submitting the CSS Profile, make a complete list of your family's recurring unusual expenses. Even if you are not certain an expense qualifies, include it and let the financial aid office decide. Attach documentation when possible." },
    ],
  },
  {
    id: "css-which-schools",
    title: "Which schools require the CSS Profile",
    severity: "MEDIUM RISK" as const,
    summary: "Approximately 400 private colleges and universities require the CSS Profile. Missing its deadline means no institutional aid even if you qualify.",
    content: [
      { heading: "Which schools require it", body: "Approximately 400 private colleges and universities require the CSS Profile in addition to FAFSA. Most Ivy League schools, Stanford, MIT, Duke, Northwestern, Georgetown, Vanderbilt, and similar institutions require it." },
      { heading: "The deadline problem", body: "The CSS Profile deadline is often earlier than the FAFSA deadline — sometimes November 1 for Early Decision applicants. Missing the CSS Profile deadline means no institutional aid even if you fully qualify based on need." },
      { heading: "The cost", body: "The CSS Profile costs $25 for the first school and $16 for each additional school. Fee waivers are available for eligible students — check the College Board website." },
      { heading: "Common mistake", body: "Students only complete FAFSA and assume they are done. Schools that require the CSS Profile will not process your financial aid application without it — you will receive no institutional aid even if you qualify. There is no appeal for a missed CSS Profile deadline at most schools." },
      { heading: "Action", body: "Check every school in your college list for CSS Profile requirements. Look up the specific CSS Profile deadline for each school — it is different from the FAFSA deadline and often significantly earlier. Set a reminder for two weeks before the earliest deadline." },
    ],
  },
];

const APPEAL_REASONS = [
  "Job loss or income reduction",
  "Medical expenses",
  "Divorce or separation",
  "Competing offer from another school",
  "One-time income that won't recur",
  "Death in family",
  "Natural disaster",
  "Other unusual circumstance",
];

export default function FinancialAidPage() {
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
  const [activeTab, setActiveTab] = useState<ActiveTab>("estimator");
  const [financialData, setFinancialData] = useState<FinancialData>({
    parentIncome: "", parentAssets: "", studentIncome: "", studentAssets: "",
    householdSize: "", numberInCollege: "", parentMaritalStatus: "Married/Together",
    hasSmallBusiness: "No", hasFarmAssets: "No", hasRetirementAssets: "No",
    grandparent529: "No", untaxedIncome: "No", untaxedIncomeDesc: "",
  });
  const [sai, setSai] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [appealData, setAppealData] = useState<AppealData>({
    schoolName: "", aidOffered: "", reasons: [], competingSchool: "", competingOfferAmount: "", circumstances: "",
  });
  const [appealLetter, setAppealLetter] = useState("");
  const [isGeneratingAppeal, setIsGeneratingAppeal] = useState(false);
  const [savedColleges, setSavedColleges] = useState<SavedCollege[]>([]);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      if (!data.session) { router.push("/"); return; }
      setUserEmail(data.session.user.email ?? "");
      const { data: colleges } = await supabase
        .from("college_lists")
        .select("university_name")
        .eq("user_id", data.session.user.id);
      if (colleges) setSavedColleges(colleges as SavedCollege[]);
    });
  }, [router]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.push("/");
  }

  function setFD(key: keyof FinancialData, value: string) {
    setFinancialData(prev => ({ ...prev, [key]: value }));
  }

  async function handleCalculate() {
    setIsCalculating(true);
    try {
      const res = await fetch("/api/financial-aid/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(financialData),
      });
      if (res.ok) {
        const data = await res.json();
        setSai(data.sai);
      }
    } catch (e) {
      console.error("Calculate error:", e);
    }
    setIsCalculating(false);
  }

  async function handleGenerateAppeal() {
    setIsGeneratingAppeal(true);
    setAppealLetter("");
    try {
      const res = await fetch("/api/financial-aid/appeal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          schoolName: appealData.schoolName,
          aidOffered: appealData.aidOffered,
          reasons: appealData.reasons,
          competingSchool: appealData.reasons.includes("Competing offer from another school") ? appealData.competingSchool : "",
          competingAmount: appealData.reasons.includes("Competing offer from another school") ? appealData.competingOfferAmount : "",
          circumstances: appealData.circumstances,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAppealLetter(data.letter);
      }
    } catch (e) {
      console.error("Appeal error:", e);
    }
    setIsGeneratingAppeal(false);
  }

  function toggleReason(r: string) {
    setAppealData(prev => ({
      ...prev,
      reasons: prev.reasons.includes(r)
        ? prev.reasons.filter(x => x !== r)
        : [...prev.reasons, r],
    }));
  }

  function getSaiLabel(s: number) {
    if (s < 0) return "Excellent — you qualify for the maximum Pell Grant and significant need-based aid.";
    if (s <= 6000) return "Strong need demonstrated — you will likely qualify for significant need-based aid at most schools.";
    if (s <= 20000) return "Moderate need — you will qualify for some aid at most schools, particularly private universities with large endowments.";
    return "Lower demonstrated need — focus on merit scholarships and schools known for generous merit aid.";
  }

  function getCollegeEstimates() {
    if (sai === null) return [];
    return savedColleges.map(col => {
      const dbEntry = UNIVERSITY_DATABASE.find(u => u.name === col.university_name);
      const sticker = dbEntry?.tuition ?? null;
      if (!sticker) return { name: col.university_name, sticker: null, grant: 0, oop: null };
      const isPrivate = dbEntry?.type === "private";
      const needFactor = isPrivate ? 1.15 : 0.85;
      const rawGrant = Math.max(0, sticker - Math.max(0, sai * 1.2) * needFactor);
      const grant = Math.min(sticker, Math.round(rawGrant));
      const oop = sticker - grant;
      return { name: col.university_name, sticker, grant, oop };
    });
  }

  function oopColor(oop: number) {
    if (oop < 20000) return "#4ade80";
    if (oop <= 40000) return "#fbbf24";
    return "#f87171";
  }

  const inputStyle: React.CSSProperties = {
    width: "100%", background: surface, border: `0.5px solid ${border}`,
    borderRadius: 8, padding: "9px 12px", fontSize: 14, color: text,
    outline: "none", boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = { fontSize: 13, fontWeight: 500, color: text, marginBottom: 4, display: "block" };
  const subLabelStyle: React.CSSProperties = { fontSize: 11, color: muted, marginBottom: 6, display: "block" };

  function PillGroup({ options, value, onChange }: { options: string[]; value: string; onChange: (v: string) => void }) {
    return (
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
        {options.map(o => (
          <button key={o} onClick={() => onChange(o)} style={{
            padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
            border: `0.5px solid ${value === o ? gold : border}`,
            background: value === o ? `${gold}18` : surface,
            color: value === o ? gold : muted,
            transition: "all 0.15s",
          }}>{o}</button>
        ))}
      </div>
    );
  }

  const estimates = getCollegeEstimates();

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

      {/* Body */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "40px 28px" }}>

        {/* Header */}
        <div style={{ marginBottom: 32 }}>
          <h1 style={{ fontFamily: "Georgia, serif", fontSize: 28, fontWeight: 500, letterSpacing: "-0.5px", marginBottom: 6, color: text }}>
            Financial Aid Assistant
          </h1>
          <p style={{ fontSize: 14, color: muted }}>Estimate your aid, navigate FAFSA, and appeal your offers</p>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 8, marginBottom: 32, flexWrap: "wrap" }}>
          {(["estimator", "fafsa", "css-profile", "appeal"] as ActiveTab[]).map(tab => {
            const labels: Record<ActiveTab, string> = { estimator: "Net Price Estimator", fafsa: "FAFSA Companion", "css-profile": "CSS Profile Companion", appeal: "Appeal Letter Generator" };
            const active = activeTab === tab;
            return (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "8px 20px", borderRadius: 20, fontSize: 13, cursor: "pointer",
                border: `0.5px solid ${active ? gold : border}`,
                background: active ? `${gold}18` : surface,
                color: active ? gold : muted,
                fontWeight: active ? 600 : 400,
                transition: "all 0.15s",
              }}>{labels[tab]}</button>
            );
          })}
        </div>

        {/* ── TAB 1: NET PRICE ESTIMATOR ── */}
        {activeTab === "estimator" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 28, alignItems: "start" }}>

            {/* LEFT: form */}
            <div>
              <div style={{ fontSize: 16, fontWeight: 500, color: text, marginBottom: 20 }}>Your Family&apos;s Financial Picture</div>

              <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
                <div>
                  <label style={labelStyle}>Parent/Guardian Annual Income</label>
                  <span style={subLabelStyle}>(before taxes, from all sources)</span>
                  <input type="number" placeholder="e.g. 85000" value={financialData.parentIncome}
                    onChange={e => setFD("parentIncome", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Parent/Guardian Total Assets</label>
                  <span style={subLabelStyle}>(savings, investments — NOT retirement accounts or home equity)</span>
                  <input type="number" placeholder="e.g. 45000" value={financialData.parentAssets}
                    onChange={e => setFD("parentAssets", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Student Annual Income</label>
                  <span style={subLabelStyle}>(jobs, freelance, etc.)</span>
                  <input type="number" placeholder="e.g. 3000" value={financialData.studentIncome}
                    onChange={e => setFD("studentIncome", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Student Total Assets</label>
                  <span style={subLabelStyle}>(savings, checking accounts)</span>
                  <input type="number" placeholder="e.g. 2500" value={financialData.studentAssets}
                    onChange={e => setFD("studentAssets", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Household size</label>
                  <span style={subLabelStyle}>(everyone living in your home)</span>
                  <input type="number" placeholder="e.g. 4" value={financialData.householdSize}
                    onChange={e => setFD("householdSize", e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Number attending college simultaneously</label>
                  <span style={subLabelStyle}>(including yourself)</span>
                  <input type="number" placeholder="e.g. 1" value={financialData.numberInCollege}
                    onChange={e => setFD("numberInCollege", e.target.value)} style={inputStyle} />
                </div>

                <div>
                  <label style={labelStyle}>Parent marital status</label>
                  <PillGroup
                    options={["Married/Together", "Single Parent", "Divorced/Separated", "Remarried/Stepparent"]}
                    value={financialData.parentMaritalStatus}
                    onChange={v => setFD("parentMaritalStatus", v)}
                  />
                </div>

                <div>
                  <label style={labelStyle}>Does a parent own a small business?</label>
                  <PillGroup options={["Yes", "No"]} value={financialData.hasSmallBusiness} onChange={v => setFD("hasSmallBusiness", v)} />
                  {financialData.hasSmallBusiness === "Yes" && (
                    <div style={{
                      marginTop: 10, background: isDark ? "rgba(201,169,110,0.1)" : "rgba(154,112,64,0.08)",
                      border: `0.5px solid ${gold}55`, borderRadius: 8, padding: "10px 12px",
                      fontSize: 12, color: muted, lineHeight: 1.6,
                    }}>
                      Small businesses with fewer than 100 employees that the family owns more than 50% of do NOT count as assets on FAFSA — a common and expensive mistake to avoid.
                    </div>
                  )}
                </div>

                <div>
                  <label style={labelStyle}>Any untaxed income?</label>
                  <PillGroup options={["Yes", "No"]} value={financialData.untaxedIncome} onChange={v => setFD("untaxedIncome", v)} />
                  {financialData.untaxedIncome === "Yes" && (
                    <div style={{ marginTop: 10 }}>
                      <input
                        type="text"
                        placeholder="Describe (child support received, housing allowance, veterans benefits, workers compensation)"
                        value={financialData.untaxedIncomeDesc}
                        onChange={e => setFD("untaxedIncomeDesc", e.target.value)}
                        style={{ ...inputStyle, marginBottom: 6 }}
                      />
                      <div style={{ fontSize: 11, color: muted }}>These count as income on FAFSA even though they are not taxed.</div>
                    </div>
                  )}
                </div>
              </div>

              <button
                onClick={handleCalculate}
                disabled={isCalculating}
                style={{
                  marginTop: 24, width: "100%", padding: "13px 0",
                  background: gold, color: "#fff", border: "none", borderRadius: 10,
                  fontSize: 14, fontWeight: 600, cursor: isCalculating ? "not-allowed" : "pointer",
                  opacity: isCalculating ? 0.7 : 1, transition: "opacity 0.15s",
                }}
              >
                {isCalculating ? "Calculating..." : "Calculate My Estimated Aid →"}
              </button>
            </div>

            {/* RIGHT: results */}
            <div>
              {sai !== null ? (
                <div>
                  <div style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 500, marginBottom: 16, color: text }}>
                    Your Estimated Results
                  </div>

                  {/* SAI card */}
                  <div style={{
                    background: surface, border: `1px solid ${gold}55`, borderRadius: 14,
                    padding: "24px", marginBottom: 24, textAlign: "center",
                  }}>
                    <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.09em", textTransform: "uppercase", color: muted, marginBottom: 8 }}>
                      Student Aid Index (SAI)
                    </div>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 48, fontWeight: 500, color: gold, marginBottom: 10 }}>
                      {sai < 0 ? "-$" + Math.abs(sai).toLocaleString() : "$" + sai.toLocaleString()}
                    </div>
                    <div style={{ fontSize: 13, color: muted, lineHeight: 1.5 }}>{getSaiLabel(sai)}</div>
                  </div>

                  {/* School table */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 14, fontWeight: 500, color: text, marginBottom: 12 }}>
                      Estimated Cost at Your Saved Schools
                    </div>
                    {estimates.length === 0 ? (
                      <div style={{
                        background: surface, border: `0.5px solid ${border}`, borderRadius: 10,
                        padding: "20px", textAlign: "center", fontSize: 13, color: muted,
                      }}>
                        <a href="/colleges" style={{ color: gold }}>Add colleges to My Colleges</a> to see estimated costs
                      </div>
                    ) : (
                      <div style={{ background: surface, border: `0.5px solid ${border}`, borderRadius: 10, overflow: "hidden" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                          <thead>
                            <tr style={{ borderBottom: `0.5px solid ${border}` }}>
                              <th style={{ padding: "8px 12px", textAlign: "left", color: muted, fontWeight: 500 }}>School</th>
                              <th style={{ padding: "8px 12px", textAlign: "right", color: muted, fontWeight: 500 }}>Sticker</th>
                              <th style={{ padding: "8px 12px", textAlign: "right", color: muted, fontWeight: 500 }}>Est. Grant</th>
                              <th style={{ padding: "8px 12px", textAlign: "right", color: muted, fontWeight: 500 }}>Out-of-Pocket</th>
                            </tr>
                          </thead>
                          <tbody>
                            {estimates.map((row, i) => (
                              <tr key={i} style={{ borderBottom: i < estimates.length - 1 ? `0.5px solid ${border}` : "none" }}>
                                <td style={{ padding: "9px 12px", color: text, fontSize: 12 }}>{row.name}</td>
                                <td style={{ padding: "9px 12px", textAlign: "right", color: muted }}>
                                  {row.sticker ? "$" + row.sticker.toLocaleString() : "Contact school"}
                                </td>
                                <td style={{ padding: "9px 12px", textAlign: "right", color: "#4ade80" }}>
                                  {row.sticker ? "$" + row.grant.toLocaleString() : "—"}
                                </td>
                                <td style={{ padding: "9px 12px", textAlign: "right", fontWeight: 600, color: row.oop !== null ? oopColor(row.oop) : muted }}>
                                  {row.oop !== null ? "$" + row.oop.toLocaleString() : "—"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>

                  {/* Tip cards */}
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[
                      "Do NOT report retirement accounts (401k, IRA, pension) as assets. They do not count and reporting them is one of the most expensive FAFSA mistakes.",
                      "If your parents are divorced, use the parent you lived with MORE in the past 12 months — not the higher earner and not who claims you on taxes.",
                      "Submit FAFSA as early as possible — many states and schools give aid on a first-come, first-served basis and run out of money.",
                    ].map((tip, i) => (
                      <div key={i} style={{
                        background: isDark ? "rgba(251,191,36,0.07)" : "rgba(251,191,36,0.1)",
                        border: "0.5px solid rgba(251,191,36,0.35)", borderRadius: 8,
                        padding: "10px 12px", fontSize: 12, color: muted, lineHeight: 1.6,
                      }}>
                        ⚡ {tip}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{
                  background: surface, border: `0.5px solid ${border}`, borderRadius: 14,
                  padding: "40px 24px", textAlign: "center",
                }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>$</div>
                  <div style={{ fontSize: 14, color: muted, lineHeight: 1.6 }}>
                    Fill out the form and click Calculate to see your estimated Student Aid Index and net costs at your saved schools.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── TAB 2: FAFSA COMPANION ── */}
        {activeTab === "fafsa" && (
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 500, marginBottom: 6, color: text }}>
              FAFSA Question Guide
            </div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 24, lineHeight: 1.6 }}>
              The questions that cost students the most money — and exactly how to answer them correctly
            </div>

            {FAFSA_CARDS.map(card => {
              const isOpen = activeQuestion === card.id;
              const isHigh = card.severity === "HIGH RISK";
              return (
                <div key={card.id} style={{
                  background: surface, border: `0.5px solid ${border}`, borderRadius: 10,
                  padding: 16, marginBottom: 10, cursor: "pointer",
                }} onClick={() => setActiveQuestion(isOpen ? null : card.id)}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", padding: "2px 8px",
                        borderRadius: 4, flexShrink: 0,
                        background: isHigh ? "rgba(248,113,113,0.15)" : "rgba(251,191,36,0.15)",
                        color: isHigh ? "#f87171" : "#fbbf24",
                        border: `0.5px solid ${isHigh ? "rgba(248,113,113,0.4)" : "rgba(251,191,36,0.4)"}`,
                      }}>{card.severity}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: text }}>{card.title}</span>
                    </div>
                    <span style={{ color: muted, fontSize: 12, flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>

                  {!isOpen && (
                    <div style={{ fontSize: 12, color: muted, marginTop: 8, lineHeight: 1.5 }}>{card.summary}</div>
                  )}

                  {isOpen && (
                    <div style={{ marginTop: 14, borderTop: `0.5px solid ${border}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                      {card.content.map((block, bi) => (
                        <div key={bi}>
                          {block.heading && (
                            <div style={{ fontSize: 12, fontWeight: 600, color: text, marginBottom: 3 }}>{block.heading}</div>
                          )}
                          <div style={{ fontSize: 13, color: muted, lineHeight: 1.6 }}>{block.body}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB 3: CSS PROFILE COMPANION ── */}
        {activeTab === "css-profile" && (
          <div>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 500, marginBottom: 6, color: text }}>
              CSS Profile Question Guide
            </div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 8, lineHeight: 1.6 }}>
              The questions that cost families the most money at private universities — and exactly how to navigate them
            </div>
            <div style={{
              background: isDark ? "rgba(201,169,110,0.1)" : "rgba(154,112,64,0.08)",
              border: `0.5px solid ${gold}55`, borderRadius: 8,
              padding: "10px 14px", fontSize: 12, color: muted, lineHeight: 1.6, marginBottom: 24,
            }}>
              The CSS Profile is used by approximately 400 private colleges — including Harvard, MIT, Stanford, Yale, Princeton, Columbia, Penn, and Duke — to award institutional (non-federal) aid. It asks significantly more than FAFSA and can reduce aid in ways students don&apos;t expect.
            </div>

            {CSS_PROFILE_CARDS.map(card => {
              const isOpen = activeQuestion === card.id;
              const isHigh = card.severity === "HIGH RISK";
              return (
                <div key={card.id} style={{
                  background: surface, border: `0.5px solid ${border}`, borderRadius: 10,
                  padding: 16, marginBottom: 10, cursor: "pointer",
                }} onClick={() => setActiveQuestion(isOpen ? null : card.id)}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flex: 1 }}>
                      <span style={{
                        fontSize: 10, fontWeight: 700, letterSpacing: "0.05em", padding: "2px 8px",
                        borderRadius: 4, flexShrink: 0,
                        background: isHigh ? "rgba(248,113,113,0.15)" : "rgba(251,191,36,0.15)",
                        color: isHigh ? "#f87171" : "#fbbf24",
                        border: `0.5px solid ${isHigh ? "rgba(248,113,113,0.4)" : "rgba(251,191,36,0.4)"}`,
                      }}>{card.severity}</span>
                      <span style={{ fontSize: 14, fontWeight: 500, color: text }}>{card.title}</span>
                    </div>
                    <span style={{ color: muted, fontSize: 12, flexShrink: 0 }}>{isOpen ? "▲" : "▼"}</span>
                  </div>

                  {!isOpen && (
                    <div style={{ fontSize: 12, color: muted, marginTop: 8, lineHeight: 1.5 }}>{card.summary}</div>
                  )}

                  {isOpen && (
                    <div style={{ marginTop: 14, borderTop: `0.5px solid ${border}`, paddingTop: 14, display: "flex", flexDirection: "column", gap: 10 }}>
                      {card.content.map((block, bi) => (
                        <div key={bi}>
                          {block.heading && (
                            <div style={{ fontSize: 12, fontWeight: 600, color: text, marginBottom: 3 }}>{block.heading}</div>
                          )}
                          <div style={{ fontSize: 13, color: muted, lineHeight: 1.6 }}>{block.body}</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* ── TAB 4: APPEAL LETTER GENERATOR ── */}
        {activeTab === "appeal" && (
          <div style={{ maxWidth: 660 }}>
            <div style={{ fontFamily: "Georgia, serif", fontSize: 20, fontWeight: 500, marginBottom: 6, color: text }}>
              Financial Aid Appeal Letter
            </div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 28, lineHeight: 1.6 }}>
              Professionally written appeal letters increase aid offers by an average of $2,000–$5,000 per year. About 60% of families who appeal receive more money.
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {/* School */}
              <div>
                <label style={labelStyle}>Which school are you appealing?</label>
                {savedColleges.length > 0 ? (
                  <select
                    value={appealData.schoolName}
                    onChange={e => setAppealData(p => ({ ...p, schoolName: e.target.value }))}
                    style={{ ...inputStyle, appearance: "none" }}
                  >
                    <option value="">Select a school…</option>
                    {savedColleges.map(c => (
                      <option key={c.university_name} value={c.university_name}>{c.university_name}</option>
                    ))}
                  </select>
                ) : (
                  <input type="text" placeholder="e.g. University of Michigan"
                    value={appealData.schoolName}
                    onChange={e => setAppealData(p => ({ ...p, schoolName: e.target.value }))}
                    style={inputStyle} />
                )}
              </div>

              {/* Aid offered */}
              <div>
                <label style={labelStyle}>Aid package offered</label>
                <span style={subLabelStyle}>Total aid offered (grants + scholarships only, not loans)</span>
                <input type="number" placeholder="e.g. 18000"
                  value={appealData.aidOffered}
                  onChange={e => setAppealData(p => ({ ...p, aidOffered: e.target.value }))}
                  style={inputStyle} />
              </div>

              {/* Reasons */}
              <div>
                <label style={labelStyle}>What is your reason for appealing?</label>
                <span style={subLabelStyle}>Select all that apply</span>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                  {APPEAL_REASONS.map(r => {
                    const selected = appealData.reasons.includes(r);
                    return (
                      <button key={r} onClick={() => toggleReason(r)} style={{
                        padding: "6px 14px", borderRadius: 20, fontSize: 12, cursor: "pointer",
                        border: `0.5px solid ${selected ? gold : border}`,
                        background: selected ? `${gold}18` : surface,
                        color: selected ? gold : muted,
                        transition: "all 0.15s",
                      }}>{r}</button>
                    );
                  })}
                </div>
              </div>

              {/* Competing offer */}
              {appealData.reasons.includes("Competing offer from another school") && (
                <div style={{ display: "flex", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Competing school name</label>
                    <input type="text" placeholder="e.g. University of Michigan"
                      value={appealData.competingSchool}
                      onChange={e => setAppealData(p => ({ ...p, competingSchool: e.target.value }))}
                      style={inputStyle} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label style={labelStyle}>Their aid offer ($)</label>
                    <input type="number" placeholder="e.g. 28000"
                      value={appealData.competingOfferAmount}
                      onChange={e => setAppealData(p => ({ ...p, competingOfferAmount: e.target.value }))}
                      style={inputStyle} />
                  </div>
                </div>
              )}

              {/* Circumstances */}
              <div>
                <label style={labelStyle}>Briefly describe your circumstances</label>
                <textarea
                  rows={4}
                  placeholder="In 2-3 sentences, describe what has changed or what special circumstances apply. Be specific — include amounts and dates where possible."
                  value={appealData.circumstances}
                  onChange={e => setAppealData(p => ({ ...p, circumstances: e.target.value }))}
                  style={{ ...inputStyle, resize: "vertical", lineHeight: 1.6 }}
                />
              </div>

              {/* Generate button */}
              <button
                onClick={handleGenerateAppeal}
                disabled={isGeneratingAppeal || !appealData.schoolName || appealData.reasons.length === 0}
                style={{
                  padding: "13px 0", background: gold, color: "#fff", border: "none",
                  borderRadius: 10, fontSize: 14, fontWeight: 600,
                  cursor: (isGeneratingAppeal || !appealData.schoolName || appealData.reasons.length === 0) ? "not-allowed" : "pointer",
                  opacity: (isGeneratingAppeal || !appealData.schoolName || appealData.reasons.length === 0) ? 0.6 : 1,
                  transition: "opacity 0.15s",
                }}
              >
                {isGeneratingAppeal ? "Drafting your appeal letter..." : "Generate My Appeal Letter →"}
              </button>

              {/* Letter result */}
              {appealLetter && (
                <div>
                  <div style={{
                    background: surface, border: `0.5px solid ${border}`, borderRadius: 12,
                    padding: "24px", marginBottom: 12,
                  }}>
                    <div style={{ fontSize: 13, color: text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                      {appealLetter}
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button
                      onClick={() => { navigator.clipboard.writeText(appealLetter); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
                      style={{
                        padding: "8px 18px", fontSize: 13, borderRadius: 8, cursor: "pointer",
                        border: `0.5px solid ${border}`, background: surface, color: text,
                      }}
                    >{copied ? "Copied!" : "Copy Letter"}</button>
                    <button
                      onClick={() => {
                        const blob = new Blob([appealLetter], { type: "text/plain" });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement("a");
                        a.href = url; a.download = `appeal-${appealData.schoolName.replace(/\s+/g, "-").toLowerCase()}.txt`;
                        a.click(); URL.revokeObjectURL(url);
                      }}
                      style={{
                        padding: "8px 18px", fontSize: 13, borderRadius: 8, cursor: "pointer",
                        border: `0.5px solid ${border}`, background: surface, color: text,
                      }}
                    >Download as Text</button>
                  </div>
                </div>
              )}

              {/* After-appeal tips */}
              <div style={{
                background: surface, border: `0.5px solid ${border}`, borderRadius: 12, padding: "20px",
              }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: text, marginBottom: 12 }}>After you send your appeal</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {[
                    "Address the letter to the financial aid office, not a specific person — offices change staff frequently",
                    "Send by email AND certified mail if the deadline is close",
                    "Follow up with a phone call 5-7 business days after sending",
                    "If your first appeal is denied, ask to speak with a senior aid officer — decisions made at the staff level can often be escalated",
                    "You can appeal multiple times — each time new circumstances arise or a new competing offer comes in",
                  ].map((tip, i) => (
                    <div key={i} style={{ display: "flex", gap: 8, fontSize: 13, color: muted, lineHeight: 1.5 }}>
                      <span style={{ color: gold, flexShrink: 0 }}>→</span>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
