"use client";

import { useState } from "react";
import { useForgeStore } from "@/lib/store";
import { motion } from "motion/react";
import { ArrowLeft, ArrowRight, Zap, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Interview() {
  const {
    idea,
    questions,
    answers,
    category,
    setAnswer,
    setStep,
    setGeneratedPrompt,
    setProviderInfo,
    setLoading,
    setError,
  } = useForgeStore();

  const [otherInputs, setOtherInputs] = useState<Record<string, string>>({});

  const handleGenerate = async () => {
    setStep("generating");
    setLoading(true);
    setError(null);

    // merge "Other" custom inputs into answers
    const finalAnswers = { ...answers };
    for (const [qId, customText] of Object.entries(otherInputs)) {
      if (customText.trim()) {
        const currentAnswer = finalAnswers[qId];
        if (Array.isArray(currentAnswer)) {
          // replace "Other" with the custom text
          finalAnswers[qId] = currentAnswer.map((a) =>
            a === "Other" ? customText.trim() : a
          );
        } else if (currentAnswer === "Other") {
          finalAnswers[qId] = customText.trim();
        }
      }
    }

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idea, answers: finalAnswers, category }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to generate prompt");
      }

      const data = await res.json();
      setGeneratedPrompt(data.prompt);
      setProviderInfo(data.provider, data.model, data.tokens);
      setStep("output");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setStep("interview");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAnswer = (questionId: string, option: string, type: string) => {
    if (type === "multiselect") {
      const current = (answers[questionId] as string[]) || [];
      const updated = current.includes(option)
        ? current.filter((o) => o !== option)
        : [...current, option];
      setAnswer(questionId, updated);
    } else {
      setAnswer(questionId, option);
    }

    // clear other input if deselecting "Other"
    if (option === "Other") {
      const isSelected = type === "multiselect"
        ? ((answers[questionId] as string[]) || []).includes("Other")
        : answers[questionId] === "Other";
      if (isSelected) {
        setOtherInputs((prev) => {
          const next = { ...prev };
          delete next[questionId];
          return next;
        });
      }
    }
  };

  const isOtherSelected = (questionId: string, type: string) => {
    if (type === "multiselect") {
      return ((answers[questionId] as string[]) || []).includes("Other");
    }
    return answers[questionId] === "Other";
  };

  const answeredCount = Object.keys(answers).length;
  const totalQuestions = questions.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="text-center mb-10">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">
          {"let\u0027s refine your vision"}
        </h2>
        <p className="text-text-secondary">
          answer a few questions so we can generate the perfect prompt
        </p>
      </div>

      {/* original idea */}
      <div className="mb-8 p-4 rounded-xl border border-border bg-bg-secondary/50">
        <div className="flex items-center gap-2 mb-2">
          <MessageCircle className="w-4 h-4 text-accent-green" />
          <span className="text-xs font-mono text-text-muted">your idea</span>
        </div>
        <p className="text-sm text-text-secondary font-mono">{"\u0022"}{idea}{"\u0022"}</p>
      </div>

      {/* questions */}
      <div className="space-y-6 mb-10">
        {questions.map((q, i) => (
          <motion.div
            key={q.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 rounded-xl border border-border bg-bg-secondary/30"
          >
            <p className="text-sm font-medium mb-4">
              <span className="text-accent-green font-mono mr-2">
                {i + 1}.
              </span>
              {q.text}
            </p>

            {q.type === "text" ? (
              <input
                type="text"
                value={(answers[q.id] as string) || ""}
                onChange={(e) => setAnswer(q.id, e.target.value)}
                placeholder="type your answer..."
                className="w-full px-4 py-3 rounded-lg border border-border bg-bg-primary text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-green/40 transition-all"
              />
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2">
                  {q.options?.map((option) => {
                    const isSelected =
                      q.type === "multiselect"
                        ? ((answers[q.id] as string[]) || []).includes(option)
                        : answers[q.id] === option;

                    return (
                      <button
                        key={option}
                        onClick={() => handleSelectAnswer(q.id, option, q.type)}
                        className={cn(
                          "px-4 py-2 rounded-lg border text-sm font-mono transition-all",
                          isSelected
                            ? "border-accent-green/40 bg-accent-green/10 text-accent-green"
                            : "border-border bg-bg-primary text-text-secondary hover:border-border-hover"
                        )}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>

                {/* show text input when "Other" is selected */}
                {isOtherSelected(q.id, q.type) && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden"
                  >
                    <input
                      type="text"
                      value={otherInputs[q.id] || ""}
                      onChange={(e) =>
                        setOtherInputs((prev) => ({
                          ...prev,
                          [q.id]: e.target.value,
                        }))
                      }
                      placeholder="specify your custom answer..."
                      className="w-full px-4 py-3 rounded-lg border border-accent-green/30 bg-bg-primary text-text-primary placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-green/40 transition-all"
                      autoFocus
                    />
                  </motion.div>
                )}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setStep("input")}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary transition-colors text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          back
        </button>

        <div className="flex items-center gap-4">
          <span className="text-xs text-text-muted font-mono">
            {answeredCount}/{totalQuestions} answered
          </span>
          <button
            onClick={handleGenerate}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-bg-primary font-semibold text-sm hover:bg-accent-green/90 transition-all glow-green"
          >
            <Zap className="w-4 h-4" />
            generate prompt
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
