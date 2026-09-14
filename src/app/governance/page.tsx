import React from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  Camera, 
  FileText, 
  Cpu, 
  Eye, 
  Scale, 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  Download, 
  Layers, 
  Sparkles, 
  ExternalLink,
  Lock,
  BookOpen
} from 'lucide-react';
import { ALPR_CSF_FRAMEWORK } from '@/lib/governance/alprFrameworkData';

export const metadata = {
  title: 'Experimental Governance Frameworks | Exultia',
  description: 'Vendor-agnostic baseline standards, technical control frameworks, and physical safety engineering for civic technology and municipal surveillance.',
};

export default function GovernanceHubPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-main)', color: 'var(--text-main)', paddingBottom: '5rem' }}>
      
      {/* HERO SECTION */}
      <section style={{
        position: 'relative',
        padding: '5rem 2rem 4rem 2rem',
        background: 'radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.15), transparent 70%)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '20px', background: 'rgba(59, 130, 246, 0.12)', border: '1px solid rgba(59, 130, 246, 0.3)', marginBottom: '1.5rem' }}>
            <Sparkles size={14} color="#60A5FA" />
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#93C5FD', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              Civic Technology Standards Lab
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
            fontWeight: 800,
            lineHeight: '1.15',
            letterSpacing: '-0.03em',
            marginBottom: '1.25rem',
            background: 'linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Experimental Governance Frameworks
          </h1>

          <p style={{
            fontSize: '1.15rem',
            lineHeight: '1.65',
            color: '#94A3B8',
            maxWidth: '760px',
            margin: '0 auto 2rem auto'
          }}>
            Vendor-agnostic baseline standards, technical control frameworks, and physical safety engineering guidelines developed to govern emerging municipal surveillance, AI sensors, and civic technologies before federal standards exist.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link 
              href="/governance/alpr-csf"
              className="btn-primary"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.8rem',
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                textDecoration: 'none',
                boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)'
              }}>
              <span>Explore ALPR-CSF v1.0</span>
              <ArrowRight size={16} />
            </Link>

            <a 
              href="#frameworks-catalog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '0.75rem 1.6rem',
                borderRadius: '8px',
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                color: '#E2E8F0',
                fontWeight: 600,
                textDecoration: 'none'
              }}>
              <Layers size={16} />
              <span>Catalog & Pipeline</span>
            </a>
          </div>

          {/* HIGH LEVEL STATS / METRICS */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.25rem',
            marginTop: '3.5rem',
            textAlign: 'left'
          }}>
            {[
              { label: 'Control Pillars', val: '8 Architecture Pillars', desc: 'Identity, physical safety & legal gates' },
              { label: 'Granular Controls', val: '35+ Standard Controls', desc: 'Mandatory, prohibited & compensating' },
              { label: 'Cross-Walk Mapping', val: '100% Industry Mapped', desc: 'NIST 800-53, FBI CJIS & ISO 27001' },
              { label: 'Engineering Rigor', val: 'AASHTO MASH-16', desc: 'Roadside crash safety & wind loading' }
            ].map((stat, i) => (
              <div key={i} style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '16px 20px',
                backdropFilter: 'blur(10px)'
              }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#60A5FA', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                  {stat.label}
                </div>
                <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
                  {stat.val}
                </div>
                <div style={{ fontSize: '0.78rem', color: '#94A3B8', marginTop: '4px' }}>
                  {stat.desc}
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* MAIN CATALOG CONTAINER */}
      <main id="frameworks-catalog" style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem' }}>
        
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Active Baseline Standard
          </div>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
            Flagship Governance Framework
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '750px', fontSize: '0.98rem' }}>
            The primary control standard ready for adoption by City Councils, Police Commissions, and Municipal IT Directors.
          </p>
        </div>

        {/* FEATURED FRAMEWORK CARD: ALPR-CSF */}
        <div style={{
          background: 'linear-gradient(145deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 15, 28, 0.95) 100%)',
          border: '1px solid rgba(59, 130, 246, 0.3)',
          borderRadius: '16px',
          padding: '2.5rem',
          boxShadow: '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px rgba(59, 130, 246, 0.15)',
          marginBottom: '4rem',
          position: 'relative',
          overflow: 'hidden'
        }}>
          
          <div style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '260px',
            height: '260px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.12) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          {/* Top badges */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#60A5FA',
                padding: '4px 12px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: 800,
                letterSpacing: '0.05em',
                border: '1px solid rgba(59, 130, 246, 0.4)'
              }}>
                ALPR-CSF v1.0
              </span>
              <span style={{
                background: 'rgba(16, 185, 129, 0.15)',
                color: '#34D399',
                padding: '4px 10px',
                borderRadius: '6px',
                fontSize: '0.75rem',
                fontWeight: 700,
                border: '1px solid rgba(16, 185, 129, 0.3)'
              }}>
                ● Active Standard
              </span>
            </div>

            <div style={{ fontSize: '0.82rem', color: '#94A3B8' }}>
              Applies to: <strong style={{ color: '#E2E8F0' }}>Flock Safety, Motorola/Vigilant, Rekor, Genetec</strong>
            </div>
          </div>

          {/* Framework Title */}
          <h3 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem', lineHeight: '1.25' }}>
            Automated License Plate Recognition Control Security Framework
          </h3>

          <p style={{ fontSize: '1rem', color: '#CBD5E1', lineHeight: '1.65', maxWidth: '950px', marginBottom: '2rem' }}>
            The definitive open baseline standard for municipal license plate readers. Spanning 8 architecture pillars—from mandatory CAD incident justification, 30-day auto-purge caps, and non-transitive mutual aid sharing, to AASHTO MASH-16 roadway clear-zone crash engineering and Driver’s Privacy Protection Act (DPPA) statutory firewalls.
          </p>

          {/* 8 PILLARS PREVIEW GRID */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '12px',
            marginBottom: '2.5rem'
          }}>
            {ALPR_CSF_FRAMEWORK.pillars.map((pillar) => (
              <div key={pillar.code} style={{
                background: 'rgba(2, 6, 23, 0.6)',
                border: `1px solid ${pillar.borderColor}`,
                borderRadius: '10px',
                padding: '12px 14px',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '10px'
              }}>
                <div style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  background: pillar.accentBg,
                  color: pillar.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 800,
                  fontSize: '0.75rem',
                  flexShrink: 0
                }}>
                  {pillar.code}
                </div>
                <div>
                  <div style={{ fontSize: '0.84rem', fontWeight: 700, color: '#FFFFFF' }}>
                    {pillar.name}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#94A3B8', marginTop: '2px', lineHeight: '1.4' }}>
                    {pillar.description.slice(0, 75)}...
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Action Footer */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
            borderTop: '1px solid rgba(255, 255, 255, 0.08)',
            paddingTop: '1.5rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#94A3B8', fontSize: '0.82rem' }}>
              <Scale size={16} color="#60A5FA" />
              <span>Includes cross-walks to NIST SP 800-53, ISO/IEC 27001, and FBI CJIS v5.9 Policy</span>
            </div>

            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link 
                href="/governance/alpr-csf#compliance-assessment"
                style={{
                  padding: '8px 16px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#E2E8F0',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                <CheckCircle2 size={14} color="#10B981" />
                <span>Audit Self-Assessment</span>
              </Link>

              <Link 
                href="/governance/alpr-csf"
                style={{
                  padding: '8px 20px',
                  borderRadius: '8px',
                  background: 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)',
                  color: '#FFFFFF',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  textDecoration: 'none',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 0 15px rgba(59, 130, 246, 0.3)'
                }}>
                <span>Read Full ALPR-CSF Standard</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>

        </div>

        {/* INCUBATION ROADMAP SECTION */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#8B5CF6', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Pipeline & Research
          </div>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#FFFFFF', marginTop: '4px' }}>
            Frameworks Under Active Incubation
          </h2>
          <p style={{ color: '#94A3B8', maxWidth: '750px', fontSize: '0.95rem' }}>
            Future open control standards currently being drafted for public review and civic comment.
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.5rem',
          marginBottom: '4rem'
        }}>
          
          {/* INCUBATION 1: UAS-CSF */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.8rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#A78BFA', background: 'rgba(139, 92, 246, 0.15)', border: '1px solid rgba(139, 92, 246, 0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                  UAS-CSF
                </span>
                <span style={{ fontSize: '0.72rem', color: '#FBBF24', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Draft in Progress
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Municipal Drone & Aerial Systems (UAS-CSF)
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: '1.6' }}>
                Airspace governance, pre-programmed flight path bounds, sensor resolution ceilings over residential curtilage, and mandatory real-time public telemetry broadcast.
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', marginTop: '1.5rem', fontSize: '0.78rem', color: '#64748B' }}>
              Target Review: Q4 2026 • Scope: First Responder Drone Deployments
            </div>
          </div>

          {/* INCUBATION 2: CCTV-CV */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.8rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#38BDF8', background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                  CCTV-CV
                </span>
                <span style={{ fontSize: '0.72rem', color: '#FBBF24', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Draft in Progress
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Public Computer Vision & Biometrics Baseline
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: '1.6' }}>
                Ban on ambient 1:N real-time facial identification in public squares, demographic bias rate thresholds, algorithmic drift auditing, and video redaction for open records.
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', marginTop: '1.5rem', fontSize: '0.78rem', color: '#64748B' }}>
              Target Review: Q1 2027 • Scope: Real-Time Crime Centers (RTCC)
            </div>
          </div>

          {/* INCUBATION 3: SmartGrid-ZTS */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '14px',
            padding: '1.8rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#34D399', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                  SmartGrid-ZTS
                </span>
                <span style={{ fontSize: '0.72rem', color: '#FBBF24', background: 'rgba(245, 158, 11, 0.1)', padding: '2px 8px', borderRadius: '4px', fontWeight: 600 }}>
                  Draft in Progress
                </span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.5rem' }}>
                Municipal IoT & Sensor Enclave Security
              </h3>
              <p style={{ fontSize: '0.88rem', color: '#94A3B8', lineHeight: '1.6' }}>
                Zero-trust hardware authentication, mutual TLS micro-segmentation for municipal SCADA/water systems, and firmware attestation against supply-chain tampering.
              </p>
            </div>

            <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '1rem', marginTop: '1.5rem', fontSize: '0.78rem', color: '#64748B' }}>
              Target Review: Q2 2027 • Scope: Smart City IoT & Water Telemetry
            </div>
          </div>

        </div>

        {/* CORE PILLARS OF EXULTIA GOVERNANCE ARCHITECTURE */}
        <div style={{
          background: 'rgba(2, 6, 23, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '16px',
          padding: '2.5rem',
          textAlign: 'center'
        }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#FFFFFF', marginBottom: '0.75rem' }}>
            The Four Tenets of Exultia Governance Architecture
          </h3>
          <p style={{ color: '#94A3B8', maxWidth: '700px', margin: '0 auto 2rem auto', fontSize: '0.92rem' }}>
            Every framework published under Exultia is built to withstand federal constitutional scrutiny, physical roadway hazards, and statutory public accountability.
          </p>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.5rem',
            textAlign: 'left'
          }}>
            {[
              {
                icon: ShieldCheck,
                title: 'Vendor-Agnostic Openness',
                desc: '100% municipal data ownership. Strict bans on vendor data pooling, cross-customer AI model training, and private resale of civic telemetry.'
              },
              {
                icon: Scale,
                title: 'Constitutional Grounding',
                desc: 'Direct integration with 18 U.S.C. § 2721 (DPPA), Fourth Amendment geofencing limits, state purge mandates, and non-transitive sharing firewalls.'
              },
              {
                icon: AlertTriangle,
                title: 'Physical Engineering Rigor',
                desc: 'AASHTO MASH-16 breakaway crash testing, roadside clear-zone compliance, ultimate wind load caissons, and ADA sidewalk preservation.'
              },
              {
                icon: FileText,
                title: 'Deterministic Auditability',
                desc: 'Immutable write-once/read-many (WORM) query logging, automated anomaly detection for off-shift searches, and civilian oversight open data export.'
              }
            ].map((tenet, idx) => {
              const Icon = tenet.icon;
              return (
                <div key={idx} style={{
                  background: 'rgba(15, 23, 42, 0.5)',
                  border: '1px solid rgba(255, 255, 255, 0.06)',
                  borderRadius: '12px',
                  padding: '1.25rem'
                }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'rgba(59, 130, 246, 0.15)', color: '#60A5FA', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                    <Icon size={18} />
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '6px' }}>
                    {tenet.title}
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#94A3B8', lineHeight: '1.55' }}>
                    {tenet.desc}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

    </div>
  );
}
