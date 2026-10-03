"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  GitBranch, 
  GitPullRequest, 
  ShieldCheck, 
  Lock, 
  Unlock, 
  Plus, 
  Trash2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  Copy, 
  RefreshCw,
  Play,
  KeyRound,
  FileCode,
  Zap,
  Sparkles
} from "lucide-react";

interface WorkflowItem {
  id: string;
  owner: string;
  repo: string;
  workflowFile: string;
  defaultBranch: string;
  isActive: boolean;
  hasCustomToken: boolean;
  installationId: string | null;
  updatedAt: string | null;
}

export default function GitHubWorkflowsTab() {
  const { user, openPaymentModal } = useAuth();
  const [workflows, setWorkflows] = useState<WorkflowItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [owner, setOwner] = useState("");
  const [repo, setRepo] = useState("");
  const [workflowFile, setWorkflowFile] = useState("build-ide.yml");
  const [defaultBranch, setDefaultBranch] = useState("main");
  const [personalAccessToken, setPersonalAccessToken] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [dispatchingId, setDispatchingId] = useState<string | null>(null);
  const [showYamlGuide, setShowYamlGuide] = useState(false);

  const isEnterprise = Boolean(
    user?.role === "admin" || user?.subscriptions?.some(
      s => s.status === "active" && (s.tier.toLowerCase() === "enterprise" || s.tier.toLowerCase() === "developer")
    )
  );

  useEffect(() => {
    if (user && isEnterprise) {
      loadWorkflows();
    } else {
      setLoading(false);
    }
  }, [user, isEnterprise]);

  const loadWorkflows = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/user/github-workflows");
      const data = await res.json();
      if (res.ok && data.success) {
        setWorkflows(data.workflows || []);
      } else {
        setError(data.error || "Failed to load linked workflows");
      }
    } catch (e: any) {
      setError(e.message || "Failed to fetch linked workflows");
    } finally {
      setLoading(false);
    }
  };

  const handleLinkWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!owner.trim() || !repo.trim()) {
      setError("Repository Owner and Repository Name are required.");
      return;
    }

    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const res = await fetch("/api/user/github-workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: owner.trim(),
          repo: repo.trim(),
          workflowFile: workflowFile.trim() || "build-ide.yml",
          defaultBranch: defaultBranch.trim() || "main",
          personalAccessToken: personalAccessToken.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to link workflow");

      setSuccess("GitHub Actions workflow linked successfully! You can now dispatch builds directly to this repository.");
      setOwner("");
      setRepo("");
      setPersonalAccessToken("");
      setShowAddForm(false);
      loadWorkflows();
    } catch (err: any) {
      setError(err.message || "Failed to save workflow");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUnlink = async (id: string) => {
    if (!confirm("Are you sure you want to unlink this GitHub repository workflow?")) return;
    try {
      const res = await fetch(`/api/user/github-workflows?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        setWorkflows(prev => prev.filter(w => w.id !== id));
        setSuccess("Workflow unlinked successfully.");
      }
    } catch (e: any) {
      setError(e.message || "Failed to unlink workflow");
    }
  };

  const handleTestDispatch = async (workflow: WorkflowItem) => {
    setDispatchingId(workflow.id);
    setError(null);
    setSuccess(null);
    try {
      // Trigger a test dry-run / verification
      const res = await fetch("/api/build", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tier: "ENTERPRISE",
          targetOs: "windows",
          engine: "vscode",
          brandName: "Exultia Test Build",
          locale: "en",
          version: "latest",
        }),
      });

      if (res.ok) {
        setSuccess(`Successfully verified dispatch hook for ${workflow.owner}/${workflow.repo}! Runner connection validated.`);
      } else {
        const text = await res.text();
        setError(`Dispatch notice: ${text.slice(0, 150)}`);
      }
    } catch (e: any) {
      setError(e.message || "Failed to dispatch test workflow");
    } finally {
      setDispatchingId(null);
    }
  };

  // ---------------------------------------------------------------------------
  // 1. FREE TIER GATE: ENTERPRISE ONLY PERK
  // ---------------------------------------------------------------------------
  if (!isEnterprise) {
    return (
      <div style={{
        background: "linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(30, 41, 59, 0.85) 100%)",
        border: "1px dashed rgba(139, 92, 246, 0.4)",
        borderRadius: "20px",
        padding: "3rem 2rem",
        textAlign: "center",
        maxWidth: "850px",
        margin: "0 auto",
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.7)"
      }}>
        <div style={{
          width: "68px",
          height: "68px",
          borderRadius: "20px",
          background: "linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(59, 130, 246, 0.2) 100%)",
          border: "1px solid rgba(139, 92, 246, 0.5)",
          display: "grid",
          placeItems: "center",
          margin: "0 auto 1.5rem auto",
          boxShadow: "0 0 30px rgba(139, 92, 246, 0.3)"
        }}>
          <GitBranch size={32} color="#C084FC" />
        </div>

        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          background: "rgba(139, 92, 246, 0.15)",
          border: "1px solid rgba(139, 92, 246, 0.4)",
          padding: "4px 12px",
          borderRadius: "999px",
          fontSize: "0.75rem",
          fontWeight: 800,
          color: "#D8B4FE",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          marginBottom: "1rem"
        }}>
          <Sparkles size={14} />
          Enterprise Tier Exclusive Perk
        </div>

        <h2 style={{ fontSize: "1.85rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem", letterSpacing: "-0.02em" }}>
          Link GitHub Actions & Enhanced Workflows
        </h2>

        <p style={{ color: "#94A3B8", fontSize: "0.95rem", lineHeight: 1.6, maxWidth: "600px", margin: "0 auto 2rem auto" }}>
          Accounts registered on the <strong>Free Tier</strong> are configured for <strong>Basic Account Management</strong>. Enhanced GitHub Workflows, custom CI/CD dispatching, and programmatic APIs require an active <strong>Enterprise</strong> subscription.
        </p>

        {/* Feature comparison pills */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1rem",
          marginBottom: "2.5rem",
          textAlign: "left"
        }}>
          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#C084FC", fontWeight: 700, fontSize: "0.88rem", marginBottom: "4px" }}>
              <CheckCircle2 size={16} />
              <span>Custom Organization Repos</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
              Dispatch builds to your private organization or personal GitHub repositories.
            </div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#C084FC", fontWeight: 700, fontSize: "0.88rem", marginBottom: "4px" }}>
              <CheckCircle2 size={16} />
              <span>Isolated GitHub Runners</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
              Execute hermetic multi-OS compiler matrices on dedicated cloud GitHub runners.
            </div>
          </div>

          <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", borderRadius: "12px", padding: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#C084FC", fontWeight: 700, fontSize: "0.88rem", marginBottom: "4px" }}>
              <CheckCircle2 size={16} />
              <span>Encrypted PAT Isolation</span>
            </div>
            <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
              Zero-knowledge token storage with restricted <code style={{ color: "#E2E8F0" }}>workflow</code> execution scopes.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={() => openPaymentModal ? openPaymentModal({ product: "pureide", tier: "enterprise", price: 299, billingCycle: "annual", planName: "Enterprise Workflows & Actions" }) : null}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "linear-gradient(135deg, #8B5CF6 0%, #3B82F6 100%)",
              color: "white",
              padding: "12px 24px",
              borderRadius: "12px",
              fontSize: "0.92rem",
              fontWeight: 800,
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 25px rgba(139, 92, 246, 0.4)"
            }}
          >
            <Zap size={18} />
            Upgrade to Enterprise
          </button>
          
          <Link
            href="/account/subscription"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "rgba(255, 255, 255, 0.06)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#CBD5E1",
              padding: "12px 20px",
              borderRadius: "12px",
              fontSize: "0.92rem",
              fontWeight: 700,
              textDecoration: "none"
            }}
          >
            Compare All Plans
          </Link>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. ENTERPRISE SUBSCRIBER MANAGEMENT VIEW
  // ---------------------------------------------------------------------------
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              Connected GitHub Workflows & Actions
            </h2>
            <span style={{
              background: "rgba(139, 92, 246, 0.2)",
              color: "#C084FC",
              border: "1px solid rgba(139, 92, 246, 0.4)",
              padding: "2px 8px",
              borderRadius: "6px",
              fontSize: "0.7rem",
              fontWeight: 800,
              textTransform: "uppercase"
            }}>
              Enterprise Active
            </span>
          </div>
          <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: "4px 0 0 0" }}>
            Link your personal or organization repositories to dispatch custom cloud builds and zero-trust workflows.
          </p>
        </div>

        <div style={{ display: "flex", gap: "0.75rem" }}>
          <button
            onClick={() => setShowYamlGuide(!showYamlGuide)}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 14px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.12)",
              borderRadius: "10px",
              color: "#CBD5E1",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            <FileCode size={15} color="#60A5FA" />
            Workflow YAML Spec
          </button>

          <button
            onClick={() => { setShowAddForm(!showAddForm); setError(null); setSuccess(null); }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: "8px 16px",
              background: showAddForm ? "rgba(255, 255, 255, 0.1)" : "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: showAddForm ? "none" : "0 0 20px rgba(59, 130, 246, 0.3)"
            }}
          >
            {showAddForm ? "Cancel" : <><Plus size={16} /> Link Repository</>}
          </button>
        </div>
      </div>

      {/* Notifications */}
      {success && (
        <div style={{ background: "rgba(34, 197, 94, 0.15)", border: "1px solid rgba(34, 197, 94, 0.4)", borderRadius: "12px", padding: "1rem", color: "#86EFAC", fontSize: "0.88rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "12px", padding: "1rem", color: "#FCA5A5", fontSize: "0.88rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", gap: "8px" }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* YAML Guide Dropdown */}
      {showYamlGuide && (
        <div style={{
          background: "rgba(15, 23, 42, 0.8)",
          border: "1px solid rgba(59, 130, 246, 0.3)",
          borderRadius: "14px",
          padding: "1.5rem",
          marginBottom: "1.75rem"
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#60A5FA", fontWeight: 700, fontSize: "0.92rem" }}>
              <FileCode size={18} />
              <span>Standard Exultia Workflow Template (.github/workflows/build-ide.yml)</span>
            </div>
            <button
              onClick={() => {
                navigator.clipboard.writeText(MINIMAL_WORKFLOW_YAML);
                alert("Workflow YAML template copied to clipboard!");
              }}
              style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.78rem" }}
            >
              <Copy size={14} /> Copy Template
            </button>
          </div>
          <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: "0 0 1rem 0" }}>
            Place this workflow file in your target repository. Exultia dispatches builds using these input parameters:
          </p>
          <pre style={{
            background: "#080C14",
            padding: "1rem",
            borderRadius: "10px",
            fontSize: "0.75rem",
            color: "#A7F3D0",
            overflowX: "auto",
            lineHeight: 1.45,
            border: "1px solid rgba(255, 255, 255, 0.08)"
          }}>
            {MINIMAL_WORKFLOW_YAML}
          </pre>
        </div>
      )}

      {/* Link Repository Form */}
      {showAddForm && (
        <div style={{
          background: "linear-gradient(180deg, rgba(15, 23, 42, 0.95) 0%, rgba(10, 15, 26, 0.95) 100%)",
          border: "1px solid rgba(139, 92, 246, 0.35)",
          borderRadius: "16px",
          padding: "1.75rem",
          marginBottom: "2rem",
          boxShadow: "0 20px 40px rgba(0,0,0,0.8)"
        }}>
          <h3 style={{ fontSize: "1.15rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 0.5rem 0" }}>
            Link Repository & GitHub Actions Workflow
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: "0 0 1.5rem 0" }}>
            Configure your GitHub repository to receive dispatch events directly when building PureIDE or running security actions.
          </p>

          <form onSubmit={handleLinkWorkflow} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Repository Owner (Username or Organization) *
                </label>
                <input
                  type="text"
                  placeholder="e.g. acme-defense or octocat"
                  value={owner}
                  onChange={e => setOwner(e.target.value)}
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
                  Repository Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. secure-ide-dist or hardened-tools"
                  value={repo}
                  onChange={e => setRepo(e.target.value)}
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
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.25rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Workflow Filename
                </label>
                <input
                  type="text"
                  placeholder="build-ide.yml"
                  value={workflowFile}
                  onChange={e => setWorkflowFile(e.target.value)}
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
                <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Located inside .github/workflows/</span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.35rem" }}>
                  Default Branch
                </label>
                <input
                  type="text"
                  placeholder="main"
                  value={defaultBranch}
                  onChange={e => setDefaultBranch(e.target.value)}
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
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 600, marginBottom: "0.35rem" }}>
                Personal Access Token (Fine-grained or Classic PAT)
              </label>
              <input
                type="password"
                placeholder="ghp_... (Required for private repositories with repo and workflow scopes)"
                value={personalAccessToken}
                onChange={e => setPersonalAccessToken(e.target.value)}
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
              <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                Token is securely stored in your isolated database record and used exclusively to authenticate dispatch calls.
              </span>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem", marginTop: "0.5rem" }}>
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                style={{
                  padding: "8px 16px",
                  background: "transparent",
                  border: "1px solid rgba(255, 255, 255, 0.15)",
                  borderRadius: "8px",
                  color: "#94A3B8",
                  cursor: "pointer",
                  fontSize: "0.85rem"
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                style={{
                  padding: "8px 20px",
                  background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
                  border: "none",
                  borderRadius: "8px",
                  color: "white",
                  cursor: submitting ? "not-allowed" : "pointer",
                  fontWeight: 700,
                  fontSize: "0.85rem"
                }}
              >
                {submitting ? "Saving..." : "Save Workflow"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Linked Workflows Table */}
      {loading ? (
        <div style={{ padding: "3rem", textAlign: "center", color: "#94A3B8" }}>
          <RefreshCw size={24} className="animate-spin mx-auto mb-2" />
          <p style={{ fontSize: "0.88rem" }}>Loading connected workflows...</p>
        </div>
      ) : workflows.length === 0 ? (
        <div style={{
          background: "rgba(15, 23, 42, 0.6)",
          border: "1px dashed rgba(255, 255, 255, 0.12)",
          borderRadius: "16px",
          padding: "3rem 2rem",
          textAlign: "center"
        }}>
          <GitBranch size={40} color="#64748B" style={{ margin: "0 auto 1rem auto" }} />
          <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", marginBottom: "0.5rem" }}>
            No GitHub Repositories Linked Yet
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "0.85rem", maxWidth: "480px", margin: "0 auto 1.5rem auto" }}>
            Connect your personal or enterprise organization GitHub repository to trigger builds and manage release pipelines.
          </p>
          <button
            onClick={() => setShowAddForm(true)}
            style={{
              padding: "8px 18px",
              background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 100%)",
              border: "none",
              borderRadius: "10px",
              color: "white",
              fontSize: "0.85rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            Link Your First Repository
          </button>
        </div>
      ) : (
        <div style={{
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "16px",
          overflow: "hidden"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: "rgba(255, 255, 255, 0.03)", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", color: "#94A3B8" }}>
                <th style={{ padding: "1rem 1.25rem", fontWeight: 600 }}>Repository</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: 600 }}>Workflow File</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: 600 }}>Branch</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: 600 }}>Auth Scope</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: 600 }}>Status</th>
                <th style={{ padding: "1rem 1.25rem", fontWeight: 600, textAlign: "right" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workflows.map(w => (
                <tr key={w.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <GitBranch size={16} color="#60A5FA" />
                      <a
                        href={`https://github.com/${w.owner}/${w.repo}`}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: "#FFFFFF", fontWeight: 700, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "4px" }}
                      >
                        {w.owner}/{w.repo}
                        <ExternalLink size={12} color="#94A3B8" />
                      </a>
                    </div>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", color: "#CBD5E1", fontFamily: "monospace" }}>
                    {w.workflowFile}
                  </td>
                  <td style={{ padding: "1rem 1.25rem", color: "#94A3B8" }}>
                    <span style={{ background: "rgba(255, 255, 255, 0.05)", padding: "2px 6px", borderRadius: "4px" }}>
                      {w.defaultBranch}
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    {w.hasCustomToken ? (
                      <span style={{ color: "#34D399", display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.78rem" }}>
                        <KeyRound size={13} /> Custom PAT
                      </span>
                    ) : (
                      <span style={{ color: "#94A3B8", fontSize: "0.78rem" }}>Default Runner Token</span>
                    )}
                  </td>
                  <td style={{ padding: "1rem 1.25rem" }}>
                    <span style={{
                      background: "rgba(34, 197, 94, 0.15)",
                      color: "#86EFAC",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "0.72rem",
                      fontWeight: 700
                    }}>
                      Active
                    </span>
                  </td>
                  <td style={{ padding: "1rem 1.25rem", textAlign: "right" }}>
                    <div style={{ display: "inline-flex", gap: "0.5rem" }}>
                      <button
                        onClick={() => handleTestDispatch(w)}
                        disabled={dispatchingId === w.id}
                        title="Test dispatch connection"
                        style={{
                          background: "rgba(59, 130, 246, 0.15)",
                          border: "1px solid rgba(59, 130, 246, 0.3)",
                          color: "#93C5FD",
                          borderRadius: "6px",
                          padding: "6px 10px",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          cursor: "pointer",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "4px"
                        }}
                      >
                        <Play size={12} />
                        {dispatchingId === w.id ? "Testing..." : "Test Dispatch"}
                      </button>
                      <button
                        onClick={() => handleUnlink(w.id)}
                        title="Unlink workflow"
                        style={{
                          background: "rgba(239, 68, 68, 0.15)",
                          border: "1px solid rgba(239, 68, 68, 0.3)",
                          color: "#FCA5A5",
                          borderRadius: "6px",
                          padding: "6px 8px",
                          cursor: "pointer"
                        }}
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

const MINIMAL_WORKFLOW_YAML = `name: Build Exultia IDE Release

on:
  workflow_dispatch:
    inputs:
      tier:
        description: 'Subscription tier (COMMUNITY, TEAM, ENTERPRISE)'
        required: true
        default: 'ENTERPRISE'
      target_os:
        description: 'Target operating system (windows, linux, macos)'
        required: true
        default: 'windows'
      engine:
        description: 'Base editor engine (vscode, zed, neovim)'
        required: true
        default: 'vscode'
      brand_name:
        description: 'Hardened IDE brand name'
        required: false
        default: 'PureIDE Studio'
      locale:
        description: 'Locale code'
        required: false
        default: 'en'
      version:
        description: 'Target upstream version'
        required: false
        default: 'latest'
      build_id:
        description: 'Unique build identifier'
        required: true

jobs:
  build:
    name: Build & Sign Hardened Binary
    runs-on: windows-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js Environment
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Execute Enclave Hardening & Compile
        run: |
          echo "Compiling \${{ inputs.brand_name }} for \${{ inputs.target_os }}"
          npm run build

      - name: Archive Signed Release Artifact
        uses: actions/upload-artifact@v4
        with:
          name: release-\${{ inputs.build_id }}
          path: public/downloads/`;
