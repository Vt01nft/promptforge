"use client";

import { useState } from "react";
import { GraduationCap, ChevronDown, ChevronUp, Lightbulb } from "lucide-react";
import { cn } from "@/lib/utils";

interface CoachSection {
  tag: string;
  title: string;
  step: number;
  why: string;
  impact: string;
  tip: string;
}

const coachSections: CoachSection[] = [
  {
    tag: "role",
    title: "Role / Task Context",
    step: 1,
    why: "Giving the LLM a specific expert persona focuses its knowledge and writing style. A 'senior react developer' produces better code than a generic assistant.",
    impact: "40% more accurate and relevant outputs",
    tip: "The more specific the role, the better. 'Senior fintech developer specializing in payment APIs' beats 'developer'.",
  },
  {
    tag: "tone",
    title: "Tone Context",
    step: 2,
    why: "Setting communication style (professional, casual, technical) ensures the output matches your audience and context.",
    impact: "Consistent voice across the entire output",
    tip: "Be specific: 'professional but approachable, like a senior dev explaining to a junior' works better than just 'professional'.",
  },
  {
    tag: "context",
    title: "Background Data",
    step: 3,
    why: "Providing relevant background info and data gives the LLM the knowledge it needs without guessing or hallucinating.",
    impact: "Reduces hallucinations by 60%",
    tip: "Include any relevant context: existing tech stack, team size, user demographics, business constraints.",
  },
  {
    tag: "requirements",
    title: "Detailed Requirements & Rules",
    step: 4,
    why: "Numbered lists are harder to skip than paragraphs. Each requirement is a checklist item the LLM must address.",
    impact: "95% requirement coverage vs 60% with paragraph instructions",
    tip: "Be specific: 'paginated list with 20 items per page and infinite scroll' not 'show a list of items'.",
  },
  {
    tag: "examples",
    title: "Examples",
    step: 5,
    why: "Concrete input/output examples show the LLM exactly what you want. Two good examples replace paragraphs of instructions.",
    impact: "2x more consistent outputs with examples vs without",
    tip: "Show a positive example (what you want) and optionally a negative one (what to avoid). Cover edge cases.",
  },
  {
    tag: "project",
    title: "Immediate Task Description",
    step: 7,
    why: "A clear 1-2 sentence summary with specific action verbs prevents the LLM from misunderstanding your intent.",
    impact: "Reduces misinterpretation by 60%",
    tip: "Use clear verbs: 'build', 'create', 'implement', 'design'. Include the WHO (target user) and WHAT (core function).",
  },
  {
    tag: "thinking_instructions",
    title: "Deep Thinking Triggers",
    step: 8,
    why: "Asking the LLM to 'think step by step' for complex sections dramatically improves reasoning quality.",
    impact: "30% improvement on complex reasoning tasks",
    tip: "Use for architecture decisions, complex logic, and multi-step processes. Skip for simple, factual tasks.",
  },
  {
    tag: "output_instructions",
    title: "Output Formatting",
    step: 9,
    why: "Specifying exact format, structure, and build order prevents the LLM from producing output in an unexpected way.",
    impact: "Working code that builds correctly from step 1 to done",
    tip: "Specify: format (JSON, markdown, code), build order (setup first, then features, then polish), and what NOT to include.",
  },
  {
    tag: "prefill_suggestion",
    title: "Prefilled Response",
    step: 10,
    why: "Suggesting how to start the AI's reply skips preamble and forces the right format from the first token.",
    impact: "Eliminates 'sure, here is...' preamble, gets straight to output",
    tip: "Start with '{' for JSON output, or '<html>' for code, or the first heading of a document.",
  },
  {
    tag: "tech_stack",
    title: "Tech Stack",
    step: 0,
    why: "Without explicit tech choices, the LLM guesses differently each time. Specifying eliminates ambiguity and ensures reproducibility.",
    impact: "Consistent, reproducible outputs across different LLMs",
    tip: "Include versions when possible. 'Next.js 15' is better than 'Next.js' because APIs change between versions.",
  },
  {
    tag: "file_structure",
    title: "File Structure",
    step: 0,
    why: "A complete file tree tells the LLM exactly what to build. Without it, you get random file organization.",
    impact: "Production-ready project organization from the start",
    tip: "Include every file. The LLM will build exactly what's in the tree — nothing more, nothing less.",
  },
  {
    tag: "design",
    title: "Design Specifications",
    step: 0,
    why: "Hex colors, font names, spacing values prevent generic 'AI slop' aesthetics and produce intentional design.",
    impact: "Polished, intentional design instead of generic defaults",
    tip: "Always specify: background color, accent color, font family, border radius, and responsive behavior.",
  },
  {
    tag: "constraints",
    title: "Constraints / Guardrails",
    step: 0,
    why: "Constraints prevent the #1 cause of bad outputs: the LLM doing something you didn't want.",
    impact: "Eliminates common mistakes before they happen",
    tip: "Think about what could go wrong and add a constraint for each: rate limits, security, performance, edge cases.",
  },
];

