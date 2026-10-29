"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Shield, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Cpu, 
  Terminal, 
  Key, 
  Zap, 
  RefreshCw, 
  Globe, 
  Building2,
  ChevronRight,
  ShieldCheck,
  Palette
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
        setError("Invalid authorization passkey. Please check your credentials or request an Enterprise VIP pass.");
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
        setError(data.error || "Access denied. Invalid operator passkey.");
      } else {
        setUnlockedTier(data.tier || "operator");
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

  const scrollToPortal = () => {
    const el = document.getElementById("access-portal");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      setTimeout(() => {
        passkeyInputRef.current?.focus();
      }, 500);
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
      {/* Top Header Navigation - Consistent with Exultia DOOM HUD */}
      <header style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        backdropFilter: "blur(16px)",
        background: "rgba(3, 6, 8, 0.88)",
        borderBottom: "1px solid var(--border-color)",
        padding: "0.9rem 1.5rem",
      }}>
        <div style={{
          maxWidth: "1280px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}>
          {/* Logo & Brand Lockup */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
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

          {/* Theme Palette Switcher & Passkey Button */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {/* Palette Switcher */}
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
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      background: pal.hex,
                      border: active ? "2px solid #FFFFFF" : "1px solid rgba(0,0,0,0.4)",
                      boxShadow: active ? `0 0 10px ${pal.glow}` : "none",
                      cursor: "pointer",
                      padding: 0,
                      transform: active ? "scale(1.2)" : "scale(1)",
                      transition: "transform 0.15s ease",
                    }}
                  />
                );
              })}
            </div>

            <button
              onClick={scrollToPortal}
              className="btn-secondary"
              style={{
                padding: "0.55rem 1rem",
                fontSize: "0.78rem",
                letterSpacing: "0.08em",
              }}
            >
              <Key size={13} style={{ marginRight: "6px", color: "var(--accent-primary)" }} />
              ENTER PASSKEY
            </button>
          </div>
        </div>
      </header>

      {/* Main Overview Body */}
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "3.5rem 1.5rem 6rem 1.5rem", position: "relative", zIndex: 1 }}>
        
        {/* HERO SECTION */}
        <section style={{ textAlign: "center", maxWidth: "900px", margin: "0 auto 3.5rem auto" }}>
          
          <div style={{ marginBottom: "1.25rem" }}>
            <span className="doom-badge">
              <Sparkles size={12} style={{ marginRight: "4px" }} />
              SYSTEM ARCHITECTURE OVERVIEW // ZERO-TRUST LINUX DEFENSE
            </span>
          </div>

          <h1 style={{
            fontFamily: "var(--font-display)",
            fontSize: "clamp(2.1rem, 4.8vw, 3.4rem)",
            fontWeight: 900,
            lineHeight: 1.15,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            color: "#FFFFFF",
            textShadow: "0 0 20px var(--accent-glow)",
            marginBottom: "1.25rem",
          }}>
            Autonomous Threat Remediation &amp; Self-Healing Linux
          </h1>

          <p style={{
            fontSize: "clamp(1.05rem, 2vw, 1.25rem)",
            color: "var(--text-muted)",
            lineHeight: 1.65,
            maxWidth: "780px",
            margin: "0 auto 2.5rem auto",
            fontFamily: "var(--font-body)",
          }}>
            Exultia bridges vulnerability intelligence and automated execution — compiling surgical in-memory mitigations, staging deterministic updates, and executing sub-second atomic rollbacks across production Linux fleets with zero service downtime.
          </p>

          {/* Quick Metrics Bar */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
          }}>
            {[
              {
                num: "0.69ms",
                label: "Sub-Second Rollback",
                sub: "Deterministic Btrfs / ZFS Snapshots",
              },
              {
                num: "6,400+",
                label: "Live Threat Feeds",
                sub: "CISA KEV, OSV & Errata Normalized",
              },
              {
                num: "SLSA L3",
                label: "Cryptographic Provenance",
                sub: "Ed25519 & Cosign Signed Binaries",
              },
              {
                num: "100%",
                label: "Zero-Agent Native",
                sub: "Statically Compiled • No Background SaaS",
              },
            ].map((m, i) => (
              <div key={i} className="doom-hud-panel" style={{
                padding: "1.4rem 1rem",
                textAlign: "center",
                marginBottom: 0,
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.9rem",
                  fontWeight: 900,
                  color: "var(--accent-primary)",
                  textShadow: "0 0 14px var(--accent-glow)",
                  lineHeight: 1,
                  marginBottom: "6px",
                }}>
                  {m.num}
                </div>
                <div style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "0.82rem",
                  fontWeight: 800,
                  color: "var(--text-main)",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}>
                  {m.label}
                </div>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.72rem",
                  color: "var(--text-dim)",
                  marginTop: "4px",
                }}>
                  {m.sub}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ACCESS PORTAL - PASSKEY AUTHENTICATION */}
        <section id="access-portal" style={{
          maxWidth: "560px",
          margin: "0 auto 5rem auto",
        }}>
          <div className="doom-hud-panel" style={{
            padding: "2.5rem 2rem",
            marginBottom: 0,
          }}>
            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <span className="doom-badge" style={{ marginBottom: "0.75rem" }}>
                <Lock size={12} style={{ marginRight: "4px" }} />
                OPERATOR &amp; ENTERPRISE VIP GATEWAY
              </span>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.45rem",
                fontWeight: 800,
                color: "#FFFFFF",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                margin: "0.5rem 0 0.4rem 0",
              }}>
                Enter Authorization Passkey
              </h2>
              <p style={{
                fontSize: "0.85rem",
                color: "var(--text-muted)",
                lineHeight: 1.5,
              }}>
                Authenticate with your preview passkey to enter the live workspace with full enterprise access and interactive defense tools.
              </p>
            </div>

            {error && (
              <div style={{
                background: "rgba(220, 38, 38, 0.15)",
                border: "1px solid rgba(220, 38, 38, 0.4)",
                color: "#FCA5A5",
                padding: "0.85rem 1rem",
                borderRadius: "2px",
                fontSize: "0.82rem",
                marginBottom: "1.25rem",
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
                padding: "0.85rem 1rem",
                borderRadius: "2px",
                fontSize: "0.84rem",
                marginBottom: "1.25rem",
                fontFamily: "var(--font-mono)",
                textAlign: "center",
              }}>
                ✓ Authorization verified. Provisioning {unlockedTier.toUpperCase()} session...
              </div>
            )}

            <form onSubmit={handleUnlock}>
              <div style={{ position: "relative", marginBottom: "1.25rem" }}>
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
                  placeholder="Enter Passkey (e.g. exultia-preview-2026)"
                  value={passkey}
                  onChange={(e) => setPasskey(e.target.value)}
                  required
                  style={{
                    width: "100%",
                    padding: "0.85rem 1rem 0.85rem 2.75rem",
                    background: "rgba(0, 0, 0, 0.65)",
                    border: "1px solid var(--border-color)",
                    borderRadius: "2px",
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
              paddingTop: "1rem",
              borderTop: "1px solid rgba(255, 255, 255, 0.08)",
              textAlign: "center",
              fontSize: "0.75rem",
              color: "var(--text-dim)",
              fontFamily: "var(--font-mono)",
              lineHeight: 1.5,
            }}>
              Evaluator passkeys grant instant authenticated access across the suite without credit card entry. Contact your Exultia representative for credential distribution.
            </div>
          </div>
        </section>

        {/* CLOSED-LOOP AUTONOMOUS DEFENSE CYCLE */}
        <section style={{ marginBottom: "5rem" }}>
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span className="doom-badge" style={{ marginBottom: "0.5rem" }}>
              CLOSED-LOOP OPERATIONAL PARADIGM
            </span>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.85rem",
              fontWeight: 800,
              color: "#FFFFFF",
              textTransform: "uppercase",
              textShadow: "0 0 16px var(--accent-glow)",
              marginTop: "0.5rem",
            }}>
              Autonomous 4-Step Remediation Cycle
            </h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
              How Exultia detects, isolates, synthesizes, and verifies Linux threats in continuous real-time loops.
            </p>
          </div>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
            gap: "1.25rem",
          }}>
            {[
              {
                step: "01",
                title: "Threat Ingestion",
                desc: "Continuously polls 6,400+ vulnerability databases (CISA KEV, NVD, OSV, national CERTs) and calculates active socket exposure.",
              },
              {
                step: "02",
                title: "Patch Synthesis",
                desc: "Generates targeted binary errata mitigations and hardened configuration baselines tailored to target kernels in <0.1ms.",
              },
              {
                step: "03",
                title: "Live Execution",
                desc: "Safely stages updates across a 10% canary host ring with automated verification gates and zero dropped network sockets.",
              },
              {
                step: "04",
                title: "Sub-Second Rollback",
                desc: "If any behavioral fault occurs, instantly triggers sub-second deterministic rollback (0.69ms) to cryptographic pre-image state.",
              },
            ].map((st, i) => (
              <div key={i} className="doom-hud-panel" style={{
                padding: "2rem 1.5rem",
                marginBottom: 0,
              }}>
                <div style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "1.8rem",
                  fontWeight: 900,
                  color: "var(--accent-primary)",
                  marginBottom: "0.75rem",
                  opacity: 0.9,
                }}>
                  {st.step}
                </div>
                <h3 style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  fontWeight: 800,
                  color: "#FFFFFF",
                  textTransform: "uppercase",
                  marginBottom: "0.5rem",
                  letterSpacing: "0.04em",
                }}>
                  {st.title}
                </h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", lineHeight: 1.6 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* ENTERPRISE COMPLIANCE & SECURITY HIGHLIGHTS */}
        <section className="doom-hud-panel" style={{
          padding: "2.75rem 2rem",
          marginBottom: "3rem",
        }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "2.5rem",
            alignItems: "center",
          }}>
            <div>
              <span className="doom-badge" style={{ marginBottom: "1rem" }}>
                <ShieldCheck size={12} style={{ marginRight: "4px" }} />
                HIGH-ASSURANCE CORPORATE INFRASTRUCTURE
              </span>
              <h2 style={{
                fontFamily: "var(--font-display)",
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "#FFFFFF",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                margin: "0.5rem 0 0.75rem 0",
              }}>
                Built for Restricted Enterprise Gateways
              </h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.92rem", lineHeight: 1.65, marginBottom: "1.5rem" }}>
                Fully compliant with strict enterprise network inspection proxies and SSL inspection firewalls including Zscaler Internet Access, Cisco Umbrella, and Palo Alto Prisma.
              </p>
              <button
                onClick={scrollToPortal}
                className="btn-secondary"
                style={{
                  padding: "0.7rem 1.4rem",
                  fontSize: "0.82rem",
                }}
              >
                <span>ENTER PREVIEW CREDENTIALS</span>
                <ChevronRight size={15} style={{ marginLeft: "6px" }} />
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {[
                { label: "Strict HSTS", sub: "Preload & Subdomains", val: "31.5M sec" },
                { label: "Content Security Policy", sub: "Strict XSS Isolation", val: "Enforced" },
                { label: "NIST SP 800-207", sub: "Zero-Trust Architecture", val: "Compliant" },
                { label: "Air-Gapped Ops", sub: "Zero SaaS Egress", val: "Supported" },
              ].map((c, ci) => (
                <div key={ci} style={{
                  background: "rgba(0, 0, 0, 0.5)",
                  border: "1px solid var(--border-color)",
                  borderRadius: "2px",
                  padding: "1.15rem",
                }}>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "1.15rem",
                    fontWeight: 900,
                    color: "var(--accent-primary)",
                    marginBottom: "3px",
                  }}>
                    {c.val}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "0.82rem",
                    fontWeight: 700,
                    color: "var(--text-main)",
                    textTransform: "uppercase",
                  }}>
                    {c.label}
                  </div>
                  <div style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.7rem",
                    color: "var(--text-dim)",
                    marginTop: "2px",
                  }}>
                    {c.sub}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer style={{
        borderTop: "1px solid var(--border-color)",
        background: "rgba(3, 6, 8, 0.9)",
        padding: "2.5rem 1.5rem 2rem 1.5rem",
        textAlign: "center",
        fontSize: "0.78rem",
        color: "var(--text-dim)",
        fontFamily: "var(--font-mono)",
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "8px", marginBottom: "0.85rem" }}>
            <ExultiaLogo size={24} glow={false} />
            <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, color: "#FFFFFF", fontSize: "0.88rem", letterSpacing: "0.08em" }}>
              EXULTIA TECHNOLOGIES
            </span>
          </div>
          <p style={{ margin: "0 0 1rem 0", maxWidth: "600px", marginInline: "auto", lineHeight: 1.5, color: "var(--text-muted)" }}>
            Proprietary and Confidential. Autonomous Threat Remediation, Real-Time Vulnerability Intelligence, and Continuous Self-Healing for Linux.
          </p>
          <div style={{ display: "flex", justifyContent: "center", gap: "1.25rem", fontSize: "0.75rem", flexWrap: "wrap" }}>
            <span>© {new Date().getFullYear()} Exultia Technologies, PBC. All rights reserved.</span>
            <span>•</span>
            <Link href="/faq" style={{ color: "var(--accent-primary)", textDecoration: "none", fontWeight: 700 }}>
              FAQ
            </Link>
            <span>•</span>
            <Link href="/wiki" style={{ color: "var(--accent-primary)", textDecoration: "none", fontWeight: 700 }}>
              Research Wiki
            </Link>
            <span>•</span>
            <span style={{ color: "var(--accent-primary)", cursor: "pointer", fontWeight: 700 }} onClick={scrollToPortal}>
              Passkey Portal
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
