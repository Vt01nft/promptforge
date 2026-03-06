import { NextRequest, NextResponse } from "next/server";
import { cascadeCall } from "@/lib/llm/cascade";
import {
  INTERVIEW_SYSTEM_PROMPT,
  buildInterviewPrompt,
} from "@/lib/llm/meta-prompt";

export async function POST(request: NextRequest) {
  try {
    const { idea } = await request.json();

    if (!idea || typeof idea !== "string" || idea.trim().length < 3) {
      return NextResponse.json(
        { error: "Please describe your idea (at least a few words)" },
        { status: 400 }
      );
    }

    const result = await cascadeCall({
      system: INTERVIEW_SYSTEM_PROMPT,
      user: buildInterviewPrompt(idea.trim()),
      temperature: 0.4,
      maxTokens: 2048,
    });

    let parsed;
    try {
      const cleaned = result.content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      parsed = JSON.parse(cleaned);
    } catch {
      parsed = {
        category: "website",
        questions: [
          {
            id: "q1",
            text: "What design style do you prefer?",
            type: "select",
            options: ["minimal/clean", "dark/hacker", "colorful/vibrant", "corporate/professional"],
          },
          {
            id: "q2",
            text: "What key features are most important?",
            type: "multiselect",
            options: ["responsive design", "animations", "dark mode", "user auth", "database", "API integration"],
          },
          {
            id: "q3",
            text: "Any tech stack preference?",
            type: "select",
            options: ["next.js/react", "vue/nuxt", "python/django", "no preference"],
          },
        ],
      };
    }

    return NextResponse.json({
      category: parsed.category || "website",
      questions: parsed.questions || [],
      provider: result.provider,
    });
  } catch (error) {
    console.error("[interview] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate questions" },
      { status: 500 }
    );
  }
}
