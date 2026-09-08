"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  X,
  ExternalLink,
  Github,
  Sparkles,
  Folder,
  CheckCircle,
  Camera,
  Video,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Project } from "@/data/portfolioData";

interface ProjectDetailModalProps {
  project: Project | null;
  onClose: () => void;
  onExplainWithAi: (projectTitle: string) => void;
}

interface MediaPreviewItem {
  id: string;
  title: string;
  type: "video" | "doc" | "screenshot";
  embedUrl: string;
  originalUrl: string;
}

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/
  );
  return match ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : null;
}

function getGoogleDrivePreviewUrl(url: string): string | null {
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  return match ? `https://drive.google.com/file/d/${match[1]}/preview` : null;
}

function extractMediaItems(project: Project): MediaPreviewItem[] {
  const items: MediaPreviewItem[] = [];

  // Check links for YouTube and Google Drive previews
  if (project.links) {
    project.links.forEach((link, idx) => {
      const yt = getYouTubeEmbedUrl(link.url);
      if (yt) {
        items.push({
          id: `yt-${idx}`,
          title: link.label,
          type: "video",
          embedUrl: yt,
          originalUrl: link.url,
        });
        return;
      }
      const gd = getGoogleDrivePreviewUrl(link.url);
      if (gd) {
        items.push({
          id: `gd-link-${idx}`,
          title: link.label,
          type: "doc",
          embedUrl: gd,
          originalUrl: link.url,
        });
      }
    });
  }

  // Check screenshots for Google Drive previews
  if (project.screenshots) {
    project.screenshots.forEach((screen, idx) => {
      const gd = getGoogleDrivePreviewUrl(screen.url);
      if (gd) {
        items.push({
          id: `gd-screen-${idx}`,
          title: screen.label,
          type: "screenshot",
          embedUrl: gd,
          originalUrl: screen.url,
        });
      }
    });
  }

  return items;
}

export default function ProjectDetailModal({
  project,
  onClose,
  onExplainWithAi,
}: ProjectDetailModalProps) {
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(true);

  const mediaItems = useMemo(() => {
    return project ? extractMediaItems(project) : [];
  }, [project]);

  useEffect(() => {
    setActiveMediaIdx(0);
    setIsPreviewExpanded(true);
  }, [project?.id]);

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

  const activeMedia = mediaItems[activeMediaIdx] || mediaItems[0];

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

          {/* Interactive Media Preview (Option A: YouTube & Google Drive Iframe Embed) */}
          {mediaItems.length > 0 && (
            <div className="rounded-xl border border-navy-600/80 bg-navy-900/90 overflow-hidden shadow-xl">
              {/* Media Header & Actions */}
              <div className="p-3 sm:px-4 bg-navy-800/80 border-b border-navy-600/70 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyber-teal animate-pulse" />
                  <span className="text-xs font-mono font-semibold uppercase tracking-wider text-cyber-teal">
                    Interactive Preview
                  </span>
                  <span className="text-[11px] font-mono text-cyber-slate">
                    ({mediaItems.length} {mediaItems.length === 1 ? "media" : "media items"})
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  {activeMedia && (
                    <a
                      href={activeMedia.originalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-mono text-cyber-slate hover:text-cyber-teal transition flex items-center gap-1 px-2.5 py-1 rounded bg-navy-900/70 border border-navy-700 hover:border-cyber-teal/40"
                      title="Open full size in new tab"
                    >
                      <span>Open full in new tab</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  <button
                    onClick={() => setIsPreviewExpanded((prev) => !prev)}
                    className="text-[11px] font-mono text-cyber-slate hover:text-cyber-white transition flex items-center gap-1 px-2.5 py-1 rounded bg-navy-900/70 border border-navy-700 hover:border-navy-600"
                    aria-label={isPreviewExpanded ? "Collapse preview" : "Expand preview"}
                  >
                    {isPreviewExpanded ? (
                      <>
                        <span>Hide</span>
                        <ChevronUp className="w-3 h-3" />
                      </>
                    ) : (
                      <>
                        <span>Show</span>
                        <ChevronDown className="w-3 h-3" />
                      </>
                    )}
                  </button>
                </div>
              </div>

              {isPreviewExpanded && activeMedia && (
                <div className="p-3 sm:p-4 space-y-3">
                  {/* Multi-item selector tabs */}
                  {mediaItems.length > 1 && (
                    <div className="flex flex-wrap gap-1.5 pb-1 overflow-x-auto">
                      {mediaItems.map((item, idx) => {
                        const isActive = idx === activeMediaIdx;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveMediaIdx(idx)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 ${
                              isActive
                                ? "bg-cyber-teal/15 text-cyber-teal border border-cyber-teal/50 shadow-sm"
                                : "bg-navy-800/80 text-cyber-slate hover:text-cyber-white border border-navy-700 hover:border-navy-600"
                            }`}
                          >
                            {item.type === "video" ? (
                              <Video className="w-3.5 h-3.5 text-cyber-teal" />
                            ) : item.type === "doc" ? (
                              <FileText className="w-3.5 h-3.5 text-cyber-teal" />
                            ) : (
                              <Camera className="w-3.5 h-3.5 text-amber-400" />
                            )}
                            <span className="truncate max-w-[200px]">{item.title}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}

                  {/* Embedded Iframe Container */}
                  <div className="relative w-full aspect-video rounded-lg overflow-hidden border border-navy-700 bg-black shadow-inner">
                    <iframe
                      key={activeMedia.embedUrl}
                      src={activeMedia.embedUrl}
                      title={activeMedia.title}
                      className="w-full h-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-mono text-cyber-slate pt-0.5">
                    <span className="truncate pr-2 text-cyber-light">{activeMedia.title}</span>
                    <span className="shrink-0 text-cyber-teal/80">Embedded Preview</span>
                  </div>
                </div>
              )}
            </div>
          )}

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
                Repositories &amp; Documentation
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

          {/* Project Screenshots / Visual Evidence */}
          {project.screenshots && project.screenshots.length > 0 && (
            <div>
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400/90 mb-2 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Screenshots &amp; Visual Evidence</span>
              </h4>
              <div className="flex flex-wrap gap-3">
                {project.screenshots.map((screen, idx) => (
                  <a
                    key={screen.url + idx}
                    href={screen.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-navy-800/80 hover:bg-navy-700 text-cyber-slate hover:text-amber-300 border border-navy-600/80 hover:border-amber-400/40 text-xs font-mono transition flex items-center gap-2"
                  >
                    <Camera className="w-3.5 h-3.5 text-amber-400" />
                    <span>{screen.label}</span>
                    <ExternalLink className="w-3 h-3 opacity-60" />
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
