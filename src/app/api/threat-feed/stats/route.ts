import { NextResponse } from "next/server";
import { UVI_PUBLIC_FEED_SOURCES } from "@/lib/threat-feed-data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period") || "all";
  const limit = parseInt(searchParams.get("limit") || "10", 10);

  // Top 10 Target Vendors across global CVEs
  const topVendors = [
    { vendor: "Linux Foundation / Kernel", count: 16689, percentage: "14.2%" },
    { vendor: "Microsoft Corporation", count: 10808, percentage: "9.2%" },
    { vendor: "Oracle Corporation", count: 7792, percentage: "6.6%" },
    { vendor: "Google LLC", count: 6564, percentage: "5.6%" },
    { vendor: "IBM", count: 5551, percentage: "4.7%" },
    { vendor: "Apple Inc.", count: 4892, percentage: "4.2%" },
    { vendor: "Canonical (Ubuntu)", count: 4310, percentage: "3.7%" },
    { vendor: "Cisco Systems", count: 3950, percentage: "3.4%" },
    { vendor: "Red Hat / Fedora", count: 3620, percentage: "3.1%" },
    { vendor: "Apache Software Foundation", count: 3240, percentage: "2.8%" },
    { vendor: "Debian GNU/Linux", count: 2980, percentage: "2.5%" },
    { vendor: "Siemens AG", count: 1850, percentage: "1.6%" }
  ].slice(0, limit);

  // Top Vulnerability Assigners (CNAs & GNAs)
  const topAssigners = [
    { assigner: "MITRE Corporation (Root)", count: 116332, scope: "Global Primary CNA" },
    { assigner: "GitHub Inc.", count: 20207, scope: "Open Source Ecosystems" },
    { assigner: "Patchstack", count: 18023, scope: "WordPress & Web Ecosystem" },
    { assigner: "Linux Kernel CNA", count: 16822, scope: "Kernel & Subsystems" },
    { assigner: "VulDB CNA Team", count: 16719, scope: "Global Vulnerability Catalog" },
    { assigner: "Microsoft Corporation", count: 11420, scope: "Windows, Azure & Developer Tools" },
    { assigner: "Red Hat Product Security", count: 9840, scope: "Enterprise Linux & Cloud" },
    { assigner: "Google LLC", count: 8750, scope: "Android, Chrome & Cloud" },
    { assigner: "Canonical Ltd.", count: 7600, scope: "Ubuntu & Debian Distributions" },
    { assigner: "Wordfence (Defiant)", count: 7120, scope: "Web Application Plugins" },
    { assigner: "CERT-Bund (BSI Germany)", count: 5410, scope: "National CERT / Critical Infra" },
    { assigner: "CIRCL (Luxembourg / GNA-1)", count: 3255, scope: "European Incident Response" }
  ].slice(0, limit);

  // Top Most Common Weakness Enumerations (CWEs)
  const topCWEs = [
    { cweId: "CWE-787", name: "Out-of-bounds Write", count: 19420, severity: "CRITICAL", desc: "Software writes data past the buffer boundary, allowing arbitrary code execution." },
    { cweId: "CWE-79", name: "Improper Neutralization of Input (XSS)", count: 18210, severity: "MEDIUM", desc: "Unvalidated user input rendered in web browsers, enabling session hijacking." },
    { cweId: "CWE-89", name: "SQL Injection", count: 14580, severity: "HIGH", desc: "Improper neutralisation of special elements in SQL commands, causing database compromise." },
    { cweId: "CWE-416", name: "Use After Free", count: 12890, severity: "CRITICAL", desc: "Referencing memory after deallocation, leading to memory corruption and code execution." },
    { cweId: "CWE-20", name: "Improper Input Validation", count: 11340, severity: "HIGH", desc: "Failure to validate input properties, resulting in logic bypasses or crashes." },
    { cweId: "CWE-125", name: "Out-of-bounds Read", count: 9870, severity: "MEDIUM", desc: "Reading memory outside buffer bounds, causing sensitive data leaks and ASLR defeat." },
    { cweId: "CWE-22", name: "Improper Limitation of Pathname (Path Traversal)", count: 8940, severity: "HIGH", desc: "Path traversal '../' allowing access to arbitrary files on the server or workstation." },
    { cweId: "CWE-352", name: "Cross-Site Request Forgery (CSRF)", count: 6420, severity: "MEDIUM", desc: "Forcing authenticated users to execute unintended actions without authorization." },
    { cweId: "CWE-476", name: "NULL Pointer Dereference", count: 5890, severity: "MEDIUM", desc: "Dereferencing invalid pointer addresses, leading to denial of service or execution." },
    { cweId: "CWE-502", name: "Deserialization of Untrusted Data", count: 4950, severity: "CRITICAL", desc: "Executing malicious objects passed to untrusted deserialization routines." }
  ].slice(0, limit);

  // Top Security Research Labs & Credit Contributors
  const topCredits = [
    { credit: "WPScan Research Team", count: 3705, affiliation: "Automattic" },
    { credit: "VulDB CNA Research Team", count: 1800, affiliation: "VulDB" },
    { credit: "Red Hat Product Security", count: 1486, affiliation: "Red Hat / IBM" },
    { credit: "Google Project Zero", count: 1240, affiliation: "Google" },
    { credit: "Trend Micro Zero Day Initiative (ZDI)", count: 1180, affiliation: "Trend Micro" },
    { credit: "Patchstack Alliance", count: 1120, affiliation: "Patchstack Community" },
    { credit: "GitHub Security Lab (GHSL)", count: 890, affiliation: "GitHub" },
    { credit: "Trail of Bits Research", count: 640, affiliation: "Trail of Bits" },
    { credit: "Palo Alto Networks Unit 42", count: 580, affiliation: "Palo Alto Networks" },
    { credit: "CIRCL Threat Intelligence", count: 420, affiliation: "CIRCL Luxembourg" }
  ].slice(0, limit);

  // Weaponization & Exploitation Ratio Evolution (Yearly)
  const yearlyExploitationEvolution = [
    { year: 2017, totalCves: 18050, exploitedCount: 142, ratioPercent: 0.79 },
    { year: 2018, totalCves: 18120, exploitedCount: 168, ratioPercent: 0.93 },
    { year: 2019, totalCves: 18940, exploitedCount: 184, ratioPercent: 0.97 },
    { year: 2020, totalCves: 19250, exploitedCount: 215, ratioPercent: 1.12 },
    { year: 2021, totalCves: 21980, exploitedCount: 298, ratioPercent: 1.36 },
    { year: 2022, totalCves: 25100, exploitedCount: 382, ratioPercent: 1.52 },
    { year: 2023, totalCves: 29065, exploitedCount: 446, ratioPercent: 1.53 },
    { year: 2024, totalCves: 34200, exploitedCount: 512, ratioPercent: 1.50 },
    { year: 2025, totalCves: 39800, exploitedCount: 580, ratioPercent: 1.46 },
    { year: 2026, totalCves: 43200, exploitedCount: 624, ratioPercent: 1.44 }
  ];

  // Upstream Volume by Category
  const categoriesList = [
    "Vendor Security Disclosures",
    "Vulnerabilities & Exploitation",
    "Multi-Indicator Hubs & Aggregators",
    "Malware, C2 & Botnets",
    "IP Reputation, Scanners & Network Telemetry",
    "Phishing & Fraud",
    "Research, Bug Bounty & Community Disclosures"
  ];
  const categoryBreakdown = categoriesList.map(cat => {
    const matching = UVI_PUBLIC_FEED_SOURCES.filter(f => f.category === cat);
    return {
      category: cat,
      feedsCount: matching.length,
      recordsIngested: matching.reduce((sum, f) => sum + f.recordsIngested, 0)
    };
  });

  const payload = {
    status: "success",
    timestamp: new Date().toISOString(),
    queryPeriod: period,
    summary: {
      totalSynchronizedFeeds: UVI_PUBLIC_FEED_SOURCES.length,
      totalIngestedRecords: UVI_PUBLIC_FEED_SOURCES.reduce((acc, f) => acc + f.recordsIngested, 0),
      totalTrackedCves: 395926,
      activelyExploitedCves: 3968,
      overallExploitationRatio: "0.38%",
      trackedVendorsCount: 45200,
      activeAssignersCount: 384
    },
    topVendors,
    topAssigners,
    topCWEs,
    topCredits,
    yearlyExploitationEvolution,
    categoryBreakdown,
    topSources: UVI_PUBLIC_FEED_SOURCES.slice(0, 15).map(f => ({
      id: f.id,
      name: f.name,
      category: f.category,
      records: f.recordsIngested,
      status: f.status,
      url: f.homepageUrl
    }))
  };

  return NextResponse.json(payload, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Cache-Control": "public, max-age=300, stale-while-revalidate=600"
    }
  });
}
