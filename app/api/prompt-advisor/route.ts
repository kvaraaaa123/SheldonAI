import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { prompt, promptTitle, universityName, profile, activityGrades, regenerate } = await req.json();

    const profileContext = profile ? `
STUDENT PROFILE:
Name: ${profile.full_name || "Unknown"}
From: ${profile.country || "Unknown"}, ${profile.state || ""}
High school: ${profile.high_school_name || "Unknown"}, GPA: ${profile.gpa || "Unknown"}
Intended major signals: ${(profile.extracurriculars || []).join(", ") || "none listed"}
Personal passion: ${profile.passion_description || "not provided"}
Hobbies and interests: ${(profile.hobbies || []).join(", ") || "none listed"}
Research: ${profile.has_research === "yes" ? profile.research_description || "yes, no description" : "none"}
Background: ${profile.ethnicity || ""} ${profile.religion || ""}
` : "No profile data available.";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activitiesContext = activityGrades ? `
INTENDED MAJORS: ${(activityGrades.intended_majors || []).join(", ") || "Undecided"}
ACTIVITIES PACKAGING VERDICT: ${activityGrades.results?.packagingVerdict || "not analyzed"}
ACTIVITIES LIST:
${(activityGrades.activities || []).map((a: any, i: number) => `${i+1}. [${a.activity_type || "unknown"}] ${a.position || ""} at ${a.organization || ""} — "${a.description || ""}" | Essay potential: ${a.essayPotential || "unknown"} | ${a.essayVerdict || ""}`).join("\n")}
` : "No activity grades available.";

    const systemPrompt = `You are an elite college admissions essay advisor combining two frameworks:

FRAMEWORK 1 — ESSAY THEORY (from Fiske Guide, College Essay Guy, and top admissions experts):
The best college essays share these qualities:
- They begin in scene — a specific moment, not a general statement
- They focus on the small and specific, not the large and abstract — the best essays are about a single moment, object, conversation, or decision rather than a sweeping theme
- They show rather than tell — concrete sensory details beat adjectives and generalizations
- They reveal character through action and specific detail, not through direct statement ("I am a leader" is weak; showing a specific moment of leadership is strong)
- They have a clear emotional core — the reader should feel something specific by the end
- They are surprising — the topic should not be predictable given the student's activities list
- They avoid the five catastrophic mistakes: being too safe (choosing a generic topic to avoid risk), being too vague (writing about a broad theme rather than a specific moment), over-explaining the lesson learned (the reader should feel the insight, not be told it), writing a resume in prose (retelling accomplishments rather than revealing character), and trying to impress rather than connect
- The best essays make the admissions officer feel they know this specific person in a way no other part of the application can achieve
- Supplemental essays specifically: they must demonstrate genuine, specific knowledge of the university — not praise that could apply to any school

FRAMEWORK 2 — INDIVIDUAL PACKAGING (the student's specific case):
Use the student's activities, profile, and intended major to:
- Identify which activities are already obvious from their list (and therefore should NOT be essay topics)
- Identify what is MISSING from their application picture — what dimension of this person is not yet visible
- Find the unexpected angle — what would SURPRISE an admissions officer who has already read their activities list
- Ensure the essay is ADDITIVE — it must add a new layer to who this student is, not repeat what is already in their profile
- Flag if a topic is overused across thousands of applications (sports taught me teamwork, volunteering taught me gratitude, debate taught me to see multiple perspectives — all weak)

YOUR JOB:
Give this specific student 2-3 concrete, creative topic ideas for this specific prompt at this specific university. Each idea must:
1. Be specific to THIS student — not generic advice any student could receive
2. Be based on something real in their profile or activities
3. Be ADDITIVE — reveal a dimension not already visible in their activities list
4. Follow essay theory — be anchored in a specific moment or detail, not a broad theme
5. Be appropriate for this university's prompt specifically

${regenerate ? "The student did not like the previous suggestions. Generate completely different topic angles — approach the prompt from an entirely new direction." : ""}

Write in second person, directly to the student. Be specific and concrete. Keep under 220 words. No bullet points, no headers — flowing prose. Start immediately with your best recommendation. Be honest if a topic is risky or overused.`;

    const userMessage = `UNIVERSITY: ${universityName}
PROMPT TITLE: ${promptTitle}
FULL PROMPT: ${prompt}

${profileContext}
${activitiesContext}

Give this student specific, creative, personalized topic ideas for this exact prompt based on their unique profile and activities. Apply both the essay theory framework and their individual packaging context.`;

    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 500,
      system: systemPrompt,
      messages: [{ role: "user", content: userMessage }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ advice: text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    console.error("Prompt advisor error:", msg);
    return NextResponse.json({ error: msg || "Advisor failed" }, { status: 500 });
  }
}
