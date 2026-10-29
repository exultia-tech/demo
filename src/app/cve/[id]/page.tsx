import React from 'react';
import Link from 'next/link';
import JsonLd from '@/components/seo/JsonLd';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getCveRecord, getAllCveRecords, generateHardenedBashScript } from '@/lib/cve-directory';
import Navbar from '@/components/Navbar';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = await getCveRecord(id);
  if (!item) {
    return {
      title: 'Vulnerability Advisory Not Found | Exultia Praxis',
    };
  }

  const title = `${item.cveId}: Zero-Downtime Hotfix & Ansible Playbook | Exultia Praxis`;
  const description = `Immediate zero-downtime hotfix and serialized 10% canary Ansible playbook for ${item.cveId} (${item.title}). CVSS ${item.cvss} ${item.severity}${item.cisaKev ? ' [CISA KEV Known Exploited]' : ''}.`;

  return {
    title,
    description,
    keywords: [
      item.cveId,
      `${item.cveId} hotfix`,
      `${item.cveId} ansible playbook`,
      `${item.cveId} remediation`,
      `${item.cveId} exploit fix`,
      ...item.affectedPackages,
      'Exultia Praxis',
      'Praxis zero-downtime hotpatch',
    ],
    openGraph: {
      title,
      description,
      url: `https://exultia.tech/cve/${item.cveId.toLowerCase()}`,
      siteName: 'Exultia Technologies',
      type: 'article',
      publishedTime: item.publishedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  };
}

