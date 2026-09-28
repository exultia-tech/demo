import { Suspense } from "react";
import { Metadata } from "next";
import { FoiaWorkspace } from "@/components/foia/FoiaWorkspace";

export const metadata: Metadata = {
  title: "Exultia Inquest | Public Records & FOIA Assistant",
  description: "Automated public records assistant covering 50-state sunshine laws and federal FOIA.",
};

export default function DirectInquestPage() {
  return (
    <div className="fade-in" style={{ maxWidth: "1440px", margin: "0 auto", padding: "1.5rem 1.5rem 4rem 1.5rem" }}>
      <Suspense fallback={<div style={{ padding: "4rem", textAlign: "center", color: "var(--text-muted)" }}>Loading Inquest Workspace...</div>}>
        <FoiaWorkspace initialTab="wizard" />
      </Suspense>
    </div>
  );
}
