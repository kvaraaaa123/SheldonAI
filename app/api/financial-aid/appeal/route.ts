import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

export async function POST(req: NextRequest) {
  const { schoolName, aidOffered, reasons, competingSchool, competingAmount, circumstances } = await req.json();

  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 1000,
    system: "You are an expert in financial aid appeals with 20 years of experience helping families negotiate better aid packages from universities. Write professional, specific, compelling financial aid appeal letters. The letter must be formal, polite, specific about the circumstances, and must make a clear ask. Never be aggressive or entitled in tone. Always express genuine appreciation for the initial offer. The letter should be 3-5 paragraphs, addressed to 'Dear Financial Aid Office,' and signed 'Sincerely, [Student Name]'. Use specific numbers and dates where provided. Make it clear this is a genuine appeal based on real circumstances, not just a request for more money.",
    messages: [{
      role: "user",
      content: `Write a financial aid appeal letter for:
School: ${schoolName}
Aid offered: $${aidOffered} per year
Reasons for appeal: ${(reasons as string[]).join(", ")}
${competingSchool ? `Competing offer: ${competingSchool} offered $${competingAmount} per year` : ""}
Circumstances: ${circumstances}

Write a complete, professional appeal letter ready to send.`,
    }],
  });

  const letter = response.content[0].type === "text" ? response.content[0].text : "";
  return NextResponse.json({ letter });
}
