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
  Cpu,
  LayoutDashboard,
  Radio,
  Scale,
  GitBranch,
  ShieldAlert,
  CreditCard,
  LogOut,
  ChevronRight,
  Sliders,
  ShieldCheck,
  Check
} from "lucide-react";
import { PureIdeIcon, VantageIcon, PraxisIcon, PureOsIcon } from "@/components/BrandIcons";
import CustomerOverview from "@/components/account/CustomerOverview";
import ProductSuiteConfig from "@/components/account/ProductSuiteConfig";
import GitHubWorkflowsTab from "@/components/account/GitHubWorkflowsTab";
import AdminConsole from "@/components/account/AdminConsole";

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

type AccountTab = 
  | "overview" 
  | "profile" 
  | "subscriptions" 
  | "security" 
  | "config" 
  | "tokens" 
  | "workflows" 
  | "admin";

function AccountPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { 
    user, 
    loading: authLoading, 
    openAuthModal, 
    openPaymentModal, 
    refreshUser, 
    getUserTier, 
    isImpersonating,
    logout 
  } = useAuth();

  const tabParam = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState<AccountTab>("overview");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const isAdmin = Boolean(
    user?.role === "admin" ||
    user?.isImpersonating ||
    user?.email?.toLowerCase() === "admin@exultia.tech"
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
    if (tabParam) {
      const validTabs: AccountTab[] = [
        "overview", 
        "profile", 
        "subscriptions", 
        "security", 
        "config", 
        "tokens", 
        "workflows", 
        "admin"
      ];
      if (tabParam === "personas" || tabParam === "eris" || tabParam === "valkyrie") {
        setActiveTab("overview");
      } else if (["pureide", "uvi", "praxis", "pureos", "axiom", "kinetic", "config"].includes(tabParam)) {
        setActiveTab("config");
      } else if (validTabs.includes(tabParam as AccountTab)) {
        setActiveTab(tabParam as AccountTab);
      }
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

  const handleDowngradeToFree = async (product: string) => {
    if (!confirm(`Are you sure you want to downgrade ${product.toUpperCase()} to the Free Community plan?`)) return;
    setUpdatingSubProduct(product);
    try {
      const res = await fetch("/api/user/subscription", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product, tier: "free", billingCycle: "annual" }),
      });
      const data = await res.json();
      if (res.ok) {
        await refreshUser();
        loadSubscriptions();
      } else {
        alert(data.error || "Failed to downgrade subscription");
      }
    } catch (e) {
      console.error("Subscription downgrade error:", e);
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
        <p style={{ color: "#94A3B8", fontSize: "0.9rem" }}>Loading account console...</p>
      </div>
    );
  }

  const getSubTier = (prod: string) => {
    const s = subscriptions.find(sub => sub.product === prod);
    return s ? s.tier : "free";
  };

  const activePaidSubsCount = subscriptions.filter(s => s.status === "active" && s.tier !== "free").length;

  // Header meta titles for the active tab view
  const tabMetadata: Record<AccountTab, { title: string; subtitle: string; actionLabel?: string; actionHref?: string; onActionClick?: () => void }> = {
    overview: {
      title: "Hub & Fleet Overview",
      subtitle: "Unified telemetry status, active workstation licenses, and security credentials.",
      actionLabel: "Manage Plans",
      actionHref: "/account/subscription"
    },
    profile: {
      title: "Profile & Identity Credentials",
      subtitle: "Personal identity details, authenticated email address, and security access keys.",
      actionLabel: "View Billing",
      onActionClick: () => setActiveTab("subscriptions")
    },
    subscriptions: {
      title: "Plans & Licensing Entitlements",
      subtitle: "Pro Single-User and Enterprise Volume licenses across the Exultia platform suite.",
      actionLabel: "Plan Matrix →",
      actionHref: "/account/subscription"
    },
    security: {
      title: "Enclave Security & Attestation",
      subtitle: "Zero-telemetry cryptographic verification, 2FA/FIDO2 hardware keys, and active session tokens.",
      actionLabel: "Update Password",
      onActionClick: () => setActiveTab("profile")
    },
    config: {
      title: "Product Suite Configuration",
      subtitle: "Unified controls for Daedelus workstations, Vantage threat feeds, Praxis remediation, and hardened container policies.",
      actionLabel: "Launch Workstation",
      actionHref: "/app/daedelus"
    },
    tokens: {
      title: "API Access Tokens (PAT)",
      subtitle: "Programmatic bearer tokens for CLI compilers, automated ingest scripts, and REST endpoints.",
      actionLabel: "+ Generate New Token",
      onActionClick: () => {
        const isEnt = Boolean(user.role === "admin" || user.subscriptions?.some(s => s.status === "active" && (s.tier.toLowerCase() === "enterprise" || s.tier.toLowerCase() === "developer")));
        if (!isEnt) {
          alert("Programmatic API tokens and enhanced integrations are exclusive to Enterprise subscribers. Free accounts are limited to basic account management.");
          return;
        }
        setShowNewTokenModal(true);
        setCreatedPlainToken(null);
      }
    },
    workflows: {
      title: "GitHub Actions CI/CD Workflows",
      subtitle: "Automated air-gapped binary build recipes and enterprise repository runners.",
      actionLabel: "Workflow Templates",
      actionHref: "/account/subscription?product=pureide"
    },
    admin: {
      title: "Root Administration & Surveillance",
      subtitle: "Live license audit compliance monitoring, client IP tracking, and customer impersonation.",
      actionLabel: "Audit Report",
      onActionClick: () => loadProfileData()
    }
  };

  const currentMeta = tabMetadata[activeTab] || tabMetadata.overview;

  return (
    <div className="console-workbench fade-in">
      
      {/* ========================================================================= */}
      {/* SIDEBAR: PUREIDE BUILDER STYLE COLLAPSIBLE NAVIGATION */}
      {/* ========================================================================= */}
      <aside className={`console-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        
        {/* Sidebar Header */}
        <div className="console-sidebar-header">
          {!sidebarCollapsed && (
            <div className="console-sidebar-title">
              <UserIcon size={14} color="#60A5FA" />
              <span>User Console</span>
            </div>
          )}
          <button 
            type="button" 
            className="console-collapse-btn" 
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            title={sidebarCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {sidebarCollapsed ? (
                <polyline points="9 18 15 12 9 6" />
              ) : (
                <polyline points="15 18 9 12 15 6" />
              )}
            </svg>
          </button>
        </div>

        {/* Group 1: Workspace & Identity */}
        <div className="console-sidebar-group">
          {!sidebarCollapsed && <span className="console-sidebar-label">Account & Identity</span>}
          
          <button 
            type="button"
            className={`console-sidebar-item ${activeTab === "overview" ? "active" : ""}`}
            onClick={() => setActiveTab("overview")}
            title="Hub & Overview"
          >
            <Layers size={16} />
            {!sidebarCollapsed && <span>Hub & Overview</span>}
            {!sidebarCollapsed && (
              <span className="console-sidebar-badge">Hub</span>
            )}
          </button>

          <button 
            type="button"
            className={`console-sidebar-item ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
            title="Profile & Credentials"
          >
            <UserIcon size={16} />
            {!sidebarCollapsed && <span>Profile & Credentials</span>}
          </button>

          <button 
            type="button"
            className={`console-sidebar-item ${activeTab === "subscriptions" ? "active" : ""}`}
            onClick={() => setActiveTab("subscriptions")}
            title="Plans & Subscriptions"
          >
            <CreditCard size={16} />
            {!sidebarCollapsed && <span>Plans & Subscriptions</span>}
            {!sidebarCollapsed && activePaidSubsCount > 0 && (
              <span className="console-sidebar-badge">{activePaidSubsCount} Paid</span>
            )}
          </button>

          <button 
            type="button"
            className={`console-sidebar-item ${activeTab === "security" ? "active" : ""}`}
            onClick={() => setActiveTab("security")}
            title="Enclave Security"
          >
            <Lock size={16} />
            {!sidebarCollapsed && <span>Enclave Security</span>}
          </button>
        </div>

        {/* Group 2: Unified Product Suite Controls */}
        <div className="console-sidebar-group">
          {!sidebarCollapsed && <span className="console-sidebar-label">Product Suite</span>}
          
          <button 
            type="button"
            className={`console-sidebar-item ${activeTab === "config" ? "active" : ""}`}
            onClick={() => setActiveTab("config")}
            title="Product Suite Configuration"
          >
            <Sliders size={16} />
            {!sidebarCollapsed && <span>Suite Configuration</span>}
            {!sidebarCollapsed && (
              <span className="console-sidebar-badge">CONTROLS</span>
            )}
          </button>
        </div>

        {/* Group 3: Developer Platform */}
        <div className="console-sidebar-group">
          {!sidebarCollapsed && <span className="console-sidebar-label">Developer Tools</span>}
          
          <button 
            type="button"
            className={`console-sidebar-item ${activeTab === "tokens" ? "active" : ""}`}
            onClick={() => setActiveTab("tokens")}
            title="API Access Tokens"
          >
            <KeyRound size={16} />
            {!sidebarCollapsed && <span>API Access Tokens</span>}
            {!sidebarCollapsed && tokens.length > 0 && (
              <span className="console-sidebar-badge">{tokens.length}</span>
            )}
          </button>

          <button 
            type="button"
            className={`console-sidebar-item ${activeTab === "workflows" ? "active" : ""}`}
            onClick={() => setActiveTab("workflows")}
            title="GitHub CI/CD Workflows"
          >
            <GitBranch size={16} />
            {!sidebarCollapsed && <span>CI/CD Workflows</span>}
          </button>
        </div>

        {/* Group 4: Administration (Admin only) */}
        {isAdmin && (
          <div className="console-sidebar-group">
            {!sidebarCollapsed && <span className="console-sidebar-label" style={{ color: "#F59E0B" }}>Administration</span>}
            <button 
              type="button"
              className={`console-sidebar-item ${activeTab === "admin" ? "active" : ""}`}
              onClick={() => setActiveTab("admin")}
              title="Admin Surveillance Console"
              style={{
                background: activeTab === "admin" ? "rgba(245, 158, 11, 0.2)" : "transparent",
                color: activeTab === "admin" ? "#FDE68A" : "#F59E0B"
              }}
            >
              <ShieldAlert size={16} color="#F59E0B" />
              {!sidebarCollapsed && <span style={{ fontWeight: 700 }}>Admin Console</span>}
              {!sidebarCollapsed && (
                <span className="console-sidebar-badge" style={{ background: "#F59E0B", color: "#000", fontWeight: 800 }}>ROOT</span>
              )}
            </button>
          </div>
        )}

        {/* Sidebar Footer: User Identity Pill */}
        <div style={{ marginTop: "auto", paddingTop: "0.75rem", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
          {!sidebarCollapsed ? (
            <div style={{ 
              padding: "0.55rem 0.65rem", 
              borderRadius: "10px", 
              background: "rgba(0,0,0,0.35)", 
              border: "1px solid rgba(255,255,255,0.06)", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.6rem" 
            }}>
              <div style={{ 
                width: "32px", 
                height: "32px", 
                borderRadius: "8px", 
                background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)", 
                display: "grid", 
                placeItems: "center", 
                color: "white", 
                fontWeight: 800, 
                fontSize: "0.9rem",
                flexShrink: 0
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.78rem", fontWeight: 700, color: "#FFFFFF", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.name || user.email}
                </div>
                <div style={{ fontSize: "0.68rem", color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {user.role === "admin" ? "Root Administrator" : `${activePaidSubsCount > 0 ? "Licensed Subscriber" : "Community Free"}`}
                </div>
              </div>
              <button 
                type="button"
                onClick={() => logout()}
                title="Log Out"
                style={{ 
                  background: "transparent", 
                  border: "none", 
                  color: "#94A3B8", 
                  cursor: "pointer", 
                  padding: "4px",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={{ textAlign: "center" }} title={`${user.name || user.email} (${user.role})`}>
              <div style={{ 
                width: "32px", 
                height: "32px", 
                margin: "0 auto", 
                borderRadius: "8px", 
                background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)", 
                display: "grid", 
                placeItems: "center", 
                color: "white", 
                fontWeight: 800, 
                fontSize: "0.9rem" 
              }}>
                {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ========================================================================= */}
      {/* MAIN VIEWPORT: ONE VIEW ARCHITECTURE (NO SCROLLING TAB BARS) */}
      {/* ========================================================================= */}
      <main className="console-main-view">
        
        {/* Crisp Top Bar */}
        <div style={{ 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "space-between", 
          gap: "1rem", 
          flexWrap: "wrap",
          paddingBottom: "0.75rem", 
          marginBottom: "1rem", 
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)" 
        }}>
          {/* Breadcrumb & Section Title */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.06em" }}>
              <span>Exultia User Console</span>
              <span>/</span>
              <span style={{ color: "#60A5FA" }}>{currentMeta.title}</span>
            </div>
            <h1 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", margin: "4px 0 0 0", letterSpacing: "-0.02em" }}>
              {currentMeta.title}
            </h1>
            <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: "2px 0 0 0" }}>
              {currentMeta.subtitle}
            </p>
          </div>

          {/* Quick Status Chips & Primary View Action */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            <div style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: "6px", 
              padding: "0.35rem 0.75rem", 
              background: "rgba(52, 211, 153, 0.1)", 
              border: "1px solid rgba(52, 211, 153, 0.3)", 
              borderRadius: "20px", 
              fontSize: "0.75rem", 
              color: "#34D399", 
              fontWeight: 600 
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#34D399", display: "inline-block", boxShadow: "0 0 8px #34D399" }} />
              Zero-Telemetry Enclave
            </div>

            {currentMeta.actionLabel && (
              currentMeta.actionHref ? (
                <Link
                  href={currentMeta.actionHref}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                    color: "white",
                    padding: "0.45rem 1rem",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    textDecoration: "none",
                    boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)"
                  }}
                >
                  {currentMeta.actionLabel}
                </Link>
              ) : currentMeta.onActionClick ? (
                <button
                  type="button"
                  onClick={currentMeta.onActionClick}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                    color: "white",
                    padding: "0.45rem 1rem",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    boxShadow: "0 0 15px rgba(59, 130, 246, 0.3)"
                  }}
                >
                  {currentMeta.actionLabel}
                </button>
              ) : null
            )}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* VIEW 1: HUB & FLEET OVERVIEW */}
        {/* ========================================================================= */}
        {activeTab === "overview" && (
          <div className="fade-in">
            <CustomerOverview 
              onSelectTab={setActiveTab} 
              onOpenUpgradeModal={() => setActiveTab("subscriptions")} 
            />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: PROFILE & IDENTITY CREDENTIALS */}
        {/* ========================================================================= */}
        {activeTab === "profile" && (
          <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1.5rem" }}>
            
            {/* Identity Details Card */}
            <div style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "1.75rem",
              backdropFilter: "blur(12px)"
            }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <UserIcon size={18} color="#60A5FA" />
                Identity & Organization Profile
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
                      outline: "none",
                      boxSizing: "border-box"
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
                      cursor: "not-allowed",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.85rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 600 }}>Role Authority</div>
                    <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#60A5FA", marginTop: "2px" }}>
                      {user.role.toUpperCase()}
                    </div>
                  </div>
                  <div style={{ background: "rgba(255, 255, 255, 0.03)", padding: "0.85rem", borderRadius: "10px", border: "1px solid rgba(255, 255, 255, 0.06)" }}>
                    <div style={{ fontSize: "0.72rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 600 }}>Active Tiers</div>
                    <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#34D399", marginTop: "2px" }}>
                      {activePaidSubsCount} Paid / 6 Total
                    </div>
                  </div>
                </div>

                {/* Connected GitHub Identity */}
                <div style={{ 
                  background: "rgba(255, 255, 255, 0.03)", 
                  border: "1px solid rgba(255, 255, 255, 0.08)", 
                  borderRadius: "10px", 
                  padding: "0.85rem 1rem", 
                  display: "flex", 
                  justifyContent: "space-between", 
                  alignItems: "center" 
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="#FFFFFF">
                      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    <div>
                      <div style={{ fontWeight: 600, color: "#FFFFFF", fontSize: "0.82rem" }}>GitHub Identity Access</div>
                      <div style={{ color: "#94A3B8", fontSize: "0.72rem" }}>Developer & Workflow Tokens</div>
                    </div>
                  </div>
                  <a
                    href="/api/auth/oauth/github"
                    style={{
                      padding: "5px 10px",
                      background: "rgba(255, 255, 255, 0.06)",
                      border: "1px solid rgba(255, 255, 255, 0.15)",
                      borderRadius: "6px",
                      color: "#CBD5E1",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      textDecoration: "none"
                    }}
                  >
                    Connect / Switch
                  </a>
                </div>

                <button
                  type="submit"
                  disabled={isUpdatingProfile}
                  className="btn-primary"
                  style={{ padding: "0.75rem", fontWeight: 700, fontSize: "0.88rem", marginTop: "0.5rem" }}
                >
                  {isUpdatingProfile ? "Saving Changes..." : "Save Profile Details"}
                </button>
              </form>
            </div>

            {/* Change Password Card */}
            <div style={{
              background: "rgba(15, 23, 42, 0.6)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              borderRadius: "16px",
              padding: "1.75rem",
              backdropFilter: "blur(12px)"
            }}>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <Lock size={18} color="#FB7185" />
                Security & Password Management
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
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, marginBottom: "0.4rem" }}>
                    New Password (Min 6 Characters)
                  </label>
                  <input 
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
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
                      outline: "none",
                      boxSizing: "border-box"
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
                    placeholder="••••••••"
                    style={{
                      width: "100%",
                      padding: "0.75rem 1rem",
                      background: "rgba(255, 255, 255, 0.04)",
                      border: "1px solid rgba(255, 255, 255, 0.12)",
                      borderRadius: "10px",
                      color: "white",
                      fontSize: "0.9rem",
                      outline: "none",
                      boxSizing: "border-box"
                    }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isChangingPassword}
                  className="btn-primary"
                  style={{ 
                    padding: "0.75rem", 
                    fontWeight: 700, 
                    fontSize: "0.88rem", 
                    background: "linear-gradient(135deg, #F43F5E 0%, #E11D48 100%)",
                    marginTop: "0.5rem"
                  }}
                >
                  {isChangingPassword ? "Updating Password..." : "Change Password"}
                </button>
              </form>
            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: PLANS & SUBSCRIPTIONS */}
        {/* ========================================================================= */}
        {activeTab === "subscriptions" && (
          <div className="fade-in">
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "1.25rem", marginBottom: "1.5rem" }}>
              
              {/* CARD 1: PUREIDE */}
              <div style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: getSubTier("pureide") !== "free" ? "1px solid rgba(59, 130, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <PureIdeIcon size={32} />
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>PureIDE</h3>
                      <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Workstation Compiler</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: "0.68rem",
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

                <p style={{ color: "#94A3B8", fontSize: "0.8rem", lineHeight: 1.4, marginBottom: "1rem" }}>
                  Zero-trust developer environment compiler with automated telemetry stripping and airgap signing.
                </p>

                <div style={{ marginTop: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.85rem", fontSize: "0.75rem", color: "#CBD5E1" }}>
                    <CheckCircle2 size={13} color="#60A5FA" />
                    <span>
                      {getSubTier("pureide") === "enterprise" ? "Hermetic Airgap Cosigning (Enterprise)" : (getSubTier("pureide") === "pro" ? "Priority Cloud Builds (Pro)" : "Community Build Triggers (Free)")}
                    </span>
                  </div>

                  {getSubTier("pureide") === "free" ? (
                    <Link
                      href="/account/subscription?product=pureide"
                      className="btn-primary"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "8px 12px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        borderRadius: "8px",
                        width: "100%",
                        textAlign: "center"
                      }}
                    >
                      Upgrade Plan →
                    </Link>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      <Link
                        href="/account/subscription?product=pureide"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px 10px",
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "8px",
                          color: "#FFFFFF",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textDecoration: "none",
                          textAlign: "center"
                        }}
                      >
                        Manage Plan
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDowngradeToFree("pureide")}
                        disabled={updatingSubProduct === "pureide"}
                        style={{
                          padding: "8px 10px",
                          background: "rgba(239, 68, 68, 0.12)",
                          border: "1px solid rgba(239, 68, 68, 0.25)",
                          borderRadius: "8px",
                          color: "#FCA5A5",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        Downgrade
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* CARD 2: Vantage */}
              <div style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: getSubTier("uvi") !== "free" ? "1px solid rgba(139, 92, 246, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <VantageIcon size={32} />
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Vantage Feed</h3>
                      <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Threat Intelligence</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: "0.68rem",
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

                <p style={{ color: "#94A3B8", fontSize: "0.8rem", lineHeight: 1.4, marginBottom: "1rem" }}>
                  Universal vulnerability intelligence catalog aggregating CISA KEV, MSRC, OSV, and zero-day disclosures.
                </p>

                <div style={{ marginTop: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.85rem", fontSize: "0.75rem", color: "#CBD5E1" }}>
                    <CheckCircle2 size={13} color="#C084FC" />
                    <span>
                      {getSubTier("uvi") === "enterprise" ? "Streaming Webhooks & Raw Dumps (Enterprise)" : (getSubTier("uvi") === "pro" ? "Realtime API & KEV Feeds (Pro)" : "Web UI Feed Access (Community)")}
                    </span>
                  </div>

                  {getSubTier("uvi") === "free" ? (
                    <Link
                      href="/account/subscription?product=uvi"
                      className="btn-primary"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "8px 12px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        borderRadius: "8px",
                        width: "100%",
                        textAlign: "center"
                      }}
                    >
                      Upgrade Plan →
                    </Link>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      <Link
                        href="/account/subscription?product=uvi"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px 10px",
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "8px",
                          color: "#FFFFFF",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textDecoration: "none",
                          textAlign: "center"
                        }}
                      >
                        Manage Plan
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDowngradeToFree("uvi")}
                        disabled={updatingSubProduct === "uvi"}
                        style={{
                          padding: "8px 10px",
                          background: "rgba(239, 68, 68, 0.12)",
                          border: "1px solid rgba(239, 68, 68, 0.25)",
                          borderRadius: "8px",
                          color: "#FCA5A5",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        Downgrade
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* CARD 3: PRAXIS (absorbed kinetic hotpatching) */}
              {/* CARD 5: PRAXIS */}
              <div style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: getSubTier("praxis") !== "free" ? "1px solid rgba(245, 158, 11, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <PraxisIcon size={32} />
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>Praxis</h3>
                      <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>CVE Threat Remediation</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: "0.68rem",
                    background: getSubTier("praxis") !== "free" ? "rgba(245, 158, 11, 0.25)" : "rgba(255, 255, 255, 0.08)",
                    color: getSubTier("praxis") !== "free" ? "#FDE68A" : "#94A3B8",
                    border: getSubTier("praxis") !== "free" ? "1px solid rgba(245, 158, 11, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontWeight: 800,
                    textTransform: "uppercase"
                  }}>
                    {getSubTier("praxis")}
                  </span>
                </div>

                <p style={{ color: "#94A3B8", fontSize: "0.8rem", lineHeight: 1.4, marginBottom: "1rem" }}>
                  Automated threat remediation scripts and patch generators mapped directly to vulnerability disclosures.
                </p>

                <div style={{ marginTop: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.85rem", fontSize: "0.75rem", color: "#CBD5E1" }}>
                    <CheckCircle2 size={13} color="#F59E0B" />
                    <span>
                      {getSubTier("praxis") === "enterprise" ? "Fleet Airgap Auto-Patch (Enterprise)" : (getSubTier("praxis") === "pro" ? "Automated Shell Fix Scripts (Pro)" : "Public Fix Index (Community)")}
                    </span>
                  </div>

                  {getSubTier("praxis") === "free" ? (
                    <Link
                      href="/account/subscription?product=praxis"
                      className="btn-primary"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "8px 12px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        borderRadius: "8px",
                        width: "100%",
                        textAlign: "center"
                      }}
                    >
                      Upgrade Plan →
                    </Link>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      <Link
                        href="/account/subscription?product=praxis"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px 10px",
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "8px",
                          color: "#FFFFFF",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textDecoration: "none",
                          textAlign: "center"
                        }}
                      >
                        Manage Plan
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDowngradeToFree("praxis")}
                        disabled={updatingSubProduct === "praxis"}
                        style={{
                          padding: "8px 10px",
                          background: "rgba(239, 68, 68, 0.12)",
                          border: "1px solid rgba(239, 68, 68, 0.25)",
                          borderRadius: "8px",
                          color: "#FCA5A5",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        Downgrade
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* CARD 6: PUREOS */}
              <div style={{
                background: "rgba(15, 23, 42, 0.7)",
                border: getSubTier("pureos") !== "free" ? "1px solid rgba(16, 185, 129, 0.5)" : "1px solid rgba(255, 255, 255, 0.1)",
                borderRadius: "16px",
                padding: "1.5rem",
                display: "flex",
                flexDirection: "column"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.85rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <PureOsIcon size={32} />
                    <div>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>PureOS Containers</h3>
                      <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Hardened Linux Registry</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: "0.68rem",
                    background: getSubTier("pureos") !== "free" ? "rgba(16, 185, 129, 0.25)" : "rgba(255, 255, 255, 0.08)",
                    color: getSubTier("pureos") !== "free" ? "#6EE7B7" : "#94A3B8",
                    border: getSubTier("pureos") !== "free" ? "1px solid rgba(16, 185, 129, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
                    padding: "2px 8px",
                    borderRadius: "6px",
                    fontWeight: 800,
                    textTransform: "uppercase"
                  }}>
                    {getSubTier("pureos")}
                  </span>
                </div>

                <p style={{ color: "#94A3B8", fontSize: "0.8rem", lineHeight: 1.4, marginBottom: "1rem" }}>
                  Immutable minimal developer containers with kernel lockdown and verifiable supply chain signatures.
                </p>

                <div style={{ marginTop: "auto" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.85rem", fontSize: "0.75rem", color: "#CBD5E1" }}>
                    <CheckCircle2 size={13} color="#10B981" />
                    <span>
                      {getSubTier("pureos") === "enterprise" ? "Custom Hardened Fleet Images (Enterprise)" : (getSubTier("pureos") === "pro" ? "Authenticated OCI Pulls (Pro)" : "Base Container Pulls (Community)")}
                    </span>
                  </div>

                  {getSubTier("pureos") === "free" ? (
                    <Link
                      href="/account/subscription?product=pureos"
                      className="btn-primary"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: "6px",
                        padding: "8px 12px",
                        fontSize: "0.78rem",
                        fontWeight: 700,
                        textDecoration: "none",
                        borderRadius: "8px",
                        width: "100%",
                        textAlign: "center"
                      }}
                    >
                      Upgrade Plan →
                    </Link>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                      <Link
                        href="/account/subscription?product=pureos"
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "8px 10px",
                          background: "rgba(255, 255, 255, 0.08)",
                          border: "1px solid rgba(255, 255, 255, 0.15)",
                          borderRadius: "8px",
                          color: "#FFFFFF",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          textDecoration: "none",
                          textAlign: "center"
                        }}
                      >
                        Manage Plan
                      </Link>
                      <button
                        type="button"
                        onClick={() => handleDowngradeToFree("pureos")}
                        disabled={updatingSubProduct === "pureos"}
                        style={{
                          padding: "8px 10px",
                          background: "rgba(239, 68, 68, 0.12)",
                          border: "1px solid rgba(239, 68, 68, 0.25)",
                          borderRadius: "8px",
                          color: "#FCA5A5",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          cursor: "pointer",
                          textAlign: "center"
                        }}
                      >
                        Downgrade
                      </button>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 4: ENCLAVE SECURITY & HARDWARE ATTESTATION */}
        {/* ========================================================================= */}
        {activeTab === "security" && (
          <div className="fade-in" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.25rem" }}>
            <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(52, 211, 153, 0.3)", borderRadius: "16px", padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                <ShieldCheck size={28} color="#34D399" />
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>Zero-Telemetry Enclave Verification</h3>
                  <div style={{ fontSize: "0.75rem", color: "#34D399" }}>Cryptographic Attestation Active</div>
                </div>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.5, margin: "0 0 1.25rem 0" }}>
                Your workstation sessions operate under hermetic zero-telemetry rules. DNS sinkholing, outbound telemetry stripping, and memory containment are cryptographically attested.
              </p>
              <div style={{ background: "rgba(0,0,0,0.4)", padding: "0.85rem", borderRadius: "10px", border: "1px solid rgba(255,255,255,0.06)", fontFamily: "monospace", fontSize: "0.75rem", color: "#A7F3D0" }}>
                <div>STATUS: HERMETIC_LOCKDOWN_VERIFIED</div>
                <div>ENCLAVE_ID: enc_sec_{user.id.substring(0, 12)}</div>
                <div>EGRESS_POLICY: BLOCK_TELEMETRY_ALL</div>
              </div>
            </div>

            <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "16px", padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
                <KeyRound size={28} color="#60A5FA" />
                <div>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>FIDO2 / WebAuthn Hardware Keys</h3>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Hardware Second-Factor Authentication</div>
                </div>
              </div>
              <p style={{ color: "#94A3B8", fontSize: "0.82rem", lineHeight: 1.5, margin: "0 0 1.25rem 0" }}>
                Protect sensitive compiler operations and legal docket filings with FIDO2 / YubiKey physical hardware security keys.
              </p>
              <button
                type="button"
                onClick={() => alert("Hardware key attestation dialog will prompt your browser WebAuthn agent.")}
                style={{
                  padding: "8px 14px",
                  background: "rgba(59, 130, 246, 0.15)",
                  border: "1px solid rgba(59, 130, 246, 0.3)",
                  borderRadius: "8px",
                  color: "#93C5FD",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  cursor: "pointer"
                }}
              >
                Register Hardware Security Key
              </button>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 5: UNIFIED PRODUCT SUITE CONFIGURATION */}
        {/* ========================================================================= */}
        {activeTab === "config" && (
          <div className="fade-in">
            <ProductSuiteConfig />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 11: API ACCESS TOKENS */}
        {/* ========================================================================= */}
        {activeTab === "tokens" && (
          <div className="fade-in">
            {!Boolean(user.role === "admin" || user.subscriptions?.some(s => s.status === "active" && (s.tier.toLowerCase() === "enterprise" || s.tier.toLowerCase() === "developer"))) && (
              <div style={{
                background: "rgba(245, 158, 11, 0.12)",
                border: "1px solid rgba(245, 158, 11, 0.35)",
                borderRadius: "14px",
                padding: "1.25rem 1.5rem",
                marginBottom: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem"
              }}>
                <div>
                  <div style={{ color: "#FDE68A", fontWeight: 700, fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <Lock size={16} color="#F59E0B" />
                    <span>Enterprise Subscription Perk: Programmatic API Tokens</span>
                  </div>
                  <p style={{ color: "#94A3B8", fontSize: "0.8rem", margin: 0, maxWidth: "600px" }}>
                    Accounts registered on the Free Tier are configured for basic account management. Upgrade to an Enterprise subscription to generate automated API tokens.
                  </p>
                </div>
                <button
                  onClick={() => openPaymentModal ? openPaymentModal({ product: "pureide", tier: "enterprise", price: 149, billingCycle: "annual", planName: "Enterprise Workstation & APIs" }) : router.push("/account/subscription")}
                  style={{
                    padding: "8px 16px",
                    background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                    color: "#000000",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer"
                  }}
                >
                  Upgrade to Enterprise
                </button>
              </div>
            )}

            {/* Recently Created Token Banner */}
            {createdPlainToken && (
              <div style={{
                background: "rgba(34, 197, 94, 0.12)",
                border: "1px solid rgba(34, 197, 94, 0.4)",
                borderRadius: "14px",
                padding: "1.25rem",
                marginBottom: "1.25rem"
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#86EFAC", fontWeight: 700, fontSize: "0.9rem", marginBottom: "0.5rem" }}>
                  <CheckCircle2 size={18} />
                  <span>New Token Created! Copy your token now:</span>
                </div>
                <p style={{ color: "#CBD5E1", fontSize: "0.8rem", margin: "0 0 0.75rem 0" }}>
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
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <Copy size={14} />
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
                padding: "1.5rem",
                marginBottom: "1.5rem",
                boxShadow: "0 20px 40px rgba(0,0,0,0.8)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
                    Generate Personal Access Token (PAT)
                  </h3>
                  <button
                    onClick={() => setShowNewTokenModal(false)}
                    style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", fontSize: "0.85rem" }}
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
                        placeholder="e.g. CI/CD Airgap Builder or Ingest Script"
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
                          fontSize: "0.85rem",
                          outline: "none",
                          boxSizing: "border-box"
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
                          fontSize: "0.85rem",
                          outline: "none",
                          boxSizing: "border-box"
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
                        { scope: "read:threats", label: "Read Vantage Threat Feed" },
                        { scope: "read:stats", label: "Read Global CVSS Analytics" },
                        { scope: "ingest:telemetry", label: "Stream Ingestion Feeds" },
                        { scope: "builder:cli", label: "Trigger PureIDE Builds" },
                        { scope: "praxis:hotpatch", label: "Stream Praxis Hotpatch Manifests" },
                      ].map(({ scope, label }) => (
                        <label key={scope} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.03)", padding: "7px 10px", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem", color: "#E2E8F0" }}>
                          <input 
                            type="checkbox"
                            checked={newTokenScopes.includes(scope)}
                            onChange={() => toggleScope(scope)}
                          />
                          <span style={{ fontFamily: "monospace", color: "#67E8F9", fontSize: "0.75rem" }}>{scope}</span>
                          <span style={{ color: "#94A3B8", fontSize: "0.72rem" }}>({label})</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
                    <button
                      type="button"
                      onClick={() => setShowNewTokenModal(false)}
                      style={{ background: "transparent", border: "1px solid rgba(255, 255, 255, 0.15)", borderRadius: "8px", padding: "7px 14px", color: "#CBD5E1", fontSize: "0.82rem", cursor: "pointer" }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isCreatingToken || !newTokenName.trim()}
                      className="btn-primary"
                      style={{ padding: "7px 16px", fontSize: "0.82rem", fontWeight: 700 }}
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
                    Generate an API token to interact with Exultia REST endpoints, CLI compilers, or feed webhooks.
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
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.82rem" }}>
                  <thead>
                    <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#94A3B8" }}>
                      <th style={{ padding: "10px 14px" }}>Token Name</th>
                      <th style={{ padding: "10px 14px" }}>Key Prefix</th>
                      <th style={{ padding: "10px 14px" }}>Granted Scopes</th>
                      <th style={{ padding: "10px 14px" }}>Created / Expiry</th>
                      <th style={{ padding: "10px 14px", textAlign: "right" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tokens.map(token => (
                      <tr key={token.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                        <td style={{ padding: "12px 14px", fontWeight: 600, color: "#FFFFFF" }}>
                          {token.name}
                        </td>
                        <td style={{ padding: "12px 14px", fontFamily: "monospace", color: "#67E8F9" }}>
                          {token.tokenPrefix}
                        </td>
                        <td style={{ padding: "12px 14px" }}>
                          <div style={{ display: "flex", gap: "4px", flexWrap: "wrap" }}>
                            {token.scopes.map(s => (
                              <span key={s} style={{ fontSize: "0.68rem", background: "rgba(59, 130, 246, 0.15)", color: "#93C5FD", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace" }}>
                                {s}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px", color: "#94A3B8", fontSize: "0.78rem" }}>
                          <div>{new Date(token.createdAt).toLocaleDateString()}</div>
                          <div style={{ fontSize: "0.7rem", color: "#64748B" }}>
                            {token.expiresAt ? `Expires: ${new Date(token.expiresAt).toLocaleDateString()}` : "Never expires"}
                          </div>
                        </td>
                        <td style={{ padding: "12px 14px", textAlign: "right" }}>
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
        {/* VIEW 12: GITHUB ACTIONS CI/CD WORKFLOWS */}
        {/* ========================================================================= */}
        {activeTab === "workflows" && (
          <div className="fade-in">
            <GitHubWorkflowsTab />
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 13: ADMIN CONSOLE */}
        {/* ========================================================================= */}
        {activeTab === "admin" && isAdmin && (
          <div className="fade-in">
            <AdminConsole currentUserEmail={user.email} />
          </div>
        )}

      </main>

    </div>
  );
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: "75vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid rgba(59, 130, 246, 0.2)", borderTopColor: "#3B82F6", borderRadius: "50%", animation: "spin 1s linear infinite" }} />
        <p style={{ color: "#94A3B8", fontSize: "0.9rem" }}>Loading customer portal...</p>
      </div>
    }>
      <AccountPageContent />
    </Suspense>
  );
}
