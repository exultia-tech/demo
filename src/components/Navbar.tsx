"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { LogOut, User as UserIcon, Shield, ChevronDown, Sparkles, RotateCcw } from "lucide-react";
import { ExultiaLogo, PureIdeIcon, VantageIcon, InquestIcon, PraxisIcon, PureOsIcon } from "@/components/BrandIcons";
import AuthModal from "@/components/auth/AuthModal";
import PaymentModal from "@/components/billing/PaymentModal";
import AdminImpersonationBanner from "@/components/admin/AdminImpersonationBanner";
import { isIsolatedThreatFeed } from "@/config/site-config";

export default function Navbar() {
  const pathname = usePathname();
  const { user, loading, logout, openAuthModal, isImpersonating, revertImpersonation } = useAuth();
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [activeCheckoutProduct, setActiveCheckoutProduct] = useState<"pureide" | "uvi" | "inquest">("pureide");

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
    pathname.startsWith("/app/fixlist") || 
    pathname.startsWith("/products/fix-list")
  );

  const isPureOsContext = !isIsolated && (
    pathname.startsWith("/app/pureos") ||
    pathname.startsWith("/products/pure-os")
  );

  // The horizontal subnav appears once a user visits any of the product pages
  const hasSubnav = isSecureIdeContext || isThreatFeedContext || isFoiaContext || isPraxisContext || isPureOsContext;

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
            style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.85rem" }}
          >
            <ExultiaLogo size={36} />
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
                Exultia
              </span>
              <span style={{ fontSize: "0.72rem", color: "#60A5FA", fontWeight: 700, textTransform: "lowercase", letterSpacing: "0.04em" }}>
                .tech
              </span>
              {isIsolated && (
                <span style={{
                  marginLeft: "4px",
                  fontSize: "0.65rem",
                  background: "rgba(139, 92, 246, 0.2)",
                  color: "#C084FC",
                  border: "1px solid rgba(139, 92, 246, 0.4)",
                  padding: "1px 6px",
                  borderRadius: "4px",
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  textTransform: "uppercase"
                }}>
                  Vantage
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* CENTER COLUMN: MAIN NAVIGATION */}
        {isIsolated ? (
          /* ISOLATED / STANDALONE Vantage NAVIGATION (No references to other unreleased products) */
          <nav style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
            <Link 
              href={threatFeedHome}
              className={`nav-link ${pathname === "/app/uvi" || pathname === "/app/uvi/standalone" ? "active" : ""}`}
              style={{ fontWeight: 600, fontSize: "0.9rem", color: pathname === "/app/uvi" || pathname === "/app/uvi/standalone" ? "#C084FC" : undefined }}
            >
              Feed Registry
            </Link>
            <Link 
              href={threatFeedStats}
              className={`nav-link ${pathname.includes("/stats") ? "active" : ""}`}
              style={{ fontWeight: 600, fontSize: "0.9rem", color: pathname.includes("/stats") ? "#C084FC" : undefined }}
            >
              Global Statistics
            </Link>
            <a 
              href="/api/threat-feed" 
              target="_blank" 
              rel="noreferrer"
              className="nav-link"
              style={{ fontWeight: 600, fontSize: "0.9rem", display: "inline-flex", alignItems: "center", gap: "4px" }}
            >
              REST API
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
            </a>
          </nav>
        ) : (
          /* FULL SUITE PRODUCTS DROPDOWN */
          <nav style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1rem" }}>
            <div 
              style={{ position: "relative" }}
              onMouseEnter={() => setIsProductsOpen(true)}
              onMouseLeave={() => setIsProductsOpen(false)}
            >
              <button 
                className={`nav-link ${isSecureIdeContext || isThreatFeedContext || isFoiaContext ? "active" : ""}`}
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
                      href="/app/uvi" 
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

                    {/* PRODUCT 4: praxis */}
                    <Link 
                      href="/app/fixlist" 
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
                  </div>
                </div>
              )}
            </div>
          </nav>
        )}

        {/* RIGHT COLUMN: AUTHENTICATION & USER STATUS */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "0.75rem" }}>
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
              <a 
                href="/products/pure-ide#architecture" 
                className="submenu-link">
                Architecture
              </a>
              <Link 
                href="/products/pure-ide/pricing" 
                className={`submenu-link ${pathname === "/products/pure-ide/pricing" ? "active-blue" : ""}`}>
                Pricing
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
                href={threatFeedHome} 
                className={`submenu-link ${pathname === "/app/uvi" || pathname === "/app/uvi/standalone" ? "active-purple" : ""}`}>
                Feed Registry
              </Link>
              <Link 
                href={threatFeedStats} 
                className={`submenu-link ${pathname.includes("/stats") ? "active-purple" : ""}`}>
                Global Statistics
              </Link>
              <Link 
                href="/app/uvi/best-practices" 
                className={`submenu-link ${pathname.includes("/best-practices") ? "active-purple" : ""}`}>
                Best Practices
              </Link>
              <a 
                href="/api/threat-feed" 
                target="_blank" 
                rel="noreferrer" 
                className="submenu-link">
                REST API (JSON)
              </a>
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
                href="/products/inquest/features" 
                className={`submenu-link ${pathname === "/products/inquest/features" ? "active-cyan" : ""}`}>
                Features
              </Link>
              <Link 
                href="/products/inquest/pricing" 
                className={`submenu-link ${pathname === "/products/inquest/pricing" ? "active-cyan" : ""}`}>
                Pricing
              </Link>
              <Link 
                href="/app/inquest" 
                className={`submenu-link ${pathname === "/app/inquest" || pathname === "/foia" ? "active-cyan" : ""}`}
                style={{ fontWeight: 600 }}>
                Inquest Workspace
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
                href="/app/fixlist" 
                className={`submenu-link ${pathname === "/app/fixlist" ? "active-emerald" : ""}`}>
                Client Generator
              </Link>
              <Link 
                href="/products/fix-list/pricing" 
                className={`submenu-link ${pathname === "/products/fix-list/pricing" ? "active-emerald" : ""}`}>
                Enterprise Licensing
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
                href="/products/pure-os/pricing" 
                className={`submenu-link ${pathname === "/products/pure-os/pricing" ? "active-amber" : ""}`}>
                Pricing
              </Link>
              <Link 
                href="/app/pureos" 
                className={`submenu-link ${pathname === "/app/pureos" ? "active-amber" : ""}`}
                style={{ fontWeight: 600 }}>
                Catalogue
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

