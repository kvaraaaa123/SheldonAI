import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { SCHOLARSHIPS } from "@/lib/scholarships";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { profile, activityGrades, searchQuery } = await req.json();

    let candidates = SCHOLARSHIPS;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      candidates = SCHOLARSHIPS.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.tags.some(t => t.toLowerCase().includes(q)) ||
        s.description.toLowerCase().includes(q) ||
        s.provider.toLowerCase().includes(q)
      );
    }

    const profileText = `
Student profile:
GPA: ${profile?.gpa || "unknown"}
Country: ${profile?.country || "unknown"}
Ethnicity: ${profile?.ethnicity || "not specified"}
Religion: ${profile?.religion || "not specified"}
Financial need: ${profile?.ability_to_pay || "unknown"}
First generation: unknown
Hobbies: ${(profile?.hobbies || []).join(", ") || "none"}
Passion: ${profile?.passion_description || "not provided"}
Intended majors: ${(activityGrades?.intended_majors || []).join(", ") || "undecided"}
SAT Math: ${profile?.sat_math || "not provided"}
SAT English: ${profile?.sat_english || "not provided"}
ACT: ${profile?.act || "not provided"}
`;

    const scholarshipsText = candidates.slice(0, 40).map(s =>
      `ID: ${s.id} | Name: ${s.name} | Amount: ${s.amount} | Tags: ${s.tags.join(", ")} | Eligibility: GPA min ${s.eligibility.gpaMin || "none"}, ethnicity ${s.eligibility.ethnicity?.join("/") || "any"}, religion ${s.eligibility.religion?.join("/") || "any"}, major ${s.eligibility.major?.join("/") || "any"}, financial need ${s.eligibility.financialNeed || false}, nationality ${s.eligibility.nationality?.join("/") || "any"}`
    ).join("\n");

    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1500,
      system: `You are a college scholarship advisor. Given a student's profile and a list of scholarships, return the top 12 best matches for this specific student. Consider GPA, ethnicity, religion, nationality, intended major, financial need, and interests. Return ONLY valid JSON, no other text: { "matches": [ { "id": "scholarship-id", "matchScore": 95, "whyMatch": "One specific sentence explaining why this student matches this scholarship based on their profile", "priority": "high" } ] } where matchScore is 0-100 and priority is "high", "medium", or "low".`,
      messages: [{ role: "user", content: `${profileText}\n\nAvailable scholarships:\n${scholarshipsText}\n\nReturn the top 12 matches as JSON.` }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const matchedScholarships = (parsed.matches || []).map((m: any) => {
      const scholarship = SCHOLARSHIPS.find(s => s.id === m.id);
      return scholarship ? { ...scholarship, matchScore: m.matchScore, whyMatch: m.whyMatch, priority: m.priority } : null;
    }).filter(Boolean);

    return NextResponse.json({ scholarships: matchedScholarships });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Scholarship match error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
