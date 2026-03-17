"use client";

import { useState, useEffect } from "react";
import { useForgeStore } from "@/lib/store";
import { motion } from "motion/react";
import { Zap, ArrowRight, Sparkles, Loader2, Link2, Globe, X } from "lucide-react";
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

interface ScanResult {
  url: string;
  title: string;
  analysis: {
    summary: string;
    type: string;
    features: string[];
    design: string;
    tech: string;
    suggested_idea: string;
  };
}

export default function IdeaInput() {
  const { idea: storeIdea, setIdea, setStep, setQuestions, setCategory, setLoading, setError, isLoading } =
    useForgeStore();
  const [input, setInput] = useState(storeIdea || "");
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    if (storeIdea && storeIdea !== input) {
      setInput(storeIdea);
    }
  }, [storeIdea]);

  // detect URL paste
  const detectAndScanUrl = async (text: string) => {
    const urlRegex = /https?:\/\/[^\s]+/;
    const match = text.match(urlRegex);
    if (match && !scanResult && !isScanning) {
      const url = match[0];
      setIsScanning(true);
      try {
        const res = await fetch("/api/scan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        if (res.ok) {
          const data = await res.json();
          setScanResult(data);
        }
      } catch {
        // silently fail - URL scanning is optional
      } finally {
        setIsScanning(false);
      }
    }
  };

  const handleInputChange = (value: string) => {
    setInput(value);
    detectAndScanUrl(value);
  };

  const handleUseScanResult = (customChanges?: string) => {
    if (!scanResult) return;
    const idea = customChanges
      ? `${scanResult.analysis.suggested_idea}. changes i want: ${customChanges}`
      : scanResult.analysis.suggested_idea;
    setInput(idea);
    setScanResult(null);
  };

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

  const handleFileContent = (content: string, filename: string, type: string) => {
    if (type === "image") {
      setInput(
        input
          ? `${input}\n\n${content}\n\nplease analyze this image and generate a prompt to build something similar.`
          : `i uploaded an image (${filename}). please analyze it and generate a prompt to build something that looks like this.`
      );
    } else {
      setInput(
        input
          ? `${input}\n\n--- uploaded file: ${filename} ---\n${content}`
          : `here is a file i want to work with (${filename}):\n\n${content}`
      );
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
          {"describe your idea, paste a URL, or upload a file."}
        </p>
      </div>

      {/* main input area */}
      <div className="rounded-xl border border-border bg-bg-secondary overflow-hidden mb-4">
        <textarea
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={"describe what you want to build...\n\nor paste a website URL to build something similar\n\ne.g. 'a crypto portfolio tracker with wallet connect and price charts'"}
          className="w-full h-36 p-6 pb-2 bg-transparent text-text-primary placeholder:text-text-muted resize-none focus:outline-none font-mono text-sm leading-relaxed"
        />

        {/* bottom bar with + button and forge */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <FileUpload onFileContent={handleFileContent} />
            {isScanning && (
              <div className="flex items-center gap-1.5 text-xs text-accent-blue">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>{"scanning URL..."}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted font-mono">
              {input.length} {"chars"}
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
      </div>

      {/* URL scan result */}
      {scanResult && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-5 rounded-xl border border-accent-blue/30 bg-accent-blue/5"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-accent-blue" />
              <span className="text-sm font-medium">{"website detected"}</span>
            </div>
            <button onClick={() => setScanResult(null)} className="text-text-muted hover:text-text-primary">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2 mb-4">
            <p className="text-sm text-text-primary font-medium">{scanResult.title}</p>
            <p className="text-xs text-text-secondary">{scanResult.analysis.summary}</p>
            <div className="flex flex-wrap gap-1.5">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-tertiary border border-border text-text-muted">
                {scanResult.analysis.type}
              </span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-bg-tertiary border border-border text-text-muted">
                {scanResult.analysis.tech}
              </span>
            </div>
            {scanResult.analysis.features.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {scanResult.analysis.features.slice(0, 6).map((f, i) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded bg-accent-blue/10 text-accent-blue">
                    {f}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleUseScanResult()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-green text-bg-primary text-xs font-semibold hover:bg-accent-green/90 transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              {"build something similar"}
            </button>
            <button
              onClick={() => {
                const changes = prompt("what changes do you want from the original?");
                if (changes) handleUseScanResult(changes);
              }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-border text-text-secondary text-xs hover:text-text-primary hover:border-border-hover transition-all"
            >
              <Link2 className="w-3.5 h-3.5" />
              {"build similar with changes"}
            </button>
          </div>
        </motion.div>
      )}

      {/* quick starters */}
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

      {/* templates */}
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