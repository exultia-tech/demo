"use client";

import { useEffect, useState } from "react";
import { ShieldCheck, Lock } from "lucide-react";

export default function OperatorPreviewBanner() {
  const [isOperator, setIsOperator] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const hasCookie = document.cookie.includes("exultia_operator_key");
      setIsOperator(hasCookie);
    }
  }, []);

  if (!isOperator) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: "1rem",
        right: "1rem",
        zIndex: 9998,
        background: "rgba(15, 23, 42, 0.92)",
        border: "1px solid rgba(16, 185, 129, 0.4)",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.7), 0 0 15px rgba(16, 185, 129, 0.2)",
        backdropFilter: "blur(10px)",
        borderRadius: "30px",
        padding: "6px 14px 6px 10px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        fontSize: "0.74rem",
        color: "#E2E8F0",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 8px #10B981" }} />
        <span style={{ fontWeight: 700, color: "#34D399" }}>Operator Validation Active</span>
        <span style={{ color: "#64748B" }}>|</span>
        <span style={{ color: "#94A3B8" }}>Site Hidden from Public</span>
      </div>

      <a
        href="/api/preview/lock"
        style={{
          background: "rgba(255, 255, 255, 0.08)",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          borderRadius: "15px",
          color: "#CBD5E1",
          textDecoration: "none",
          padding: "3px 8px",
          fontSize: "0.68rem",
          fontWeight: 600,
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          transition: "all 0.2s",
        }}
        onMouseOver={(e) => {
          e.currentTarget.style.background = "rgba(239, 68, 68, 0.2)";
          e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.4)";
          e.currentTarget.style.color = "#FCA5A5";
        }}
        onMouseOut={(e) => {
          e.currentTarget.style.background = "rgba(255, 255, 255, 0.08)";
          e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)";
          e.currentTarget.style.color = "#CBD5E1";
        }}
      >
        <Lock size={11} />
        <span>Re-Lock Site</span>
      </a>
    </div>
  );
}
