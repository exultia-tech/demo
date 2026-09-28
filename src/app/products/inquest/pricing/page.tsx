"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Check, 
  Sparkles, 
  ShieldCheck, 
  Scale, 
  Users, 
  Mail, 
  Clock, 
  FileText, 
  Layers, 
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Send,
  Zap,
  Lock,
  Building,
  CheckCircle2,
  X
} from "lucide-react";

import { useAuth } from "@/context/AuthContext";

export default function InquestPricingPage() {
  const { openPaymentModal } = useAuth();
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");

  const proMonthly = 119;
  const proAnnualMonthly = 99;
  const newsroomMonthly = 599;
  const newsroomAnnualMonthly = 499;

  const handleStartTrial = (plan: "pro" | "newsroom") => {
    openPaymentModal({
      product: "inquest",
      tier: plan === "pro" ? "pro" : "legal",
      price: plan === "pro" ? (billingCycle === "annual" ? proAnnualMonthly : proMonthly) : (billingCycle === "annual" ? newsroomAnnualMonthly : newsroomMonthly),
      billingCycle,
      planName: plan === "pro" ? "Inquest Investigator Pro" : "Inquest Newsroom & Legal (5 Seats)"
    });
  };

  return (
    <div className="fade-in" style={{ padding: "3rem 1.5rem 6rem 1.5rem", maxWidth: "1360px", margin: "0 auto" }}>
      
      {/* HEADER SECTION */}
      <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
        <h1 style={{ fontSize: "3.2rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: "-0.03em" }}>
          Transparent Tools, <span style={{ color: "#06B6D4" }}>Predictable Pricing</span>
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "1.15rem", maxWidth: "750px", margin: "0 auto 2.25rem auto", lineHeight: "1.6" }}>
          Free access for individual citizens, journalists, and researchers. Scaled multi-agency sweeps, automated follow-up reminders, and team collaboration for investigative newsrooms and legal teams.
        </p>

        {/* Billing Toggle */}
        <div style={{ display: "inline-flex", alignItems: "center", background: "rgba(15, 23, 42, 0.8)", padding: "0.4rem", borderRadius: "12px", border: "1px solid rgba(255, 255, 255, 0.1)" }}>
          <button 
            onClick={() => setBillingCycle("monthly")}
            style={{ 
              padding: "0.55rem 1.4rem", 
              borderRadius: "8px", 
              border: "none", 
              background: billingCycle === "monthly" ? "#06B6D4" : "transparent", 
              color: billingCycle === "monthly" ? "#041019" : "#94A3B8", 
              fontWeight: 700, 
              cursor: "pointer", 
              fontSize: "0.88rem",
              transition: "all 0.15s ease"
            }}>
            Monthly Billing
          </button>
          <button 
            onClick={() => setBillingCycle("annual")}
            style={{ 
              padding: "0.55rem 1.4rem", 
              borderRadius: "8px", 
              border: "none", 
              background: billingCycle === "annual" ? "#06B6D4" : "transparent", 
              color: billingCycle === "annual" ? "#041019" : "#94A3B8", 
              fontWeight: 700, 
              cursor: "pointer", 
              fontSize: "0.88rem", 
              display: "flex", 
              alignItems: "center", 
              gap: "0.45rem",
              transition: "all 0.15s ease"
            }}>
            <span>Annual Billing</span>
            <span style={{ 
              background: "#10B981", 
              color: "#022C22", 
              fontSize: "0.72rem", 
              padding: "0.15rem 0.5rem", 
              borderRadius: "9999px", 
              fontWeight: 800 
            }}>
              SAVE 20%
            </span>
          </button>
        </div>
      </div>

      {/* 3 PRICING CARDS */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", 
        gap: "2rem", 
        marginBottom: "5rem",
        alignItems: "stretch"
      }}>
        
        {/* TIER 1: CIVIC EDITION (FREE FOREVER) */}
        <div style={{
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "18px",
          padding: "2.25rem 2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.6)"
        }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "1.45rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>Civic Baseline</h3>
              <span style={{ 
                fontSize: "0.72rem", 
                color: "#34D399", 
                background: "rgba(52, 211, 153, 0.15)", 
                border: "1px solid rgba(52, 211, 153, 0.3)", 
                padding: "3px 10px", 
                borderRadius: "999px", 
                fontWeight: 700 
              }}>
                100% Free Forever
              </span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: "1.5", minHeight: "42px", margin: "0 0 1.5rem 0" }}>
              For citizens, grassroots watchdogs, freelance journalists, and students exercising open records rights.
            </p>

            {/* Price Block */}
            <div style={{ marginBottom: "1.75rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "3rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1 }}>$0</span>
                <span style={{ color: "#94A3B8", fontSize: "0.95rem" }}>/ forever</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#34D399", marginTop: "0.35rem", fontWeight: 600 }}>
                No credit card required · Zero ambient telemetry
              </div>
            </div>

            {/* Feature List */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#E2E8F0", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
                Included Civic Features:
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {[
                  "Federal 5 U.S.C. § 552 + all 50 state sunshine statutes",
                  "Initial request drafting assistant with statutory citations",
                  "Automatic fee waiver arguments (public interest & news media)",
                  "Mandatory statutory segregability clause injection",
                  "Bring-Your-Own Gemini API Key (100% private, 0 token fees)",
                  "Local browser storage (zero server-side case data collection)",
                  "Cryptographic SHA-256 fingerprint verification digest",
                  "1-Click Mailto generator & formatted PDF export",
                  "Standard Administrative Appeal brief template generator",
                  "Preloaded 50-state verified agency contact directory"
                ].map((item, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.86rem", color: "#CBD5E1", lineHeight: "1.4" }}>
                    <Check size={16} color="#34D399" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <Link 
            href="/app/inquest" 
            style={{
              display: "block",
              textAlign: "center",
              padding: "0.95rem 1.5rem",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.08)",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              color: "#FFFFFF",
              fontWeight: 700,
              fontSize: "0.95rem",
              textDecoration: "none",
              transition: "all 0.15s ease"
            }}>
            Launch Free Civic Workspace →
          </Link>
        </div>

        {/* TIER 2: INVESTIGATOR PRO (MOST POPULAR) */}
        <div style={{
          background: "linear-gradient(180deg, rgba(6, 182, 212, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)",
          backdropFilter: "blur(20px)",
          border: "2px solid #06B6D4",
          borderRadius: "18px",
          padding: "2.25rem 2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.25), 0 0 35px rgba(6, 182, 212, 0.15)",
          position: "relative",
          transform: "translateY(-6px)"
        }}>
          {/* Most Popular Badge */}
          <div style={{
            position: "absolute",
            top: "-13px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
            color: "#041019",
            fontWeight: 800,
            fontSize: "0.74rem",
            padding: "3px 14px",
            borderRadius: "999px",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            boxShadow: "0 4px 12px rgba(6, 182, 212, 0.4)"
          }}>
            Most Popular
          </div>

          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "1.45rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>Investigator Pro</h3>
              <span style={{ 
                fontSize: "0.72rem", 
                color: "#67E8F9", 
                background: "rgba(6, 182, 212, 0.2)", 
                border: "1px solid rgba(6, 182, 212, 0.4)", 
                padding: "3px 10px", 
                borderRadius: "999px", 
                fontWeight: 700 
              }}>
                Single Investigator
              </span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: "1.5", minHeight: "42px", margin: "0 0 1.5rem 0" }}>
              For beat journalists, investigative researchers, and policy analysts running recurring, multi-agency inquiries.
            </p>

            {/* Price Block */}
            <div style={{ marginBottom: "1.75rem", borderBottom: "1px solid rgba(255, 255, 255, 0.1)", paddingBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "3rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1 }}>
                  ${billingCycle === "annual" ? proAnnualMonthly : proMonthly}
                </span>
                <span style={{ color: "#94A3B8", fontSize: "0.95rem" }}>/ month</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#67E8F9", marginTop: "0.35rem", fontWeight: 600 }}>
                {billingCycle === "annual" ? "Billed annually ($1,188/yr) · 14-day free trial" : "Billed monthly · Cancel anytime"}
              </div>
            </div>

            {/* Feature List */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#67E8F9", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
                Everything in Civic, plus:
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {[
                  "Multi-Agency Campaign Blasts: File 50 states simultaneously",
                  "Automated Statutory Escalation Bot (constructive delay notices)",
                  "Inbound Email Relay (@inquest.exultia.tech) with auto-PDF parsing",
                  "Automated fee quote detection and tracking number extraction",
                  "Encrypted cloud docket sync across laptop, tablet, & phone",
                  "Google / Outlook statutory deadline calendar (.ics sync)",
                  "Advanced Exemption Deconstruction with tailored counter-arguments",
                  "50 simultaneously tracked active case files",
                  "CSV, JSON, and certified court-ready PDF dossier batch exports",
                  "Priority email support with 12-hour response SLA"
                ].map((item, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.86rem", color: "#F1F5F9", lineHeight: "1.4" }}>
                    <Check size={16} color="#06B6D4" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontWeight: idx < 4 ? 600 : 400 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button 
            onClick={() => handleStartTrial("pro")}
            className="btn-primary"
            style={{
              width: "100%",
              padding: "0.95rem 1.5rem",
              borderRadius: "10px",
              background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)",
              color: "#041019",
              fontWeight: 800,
              fontSize: "0.95rem",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 0 20px rgba(6, 182, 212, 0.4)"
            }}>
            Start 14-Day Pro Trial →
          </button>
        </div>

        {/* TIER 3: NEWSROOM & LEGAL COUNSEL */}
        <div style={{
          background: "rgba(15, 23, 42, 0.65)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: "18px",
          padding: "2.25rem 2rem",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.6)"
        }}>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <h3 style={{ fontSize: "1.45rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>Newsroom & Legal</h3>
              <span style={{ 
                fontSize: "0.72rem", 
                color: "#A78BFA", 
                background: "rgba(167, 139, 250, 0.15)", 
                border: "1px solid rgba(167, 139, 250, 0.3)", 
                padding: "3px 10px", 
                borderRadius: "999px", 
                fontWeight: 700 
              }}>
                5 Licenses Included
              </span>
            </div>
            <p style={{ color: "#94A3B8", fontSize: "0.88rem", lineHeight: "1.5", minHeight: "42px", margin: "0 0 1.5rem 0" }}>
              For investigative newsrooms, litigation boutiques, civil rights organizations, and government relations firms.
            </p>

            {/* Price Block */}
            <div style={{ marginBottom: "1.75rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", paddingBottom: "1.5rem" }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }}>
                <span style={{ fontSize: "3rem", fontWeight: 900, color: "#FFFFFF", lineHeight: 1 }}>
                  ${billingCycle === "annual" ? newsroomAnnualMonthly : newsroomMonthly}
                </span>
                <span style={{ color: "#94A3B8", fontSize: "0.95rem" }}>/ month</span>
              </div>
              <div style={{ fontSize: "0.8rem", color: "#A78BFA", marginTop: "0.35rem", fontWeight: 600 }}>
                {billingCycle === "annual" ? "Billed annually ($5,988/yr) · 5 team licenses" : "Billed monthly · 5 team licenses"}
              </div>
            </div>

            {/* Feature List */}
            <div style={{ marginBottom: "2rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#A78BFA", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "1rem" }}>
                Everything in Pro, plus:
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                {[
                  "Collaborative Newsroom & Legal Docket with 5 licenses included",
                  "Cross-Bureau Request Deduplication Shield (avoids overlap)",
                  "Role-based access: Reporters, Senior Editors, General Counsel",
                  "Judicial Precedent Engine: Weaves state appellate case law into briefs",
                  "Court-Ready Certified Evidence Dossiers (Article 78 / CPRA writs)",
                  "RFC 3161 cryptographic timestamp chain & transmission receipts",
                  "Private institutional agency notes (custodian history & tips)",
                  "REST API & Webhooks for CMS or legal case management sync",
                  "Unlimited simultaneously active cases",
                  "Dedicated Account Manager & statutory compliance briefing"
                ].map((item, idx) => (
                  <li key={idx} style={{ display: "flex", alignItems: "flex-start", gap: "10px", fontSize: "0.86rem", color: "#CBD5E1", lineHeight: "1.4" }}>
                    <Check size={16} color="#A78BFA" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <span style={{ fontWeight: idx < 4 ? 600 : 400 }}>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <button 
            onClick={() => handleStartTrial("newsroom")}
            style={{
              width: "100%",
              padding: "0.95rem 1.5rem",
              borderRadius: "10px",
              background: "rgba(167, 139, 250, 0.15)",
              border: "1px solid rgba(167, 139, 250, 0.4)",
              color: "#E2E8F0",
              fontWeight: 700,
              fontSize: "0.95rem",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}>
            Deploy Newsroom Suite →
          </button>
        </div>

      </div>

      {/* HIGH-VALUE ADD-ON SERVICES */}
      <section style={{ marginBottom: "5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            High-Value Operational Add-Ons
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem", maxWidth: "600px", margin: "0 auto" }}>
            Optional pay-as-you-go infrastructure for physical fulfillment, heavy redaction audits, and automated portal submissions.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.5rem" }}>
          
          <div style={{
            background: "rgba(10, 15, 26, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(6, 182, 212, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#06B6D4" }}>
                  <Send size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>USPS Certified Mail Dispatch</h4>
                  <span style={{ fontSize: "0.8rem", color: "#06B6D4", fontWeight: 700 }}>$9.95 / filing</span>
                </div>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: "1.5", margin: 0 }}>
                Automatic printing, barcoding, and certified mail delivery with USPS Return Receipt tracking for recalcitrant agencies ignoring electronic transmissions.
              </p>
            </div>
            <div style={{ marginTop: "1.25rem", fontSize: "0.75rem", color: "#64748B" }}>
              Includes electronic green card tracking & court-stamped proof of service.
            </div>
          </div>

          <div style={{
            background: "rgba(10, 15, 26, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(59, 130, 246, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#60A5FA" }}>
                  <FileText size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>Deep Redaction Audit Engine</h4>
                  <span style={{ fontSize: "0.8rem", color: "#60A5FA", fontWeight: 700 }}>$0.05 / page</span>
                </div>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: "1.5", margin: 0 }}>
                High-throughput automated PDF scanning to uncover unlawful black-box over-redaction, stripped OCR layers, and missed segregable factual paragraphs.
              </p>
            </div>
            <div style={{ marginTop: "1.25rem", fontSize: "0.75rem", color: "#64748B" }}>
              Generates itemized Vaughn Index challenges for administrative appeal briefs.
            </div>
          </div>

          <div style={{
            background: "rgba(10, 15, 26, 0.7)",
            border: "1px solid rgba(255, 255, 255, 0.08)",
            borderRadius: "14px",
            padding: "1.75rem",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between"
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "0.75rem" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "8px", background: "rgba(16, 185, 129, 0.15)", display: "flex", alignItems: "center", justifyContent: "center", color: "#34D399" }}>
                  <Zap size={18} />
                </div>
                <div>
                  <h4 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700 }}>Robotic Portal Submission</h4>
                  <span style={{ fontSize: "0.8rem", color: "#34D399", fontWeight: 700 }}>$2.50 / submission</span>
                </div>
              </div>
              <p style={{ fontSize: "0.85rem", color: "#94A3B8", lineHeight: "1.5", margin: 0 }}>
                Automated submission bot through proprietary municipal portals (NextRequest, GovQA, FOIA.gov) bypassing repetitive manual form entry.
              </p>
            </div>
            <div style={{ marginTop: "1.25rem", fontSize: "0.75rem", color: "#64748B" }}>
              Extracts agency reference ID and portal status immediately back into Inquest.
            </div>
          </div>

        </div>
      </section>

      {/* COMPREHENSIVE FEATURE MATRIX */}
      <section style={{ marginBottom: "5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Compare Inquest Capabilities
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Detailed breakdown of core features across all three tiers.
          </p>
        </div>

        <div style={{
          overflowX: "auto",
          background: "rgba(10, 15, 26, 0.7)",
          border: "1px solid rgba(255, 255, 255, 0.08)",
          borderRadius: "16px",
          boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.7)"
        }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.12)", background: "rgba(15, 23, 42, 0.9)" }}>
                <th style={{ padding: "1.25rem 1.5rem", fontWeight: 700, color: "#FFFFFF", width: "40%" }}>Capability</th>
                <th style={{ padding: "1.25rem 1rem", fontWeight: 700, color: "#34D399", textAlign: "center", width: "20%" }}>Civic (Free)</th>
                <th style={{ padding: "1.25rem 1rem", fontWeight: 700, color: "#67E8F9", textAlign: "center", width: "20%" }}>Investigator Pro</th>
                <th style={{ padding: "1.25rem 1rem", fontWeight: 700, color: "#A78BFA", textAlign: "center", width: "20%" }}>Newsroom & Legal</th>
              </tr>
            </thead>
            <tbody>
              {/* CATEGORY: CORE STATUTORY ENGINE */}
              <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                <td colSpan={4} style={{ padding: "0.75rem 1.5rem", fontWeight: 700, fontSize: "0.78rem", color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Core Statutory & Sunshine Engine
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>50 State Sunshine Laws + Federal FOIA</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#34D399" }}>✓ All 51 Jurisdictions</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#67E8F9" }}>✓ All 51 Jurisdictions</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>✓ All 51 Jurisdictions</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Preemptive Segregability Mandate Injection</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#34D399" }}>✓ Included</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#67E8F9" }}>✓ Included</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>✓ Included</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Fee Waiver Arguments (Public Interest)</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#34D399" }}>✓ Standard</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#67E8F9" }}>✓ Tailored by Agency</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>✓ Custom Newsroom Policy</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Bring-Your-Own Gemini API Key (BYOK)</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#34D399" }}>✓ Supported</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#67E8F9" }}>✓ + Cloud AI Included</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>✓ Dedicated High-Rate AI</td>
              </tr>

              {/* CATEGORY: AUTOMATION & TRACKING */}
              <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                <td colSpan={4} style={{ padding: "0.75rem 1.5rem", fontWeight: 700, fontSize: "0.78rem", color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Automation, Ingestion & Deadline Tracking
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Simultaneously Tracked Active Cases</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#94A3B8" }}>10 cases</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#67E8F9" }}>50 cases</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>Unlimited</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Multi-Agency Campaign Blasts (50-State Sweep)</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#64748B" }}>—</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#67E8F9" }}>✓ Up to 50 agencies</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>✓ Unlimited batching</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Automated Statutory Escalation Bot</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#64748B" }}>—</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#67E8F9" }}>✓ Auto-Nudge Letters</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>✓ Customizable Cadence</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Inbound Email Reply Relay (@inquest.exultia.tech)</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#64748B" }}>—</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#67E8F9" }}>✓ 1 Inbound Relay</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>✓ Dedicated Domain Relay</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Calendar Reminders & Sync (.ics)</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#94A3B8" }}>Manual export</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#67E8F9" }}>✓ Automated Google/Outlook</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>✓ Centralized Team Docket</td>
              </tr>

              {/* CATEGORY: LEGAL & LITIGATION READINESS */}
              <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                <td colSpan={4} style={{ padding: "0.75rem 1.5rem", fontWeight: 700, fontSize: "0.78rem", color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Legal Precedents & Litigation Readiness
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Administrative Appeal Generator</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#34D399" }}>✓ Standard Template</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#67E8F9" }}>✓ Exemption Rebuttals</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>✓ Full Appellate Petitions</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Judicial Precedent Citation Engine</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#64748B" }}>—</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#94A3B8" }}>Basic Exemption Cases</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>✓ State & Federal Precedents</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Cryptographic SHA-256 Digest Certification</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#34D399" }}>✓ Local Hash</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#67E8F9" }}>✓ Cloud-Verified</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>✓ RFC 3161 Court Timestamp</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Court-Ready Evidence Dossier Export</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#64748B" }}>—</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#94A3B8" }}>Single-case PDF</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>✓ Court-Admissible Bundle</td>
              </tr>

              {/* CATEGORY: TEAM & COLLABORATION */}
              <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                <td colSpan={4} style={{ padding: "0.75rem 1.5rem", fontWeight: 700, fontSize: "0.78rem", color: "#60A5FA", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  Newsroom Collaboration & Enterprise Security
                </td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Team Licenses Included</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#94A3B8" }}>1 License</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#94A3B8" }}>1 License</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>5 Licenses included</td>
              </tr>
              <tr style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Cross-Bureau Deduplication Shield</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#64748B" }}>—</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#64748B" }}>—</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>✓ Real-Time Alerts</td>
              </tr>
              <tr>
                <td style={{ padding: "1rem 1.5rem", color: "#E2E8F0" }}>Support SLA & Account Management</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#94A3B8" }}>Community / Docs</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#67E8F9" }}>12-Hour Email SLA</td>
                <td style={{ padding: "1rem", textAlign: "center", color: "#A78BFA" }}>Dedicated Account Rep</td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS */}
      <section style={{ maxWidth: "900px", margin: "0 auto 5rem auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            Frequently Asked Questions
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>
            Everything you need to know about the Inquest platform and our open civic guarantee.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {[
            {
              q: "Why is the Civic Tier guaranteed to be free forever?",
              a: "Access to public records is a fundamental civic right. Exultia's company charter commits to maintaining open records tools at zero cost for individual citizens, freelancers, and students. The Civic Tier runs entirely in your browser with zero server compute, ensuring we never have an economic reason to paywall it."
            },
            {
              q: "How does Bring-Your-Own-Key (BYOK) work for free users?",
              a: "Free Civic users can enter their personal Google Gemini API key in the Requester Profile settings. The key stays stored only in your local browser. Inquest calls the Gemini API directly from your client without passing through Exultia servers, giving you state-of-the-art legal synthesis for $0."
            },
            {
              q: "Are my investigative inquiries and drafts kept confidential?",
              a: "Yes. For Civic users, everything is stored strictly inside client-side browser storage with zero tracking. For Pro and Newsroom users, case dockets are encrypted end-to-end with zero-knowledge cryptography. Exultia staff never access, read, or monetize your investigative reporting."
            },
            {
              q: "What is a 'Multi-Agency Campaign Blast'?",
              a: "When reporting on a national or statewide story, you often need the exact same record (e.g., body camera policies or vendor procurement contracts) from 50 state police agencies or 200 cities. Inquest Pro automatically formats and tailors each submission to its specific local state statute, custodian, and deadline."
            },
            {
              q: "Do you offer academic, journalism school, or non-profit discounts?",
              a: "Yes! Accredited 501(c)(3) public interest organizations and student investigative newsrooms receive 50% off all Pro and Newsroom plans. Contact civil-liberties@exultia.tech with your organization details to apply."
            }
          ].map((faq, idx) => (
            <div key={idx} style={{
              background: "rgba(10, 15, 26, 0.7)",
              border: "1px solid rgba(255, 255, 255, 0.08)",
              borderRadius: "12px",
              padding: "1.5rem"
            }}>
              <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "1.05rem", fontWeight: 700, color: "#FFFFFF" }}>
                {faq.q}
              </h4>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#94A3B8", lineHeight: "1.6" }}>
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* BOTTOM ACTION BANNER */}
      <section style={{ maxWidth: "1050px", margin: "0 auto", textAlign: "center" }}>
        <div style={{
          background: "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(59, 130, 246, 0.15) 100%)",
          border: "1px solid rgba(6, 182, 212, 0.3)",
          borderRadius: "20px",
          padding: "3.5rem 2rem",
          boxShadow: "0 25px 50px -15px rgba(0, 0, 0, 0.8)"
        }}>
          <h2 style={{ fontSize: "2.4rem", fontWeight: 800, marginBottom: "0.75rem" }}>
            Start Filing Public Records Requests Today
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "1.1rem", maxWidth: "620px", margin: "0 auto 2rem auto", lineHeight: "1.6" }}>
            Draft your first 50-state compliant request in under 2 minutes with our permanent free Civic workspace. Upgrade whenever you need campaign sweeps and team collaboration.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <Link 
              href="/app/inquest" 
              className="btn-primary" 
              style={{ padding: "0.95rem 2.25rem", fontSize: "1rem", textDecoration: "none", background: "linear-gradient(135deg, #06B6D4 0%, #3B82F6 100%)", color: "#041019", fontWeight: 800 }}>
              Launch Free Civic Workspace →
            </Link>
            <button 
              onClick={() => handleStartTrial("pro")}
              style={{ padding: "0.95rem 1.85rem", borderRadius: "10px", background: "rgba(255,255,255,0.08)", border: "1px solid var(--border-color)", color: "white", fontWeight: 700, fontSize: "0.95rem", cursor: "pointer" }}>
              Explore Pro 14-Day Trial
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
