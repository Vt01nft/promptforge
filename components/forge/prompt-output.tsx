"use client";

import { useState } from "react";
import { useForgeStore } from "@/lib/store";
import { motion } from "motion/react";
import { toast } from "sonner";
import {
  Copy,
  Download,
  RefreshCw,
  Check,
  Zap,
  Server,
  Hash,
  ChevronDown,
  ChevronUp,
  Info,
  ArrowLeft,
} from "lucide-react";
import { copyToClipboard, downloadAsMarkdown, estimateTokens } from "@/lib/utils";
import PromptCoach from "@/components/forge/prompt-coach";

export default function PromptOutput() {
  const { generatedPrompt, provider, model, tokens, idea, reset } =
    useForgeStore();
  const [copied, setCopied] = useState(false);
  const [showExplainer, setShowExplainer] = useState(false);

  const handleCopy = async () => {
    try {
      await copyToClipboard(generatedPrompt);
      setCopied(true);
      toast.success("prompt copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("failed to copy");
    }
  };

  const handleDownload = () => {
    const slug = idea
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .slice(0, 30);
    downloadAsMarkdown(generatedPrompt, `promptforge-${slug}`);
    toast.success("downloaded as markdown");
  };

  const estimatedTokens = estimateTokens(generatedPrompt);
  const sections = (generatedPrompt.match(/<\w+>/g) || []).length;

  const qualityChecks = [
    { label: "role assignment", check: /<role>/i.test(generatedPrompt) },
    { label: "tech stack", check: /<tech_stack>/i.test(generatedPrompt) },
    { label: "file structure", check: /<file_structure>/i.test(generatedPrompt) },
    { label: "design specs", check: /<design>/i.test(generatedPrompt) },
    { label: "requirements", check: /<requirements>/i.test(generatedPrompt) },
    { label: "constraints", check: /<constraints>/i.test(generatedPrompt) },
    { label: "build order", check: /<output_instructions>/i.test(generatedPrompt) },
  ];

  const qualityScore = Math.round(
    (qualityChecks.filter((c) => c.check).length / qualityChecks.length) * 100
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          your prompt is ready
        </h2>
        <p className="text-text-secondary">
          copy it and paste into any LLM — claude, chatgpt, gemini, qwen
        </p>
      </div>

      {/* action buttons */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-green text-bg-primary font-semibold text-sm hover:bg-accent-green/90 transition-all"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {copied ? "copied!" : "copy to clipboard"}
        </button>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-text-secondary text-sm hover:text-text-primary hover:border-border-hover transition-all"
        >
          <Download className="w-4 h-4" />
          download .md
        </button>
        <button
          onClick={reset}
          className="flex items-center gap-2 px-5 py-2.5 rounded-lg border border-border text-text-secondary text-sm hover:text-text-primary hover:border-border-hover transition-all"
        >
          <RefreshCw className="w-4 h-4" />
          forge new prompt
        </button>
      </div>

      {/* prompt display */}
      <div className="rounded-xl border border-border bg-bg-secondary overflow-hidden mb-6">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-bg-tertiary/50">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-accent-red/60" />
            <div className="w-3 h-3 rounded-full bg-accent-yellow/60" />
            <div className="w-3 h-3 rounded-full bg-accent-green/60" />
          </div>
          <span className="text-xs font-mono text-text-muted">
            promptforge output
          </span>
        </div>
        <div className="p-6 max-h-[600px] overflow-y-auto">
          <pre className="text-sm font-mono text-text-secondary leading-relaxed whitespace-pre-wrap break-words">
            {generatedPrompt}
          </pre>
        </div>
      </div>

      {/* stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="p-4 rounded-xl border border-border bg-bg-secondary/30">
          <div className="flex items-center gap-2 mb-1">
            <Hash className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-muted font-mono">tokens</span>
          </div>
          <p className="text-lg font-bold font-mono">~{estimatedTokens.toLocaleString()}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-bg-secondary/30">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-muted font-mono">sections</span>
          </div>
          <p className="text-lg font-bold font-mono">{sections}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-bg-secondary/30">
          <div className="flex items-center gap-2 mb-1">
            <Server className="w-3.5 h-3.5 text-text-muted" />
            <span className="text-xs text-text-muted font-mono">provider</span>
          </div>
          <p className="text-lg font-bold font-mono">{provider}</p>
        </div>
        <div className="p-4 rounded-xl border border-border bg-bg-secondary/30">
          <div className="flex items-center gap-2 mb-1">
            <Zap className="w-3.5 h-3.5 text-accent-green" />
            <span className="text-xs text-text-muted font-mono">quality</span>
          </div>
          <p className="text-lg font-bold font-mono text-accent-green">{qualityScore}%</p>
        </div>
      </div>

      {/* quality explainer */}
      <button
        onClick={() => setShowExplainer(!showExplainer)}
        className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
      >
        <Info className="w-4 h-4" />
        <span>why this prompt works</span>
        {showExplainer ? (
          <ChevronUp className="w-4 h-4" />
        ) : (
          <ChevronDown className="w-4 h-4" />
        )}
      </button>

      {showExplainer && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="overflow-hidden p-6 rounded-xl border border-border bg-bg-secondary/30 mb-6"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {qualityChecks.map((check) => (
              <div key={check.label} className="flex items-center gap-3">
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center ${
                    check.check
                      ? "bg-accent-green/20 text-accent-green"
                      : "bg-bg-tertiary text-text-muted"
                  }`}
                >
                  {check.check ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                  )}
                </div>
                <span
                  className={`text-sm ${
                    check.check ? "text-text-primary" : "text-text-muted"
                  }`}
                >
                  {check.label}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ai prompt coach */}
      <div className="mb-6">
        <PromptCoach prompt={generatedPrompt} />
      </div>

      {/* back button */}
      <div className="flex items-center">
        <button
          onClick={reset}
          className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          start over
        </button>
      </div>
    </motion.div>
  );
}
