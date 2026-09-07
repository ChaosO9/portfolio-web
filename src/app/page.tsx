"use client";

import React, { useState } from "react";
import ParticlesBackground from "@/components/ParticlesBackground";
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import ExperienceSection from "@/components/Experience";
import EducationSection from "@/components/Education";
import TechStackSection from "@/components/TechStack";
import ProjectsSection from "@/components/Projects";
import CertificationsSection from "@/components/Certifications";
import AiChatSection from "@/components/AiChat";
import Footer from "@/components/Footer";

export default function HomePage() {
  const [activeSkillFilter, setActiveSkillFilter] = useState<string | null>(null);

  const handleSelectSkill = (skill: string) => {
    setActiveSkillFilter(skill);
    const projectsEl = document.getElementById("projects");
    if (projectsEl) {
      projectsEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-navy-800 text-cyber-light overflow-hidden">
      {/* Interactive Canvas Background */}
      <ParticlesBackground />

      {/* Global Navigation */}
      <Navbar />

      {/* Main Sections Content */}
      <main className="relative z-10">
        <Hero />
        <About />
        <ExperienceSection onSelectSkill={handleSelectSkill} />
        <EducationSection />
        <TechStackSection onSelectSkill={handleSelectSkill} />
        <ProjectsSection
          activeSkillFilter={activeSkillFilter}
          onSelectSkillFilter={setActiveSkillFilter}
        />
        <CertificationsSection />
        <AiChatSection />
      </main>

      {/* Footer & Floating Socials */}
      <Footer />
    </div>
  );
}
