"use client";

import React from "react";
import { Award, ExternalLink, ShieldCheck, Cloud, Server, Code, Database, Cpu } from "lucide-react";
import { CERTIFICATIONS, Certification } from "@/data/portfolioData";

export default function CertificationsSection() {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "aws":
        return <Cpu className="w-5 h-5 text-cyber-teal" />;
      case "cloud":
        return <Cloud className="w-5 h-5 text-cyber-teal" />;
      case "network":
        return <ShieldCheck className="w-5 h-5 text-cyber-teal" />;
      case "server":
        return <Server className="w-5 h-5 text-cyber-teal" />;
      case "code":
        return <Code className="w-5 h-5 text-cyber-teal" />;
      case "database":
        return <Database className="w-5 h-5 text-cyber-teal" />;
      default:
        return <Award className="w-5 h-5 text-cyber-teal" />;
    }
  };

  return (
    <section id="certifications" className="max-w-5xl mx-auto px-6 md:px-12 py-24 relative z-10">
      {/* Section Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-cyber-white mb-10 flex items-center gap-4">
        <span className="font-mono text-cyber-teal text-xl">06.</span>
        <span>Verified Credentials &amp; Certifications</span>
        <span className="h-px bg-navy-600 flex-grow max-w-xs" />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {CERTIFICATIONS.map((cert: Certification) => (
          <div
            key={cert.id}
            className="card-cyber rounded-xl p-6 flex items-start justify-between gap-4 group"
          >
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-navy-800 border border-navy-600 flex items-center justify-center flex-shrink-0 group-hover:border-cyber-teal/60 transition shadow-inner">
                {getIcon(cert.iconName)}
              </div>

              <div>
                <h3 className="text-sm sm:text-base font-bold text-cyber-white group-hover:text-cyber-teal transition mb-1 leading-snug">
                  {cert.title}
                </h3>
                <p className="text-xs font-mono text-cyber-slate">{cert.issuer}</p>
                <span className="inline-block mt-2 text-[11px] font-mono text-cyber-teal/80">
                  Issued: {cert.date}
                </span>
              </div>
            </div>

            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                title="Verify Credential on LinkedIn"
                className="text-cyber-slate hover:text-cyber-teal p-2 rounded-lg hover:bg-navy-800 transition flex-shrink-0"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
