"use client";

import React, { useState } from 'react';
import { 
  ShieldAlert, 
  Sparkles, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle2, 
  FileWarning, 
  Gavel, 
  Scale, 
  ArrowRight,
  Download
} from 'lucide-react';
import { analyzeAgencyResponseLetter } from '@/lib/foia/aiService';
import { ResponseAnalysisResult } from '@/types/foia';
import { JURISDICTIONS_LIST } from '@/lib/foia/statutes';

const SAMPLE_RESPONSES = [
  {
    title: 'Exemption 5 (Deliberative Process) Blanket Denial',
    jurisdiction: 'US_FED',
    text: `Re: FOIA Request # 2026-004812

Dear Requester:

We have completed the search for records responsive to your request seeking email correspondence and preliminary threat assessments regarding predictive surveillance software.

A total of 42 documents (184 pages) were located. We have determined that all 42 documents are exempt from disclosure in full pursuant to 5 U.S.C. § 552(b)(5). These records reflect pre-decisional intra-agency discussions, frank policy advice, and deliberations among staff. Release of these records would stifle open debate.

You have the right to appeal this determination within 90 calendar days.

Sincerely,
FOIA Officer`
  },
  {
    title: 'Excessive $1,850 Fee Estimate & Denial of Public Fee Waiver',
    jurisdiction: 'TX',
    text: `Dear Requester:

We have received your Texas Public Information Act request for drone procurement contracts, invoices, and drone flight logs.

We estimate that locating and reviewing responsive records will require 45 hours of IT specialist labor at $28.50/hour, plus $568 in programming costs, totaling $1,850.50. You must remit a 50% deposit ($925.25) before we begin searching.

Your request for a public interest fee waiver is DENIED because you have not demonstrated how release of these technical invoices benefits the general public.

Please remit payment within 10 business days or your request will be deemed withdrawn.

City Legal Records Department`
  },
  {
    title: 'Overbroad / Burdensome Claim & Privacy Exemption 6/7(C)',
    jurisdiction: 'CA',
    text: `RE: California Public Records Act Request — Incident Bodycam & Records

Dear Requester:

Your request for body-worn camera video and officer incident logs is overly broad and unduly burdensome upon department operations. Furthermore, the video contains private personal likenesses of bystanders and officers, exempt under Cal. Gov. Code § 7927.705 and constitutional right to privacy.

The department is unable to process this request without extensive manual redaction which exceeds available staffing.

Records Access Coordinator`
  }
];

interface ResponseAnalyzerProps {
  apiKey: string;
}

