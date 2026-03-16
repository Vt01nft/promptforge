"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";
import { useForgeStore } from "@/lib/store";
import {
  Wand2,
  ArrowRight,
  ArrowLeft,
  Globe,
  Bot,
  Server,
  Terminal,
  Smartphone,
  LayoutDashboard,
  FileText,
  Brain,
  Palette,
  Moon,
  Sun,
  Zap,
  Code,
  Shield,
  Users,
  Database,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import Navbar from "@/components/shared/navbar";

const projectTypes = [
  { id: "website", label: "Website", icon: Globe, examples: "portfolio, landing page, blog, e-commerce" },
  { id: "app", label: "Web App", icon: LayoutDashboard, examples: "dashboard, todo app, social platform" },
  { id: "mobile", label: "Mobile App", icon: Smartphone, examples: "iOS/Android app, cross-platform" },
  { id: "bot", label: "Bot", icon: Bot, examples: "telegram, discord, twitter bot" },
  { id: "api", label: "API / Backend", icon: Server, examples: "REST API, GraphQL, microservice" },
  { id: "script", label: "Script / CLI", icon: Terminal, examples: "automation, scraper, CLI tool" },
  { id: "agent", label: "AI Agent", icon: Brain, examples: "AI assistant, multi-agent system" },
  { id: "content", label: "Content", icon: FileText, examples: "blog post, newsletter, social media" },
];

const designStyles = [
  { id: "minimal", label: "Minimal & Clean", color: "#e4e4e7" },
  { id: "dark", label: "Dark & Hacker", color: "#00d4aa" },
  { id: "colorful", label: "Colorful & Vibrant", color: "#ff6b6b" },
  { id: "corporate", label: "Corporate & Professional", color: "#5b7fff" },
  { id: "retro", label: "Retro & Vintage", color: "#fbbf24" },
  { id: "no-preference", label: "No Preference", color: "#71717a" },
];

const commonFeatures = [
  { id: "responsive", label: "Mobile Responsive", icon: Smartphone },
  { id: "dark-mode", label: "Dark Mode", icon: Moon },
  { id: "auth", label: "User Authentication", icon: Lock },
  { id: "database", label: "Database", icon: Database },
  { id: "animations", label: "Smooth Animations", icon: Zap },
  { id: "api-integration", label: "API Integration", icon: Code },
  { id: "seo", label: "SEO Optimized", icon: Globe },
  { id: "admin", label: "Admin Panel", icon: Shield },
  { id: "realtime", label: "Real-time Updates", icon: Users },
  { id: "search", label: "Search & Filter", icon: FileText },
];

const techPreferences = [
  { id: "nextjs", label: "Next.js / React" },
  { id: "vue", label: "Vue / Nuxt" },
  { id: "python", label: "Python / Django / FastAPI" },
  { id: "node", label: "Node.js / Express" },
  { id: "react-native", label: "React Native" },
  { id: "no-preference", label: "No Preference (let AI decide)" },
];

const steps = [
  { id: 1, title: "what are you building?" },
  { id: 2, title: "describe it in your own words" },
  { id: 3, title: "pick a style" },
  { id: 4, title: "must-have features" },
  { id: 5, title: "tech preference" },
];

export default function WizardPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [projectType, setProjectType] = useState("");
  const [description, setDescription] = useState("");
  const [style, setStyle] = useState("");
  const [features, setFeatures] = useState<string[]>([]);
  const [tech, setTech] = useState("");
  const router = useRouter();
  const { setIdea, reset } = useForgeStore();

  const toggleFeature = (id: string) => {
    setFeatures((prev) =>
      prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]
    );
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return projectType !== "";
      case 2: return description.trim().length >= 10;
      case 3: return style !== "";
      case 4: return true;
      case 5: return tech !== "";
      default: return false;
    }
  };

  const handleFinish = () => {
    const featureLabels = features
      .map((id) => commonFeatures.find((f) => f.id === id)?.label)
      .filter(Boolean);

    const styleName = designStyles.find((s) => s.id === style)?.label || "";
    const techName = techPreferences.find((t) => t.id === tech)?.label || "";
    const typeName = projectTypes.find((t) => t.id === projectType)?.label || "";

    const idea = [
      `a ${typeName.toLowerCase()}:`,
      description.trim(),
      style !== "no-preference" ? `design style: ${styleName.toLowerCase()}` : "",
      featureLabels.length > 0 ? `key features: ${featureLabels.join(", ").toLowerCase()}` : "",
      tech !== "no-preference" ? `tech: ${techName}` : "",
    ].filter(Boolean).join(". ");

    reset();
    setIdea(idea);
    router.push("/forge");
  };

  return (
    <div className="min-h-screen">
      <Navbar />

      <main className="pt-24 pb-16 px-6">
        <div className="max-w-3xl mx-auto">
          {/* header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-accent-purple/30 bg-accent-purple/10 text-accent-purple text-xs font-mono mb-4">
              <Wand2 className="w-3.5 h-3.5" />
              wizard mode — no prompting skills needed
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              {steps[currentStep - 1].title}
            </h1>
          </div>

          {/* progress bar */}
          <div className="flex items-center gap-1 mb-10 max-w-md mx-auto">
            {steps.map((step) => (
              <div
                key={step.id}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-all",
                  step.id <= currentStep ? "bg-accent-green" : "bg-bg-tertiary"
                )}
              />
            ))}
          </div>

          {/* step content */}
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* step 1: project type */}
            {currentStep === 1 && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {projectTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setProjectType(type.id)}
                    className={cn(
                      "p-5 rounded-xl border text-left transition-all group",
                      projectType === type.id
                        ? "border-accent-green/40 bg-accent-green/10"
                        : "border-border bg-bg-secondary/30 hover:border-border-hover"
                    )}
                  >
                    <type.icon className={cn("w-6 h-6 mb-3", projectType === type.id ? "text-accent-green" : "text-text-secondary")} />
                    <p className="font-medium text-sm mb-1">{type.label}</p>
                    <p className="text-xs text-text-muted">{type.examples}</p>
                  </button>
                ))}
              </div>
            )}

            {/* step 2: description */}
            {currentStep === 2 && (
              <div>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder={"just describe it like you'd tell a friend...\n\ne.g. \"I want a website where people can track their crypto portfolio, connect their wallet, and see prices update in real time\""}
                  className="w-full h-48 p-6 rounded-xl border border-border bg-bg-secondary text-text-primary placeholder:text-text-muted resize-none focus:outline-none focus:border-accent-green/40 focus:ring-1 focus:ring-accent-green/20 font-mono text-sm leading-relaxed transition-all"
                />
                <p className="text-xs text-text-muted mt-2 font-mono">
                  {description.length} chars — {description.length < 10 ? "tell us more" : "looking good"}
                </p>
              </div>
            )}

            {/* step 3: design style */}
            {currentStep === 3 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {designStyles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={cn(
                      "p-5 rounded-xl border text-left transition-all",
                      style === s.id
                        ? "border-accent-green/40 bg-accent-green/10"
                        : "border-border bg-bg-secondary/30 hover:border-border-hover"
                    )}
                  >
                    <div
                      className="w-8 h-8 rounded-full mb-3 border border-border"
                      style={{ backgroundColor: s.color }}
                    />
                    <p className="font-medium text-sm">{s.label}</p>
                  </button>
                ))}
              </div>
            )}

            {/* step 4: features */}
            {currentStep === 4 && (
              <div>
                <p className="text-sm text-text-secondary mb-4">select all that apply (optional)</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {commonFeatures.map((feature) => (
                    <button
                      key={feature.id}
                      onClick={() => toggleFeature(feature.id)}
                      className={cn(
                        "p-4 rounded-xl border text-left transition-all flex items-center gap-3",
                        features.includes(feature.id)
                          ? "border-accent-green/40 bg-accent-green/10"
                          : "border-border bg-bg-secondary/30 hover:border-border-hover"
                      )}
                    >
                      <feature.icon className={cn("w-4 h-4 shrink-0", features.includes(feature.id) ? "text-accent-green" : "text-text-secondary")} />
                      <span className="text-sm">{feature.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* step 5: tech preference */}
            {currentStep === 5 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {techPreferences.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setTech(t.id)}
                    className={cn(
                      "p-5 rounded-xl border text-left transition-all",
                      tech === t.id
                        ? "border-accent-green/40 bg-accent-green/10"
                        : "border-border bg-bg-secondary/30 hover:border-border-hover"
                    )}
                  >
                    <Code className={cn("w-5 h-5 mb-2", tech === t.id ? "text-accent-green" : "text-text-secondary")} />
                    <p className="font-medium text-sm">{t.label}</p>
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* navigation */}
          <div className="flex items-center justify-between mt-10">
            <button
              onClick={() => setCurrentStep((s) => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-text-secondary hover:text-text-primary disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              back
            </button>

            <span className="text-xs text-text-muted font-mono">
              step {currentStep} of {steps.length}
            </span>

            {currentStep < steps.length ? (
              <button
                onClick={() => setCurrentStep((s) => Math.min(steps.length, s + 1))}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-bg-primary font-semibold text-sm hover:bg-accent-green/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                next
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleFinish}
                disabled={!canProceed()}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-accent-green text-bg-primary font-semibold text-sm hover:bg-accent-green/90 disabled:opacity-30 disabled:cursor-not-allowed transition-all glow-green"
              >
                <Wand2 className="w-4 h-4" />
                generate my prompt
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
