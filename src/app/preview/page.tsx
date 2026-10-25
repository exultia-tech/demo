"use client";

import { useState, useEffect } from "react";
import { Shield, Lock, ArrowRight, ShieldAlert, CheckCircle2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function PreviewHoldingPage() {
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const autoKey = params.get("key");
      const errParam = params.get("error");

      if (autoKey) {
        window.location.href = `/api/preview/unlock?key=${encodeURIComponent(autoKey)}`;
      } else if (errParam === "invalid_key") {
        setError("Invalid operator authorization passkey. Please check your credentials.");
      }
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/preview/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: passkey }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Access denied. Invalid operator passkey.");
      } else {
        window.location.href = data.redirect || "/";
      }
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate passkey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(ellipse at top, #0f172a 0%, #030712 100%)",
        color: "#F8FAFC",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1.5rem",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glowing ambient orbs */}
      <div
        style={{
          position: "absolute",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "550px",
          height: "350px",
          background: "radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.05) 60%, transparent 80%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: "520px",
          width: "100%",
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          backdropFilter: "blur(16px)",
          borderRadius: "24px",
          padding: "3rem 2.25rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 35px rgba(59, 130, 246, 0.15)",
          textAlign: "center",
          position: "relative",
          zIndex: 1,
        }}
        className="fade-in"
      >
        {/* Brand Icon */}
        <div
          style={{
            width: "60px",
            height: "60px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
            margin: "0 auto 1.25rem auto",
            display: "grid",
            placeItems: "center",
            color: "white",
            boxShadow: "0 0 30px rgba(59, 130, 246, 0.4)",
          }}
        >
          <Shield size={32} />
        </div>

        {/* Status Pill */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "7px",
            padding: "4px 12px",
            borderRadius: "20px",
            background: "rgba(245, 158, 11, 0.12)",
            border: "1px solid rgba(245, 158, 11, 0.4)",
            color: "#FBBF24",
            fontSize: "0.74rem",
            fontWeight: 700,
            marginBottom: "1rem",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#F59E0B", display: "inline-block" }} />
          <span>Pre-Launch Staging & Validation</span>
        </div>

        <h1 style={{ fontSize: "2rem", fontWeight: 800, margin: "0 0 0.5rem 0", letterSpacing: "-0.03em", color: "#FFFFFF" }}>
          Exultia Security Systems
        </h1>

        <p style={{ color: "#94A3B8", fontSize: "0.92rem", lineHeight: 1.6, margin: "0 0 2rem 0" }}>
          Our workstation security, vulnerability intelligence, and legal discovery platform is currently undergoing final staging and pre-flight validation. Public access opens shortly.
        </p>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "10px",
              padding: "0.75rem",
              color: "#FCA5A5",
              fontSize: "0.82rem",
              marginBottom: "1.25rem",
              textAlign: "left",
            }}
          >
            {error}
          </div>
        )}

        {/* Passkey Unlock Form */}
        <form onSubmit={handleUnlock} style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.5rem" }}>
          <div style={{ position: "relative" }}>
            <Lock
              size={16}
              color="#64748B"
              style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="password"
              placeholder="Enter Operator Authorization Key..."
              value={passkey}
              onChange={(e) => setPasskey(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "0.8rem 1rem 0.8rem 2.6rem",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "12px",
                color: "#FFFFFF",
                fontSize: "0.88rem",
                outline: "none",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = "#3B82F6")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255, 255, 255, 0.15)")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.85rem",
              background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
              border: "none",
              borderRadius: "12px",
              color: "white",
              fontWeight: 700,
              fontSize: "0.92rem",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: "0 0 20px rgba(59, 130, 246, 0.3)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
          >
            {loading ? "Authenticating Operator..." : "Unlock Platform Workspace →"}
          </button>
        </form>

        {/* Footer */}
        <div style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem", textAlign: "center", fontSize: "0.76rem" }}>
          <span style={{ color: "#64748B" }}>
            Exultia SecOps © 2026 • Private Validation Staging
          </span>
        </div>
      </div>
    </div>
  );
}