export default async function CveDetailPage({ params }: Props) {
  const { id } = await params;
  const item = await getCveRecord(id);

  if (!item) {
    notFound();
  }

  const standaloneBash = generateHardenedBashScript(item);
  const hotfixCommands = item.remediationTier.tier1_hotMitigation.commands.join('\n');
  const verifyCmd = item.remediationTier.tier1_hotMitigation.verificationCommand;
  const rollbackCmd = item.remediationTier.tier1_hotMitigation.rollbackCommand;
  const ansibleYaml = item.remediationTier.tier3_fleetAutomation.ansiblePlaybook;
  const distroCommands = item.remediationTier.tier2_packageUpgrade.distroCommands;

  // Schema.org structured data for SEO rich snippets
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'TechArticle',
    headline: `${item.cveId} Remediation and Hotfix Guide`,
    description: item.title,
    datePublished: item.publishedAt,
    author: {
      '@type': 'Organization',
      name: 'Exultia Technologies Praxis Lab',
      url: 'https://exultia.tech',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Exultia Technologies',
      logo: {
        '@type': 'ImageObject',
        url: 'https://exultia.tech/branding/logo.png',
      },
    },
  };

  return (
    <div className="min-h-screen bg-[#08090b] text-[#f1f5f9] font-mono selection:bg-[#06b6d4]/30 selection:text-[#38bdf8]">
      <JsonLd id={`cve-jsonld-${item.cveId}`} data={jsonLd} />
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/cve" className="hover:text-[#38bdf8] transition-colors">
            &larr; Back to CVE Catalog
          </Link>
          <span>/</span>
          <span className="text-slate-400">{item.cveId}</span>
        </div>

        {/* Vulnerability HUD Header */}
        <div className="border border-[#1e293b] bg-[#0c0e14]/90 p-6 sm:p-8 rounded-xl relative overflow-hidden mb-8 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {item.cveId}
              </h1>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded border ${
                  item.severity === 'CRITICAL'
                    ? 'bg-red-500/10 text-red-400 border-red-500/30'
                    : item.severity === 'HIGH'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                }`}
              >
                CVSS {item.cvss} ({item.severity})
              </span>

              {item.cisaKev && (
                <span className="text-xs font-bold px-2.5 py-1 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse" />
                  CISA KEV Known Exploited
                </span>
              )}
            </div>

            <div className="text-xs text-slate-400">
              Published: {new Date(item.publishedAt).toLocaleDateString()}
            </div>
          </div>

          <p className="text-slate-300 text-base sm:text-lg mb-6 leading-relaxed">
            {item.title}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-[#1e293b] text-xs">
            <div>
              <span className="text-slate-500 block uppercase tracking-wider mb-1">Affected Packages</span>
              <span className="text-slate-200 font-semibold">{item.affectedPackages.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase tracking-wider mb-1">Supported Distros</span>
              <span className="text-slate-200 font-semibold">{item.affectedDistros.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-500 block uppercase tracking-wider mb-1">Cryptographic Provenance</span>
              <span className="text-emerald-400 font-semibold">SLSA Level {item.provenance.slsaLevel} (Cosign OIDC Signed)</span>
            </div>
          </div>
        </div>

        {/* 1-Command Autonomous Praxis Hot-Patching CTA */}
        <div className="border border-[#F59E0B]/40 bg-[#F59E0B]/5 p-5 rounded-lg mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <span className="text-[#FBBF24]">⚡ Autonomous Live Mitigation</span>
              <span className="text-xs text-slate-400">(Zero-Downtime &bull; Sub-Second Rollback)</span>
            </div>
            <p className="text-xs text-slate-300">
              Deploy this patch across production fleets with pre-flight sentinels and instant rollback guarantee.
            </p>
          </div>

          <div className="bg-[#050608] border border-[#1e293b] px-3 py-2 rounded text-xs text-[#FBBF24] font-bold select-all shrink-0">
            sudo praxis apply --cve={item.cveId}
          </div>
        </div>

        {/* Remediation Stack Details */}
        <div className="space-y-8">
          {/* Section 1: Tier 1 Standalone Hotfix */}
          <div className="border border-[#1e293b] bg-[#0c0e14] rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/30">
                  Tier 1
                </span>
                <h2 className="text-base font-bold text-white">
                  Zero-Downtime POSIX Hot-Mitigation Script
                </h2>
              </div>
              <span className="text-xs text-slate-500">No reboot or service downtime</span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              {item.remediationTier.tier1_hotMitigation.summary}
            </p>

            <div className="bg-[#050608] border border-[#1e293b] rounded-lg p-4 relative group">
              <pre className="text-xs text-emerald-400 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {hotfixCommands}
              </pre>
            </div>

            {/* Verification & Rollback Sub-Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t border-[#1e293b]/60">
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold mb-1">
                  🔍 Verification Sentinel Probe:
                </span>
                <div className="bg-[#050608] border border-[#1e293b] rounded p-2 text-xs text-slate-300 select-all">
                  {verifyCmd}
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 block font-semibold mb-1">
                  ⏪ Sub-Second Deterministic Rollback:
                </span>
                <div className="bg-[#050608] border border-[#1e293b] rounded p-2 text-xs text-slate-300 select-all">
                  {rollbackCmd}
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Tier 3 Serialized Ansible Playbook */}
          <div className="border border-[#1e293b] bg-[#0c0e14] rounded-xl p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-[#38bdf8] text-xs font-bold border border-cyan-500/30">
                  Tier 3
                </span>
                <h2 className="text-base font-bold text-white">
                  Serialized 10% Canary Ansible Playbook
                </h2>
              </div>
              <span className="text-xs text-slate-500">Fleet configuration management</span>
            </div>

            <p className="text-xs text-slate-400 mb-4">
              Hardened Ansible playbook with staged canary progression (serial: 10%), configuration validation, and handler reload.
            </p>

            <div className="bg-[#050608] border border-[#1e293b] rounded-lg p-4 relative group">
              <pre className="text-xs text-[#38bdf8] overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {ansibleYaml}
              </pre>
            </div>
          </div>

          {/* Section 3: Tier 2 Distro OS Package Upgrades */}
          {distroCommands && Object.keys(distroCommands).length > 0 && (
            <div className="border border-[#1e293b] bg-[#0c0e14] rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 text-xs font-bold border border-blue-500/30">
                    Tier 2
                  </span>
                  <h2 className="text-base font-bold text-white">
                    Vendor Distro Package Upgrade Commands
                  </h2>
                </div>
                <span className="text-xs text-slate-500">Native package manager reconciliation</span>
              </div>

              <div className="space-y-2 mt-4">
                {Object.entries(distroCommands).map(([distro, cmd]) => (
                  <div key={distro} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-[#050608] border border-[#1e293b] rounded">
                    <span className="text-xs uppercase text-[#38bdf8] font-bold w-20">{distro}</span>
                    <code className="text-xs text-slate-300 select-all overflow-x-auto">{cmd}</code>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Complete Standalone Script Download / Pipe */}
          <div className="border border-[#1e293b] bg-[#0c0e14] rounded-xl p-6">
            <h2 className="text-base font-bold text-white mb-2">
              Full Standalone POSIX Hotfix Script
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Complete, self-contained shell script with root privileges check, logging, pre-flight safety, and automatic rollback on verification failure:
            </p>

            <div className="bg-[#050608] border border-[#1e293b] rounded-lg p-4">
              <pre className="text-xs text-slate-300 overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-96">
                {standaloneBash}
              </pre>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
