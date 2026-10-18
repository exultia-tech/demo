"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type DoomPalette = "cyan" | "orange" | "green" | "magenta";

interface DoomThemeContextType {
  palette: DoomPalette;
  setPalette: (palette: DoomPalette) => void;
  scanlines: boolean;
  toggleScanlines: () => void;
}

export const DOOM_PALETTES = {
  cyan: {
    id: "cyan" as DoomPalette,
    name: "Plasma Cyan",
    hex: "#00E5FF",
    option: "Option D",
    tag: "BFG // PLASMA",
    emblem: "/branding/emblem_cyan.png",
    lockup: "/branding/logo_transparent_cyan.png",
    glow: "rgba(0, 229, 255, 0.45)",
    border: "rgba(0, 229, 255, 0.28)",
  },
  orange: {
    id: "orange" as DoomPalette,
    name: "Hellfire Amber",
    hex: "#FF9900",
    option: "Option B",
    tag: "DOOM // HELLFIRE",
    emblem: "/branding/emblem_orange.png",
    lockup: "/branding/logo_transparent_orange.png",
    glow: "rgba(255, 153, 0, 0.5)",
    border: "rgba(255, 153, 0, 0.28)",
  },
  green: {
    id: "green" as DoomPalette,
    name: "Toxic Radiation",
    hex: "#00FF66",
    option: "Option A",
    tag: "UAC // TOXIC",
    emblem: "/branding/emblem_green.png",
    lockup: "/branding/logo_transparent_green.png",
    glow: "rgba(0, 255, 102, 0.5)",
    border: "rgba(0, 255, 102, 0.28)",
  },
  magenta: {
    id: "magenta" as DoomPalette,
    name: "Demonic Neon",
    hex: "#D03380",
    option: "Option C",
    tag: "CYBER // CRIMSON",
    emblem: "/branding/emblem_magenta.png",
    lockup: "/branding/logo_transparent_magenta.png",
    glow: "rgba(208, 51, 128, 0.5)",
    border: "rgba(208, 51, 128, 0.28)",
  },
};

const DoomThemeContext = createContext<DoomThemeContextType>({
  palette: "cyan",
  setPalette: () => {},
  scanlines: true,
  toggleScanlines: () => {},
});

export function DoomThemeProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<DoomPalette>("cyan");
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    try {
      const storedPalette = localStorage.getItem("exultia_doom_palette") as DoomPalette | null;
      if (storedPalette && DOOM_PALETTES[storedPalette]) {
        setPaletteState(storedPalette);
        document.documentElement.setAttribute("data-doom-palette", storedPalette);
      } else {
        document.documentElement.setAttribute("data-doom-palette", "cyan");
      }

      const storedScanlines = localStorage.getItem("exultia_doom_scanlines");
      if (storedScanlines !== null) {
        setScanlines(storedScanlines === "true");
      }
    } catch {
      // Ignore localStorage errors in private / sandboxed mode
    }
  }, []);

  const setPalette = (newPalette: DoomPalette) => {
    setPaletteState(newPalette);
    try {
      localStorage.setItem("exultia_doom_palette", newPalette);
      document.documentElement.setAttribute("data-doom-palette", newPalette);
      window.dispatchEvent(new CustomEvent("exultia-doom-palette-change", { detail: { palette: newPalette } }));
    } catch {
      // Fallback
    }
  };

  const toggleScanlines = () => {
    setScanlines((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("exultia_doom_scanlines", String(next));
      } catch {
        // Fallback
      }
      return next;
    });
  };

  return (
    <DoomThemeContext.Provider value={{ palette, setPalette, scanlines, toggleScanlines }}>
      {children}
    </DoomThemeContext.Provider>
  );
}

export function useDoomTheme() {
  return useContext(DoomThemeContext);
}
