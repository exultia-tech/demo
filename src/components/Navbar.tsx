"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  return (
    <header className="public-nav" style={{ position: "relative", zIndex: 100 }}>
      {/* BRAND / LOGO */}
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
          {/* INVARIANT GLYPH: Interlocking Invariant Geometric Diamond */}
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
            Invariant
          </span>
          <span style={{
            fontSize: "0.68rem",
            color: "#60A5FA",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            background: "rgba(59, 130, 246, 0.15)",
            padding: "2px 6px",
            borderRadius: "4px",
            border: "1px solid rgba(59, 130, 246, 0.3)"
          }}>
            Systems
          </span>
        </div>
      </Link>

      {/* NAV LINKS */}
      <nav className="nav-links" style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        {/* PRODUCTS DROPDOWN */}
        <div 
          style={{ position: "relative" }}
          onMouseEnter={() => setIsProductsOpen(true)}
          onMouseLeave={() => setIsProductsOpen(false)}
        >
          <button 
            type="button"
            className={`nav-link ${pathname === "/console" || pathname.startsWith("/products") || pathname === "/threat-feed" || pathname === "/foia" ? "active" : ""}`}
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

          {/* FLYOUT MENU */}
          {isProductsOpen && (
            <div 
              style={{
                position: "absolute",
                top: "100%",
                left: "-20px",
                width: "340px",
                paddingTop: "8px",
                zIndex: 150
              }}
            >
              <div style={{
                background: "rgba(10, 15, 26, 0.96)",
                backdropFilter: "blur(20px)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "14px",
                padding: "8px",
                boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.8), 0 0 25px rgba(59, 130, 246, 0.2)"
              }}>
                <Link 
                  href="/console" 
                  onClick={() => setIsProductsOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    transition: "background 0.15s ease",
                    background: pathname === "/console" || pathname.includes("secure-ide") ? "rgba(59, 130, 246, 0.15)" : "transparent"
                  }}
                  className="dropdown-item"
                >
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #3B82F6, #2563EB)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>SecureIDE</div>
                    <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>Zero-trust developer workstation compiler</div>
                  </div>
                </Link>

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
                    background: pathname === "/threat-feed" || pathname.includes("threat-feed") ? "rgba(139, 92, 246, 0.15)" : "transparent"
                  }}
                  className="dropdown-item"
                >
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #8B5CF6, #7C3AED)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>UVI Threat Feed</div>
                    <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>55 synchronized public intelligence feeds</div>
                  </div>
                </Link>

                <Link 
                  href="/foia" 
                  onClick={() => setIsProductsOpen(false)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "10px 12px",
                    borderRadius: "10px",
                    textDecoration: "none",
                    transition: "background 0.15s ease",
                    background: pathname === "/foia" || pathname.includes("foia") ? "rgba(6, 182, 212, 0.15)" : "transparent"
                  }}
                  className="dropdown-item"
                >
                  <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #06B6D4, #0891B2)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", flexShrink: 0 }}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>Deterministic FOIA</div>
                    <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>LexPublica open records & compliance autopilot</div>
                  </div>
                </Link>
              </div>
            </div>
          )}
        </div>

        <Link href="/about" className={`nav-link ${pathname === "/about" ? "active" : ""}`}>
          About
        </Link>
        <Link href="/docs" className={`nav-link ${pathname === "/docs" ? "active" : ""}`}>
          Docs
        </Link>
      </nav>

      {/* ACTION CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <Link 
          href="/console" 
          className="btn-primary" 
          style={{ padding: "0.65rem 1.25rem", fontSize: "0.875rem", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          Launch Console →
        </Link>
      </div>
    </header>
  );
}
