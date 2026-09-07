"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles, Send, ShieldCheck } from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";

export default function Hero() {
  return (
    <section
      id="hero"
      className="min-h-screen flex flex-col justify-center max-w-5xl mx-auto px-6 md:px-12 pt-28 pb-20 relative z-10"
    >
      {/* Monospace intro */}
      <div className="flex items-center justify-between gap-4 mb-5">
        <span className="font-mono text-cyber-teal text-base md:text-lg">
          Hi, my name is
        </span>
        <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono bg-cyber-teal/10 border border-cyber-teal/30 text-cyber-teal">
          <span className="w-2 h-2 rounded-full bg-cyber-teal animate-ping" />
          Open for Opportunities
        </span>
      </div>

      {/* Main Title */}
      <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold text-cyber-white tracking-tight mb-3">
        {PERSONAL_INFO.name}.
      </h1>

      {/* Subheadline */}
      <h2 className="text-3xl sm:text-5xl md:text-6xl font-bold text-cyber-slate leading-tight mb-6">
        {PERSONAL_INFO.subheadline}
      </h2>

      {/* Bio excerpt */}
      <p className="max-w-2xl text-base sm:text-lg text-cyber-slate leading-relaxed mb-8">
        I am a <strong className="text-cyber-white font-semibold">Cloud & DevOps Engineer</strong> with hands-on enterprise experience maintaining internal systems at <strong className="text-cyber-teal">PT Panasonic Manufacturing Indonesia</strong> and architecting secure cloud backends across <strong className="text-cyber-white">AWS, GCP, and Azure</strong>.
      </p>

      {/* Panasonic current work badge */}
      {/* <div className="inline-flex items-center gap-3 p-3.5 rounded-lg bg-navy-700/80 border border-navy-600 max-w-xl mb-10 text-xs sm:text-sm text-cyber-light font-mono">
        <ShieldCheck className="w-5 h-5 text-cyber-teal flex-shrink-0" />
        <span>
          Currently maintaining HRMS & People Traffic Control at <span className="text-cyber-white font-semibold">Panasonic</span>
        </span>
      </div> */}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-4">
        <Link
          href="#projects"
          className="px-6 py-3.5 rounded-lg bg-cyber-teal text-navy-900 font-semibold font-mono text-sm hover:bg-opacity-90 hover:shadow-lg hover:shadow-cyber-teal/20 transition duration-200 flex items-center gap-2"
        >
          <span>View Projects</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          href="#ai-assistant"
          className="neon-btn px-6 py-3.5 rounded-lg bg-navy-700 border border-cyber-teal/50 text-cyber-teal font-semibold font-mono text-sm hover:bg-cyber-teal/10 transition duration-200 flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4 text-cyber-teal" />
          <span>Chat with AI</span>
        </Link>

        <a
          href={PERSONAL_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="group px-6 py-3.5 rounded-lg border border-cyber-teal/60 text-cyber-teal bg-cyber-teal/5 hover:bg-cyber-teal hover:text-navy-900 hover:shadow-lg hover:shadow-cyber-teal/25 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 font-mono text-sm flex items-center gap-2"
        >
          <Send className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          <span>Say Hello</span>
        </a>
      </div>
    </section>
  );
}
