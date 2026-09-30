"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, User as UserIcon, X, ShieldCheck, KeyRound, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, register } = useAuth();
  
  const [mode, setMode] = useState<"login" | "register">(authModalMode || "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [inviteCode, setInviteCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === "login") {
        const res = await login(email, password);
        if (!res.success) {
          setError(res.error || "Failed to sign in");
        }
      } else {
        const res = await register(name, email, password);
        if (!res.success) {
          setError(res.error || "Registration is currently invite-only.");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setError(null);
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "rgba(3, 7, 18, 0.88)",
      backdropFilter: "blur(10px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div style={{
        background: "linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 26, 0.98) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.35)",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "460px",
        padding: "2.25rem 2rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 35px rgba(59, 130, 246, 0.15)",
        position: "relative"
      }} className="fade-in">
        
        {/* Close Button */}
        <button 
          onClick={closeAuthModal}
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
            placeItems: "center"
          }}
        >
          <X size={18} />
        </button>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
            margin: "0 auto 0.85rem auto",
            display: "grid",
            placeItems: "center",
            color: "white",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
          }}>
            <ShieldCheck size={26} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.3rem" }}>
            {mode === "login" ? "Exultia Portal Access" : "Private Preview Registration"}
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: 0 }}>
            {mode === "login" 
              ? "Sign in to manage your workstation builds, Vantage feeds, and Inquest cases" 
              : "Access to developer security and intelligence services is currently invite-only"}
          </p>
        </div>

        {/* Quick Fill Dev Preset Accounts */}
        {mode === "login" && (
          <div style={{
            background: "rgba(30, 41, 59, 0.6)",
            border: "1px dashed rgba(59, 130, 246, 0.4)",
            borderRadius: "12px",
            padding: "0.75rem",
            marginBottom: "1.25rem"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.5rem" }}>
              <Sparkles size={13} color="#60A5FA" />
              <span style={{ fontSize: "0.72rem", color: "#93C5FD", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                Preview Test Accounts
              </span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
              <button
                type="button"
                onClick={() => handleQuickFill("admin@exultia.tech", "exultia2026")}
                style={{
                  background: email === "admin@exultia.tech" ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "8px",
                  padding: "6px 8px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "#FFFFFF"
                }}
              >
                <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "#93C5FD" }}>Admin (Full Suite)</div>
                <div style={{ fontSize: "0.68rem", color: "#64748B" }}>Enterprise Tiers</div>
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill("developer@exultia.tech", "exultia2026")}
                style={{
                  background: email === "developer@exultia.tech" ? "rgba(139, 92, 246, 0.25)" : "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(139, 92, 246, 0.3)",
                  borderRadius: "8px",
                  padding: "6px 8px",
                  textAlign: "left",
                  cursor: "pointer",
                  color: "#FFFFFF"
                }}
              >
                <div style={{ fontSize: "0.76rem", fontWeight: 700, color: "#C084FC" }}>Developer (Free)</div>
                <div style={{ fontSize: "0.68rem", color: "#64748B" }}>Community Tier</div>
              </button>
            </div>
          </div>
        )}

        {/* Notice for Registration Mode */}
        {mode === "register" && (
          <div style={{
            background: "rgba(234, 179, 8, 0.1)",
            border: "1px solid rgba(234, 179, 8, 0.3)",
            borderRadius: "10px",
            padding: "0.75rem 0.9rem",
            marginBottom: "1.25rem",
            display: "flex",
            alignItems: "flex-start",
            gap: "8px"
          }}>
            <AlertCircle size={16} color="#FACC15" style={{ flexShrink: 0, marginTop: "2px" }} />
            <div style={{ fontSize: "0.78rem", color: "#FEF08A", lineHeight: 1.4 }}>
              <strong>Public registration is closed.</strong> If you were granted preview access, enter your invite code or sign in with your pre-provisioned developer credentials.
            </div>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div style={{
            background: "rgba(239, 68, 68, 0.12)",
            border: "1px solid rgba(239, 68, 68, 0.3)",
            borderRadius: "10px",
            padding: "0.75rem 1rem",
            color: "#FCA5A5",
            fontSize: "0.85rem",
            marginBottom: "1.25rem",
            lineHeight: 1.4
          }}>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {mode === "register" && (
            <>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Full Name / Organization
                </label>
                <div style={{ position: "relative" }}>
                  <UserIcon size={16} color="#64748B" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                  <input 
                    type="text"
                    placeholder="Jane Doe"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.75rem 0.7rem 2.4rem",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "0.88rem",
                      outline: "none"
                    }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Preview Invite Code
                </label>
                <div style={{ position: "relative" }}>
                  <KeyRound size={16} color="#64748B" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
                  <input 
                    type="text"
                    placeholder="e.g. EXULTIA_DEV_2026"
                    value={inviteCode}
                    onChange={e => setInviteCode(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.7rem 0.75rem 0.7rem 2.4rem",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "0.88rem",
                      outline: "none",
                      textTransform: "uppercase"
                    }}
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.35rem" }}>
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail size={16} color="#64748B" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.7rem 0.75rem 0.7rem 2.4rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.88rem",
                  outline: "none"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.35rem" }}>
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock size={16} color="#64748B" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
              <input 
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                minLength={6}
                style={{
                  width: "100%",
                  padding: "0.7rem 0.75rem 0.7rem 2.4rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.88rem",
                  outline: "none"
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
              fontWeight: 700,
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}
          >
            {loading ? "Authenticating..." : (mode === "login" ? "Sign In →" : "Submit Request →")}
          </button>
        </form>

        {/* Mode Toggle */}
        <div style={{ textAlign: "center", marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
          {mode === "login" ? (
            <p style={{ fontSize: "0.82rem", color: "#94A3B8", margin: 0 }}>
              Need an account?{" "}
              <button 
                onClick={() => { setMode("register"); setError(null); }}
                style={{ background: "none", border: "none", color: "#60A5FA", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >
                Request Invite
              </button>
            </p>
          ) : (
            <p style={{ fontSize: "0.82rem", color: "#94A3B8", margin: 0 }}>
              Have an account or preview key?{" "}
              <button 
                onClick={() => { setMode("login"); setError(null); }}
                style={{ background: "none", border: "none", color: "#60A5FA", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >
                Sign in
              </button>
            </p>
          )}
        </div>

      </div>
    </div>
  );
}
