"use client";

import { useForgeStore } from "@/lib/store";
import Navbar from "@/components/shared/navbar";
import IdeaInput from "@/components/forge/idea-input";
import Interview from "@/components/forge/interview";
import PromptOutput from "@/components/forge/prompt-output";
import { Loader2 } from "lucide-react";

export default function ForgePage() {
  const { step, isLoading, error } = useForgeStore();

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          {/* progress indicator */}
          <div className="flex items-center justify-center gap-3 mb-12">
            {(["input", "interview", "output"] as const).map((s, i) => (
              <div key={s} className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                    step === s || (step === "generating" && s === "output")
                      ? "bg-accent-green/20 text-accent-green border border-accent-green/40"
                      : ["input", "interview", "generating", "output"].indexOf(step) >
                        ["input", "interview", "output"].indexOf(s)
                      ? "bg-accent-green/10 text-accent-green/60 border border-accent-green/20"
                      : "bg-bg-tertiary text-text-muted border border-border"
                  }`}
                >
                  {i + 1}
                </div>
                {i < 2 && (
                  <div
                    className={`w-12 h-px ${
                      ["input", "interview", "generating", "output"].indexOf(step) > i
                        ? "bg-accent-green/30"
                        : "bg-border"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* error display */}
          {error && (
            <div className="mb-6 p-4 rounded-xl border border-accent-red/30 bg-accent-red/5 text-accent-red text-sm">
              {error}
            </div>
          )}

          {/* step content */}
          {step === "input" && <IdeaInput />}
          {step === "interview" && <Interview />}
          {step === "generating" && (
            <div className="flex flex-col items-center justify-center py-20 gap-6">
              <Loader2 className="w-10 h-10 text-accent-green animate-spin" />
              <div className="text-center">
                <p className="text-lg font-medium mb-2">forging your prompt...</p>
                <p className="text-sm text-text-secondary">
                  analyzing your requirements and generating a production-grade prompt
                </p>
              </div>
            </div>
          )}
          {step === "output" && <PromptOutput />}
        </div>
      </main>
    </div>
  );
}
