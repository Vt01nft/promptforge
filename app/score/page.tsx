"use client";

import { useState } from "react";
import { motion } from "motion/react";
import Navbar from "@/components/shared/navbar";
import { cn } from "@/lib/utils";
import {
  ClipboardCheck,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  Copy,
  Loader2,
} from "lucide-react";
import { toast } from "sonner";
import { copyToClipboard } from "@/lib/utils";

interface ScoreCheck {
  id: string;
  label: string;
  description: string;
  weight: number;
  found: boolean;
  fix: string;
}

const promptChecks = [
  {
    id: "role",
    label: "Role / Persona",
    description: "Assigns a specific expert identity to the AI",
    regex: /<role>|you are a|act as a|as an expert/i,
    weight: 15,
    fix: 'Add a <role> section: "You are a senior [specific expertise] developer/writer/analyst..."',
  },
  {
    id: "tone",
    label: "Tone Context",
    description: "Sets the communication style",
    regex: /<tone>|tone:|style:|professional|casual|technical|friendly/i,
    weight: 8,
    fix: 'Add tone guidance: "Use a professional but approachable tone" or add a <tone> section.',
  },
  {
    id: "task",
    label: "Clear Task Description",
    description: "States what to build/do with specific verbs",
    regex: /<project>|<task>|build a|create a|implement|develop|design|write/i,
    weight: 15,
    fix: "Add a clear task: \"Build a [specific thing] that [does specific action] for [specific users].\"",
  },
  {
    id: "tech",
    label: "Tech Stack / Tools",
    description: "Specifies exact technologies and versions",
    regex: /<tech_stack>|<tools>|next\.js|react|python|node|typescript|tailwind/i,
    weight: 10,
    fix: "Add a <tech_stack> section listing specific technologies with versions.",
  },
  {
    id: "structure",
    label: "File / Project Structure",
    description: "Includes a directory tree or component breakdown",
    regex: /<file_structure>|<structure>|├──|└──|src\/|app\/|components\//i,
    weight: 10,
    fix: "Add a <file_structure> section with a complete directory tree showing every file.",
  },
  {
    id: "design",
    label: "Design Specifications",
    description: "Includes colors, fonts, spacing, layout details",
    regex: /<design>|#[0-9a-fA-F]{6}|font:|color:|background:|border-radius/i,
    weight: 8,
    fix: "Add a <design> section with hex colors, font names, spacing values, and responsive behavior.",
  },
  {
    id: "requirements",
    label: "Numbered Requirements",
    description: "Specific, numbered list of features/requirements",
    regex: /<requirements>|1\.|2\.|3\./i,
    weight: 12,
    fix: "Add a <requirements> section with numbered, specific requirements (aim for 8-12 items).",
  },
  {
    id: "constraints",
    label: "Constraints / Guardrails",
    description: "Defines what NOT to do and edge cases to handle",
    regex: /<constraints>|do not|never|must not|avoid|limit|restrict/i,
    weight: 8,
    fix: "Add a <constraints> section listing things to avoid, limits, and edge cases to handle.",
  },
  {
    id: "examples",
    label: "Examples",
    description: "Provides concrete input/output examples",
    regex: /<examples>|<example>|for example|e\.g\.|sample input|sample output/i,
    weight: 8,
    fix: "Add an <examples> section with 1-2 concrete examples of expected input/output behavior.",
  },
  {
    id: "output_format",
    label: "Output Format Instructions",
    description: "Specifies exactly how the response should be structured",
    regex: /<output_instructions>|<output>|respond with|format:|output format|build order/i,
    weight: 6,
    fix: "Add <output_instructions> specifying the exact format, build order, or response structure.",
  },
];

function analyzePrompt(text: string): ScoreCheck[] {
  return promptChecks.map((check) => ({
    id: check.id,
    label: check.label,
    description: check.description,
    weight: check.weight,
    found: check.regex.test(text),
    fix: check.fix,
  }));
}

function calculateScore(checks: ScoreCheck[]): number {
  const totalWeight = checks.reduce((sum, c) => sum + c.weight, 0);
  const earnedWeight = checks
    .filter((c) => c.found)
    .reduce((sum, c) => sum + c.weight, 0);
  return Math.round((earnedWeight / totalWeight) * 100);
}

function getScoreColor(score: number): string {
  if (score >= 80) return "text-accent-green";
  if (score >= 50) return "text-accent-yellow";
  return "text-accent-red";
}

function getScoreLabel(score: number): string {
  if (score >= 90) return "excellent";
  if (score >= 80) return "great";
  if (score >= 60) return "decent";
  if (score >= 40) return "needs work";
  return "weak";
}

