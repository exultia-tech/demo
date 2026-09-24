"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  User as UserIcon, 
  Shield, 
  KeyRound, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  Trash2, 
  Plus, 
  Sparkles, 
  Layers, 
  ExternalLink, 
  RefreshCw,
  Clock,
  Terminal,
  FileText,
  Cpu
} from "lucide-react";
import { ExultiaLogo, PureIdeIcon, UviIcon, InquestIcon } from "@/components/BrandIcons";

interface ApiTokenItem {
  id: string;
  name: string;
  tokenPrefix: string;
  scopes: string[];
  lastUsedAt: string | null;
  expiresAt: string | null;
  createdAt: string;
}

interface SubscriptionItem {
  id: string;
  product: string;
  tier: string;
  status: string;
  currentPeriodEnd: string | null;
  createdAt: string | null;
}

function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, loading: authLoading, openAuthModal, refreshUser } = useAuth();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<"profile" | "subscriptions" | "tokens" | "security">(
    (tabParam as any) || "profile"
  );

  // Profile Form State
  const [name, setName] = useState("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  // Subscriptions State
  const [subscriptions, setSubscriptions] = useState<SubscriptionItem[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);
  const [updatingSubProduct, setUpdatingSubProduct] = useState<string | null>(null);

  // Tokens State
  const [tokens, setTokens] = useState<ApiTokenItem[]>([]);
  const [loadingTokens, setLoadingTokens] = useState(false);
  const [showNewTokenModal, setShowNewTokenModal] = useState(false);
  const [newTokenName, setNewTokenName] = useState("");
  const [newTokenScopes, setNewTokenScopes] = useState<string[]>(["read:threats", "read:stats"]);
  const [newTokenExpiry, setNewTokenExpiry] = useState("90");
  const [createdPlainToken, setCreatedPlainToken] = useState<string | null>(null);
  const [tokenCopied, setTokenCopied] = useState(false);
  const [isCreatingToken, setIsCreatingToken] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Stats State
  const [stats, setStats] = useState({
    activeSubscriptionsCount: 0,
    apiTokensCount: 0,
    casesCount: 0,
    workstationsCount: 0,
  });

  useEffect(() => {
    if (tabParam && ["profile", "subscriptions", "tokens", "security"].includes(tabParam)) {
      setActiveTab(tabParam as any);
    }
  }, [tabParam]);

  useEffect(() => {
    if (!authLoading && !user) {
      openAuthModal("login");
    } else if (user) {
      setName(user.name || "");
      loadProfileData();
      loadTokens();
      loadSubscriptions();
    }
  }, [user, authLoading]);

  const loadProfileData = async () => {
    try {
      const res = await fetch("/api/user/profile");
      const data = await res.json();
      if (data.success && data.profile) {
        if (data.profile.stats) setStats(data.profile.stats);
        if (data.profile.subscriptions) setSubscriptions(data.profile.subscriptions);
      }
    } catch (e) {
      console.error("Failed to load profile details:", e);
    }
  };

  const loadTokens = async () => {
    setLoadingTokens(true);
    try {
      const res = await fetch("/api/user/tokens");
      const data = await res.json();
      if (data.success && Array.isArray(data.tokens)) {
        setTokens(data.tokens);
      }
    } catch (e) {
      console.error("Failed to fetch tokens:", e);
    } finally {
      setLoadingTokens(false);
    }
  };

  const loadSubscriptions = async () => {
    setLoadingSubs(true);
    try {
      const res = await fetch("/api/user/subscription");
      const data = await res.json();
      if (data.success && Array.isArray(data.subscriptions)) {
        setSubscriptions(data.subscriptions);
      }
    } catch (e) {
      console.error("Failed to fetch subscriptions:", e);
    } finally {
      setLoadingSubs(false);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdatingProfile(true);
    setProfileSuccess(null);
    setProfileError(null);

    try {
      const res = await fetch("/api/user/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update profile");
      setProfileSuccess("Profile details saved successfully.");
      await refreshUser();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setProfileError(msg);
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleCreateToken = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTokenName.trim()) return;
    setIsCreatingToken(true);

    try {
      const res = await fetch("/api/user/tokens", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTokenName,
          scopes: newTokenScopes,
          expiryDays: newTokenExpiry,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate token");
      setCreatedPlainToken(data.token.rawToken);
      setNewTokenName("");
      loadTokens();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to create token");
    } finally {
      setIsCreatingToken(false);
    }
  };

  const handleRevokeToken = async (tokenId: string) => {
    if (!confirm("Are you sure you want to revoke this API token? Any integrations using it will immediately lose access.")) return;
    try {
      const res = await fetch(`/api/user/tokens?id=${tokenId}`, { method: "DELETE" });
      if (res.ok) {
        setTokens(prev => prev.filter(t => t.id !== tokenId));
      }
    } catch (e) {
      console.error("Failed to revoke token:", e);
    }
  };

  const handleQuickTierSwitch = async (product: string, tier: string) => {
    setUpdatingSubProduct(product);
    try {
      const res = await fetch("/api/user/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, tier, billingCycle: "annual" }),
      });
      const data = await res.json();
      if (res.ok) {
        await refreshUser();
        loadSubscriptions();
      } else {
        alert(data.error || "Failed to update subscription");
      }
    } catch (e) {
      console.error("Subscription update error:", e);
    } finally {
      setUpdatingSubProduct(null);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordSuccess(null);
    setPasswordError(null);

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    setIsChangingPassword(true);
    try {
      const res = await fetch("/api/user/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update password");
      setPasswordSuccess("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setPasswordError(msg);
    } finally {
      setIsChangingPassword(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setTokenCopied(true);
    setTimeout(() => setTokenCopied(false), 2000);
  };

  const toggleScope = (scope: string) => {
    if (newTokenScopes.includes(scope)) {
      setNewTokenScopes(newTokenScopes.filter(s => s !== scope));
    } else {
      setNewTokenScopes([...newTokenScopes, scope]);
    }
  };

  if (authLoading || !user) {
    return (
      <div style={{ minHeight: "75vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(59, 130, 246, 0.2)", borderTopColor: "#3B82F6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#94A3B8", fontSize: "0.9rem" }}>Loading account details...</p>
      </div>
    );
  }

  const getSubTier = (prod: string) => {
    const s = subscriptions.find(sub => sub.product === prod);
    return s ? s.tier : "free";
  };

  return (
    <div style={{ minHeight: "90vh", padding: "2.5rem 1.5rem", maxWidth: "1200px", margin: "0 auto" }}>
      
      {/* Top Banner / Account Header */}
      <div style={{
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)",
        border: "1px solid rgba(59, 130, 246, 0.25)",
        borderRadius: "20px",
        padding: "2rem",
        marginBottom: "2rem",
        display: "flex",
        flexWrap: "wrap",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "1.5rem",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "18px",
            background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
            display: "grid",
            placeItems: "center",
            fontSize: "1.75rem",
            color: "white",
            fontWeight: 800,
            boxShadow: "0 0 25px rgba(59, 130, 246, 0.4)"
          }}>
            {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
          </div>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#FFFFFF", margin: 0, letterSpacing: "-0.02em" }}>
                {user.name || "Developer Account"}
              </h1>
              <span style={{
                fontSize: "0.72rem",
                background: user.role === "admin" ? "rgba(245, 158, 11, 0.2)" : "rgba(59, 130, 246, 0.2)",
                color: user.role === "admin" ? "#FCD34D" : "#93C5FD",
                border: user.role === "admin" ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid rgba(59, 130, 246, 0.4)",
                padding: "2px 8px",
                borderRadius: "6px",
                fontWeight: 800,
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}>
                {user.role}
              </span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.9rem", margin: "4px 0 0 0" }}>
              {user.email} • ID: <span style={{ fontFamily: "monospace", color: "#64748B" }}>{user.id}</span>
            </p>
          </div>
        </div>

        {/* Quick Stats Chips */}
        <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
          <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "0.75rem 1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#60A5FA" }}>{stats.activeSubscriptionsCount || subscriptions.filter(s => s.status === "active").length}</div>
            <div style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 600 }}>Active Plans</div>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "0.75rem 1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#A78BFA" }}>{tokens.length}</div>
            <div style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 600 }}>API Tokens</div>
          </div>
          <div style={{ background: "rgba(255, 255, 255, 0.04)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "0.75rem 1.25rem", textAlign: "center" }}>
            <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#34D399" }}>Secure</div>
            <div style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 600 }}>Zero Telemetry</div>
          </div>
        </div>
      </div>

      {/* Interactive Tabs Navigation */}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
        marginBottom: "2rem",
        overflowX: "auto",
        paddingBottom: "2px"
      }}>
        <button
          onClick={() => setActiveTab("profile")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0.85rem 1.25rem",
            background: activeTab === "profile" ? "rgba(59, 130, 246, 0.15)" : "transparent",
            border: "none",
            borderBottom: activeTab === "profile" ? "2px solid #3B82F6" : "2px solid transparent",
            color: activeTab === "profile" ? "#FFFFFF" : "#94A3B8",
            fontWeight: activeTab === "profile" ? 700 : 500,
            fontSize: "0.92rem",
            cursor: "pointer",
            borderRadius: "8px 8px 0 0",
            transition: "all 0.2s ease"
          }}
        >
          <UserIcon size={16} color={activeTab === "profile" ? "#60A5FA" : "#94A3B8"} />
          Profile & Identity
        </button>

        <button
          onClick={() => setActiveTab("subscriptions")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0.85rem 1.25rem",
            background: activeTab === "subscriptions" ? "rgba(139, 92, 246, 0.15)" : "transparent",
            border: "none",
            borderBottom: activeTab === "subscriptions" ? "2px solid #8B5CF6" : "2px solid transparent",
            color: activeTab === "subscriptions" ? "#FFFFFF" : "#94A3B8",
            fontWeight: activeTab === "subscriptions" ? 700 : 500,
            fontSize: "0.92rem",
            cursor: "pointer",
            borderRadius: "8px 8px 0 0",
            transition: "all 0.2s ease"
          }}
        >
          <Shield size={16} color={activeTab === "subscriptions" ? "#C084FC" : "#94A3B8"} />
          Subscriptions & Entitlements
        </button>

        <button
          onClick={() => setActiveTab("tokens")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0.85rem 1.25rem",
            background: activeTab === "tokens" ? "rgba(6, 182, 212, 0.15)" : "transparent",
            border: "none",
            borderBottom: activeTab === "tokens" ? "2px solid #06B6D4" : "2px solid transparent",
            color: activeTab === "tokens" ? "#FFFFFF" : "#94A3B8",
            fontWeight: activeTab === "tokens" ? 700 : 500,
            fontSize: "0.92rem",
            cursor: "pointer",
            borderRadius: "8px 8px 0 0",
            transition: "all 0.2s ease"
          }}
        >
          <KeyRound size={16} color={activeTab === "tokens" ? "#67E8F9" : "#94A3B8"} />
          Personal Access Tokens ({tokens.length})
        </button>

        <button
          onClick={() => setActiveTab("security")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "0.85rem 1.25rem",
            background: activeTab === "security" ? "rgba(244, 63, 94, 0.15)" : "transparent",
            border: "none",
            borderBottom: activeTab === "security" ? "2px solid #F43F5E" : "2px solid transparent",
            color: activeTab === "security" ? "#FFFFFF" : "#94A3B8",
            fontWeight: activeTab === "security" ? 700 : 500,
            fontSize: "0.92rem",
            cursor: "pointer",
            borderRadius: "8px 8px 0 0",
            transition: "all 0.2s ease"
          }}
        >
          <Lock size={16} color={activeTab === "security" ? "#FB7185" : "#94A3B8"} />
          Security & Password
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: PROFILE & IDENTITY */}
      {/* ========================================================================= */}
      {activeTab === "profile" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          <div style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "1.75rem"
          }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <UserIcon size={18} color="#60A5FA" />
              Personal Profile
            </h3>

            {profileSuccess && (
              <div style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "10px", padding: "0.75rem 1rem", color: "#86EFAC", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                {profileSuccess}
              </div>
            )}

            {profileError && (
              <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", padding: "0.75rem 1rem", color: "#FCA5A5", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                {profileError}
              </div>
            )}

            <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Display Name / Organization
                </label>
                <input 
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="e.g. Lead Security Architect"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Email Address (Primary Identity)
                </label>
                <input 
                  type="email"
                  value={user.email}
                  disabled
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "rgba(255, 255, 255, 0.02)",
                    border: "1px solid rgba(255, 255, 255, 0.06)",
                    borderRadius: "10px",
                    color: "#64748B",
                    fontSize: "0.9rem",
                    cursor: "not-allowed"
                  }}
                />
                <span style={{ fontSize: "0.72rem", color: "#64748B", marginTop: "4px", display: "block" }}>
                  Email changes require security verification with support.
                </span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Account Role
                </label>
                <div style={{
                  padding: "0.75rem 1rem",
                  background: "rgba(255, 255, 255, 0.02)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                  borderRadius: "10px",
                  color: "#E2E8F0",
                  fontSize: "0.88rem",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <span>{user.role === "admin" ? "Platform Administrator" : "Developer (Standard Access)"}</span>
                  <span style={{ fontSize: "0.7rem", color: "#60A5FA", fontWeight: 700, textTransform: "uppercase" }}>
                    {user.role}
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="btn-primary"
                style={{
                  padding: "0.85rem",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  marginTop: "0.5rem"
                }}
              >
                {isUpdatingProfile ? "Saving Changes..." : "Save Profile Details"}
              </button>
            </form>
          </div>

          {/* Account Overview / Zero Telemetry Architecture Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "1.75rem"
            }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <Cpu size={18} color="#C084FC" />
                Workstation & Ecosystem Status
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#FFFFFF" }}>PureIDE Workstation Build</div>
                    <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Custom compiler sandboxes</div>
                  </div>
                  <Link href="/console" style={{ fontSize: "0.8rem", color: "#60A5FA", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                    Open Builder <ExternalLink size={12} />
                  </Link>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: "0.75rem", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#FFFFFF" }}>Universal Vulnerability Intel (UVI)</div>
                    <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>110+ aggregated intelligence feeds</div>
                  </div>
                  <Link href="/threat-feed" style={{ fontSize: "0.8rem", color: "#C084FC", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                    View Feed <ExternalLink size={12} />
                  </Link>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 600, color: "#FFFFFF" }}>Inquest FOIA Compliance Cases</div>
                    <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Statutory discovery & appeal builder</div>
                  </div>
                  <Link href="/inquest" style={{ fontSize: "0.8rem", color: "#67E8F9", textDecoration: "none", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                    Inquest App <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            </div>

            <div style={{
              background: "linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              border: "1px solid rgba(59, 130, 246, 0.25)",
              borderRadius: "16px",
              padding: "1.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "0.5rem" }}>
                <Sparkles size={16} color="#60A5FA" />
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#93C5FD", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  Zero-Telemetry Privacy Guarantee
                </span>
              </div>
              <p style={{ color: "#CBD5E1", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>
                Exultia builds compile with all outbound telemetry disabled at binary level. Your tokens, code repos, and legal filings are cryptographically isolated and never harvested.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: SUBSCRIPTIONS & ENTITLEMENTS */}
      {/* ========================================================================= */}
      {activeTab === "subscriptions" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                Product Subscriptions & Entitlements
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: "4px 0 0 0" }}>
                Manage your active subscription tiers and developer privileges across all 3 Exultia products.
              </p>
            </div>
            <Link
              href="/account/subscription"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                color: "white",
                padding: "8px 16px",
                borderRadius: "10px",
                fontSize: "0.85rem",
                fontWeight: 700,
                textDecoration: "none"
              }}
            >
              Full Plan Matrix →
            </Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}>
            
            {/* CARD 1: PUREIDE */}
            <div style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: getSubTier("pureide") !== "free" ? "1px solid rgba(59, 130, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "18px",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <PureIdeIcon size={36} />
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>PureIDE</h3>
                    <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Workstation Compiler</div>
                  </div>
                </div>
                <span style={{
                  fontSize: "0.7rem",
                  background: getSubTier("pureide") !== "free" ? "rgba(59, 130, 246, 0.25)" : "rgba(255, 255, 255, 0.08)",
                  color: getSubTier("pureide") !== "free" ? "#93C5FD" : "#94A3B8",
                  border: getSubTier("pureide") !== "free" ? "1px solid rgba(59, 130, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontWeight: 800,
                  textTransform: "uppercase"
                }}>
                  {getSubTier("pureide")}
                </span>
              </div>

              <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                Zero-trust developer environment compiler with automated telemetry stripping and airgap signing.
              </p>

              <div style={{ marginTop: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1rem", fontSize: "0.78rem", color: "#CBD5E1" }}>
                  <CheckCircle2 size={14} color="#60A5FA" />
                  <span>
                    {getSubTier("pureide") === "enterprise" ? "Hermetic Airgap Cosigning" : (getSubTier("pureide") === "pro" ? "Priority Cloud Builds" : "Community Build Triggers")}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleQuickTierSwitch("pureide", getSubTier("pureide") === "pro" ? "free" : "pro")}
                    disabled={updatingSubProduct === "pureide"}
                    style={{
                      padding: "8px",
                      background: getSubTier("pureide") === "pro" ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {getSubTier("pureide") === "pro" ? "Active (Pro)" : "Switch to Pro"}
                  </button>
                  <button
                    onClick={() => handleQuickTierSwitch("pureide", getSubTier("pureide") === "enterprise" ? "free" : "enterprise")}
                    disabled={updatingSubProduct === "pureide"}
                    style={{
                      padding: "8px",
                      background: getSubTier("pureide") === "enterprise" ? "rgba(139, 92, 246, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      borderRadius: "8px",
                      color: "#C084FC",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {getSubTier("pureide") === "enterprise" ? "Active (Enterprise)" : "Enterprise"}
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 2: UVI */}
            <div style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: getSubTier("uvi") !== "free" ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "18px",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <UviIcon size={36} />
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>UVI Feed</h3>
                    <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Threat Intelligence</div>
                  </div>
                </div>
                <span style={{
                  fontSize: "0.7rem",
                  background: getSubTier("uvi") !== "free" ? "rgba(139, 92, 246, 0.25)" : "rgba(255, 255, 255, 0.08)",
                  color: getSubTier("uvi") !== "free" ? "#C084FC" : "#94A3B8",
                  border: getSubTier("uvi") !== "free" ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontWeight: 800,
                  textTransform: "uppercase"
                }}>
                  {getSubTier("uvi")}
                </span>
              </div>

              <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                Universal vulnerability intelligence catalog aggregating CISA KEV, MSRC, OSV, GHSA, and zero-day disclosures.
              </p>

              <div style={{ marginTop: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1rem", fontSize: "0.78rem", color: "#CBD5E1" }}>
                  <CheckCircle2 size={14} color="#C084FC" />
                  <span>
                    {getSubTier("uvi") === "enterprise" ? "Streaming Webhooks & Raw Dumps" : (getSubTier("uvi") === "pro" ? "Realtime API & KEV Feeds" : "Web UI Feed Access")}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleQuickTierSwitch("uvi", getSubTier("uvi") === "pro" ? "free" : "pro")}
                    disabled={updatingSubProduct === "uvi"}
                    style={{
                      padding: "8px",
                      background: getSubTier("uvi") === "pro" ? "rgba(139, 92, 246, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {getSubTier("uvi") === "pro" ? "Active (Pro)" : "Switch to Pro"}
                  </button>
                  <button
                    onClick={() => handleQuickTierSwitch("uvi", getSubTier("uvi") === "enterprise" ? "free" : "enterprise")}
                    disabled={updatingSubProduct === "uvi"}
                    style={{
                      padding: "8px",
                      background: getSubTier("uvi") === "enterprise" ? "rgba(59, 130, 246, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(59, 130, 246, 0.3)",
                      borderRadius: "8px",
                      color: "#93C5FD",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {getSubTier("uvi") === "enterprise" ? "Active (Enterprise)" : "Enterprise"}
                  </button>
                </div>
              </div>
            </div>

            {/* CARD 3: INQUEST */}
            <div style={{
              background: "rgba(15, 23, 42, 0.7)",
              border: getSubTier("inquest") !== "free" ? "1px solid rgba(6, 182, 212, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "18px",
              padding: "1.75rem",
              display: "flex",
              flexDirection: "column",
              position: "relative"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <InquestIcon size={36} />
                  <div>
                    <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Inquest</h3>
                    <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>FOIA Legal Discovery</div>
                  </div>
                </div>
                <span style={{
                  fontSize: "0.7rem",
                  background: getSubTier("inquest") !== "free" ? "rgba(6, 182, 212, 0.25)" : "rgba(255, 255, 255, 0.08)",
                  color: getSubTier("inquest") !== "free" ? "#67E8F9" : "#94A3B8",
                  border: getSubTier("inquest") !== "free" ? "1px solid rgba(6, 182, 212, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
                  padding: "2px 8px",
                  borderRadius: "6px",
                  fontWeight: 800,
                  textTransform: "uppercase"
                }}>
                  {getSubTier("inquest")}
                </span>
              </div>

              <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                Autonomous public records compliance, statutory appeal generation, and Bates evidence vault.
              </p>

              <div style={{ marginTop: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "1rem", fontSize: "0.78rem", color: "#CBD5E1" }}>
                  <CheckCircle2 size={14} color="#67E8F9" />
                  <span>
                    {getSubTier("inquest") === "legal" ? "Unlimited Statutory Briefs & Cases" : (getSubTier("inquest") === "enterprise" ? "Enterprise Multi-Firm Docket" : "Standard Draft Filing")}
                  </span>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <button
                    onClick={() => handleQuickTierSwitch("inquest", getSubTier("inquest") === "legal" ? "free" : "legal")}
                    disabled={updatingSubProduct === "inquest"}
                    style={{
                      padding: "8px",
                      background: getSubTier("inquest") === "legal" ? "rgba(6, 182, 212, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(6, 182, 212, 0.3)",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {getSubTier("inquest") === "legal" ? "Active (Legal)" : "Legal Pro"}
                  </button>
                  <button
                    onClick={() => handleQuickTierSwitch("inquest", getSubTier("inquest") === "enterprise" ? "free" : "enterprise")}
                    disabled={updatingSubProduct === "inquest"}
                    style={{
                      padding: "8px",
                      background: getSubTier("inquest") === "enterprise" ? "rgba(139, 92, 246, 0.2)" : "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(139, 92, 246, 0.3)",
                      borderRadius: "8px",
                      color: "#C084FC",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      cursor: "pointer"
                    }}
                  >
                    {getSubTier("inquest") === "enterprise" ? "Active (Enterprise)" : "Enterprise"}
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 3: PERSONAL ACCESS TOKENS (PATS) */}
      {/* ========================================================================= */}
      {activeTab === "tokens" && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
                Personal Access Tokens (API Keys)
              </h2>
              <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: "4px 0 0 0" }}>
                Authenticate with Exultia CLI compilers, UVI intelligence feeds, and automated CI/CD pipelines.
              </p>
            </div>
            <button
              onClick={() => { setShowNewTokenModal(true); setCreatedPlainToken(null); }}
              className="btn-primary"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                fontSize: "0.85rem",
                fontWeight: 700
              }}
            >
              <Plus size={16} />
              Generate New Token
            </button>
          </div>

          {/* Recently Created Token Banner */}
          {createdPlainToken && (
            <div style={{
              background: "rgba(34, 197, 94, 0.12)",
              border: "1px solid rgba(34, 197, 94, 0.4)",
              borderRadius: "14px",
              padding: "1.25rem",
              marginBottom: "1.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#86EFAC", fontWeight: 700, fontSize: "0.92rem", marginBottom: "0.5rem" }}>
                <CheckCircle2 size={18} />
                <span>New Token Created! Copy your token now:</span>
              </div>
              <p style={{ color: "#CBD5E1", fontSize: "0.82rem", margin: "0 0 0.75rem 0" }}>
                For security reasons, this token will never be displayed again. If you lose it, you must revoke and generate a new one.
              </p>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                <input 
                  type="text"
                  readOnly
                  value={createdPlainToken}
                  style={{
                    flex: 1,
                    fontFamily: "monospace",
                    background: "rgba(0, 0, 0, 0.4)",
                    border: "1px solid rgba(34, 197, 94, 0.3)",
                    padding: "0.6rem 0.8rem",
                    borderRadius: "8px",
                    color: "#A7F3D0",
                    fontSize: "0.88rem"
                  }}
                />
                <button
                  onClick={() => copyToClipboard(createdPlainToken)}
                  style={{
                    background: tokenCopied ? "#16A34A" : "#3B82F6",
                    border: "none",
                    borderRadius: "8px",
                    padding: "0.6rem 1rem",
                    color: "white",
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <Copy size={15} />
                  {tokenCopied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}

          {/* Token Generation Inline Modal */}
          {showNewTokenModal && (
            <div style={{
              background: "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 26, 0.95) 100%)",
              border: "1px solid rgba(6, 182, 212, 0.35)",
              borderRadius: "16px",
              padding: "1.75rem",
              marginBottom: "2rem",
              boxShadow: "0 20px 40px rgba(0,0,0,0.8)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                  Generate Personal Access Token (PAT)
                </h3>
                <button
                  onClick={() => setShowNewTokenModal(false)}
                  style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer" }}
                >
                  Cancel
                </button>
              </div>

              <form onSubmit={handleCreateToken} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.35rem" }}>
                      Token Description / Note
                    </label>
                    <input 
                      type="text"
                      placeholder="e.g. CI/CD Airgap Builder or UVI Ingest Script"
                      value={newTokenName}
                      onChange={e => setNewTokenName(e.target.value)}
                      required
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "0.88rem",
                        outline: "none"
                      }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.35rem" }}>
                      Expiration
                    </label>
                    <select
                      value={newTokenExpiry}
                      onChange={e => setNewTokenExpiry(e.target.value)}
                      style={{
                        width: "100%",
                        padding: "0.65rem 0.85rem",
                        background: "#0F172A",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "8px",
                        color: "white",
                        fontSize: "0.88rem",
                        outline: "none"
                      }}
                    >
                      <option value="30">30 days</option>
                      <option value="60">60 days</option>
                      <option value="90">90 days</option>
                      <option value="365">1 year</option>
                      <option value="0">No expiration</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.5rem" }}>
                    Scopes & Permissions
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                    {[
                      { scope: "read:threats", label: "Read UVI Threat Feed & Advisories" },
                      { scope: "read:stats", label: "Read Global CVSS/KEV Analytics" },
                      { scope: "ingest:telemetry", label: "Stream Threat Feeds & Ingestion" },
                      { scope: "builder:cli", label: "Trigger PureIDE Workstation Builds" },
                      { scope: "inquest:api", label: "Sync Inquest Evidence & Dockets" },
                    ].map(({ scope, label }) => (
                      <label key={scope} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.03)", padding: "8px 10px", borderRadius: "8px", cursor: "pointer", fontSize: "0.82rem", color: "#E2E8F0" }}>
                        <input 
                          type="checkbox"
                          checked={newTokenScopes.includes(scope)}
                          onChange={() => toggleScope(scope)}
                        />
                        <span style={{ fontFamily: "monospace", color: "#67E8F9", fontSize: "0.78rem" }}>{scope}</span>
                        <span style={{ color: "#94A3B8", fontSize: "0.75rem" }}>({label})</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={() => setShowNewTokenModal(false)}
                    style={{ background: "transparent", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "8px", padding: "8px 16px", color: "#CBD5E1", fontSize: "0.85rem", cursor: "pointer" }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isCreatingToken || !newTokenName.trim()}
                    className="btn-primary"
                    style={{ padding: "8px 18px", fontSize: "0.85rem", fontWeight: 700 }}
                  >
                    {isCreatingToken ? "Generating..." : "Generate Token"}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Tokens List Table */}
          <div style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            overflow: "hidden"
          }}>
            {tokens.length === 0 ? (
              <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
                <KeyRound size={36} color="#64748B" style={{ margin: "0 auto 0.75rem auto" }} />
                <h4 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 0.35rem 0" }}>No API Tokens Generated</h4>
                <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: "0 0 1.25rem 0" }}>
                  Generate an API token to interact with Exultia REST endpoints, CLI builders, or feed webhooks.
                </p>
                <button
                  onClick={() => setShowNewTokenModal(true)}
                  className="btn-primary"
                  style={{ padding: "6px 14px", fontSize: "0.82rem", fontWeight: 700 }}
                >
                  Create First Token
                </button>
              </div>
            ) : (
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#94A3B8" }}>
                    <th style={{ padding: "12px 16px" }}>Token Name</th>
                    <th style={{ padding: "12px 16px" }}>Key Prefix</th>
                    <th style={{ padding: "12px 16px" }}>Granted Scopes</th>
                    <th style={{ padding: "12px 16px" }}>Created / Expiry</th>
                    <th style={{ padding: "12px 16px", textAlign: "right" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tokens.map(token => (
                    <tr key={token.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                      <td style={{ padding: "14px 16px", fontWeight: 600, color: "#FFFFFF" }}>
                        {token.name}
                      </td>
                      <td style={{ padding: "14px 16px", fontFamily: "monospace", color: "#67E8F9" }}>
                        {token.tokenPrefix}
                      </td>
                      <td style={{ padding: "14px 16px" }}>
                        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                          {token.scopes.map(s => (
                            <span key={s} style={{ fontSize: "0.68rem", background: "rgba(59, 130, 246, 0.15)", color: "#93C5FD", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>
                              {s}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", color: "#94A3B8", fontSize: "0.8rem" }}>
                        <div>{new Date(token.createdAt).toLocaleDateString()}</div>
                        <div style={{ fontSize: "0.72rem", color: "#64748B" }}>
                          {token.expiresAt ? `Expires: ${new Date(token.expiresAt).toLocaleDateString()}` : "Never expires"}
                        </div>
                      </td>
                      <td style={{ padding: "14px 16px", textAlign: "right" }}>
                        <button
                          onClick={() => handleRevokeToken(token.id)}
                          style={{
                            background: "rgba(239, 68, 68, 0.1)",
                            border: "1px solid rgba(239, 68, 68, 0.3)",
                            borderRadius: "6px",
                            color: "#F87171",
                            padding: "4px 10px",
                            fontSize: "0.75rem",
                            fontWeight: 700,
                            cursor: "pointer",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "4px"
                          }}
                        >
                          <Trash2 size={12} />
                          Revoke
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 4: SECURITY & PASSWORD */}
      {/* ========================================================================= */}
      {activeTab === "security" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          
          {/* Change Password Card */}
          <div style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "1.75rem"
          }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <Lock size={18} color="#FB7185" />
              Change Password
            </h3>

            {passwordSuccess && (
              <div style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.3)", borderRadius: "10px", padding: "0.75rem 1rem", color: "#86EFAC", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                {passwordSuccess}
              </div>
            )}

            {passwordError && (
              <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", borderRadius: "10px", padding: "0.75rem 1rem", color: "#FCA5A5", fontSize: "0.85rem", marginBottom: "1.25rem" }}>
                {passwordError}
              </div>
            )}

            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Current Password
                </label>
                <input 
                  type="password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, marginBottom: "0.4rem" }}>
                  New Password
                </label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, marginBottom: "0.4rem" }}>
                  Confirm New Password
                </label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  required
                  minLength={6}
                  placeholder="••••••••"
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "10px",
                    color: "white",
                    fontSize: "0.9rem",
                    outline: "none"
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="btn-primary"
                style={{
                  padding: "0.85rem",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                  marginTop: "0.5rem"
                }}
              >
                {isChangingPassword ? "Updating Password..." : "Update Password"}
              </button>
            </form>
          </div>

          {/* Active Sessions & Security Audit */}
          <div style={{
            background: "rgba(15, 23, 42, 0.6)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "1.75rem"
          }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <Clock size={18} color="#F59E0B" />
              Active Session Details
            </h3>

            <div style={{
              background: "rgba(255, 255, 255, 0.03)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "1rem",
              marginBottom: "1.25rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#FFFFFF" }}>Current Browser Session</span>
                <span style={{ fontSize: "0.68rem", background: "rgba(34, 197, 94, 0.2)", color: "#86EFAC", border: "1px solid rgba(34, 197, 94, 0.4)", padding: "1px 6px", borderRadius: "4px", fontWeight: 800 }}>
                  ACTIVE NOW
                </span>
              </div>
              <div style={{ fontSize: "0.78rem", color: "#94A3B8", lineHeight: 1.5 }}>
                <div>Cookie: <span style={{ fontFamily: "monospace", color: "#60A5FA" }}>exultia_session</span></div>
                <div>Storage: Turso Encrypted Sessions Table</div>
                <div>Duration: 30-day sliding token rotation</div>
              </div>
            </div>

            <div style={{
              background: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "12px",
              padding: "1rem"
            }}>
              <h4 style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FCA5A5", margin: "0 0 0.35rem 0" }}>
                Sign Out Everywhere
              </h4>
              <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: "0 0 0.75rem 0" }}>
                Terminating your session will revoke access on this browser and clear all session cookies from the database.
              </p>
              <button
                onClick={() => router.push("/api/auth/logout")}
                style={{
                  background: "rgba(239, 68, 68, 0.2)",
                  border: "1px solid rgba(239, 68, 68, 0.4)",
                  color: "#FCA5A5",
                  padding: "6px 12px",
                  borderRadius: "6px",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Sign Out Current Session
              </button>
            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "75vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(59, 130, 246, 0.2)", borderTopColor: "#3B82F6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#94A3B8", fontSize: "0.9rem" }}>Loading account details...</p>
      </div>
    }>
      <AccountPageContent />
    </Suspense>
  );
}
