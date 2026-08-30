"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  return (
    <header className="public-nav">
      <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div className="brand-icon" style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #3B82F6, #8B5CF6)', display: 'grid', placeItems: 'center', color: 'white' }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em' }}>
          Secure<span style={{ color: '#60A5FA' }}>IDE</span>
        </span>
      </Link>

      <nav className="nav-links">
        <Link href="/" className={`nav-link ${pathname === "/" ? "active" : ""}`}>
          Overview
        </Link>
        <Link href="/features" className={`nav-link ${pathname === "/features" ? "active" : ""}`}>
          Features
        </Link>
        <Link href="/security" className={`nav-link ${pathname === "/security" ? "active" : ""}`}>
          Security
        </Link>
        <Link href="/threat-feed" className={`nav-link ${pathname === "/threat-feed" ? "active" : ""}`}>
          UVI Threat Feed
        </Link>
        <Link href="/pricing" className={`nav-link ${pathname === "/pricing" ? "active" : ""}`}>
          Pricing
        </Link>
        <Link href="/docs" className={`nav-link ${pathname === "/docs" ? "active" : ""}`}>
          Docs
        </Link>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <Link 
          href="/console" 
          className="btn-primary" 
          style={{ padding: '0.65rem 1.25rem', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
          Launch Builder Console →
        </Link>
      </div>
    </header>
  );
}