export default function ScorePage() {
  const [input, setInput] = useState("");
  const [checks, setChecks] = useState<ScoreCheck[] | null>(null);
  const [score, setScore] = useState(0);
  const [isFixing, setIsFixing] = useState(false);
  const [fixedPrompt, setFixedPrompt] = useState("");

  const handleAnalyze = () => {
    if (input.trim().length < 20) return;
    const results = analyzePrompt(input);
    setChecks(results);
    setScore(calculateScore(results));
    setFixedPrompt("");
  };

  const handleAutoFix = async () => {
    if (!checks) return;
    setIsFixing(true);

    const missing = checks.filter((c) => !c.found);
    if (missing.length === 0) {
      toast.success("your prompt already has all elements!");
      setIsFixing(false);
      return;
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          idea: `improve and restructure this existing prompt by adding the missing elements. here is the original prompt:\n\n${input}\n\nmissing elements to add: ${missing.map((m) => m.label + " - " + m.fix).join("; ")}`,
          answers: {},
          category: "improvement",
        }),
      });

      if (!res.ok) throw new Error("Failed to fix prompt");
      const data = await res.json();
      setFixedPrompt(data.prompt);
      toast.success("prompt improved! scroll down to see the result");
    } catch {
      toast.error("failed to auto-fix. try again.");
    } finally {
      setIsFixing(false);
    }
  };

  const handleCopyFixed = async () => {
    await copyToClipboard(fixedPrompt);
    toast.success("fixed prompt copied!");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleAnalyze();
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-blue/30 bg-accent-blue/10 text-accent-blue text-xs font-mono mb-4">
              <ClipboardCheck className="w-3.5 h-3.5" />
              prompt scorer
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-3">
              score your prompt
            </h1>
            <p className="text-text-secondary text-lg">
              paste any prompt. get a quality score + auto-fix suggestions.
            </p>
          </div>

          {/* input */}
          <div className="relative mb-6">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={"paste your existing prompt here...\n\nwe'll analyze it against 10 quality criteria and show you exactly what's missing and how to fix it.\n\npress Ctrl+Enter to analyze."}
              className="w-full h-56 p-6 rounded-xl border border-border bg-bg-secondary text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent-blue/40 focus:ring-1 focus:ring-accent-blue/20 font-mono text-sm leading-relaxed transition-all"
            />
            <div className="absolute bottom-4 right-4">
              <button
                onClick={handleAnalyze}
                disabled={input.trim().length < 20}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-accent-blue text-white font-semibold text-sm hover:bg-accent-blue/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ClipboardCheck className="w-4 h-4" />
                analyze
              </button>
            </div>
          </div>

          {/* results */}
          {checks && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* score display */}
              <div className="flex items-center justify-between p-6 rounded-xl border border-border bg-bg-secondary/50">
                <div>
                  <p className="text-sm text-text-muted font-mono mb-1">prompt quality score</p>
                  <div className="flex items-baseline gap-3">
                    <span className={cn("text-5xl font-bold font-mono", getScoreColor(score))}>
                      {score}
                    </span>
                    <span className="text-text-muted text-sm">/ 100</span>
                    <span className={cn("text-sm font-mono", getScoreColor(score))}>
                      {getScoreLabel(score)}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-text-muted font-mono mb-1">elements found</p>
                  <p className="text-2xl font-bold font-mono">
                    <span className="text-accent-green">{checks.filter((c) => c.found).length}</span>
                    <span className="text-text-muted"> / {checks.length}</span>
                  </p>
                </div>
              </div>

              {/* progress bar */}
              <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 0.8, ease: [0, 0, 0.2, 1] }}
                  className={cn(
                    "h-full rounded-full",
                    score >= 80 ? "bg-accent-green" : score >= 50 ? "bg-accent-yellow" : "bg-accent-red"
                  )}
                />
              </div>

              {/* checklist */}
              <div className="space-y-2">
                {checks.map((check) => (
                  <div
                    key={check.id}
                    className={cn(
                      "p-4 rounded-xl border transition-all",
                      check.found
                        ? "border-accent-green/20 bg-accent-green/5"
                        : "border-accent-red/20 bg-accent-red/5"
                    )}
                  >
                    <div className="flex items-start gap-3">
                      {check.found ? (
                        <CheckCircle2 className="w-5 h-5 text-accent-green shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-accent-red shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium">{check.label}</p>
                          <span className="text-xs font-mono text-text-muted">
                            {check.weight}pts
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5">
                          {check.description}
                        </p>
                        {!check.found && (
                          <div className="mt-2 p-2 rounded-lg bg-bg-primary border border-border">
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="w-3.5 h-3.5 text-accent-yellow shrink-0 mt-0.5" />
                              <p className="text-xs text-text-secondary">{check.fix}</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* auto-fix button */}
              {checks.some((c) => !c.found) && (
                <div className="flex justify-center">
                  <button
                    onClick={handleAutoFix}
                    disabled={isFixing}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-bg-primary font-semibold text-sm hover:bg-accent-green/90 disabled:opacity-50 transition-all glow-green"
                  >
                    {isFixing ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Sparkles className="w-4 h-4" />
                    )}
                    {isFixing ? "improving your prompt..." : "auto-fix my prompt"}
                    {!isFixing && <ArrowRight className="w-4 h-4" />}
                  </button>
                </div>
              )}

              {/* fixed prompt output */}
              {fixedPrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold">improved prompt</h3>
                    <button
                      onClick={handleCopyFixed}
                      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-green text-bg-primary text-sm font-semibold hover:bg-accent-green/90 transition-all"
                    >
                      <Copy className="w-4 h-4" />
                      copy improved prompt
                    </button>
                  </div>
                  <div className="rounded-xl border border-border bg-bg-secondary overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-bg-tertiary/50">
                      <div className="w-3 h-3 rounded-full bg-accent-red/60" />
                      <div className="w-3 h-3 rounded-full bg-accent-yellow/60" />
                      <div className="w-3 h-3 rounded-full bg-accent-green/60" />
                    </div>
                    <div className="p-6 max-h-96 overflow-y-auto">
                      <pre className="text-sm font-mono text-text-secondary leading-relaxed whitespace-pre-wrap break-words">
                        {fixedPrompt}
                      </pre>
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
