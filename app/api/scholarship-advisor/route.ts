import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { scholarshipName, scholarshipDescription, essayPrompt, profile, activityGrades, regenerate } = await req.json();

    const profileContext = profile ? `Student: ${profile.full_name || "Unknown"}, from ${profile.country || "unknown"}, GPA ${profile.gpa || "unknown"}, passion: ${profile.passion_description || "not provided"}, hobbies: ${(profile.hobbies || []).join(", ") || "none"}` : "No profile.";
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const activitiesContext = activityGrades ? `Intended majors: ${(activityGrades.intended_majors || []).join(", ")}. Top activities: ${(activityGrades.activities || []).slice(0, 4).map((a: any) => `${a.position} at ${a.organization}`).join("; ")}` : "No activities.";

    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 400,
      system: `You are an elite scholarship essay advisor. Give specific, personalized essay topic ideas for a scholarship application. Base your advice on: (1) what makes scholarship essays stand out — specific stories over generic claims, concrete impact over vague statements, genuine connection to the scholarship's mission; (2) this student's unique profile and activities. ${regenerate ? "The student wants completely different ideas — suggest new angles." : ""} Write in second person, under 200 words, no headers, flowing prose. Be specific to this student.`,
      messages: [{ role: "user", content: `Scholarship: ${scholarshipName}\nDescription: ${scholarshipDescription}\nEssay prompt: ${essayPrompt}\n\n${profileContext}\n${activitiesContext}\n\nGive specific topic ideas for this scholarship essay.` }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ advice: text });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
