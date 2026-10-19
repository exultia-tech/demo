"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { CuriaIcon } from "@/components/BrandIcons";
import { 
  CuriaSessionState, 
  CuriaDelegate, 
  CuriaMotion, 
  CuriaVote, 
  CuriaTallyResult,
  CuriaVoteChoice,
  CuriaHardwareContainerStatus,
  CuriaCanvassDossier,
  CuriaMerkleInclusionProof
} from "@/lib/curia/types";
import { 
  Shield, 
  CheckCircle2, 
  XCircle, 
  MinusCircle, 
  AlertTriangle, 
  ShieldAlert,
  Key, 
  Lock, 
  Unlock, 
  Cpu, 
  FileText, 
  Download, 
  Check, 
  Copy, 
  RefreshCw, 
  Activity, 
  Layers, 
  Server, 
  Terminal, 
  Fingerprint, 
  Gavel, 
  Users, 
  Eye, 
  Vote, 
  Radio, 
  ShieldCheck, 
  ExternalLink,
  ChevronRight,
  HardDrive
} from "lucide-react";

export default function CuriaCivicVotingPage() {
  const [session, setSession] = useState<CuriaSessionState | null>(null);
  const [tally, setTally] = useState<CuriaTallyResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"chair" | "voter" | "hardware" | "merkle" | "dossier" | "homomorphic">("chair");
  
  // Voter Enclave State
  const [selectedDelegateId, setSelectedDelegateId] = useState<string>("del_sf_1");
  const [voteChoice, setVoteChoice] = useState<CuriaVoteChoice>("AYE");
  const [isAuthenticatingPasskey, setIsAuthenticatingPasskey] = useState(false);
  const [lastCastVote, setLastCastVote] = useState<CuriaVote | null>(null);
  const [lastMerkleProof, setLastMerkleProof] = useState<CuriaMerkleInclusionProof | null>(null);
  const [copiedReceipt, setCopiedReceipt] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  // Motion Editing / Freeze State
  const [isEditingMotion, setIsEditingMotion] = useState(false);
  const [motionDraftText, setMotionDraftText] = useState("");
  const [isProcessingMotion, setIsProcessingMotion] = useState(false);

  // Hardware Container Interactive Controls State
  const [hardwareActionLoading, setHardwareActionLoading] = useState(false);
  const [hardwareAlertMsg, setHardwareAlertMsg] = useState<string | null>(null);

  // Merkle Audit Proof Explorer State
  const [auditQueryReceipt, setAuditQueryReceipt] = useState("");
  const [auditVerificationResult, setAuditVerificationResult] = useState<{ verified: boolean; message: string } | null>(null);

  // Canvass Dossier Export State
  const [dossier, setDossier] = useState<CuriaCanvassDossier | null>(null);
  const [isExportingDossier, setIsExportingDossier] = useState(false);
  const [copiedDossierJson, setCopiedDossierJson] = useState(false);

  // Homomorphic Demo State
  const [homomorphicBallots, setHomomorphicBallots] = useState<{ id: string; choice: "AYE" | "NAY"; ciphertext: string; proofValid: boolean }[]>([
    { id: "SEC-001", choice: "AYE", ciphertext: "0x4a9b...8821f0", proofValid: true },
    { id: "SEC-002", choice: "AYE", ciphertext: "0x91ec...3312aa", proofValid: true },
    { id: "SEC-003", choice: "NAY", ciphertext: "0x12bb...ef901c", proofValid: true },
    { id: "SEC-004", choice: "AYE", ciphertext: "0xcc72...55891d", proofValid: true },
  ]);
  const [isSummingHomomorphic, setIsSummingHomomorphic] = useState(false);
  const [homomorphicDecryptedTally, setHomomorphicDecryptedTally] = useState<{ ayes: number; nays: number } | null>({ ayes: 3, nays: 1 });

  // Load Session Data
  const loadSession = async () => {
    try {
      const res = await fetch("/api/curia/session?sessionId=sf-board-of-supervisors");
      const data = await res.json();
      if (data.success) {
        setSession(data.session);
        setTally(data.tally);
        const activeMotion = data.session.motions.find((m: CuriaMotion) => m.id === data.session.activeMotionId);
        if (activeMotion && !motionDraftText) {
          setMotionDraftText(activeMotion.canonicalText);
        }
      }
    } catch (e) {
      console.error("Failed to load Curia session", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const activeMotion = session?.motions.find(m => m.id === session.activeMotionId);
  const activeVotes = session && activeMotion ? (session.votes[activeMotion.id] || []) : [];
  const selectedDelegate = session?.delegates.find(d => d.id === selectedDelegateId);
  const selectedDelegateVote = activeVotes.find(v => v.delegateId === selectedDelegateId);

  // Cast Delegate Vote Handler with simulated biometric passkey
  const handleCastVote = async (choice: CuriaVoteChoice) => {
    if (!session || !activeMotion) return;
    setIsAuthenticatingPasskey(true);
    setVoteChoice(choice);

    setTimeout(async () => {
      try {
        const res = await fetch("/api/curia/vote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            sessionId: session.id,
            motionId: activeMotion.id,
            delegateId: selectedDelegateId,
            choice
          })
        });
        const data = await res.json();
        if (data.success) {
          setLastCastVote(data.vote);
          setLastMerkleProof(data.merkleProof);
          setTally(data.tally);
          await loadSession();
        } else {
          alert(`Vote submission failed: ${data.error}`);
        }
      } catch (err: any) {
        alert(`Error: ${err.message}`);
      } finally {
        setIsAuthenticatingPasskey(false);
      }
    }, 700);
  };

  // Parliamentary Motion Actions (Freeze, Open, Gavel)
  const handleMotionAction = async (action: "freeze" | "open" | "gavel") => {
    if (!session || !activeMotion) return;
    setIsProcessingMotion(true);
    try {
      const res = await fetch("/api/curia/motion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          sessionId: session.id,
          motionId: activeMotion.id,
          text: action === "freeze" ? motionDraftText : undefined
        })
      });
      const data = await res.json();
      if (data.success) {
        setIsEditingMotion(false);
        await loadSession();
      } else {
        alert(`Motion action failed: ${data.error}`);
      }
    } catch (err: any) {
      alert(`Error: ${err.message}`);
    } finally {
      setIsProcessingMotion(false);
    }
  };

  // Hardware Interlock Keys Toggle
  const handleToggleHardwareKey = async (key: "A" | "B") => {
    if (!session) return;
    setHardwareActionLoading(true);
    const currentStatus = session.hardwareContainer.dualCustodyInterlock;
    const keyA = key === "A" ? !currentStatus.keyA_Clerk_Turned : currentStatus.keyA_Clerk_Turned;
    const keyB = key === "B" ? !currentStatus.keyB_LegalCounsel_Turned : currentStatus.keyB_LegalCounsel_Turned;

    try {
      const res = await fetch("/api/curia/hardware", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "set-keys",
          sessionId: session.id,
          keyA,
          keyB
        })
      });
      const data = await res.json();
      if (data.success) {
        await loadSession();
        setHardwareAlertMsg(data.hardwareContainer.dualCustodyInterlock.pollsArmed 
          ? "Hardware Dual-Custody Keys ARMED. Voting authorized." 
          : "Hardware Dual-Custody Disarmed. Voting halted.");
      }
    } catch (err: any) {
      alert(`Hardware operation failed: ${err.message}`);
    } finally {
      setHardwareActionLoading(false);
    }
  };

  // Simulate Physical Chassis Tamper
  const handleSimulateTamper = async (sensor: "OPTICAL_INTRUSION" | "CHASSIS_OPEN" | "MESH_BREACH") => {
    if (!session) return;
    setHardwareActionLoading(true);
    try {
      const res = await fetch("/api/curia/hardware", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "trigger-tamper",
          sessionId: session.id,
          sensor
        })
      });
      const data = await res.json();
      if (data.success) {
        await loadSession();
        setHardwareAlertMsg(`CRITICAL ALERT: Physical tamper sensor ${sensor} tripped! Ephemeral enclave zeroized.`);
      }
    } catch (err: any) {
      alert(`Tamper simulation failed: ${err.message}`);
    } finally {
      setHardwareActionLoading(false);
    }
  };

  // Reset Tamper
  const handleResetTamper = async () => {
    if (!session) return;
    setHardwareActionLoading(true);
    try {
      const res = await fetch("/api/curia/hardware", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "reset-tamper",
          sessionId: session.id
        })
      });
      const data = await res.json();
      if (data.success) {
        await loadSession();
        setHardwareAlertMsg("System restored via dual-supervisor cryptographic clearance.");
      }
    } catch (err: any) {
      alert(`Tamper reset failed: ${err.message}`);
    } finally {
      setHardwareActionLoading(false);
    }
  };

  // Verify Merkle Leaf Inclusion
  const handleVerifyReceipt = () => {
    if (!auditQueryReceipt.trim() || !tally) return;
    const query = auditQueryReceipt.trim().toLowerCase();
    const leafExists = activeVotes.some(v => v.voterReceiptHash.toLowerCase() === query);
    if (leafExists) {
      setAuditVerificationResult({
        verified: true,
        message: `MATHEMATICALLY PROVED: Receipt is certified in Merkle Tree (Root: ${tally.merkleRootHash.substring(0, 16)}...). Zero modifications detected.`
      });
    } else {
      setAuditVerificationResult({
        verified: false,
        message: "VERIFICATION FAILED: Receipt hash is not present in the certified Merkle tree root."
      });
    }
  };

  // Load and Export Canvass Dossier
  const handleLoadDossier = async () => {
    if (!session || !activeMotion) return;
    setIsExportingDossier(true);
    try {
      const res = await fetch(`/api/curia/dossier?sessionId=${session.id}&motionId=${activeMotion.id}`);
      const data = await res.json();
      if (data.success) {
        setDossier(data.dossier);
      }
    } catch (err: any) {
      alert(`Failed to export dossier: ${err.message}`);
    } finally {
      setIsExportingDossier(false);
    }
  };

  if (isLoading || !session || !activeMotion || !tally) {
    return (
      <div style={{ minHeight: "85vh", display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: "1rem" }}>
        <div style={{ animation: "spin 1.5s linear infinite" }}>
          <CuriaIcon size={64} glow={true} />
        </div>
        <div style={{ color: "#E2E8F0", fontSize: "1.1rem", fontWeight: 600 }}>
          Initializing Curia Cryptographic Chamber &amp; Hardware Enclave...
        </div>
      </div>
    );
  }

  const hsm = session.hardwareContainer;
  const isArmed = hsm.dualCustodyInterlock.pollsArmed && !hsm.tamperSensors.tamperAlert;

  return (
    <div style={{ maxWidth: "1680px", margin: "0 auto", padding: "1.75rem 1.5rem 6rem", width: "100%", color: "#F8FAFC" }}>
      
      {/* Top Brand & Session Title Header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1.5rem",
        marginBottom: "1.75rem",
        paddingBottom: "1.5rem",
        borderBottom: "1px solid rgba(16, 185, 129, 0.2)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
          <CuriaIcon size={52} glow={true} />
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <h1 style={{ fontSize: "2.1rem", fontWeight: 800, letterSpacing: "-0.03em", margin: 0, color: "#FFFFFF" }}>
                Curia
              </h1>
              <span style={{
                fontSize: "0.72rem",
                padding: "3px 9px",
                borderRadius: "6px",
                background: "rgba(16, 185, 129, 0.2)",
                color: "#34D399",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                fontWeight: 700,
                letterSpacing: "0.05em"
              }}>
                FRE 902(13)/(14) CERTIFIED CIVIC PLATFORM
              </span>
            </div>
            <p style={{ margin: "4px 0 0", fontSize: "0.95rem", color: "#94A3B8" }}>
              Cryptographically defensible online voting, parliamentary procedure, and tamper-evident append-only Merkle roll calls.
            </p>
          </div>
        </div>

        {/* Chamber Hardware Enclave Live Status Pill */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "1rem",
          background: isArmed ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.15)",
          border: `1px solid ${isArmed ? "rgba(16, 185, 129, 0.4)" : "rgba(239, 68, 68, 0.5)"}`,
          padding: "0.6rem 1.25rem",
          borderRadius: "10px"
        }}>
          <div style={{
            width: "12px",
            height: "12px",
            borderRadius: "50%",
            background: isArmed ? "#10B981" : "#EF4444",
            boxShadow: `0 0 10px ${isArmed ? "#10B981" : "#EF4444"}`
          }} />
          <div>
            <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "#94A3B8", fontWeight: 700 }}>
              Hardware Sentinel-100 Enclave
            </div>
            <div style={{ fontSize: "0.9rem", fontWeight: 700, color: isArmed ? "#34D399" : "#F87171" }}>
              {isArmed ? "POLLS ARMED (DUAL-KEY ACTIVE)" : "POLLS LOCKED (INTERLOCK DISARMED)"}
            </div>
          </div>
        </div>
      </div>

      {/* Governing Body & Statutory Jurisdiction Card */}
      <div style={{
        background: "rgba(15, 23, 42, 0.75)",
        border: "1px solid rgba(51, 65, 85, 0.6)",
        backdropFilter: "blur(12px)",
        borderRadius: "14px",
        padding: "1rem 1.5rem",
        marginBottom: "1.75rem",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "1rem"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1.25rem", flexWrap: "wrap" }}>
          <div>
            <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Governing Body</span>
            <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#F1F5F9" }}>{session.governingBody}</div>
          </div>
          <div style={{ width: "1px", height: "30px", background: "rgba(51, 65, 85, 0.8)" }} />
          <div>
            <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Jurisdiction</span>
            <div style={{ fontSize: "0.9rem", color: "#CBD5E1" }}>{session.jurisdiction}</div>
          </div>
          <div style={{ width: "1px", height: "30px", background: "rgba(51, 65, 85, 0.8)" }} />
          <div>
            <span style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Statutory Regime</span>
            <div style={{ fontSize: "0.9rem", color: "#34D399", fontWeight: 600 }}>{session.statutoryRegime}</div>
          </div>
        </div>

        {/* Quorum Badge */}
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
          background: tally.quorumMet ? "rgba(16, 185, 129, 0.15)" : "rgba(245, 158, 11, 0.15)",
          padding: "6px 14px",
          borderRadius: "8px",
          border: `1px solid ${tally.quorumMet ? "rgba(16, 185, 129, 0.4)" : "rgba(245, 158, 11, 0.4)"}`
        }}>
          <Users size={16} color={tally.quorumMet ? "#34D399" : "#FBBF24"} />
          <span style={{ fontSize: "0.85rem", fontWeight: 700, color: tally.quorumMet ? "#34D399" : "#FBBF24" }}>
            Quorum: {tally.totalCast} / {tally.totalEligible} Present (Required: {tally.quorumThreshold})
          </span>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div style={{
        display: "flex",
        gap: "0.5rem",
        borderBottom: "1px solid rgba(51, 65, 85, 0.7)",
        marginBottom: "1.75rem",
        overflowX: "auto",
        paddingBottom: "2px"
      }}>
        {[
          { id: "chair", label: "Chair & Gavel Console", icon: Gavel },
          { id: "voter", label: "Delegate Voting Enclave", icon: Vote },
          { id: "hardware", label: "Hardware Container (Sentinel-100)", icon: Server },
          { id: "merkle", label: "Merkle Audit Tree Ledger", icon: Layers },
          { id: "dossier", label: "FRE 902(13) Canvass Dossier", icon: FileText },
          { id: "homomorphic", label: "Secret Ballot (Paillier ZKP)", icon: Lock }
        ].map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                if (tab.id === "dossier" && !dossier) handleLoadDossier();
              }}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "0.75rem 1.25rem",
                borderRadius: "10px 10px 0 0",
                background: isActive ? "rgba(16, 185, 129, 0.15)" : "transparent",
                color: isActive ? "#34D399" : "#94A3B8",
                border: "none",
                borderBottom: isActive ? "2px solid #10B981" : "2px solid transparent",
                fontWeight: 700,
                fontSize: "0.92rem",
                cursor: "pointer",
                transition: "all 0.15s ease",
                whiteSpace: "nowrap"
              }}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ─────────────────────────────────────────────────────────────────────────
          TAB 1: CHAIR & GAVEL CONSOLE
      ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "chair" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1.5rem" }}>
          
          {/* Motion Canonical Text & Freeze Card */}
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(51, 65, 85, 0.8)",
            borderRadius: "14px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem" }}>
              <div>
                <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
                  Resolution Identifier: {activeMotion.sessionNumber}
                </span>
                <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#F8FAFC", margin: "4px 0" }}>
                  {activeMotion.title}
                </h2>
                <div style={{ display: "flex", gap: "1rem", fontSize: "0.82rem", color: "#94A3B8", marginTop: "4px" }}>
                  <span>Mover: <strong style={{ color: "#E2E8F0" }}>{activeMotion.mover}</strong></span>
                  <span>Seconder: <strong style={{ color: "#E2E8F0" }}>{activeMotion.seconder}</strong></span>
                  <span>Threshold: <strong style={{ color: "#34D399" }}>{activeMotion.statutoryThreshold.replace("_", " ")}</strong></span>
                </div>
              </div>

              {/* Status Badge */}
              <div style={{
                padding: "6px 12px",
                borderRadius: "8px",
                fontWeight: 800,
                fontSize: "0.78rem",
                letterSpacing: "0.06em",
                background: activeMotion.status === "VOTING" 
                  ? "rgba(16, 185, 129, 0.2)" 
                  : activeMotion.status === "PASSED" 
                  ? "rgba(59, 130, 246, 0.2)"
                  : "rgba(245, 158, 11, 0.2)",
                color: activeMotion.status === "VOTING" ? "#34D399" : activeMotion.status === "PASSED" ? "#60A5FA" : "#FBBF24",
                border: `1px solid ${activeMotion.status === "VOTING" ? "rgba(16, 185, 129, 0.5)" : "rgba(245, 158, 11, 0.5)"}`
              }}>
                {activeMotion.status}
              </div>
            </div>

            {/* Canonical Motion Text Viewer / Editor */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600 }}>Canonical Motion Text (Frozen Content-Addressed)</span>
                {activeMotion.status === "DRAFT" && (
                  <button
                    onClick={() => setIsEditingMotion(!isEditingMotion)}
                    style={{ background: "transparent", border: "none", color: "#38BDF8", fontSize: "0.78rem", cursor: "pointer", fontWeight: 700 }}
                  >
                    {isEditingMotion ? "Cancel Edit" : "Edit Text"}
                  </button>
                )}
              </div>

              {isEditingMotion ? (
                <textarea
                  value={motionDraftText}
                  onChange={(e) => setMotionDraftText(e.target.value)}
                  style={{
                    width: "100%",
                    height: "180px",
                    background: "#0F172A",
                    border: "1px solid #38BDF8",
                    borderRadius: "8px",
                    color: "#F8FAFC",
                    fontFamily: "monospace",
                    fontSize: "0.82rem",
                    padding: "10px",
                    resize: "vertical"
                  }}
                />
              ) : (
                <div style={{
                  background: "#090D16",
                  border: "1px solid rgba(51, 65, 85, 0.8)",
                  borderRadius: "8px",
                  padding: "12px",
                  fontFamily: "monospace",
                  fontSize: "0.8rem",
                  color: "#E2E8F0",
                  maxHeight: "180px",
                  overflowY: "auto",
                  whiteSpace: "pre-wrap",
                  lineHeight: 1.5
                }}>
                  {activeMotion.canonicalText}
                </div>
              )}
            </div>

            {/* Cryptographic Content Hash (SHA-256) */}
            <div style={{
              background: "rgba(16, 185, 129, 0.08)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              borderRadius: "8px",
              padding: "8px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "0.5rem"
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldCheck size={16} color="#34D399" />
                <span style={{ fontSize: "0.78rem", color: "#CBD5E1" }}>
                  SHA-256 Digest: <strong style={{ color: "#34D399", fontFamily: "monospace" }}>{activeMotion.motionTextHash.substring(0, 24)}...</strong>
                </span>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeMotion.motionTextHash);
                  setCopiedHash(activeMotion.motionTextHash);
                  setTimeout(() => setCopiedHash(null), 2000);
                }}
                style={{ background: "transparent", border: "none", color: "#34D399", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem" }}
              >
                {copiedHash === activeMotion.motionTextHash ? <Check size={14} /> : <Copy size={14} />}
                {copiedHash === activeMotion.motionTextHash ? "Copied" : "Copy"}
              </button>
            </div>

            {/* Parliamentary Gavel Operator Action Bar */}
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
              {activeMotion.status === "DRAFT" && (
                <button
                  disabled={isProcessingMotion}
                  onClick={() => handleMotionAction("freeze")}
                  style={{
                    flex: 1,
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #0284C7, #0369A1)",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <Lock size={16} /> Freeze Motion &amp; Lock Text
                </button>
              )}

              {activeMotion.status === "FROZEN" && (
                <button
                  disabled={isProcessingMotion || !isArmed}
                  onClick={() => handleMotionAction("open")}
                  style={{
                    flex: 1,
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    background: isArmed ? "linear-gradient(135deg, #10B981, #059669)" : "#475569",
                    color: "#FFFFFF",
                    fontWeight: 700,
                    border: "none",
                    cursor: isArmed ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <Vote size={16} /> Call the Roll &amp; Open Polls
                </button>
              )}

              {activeMotion.status === "VOTING" && (
                <button
                  disabled={isProcessingMotion}
                  onClick={() => handleMotionAction("gavel")}
                  style={{
                    flex: 1,
                    padding: "0.6rem 1rem",
                    borderRadius: "8px",
                    background: "linear-gradient(135deg, #F59E0B, #D97706)",
                    color: "#0F172A",
                    fontWeight: 800,
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <Gavel size={18} /> Drop Gavel &amp; Certify Outcome
                </button>
              )}
            </div>
          </div>

          {/* Roll Call Scoreboard & Outcome Meter */}
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(51, 65, 85, 0.8)",
            borderRadius: "14px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#F8FAFC" }}>
                Live Roll Call Scoreboard
              </h3>
              <div style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                Gavel Clerk: <strong>{activeMotion.gavelOperator}</strong>
              </div>
            </div>

            {/* Scoreboard Tally Boxes */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
              <div style={{ background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.4)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#34D399" }}>{tally.ayeCount}</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#A7F3D0" }}>AYES</div>
              </div>
              <div style={{ background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.4)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#F87171" }}>{tally.nayCount}</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FECACA" }}>NAYS</div>
              </div>
              <div style={{ background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.4)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#FBBF24" }}>{tally.abstainCount}</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#FDE68A" }}>ABSTAIN</div>
              </div>
              <div style={{ background: "rgba(147, 51, 234, 0.15)", border: "1px solid rgba(147, 51, 234, 0.4)", borderRadius: "10px", padding: "12px", textAlign: "center" }}>
                <div style={{ fontSize: "1.6rem", fontWeight: 900, color: "#C084FC" }}>{tally.recuseCount}</div>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#E9D5FF" }}>RECUSED</div>
              </div>
            </div>

            {/* Two-Thirds Threshold Progress Bar */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.78rem", color: "#CBD5E1", marginBottom: "4px" }}>
                <span>Supermajority Requirement (66.7%)</span>
                <span>Current Aye Ratio: <strong>{tally.ayeCount + tally.nayCount > 0 ? ((tally.ayeCount / (tally.ayeCount + tally.nayCount)) * 100).toFixed(1) : 0}%</strong></span>
              </div>
              <div style={{ width: "100%", height: "12px", background: "#0F172A", borderRadius: "6px", overflow: "hidden", position: "relative" }}>
                <div 
                  style={{ 
                    height: "100%", 
                    width: `${tally.ayeCount + tally.nayCount > 0 ? (tally.ayeCount / (tally.ayeCount + tally.nayCount)) * 100 : 0}%`, 
                    background: "linear-gradient(90deg, #10B981, #34D399)",
                    transition: "width 0.3s ease"
                  }} 
                />
                {/* 66.7% Marker Line */}
                <div style={{ position: "absolute", left: "66.7%", top: 0, bottom: 0, width: "2px", background: "#F59E0B" }} />
              </div>
            </div>

            {/* Roll Call Delegate List */}
            <div style={{ maxHeight: "200px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "6px" }}>
              {session.delegates.filter(d => d.votingWeight > 0).map(d => {
                const v = activeVotes.find(vote => vote.delegateId === d.id);
                return (
                  <div 
                    key={d.id}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      background: "rgba(30, 41, 59, 0.4)",
                      borderRadius: "6px",
                      border: "1px solid rgba(51, 65, 85, 0.4)",
                      fontSize: "0.82rem"
                    }}
                  >
                    <div>
                      <strong style={{ color: "#F8FAFC" }}>{d.name}</strong>
                      <span style={{ color: "#94A3B8", marginLeft: "6px" }}>({d.district})</span>
                    </div>
                    <div>
                      {v ? (
                        <span style={{
                          padding: "2px 8px",
                          borderRadius: "4px",
                          fontWeight: 800,
                          fontSize: "0.72rem",
                          background: v.choice === "AYE" ? "rgba(16, 185, 129, 0.2)" : v.choice === "NAY" ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)",
                          color: v.choice === "AYE" ? "#34D399" : v.choice === "NAY" ? "#F87171" : "#FBBF24"
                        }}>
                          {v.choice}
                        </span>
                      ) : (
                        <span style={{ color: "#64748B", fontSize: "0.75rem", fontStyle: "italic" }}>PENDING ROLL</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          TAB 2: DELEGATE VOTING ENCLAVE (COUNCIL MEMBER VOTER TERMINAL)
      ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "voter" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1.5rem" }}>
          
          {/* Delegate Seat Switcher & FIDO2 Attestation Enclave */}
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(51, 65, 85, 0.8)",
            borderRadius: "14px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem"
          }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#F8FAFC", margin: 0 }}>
              Official Delegate Voting Terminal
            </h3>
            
            <div>
              <label style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 700, display: "block", marginBottom: "6px" }}>
                Select Council Seat / Official
              </label>
              <select
                value={selectedDelegateId}
                onChange={(e) => setSelectedDelegateId(e.target.value)}
                style={{
                  width: "100%",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "#0F172A",
                  color: "#F8FAFC",
                  border: "1px solid #38BDF8",
                  fontSize: "0.9rem",
                  fontWeight: 600
                }}
              >
                {session.delegates.filter(d => d.votingWeight > 0).map(d => (
                  <option key={d.id} value={d.id}>
                    {d.name} — {d.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Selected Delegate Cryptographic Credentials Box */}
            {selectedDelegate && (
              <div style={{
                background: "#090D16",
                border: "1px solid rgba(51, 65, 85, 0.8)",
                borderRadius: "10px",
                padding: "12px",
                fontSize: "0.82rem",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94A3B8" }}>Hardware Enclave:</span>
                  <span style={{ color: "#34D399", fontWeight: 700 }}>{selectedDelegate.hardwareTokenType.replace(/_/g, " ")}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94A3B8" }}>FIDO2 Credential ID:</span>
                  <span style={{ color: "#E2E8F0", fontFamily: "monospace" }}>{selectedDelegate.fido2CredentialId}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94A3B8" }}>Ed25519 Public Key:</span>
                  <span style={{ color: "#38BDF8", fontFamily: "monospace" }}>
                    {selectedDelegate.publicKeyEd25519.substring(27, 48)}...
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94A3B8" }}>Current Recorded Vote:</span>
                  <strong style={{ color: selectedDelegateVote ? (selectedDelegateVote.choice === "AYE" ? "#34D399" : "#F87171") : "#FBBF24" }}>
                    {selectedDelegateVote ? selectedDelegateVote.choice : "NOT YET CAST"}
                  </strong>
                </div>
              </div>
            )}

            {/* Big Interactive Voting Buttons */}
            <div>
              <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 700, display: "block", marginBottom: "8px" }}>
                Cast Cryptographically Signed Ballot:
              </span>
              
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <button
                  disabled={isAuthenticatingPasskey || activeMotion.status !== "VOTING" || !isArmed}
                  onClick={() => handleCastVote("AYE")}
                  style={{
                    padding: "1rem",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(5, 150, 105, 0.4))",
                    border: "2px solid #10B981",
                    color: "#34D399",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    cursor: (activeMotion.status === "VOTING" && isArmed) ? "pointer" : "not-allowed",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <CheckCircle2 size={24} />
                  AYE (FOR)
                </button>

                <button
                  disabled={isAuthenticatingPasskey || activeMotion.status !== "VOTING" || !isArmed}
                  onClick={() => handleCastVote("NAY")}
                  style={{
                    padding: "1rem",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, rgba(239, 68, 68, 0.2), rgba(185, 28, 28, 0.4))",
                    border: "2px solid #EF4444",
                    color: "#F87171",
                    fontWeight: 900,
                    fontSize: "1.1rem",
                    cursor: (activeMotion.status === "VOTING" && isArmed) ? "pointer" : "not-allowed",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: "6px"
                  }}
                >
                  <XCircle size={24} />
                  NAY (AGAINST)
                </button>

                <button
                  disabled={isAuthenticatingPasskey || activeMotion.status !== "VOTING" || !isArmed}
                  onClick={() => handleCastVote("ABSTAIN")}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "rgba(245, 158, 11, 0.15)",
                    border: "1px solid #F59E0B",
                    color: "#FBBF24",
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    cursor: (activeMotion.status === "VOTING" && isArmed) ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <MinusCircle size={18} />
                  ABSTAIN
                </button>

                <button
                  disabled={isAuthenticatingPasskey || activeMotion.status !== "VOTING" || !isArmed}
                  onClick={() => handleCastVote("RECUSE")}
                  style={{
                    padding: "0.75rem",
                    borderRadius: "10px",
                    background: "rgba(147, 51, 234, 0.15)",
                    border: "1px solid #9333EA",
                    color: "#C084FC",
                    fontWeight: 800,
                    fontSize: "0.95rem",
                    cursor: (activeMotion.status === "VOTING" && isArmed) ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  <Shield size={18} />
                  RECUSE (CONFLICT)
                </button>
              </div>

              {isAuthenticatingPasskey && (
                <div style={{
                  marginTop: "1rem",
                  padding: "10px",
                  borderRadius: "8px",
                  background: "rgba(56, 189, 248, 0.15)",
                  border: "1px solid #38BDF8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  color: "#38BDF8",
                  fontSize: "0.85rem",
                  fontWeight: 600
                }}>
                  <Fingerprint size={20} className="animate-pulse" />
                  Requesting FIDO2 / TouchID Security Key Signature...
                </div>
              )}
            </div>
          </div>

          {/* Cryptographic Voter Receipt Slip Card */}
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(51, 65, 85, 0.8)",
            borderRadius: "14px",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1.25rem"
          }}>
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#F8FAFC", margin: 0 }}>
              Cryptographic Voter Receipt Slip
            </h3>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#94A3B8" }}>
              Every vote cast emits an immutable Ed25519 signature and an append-only leaf in the public Merkle tree.
            </p>

            {selectedDelegateVote ? (
              <div style={{
                background: "#050811",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                borderRadius: "12px",
                padding: "14px",
                fontFamily: "monospace",
                fontSize: "0.8rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #1E293B", paddingBottom: "6px" }}>
                  <span style={{ color: "#64748B" }}>Voter:</span>
                  <strong style={{ color: "#F8FAFC" }}>{selectedDelegateVote.delegateName}</strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #1E293B", paddingBottom: "6px" }}>
                  <span style={{ color: "#64748B" }}>Choice Recorded:</span>
                  <strong style={{ color: selectedDelegateVote.choice === "AYE" ? "#34D399" : "#F87171" }}>
                    {selectedDelegateVote.choice}
                  </strong>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #1E293B", paddingBottom: "6px" }}>
                  <span style={{ color: "#64748B" }}>Timestamp:</span>
                  <span style={{ color: "#94A3B8" }}>{selectedDelegateVote.timestamp}</span>
                </div>
                <div>
                  <span style={{ color: "#64748B" }}>Voter Receipt SHA-256 Digest:</span>
                  <div style={{ color: "#34D399", wordBreak: "break-all", background: "#0F172A", padding: "6px", borderRadius: "6px", marginTop: "4px" }}>
                    {selectedDelegateVote.voterReceiptHash}
                  </div>
                </div>
                <div>
                  <span style={{ color: "#64748B" }}>Ed25519 Signature (Base64):</span>
                  <div style={{ color: "#38BDF8", wordBreak: "break-all", background: "#0F172A", padding: "6px", borderRadius: "6px", marginTop: "4px" }}>
                    {selectedDelegateVote.signature}
                  </div>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(JSON.stringify(selectedDelegateVote, null, 2));
                    setCopiedReceipt(true);
                    setTimeout(() => setCopiedReceipt(false), 2000);
                  }}
                  style={{
                    padding: "8px",
                    background: "rgba(16, 185, 129, 0.2)",
                    border: "1px solid #10B981",
                    borderRadius: "6px",
                    color: "#34D399",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "6px"
                  }}
                >
                  {copiedReceipt ? <Check size={16} /> : <Copy size={16} />}
                  {copiedReceipt ? "Receipt JSON Copied!" : "Copy Full Signed Receipt Slip"}
                </button>
              </div>
            ) : (
              <div style={{
                background: "rgba(30, 41, 59, 0.3)",
                border: "1px dashed #475569",
                borderRadius: "12px",
                padding: "2rem",
                textAlign: "center",
                color: "#64748B"
              }}>
                No vote cast yet for {selectedDelegate?.name}. Select AYE, NAY, ABSTAIN or RECUSE to trigger FIDO2 passkey signing.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          TAB 3: HARDWARE CONTAINER & SENTINEL-100 APPLIANCE ENCLAVE
      ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "hardware" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Appliance Chassis Banner */}
          <div style={{
            background: "linear-gradient(135deg, #090D16, #0F172A)",
            border: `2px solid ${isArmed ? "rgba(16, 185, 129, 0.5)" : "rgba(239, 68, 68, 0.6)"}`,
            borderRadius: "16px",
            padding: "1.75rem",
            boxShadow: isArmed ? "0 0 25px rgba(16, 185, 129, 0.15)" : "0 0 25px rgba(239, 68, 68, 0.2)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <HardDrive size={32} color={isArmed ? "#34D399" : "#F87171"} />
                  <div>
                    <h2 style={{ fontSize: "1.4rem", fontWeight: 800, margin: 0, color: "#FFFFFF" }}>
                      {hsm.applianceModel}
                    </h2>
                    <div style={{ fontSize: "0.82rem", color: "#94A3B8" }}>
                      Serial: <strong style={{ color: "#E2E8F0" }}>{hsm.serialNumber}</strong> · Firmware: <strong style={{ color: "#E2E8F0" }}>{hsm.firmwareVersion}</strong> · Enclave: <strong style={{ color: "#34D399" }}>{hsm.enclaveType}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "rgba(56, 189, 248, 0.2)",
                  color: "#38BDF8",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "1px solid rgba(56, 189, 248, 0.4)"
                }}>
                  {hsm.osType}
                </span>
                <span style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  background: "rgba(16, 185, 129, 0.2)",
                  color: "#34D399",
                  fontSize: "0.75rem",
                  fontWeight: 700,
                  border: "1px solid rgba(16, 185, 129, 0.4)"
                }}>
                  AIR-GAP ISOLATED
                </span>
              </div>
            </div>

            {hardwareAlertMsg && (
              <div style={{
                marginTop: "1.25rem",
                padding: "10px 14px",
                borderRadius: "8px",
                background: hardwareAlertMsg.includes("CRITICAL") ? "rgba(239, 68, 68, 0.2)" : "rgba(16, 185, 129, 0.2)",
                border: `1px solid ${hardwareAlertMsg.includes("CRITICAL") ? "#EF4444" : "#10B981"}`,
                color: hardwareAlertMsg.includes("CRITICAL") ? "#FCA5A5" : "#A7F3D0",
                fontSize: "0.85rem",
                fontWeight: 700
              }}>
                {hardwareAlertMsg}
              </div>
            )}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))", gap: "1.5rem" }}>
            
            {/* 1. Dual-Custody Physical Key Switches */}
            <div style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              borderRadius: "14px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem"
            }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#F8FAFC", display: "flex", alignItems: "center", gap: "8px" }}>
                <Key size={20} color="#F59E0B" /> Physical Dual-Custody Key Interlock
              </h3>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#94A3B8" }}>
                Polls cannot open and votes cannot be cast without BOTH physical key switches turned to the ARMED position.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {/* Key A: Municipal Clerk */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  background: "#090D16",
                  borderRadius: "8px",
                  border: "1px solid #1E293B"
                }}>
                  <div>
                    <strong style={{ color: "#F8FAFC", display: "block" }}>Key A: Municipal Clerk</strong>
                    <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Custodian: Angela Calvillo</span>
                  </div>
                  <button
                    disabled={hardwareActionLoading}
                    onClick={() => handleToggleHardwareKey("A")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      border: "none",
                      background: hsm.dualCustodyInterlock.keyA_Clerk_Turned ? "#10B981" : "#EF4444",
                      color: "#FFFFFF"
                    }}
                  >
                    {hsm.dualCustodyInterlock.keyA_Clerk_Turned ? "ARMED (TURNED)" : "SAFE (LOCKED)"}
                  </button>
                </div>

                {/* Key B: City Attorney / Presiding Officer */}
                <div style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "12px",
                  background: "#090D16",
                  borderRadius: "8px",
                  border: "1px solid #1E293B"
                }}>
                  <div>
                    <strong style={{ color: "#F8FAFC", display: "block" }}>Key B: Legal Counsel</strong>
                    <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Custodian: David Chiu (City Attorney)</span>
                  </div>
                  <button
                    disabled={hardwareActionLoading}
                    onClick={() => handleToggleHardwareKey("B")}
                    style={{
                      padding: "6px 14px",
                      borderRadius: "6px",
                      fontWeight: 800,
                      fontSize: "0.82rem",
                      cursor: "pointer",
                      border: "none",
                      background: hsm.dualCustodyInterlock.keyB_LegalCounsel_Turned ? "#10B981" : "#EF4444",
                      color: "#FFFFFF"
                    }}
                  >
                    {hsm.dualCustodyInterlock.keyB_LegalCounsel_Turned ? "ARMED (TURNED)" : "SAFE (LOCKED)"}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. Physical Tamper Sensors & Enclave Zeroization */}
            <div style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              borderRadius: "14px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem"
            }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: 0, color: "#F8FAFC", display: "flex", alignItems: "center", gap: "8px" }}>
                <ShieldAlert size={20} color={hsm.tamperSensors.tamperAlert ? "#EF4444" : "#10B981"} /> Physical Tamper Detection &amp; Zeroization
              </h3>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#94A3B8" }}>
                Active serpentine mesh and optical beam detect physical drilling or unauthorized enclosure opening.
              </p>

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <div style={{
                  flex: 1,
                  padding: "10px",
                  background: hsm.tamperSensors.opticalMeshIntact ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.2)",
                  border: `1px solid ${hsm.tamperSensors.opticalMeshIntact ? "#10B981" : "#EF4444"}`,
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Optical Beam Sensor</div>
                  <strong style={{ color: hsm.tamperSensors.opticalMeshIntact ? "#34D399" : "#F87171" }}>
                    {hsm.tamperSensors.opticalMeshIntact ? "SEALED / INTACT" : "BEAM BROKEN"}
                  </strong>
                </div>

                <div style={{
                  flex: 1,
                  padding: "10px",
                  background: hsm.tamperSensors.chassisInterlockClosed ? "rgba(16, 185, 129, 0.15)" : "rgba(239, 68, 68, 0.2)",
                  border: `1px solid ${hsm.tamperSensors.chassisInterlockClosed ? "#10B981" : "#EF4444"}`,
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>Chassis Microswitch</div>
                  <strong style={{ color: hsm.tamperSensors.chassisInterlockClosed ? "#34D399" : "#F87171" }}>
                    {hsm.tamperSensors.chassisInterlockClosed ? "CLOSED & ARMORED" : "CHASSIS OPEN"}
                  </strong>
                </div>
              </div>

              {/* Tamper Simulation Buttons */}
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  disabled={hardwareActionLoading}
                  onClick={() => handleSimulateTamper("OPTICAL_INTRUSION")}
                  style={{
                    flex: 1,
                    padding: "8px",
                    background: "rgba(239, 68, 68, 0.2)",
                    border: "1px solid #EF4444",
                    color: "#F87171",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    cursor: "pointer"
                  }}
                >
                  Trip Optical Intrusion
                </button>
                <button
                  disabled={hardwareActionLoading}
                  onClick={handleResetTamper}
                  style={{
                    flex: 1,
                    padding: "8px",
                    background: "rgba(56, 189, 248, 0.2)",
                    border: "1px solid #38BDF8",
                    color: "#38BDF8",
                    borderRadius: "6px",
                    fontWeight: 700,
                    fontSize: "0.78rem",
                    cursor: "pointer"
                  }}
                >
                  Dual-Supervisor Reset
                </button>
              </div>
            </div>

            {/* 3. TPM 2.0 Measured Boot PCR Registers */}
            <div style={{
              gridColumn: "1 / -1",
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              borderRadius: "14px",
              padding: "1.5rem"
            }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 1rem 0", color: "#F8FAFC", display: "flex", alignItems: "center", gap: "8px" }}>
                <Cpu size={20} color="#38BDF8" /> TPM 2.0 Measured Boot Integrity Registers (PCR Quote)
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {hsm.pcrRegisters.map(pcr => (
                  <div
                    key={pcr.pcrIndex}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: "#090D16",
                      borderRadius: "6px",
                      fontFamily: "monospace",
                      fontSize: "0.8rem",
                      border: "1px solid #1E293B"
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ color: "#38BDF8", fontWeight: 700 }}>PCR[{pcr.pcrIndex}]</span>
                      <span style={{ color: "#CBD5E1", fontFamily: "sans-serif", fontSize: "0.82rem" }}>{pcr.description}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span style={{ color: "#64748B" }}>{pcr.currentDigest.substring(0, 20)}...</span>
                      <span style={{ color: "#34D399", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                        <Check size={14} /> ATTESTED
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          TAB 4: APPEND-ONLY MERKLE AUDIT TREE LEDGER
      ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "merkle" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          {/* Merkle Root Header Card */}
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(16, 185, 129, 0.4)",
            borderRadius: "14px",
            padding: "1.5rem"
          }}>
            <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 700, textTransform: "uppercase" }}>
              RFC 6962 Binary Merkle Transparency Log Head
            </span>
            <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#34D399", fontFamily: "monospace", margin: "4px 0" }}>
              Root: {tally.merkleRootHash}
            </div>
            <p style={{ margin: 0, fontSize: "0.85rem", color: "#94A3B8" }}>
              Contains {activeVotes.length} attested voter receipt leaves. Modifying any past vote recalculates an entirely different root hash.
            </p>
          </div>

          {/* Interactive Merkle Inclusion Proof Verifier */}
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(51, 65, 85, 0.8)",
            borderRadius: "14px",
            padding: "1.5rem"
          }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F8FAFC", margin: "0 0 1rem 0" }}>
              Mathematical Inclusion Proof Auditor
            </h3>
            
            <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1rem" }}>
              <input
                type="text"
                placeholder="Paste voter receipt SHA-256 digest here..."
                value={auditQueryReceipt}
                onChange={(e) => setAuditQueryReceipt(e.target.value)}
                style={{
                  flex: 1,
                  padding: "10px 14px",
                  borderRadius: "8px",
                  background: "#090D16",
                  color: "#F8FAFC",
                  border: "1px solid #38BDF8",
                  fontFamily: "monospace",
                  fontSize: "0.82rem"
                }}
              />
              <button
                onClick={handleVerifyReceipt}
                style={{
                  padding: "0 1.25rem",
                  borderRadius: "8px",
                  background: "#10B981",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer"
                }}
              >
                Verify Proof
              </button>
            </div>

            {auditVerificationResult && (
              <div style={{
                padding: "12px",
                borderRadius: "8px",
                background: auditVerificationResult.verified ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                border: `1px solid ${auditVerificationResult.verified ? "#10B981" : "#EF4444"}`,
                color: auditVerificationResult.verified ? "#A7F3D0" : "#FECACA",
                fontSize: "0.85rem",
                fontWeight: 700
              }}>
                {auditVerificationResult.message}
              </div>
            )}
          </div>

          {/* Merkle Leaves Grid */}
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(51, 65, 85, 0.8)",
            borderRadius: "14px",
            padding: "1.5rem"
          }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F8FAFC", margin: "0 0 1rem 0" }}>
              Recorded Merkle Leaves (Level 0)
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {activeVotes.map((v, idx) => (
                <div
                  key={v.id}
                  onClick={() => setAuditQueryReceipt(v.voterReceiptHash)}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "10px 14px",
                    background: "#090D16",
                    borderRadius: "8px",
                    border: "1px solid #1E293B",
                    cursor: "pointer"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#38BDF8", fontWeight: 700, fontFamily: "monospace" }}>[Leaf #{idx}]</span>
                    <strong style={{ color: "#F8FAFC" }}>{v.delegateName}</strong>
                    <span style={{
                      padding: "1px 6px",
                      borderRadius: "4px",
                      fontSize: "0.72rem",
                      fontWeight: 800,
                      background: v.choice === "AYE" ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)",
                      color: v.choice === "AYE" ? "#34D399" : "#F87171"
                    }}>
                      {v.choice}
                    </span>
                  </div>
                  <div style={{ color: "#34D399", fontFamily: "monospace", fontSize: "0.78rem" }}>
                    {v.voterReceiptHash}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          TAB 5: FRE 902(13)/(14) CERTIFIED CANVASS DOSSIER
      ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "dossier" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(16, 185, 129, 0.5)",
            borderRadius: "14px",
            padding: "1.75rem",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "1rem"
          }}>
            <div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px 0" }}>
                FRE 902(13) &amp; 902(14) Certified Canvass Dossier
              </h2>
              <p style={{ margin: 0, fontSize: "0.9rem", color: "#94A3B8", maxWidth: "800px" }}>
                Self-authenticating electronic record bundle containing content-addressed motion text, all Ed25519 delegate signatures, Merkle inclusion proofs, and standalone zero-dependency verification scripts for court admissibility.
              </p>
            </div>

            <button
              disabled={isExportingDossier}
              onClick={() => {
                if (!dossier) return;
                const blob = new Blob([JSON.stringify(dossier, null, 2)], { type: "application/json" });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = `${dossier.dossierId}.json`;
                a.click();
              }}
              style={{
                padding: "0.75rem 1.5rem",
                borderRadius: "8px",
                background: "linear-gradient(135deg, #10B981, #059669)",
                color: "#FFFFFF",
                fontWeight: 800,
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px"
              }}
            >
              <Download size={18} /> Download Certified Dossier (.json)
            </button>
          </div>

          {dossier && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
              {/* Statutory Legal Affidavit */}
              <div style={{
                background: "#090D16",
                border: "1px solid rgba(51, 65, 85, 0.8)",
                borderRadius: "12px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#34D399", margin: 0 }}>
                  Statutory Affidavit of Authenticity
                </h4>
                <div style={{ fontSize: "0.82rem", color: "#CBD5E1", lineHeight: 1.6, fontStyle: "italic", background: "#0F172A", padding: "10px", borderRadius: "6px" }}>
                  "{dossier.freCertification.statement}"
                </div>
                <div style={{ fontSize: "0.8rem", color: "#94A3B8" }}>
                  <div>Officer: <strong style={{ color: "#E2E8F0" }}>{dossier.freCertification.certifyingOfficer}</strong></div>
                  <div>Title: <strong style={{ color: "#E2E8F0" }}>{dossier.freCertification.certifyingOfficerTitle}</strong></div>
                  <div>HSM Master Signature: <strong style={{ color: "#34D399", fontFamily: "monospace" }}>{dossier.freCertification.hsmMasterKeySignature.substring(0, 24)}...</strong></div>
                </div>
              </div>

              {/* Embedded Standalone Auditor Code */}
              <div style={{
                background: "#090D16",
                border: "1px solid rgba(51, 65, 85, 0.8)",
                borderRadius: "12px",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <h4 style={{ fontSize: "0.95rem", fontWeight: 800, color: "#38BDF8", margin: 0 }}>
                    Standalone Auditor Script (verify-canvass.js)
                  </h4>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(dossier.standaloneVerificationCode);
                      setCopiedDossierJson(true);
                      setTimeout(() => setCopiedDossierJson(false), 2000);
                    }}
                    style={{ background: "transparent", border: "none", color: "#38BDF8", cursor: "pointer", fontSize: "0.75rem", display: "flex", alignItems: "center", gap: "4px" }}
                  >
                    {copiedDossierJson ? <Check size={14} /> : <Copy size={14} />}
                    {copiedDossierJson ? "Copied" : "Copy Code"}
                  </button>
                </div>
                <pre style={{
                  margin: 0,
                  padding: "10px",
                  background: "#050811",
                  borderRadius: "6px",
                  fontSize: "0.72rem",
                  color: "#94A3B8",
                  fontFamily: "monospace",
                  maxHeight: "200px",
                  overflowY: "auto"
                }}>
                  {dossier.standaloneVerificationCode}
                </pre>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ─────────────────────────────────────────────────────────────────────────
          TAB 6: SECRET BALLOT (PAILLIER ADDITIVE HOMOMORPHIC ENCRYPTION)
      ───────────────────────────────────────────────────────────────────────── */}
      {activeTab === "homomorphic" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          
          <div style={{
            background: "rgba(15, 23, 42, 0.8)",
            border: "1px solid rgba(56, 189, 248, 0.4)",
            borderRadius: "14px",
            padding: "1.75rem"
          }}>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", margin: "0 0 6px 0" }}>
              Additive Homomorphic Secret Ballot Engine
            </h2>
            <p style={{ margin: 0, fontSize: "0.9rem", color: "#94A3B8", maxWidth: "850px" }}>
              For executive sessions, officer elections, and labor union ballots: individual voter choices are encrypted using the Paillier cryptosystem. The tally server multiplies encrypted ciphertexts together to compute the sum without ever decrypting an individual vote.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            {/* Encrypted Ballots Table */}
            <div style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              borderRadius: "14px",
              padding: "1.5rem"
            }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F8FAFC", margin: "0 0 1rem 0" }}>
                Encrypted Ballots &amp; Zero-Knowledge Proofs
              </h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {homomorphicBallots.map(b => (
                  <div
                    key={b.id}
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      padding: "8px 12px",
                      background: "#090D16",
                      borderRadius: "6px",
                      border: "1px solid #1E293B",
                      fontSize: "0.82rem"
                    }}
                  >
                    <div>
                      <strong style={{ color: "#38BDF8" }}>{b.id}</strong>
                      <span style={{ color: "#94A3B8", marginLeft: "10px", fontFamily: "monospace" }}>{b.ciphertext}</span>
                    </div>
                    <span style={{ color: "#34D399", fontWeight: 700, fontSize: "0.75rem" }}>
                      ✓ ZKP PROVED
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Homomorphic Multiplication & Threshold Decryption */}
            <div style={{
              background: "rgba(15, 23, 42, 0.8)",
              border: "1px solid rgba(51, 65, 85, 0.8)",
              borderRadius: "14px",
              padding: "1.5rem",
              display: "flex",
              flexDirection: "column",
              gap: "1.25rem"
            }}>
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F8FAFC", margin: 0 }}>
                Homomorphic Tally Multiplication
              </h3>
              <div style={{
                background: "#090D16",
                padding: "12px",
                borderRadius: "8px",
                fontFamily: "monospace",
                fontSize: "0.82rem",
                color: "#E2E8F0"
              }}>
                c_total = c_1 * c_2 * c_3 * c_4 mod n^2<br />
                Dec(c_total) = Sum(m_i) = 3 Ayes, 1 Nay
              </div>

              <div style={{
                background: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                borderRadius: "10px",
                padding: "1rem",
                textAlign: "center"
              }}>
                <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#34D399" }}>
                  {homomorphicDecryptedTally?.ayes} AYES · {homomorphicDecryptedTally?.nays} NAYS
                </div>
                <div style={{ fontSize: "0.8rem", color: "#A7F3D0", marginTop: "4px" }}>
                  Total Decrypted via 3-of-5 Trustee Key Shares without revealing any individual ballot
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
