import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";
import { UNIVERSITY_DATABASE, UniversityEntry } from "@/lib/universityDatabase";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

function preFilter(candidates: UniversityEntry[], profile: Record<string, unknown> | null): UniversityEntry[] {
  const studentGpa = parseFloat(String(profile?.gpa || "3.5")) || 3.5;
  const needFullAid = profile?.financial_aid_need === "Need full aid";

  return candidates
    .filter(u => {
      // Drop schools whose average GPA is more than 0.6 above the student's GPA
      if (u.gpaAvg > studentGpa + 0.6) return false;
      // If student needs full aid, strongly prefer need-blind — but don't eliminate entirely
      return true;
    })
    .sort((a, b) => {
      // Boost need-blind schools when student needs full aid
      if (needFullAid) {
        const aNeedBlind = a.tags.includes("Need-Blind") ? 1 : 0;
        const bNeedBlind = b.tags.includes("Need-Blind") ? 1 : 0;
        if (aNeedBlind !== bNeedBlind) return bNeedBlind - aNeedBlind;
      }
      return 0;
    })
    .slice(0, 35);
}

export async function POST(req: NextRequest) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 28000);

  try {
    const { profile, activityGrades, savedColleges } = await req.json();

    const profileText = `
GPA: ${profile?.gpa || "unknown"}
SAT Math: ${profile?.sat_math || "not taken"}, SAT English: ${profile?.sat_english || "not taken"}, ACT: ${profile?.act || "not taken"}
From: ${profile?.country || "unknown"}, ${profile?.state || ""}
Intended majors: ${((activityGrades?.intended_majors as string[]) || []).join(", ") || "undecided"}
Passion: ${profile?.passion_description || "not provided"}
Hobbies: ${((profile?.hobbies as string[]) || []).join(", ") || "none"}
Activities packaging: ${(activityGrades?.results as Record<string, unknown>)?.packagingVerdict || "not analyzed"}
Top activities: ${((activityGrades?.activities as { position: string; organization: string }[]) || []).slice(0, 4).map(a => `${a.position} at ${a.organization}`).join("; ") || "none"}
Financial aid need: ${profile?.financial_aid_need || "unknown"}
Campus environment preference: ${profile?.campus_environment || "no preference"}
Campus size preference: ${profile?.campus_size || "no preference"}
School type preference: ${profile?.school_type || "no preference"}
Distance preference: ${profile?.distance_preference || "no preference"}
Social culture preference: ${profile?.social_culture || "no preference"}
Academic intensity preference: ${profile?.academic_intensity || "no preference"}
Climate preference: ${profile?.climate_preference || "no preference"}
`;

    const savedNames = (savedColleges || []).map((c: { university_name: string }) => c.university_name);
    const candidates = UNIVERSITY_DATABASE.filter(u => !savedNames.includes(u.name));
    const filteredCandidates = preFilter(candidates, profile as Record<string, unknown> | null);

    const universitiesText = filteredCandidates.map(u =>
      `Name: ${u.name} | Type: ${u.type} | Size: ${u.size} | Environment: ${u.environment} | Acceptance: ${u.acceptanceRate}% | SAT: ${u.satRange[0]}-${u.satRange[1]} | ACT: ${u.actRange[0]}-${u.actRange[1]} | GPA avg: ${u.gpaAvg} | Climate: ${u.climate} | Greek: ${u.greekLife} | D1: ${u.divisionI} | Tags: ${u.tags.join(", ")} | Financial aid: ${u.tags.includes("Need-Blind") ? "need-blind" : "need-aware"}`
    ).join("\n");

    const systemPrompt = `You are an elite college admissions counselor with 25 years of experience. You have a student's complete profile including academic stats, intended major, activities, campus preferences, and financial needs. Your job is to recommend the top 10 best-fit universities ranked from best match to least match.

For each recommendation you MUST:
1. Make a strong, specific case why this university is exceptional for this student's INTENDED MAJOR specifically — name the specific department, program, professors, research opportunities, or unique academic structure at that university that makes it the right place for this student's field
2. Reference the student's actual profile data — their specific GPA, activities, background, or preferences
3. Explain the match between the student's campus preferences (size, environment, climate, social culture) and what this university offers
4. Be honest about reach vs match vs safety based on the acceptance rate and the student's stats
5. Rank them genuinely — #1 should be the university where this student would thrive most, not just the most prestigious

Return ONLY valid JSON, no other text:
{
  "matches": [
    {
      "name": "Harvard University",
      "matchScore": 94,
      "status": "reach",
      "whyMajor": "2-3 sentences specifically about why this university is exceptional for the student's intended major",
      "whyProfile": "1-2 sentences connecting the student's specific stats and activities to this university",
      "whyPreferences": "1 sentence about campus fit based on their stated preferences",
      "rank": 1
    }
  ]
}`;

    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2500,
      system: systemPrompt,
      messages: [{ role: "user", content: `Student profile:\n${profileText}\n\nAvailable universities:\n${universitiesText}\n\nReturn the top 10 best matches as JSON.` }],
    });

    clearTimeout(timeout);

    const rawText = response.content[0].type === "text" ? response.content[0].text : "{}";
    const clean = rawText.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    const enrichedMatches = (parsed.matches || []).map((m: { name: string }) => {
      const uniData = UNIVERSITY_DATABASE.find(u => u.name === m.name);
      return { ...m, ...uniData };
    });

    return NextResponse.json({ matches: enrichedMatches });
  } catch (e: unknown) {
    clearTimeout(timeout);
    if (e instanceof Error && e.name === "AbortError") {
      return NextResponse.json({ error: "Request timed out. Please try again." }, { status: 504 });
    }
    const msg = e instanceof Error ? e.message : String(e);
    console.error("College match error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
