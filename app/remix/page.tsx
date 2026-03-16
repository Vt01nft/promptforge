"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useForgeStore } from "@/lib/store";
import Navbar from "@/components/shared/navbar";
import { cn, copyToClipboard, estimateTokens } from "@/lib/utils";
import { toast } from "sonner";
import {
  Shuffle,
  Copy,
  ArrowRight,
  Eye,
  X,
  Globe,
  Bot,
  Server,
  LayoutDashboard,
  Smartphone,
  Terminal,
  Star,
} from "lucide-react";

interface CommunityPrompt {
  id: string;
  title: string;
  category: string;
  author: string;
  description: string;
  idea: string;
  prompt: string;
  stars: number;
}

const communityPrompts: CommunityPrompt[] = [
  {
    id: "cp-1",
    title: "Crypto Portfolio Tracker",
    category: "website",
    author: "vt",
    description: "Full-stack portfolio tracker with wallet connect, live prices, and PnL charts",
    idea: "a crypto portfolio tracker website with wallet connect, live token prices, and profit/loss charts",
    prompt: `<role>\nyou are a senior full-stack web3 developer specializing in cryptocurrency applications and real-time data dashboards.\n</role>\n\n<project>\nbuild a crypto portfolio tracker web application that lets users connect their ethereum wallets and view all their tokens, balances, real-time prices, and profit/loss in one dashboard.\n</project>\n\n<tech_stack>\n- framework: next.js 15 (app router, typescript)\n- styling: tailwind css (dark theme only)\n- web3: wagmi v2 + viem for wallet connection\n- data: coingecko api (free tier) for token prices\n- charts: recharts for portfolio value over time\n- state: zustand for global state\n- auth: rainbowkit + siwe (sign in with ethereum)\n- deployment: vercel\n</tech_stack>\n\n<design>\ntheme: dark mode only\nbackground: #0a0a0f\nsurface: #12121a\nprimary accent: #00d4aa (green for gains)\nnegative accent: #ff4757 (red for losses)\nfont heading: "JetBrains Mono"\nfont body: "Geist Sans"\nborder radius: 12px\n</design>\n\n<requirements>\n1. wallet connection with rainbowkit (metamask, walletconnect, coinbase)\n2. fetch all ERC-20 token balances for connected wallet\n3. real-time USD prices from coingecko\n4. total portfolio value with 24h change percentage\n5. area chart showing portfolio value over time (24h, 7d, 30d, 1y)\n6. token list sorted by value with search/filter\n7. each token shows: logo, name, balance, price, value, 24h change\n8. responsive design (mobile: bottom tabs, desktop: sidebar)\n9. skeleton loading states for all components\n10. error boundaries with retry buttons\n</requirements>\n\n<constraints>\n- coingecko free api: 30 req/min limit, cache for 30 seconds\n- never store private keys\n- wallet connection is read-only\n- typescript strict mode, no any types\n</constraints>`,
    stars: 47,
  },
  {
    id: "cp-2",
    title: "Discord Moderation Bot",
    category: "bot",
    author: "community",
    description: "Full-featured Discord bot with auto-mod, slash commands, and ticket system",
    idea: "a discord moderation bot with auto-mod, slash commands, warning system, and ticket system",
    prompt: `<role>\nyou are a senior discord bot developer with expertise in discord.js v14, slash commands, and bot architecture.\n</role>\n\n<project>\nbuild a discord moderation bot with automated moderation, slash commands, a warning/strike system, and a ticket system for user support.\n</project>\n\n<tech_stack>\n- runtime: node.js 20+\n- library: discord.js v14\n- database: sqlite (better-sqlite3) for warnings, tickets, config\n- language: typescript\n- deployment: docker + any VPS\n</tech_stack>\n\n<file_structure>\ndiscord-mod-bot/\n├── src/\n│   ├── index.ts\n│   ├── commands/\n│   │   ├── moderation/ (ban, kick, mute, warn, purge)\n│   │   ├── tickets/ (ticket-create, ticket-close)\n│   │   └── config/ (setup, automod-config)\n│   ├── events/ (messageCreate, guildMemberAdd, interactionCreate)\n│   ├── handlers/ (command-handler, event-handler)\n│   ├── utils/ (embeds, permissions, logger)\n│   └── database/ (db.ts, models/)\n├── Dockerfile\n└── package.json\n</file_structure>\n\n<requirements>\n1. slash command handler with auto-registration\n2. /ban, /kick, /mute (with duration), /warn, /purge commands\n3. warning system: track strikes per user, auto-escalate (3 warns = mute, 5 = ban)\n4. auto-mod: detect spam, mass mentions, invite links, caps lock\n5. ticket system: button to open ticket, creates private channel, close button\n6. mod log channel: all actions logged with embeds\n7. welcome message with configurable channel\n8. permission checks on all commands\n9. per-server configuration stored in database\n10. error handling with user-friendly messages\n</requirements>`,
    stars: 32,
  },
  {
    id: "cp-3",
    title: "SaaS Landing Page",
    category: "website",
    author: "community",
    description: "High-converting landing page with hero, features, pricing, testimonials, FAQ",
    idea: "a high-converting saas landing page with hero, features, pricing table, testimonials, and faq",
    prompt: `<role>\nyou are a senior frontend developer and conversion optimization specialist who builds high-converting SaaS landing pages.\n</role>\n\n<project>\nbuild a modern SaaS landing page optimized for conversions with hero section, feature highlights, pricing table, testimonials, FAQ, and CTA sections.\n</project>\n\n<tech_stack>\n- framework: next.js 15 (app router, typescript)\n- styling: tailwind css\n- animations: motion (framer-motion v12)\n- icons: lucide-react\n- deployment: vercel\n</tech_stack>\n\n<design>\ntheme: dark with accent gradients\nbackground: #09090b\nprimary: linear-gradient(135deg, #6366f1, #8b5cf6)\ntext: #fafafa\nsecondary text: #a1a1aa\nfont: "Inter" for body, "Cal Sans" for headings\nspacing: generous (py-24 between sections)\nborder radius: 16px for cards\nanimations: scroll-triggered fade-up reveals, staggered card appearances\n</design>\n\n<requirements>\n1. hero: headline, subheadline, CTA button, product screenshot/mockup\n2. social proof bar: "trusted by 10,000+ teams" with logo row\n3. features: 3-column grid with icons, titles, descriptions\n4. how it works: 3-step numbered flow\n5. pricing: 3 tiers (free, pro, enterprise) with feature comparison\n6. testimonials: 3 cards with photo, name, role, quote\n7. FAQ: accordion with 6 common questions\n8. final CTA: full-width section with gradient background\n9. sticky navbar with smooth scroll to sections\n10. fully responsive, mobile-first\n</requirements>`,
    stars: 28,
  },
  {
    id: "cp-4",
    title: "REST API with Auth",
    category: "api",
    author: "community",
    description: "Production-ready REST API with JWT auth, CRUD, validation, and docs",
    idea: "a production rest api with jwt authentication, crud operations, input validation, rate limiting, and swagger docs",
    prompt: `<role>\nyou are a senior backend developer specializing in building production-ready, secure REST APIs.\n</role>\n\n<project>\nbuild a production-ready REST API with JWT authentication, CRUD operations, input validation, rate limiting, error handling, and auto-generated Swagger documentation.\n</project>\n\n<tech_stack>\n- runtime: node.js 20+ with typescript\n- framework: express.js with express-validator\n- auth: jsonwebtoken + bcrypt\n- database: postgresql with prisma ORM\n- docs: swagger-jsdoc + swagger-ui-express\n- rate limiting: express-rate-limit\n- testing: jest + supertest\n</tech_stack>\n\n<requirements>\n1. user registration (email + password, bcrypt hashed)\n2. login endpoint returning JWT access + refresh tokens\n3. token refresh endpoint\n4. protected routes middleware (verify JWT)\n5. CRUD endpoints for a "posts" resource (create, read, update, delete)\n6. input validation on all endpoints with clear error messages\n7. pagination, sorting, and filtering on list endpoints\n8. rate limiting: 100 req/15min per IP\n9. centralized error handling middleware\n10. swagger docs auto-generated from JSDoc comments\n11. health check endpoint\n12. cors configured for production\n</requirements>\n\n<constraints>\n- passwords never returned in responses\n- tokens expire: access 15min, refresh 7 days\n- all inputs sanitized against injection\n- typescript strict mode\n- proper HTTP status codes on all responses\n</constraints>`,
    stars: 41,
  },
  {
    id: "cp-5",
    title: "AI Chatbot Interface",
    category: "app",
    author: "vt",
    description: "ChatGPT-style interface with streaming, markdown, and conversation history",
    idea: "a chatgpt-style chat interface with streaming responses, markdown rendering, code highlighting, and conversation history",
    prompt: `<role>\nyou are a senior frontend developer specializing in real-time chat interfaces and AI application UX.\n</role>\n\n<project>\nbuild a ChatGPT-style chat interface with streaming responses, markdown rendering, syntax-highlighted code blocks, and conversation history.\n</project>\n\n<tech_stack>\n- framework: next.js 15 (app router, typescript)\n- styling: tailwind css (dark theme)\n- markdown: react-markdown + remark-gfm\n- code highlighting: rehype-highlight\n- streaming: ReadableStream / SSE\n- state: zustand\n- storage: localStorage for conversation history\n</tech_stack>\n\n<design>\nbackground: #0a0a0a\nchat bubbles: user (#1a1a2e), assistant (#0e0e18)\naccent: #10b981\nfont: "Inter" for UI, "JetBrains Mono" for code\nmax-width: 768px centered\ninput: sticky bottom bar with auto-resize textarea\n</design>\n\n<requirements>\n1. chat input with auto-resizing textarea and send button\n2. streaming responses that appear token by token\n3. markdown rendering in assistant messages\n4. syntax-highlighted code blocks with copy button\n5. conversation list in sidebar (create new, switch, delete)\n6. conversations saved to localStorage\n7. loading indicator while waiting for response\n8. auto-scroll to latest message\n9. mobile responsive (sidebar becomes slide-out drawer)\n10. keyboard shortcut: Enter to send, Shift+Enter for newline\n</requirements>`,
    stars: 55,
  },
];

