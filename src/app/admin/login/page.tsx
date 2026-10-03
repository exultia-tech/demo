"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, Lock, Mail, ArrowRight, CheckCircle2, AlertTriangle, KeyRound } from "lucide-react";

export default function AdminEmergencyLoginPage() {
  const router = useRouter();
  const { login, user } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If already logged in as admin, redirect to account portal
  if (user && user.role === "admin") {
    router.push("/account");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        router.push("/account");
      } else {
        setError(res.error || "Authentication failed. Access denied.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "85vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "460px",
          background: "linear-gradient(180deg, rgba(20, 26, 40, 0.98) 0%, rgba(10, 15, 26, 0.98) 100%)",
          border: "1px solid rgba(245, 158, 11, 0.4)",
          borderRadius: "20px",
          padding: "2.5rem 2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 35px rgba(245, 158, 11, 0.15)",
        }}
      >
        {/* Header Badge */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background: "rgba(245, 158, 11, 0.15)",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              margin: "0 auto 1rem auto",
              display: "grid",
              placeItems: "center",
              color: "#F59E0B",
              boxShadow: "0 0 20px rgba(245, 158, 11, 0.25)",
            }}
          >
            <ShieldAlert size={28} />
          </div>

          <div
            style={{
              fontSize: "0.72rem",
              background: "rgba(245, 158, 11, 0.2)",
              color: "#FCD34D",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              padding: "3px 10px",
              borderRadius: "6px",
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: "0.06em",
              display: "inline-block",
              marginBottom: "0.75rem",
            }}
          >
            Root Break-Glass Console
          </div>

          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.35rem 0" }}>
            Emergency Operator Login
          </h1>
          <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: 0, lineHeight: 1.4 }}>
            Direct cryptographic credential authentication for root system recovery during SSO outages.
          </p>
        </div>

        {/* Warning Notice */}
        <div
          style={{
            background: "rgba(245, 158, 11, 0.08)",
            border: "1px solid rgba(245, 158, 11, 0.25)",
            borderRadius: "10px",
            padding: "0.75rem 0.9rem",
            marginBottom: "1.5rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px",
          }}
        >
          <AlertTriangle size={16} color="#F59E0B" style={{ flexShrink: 0, marginTop: "2px" }} />
          <div style={{ fontSize: "0.76rem", color: "#FEF3C7", lineHeight: 1.4 }}>
            Standard user accounts are disabled on this terminal. Customer and researcher accounts must authenticate via{" "}
            <Link href="/login" style={{ color: "#60A5FA", textDecoration: "underline", fontWeight: 700 }}>
              Single Sign-On (SSO)
            </Link>
            .
          </div>
        </div>

        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.3)",
              borderRadius: "10px",
              padding: "0.75rem",
              color: "#FCA5A5",
              fontSize: "0.85rem",
              marginBottom: "1.25rem",
            }}
          >
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.78rem",
                color: "#CBD5E1",
                fontWeight: 600,
                marginBottom: "0.35rem",
              }}
            >
              Root Administrator Email
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={16}
                color="#64748B"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="email"
                placeholder="admin@exultia.tech"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 0.75rem 0.75rem 2.4rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.88rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.78rem",
                color: "#CBD5E1",
                fontWeight: 600,
                marginBottom: "0.35rem",
              }}
            >
              Master Passphrase
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={16}
                color="#64748B"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="password"
                placeholder="••••••••••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.75rem 0.75rem 0.75rem 2.4rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.88rem",
                  outline: "none",
                }}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "0.85rem",
              fontSize: "0.92rem",
              fontWeight: 800,
              marginTop: "0.5rem",
              background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
              color: "#0F172A",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
            }}
          >
            {loading ? "Verifying Root Cryptography..." : "Authenticate Root Operator →"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
          <Link
            href="/login"
            style={{
              fontSize: "0.82rem",
              color: "#94A3B8",
              textDecoration: "none",
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
            }}
          >
            ← Return to Standard Single Sign-On
          </Link>
        </div>
      </div>
    </div>
  );
}
