import Link from "next/link";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import { 
  PureIdeIcon, 
  VantageIcon, 
  KineticIcon, 
  PureOsIcon, 
  PraxisIcon, 
  AxiomIcon, 
  InquestIcon, 
  ArgentIcon, 
  ExultiaLogo 
} from "@/components/BrandIcons";
import { SITE_CONFIG } from "@/config/site-config";

export const metadata: Metadata = {
  title: "Exultia Technologies | Practical. Transparent. Secure.",
  description: "Software engineering environments, real-time threat intelligence feeds, and security automation built for verifiable integrity and transparency.",
};

export default function HomePage() {
  if (SITE_CONFIG.isolatedThreatFeed) {
    redirect("/app/uvi");
  }

  return (
    <div className="fade-in">
      <main className="megaman-container">
        <div className="megaman-grid">

          {/* 1. PureIDE */}
          <Link 
            href="/products/pure-ide"
            className="megaman-tile megaman-cell-pureide"
            style={{
              // @ts-ignore
              "--tile-color": "#3B82F6",
              "--tile-glow": "rgba(59, 130, 246, 0.4)",
            }}
          >
            <div className="megaman-tile-icon">
              <PureIdeIcon size={48} glow={true} />
            </div>
            <h3 className="megaman-tile-name">PureIDE</h3>
            <div className="megaman-tile-sub">Secure Workstation Builder</div>
            <p className="megaman-tile-desc">
              Package and deploy clean, offline-ready IDEs with zero telemetry.
            </p>
          </Link>

          {/* 2. Vantage */}
          <Link 
            href="/app/uvi/stats"
            className="megaman-tile megaman-cell-vantage"
            style={{
              // @ts-ignore
              "--tile-color": "#A855F7",
              "--tile-glow": "rgba(168, 85, 247, 0.4)",
            }}
          >
            <div className="megaman-tile-icon">
              <VantageIcon size={48} glow={true} />
            </div>
            <h3 className="megaman-tile-name">Vantage</h3>
            <div className="megaman-tile-sub">Universal Threat Feed</div>
            <p className="megaman-tile-desc">
              Aggregate and verify 110+ global feeds and active zero-days in real time.
            </p>
          </Link>

          {/* 3. Kinetic */}
          <Link 
            href="/app/patches"
            className="megaman-tile megaman-cell-kinetic"
            style={{
              // @ts-ignore
              "--tile-color": "#00E5FF",
              "--tile-glow": "rgba(0, 229, 255, 0.4)",
            }}
          >
            <div className="megaman-tile-icon">
              <KineticIcon size={48} glow={true} />
            </div>
            <h3 className="megaman-tile-name">Kinetic</h3>
            <div className="megaman-tile-sub">Autonomous Patch Daemon</div>
            <p className="megaman-tile-desc">
              Continuous fleet remediation with deterministic sub-second rollbacks.
            </p>
          </Link>

          {/* 4. PureOS */}
          <Link 
            href="/app/pureos"
            className="megaman-tile megaman-cell-pureos"
            style={{
              // @ts-ignore
              "--tile-color": "#10B981",
              "--tile-glow": "rgba(16, 185, 129, 0.4)",
            }}
          >
            <div className="megaman-tile-icon">
              <PureOsIcon size={48} glow={true} />
            </div>
            <h3 className="megaman-tile-name">PureOS</h3>
            <div className="megaman-tile-sub">Zero-Trust Container OS</div>
            <p className="megaman-tile-desc">
              Build verified, CIS-hardened container images and virtual machines.
            </p>
          </Link>

          {/* 5. CENTER: EXULTIA LOGO ONLY (NO TILE, 2X SIZE) */}
          <div className="megaman-center-emblem megaman-cell-center">
            <ExultiaLogo size={280} glow={false} />
          </div>

          {/* 6. Praxis */}
          <Link 
            href="/app/praxis"
            className="megaman-tile megaman-cell-praxis"
            style={{
              // @ts-ignore
              "--tile-color": "#F59E0B",
              "--tile-glow": "rgba(245, 158, 11, 0.4)",
            }}
          >
            <div className="megaman-tile-icon">
              <PraxisIcon size={48} glow={true} />
            </div>
            <h3 className="megaman-tile-name">Praxis</h3>
            <div className="megaman-tile-sub">Remediation Engine</div>
            <p className="megaman-tile-desc">
              Compile and deploy surgical remediation scripts synced directly with Vantage.
            </p>
          </Link>

          {/* 7. Axiom */}
          <Link 
            href="/app/axiom"
            className="megaman-tile megaman-cell-axiom"
            style={{
              // @ts-ignore
              "--tile-color": "#F43F5E",
              "--tile-glow": "rgba(244, 63, 94, 0.4)",
            }}
          >
            <div className="megaman-tile-icon">
              <AxiomIcon size={48} glow={true} />
            </div>
            <h3 className="megaman-tile-name">Axiom</h3>
            <div className="megaman-tile-sub">Security Education Framework</div>
            <p className="megaman-tile-desc">
              Open-source study paths, exam simulator, and certification terminal labs.
            </p>
          </Link>

          {/* 8. Inquest */}
          <Link 
            href="/products/inquest"
            className="megaman-tile megaman-cell-inquest"
            style={{
              // @ts-ignore
              "--tile-color": "#06B6D4",
              "--tile-glow": "rgba(6, 182, 212, 0.4)",
            }}
          >
            <div className="megaman-tile-icon">
              <InquestIcon size={48} glow={true} />
            </div>
            <h3 className="megaman-tile-name">Inquest</h3>
            <div className="megaman-tile-sub">Public Records & FOIA</div>
            <p className="megaman-tile-desc">
              Draft, file, and track public records requests across federal FOIA and all 50 states.
            </p>
          </Link>

          {/* 9. Argent */}
          <Link 
            href="/app/argent"
            className="megaman-tile megaman-cell-argent"
            style={{
              // @ts-ignore
              "--tile-color": "#94A3B8",
              "--tile-glow": "rgba(148, 163, 184, 0.4)",
            }}
          >
            <div className="megaman-tile-icon">
              <ArgentIcon size={48} glow={true} />
            </div>
            <h3 className="megaman-tile-name">Argent</h3>
            <div className="megaman-tile-sub">Threat Wire & Research</div>
            <p className="megaman-tile-desc">
              Real-time curated cyber intelligence wire and unified vulnerability research.
            </p>
          </Link>

        </div>
      </main>
    </div>
  );
}
