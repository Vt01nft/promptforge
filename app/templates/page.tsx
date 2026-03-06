"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { templates, getCategories } from "@/lib/templates";
import { useForgeStore } from "@/lib/store";
import Navbar from "@/components/shared/navbar";
import {
  Globe,
  Rocket,
  LayoutDashboard,
  Bot,
  Server,
  MessageCircle,
  ShoppingCart,
  Terminal,
  Brain,
  FileText,
  Puzzle,
  Smartphone,
  ArrowRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Globe, Rocket, LayoutDashboard, Bot, Server, MessageCircle,
  ShoppingCart, Terminal, Brain, FileText, Puzzle, Smartphone,
};

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const categories = getCategories();
  const router = useRouter();
  const { setIdea, reset } = useForgeStore();

  const filtered =
    activeCategory === "all"
      ? templates
      : templates.filter((t) => t.category === activeCategory);

  const handleUseTemplate = (idea: string) => {
    reset();
    setIdea(idea);
    router.push("/forge");
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              prompt templates
            </h1>
            <p className="text-text-secondary text-lg">
              start from a template or use them as inspiration
            </p>
          </div>

          {/* category filter */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
            <button
              onClick={() => setActiveCategory("all")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-mono transition-all",
                activeCategory === "all"
                  ? "bg-accent-green/10 text-accent-green border border-accent-green/30"
                  : "border border-border text-text-secondary hover:border-border-hover"
              )}
            >
              all ({templates.length})
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-mono transition-all",
                  activeCategory === cat
                    ? "bg-accent-green/10 text-accent-green border border-accent-green/30"
                    : "border border-border text-text-secondary hover:border-border-hover"
                )}
              >
                {cat} (
                {templates.filter((t) => t.category === cat).length})
              </button>
            ))}
          </div>

          {/* template grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((template, i) => {
              const Icon = iconMap[template.icon] || Globe;
              return (
                <motion.div
                  key={template.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="group p-6 rounded-xl border border-border bg-bg-secondary/30 hover:border-border-hover hover:bg-bg-tertiary/30 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center group-hover:bg-accent-green/20 transition-colors">
                      <Icon className="w-5 h-5 text-accent-green" />
                    </div>
                    <span className="text-xs font-mono text-text-muted px-2 py-1 rounded border border-border">
                      {template.category}
                    </span>
                  </div>

                  <h3 className="font-semibold mb-2 group-hover:text-accent-green transition-colors">
                    {template.name}
                  </h3>
                  <p className="text-sm text-text-secondary mb-4 leading-relaxed">
                    {template.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {template.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono text-text-muted px-2 py-0.5 rounded bg-bg-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handleUseTemplate(template.idea)}
                    className="flex items-center gap-2 text-sm text-accent-green hover:text-accent-green/80 transition-colors"
                  >
                    use this template
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
