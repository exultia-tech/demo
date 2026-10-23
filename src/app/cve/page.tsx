import React from 'react';
import Link from 'next/link';
import { Metadata } from 'next';
import { getAllCveRecords } from '@/lib/cve-directory';
import Navbar from '@/components/Navbar';
import { ExultiaLogo } from '@/components/BrandIcons';

export const metadata: Metadata = {
  title: 'CVE Remediation Directory & Zero-Downtime Hotfix Catalog | Exultia Praxis',
  description: 'Searchable directory of enterprise CVE remediations, zero-downtime hotfix scripts, CISA KEV alerts, and 10% canary Ansible playbooks compiled by Exultia Praxis.',
  keywords: ['CVE remediation', 'CISA KEV', 'zero downtime hotfix', 'Ansible playbooks', 'Praxis', 'vulnerability mitigation'],
  openGraph: {
    title: 'Exultia Praxis - Public CVE Remediation & Hotfix Catalog',
    description: 'Instant, verified, zero-downtime hotfixes and automated Ansible playbooks for critical CVEs and CISA KEV threats.',
    url: 'https://exultia.tech/cve',
    siteName: 'Exultia Technologies',
    type: 'website',
  },
};

export default async function CveDirectoryPage() {
  const cves = await getAllCveRecords();

  const criticalCount = cves.filter(c => c.severity === 'CRITICAL').length;
  const kevCount = cves.filter(c => c.cisaKev).length;

  return (
    <div className="min-h-screen bg-[#08090b] text-[#f1f5f9] font-mono selection:bg-[#06b6d4]/30 selection:text-[#38bdf8]">
      <Navbar />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20">
        {/* Header HUD */}
        <div className="border border-[#1e293b] bg-[#0c0e14]/90 p-6 sm:p-8 rounded-xl relative overflow-hidden mb-10 shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#06b6d4]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#38bdf8] text-xs font-bold uppercase tracking-wider mb-4">
                <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                Live Ingestion &amp; Synthesis Engine
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                CVE Remediation &amp; Zero-Downtime Hotfix Catalog
              </h1>
              <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-3xl leading-relaxed">
                Autonomous threat intelligence translated into verified, surgical POSIX hotfix scripts, 
                serialized 10% canary Ansible playbooks, and deterministic sub-second rollbacks.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-3 shrink-0">
              <div className="p-3 bg-[#0f172a]/80 border border-[#1e293b] rounded-lg text-center">
                <div className="text-2xl font-bold text-white">{cves.length}</div>
                <div className="text-[11px] text-slate-400 uppercase tracking-wider mt-1">Catalogued</div>
              </div>
              <div className="p-3 bg-[#0f172a]/80 border border-red-500/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-red-400">{criticalCount}</div>
                <div className="text-[11px] text-red-300 uppercase tracking-wider mt-1">Critical</div>
              </div>
              <div className="p-3 bg-[#0f172a]/80 border border-amber-500/30 rounded-lg text-center">
                <div className="text-2xl font-bold text-amber-400">{kevCount}</div>
                <div className="text-[11px] text-amber-300 uppercase tracking-wider mt-1">CISA KEV</div>
              </div>
            </div>
          </div>
        </div>

        {/* Catalog Table / Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-2 text-xs text-slate-400 uppercase tracking-wider">
            <span>Vulnerability &amp; Severity</span>
            <span>Remediation Stacks &amp; Verification</span>
          </div>

          {cves.map((item) => (
            <Link
              key={item.id + item.cveId}
              href={`/cve/${item.cveId.toLowerCase()}`}
              className="group block border border-[#1e293b] hover:border-[#06b6d4]/50 bg-[#0c0e14]/70 hover:bg-[#0c0e14] p-5 rounded-lg transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-bold text-base text-white group-hover:text-[#38bdf8] transition-colors">
                      {item.cveId}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${
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
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/30">
                        ⚡ CISA KEV Active
                      </span>
                    )}

                    <span className="text-xs text-slate-500">
                      ID: {item.id}
                    </span>
                  </div>

                  <p className="text-slate-300 text-sm line-clamp-1">
                    {item.title}
                  </p>

                  <div className="flex flex-wrap items-center gap-2 pt-1">
                    <span className="text-[11px] text-slate-400">Affected:</span>
                    {item.affectedDistros.map((d) => (
                      <span
                        key={d}
                        className="text-[10px] px-1.5 py-0.5 bg-[#1e293b]/60 text-slate-300 rounded border border-[#334155]/40"
                      >
                        {d}
                      </span>
                    ))}
                    <span className="text-slate-600">•</span>
                    <span className="text-[11px] text-slate-400">
                      Packages: {item.affectedPackages.join(', ')}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 pt-2 lg:pt-0">
                  <div className="text-left sm:text-right">
                    <div className="text-[11px] text-emerald-400 font-medium">
                      ✓ Zero-Downtime Hotfix Ready
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Canary Playbook &amp; Sub-Second Rollback
                    </div>
                  </div>

                  <div className="px-3 py-1.5 bg-[#06b6d4]/10 border border-[#06b6d4]/30 text-[#38bdf8] text-xs font-semibold rounded group-hover:bg-[#06b6d4] group-hover:text-black transition-all">
                    View Playbook &rarr;
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
