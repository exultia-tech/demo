"use client";

import React, { useState, useEffect } from "react";

interface IconProps {
  size?: number;
  className?: string;
  glow?: boolean;
}

/**
 * Exultia Flagship Company Logo
 * An isometric multi-faceted crystalline shield & prism symbolizing
 * developer security, threat intelligence, and public transparency.
 */
/**
 * Exultia Flagship Company Logo
 * Radical DOOM-esque cybernetic horned demon helm emblem featuring
 * glowing visor eyes, mechanical brow conduits, and wireframe perspective gateway.
 */
interface ExultiaLogoProps extends IconProps {
  palette?: "cyan" | "orange" | "green" | "magenta" | "auto";
}

export function ExultiaLogo({ size = 48, className = "", glow = false, palette = "auto" }: ExultiaLogoProps) {
  const [activePalette, setActivePalette] = React.useState<string>("cyan");

  React.useEffect(() => {
    if (palette !== "auto") {
      setActivePalette(palette);
      return;
    }
    const update = () => {
      if (typeof document !== "undefined") {
        const p = document.documentElement.getAttribute("data-doom-palette") || "cyan";
        setActivePalette(p);
      }
    };
    update();
    if (typeof window !== "undefined") {
      window.addEventListener("exultia-doom-palette-change", update);
      return () => window.removeEventListener("exultia-doom-palette-change", update);
    }
  }, [palette]);

  const emblemSrc = `/branding/emblem_${palette !== "auto" ? palette : activePalette}.png`;

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        position: "relative",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      <img
        src={emblemSrc}
        alt="Exultia Technologies Cybernetic Demon Helm"
        width={size}
        height={size}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          objectFit: "contain",
          filter: glow
            ? "drop-shadow(0 0 8px var(--accent-glow)) drop-shadow(0 0 2px var(--accent-primary))"
            : "none",
          transition: "filter 0.25s ease, transform 0.25s ease",
        }}
      />
    </div>
  );
}

/**
 * Exultia Full Brand Lockup
 * Emblem + Chiseled Uppercase 'EXULTIA' + High-tracking 'TECHNOLOGIES'
 */
export function ExultiaBrandLockup({
  size = 62,
  isIsolated = false,
  isolatedTag = "Vantage",
  showTagline = true,
}: {
  size?: number;
  isIsolated?: boolean;
  isolatedTag?: string;
  showTagline?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <ExultiaLogo size={size} glow={false} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.1 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
          <span
            style={{
              fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
              fontSize: "1.55rem",
              fontWeight: 900,
              color: "#FFFFFF",
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              textShadow: "0 0 16px var(--accent-glow), 0 0 32px var(--accent-glow)",
            }}
          >
            EXULTIA
          </span>
          {isIsolated && (
            <span
              style={{
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.68rem",
                background: "rgba(0, 229, 255, 0.18)",
                color: "var(--accent-primary)",
                border: "1px solid var(--accent-primary)",
                padding: "2px 7px",
                borderRadius: "2px",
                fontWeight: 800,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
              }}
            >
              {isolatedTag}
            </span>
          )}
        </div>
        {showTagline && (
          <span
            style={{
              fontFamily: "var(--font-mono, 'Share Tech Mono', monospace)",
              fontSize: "0.68rem",
              fontWeight: 800,
              color: "var(--accent-primary)",
              letterSpacing: "0.38em",
              textTransform: "uppercase",
              marginTop: "1px",
            }}
          >
            TECHNOLOGIES
          </span>
        )}
      </div>
    </div>
  );
}

/**
 * PureIDE Product Icon
 * Represents a hermetic zero-trust binary containment fortress with an
 * enclosed developer terminal chevron.
 */
