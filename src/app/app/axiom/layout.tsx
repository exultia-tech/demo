import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Axiom - Exultia Dashboard",
  description: "Exultia Axiom global exam simulator and open-source security education framework.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  other: {
    robots: "noindex, nofollow, noai, noimageai",
  }
};

export default function AxiomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
