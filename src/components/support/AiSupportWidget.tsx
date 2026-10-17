"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  RotateCcw, 
  Copy, 
  Check, 
  Terminal, 
  ShieldCheck, 
  HelpCircle,
  Minimize2,
  ExternalLink,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface ChatMessage {
  id: string;
  role: "assistant" | "user";
  text: string;
  timestamp: string;
  suggestions?: string[];
  topic?: string;
}

export default function AiSupportWidget() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initial welcome message
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg-welcome",
      role: "assistant",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      text: `### 🤖 Exultia Autonomous AI Sentinel

Welcome! I am Exultia's **24/7 autonomous support agent**. Because Exultia is operated as an independent **solo-engineer security lab**, I handle routine technical questions, installation commands, host count calculations, and configuration troubleshooting instantly.

- **Kinetic Pricing:** 1 host free forever, Pro is $4/host/mo, Enterprise is $12/host/mo.
- **Zero Human SLAs:** All tools are self-service, deterministic, and self-hosted.
- **Rollbacks:** Sub-second atomic recovery via \`sudo kinetic rollback\`.

Click any suggested question below or ask me anything!`,
      suggestions: [
        "How does Kinetic per-host pricing work?",
        "What is the Kinetic daemon install command?",
        "How do I execute a deterministic rollback?",
        "Do you offer human 24/7 SLAs?"
      ]
    }
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputMessage).trim();
    if (!text || isLoading) return;

    const userMsgId = `user-${Date.now()}`;
    const userMsg: ChatMessage = {
      id: userMsgId,
      role: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/support/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          history: messages.slice(-6).map((m) => ({ role: m.role, content: m.text })),
          productContext: pathname
        })
      });

      if (!res.ok) {
        throw new Error("Failed to contact support agent");
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: data.suggestions,
        topic: data.topic
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        text: "⚠️ I encountered an error connecting to the support engine. Please verify your connection or review our [Pricing & Plans page](/account/subscription) and [Systems Research Lab](/research).",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        suggestions: ["How does Kinetic per-host pricing work?", "Do you offer human 24/7 SLAs?"]
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Helper to format text with markdown-like code blocks and links
  const renderFormattedContent = (content: string) => {
    const lines = content.split("\n");
    let inCodeBlock = false;
    let codeBuffer: string[] = [];
    const elements: React.ReactNode[] = [];

    lines.forEach((line, idx) => {
      if (line.startsWith("```")) {
        if (inCodeBlock) {
          // Close code block
          const codeText = codeBuffer.join("\n");
          const blockId = `code-${idx}-${codeText.length}`;
          elements.push(
            <div key={`code-block-${idx}`} style={{
              position: "relative",
              margin: "0.5rem 0",
              background: "#090D16",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "8px",
              overflow: "hidden"
            }}>
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "4px 10px",
                background: "rgba(255, 255, 255, 0.04)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                fontSize: "0.7rem",
                color: "#94A3B8"
              }}>
                <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <Terminal size={12} color="#38BDF8" /> Terminal Command
                </span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(codeText, blockId)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: copiedId === blockId ? "#34D399" : "#94A3B8",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px",
                    fontSize: "0.68rem"
                  }}
                >
                  {copiedId === blockId ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedId === blockId ? "Copied" : "Copy"}</span>
                </button>
              </div>
              <pre style={{
                margin: 0,
                padding: "8px 12px",
                fontSize: "0.78rem",
                fontFamily: "monospace",
                color: "#E2E8F0",
                overflowX: "auto",
                lineHeight: 1.45
              }}>
                {codeText}
              </pre>
            </div>
          );
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          // Open code block
          inCodeBlock = true;
          codeBuffer = [];
        }
        return;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        return;
      }

      // Headers
      if (line.startsWith("### ")) {
        elements.push(
          <div key={`h3-${idx}`} style={{ fontSize: "0.95rem", fontWeight: 800, color: "#FFFFFF", margin: "0.6rem 0 0.3rem 0" }}>
            {line.replace("### ", "")}
          </div>
        );
        return;
      }
      if (line.startsWith("#### ")) {
        elements.push(
          <div key={`h4-${idx}`} style={{ fontSize: "0.85rem", fontWeight: 700, color: "#38BDF8", margin: "0.5rem 0 0.25rem 0" }}>
            {line.replace("#### ", "")}
          </div>
        );
        return;
      }

      // Bullet items
      if (line.startsWith("- ") || line.startsWith("* ")) {
        const text = line.substring(2);
        elements.push(
          <div key={`li-${idx}`} style={{ display: "flex", alignItems: "flex-start", gap: "6px", margin: "3px 0", fontSize: "0.82rem", lineHeight: 1.4 }}>
            <span style={{ color: "#38BDF8", flexShrink: 0 }}>•</span>
            <span>{parseInlineFormatting(text)}</span>
          </div>
        );
        return;
      }

      // Empty lines
      if (!line.trim()) {
        elements.push(<div key={`spacer-${idx}`} style={{ height: "6px" }} />);
        return;
      }

      // Table row (simple detection)
      if (line.startsWith("|")) {
        // Skip separator line
        if (line.includes("---")) return;
        const cells = line.split("|").filter((c, i, arr) => i > 0 && i < arr.length - 1).map(c => c.trim());
        elements.push(
          <div key={`table-row-${idx}`} style={{
            display: "grid",
            gridTemplateColumns: cells.length === 4 ? "1fr 1fr 1fr 2fr" : `repeat(${cells.length}, 1fr)`,
            gap: "6px",
            fontSize: "0.72rem",
            background: "rgba(255, 255, 255, 0.03)",
            padding: "4px 6px",
            borderRadius: "4px",
            margin: "2px 0"
          }}>
            {cells.map((c, cIdx) => (
              <span key={cIdx} style={{ fontWeight: c.includes("**") ? 700 : 500, color: "#E2E8F0" }}>
                {parseInlineFormatting(c)}
              </span>
            ))}
          </div>
        );
        return;
      }

      // Regular paragraph
      elements.push(
        <p key={`p-${idx}`} style={{ margin: "4px 0", fontSize: "0.82rem", lineHeight: 1.45, color: "#CBD5E1" }}>
          {parseInlineFormatting(line)}
        </p>
      );
    });

    return elements;
  };

  const parseInlineFormatting = (text: string) => {
    // Replace markdown links [text](url)
    const linkRegex = /\[(.*?)\]\((.*?)\)/g;
    const parts: (string | React.ReactNode)[] = [];
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      const linkText = match[1];
      const linkUrl = match[2];
      parts.push(
        <Link 
          key={match.index} 
          href={linkUrl} 
          style={{ color: "#38BDF8", textDecoration: "underline", fontWeight: 600 }}
          onClick={() => setIsOpen(false)}
        >
          {linkText}
        </Link>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // Process bold (**text**) and code (`text`) in parts
    return parts.map((part, pIdx) => {
      if (typeof part !== "string") return part;
      
      // Inline code
      const codeRegex = /`([^`]+)`/g;
      const subParts: (string | React.ReactNode)[] = [];
      let subLast = 0;
      let codeMatch;

      while ((codeMatch = codeRegex.exec(part)) !== null) {
        if (codeMatch.index > subLast) {
          subParts.push(part.substring(subLast, codeMatch.index));
        }
        subParts.push(
          <code key={`code-${pIdx}-${codeMatch.index}`} style={{
            background: "rgba(56, 189, 248, 0.15)",
            color: "#38BDF8",
            padding: "1px 5px",
            borderRadius: "4px",
            fontSize: "0.75rem",
            fontFamily: "monospace"
          }}>
            {codeMatch[1]}
          </code>
        );
        subLast = codeRegex.lastIndex;
      }
      if (subLast < part.length) {
        subParts.push(part.substring(subLast));
      }

      // Process bold inside subparts
      return subParts.map((sp, spIdx) => {
        if (typeof sp !== "string") return sp;
        const boldParts = sp.split(/\*\*([^*]+)\*\*/g);
        return boldParts.map((bp, bpIdx) => {
          if (bpIdx % 2 === 1) {
            return <strong key={`b-${pIdx}-${spIdx}-${bpIdx}`} style={{ color: "#FFFFFF" }}>{bp}</strong>;
          }
          return bp;
        });
      });
    });
  };

  return (
    <>
      {/* Floating Trigger Launcher */}
      <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 9999 }}>
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            aria-label="Open AI Support Sentinel"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 18px",
              background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)",
              border: "1px solid rgba(56, 189, 248, 0.5)",
              borderRadius: "999px",
              color: "#FFFFFF",
              cursor: "pointer",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.8), 0 0 20px rgba(56, 189, 248, 0.3)",
              transition: "all 0.2s ease"
            }}
            className="hover-lift"
          >
            <div style={{ position: "relative", display: "grid", placeItems: "center" }}>
              <div style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
                display: "grid",
                placeItems: "center",
                color: "#FFFFFF"
              }}>
                <Bot size={18} />
              </div>
              <span style={{
                position: "absolute",
                top: "-2px",
                right: "-2px",
                width: "9px",
                height: "9px",
                borderRadius: "50%",
                background: "#10B981",
                border: "2px solid #0F172A"
              }} />
            </div>

            <div style={{ textAlign: "left" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 800, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px" }}>
                <span>AI Support Sentinel</span>
                <span style={{
                  fontSize: "0.62rem",
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#6EE7B7",
                  border: "1px solid rgba(16, 185, 129, 0.4)",
                  padding: "1px 5px",
                  borderRadius: "999px",
                  fontWeight: 700
                }}>
                  24/7 ONLINE
                </span>
              </div>
              <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
                Solo-operator instant technical answers
              </div>
            </div>
          </button>
        ) : null}
      </div>

      {/* Floating Chat Drawer Modal */}
      {isOpen && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            width: "430px",
            maxWidth: "calc(100vw - 32px)",
            height: "620px",
            maxHeight: "calc(100vh - 48px)",
            background: "linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 26, 0.98) 100%)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            borderRadius: "20px",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 35px rgba(56, 189, 248, 0.2)",
            display: "flex",
            flexDirection: "column",
            zIndex: 10001,
            overflow: "hidden"
          }}
          className="fade-in"
        >
          {/* Header */}
          <div style={{
            padding: "14px 18px",
            background: "linear-gradient(90deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.9) 100%)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{
                width: "34px",
                height: "34px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
                display: "grid",
                placeItems: "center",
                color: "#FFFFFF",
                boxShadow: "0 0 12px rgba(6, 182, 212, 0.4)"
              }}>
                <Bot size={20} />
              </div>
              <div>
                <div style={{ fontSize: "0.9rem", fontWeight: 800, color: "#FFFFFF", display: "flex", alignItems: "center", gap: "6px" }}>
                  <span>Exultia Support Sentinel</span>
                  <span style={{
                    width: "7px",
                    height: "7px",
                    borderRadius: "50%",
                    background: "#10B981"
                  }} />
                </div>
                <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>
                  Autonomous Solo-Operator Support (No Human SLAs)
                </div>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <button
                type="button"
                onClick={() => setMessages([messages[0]])}
                title="Reset conversation"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#94A3B8",
                  padding: "5px",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <RotateCcw size={14} />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                title="Close chat"
                style={{
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "8px",
                  color: "#94A3B8",
                  padding: "5px",
                  cursor: "pointer",
                  display: "grid",
                  placeItems: "center"
                }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px",
            display: "flex",
            flexDirection: "column",
            gap: "14px"
          }}>
            {messages.map((m) => {
              const isUser = m.role === "user";
              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: isUser ? "flex-end" : "flex-start",
                    maxWidth: "100%"
                  }}
                >
                  <div
                    style={{
                      maxWidth: "90%",
                      padding: isUser ? "10px 14px" : "12px 16px",
                      borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                      background: isUser
                        ? "linear-gradient(135deg, #0284C7 0%, #2563EB 100%)"
                        : "rgba(30, 41, 59, 0.75)",
                      border: isUser
                        ? "1px solid rgba(255, 255, 255, 0.2)"
                        : "1px solid rgba(255, 255, 255, 0.1)",
                      color: "#FFFFFF",
                      fontSize: "0.84rem",
                      boxShadow: isUser
                        ? "0 4px 12px rgba(37, 99, 235, 0.3)"
                        : "0 4px 12px rgba(0, 0, 0, 0.3)"
                    }}
                  >
                    {isUser ? m.text : renderFormattedContent(m.text)}
                  </div>

                  <span style={{ fontSize: "0.65rem", color: "#64748B", marginTop: "4px", padding: "0 4px" }}>
                    {m.timestamp}
                  </span>

                  {/* Suggestion pills if present */}
                  {m.suggestions && m.suggestions.length > 0 && !isUser && (
                    <div style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "6px",
                      marginTop: "8px",
                      maxWidth: "95%"
                    }}>
                      {m.suggestions.map((s, sIdx) => (
                        <button
                          key={sIdx}
                          type="button"
                          onClick={() => handleSendMessage(s)}
                          style={{
                            background: "rgba(56, 189, 248, 0.1)",
                            border: "1px solid rgba(56, 189, 248, 0.3)",
                            borderRadius: "999px",
                            padding: "4px 10px",
                            color: "#38BDF8",
                            fontSize: "0.72rem",
                            fontWeight: 600,
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "4px",
                            transition: "all 0.15s ease",
                            textAlign: "left"
                          }}
                          className="hover-bright"
                        >
                          <span>{s}</span>
                          <ChevronRight size={10} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}

            {isLoading && (
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#94A3B8", fontSize: "0.78rem", padding: "8px 0" }}>
                <div style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  border: "2px solid rgba(56, 189, 248, 0.3)",
                  borderTopColor: "#38BDF8",
                  animation: "spin 1s linear infinite"
                }} />
                <span>Exultia Sentinel analyzing inquiry...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input & Footer Area */}
          <div style={{
            padding: "12px 14px",
            background: "rgba(10, 15, 26, 0.95)",
            borderTop: "1px solid rgba(255, 255, 255, 0.08)"
          }}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              style={{ display: "flex", gap: "8px" }}
            >
              <input
                type="text"
                placeholder="Ask about Kinetic pricing, rollbacks, installs..."
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                style={{
                  flex: 1,
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  padding: "9px 14px",
                  color: "#FFFFFF",
                  fontSize: "0.84rem",
                  outline: "none"
                }}
              />
              <button
                type="submit"
                disabled={isLoading || !inputMessage.trim()}
                style={{
                  background: inputMessage.trim() ? "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)" : "rgba(255, 255, 255, 0.1)",
                  border: "none",
                  borderRadius: "10px",
                  padding: "0 14px",
                  color: inputMessage.trim() ? "#FFFFFF" : "#64748B",
                  cursor: inputMessage.trim() ? "pointer" : "default",
                  display: "grid",
                  placeItems: "center",
                  transition: "all 0.15s ease"
                }}
              >
                <Send size={15} />
              </button>
            </form>

            <div style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "8px",
              fontSize: "0.68rem",
              color: "#64748B"
            }}>
              <span>Solo-operator tooling • Provided as-is</span>
              <Link 
                href="/account/subscription" 
                onClick={() => setIsOpen(false)}
                style={{ color: "#38BDF8", textDecoration: "none", display: "flex", alignItems: "center", gap: "3px" }}
              >
                View Plans <ExternalLink size={9} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
