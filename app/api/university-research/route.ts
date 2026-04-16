import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  try {
    const { universityName } = await req.json();

    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 2000,
      system: `You are a deep expert on American universities and college admissions. Generate detailed, specific research about a university that a student can use to write supplemental essays. Return ONLY valid JSON, no other text:
{
  "essayWarning": "The most important thing to know about this university's essays — what most applicants get wrong",
  "philosophy": "2-3 sentences on the university's core educational philosophy and what makes it genuinely distinctive",
  "targetStudent": "2 sentences on what type of student this university is specifically trying to recruit and why",
  "uniqueFeatures": "2-3 sentences on what is genuinely different about this university compared to all peer institutions",
  "supplementalPrompts": [
    { "title": "Prompt title", "text": "Full prompt text as asked in the application", "wordLimit": 650, "isWhyUs": false }
  ],
  "categories": [
    {
      "label": "Signature Programs",
      "emoji": "📚",
      "items": [
        { "name": "Program name", "detail": "2-3 specific sentences about this program and why it matters for essay writing" }
      ]
    },
    {
      "label": "Traditions",
      "emoji": "🎭",
      "items": [
        { "name": "Tradition name", "detail": "2-3 specific sentences" }
      ]
    },
    {
      "label": "Clubs & Organizations",
      "emoji": "🏛️",
      "items": [
        { "name": "Club name", "detail": "2-3 specific sentences" }
      ]
    },
    {
      "label": "Research Institutes",
      "emoji": "🔬",
      "items": [
        { "name": "Institute name", "detail": "2-3 specific sentences" }
      ]
    }
  ]
}`,
      messages: [{ role: "user", content: `Generate detailed research about ${universityName} for a student writing supplemental essays. Include specific programs, traditions, clubs, and research institutes. Be specific and accurate.` }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "{}";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);
    return NextResponse.json({ research: parsed, universityName });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