export function PureIdeIcon({ size = 32, className = "", glow = true }: IconProps) {
  const glowFilter = glow ? "drop-shadow(0 0 10px rgba(59, 130, 246, 0.45))" : "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: glowFilter }}
    >
      <defs>
        <linearGradient id="pureide-shield-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="50%" stopColor="#3B82F6" />
          <stop offset="100%" stopColor="#1D4ED8" />
        </linearGradient>

        <linearGradient id="pureide-inner-grad" x1="12" y1="12" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.3)" />
          <stop offset="100%" stopColor="rgba(30, 58, 138, 0.7)" />
        </linearGradient>

        <linearGradient id="pureide-chevron-grad" x1="16" y1="18" x2="32" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>

      {/* Outer Hexagonal Barrier Shield */}
      <path
        d="M24 4L42 12V24C42 34 34 42 24 45C14 42 6 34 6 24V12L24 4Z"
        fill="url(#pureide-inner-grad)"
        stroke="url(#pureide-shield-grad)"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />

      {/* Inner Boundary Frame */}
      <path
        d="M24 10L36 16V24C36 31 30 37 24 39.5C18 37 12 31 12 24V16L24 10Z"
        fill="rgba(10, 20, 40, 0.85)"
        stroke="rgba(96, 165, 250, 0.5)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Developer Terminal Chevron `>` */}
      <path
        d="M19 19L26 24.5L19 30"
        stroke="url(#pureide-chevron-grad)"
        strokeWidth="2.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Terminal Cursor Line `_` */}
      <line
        x1="28"
        y1="30"
        x2="33"
        y2="30"
        stroke="url(#pureide-chevron-grad)"
        strokeWidth="2.75"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Vantage Product Icon
 * Represents the all-seeing cybernetic eye of the Universal Threat Feed.
 */
export function VantageIcon({ size = 32, className = "", glow = true }: IconProps) {
  const glowFilter = glow ? "drop-shadow(0 0 10px rgba(139, 92, 246, 0.45))" : "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: glowFilter }}
    >
      <defs>
        <linearGradient id="vantage-radar-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6D28D9" />
        </linearGradient>

        <linearGradient id="vantage-core-grad" x1="18" y1="18" x2="30" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F472B6" />
          <stop offset="50%" stopColor="#C084FC" />
          <stop offset="100%" stopColor="#FFFFFF" />
        </linearGradient>
      </defs>

      {/* Orbiting Data Rings */}
      <path d="M24 4 A 20 20 0 0 1 44 24" stroke="rgba(192, 132, 252, 0.3)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 6" />
      <path d="M24 44 A 20 20 0 0 1 4 24" stroke="rgba(192, 132, 252, 0.3)" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 6" />

      {/* Geometric Cyber-Eye Sclera */}
      <path d="M4 24 C 14 12, 34 12, 44 24 C 34 36, 14 36, 4 24 Z" stroke="url(#vantage-radar-grad)" strokeWidth="2.5" fill="rgba(20, 10, 35, 0.8)" strokeLinejoin="round" />

      {/* Inner Lens Ring */}
      <circle cx="24" cy="24" r="9" stroke="url(#vantage-radar-grad)" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Threat Focus Diamond (Pupil) */}
      <path d="M24 16 L31 24 L24 32 L17 24 Z" fill="url(#vantage-core-grad)" />

      {/* Central Singularity Spark */}
      <circle cx="24" cy="24" r="2" fill="#FFFFFF" />

      {/* Targeting Accents */}
      <line x1="24" y1="12" x2="24" y2="16" stroke="#C084FC" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="32" x2="24" y2="36" stroke="#6D28D9" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Inquest Product Icon
 * Represents the sovereign juridical seal of transparency, forensic discovery,
 * and statutory public records investigation.
 */
