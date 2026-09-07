"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Languages, MapPin, CheckCircle2 } from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";

export default function About() {
  const [imgError, setImgError] = useState(false);

  const coreTech = [
    "AWS (EC2, Bedrock, S3, Lambda)",
    "Google Cloud (Cloud Run, Cloud Build)",
    "Docker & Containerization",
    "Cloudflare Zero Trust & Tunnels",
    "WireGuard VPN & Linux Admin",
    "Node.js (Hapi.js, Express)",
    ".NET Core / Web Forms & C#",
    "SQL Server & PostgreSQL",
  ];

  return (
    <section id="about" className="max-w-5xl mx-auto px-6 md:px-12 py-24 relative z-10">
      {/* Section Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-cyber-white mb-10 flex items-center gap-4">
        <span className="font-mono text-cyber-teal text-xl">01.</span>
        <span>About Me</span>
        <span className="h-px bg-navy-600 flex-grow max-w-xs" />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-start">
        {/* Bio Text Column */}
        <div className="md:col-span-3 space-y-4 text-cyber-slate leading-relaxed text-base sm:text-lg">
          <p>
            Hello! I am an applied bachelor of Informatics and Cloud/DevOps Engineer based in{" "}
            <span className="text-cyber-white font-semibold flex-inline items-center gap-1">
              <MapPin className="w-4 h-4 inline text-cyber-teal" /> Jakarta, Indonesia
            </span>
            . I have formal enterprise experience improving and automating business-critical systems at{" "}
            <strong className="text-cyber-white font-semibold">PT Panasonic Manufacturing Indonesia</strong>.
          </p>

          <p>
            My engineering work spans multi-cloud infrastructure across{" "}
            <strong className="text-cyber-white">AWS</strong>,{" "}
            <strong className="text-cyber-white">Google Cloud</strong>, and{" "}
            <strong className="text-cyber-white">Azure</strong>, containerized microservices architectures, secure tunneling (
            <span className="text-cyber-teal font-mono text-sm">Cloudflare Zero Trust & WireGuard</span>
            ), and hands-on enterprise IT governance and compliance audits adhering to OJK and COBIT standards.
          </p>

          <p>
            I am particularly driven by solving real-world friction—whether that is building an AI-powered E-Recruitment system with{" "}
            <span className="text-cyber-teal font-mono text-sm">AWS Bedrock</span>, engineering national healthcare HL7 FHIR interoperability pipelines, or exposing on-premise Proxmox clusters without opening inbound ports.
          </p>

          {/* Languages from Profile.pdf */}
          <div className="pt-2">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyber-white flex items-center gap-2 mb-3">
              <Languages className="w-4 h-4 text-cyber-teal" /> Languages
            </h4>
            <div className="flex flex-wrap gap-2">
              {PERSONAL_INFO.languages.map((lang) => (
                <span
                  key={lang.name}
                  className="px-3 py-1 rounded bg-navy-700 border border-navy-600 text-xs font-mono text-cyber-light"
                >
                  <strong className="text-cyber-teal">{lang.name}:</strong> {lang.level}
                </span>
              ))}
            </div>
          </div>

          {/* Technologies worked with */}
          <div className="pt-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-cyber-white mb-3">
              Core Technologies I Work With:
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-mono text-cyber-light">
              {coreTech.map((tech) => (
                <div key={tech} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyber-teal flex-shrink-0" />
                  <span>{tech}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Profile Photo Column */}
        <div className="md:col-span-2 flex justify-center">
          <div className="relative group w-64 h-64 sm:w-72 sm:h-72">
            {/* Ambient cyan border offset */}
            <div className="absolute inset-0 rounded-xl border-2 border-cyber-teal translate-x-4 translate-y-4 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300 pointer-events-none" />

            {/* Photo container */}
            <div className="relative w-full h-full rounded-xl overflow-hidden bg-navy-700 border border-navy-600 z-10 group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-300 shadow-2xl">
              <Image
                src={imgError ? "https://placehold.co/400x400/112240/64ffda?text=Irfan+Noor+Hidayat" : PERSONAL_INFO.avatarUrl}
                alt={PERSONAL_INFO.name}
                fill
                sizes="(max-width: 768px) 100vw, 300px"
                className="object-cover grayscale contrast-125 hover:grayscale-0 transition duration-300"
                onError={() => setImgError(true)}
              />
              <div className="absolute inset-0 bg-cyber-teal/20 mix-blend-multiply hover:opacity-0 transition duration-300" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
