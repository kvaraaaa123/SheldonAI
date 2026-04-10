import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SYSTEM = `You are a deep expert on elite university admissions and campus life. A student is researching a specific university to write a "Why Us?" supplemental essay. Your job is to give them richly detailed, accurate, specific information about whatever they ask — clubs, professors, traditions, courses, buildings, religious communities, research institutes, or anything else.

When describing a club or organization, cover: founding year and story, current mission and goals, what types of students typically join and why, notable alumni or past members, specific traditions or rituals the club has, how students get involved, what makes this club distinct from similar ones at peer institutions, and why referencing this club specifically in a Why Us essay would be effective.

When describing a professor, cover: their research focus in plain language, their most important publications or projects, what their courses are like and who takes them, why they are unusual or distinctive compared to professors at peer institutions, and how a student could connect to their work in a Why Us essay.

When describing a tradition or cultural moment, cover: its origins and history, how it actually works (step by step if relevant), the emotional tone and significance students attach to it, any controversies or changes it has undergone, and what it reveals about the institution's character.

NEVER make up specific facts. If you are uncertain about a specific number, date, or name, say so and give the general shape of the answer. NEVER name-drop books, articles, or sources by title. Present all information as established institutional knowledge.

FORMAT: Write in flowing paragraphs, no bullet points, no headers. One rich, detailed response that the student can mine for specific details to use in their essay.`;

export async function POST(req: NextRequest) {
  try {
    const { university, question, messages } = await req.json();
    if (!university || !question) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const history = (messages || []).slice(-8).map((m: {role: string; content: string}) => ({
      role: m.role as "user" | "assistant",
      content: m.content,
    }));

    const userMsg = `University: ${university}\n\nQuestion: ${question}`;

    const response = await anthropic.messages.create({
      model: "claude-opus-4-5",
      max_tokens: 1200,
      system: SYSTEM,
      messages: [
        ...history,
        { role: "user", content: userMsg },
      ],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ answer: text });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
