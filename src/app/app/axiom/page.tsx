"use client";

import React, { useState } from "react";
import { AxiomIcon } from "@/components/BrandIcons";

const SYLLABUS_DATA = {
  "isc2-cc": {
    title: "ISC2 Certified in Cybersecurity (CC)",
    description: "The foundational entry-level certification from ISC2. Proves you have the foundational knowledge, skills, and abilities to take on entry- and junior-level cybersecurity roles.",
    domains: [
      { id: "cc-1", title: "Domain 1: Security Principles", weight: "26%", topics: ["Understand the security concepts of information assurance", "Understand the risk management process", "Understand security controls", "Understand (ISC)2 Code of Ethics", "Understand governance processes"] },
      { id: "cc-2", title: "Domain 2: Business Continuity (BC), Disaster Recovery (DR) & Incident Response Concepts", weight: "10%", topics: ["Understand business continuity (BC)", "Understand disaster recovery (DR)", "Understand incident response"] },
      { id: "cc-3", title: "Domain 3: Access Controls Concepts", weight: "22%", topics: ["Understand physical access controls", "Understand logical access controls"] },
      { id: "cc-4", title: "Domain 4: Network Security", weight: "24%", topics: ["Understand computer networking", "Understand network threats and attacks", "Understand network security infrastructure"] },
      { id: "cc-5", title: "Domain 5: Security Operations", weight: "18%", topics: ["Understand data security", "Understand system hardening", "Understand best practice security policies", "Understand security awareness training"] }
    ],
    resources: [
      { type: "Official", name: "ISC2 Official Free CC Training", url: "#" },
      { type: "Video", name: "Mike Chapple's CC Study Guide", url: "#" },
      { type: "Flashcards", name: "Community Quizlet Deck", url: "#" }
    ]
  },
  "comptia-secplus": {
    title: "CompTIA Security+ (SY0-701)",
    description: "A global certification that validates the baseline skills necessary to perform core security functions and pursue an IT security career. The SY0-701 exam focuses on current trends.",
    domains: [
      { id: "sec-1", title: "Domain 1: General Security Concepts", weight: "12%", topics: ["Compare and contrast various types of security controls", "Summarize fundamental security concepts", "Explain the importance of change management processes", "Explain the use of cryptographic solutions"] },
      { id: "sec-2", title: "Domain 2: Threats, Vulnerabilities, and Mitigations", weight: "22%", topics: ["Compare and contrast common threat actors and motivations", "Explain common threat vectors and attack surfaces", "Explain various types of vulnerabilities", "Given a scenario, analyze indicators of malicious activity"] },
      { id: "sec-3", title: "Domain 3: Security Architecture", weight: "18%", topics: ["Compare and contrast security implications of different architecture models", "Given a scenario, apply security principles to secure enterprise infrastructure", "Compare and contrast concepts and strategies to protect data"] },
      { id: "sec-4", title: "Domain 4: Security Operations", weight: "28%", topics: ["Given a scenario, apply common security techniques to computing resources", "Explain the security implications of proper hardware, software, and data asset management", "Explain various activities associated with vulnerability management", "Explain security alerting and monitoring concepts and tools", "Given a scenario, modify enterprise capabilities to enhance security", "Given a scenario, implement and maintain identity and access management", "Explain the importance of automation and orchestration related to secure operations", "Explain appropriate incident response activities"] },
      { id: "sec-5", title: "Domain 5: Security Program Management and Oversight", weight: "20%", topics: ["Summarize elements of effective security governance", "Explain elements of the risk management process", "Explain the processes associated with third-party risk assessment and management", "Summarize elements of effective security compliance", "Explain types and purposes of audits and assessments", "Given a scenario, implement security awareness practices"] }
    ],
    resources: [
      { type: "Video", name: "Professor Messer's SY0-701 Free Course", url: "#" },
      { type: "Notes", name: "ExamCompass Practice Tests", url: "#" },
      { type: "Lab", name: "TryHackMe Pre-Security Path", url: "#" }
    ]
  }
};

