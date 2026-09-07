"use client";

import React from "react";
import Image from "next/image";
import { GraduationCap, Calendar, MapPin, Award } from "lucide-react";
import { EDUCATIONS } from "@/data/portfolioData";

export default function EducationSection() {
  return (
    <section id="education" className="max-w-5xl mx-auto px-6 md:px-12 py-24 relative z-10">
      {/* Section Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-cyber-white mb-10 flex items-center gap-4">
        <span className="font-mono text-cyber-teal text-xl">03.</span>
        <span>Education</span>
        <span className="h-px bg-navy-600 flex-grow max-w-xs" />
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {EDUCATIONS.map((edu) => (
          <div
            key={edu.id}
            className="card-cyber rounded-xl p-6 sm:p-8 flex flex-col justify-between"
          >
            <div>
              {/* Institution Logo & Header */}
              <div className="flex items-start justify-between gap-4 mb-5">
                <div>
                  <span className="text-xs font-mono text-cyber-teal tracking-wide uppercase">
                    {edu.degree}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold text-cyber-white mt-1">
                    {edu.institution}
                  </h3>
                  <p className="text-sm font-mono text-cyber-light mt-0.5">{edu.major}</p>
                </div>

                {/* Institution Logo Container */}
                <div className="flex-shrink-0 w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-white p-2 border border-navy-600 flex items-center justify-center text-center shadow-lg group hover:border-cyber-teal transition overflow-hidden">
                  {edu.logoUrl ? (
                    <Image
                      src={edu.logoUrl}
                      alt={edu.institution}
                      width={64}
                      height={64}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-200"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <GraduationCap className="w-6 h-6 text-cyber-teal mb-0.5 group-hover:rotate-12 transition-transform" />
                      <span className="text-[10px] font-mono font-bold text-navy-900">
                        {edu.logoText}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Dates & Location */}
              <div className="flex flex-wrap gap-4 text-xs font-mono text-cyber-slate mb-6 pb-4 border-b border-navy-600/60">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-cyber-teal" />
                  {edu.period}
                </span>
                <span className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyber-teal" />
                  {edu.location}
                </span>
              </div>

              {/* Highlights & Capstone */}
              <div className="space-y-2.5 text-xs sm:text-sm text-cyber-slate leading-relaxed">
                {edu.highlights.map((highlight, idx) => (
                  <div key={idx} className="flex items-start gap-2.5">
                    <Award className="w-4 h-4 text-cyber-teal flex-shrink-0 mt-0.5" />
                    <span>{highlight}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
