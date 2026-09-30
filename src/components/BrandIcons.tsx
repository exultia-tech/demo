import React from "react";

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
export function ExultiaLogo({ size = 36, className = "", glow = true }: IconProps) {
  const glowFilter = glow ? "drop-shadow(0 0 10px rgba(59, 130, 246, 0.45))" : "none";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={{ filter: glowFilter, transition: "transform 0.2s ease, filter 0.2s ease" }}
    >
      <defs>
        {/* Gradients */}
        <linearGradient id="exultia-grad-primary" x1="6" y1="6" x2="42" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3B82F6" />
          <stop offset="45%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        <linearGradient id="exultia-grad-facet-top" x1="24" y1="4" x2="24" y2="24" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#60A5FA" />
          <stop offset="100%" stopColor="#3B82F6" />
        </linearGradient>

        <linearGradient id="exultia-grad-facet-left" x1="4" y1="14" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#6366F1" />
        </linearGradient>

        <linearGradient id="exultia-grad-facet-right" x1="24" y1="24" x2="44" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#0284C7" />
        </linearGradient>

        <linearGradient id="exultia-grad-core" x1="16" y1="16" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#93C5FD" />
          <stop offset="100%" stopColor="#A78BFA" />
        </linearGradient>
      </defs>

      {/* Outer Glow Halo / Base Shape */}
      <polygon
        points="24,3 44,14 44,34 24,45 4,34 4,14"
        fill="rgba(10, 15, 30, 0.6)"
        stroke="url(#exultia-grad-primary)"
        strokeWidth="2"
        strokeLinejoin="round"
      />

      {/* Top Facet (Azure Peak) */}
      <polygon
        points="24,5 42,15 24,24 6,15"
        fill="url(#exultia-grad-facet-top)"
        fillOpacity="0.85"
      />

      {/* Bottom-Left Facet (Cyber Violet) */}
      <polygon
        points="6,15 24,24 24,43 6,33"
        fill="url(#exultia-grad-facet-left)"
        fillOpacity="0.9"
      />

      {/* Bottom-Right Facet (Deep Cyan) */}
      <polygon
        points="24,24 42,15 42,33 24,43"
        fill="url(#exultia-grad-facet-right)"
        fillOpacity="0.95"
      />

      {/* Central Quantum Aperture / Core Node */}
      <polygon
        points="24,14 32,19 32,29 24,34 16,29 16,19"
        fill="rgba(10, 15, 30, 0.9)"
        stroke="url(#exultia-grad-core)"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />

      {/* Core Node Inner Spark */}
      <circle cx="24" cy="24" r="3.5" fill="url(#exultia-grad-core)" />
      <circle cx="24" cy="24" r="1.5" fill="#FFFFFF" />

      {/* Isometric Interlocking Lines */}
      <line x1="24" y1="5" x2="24" y2="14" stroke="rgba(255,255,255,0.7)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6" y1="33" x2="16" y2="29" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="42" y1="33" x2="32" y2="29" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
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
