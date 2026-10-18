"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

export type DoomPalette = "cyan" | "orange" | "green" | "magenta";

interface DoomThemeContextType {
  palette: DoomPalette;
  setPalette: (palette: DoomPalette) => void;
  rollRandomPalette: () => void;
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

const ALL_PALETTES: DoomPalette[] = ["cyan", "orange", "green", "magenta"];

const DoomThemeContext = createContext<DoomThemeContextType>({
  palette: "cyan",
  setPalette: () => {},
  rollRandomPalette: () => {},
  scanlines: true,
  toggleScanlines: () => {},
});

export function DoomThemeProvider({ children }: { children: React.ReactNode }) {
  const [palette, setPaletteState] = useState<DoomPalette>("cyan");
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    // On load / hard-refresh: read the randomly assigned palette from html tag or generate one
    const activeOnHtml = typeof document !== "undefined"
      ? (document.documentElement.getAttribute("data-doom-palette") as DoomPalette | null)
      : null;

    let initialPalette: DoomPalette;
    if (activeOnHtml && DOOM_PALETTES[activeOnHtml]) {
      initialPalette = activeOnHtml;
    } else {
      // Pick random
      initialPalette = ALL_PALETTES[Math.floor(Math.random() * ALL_PALETTES.length)];
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-doom-palette", initialPalette);
      }
    }

    setPaletteState(initialPalette);

    try {
      const storedScanlines = localStorage.getItem("exultia_doom_scanlines");
      if (storedScanlines !== null) {
        setScanlines(storedScanlines === "true");
      }
    } catch {
      // Fallback
    }
  }, []);

  const setPalette = (newPalette: DoomPalette) => {
    setPaletteState(newPalette);
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("data-doom-palette", newPalette);
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("exultia-doom-palette-change", { detail: { palette: newPalette } }));
    }
  };

  const rollRandomPalette = () => {
    const choices = ALL_PALETTES.filter((p) => p !== palette);
    const next = choices[Math.floor(Math.random() * choices.length)];
    setPalette(next);
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
    <DoomThemeContext.Provider value={{ palette, setPalette, rollRandomPalette, scanlines, toggleScanlines }}>
      {children}
    </DoomThemeContext.Provider>
  );
}

export function useDoomTheme() {
  return useContext(DoomThemeContext);
}
