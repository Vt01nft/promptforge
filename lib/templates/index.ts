export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  icon: string;
  idea: string;
  tags: string[];
}

export const templates: PromptTemplate[] = [
  {
    id: "portfolio-website",
    name: "Portfolio Website",
    category: "website",
    description: "Personal portfolio with projects, about, and contact sections",
    icon: "Globe",
    idea: "a modern personal portfolio website to showcase my projects and skills, with a dark theme and smooth animations",
    tags: ["website", "portfolio", "personal"],
  },
  {
    id: "saas-landing",
    name: "SaaS Landing Page",
    category: "website",
    description: "High-converting landing page for a SaaS product",
    icon: "Rocket",
    idea: "a SaaS landing page with hero section, features grid, pricing table, testimonials, FAQ, and call-to-action sections",
    tags: ["website", "saas", "landing"],
  },
  {
    id: "dashboard",
    name: "Admin Dashboard",
    category: "app",
    description: "Analytics dashboard with charts, tables, and user management",
    icon: "LayoutDashboard",
    idea: "an admin dashboard with sidebar navigation, analytics charts, data tables with sorting and filtering, and user management",
    tags: ["app", "dashboard", "admin"],
  },
  {
    id: "telegram-bot",
    name: "Telegram Bot",
    category: "bot",
    description: "Feature-rich Telegram bot with commands and inline keyboards",
    icon: "Bot",
    idea: "a Telegram bot that can handle commands, inline keyboards, and has a modular command handler architecture",
    tags: ["bot", "telegram", "automation"],
  },
  {
    id: "rest-api",
    name: "REST API",
    category: "api",
    description: "Production-ready REST API with auth, CRUD, and documentation",
    icon: "Server",
    idea: "a REST API with JWT authentication, CRUD operations, input validation, error handling, rate limiting, and auto-generated docs",
    tags: ["api", "rest", "backend"],
  },
  {
    id: "discord-bot",
    name: "Discord Bot",
    category: "bot",
    description: "Discord bot with slash commands, embeds, and moderation",
    icon: "MessageCircle",
    idea: "a Discord bot with slash commands, rich embeds, moderation tools, and a music player using discord.js",
    tags: ["bot", "discord", "community"],
  },
  {
    id: "ecommerce",
    name: "E-commerce Store",
    category: "website",
    description: "Full-stack e-commerce with cart, checkout, and payments",
    icon: "ShoppingCart",
    idea: "an e-commerce store with product listings, search, cart, checkout flow, and Stripe payment integration",
    tags: ["website", "ecommerce", "store"],
  },
  {
    id: "cli-tool",
    name: "CLI Tool",
    category: "script",
    description: "Command-line tool with arguments, colors, and progress bars",
    icon: "Terminal",
    idea: "a CLI tool with subcommands, argument parsing, colored output, progress indicators, and config file support",
    tags: ["script", "cli", "tool"],
  },
  {
    id: "ai-agent",
    name: "AI Agent System",
    category: "agent",
    description: "Multi-agent system with tools, memory, and orchestration",
    icon: "Brain",
    idea: "an AI agent system with multiple specialized agents, tool definitions, shared memory, and an orchestration layer",
    tags: ["agent", "ai", "automation"],
  },
  {
    id: "blog-platform",
    name: "Blog Platform",
    category: "website",
    description: "Markdown-based blog with categories, search, and RSS",
    icon: "FileText",
    idea: "a blog platform with markdown rendering, categories, tags, full-text search, RSS feed, and SEO optimization",
    tags: ["website", "blog", "content"],
  },
  {
    id: "chrome-extension",
    name: "Chrome Extension",
    category: "app",
    description: "Browser extension with popup, content scripts, and storage",
    icon: "Puzzle",
    idea: "a Chrome extension with a popup UI, content scripts for page manipulation, background service worker, and Chrome storage",
    tags: ["app", "extension", "browser"],
  },
  {
    id: "mobile-app",
    name: "React Native App",
    category: "app",
    description: "Cross-platform mobile app with navigation and native features",
    icon: "Smartphone",
    idea: "a cross-platform mobile app with tab navigation, push notifications, camera access, and local storage",
    tags: ["app", "mobile", "react-native"],
  },
];

export function getTemplatesByCategory(category: string): PromptTemplate[] {
  return templates.filter((t) => t.category === category);
}

export function getCategories(): string[] {
  return [...new Set(templates.map((t) => t.category))];
}