export function InquestIcon({ size = 32, className = "", glow = true }: IconProps) {
  const glowFilter = glow ? "drop-shadow(0 0 10px rgba(6, 182, 212, 0.45))" : "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: glowFilter }}
    >
      <defs>
        <linearGradient id="inquest-seal-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0E7490" />
        </linearGradient>

        <linearGradient id="inquest-paper-grad" x1="10" y1="8" x2="38" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="rgba(6, 182, 212, 0.25)" />
          <stop offset="100%" stopColor="rgba(8, 20, 35, 0.85)" />
        </linearGradient>

        <linearGradient id="inquest-lens-grad" x1="22" y1="20" x2="38" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A5F3FC" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>
      </defs>

      {/* Outer Sovereign Juridical Seal Outline */}
      <path
        d="M24 4C12.95 4 4 12.95 4 24C4 35.05 12.95 44 24 44C35.05 44 44 35.05 44 24C44 12.95 35.05 4 24 4Z"
        fill="url(#inquest-paper-grad)"
        stroke="url(#inquest-seal-grad)"
        strokeWidth="2.2"
      />

      {/* Statutory Document Docket Scroll */}
      <path
        d="M15 14C15 12.9 15.9 12 17 12H27L33 18V32C33 33.1 32.1 34 31 34H17C15.9 34 15 33.1 15 32V14Z"
        fill="rgba(5, 15, 28, 0.9)"
        stroke="rgba(34, 211, 238, 0.6)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      {/* Folded Corner */}
      <path
        d="M27 12V18H33"
        stroke="rgba(34, 211, 238, 0.8)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />

      {/* Text Exemption Redaction Lines */}
      <line x1="19" y1="20" x2="25" y2="20" stroke="rgba(148, 163, 184, 0.7)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="24" x2="28" y2="24" stroke="rgba(148, 163, 184, 0.7)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="19" y1="28" x2="23" y2="28" stroke="rgba(148, 163, 184, 0.7)" strokeWidth="1.5" strokeLinecap="round" />

      {/* Forensic Transparency Magnifier Lens */}
      <circle
        cx="29"
        cy="28"
        r="6.5"
        fill="rgba(6, 182, 212, 0.2)"
        stroke="url(#inquest-lens-grad)"
        strokeWidth="2"
      />
      {/* Magnifier Handle */}
      <line
        x1="34"
        y1="33"
        x2="39"
        y2="38"
        stroke="url(#inquest-lens-grad)"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      {/* Focus Glimmer */}
      <circle cx="27" cy="26" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * Praxis Product Icon
 * Represents targeted precision, remediation, and surgical vulnerability patching.
 */
export function PraxisIcon({ size = 32, className = "", glow = true }: IconProps) {
  const glowFilter = glow ? "drop-shadow(0 0 10px rgba(245, 158, 11, 0.45))" : "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: glowFilter }}
    >
      <defs>
        <linearGradient id="praxis-base-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#D97706" />
        </linearGradient>

        <linearGradient id="praxis-accent-grad" x1="24" y1="10" x2="40" y2="26" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE68A" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Outer Targeting Brackets */}
      <path d="M14 20V14H20 M28 14H34V20 M34 28V34H28 M20 34H14V28" stroke="url(#praxis-base-grad)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

      {/* Inner Precision Diamond */}
      <path d="M24 14 L34 24 L24 34 L14 24 Z" fill="rgba(245, 158, 11, 0.15)" stroke="url(#praxis-base-grad)" strokeWidth="2" />

      {/* Crosshair Laser Lines */}
      <line x1="6" y1="24" x2="16" y2="24" stroke="url(#praxis-accent-grad)" strokeWidth="2" strokeLinecap="round" />
      <line x1="32" y1="24" x2="42" y2="24" stroke="url(#praxis-accent-grad)" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="6" x2="24" y2="16" stroke="url(#praxis-accent-grad)" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="32" x2="24" y2="42" stroke="url(#praxis-accent-grad)" strokeWidth="2" strokeLinecap="round" />

      {/* Glowing Core Node */}
      <circle cx="24" cy="24" r="4" fill="url(#praxis-accent-grad)" />
      <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

/**
 * PureOS Registry Icon
 * Represents secure, hardened OS containers (box/cube with shield elements).
 */
export function PureOsIcon({ size = 32, className = "", glow = true }: IconProps) {
  const glowFilter = glow ? "drop-shadow(0 0 10px rgba(16, 185, 129, 0.45))" : "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: glowFilter }}
    >
      <defs>
        <linearGradient id="pureos-base-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#34D399" />
          <stop offset="50%" stopColor="#10B981" />
          <stop offset="100%" stopColor="#059669" />
        </linearGradient>

        <linearGradient id="pureos-accent-grad" x1="24" y1="10" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A7F3D0" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>
      </defs>

      {/* Isometric Cube (Container) */}
      <polygon
        points="24,6 42,16 42,36 24,46 6,36 6,16"
        fill="rgba(20, 10, 5, 0.8)"
        stroke="url(#pureos-base-grad)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      
      {/* Container Inner Lines */}
      <polyline points="6,16 24,26 42,16" stroke="url(#pureos-base-grad)" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="24" y1="26" x2="24" y2="46" stroke="url(#pureos-base-grad)" strokeWidth="2.5" strokeLinejoin="round" />

      {/* Center Shield overlay */}
      <path
        d="M24 16 L32 20 V28 C32 32 28 36 24 38 C20 36 16 32 16 28 V20 L24 16 Z"
        fill="url(#pureos-accent-grad)"
        opacity="0.9"
      />
      <path
        d="M24 20 L28 22.5 V27 C28 29.5 26 32 24 33 C22 32 20 29.5 20 27 V22.5 L24 20 Z"
        fill="#111"
        opacity="0.8"
      />
      <circle cx="24" cy="26" r="2" fill="#FBBF24" />
    </svg>
  );
}

/**
 * Axiom Product Icon
 * Represents the foundational open-source framework for security education and certification.
 */
export function AxiomIcon({ size = 32, className = "", glow = true }: IconProps) {
  const glowFilter = glow ? "drop-shadow(0 0 10px rgba(244, 63, 94, 0.45))" : "none";

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ filter: glowFilter }}>
      <defs>
        <linearGradient id="axiom-grad-main" x1="12" y1="4" x2="36" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDA4AF" />
          <stop offset="50%" stopColor="#F43F5E" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
        <linearGradient id="axiom-grad-accent" x1="24" y1="12" x2="24" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="100%" stopColor="#FDA4AF" />
        </linearGradient>
      </defs>

      {/* The Open Book / Framework Foundation */}
      <path d="M24 14 L10 10 V36 L24 40 L38 36 V10 L24 14 Z" fill="rgba(25, 5, 10, 0.8)" stroke="url(#axiom-grad-main)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M24 14 V40" stroke="url(#axiom-grad-main)" strokeWidth="2.5" strokeLinejoin="round" />
      
      {/* Pages / Layers of Knowledge */}
      <path d="M24 20 L14 16.5" stroke="url(#axiom-grad-main)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M24 26 L14 22.5" stroke="url(#axiom-grad-main)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M24 32 L14 28.5" stroke="url(#axiom-grad-main)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M24 20 L34 16.5" stroke="url(#axiom-grad-main)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M24 26 L34 22.5" stroke="url(#axiom-grad-main)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
      <path d="M24 32 L34 28.5" stroke="url(#axiom-grad-main)" strokeWidth="2" strokeLinecap="round" opacity="0.6" />

      {/* Central Spark of Wisdom */}
      <polygon points="24,6 27,15 24,24 21,15" fill="url(#axiom-grad-accent)" />
    </svg>
  );
}

