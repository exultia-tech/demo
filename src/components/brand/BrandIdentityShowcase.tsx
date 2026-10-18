"use client";

import React from "react";
import Image from "next/image";
import { useDoomTheme, DOOM_PALETTES, DoomPalette } from "@/context/DoomThemeContext";
import { Download, Check, Sparkles, Terminal } from "lucide-react";

export default function BrandIdentityShowcase() {
  const { palette, setPalette, rollRandomPalette } = useDoomTheme();

  const options: { id: DoomPalette; label: string; code: string; hex: string; cardImg: string }[] = [
    {
      id: "green",
      label: "Option A",
      code: "UAC // TOXIC RADIATION",
      hex: "#00FF66",
      cardImg: "/branding/crt_card_green.png",
    },
    {
      id: "orange",
      label: "Option B",
      code: "DOOM // HELLFIRE AMBER",
      hex: "#FF9900",
      cardImg: "/branding/crt_card_orange.png",
    },
    {
      id: "magenta",
      label: "Option C",
      code: "CYBER // DEMONIC NEON",
      hex: "#D03380",
      cardImg: "/branding/crt_card_magenta.png",
    },
    {
      id: "cyan",
      label: "Option D",
      code: "BFG // PLASMA CYAN",
      hex: "#00E5FF",
      cardImg: "/branding/crt_card_cyan.png",
    },
  ];

  return (
    <section
      className="doom-hud-panel"
      style={{
        marginTop: "4rem",
        padding: "2.5rem 2rem",
        background: "rgba(4, 7, 10, 0.92)",
        border: "1px solid var(--border-color)",
        position: "relative",
      }}
    >
      {/* HUD Header Bar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: "1px solid var(--border-color)",
          paddingBottom: "1.25rem",
          marginBottom: "2rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div
            style={{
              width: "10px",
              height: "10px",
              backgroundColor: "var(--accent-primary)",
              boxShadow: "0 0 10px var(--accent-primary)",
            }}
          />
          <h2
            style={{
              margin: 0,
              fontSize: "1.35rem",
              fontWeight: 900,
              letterSpacing: "0.06em",
              color: "#FFFFFF",
            }}
          >
            EXULTIA TECHNOLOGIES // BRAND IDENTITY SYSTEM
          </h2>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
          <span
            style={{
              fontFamily: "var(--font-mono, monospace)",
              fontSize: "0.75rem",
              color: "var(--accent-primary)",
              letterSpacing: "0.08em",
            }}
          >
            [ ACTIVE COLORWAY: {DOOM_PALETTES[palette].option.toUpperCase()} // {DOOM_PALETTES[palette].hex} ]
          </span>
          <button
            type="button"
            onClick={rollRandomPalette}
            className="btn-primary"
            style={{ fontSize: "0.78rem", padding: "6px 14px", display: "inline-flex", gap: "6px" }}
          >
            <Sparkles size={14} />
            Reroll Random Color
          </button>
          <a
            href="/branding/brand_identity_guidelines.jpg"
            target="_blank"
            download="exultia_brand_identity_guidelines.jpg"
            className="btn-secondary"
            style={{ fontSize: "0.75rem", padding: "6px 12px", display: "inline-flex", gap: "6px" }}
          >
            <Download size={13} />
            Spec Sheet
          </a>
        </div>
      </div>

      {/* HARD REFRESH RANDOM COLORWAY BANNER */}
      <div
        style={{
          background: "rgba(0, 0, 0, 0.45)",
          border: "1px dashed var(--border-color)",
          padding: "0.85rem 1.25rem",
          borderRadius: "4px",
          marginBottom: "2rem",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          fontSize: "0.85rem",
          color: "var(--text-muted)",
        }}
      >
        <Terminal size={16} style={{ color: "var(--accent-primary)", flexShrink: 0 }} />
        <span>
          <strong style={{ color: "#FFFFFF" }}>Hard-Refresh Randomization Active:</strong> Every time the platform loads from a hard-refresh or full reload, a random authentic colorway is automatically selected from the 4 brand variations below.
        </span>
      </div>

      {/* 4 COLOR VARIATIONS GALLERY */}
      <div style={{ marginBottom: "2rem" }}>
        <div
          style={{
            fontFamily: "var(--font-mono, monospace)",
            fontSize: "0.8rem",
            color: "var(--accent-primary)",
            marginBottom: "1rem",
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <Terminal size={14} />
          OFFICIAL COLOR VARIATIONS SPECIFICATION:
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1.25rem",
          }}
        >
          {options.map((opt) => {
            const isSelected = palette === opt.id;
            return (
              <div
                key={opt.id}
                onClick={() => setPalette(opt.id)}
                style={{
                  background: "rgba(6, 11, 15, 0.8)",
                  border: isSelected ? `2px solid ${opt.hex}` : "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "4px",
                  padding: "1rem",
                  cursor: "pointer",
                  position: "relative",
                  boxShadow: isSelected ? `0 0 20px -2px ${opt.hex}66` : "none",
                  transform: isSelected ? "translateY(-3px)" : "none",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Header tag */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "0.75rem",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display, sans-serif)",
                      fontSize: "0.85rem",
                      fontWeight: 800,
                      color: isSelected ? opt.hex : "#FFFFFF",
                      letterSpacing: "0.06em",
                    }}
                  >
                    {opt.label}
                  </span>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span
                      style={{
                        fontFamily: "var(--font-mono, monospace)",
                        fontSize: "0.72rem",
                        color: opt.hex,
                        fontWeight: 700,
                      }}
                    >
                      {opt.hex}
                    </span>
                    {isSelected && (
                      <span
                        style={{
                          width: "16px",
                          height: "16px",
                          borderRadius: "50%",
                          background: opt.hex,
                          color: "#000",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          fontWeight: 900,
                        }}
                      >
                        ✓
                      </span>
                    )}
                  </div>
                </div>

                {/* CRT monitor preview image */}
                <div
                  style={{
                    width: "100%",
                    height: "110px",
                    position: "relative",
                    borderRadius: "3px",
                    overflow: "hidden",
                    border: "1px solid rgba(0, 0, 0, 0.6)",
                    background: "#000",
                  }}
                >
                  <img
                    src={opt.cardImg}
                    alt={`${opt.label} ${opt.code}`}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>

                <div
                  style={{
                    marginTop: "0.6rem",
                    fontFamily: "var(--font-mono, monospace)",
                    fontSize: "0.68rem",
                    color: "#94A3B8",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{opt.code}</span>
                  <span style={{ color: isSelected ? opt.hex : "#64748B" }}>
                    {isSelected ? "[ ACTIVE ]" : "CLICK TO SET"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TECHNICAL SPECIFICATION DETAIL GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
          gap: "1.5rem",
          background: "rgba(2, 5, 8, 0.7)",
          border: "1px solid var(--border-color)",
          padding: "1.5rem",
          borderRadius: "4px",
        }}
      >
        {/* LEFT: EMBLEM SPEC & GATEWAY VISUAL */}
        <div>
          <div
            style={{
              fontSize: "0.72rem",
              fontFamily: "var(--font-mono, monospace)",
              color: "var(--accent-primary)",
              letterSpacing: "0.08em",
              marginBottom: "0.75rem",
            }}
          >
            // TECHNICAL EMBLEM ARCHITECTURE
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              background: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "1rem",
              borderRadius: "4px",
            }}
          >
            <div
              style={{
                width: "90px",
                height: "90px",
                flexShrink: 0,
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={DOOM_PALETTES[palette].emblem}
                alt="Emblem Schematic"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "contain",
                  filter: "drop-shadow(0 0 10px var(--accent-glow))",
                }}
              />
            </div>
            <div>
              <div
                style={{
                  fontFamily: "var(--font-display, sans-serif)",
                  fontSize: "1.05rem",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  letterSpacing: "0.04em",
                }}
              >
                CYBERNETIC DEMON HELM
              </div>
              <p style={{ fontSize: "0.82rem", color: "#94A3B8", margin: "0.3rem 0 0 0", lineHeight: 1.5 }}>
                Features segmented ram horn armor, dual mechanical ocular visors, integrated mecha cheek conduits, and a vanishing-point wireframe perspective gateway.
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT: TYPOGRAPHY HIERARCHY */}
        <div>
          <div
            style={{
              fontSize: "0.72rem",
              fontFamily: "var(--font-mono, monospace)",
              color: "var(--accent-primary)",
              letterSpacing: "0.08em",
              marginBottom: "0.75rem",
            }}
          >
            // TYPOGRAPHY SPECIFICATION
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "0.75rem",
              background: "rgba(0, 0, 0, 0.5)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              padding: "1rem",
              borderRadius: "4px",
            }}
          >
            <div>
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#94A3B8" }}>
                PRIMARY FONT: EXULTIA (ORBITRON / DISPLAY)
              </span>
              <div
                style={{
                  fontFamily: "var(--font-display, sans-serif)",
                  fontSize: "1.1rem",
                  fontWeight: 900,
                  color: "#FFFFFF",
                  letterSpacing: "0.08em",
                  marginTop: "2px",
                }}
              >
                ABCDEFGHIJKLMNOPQRSTUVWXYZ
              </div>
            </div>

            <div>
              <span style={{ fontSize: "0.7rem", fontFamily: "var(--font-mono, monospace)", color: "#94A3B8" }}>
                SECONDARY FONT: DATA-PIXEL (SHARE TECH MONO)
              </span>
              <div
                style={{
                  fontFamily: "var(--font-mono, monospace)",
                  fontSize: "0.92rem",
                  color: "var(--accent-primary)",
                  letterSpacing: "0.05em",
                  marginTop: "2px",
                }}
              >
                abcdefghijklmnopqrstuvwxyz 0123456789
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
