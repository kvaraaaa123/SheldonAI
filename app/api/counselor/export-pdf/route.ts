import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const studentId = searchParams.get("studentId");
  if (!studentId) return NextResponse.json({ error: "Missing studentId" }, { status: 400 });

  const [{ data: profile }, { data: colleges }, { data: essays }, { data: grades }, { data: notes }] = await Promise.all([
    supabase.from("profiles").select("*").eq("user_id", studentId).maybeSingle(),
    supabase.from("college_lists").select("*").eq("user_id", studentId),
    supabase.from("essays").select("id, title, essay_type, content, created_at").eq("user_id", studentId),
    supabase.from("activity_grades").select("*").eq("user_id", studentId),
    supabase.from("counselor_notes").select("note_text, created_at").eq("student_id", studentId).is("essay_id", null).order("created_at", { ascending: false }),
  ]);

  const lines: string[] = [];

  lines.push("=".repeat(60));
  lines.push("STUDENT PROFILE EXPORT — SheldonAI");
  lines.push(`Generated: ${new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}`);
  lines.push("=".repeat(60));
  lines.push("");

  if (profile) {
    lines.push("STUDENT INFORMATION");
    lines.push("-".repeat(30));
    if (profile.full_name) lines.push(`Name: ${profile.full_name}`);
    if (profile.email)     lines.push(`Email: ${profile.email}`);
    if (profile.grade)     lines.push(`Grade: ${profile.grade}`);
    if (profile.school)    lines.push(`School: ${profile.school}`);
    if (profile.gpa)       lines.push(`GPA: ${profile.gpa}`);
    if (profile.sat_score) lines.push(`SAT: ${profile.sat_score}`);
    if (profile.act_score) lines.push(`ACT: ${profile.act_score}`);
    lines.push("");
  }

  if (colleges && colleges.length > 0) {
    lines.push("COLLEGE LIST");
    lines.push("-".repeat(30));
    for (const c of colleges) {
      lines.push(`• ${c.college_name}${c.status ? ` — ${c.status}` : ""}`);
    }
    lines.push("");
  }

  if (essays && essays.length > 0) {
    lines.push("ESSAYS");
    lines.push("-".repeat(30));
    for (const e of essays) {
      lines.push(`\n[${e.essay_type ?? "Essay"}] ${e.title ?? "Untitled"}`);
      if (e.content) lines.push(e.content.slice(0, 500) + (e.content.length > 500 ? "…" : ""));
    }
    lines.push("");
  }

  if (notes && notes.length > 0) {
    lines.push("COUNSELOR NOTES");
    lines.push("-".repeat(30));
    for (const n of notes) {
      const date = new Date(n.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      lines.push(`[${date}] ${n.note_text}`);
    }
    lines.push("");
  }

  const text = lines.join("\n");
  const studentName = profile?.full_name ?? studentId;
  const filename = `sheldonai-${studentName.replace(/\s+/g, "-").toLowerCase()}.txt`;

  return new NextResponse(text, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
