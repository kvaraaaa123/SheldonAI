import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const docId = searchParams.get("docId");

  if (!docId) {
    return NextResponse.json({ error: "Missing docId" }, { status: 400 });
  }

  if (!/^[a-zA-Z0-9_-]+$/.test(docId)) {
    return NextResponse.json({ error: "Invalid docId" }, { status: 400 });
  }

  try {
    const resp = await fetch(
      `https://docs.google.com/document/d/${docId}/export?format=txt`,
      { redirect: "follow" }
    );

    if (resp.status === 401 || resp.status === 403) {
      return NextResponse.json({ error: "not_accessible" }, { status: 403 });
    }

    if (!resp.ok) {
      return NextResponse.json({ error: "not_accessible" }, { status: 403 });
    }

    const text = await resp.text();
    return NextResponse.json({ text: text.trim() });
  } catch {
    return NextResponse.json({ error: "fetch_failed" }, { status: 502 });
  }
}
