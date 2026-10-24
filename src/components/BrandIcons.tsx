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
 * Radical DOOM-esque cybernetic fortress helm emblem featuring
 * glowing visor brow, etched circuit traces, and wireframe perspective gateway.
 */
interface ExultiaLogoProps extends IconProps {
  palette?: "cyan" | "orange" | "green" | "magenta" | "auto";
  variant?: "circle" | "helm";
}

export function ExultiaLogo({
  size = 48,
  className = "",
  glow = false,
  palette = "auto",
  variant = "circle",
}: ExultiaLogoProps) {
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

  const p = palette !== "auto" ? palette : activePalette;
  const emblemSrc = variant === "helm"
    ? `/branding/navbar_helm_${p}.png?v=2`
    : `/branding/emblem_v2_${p}.png?v=2`;

  // Aspect ratio for trimmed cyber-helm is 528 / 604 ≈ 0.874
  const widthPx = variant === "helm" ? Math.round(size * (528 / 604)) : size;
  const heightPx = size;

  return (
    <div
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: widthPx,
        height: heightPx,
        position: "relative",
        userSelect: "none",
        flexShrink: 0,
      }}
    >
      <img
        src={emblemSrc}
        alt="Exultia Technologies Cybernetic Fortress Helm"
        width={widthPx}
        height={heightPx}
        style={{
          width: `${widthPx}px`,
          height: `${heightPx}px`,
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
  size = 48,
  variant = "helm",
  isIsolated = false,
  isolatedTag = "Vantage",
  showTagline = true,
}: {
  size?: number;
  variant?: "circle" | "helm";
  isIsolated?: boolean;
  isolatedTag?: string;
  showTagline?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
      <ExultiaLogo size={size} variant={variant} glow={false} />
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
 * Geometric containment canister with an energized, abstract red plasma core.
 */
export function ArgentIcon({ size = 32, className = "", glow = true }: IconProps) {
  const glowFilter = glow ? "drop-shadow(0 0 10px rgba(239, 68, 68, 0.55)) drop-shadow(0 0 2px rgba(255, 23, 68, 0.8))" : "none";

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
        {/* Sleek Titanium / Platinum Canister Gradient */}
        <linearGradient id="argent-canister-grad" x1="8" y1="4" x2="40" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#E2E8F0" />
          <stop offset="45%" stopColor="#94A3B8" />
          <stop offset="85%" stopColor="#475569" />
          <stop offset="100%" stopColor="#1E293B" />
        </linearGradient>

        {/* Radiant Red Plasma Gradient */}
        <linearGradient id="argent-plasma-grad" x1="16" y1="12" x2="32" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE4E6" />
          <stop offset="35%" stopColor="#FF4D6D" />
          <stop offset="70%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#9F1239" />
        </linearGradient>

        {/* Core Volumetric Plasma Aura */}
        <radialGradient id="argent-core-aura" cx="24" cy="24" r="10" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
          <stop offset="40%" stopColor="#FF1744" stopOpacity="0.6" />
          <stop offset="80%" stopColor="#BE123C" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#881337" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* --- ABSTRACT CANISTER CHASSIS (Octagonal Containment Cell) --- */}
      <path
        d="M17 5 H31 L37 11 V37 L31 43 H17 L11 37 V11 L17 5 Z"
        fill="rgba(15, 12, 24, 0.88)"
        stroke="url(#argent-canister-grad)"
        strokeWidth="2.4"
        strokeLinejoin="round"
      />

      {/* Inner Chamber Glass Boundary */}
      <path
        d="M18 10 H30 L33 13 V35 L30 38 H18 L15 35 V13 L18 10 Z"
        stroke="rgba(255, 255, 255, 0.18)"
        strokeWidth="1.2"
        strokeLinejoin="round"
      />

      {/* Lateral Stabilizer Pylons / Mounting Brackets */}
      <path d="M7 20 L11 24 L7 28" stroke="url(#argent-canister-grad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M41 20 L37 24 L41 28" stroke="url(#argent-canister-grad)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* Magnetic Containment Caps (Top & Bottom Bars) */}
      <line x1="20" y1="8" x2="28" y2="8" stroke="url(#argent-canister-grad)" strokeWidth="2" strokeLinecap="round" />
      <line x1="20" y1="40" x2="28" y2="40" stroke="url(#argent-canister-grad)" strokeWidth="2" strokeLinecap="round" />

      {/* --- ABSTRACT RED PLASMA CORE --- */}
      {/* Background Plasma Radiation Aura */}
      <circle cx="24" cy="24" r="10" fill="url(#argent-core-aura)" />

      {/* Plasma Containment Energy Ring */}
      <circle cx="24" cy="24" r="8.5" stroke="#FF4D6D" strokeWidth="1.4" strokeDasharray="3 3" opacity="0.85" />

      {/* Geometric Plasma Singularity Diamond */}
      <polygon
        points="24,14 31,24 24,34 17,24"
        fill="url(#argent-plasma-grad)"
        stroke="#FFFFFF"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Vertical Energy Conduits / Discharge Beams */}
      <line x1="24" y1="9" x2="24" y2="14" stroke="#FF8099" strokeWidth="2" strokeLinecap="round" />
      <line x1="24" y1="34" x2="24" y2="39" stroke="#FF8099" strokeWidth="2" strokeLinecap="round" />

      {/* Orbiting Magnetic Plasma Filaments */}
      <path d="M19 19 C22 21.5 22 26.5 19 29" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
      <path d="M29 19 C26 21.5 26 26.5 29 29" stroke="#FFFFFF" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />

      {/* Incandescent Core Spark */}
      <circle cx="24" cy="24" r="2.5" fill="#FFFFFF" />
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

/**
 * Eris Product Icon
 * Goddess of Chaos & Strife — The Golden Apple of Discord (Kallisti)
 * crowned with the 8-pointed star of entropy and planetary strife ring.
 */
export function ErisIcon({ size = 32, className = "", glow = true }: IconProps) {
  const glowFilter = glow
    ? "drop-shadow(0 0 10px rgba(245, 158, 11, 0.65)) drop-shadow(0 0 20px rgba(239, 68, 68, 0.35))"
    : "none";

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
        {/* Deep Cosmic Obsidian & Amber Glow */}
        <radialGradient id="eris-bg-aura" cx="24" cy="25" r="23" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#7C2D12" stopOpacity="0.5" />
          <stop offset="65%" stopColor="#450A0A" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </radialGradient>

        {/* Chaos Rays / Arrow Gradient */}
        <linearGradient id="eris-chaos-grad" x1="4" y1="4" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FEF08A" />
          <stop offset="35%" stopColor="#F59E0B" />
          <stop offset="70%" stopColor="#DC2626" />
          <stop offset="100%" stopColor="#991B1B" />
        </linearGradient>

        {/* Golden Apple Specular Body Gradient */}
        <radialGradient id="eris-apple-sphere" cx="21" cy="22" r="14" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFBEB" />
          <stop offset="25%" stopColor="#FDE047" />
          <stop offset="60%" stopColor="#F59E0B" />
          <stop offset="85%" stopColor="#D97706" />
          <stop offset="100%" stopColor="#78350F" />
        </radialGradient>

        {/* Apple Leaf Gradient */}
        <linearGradient id="eris-leaf-grad" x1="26" y1="11" x2="33" y2="17" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FACC15" />
          <stop offset="50%" stopColor="#84CC16" />
          <stop offset="100%" stopColor="#4D7C0F" />
        </linearGradient>

        {/* Dynamic Halo Ring Gradient */}
        <linearGradient id="eris-ring-grad" x1="6" y1="20" x2="42" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FDE047" stopOpacity="0.85" />
          <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#EF4444" stopOpacity="0.85" />
        </linearGradient>
      </defs>

      {/* Ambient Chaos Aura */}
      <circle cx="24" cy="25" r="21" fill="url(#eris-bg-aura)" />

      {/* ── 8-POINTED CHAOS STAR (The Emblem of Strife & Entropy) ── */}
      {/* Outer Orbit Ring connecting ray bases */}
      <circle cx="24" cy="25" r="17.5" stroke="url(#eris-ring-grad)" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

      {/* Cardinal Arrows: North, South, East, West */}
      {/* North Arrow */}
      <path d="M 24 2.5 L 26.8 8 L 24.9 7.4 V 13.5 H 23.1 V 7.4 L 21.2 8 Z" fill="url(#eris-chaos-grad)" stroke="#FEF08A" strokeWidth="0.5" />
      {/* South Arrow */}
      <path d="M 24 45.5 L 21.2 40 L 23.1 40.6 V 34.5 H 24.9 V 40.6 L 26.8 40 Z" fill="url(#eris-chaos-grad)" stroke="#FEF08A" strokeWidth="0.5" />
      {/* East Arrow */}
      <path d="M 45.5 25 L 40 22.2 L 40.6 24.1 H 34.5 V 25.9 H 40.6 L 40 27.8 Z" fill="url(#eris-chaos-grad)" stroke="#FEF08A" strokeWidth="0.5" />
      {/* West Arrow */}
      <path d="M 2.5 25 L 8 27.8 L 7.4 25.9 H 13.5 V 24.1 H 7.4 L 8 22.2 Z" fill="url(#eris-chaos-grad)" stroke="#FEF08A" strokeWidth="0.5" />

      {/* Diagonal Arrows: NE, SE, SW, NW */}
      {/* North-East Arrow (45 deg) */}
      <g transform="rotate(45 24 25)">
        <path d="M 24 3.5 L 26.5 8.5 L 24.8 8 V 13.5 H 23.2 V 8 L 21.5 8.5 Z" fill="url(#eris-chaos-grad)" stroke="#FEF08A" strokeWidth="0.5" />
      </g>
      {/* South-East Arrow (135 deg) */}
      <g transform="rotate(135 24 25)">
        <path d="M 24 3.5 L 26.5 8.5 L 24.8 8 V 13.5 H 23.2 V 8 L 21.5 8.5 Z" fill="url(#eris-chaos-grad)" stroke="#FEF08A" strokeWidth="0.5" />
      </g>
      {/* South-West Arrow (225 deg) */}
      <g transform="rotate(225 24 25)">
        <path d="M 24 3.5 L 26.5 8.5 L 24.8 8 V 13.5 H 23.2 V 8 L 21.5 8.5 Z" fill="url(#eris-chaos-grad)" stroke="#FEF08A" strokeWidth="0.5" />
      </g>
      {/* North-West Arrow (315 deg) */}
      <g transform="rotate(315 24 25)">
        <path d="M 24 3.5 L 26.5 8.5 L 24.8 8 V 13.5 H 23.2 V 8 L 21.5 8.5 Z" fill="url(#eris-chaos-grad)" stroke="#FEF08A" strokeWidth="0.5" />
      </g>

      {/* Dynamic Planetary Ring of Discord */}
      <ellipse cx="24" cy="25" rx="18.5" ry="6" transform="rotate(-18 24 25)" stroke="url(#eris-ring-grad)" strokeWidth="1.2" fill="none" opacity="0.75" />

      {/* ── THE GOLDEN APPLE OF DISCORD (Kallisti) ── */}
      {/* Apple Silhouette Base */}
      <path
        d="M 24 18.5 C 21.5 15, 14 15, 12.8 21.5 C 11.5 28.5, 16.5 36.5, 21.8 37 C 23.2 37.1, 23.8 35.8, 24 35.8 C 24.2 35.8, 24.8 37.1, 26.2 37 C 31.5 36.5, 36.5 28.5, 35.2 21.5 C 34 15, 26.5 15, 24 18.5 Z"
        fill="url(#eris-apple-sphere)"
        stroke="#FEF08A"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* Specular 3D Gloss Curve on Upper Left Cleft */}
      <path
        d="M 15 21.5 C 15.5 18, 19.5 17, 22.5 18 C 20 18.5, 16.5 20, 16 23 Z"
        fill="#FFFFFF"
        opacity="0.65"
      />

      {/* Gilded Apple Stem */}
      <path
        d="M 24 18.5 C 23.8 13.5, 26.5 10.5, 28.5 9"
        stroke="#78350F"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M 24 18.5 C 23.8 13.5, 26.5 10.5, 28.5 9"
        stroke="#FBBF24"
        strokeWidth="1.2"
        strokeLinecap="round"
      />

      {/* Golden Laurel / Strife Leaf */}
      <path
        d="M 26 13 C 29.5 10.8, 33.5 11.5, 35 9.5 C 33.8 14, 29 15.5, 26 13 Z"
        fill="url(#eris-leaf-grad)"
        stroke="#FEF08A"
        strokeWidth="0.8"
        strokeLinejoin="round"
      />

      {/* ── CHISELED "Κ" (KALLISTI - "TO THE FAIREST") INSCRIPTION ── */}
      {/* 3D Shadow/Bevel */}
      <path
        d="M 21.5 22 V 30.5 M 26.5 22.5 L 21.8 26.5 L 27 30.5"
        stroke="#451A03"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.9"
      />
      {/* Bright Golden Inscription Face */}
      <path
        d="M 21 21.5 V 30 M 26 22 L 21.3 26 L 26.5 30"
        stroke="#FEF08A"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Divine Chaos Sparks of Discord */}
      <circle cx="11" cy="11" r="1.2" fill="#FEF08A" opacity="0.9" />
      <circle cx="37" cy="10" r="1.4" fill="#FDE047" opacity="0.9" />
      <circle cx="41" cy="34" r="1.1" fill="#F59E0B" opacity="0.8" />
      <circle cx="8" cy="36" r="1.1" fill="#EF4444" opacity="0.8" />
    </svg>
  );
}

