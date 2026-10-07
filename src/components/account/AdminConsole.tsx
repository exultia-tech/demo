"use client";

import { useState, useEffect } from "react";
import { 
  ShieldAlert, 
  ShieldCheck, 
  Users, 
  Activity, 
  RefreshCw, 
  Search, 
  Filter, 
  Globe, 
  Smartphone, 
  Laptop, 
  AlertTriangle, 
  CheckCircle2, 
  Eye, 
  Mail, 
  Server, 
  KeyRound, 
  Database, 
  Clock, 
  ArrowUpRight,
  UserCheck
} from "lucide-react";
import { PureIdeIcon, VantageIcon, InquestIcon, AxiomIcon, PraxisIcon, PureOsIcon } from "@/components/BrandIcons";

interface ComplianceReport {
  userId: string;
  email: string;
  name: string | null;
  activeProducts: string[];
  subscriptionTiers: Record<string, string>;
  uniqueIpsCount: number;
  uniqueDevicesCount: number;
  recentIps: string[];
  recentDevices: string[];
  totalTouches: number;
  lastActive: string | null;
  complianceStatus: "COMPLIANT" | "MONITORED" | "SUSPECTED_SHARING";
  flagReason?: string;
}

interface RecentActivityItem {
  id: string;
  userId: string;
  userEmail: string;
  product: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: string | null;
}

interface SystemStats {
  totalUsers: number;
  totalSubscriptions: number;
  activePaidSubscriptions: number;
  totalApiTokens: number;
  totalCases: number;
  totalThreats: number;
  totalRecordedTouches: number;
}

interface AdminAuditData {
  windowHours: number;
  summary: {
    totalAccountsAudited: number;
    flaggedAccountsCount: number;
    reports: ComplianceReport[];
  };
  recentActivity: RecentActivityItem[];
  systemStats: SystemStats;
}

