"use client";

import React, { useEffect, useState } from "react";
import { useDoomTheme } from "@/context/DoomThemeContext";

export default function CrtScanlineOverlay() {
  const { scanlines } = useDoomTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !scanlines) {
    return null;
  }

  return (
    <div
      className="doom-crt-overlay"
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        pointerEvents: "none",
        zIndex: 9999,
        background: `
          linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.22) 50%),
          linear-gradient(90deg, rgba(255, 0, 0, 0.015), rgba(0, 255, 0, 0.008), rgba(0, 229, 255, 0.015))
        `,
        backgroundSize: "100% 3px, 6px 100%",
        opacity: 0.5,
      }}
    />
  );
}
