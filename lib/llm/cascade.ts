import OpenAI from "openai";
import { getAvailableProviders, type LLMProvider } from "./providers";

interface CascadeOptions {
  system: string;
  user: string;
  temperature?: number;
  maxTokens?: number;
}

interface CascadeResult {
  content: string;
  provider: string;
  model: string;
  tokens: number;
}

async function callProvider(
  provider: LLMProvider,
  options: CascadeOptions
): Promise<CascadeResult> {
  const apiKey = process.env[provider.apiKeyEnv];
  if (!apiKey) throw new Error(`No API key for ${provider.name}`);

  const client = new OpenAI({
    apiKey,
    baseURL: provider.baseUrl,
    timeout: 30000,
    maxRetries: 1,
  });

  const response = await client.chat.completions.create({
    model: provider.model,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? provider.maxTokens,
    messages: [
      { role: "system", content: options.system },
      { role: "user", content: options.user },
    ],
  });

  const content = response.choices[0]?.message?.content ?? "";
  const tokens = response.usage?.total_tokens ?? 0;

  return {
    content,
    provider: provider.name,
    model: provider.model,
    tokens,
  };
}

export async function cascadeCall(
  options: CascadeOptions
): Promise<CascadeResult> {
  const available = getAvailableProviders();

  if (available.length === 0) {
    throw new Error(
      "No LLM providers configured. Add at least one API key to your .env.local file. Get a free key at console.groq.com (recommended) — see SETUP-GUIDE.md"
    );
  }

  let lastError: Error | null = null;

  for (const provider of available) {
    try {
      console.log(`[cascade] trying ${provider.name} (${provider.model})`);
      const result = await callProvider(provider, options);
      console.log(
        `[cascade] success with ${provider.name} (${result.tokens} tokens)`
      );
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      console.warn(`[cascade] ${provider.name} failed: ${lastError.message}`);
      continue;
    }
  }

  throw new Error(
    `All providers failed. Last error: ${lastError?.message ?? "unknown"}`
  );
}

export async function callWithBYOK(
  options: CascadeOptions & {
    apiKey: string;
    baseUrl: string;
    model: string;
  }
): Promise<CascadeResult> {
  const client = new OpenAI({
    apiKey: options.apiKey,
    baseURL: options.baseUrl,
    timeout: 30000,
    maxRetries: 1,
  });

  const response = await client.chat.completions.create({
    model: options.model,
    temperature: options.temperature ?? 0.7,
    max_tokens: options.maxTokens ?? 8192,
    messages: [
      { role: "system", content: options.system },
      { role: "user", content: options.user },
    ],
  });

  return {
    content: response.choices[0]?.message?.content ?? "",
    provider: "byok",
    model: options.model,
    tokens: response.usage?.total_tokens ?? 0,
  };
}
