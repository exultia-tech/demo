import { Metadata } from "next";
import { redirect } from "next/navigation";
import { SITE_CONFIG } from "@/config/site-config";
import FeedPrefetch from "@/components/FeedPrefetch";
import HomeCommandDeck from "@/components/home/HomeCommandDeck";

export const metadata: Metadata = {
  title: "Exultia Technologies | Closed-Loop Autonomous Cyber Defense",
  description: "Autonomous threat intelligence, adversary emulation, live exploit verification, and sub-second deterministic hotpatching with cryptographic attestation.",
};

export default function HomePage() {
  if (SITE_CONFIG.isolatedThreatFeed) {
    redirect("/app/uvi");
  }

  return (
    <div className="fade-in">
      <FeedPrefetch />
      <main className="exultia-home-container" style={{ padding: "1.5rem 1rem 4rem 1rem" }}>
        <HomeCommandDeck />
      </main>
    </div>
  );
}