// Backward-compatibility aliases
export const PerditionIcon = ErisIcon;
export const CrucibleIcon = ErisIcon;

/**
 * Valkyrie Product Icon
 * On-Demand Exploit Validation & Pentest Engine
 * Cybernetic winged spearhead flanked by swept Nordic shields & energy targeting core.
 */
export function ValkyrieIcon({ size = 32, className = "", glow = true }: IconProps) {
  const glowFilter = glow
    ? "drop-shadow(0 0 10px rgba(6, 182, 212, 0.7)) drop-shadow(0 0 20px rgba(139, 92, 246, 0.4))"
    : "none";

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
        {/* Core Electric Aura */}
        <radialGradient id="valk-aura" cx="24" cy="22" r="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#0891B2" stopOpacity="0.45" />
          <stop offset="65%" stopColor="#4C1D95" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#030712" stopOpacity="0" />
        </radialGradient>

        {/* Spearhead Silver-Cyan Gradient */}
        <linearGradient id="valk-spear" x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="25%" stopColor="#A5F3FC" />
          <stop offset="65%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        {/* Left Wing Gradient */}
        <linearGradient id="valk-wing-l" x1="6" y1="8" x2="22" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>

        {/* Right Wing Gradient */}
        <linearGradient id="valk-wing-r" x1="42" y1="8" x2="26" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#C084FC" />
          <stop offset="50%" stopColor="#7C3AED" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>

        {/* Target Reticle Core */}
        <radialGradient id="valk-core" cx="24" cy="20" r="7" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#67E8F9" />
          <stop offset="85%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0369A1" />
        </radialGradient>
      </defs>

      {/* Aura background */}
      <circle cx="24" cy="24" r="22" fill="url(#valk-aura)" />

      {/* Nordic Chevron Shield Base / Outer Wing Feathers */}
      {/* Outer Left Wing Primary */}
      <path
        d="M 24 16 L 8 10 C 6 18, 9 28, 17 35 L 24 30 Z"
        fill="url(#valk-wing-l)"
        stroke="#38BDF8"
        strokeWidth="0.8"
        strokeLinejoin="round"
        opacity="0.85"
      />
      {/* Outer Left Wing Blade 2 */}
      <path
        d="M 24 20 L 12 18 C 11 25, 14 31, 20 37 L 24 33 Z"
        fill="rgba(6, 182, 212, 0.4)"
        stroke="#67E8F9"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />

      {/* Outer Right Wing Primary */}
      <path
        d="M 24 16 L 40 10 C 42 18, 39 28, 31 35 L 24 30 Z"
        fill="url(#valk-wing-r)"
        stroke="#C084FC"
        strokeWidth="0.8"
        strokeLinejoin="round"
        opacity="0.85"
      />
      {/* Outer Right Wing Blade 2 */}
      <path
        d="M 24 20 L 36 18 C 37 25, 34 31, 28 37 L 24 33 Z"
        fill="rgba(147, 51, 234, 0.4)"
        stroke="#E9D5FF"
        strokeWidth="0.6"
        strokeLinejoin="round"
      />

      {/* Central Cybernetic Valkyrie Spearhead */}
      <path
        d="M 24 3 L 28.5 17 L 25.5 17 L 25.5 45 L 22.5 45 L 22.5 17 L 19.5 17 Z"
        fill="url(#valk-spear)"
        stroke="#FFFFFF"
        strokeWidth="1"
        strokeLinejoin="round"
      />

      {/* Spearhead Fluting / Diamond Facet */}
      <polygon
        points="24,5 27,16 24,19 21,16"
        fill="#FFFFFF"
        opacity="0.9"
      />

      {/* Aegis Diamond Collar */}
      <polygon
        points="24,14 31,21 24,28 17,21"
        fill="rgba(8, 20, 35, 0.9)"
        stroke="#67E8F9"
        strokeWidth="1.2"
      />

      {/* Core Targeting Optics / Pulse Center */}
      <circle cx="24" cy="21" r="4.5" fill="url(#valk-core)" stroke="#FFFFFF" strokeWidth="0.8" />
      <circle cx="24" cy="21" r="1.5" fill="#FFFFFF" />

      {/* Targeting Reticle Crossbars */}
      <line x1="24" y1="11" x2="24" y2="15" stroke="#67E8F9" strokeWidth="1" strokeLinecap="round" />
      <line x1="24" y1="27" x2="24" y2="31" stroke="#67E8F9" strokeWidth="1" strokeLinecap="round" />
      <line x1="14" y1="21" x2="18" y2="21" stroke="#67E8F9" strokeWidth="1" strokeLinecap="round" />
      <line x1="30" y1="21" x2="34" y2="21" stroke="#67E8F9" strokeWidth="1" strokeLinecap="round" />

      {/* High-Velocity Precision Accents */}
      <circle cx="7" cy="11" r="1.2" fill="#38BDF8" opacity="0.9" />
      <circle cx="41" cy="11" r="1.2" fill="#C084FC" opacity="0.9" />
      <circle cx="24" cy="46" r="1" fill="#67E8F9" />
    </svg>
  );
}



