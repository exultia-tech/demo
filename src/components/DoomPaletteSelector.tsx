"use client";

import React, { useState, useEffect } from "react";
import { useDoomTheme, DOOM_PALETTES, DoomPalette } from "@/context/DoomThemeContext";

interface PaletteSelectorProps {
  compact?: boolean;
  showLabels?: boolean;
}

export default function DoomPaletteSelector({ compact = true, showLabels = false }: PaletteSelectorProps) {
  const { palette, setPalette, scanlines, toggleScanlines } = useDoomTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div style={{ display: "flex", alignItems: "center", gap: "6px", height: "30px" }}>
        <div style={{ width: "12px", height: "12px", borderRadius: "2px", background: "#00E5FF" }} />
      </div>
    );
  }

  const palettes: DoomPalette[] = ["cyan", "orange", "green", "magenta"];

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: compact ? "6px" : "10px",
        padding: compact ? "3px 8px" : "6px 12px",
        background: "rgba(4, 8, 12, 0.85)",
        border: "1px solid var(--border-color)",
        borderRadius: "4px",
        backdropFilter: "blur(12px)",
        boxShadow: "0 0 12px -2px var(--accent-glow)",
      }}
    >
      <span
        style={{
          fontFamily: "var(--font-mono, monospace)",
          fontSize: compact ? "0.68rem" : "0.75rem",
          fontWeight: 700,
          color: "var(--accent-primary)",
          letterSpacing: "0.08em",
          textTransform: "uppercase",
          userSelect: "none",
        }}
      >
        {compact ? "HUD" : "COLOR PALETTE"}
      </span>

      <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
        {palettes.map((p) => {
          const cfg = DOOM_PALETTES[p];
          const isSelected = palette === p;

          return (
            <button
              key={p}
              type="button"
              onClick={() => setPalette(p)}
              title={`${cfg.name} (${cfg.hex}) - ${cfg.option}`}
              style={{
                width: compact ? "16px" : "22px",
                height: compact ? "16px" : "22px",
                borderRadius: "2px",
                backgroundColor: cfg.hex,
                border: isSelected ? "2px solid #FFFFFF" : "1px solid rgba(0, 0, 0, 0.6)",
                boxShadow: isSelected ? `0 0 10px ${cfg.hex}` : "none",
                cursor: "pointer",
                padding: 0,
                transform: isSelected ? "scale(1.15)" : "scale(1)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease",
                outline: "none",
              }}
            />
          );
        })}
      </div>

      {/* CRT Scanline Toggle */}
      <button
        type="button"
        onClick={toggleScanlines}
        title={scanlines ? "Disable CRT Phosphor Scanlines" : "Enable CRT Phosphor Scanlines"}
        style={{
          marginLeft: "2px",
          fontFamily: "var(--font-mono, monospace)",
          fontSize: "0.62rem",
          fontWeight: 700,
          color: scanlines ? "var(--accent-primary)" : "#64748B",
          background: scanlines ? "rgba(0, 229, 255, 0.12)" : "transparent",
          border: `1px solid ${scanlines ? "var(--accent-primary)" : "#334155"}`,
          padding: "2px 5px",
          borderRadius: "2px",
          cursor: "pointer",
          letterSpacing: "0.05em",
          textTransform: "uppercase",
        }}
      >
        CRT {scanlines ? "ON" : "OFF"}
      </button>

      {showLabels && (
        <span
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.68rem",
            color: "#94A3B8",
            marginLeft: "4px",
          }}
        >
          {DOOM_PALETTES[palette].hex}
        </span>
      )}
    </div>
  );
}
