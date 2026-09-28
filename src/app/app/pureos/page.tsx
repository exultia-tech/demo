"use client";

import React, { useState } from "react";
import { PureOsIcon, UviIcon } from "@/components/BrandIcons";
import { Shield, CheckCircle, Terminal, Download, Copy, AlertTriangle } from "lucide-react";

interface ContainerImage {
  id: string;
  name: string;
  tag: string;
  baseOS: string;
  sizeMB: number;
  lastUpdated: string;
  uviMitigations: number;
  cisLevel: string;
}

const PureOS_CATALOGUE: ContainerImage[] = [
  {
    id: "PureOS-alpine-3.19",
    name: "exultia/pureos-alpine",
    tag: "3.19-hardened",
    baseOS: "Alpine Linux 3.19",
    sizeMB: 12.4,
    lastUpdated: "2 hours ago",
    uviMitigations: 142,
    cisLevel: "Level 2",
  },
  {
    id: "PureOS-debian-12",
    name: "exultia/pureos-debian",
    tag: "12-slim-hardened",
    baseOS: "Debian 12 (Bookworm)",
    sizeMB: 38.1,
    lastUpdated: "5 hours ago",
    uviMitigations: 89,
    cisLevel: "Level 1",
  },
  {
    id: "PureOS-ubuntu-24.04",
    name: "exultia/pureos-ubuntu",
    tag: "24.04-lts-hardened",
    baseOS: "Ubuntu 24.04 LTS",
    sizeMB: 84.5,
    lastUpdated: "1 day ago",
    uviMitigations: 215,
    cisLevel: "Level 1",
  },
  {
    id: "PureOS-node-20",
    name: "exultia/pureos-node",
    tag: "20-alpine-hardened",
    baseOS: "Alpine Linux 3.19",
    sizeMB: 55.2,
    lastUpdated: "12 hours ago",
    uviMitigations: 156,
    cisLevel: "Level 2",
  },
  {
    id: "PureOS-python-3.12",
    name: "exultia/pureos-python",
    tag: "3.12-slim-hardened",
    baseOS: "Debian 12 (Bookworm)",
    sizeMB: 62.8,
    lastUpdated: "1 day ago",
    uviMitigations: 98,
    cisLevel: "Level 1",
  },
  {
    id: "PureOS-rocky-9",
    name: "exultia/pureos-rocky",
    tag: "9-hardened",
    baseOS: "Rocky Linux 9",
    sizeMB: 58.2,
    lastUpdated: "3 hours ago",
    uviMitigations: 112,
    cisLevel: "Level 2",
  },
  {
    id: "PureOS-centos-stream-9",
    name: "exultia/pureos-centos",
    tag: "stream-9-hardened",
    baseOS: "CentOS Stream 9",
    sizeMB: 61.5,
    lastUpdated: "4 hours ago",
    uviMitigations: 135,
    cisLevel: "Level 1",
  },
  {
    id: "PureOS-fedora-40",
    name: "exultia/pureos-fedora",
    tag: "40-minimal-hardened",
    baseOS: "Fedora 40",
    sizeMB: 68.3,
    lastUpdated: "1 day ago",
    uviMitigations: 105,
    cisLevel: "Level 1",
  },
  {
    id: "PureOS-golang-1.22",
    name: "exultia/pureos-golang",
    tag: "1.22-rocky-hardened",
    baseOS: "Rocky Linux 9",
    sizeMB: 82.1,
    lastUpdated: "5 hours ago",
    uviMitigations: 112,
    cisLevel: "Level 2",
  },
  {
    id: "PureOS-almalinux-9",
    name: "exultia/pureos-almalinux",
    tag: "9-hardened",
    baseOS: "AlmaLinux 9",
    sizeMB: 58.5,
    lastUpdated: "2 hours ago",
    uviMitigations: 115,
    cisLevel: "Level 2",
  },
  {
    id: "PureOS-rhel-9",
    name: "exultia/pureos-rhel",
    tag: "9-hardened",
    baseOS: "Red Hat Enterprise Linux 9",
    sizeMB: 65.2,
    lastUpdated: "1 hour ago",
    uviMitigations: 125,
    cisLevel: "Level 2",
  },
  {
    id: "PureOS-suse-15",
    name: "exultia/pureos-suse",
    tag: "15-hardened",
    baseOS: "SUSE Linux Enterprise 15",
    sizeMB: 70.1,
    lastUpdated: "8 hours ago",
    uviMitigations: 95,
    cisLevel: "Level 2",
  },
  {
    id: "PureOS-oracle-9",
    name: "exultia/pureos-oracle",
    tag: "9-hardened",
    baseOS: "Oracle Linux 9",
    sizeMB: 62.4,
    lastUpdated: "12 hours ago",
    uviMitigations: 110,
    cisLevel: "Level 2",
  },
  {
    id: "PureOS-amazon-2023",
    name: "exultia/pureos-amazon",
    tag: "2023-hardened",
    baseOS: "Amazon Linux 2023",
    sizeMB: 55.8,
    lastUpdated: "3 hours ago",
    uviMitigations: 102,
    cisLevel: "Level 1",
  },
  {
    id: "PureOS-opensuse-15",
    name: "exultia/pureos-opensuse",
    tag: "15-hardened",
    baseOS: "openSUSE Leap 15",
    sizeMB: 68.9,
    lastUpdated: "1 day ago",
    uviMitigations: 92,
    cisLevel: "Level 1",
  },
  {
    id: "PureOS-arch",
    name: "exultia/pureos-arch",
    tag: "latest-hardened",
    baseOS: "Arch Linux",
    sizeMB: 45.2,
    lastUpdated: "30 minutes ago",
    uviMitigations: 85,
    cisLevel: "Level 1",
  },
  {
    id: "PureOS-rpios-12",
    name: "exultia/pureos-rpios",
    tag: "12-arm64-hardened",
    baseOS: "Raspberry Pi OS 12",
    sizeMB: 72.1,
    lastUpdated: "4 hours ago",
    uviMitigations: 98,
    cisLevel: "Level 1",
  },
  {
    id: "PureOS-ubuntu-core-22",
    name: "exultia/pureos-ubuntu-core",
    tag: "22-iot-hardened",
    baseOS: "Ubuntu Core 22",
    sizeMB: 60.5,
    lastUpdated: "5 hours ago",
    uviMitigations: 104,
    cisLevel: "Level 2",
  },
];