export default function RemixPage() {
  const [selectedPrompt, setSelectedPrompt] = useState<CommunityPrompt | null>(null);
  const [filter, setFilter] = useState("all");
  const router = useRouter();
  const { setIdea, reset } = useForgeStore();

  const categories = ["all", ...new Set(communityPrompts.map((p) => p.category))];

  const filtered = filter === "all"
    ? communityPrompts
    : communityPrompts.filter((p) => p.category === filter);

  const handleRemix = (prompt: CommunityPrompt) => {
    reset();
    setIdea(prompt.idea + " (remix and improve this concept)");
    router.push("/forge");
  };

  const handleCopy = async (text: string) => {
    await copyToClipboard(text);
    toast.success("prompt copied to clipboard");
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-yellow/30 bg-accent-yellow/10 text-accent-yellow text-xs font-mono mb-4">
              <Shuffle className="w-3.5 h-3.5" />
              community prompts
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              one-click remix
            </h1>
            <p className="text-text-secondary text-lg">
              browse production-grade prompts. copy as-is or remix for your own project.
            </p>
          </div>

          {/* filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-mono transition-all",
                  filter === cat
                    ? "bg-accent-green/10 text-accent-green border border-accent-green/30"
                    : "border border-border text-text-secondary hover:border-border-hover"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* prompt cards */}
          <div className="grid md:grid-cols-2 gap-4">
            {filtered.map((prompt, i) => (
              <motion.div
                key={prompt.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="p-6 rounded-xl border border-border bg-bg-secondary/30 hover:border-border-hover transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold mb-1 group-hover:text-accent-green transition-colors">
                      {prompt.title}
                    </h3>
                    <p className="text-xs text-text-muted font-mono">
                      by {prompt.author}
                    </p>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-text-muted">
                    <Star className="w-3 h-3 text-accent-yellow" />
                    {prompt.stars}
                  </div>
                </div>

                <p className="text-sm text-text-secondary mb-4">
                  {prompt.description}
                </p>

                <div className="flex items-center gap-3 mb-4">
                  <span className="text-xs font-mono text-text-muted px-2 py-1 rounded border border-border">
                    {prompt.category}
                  </span>
                  <span className="text-xs font-mono text-text-muted">
                    ~{estimateTokens(prompt.prompt).toLocaleString()} tokens
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedPrompt(prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-text-secondary text-xs hover:text-text-primary hover:border-border-hover transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    preview
                  </button>
                  <button
                    onClick={() => handleCopy(prompt.prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-text-secondary text-xs hover:text-text-primary hover:border-border-hover transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    copy
                  </button>
                  <button
                    onClick={() => handleRemix(prompt)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-green/10 text-accent-green text-xs font-medium hover:bg-accent-green/20 transition-all"
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    remix
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* preview modal */}
      {selectedPrompt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedPrompt(null)}>
          <div className="w-full max-w-3xl max-h-[80vh] rounded-xl border border-border bg-bg-secondary overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="font-semibold">{selectedPrompt.title}</h3>
              <button onClick={() => setSelectedPrompt(null)} className="text-text-secondary hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <pre className="text-sm font-mono text-text-secondary leading-relaxed whitespace-pre-wrap break-words">
                {selectedPrompt.prompt}
              </pre>
            </div>
            <div className="flex items-center gap-3 p-4 border-t border-border">
              <button
                onClick={() => handleCopy(selectedPrompt.prompt)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border text-text-secondary text-sm hover:text-text-primary transition-all"
              >
                <Copy className="w-4 h-4" />
                copy prompt
              </button>
              <button
                onClick={() => { setSelectedPrompt(null); handleRemix(selectedPrompt); }}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-green text-bg-primary text-sm font-semibold hover:bg-accent-green/90 transition-all"
              >
                <Shuffle className="w-4 h-4" />
                remix this prompt
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
