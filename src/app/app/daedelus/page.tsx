import React, { Suspense } from "react";
import { Metadata } from "next";
import DaedelusBuilderConsole from "./DaedelusBuilderConsole";

export const metadata: Metadata = {
  title: "Daedelus Builder Console | Sovereign Developer Workstations, Containers & Zero-CVE Packages",
  description:
    "Unified clean-room developer console. Mode-toggle between air-gapped IDE workstations, distroless OCI containers, and negative-admission zero-CVE packages.",
};

export default function DaedelusConsolePage() {
  return (
    <Suspense
      fallback={
        <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#060913", color: "#94A3B8" }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "0.5rem" }}>
              Loading Daedelus Console...
            </div>
            <div style={{ fontSize: "0.85rem", color: "#64748B" }}>
              Initializing Sovereign Workstation &amp; Container Environment
            </div>
          </div>
        </div>
      }
    >
      <DaedelusBuilderConsole />
    </Suspense>
  );
}