export const ResponseAnalyzer: React.FC<ResponseAnalyzerProps> = ({ apiKey }) => {
  const [inputText, setInputText] = useState(SAMPLE_RESPONSES[0].text);
  const [selectedJurisdiction, setSelectedJurisdiction] = useState(SAMPLE_RESPONSES[0].jurisdiction);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<ResponseAnalysisResult | null>(null);
  const [copiedAppeal, setCopiedAppeal] = useState(false);

  const handleAnalyze = async (textToAnalyze?: string, jur?: string) => {
    const text = textToAnalyze || inputText;
    const j = jur || selectedJurisdiction;
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const result = await analyzeAgencyResponseLetter(text, j, apiKey);
      setAnalysisResult(result);
    } catch (err) {
      console.error('Error analyzing response:', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_RESPONSES[0]) => {
    setInputText(sample.text);
    setSelectedJurisdiction(sample.jurisdiction);
    handleAnalyze(sample.text, sample.jurisdiction);
  };

  const handleCopyAppeal = () => {
    if (!analysisResult) return;
    navigator.clipboard.writeText(analysisResult.appealDraft);
    setCopiedAppeal(true);
    setTimeout(() => setCopiedAppeal(false), 2000);
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ maxWidth: '900px', marginBottom: '16px' }}>
          <span className="badge badge-red" style={{ marginBottom: '10px' }}>
            <ShieldAlert size={12} /> Exemption Diagnostic & Rebuttal Engine
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', marginBottom: '8px' }}>
            Agency Denial & Fee Estimate Analyzer
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Did the government deny your request, claim an exemption, or demand an exorbitant fee? Paste the agency's rejection letter below to diagnose legal vulnerabilities and generate a formal Administrative Appeal citing statutory standards.
          </p>
        </div>

        {/* Sample Pills */}
        <div>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Load Sample Agency Response Letters:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {SAMPLE_RESPONSES.map((sample, i) => (
              <button
                key={i}
                onClick={() => handleSelectSample(sample)}
                className="btn btn-secondary btn-sm"
                style={{ fontSize: '0.75rem', borderRadius: '20px' }}
              >
                {sample.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Input & Analysis */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(350px, 500px) 1fr', gap: '24px', alignItems: 'start' }}>
        {/* Left Column: Paste Input */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Inbound Agency Response Letter</h3>
            <select
              className="input-field"
              style={{ width: 'auto', padding: '4px 10px', fontSize: '0.75rem' }}
              value={selectedJurisdiction}
              onChange={e => setSelectedJurisdiction(e.target.value)}
            >
              {JURISDICTIONS_LIST.map(j => (
                <option key={j.id} value={j.id}>{j.name}</option>
              ))}
            </select>
          </div>

          <textarea
            className="input-field"
            style={{ height: '340px', fontSize: '0.85rem', lineHeight: 1.5, background: 'var(--bg-secondary)' }}
            placeholder="Paste agency denial letter, fee estimate, or exemption notice here..."
            value={inputText}
            onChange={e => setInputText(e.target.value)}
          />

          <button
            onClick={() => handleAnalyze()}
            disabled={isAnalyzing || !inputText.trim()}
            className="btn btn-primary"
            style={{ fontWeight: 700 }}
          >
            {isAnalyzing ? (
              <>Diagnosing Exemption Claims...</>
            ) : (
              <>
                <Sparkles size={16} /> Diagnose & Generate Appeal
              </>
            )}
          </button>
        </div>

        {/* Right Column: Diagnostic & Legal Appeal Rebuttal */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {analysisResult ? (
            <>
              {/* Diagnostic Cards */}
              <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Gavel size={18} color="var(--accent-primary)" />
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Legal Vulnerability Diagnostic</h3>
                  </div>
                  <span className={`badge ${analysisResult.detectedStatus === 'denial' ? 'badge-red' : analysisResult.detectedStatus === 'fee_estimate' ? 'badge-amber' : 'badge-blue'}`}>
                    Detected: {analysisResult.detectedStatus.toUpperCase()}
                  </span>
                </div>

                {/* Cited Exemptions and Precedents */}
                {analysisResult.citedExemptions.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-rose)', marginBottom: '8px' }}>
                      Exemptions Identified & Counter-Arguments:
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {analysisResult.citedExemptions.map((ex, idx) => (
                        <div key={idx} style={{ background: 'var(--bg-tertiary)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-glass)' }}>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px' }}>
                            {ex.code}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '6px' }}>
                            {ex.description}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#60a5fa', marginBottom: '4px' }}>
                            <strong>Vulnerability:</strong> {ex.vulnerabilityAssessment}
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#34d399' }}>
                            <strong>Counter-Precedent:</strong> {ex.counterArgument}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Statutory Defects */}
                {analysisResult.statutoryDefectsFound.length > 0 && (
                  <div>
                    <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--accent-amber)', marginBottom: '6px' }}>
                      Procedural / Statutory Defects in Agency Notice:
                    </h4>
                    <ul style={{ paddingLeft: '20px', fontSize: '0.825rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {analysisResult.statutoryDefectsFound.map((defect, i) => (
                        <li key={i}>{defect}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Recommended Next Step */}
                <div style={{
                  padding: '12px 16px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}>
                  <CheckCircle2 size={18} color="var(--accent-primary)" />
                  <div style={{ fontSize: '0.85rem' }}>
                    <strong>Recommended Strategy:</strong> {analysisResult.recommendedAction}
                  </div>
                </div>
              </div>

              {/* Administrative Appeal Rebuttal Draft */}
              <div className="glass-panel" style={{ padding: '24px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Generated Administrative Appeal Rebuttal</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      Ready to file with the agency's designated Appeals Officer or State Attorney General
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleCopyAppeal} className="btn btn-secondary btn-sm">
                      {copiedAppeal ? <Check size={14} color="#10b981" /> : <Copy size={14} />}
                      {copiedAppeal ? 'Copied' : 'Copy Appeal'}
                    </button>
                    <button
                      onClick={() => {
                        const blob = new Blob([analysisResult.appealDraft], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = `Administrative-Appeal-Rebuttal.txt`;
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      className="btn btn-primary btn-sm"
                    >
                      <Download size={14} /> Download Appeal .TXT
                    </button>
                  </div>
                </div>

                <div className="legal-letter-view" style={{ maxHeight: '420px', overflowY: 'auto' }}>
                  {analysisResult.appealDraft}
                </div>
              </div>
            </>
          ) : (
            <div className="glass-panel" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
              <Scale size={48} style={{ margin: '0 auto 14px', opacity: 0.3 }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: '6px' }}>
                Awaiting Letter Input
              </h3>
              <p style={{ fontSize: '0.85rem', maxWidth: '440px', margin: '0 auto' }}>
                Paste the agency's response letter on the left or select a sample scenario above to generate an immediate legal rebuttal.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
