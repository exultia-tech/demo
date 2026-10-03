"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, User as UserIcon, X, ShieldCheck, KeyRound, AlertCircle, CheckCircle2 } from "lucide-react";

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
            {mode === "login" ? "Exultia Portal Access" : "Create Exultia Account"}
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: 0 }}>
            {mode === "login" 
              ? "Sign in with your corporate SSO, GitHub, or developer credentials" 
              : "Register instantly with your enterprise Microsoft 365, Google, or GitHub account"}
          </p>
        </div>

        {/* Enterprise & Social SSO Buttons */}
        <div style={{ display: "flex", flexDirection: "column", gap: "0.55rem", marginBottom: "1.25rem" }}>
          
          {/* Microsoft 365 / Entra ID */}
          <button
            type="button"
            onClick={() => window.location.href = '/api/auth/oauth/microsoft'}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              width: "100%",
              padding: "0.65rem 1rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "10px",
              color: "#FFFFFF",
              fontSize: "0.88rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "rgba(0, 164, 239, 0.15)"; e.currentTarget.style.borderColor = "#00A4EF"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#F25022"/>
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00"/>
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF"/>
              <rect x="11" y="11" width="9" height="9" fill="#FFB900"/>
            </svg>
            <span>{mode === "login" ? "Sign in with Microsoft 365 / Entra" : "Sign up with Microsoft 365 / Entra"}</span>
          </button>

          {/* Google */}
          <button
            type="button"
            onClick={() => window.location.href = '/api/auth/oauth/google'}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              width: "100%",
              padding: "0.65rem 1rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "10px",
              color: "#FFFFFF",
              fontSize: "0.88rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "rgba(66, 133, 244, 0.15)"; e.currentTarget.style.borderColor = "#4285F4"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
            </svg>
            <span>{mode === "login" ? "Sign in with Google" : "Sign up with Google"}</span>
          </button>

          {/* GitHub */}
          <button
            type="button"
            onClick={() => window.location.href = '/api/auth/oauth/github'}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.75rem",
              width: "100%",
              padding: "0.65rem 1rem",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              borderRadius: "10px",
              color: "#FFFFFF",
              fontSize: "0.88rem",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.12)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.4)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "rgba(255, 255, 255, 0.05)"; e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.15)"; }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
            </svg>
            <span>{mode === "login" ? "Sign in with GitHub" : "Sign up with GitHub"}</span>
          </button>
        </div>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", margin: "1.25rem 0", gap: "0.75rem" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.1)" }} />
          <span style={{ fontSize: "0.72rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Or continue with email
          </span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.1)" }} />
        </div>


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
                type="text"
                placeholder="Email or Username"
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
