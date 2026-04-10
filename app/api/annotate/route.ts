import { NextRequest, NextResponse } from "next/server";
import { annotateEssay } from "@/lib/annotate";

// Next.js App Router API routes export a function named after the HTTP method.
// POST = this runs when the frontend sends a POST request to /api/annotate
export async function POST(request: NextRequest) {
  try {
    // Parse the JSON body the frontend sent
    const body = await request.json();
    const { essay, essayType = "", universityName = "" } = body;

    // Basic validation — never trust input
    if (!essay || typeof essay !== "string") {
      return NextResponse.json(
        { error: "Essay text is required" },
        { status: 400 }
      );
    }

    if (essay.trim().length < 100) {
      return NextResponse.json(
        { error: "Essay is too short. Please paste at least a paragraph." },
        { status: 400 }
      );
    }

    if (essay.trim().length > 10000) {
      return NextResponse.json(
        { error: "Essay exceeds maximum length." },
        { status: 400 }
      );
    }

    // Call Claude — this is the actual AI work
    const result = await annotateEssay(essay, { essayType, universityName });

    return NextResponse.json(result);
  } catch (error) {
    console.error("Annotation error:", error);
    return NextResponse.json(
      { error: "Failed to annotate essay. Please try again." },
      { status: 500 }
    );
  }
}
