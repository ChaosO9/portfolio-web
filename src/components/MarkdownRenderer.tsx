"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ExternalLink } from "lucide-react";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  return (
    <div className={`markdown-content leading-relaxed ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-base sm:text-lg font-bold text-cyber-white font-mono mt-4 mb-2 pb-1 border-b border-navy-600/60 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-cyber-teal inline-block" />
              <span>{children}</span>
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-sm sm:text-base font-bold text-cyber-white font-mono mt-3.5 mb-2 flex items-center gap-2 text-cyber-teal">
              <span className="w-1 h-1 rounded-full bg-cyber-teal inline-block" />
              <span>{children}</span>
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-xs sm:text-sm font-semibold text-cyber-teal font-mono mt-3 mb-1.5 uppercase tracking-wide">
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-xs font-semibold text-cyber-light font-mono mt-2 mb-1">
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p className="mb-2.5 last:mb-0 text-cyber-light leading-relaxed">
              {children}
            </p>
          ),
          strong: ({ children }) => (
            <strong className="font-semibold text-cyber-white">
              {children}
            </strong>
          ),
          em: ({ children }) => (
            <em className="text-cyber-slate italic">{children}</em>
          ),
          ul: ({ children }) => (
            <ul className="list-disc pl-5 mb-3 space-y-1.5 text-cyber-light marker:text-cyber-teal">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal pl-5 mb-3 space-y-1.5 text-cyber-light marker:text-cyber-teal font-mono">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="leading-relaxed pl-0.5">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-2 border-cyber-teal/60 pl-3 my-2 text-cyber-slate bg-navy-800/40 py-1 rounded-r">
              {children}
            </blockquote>
          ),
          hr: () => <hr className="border-navy-600/60 my-4" />,
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyber-teal hover:underline inline-flex items-center gap-0.5 font-medium hover:text-cyber-teal/80 transition"
            >
              <span>{children}</span>
              <ExternalLink className="w-3 h-3 inline-block opacity-70" />
            </a>
          ),
          code: ({ className, children, ...props }) => {
            const isBlock = Boolean(className) || String(children).includes("\n");
            if (isBlock) {
              return (
                <pre className="p-3 my-2 rounded-xl bg-navy-950 border border-navy-700/80 font-mono text-[11px] sm:text-xs text-cyber-teal overflow-x-auto">
                  <code {...props}>{children}</code>
                </pre>
              );
            }
            return (
              <code
                className="px-1.5 py-0.5 rounded bg-navy-900 border border-navy-700 text-cyber-teal font-mono text-[11px]"
                {...props}
              >
                {children}
              </code>
            );
          },
          table: ({ children }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-navy-600">
              <table className="w-full text-left border-collapse text-xs font-mono">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-navy-900 text-cyber-teal border-b border-navy-600">
              {children}
            </thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-navy-700/50 bg-navy-800/50">
              {children}
            </tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-navy-700/40 transition">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="p-2.5 font-semibold text-cyber-white">{children}</th>
          ),
          td: ({ children }) => (
            <td className="p-2.5 text-cyber-light">{children}</td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
