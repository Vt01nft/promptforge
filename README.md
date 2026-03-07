# ⚡ promptforge

> turn rough ideas into production-grade prompts. free. open source.

**most people fail at prompting because they skip structure, context, constraints, and examples. promptforge fills that gap automatically.**

describe what you want to build → get a perfectly structured prompt → paste into any LLM → ship.

## how it works

```
"i want a crypto portfolio tracker"

    ↓ promptforge asks smart follow-up questions

    ↓ generates a 2,000+ token production-grade prompt with:
      • expert role assignment
      • specific tech stack
      • complete file structure
      • design specs (hex colors, fonts, layout)
      • numbered requirements
      • constraints to prevent mistakes
      • step-by-step build order

    ↓ copy → paste into claude / chatgpt / gemini / qwen

    ↓ LLM builds exactly what you described. first try.
```

## features

- **adaptive interview** — asks smart follow-up questions based on your idea's complexity
- **production-grade output** — prompts follow anthropic's best practices (xml tags, role assignment, chain of thought)
- **works with any LLM** — claude, chatgpt, gemini, qwen, local models
- **12+ templates** — websites, bots, apis, agents, scripts, apps
- **quality scoring** — shows why your prompt works and what's included
- **100% free** — powered by free LLM APIs (groq, qwen, gemini, mistral)
- **no signup required** — just type and forge
- **open source** — MIT license, contribute templates easily

## quick start

```bash
# clone the repo
git clone https://github.com/Vt01nft/promptforge.git
cd promptforge

# install dependencies
npm install

# copy env file and add your free API keys
cp .env.example .env.local
# edit .env.local — add at least one key (groq recommended)

# run locally
npm run dev
```

open [http://localhost:3000](http://localhost:3000)

## free API keys

all free, no credit card required:

| provider | free tier | get key |
|----------|-----------|---------|
| **groq** (recommended) | 14,400 req/day | [console.groq.com](https://console.groq.com) |
| **qwen 3.5** | free quota | [dashscope.console.aliyun.com](https://dashscope.console.aliyun.com) |
| **google gemini** | 500 req/day | [aistudio.google.com](https://aistudio.google.com/apikey) |
| **mistral** | 1B tokens/month | [console.mistral.ai](https://console.mistral.ai) |
| **openrouter** | 50 req/day | [openrouter.ai](https://openrouter.ai/keys) |

add at least one key. the app auto-cascades through available providers.

## tech stack

- **next.js 15** — app router, typescript, server components
- **tailwind css** — dark theme, custom design system
- **framer motion** — smooth animations
- **zustand** — lightweight state management
- **openai sdk** — unified LLM interface (works with all providers)
- **vercel** — free deployment

## project structure

```
promptforge/
├── app/
│   ├── page.tsx                # landing page
│   ├── forge/page.tsx          # main forge interface
│   ├── templates/page.tsx      # template library
│   └── api/
│       ├── generate/route.ts   # prompt generation endpoint
│       └── interview/route.ts  # follow-up questions endpoint
├── components/
│   ├── forge/                  # forge UI components
│   ├── shared/                 # navbar, shared components
│   └── landing/                # landing page sections
├── lib/
│   ├── llm/
│   │   ├── providers.ts        # LLM provider configs
│   │   ├── cascade.ts          # auto-fallback logic
│   │   └── meta-prompt.ts      # the meta-prompting engine
│   ├── templates/              # prompt templates
│   ├── store.ts                # zustand state
│   └── utils.ts                # utilities
└── public/
```

## contributing

**adding a template is the easiest way to contribute:**

1. fork the repo
2. add your template to `lib/templates/index.ts`
3. submit a PR

templates are just objects with an id, name, category, description, and starter idea. see existing templates for the format.

other ways to contribute:
- improve the meta-prompting engine
- add new LLM providers
- improve the UI/UX
- fix bugs
- add tests

## deploy your own

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/YOUR_USERNAME/promptforge&env=GROQ_API_KEY)

1. click the button above
2. add your API keys in vercel environment settings
3. deploy — live in 60 seconds

## license

MIT — do whatever you want with it.

---

**star this repo if it helped you ship faster ⭐**
