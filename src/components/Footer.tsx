"use client";

import { usePathname } from "next/navigation";

export default function Footer() {
  const pathname = usePathname();

  // Hide on private preview / holding page
  if (pathname === "/preview") {
    return null;
  }

  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <footer className="no-print" style={{
      borderTop: "1px solid rgba(255, 255, 255, 0.08)",
      padding: "2rem 1.5rem",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: "0.75rem",
      marginTop: "auto",
      background: "rgba(5, 8, 15, 0.6)",
      backdropFilter: "blur(8px)",
    }}>
      <button
        onClick={scrollToTop}
        className="btn-secondary"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "0.6rem 1.4rem",
          fontSize: "0.82rem",
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          fontFamily: "var(--font-mono, 'Share Tech Mono', monospace)",
          fontWeight: 700,
          cursor: "pointer",
          borderRadius: "8px",
          border: "1px solid rgba(255, 255, 255, 0.15)",
          background: "rgba(255, 255, 255, 0.03)",
          color: "var(--text-main)",
          transition: "all 0.2s ease",
        }}
        aria-label="Back to top"
      >
        <span style={{ color: "var(--accent-primary)", fontSize: "1rem" }}>↑</span> BACK TO TOP
      </button>
      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "1.25rem",
        fontSize: "0.8rem",
        fontFamily: "var(--font-mono, 'Share Tech Mono', monospace)",
        marginTop: "4px"
      }}>
        <a href="/wiki" style={{ color: "var(--accent-primary, #00E5FF)", textDecoration: "none", fontWeight: 700 }}>
          Site Wiki & API Docs
        </a>
        <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>•</span>
        <a 
          href="https://github.com/wstrika/exultia/tree/main/wiki" 
          target="_blank" 
          rel="noopener noreferrer"
          style={{ color: "#94A3B8", textDecoration: "none" }}
        >
          GitHub Wiki Repo ↗
        </a>
      </div>
      <div style={{
        fontSize: "0.75rem",
        color: "var(--text-muted)",
        fontFamily: "var(--font-mono, 'Share Tech Mono', monospace)",
        letterSpacing: "0.05em",
        opacity: 0.6,
      }}>
        © {new Date().getFullYear()} EXULTIA TECHNOLOGIES
      </div>
    </footer>
  );
}