export default function AxiomDashboard() {
  const [activeCert, setActiveCert] = useState<"isc2-cc" | "comptia-secplus">("isc2-cc");
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  const certData = SYLLABUS_DATA[activeCert];

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>
      {/* Header */}
      <header style={{ marginBottom: "3rem", borderBottom: "1px solid rgba(244, 63, 94, 0.2)", paddingBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <AxiomIcon size={48} glow={true} />
          <div>
            <h1 style={{ margin: 0, fontSize: "2.5rem", color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              Exultia <span style={{ color: "#F43F5E" }}>Axiom</span>
            </h1>
            <p style={{ margin: "0.25rem 0 0 0", color: "#94A3B8", fontSize: "1.1rem" }}>
              Open-Source Security Education & Certification Framework
            </p>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
        <button 
          onClick={() => setActiveCert("isc2-cc")}
          style={{ 
            padding: "1rem 1.5rem", 
            background: activeCert === "isc2-cc" ? "rgba(244, 63, 94, 0.15)" : "rgba(255,255,255,0.02)", 
            border: activeCert === "isc2-cc" ? "1px solid rgba(244, 63, 94, 0.5)" : "1px solid rgba(255,255,255,0.1)",
            color: activeCert === "isc2-cc" ? "#FFFFFF" : "#94A3B8",
            borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "1rem",
            transition: "all 0.2s ease"
          }}>
          ISC2 Certified in Cybersecurity
        </button>
        <button 
          onClick={() => setActiveCert("comptia-secplus")}
          style={{ 
            padding: "1rem 1.5rem", 
            background: activeCert === "comptia-secplus" ? "rgba(244, 63, 94, 0.15)" : "rgba(255,255,255,0.02)", 
            border: activeCert === "comptia-secplus" ? "1px solid rgba(244, 63, 94, 0.5)" : "1px solid rgba(255,255,255,0.1)",
            color: activeCert === "comptia-secplus" ? "#FFFFFF" : "#94A3B8",
            borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "1rem",
            transition: "all 0.2s ease"
          }}>
          CompTIA Security+ (SY0-701)
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "2rem" }}>
        {/* Main Syllabus Layout */}
        <div>
          <div style={{ background: "rgba(25, 5, 10, 0.4)", border: "1px solid rgba(244, 63, 94, 0.2)", borderRadius: "12px", padding: "2rem", marginBottom: "2rem" }}>
            <h2 style={{ margin: "0 0 1rem 0", color: "#FFFFFF", fontSize: "1.75rem" }}>{certData.title}</h2>
            <p style={{ color: "#94A3B8", lineHeight: 1.6, margin: "0 0 2rem 0", fontSize: "1.05rem" }}>{certData.description}</p>
            
            <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.5rem", marginBottom: "1.5rem", color: "#FDA4AF" }}>Official Exam Domains</h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {certData.domains.map(domain => {
                const isExpanded = expandedDomain === domain.id;
                return (
                  <div key={domain.id} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", background: "rgba(255,255,255,0.02)", overflow: "hidden" }}>
                    <button 
                      onClick={() => setExpandedDomain(isExpanded ? null : domain.id)}
                      style={{ width: "100%", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", color: "#E2E8F0", cursor: "pointer", textAlign: "left", fontSize: "1.05rem", fontWeight: 600 }}>
                      <span>{domain.title}</span>
                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{ fontSize: "0.85rem", color: "#F43F5E", background: "rgba(244, 63, 94, 0.1)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>Weight: {domain.weight}</span>
                        <span style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                      </div>
                    </button>
                    
                    {isExpanded && (
                      <div style={{ padding: "0 1.25rem 1.25rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                        <ul style={{ color: "#94A3B8", lineHeight: 1.6, paddingLeft: "1.5rem", margin: "1rem 0 0 0" }}>
                          {domain.topics.map((topic, idx) => (
                            <li key={idx} style={{ marginBottom: "0.5rem" }}>{topic}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Sidebar Resources */}
        <div>
          <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: "12px", padding: "1.5rem", position: "sticky", top: "2rem" }}>
            <h3 style={{ margin: "0 0 1.5rem 0", color: "#FFFFFF", display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#F43F5E" strokeWidth="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path></svg>
              Free Study Resources
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {certData.resources.map((res, idx) => (
                <a key={idx} href={res.url} style={{ display: "flex", flexDirection: "column", gap: "0.25rem", padding: "1rem", background: "rgba(255,255,255,0.03)", borderRadius: "8px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: "0.75rem", color: "#F43F5E", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{res.type}</span>
                  <span style={{ color: "#E2E8F0", fontWeight: 500, fontSize: "0.95rem" }}>{res.name}</span>
                </a>
              ))}
            </div>

            <div style={{ marginTop: "2rem", padding: "1rem", background: "rgba(52, 211, 153, 0.1)", border: "1px solid rgba(52, 211, 153, 0.3)", borderRadius: "8px" }}>
              <h4 style={{ margin: "0 0 0.5rem 0", color: "#34D399", fontSize: "0.9rem" }}>Community Maintained</h4>
              <p style={{ margin: 0, color: "#94A3B8", fontSize: "0.85rem", lineHeight: 1.5 }}>
                Axiom is an open-source syllabus. Have a great free resource? Open a pull request to add it to the curriculum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
