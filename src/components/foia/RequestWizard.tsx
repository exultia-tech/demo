"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Send, 
  Sliders, 
  Building2, 
  Calendar, 
  Tag, 
  Users, 
  DollarSign, 
  Zap, 
  ShieldCheck, 
  Plus, 
  X, 
  Layers,
  ChevronRight,
  Info
} from 'lucide-react';
import { 
  StructuredRequestParams, 
  RequesterProfile, 
  RequestFormat, 
  AgencyContact, 
  FilingCase 
} from '@/types/foia';
import { PRESET_QUERIES } from '@/lib/foia/presets';
import { JURISDICTIONS_LIST, getStatuteForJurisdiction } from '@/lib/foia/statutes';
import { AGENCIES_DATABASE } from '@/lib/foia/agencies';
import { parseInputWithAI } from '@/lib/foia/aiService';
import { compileRequestPackage, CompiledRequestPackage } from '@/lib/foia/letterCompiler';
import { LetterPreview } from './LetterPreview';
import { DispatchModal } from './DispatchModal';

interface RequestWizardProps {
  requesterProfile: RequesterProfile;
  apiKey: string;
  onFilingLogged: (newCase: FilingCase) => void;
  onNavigateToCases: () => void;
}

export const RequestWizard: React.FC<RequestWizardProps> = ({
  requesterProfile,
  apiKey,
  onFilingLogged,
  onNavigateToCases
}) => {
  const [promptInput, setPromptInput] = useState(
    'Austin Police Department: Request all officer body-worn camera footage, dashcam footage, and incident CAD dispatch logs related to the downtown public assembly on 6th Street between March 15, 2024 and March 18, 2024.'
  );
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<string>('auto');
  const [isProcessing, setIsProcessing] = useState(false);
  const [structuredParams, setStructuredParams] = useState<StructuredRequestParams | null>(null);
  const [compiledPackage, setCompiledPackage] = useState<CompiledRequestPackage | null>(null);
  const [showAdvancedTuner, setShowAdvancedTuner] = useState(true);
  const [newKeyword, setNewKeyword] = useState('');
  const [newCustodian, setNewCustodian] = useState('');
  const [isDispatchModalOpen, setIsDispatchModalOpen] = useState(false);

  // Auto compile on initial render
  useEffect(() => {
    handleGenerate(promptInput, selectedJurisdiction);
  }, []);

  const handleGenerate = async (queryText?: string, jur?: string) => {
    const text = queryText !== undefined ? queryText : promptInput;
    const currentJur = jur !== undefined ? jur : selectedJurisdiction;
    if (!text.trim()) return;

    setIsProcessing(true);
    try {
      const parsed = await parseInputWithAI(text, currentJur, apiKey);
      setStructuredParams(parsed);
      const pkg = await compileRequestPackage(parsed, requesterProfile);
      setCompiledPackage(pkg);
    } catch (err) {
      console.error('Error generating request package:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePresetSelect = (preset: typeof PRESET_QUERIES[0]) => {
    setPromptInput(preset.prompt);
    setSelectedJurisdiction(preset.suggestedJurisdiction);
    handleGenerate(preset.prompt, preset.suggestedJurisdiction);
  };

  const handleParamChange = async (updates: Partial<StructuredRequestParams>) => {
    if (!structuredParams) return;
    const updated = { ...structuredParams, ...updates };
    setStructuredParams(updated);
    const pkg = await compileRequestPackage(updated, requesterProfile, compiledPackage?.trackingNumber);
    setCompiledPackage(pkg);
  };

  const handleAddKeyword = () => {
    if (!newKeyword.trim() || !structuredParams) return;
    const keywords = [...structuredParams.keywords, newKeyword.trim()];
    handleParamChange({ keywords });
    setNewKeyword('');
  };

  const handleRemoveKeyword = (index: number) => {
    if (!structuredParams) return;
    const keywords = structuredParams.keywords.filter((_, i) => i !== index);
    handleParamChange({ keywords });
  };

  const handleAddCustodian = () => {
    if (!newCustodian.trim() || !structuredParams) return;
    const targetCustodians = [...structuredParams.targetCustodians, newCustodian.trim()];
    handleParamChange({ targetCustodians });
    setNewCustodian('');
  };

  const handleRemoveCustodian = (index: number) => {
    if (!structuredParams) return;
    const targetCustodians = structuredParams.targetCustodians.filter((_, i) => i !== index);
    handleParamChange({ targetCustodians });
  };

  const toggleFormat = (fmt: RequestFormat) => {
    if (!structuredParams) return;
    const current = structuredParams.requestedFormats;
    const updated = current.includes(fmt)
      ? current.filter(f => f !== fmt)
      : [...current, fmt];
    handleParamChange({ requestedFormats: updated });
  };

  return (
    <div style={{ maxWidth: '1440px', margin: '0 auto', padding: '24px 20px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Hero Section */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ maxWidth: '900px', marginBottom: '20px' }}>
          <span className="badge badge-blue" style={{ marginBottom: '10px' }}>
            <Sparkles size={12} /> Natural Language to Legally Binding Filing
          </span>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, letterSpacing: '-0.02em', lineHeight: 1.25, marginBottom: '8px' }}>
            Deterministic Open Records & FOIA Autopilot
          </h1>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Enter what records you are seeking in plain English. The AI and legal engine resolves the statutory jurisdiction, matches official custodians, pre-empts boilerplate exemption rejections, and compiles an enforceable request letter.
          </p>
        </div>

        {/* Input Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ position: 'relative' }}>
            <textarea
              className="input-field"
              rows={3}
              placeholder="e.g. Austin Police Department: Request all officer body-worn camera footage, dashcam footage, and incident CAD logs from March 15, 2024..."
              value={promptInput}
              onChange={e => setPromptInput(e.target.value)}
              style={{
                paddingRight: '140px',
                fontSize: '0.95rem',
                lineHeight: 1.5,
                background: 'var(--bg-secondary)',
                borderColor: 'var(--border-glass-bright)'
              }}
            />
            <button
              onClick={() => handleGenerate()}
              disabled={isProcessing}
              className="btn btn-primary"
              style={{
                position: 'absolute',
                right: '12px',
                bottom: '14px',
                height: '42px',
                padding: '0 20px',
                fontWeight: 700
              }}
            >
              {isProcessing ? (
                <>Parsing...</>
              ) : (
                <>
                  <Sparkles size={16} /> Compile Filing
                </>
              )}
            </button>
          </div>

          {/* Preset Buttons */}
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Quick Investigative Presets:
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {PRESET_QUERIES.map(preset => (
                <button
                  key={preset.id}
                  onClick={() => handlePresetSelect(preset)}
                  className="btn btn-secondary btn-sm"
                  style={{
                    fontSize: '0.75rem',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    borderColor: 'var(--border-glass)'
                  }}
                >
                  {preset.title}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Split Layout: Parameter Tuner & Live Letter Preview */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(340px, 460px) 1fr',
        gap: '24px',
        alignItems: 'start'
      }}>
        {/* Left Column: Structured Parameter Tuner */}
        {structuredParams && (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sliders size={18} color="var(--accent-primary)" />
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Deterministic Legal Parameters</h3>
              </div>
              <span className="badge badge-green" style={{ fontSize: '0.65rem' }}>
                Verified Schema
              </span>
            </div>

            {/* Jurisdiction & Agency */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  <Building2 size={14} /> Jurisdiction & Statutory Authority
                </label>
                <select
                  className="input-field"
                  value={structuredParams.jurisdictionId}
                  onChange={e => {
                    const jurId = e.target.value;
                    const statute = getStatuteForJurisdiction(jurId);
                    handleParamChange({
                      jurisdictionId: jurId,
                      statuteCitation: statute.citation,
                      statuteName: statute.name
                    });
                  }}
                >
                  {JURISDICTIONS_LIST.map(j => (
                    <option key={j.id} value={j.id}>
                      {j.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Target Agency / Custodian
                </label>
                <input
                  type="text"
                  className="input-field"
                  value={structuredParams.agencyName}
                  onChange={e => handleParamChange({ agencyName: e.target.value })}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '4px' }}>
                  Official Records Officer Email
                </label>
                <input
                  type="email"
                  className="input-field"
                  value={structuredParams.agencyEmail}
                  onChange={e => handleParamChange({ agencyEmail: e.target.value })}
                />
              </div>
            </div>

            {/* Temporal Scope */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <Calendar size={14} /> Temporal Scope (Date Range)
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Start Date:</span>
                  <input
                    type="date"
                    className="input-field"
                    value={structuredParams.dateStart}
                    onChange={e => handleParamChange({ dateStart: e.target.value })}
                  />
                </div>
                <div>
                  <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>End Date:</span>
                  <input
                    type="date"
                    className="input-field"
                    value={structuredParams.dateEnd}
                    onChange={e => handleParamChange({ dateEnd: e.target.value })}
                  />
                </div>
              </div>
            </div>

            {/* Search Keywords */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <Tag size={14} /> Boolean Search Keywords
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {structuredParams.keywords.map((kw, i) => (
                  <span key={i} className="badge badge-blue" style={{ textTransform: 'none', padding: '4px 8px' }}>
                    "{kw}"
                    <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => handleRemoveKeyword(i)} />
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  className="input-field"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                  placeholder="Add search term..."
                  value={newKeyword}
                  onChange={e => setNewKeyword(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddKeyword(); }}
                />
                <button onClick={handleAddKeyword} className="btn btn-secondary btn-sm">
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            {/* Target Custodians */}
            <div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                <Users size={14} /> Target Custodians & Divisions
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                {structuredParams.targetCustodians.map((c, i) => (
                  <span key={i} className="badge badge-purple" style={{ textTransform: 'none', padding: '4px 8px' }}>
                    {c}
                    <X size={12} style={{ cursor: 'pointer', marginLeft: '4px' }} onClick={() => handleRemoveCustodian(i)} />
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '6px' }}>
                <input
                  type="text"
                  className="input-field"
                  style={{ padding: '6px 10px', fontSize: '0.8rem' }}
                  placeholder="Add custodian / division..."
                  value={newCustodian}
                  onChange={e => setNewCustodian(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAddCustodian(); }}
                />
                <button onClick={handleAddCustodian} className="btn btn-secondary btn-sm">
                  <Plus size={14} /> Add
                </button>
              </div>
            </div>

            {/* Requested Formats */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Mandatory Electronic Formats
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '0.75rem' }}>
                {[
                  { id: 'native_electronic' as RequestFormat, label: 'Native File Format' },
                  { id: 'csv_xlsx' as RequestFormat, label: 'Raw .CSV / .XLSX' },
                  { id: 'pdf_searchable' as RequestFormat, label: 'Searchable PDF (OCR)' },
                  { id: 'audio_video_raw' as RequestFormat, label: 'Audio / Video Footage' },
                  { id: 'email_eml_msg' as RequestFormat, label: 'Raw Email (.EML)' }
                ].map(fmt => (
                  <label key={fmt.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', color: 'var(--text-primary)' }}>
                    <input
                      type="checkbox"
                      checked={structuredParams.requestedFormats.includes(fmt.id)}
                      onChange={() => toggleFormat(fmt.id)}
                    />
                    {fmt.label}
                  </label>
                ))}
              </div>
            </div>

            {/* Fee Waiver & Pre-authorized Cap */}
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                  <DollarSign size={14} /> Statutory Fee Waiver
                </label>
                <input
                  type="checkbox"
                  checked={structuredParams.feeWaiverRequested}
                  onChange={e => handleParamChange({ feeWaiverRequested: e.target.checked })}
                />
              </div>

              {structuredParams.feeWaiverRequested && (
                <textarea
                  className="input-field"
                  style={{ fontSize: '0.75rem', height: '60px', marginBottom: '8px' }}
                  value={structuredParams.feeWaiverJustification}
                  onChange={e => handleParamChange({ feeWaiverJustification: e.target.value })}
                />
              )}

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pre-authorized Cost Cap:</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.8rem' }}>$</span>
                  <input
                    type="number"
                    className="input-field"
                    style={{ width: '80px', padding: '4px 8px', fontSize: '0.8rem' }}
                    value={structuredParams.feeLimitMax}
                    onChange={e => handleParamChange({ feeLimitMax: Number(e.target.value) })}
                  />
                </div>
              </div>
            </div>

            {/* Expedited Processing */}
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent-amber)' }}>
                  <Zap size={14} /> Motion for Expedited Processing
                </label>
                <input
                  type="checkbox"
                  checked={structuredParams.expeditedProcessingRequested}
                  onChange={e => handleParamChange({ expeditedProcessingRequested: e.target.checked })}
                />
              </div>
              {structuredParams.expeditedProcessingRequested && (
                <textarea
                  className="input-field"
                  style={{ fontSize: '0.75rem', height: '60px' }}
                  value={structuredParams.expeditedProcessingGrounds}
                  onChange={e => handleParamChange({ expeditedProcessingGrounds: e.target.value })}
                  placeholder="Explain imminent threat to life/safety or urgent public dissemination..."
                />
              )}
            </div>

            {/* Legal Preemption Clauses */}
            <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '14px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Pre-emptive Rejection Safeguards
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={structuredParams.preemptiveClauses.segregability}
                    onChange={e => handleParamChange({
                      preemptiveClauses: { ...structuredParams.preemptiveClauses, segregability: e.target.checked }
                    })}
                  />
                  Mandatory Segregability & Exemption Preemption
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={structuredParams.preemptiveClauses.destructionHoldNotice}
                    onChange={e => handleParamChange({
                      preemptiveClauses: { ...structuredParams.preemptiveClauses, destructionHoldNotice: e.target.checked }
                    })}
                  />
                  Destruction Hold & Evidence Preservation Notice
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={structuredParams.preemptiveClauses.electronicFormatMandate}
                    onChange={e => handleParamChange({
                      preemptiveClauses: { ...structuredParams.preemptiveClauses, electronicFormatMandate: e.target.checked }
                    })}
                  />
                  Electronic Format & Metadata Preservation Mandate
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Right Column: Live Compiled Letter Preview */}
        {compiledPackage && structuredParams && (
          <LetterPreview
            compiledPackage={compiledPackage}
            params={structuredParams}
            requester={requesterProfile}
            onOpenDispatch={() => setIsDispatchModalOpen(true)}
          />
        )}
      </div>

      {/* Dispatch Modal */}
      {compiledPackage && structuredParams && (
        <DispatchModal
          isOpen={isDispatchModalOpen}
          onClose={() => setIsDispatchModalOpen(false)}
          compiledPackage={compiledPackage}
          params={structuredParams}
          requester={requesterProfile}
          userPrompt={promptInput}
          onFilingLogged={(newCase) => {
            onFilingLogged(newCase);
            setIsDispatchModalOpen(false);
            onNavigateToCases();
          }}
        />
      )}
    </div>
  );
};
