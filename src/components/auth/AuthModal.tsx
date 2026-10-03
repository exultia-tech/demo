"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, X, ShieldCheck, ShieldAlert, ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import Link from "next/link";

export default function AuthModal() {
  const { isAuthModalOpen, closeAuthModal, login } = useAuth();

  const [showEmergencyLogin, setShowEmergencyLogin] = useState(false);
  const [adminEmail, setAdminEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && isAuthModalOpen) {
      const params = new URLSearchParams(window.location.search);
      const msg = params.get("message");
      const authState = params.get("auth");
      if (authState === "restricted" || authState === "error") {
        setError(msg || "Private pre-launch validation active. Access is restricted to authorized operators.");
      }
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleEmergencySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await login(adminEmail, adminPassword);
      if (!res.success) {
        setError(res.error || "Emergency access denied. Invalid credentials.");
      } else {
        closeAuthModal();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(3, 7, 18, 0.88)",
        backdropFilter: "blur(12px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          background: showEmergencyLogin
            ? "linear-gradient(180deg, rgba(20, 26, 40, 0.98) 0%, rgba(10, 15, 26, 0.98) 100%)"
            : "linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 26, 0.98) 100%)",
          border: showEmergencyLogin
            ? "1px solid rgba(245, 158, 11, 0.4)"
            : "1px solid rgba(59, 130, 246, 0.35)",
          borderRadius: "22px",
          width: "100%",
          maxWidth: "470px",
          padding: "2.5rem 2rem",
          boxShadow: showEmergencyLogin
            ? "0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 35px rgba(245, 158, 11, 0.2)"
            : "0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 35px rgba(59, 130, 246, 0.18)",
          position: "relative",
          transition: "border-color 0.3s, box-shadow 0.3s",
        }}
        className="fade-in"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setShowEmergencyLogin(false);
            setError(null);
            closeAuthModal();
          }}
          style={{
            position: "absolute",
            top: "1.25rem",
            right: "1.25rem",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "8px",
            color: "#94A3B8",
            cursor: "pointer",
            padding: "6px",
            display: "grid",
            placeItems: "center",
          }}
        >
          <X size={18} />
        </button>

        {/* ============================================================== */}
        {/* STANDARD 100% SSO AUTHENTICATION VIEW */}
        {/* ============================================================== */}
        {!showEmergencyLogin ? (
          <div>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
              <div
                style={{
                  width: "50px",
                  height: "50px",
                  borderRadius: "15px",
                  background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                  margin: "0 auto 1rem auto",
                  display: "grid",
                  placeItems: "center",
                  color: "white",
                  boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)",
                }}
              >
                <ShieldCheck size={28} />
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  background: "rgba(245, 158, 11, 0.12)",
                  border: "1px solid rgba(245, 158, 11, 0.35)",
                  color: "#FBBF24",
                  fontSize: "0.72rem",
                  fontWeight: 700,
                  margin: "0 auto 0.75rem auto",
                  letterSpacing: "0.02em",
                }}
              >
                <ShieldAlert size={13} color="#F59E0B" />
                <span>Pre-Launch Validation Active (Operator Whitelist Only)</span>
              </div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.35rem 0" }}>
                Exultia Portal Access
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "0.86rem", margin: 0, lineHeight: 1.4 }}>
                Instant single sign-on for enterprise workspaces and personal accounts.
              </p>
            </div>

            {/* Error / Restricted Alert */}
            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.35)",
                  borderRadius: "10px",
                  padding: "0.75rem 0.9rem",
                  color: "#FCA5A5",
                  fontSize: "0.82rem",
                  marginBottom: "1.25rem",
                  display: "flex",
                  alignItems: "flex-start",
                  gap: "8px",
                  lineHeight: 1.4,
                }}
              >
                <AlertTriangle size={16} color="#F87171" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>{error}</div>
              </div>
            )}

            {/* SSO Buttons */}
            <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", marginBottom: "1.5rem" }}>
              
              {/* 1. Microsoft 365 / Entra ID / Outlook */}
              <button
                type="button"
                onClick={() => (window.location.href = "/api/auth/oauth/microsoft")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "1rem",
                  width: "100%",
                  padding: "0.85rem 1.25rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(0, 164, 239, 0.12)";
                  e.currentTarget.style.borderColor = "#00A4EF";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                }}
              >
                <svg width="22" height="22" viewBox="0 0 21 21" style={{ flexShrink: 0 }}>
                  <rect x="1" y="1" width="9" height="9" fill="#F25022" />
                  <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
                  <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
                  <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#FFFFFF" }}>
                    Continue with Microsoft
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                    Microsoft 365, Entra ID, or personal Outlook
                  </div>
                </div>
                <ArrowRight size={16} color="#64748B" />
              </button>

              {/* 2. Google Workspace & Gmail */}
              <button
                type="button"
                onClick={() => (window.location.href = "/api/auth/oauth/google")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "1rem",
                  width: "100%",
                  padding: "0.85rem 1.25rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(66, 133, 244, 0.12)";
                  e.currentTarget.style.borderColor = "#4285F4";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#FFFFFF" }}>
                    Continue with Google
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                    Google Workspace domains & personal Gmail
                  </div>
                </div>
                <ArrowRight size={16} color="#64748B" />
              </button>

              {/* 3. GitHub */}
              <button
                type="button"
                onClick={() => (window.location.href = "/api/auth/oauth/github")}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                  gap: "1rem",
                  width: "100%",
                  padding: "0.85rem 1.25rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "12px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  textAlign: "left",
                  transition: "all 0.2s ease",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.1)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.35)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.background = "rgba(255, 255, 255, 0.04)";
                  e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.12)";
                }}
              >
                <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" style={{ flexShrink: 0 }}>
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  />
                </svg>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#FFFFFF" }}>
                    Continue with GitHub
                  </div>
                  <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                    Security researchers & developer workstations
                  </div>
                </div>
                <ArrowRight size={16} color="#64748B" />
              </button>
            </div>

            {/* Zero-Password Security Guarantee */}
            <div
              style={{
                background: "rgba(59, 130, 246, 0.06)",
                border: "1px solid rgba(59, 130, 246, 0.18)",
                borderRadius: "10px",
                padding: "0.75rem 0.9rem",
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <CheckCircle2 size={16} color="#60A5FA" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: "0.74rem", color: "#93C5FD", lineHeight: 1.4 }}>
                <strong>Zero-Password Guarantee:</strong> Exultia delegates identity to your provider. No passwords or
                credentials are ever stored or managed on our servers.
              </div>
            </div>

            {/* Footer Break-Glass Link */}
            <div
              style={{
                textAlign: "center",
                paddingTop: "0.75rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <button
                type="button"
                onClick={() => setShowEmergencyLogin(true)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#64748B",
                  fontSize: "0.75rem",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  transition: "color 0.2s",
                }}
                onMouseOver={(e) => (e.currentTarget.style.color = "#F59E0B")}
                onMouseOut={(e) => (e.currentTarget.style.color = "#64748B")}
              >
                <span>Root Operator Break-Glass Console</span>
                <span>→</span>
              </button>
            </div>
          </div>
        ) : (
          /* ============================================================== */
          /* ROOT OPERATOR EMERGENCY BREAK-GLASS VIEW */
          /* ============================================================== */
          <div>
            {/* Header */}
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div
                style={{
                  width: "48px",
                  height: "48px",
                  borderRadius: "14px",
                  background: "rgba(245, 158, 11, 0.15)",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  margin: "0 auto 0.85rem auto",
                  display: "grid",
                  placeItems: "center",
                  color: "#F59E0B",
                  boxShadow: "0 0 20px rgba(245, 158, 11, 0.25)",
                }}
              >
                <ShieldAlert size={26} />
              </div>
              <div
                style={{
                  fontSize: "0.68rem",
                  background: "rgba(245, 158, 11, 0.2)",
                  color: "#FCD34D",
                  border: "1px solid rgba(245, 158, 11, 0.4)",
                  padding: "2px 8px",
                  borderRadius: "5px",
                  fontWeight: 800,
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  display: "inline-block",
                  marginBottom: "0.5rem",
                }}
              >
                Root Break-Glass Console
              </div>
              <h2 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.35rem 0" }}>
                Emergency Operator Login
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "0.8rem", margin: 0 }}>
                Direct cryptographic passphrase authentication for root administrative recovery.
              </p>
            </div>

            {error && (
              <div
                style={{
                  background: "rgba(239, 68, 68, 0.15)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "10px",
                  padding: "0.75rem",
                  color: "#FCA5A5",
                  fontSize: "0.82rem",
                  marginBottom: "1rem",
                }}
              >
                {error}
              </div>
            )}

            <form onSubmit={handleEmergencySubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.76rem",
                    color: "#CBD5E1",
                    fontWeight: 600,
                    marginBottom: "0.3rem",
                  }}
                >
                  Root Administrator Email
                </label>
                <div style={{ position: "relative" }}>
                  <Mail
                    size={15}
                    color="#64748B"
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                  />
                  <input
                    type="email"
                    placeholder="admin@exultia.tech"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.75rem 0.7rem 2.3rem",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "0.86rem",
                      outline: "none",
                    }}
                  />
                </div>
              </div>

              <div>
                <label
                  style={{
                    display: "block",
                    fontSize: "0.76rem",
                    color: "#CBD5E1",
                    fontWeight: 600,
                    marginBottom: "0.3rem",
                  }}
                >
                  Master Passphrase
                </label>
                <div style={{ position: "relative" }}>
                  <Lock
                    size={15}
                    color="#64748B"
                    style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                  />
                  <input
                    type="password"
                    placeholder="••••••••••••••••••••"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.75rem 0.7rem 2.3rem",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "0.86rem",
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
                  padding: "0.8rem",
                  fontSize: "0.9rem",
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

            <div
              style={{
                textAlign: "center",
                marginTop: "1.25rem",
                paddingTop: "0.75rem",
                borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              }}
            >
              <button
                type="button"
                onClick={() => {
                  setShowEmergencyLogin(false);
                  setError(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#94A3B8",
                  fontSize: "0.78rem",
                  cursor: "pointer",
                }}
              >
                ← Return to Single Sign-On
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
