"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  COMPLIANCE_FRAMEWORKS, 
  COMPLIANCE_DOMAINS, 
  AUDIT_CHECKLIST_DATA 
} from "@/lib/compliance/complianceFrameworksData";
import { 
  ComplianceStandardId, 
  ComplianceDomainId, 
  AuditStatus, 
  AuditChecklistItem 
} from "@/types/compliance";
import { 
  ShieldCheck, 
  Key, 
  GitPullRequest, 
  Server, 
  Laptop, 
  Lock, 
  Eye, 
  AlertOctagon, 
  ShieldAlert, 
  Download, 
  Copy, 
  Check, 
  Search, 
  FileText, 
  Sparkles, 
  RefreshCw, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MinusCircle,
  Terminal,
  Layers,
  ArrowRight
} from "lucide-react";

export default function FrameworksResourcePage() {
  // Filter States
  const [selectedFramework, setSelectedFramework] = useState<ComplianceStandardId | "all">("all");
  const [selectedDomain, setSelectedDomain] = useState<ComplianceDomainId | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<AuditStatus | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<"all" | "CRITICAL" | "HIGH" | "MEDIUM">("all");
  const [isPlainEnglishMode, setIsPlainEnglishMode] = useState(true);

  // Expanded Control Accordions
  const [expandedControls, setExpandedControls] = useState<Record<string, boolean>>({});

  // Audit Checklist State (Control ID -> Status)
  const [auditStatuses, setAuditStatuses] = useState<Record<string, AuditStatus>>({});
  const [auditNotes, setAuditNotes] = useState<Record<string, string>>({});
  const [copiedCliId, setCopiedCliId] = useState<string | null>(null);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportContent, setExportContent] = useState("");

  // Load persisted progress from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const savedStatuses = localStorage.getItem("exultia_audit_statuses");
        if (savedStatuses) setAuditStatuses(JSON.parse(savedStatuses));
        const savedNotes = localStorage.getItem("exultia_audit_notes");
        if (savedNotes) setAuditNotes(JSON.parse(savedNotes));
      } catch (err) {
        console.warn("Could not load stored audit checklist:", err);
      }
    }
  }, []);

  // Persist progress to localStorage
  const updateStatus = (controlId: string, status: AuditStatus) => {
    const updated = { ...auditStatuses, [controlId]: status };
    setAuditStatuses(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("exultia_audit_statuses", JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const updateNotes = (controlId: string, note: string) => {
    const updated = { ...auditNotes, [controlId]: note };
    setAuditNotes(updated);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("exultia_audit_notes", JSON.stringify(updated));
      } catch (e) {}
    }
  };

  const toggleAccordion = (controlId: string) => {
    setExpandedControls(prev => ({ ...prev, [controlId]: !prev[controlId] }));
  };

  const expandAll = () => {
    const allExpanded: Record<string, boolean> = {};
    AUDIT_CHECKLIST_DATA.forEach(c => { allExpanded[c.id] = true; });
    setExpandedControls(allExpanded);
  };

  const collapseAll = () => {
    setExpandedControls({});
  };

  const copyToClipboard = (text: string, id: string) => {
    if (typeof navigator !== "undefined") {
      navigator.clipboard.writeText(text);
      setCopiedCliId(id);
      setTimeout(() => setCopiedCliId(null), 2000);
    }
  };

  // Filtered Checklist
  const filteredControls = useMemo(() => {
    return AUDIT_CHECKLIST_DATA.filter(control => {
      // Domain filter
      if (selectedDomain !== "all" && control.domain !== selectedDomain) return false;

      // Status filter
      const currentStatus = auditStatuses[control.id] || "gap";
      if (statusFilter !== "all" && currentStatus !== statusFilter) return false;

      // Priority filter
      if (priorityFilter !== "all" && control.priority !== priorityFilter) return false;

      // Framework filter
      if (selectedFramework !== "all") {
        const mappingKey = {
          "nist-800-53": control.mappings.nist80053,
          "iso-27001": control.mappings.iso27001,
          "soc-2": control.mappings.soc2,
          "pci-dss": control.mappings.pciDss,
          "hipaa": control.mappings.hipaa,
          "sox-itgc": control.mappings.soxItgc,
          "gdpr": control.mappings.gdpr,
          "cmmc": control.mappings.cmmc,
        }[selectedFramework];

        if (!mappingKey || mappingKey.trim() === "") return false;
      }

      // Search query
      if (searchQuery.trim() !== "") {
        const q = searchQuery.toLowerCase();
        const matchesText = 
          control.id.toLowerCase().includes(q) ||
          control.title.toLowerCase().includes(q) ||
          control.plainEnglishRequirement.toLowerCase().includes(q) ||
          control.auditorQuestion.toLowerCase().includes(q) ||
          control.sampleCliVerification.toLowerCase().includes(q) ||
          Object.values(control.mappings).some(m => m.toLowerCase().includes(q));
        if (!matchesText) return false;
      }

      return true;
    });
  }, [selectedDomain, selectedFramework, statusFilter, priorityFilter, searchQuery, auditStatuses]);

  // Overall Statistics
  const totalControls = AUDIT_CHECKLIST_DATA.length;
  const readyCount = AUDIT_CHECKLIST_DATA.filter(c => (auditStatuses[c.id] || "gap") === "ready").length;
  const inProgressCount = AUDIT_CHECKLIST_DATA.filter(c => auditStatuses[c.id] === "in_progress").length;
  const gapCount = AUDIT_CHECKLIST_DATA.filter(c => (auditStatuses[c.id] || "gap") === "gap").length;
  const naCount = AUDIT_CHECKLIST_DATA.filter(c => auditStatuses[c.id] === "not_applicable").length;

  const applicableTotal = Math.max(1, totalControls - naCount);
  const readinessPercent = Math.round((readyCount / applicableTotal) * 100);

  // Generate Auditor Dossier Markdown
  const handleGenerateDossier = () => {
    let md = `# Exultia Compendium: Enterprise Auditor Preparedness Dossier\n`;
    md += `*Generated: ${new Date().toISOString()}*\n\n`;
    md += `## Executive Summary\n`;
    md += `- **Overall Audit Readiness**: ${readinessPercent}%\n`;
    md += `- **Total Controls Evaluated**: ${totalControls}\n`;
    md += `- **Verified Ready for Audit**: ${readyCount}\n`;
    md += `- **In-Progress Remediations**: ${inProgressCount}\n`;
    md += `- **Identified Compliance Gaps**: ${gapCount}\n`;
    md += `- **Not Applicable**: ${naCount}\n\n`;
    md += `---\n\n`;

    COMPLIANCE_DOMAINS.forEach(dom => {
      const domControls = AUDIT_CHECKLIST_DATA.filter(c => c.domain === dom.id);
      md += `### ${dom.name}\n\n`;
      domControls.forEach(ctrl => {
        const st = auditStatuses[ctrl.id] || "gap";
        const stLabel = st === "ready" ? "✅ READY" : st === "in_progress" ? "🔄 IN-PROGRESS" : st === "not_applicable" ? "➖ N/A" : "⚠️ GAP";
        md += `#### [${ctrl.id}] ${ctrl.title} — ${stLabel}\n`;
        md += `**Priority**: ${ctrl.priority}\n\n`;
        md += `**Plain Requirement**: ${ctrl.plainEnglishRequirement}\n\n`;
        md += `**Auditor Question**: "${ctrl.auditorQuestion}"\n\n`;
        md += `**Cross-Framework Mappings**:\n`;
        md += `- NIST 800-53: \`${ctrl.mappings.nist80053}\`\n`;
        md += `- ISO 27001:2022: \`${ctrl.mappings.iso27001}\`\n`;
        md += `- SOC 2: \`${ctrl.mappings.soc2}\`\n`;
        md += `- PCI-DSS v4: \`${ctrl.mappings.pciDss}\`\n`;
        md += `- HIPAA: \`${ctrl.mappings.hipaa}\`\n`;
        md += `- SOX ITGC: \`${ctrl.mappings.soxItgc}\`\n`;
        md += `- GDPR: \`${ctrl.mappings.gdpr}\`\n`;
        md += `- CMMC 2.0: \`${ctrl.mappings.cmmc}\`\n\n`;
        md += `**Evidence Checklist**:\n`;
        ctrl.evidenceArtifacts.forEach(ev => { md += `- [ ] ${ev}\n`; });
        md += `\n**Verification CLI**:\n\`\`\`bash\n${ctrl.sampleCliVerification}\n\`\`\`\n\n`;
        if (auditNotes[ctrl.id]) {
          md += `**Auditor Notes / Internal Reference**:\n> ${auditNotes[ctrl.id]}\n\n`;
        }
        md += `---\n\n`;
      });
    });

    setExportContent(md);
    setShowExportModal(true);
  };

  const activeFrameworkMeta = COMPLIANCE_FRAMEWORKS.find(f => f.id === selectedFramework);

  return (
    <div style={{ minHeight: "100vh", background: "#050811", color: "#F1F5F9", paddingBottom: "5rem" }}>
      
      {/* 1. HERO HEADER */}
      <section style={{
        background: "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(59, 130, 246, 0.25) 0%, rgba(10, 15, 26, 0) 100%)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "3.5rem 1.5rem 2.5rem 1.5rem",
        textAlign: "center",
        position: "relative"
      }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", background: "rgba(59, 130, 246, 0.15)", border: "1px solid rgba(59, 130, 246, 0.35)", padding: "4px 14px", borderRadius: "999px", fontSize: "0.8rem", color: "#60A5FA", fontWeight: 700, marginBottom: "1.25rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
            <Sparkles size={14} />
            Plain-English Regulatory Matrix &amp; Auditor Evidence Locker
          </div>

          <h1 style={{
            fontFamily: "var(--font-display, 'Orbitron', sans-serif)",
            fontSize: "clamp(2rem, 4.5vw, 3.4rem)",
            fontWeight: 900,
            letterSpacing: "0.04em",
            textTransform: "uppercase",
            margin: "0 0 1rem 0",
            background: "linear-gradient(135deg, #FFFFFF 30%, #94A3B8 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}>
            Compendium: Auditor Preparedness Hub
          </h1>

          <p style={{
            fontSize: "1.1rem",
            color: "#94A3B8",
            maxWidth: "860px",
            margin: "0 auto 2rem auto",
            lineHeight: 1.6
          }}>
            Stop drowning in dense regulatory legalese. Distilled, concrete engineering requirements and ready-to-produce evidence checklists across <strong style={{ color: "#FFFFFF" }}>NIST 800-53, ISO 27001, SOC 2, PCI-DSS, HIPAA, SOX ITGC, GDPR</strong>, and <strong style={{ color: "#FFFFFF" }}>CMMC 2.0</strong>.
          </p>

          {/* Quick Metrics Bar */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: "1rem",
            maxWidth: "960px",
            margin: "0 auto",
            background: "rgba(15, 23, 42, 0.65)",
            backdropFilter: "blur(12px)",
            border: "1px solid rgba(255, 255, 255, 0.12)",
            borderRadius: "16px",
            padding: "1.25rem 1.5rem",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.5)"
          }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Overall Readiness</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: readinessPercent >= 80 ? "#10B981" : readinessPercent >= 50 ? "#F59E0B" : "#F43F5E", fontFamily: "var(--font-display, monospace)" }}>
                {readinessPercent}%
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Ready for Audit</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#10B981", fontFamily: "var(--font-display, monospace)" }}>
                {readyCount} <span style={{ fontSize: "0.9rem", color: "#64748B", fontWeight: 500 }}>/ {totalControls}</span>
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>In Remediation</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#3B82F6", fontFamily: "var(--font-display, monospace)" }}>
                {inProgressCount}
              </div>
            </div>

            <div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 700 }}>Compliance Gaps</div>
              <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#F43F5E", fontFamily: "var(--font-display, monospace)" }}>
                {gapCount}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. FRAMEWORK SELECTOR CHIPS */}
      <section style={{ maxWidth: "1280px", margin: "2rem auto 0 auto", padding: "0 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.85rem", flexWrap: "wrap", gap: "0.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Layers size={18} color="#60A5FA" />
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#CBD5E1", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              Filter by Regulatory Framework:
            </span>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={() => setIsPlainEnglishMode(!isPlainEnglishMode)}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 12px",
                borderRadius: "8px",
                fontSize: "0.78rem",
                fontWeight: 700,
                background: isPlainEnglishMode ? "rgba(16, 185, 129, 0.15)" : "rgba(255, 255, 255, 0.05)",
                border: isPlainEnglishMode ? "1px solid #10B981" : "1px solid rgba(255, 255, 255, 0.12)",
                color: isPlainEnglishMode ? "#34D399" : "#94A3B8",
                cursor: "pointer"
              }}
            >
              {isPlainEnglishMode ? "✓ Plain-English Mode Active" : "Official Legal Text Mode"}
            </button>

            <button
              onClick={handleGenerateDossier}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "5px 14px",
                borderRadius: "8px",
                fontSize: "0.78rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)",
                border: "none",
                color: "white",
                cursor: "pointer",
                boxShadow: "0 2px 10px rgba(59, 130, 246, 0.3)"
              }}
            >
              <Download size={14} />
              Export Auditor Dossier
            </button>
          </div>
        </div>

        {/* Framework Pills */}
        <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap", marginBottom: "1.5rem" }}>
          <button
            onClick={() => setSelectedFramework("all")}
            style={{
              padding: "7px 15px",
              borderRadius: "10px",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              transition: "all 0.15s ease",
              background: selectedFramework === "all" ? "rgba(255, 255, 255, 0.18)" : "rgba(255, 255, 255, 0.04)",
              border: selectedFramework === "all" ? "1px solid #FFFFFF" : "1px solid rgba(255, 255, 255, 0.1)",
              color: selectedFramework === "all" ? "#FFFFFF" : "#94A3B8"
            }}
          >
            All Frameworks (Unified Master Index)
          </button>

          {COMPLIANCE_FRAMEWORKS.map(fw => {
            const isSelected = selectedFramework === fw.id;
            return (
              <button
                key={fw.id}
                onClick={() => setSelectedFramework(fw.id)}
                style={{
                  padding: "7px 15px",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  background: isSelected ? fw.accentBg : "rgba(255, 255, 255, 0.03)",
                  border: isSelected ? `1px solid ${fw.color}` : "1px solid rgba(255, 255, 255, 0.08)",
                  color: isSelected ? "#FFFFFF" : "#94A3B8",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: fw.color }} />
                {fw.shortName}
              </button>
            );
          })}
        </div>

        {/* Active Framework Context Banner */}
        {activeFrameworkMeta && (
          <div style={{
            background: activeFrameworkMeta.accentBg,
            border: `1px solid ${activeFrameworkMeta.borderColor}`,
            borderRadius: "14px",
            padding: "1rem 1.25rem",
            marginBottom: "1.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "1rem",
            alignItems: "center"
          }}>
            <div>
              <div style={{ fontSize: "0.75rem", color: activeFrameworkMeta.color, textTransform: "uppercase", fontWeight: 800, letterSpacing: "0.06em" }}>
                Active Framework Context
              </div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", marginTop: "2px" }}>
                {activeFrameworkMeta.name}
              </div>
              <div style={{ fontSize: "0.82rem", color: "#CBD5E1", marginTop: "4px" }}>
                {activeFrameworkMeta.scopeSummary}
              </div>
            </div>

            <div style={{ fontSize: "0.82rem", borderLeft: "1px solid rgba(255, 255, 255, 0.1)", paddingLeft: "1rem" }}>
              <div><strong style={{ color: "#94A3B8" }}>Governing Body:</strong> <span style={{ color: "#FFFFFF" }}>{activeFrameworkMeta.governingBody}</span></div>
              <div style={{ marginTop: "4px" }}><strong style={{ color: "#94A3B8" }}>Audit Cadence:</strong> <span style={{ color: "#FFFFFF" }}>{activeFrameworkMeta.auditFrequency}</span></div>
              <div style={{ marginTop: "4px" }}><strong style={{ color: "#F87171" }}>Non-Compliance Penalty:</strong> <span style={{ color: "#FCA5A5" }}>{activeFrameworkMeta.penaltyRisk}</span></div>
            </div>
          </div>
        )}
      </section>

      {/* 3. OPERATIONAL DOMAIN TABS & SEARCH BAR */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        {/* Domain Navigation */}
        <div style={{
          display: "flex",
          gap: "0.5rem",
          overflowX: "auto",
          paddingBottom: "8px",
          marginBottom: "1.25rem",
          borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
        }}>
          <button
            onClick={() => setSelectedDomain("all")}
            style={{
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "0.82rem",
              fontWeight: 700,
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: selectedDomain === "all" ? "rgba(59, 130, 246, 0.2)" : "transparent",
              border: selectedDomain === "all" ? "1px solid #3B82F6" : "1px solid transparent",
              color: selectedDomain === "all" ? "#60A5FA" : "#94A3B8"
            }}
          >
            All 8 Operational Domains
          </button>

          {COMPLIANCE_DOMAINS.map(d => {
            const isSel = selectedDomain === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setSelectedDomain(d.id)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontSize: "0.82rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  whiteSpace: "nowrap",
                  background: isSel ? `${d.color}25` : "transparent",
                  border: isSel ? `1px solid ${d.color}` : "1px solid transparent",
                  color: isSel ? "#FFFFFF" : "#94A3B8",
                  transition: "all 0.15s ease"
                }}
              >
                {d.shortName}
              </button>
            );
          })}
        </div>

        {/* Filter / Search Controls Row */}
        <div style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "1rem",
          background: "rgba(15, 23, 42, 0.6)",
          padding: "0.85rem 1.25rem",
          borderRadius: "14px",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          marginBottom: "1.5rem"
        }}>
          {/* Search Box */}
          <div style={{ position: "relative", flex: 1, minWidth: "260px" }}>
            <Search size={16} color="#64748B" style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)" }} />
            <input
              type="text"
              placeholder="Search controls, auditor questions, CLI commands, or IDs..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "10px",
                padding: "8px 12px 8px 36px",
                color: "white",
                fontSize: "0.85rem",
                outline: "none"
              }}
            />
          </div>

          {/* Status Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600 }}>Status:</span>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "white",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "0.82rem",
                outline: "none"
              }}
            >
              <option value="all">All Statuses</option>
              <option value="ready">✅ Ready for Audit</option>
              <option value="in_progress">🔄 In Progress</option>
              <option value="gap">⚠️ Compliance Gap</option>
              <option value="not_applicable">➖ Not Applicable</option>
            </select>
          </div>

          {/* Priority Filter */}
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600 }}>Priority:</span>
            <select
              value={priorityFilter}
              onChange={e => setPriorityFilter(e.target.value as any)}
              style={{
                background: "rgba(255, 255, 255, 0.08)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                color: "white",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "0.82rem",
                outline: "none"
              }}
            >
              <option value="all">All Priorities</option>
              <option value="CRITICAL">Critical Only</option>
              <option value="HIGH">High Only</option>
              <option value="MEDIUM">Medium Only</option>
            </select>
          </div>

          {/* Expand/Collapse All */}
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              onClick={expandAll}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#94A3B8",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "0.75rem",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              style={{
                background: "rgba(255, 255, 255, 0.05)",
                border: "1px solid rgba(255, 255, 255, 0.1)",
                color: "#94A3B8",
                borderRadius: "8px",
                padding: "6px 10px",
                fontSize: "0.75rem",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              Collapse
            </button>
          </div>

        </div>

      </section>

      {/* 4. MASTER AUDIT CHECKLIST ITEMS */}
      <section style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 1.5rem" }}>
        
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
          <div style={{ fontSize: "0.9rem", color: "#94A3B8" }}>
            Showing <strong style={{ color: "#FFFFFF" }}>{filteredControls.length}</strong> matching controls
          </div>
          {filteredControls.length === 0 && (
            <div style={{ color: "#F87171", fontSize: "0.85rem" }}>
              No controls match current filters. Try resetting search or framework selectors.
            </div>
          )}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filteredControls.map(control => {
            const status = auditStatuses[control.id] || "gap";
            const isExpanded = Boolean(expandedControls[control.id]);
            const note = auditNotes[control.id] || "";
            const domainMeta = COMPLIANCE_DOMAINS.find(d => d.id === control.domain);

            return (
              <div 
                key={control.id}
                style={{
                  background: "linear-gradient(180deg, rgba(15, 23, 42, 0.85) 0%, rgba(10, 15, 26, 0.95) 100%)",
                  border: status === "ready" 
                    ? "1px solid rgba(16, 185, 129, 0.35)" 
                    : status === "in_progress" 
                    ? "1px solid rgba(59, 130, 246, 0.35)" 
                    : "1px solid rgba(255, 255, 255, 0.1)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.3)",
                  transition: "all 0.2s ease"
                }}
              >
                {/* Control Header Bar */}
                <div 
                  style={{
                    padding: "1.1rem 1.4rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "1rem",
                    background: isExpanded ? "rgba(255, 255, 255, 0.03)" : "transparent",
                    cursor: "pointer"
                  }}
                  onClick={() => toggleAccordion(control.id)}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: 1, minWidth: "300px" }}>
                    
                    {/* Status Indicator Icon */}
                    <div style={{ flexShrink: 0 }}>
                      {status === "ready" && <CheckCircle2 size={24} color="#10B981" />}
                      {status === "in_progress" && <Clock size={24} color="#3B82F6" />}
                      {status === "gap" && <AlertTriangle size={24} color="#F43F5E" />}
                      {status === "not_applicable" && <MinusCircle size={24} color="#64748B" />}
                    </div>

                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{
                          fontFamily: "var(--font-mono, monospace)",
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          color: domainMeta?.color || "#3B82F6",
                          background: "rgba(255, 255, 255, 0.06)",
                          padding: "2px 7px",
                          borderRadius: "4px"
                        }}>
                          {control.id}
                        </span>

                        <span style={{
                          fontSize: "0.7rem",
                          fontWeight: 800,
                          padding: "2px 6px",
                          borderRadius: "4px",
                          background: control.priority === "CRITICAL" ? "rgba(239, 68, 68, 0.2)" : control.priority === "HIGH" ? "rgba(245, 158, 11, 0.2)" : "rgba(59, 130, 246, 0.2)",
                          color: control.priority === "CRITICAL" ? "#F87171" : control.priority === "HIGH" ? "#FBBF24" : "#60A5FA",
                          border: `1px solid ${control.priority === "CRITICAL" ? "#EF4444" : control.priority === "HIGH" ? "#F59E0B" : "#3B82F6"}`
                        }}>
                          {control.priority} PRIORITY
                        </span>

                        <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
                          • {domainMeta?.shortName}
                        </span>
                      </div>

                      <h3 style={{ fontSize: "1.08rem", fontWeight: 700, color: "#FFFFFF", margin: "4px 0 0 0" }}>
                        {control.title}
                      </h3>
                    </div>
                  </div>

                  {/* Status Picker Buttons (Clickable without expanding) */}
                  <div 
                    style={{ display: "flex", alignItems: "center", gap: "6px" }}
                    onClick={e => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      onClick={() => updateStatus(control.id, "ready")}
                      title="Mark as Ready for Audit"
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        border: status === "ready" ? "1px solid #10B981" : "1px solid rgba(255, 255, 255, 0.1)",
                        background: status === "ready" ? "#10B981" : "rgba(255, 255, 255, 0.04)",
                        color: status === "ready" ? "#FFFFFF" : "#94A3B8"
                      }}
                    >
                      ✓ Ready
                    </button>

                    <button
                      type="button"
                      onClick={() => updateStatus(control.id, "in_progress")}
                      title="Mark as In Progress"
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        border: status === "in_progress" ? "1px solid #3B82F6" : "1px solid rgba(255, 255, 255, 0.1)",
                        background: status === "in_progress" ? "#3B82F6" : "rgba(255, 255, 255, 0.04)",
                        color: status === "in_progress" ? "#FFFFFF" : "#94A3B8"
                      }}
                    >
                      🔄 In Progress
                    </button>

                    <button
                      type="button"
                      onClick={() => updateStatus(control.id, "gap")}
                      title="Mark as Compliance Gap"
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "0.76rem",
                        fontWeight: 700,
                        cursor: "pointer",
                        border: status === "gap" ? "1px solid #EF4444" : "1px solid rgba(255, 255, 255, 0.1)",
                        background: status === "gap" ? "#EF4444" : "rgba(255, 255, 255, 0.04)",
                        color: status === "gap" ? "#FFFFFF" : "#94A3B8"
                      }}
                    >
                      ⚠️ Gap
                    </button>

                    <div style={{ marginLeft: "8px", color: "#64748B" }}>
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* Plain-English Overview Bar (Always Visible) */}
                <div style={{
                  padding: "0.75rem 1.4rem",
                  background: "rgba(0, 0, 0, 0.25)",
                  borderTop: "1px solid rgba(255, 255, 255, 0.04)",
                  borderBottom: isExpanded ? "1px solid rgba(255, 255, 255, 0.08)" : "none",
                  fontSize: "0.88rem",
                  color: "#E2E8F0",
                  lineHeight: 1.5
                }}>
                  <strong style={{ color: "#60A5FA" }}>Plain-English Mandate:</strong>{" "}
                  {control.plainEnglishRequirement}
                </div>

                {/* EXPANDED ACCORDION: EVIDENCE LOCKER, CLI & CONFIG GUIDE */}
                {isExpanded && (
                  <div style={{ padding: "1.4rem", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
                    
                    {/* Auditor's Question & Risk Box */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                      gap: "1rem"
                    }}>
                      <div style={{
                        background: "rgba(59, 130, 246, 0.08)",
                        border: "1px solid rgba(59, 130, 246, 0.25)",
                        borderRadius: "12px",
                        padding: "1rem"
                      }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                          Auditor's Literal Interview Question
                        </div>
                        <p style={{ margin: 0, fontSize: "0.88rem", color: "#FFFFFF", fontStyle: "italic", lineHeight: 1.5 }}>
                          "{control.auditorQuestion}"
                        </p>
                      </div>

                      <div style={{
                        background: "rgba(239, 68, 68, 0.08)",
                        border: "1px solid rgba(239, 68, 68, 0.25)",
                        borderRadius: "12px",
                        padding: "1rem"
                      }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 800, color: "#F87171", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "4px" }}>
                          Why Auditors Care (The Real Breach Risk)
                        </div>
                        <p style={{ margin: 0, fontSize: "0.84rem", color: "#FCA5A5", lineHeight: 1.5 }}>
                          {control.whyItMatters}
                        </p>
                      </div>
                    </div>

                    {/* Cross-Framework Mapping Matrix Grid */}
                    <div>
                      <div style={{ fontSize: "0.78rem", fontWeight: 800, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.6rem" }}>
                        Cross-Framework Regulatory Citations:
                      </div>
                      
                      <div style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
                        gap: "0.5rem"
                      }}>
                        <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "8px 10px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.68rem", color: "#3B82F6", fontWeight: 700 }}>NIST 800-53:</span>
                          <div style={{ fontSize: "0.8rem", color: "#FFFFFF", fontFamily: "var(--font-mono, monospace)", marginTop: "2px" }}>{control.mappings.nist80053}</div>
                        </div>

                        <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "8px 10px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.68rem", color: "#10B981", fontWeight: 700 }}>ISO 27001:2022:</span>
                          <div style={{ fontSize: "0.8rem", color: "#FFFFFF", fontFamily: "var(--font-mono, monospace)", marginTop: "2px" }}>{control.mappings.iso27001}</div>
                        </div>

                        <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "8px 10px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.68rem", color: "#00E5FF", fontWeight: 700 }}>SOC 2 Type II:</span>
                          <div style={{ fontSize: "0.8rem", color: "#FFFFFF", fontFamily: "var(--font-mono, monospace)", marginTop: "2px" }}>{control.mappings.soc2}</div>
                        </div>

                        <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "8px 10px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.68rem", color: "#A855F7", fontWeight: 700 }}>PCI-DSS v4:</span>
                          <div style={{ fontSize: "0.8rem", color: "#FFFFFF", fontFamily: "var(--font-mono, monospace)", marginTop: "2px" }}>{control.mappings.pciDss}</div>
                        </div>

                        <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "8px 10px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.68rem", color: "#F59E0B", fontWeight: 700 }}>HIPAA Security:</span>
                          <div style={{ fontSize: "0.8rem", color: "#FFFFFF", fontFamily: "var(--font-mono, monospace)", marginTop: "2px" }}>{control.mappings.hipaa}</div>
                        </div>

                        <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "8px 10px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.68rem", color: "#F43F5E", fontWeight: 700 }}>SOX ITGC (404):</span>
                          <div style={{ fontSize: "0.8rem", color: "#FFFFFF", fontFamily: "var(--font-mono, monospace)", marginTop: "2px" }}>{control.mappings.soxItgc}</div>
                        </div>

                        <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "8px 10px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.68rem", color: "#6366F1", fontWeight: 700 }}>GDPR Art 25/32:</span>
                          <div style={{ fontSize: "0.8rem", color: "#FFFFFF", fontFamily: "var(--font-mono, monospace)", marginTop: "2px" }}>{control.mappings.gdpr}</div>
                        </div>

                        <div style={{ background: "rgba(255, 255, 255, 0.03)", border: "1px solid rgba(255, 255, 255, 0.08)", padding: "8px 10px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.68rem", color: "#FB923C", fontWeight: 700 }}>CMMC 2.0 / 800-171:</span>
                          <div style={{ fontSize: "0.8rem", color: "#FFFFFF", fontFamily: "var(--font-mono, monospace)", marginTop: "2px" }}>{control.mappings.cmmc}</div>
                        </div>
                      </div>
                    </div>

                    {/* Evidence Checklist & Verification CLI */}
                    <div style={{
                      display: "grid",
                      gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                      gap: "1rem"
                    }}>
                      {/* Evidence Artifacts */}
                      <div style={{
                        background: "rgba(0, 0, 0, 0.3)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "12px",
                        padding: "1.1rem"
                      }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "0.75rem" }}>
                          <FileText size={16} color="#10B981" />
                          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                            What To Hand The Auditor (Evidence Artifacts)
                          </span>
                        </div>

                        <ul style={{ margin: 0, paddingLeft: "1.25rem", color: "#CBD5E1", fontSize: "0.82rem", lineHeight: 1.6 }}>
                          {control.evidenceArtifacts.map((ev, idx) => (
                            <li key={idx} style={{ marginBottom: "6px" }}>{ev}</li>
                          ))}
                        </ul>
                      </div>

                      {/* Live CLI Verification Command */}
                      <div style={{
                        background: "rgba(0, 0, 0, 0.5)",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "12px",
                        padding: "1.1rem",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between"
                      }}>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              <Terminal size={16} color="#00E5FF" />
                              <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                                Verification CLI Command
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => copyToClipboard(control.sampleCliVerification, control.id)}
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px",
                                background: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.15)",
                                borderRadius: "6px",
                                padding: "4px 8px",
                                color: copiedCliId === control.id ? "#34D399" : "#CBD5E1",
                                fontSize: "0.72rem",
                                cursor: "pointer"
                              }}
                            >
                              {copiedCliId === control.id ? <Check size={12} /> : <Copy size={12} />}
                              {copiedCliId === control.id ? "Copied" : "Copy"}
                            </button>
                          </div>

                          <pre style={{
                            margin: 0,
                            background: "#030712",
                            padding: "0.75rem",
                            borderRadius: "8px",
                            fontFamily: "var(--font-mono, monospace)",
                            fontSize: "0.76rem",
                            color: "#00E5FF",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all",
                            border: "1px solid rgba(0, 229, 255, 0.2)"
                          }}>
                            {control.sampleCliVerification}
                          </pre>
                        </div>

                        <div style={{ marginTop: "0.75rem", fontSize: "0.72rem", color: "#64748B" }}>
                          Remediation SLA for audit findings: <strong style={{ color: "#F59E0B" }}>≤ {control.remediationSlaDays} days</strong>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Technical Implementation Blueprints */}
                    <div style={{
                      background: "rgba(255, 255, 255, 0.02)",
                      border: "1px solid rgba(255, 255, 255, 0.06)",
                      borderRadius: "12px",
                      padding: "1.1rem"
                    }}>
                      <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#FFFFFF", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "0.75rem" }}>
                        Technical Implementation Blueprint
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "0.75rem" }}>
                        <div style={{ background: "rgba(0, 0, 0, 0.2)", padding: "8px 12px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.7rem", color: "#3B82F6", fontWeight: 700 }}>Cloud (AWS/GCP/Azure):</span>
                          <div style={{ fontSize: "0.78rem", color: "#CBD5E1", marginTop: "2px", lineHeight: 1.4 }}>{control.implementationGuide.cloudAwsGcpAzure}</div>
                        </div>

                        <div style={{ background: "rgba(0, 0, 0, 0.2)", padding: "8px 12px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.7rem", color: "#10B981", fontWeight: 700 }}>Git &amp; CI/CD:</span>
                          <div style={{ fontSize: "0.78rem", color: "#CBD5E1", marginTop: "2px", lineHeight: 1.4 }}>{control.implementationGuide.gitAndCiCd}</div>
                        </div>

                        <div style={{ background: "rgba(0, 0, 0, 0.2)", padding: "8px 12px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.7rem", color: "#A855F7", fontWeight: 700 }}>OS &amp; Containers:</span>
                          <div style={{ fontSize: "0.78rem", color: "#CBD5E1", marginTop: "2px", lineHeight: 1.4 }}>{control.implementationGuide.osAndContainers}</div>
                        </div>

                        <div style={{ background: "rgba(0, 0, 0, 0.2)", padding: "8px 12px", borderRadius: "8px" }}>
                          <span style={{ fontSize: "0.7rem", color: "#F59E0B", fontWeight: 700 }}>Workstation / PureIDE:</span>
                          <div style={{ fontSize: "0.78rem", color: "#CBD5E1", marginTop: "2px", lineHeight: 1.4 }}>{control.implementationGuide.endpointWorkstation}</div>
                        </div>
                      </div>
                    </div>

                    {/* Internal Notes / Ticket Link Textarea */}
                    <div>
                      <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: "4px" }}>
                        Internal Evidence Link / Jira Ticket / Remediation Notes:
                      </div>
                      <input
                        type="text"
                        placeholder="e.g. Verified by Alice via AWS IAM export on 2026-10-15; Jira ticket SEC-1049"
                        value={note}
                        onChange={e => updateNotes(control.id, e.target.value)}
                        style={{
                          width: "100%",
                          background: "rgba(255, 255, 255, 0.04)",
                          border: "1px solid rgba(255, 255, 255, 0.1)",
                          borderRadius: "8px",
                          padding: "8px 12px",
                          color: "#E2E8F0",
                          fontSize: "0.82rem",
                          outline: "none"
                        }}
                      />
                    </div>

                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* 5. DOSSIER EXPORT MODAL */}
      {showExportModal && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: "rgba(3, 7, 18, 0.88)",
          backdropFilter: "blur(12px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem"
        }}>
          <div style={{
            background: "#0B1120",
            border: "1px solid rgba(59, 130, 246, 0.4)",
            borderRadius: "20px",
            width: "100%",
            maxWidth: "850px",
            maxHeight: "90vh",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.9)"
          }}>
            <div style={{
              padding: "1.25rem 1.5rem",
              borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between"
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>
                  Export Executive Auditor Dossier
                </h3>
                <p style={{ margin: "2px 0 0 0", fontSize: "0.78rem", color: "#94A3B8" }}>
                  Markdown format ready for GitHub, Notion, audit binders, or executive briefings.
                </p>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  type="button"
                  onClick={() => copyToClipboard(exportContent, "export_modal")}
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    background: "rgba(59, 130, 246, 0.2)",
                    border: "1px solid #3B82F6",
                    color: "#93C5FD",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    fontWeight: 700,
                    cursor: "pointer"
                  }}
                >
                  <Copy size={13} />
                  {copiedCliId === "export_modal" ? "Copied!" : "Copy Markdown"}
                </button>

                <button
                  type="button"
                  onClick={() => setShowExportModal(false)}
                  style={{
                    background: "rgba(255, 255, 255, 0.08)",
                    border: "1px solid rgba(255, 255, 255, 0.15)",
                    color: "#FFFFFF",
                    padding: "6px 12px",
                    borderRadius: "8px",
                    fontSize: "0.78rem",
                    cursor: "pointer"
                  }}
                >
                  Close
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "1.25rem 1.5rem" }}>
              <pre style={{
                margin: 0,
                fontFamily: "var(--font-mono, monospace)",
                fontSize: "0.78rem",
                color: "#CBD5E1",
                whiteSpace: "pre-wrap",
                wordBreak: "break-word",
                background: "rgba(0, 0, 0, 0.4)",
                padding: "1rem",
                borderRadius: "10px",
                border: "1px solid rgba(255, 255, 255, 0.06)"
              }}>
                {exportContent}
              </pre>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
