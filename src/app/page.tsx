import { Metadata } from "next";
import { redirect } from "next/navigation";
import { SITE_CONFIG } from "@/config/site-config";
import FeedPrefetch from "@/components/FeedPrefetch";
import HomeCommandDeck from "@/components/home/HomeCommandDeck";

export const metadata: Metadata = {
  title: "Autonomous & Accessible Self-Healing Linux",
  description: "Autonomous & Accessible Self-Healing Linux. Portable threat remediation daemon, 60-second autonomous self-healing loop, and real-time vulnerability feed integration.",
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