export default function PromptCoach({ prompt }: { prompt: string }) {
  const [expanded, setExpanded] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const foundSections = coachSections.filter((s) =>
    new RegExp(`<${s.tag}[>\\s]`, "i").test(prompt)
  );
  const missingSections = coachSections.filter(
    (s) => !new RegExp(`<${s.tag}[>\\s]`, "i").test(prompt)
  );

  const score = Math.round((foundSections.length / coachSections.length) * 100);

  return (
    <div className="rounded-xl border border-border bg-bg-secondary/30 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-bg-tertiary/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent-purple/10 flex items-center justify-center">
            <GraduationCap className="w-4 h-4 text-accent-purple" />
          </div>
          <div className="text-left">
            <p className="text-sm font-medium">{"ai prompt coach"}</p>
            <p className="text-xs text-text-muted">
              {"learn why each section makes your prompt powerful \u2014 "}{foundSections.length}/{coachSections.length}{" elements \u2014 "}{score}{"% coverage"}
            </p>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-text-secondary" />
        ) : (
          <ChevronDown className="w-4 h-4 text-text-secondary" />
        )}
      </button>

      {expanded && (
        <div className="border-t border-border">
          <div className="p-4 space-y-2">
            <p className="text-xs font-mono text-accent-green mb-3">
              {"included ("}{foundSections.length}{"/"}{coachSections.length}{")"}
            </p>
            {foundSections.map((section) => (
              <div key={section.tag}>
                <button
                  onClick={() => setActiveSection(activeSection === section.tag ? null : section.tag)}
                  className={cn(
                    "w-full flex items-center justify-between p-3 rounded-lg transition-all text-left",
                    activeSection === section.tag ? "bg-accent-green/10 border border-accent-green/20" : "hover:bg-bg-tertiary/30"
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-accent-green">{"<"}{section.tag}{">"}</span>
                    <span className="text-sm">{section.title}</span>
                    {section.step > 0 && <span className="text-[10px] font-mono text-text-muted bg-bg-tertiary px-1.5 py-0.5 rounded">{"step "}{section.step}</span>}
                  </div>
                  <ChevronDown className={cn("w-3.5 h-3.5 text-text-muted transition-transform", activeSection === section.tag && "rotate-180")} />
                </button>
                {activeSection === section.tag && (
                  <div className="ml-4 p-4 space-y-3 text-sm">
                    <div>
                      <p className="text-text-muted text-xs font-mono mb-1">why it matters</p>
                      <p className="text-text-secondary">{section.why}</p>
                    </div>
                    <div>
                      <p className="text-text-muted text-xs font-mono mb-1">impact</p>
                      <p className="text-accent-green text-xs">{section.impact}</p>
                    </div>
                    <div className="flex items-start gap-2 p-3 rounded-lg bg-accent-yellow/5 border border-accent-yellow/10">
                      <Lightbulb className="w-4 h-4 text-accent-yellow shrink-0 mt-0.5" />
                      <p className="text-xs text-text-secondary">{section.tip}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {missingSections.length > 0 && (
            <div className="p-4 border-t border-border">
              <p className="text-xs font-mono text-accent-yellow mb-3">
                {"could be added ("}{missingSections.length}{")"}
              </p>
              {missingSections.map((section) => (
                <div key={section.tag} className="flex items-center gap-2 p-2 text-text-muted">
                  <span className="text-xs font-mono opacity-50">{"<"}{section.tag}{">"}</span>
                  <span className="text-sm opacity-50">{section.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
