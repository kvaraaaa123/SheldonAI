import Anthropic from "@anthropic-ai/sdk";
import { NextRequest, NextResponse } from "next/server";

const anthropic = new Anthropic();

export async function POST(req: NextRequest) {
  const { files } = await req.json();

  if (!files || !Array.isArray(files) || files.length === 0) {
    return NextResponse.json({ error: "No files provided" }, { status: 400 });
  }

  // Build content blocks: one document per file, then the prompt
  // @ts-ignore — document block type not yet in SDK typedefs
  const contentBlocks: unknown[] = files.map((f: { base64: string; name: string }) => ({
    type: "document",
    source: {
      type: "base64",
      media_type: "application/pdf",
      data: f.base64,
    },
  }));

  contentBlocks.push({
    type: "text",
    text: `These are a student's Common App preview PDF(s). Extract all available information and return it as JSON with these exact keys: full_name, birthday (YYYY-MM-DD format), gender, ethnicity, religion, high_school_name, gpa (number), graduation_year, class_rank, sat_math (number), sat_english (number), act (number), country, state, phone, activities (array of objects with: activity_type, position, organization, description, grade_levels as array of strings like ["9","10","11"], timing as array of strings like ["During school year","During school break","All year"], hours_per_week as number, weeks_per_year as number, continue_in_college as boolean). Only include fields that are clearly present in the document. Return valid JSON only, no markdown.`,
  });

  const response = await anthropic.messages.create({
    model: "claude-opus-4-5",
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        // @ts-ignore — mixed content block types
        content: contentBlocks,
      },
    ],
  });

  const raw =
    response.content[0].type === "text" ? response.content[0].text : "";
  const cleaned = raw
    .replace(/^```(?:json)?\n?/, "")
    .replace(/\n?```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(cleaned);
    return NextResponse.json(parsed);
  } catch {
    return NextResponse.json(
      { error: "Failed to parse response" },
      { status: 500 }
    );
  }
}
