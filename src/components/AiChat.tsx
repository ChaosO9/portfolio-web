"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Sparkles,
  Send,
  Trash2,
  AlertCircle,
  Bot,
  User,
  ExternalLink,
  MessageCircle,
} from "lucide-react";
import { PERSONAL_INFO } from "@/data/portfolioData";
import { useQuota } from "@/context/QuotaContext";
import MarkdownRenderer from "./MarkdownRenderer";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const PRESET_PROMPTS = [
  "What did Irfan build at Panasonic?",
  "Explain the SATUSEHAT interoperability project",
  "How was AWS Bedrock integrated into TalentTrail?",
  "How did Irfan set up WireGuard VPN on EC2?",
  "What microservices did Irfan develop at Wowrack?",
];

export default function AiChatSection() {
  const {
    remaining: quotaRemaining,
    limit: quotaLimit,
    isRateLimited: rateLimited,
    updateQuota,
  } = useQuota();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: `Hello! I am Irfan's AI Assistant, powered by AWS Bedrock architecture. Ask me anything about Irfan's background, cloud deployments, microservices, or enterprise experience at Panasonic!`,
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"bedrock" | "demo">("demo");
  const [sessionId, setSessionId] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);

  // Check Bedrock configuration status
  useEffect(() => {
    async function checkStatus() {
      try {
        const res = await fetch("/api/chat");
        if (res.ok) {
          const data = await res.json();
          if (data.isBedrockConfigured) setMode("bedrock");
        }
      } catch (err) {
        console.warn("Could not check assistant status:", err);
      }
    }
    checkStatus();
  }, []);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputValue).trim();
    if (!query || loading) return;

    const newMessages: ChatMessage[] = [...messages, { role: "user", content: query }];
    setMessages(newMessages);
    setInputValue("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: query,
          history: messages.slice(-8), // Send previous messages for conversational context
          sessionId: sessionId,
        }),
      });

      const data = await res.json();

      if (data.sessionId) {
        setSessionId(data.sessionId);
      }

      if (res.status === 429) {
        updateQuota(0, data.limit || quotaLimit);
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              `You have reached the maximum limit of ${data.limit || quotaLimit} queries per IP address. Please feel free to reach out to Irfan directly via WhatsApp or Email below!`,
          },
        ]);
      } else if (!res.ok) {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content:
              "Sorry, an error occurred while connecting to the assistant. Please try again or reach out directly.",
          },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: data.response,
          },
        ]);
        if (typeof data.remaining === "number") {
          updateQuota(data.remaining, data.limit);
        }
        if (data.mode) setMode(data.mode);
      }
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Network error occurred. Please check your connection or contact Irfan directly.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleClearHistory = () => {
    setSessionId(null);
    setMessages([
      {
        role: "assistant",
        content: `Conversation reset. Feel free to ask about Irfan's cloud architecture, DevOps, or experience!`,
      },
    ]);
  };

  return (
    <section id="ai-assistant" className="max-w-4xl mx-auto px-6 md:px-12 py-24 relative z-10">
      {/* Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-cyber-white flex items-center gap-4">
          <span className="font-mono text-cyber-teal text-xl">07.</span>
          <span>AWS Bedrock AI Assistant</span>
          <span className="h-px bg-navy-600 flex-grow max-w-xs" />
        </h2>

        {/* IP Rate Limit Quota Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-navy-700 border border-navy-600 font-mono text-xs text-cyber-light">
          <Sparkles className="w-3.5 h-3.5 text-cyber-teal" />
          <span>
            Quota:{" "}
            <strong className={quotaRemaining > 0 ? "text-cyber-teal" : "text-amber-400"}>
              {quotaRemaining}/{quotaLimit}
            </strong>{" "}
            queries left
          </span>
        </div>
      </div>

      <p className="text-cyber-slate text-sm sm:text-base mb-8 max-w-2xl leading-relaxed">
        Interrogate my portfolio conversationally. Powered by an AWS Bedrock serverless pipeline indexing my project library, work history, and architecture decisions.
      </p>

      {/* Main Terminal Window */}
      <div className="card-cyber-static rounded-2xl overflow-hidden border border-navy-600 shadow-2xl flex flex-col h-[620px]">
        {/* Terminal Header */}
        <div className="px-6 py-4 bg-navy-900 border-b border-navy-600/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-red-500/80" />
              <span className="w-3 h-3 rounded-full bg-yellow-500/80" />
              <span className="w-3 h-3 rounded-full bg-green-500/80" />
            </div>
            <span className="font-mono text-xs text-cyber-slate">
              bedrock-agent@irfan-cloud:~#
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] font-mono px-2.5 py-0.5 rounded bg-navy-800 text-cyber-teal border border-cyber-teal/30">
              {mode === "bedrock" ? "AWS Bedrock Live" : "Contextual Demo Engine"}
            </span>

            <button
              onClick={handleClearHistory}
              title="Clear conversation history"
              className="p-1.5 rounded hover:bg-navy-800 text-cyber-slate hover:text-cyber-white transition"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Preset Prompt Pills */}
        <div className="px-6 py-3 bg-navy-800/40 border-b border-navy-600/40 overflow-x-auto scrollbar-thin">
          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-[11px] font-mono text-cyber-slate/70 mr-1">Suggested:</span>
            {PRESET_PROMPTS.map((prompt) => (
              <button
                key={prompt}
                onClick={() => handleSendMessage(prompt)}
                disabled={loading || rateLimited}
                className="px-3 py-1 rounded-full bg-navy-700/80 hover:bg-cyber-teal/15 text-cyber-light hover:text-cyber-teal border border-navy-600/70 text-xs font-mono transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Box */}
        <div
          ref={chatContainerRef}
          className="flex-grow p-6 overflow-y-auto space-y-4 bg-navy-800/20"
        >
          {messages.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={idx}
                className={`flex items-start gap-3 max-w-2xl ${
                  isUser ? "ml-auto flex-row-reverse" : "mr-auto"
                }`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-mono font-bold shadow-md ${
                    isUser
                      ? "bg-cyber-teal text-navy-900"
                      : "bg-navy-700 text-cyber-teal border border-navy-600"
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? "bg-cyber-teal text-navy-900 font-medium rounded-tr-none whitespace-pre-wrap"
                      : "bg-navy-700 text-cyber-light border border-navy-600/70 rounded-tl-none"
                  }`}
                >
                  {isUser ? (
                    msg.content
                  ) : (
                    <MarkdownRenderer content={msg.content} />
                  )}
                </div>
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-start gap-3 max-w-lg mr-auto">
              <div className="w-8 h-8 rounded-full bg-navy-700 text-cyber-teal border border-navy-600 flex items-center justify-center flex-shrink-0 text-xs font-mono">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-4 rounded-2xl bg-navy-700 border border-navy-600/70 rounded-tl-none flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cyber-teal typing-dot" />
                <span className="w-2 h-2 rounded-full bg-cyber-teal typing-dot" />
                <span className="w-2 h-2 rounded-full bg-cyber-teal typing-dot" />
              </div>
            </div>
          )}
        </div>

        {/* Rate Limit Alert Banner if exhausted */}
        {rateLimited && (
          <div className="p-4 bg-amber-500/10 border-t border-amber-500/30 text-amber-200 text-xs font-mono flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <span>
                Daily query quota reached ({quotaLimit}/{quotaLimit} requests). Connect with Irfan directly:
              </span>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <a
                href={PERSONAL_INFO.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 rounded bg-green-600 hover:bg-green-500 text-white font-semibold transition flex items-center gap-1"
              >
                <MessageCircle className="w-3.5 h-3.5" /> WhatsApp
              </a>
              <a
                href={`mailto:${PERSONAL_INFO.email}`}
                className="px-3 py-1.5 rounded bg-navy-700 hover:bg-navy-600 text-cyber-teal border border-navy-600 transition"
              >
                Email
              </a>
            </div>
          </div>
        )}

        {/* Input Bar */}
        <div className="p-4 bg-navy-900 border-t border-navy-600/80 flex items-center gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
            disabled={loading || rateLimited}
            placeholder={
              rateLimited
                ? `Quota limit reached (${quotaLimit}/${quotaLimit} queries per IP). Please contact directly.`
                : "Ask about Irfan's cloud architectures, microservices, or experience..."
            }
            className="w-full bg-navy-800 text-cyber-light px-4 py-3 rounded-xl border border-navy-600 text-xs sm:text-sm font-mono focus:outline-none focus:border-cyber-teal placeholder:text-cyber-slate/50 transition disabled:opacity-50"
          />

          <button
            onClick={() => handleSendMessage()}
            disabled={loading || rateLimited || !inputValue.trim()}
            className="neon-btn px-5 py-3 rounded-xl bg-cyber-teal text-navy-900 hover:bg-opacity-90 font-mono font-bold transition flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            aria-label="Send message"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
