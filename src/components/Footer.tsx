"use client";

import React from "react";
import { Github, Linkedin, Mail, MessageCircle, Send } from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";

export default function Footer() {
  return (
    <>
      {/* Contact Section */}
      <section id="contact" className="max-w-3xl mx-auto px-6 py-28 text-center relative z-10">
        <span className="font-mono text-cyber-teal text-sm mb-3 inline-block">
          08. What&apos;s Next?
        </span>
        <h2 className="text-3xl sm:text-5xl font-bold text-cyber-white tracking-tight mb-6">
          Get In Touch
        </h2>
        <p className="text-cyber-slate text-base sm:text-lg leading-relaxed mb-10 max-w-xl mx-auto">
          I am currently open to freelance opportunities in DevOps automation, cloud infrastructure design, and backend development—from one-off infrastructure setups (VPNs, tunnels, CI/CD pipelines) to ongoing engineering roles. Feel free to reach out!
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="neon-btn w-full sm:w-auto px-8 py-4 rounded-xl border border-cyber-teal text-cyber-teal hover:bg-cyber-teal/10 font-mono text-sm font-semibold transition flex items-center justify-center gap-2"
          >
            <Mail className="w-4 h-4" />
            <span>Say Hello (Email)</span>
          </a>

          <a
            href={PERSONAL_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-mono text-sm font-semibold transition shadow-lg shadow-green-900/30 flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </section>

      {/* Footer Bar */}
      <footer className="max-w-5xl mx-auto px-6 py-10 border-t border-navy-600/40 text-center relative z-10 text-xs font-mono text-cyber-slate">
        {/* Mobile Social Links */}
        <div className="flex items-center justify-center gap-6 mb-6 md:hidden">
          <a
            href={PERSONAL_INFO.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyber-teal transition"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href={PERSONAL_INFO.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-cyber-teal transition"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href={`mailto:${PERSONAL_INFO.email}`}
            className="hover:text-cyber-teal transition"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        <p className="hover:text-cyber-teal transition">
          Designed &amp; Built by {PERSONAL_INFO.name}
        </p>
        <p className="text-[11px] text-cyber-slate/60 mt-1">
          Cloud Engineer &amp; DevOps Developer · Next.js &amp; AWS Bedrock
        </p>
      </footer>

      {/* Desktop Fixed Left Social Sidebar */}
      <div className="hidden md:flex fixed bottom-0 left-8 z-20 flex-col items-center space-y-6">
        <a
          href={PERSONAL_INFO.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyber-slate hover:text-cyber-teal hover:-translate-y-1 transition duration-200"
          aria-label="GitHub"
        >
          <Github className="w-5 h-5" />
        </a>
        <a
          href={PERSONAL_INFO.linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyber-slate hover:text-cyber-teal hover:-translate-y-1 transition duration-200"
          aria-label="LinkedIn"
        >
          <Linkedin className="w-5 h-5" />
        </a>
        <a
          href={PERSONAL_INFO.whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyber-slate hover:text-cyber-teal hover:-translate-y-1 transition duration-200"
          aria-label="WhatsApp"
        >
          <Send className="w-5 h-5" />
        </a>
        <div className="w-px h-24 bg-navy-600" />
      </div>

      {/* Desktop Fixed Right Email Sidebar */}
      <div className="hidden md:flex fixed bottom-0 right-8 z-20 flex-col items-center space-y-6">
        <a
          href={`mailto:${PERSONAL_INFO.email}`}
          className="text-cyber-slate hover:text-cyber-teal font-mono text-xs tracking-widest transition duration-200 hover:-translate-y-1"
          style={{ writingMode: "vertical-rl" }}
        >
          {PERSONAL_INFO.email}
        </a>
        <div className="w-px h-24 bg-navy-600" />
      </div>

      {/* Floating WhatsApp Action Button */}
      <a
        href={PERSONAL_INFO.whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        title="Contact on WhatsApp"
        className="fixed bottom-6 right-6 z-30 w-14 h-14 rounded-full bg-green-500 hover:bg-green-400 text-white flex items-center justify-center shadow-xl shadow-green-950/40 hover:scale-110 transition-transform duration-200 group"
      >
        <MessageCircle className="w-7 h-7 group-hover:rotate-12 transition-transform" />
      </a>
    </>
  );
}
