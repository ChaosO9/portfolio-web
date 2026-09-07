"use client";

import React from "react";
import { Layers, ArrowUpRight, Cpu } from "lucide-react";
import { TECH_STACK } from "@/data/portfolioData";

interface TechStackProps {
  onSelectSkill: (skill: string) => void;
}

export default function TechStackSection({ onSelectSkill }: TechStackProps) {
  return (
    <section id="tech-stack" className="max-w-5xl mx-auto px-6 md:px-12 py-24 relative z-10">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyber-white flex items-center gap-4">
          <span className="font-mono text-cyber-teal text-xl">04.</span>
          <span>Tech Stack</span>
          <span className="h-px bg-navy-600 flex-grow max-w-xs" />
        </h2>
      </div>

      <p className="text-cyber-slate text-sm sm:text-base mb-10 max-w-2xl leading-relaxed">
        Rather than arbitrary percentage bars, here is my verified technology stack backed by real-world production systems and hands-on projects. Click any technology to view the exact projects where it was implemented.
      </p>

      {/* Grid of Domain Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {TECH_STACK.map((category) => (
          <div
            key={category.category}
            className="card-cyber rounded-xl p-6 sm:p-7 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg bg-cyber-teal/10 border border-cyber-teal/30 flex items-center justify-center text-cyber-teal">
                  <Cpu className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold text-cyber-white font-mono">
                  {category.category}
                </h3>
              </div>
              <p className="text-xs text-cyber-slate mb-6">{category.description}</p>

              {/* Technology Chips */}
              <div className="flex flex-wrap gap-2.5">
                {category.items.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => onSelectSkill(item.skillKey)}
                    title={`Click to filter projects built with ${item.name}`}
                    className="px-3 py-2 rounded-lg bg-navy-800 hover:bg-cyber-teal/15 text-cyber-light hover:text-cyber-teal border border-navy-600 hover:border-cyber-teal/60 text-xs font-mono transition duration-150 flex items-center gap-2 group cursor-pointer"
                  >
                    <span>{item.name}</span>
                    <span className="px-1.5 py-0.5 rounded bg-navy-900/80 text-[10px] text-cyber-teal font-semibold group-hover:bg-cyber-teal group-hover:text-navy-900 transition">
                      {item.projectCount} {item.projectCount === 1 ? "Project" : "Projects"}
                    </span>
                    <ArrowUpRight className="w-3 h-3 text-cyber-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-navy-600/40 flex items-center justify-between text-[11px] font-mono text-cyber-slate/70">
              {/* <span className="flex items-center gap-1.5">
                <Layers className="w-3 h-3 text-cyber-teal" /> Verified in Project Library
              </span> */}
              <span>Click chip to inspect ↘</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