export default function PureOSRegistryConsole() {
  const [search, setSearch] = useState("");
  const [selectedImage, setSelectedImage] = useState<ContainerImage | null>(null);

  const filteredCatalogue = PureOS_CATALOGUE.filter(img => 
    img.name.toLowerCase().includes(search.toLowerCase()) || 
    img.baseOS.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="fade-in" style={{ padding: "2rem", maxWidth: "1440px", margin: "0 auto" }}>
      <header style={{ marginBottom: "2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.5rem" }}>
            <PureOsIcon size={40} glow={true} />
            <h1 style={{ fontSize: "2.2rem", margin: 0 }}>PureOS Registry</h1>
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", margin: 0, maxWidth: "600px" }}>
            Browse and deploy pre-hardened, zero-trust container images synchronized with the UVI Threat Feed.
          </p>
        </div>
        
        <div className="glass-card" style={{ padding: "1rem 1.5rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "1.5rem" }}>
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Total Images</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "white" }}>{PureOS_CATALOGUE.length}</div>
          </div>
          <div style={{ width: "1px", height: "40px", background: "var(--border-color)" }} />
          <div>
            <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>Sync Status</div>
            <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#10B981", display: "flex", alignItems: "center", gap: "6px" }}>
              <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10B981", boxShadow: "0 0 10px #10B981" }} />
              Active (Live)
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 350px", gap: "2rem", alignItems: "start" }}>
        
        {/* CATALOGUE LIST */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="search-bar" style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
            <input 
              type="text" 
              placeholder="Search images by name or OS..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ flex: 1, padding: "1rem 1.5rem", borderRadius: "12px", border: "1px solid var(--border-color)", background: "rgba(0,0,0,0.3)", color: "white", fontSize: "1rem" }}
            />
            <a 
              href="/app/pureos/configurator" 
              style={{ padding: "0 1.5rem", background: "linear-gradient(135deg, #10B981 0%, #059669 100%)", color: "white", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "12px", fontWeight: 600, border: "1px solid rgba(255,255,255,0.1)" }}
            >
              Build Custom Image
            </a>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {filteredCatalogue.map(img => (
              <div 
                key={img.id} 
                className="glass-card" 
                style={{ 
                  padding: "1.5rem", 
                  borderRadius: "16px", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "space-between",
                  cursor: "pointer",
                  border: selectedImage?.id === img.id ? "1px solid rgba(245, 158, 11, 0.5)" : "1px solid var(--border-color)",
                  background: selectedImage?.id === img.id ? "rgba(245, 158, 11, 0.05)" : "rgba(255,255,255,0.02)",
                  transition: "all 0.2s ease"
                }}
                onClick={() => setSelectedImage(img)}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "0.5rem" }}>
                    <h3 style={{ margin: 0, fontSize: "1.2rem", display: "flex", alignItems: "center", gap: "8px" }}>
                      {img.name}
                      <span style={{ fontSize: "0.85rem", padding: "2px 8px", background: "rgba(255,255,255,0.1)", borderRadius: "4px", color: "#94A3B8" }}>:{img.tag}</span>
                    </h3>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                    <span>{img.baseOS}</span>
                    <span>•</span>
                    <span>{img.sizeMB} MB</span>
                    <span>•</span>
                    <span>Updated {img.lastUpdated}</span>
                  </div>
                </div>
                
                <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "0.85rem", color: "#FBBF24", display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end", marginBottom: "4px" }}>
                      <Shield size={14} /> CIS {img.cisLevel}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#C084FC", display: "flex", alignItems: "center", gap: "4px", justifyContent: "flex-end" }}>
                      <UviIcon size={12} glow={false} /> {img.uviMitigations} UVI Mitigations
                    </div>
                  </div>
                  <button className="btn-secondary" style={{ padding: "0.6rem 1rem", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "6px" }}>
                    Select
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* DETAILS SIDEBAR */}
        {selectedImage ? (
          <div className="glass-card" style={{ padding: "2rem", borderRadius: "16px", position: "sticky", top: "100px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "1.5rem", borderBottom: "1px solid var(--border-color)", paddingBottom: "1.5rem" }}>
              <PureOsIcon size={32} glow={false} />
              <div>
                <h3 style={{ margin: 0, fontSize: "1.1rem" }}>{selectedImage.name}</h3>
                <div style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>:{selectedImage.tag}</div>
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Pull Image</h4>
              <div style={{ background: "#111", padding: "1rem", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.1)", display: "flex", alignItems: "center", justifyContent: "space-between", fontFamily: "monospace", fontSize: "0.9rem", color: "#60A5FA" }}>
                <span>docker pull {selectedImage.name}:{selectedImage.tag}</span>
                <button style={{ background: "transparent", border: "none", color: "#94A3B8", cursor: "pointer" }} title="Copy to clipboard">
                  <Copy size={16} />
                </button>
              </div>
            </div>

            <div style={{ marginBottom: "2rem" }}>
              <h4 style={{ fontSize: "0.85rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--text-muted)", marginBottom: "0.75rem" }}>Security Profile</h4>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.9rem", color: "#E2E8F0" }}>
                  <CheckCircle size={16} color="#10B981" style={{ marginTop: "2px" }} />
                  <div>
                    <strong>CIS {selectedImage.cisLevel} Hardened</strong>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "2px" }}>Base OS configured to CIS specifications.</div>
                  </div>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.9rem", color: "#E2E8F0" }}>
                  <CheckCircle size={16} color="#10B981" style={{ marginTop: "2px" }} />
                  <div>
                    <strong>UVI Threat Mitigations ({selectedImage.uviMitigations})</strong>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "2px" }}>Real-time zero-day patching applied.</div>
                  </div>
                </li>
                <li style={{ display: "flex", alignItems: "flex-start", gap: "8px", fontSize: "0.9rem", color: "#E2E8F0" }}>
                  <CheckCircle size={16} color="#10B981" style={{ marginTop: "2px" }} />
                  <div>
                    <strong>Distroless Architecture</strong>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: "2px" }}>Package managers (apt/apk) removed.</div>
                  </div>
                </li>
              </ul>
            </div>

            <div>
              <button className="btn-primary" style={{ width: "100%", padding: "1rem", fontSize: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", background: "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)", border: "none" }}>
                <Download size={18} /> View SBOM & Manifest
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card" style={{ padding: "3rem 2rem", borderRadius: "16px", textAlign: "center", color: "var(--text-muted)", display: "flex", flexDirection: "column", alignItems: "center", gap: "1rem" }}>
            <Terminal size={48} opacity={0.2} />
            <p>Select a container image from the catalogue to view its security profile, pull commands, and manifest details.</p>
          </div>
        )}

      </div>
    </div>
  );
}
