"use client";

import Link from "next/link";
import { Zap, Github, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent-green/10 flex items-center justify-center group-hover:bg-accent-green/20 transition-colors">
            <Zap className="w-4 h-4 text-accent-green" />
          </div>
          <span className="font-mono font-bold text-lg">promptforge</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link
            href="/forge"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            forge
          </Link>
          <Link
            href="/templates"
            className="text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            templates
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-text-secondary hover:text-text-primary transition-colors"
          >
            <Github className="w-4 h-4" />
            <span>github</span>
          </a>
          <Link
            href="/forge"
            className="px-4 py-2 rounded-lg bg-accent-green/10 text-accent-green text-sm font-medium hover:bg-accent-green/20 transition-colors"
          >
            start forging
          </Link>
        </div>

        <button
          className="md:hidden text-text-secondary"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-bg-secondary">
          <div className="flex flex-col p-4 gap-4">
            <Link href="/forge" className="text-sm text-text-secondary" onClick={() => setMobileOpen(false)}>
              forge
            </Link>
            <Link href="/templates" className="text-sm text-text-secondary" onClick={() => setMobileOpen(false)}>
              templates
            </Link>
            <Link
              href="/forge"
              className="px-4 py-2 rounded-lg bg-accent-green/10 text-accent-green text-sm font-medium text-center"
              onClick={() => setMobileOpen(false)}
            >
              start forging
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
