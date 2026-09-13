import { Metadata } from "next";
import { FoiaWorkspace } from "@/components/foia/FoiaWorkspace";

export const metadata: Metadata = {
  title: "LexPublica FOIA | Exultia",
  description: "Deterministic Open Records & Statutory FOIA Compliance Platform.",
};

export default function DirectFoiaPage() {
  return (
    <div className="fade-in" style={{ maxWidth: "1440px", margin: "0 auto", padding: "1.5rem 1.5rem 4rem 1.5rem" }}>
      <FoiaWorkspace initialTab="wizard" />
    </div>
  );
}

