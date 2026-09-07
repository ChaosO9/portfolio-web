"use client";

import React, { useEffect } from "react";
import { X, ExternalLink, Github, Sparkles, Folder, CheckCircle } from "lucide-react";
import { Project } from "@/data/portfolioData";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onExplainWithAi: (projectTitle: string) => void;
}

export default function ProjectDetailModal({
  project,
  onClose,
  onExplainWithAi,
}: ProjectDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (project) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [project, onClose]);

  if (!project) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="card-cyber-static rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col overflow-hidden shadow-2xl border border-navy-600 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-6 sm:p-8 pb-4 border-b border-navy-600/70 flex items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyber-teal/10 text-cyber-teal border border-cyber-teal/30">
                {project.category}
              </span>
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono bg-navy-800 text-cyber-slate border border-navy-600">
                {project.type}
              </span>
              <span className="text-xs font-mono text-cyber-slate">· {project.date}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-cyber-white">
              {project.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-cyber-slate hover:text-cyber-white hover:bg-navy-700 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm sm:text-base leading-relaxed text-cyber-slate">
          {/* Tech Stack Pills */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyber-white mb-2">
              Technologies Used
            </h4>
            <div className="flex flex-wrap gap-2">
              {project.skills.map((skill) => (
                <span
                  key={skill}
                  className="px-2.5 py-1 rounded bg-navy-800 border border-navy-600 text-xs font-mono text-cyber-light"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Problem */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyber-teal mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-teal" /> The Problem / Challenge
            </h4>
            <p className="text-cyber-light bg-navy-800/50 p-4 rounded-xl border border-navy-600/60">
              {project.problem}
            </p>
          </div>

          {/* Role */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyber-teal mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-teal" /> My Role &amp; Contribution
            </h4>
            <p className="text-cyber-light bg-navy-800/50 p-4 rounded-xl border border-navy-600/60">
              {project.role}
            </p>
          </div>

          {/* Solution */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyber-teal mb-1.5 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-teal" /> Solution &amp; Architecture
            </h4>
            <p className="text-cyber-light bg-navy-800/50 p-4 rounded-xl border border-navy-600/60">
              {project.solution}
            </p>
          </div>

          {/* Results */}
          <div>
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyber-teal mb-1.5 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-cyber-teal" /> Results &amp; Impact
            </h4>
            <p className="text-cyber-light bg-navy-800/50 p-4 rounded-xl border border-navy-600/60">
              {project.results}
            </p>
          </div>

          {/* Project Links */}
          {project.links && project.links.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-cyber-white mb-2">
                Documentation &amp; Artifacts
              </h4>
              <div className="flex flex-wrap gap-3">
                {project.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-cyber-light hover:text-cyber-teal border border-navy-600 text-xs font-mono transition flex items-center gap-2"
                  >
                    {link.type === "github" ? (
                      <Github className="w-4 h-4 text-cyber-teal" />
                    ) : link.type === "drive" ? (
                      <Folder className="w-4 h-4 text-cyber-teal" />
                    ) : (
                      <ExternalLink className="w-4 h-4 text-cyber-teal" />
                    )}
                    <span>{link.label}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-6 bg-navy-900 border-t border-navy-600 flex flex-wrap items-center justify-between gap-4">
          <button
            onClick={() => {
              onClose();
              onExplainWithAi(project.title);
            }}
            className="neon-btn px-5 py-2.5 rounded-lg bg-cyber-teal/10 hover:bg-cyber-teal/20 border border-cyber-teal/50 text-cyber-teal text-xs sm:text-sm font-mono font-semibold transition flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explain This Architecture with AI</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-navy-600 text-cyber-slate hover:text-cyber-white text-xs sm:text-sm font-mono transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
