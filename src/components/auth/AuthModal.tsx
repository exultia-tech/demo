"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Lock, Mail, User as UserIcon, X, ShieldCheck, ArrowRight, AlertTriangle, Loader2 } from "lucide-react";

export default function AuthModal() {
  const { isAuthModalOpen, authModalMode, closeAuthModal, login, register } = useAuth();

  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick SSO prompt state if email isn't typed yet
  const [ssoPromptProvider, setSsoPromptProvider] = useState<string | null>(null);
  const [ssoInputEmail, setSsoInputEmail] = useState("");

  // Sync mode with trigger (e.g. clicking "Get Started" opens register, "Sign In" opens login)
  useEffect(() => {
    if (isAuthModalOpen) {
      setMode(authModalMode || "login");
      setError(null);
      setSsoPromptProvider(null);
    }
  }, [isAuthModalOpen, authModalMode]);

  if (!isAuthModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    if (!cleanEmail) {
      setError("Please enter your email address.");
      return;
    }

    if (!password) {
      setError("Please enter a password.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (mode === "register" && password !== confirmPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "register") {
        const res = await register(name.trim(), cleanEmail, password);
        if (!res.success) {
          setError(res.error || "Failed to create account. Please try again.");
        } else {
          closeAuthModal();
        }
      } else {
        const res = await login(cleanEmail, password);
        if (!res.success) {
          setError(res.error || "Invalid email or password.");
        } else {
          closeAuthModal();
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handleSSO = (provider: string) => {
    setError(null);
    const cleanEmail = email.trim() || ssoInputEmail.trim();
    const cleanName = name.trim();

    if (cleanEmail) {
      const query = `?email=${encodeURIComponent(cleanEmail)}${cleanName ? `&name=${encodeURIComponent(cleanName)}` : ''}`;
      window.location.href = `/api/auth/oauth/${provider}${query}`;
      return;
    }

    // If no email entered yet, reveal the quick inline email input for SSO
    setSsoPromptProvider(provider);
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
          background: "linear-gradient(180deg, rgba(15, 23, 42, 0.98) 0%, rgba(10, 15, 26, 0.98) 100%)",
          border: "1px solid rgba(59, 130, 246, 0.35)",
          borderRadius: "22px",
          width: "100%",
          maxWidth: "470px",
          padding: "2.25rem 2rem",
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.95), 0 0 35px rgba(59, 130, 246, 0.18)",
          position: "relative",
          maxHeight: "92vh",
          overflowY: "auto",
        }}
        className="fade-in"
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setError(null);
            setSsoPromptProvider(null);
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

        {/* Brand Header */}
        <div style={{ textAlign: "center", marginBottom: "1.35rem" }}>
          <div
            style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
              margin: "0 auto 0.75rem auto",
              display: "grid",
              placeItems: "center",
              color: "white",
              boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)",
            }}
          >
            <ShieldCheck size={26} />
          </div>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.25rem 0" }}>
            {mode === "register" ? "Create Your Exultia Account" : "Sign In to Exultia"}
          </h2>
          <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: 0, lineHeight: 1.4 }}>
            Workstation security, threat intelligence & open records tools.
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div
          style={{
            display: "flex",
            background: "rgba(255, 255, 255, 0.05)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "4px",
            marginBottom: "1.25rem",
          }}
        >
          <button
            type="button"
            onClick={() => {
              setMode("login");
              setError(null);
            }}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: "9px",
              border: "none",
              fontSize: "0.84rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: mode === "login" ? "rgba(59, 130, 246, 0.85)" : "transparent",
              color: mode === "login" ? "#FFFFFF" : "#94A3B8",
              boxShadow: mode === "login" ? "0 2px 8px rgba(59, 130, 246, 0.3)" : "none",
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setMode("register");
              setError(null);
            }}
            style={{
              flex: 1,
              padding: "8px 0",
              borderRadius: "9px",
              border: "none",
              fontSize: "0.84rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.2s ease",
              background: mode === "register" ? "rgba(59, 130, 246, 0.85)" : "transparent",
              color: mode === "register" ? "#FFFFFF" : "#94A3B8",
              boxShadow: mode === "register" ? "0 2px 8px rgba(59, 130, 246, 0.3)" : "none",
            }}
          >
            Create Account
          </button>
        </div>

        {/* Error Notification */}
        {error && (
          <div
            style={{
              background: "rgba(239, 68, 68, 0.15)",
              border: "1px solid rgba(239, 68, 68, 0.35)",
              borderRadius: "10px",
              padding: "0.7rem 0.85rem",
              color: "#FCA5A5",
              fontSize: "0.82rem",
              marginBottom: "1.15rem",
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

        {/* PRIMARY SSO ACTION: Google */}
        <button
          type="button"
          onClick={() => handleSSO("google")}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            width: "100%",
            padding: "0.82rem 1.25rem",
            background: "rgba(255, 255, 255, 0.06)",
            border: "1px solid rgba(255, 255, 255, 0.18)",
            borderRadius: "12px",
            color: "#FFFFFF",
            fontSize: "0.92rem",
            fontWeight: 700,
            cursor: "pointer",
            transition: "all 0.2s ease",
            marginBottom: "0.75rem",
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.background = "rgba(66, 133, 244, 0.16)";
            e.currentTarget.style.borderColor = "#4285F4";
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.background = "rgba(255, 255, 255, 0.06)";
            e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.18)";
          }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" style={{ flexShrink: 0 }}>
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
          <span>{mode === "register" ? "Sign up with Google" : "Sign in with Google"}</span>
        </button>

        {/* SECONDARY SSO ACTIONS: GitHub & Microsoft */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1.25rem" }}>
          <button
            type="button"
            onClick={() => handleSSO("github")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "0.6rem",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "10px",
              color: "#FFFFFF",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
            </svg>
            <span>GitHub</span>
          </button>
          <button
            type="button"
            onClick={() => handleSSO("microsoft")}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "0.6rem",
              background: "rgba(255, 255, 255, 0.04)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "10px",
              color: "#FFFFFF",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            <svg width="15" height="15" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#F25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
              <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
            </svg>
            <span>Microsoft</span>
          </button>
        </div>

        {/* INLINE SSO PROMPT (if user clicked SSO without email) */}
        {ssoPromptProvider && (
          <div
            style={{
              background: "rgba(59, 130, 246, 0.12)",
              border: "1px solid rgba(59, 130, 246, 0.35)",
              borderRadius: "12px",
              padding: "1rem",
              marginBottom: "1.25rem",
            }}
          >
            <p style={{ margin: "0 0 0.5rem 0", fontSize: "0.82rem", color: "#93C5FD", fontWeight: 600 }}>
              Enter your {ssoPromptProvider === "google" ? "Google / Gmail" : ssoPromptProvider} address to continue:
            </p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input
                type="email"
                placeholder="yourname@gmail.com"
                value={ssoInputEmail}
                onChange={(e) => setSsoInputEmail(e.target.value)}
                autoFocus
                style={{
                  flex: 1,
                  padding: "0.55rem 0.75rem",
                  borderRadius: "8px",
                  background: "rgba(255, 255, 255, 0.08)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontSize: "0.85rem",
                  outline: "none",
                }}
              />
              <button
                type="button"
                onClick={() => handleSSO(ssoPromptProvider)}
                style={{
                  padding: "0.55rem 0.9rem",
                  background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Continue →
              </button>
            </div>
          </div>
        )}

        {/* DIVIDER */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            margin: "0 0 1.25rem 0",
            color: "#64748B",
            fontSize: "0.72rem",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.08)" }} />
          <span>{mode === "register" ? "or register with password" : "or sign in with password"}</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255, 255, 255, 0.08)" }} />
        </div>

        {/* Direct Authentication Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
          {mode === "register" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  color: "#CBD5E1",
                  fontWeight: 600,
                  marginBottom: "0.3rem",
                }}
              >
                Full Name (Optional)
              </label>
              <div style={{ position: "relative" }}>
                <UserIcon
                  size={15}
                  color="#64748B"
                  style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                />
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.68rem 0.75rem 0.68rem 2.3rem",
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
          )}

          <div>
            <label
              style={{
                display: "block",
                fontSize: "0.75rem",
                color: "#CBD5E1",
                fontWeight: 600,
                marginBottom: "0.3rem",
              }}
            >
              Email Address
            </label>
            <div style={{ position: "relative" }}>
              <Mail
                size={15}
                color="#64748B"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.68rem 0.75rem 0.68rem 2.3rem",
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
                fontSize: "0.75rem",
                color: "#CBD5E1",
                fontWeight: 600,
                marginBottom: "0.3rem",
              }}
            >
              Password
            </label>
            <div style={{ position: "relative" }}>
              <Lock
                size={15}
                color="#64748B"
                style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
              />
              <input
                type="password"
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: "100%",
                  padding: "0.68rem 0.75rem 0.68rem 2.3rem",
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

          {mode === "register" && (
            <div>
              <label
                style={{
                  display: "block",
                  fontSize: "0.75rem",
                  color: "#CBD5E1",
                  fontWeight: 600,
                  marginBottom: "0.3rem",
                }}
              >
                Confirm Password
              </label>
              <div style={{ position: "relative" }}>
                <Lock
                  size={15}
                  color="#64748B"
                  style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }}
                />
                <input
                  type="password"
                  placeholder="••••••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.68rem 0.75rem 0.68rem 2.3rem",
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
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "0.78rem",
              fontSize: "0.9rem",
              fontWeight: 800,
              marginTop: "0.4rem",
              background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
              color: "#FFFFFF",
              border: "none",
              borderRadius: "10px",
              cursor: loading ? "not-allowed" : "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              boxShadow: "0 4px 14px rgba(37, 99, 235, 0.35)",
              transition: "opacity 0.2s",
            }}
          >
            {loading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>{mode === "register" ? "Creating Account..." : "Signing In..."}</span>
              </>
            ) : (
              <span>{mode === "register" ? "Create Account with Password →" : "Sign In with Password →"}</span>
            )}
          </button>
        </form>

        {/* Switch mode link */}
        <div style={{ textAlign: "center", marginTop: "1.25rem", color: "#94A3B8", fontSize: "0.8rem" }}>
          {mode === "login" ? (
            <span>
              Don&apos;t have an account?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("register");
                  setError(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#60A5FA",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Create one now
              </button>
            </span>
          ) : (
            <span>
              Already registered?{" "}
              <button
                type="button"
                onClick={() => {
                  setMode("login");
                  setError(null);
                }}
                style={{
                  background: "none",
                  border: "none",
                  color: "#60A5FA",
                  fontWeight: 700,
                  cursor: "pointer",
                  padding: 0,
                }}
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
