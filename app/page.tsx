"use client";

import Link from "next/link";
import { motion } from "motion/react";
import {
  Zap,
  Copy,
  Github,
  ArrowRight,
  Sparkles,
  FileCode,
  Layers,
  Shield,
  Globe,
  Terminal,
  Heart,
  Star,
} from "lucide-react";
import Navbar from "@/components/shared/navbar";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" as const },
  }),
};

const features = [
  {
    icon: Sparkles,
    title: "rough idea in",
    description:
      "type what you want to build in plain language. no prompt expertise needed.",
  },
  {
    icon: Layers,
    title: "smart interview",
    description:
      "adaptive follow-up questions that understand your vision. fewer questions for experts.",
  },
  {
    icon: FileCode,
    title: "perfect prompt out",
    description:
      "production-grade prompt with role, tech stack, file structure, design specs, and build order.",
  },
  {
    icon: Copy,
    title: "paste into any LLM",
    description:
      "works with claude, chatgpt, gemini, qwen — any LLM builds exactly what you described.",
  },
  {
    icon: Shield,
    title: "100% free forever",
    description:
      "no signup. no api key. no limits. powered by free open-source LLMs.",
  },
  {
    icon: Globe,
    title: "open source",
    description:
      "MIT licensed. contribute templates, improve prompts, make it yours.",
  },
];

const exampleOutput = `<role>
you are a senior full-stack developer
specializing in modern web applications...
</role>

<project>
build a crypto portfolio tracker...
</project>

<tech_stack>
- next.js 15 (app router, typescript)
- tailwind css (dark theme)
- wagmi v2 + viem
...
</tech_stack>

<file_structure>
crypto-tracker/
├── app/
│   ├── layout.tsx
│   ├── dashboard/
│   │   └── page.tsx
...
</file_structure>`;

export default function LandingPage() {
  return (
    <div className="min-h-screen">
      <Navbar />

      {/* hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(0,212,170,0.08),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(91,127,255,0.06),transparent_50%)]" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-bg-secondary/50 text-sm text-text-secondary mb-8"
          >
            <Star className="w-3.5 h-3.5 text-accent-yellow" />
            <span>free & open source — star us on github</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6"
          >
            turn rough ideas into{" "}
            <span className="text-gradient">production-grade</span> prompts
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            describe what you want to build. get a perfectly structured prompt
            that any LLM will execute flawlessly.{" "}
            <span className="text-text-primary">first try.</span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/forge"
              className="group flex items-center gap-2 px-8 py-4 rounded-xl bg-accent-green text-bg-primary font-semibold text-lg hover:bg-accent-green/90 transition-all glow-green"
            >
              <Zap className="w-5 h-5" />
              start forging
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="https://github.com/Vt01nft/promptforge"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-8 py-4 rounded-xl border border-border text-text-secondary hover:text-text-primary hover:border-border-hover transition-all"
            >
              <Github className="w-5 h-5" />
              view on github
            </a>
          </motion.div>
        </div>
      </section>

      {/* demo section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 gap-6"
          >
            {/* input side */}
            <motion.div variants={fadeUp} custom={0} className="space-y-4">
              <div className="text-sm font-mono text-accent-green mb-2">
                input
              </div>
              <div className="rounded-xl border border-border bg-bg-secondary p-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-accent-red/60" />
                  <div className="w-3 h-3 rounded-full bg-accent-yellow/60" />
                  <div className="w-3 h-3 rounded-full bg-accent-green/60" />
                </div>
                <p className="text-text-secondary font-mono text-sm leading-relaxed">
                  &quot;i want a crypto portfolio tracker website where i can
                  add my wallets and see all my tokens and their prices&quot;
                </p>
              </div>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Terminal className="w-4 h-4" />
                <span>that&apos;s it. that&apos;s all you type.</span>
              </div>
            </motion.div>

            {/* output side */}
            <motion.div variants={fadeUp} custom={1} className="space-y-4">
              <div className="text-sm font-mono text-accent-blue mb-2">
                output
              </div>
              <div className="rounded-xl border border-border bg-bg-secondary p-6 max-h-80 overflow-hidden relative">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-accent-red/60" />
                  <div className="w-3 h-3 rounded-full bg-accent-yellow/60" />
                  <div className="w-3 h-3 rounded-full bg-accent-green/60" />
                </div>
                <pre className="text-xs font-mono text-text-secondary leading-relaxed whitespace-pre-wrap">
                  {exampleOutput}
                </pre>
                <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-bg-secondary to-transparent" />
              </div>
              <div className="flex items-center gap-2 text-text-muted text-sm">
                <Sparkles className="w-4 h-4" />
                <span>
                  2,400 tokens of perfectly structured prompt
                </span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* features */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              how it works
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-text-secondary text-lg"
            >
              rough idea in → perfect prompt out → paste into any LLM → ship
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                variants={fadeUp}
                custom={i}
                className="group p-6 rounded-xl border border-border bg-bg-secondary/50 hover:border-border-hover hover:bg-bg-tertiary/50 transition-all"
              >
                <div className="w-10 h-10 rounded-lg bg-accent-green/10 flex items-center justify-center mb-4 group-hover:bg-accent-green/20 transition-colors">
                  <feature.icon className="w-5 h-5 text-accent-green" />
                </div>
                <h3 className="font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* cta */}
      <section className="py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              variants={fadeUp}
              custom={0}
              className="text-3xl md:text-4xl font-bold mb-4"
            >
              stop writing bad prompts
            </motion.h2>
            <motion.p
              variants={fadeUp}
              custom={1}
              className="text-text-secondary text-lg mb-8"
            >
              let promptforge do the engineering. you focus on the idea.
            </motion.p>
            <motion.div variants={fadeUp} custom={2}>
              <Link
                href="/forge"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-accent-green text-bg-primary font-semibold text-lg hover:bg-accent-green/90 transition-all glow-green"
              >
                <Zap className="w-5 h-5" />
                forge your first prompt
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-border py-12 px-6">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-accent-green" />
            <span className="font-mono text-sm">promptforge</span>
            <span className="text-text-muted text-sm">— free & open source</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-text-secondary">
            <a href="https://github.com/Vt01nft/promptforge" target="_blank" rel="noopener noreferrer" className="hover:text-text-primary transition-colors">github</a>
            <Link href="/templates" className="hover:text-text-primary transition-colors">templates</Link>
            <a href="https://x.com/VT_zero1" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-text-muted hover:text-text-primary transition-colors">{"built by vt"} <Heart className="w-3 h-3 text-accent-red" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
}
