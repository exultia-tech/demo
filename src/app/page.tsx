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
              <PureIdeIcon size={68} glow={true} />
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
              <VantageIcon size={68} glow={true} />
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
              <KineticIcon size={68} glow={true} />
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
              <PureOsIcon size={68} glow={true} />
            </div>
            <h3 className="megaman-tile-name">PureOS</h3>
            <div className="megaman-tile-sub">Zero-Trust Container OS</div>
            <p className="megaman-tile-desc">
              Build verified, CIS-hardened container images and virtual machines.
            </p>
          </Link>

          {/* 5. CENTER: EXULTIA LOGO ONLY (NO TILE, 420px) */}
          <div className="megaman-center-emblem megaman-cell-center">
            <ExultiaLogo size={420} glow={false} />
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
              <PraxisIcon size={68} glow={true} />
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
              <AxiomIcon size={68} glow={true} />
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
              <InquestIcon size={68} glow={true} />
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
              "--tile-color": "#EF4444",
              "--tile-glow": "rgba(239, 68, 68, 0.45)",
            }}
          >
            <div className="megaman-tile-icon">
              <ArgentIcon size={68} glow={true} />
            </div>
            <h3 className="megaman-tile-name">Argent</h3>
            <div className="megaman-tile-sub">Dynamic Patching Pipeline</div>
            <p className="megaman-tile-desc">
              Stream and deploy upstream vendor errata, kernel patches, and multi-OS distribution updates.
            </p>
          </Link>

        </div>

        {/* FEATURED RESOURCE: COMPENDIUM AUDITOR PREPAREDNESS ENGINE */}
        <div style={{ maxWidth: "1160px", margin: "2.5rem auto 0 auto", padding: "0 1rem" }}>
          <Link
            href="/frameworks"
            style={{
              textDecoration: "none",
              display: "block",
              background: "linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.9) 100%)",
              border: "1px solid rgba(59, 130, 246, 0.4)",
              borderRadius: "20px",
              padding: "1.75rem 2rem",
              boxShadow: "0 15px 35px -5px rgba(0, 0, 0, 0.7), 0 0 25px rgba(59, 130, 246, 0.15)",
              transition: "all 0.2s ease",
              position: "relative",
              overflow: "hidden"
            }}
            className="hover-card"
          >
            <div style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "1.5rem"
            }}>
              <div style={{ flex: 1, minWidth: "300px" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(59, 130, 246, 0.18)", border: "1px solid rgba(59, 130, 246, 0.4)", padding: "3px 12px", borderRadius: "999px", fontSize: "0.72rem", color: "#60A5FA", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "0.6rem" }}>
                  Featured Regulatory Hub • Free Resource
                </div>
                <h2 style={{ fontFamily: "var(--font-display, 'Orbitron', sans-serif)", fontSize: "1.45rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.5rem 0", letterSpacing: "0.02em" }}>
                  Compendium: Auditor Preparedness &amp; Compliance Matrix
                </h2>
                <p style={{ margin: 0, fontSize: "0.92rem", color: "#94A3B8", lineHeight: 1.5 }}>
                  Plain-English engineering requirements, concrete CLI verification commands, and ready-to-produce evidence lockers for <span style={{ color: "#CBD5E1" }}>NIST 800-53, ISO 27001, SOC 2, PCI-DSS, HIPAA, SOX ITGC, GDPR, and CMMC 2.0</span>.
                </p>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexShrink: 0 }}>
                <span style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                  color: "#FFFFFF",
                  padding: "0.75rem 1.4rem",
                  borderRadius: "12px",
                  fontSize: "0.88rem",
                  fontWeight: 800,
                  letterSpacing: "0.02em"
                }}>
                  Launch Auditor Hub →
                </span>
              </div>
            </div>
          </Link>
        </div>

      </main>
    </div>
  );
}
