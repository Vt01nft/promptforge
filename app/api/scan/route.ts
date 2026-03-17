import { NextRequest, NextResponse } from "next/server";
import { cascadeCall } from "@/lib/llm/cascade";

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "Missing URL" }, { status: 400 });
    }

    // fetch the website HTML
    let html = "";
    try {
      const res = await fetch(url, {
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; PromptForge/1.0)",
        },
        signal: AbortSignal.timeout(10000),
      });
      html = await res.text();
    } catch {
      return NextResponse.json(
        { error: "Could not fetch that website. Check the URL and try again." },
        { status: 400 }
      );
    }

    // extract useful info - strip scripts and styles, get text content
    const cleaned = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim()
      .slice(0, 5000);

    // extract meta info
    const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/i);
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"[^>]*>/i);
    const title = titleMatch?.[1] || "Unknown";
    const description = descMatch?.[1] || "";

    // extract tech hints from HTML
    const techHints: string[] = [];
    if (html.includes("__next") || html.includes("_next/static")) techHints.push("Next.js");
    if (html.includes("__nuxt")) techHints.push("Nuxt/Vue");
    if (html.includes("react")) techHints.push("React");
    if (html.includes("tailwind")) techHints.push("Tailwind CSS");
    if (html.includes("bootstrap")) techHints.push("Bootstrap");
    if (html.includes("wordpress")) techHints.push("WordPress");
    if (html.includes("shopify")) techHints.push("Shopify");

    // use LLM to analyze the website
    const result = await cascadeCall({
      system: `you analyze websites and describe them for prompt generation. be concise and specific. respond in JSON format only, no markdown.`,
      user: `analyze this website and describe what it is:

URL: ${url}
Title: ${title}
Description: ${description}
Tech detected: ${techHints.join(", ") || "unknown"}
Content preview: ${cleaned.slice(0, 3000)}

respond with this exact JSON format:
{
  "summary": "one sentence describing what this site is",
  "type": "website type (e-commerce, saas, portfolio, blog, dashboard, etc.)",
  "features": ["list", "of", "key", "features", "you", "can", "see"],
  "design": "brief description of the design style and colors",
  "tech": "detected or likely tech stack",
  "suggested_idea": "a prompt-ready description for building something similar"
}`,
      temperature: 0.3,
      maxTokens: 2048,
    });

    let analysis;
    try {
      const cleanedResponse = result.content
        .replace(/```json\n?/g, "")
        .replace(/```\n?/g, "")
        .trim();
      analysis = JSON.parse(cleanedResponse);
    } catch {
      analysis = {
        summary: `Website at ${url}`,
        type: "website",
        features: [],
        design: "could not analyze design",
        tech: techHints.join(", ") || "unknown",
        suggested_idea: `build a website similar to ${url} with the same layout and features`,
      };
    }

    return NextResponse.json({
      url,
      title,
      description,
      analysis,
      provider: result.provider,
    });
  } catch (error) {
    console.error("[scan] error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to scan website" },
      { status: 500 }
    );
  }
}