/**
 * Argent Product Icon
 * Futuristic containment cell / canister with swirling energetic red plasma core.
 */
export function ArgentIcon({ size = 32, className = "", glow = true }: IconProps) {
  const glowFilter = glow ? "drop-shadow(0 0 10px rgba(239, 68, 68, 0.7)) drop-shadow(0 0 3px rgba(255, 23, 68, 0.85))" : "none";

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ filter: glowFilter }}>
      <defs>
        {/* Metallic Titanium / Dark Steel Container Gradient */}
        <linearGradient id="argent-container-metal" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#CBD5E1" />
          <stop offset="30%" stopColor="#64748B" />
          <stop offset="70%" stopColor="#334155" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>

        {/* Highlight Edges for Container Clamps */}
        <linearGradient id="argent-container-rim" x1="12" y1="6" x2="36" y2="6" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#64748B" />
          <stop offset="50%" stopColor="#F1F5F9" />
          <stop offset="100%" stopColor="#475569" />
        </linearGradient>

        {/* Deep Plasma Volumetric Core */}
        <radialGradient id="argent-plasma-glow" cx="24" cy="24" r="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
          <stop offset="25%" stopColor="#FF4D6D" stopOpacity="0.9" />
          <stop offset="60%" stopColor="#E11D48" stopOpacity="0.75" />
          <stop offset="90%" stopColor="#9F1239" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#4C0519" stopOpacity="0" />
        </radialGradient>

        {/* Specular Glass Sheen */}
        <linearGradient id="argent-glass-sheen" x1="14" y1="14" x2="22" y2="34" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.45" />
          <stop offset="40%" stopColor="#FFFFFF" stopOpacity="0.1" />
          <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0.02" />
        </linearGradient>

        {/* Energetic Plasma Arc Gradient */}
        <linearGradient id="argent-arc" x1="24" y1="13" x2="24" y2="35" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE4E6" />
          <stop offset="50%" stopColor="#FF1744" />
          <stop offset="100%" stopColor="#BE123C" />
        </linearGradient>
      </defs>

      {/* --- REAR HOUSING CHAMBER & SHADOW --- */}
      <rect x="14" y="13" width="20" height="22" rx="2" fill="#0A060C" />

      {/* --- RED PLASMA GLOW VOLUME --- */}
      <rect x="14" y="13" width="20" height="22" fill="url(#argent-plasma-glow)" />

      {/* --- SWIRLING RED PLASMA TENDRILS / ARCS --- */}
      {/* Primary Ionized Core Arc */}
      <path d="M24 13 Q21 19 25 24 T23 35" stroke="url(#argent-arc)" strokeWidth="2.5" strokeLinecap="round" opacity="0.95" />
      <path d="M24 13 Q21 19 25 24 T23 35" stroke="#FFFFFF" strokeWidth="1" strokeLinecap="round" opacity="0.9" />

      {/* Secondary Plasma Loop */}
      <path d="M25 14 Q29 20 23 25 Q19 29 24 34" stroke="#FF0055" strokeWidth="1.8" strokeLinecap="round" opacity="0.8" />

      {/* Transverse Energy Discharge */}
      <path d="M17 21 Q24 25 31 22" stroke="#FF4D6D" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
      <path d="M18 28 Q24 24 30 27" stroke="#FF1744" strokeWidth="1.4" strokeLinecap="round" opacity="0.7" />

      {/* Ionized Plasma Sparks / Embers */}
      <circle cx="21" cy="18" r="1.2" fill="#FFFFFF" />
      <circle cx="27" cy="29" r="1.1" fill="#FFFFFF" />
      <circle cx="27" cy="19" r="0.8" fill="#FF8099" />
      <circle cx="20" cy="27" r="0.8" fill="#FF8099" />
      <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" />

      {/* Magnetic Containment Field Rings (dashed laser guides) */}
      <line x1="14" y1="20" x2="34" y2="20" stroke="#FF1744" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
      <line x1="14" y1="28" x2="34" y2="28" stroke="#FF1744" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />

      {/* --- GLASS CYLINDER WALLS & SPECULAR REFLECTION --- */}
      <rect x="14" y="13" width="20" height="22" fill="url(#argent-glass-sheen)" />
      <rect x="14" y="13" width="20" height="22" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1" rx="1" fill="none" />
      <line x1="16.5" y1="14" x2="16.5" y2="34" stroke="rgba(255, 255, 255, 0.45)" strokeWidth="1" strokeLinecap="round" />

      {/* --- LATERAL STABILIZER STRUTS (Left & Right Armored Rails) --- */}
      {/* Left Strut */}
      <path d="M10 13 H13 V35 H10 Z" fill="url(#argent-container-metal)" stroke="#475569" strokeWidth="0.8" />
      <rect x="9" y="22" width="5" height="4" rx="0.5" fill="#1E293B" stroke="#64748B" strokeWidth="0.8" />

      {/* Right Strut */}
      <path d="M35 13 H38 V35 H35 Z" fill="url(#argent-container-metal)" stroke="#475569" strokeWidth="0.8" />
      <rect x="34" y="22" width="5" height="4" rx="0.5" fill="#1E293B" stroke="#64748B" strokeWidth="0.8" />

      {/* --- TOP MAGNETIC CONTAINMENT COLLAR & CAP --- */}
      {/* Top Cap Pedestal */}
      <polygon points="18,4 30,4 32,8 16,8" fill="url(#argent-container-metal)" stroke="url(#argent-container-rim)" strokeWidth="1" strokeLinejoin="round" />
      <line x1="20" y1="6" x2="28" y2="6" stroke="#94A3B8" strokeWidth="1" />

      {/* Top Heavy Collar */}
      <path d="M12 8 H36 L38 13 H10 L12 8 Z" fill="url(#argent-container-metal)" stroke="url(#argent-container-rim)" strokeWidth="1" strokeLinejoin="round" />
      <rect x="15" y="10" width="18" height="2" fill="#0F172A" />
      {/* Top Injector Emitter */}
      <polygon points="22,13 26,13 25,15 23,15" fill="#FF1744" />
      {/* Status Warning LED */}
      <circle cx="34" cy="10.5" r="1" fill="#FF1744" />

      {/* --- BOTTOM MAGNETIC CONTAINMENT BASE & FEET --- */}
      {/* Bottom Heavy Collar */}
      <path d="M10 35 H38 L36 40 H12 L10 35 Z" fill="url(#argent-container-metal)" stroke="url(#argent-container-rim)" strokeWidth="1" strokeLinejoin="round" />
      <rect x="15" y="36" width="18" height="2" fill="#0F172A" />
      {/* Bottom Collector Emitter */}
      <polygon points="23,33 25,33 26,35 22,35" fill="#FF1744" />
      {/* Status Warning LED */}
      <circle cx="14" cy="37.5" r="1" fill="#FF1744" />

      {/* Bottom Stabilizer Foot Mount */}
      <polygon points="16,40 32,40 30,44 18,44" fill="url(#argent-container-metal)" stroke="url(#argent-container-rim)" strokeWidth="1" strokeLinejoin="round" />
      <line x1="20" y1="42" x2="28" y2="42" stroke="#64748B" strokeWidth="1" />
    </svg>
  );
}

