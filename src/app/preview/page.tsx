"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Lock, 
  Key, 
  ArrowRight, 
  RefreshCw
} from "lucide-react";
import { ExultiaLogo } from "@/components/BrandIcons";
import { useDoomTheme, DOOM_PALETTES, type DoomPalette } from "@/context/DoomThemeContext";

export default function PreviewHoldingPage() {
  const { palette, setPalette } = useDoomTheme();
  const [passkey, setPasskey] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [unlockedTier, setUnlockedTier] = useState<string | null>(null);
  const passkeyInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const autoKey = params.get("key");
      const errParam = params.get("error");

      if (autoKey) {
        window.location.href = `/api/preview/unlock?key=${encodeURIComponent(autoKey)}`;
      } else if (errParam === "invalid_key") {
        setError("Invalid authorization passkey. Please check your credentials or request an evaluator pass.");
      }
    }
  }, []);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/preview/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: passkey }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.error || "Access denied. Invalid authorization passkey.");
      } else {
        setUnlockedTier(data.tier || "enterprise");
        setTimeout(() => {
          window.location.href = data.redirect || "/";
        }, 600);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg || "Failed to authenticate passkey");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "transparent",
      color: "var(--text-main)",
      fontFamily: "var(--font-body)",
      position: "relative",
      overflowX: "hidden",
    }}>
      {/* ── LOCKED DOWN TOP HEADER (No site navigation links) ── */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(16px)",
        background: "rgba(3, 6, 8, 0.88)",
        borderBottom: "1px solid var(--border-color)",
        padding: "0.85rem 1.5rem",
      }}>
        <div style={{
          maxWidth: "1120px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}>
          {/* Brand Lockup */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <ExultiaLogo size={42} glow={false} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ 
                  fontFamily: "var(--font-display)", 
                  fontSize: "1.35rem", 
                  fontWeight: 900, 
                  color: "#FFFFFF", 
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textShadow: "0 0 16px var(--accent-glow)"
                }}>
                  EXULTIA
                </span>
                <span className="doom-badge" style={{ fontSize: "0.64rem", padding: "1px 6px" }}>
                  PREVIEW
                </span>
              </div>
              <span style={{ 
                fontFamily: "var(--font-mono)", 
                fontSize: "0.66rem", 
                fontWeight: 800, 
                color: "var(--accent-primary)", 
                letterSpacing: "0.34em", 
                textTransform: "uppercase",
                marginTop: "2px"
              }}>
                TECHNOLOGIES
              </span>
            </div>
          </div>

          {/* Theme Palette Switcher & Status Pill */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              padding: "4px 8px",
              borderRadius: "4px",
              background: "rgba(0, 0, 0, 0.5)",
              border: "1px solid var(--border-color)",
            }}>
              {(Object.keys(DOOM_PALETTES) as DoomPalette[]).map((key) => {
                const pal = DOOM_PALETTES[key];
                const active = palette === key;
                return (
                  <button
                    key={key}
                    onClick={() => setPalette(key)}
                    title={`Switch to ${pal.name} theme`}
                    style={{
                      width: "13px",
                      height: "13px",
                      borderRadius: "50%",
                      background: pal.hex,
                      border: active ? "2px solid #FFFFFF" : "1px solid rgba(0,0,0,0.4)",
                      boxShadow: active ? `0 0 8px ${pal.glow}` : "none",
                      cursor: "pointer",
                      padding: 0,
                      transform: active ? "scale(1.2)" : "scale(1)",
                      transition: "transform 0.15s ease",
                    }}
                  />
                );
              })}
            </div>

            <span className="doom-badge" style={{ color: "#FBBF24", borderColor: "rgba(245, 158, 11, 0.35)", background: "rgba(245, 158, 11, 0.12)" }}>
              <Lock size={11} style={{ marginRight: "4px" }} />
              GATEWAY LOCKED
            </span>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT CONTAINER (Matching HomeCommandDeck) ── */}
      <main style={{ maxWidth: "1120px", margin: "0 auto", padding: "1.5rem 1rem 5rem 1rem" }}>
        
        {/* ── HERO: SELF-HEALING LINUX LEAD (Same as Homepage) ── */}
        <section style={{ textAlign: "center", marginBottom: "3.5rem", paddingTop: "1.5rem" }}>
          
          <h1 style={{ 
            fontSize: "clamp(2.8rem, 6.2vw, 4.5rem)", 
            fontWeight: 800, 
            color: "#FFFFFF", 
            letterSpacing: "-0.03em", 
            marginBottom: "0.85rem",
            lineHeight: 1.15,
            fontFamily: "var(--font-display)",
          }}>
            Autonomous &amp; Accessible
            <span style={{ 
              display: "block", 
              color: "var(--accent-primary, #00E5FF)",
              fontWeight: 800
            }}>
              Self-Healing Linux.
            </span>
          </h1>

          <p style={{
            fontSize: "clamp(1.15rem, 2.4vw, 1.55rem)",
            fontWeight: 600,
            color: "var(--accent-primary, #00E5FF)",
            fontFamily: "var(--font-mono, monospace)",
            margin: "0 auto 1.5rem auto",
            letterSpacing: "-0.01em",
            textShadow: "0 0 24px var(--accent-glow)",
          }}>
            The duct tape is built right into the code.
          </p>

          <p style={{ 
            color: "#94A3B8", 
            fontSize: "1.15rem", 
            maxWidth: "720px", 
            margin: "0 auto 2.5rem auto", 
            lineHeight: 1.6 
          }}>
            A lightweight daemon that drops onto any Linux machine. Audits listening sockets, restores baselines, and applies zero-downtime in-memory hotpatches every 60 seconds.
          </p>

          {/* ── PASSKEY AUTHENTICATION CARD (Replaces download links & console simulator) ── */}
          <div style={{
            maxWidth: "580px",
            margin: "0 auto 3rem auto",
            background: "rgba(15, 23, 42, 0.75)",
            border: "1px solid var(--border-color)",
            borderRadius: "14px",
            padding: "2.25rem 2rem",
            boxShadow: "0 15px 35px rgba(0, 0, 0, 0.7), inset 0 0 15px rgba(0, 0, 0, 0.5)",
            textAlign: "left",
            backdropFilter: "blur(14px)",
          }}>
            <div style={{ textAlign: "center", marginBottom: "1.25rem" }}>
              <span className="doom-badge" style={{ marginBottom: "0.6rem" }}>
                <Lock size={12} style={{ marginRight: "4px" }} />
                OPERATOR &amp; ENTERPRISE PREVIEW GATEWAY
              </span>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.35rem",
                fontWeight: 800,
                color: "#FFFFFF",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0.4rem 0 0.25rem 0",
              }}>
                Enter Authorization Passkey
              </h2>
              <p style={{
                fontSize: "0.85rem",
                color: "#94A3B8",
                lineHeight: 1.5,
              }}>
                Enter an authorized preview passkey to unlock the full platform, private interactive tools, and enterprise fleet features.
              </p>
            </div>

            {error && (
              <div style={{
                background: "rgba(220, 38, 38, 0.15)",
                border: "1px solid rgba(220, 38, 38, 0.4)",
                color: "#FCA5A5",
                padding: "0.75rem 1rem",
                borderRadius: "4px",
                fontSize: "0.82rem",
                marginBottom: "1rem",
                fontFamily: "var(--font-mono)",
                lineHeight: 1.4,
              }}>
                {error}
              </div>
            )}

            {unlockedTier && (
              <div style={{
                background: "rgba(0, 229, 255, 0.15)",
                border: "1px solid var(--accent-primary)",
                color: "var(--accent-primary)",
                padding: "0.75rem 1rem",
                borderRadius: "4px",
                fontSize: "0.84rem",
                marginBottom: "1rem",
                fontFamily: "var(--font-mono)",
                textAlign: "center",
              }}>
                ✓ Authorization verified. Provisioning Enterprise session...
              </div>
            )}

            <form onSubmit={handleUnlock}>
              <div style={{ position: "relative", marginBottom: "1rem" }}>
                <Key size={16} style={{
                  position: "absolute",
                  left: "1rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--accent-primary)",
                }} />
                <input
                  ref={passkeyInputRef}
                  type="password"
                  placeholder="Enter authorization passkey"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem 0.85rem 2.75rem",
                    background: "rgba(0, 0, 0, 0.65)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "4px",
                    color: "var(--text-main)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.9rem",
                    outline: "none",
                    transition: "border-color 0.2s, box-shadow 0.2s",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "var(--accent-primary)";
                    e.target.style.boxShadow = "0 0 15px var(--accent-glow)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "var(--border-color)";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{
                  width: "100%",
                  padding: "0.85rem",
                  cursor: loading ? "not-allowed" : "pointer",
                }}
              >
                {loading ? (
                  <>
                    <RefreshCw size={15} className="spin" style={{ marginRight: "8px" }} />
                    <span>VERIFYING PASSKEY...</span>
                  </>
                ) : (
                  <>
                    <span style={{ marginRight: "6px" }}>UNLOCK FULL PLATFORM</span>
                    <ArrowRight size={15} />
                  </>
                )}
              </button>
            </form>

            <div style={{
              marginTop: "1.25rem",
              paddingTop: "0.9rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              textAlign: "center",
              fontSize: "0.74rem",
              color: "#64748B",
              fontFamily: "var(--font-mono)",
              lineHeight: 1.5,
            }}>
              Private preview access is strictly restricted. Evaluator credentials are provided directly by Exultia security representatives.
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS: THE AUTONOMOUS DAEMON 4-STAGE LOOP (From Homepage) ── */}
        <section id="how-it-works" style={{ marginBottom: "5rem" }}>
          
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#FFFFFF", margin: 0, fontFamily: "var(--font-display)" }}>
              HOW IT WORKS
            </h2>
            <p style={{ color: "#94A3B8", fontSize: "0.95rem", marginTop: "0.5rem" }}>
              Continuous real-time threat ingestion, non-destructive validation, in-memory hotpatching, and sub-second rollback.
            </p>
          </div>

          {/* 4 Sequential Steps (Exact Structure from Homepage) */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "960px", margin: "0 auto" }}>
            
            {/* Stage 1: Detect */}
            <div style={{
              background: "rgba(15, 23, 42, 0.55)",
              border: "1px solid rgba(192, 132, 252, 0.25)",
              borderRadius: "14px",
              padding: "1.5rem 1.75rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1.75rem",
              flexWrap: "wrap"
            }}>
              <div style={{ minWidth: "190px", flexShrink: 0 }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.74rem",
                  fontFamily: "var(--font-mono, monospace)",
                  color: "#C084FC",
                  background: "rgba(192, 132, 252, 0.12)",
                  border: "1px solid rgba(192, 132, 252, 0.3)",
                  padding: "3px 10px",
                  borderRadius: "6px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: "0.4rem"
                }}>
                  Stage 01 &bull; Detection
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 0.3rem 0", fontFamily: "var(--font-display)" }}>
                  Threat Detection
                </h3>
                <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontFamily: "var(--font-mono, monospace)" }}>
                  <code>exultia-vantage-sync.timer</code>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: "260px" }}>
                <p style={{ fontSize: "0.95rem", color: "#CBD5E1", lineHeight: 1.6, margin: "0 0 0.85rem 0" }}>
                  Ingests CVE disclosures, CISA KEVs, and vendor advisories across 110+ authoritative feeds in under 60 seconds. Directly correlates affected package binary hashes against active TCP/UDP listening sockets. If a vulnerable library is sitting dormant on disk with zero bound network sockets, we don&apos;t page your on-call engineer at 3:14 AM to panic over a theoretical risk.
                </p>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.82rem", color: "#94A3B8", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.6rem" }}>
                  <span>&bull; <strong>Detection Latency:</strong> 110+ feeds synchronized in &lt;60s</span>
                  <span>&bull; <strong>Active Correlation:</strong> Targets actual bound sockets (zero frantic grep commands)</span>
                  <span>&bull; <strong>Speed Advantage:</strong> Finds exposed workloads weeks before vendor advisories clear your corporate spam filter</span>
                </div>
              </div>
            </div>

            {/* Connector 1 -> 2 */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "16px", margin: "-4px 0" }}>
              <div style={{ width: "2px", height: "100%", background: "linear-gradient(180deg, #C084FC 0%, #F87171 100%)", opacity: 0.6 }} />
            </div>

            {/* Stage 2: Validate */}
            <div style={{
              background: "rgba(15, 23, 42, 0.55)",
              border: "1px solid rgba(248, 113, 113, 0.25)",
              borderRadius: "14px",
              padding: "1.5rem 1.75rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1.75rem",
              flexWrap: "wrap"
            }}>
              <div style={{ minWidth: "190px", flexShrink: 0 }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.74rem",
                  fontFamily: "var(--font-mono, monospace)",
                  color: "#F87171",
                  background: "rgba(248, 113, 113, 0.12)",
                  border: "1px solid rgba(248, 113, 113, 0.3)",
                  padding: "3px 10px",
                  borderRadius: "6px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: "0.4rem"
                }}>
                  Stage 02 &bull; Validation
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 0.3rem 0", fontFamily: "var(--font-display)" }}>
                  Exploit Validation
                </h3>
                <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontFamily: "var(--font-mono, monospace)" }}>
                  <code>exultia test --canary --sandbox</code>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: "260px" }}>
                <p style={{ fontSize: "0.95rem", color: "#CBD5E1", lineHeight: 1.6, margin: "0 0 0.85rem 0" }}>
                  Before touching live process memory, the daemon spins up an ephemeral 10-minute microVM sandbox mirroring your exact runtime and engages its internal twin validation harnesses: non-destructive cryptographic canary probes that mathematically verify exploit viability without delivering harmful payloads, and hermetic sandbox stress-testing against race conditions.
                </p>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.82rem", color: "#94A3B8", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.6rem" }}>
                  <span>&bull; <strong>Canary Verification:</strong> Non-destructive HMAC handshake canary proves weaponization</span>
                  <span>&bull; <strong>Kinetic Sandbox:</strong> In-sandbox validation verifies patch resilience under load</span>
                  <span>&bull; <strong>Safety:</strong> Ephemeral microVM with 10m auto-destruct (0 host footprint)</span>
                </div>
              </div>
            </div>

            {/* Connector 2 -> 3 */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "16px", margin: "-4px 0" }}>
              <div style={{ width: "2px", height: "100%", background: "linear-gradient(180deg, #F87171 0%, #34D399 100%)", opacity: 0.6 }} />
            </div>

            {/* Stage 3: Fix */}
            <div style={{
              background: "rgba(15, 23, 42, 0.55)",
              border: "1px solid rgba(52, 211, 153, 0.25)",
              borderRadius: "14px",
              padding: "1.5rem 1.75rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1.75rem",
              flexWrap: "wrap"
            }}>
              <div style={{ minWidth: "190px", flexShrink: 0 }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.74rem",
                  fontFamily: "var(--font-mono, monospace)",
                  color: "#34D399",
                  background: "rgba(52, 211, 153, 0.12)",
                  border: "1px solid rgba(52, 211, 153, 0.3)",
                  padding: "3px 10px",
                  borderRadius: "6px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: "0.4rem"
                }}>
                  Stage 03 &bull; Remediation
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 0.3rem 0", fontFamily: "var(--font-display)" }}>
                  In-Memory Hotpatch
                </h3>
                <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontFamily: "var(--font-mono, monospace)" }}>
                  <code>exultia-daemon.service</code>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: "260px" }}>
                <p style={{ fontSize: "0.95rem", color: "#CBD5E1", lineHeight: 1.6, margin: "0 0 0.85rem 0" }}>
                  Compiles surgical in-memory trampolines and injects them directly into running process virtual memory in &lt;350ms. Neutralizes the vulnerable branch instantaneously with 0 dropped TCP sockets and zero service restarts—patching the vulnerability and writing cryptographic audit receipts with zero operational disruption.
                </p>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.82rem", color: "#94A3B8", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.6rem" }}>
                  <span>&bull; <strong>Downtime:</strong> 0 dropped TCP connections</span>
                  <span>&bull; <strong>Execution:</strong> Applied in &lt;350ms with zero process restarts</span>
                  <span>&bull; <strong>Zero Bureaucracy:</strong> Neutralizes vulnerabilities before change advisory boards convene</span>
                </div>
              </div>
            </div>

            {/* Connector 3 -> 4 */}
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "16px", margin: "-4px 0" }}>
              <div style={{ width: "2px", height: "100%", background: "linear-gradient(180deg, #34D399 0%, #00E5FF 100%)", opacity: 0.6 }} />
            </div>

            {/* Stage 4: Rollback */}
            <div style={{
              background: "rgba(15, 23, 42, 0.55)",
              border: "1px solid rgba(0, 229, 255, 0.25)",
              borderRadius: "14px",
              padding: "1.5rem 1.75rem",
              display: "flex",
              alignItems: "flex-start",
              gap: "1.75rem",
              flexWrap: "wrap"
            }}>
              <div style={{ minWidth: "190px", flexShrink: 0 }}>
                <div style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "0.74rem",
                  fontFamily: "var(--font-mono, monospace)",
                  color: "#00E5FF",
                  background: "rgba(0, 229, 255, 0.12)",
                  border: "1px solid rgba(0, 229, 255, 0.3)",
                  padding: "3px 10px",
                  borderRadius: "6px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  marginBottom: "0.4rem"
                }}>
                  Stage 04 &bull; Rollback
                </div>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#FFFFFF", margin: "0 0 0.3rem 0", fontFamily: "var(--font-display)" }}>
                  Deterministic Rollback
                </h3>
                <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontFamily: "var(--font-mono, monospace)" }}>
                  <code>atomic snapshot restore</code>
                </div>
              </div>

              <div style={{ flex: 1, minWidth: "260px" }}>
                <p style={{ fontSize: "0.95rem", color: "#CBD5E1", lineHeight: 1.6, margin: "0 0 0.85rem 0" }}>
                  Takes a cryptographic pre-image checkpoint before touching a single byte, arming a 120-second watchdog timer. If post-remediation socket canaries or application health checks fail to acknowledge the watchdog, the daemon unlinks the trampoline and restores baseline state in under 15ms.
                </p>
                <div style={{ display: "flex", gap: "1.5rem", flexWrap: "wrap", fontSize: "0.82rem", color: "#94A3B8", borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "0.6rem" }}>
                  <span>&bull; <strong>Rollback Engine:</strong> Sub-15ms deterministic atomic revert (0.69ms on Btrfs/ZFS)</span>
                  <span>&bull; <strong>Watchdog Safety:</strong> Hardware &amp; systemd 120s failsafe auto-revert</span>
                  <span>&bull; <strong>Forensic Hygiene:</strong> Leaves zero orphaned artifacts or corrupted state</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ── SOVEREIGNTY (From Homepage) ── */}
        <section style={{ 
          textAlign: "center", 
          borderTop: "1px solid rgba(255, 255, 255, 0.08)", 
          paddingTop: "3.5rem",
          background: "linear-gradient(180deg, transparent 0%, rgba(0, 229, 255, 0.02) 100%)",
          borderRadius: "16px",
          paddingBottom: "1.5rem"
        }}>
          <h3 style={{ fontSize: "1.45rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.75rem", fontFamily: "var(--font-display)" }}>
            Built for True Technical Sovereignty
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "1rem", maxWidth: "680px", margin: "0 auto 2.25rem auto", lineHeight: 1.65 }}>
            High-consequence infrastructure must remain transparent, deterministic, and verifiable. 
            Engineered to defend workloads on any Linux distribution without telemetry, vendor lock-in, or proprietary traps.
          </p>

          <div style={{ display: "inline-flex", gap: "1.75rem", color: "#64748B", fontSize: "0.85rem", fontFamily: "var(--font-mono, monospace)", flexWrap: "wrap", justifyContent: "center" }}>
            <span>No Telemetry</span>
            <span>&bull;</span>
            <span>No Vendor Lock-In</span>
            <span>&bull;</span>
            <span>Deterministic Reproducible Builds</span>
            <span>&bull;</span>
            <span>Deterministic Atomic Rollback</span>
          </div>
        </section>

      </main>

      {/* ── FOOTER (Locked Down, Zero External Navigation) ── */}
      <footer style={{
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        background: "rgba(5, 8, 15, 0.6)",
        backdropFilter: "blur(8px)",
        padding: "2rem 1.5rem",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "0.5rem",
        marginTop: "auto",
        textAlign: "center",
        fontSize: "0.78rem",
        color: "var(--text-muted)",
        fontFamily: "var(--font-mono)",
      }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          color: "var(--accent-primary)",
          fontWeight: 700,
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          fontSize: "0.72rem",
          marginBottom: "0.25rem",
        }}>
          <Lock size={12} />
          <span>Restricted Preview Environment</span>
        </div>

        <div style={{
          fontSize: "0.75rem",
          color: "var(--text-dim)",
          letterSpacing: "0.05em",
          lineHeight: 1.6,
        }}>
          &copy; {new Date().getFullYear()} Exultia Technologies, PBC. All Rights Reserved.<br />
          <span style={{ opacity: 0.7, fontSize: "0.7rem" }}>
            Autonomous Threat Remediation, Real-Time Vulnerability Intelligence, and Continuous Self-Healing for Linux.
          </span>
        </div>
      </footer>
    </div>
  );
}
