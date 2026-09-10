"use client";

import React, { useState, useMemo } from "react";
import {
  Award,
  ExternalLink,
  ShieldCheck,
  Cloud,
  Server,
  Code,
  Database,
  Cpu,
  Languages,
  BadgeCheck,
} from "lucide-react";
import { CERTIFICATIONS, Certification } from "@/data/portfolioData";

const CATEGORIES = [
  "All",
  "Cloud & DevOps",
  "National (BNSP)",
  "Software & Architecture",
  "Foundations & Languages",
] as const;

export default function CertificationsSection() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredCerts = useMemo(() => {
    if (selectedCategory === "All") return CERTIFICATIONS;
    return CERTIFICATIONS.filter((c) => c.category === selectedCategory);
  }, [selectedCategory]);

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "oracle":
        return <Cloud className="w-5 h-5 text-amber-400" />;
      case "aws":
        return <Cpu className="w-5 h-5 text-amber-500" />;
      case "cloud":
      case "google":
        return <Cloud className="w-5 h-5 text-cyber-teal" />;
      case "network":
        return <ShieldCheck className="w-5 h-5 text-cyan-400" />;
      case "server":
        return <Server className="w-5 h-5 text-emerald-400" />;
      case "code":
        return <Code className="w-5 h-5 text-indigo-400" />;
      case "database":
        return <Database className="w-5 h-5 text-blue-400" />;
      case "languages":
        return <Languages className="w-5 h-5 text-teal-300" />;
      default:
        return <Award className="w-5 h-5 text-cyber-teal" />;
    }
  };

  const getCategoryBadgeClass = (category?: string) => {
    switch (category) {
      case "Cloud & DevOps":
        return "bg-amber-500/10 text-amber-300 border-amber-500/30";
      case "National (BNSP)":
        return "bg-emerald-500/10 text-emerald-300 border-emerald-500/30";
      case "Software & Architecture":
        return "bg-blue-500/10 text-blue-300 border-blue-500/30";
      case "Foundations & Languages":
        return "bg-purple-500/10 text-purple-300 border-purple-500/30";
      default:
        return "bg-navy-800 text-cyber-slate border-navy-600";
    }
  };

  return (
    <section id="certifications" className="max-w-5xl mx-auto px-6 md:px-12 py-24 relative z-10">
      {/* Section Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-cyber-white mb-6 flex items-center gap-4">
        <span className="font-mono text-cyber-teal text-xl">06.</span>
        <span>Credentials &amp; Certifications</span>
        <span className="h-px bg-navy-600 flex-grow max-w-xs" />
      </h2>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat;
          const count =
            cat === "All"
              ? CERTIFICATIONS.length
              : CERTIFICATIONS.filter((c) => c.category === cat).length;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition flex items-center gap-1.5 cursor-pointer relative z-10 select-none ${
                isSelected
                  ? "bg-cyber-teal text-navy-900 font-semibold shadow-sm"
                  : "bg-navy-800 text-cyber-slate hover:text-cyber-light hover:bg-navy-700 border border-navy-600/60"
              }`}
            >
              <span>{cat}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? "bg-navy-900/30 text-navy-900 font-bold"
                    : "bg-navy-900 text-cyber-slate"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Certifications Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredCerts.map((cert: Certification) => {
          const isCoursera = cert.credentialUrl?.includes("coursera.org");

          return (
            <div
              key={cert.id}
              className="card-cyber rounded-xl p-5 flex flex-col justify-between group hover:border-cyber-teal/40 transition duration-200"
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-navy-800 border border-navy-600 flex items-center justify-center flex-shrink-0 group-hover:border-cyber-teal/60 transition shadow-inner">
                    {getIcon(cert.iconName)}
                  </div>

                  <div>
                    {cert.category && (
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-[10px] font-mono border mb-1.5 ${getCategoryBadgeClass(
                          cert.category
                        )}`}
                      >
                        {cert.category}
                      </span>
                    )}
                    <h3 className="text-sm sm:text-base font-bold text-cyber-white group-hover:text-cyber-teal transition leading-snug">
                      {cert.title}
                    </h3>
                    <p className="text-xs font-mono text-cyber-slate mt-1">{cert.issuer}</p>
                  </div>
                </div>

                {cert.credentialUrl && (
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={isCoursera ? "Verify on Coursera" : "Verify Credential on LinkedIn"}
                    className="text-cyber-slate hover:text-cyber-teal p-1.5 rounded-lg hover:bg-navy-800 transition flex-shrink-0"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Bottom metadata: Credential ID + Issued Date */}
              <div className="pt-3 border-t border-navy-700/60 flex flex-wrap items-center justify-between gap-2 text-[11px] font-mono">
                {cert.credentialId ? (
                  <span className="text-cyber-slate/90 flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-cyber-teal/80" />
                    <span className="truncate max-w-[210px]" title={cert.credentialId}>
                      {cert.credentialId}
                    </span>
                  </span>
                ) : (
                  <span className="text-cyber-slate/60 flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5 text-cyber-slate/40" />
                    <span>Verified</span>
                  </span>
                )}

                <span className="text-cyber-teal/80">Issued: {cert.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