/**
 * Kinetic / PatchFeed Product Icon
 * High-velocity patch stream symbol representing instantaneous micro-mitigation and continuous remediation.
 */
export function KineticIcon({ size = 32, className = "", glow = true }: IconProps) {
  const glowFilter = glow ? "drop-shadow(0 0 10px rgba(6, 182, 212, 0.45))" : "none";

  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className} style={{ filter: glowFilter }}>
      <defs>
        <linearGradient id="kinetic-grad-main" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#22D3EE" />
          <stop offset="50%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>
        <linearGradient id="kinetic-grad-accent" x1="16" y1="10" x2="36" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F59E0B" />
        </linearGradient>
      </defs>

      {/* Hexagonal Shield Perimeter */}
      <polygon points="24,4 42,14 42,34 24,44 6,34 6,14" fill="rgba(8, 20, 35, 0.85)" stroke="url(#kinetic-grad-main)" strokeWidth="2.5" strokeLinejoin="round" />

      {/* High-Velocity Bolt / Dynamic Patch Streams */}
      <path d="M26 9 L15 25 H24 L21 39 L33 21 H24 L26 9 Z" fill="url(#kinetic-grad-accent)" stroke="#FFFFFF" strokeWidth="1" strokeLinejoin="round" />

      {/* Orbital Ring / Telemetry Pulse */}
      <circle cx="24" cy="24" r="16" stroke="url(#kinetic-grad-main)" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
    </svg>
  );
}