export default function AdminConsole({ currentUserEmail }: { currentUserEmail: string }) {
  const [data, setData] = useState<AdminAuditData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [windowHours, setWindowHours] = useState(168); // 7 days default
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "SUSPECTED_SHARING" | "MONITORED" | "COMPLIANT">("ALL");
  const [selectedUserForDetail, setSelectedUserForDetail] = useState<ComplianceReport | null>(null);
  const [noticeSentMessage, setNoticeSentMessage] = useState<string | null>(null);

  const fetchAuditData = async (hours = windowHours) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/admin/license-audit?windowHours=${hours}`, { cache: "no-store" });
      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || "Failed to load audit data");
      }
      const json = await res.json();
      setData(json);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditData(windowHours);
  }, [windowHours]);

  const handleSendNotice = (email: string) => {
    setNoticeSentMessage(`Enterprise upgrade guidance and single-user compliance notice sent to ${email}`);
    setTimeout(() => setNoticeSentMessage(null), 5000);
  };

  const getProductIcon = (product: string) => {
    switch (product.toLowerCase()) {
      case "pureide": return <PureIdeIcon size={16} />;
      case "uvi": return <VantageIcon size={16} />;
      case "inquest": return <InquestIcon size={16} />;
      case "fixlist": return <PraxisIcon size={16} />;
      case "pureos": return <PureOsIcon size={16} />;
      case "axiom": return <AxiomIcon size={16} />;
      default: return <Server size={14} color="#94A3B8" />;
    }
  };

  const parseUserAgent = (ua: string) => {
    if (!ua || ua === "unknown") return "Unknown Client";
    if (ua.includes("Windows")) return "Windows Workstation";
    if (ua.includes("Macintosh") || ua.includes("Mac OS")) return "macOS Client";
    if (ua.includes("Linux")) return "Linux Host";
    if (ua.includes("Android")) return "Android Device";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS Device";
    if (ua.includes("PureIDE")) return "PureIDE Desktop Engine";
    return ua.slice(0, 32);
  };

  const filteredReports = data?.summary.reports.filter(r => {
    const matchesSearch = 
      r.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.name && r.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
      r.userId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter = 
      statusFilter === "ALL" || r.complianceStatus === statusFilter;

    return matchesSearch && matchesFilter;
  }) || [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {/* Top Banner & Control Bar */}
      <div style={{
        background: "linear-gradient(135deg, rgba(245, 158, 11, 0.12) 0%, rgba(15, 23, 42, 0.9) 100%)",
        border: "1px solid rgba(245, 158, 11, 0.35)",
        borderRadius: "18px",
        padding: "1.75rem 2rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1.25rem"
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.4rem" }}>
            <span style={{ fontSize: "1.6rem" }}>🛡️</span>
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              Admin Surveillance & License Console
            </h2>
            <span style={{
              background: "rgba(245, 158, 11, 0.2)",
              color: "#FDE68A",
              border: "1px solid rgba(245, 158, 11, 0.4)",
              borderRadius: "6px",
              padding: "2px 8px",
              fontSize: "0.72rem",
              fontWeight: 800,
              textTransform: "uppercase"
            }}>
              Trust-but-Verify Active
            </span>
          </div>
          <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: 0, maxWidth: "700px" }}>
            Passive monitoring console for single-user Pro license adherence, multi-seat anomaly detection, and ecosystem telemetry across all six products.
          </p>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          {/* Time window selector */}
          <div style={{ display: "flex", background: "rgba(0,0,0,0.4)", borderRadius: "8px", padding: "3px", border: "1px solid rgba(255,255,255,0.1)" }}>
            <button
              onClick={() => setWindowHours(24)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: windowHours === 24 ? "rgba(245, 158, 11, 0.25)" : "transparent",
                color: windowHours === 24 ? "#FDE68A" : "#94A3B8",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              24h
            </button>
            <button
              onClick={() => setWindowHours(168)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: windowHours === 168 ? "rgba(245, 158, 11, 0.25)" : "transparent",
                color: windowHours === 168 ? "#FDE68A" : "#94A3B8",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              7 Days
            </button>
            <button
              onClick={() => setWindowHours(720)}
              style={{
                padding: "6px 12px",
                borderRadius: "6px",
                border: "none",
                background: windowHours === 720 ? "rgba(245, 158, 11, 0.25)" : "transparent",
                color: windowHours === 720 ? "#FDE68A" : "#94A3B8",
                fontSize: "0.78rem",
                fontWeight: 700,
                cursor: "pointer"
              }}
            >
              30 Days
            </button>
          </div>

          <button
            onClick={() => fetchAuditData()}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.15)",
              borderRadius: "8px",
              color: "#FFFFFF",
              fontSize: "0.82rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {noticeSentMessage && (
        <div style={{
          padding: "1rem 1.5rem",
          background: "rgba(34, 197, 94, 0.12)",
          border: "1px solid rgba(34, 197, 94, 0.35)",
          borderRadius: "12px",
          color: "#86EFAC",
          fontSize: "0.88rem",
          display: "flex",
          alignItems: "center",
          gap: "8px"
        }}>
          <CheckCircle2 size={16} color="#22C55E" />
          <span>{noticeSentMessage}</span>
        </div>
      )}

      {error && (
        <div style={{
          padding: "1rem 1.5rem",
          background: "rgba(239, 68, 68, 0.12)",
          border: "1px solid rgba(239, 68, 68, 0.35)",
          borderRadius: "12px",
          color: "#FCA5A5",
          fontSize: "0.88rem"
        }}>
          ⚠️ Error loading admin telemetry: {error}
        </div>
      )}

      {/* KPI Stats Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1rem" }}>
        {/* Card 1: Flagged Accounts */}
        <div style={{
          background: (data?.summary.flaggedAccountsCount || 0) > 0 ? "rgba(239, 68, 68, 0.08)" : "rgba(15, 23, 42, 0.6)",
          border: (data?.summary.flaggedAccountsCount || 0) > 0 ? "1px solid rgba(239, 68, 68, 0.4)" : "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          padding: "1.25rem 1.5rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Suspected Sharing</span>
            <ShieldAlert size={18} color={(data?.summary.flaggedAccountsCount || 0) > 0 ? "#EF4444" : "#10B981"} />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: (data?.summary.flaggedAccountsCount || 0) > 0 ? "#F87171" : "#10B981" }}>
            {data?.summary.flaggedAccountsCount ?? 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "4px" }}>
            Accounts with 5+ IPs/devices on Pro single-seat
          </div>
        </div>

        {/* Card 2: Total Registered Accounts */}
        <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Registered Accounts</span>
            <Users size={18} color="#60A5FA" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#FFFFFF" }}>
            {data?.systemStats.totalUsers ?? 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "4px" }}>
            {data?.systemStats.activePaidSubscriptions ?? 0} active paid subscriptions
          </div>
        </div>

        {/* Card 3: Telemetry Touches Recorded */}
        <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Telemetry Check-Ins</span>
            <Activity size={18} color="#A78BFA" />
          </div>
          <div style={{ fontSize: "2rem", fontWeight: 800, color: "#C084FC" }}>
            {data?.systemStats.totalRecordedTouches ?? 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "4px" }}>
            Passive 15m debounced touches
          </div>
        </div>

        {/* Card 4: Platform Assets */}
        <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "16px", padding: "1.25rem 1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
            <span style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Platform Fleet</span>
            <Database size={18} color="#34D399" />
          </div>
          <div style={{ fontSize: "1.25rem", fontWeight: 800, color: "#34D399", marginTop: "4px" }}>
            {data?.systemStats.totalThreats ?? 0} Threats · {data?.systemStats.totalCases ?? 0} Cases
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "4px" }}>
            {data?.systemStats.totalApiTokens ?? 0} Programmatic API Tokens
          </div>
        </div>
      </div>

      {/* Main Section: Trust-but-Verify Compliance Audit Table */}
      <div style={{
        background: "rgba(15, 23, 42, 0.7)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "18px",
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem"
      }}>
        {/* Table Filters & Search */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
              Account License Footprint & Concurrency Audit
            </h3>
            <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
              Auditing all user activity within the trailing {windowHours} hours window
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
            {/* Search Box */}
            <div style={{ position: "relative", minWidth: "220px" }}>
              <Search size={14} color="#94A3B8" style={{ position: "absolute", left: "10px", top: "50%", transform: "translateY(-50%)" }} />
              <input
                type="text"
                placeholder="Search email, name or ID..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  width: "100%",
                  padding: "7px 12px 7px 32px",
                  background: "rgba(0, 0, 0, 0.3)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                  fontSize: "0.82rem",
                  outline: "none"
                }}
              />
            </div>

            {/* Filter Badges */}
            <div style={{ display: "flex", background: "rgba(0,0,0,0.3)", borderRadius: "8px", padding: "2px", border: "1px solid rgba(255,255,255,0.08)" }}>
              <button
                onClick={() => setStatusFilter("ALL")}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "none",
                  background: statusFilter === "ALL" ? "rgba(255,255,255,0.12)" : "transparent",
                  color: statusFilter === "ALL" ? "#FFFFFF" : "#94A3B8",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                All ({data?.summary.reports.length ?? 0})
              </button>
              <button
                onClick={() => setStatusFilter("SUSPECTED_SHARING")}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "none",
                  background: statusFilter === "SUSPECTED_SHARING" ? "rgba(239, 68, 68, 0.25)" : "transparent",
                  color: statusFilter === "SUSPECTED_SHARING" ? "#FCA5A5" : "#94A3B8",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Sharing Flagged ({data?.summary.flaggedAccountsCount ?? 0})
              </button>
              <button
                onClick={() => setStatusFilter("MONITORED")}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "none",
                  background: statusFilter === "MONITORED" ? "rgba(245, 158, 11, 0.2)" : "transparent",
                  color: statusFilter === "MONITORED" ? "#FDE68A" : "#94A3B8",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Monitored
              </button>
              <button
                onClick={() => setStatusFilter("COMPLIANT")}
                style={{
                  padding: "5px 10px",
                  borderRadius: "6px",
                  border: "none",
                  background: statusFilter === "COMPLIANT" ? "rgba(16, 185, 129, 0.2)" : "transparent",
                  color: statusFilter === "COMPLIANT" ? "#86EFAC" : "#94A3B8",
                  fontSize: "0.75rem",
                  fontWeight: 600,
                  cursor: "pointer"
                }}
              >
                Compliant
              </button>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.82rem", textAlign: "left" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.1)", color: "#94A3B8" }}>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>User / Email</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Active Subscriptions</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Distinct IPs</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Distinct Devices</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Check-Ins</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 600 }}>Compliance Status</th>
                <th style={{ padding: "0.75rem 1rem", fontWeight: 600, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>
                    <RefreshCw size={24} className="animate-spin" style={{ margin: "0 auto 0.75rem auto", opacity: 0.7 }} />
                    <div>Loading trust-but-verify telemetry audit...</div>
                  </td>
                </tr>
              ) : filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "2.5rem", textAlign: "center", color: "#94A3B8" }}>
                    No user accounts match the current filter or search criteria.
                  </td>
                </tr>
              ) : (
                filteredReports.map(rep => {
                  const hasEnterprise = Object.values(rep.subscriptionTiers).some(t => t.toLowerCase() === "enterprise");
                  return (
                    <tr
                      key={rep.userId}
                      style={{
                        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
                        background: rep.complianceStatus === "SUSPECTED_SHARING" ? "rgba(239, 68, 68, 0.04)" : "transparent",
                        transition: "background 0.15s ease"
                      }}
                    >
                      {/* Email & Name */}
                      <td style={{ padding: "1rem" }}>
                        <div style={{ fontWeight: 700, color: "#FFFFFF" }}>{rep.email}</div>
                        <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                          {rep.name || "User ID: " + rep.userId.slice(0, 14)}
                        </div>
                      </td>

                      {/* Subscriptions */}
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                          {Object.entries(rep.subscriptionTiers).map(([prod, tier]) => (
                            <span
                              key={prod}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                background: tier === "enterprise" ? "rgba(167, 139, 250, 0.15)" : (tier === "pro" || tier === "legal" ? "rgba(96, 165, 250, 0.15)" : "rgba(255,255,255,0.06)"),
                                color: tier === "enterprise" ? "#C084FC" : (tier === "pro" || tier === "legal" ? "#93C5FD" : "#94A3B8"),
                                border: "1px solid rgba(255,255,255,0.1)",
                                borderRadius: "6px",
                                padding: "2px 6px",
                                fontSize: "0.68rem",
                                fontWeight: 700,
                                textTransform: "uppercase"
                              }}
                            >
                              {getProductIcon(prod)}
                              {prod}: {tier}
                            </span>
                          ))}
                          {Object.keys(rep.subscriptionTiers).length === 0 && (
                            <span style={{ color: "#64748B", fontSize: "0.72rem" }}>Free tier only</span>
                          )}
                        </div>
                      </td>

                      {/* Distinct IPs */}
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Globe size={14} color={rep.uniqueIpsCount >= 5 ? "#EF4444" : (rep.uniqueIpsCount >= 3 ? "#F59E0B" : "#10B981")} />
                          <strong style={{ color: rep.uniqueIpsCount >= 5 ? "#F87171" : "#FFFFFF" }}>{rep.uniqueIpsCount}</strong>
                          <span style={{ color: "#94A3B8", fontSize: "0.72rem" }}>IPs</span>
                        </div>
                        {rep.recentIps.length > 0 && (
                          <div style={{ fontSize: "0.68rem", color: "#64748B", marginTop: "2px", fontFamily: "monospace" }}>
                            {rep.recentIps[0]}
                          </div>
                        )}
                      </td>

                      {/* Distinct Devices */}
                      <td style={{ padding: "1rem" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <Laptop size={14} color={rep.uniqueDevicesCount >= 5 ? "#EF4444" : (rep.uniqueDevicesCount >= 3 ? "#F59E0B" : "#10B981")} />
                          <strong style={{ color: rep.uniqueDevicesCount >= 5 ? "#F87171" : "#FFFFFF" }}>{rep.uniqueDevicesCount}</strong>
                          <span style={{ color: "#94A3B8", fontSize: "0.72rem" }}>devices</span>
                        </div>
                        {rep.recentDevices.length > 0 && (
                          <div style={{ fontSize: "0.68rem", color: "#64748B", marginTop: "2px" }}>
                            {parseUserAgent(rep.recentDevices[0])}
                          </div>
                        )}
                      </td>

                      {/* Check-Ins Count */}
                      <td style={{ padding: "1rem", color: "#CBD5E1" }}>
                        <div>{rep.totalTouches} touches</div>
                        {rep.lastActive && (
                          <div style={{ fontSize: "0.68rem", color: "#64748B" }}>
                            {new Date(rep.lastActive).toLocaleDateString()}
                          </div>
                        )}
                      </td>

                      {/* Compliance Status Badge */}
                      <td style={{ padding: "1rem" }}>
                        {hasEnterprise ? (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            background: "rgba(167, 139, 250, 0.15)",
                            color: "#C084FC",
                            border: "1px solid rgba(167, 139, 250, 0.35)",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            fontSize: "0.72rem",
                            fontWeight: 700
                          }}>
                            <ShieldCheck size={12} />
                            Enterprise Fleet (Volume)
                          </span>
                        ) : rep.complianceStatus === "SUSPECTED_SHARING" ? (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            background: "rgba(239, 68, 68, 0.2)",
                            color: "#F87171",
                            border: "1px solid rgba(239, 68, 68, 0.4)",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            fontSize: "0.72rem",
                            fontWeight: 800
                          }}>
                            <AlertTriangle size={12} />
                            Suspected Sharing ({rep.uniqueIpsCount} IPs)
                          </span>
                        ) : rep.complianceStatus === "MONITORED" ? (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            background: "rgba(245, 158, 11, 0.15)",
                            color: "#FDE68A",
                            border: "1px solid rgba(245, 158, 11, 0.35)",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            fontSize: "0.72rem",
                            fontWeight: 700
                          }}>
                            Monitored Multi-Device
                          </span>
                        ) : (
                          <span style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                            background: "rgba(16, 185, 129, 0.15)",
                            color: "#86EFAC",
                            border: "1px solid rgba(16, 185, 129, 0.35)",
                            borderRadius: "6px",
                            padding: "3px 8px",
                            fontSize: "0.72rem",
                            fontWeight: 700
                          }}>
                            <CheckCircle2 size={12} />
                            Compliant Single User
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: "1rem", textAlign: "right" }}>
                        <div style={{ display: "inline-flex", gap: "6px" }}>
                          <button
                            onClick={() => setSelectedUserForDetail(rep)}
                            style={{
                              padding: "5px 10px",
                              background: "rgba(255, 255, 255, 0.08)",
                              border: "1px solid rgba(255, 255, 255, 0.15)",
                              borderRadius: "6px",
                              color: "#FFFFFF",
                              fontSize: "0.72rem",
                              fontWeight: 600,
                              cursor: "pointer",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "4px"
                            }}
                          >
                            <Eye size={12} />
                            Footprint
                          </button>

                          {rep.complianceStatus === "SUSPECTED_SHARING" && (
                            <button
                              onClick={() => handleSendNotice(rep.email)}
                              style={{
                                padding: "5px 10px",
                                background: "rgba(245, 158, 11, 0.2)",
                                border: "1px solid rgba(245, 158, 11, 0.4)",
                                borderRadius: "6px",
                                color: "#FDE68A",
                                fontSize: "0.72rem",
                                fontWeight: 700,
                                cursor: "pointer",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                              }}
                            >
                              <Mail size={12} />
                              Enterprise Invite
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Live System Activity Feed (Recent Touches) */}
      <div style={{
        background: "rgba(15, 23, 42, 0.7)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "18px",
        padding: "1.75rem",
        display: "flex",
        flexDirection: "column",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", margin: 0 }}>
              Live Telemetry Feed (Real-Time Touches)
            </h3>
            <span style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
              Most recent 30 passive check-ins across PureIDE, Vantage, Inquest, Praxis, PureOS, and Axiom
            </span>
          </div>
          <span style={{ fontSize: "0.72rem", color: "#10B981", display: "flex", alignItems: "center", gap: "6px" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", display: "inline-block" }}></span>
            Stream Operational
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", maxHeight: "380px", overflowY: "auto" }}>
          {data?.recentActivity.length === 0 ? (
            <div style={{ padding: "2rem", textAlign: "center", color: "#94A3B8", fontSize: "0.82rem" }}>
              No recent license touches recorded yet. Activity will populate automatically as users login and use the platform.
            </div>
          ) : (
            data?.recentActivity.map(item => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "0.75rem 1rem",
                  background: "rgba(255, 255, 255, 0.03)",
                  border: "1px solid rgba(255, 255, 255, 0.05)",
                  borderRadius: "10px",
                  fontSize: "0.8rem",
                  gap: "1rem"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ padding: "4px 8px", background: "rgba(255,255,255,0.06)", borderRadius: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
                    {getProductIcon(item.product)}
                    <span style={{ fontWeight: 700, fontSize: "0.72rem", textTransform: "uppercase", color: "#E2E8F0" }}>
                      {item.product}
                    </span>
                  </div>
                  <div>
                    <span style={{ color: "#FFFFFF", fontWeight: 600 }}>{item.userEmail}</span>
                    <span style={{ color: "#94A3B8", fontSize: "0.72rem", marginLeft: "8px" }}>action: {item.action}</span>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", color: "#94A3B8", fontSize: "0.75rem" }}>
                  <span style={{ fontFamily: "monospace", color: "#60A5FA" }}>{item.ipAddress}</span>
                  <span>{parseUserAgent(item.userAgent)}</span>
                  <span>{item.timestamp ? new Date(item.timestamp).toLocaleTimeString() : "Just now"}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* User Device Footprint Detail Modal */}
      {selectedUserForDetail && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,0.8)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1rem"
        }}>
          <div style={{
            maxWidth: "600px",
            width: "100%",
            background: "#0F172A",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: "18px",
            padding: "2rem",
            position: "relative"
          }}>
            <button
              onClick={() => setSelectedUserForDetail(null)}
              style={{
                position: "absolute",
                top: "1.25rem",
                right: "1.25rem",
                background: "transparent",
                border: "none",
                color: "#94A3B8",
                fontSize: "1.25rem",
                cursor: "pointer"
              }}
            >
              ✕
            </button>

            <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.25rem" }}>
              Workstation & Network Footprint
            </h3>
            <div style={{ fontSize: "0.85rem", color: "#60A5FA", marginBottom: "1.25rem" }}>
              {selectedUserForDetail.email}
            </div>

            {selectedUserForDetail.flagReason && (
              <div style={{
                padding: "0.75rem 1rem",
                background: "rgba(239, 68, 68, 0.12)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                color: "#FCA5A5",
                fontSize: "0.82rem",
                marginBottom: "1.25rem"
              }}>
                ⚠️ <strong>Flag Rationale:</strong> {selectedUserForDetail.flagReason}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "1.5rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                  Observed IP Addresses ({selectedUserForDetail.uniqueIpsCount})
                </span>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginTop: "4px" }}>
                  {selectedUserForDetail.recentIps.map(ip => (
                    <span key={ip} style={{ padding: "4px 8px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "6px", fontFamily: "monospace", fontSize: "0.75rem", color: "#93C5FD" }}>
                      {ip}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>
                  Observed Workstation & Client Profiles ({selectedUserForDetail.uniqueDevicesCount})
                </span>
                <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginTop: "4px" }}>
                  {selectedUserForDetail.recentDevices.map((ua, idx) => (
                    <div key={idx} style={{ padding: "6px 10px", background: "rgba(0,0,0,0.4)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "6px", fontSize: "0.75rem", color: "#CBD5E1" }}>
                      <strong>{parseUserAgent(ua)}</strong>
                      <div style={{ fontSize: "0.68rem", color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {ua}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                onClick={() => {
                  handleSendNotice(selectedUserForDetail.email);
                  setSelectedUserForDetail(null);
                }}
                style={{
                  padding: "8px 16px",
                  background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
                  border: "none",
                  borderRadius: "8px",
                  color: "#000",
                  fontWeight: 700,
                  fontSize: "0.82rem",
                  cursor: "pointer"
                }}
              >
                Send Enterprise Notice
              </button>
              <button
                onClick={() => setSelectedUserForDetail(null)}
                style={{
                  padding: "8px 16px",
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "8px",
                  color: "#FFFFFF",
                  fontSize: "0.82rem",
                  cursor: "pointer"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
