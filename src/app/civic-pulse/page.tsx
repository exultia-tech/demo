import { Metadata } from "next";
import { CivicPulseTerminal } from "@/components/civic-pulse/CivicPulseTerminal";

export const metadata: Metadata = {
  title: "Exultia CivicPulse Terminal | Municipal Public Intelligence Workspace",
  description: "Search city council meeting minutes, ordinances, and roll-call votes across thousands of US municipalities without formal FOIA requests.",
};

export default function CivicPulseWorkspacePage() {
  return (
    <div className="fade-in" style={{ maxWidth: "1360px", margin: "0 auto", padding: "2.5rem 1.5rem 6rem 1.5rem" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>
          CivicPulse <span style={{ color: "#10B981" }}>Terminal</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.05rem", margin: 0 }}>
          Deterministic municipal public records query engine. Access verified city council minutes, agendas, and roll-call votes with automatic Civic Desk researcher escalation.
        </p>
      </div>

      <CivicPulseTerminal />
    </div>
  );
}
