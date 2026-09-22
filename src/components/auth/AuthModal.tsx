"use client";

import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, User as UserIcon, X, ArrowRight, ShieldCheck, CheckCircle2 } from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, openAuthModal, login, register } = useAuth();
  
  const [mode, setMode] = useState<"login" | "register">(authModalMode || "login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
          setError(res.error || "Failed to create account");
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
      background: "rgba(3, 7, 18, 0.85)",
      backdropFilter: "blur(8px)",
      zIndex: 9999,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "1rem"
    }}>
      <div style={{
        background: "linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 26, 0.98) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.3)",
        borderRadius: "20px",
        width: "100%",
        maxWidth: "440px",
        padding: "2.5rem 2rem",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 30px rgba(59, 130, 246, 0.15)",
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
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: "48px",
            height: "48px",
            borderRadius: "14px",
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
            margin: "0 auto 1rem auto",
            display: "grid",
            placeItems: "center",
            color: "white",
            boxShadow: "0 0 20px rgba(59, 130, 246, 0.4)"
          }}>
            <ShieldCheck size={26} />
          </div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.4rem" }}>
            {mode === "login" ? "Welcome Back" : "Create Exultia Account"}
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: 0 }}>
            {mode === "login" 
              ? "Access your workstation builds and Inquest cases" 
              : "Zero-telemetry developer security & public records platform"}
          </p>
        </div>

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
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {mode === "register" && (
            <div>
              <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.4rem" }}>
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
                    padding: "0.75rem 0.75rem 0.75rem 2.4rem",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>
            </div>
          )}

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.4rem" }}>
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
                  padding: "0.75rem 0.75rem 0.75rem 2.4rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.9rem",
                  outline: "none"
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: "block", fontSize: "0.8rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.4rem" }}>
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
                  padding: "0.75rem 0.75rem 0.75rem 2.4rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  color: "white",
                  fontSize: "0.9rem",
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
              fontSize: "0.95rem",
              fontWeight: 700,
              marginTop: "0.5rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem"
            }}
          >
            {loading ? "Authenticating..." : (mode === "login" ? "Sign In →" : "Create Account →")}
          </button>
        </form>

        {/* Mode Toggle */}
        <div style={{ textAlign: "center", marginTop: "1.5rem", paddingTop: "1.25rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
          {mode === "login" ? (
            <p style={{ fontSize: "0.85rem", color: "#94A3B8", margin: 0 }}>
              Don&apos;t have an account?{" "}
              <button 
                onClick={() => { setMode("register"); setError(null); }}
                style={{ background: "none", border: "none", color: "#60A5FA", fontWeight: 700, cursor: "pointer", textDecoration: "underline" }}
              >
                Sign up
              </button>
            </p>
          ) : (
            <p style={{ fontSize: "0.85rem", color: "#94A3B8", margin: 0 }}>
              Already have an account?{" "}
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
