import { NextRequest, NextResponse } from "next/server";
import { cascadeCall } from "@/lib/llm/cascade";
import {
  META_SYSTEM_PROMPT,
  buildGenerationPrompt,
} from "@/lib/llm/meta-prompt";

export async function POST(request: NextRequest) {
  try {
    const { idea, answers, category } = await request.json();

    if (!idea || typeof idea !== "string") {
      return NextResponse.json(
        { error: "Missing idea" },
        { status: 400 }
      );
    }

    const userPrompt = buildGenerationPrompt(
      idea.trim(),
      answers || {},
      category || "website"
    );

    const result = await cascadeCall({
      system: META_SYSTEM_PROMPT,
      user: userPrompt,
      temperature: 0.6,
      maxTokens: 8192,
    });

    return NextResponse.json({
      prompt: result.content,
      provider: result.provider,
      model: result.model,
      tokens: result.tokens,
    });
  } catch (error) {
    console.error("[generate] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to generate prompt" },
      { status: 500 }
    );
  }
}
