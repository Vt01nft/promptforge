"use client";

import { useState, useEffect } from "react";
import { useForgeStore } from "@/lib/store";
import { motion } from "motion/react";
import { Zap, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { templates } from "@/lib/templates";
import FileUpload from "@/components/shared/file-upload";

const quickStarters = [
  "portfolio website with dark theme",
  "telegram bot for crypto alerts",
  "saas dashboard with analytics",
  "rest api with authentication",
  "discord moderation bot",
  "e-commerce store",
];

export default function IdeaInput() {
  const { idea: storeIdea, setIdea, setStep, setQuestions, setCategory, setLoading, setError, isLoading } =
    useForgeStore();
  const [input, setInput] = useState(storeIdea || "");

  useEffect(() => {
    if (storeIdea && storeIdea !== input) {
      setInput(storeIdea);
    }
  }, [storeIdea]);

  const handleSubmit = async () => {
    if (!input.trim() || input.trim().length < 5) return;

    setIdea(input.trim());
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/interview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea: input.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate questions");
      }

      const data = await res.json();
      setCategory(data.category);
      setQuestions(data.questions);
      setStep("interview");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleQuickStart = (idea: string) => {
    setInput(idea);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">
          {"what do you want to build?"}
        </h1>
        <p className="text-text-secondary text-lg">
          {"describe your idea in plain language. we'll handle the prompt engineering."}
        </p>
      </div>

      <div className="relative mb-4">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="describe what you want to build... e.g. 'a crypto portfolio tracker with wallet connect and price charts'"
          className="w-full h-40 p-6 rounded-xl border border-border bg-bg-secondary text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent-green/40 focus:ring-1 focus:ring-accent-green/20 font-mono text-sm leading-relaxed transition-all"
        />
        <div className="absolute bottom-4 right-4 flex items-center gap-3">
          <span className="text-xs text-text-muted font-mono">
            {input.length} chars
          </span>
          <button
            onClick={handleSubmit}
            disabled={!input.trim() || input.trim().length < 5 || isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-green text-bg-primary font-semibold text-sm hover:bg-accent-green/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4" />
            )}
            {isLoading ? "analyzing..." : "forge"}
            {!isLoading && <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="mb-6">
        <FileUpload
          label="or upload a file (.txt, .md, .json, .py, .ts, etc.)"
          onFileContent={(content, filename) => {
            setInput(
              input
                ? `${input}\n\n--- uploaded file: ${filename} ---\n${content}`
                : `here is a file i want to work with (${filename}):\n\n${content}`
            );
          }}
        />
      </div>

      <div className="mb-10">
        <p className="text-xs text-text-muted font-mono mb-3 flex items-center gap-2">
          <Sparkles className="w-3 h-3" />
          {"quick start - click to try"}
        </p>
        <div className="flex flex-wrap gap-2">
          {quickStarters.map((idea) => (
            <button
              key={idea}
              onClick={() => handleQuickStart(idea)}
              className="px-3 py-1.5 rounded-lg border border-border bg-bg-secondary/50 text-text-secondary text-xs font-mono hover:border-accent-green/30 hover:text-accent-green transition-all"
            >
              {idea}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-xs text-text-muted font-mono mb-3">
          {"or start from a template"}
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {templates.slice(0, 8).map((template) => (
            <button
              key={template.id}
              onClick={() => handleQuickStart(template.idea)}
              className="p-4 rounded-xl border border-border bg-bg-secondary/30 text-left hover:border-border-hover hover:bg-bg-tertiary/30 transition-all group"
            >
              <p className="text-sm font-medium mb-1 group-hover:text-accent-green transition-colors">
                {template.name}
              </p>
              <p className="text-xs text-text-muted line-clamp-2">
                {template.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
