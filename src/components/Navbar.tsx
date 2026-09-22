"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  // Determine current active product context
  const isSecureIdeContext = 
    pathname.startsWith("/products/pure-ide") || 
    pathname.startsWith("/products/secure-ide") || 
    pathname === "/pricing" || 
    pathname === "/features" || 
    pathname === "/console";

  const isThreatFeedContext = 
    pathname.startsWith("/threat-feed") || 
    pathname.startsWith("/products/threat-feed");

  const isFoiaContext = 
    pathname.startsWith("/inquest") || 
    pathname.startsWith("/products/inquest") || 
    pathname.startsWith("/foia") || 
    pathname.startsWith("/products/foia");

  // The horizontal subnav appears once a user visits any of the 3 product pages
  const hasSubnav = isSecureIdeContext || isThreatFeedContext || isFoiaContext;

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100 }}>
      {/* TIER 1: PARENT NAVIGATION BAR (3-Column Grid for exact center alignment) */}
      <header className="public-nav">
        {/* LEFT COLUMN: BRAND / LOGO */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-start" }}>
          <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "0.75rem" }}>
            <div style={{
              width: "36px",
              height: "36px",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #3B82F6 0%, #8B5CF6 50%, #06B6D4 100%)",
              display: "grid",
              placeItems: "center",
              color: "white",
              boxShadow: "0 0 15px rgba(59, 130, 246, 0.4)"
            }}>
              {/* EXULTIA GLYPH: Geometric Diamond */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <polygon points="12 2 22 8.5 22 15.5 12 22 2 15.5 2 8.5 12 2" />
                <line x1="12" y1="22" x2="12" y2="15.5" />
                <polyline points="22 8.5 12 15.5 2 8.5" />
                <polyline points="2 15.5 12 8.5 22 15.5" />
                <line x1="12" y1="2" x2="12" y2="8.5" />
              </svg>
            </div>
            <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
              <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em" }}>
                Exultia
              </span>
              <span style={{
                fontSize: "0.68rem",
                color: "#60A5FA",
                fontWeight: 700,
                letterSpacing: "0.08em",
                textTransform: "lowercase",
                background: "rgba(59, 130, 246, 0.15)",
                padding: "2px 6px",
                borderRadius: "4px",
                border: "1px solid rgba(59, 130, 246, 0.3)"
              }}>
                .tech
              </span>
            </div>
          </Link>
        </div>

        {/* CENTER COLUMN: NAV LINKS (Centered in the viewport) */}
        <nav className="nav-links" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.75rem" }}>
          {/* PRODUCTS DROPDOWN: ALL 3 CORE PLATFORMS */}
          <div 
            style={{ position: "relative" }}
            onMouseEnter={() => setIsProductsOpen(true)}
            onMouseLeave={() => setIsProductsOpen(false)}
          >
            <button 
              type="button"
              className={`nav-link ${isSecureIdeContext || isThreatFeedContext || isFoiaContext ? "active" : ""}`}
              style={{
                background: "transparent",
                border: "none",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                cursor: "pointer",
                fontFamily: "inherit",
                fontSize: "0.95rem",
                fontWeight: 500,
                padding: "6px 10px",
                borderRadius: "8px"
              }}
              onClick={() => setIsProductsOpen(!isProductsOpen)}
            >
              <span>Products</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isProductsOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }}>
                <polyline points="6 9 12 15 18 9"/>
              </svg>
            </button>

            {/* FLYOUT MENU: 3 CORE PRODUCTS */}
            {isProductsOpen && (
              <div 
                style={{
                  position: "absolute",
                  top: "100%",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "370px",
                  paddingTop: "8px",
                  zIndex: 150
                }}
              >
                <div style={{
                  background: "rgba(10, 15, 26, 0.98)",
                  backdropFilter: "blur(20px)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "14px",
                  padding: "8px",
                  boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(59, 130, 246, 0.2)"
                }}>
                  <div style={{ padding: "6px 12px 4px 12px", fontSize: "0.68rem", fontWeight: 800, color: "#60A5FA", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Core Product Platforms
                  </div>

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
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #3B82F6, #2563EB)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>PureIDE</div>
                      <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>Zero-trust developer workstation compiler</div>
                    </div>
                  </Link>

                  {/* PRODUCT 2: UVI */}
                  <Link 
                    href="/threat-feed" 
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
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                    </div>
                    <div>
                      <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>Universal Vulnerability Intelligence (UVI)</div>
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
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #06B6D4, #0891B2)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
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
        </nav>

        {/* RIGHT COLUMN (Balancing empty div to keep the center nav mathematically centered) */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end" }} />
      </header>

      {/* TIER 2: HORIZONTAL PRODUCT SUBMENU (Centered in the viewport) */}
      {hasSubnav && (
        <div className="product-submenu-bar">
          {/* SUBMENU OPTION 1: PUREIDE SUBMENU */}
          {isSecureIdeContext && (
            <div className="product-submenu-group">
              <span className="product-context-badge" style={{ background: "rgba(59, 130, 246, 0.15)", color: "#60A5FA", borderColor: "rgba(59, 130, 246, 0.3)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                PureIDE
              </span>

              <Link 
                href="/products/pure-ide" 
                className={`submenu-link ${pathname === "/products/pure-ide" || pathname === "/products/secure-ide" ? "active-blue" : ""}`}>
                Overview
              </Link>
              <Link 
                href="/features" 
                className={`submenu-link ${pathname === "/features" ? "active-blue" : ""}`}>
                Features
              </Link>
              <Link 
                href="/pricing" 
                className={`submenu-link ${pathname === "/pricing" ? "active-blue" : ""}`}>
                Pricing
              </Link>
              <Link 
                href="/console" 
                className={`submenu-link ${pathname === "/console" ? "active-blue" : ""}`}
                style={{ fontWeight: 600 }}>
                Builder Console
              </Link>
            </div>
          )}

          {/* SUBMENU OPTION 2: UVI SUBMENU */}
          {isThreatFeedContext && (
            <div className="product-submenu-group">
              <span className="product-context-badge" style={{ background: "rgba(139, 92, 246, 0.15)", color: "#C084FC", borderColor: "rgba(139, 92, 246, 0.3)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                UVI
              </span>

              <Link 
                href="/threat-feed" 
                className={`submenu-link ${pathname === "/threat-feed" ? "active-purple" : ""}`}>
                Feed Registry
              </Link>
              <Link 
                href="/threat-feed/stats" 
                className={`submenu-link ${pathname === "/threat-feed/stats" ? "active-purple" : ""}`}>
                Global Statistics
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

          {/* SUBMENU OPTION 3: INQUEST SUBMENU */}
          {isFoiaContext && (
            <div className="product-submenu-group">
              <span className="product-context-badge" style={{ background: "rgba(6, 182, 212, 0.15)", color: "#67E8F9", borderColor: "rgba(6, 182, 212, 0.3)" }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
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
                href="/inquest" 
                className={`submenu-link ${pathname === "/inquest" || pathname === "/foia" ? "active-cyan" : ""}`}
                style={{ fontWeight: 600 }}>
                Inquest Workspace
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
