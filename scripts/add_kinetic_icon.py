import os

file_path = os.path.join('src', 'components', 'BrandIcons.tsx')
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

snippet = """

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
"""

if 'export function KineticIcon' not in content:
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content.rstrip() + snippet + '\n')
    print("SUCCESS: KineticIcon added to BrandIcons.tsx")
else:
    print("INFO: KineticIcon already exists")
