import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { description } = await req.json();
    if (!description || typeof description !== "string") {
      return NextResponse.json({ error: "Description is required" }, { status: 400 });
    }

    // Google GenAI API Key from env
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing Gemini API key" }, { status: 500 });
    }

    // Use a working model from your available models
    // We'll use Gemini 1.5 Pro 001 as an example
    const model = "gemini-1.5-pro-001";
    const endpoint = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

    const prompt = `Extract 5-10 concise, relevant job tags from the following job description. Only output a JSON array of tags, no explanations.\n\nDescription: ${description}`;
    const apiRes = await fetch(
      endpoint,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );
    if (!apiRes.ok) {
      const errText = await apiRes.text();
      return NextResponse.json({ error: "GenAI API error", details: errText }, { status: 500 });
    }
    const apiData = await apiRes.json();
    // Parse tags from AI response
    let tags: string[] = [];
    try {
      const text = apiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      tags = JSON.parse(text);
    } catch {
      // fallback: try to extract tags from plain text
      const text = apiData.candidates?.[0]?.content?.parts?.[0]?.text || "";
      tags = text.match(/"(.*?)"/g)?.map((t: string) => t.replace(/"/g, "")) || [];
    }
    return NextResponse.json({ tags });
  } catch (err: unknown) {
    return NextResponse.json({ error: "Internal server error", details: err instanceof Error ? err.message : String(err) }, { status: 500 });
  }
};
