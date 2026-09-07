"use client";

import React, { useState } from "react";
import { Building2, Calendar, MapPin, Tag, ArrowUpRight } from "lucide-react";
import { EXPERIENCES, Experience } from "@/data/portfolioData";

interface ExperienceProps {
  onSelectSkill: (skill: string) => void;
}

export default function ExperienceSection({ onSelectSkill }: ExperienceProps) {
  const [activeTabId, setActiveTabId] = useState<string>(EXPERIENCES[0].id);

  const activeExperience: Experience =
    EXPERIENCES.find((exp) => exp.id === activeTabId) || EXPERIENCES[0];

  return (
    <section id="experience" className="max-w-5xl mx-auto px-6 md:px-12 py-24 relative z-10">
      {/* Section Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-cyber-white mb-10 flex items-center gap-4">
        <span className="font-mono text-cyber-teal text-xl">02.</span>
        <span>Where I&apos;ve Worked</span>
        <span className="h-px bg-navy-600 flex-grow max-w-xs" />
      </h2>

      <div className="flex flex-col md:flex-row gap-8 items-start">
        {/* Company Tab List */}
        <div className="w-full md:w-1/3 flex md:flex-col overflow-x-auto md:overflow-visible pb-2 md:pb-0 scrollbar-thin border-b md:border-b-0 md:border-l border-navy-600 font-mono text-sm">
          {EXPERIENCES.map((exp) => {
            const isActive = exp.id === activeTabId;
            return (
              <button
                key={exp.id}
                onClick={() => setActiveTabId(exp.id)}
                className={`text-left px-5 py-3.5 whitespace-nowrap transition-all duration-200 border-b-2 md:border-b-0 md:border-l-2 -mb-[2px] md:mb-0 md:-ml-[2px] flex items-center justify-between group ${
                  isActive
                    ? "text-cyber-teal bg-cyber-teal/10 border-cyber-teal font-semibold"
                    : "text-cyber-slate hover:text-cyber-light hover:bg-navy-700/50 border-transparent"
                }`}
              >
                <span>{exp.companyLogoText}</span>
                {isActive && (
                  <span className="hidden md:inline-block w-1.5 h-1.5 rounded-full bg-cyber-teal ml-2" />
                )}
              </button>
            );
          })}
        </div>

        {/* Active Role Content */}
        <div className="w-full md:w-2/3 card-cyber rounded-xl p-6 sm:p-8">
          {/* Header with Company Logo Slot */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-navy-600/60">
            <div>
              <h3 className="text-xl sm:text-2xl font-bold text-cyber-white">
                {activeExperience.role}{" "}
                <span className="text-cyber-teal">@ {activeExperience.company}</span>
              </h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-cyber-slate mt-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-cyber-teal" />
                  {activeExperience.period}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-cyber-teal" />
                  {activeExperience.location}
                </span>
              </div>
            </div>

            {/* Dedicated Company Logo Slot */}
            <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-navy-800 border border-navy-600 flex flex-col items-center justify-center p-2 text-center shadow-inner group hover:border-cyber-teal/60 transition">
              <Building2 className="w-6 h-6 text-cyber-teal mb-1 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-mono text-cyber-light font-bold truncate max-w-full">
                {activeExperience.companyLogoText}
              </span>
            </div>
          </div>

          {/* Key Accomplishments Bullet Points */}
          <ul className="space-y-3.5 mt-6 text-cyber-slate text-sm sm:text-base leading-relaxed">
            {activeExperience.description.map((item, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="text-cyber-teal font-mono mt-1 text-xs">▹</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* Interactive Skill Tags (Requirement 1 & Cross-Filter) */}
          <div className="mt-8 pt-6 border-t border-navy-600/60">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono text-cyber-slate flex items-center gap-1.5 uppercase tracking-wider">
                <Tag className="w-3.5 h-3.5 text-cyber-teal" /> Technologies &amp; Tools Used
              </span>
              <span className="text-[11px] font-mono text-cyber-slate/70 hidden sm:inline">
                Click any skill to filter projects ↘
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {activeExperience.skills.map((skill) => (
                <button
                  key={skill}
                  onClick={() => onSelectSkill(skill)}
                  title={`Filter projects using ${skill}`}
                  className="px-3 py-1.5 rounded-lg bg-navy-800 hover:bg-cyber-teal/20 text-cyber-light hover:text-cyber-teal border border-navy-600 hover:border-cyber-teal/60 text-xs font-mono transition duration-150 flex items-center gap-1.5 group"
                >
                  <span>{skill}</span>
                  <ArrowUpRight className="w-3 h-3 text-cyber-teal opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
