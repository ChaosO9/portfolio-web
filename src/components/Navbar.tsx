"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, Menu, X } from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "#about", num: "01" },
    { name: "Experience", href: "#experience", num: "02" },
    { name: "Education", href: "#education", num: "03" },
    { name: "Stack", href: "#tech-stack", num: "04" },
    { name: "Projects", href: "#projects", num: "05" },
    { name: "Certs", href: "#certifications", num: "06" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-navy-900/90 backdrop-blur-md py-3 shadow-lg shadow-black/40 border-b border-navy-600/40"
          : "bg-transparent py-5"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="#hero"
          className="text-2xl font-bold font-mono text-cyber-teal tracking-wider hover:opacity-80 transition"
        >
          INH<span className="text-white">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center space-x-6 text-sm font-mono">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-cyber-slate hover:text-cyber-teal transition duration-150 flex items-center group"
            >
              <span className="text-cyber-teal text-xs mr-1">{link.num}.</span>
              <span>{link.name}</span>
            </Link>
          ))}

          {/* AI Assistant Nav Pill */}
          <Link
            href="#ai-assistant"
            className="neon-btn px-4 py-2 rounded-lg bg-cyber-teal/10 border border-cyber-teal/40 text-cyber-teal hover:bg-cyber-teal/20 transition flex items-center gap-2 group"
          >
            <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <span>AI Assistant</span>
          </Link>

          {/* Resume Button */}
          <a
            href={PERSONAL_INFO.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded border border-cyber-teal text-cyber-teal hover:bg-cyber-teal/10 transition text-xs font-semibold"
          >
            Resume
          </a>
        </nav>

        {/* Mobile Menu Toggle Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-cyber-light hover:text-cyber-teal focus:outline-none"
          aria-label="Toggle mobile menu"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-navy-700 border-b border-navy-600 px-6 py-6 space-y-4 font-mono text-sm shadow-2xl">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-cyber-light hover:text-cyber-teal transition flex items-center"
            >
              <span className="text-cyber-teal text-xs mr-2">{link.num}.</span>
              <span>{link.name}</span>
            </Link>
          ))}

          <Link
            href="#ai-assistant"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2 text-cyber-teal font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            <span>AI Assistant (AWS Bedrock)</span>
          </Link>

          <a
            href={PERSONAL_INFO.resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center w-full py-2.5 rounded border border-cyber-teal text-cyber-teal hover:bg-cyber-teal/10 transition font-semibold"
          >
            View Resume
          </a>
        </div>
      )}
    </header>
  );
}
