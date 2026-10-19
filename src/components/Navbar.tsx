"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { ExultiaLogo, PureIdeIcon, VantageIcon, InquestIcon, PraxisIcon, PureOsIcon, AxiomIcon, KineticIcon, ArgentIcon, CuriaIcon } from "@/components/BrandIcons";
import AuthModal from "@/components/auth/AuthModal";
import PaymentModal from "@/components/billing/PaymentModal";
import AdminImpersonationBanner from "@/components/admin/AdminImpersonationBanner";
import { isIsolatedThreatFeed } from "@/config/site-config";
import { ChevronDown, User as UserIcon, Shield, Sparkles, RotateCcw, LogOut, Lock } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();

  // Hide full navigation bar on private preview / holding page
  if (pathname === "/preview") {
    return null;
  }

  const { user, loading, logout, openAuthModal, isImpersonating, revertImpersonation } = useAuth();
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeCheckoutProduct, setActiveCheckoutProduct] = useState<"pureide" | "uvi" | "inquest">("pureide");
  const [isOperator, setIsOperator] = useState(false);

  useEffect(() => {
    if (typeof document !== "undefined") {
      const hasCookie = document.cookie.includes("exultia_operator_key");
      setIsOperator(hasCookie || user?.role === "admin" || process.env.NODE_ENV !== "production");
    }
  }, [user]);

  // Axiom active tab state synchronized with URL search param
  const [axiomTab, setAxiomTab] = useState<string>("syllabus");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const search = new URLSearchParams(window.location.search);
      const tab = search.get("tab");
      if (tab) setAxiomTab(tab);
    }
  }, [pathname]);

  useEffect(() => {
    const handleTab = (e: any) => {
      if (e.detail) setAxiomTab(e.detail);
    };
    window.addEventListener("axiom-tab-change", handleTab);
    return () => window.removeEventListener("axiom-tab-change", handleTab);
  }, []);

  // Determine isolation mode (Standalone / Isolated Threat Feed)
  const isIsolated = isIsolatedThreatFeed(
    pathname,
    typeof window !== "undefined" ? new URLSearchParams(window.location.search) : null
  );

  const isStandaloneRoute = pathname?.startsWith("/app/uvi/standalone") || pathname?.startsWith("/app/uvi/isolated");
  const threatFeedHome = isStandaloneRoute ? "/app/uvi/standalone" : "/app/uvi";
  const threatFeedStats = isStandaloneRoute ? "/app/uvi/standalone/stats" : "/app/uvi/stats";

  // Determine subnav contexts
  const isSecureIdeContext = !isIsolated && (
    pathname === "/app/pureide" || 
    pathname.startsWith("/products/pure-ide") || 
    pathname.startsWith("/docs") ||
    pathname.startsWith("/products/secure-ide")
  );
  
  const isThreatFeedContext = 
    pathname.startsWith("/app/uvi") || 
    pathname.startsWith("/products/uvi") || 
    pathname.startsWith("/products/threat-feed");

  const isFoiaContext = !isIsolated && (
    pathname.startsWith("/app/inquest") || 
    pathname.startsWith("/products/inquest") || 
    pathname.startsWith("/foia") ||
    pathname.startsWith("/products/foia")
  );

  const isPraxisContext = !isIsolated && (
    pathname.startsWith("/app/praxis") || 
    pathname.startsWith("/products/praxis")
  );

  const isPureOsContext = !isIsolated && (
    pathname.startsWith("/app/pureos") ||
    pathname.startsWith("/products/pure-os")
  );

  const isAxiomContext = !isIsolated && (
    pathname.startsWith("/app/axiom")
  );

  const isKineticContext = !isIsolated && (
    pathname.startsWith("/app/patches") ||
    pathname.startsWith("/products/kinetic")
  );

  const isArgentContext = !isIsolated && (
    pathname.startsWith("/app/argent") ||
    pathname.startsWith("/argent")
  );

  const isCuriaContext = !isIsolated && (
    pathname.startsWith("/app/curia") ||
    pathname.startsWith("/curia")
  );

  // The horizontal subnav appears once a user visits any of the product pages
  const hasSubnav = isSecureIdeContext || isThreatFeedContext || isArgentContext || isCuriaContext || isFoiaContext || isPraxisContext || isPureOsContext || isAxiomContext || isKineticContext;

  // Active subscription helper
  const activeInquestSub = user?.subscriptions?.find(s => s.product === "inquest" && s.status === "active");

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
      {/* PERSISTENT ADMIN IMPERSONATION BANNER */}
      <AdminImpersonationBanner />

      {/* TIER 1: PARENT NAVIGATION BAR (3-Column Grid for exact center alignment) */}
      <header className="public-nav">
        {/* LEFT COLUMN: BRAND / LOGO */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
          <Link 
            href={isIsolated ? threatFeedHome : "/"} 
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "1.1rem" }}
          >
            <ExultiaLogo size={62} glow={false} />
            <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.05 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                <span style={{ 
                  fontFamily: "var(--font-display, 'Orbitron', sans-serif)", 
                  fontSize: "1.52rem", 
                  fontWeight: 900, 
                  color: "#FFFFFF", 
                  letterSpacing: "0.1em",
                  textTransform: "uppercase",
                  textShadow: "0 0 16px var(--accent-glow), 0 0 32px var(--accent-glow)"
                }}>
                  EXULTIA
                </span>
                {isIsolated && (
                  <span style={{
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.68rem",
                    background: "rgba(0, 229, 255, 0.18)",
                    color: "var(--accent-primary)",
                    border: "1px solid var(--accent-primary)",
                    padding: "2px 7px",
                    borderRadius: "2px",
                    fontWeight: 800,
                    letterSpacing: "0.08em",
                    textTransform: "uppercase"
                  }}>
                    Vantage
                  </span>
                )}
              </div>
              <span style={{ 
                fontFamily: "var(--font-mono, 'Share Tech Mono', monospace)", 
                fontSize: "0.68rem", 
                fontWeight: 800, 
                color: "var(--accent-primary)", 
                letterSpacing: "0.38em", 
                textTransform: "uppercase",
                marginTop: "2px"
              }}>
                TECHNOLOGIES
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER COLUMN: MAIN NAVIGATION */}
        {isIsolated ? (
          /* ISOLATED / STANDALONE Vantage NAVIGATION (No references to other unreleased products) */
          <nav style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
            <Link 
              href={threatFeedStats}
              className={`nav-link ${pathname.includes("/stats") ? "active" : ""}`}
              style={{ fontWeight: 600, fontSize: "0.9rem", color: pathname.includes("/stats") ? "#C084FC" : undefined }}
            >
              Global Statistics
            </Link>
            <Link 
              href={threatFeedHome}
              className={`nav-link ${pathname === "/app/uvi" || pathname === "/app/uvi/standalone" ? "active" : ""}`}
              style={{ fontWeight: 600, fontSize: "0.9rem", color: pathname === "/app/uvi" || pathname === "/app/uvi/standalone" ? "#C084FC" : undefined }}
            >
              Feed Registry
            </Link>
          </nav>
        ) : (
          /* FULL SUITE PRODUCTS DROPDOWN */
          <nav style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.25rem" }}>
            <div 
              style={{ position: "relative" }}
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <button 
                className={`nav-link ${isSecureIdeContext || isThreatFeedContext || isFoiaContext || isPraxisContext || isPureOsContext || isAxiomContext || isKineticContext ? "active" : ""}`}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  background: isProductsOpen ? "rgba(255, 255, 255, 0.08)" : "transparent",
                  border: "none",
                  cursor: "pointer"
                }}
                onClick={() => setIsProductsOpen(!isProductsOpen)}
              >
                Products
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isProductsOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s ease" }}>
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* DROPDOWN MENU */}
              {isProductsOpen && (
                <div 
                  style={{
                    position: "absolute",
                    top: "100%",
                    left: "50%",
                    transform: "translateX(-50%)",
                    paddingTop: "8px",
                    zIndex: 1000
                  }}
                >
                  <div style={{
                    background: "rgba(10, 15, 26, 0.96)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "14px",
                    padding: "6px",
                    minWidth: "300px",
                    boxShadow: "0 20px 40px -10px rgba(0,0,0,0.8), 0 0 20px rgba(59, 130, 246, 0.15)",
                    display: "flex",
                    flexDirection: "column",
                    gap: "2px"
                  }}>
                    {/* PRODUCT 1: PUREIDE */}
                    <Link 
                      href="/products/pure-ide" 
                      onClick={() => setIsProductsOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        transition: "background 0.15s ease",
                        background: isSecureIdeContext ? "rgba(59, 130, 246, 0.15)" : "transparent"
                      }}
                      className="dropdown-item"
                    >
                      <div style={{ flexShrink: 0 }}>
                        <PureIdeIcon size={32} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>PureIDE</div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>Zero-trust developer workstation compiler</div>
                      </div>
                    </Link>

                    {/* PRODUCT 2: Vantage */}
                    <Link 
                      href="/app/uvi/stats" 
                      onClick={() => setIsProductsOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        transition: "background 0.15s ease",
                        background: isThreatFeedContext ? "rgba(139, 92, 246, 0.15)" : "transparent"
                      }}
                      className="dropdown-item"
                    >
                      <div style={{ flexShrink: 0 }}>
                        <VantageIcon size={32} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>Vantage</div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>Universal threat feed aggregating 110+ global registries</div>
                      </div>
                    </Link>

                    {/* PRODUCT: ARGENT (Public OS Distro Patch Aggregator) */}
                    <Link 
                      href="/argent" 
                      onClick={() => setIsProductsOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        transition: "background 0.15s ease",
                        background: isArgentContext ? "rgba(148, 163, 184, 0.2)" : "transparent"
                      }}
                      className="dropdown-item"
                    >
                      <div style={{ flexShrink: 0 }}>
                        <ArgentIcon size={32} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>Argent</span>
                          <span style={{ fontSize: "0.65rem", background: "rgba(148, 163, 184, 0.2)", color: "#E2E8F0", border: "1px solid rgba(148, 163, 184, 0.4)", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>NEW</span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>Public OS vendor patch bundles categorized by distro</div>
                      </div>
                    </Link>

                    {/* PRODUCT: curia */}
                    <Link 
                      href="/app/curia" 
                      onClick={() => setIsProductsOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        transition: "background 0.15s ease",
                        background: isCuriaContext ? "rgba(16, 185, 129, 0.2)" : "transparent"
                      }}
                      className="dropdown-item"
                    >
                      <div style={{ flexShrink: 0 }}>
                        <CuriaIcon size={32} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>Curia</span>
                          <span style={{ fontSize: "0.65rem", background: "rgba(16, 185, 129, 0.2)", color: "#34D399", border: "1px solid rgba(16, 185, 129, 0.4)", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>CIVIC</span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>Cryptographically defensible civic voting &amp; Merkle roll calls</div>
                      </div>
                    </Link>

                    {/* PRODUCT 4: praxis */}
                    <Link 
                      href="/app/praxis" 
                      onClick={() => setIsProductsOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        transition: "background 0.15s ease",
                        background: isPraxisContext ? "rgba(16, 185, 129, 0.15)" : "transparent"
                      }}
                      className="dropdown-item"
                    >
                      <div style={{ flexShrink: 0 }}>
                        <PraxisIcon size={32} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>Praxis</div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>Targeted remediation payloads from Vantage</div>
                      </div>
                    </Link>

                    {/* PRODUCT CONCEPT: Kinetic (Rapid Patch Feed) */}
                    <Link 
                      href="/app/patches" 
                      onClick={() => setIsProductsOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        transition: "background 0.15s ease",
                        background: pathname.startsWith("/app/patches") ? "rgba(6, 182, 212, 0.15)" : "transparent"
                      }}
                      className="dropdown-item"
                    >
                      <div style={{ flexShrink: 0 }}>
                        <KineticIcon size={32} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>Kinetic</span>
                          <span style={{ fontSize: "0.65rem", background: "rgba(6, 182, 212, 0.2)", color: "#22D3EE", border: "1px solid rgba(6, 182, 212, 0.4)", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>NEW CONCEPT</span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>Rapid zero-downtime patch management feed</div>
                      </div>
                    </Link>

                    {/* PRODUCT 5: PureOS */}
                    <Link 
                      href="/products/pure-os" 
                      onClick={() => setIsProductsOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        transition: "background 0.15s ease",
                        background: isPureOsContext ? "rgba(245, 158, 11, 0.15)" : "transparent"
                      }}
                      className="dropdown-item"
                    >
                      <div style={{ flexShrink: 0 }}>
                        <PureOsIcon size={32} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>PureOS</div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>Pre-hardened OS container catalogue</div>
                      </div>
                    </Link>

                    {/* PRODUCT 6: Axiom */}
                    <Link 
                      href="/app/axiom" 
                      onClick={() => setIsProductsOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        transition: "background 0.15s ease",
                        background: isAxiomContext ? "rgba(244, 63, 94, 0.15)" : "transparent"
                      }}
                      className="dropdown-item"
                    >
                      <div style={{ flexShrink: 0 }}>
                        <AxiomIcon size={32} glow={false} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>Axiom</div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>Cybersecurity exam simulator & LMS API</div>
                      </div>
                    </Link>
                    {/* PRODUCT 3: INQUEST */}
                    <Link 
                      href="/products/inquest" 
                      onClick={() => setIsProductsOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        transition: "background 0.15s ease",
                        background: isFoiaContext ? "rgba(6, 182, 212, 0.15)" : "transparent"
                      }}
                      className="dropdown-item"
                    >
                      <div style={{ flexShrink: 0 }}>
                        <InquestIcon size={32} />
                      </div>
                      <div>
                        <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>Inquest</div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>Autonomous public records compliance platform</div>
                      </div>
                    </Link>

                  </div>
                </div>
              )}
            </div>

            {/* DIRECT PRICING & PLANS LINK */}
            <Link 
              href="/account/subscription"
              className={`nav-link ${pathname === "/account/subscription" ? "active" : ""}`}
              style={{
                fontWeight: 600,
                fontSize: "0.9rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px"
              }}
            >
              Pricing & Plans
            </Link>

            {/* RESEARCH WIKI: SPECIFICATIONS, INTERACTIVE LAB SIMULATORS & API REFERENCE */}
            <Link 
              href="/wiki"
              className={`nav-link ${pathname === "/wiki" || pathname?.startsWith("/wiki") || pathname === "/research" || pathname?.startsWith("/research") || pathname?.startsWith("/docs") ? "active" : ""}`}
              style={{
                fontWeight: 600,
                fontSize: "0.9rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                color: pathname === "/wiki" || pathname?.startsWith("/wiki") || pathname === "/research" || pathname?.startsWith("/research") || pathname?.startsWith("/docs") ? "var(--accent-primary)" : undefined
              }}
            >
              Research Wiki
              <span style={{
                fontSize: "0.62rem",
                background: "rgba(0, 229, 255, 0.15)",
                color: "var(--accent-primary)",
                border: "1px solid rgba(0, 229, 255, 0.35)",
                padding: "1px 5px",
                borderRadius: "4px",
                fontWeight: 700,
                letterSpacing: "0.03em"
              }}>
                LAB &amp; DOCS
              </span>
            </Link>
          </nav>
        )}

        {/* RIGHT COLUMN: AUTHENTICATION & USER STATUS */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem" }}>
          {/* Site Locking Control (Operator Preview / Admin / Dev) */}
          {isOperator && (
            <a
              href="/api/preview/lock"
              title="Lock site preview and return to holding screen"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                background: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.3)",
                borderRadius: "8px",
                padding: "6px 12px",
                color: "#FCA5A5",
                fontSize: "0.8rem",
                fontWeight: 600,
                textDecoration: "none",
                cursor: "pointer",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                boxShadow: "0 0 10px rgba(239, 68, 68, 0.08)",
                whiteSpace: "nowrap"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.22)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.65)";
                e.currentTarget.style.color = "#FFFFFF";
                e.currentTarget.style.boxShadow = "0 0 16px rgba(239, 68, 68, 0.35)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                e.currentTarget.style.borderColor = "rgba(239, 68, 68, 0.3)";
                e.currentTarget.style.color = "#FCA5A5";
                e.currentTarget.style.boxShadow = "0 0 10px rgba(239, 68, 68, 0.08)";
                e.currentTarget.style.transform = "none";
              }}
            >
              <Lock size={13} color="#F87171" style={{ strokeWidth: 2.2 }} />
              <span>Lock Site</span>
            </a>
          )}

          {loading ? (
            <div style={{ width: "80px", height: "32px", background: "rgba(255,255,255,0.05)", borderRadius: "8px" }} />
          ) : user ? (
            <div style={{ position: "relative" }}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "10px",
                  padding: "5px 12px",
                  color: "#FFFFFF",
                  cursor: "pointer",
                  fontSize: "0.85rem",
                  fontWeight: 600
                }}
              >
                <div style={{
                  width: "22px",
                  height: "22px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3B82F6, #8B5CF6)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "0.7rem",
                  color: "white",
                  fontWeight: 800
                }}>
                  {user.name ? user.name.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
                </div>
                <span>{user.name || user.email.split("@")[0]}</span>
                {user.role === "admin" ? (
                  <span style={{ fontSize: "0.68rem", color: "#FCD34D", background: "rgba(245, 158, 11, 0.2)", padding: "1px 6px", borderRadius: "4px", fontWeight: 700, textTransform: "uppercase" }}>
                    ADMIN
                  </span>
                ) : activeInquestSub && activeInquestSub.tier !== "free" && !isIsolated ? (
                  <span style={{ fontSize: "0.68rem", color: "#67E8F9", background: "rgba(6, 182, 212, 0.2)", padding: "1px 6px", borderRadius: "4px", fontWeight: 700, textTransform: "uppercase" }}>
                    {activeInquestSub.tier}
                  </span>
                ) : null}
                <ChevronDown size={14} color="#94A3B8" />
              </button>

              {/* USER MENU DROPDOWN */}
              {isUserMenuOpen && (
                <div 
                  style={{
                    position: "absolute",
                    top: "120%",
                    right: 0,
                    background: "rgba(10, 15, 26, 0.98)",
                    backdropFilter: "blur(16px)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "14px",
                    padding: "8px",
                    minWidth: "240px",
                    boxShadow: "0 20px 40px rgba(0,0,0,0.85), 0 0 20px rgba(59, 130, 246, 0.12)",
                    zIndex: 1000
                  }}
                  onMouseLeave={() => setIsUserMenuOpen(false)}
                >
                  <div style={{ padding: "8px 10px", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2px" }}>
                      <div style={{ fontSize: "0.84rem", fontWeight: 700, color: "#FFFFFF" }}>{user.name || "Exultia User"}</div>
                      <span style={{ fontSize: "0.65rem", color: user.role === "admin" ? "#FCD34D" : "#93C5FD", background: user.role === "admin" ? "rgba(245, 158, 11, 0.15)" : "rgba(59, 130, 246, 0.15)", padding: "1px 6px", borderRadius: "4px", fontWeight: 700, textTransform: "uppercase" }}>
                        {user.role}
                      </span>
                    </div>
                    <div style={{ fontSize: "0.72rem", color: "#94A3B8", overflow: "hidden", textOverflow: "ellipsis" }}>{user.email}</div>
                  </div>

                  <Link
                    href="/account"
                    onClick={() => setIsUserMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "8px 10px",
                      color: "#CBD5E1",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      transition: "background 0.15s ease"
                    }}
                    className="dropdown-item"
                  >
                    <UserIcon size={15} color="#60A5FA" />
                    Profile & Account
                  </Link>

                  <Link
                    href="/account/subscription"
                    onClick={() => setIsUserMenuOpen(false)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "8px 10px",
                      color: "#CBD5E1",
                      borderRadius: "8px",
                      textDecoration: "none",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      transition: "background 0.15s ease"
                    }}
                    className="dropdown-item"
                  >
                    <Shield size={15} color="#C084FC" />
                    Subscriptions & Plans
                  </Link>

                  {(user.role === "admin" || isImpersonating) && (
                    <Link
                      href="/account?tab=personas"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        padding: "8px 10px",
                        color: "#FDE68A",
                        background: "rgba(245, 158, 11, 0.1)",
                        border: "1px solid rgba(245, 158, 11, 0.2)",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        marginTop: "2px",
                        marginBottom: "2px",
                        transition: "background 0.15s ease"
                      }}
                      className="dropdown-item"
                    >
                      <Sparkles size={15} color="#F59E0B" />
                      Admin Test Personas
                    </Link>
                  )}

                  {isImpersonating && (
                    <button
                      onClick={async () => {
                        await revertImpersonation();
                        setIsUserMenuOpen(false);
                      }}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        padding: "8px 10px",
                        background: "rgba(245, 158, 11, 0.15)",
                        border: "1px solid rgba(245, 158, 11, 0.3)",
                        color: "#FDE68A",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "0.82rem",
                        fontWeight: 700,
                        textAlign: "left",
                        marginTop: "2px",
                        marginBottom: "2px"
                      }}
                      className="dropdown-item"
                    >
                      <RotateCcw size={15} color="#F59E0B" />
                      Exit Impersonation
                    </button>
                  )}

                  {isOperator && (
                    <a
                      href="/api/preview/lock"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        gap: "9px",
                        padding: "8px 10px",
                        color: "#FCA5A5",
                        borderRadius: "8px",
                        textDecoration: "none",
                        fontSize: "0.82rem",
                        fontWeight: 600,
                        transition: "background 0.15s ease"
                      }}
                      className="dropdown-item"
                    >
                      <Lock size={15} color="#F87171" />
                      Lock Site Preview
                    </a>
                  )}

                  <div style={{ height: "1px", background: "rgba(255,255,255,0.08)", margin: "4px 0" }} />

                  <button 
                    onClick={() => { logout(); setIsUserMenuOpen(false); }}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      padding: "8px 10px",
                      background: "transparent",
                      border: "none",
                      color: "#F87171",
                      borderRadius: "8px",
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      fontWeight: 600,
                      textAlign: "left"
                    }}
                    className="dropdown-item"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <button 
                onClick={() => openAuthModal("login")}
                style={{
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(139, 92, 246, 0.15))",
                  border: "1px solid rgba(59, 130, 246, 0.4)",
                  borderRadius: "8px",
                  padding: "6px 16px",
                  color: "#FFFFFF",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 0 15px rgba(59, 130, 246, 0.15)"
                }}
              >
                Sign In
              </button>
            </div>
          )}
        </div>
      </header>

      {/* TIER 2: HORIZONTAL PRODUCT SUBMENU */}
      {hasSubnav && (
        <div className="product-submenu-bar">
          {/* SUBMENU OPTION 1: PUREIDE SUBMENU (Hidden in Isolated Mode) */}
          {isSecureIdeContext && (
            <div className="product-submenu-group">
              <span className="product-context-badge" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60A5FA", borderColor: "rgba(59, 130, 246, 0.3)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <PureIdeIcon size={16} glow={false} />
                PureIDE
              </span>

              <Link 
                href="/products/pure-ide" 
                className={`submenu-link ${pathname === "/products/pure-ide" || pathname === "/products/secure-ide" ? "active-blue" : ""}`}>
                Overview & Features
              </Link>
              <Link 
                href="/account/subscription?product=pureide" 
                className="submenu-link"
                style={{ color: "#93C5FD", fontWeight: 700 }}>
                Plans & Pricing
              </Link>
              <Link 
                href="/app/pureide" 
                className={`submenu-link ${pathname === "/app/pureide" ? "active-blue" : ""}`}
                style={{ fontWeight: 600 }}>
                Builder Console
              </Link>
            </div>
          )}

          {/* SUBMENU OPTION 2: Vantage SUBMENU */}
          {isThreatFeedContext && (
            <div className="product-submenu-group">
              <span className="product-context-badge" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#C084FC", borderColor: "rgba(139, 92, 246, 0.3)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <VantageIcon size={16} glow={false} />
                {isIsolated ? "Vantage Threat Intelligence" : "Vantage"}
              </span>

              <Link 
                href={threatFeedStats} 
                className={`submenu-link ${pathname.includes("/stats") ? "active-purple" : ""}`}>
                Global Statistics
              </Link>
              <Link 
                href={threatFeedHome} 
                className={`submenu-link ${pathname === "/app/uvi" || pathname === "/app/uvi/standalone" ? "active-purple" : ""}`}>
                Feed Registry
              </Link>
              <Link 
                href="/account/subscription?product=uvi" 
                className="submenu-link"
                style={{ color: "#C084FC", fontWeight: 700 }}>
                Plans & Pricing
              </Link>
            </div>
          )}

          {/* SUBMENU OPTION 4: praxis SUBMENU */}
          {isPraxisContext && (
            <div className="product-submenu-group">
              <span className="product-context-badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34D399", borderColor: "rgba(16, 185, 129, 0.3)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <PraxisIcon size={16} glow={false} />
                Praxis
              </span>

              <Link 
                href="/app/praxis" 
                className={`submenu-link ${pathname === "/app/praxis" ? "active-emerald" : ""}`}>
                Client Generator
              </Link>
              <Link 
                href="/account/subscription?product=praxis" 
                className="submenu-link"
                style={{ color: "#FDE68A", fontWeight: 700 }}>
                Plans & Pricing
              </Link>
            </div>
          )}

          {/* SUBMENU OPTION 5: PureOS SUBMENU */}
          {isPureOsContext && (
            <div className="product-submenu-group">
              <span className="product-context-badge" style={{ background: "rgba(245, 158, 11, 0.15)", color: "#FBBF24", borderColor: "rgba(245, 158, 11, 0.3)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <PureOsIcon size={16} glow={false} />
                PureOS
              </span>

              <Link 
                href="/products/pure-os" 
                className={`submenu-link ${pathname === "/products/pure-os" ? "active-amber" : ""}`}>
                Overview
              </Link>
              <Link 
                href="/app/pureos" 
                className={`submenu-link ${pathname === "/app/pureos" ? "active-amber" : ""}`}
                style={{ fontWeight: 600 }}>
                Catalogue
              </Link>
              <Link 
                href="/account/subscription?product=pureos" 
                className="submenu-link"
                style={{ color: "#FBBF24", fontWeight: 700 }}>
                Plans & Pricing
              </Link>
            </div>
          )}

          {/* SUBMENU OPTION 6: AXIOM SUBMENU */}
          {isAxiomContext && (
            <div className="product-submenu-group">
              <span className="product-context-badge" style={{ background: "rgba(244, 63, 94, 0.15)", color: "#FDA4AF", borderColor: "rgba(244, 63, 94, 0.3)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <AxiomIcon size={16} glow={false} />
                Axiom
              </span>

              <Link 
                href="/app/axiom?tab=syllabus" 
                onClick={() => {
                  setAxiomTab("syllabus");
                  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("axiom-tab-change", { detail: "syllabus" }));
                }}
                className={`submenu-link ${pathname === "/app/axiom" && axiomTab === "syllabus" ? "active-rose" : ""}`}
                style={{ fontWeight: 600 }}>
                Exam Prep
              </Link>
              <Link 
                href="/app/axiom?tab=simulator" 
                onClick={() => {
                  setAxiomTab("simulator");
                  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("axiom-tab-change", { detail: "simulator" }));
                }}
                className={`submenu-link ${pathname === "/app/axiom" && axiomTab === "simulator" ? "active-rose" : ""}`}
                style={{ fontWeight: 600 }}>
                Exam Simulator
              </Link>
              <Link 
                href="/app/axiom?tab=exports" 
                onClick={() => {
                  setAxiomTab("exports");
                  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("axiom-tab-change", { detail: "exports" }));
                }}
                className={`submenu-link ${pathname === "/app/axiom" && axiomTab === "exports" ? "active-rose" : ""}`}
                style={{ fontWeight: 600 }}>
                Exports &amp; Certs
              </Link>
              <Link 
                href="/app/axiom?tab=api" 
                onClick={() => {
                  setAxiomTab("api");
                  if (typeof window !== "undefined") window.dispatchEvent(new CustomEvent("axiom-tab-change", { detail: "api" }));
                }}
                className={`submenu-link ${pathname === "/app/axiom" && axiomTab === "api" ? "active-rose" : ""}`}
                style={{ fontWeight: 600 }}>
                Institutional LMS API
              </Link>
              <Link 
                href="/account/subscription?product=axiom" 
                className="submenu-link"
                style={{ color: "#FDA4AF", fontWeight: 700 }}>
                Plans &amp; Pricing
              </Link>
            </div>
          )}
          {/* SUBMENU OPTION 3: INQUEST SUBMENU (Hidden in Isolated Mode) */}
          {isFoiaContext && (
            <div className="product-submenu-group">
              <span className="product-context-badge" style={{ background: "rgba(6, 182, 212, 0.15)", color: "#67E8F9", borderColor: "rgba(6, 182, 212, 0.3)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <InquestIcon size={16} glow={false} />
                Inquest
              </span>

              <Link 
                href="/products/inquest" 
                className={`submenu-link ${pathname === "/products/inquest" || pathname === "/products/foia" ? "active-cyan" : ""}`}>
                Overview
              </Link>
              <Link 
                href="/app/inquest" 
                className={`submenu-link ${pathname === "/app/inquest" || pathname === "/foia" ? "active-cyan" : ""}`}
                style={{ fontWeight: 600 }}>
                Inquest Workspace
              </Link>
              <Link 
                href="/account/subscription?product=inquest" 
                className="submenu-link"
                style={{ color: "#67E8F9", fontWeight: 700 }}>
                Plans & Pricing
              </Link>
            </div>
          )}

          {/* SUBMENU OPTION: KINETIC SUBMENU */}
          {isKineticContext && (
            <div className="product-submenu-group">
              <span className="product-context-badge" style={{ background: "rgba(6, 182, 212, 0.15)", color: "#22D3EE", borderColor: "rgba(6, 182, 212, 0.3)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <KineticIcon size={16} glow={false} />
                Kinetic
              </span>

              <Link 
                href="/app/patches" 
                className={`submenu-link ${pathname === "/app/patches" ? "active-cyan" : ""}`}>
                Patch Stream &amp; Canary
              </Link>
              <Link 
                href="/account/subscription?product=kinetic" 
                className="submenu-link"
                style={{ color: "#22D3EE", fontWeight: 700 }}>
                Plans &amp; Pricing
              </Link>
              <Link 
                href="/wiki?product=kinetic&tab=simulator" 
                className="submenu-link">
                Testing Rig
              </Link>
            </div>
          )}

          {/* SUBMENU OPTION: ARGENT SUBMENU */}
          {isArgentContext && (
            <div className="product-submenu-group">
              <span className="product-context-badge" style={{ background: "rgba(148, 163, 184, 0.15)", color: "#F1F5F9", borderColor: "rgba(148, 163, 184, 0.3)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <ArgentIcon size={16} glow={false} />
                Argent
              </span>

              <Link 
                href="/argent" 
                className={`submenu-link ${pathname === "/argent" ? "active-cyan" : ""}`}
                style={{ fontWeight: 600 }}>
                Vendor Patch Bundles
              </Link>
              <Link 
                href="/api/argent/feed" 
                target="_blank"
                className="submenu-link">
                JSON Feed
              </Link>
              <Link 
                href="/api/argent/feed?format=bash" 
                target="_blank"
                className="submenu-link">
                Bash Script
              </Link>
              <Link 
                href="/wiki#argent" 
                className="submenu-link"
                style={{ color: "#38BDF8", fontWeight: 700 }}>
                Wiki &amp; API Docs
              </Link>
            </div>
          )}

          {/* SUBMENU OPTION: CURIA SUBMENU */}
          {isCuriaContext && (
            <div className="product-submenu-group">
              <span className="product-context-badge" style={{ background: "rgba(16, 185, 129, 0.15)", color: "#34D399", borderColor: "rgba(16, 185, 129, 0.3)", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                <CuriaIcon size={16} glow={false} />
                Curia Civic
              </span>

              <Link 
                href="/curia" 
                className={`submenu-link ${pathname === "/curia" || pathname === "/app/curia" ? "active-cyan" : ""}`}
                style={{ fontWeight: 600 }}>
                Chamber Console
              </Link>
              <Link 
                href="/api/curia/session" 
                target="_blank"
                className="submenu-link">
                Session JSON
              </Link>
              <Link 
                href="/api/curia/dossier" 
                target="_blank"
                className="submenu-link">
                FRE 902(13) Dossier
              </Link>
            </div>
          )}

        </div>
      )}
    </div>
  );
}

