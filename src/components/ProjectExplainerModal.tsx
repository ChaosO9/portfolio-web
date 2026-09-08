"use client";

import React, { useEffect, useState } from "react";
import { X, Sparkles, AlertCircle, Bot, Send } from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { useQuota } from "@/context/QuotaContext";

interface ProjectExplainerModalProps {
  projectTitle: string | null;
  onClose: () => void;
}

export default function ProjectExplainerModal({
  projectTitle,
  onClose,
}: ProjectExplainerModalProps) {
  const {
    remaining: quotaRemaining,
    limit: quotaLimit,
    isRateLimited: globalRateLimited,
    updateQuota,
  } = useQuota();

  const [loading, setLoading] = useState(true);
  const [explanation, setExplanation] = useState<string>("");
  const [rateLimited, setRateLimited] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [mode, setMode] = useState<"bedrock" | "demo">("demo");

  useEffect(() => {
    if (!projectTitle) return;

    let isMounted = true;
    setLoading(true);
    setExplanation("");
    setRateLimited(false);
    setErrorMsg(null);

    async function fetchExplanation() {
      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ projectTitle }),
        });

        const data = await res.json();

        if (!isMounted) return;

        if (res.status === 429) {
          updateQuota(0, data.limit || quotaLimit);
          setRateLimited(true);
          setErrorMsg(
            data.error ||
              `Rate limit reached (${data.limit || quotaLimit} queries/IP). Please contact directly.`
          );
        } else if (!res.ok) {
          setErrorMsg(data.error || "Failed to generate project explanation.");
        } else {
          setExplanation(data.response);
          if (typeof data.remaining === "number") {
            updateQuota(data.remaining, data.limit);
          }
          if (data.mode) setMode(data.mode);
        }
      } catch (err) {
        if (!isMounted) return;
        setErrorMsg("Network error connecting to the AI assistant.");
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    fetchExplanation();

    return () => {
      isMounted = false;
    };
  }, [projectTitle, updateQuota, quotaLimit]);

  if (!projectTitle) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="card-cyber-static rounded-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl border border-navy-600 relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-navy-600/70 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyber-teal/10 border border-cyber-teal/40 flex items-center justify-center text-cyber-teal">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-cyber-white flex items-center gap-2">
                <span>Architecture Deep Dive</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-navy-800 text-cyber-teal border border-cyber-teal/30 uppercase">
                  {mode === "bedrock" ? "AWS Bedrock" : "AI Demo Mode"}
                </span>
              </h3>
              <p className="text-xs font-mono text-cyber-slate truncate max-w-md">
                {projectTitle}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-cyber-slate hover:text-cyber-white hover:bg-navy-700 transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {loading && (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="w-10 h-10 border-4 border-navy-600 border-t-cyber-teal rounded-full animate-spin" />
              <p className="text-xs font-mono text-cyber-slate animate-pulse">
                Analyzing architecture with AWS Bedrock...
              </p>
            </div>
          )}

          {rateLimited && (
            <div className="p-5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-200 space-y-3">
              <div className="flex items-center gap-2 font-mono text-xs font-bold text-amber-300">
                <AlertCircle className="w-4 h-4" />
                <span>RATE LIMIT REACHED ({quotaLimit} / {quotaLimit} Queries / IP)</span>
              </div>
              <p className="text-xs sm:text-sm text-cyber-light">
                {errorMsg}
              </p>
              <div className="pt-2 flex flex-wrap gap-2">
                <a
                  href={PERSONAL_INFO.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 rounded bg-green-600/80 hover:bg-green-600 text-white font-mono text-xs transition flex items-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" /> Direct WhatsApp
                </a>
                <a
                  href={`mailto:${PERSONAL_INFO.email}`}
                  className="px-4 py-2 rounded bg-navy-700 hover:bg-navy-600 text-cyber-teal border border-navy-600 font-mono text-xs transition"
                >
                  Send Email
                </a>
              </div>
            </div>
          )}

          {errorMsg && !rateLimited && (
            <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
              {errorMsg}
            </div>
          )}

          {!loading && explanation && (
            <div className="space-y-3 whitespace-pre-wrap text-cyber-light text-sm sm:text-base bg-navy-800/40 p-5 rounded-xl border border-navy-600/60 leading-relaxed font-sans">
              {explanation}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-navy-900 border-t border-navy-600 flex items-center justify-between text-xs font-mono text-cyber-slate">
          <div className="flex items-center gap-2">
            <Bot className="w-4 h-4 text-cyber-teal" />
            <span>
              ⚡ Quota:{" "}
              <strong className={quotaRemaining > 0 ? "text-cyber-teal" : "text-amber-400"}>
                {quotaRemaining}/{quotaLimit}
              </strong>{" "}
              queries remaining
            </span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded border border-navy-600 text-cyber-light hover:text-cyber-white transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
