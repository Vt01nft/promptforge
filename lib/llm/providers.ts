export interface LLMProvider {
  name: string;
  baseUrl: string;
  model: string;
  apiKeyEnv: string;
  maxTokens: number;
  priority: number;
}

export const providers: LLMProvider[] = [
  {
    name: "groq",
    baseUrl: "https://api.groq.com/openai/v1",
    model: "llama-3.3-70b-versatile",
    apiKeyEnv: "GROQ_API_KEY",
    maxTokens: 8192,
    priority: 1,
  },
  {
    name: "qwen",
    baseUrl: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1",
    model: "qwen3.5-plus",
    apiKeyEnv: "DASHSCOPE_API_KEY",
    maxTokens: 8192,
    priority: 2,
  },
  {
    name: "gemini",
    baseUrl: "https://generativelanguage.googleapis.com/v1beta/openai",
    model: "gemini-2.5-flash",
    apiKeyEnv: "GOOGLE_AI_KEY",
    maxTokens: 8192,
    priority: 3,
  },
  {
    name: "mistral",
    baseUrl: "https://api.mistral.ai/v1",
    model: "mistral-small-latest",
    apiKeyEnv: "MISTRAL_API_KEY",
    maxTokens: 8192,
    priority: 4,
  },
  {
    name: "openrouter",
    baseUrl: "https://openrouter.ai/api/v1",
    model: "qwen/qwen3-30b-a3b:free",
    apiKeyEnv: "OPENROUTER_API_KEY",
    maxTokens: 4096,
    priority: 5,
  },
];

export function getAvailableProviders(): LLMProvider[] {
  return providers
    .filter((p) => {
      const key = process.env[p.apiKeyEnv];
      return key && key.length > 0;
    })
    .sort((a, b) => a.priority - b.priority);
}

export function getProviderByName(name: string): LLMProvider | undefined {
  return providers.find((p) => p.name === name);
}
