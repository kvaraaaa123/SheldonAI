import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { profile, activityGrades, essays } = await req.json();

    const profileText = `
Name: ${profile.full_name || "Unknown"}
Background: ${profile.ethnicity || ""}, ${profile.religion || ""}, from ${profile.country || ""}, ${profile.state || ""}
Education: ${profile.high_school_name || ""}, GPA ${profile.gpa || ""}, Class rank ${profile.class_rank || ""}
Test scores: SAT Math ${profile.sat_math || "not provided"}, SAT English ${profile.sat_english || "not provided"}, ACT ${profile.act || "not provided"}
Graduation: ${profile.graduation_year || ""}, starting college ${profile.start_semester || ""}
Extracurriculars noted: ${(profile.extracurriculars || []).join(", ") || "none listed"}
Hobbies: ${(profile.hobbies || []).join(", ") || "none listed"}
Passion: ${profile.passion_description || "not provided"}
Research: ${profile.has_research || "none"} — ${profile.research_description || ""}
`;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activitiesText = activityGrades ? `
Intended majors: ${(activityGrades.intended_majors || []).join(", ")}
Activities grader overall feedback: ${activityGrades.results?.overallFeedback || ""}
Packaging verdict: ${activityGrades.results?.packagingVerdict || ""}
Activities: ${(activityGrades.activities || activityGrades.results?.activities || []).map((a: any, i: number) => `${i+1}. ${a.activity_type || ""} — ${a.position || ""} at ${a.organization || ""} (Grade: ${a.grade || ""}, Essay potential: ${a.essayPotential || ""})`).join("; ")}
` : "No activity grades available yet.";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const essaysText = essays && essays.length > 0 ? `
Saved essays (${essays.length}):
${essays.map((e: any) => `- Type: ${e.essay_type}, University: ${e.university_name || "N/A"}, First 200 chars: "${(e.essay || "").substring(0, 200)}..."`).join("\n")}
` : "No essays saved yet.";

    const systemPrompt = `You are the world's most experienced college admissions counselor, having spent 25 years at Harvard, Yale, and Princeton's admissions offices. You evaluate complete application packages holistically.

Your job is to give this student a complete, honest, specific assessment of their entire application package — profile, activities, and essays — as a unified whole.

KEY PRINCIPLES:
1. COHERENCE: Does this student's story make sense? Profile background + activities + essays must tell one unified, compelling narrative about who this person is.
2. ESSAY NOVELTY: Essays should reveal something the activities list cannot show. If the student is writing essays about common activities (NHS, club sports, standard volunteering), flag it. Essays about extraordinary activities (national championship, internship with a head of state, truly unique research) are justified. Essays should be additive — revealing a new dimension of the student, not restating the resume.
3. HOLISTIC HUMANITY: The strongest applications show a student who is both focused AND fully human. A student with all political activities and a personal statement about politics needs something that shows they are more than their ambition.
4. PACKAGING: The admissions officer should be able to summarize this student in one sentence after reading everything. If they cannot, the packaging has failed.
5. ADDITIVE vs REPETITIVE: If essays cover the same ground as activities, the essays are wasted. Flag repetition specifically.

Return ONLY a valid JSON object, no other text:
{
  "packagingScore": "4-6 sentences — the most prominent, comprehensive verdict on how well the entire application package works together. Be specific about what works and what does not.",
  "activitiesCoherence": "2-3 sentences on whether the activities list has a clear spike and tells a coherent story aligned with the student's background and intended major",
  "essayAlignment": "2-3 sentences on whether the essays (if any) are additive or repetitive relative to the activities list, and whether they reveal something new about this student",
  "noveltyCheck": "1-2 sentences specifically about whether the student is writing essays about common activities when they should be finding a different story",
  "strengthenThis": "The single most important specific thing this student must do before submitting applications",
  "oneSentenceSummary": "One sentence summarizing who this student is as an applicant — what an admissions officer would say about them"
}`;

    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: "user", content: `${profileText}\n\nACTIVITIES DATA:\n${activitiesText}\n\nESSAYS:\n${essaysText}` }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json(parsed);
  } catch (e) {
    console.error("Profile analysis error:", e);
    return NextResponse.json({ error: "Analysis failed" }, { status: 500 });
  }
}
