"use client";

import React, { useState } from "react";
import { VantageIcon } from "@/components/BrandIcons";
import { Shield, Lock, FileText, CheckCircle, Network, Users } from "lucide-react";

export default function UviBestPracticesPage() {
  const [activeTab, setActiveTab] = useState("cis");

  return (
    <div className="fade-in" style={{ padding: "2rem", maxWidth: "1200px", margin: "0 auto", paddingBottom: "5rem" }}>
      <header style={{ marginBottom: "2.5rem", display: "flex", alignItems: "center", gap: "1rem" }}>
        <VantageIcon size={48} glow={true} />
        <div>
          <h1 style={{ fontSize: "2.2rem", margin: 0 }}>OS Hardening & Best Practices</h1>
          <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", margin: "0.25rem 0 0 0" }}>
            Industry standard techniques for securing environments alongside the Vantage feed.
          </p>
        </div>
      </header>

      {/* TABS */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1rem" }}>
        <button 
          className={`tab-btn ${activeTab === "cis" ? "active" : ""}`}
          onClick={() => setActiveTab("cis")}
          style={{ padding: "0.75rem 1.5rem", background: "transparent", border: "none", color: activeTab === "cis" ? "#C084FC" : "var(--text-muted)", borderBottom: activeTab === "cis" ? "2px solid #C084FC" : "2px solid transparent", cursor: "pointer", fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}
        >
          <FileText size={18} /> CIS Benchmarks
        </button>
        <button 
          className={`tab-btn ${activeTab === "network" ? "active" : ""}`}
          onClick={() => setActiveTab("network")}
          style={{ padding: "0.75rem 1.5rem", background: "transparent", border: "none", color: activeTab === "network" ? "#C084FC" : "var(--text-muted)", borderBottom: activeTab === "network" ? "2px solid #C084FC" : "2px solid transparent", cursor: "pointer", fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Network size={18} /> Network Defense
        </button>
        <button 
          className={`tab-btn ${activeTab === "access" ? "active" : ""}`}
          onClick={() => setActiveTab("access")}
          style={{ padding: "0.75rem 1.5rem", background: "transparent", border: "none", color: activeTab === "access" ? "#C084FC" : "var(--text-muted)", borderBottom: activeTab === "access" ? "2px solid #C084FC" : "2px solid transparent", cursor: "pointer", fontSize: "1rem", fontWeight: 600, display: "flex", alignItems: "center", gap: "8px" }}
        >
          <Users size={18} /> Identity & Access
        </button>
      </div>

      {/* CONTENT: CIS BENCHMARKS */}
      {activeTab === "cis" && (
        <div className="glass-card fade-in" style={{ padding: "2.5rem", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <div style={{ padding: "12px", background: "rgba(192, 132, 252, 0.15)", borderRadius: "12px", color: "#C084FC" }}>
              <Shield size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: "1.6rem" }}>Center for Internet Security (CIS) Baselines</h2>
          </div>
          
          <p style={{ color: "#E2E8F0", lineHeight: 1.6, marginBottom: "2rem" }}>
            The CIS Benchmarks are consensus-based, best-practice security configuration guides developed and accepted by government, business, industry, and academia. They provide a critical foundation for OS container security in conjunction with real-time Vantage mitigations.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", color: "#C084FC" }}>Level 1: Essential Defense</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.95rem", lineHeight: 1.5 }}>
                Level 1 profiles are intended to be practical, provide a clear security benefit, and not inhibit the utility of the technology beyond acceptable means.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0", fontSize: "0.9rem" }}><CheckCircle size={16} color="#10B981" /> Ensure GPG keys are configured</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0", fontSize: "0.9rem" }}><CheckCircle size={16} color="#10B981" /> Disable unused filesystems (e.g., cramfs, freevxfs)</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0", fontSize: "0.9rem" }}><CheckCircle size={16} color="#10B981" /> Ensure package manager repositories are verified</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0", fontSize: "0.9rem" }}><CheckCircle size={16} color="#10B981" /> Set appropriate permissions on bootloader config</li>
              </ul>
            </div>

            <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.03)", borderRadius: "12px", border: "1px solid var(--border-color)" }}>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem", color: "#C084FC" }}>Level 2: Strict Security</h3>
              <p style={{ color: "var(--text-muted)", marginBottom: "1rem", fontSize: "0.95rem", lineHeight: 1.5 }}>
                Level 2 profiles are intended for environments or use cases where security is paramount, acting as a defense-in-depth measure. This may negatively impact the utility or performance of the technology.
              </p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0", fontSize: "0.9rem" }}><CheckCircle size={16} color="#10B981" /> Ensure IPv6 router advertisements are not accepted</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0", fontSize: "0.9rem" }}><CheckCircle size={16} color="#10B981" /> Disable X Window System (if applicable)</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0", fontSize: "0.9rem" }}><CheckCircle size={16} color="#10B981" /> Ensure auditing for processes that collect user info</li>
                <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "#E2E8F0", fontSize: "0.9rem" }}><CheckCircle size={16} color="#10B981" /> Ensure default group for root account is GID 0</li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT: NETWORK DEFENSE */}
      {activeTab === "network" && (
        <div className="glass-card fade-in" style={{ padding: "2.5rem", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <div style={{ padding: "12px", background: "rgba(192, 132, 252, 0.15)", borderRadius: "12px", color: "#C084FC" }}>
              <Network size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: "1.6rem" }}>Network Configuration & Boundaries</h2>
          </div>
          
          <p style={{ color: "#E2E8F0", lineHeight: 1.6, marginBottom: "2rem" }}>
            Configuring robust networking boundaries prevents lateral movement and unauthorized egress. Vantage automatically injects known C2 IPs, but structural networking restrictions are essential for a zero-trust model.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
            <div style={{ borderLeft: "4px solid #C084FC", paddingLeft: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>1. Disable Unused Protocols</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>Disable protocols like DCCP, SCTP, RDS, and TIPC unless absolutely required by the application. This restricts the kernel attack surface exposed over network sockets.</p>
            </div>
            <div style={{ borderLeft: "4px solid #C084FC", paddingLeft: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>2. TCP Wrapper Configuration</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>Ensure <code>/etc/hosts.allow</code> and <code>/etc/hosts.deny</code> are configured to strictly drop unspecified traffic if using legacy daemon services. A default-deny firewall rule (iptables/nftables) is mandatory.</p>
            </div>
            <div style={{ borderLeft: "4px solid #C084FC", paddingLeft: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>3. Kernel Network Parameters</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>Enable IP Spoofing protection via <code>net.ipv4.conf.all.rp_filter = 1</code>. Disable IP Forwarding (unless operating as a router) and ignore ICMP broadcasts to prevent smurf attacks.</p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENT: IDENTITY & ACCESS */}
      {activeTab === "access" && (
        <div className="glass-card fade-in" style={{ padding: "2.5rem", borderRadius: "16px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem" }}>
            <div style={{ padding: "12px", background: "rgba(192, 132, 252, 0.15)", borderRadius: "12px", color: "#C084FC" }}>
              <Lock size={24} />
            </div>
            <h2 style={{ margin: 0, fontSize: "1.6rem" }}>Identity, Access & Permissions</h2>
          </div>
          
          <p style={{ color: "#E2E8F0", lineHeight: 1.6, marginBottom: "2rem" }}>
            System accounts must be tightly regulated. If an attacker bypasses the network layer using a vulnerability in the Vantage feed, strict IAM boundaries prevent privilege escalation.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "1.5rem" }}>
            <div style={{ borderLeft: "4px solid #C084FC", paddingLeft: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>1. Distroless Containers</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>Use "distroless" images that omit the package manager (apt/apk/yum), shells (bash/sh), and other standard Linux utilities. Applications should run as non-root, explicitly defined users.</p>
            </div>
            <div style={{ borderLeft: "4px solid #C084FC", paddingLeft: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>2. Strict File Permissions</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>Ensure critical system files (e.g. <code>/etc/shadow</code>, <code>/etc/passwd</code>) possess the correct ownership (root:root) and restrict permissions strictly to <code>0644</code> or <code>0600</code>.</p>
            </div>
            <div style={{ borderLeft: "4px solid #C084FC", paddingLeft: "1.5rem" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: "0.5rem" }}>3. SUID and SGID Binaries</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>Audit and remove unexpected SUID (Set Owner User ID) and SGID (Set Group ID) files. Attackers leverage these binaries to gain elevated privileges if they compromise a low-privilege service account.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
