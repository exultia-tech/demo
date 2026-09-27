"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { 
  FileText, 
  Scale, 
  Lock, 
  Unlock, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Download, 
  Sparkles, 
  Send, 
  BookOpen, 
  ExternalLink,
  Layers,
  AlertCircle
} from "lucide-react";
import { InquestIcon } from "@/components/BrandIcons";
import { PlanGate } from "@/components/auth/PlanGate";

export default function InquestCustomerTools() {
  const { getUserTier } = useAuth();
  const tier = getUserTier("inquest");

  // Appeal Builder State
  const [agency, setAgency] = useState("Department of Justice (DOJ)");
  const [trackingNumber, setTrackingNumber] = useState("FOIA-2026-009412");
  const [requestSubject, setRequestSubject] = useState("Records concerning algorithmic security compliance audits and procurement contracts");
  const [selectedExemptions, setSelectedExemptions] = useState<string[]>(["Exemption 4", "Exemption 7(A)"]);
  const [isGeneratingBrief, setIsGeneratingBrief] = useState(false);
  const [generatedBrief, setGeneratedBrief] = useState<string | null>(null);
  const [copiedBrief, setCopiedBrief] = useState(false);

  // 20-Day Statutory Tracker State
  const [filingDate, setFilingDate] = useState(new Date().toISOString().split("T")[0]);

  const toggleExemption = (code: string) => {
    if (selectedExemptions.includes(code)) {
      setSelectedExemptions(selectedExemptions.filter(c => c !== code));
    } else {
      setSelectedExemptions([...selectedExemptions, code]);
    }
  };

  const handleGenerateBrief = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGeneratingBrief(true);
    setGeneratedBrief(null);

    try {
      const res = await fetch("/api/user/tools/appeal-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agency,
          trackingNumber,
          requestSubject,
          exemptionCodes: selectedExemptions.length > 0 ? selectedExemptions : ["Exemption 4"],
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to generate appeal brief");
      setGeneratedBrief(data.brief.markdown);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to compile appeal brief");
    } finally {
      setIsGeneratingBrief(false);
    }
  };

  // Calculate 20 business days statutory deadline
  const calculateDeadline = (startStr: string) => {
    const start = new Date(startStr);
    let count = 0;
    const cur = new Date(start);
    while (count < 20) {
      cur.setDate(cur.getDate() + 1);
      const day = cur.getDay();
      if (day !== 0 && day !== 6) count++;
    }
    return cur.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <InquestIcon size={30} />
            <h2 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#FFFFFF", margin: 0 }}>
              Inquest Public Records & Legal Tools
            </h2>
            <span style={{
              fontSize: "0.7rem",
              background: tier !== "free" ? "rgba(6, 182, 212, 0.25)" : "rgba(255, 255, 255, 0.08)",
              color: tier !== "free" ? "#67E8F9" : "#94A3B8",
              border: tier !== "free" ? "1px solid rgba(6, 182, 212, 0.5)" : "1px solid rgba(255, 255, 255, 0.12)",
              padding: "2px 8px",
              borderRadius: "6px",
              fontWeight: 800,
              textTransform: "uppercase"
            }}>
              {tier} Tier
            </span>
          </div>
          <p style={{ color: "#94A3B8", fontSize: "0.88rem", margin: 0 }}>
            Autonomous administrative appeal generator, statutory 9-exemption de-redaction scanner, and 20-day response tracker.
          </p>
        </div>

        <Link
          href="/inquest"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "linear-gradient(135deg, #06B6D4, #0284C7)",
            color: "#041019",
            padding: "8px 16px",
            borderRadius: "10px",
            fontSize: "0.85rem",
            fontWeight: 800,
            textDecoration: "none"
          }}
        >
          Open Inquest App <ExternalLink size={14} />
        </Link>
      </div>

      {/* TOOL 1: 9-EXEMPTION STATUTORY APPEAL BRIEF BUILDER (LEGAL PRO / ENTERPRISE) */}
      <PlanGate
        product="inquest"
        requiredTier="legal"
        featureTitle="Autonomous 9-Exemption Statutory Appeal Generator"
        featureDescription="Deconstruct arbitrary agency withholdings and generate formal administrative appeal briefs citing controlling D.C. Circuit and Supreme Court FOIA precedents."
      >
        <div style={{
          background: "rgba(15, 23, 42, 0.7)",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          borderRadius: "18px",
          padding: "1.75rem"
        }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.4rem 0", display: "flex", alignItems: "center", gap: "8px" }}>
            <Scale size={18} color="#67E8F9" />
            Administrative Appeal Brief Generator (5 U.S.C. § 552(a)(6)(A))
          </h3>
          <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: "0 0 1.25rem 0" }}>
            Select the agency denial codes to generate an individualized brief with statutory burden-of-proof arguments.
          </p>

          <form onSubmit={handleGenerateBrief} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 700, marginBottom: "0.4rem" }}>
                  Target Federal Agency:
                </label>
                <select
                  value={agency}
                  onChange={e => setAgency(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    background: "#0F172A",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                >
                  <option value="Department of Justice (DOJ)">Department of Justice (DOJ)</option>
                  <option value="Federal Bureau of Investigation (FBI)">Federal Bureau of Investigation (FBI)</option>
                  <option value="Department of Homeland Security (DHS)">Department of Homeland Security (DHS)</option>
                  <option value="Department of Defense (DOD)">Department of Defense (DOD)</option>
                  <option value="Securities and Exchange Commission (SEC)">Securities and Exchange Commission (SEC)</option>
                  <option value="Department of Energy (DOE)">Department of Energy (DOE)</option>
                  <option value="Environmental Protection Agency (EPA)">Environmental Protection Agency (EPA)</option>
                  <option value="Department of State (DOS)">Department of State (DOS)</option>
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 700, marginBottom: "0.4rem" }}>
                  Agency Tracking / Case Number:
                </label>
                <input 
                  type="text"
                  value={trackingNumber}
                  onChange={e => setTrackingNumber(e.target.value)}
                  placeholder="e.g. FOIA-2026-009412"
                  style={{
                    width: "100%",
                    padding: "0.65rem 0.85rem",
                    background: "rgba(255, 255, 255, 0.04)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "8px",
                    color: "white",
                    fontSize: "0.85rem",
                    outline: "none"
                  }}
                />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 700, marginBottom: "0.4rem" }}>
                Original Request Subject Matter:
              </label>
              <input 
                type="text"
                value={requestSubject}
                onChange={e => setRequestSubject(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.65rem 0.85rem",
                  background: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.12)",
                  borderRadius: "8px",
                  color: "white",
                  fontSize: "0.85rem",
                  outline: "none"
                }}
              />
            </div>

            {/* Exemption Checkbox Selector */}
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 700, marginBottom: "0.5rem" }}>
                Challenged Exemption Withholdings:
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                {[
                  { code: "Exemption 4", desc: "Commercial & Trade Secrets (Argus Leader)" },
                  { code: "Exemption 5", desc: "Deliberative Process Privilege (Factual Segregability)" },
                  { code: "Exemption 6", desc: "Personal Privacy (Public Interest Balance)" },
                  { code: "Exemption 7(A)", desc: "Ongoing Law Enforcement Interference (Robbins Tire)" },
                  { code: "Exemption 7(C)", desc: "Law Enforcement Privacy (Official Misconduct)" },
                  { code: "Exemption 7(D)", desc: "Confidential Source Presumption (Landano)" },
                  { code: "Exemption 7(E)", desc: "Investigative Techniques (Known Methods)" },
                  { code: "Glomar Defense", desc: "Neither Confirm Nor Deny Refusal (Wolf v. CIA)" },
                ].map(({ code, desc }) => (
                  <label key={code} style={{ display: "flex", alignItems: "center", gap: "8px", background: "rgba(255, 255, 255, 0.03)", padding: "7px 10px", borderRadius: "8px", cursor: "pointer", fontSize: "0.8rem", color: "#E2E8F0" }}>
                    <input 
                      type="checkbox"
                      checked={selectedExemptions.includes(code)}
                      onChange={() => toggleExemption(code)}
                    />
                    <span style={{ fontWeight: 700, color: "#67E8F9" }}>{code}</span>
                    <span style={{ color: "#94A3B8", fontSize: "0.72rem" }}>({desc})</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.5rem" }}>
              <button
                type="submit"
                disabled={isGeneratingBrief}
                className="btn-primary"
                style={{
                  padding: "8px 20px",
                  fontSize: "0.85rem",
                  fontWeight: 800,
                  background: "linear-gradient(135deg, #06B6D4 0%, #0284C7 100%)",
                  color: "#041019",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <Sparkles size={14} />
                {isGeneratingBrief ? "Compiling Precedent Brief..." : "Compile Statutory Appeal Brief"}
              </button>
            </div>
          </form>

          {/* Generated Brief Display */}
          {generatedBrief && (
            <div style={{ marginTop: "1.5rem", background: "rgba(0, 0, 0, 0.7)", border: "1px solid rgba(6, 182, 212, 0.35)", borderRadius: "12px", padding: "1.25rem", position: "relative" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#67E8F9" }}>
                  Compiled Administrative Appeal Brief (Ready for Filing)
                </span>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedBrief);
                    setCopiedBrief(true);
                    setTimeout(() => setCopiedBrief(false), 2000);
                  }}
                  style={{
                    background: copiedBrief ? "#16A34A" : "rgba(255, 255, 255, 0.1)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "6px",
                    color: "white",
                    padding: "4px 10px",
                    fontSize: "0.75rem",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <Copy size={12} />
                  {copiedBrief ? "Copied!" : "Copy Brief"}
                </button>
              </div>
              <pre style={{ color: "#E2E8F0", fontFamily: "monospace", fontSize: "0.78rem", maxHeight: "280px", overflowY: "auto", margin: 0, whiteSpace: "pre-wrap" }}>
                {generatedBrief}
              </pre>
            </div>
          )}
        </div>
      </PlanGate>

      {/* TOOL 2: STATUTORY 20-DAY COUNTDOWN TRACKER */}
      <div style={{
        background: "rgba(15, 23, 42, 0.7)",
        border: "1px solid rgba(255, 255, 255, 0.1)",
        borderRadius: "18px",
        padding: "1.75rem"
      }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 0.4rem 0", display: "flex", alignItems: "center", gap: "8px" }}>
          <Clock size={18} color="#F59E0B" />
          Statutory 20 Business-Day Response Deadline Calculator
        </h3>
        <p style={{ color: "#94A3B8", fontSize: "0.82rem", margin: "0 0 1.25rem 0" }}>
          Under 5 U.S.C. § 552(a)(6)(A)(i), agencies are legally required to render an initial determination within 20 business days of request receipt.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", alignItems: "center" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", color: "#CBD5E1", fontWeight: 700, marginBottom: "0.4rem" }}>
              Official Date Request Received by Agency:
            </label>
            <input 
              type="date"
              value={filingDate}
              onChange={e => setFilingDate(e.target.value)}
              style={{
                width: "100%",
                padding: "0.65rem 0.85rem",
                background: "rgba(255, 255, 255, 0.04)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "8px",
                color: "white",
                fontSize: "0.85rem",
                outline: "none"
              }}
            />
          </div>

          <div style={{ background: "rgba(245, 158, 11, 0.1)", border: "1px solid rgba(245, 158, 11, 0.3)", borderRadius: "10px", padding: "1rem" }}>
            <div style={{ fontSize: "0.78rem", color: "#FCD34D", fontWeight: 700, textTransform: "uppercase" }}>
              Mandatory Statutory Deadline:
            </div>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF", marginTop: "2px" }}>
              {calculateDeadline(filingDate)}
            </div>
            <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: "2px" }}>
              Constructive exhaustion occurs if agency fails to respond by this date.
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
