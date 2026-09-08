"use client";

import React, { useState, useMemo } from "react";
import {
  Folder,
  Github,
  ExternalLink,
  Sparkles,
  Search,
  Filter,
  Layers,
  X,
  FileText,
  Camera,
} from "lucide-react";
import { PROJECTS, Project } from "@/data/portfolioData";
import ProjectDetailModal from "./ProjectDetailModal";
import ProjectExplainerModal from "./ProjectExplainerModal";

interface ProjectsProps {
  activeSkillFilter: string | null;
  onSelectSkillFilter: (skill: string | null) => void;
}

const POPULAR_SKILLS = [
  "All Skills",
  "AWS",
  "GCP",
  "Docker",
  "Cloudflare",
  "WireGuard",
  "Proxmox",
  "Node.js",
  ".NET",
  "PostgreSQL",
  "SQL Server",
  "AWS Bedrock",
  "CI/CD",
  "Playwright",
  "HL7 FHIR",
  "COBIT",
];

const CATEGORIES = ["All", "DevOps", "App Dev", "IT Governance", "AI & Cloud"] as const;
const TYPES = ["All", "WORK", "PERSONAL", "FINAL PROJECT"] as const;

export default function ProjectsSection({
  activeSkillFilter,
  onSelectSkillFilter,
}: ProjectsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [selectedType, setSelectedType] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal states
  const [detailProject, setDetailProject] = useState<Project | null>(null);
  const [explainingProjectTitle, setExplainingProjectTitle] = useState<string | null>(null);

  // Filter logic
  const filteredProjects = useMemo(() => {
    return PROJECTS.filter((project) => {
      // Category filter
      if (selectedCategory !== "All" && project.category !== selectedCategory) {
        return false;
      }

      // Type filter
      if (selectedType !== "All" && project.type !== selectedType) {
        return false;
      }

      // Skill filter
      if (activeSkillFilter && activeSkillFilter !== "All Skills") {
        const matchesSkill = project.skills.some((s) =>
          s.toLowerCase().includes(activeSkillFilter.toLowerCase())
        );
        if (!matchesSkill) return false;
      }

      // Search query filter
      if (searchQuery.trim() !== "") {
        const query = searchQuery.toLowerCase();
        const inTitle = project.title.toLowerCase().includes(query);
        const inDesc = project.shortDescription.toLowerCase().includes(query);
        const inProblem = project.problem.toLowerCase().includes(query);
        const inSkills = project.skills.some((s) => s.toLowerCase().includes(query));
        if (!inTitle && !inDesc && !inProblem && !inSkills) {
          return false;
        }
      }

      return true;
    });
  }, [selectedCategory, selectedType, activeSkillFilter, searchQuery]);

  return (
    <section id="projects" className="max-w-6xl mx-auto px-6 md:px-12 py-24 relative z-10">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyber-white flex items-center gap-4">
          <span className="font-mono text-cyber-teal text-xl">05.</span>
          <span>Projects Library</span>
          <span className="h-px bg-navy-600 flex-grow max-w-xs" />
        </h2>

        <span className="font-mono text-xs text-cyber-slate">
          Showing {filteredProjects.length} of {PROJECTS.length} projects
        </span>
      </div>

      <p className="text-cyber-slate text-sm sm:text-base mb-8 max-w-3xl leading-relaxed">
        Explore production deployments, cloud infrastructure setups, and full-stack systems with real architecture artifacts, system designs, and live URLs.
      </p>

      {/* Filter Toolbar Card */}
      <div className="card-cyber-static rounded-2xl p-5 mb-10 border border-navy-600 space-y-4">
        {/* Search & Reset */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative w-full sm:flex-grow">
            <Search className="w-4 h-4 text-cyber-slate absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by technology, problem, or title (e.g. Bedrock, Docker, WireGuard, SATUSEHAT)..."
              className="w-full bg-navy-800 text-cyber-light pl-10 pr-4 py-2.5 rounded-xl border border-navy-600 text-xs sm:text-sm focus:outline-none focus:border-cyber-teal font-mono placeholder:text-cyber-slate/60 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-cyber-slate hover:text-cyber-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {(activeSkillFilter || selectedCategory !== "All" || selectedType !== "All" || searchQuery) && (
            <button
              onClick={() => {
                onSelectSkillFilter(null);
                setSelectedCategory("All");
                setSelectedType("All");
                setSearchQuery("");
              }}
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-navy-800 hover:bg-navy-700 text-cyber-slate hover:text-cyber-teal border border-navy-600 text-xs font-mono transition flex items-center justify-center gap-1.5 whitespace-nowrap"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset All Filters</span>
            </button>
          )}
        </div>

        {/* Category Tabs & Type Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-navy-600/40 text-xs font-mono">
          {/* Category Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-cyber-slate mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3 text-cyber-teal" /> Category:
            </span>
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-lg transition ${isSelected
                      ? "bg-cyber-teal text-navy-900 font-semibold shadow-sm"
                      : "bg-navy-800 text-cyber-slate hover:text-cyber-light hover:bg-navy-700"
                    }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Type Filter */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-cyber-slate mr-1">Type:</span>
            {TYPES.map((t) => {
              const isSelected = selectedType === t;
              return (
                <button
                  key={t}
                  onClick={() => setSelectedType(t)}
                  className={`px-3 py-1 rounded-lg transition ${isSelected
                      ? "bg-cyber-teal text-navy-900 font-semibold shadow-sm"
                      : "bg-navy-800 text-cyber-slate hover:text-cyber-light hover:bg-navy-700"
                    }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Skill Filter Pills */}
        <div className="pt-2 border-t border-navy-600/40">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-mono text-cyber-slate">
            <Layers className="w-3 h-3 text-cyber-teal" />
            <span>Filter by Skill:</span>
            {activeSkillFilter && (
              <span className="text-cyber-teal font-semibold">
                &ldquo;{activeSkillFilter}&rdquo; active
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_SKILLS.map((skill) => {
              const isSelected =
                (skill === "All Skills" && !activeSkillFilter) ||
                activeSkillFilter?.toLowerCase() === skill.toLowerCase();
              return (
                <button
                  key={skill}
                  onClick={() =>
                    onSelectSkillFilter(skill === "All Skills" ? null : skill)
                  }
                  className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition ${isSelected
                      ? "bg-cyber-teal/20 text-cyber-teal border border-cyber-teal font-semibold"
                      : "bg-navy-800/80 text-cyber-slate hover:text-cyber-light hover:bg-navy-700 border border-navy-600/60"
                    }`}
                >
                  {skill}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <div className="text-center py-16 card-cyber rounded-2xl p-8 border border-navy-600">
          <Folder className="w-12 h-12 text-cyber-slate mx-auto mb-3 opacity-50" />
          <h3 className="text-lg font-bold text-cyber-white mb-1">No Projects Found</h3>
          <p className="text-sm font-mono text-cyber-slate mb-4">
            Try adjusting your search query, skill tags, or category filters.
          </p>
          <button
            onClick={() => {
              onSelectSkillFilter(null);
              setSelectedCategory("All");
              setSelectedType("All");
              setSearchQuery("");
            }}
            className="px-4 py-2 rounded-lg bg-cyber-teal text-navy-900 font-mono text-xs font-semibold hover:opacity-90"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="card-cyber rounded-xl p-6 flex flex-col justify-between group"
            >
              <div>
                {/* Card Top: Folder icon and links */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Folder className="w-7 h-7 text-cyber-teal group-hover:scale-110 transition-transform" />
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-navy-800 text-cyber-teal border border-navy-600">
                      {project.category}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    {project.links.map((link) => (
                      <a
                        key={link.label}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={link.label}
                        className="text-cyber-slate hover:text-cyber-teal transition"
                      >
                        {link.type === "github" ? (
                          <Github className="w-4 h-4" />
                        ) : link.type === "drive" ? (
                          <FileText className="w-4 h-4" />
                        ) : (
                          <ExternalLink className="w-4 h-4" />
                        )}
                      </a>
                    ))}
                    {project.screenshots && project.screenshots.length > 0 && (
                      <button
                        onClick={() => setDetailProject(project)}
                        title={`${project.screenshots.length} visual screenshot(s) available in details`}
                        className="text-cyber-slate/70 hover:text-amber-400 transition flex items-center gap-1 text-[11px] font-mono"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>{project.screenshots.length}</span>
                      </button>
                    )}
                  </div>
                </div>

                {/* Project Title */}
                <h3
                  onClick={() => setDetailProject(project)}
                  className="text-lg font-bold text-cyber-white group-hover:text-cyber-teal transition mb-2 cursor-pointer"
                >
                  {project.title}
                </h3>

                {/* Date & Type */}
                <div className="text-[11px] font-mono text-cyber-slate/80 mb-3 flex items-center gap-2">
                  <span>{project.date}</span>
                  <span>•</span>
                  <span className="text-cyber-teal/80">{project.type}</span>
                </div>

                {/* Short Description */}
                <p className="text-cyber-slate text-xs sm:text-sm leading-relaxed mb-4 line-clamp-3">
                  {project.shortDescription}
                </p>
              </div>

              <div>
                {/* Tech Pills */}
                <div className="flex flex-wrap gap-1.5 mb-5">
                  {project.skills.slice(0, 4).map((skill) => (
                    <button
                      key={skill}
                      onClick={() => onSelectSkillFilter(skill)}
                      className="px-2 py-0.5 rounded bg-navy-800 hover:bg-cyber-teal/15 text-cyber-slate hover:text-cyber-teal border border-navy-600/70 text-[10px] font-mono transition"
                    >
                      {skill}
                    </button>
                  ))}
                  {project.skills.length > 4 && (
                    <span className="text-[10px] font-mono text-cyber-slate/60 self-center">
                      +{project.skills.length - 4} more
                    </span>
                  )}
                </div>

                {/* Action Buttons: View Case Study & Explain with AI */}
                <div className="grid grid-cols-2 gap-2 pt-3 border-t border-navy-600/40">
                  <button
                    onClick={() => setDetailProject(project)}
                    className="w-full py-2 rounded-lg bg-navy-800 hover:bg-navy-700 text-cyber-light hover:text-cyber-white border border-navy-600 text-xs font-mono transition text-center"
                  >
                    Case Study
                  </button>

                  <button
                    onClick={() => setExplainingProjectTitle(project.title)}
                    className="neon-btn w-full py-2 rounded-lg bg-cyber-teal/10 hover:bg-cyber-teal/20 text-cyber-teal border border-cyber-teal/40 text-xs font-mono font-semibold transition flex items-center justify-center gap-1"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Explain AI</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Case Study Detail Modal */}
      <ProjectDetailModal
        project={detailProject}
        onClose={() => setDetailProject(null)}
        onExplainWithAi={(title) => setExplainingProjectTitle(title)}
      />

      {/* Bedrock AI Deep Dive Explainer Modal */}
      <ProjectExplainerModal
        projectTitle={explainingProjectTitle}
        onClose={() => setExplainingProjectTitle(null)}
      />
    </section>
  );
}
