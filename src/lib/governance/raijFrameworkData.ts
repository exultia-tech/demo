import { 
  FrameworkPillar, 
  ControlSpecification, 
  CrossWalkItem, 
  RolloutPhase, 
  GovernanceFrameworkMeta 
} from '@/types/governance';

export const RAIJ_PILLARS: FrameworkPillar[] = [
  {
    code: 'DP',
    number: 1,
    name: 'Algorithmic Due Process & Explainability',
    shortName: 'Due Process',
    description: 'Right to explanation, contestability, anti-blackbox mandates, and human-in-the-loop (HITL) overrides for high-impact decisions.',
    color: '#3B82F6',
    accentBg: 'rgba(59, 130, 246, 0.12)',
    borderColor: 'rgba(59, 130, 246, 0.3)',
    iconName: 'Scale',
    controlsCount: 4
  },
  {
    code: 'PS',
    number: 2,
    name: 'Model Provenance, Supply Chain & AIBOM',
    shortName: 'Model Provenance',
    description: 'Cryptographic weight signatures, AI Software Bill of Materials (AIBOM), training provenance, and tamper-evident checkpoints.',
    color: '#8B5CF6',
    accentBg: 'rgba(139, 92, 246, 0.12)',
    borderColor: 'rgba(139, 92, 246, 0.3)',
    iconName: 'Cpu',
    controlsCount: 4
  },
  {
    code: 'DI',
    number: 3,
    name: 'Data Integrity, Privacy & Anti-Poisoning',
    shortName: 'Data Integrity',
    description: 'Training set sanitization, synthetic data guardrails, differential privacy, and prompt/weights extraction defenses.',
    color: '#10B981',
    accentBg: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    iconName: 'Database',
    controlsCount: 4
  },
  {
    code: 'AR',
    number: 4,
    name: 'Red-Teaming, Jailbreak & Adversarial Robustness',
    shortName: 'Adversarial Robustness',
    description: 'Direct and indirect prompt injection firewalls, hallucination bounds, and deterministic tool execution sandboxing.',
    color: '#F59E0B',
    accentBg: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.3)',
    iconName: 'ShieldAlert',
    controlsCount: 4
  },
  {
    code: 'IA',
    number: 5,
    name: 'Identity, Access & Agentic Sandboxing',
    shortName: 'Agentic Sandboxing',
    description: 'Principle of least privilege for autonomous agents, API token gating, deterministic tool whitelisting, and execution tracing.',
    color: '#06B6D4',
    accentBg: 'rgba(6, 182, 212, 0.12)',
    borderColor: 'rgba(6, 182, 212, 0.3)',
    iconName: 'Lock',
    controlsCount: 4
  },
  {
    code: 'BA',
    number: 6,
    name: 'Bias Auditing, Disparate Impact & Fairness',
    shortName: 'Bias & Fairness',
    description: '4/5ths rule disparity testing, demographic parity metrics, continuous drift monitoring, and independent civilian fairness audits.',
    color: '#EC4899',
    accentBg: 'rgba(236, 72, 153, 0.12)',
    borderColor: 'rgba(236, 72, 153, 0.3)',
    iconName: 'CheckCircle2',
    controlsCount: 4
  },
  {
    code: 'LE',
    number: 7,
    name: 'Statutory Compliance & Legal Liability',
    shortName: 'Statutory Compliance',
    description: 'EU AI Act High-Risk alignment, White House OMB M-24-10 compliance, and statutory liability allocation (vendor vs deployer).',
    color: '#E11D48',
    accentBg: 'rgba(225, 29, 72, 0.12)',
    borderColor: 'rgba(225, 29, 72, 0.3)',
    iconName: 'FileCheck',
    controlsCount: 4
  },
  {
    code: 'PT',
    number: 8,
    name: 'Public Records, Model Registry & Transparency',
    shortName: 'Public Registry & FOIA',
    description: 'Centralized AI Algorithm & System Registry, AI System Cards, regulatory audit readiness for prompt/decision logs, and proprietary weights exemption boundaries.',
    color: '#14B8A6',
    accentBg: 'rgba(20, 184, 166, 0.12)',
    borderColor: 'rgba(20, 184, 166, 0.3)',
    iconName: 'BookOpen',
    controlsCount: 4
  }
];

export const RAIJ_CONTROLS: ControlSpecification[] = [
  // PILLAR 1: ALGORITHMIC DUE PROCESS & EXPLAINABILITY (DP)
  {
    id: 'DP-01',
    pillarCode: 'DP',
    title: 'Right to Meaningful Explanation & Adjudicative Contestability',
    requirementLevel: 'MUST',
    statement: 'Any algorithmic system affecting civil liberties, benefits eligibility, housing, employment, or legal determinations MUST output human-comprehensible, deterministic rationales identifying decisive factors.',
    detailedNotes: [
      'Explanations must state the specific input variables that would need to change for an adverse determination to be reversed (counterfactual explainability).',
      'Proprietary machine-learning weights cannot be invoked by deploying entities or vendors to evade statutory explanation obligations.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (GOVERN 1.2, MAP 3.1)',
      iso: 'ISO/IEC 42001:2023 A.7.2',
      omb: 'OMB M-24-10 Section 5(c)(v)(C)',
      statutory: 'U.S. Const. Amend. XIV (Due Process) / FCRA § 609'
    }
  },
  {
    id: 'DP-02',
    pillarCode: 'DP',
    title: 'Mandatory Human-in-the-Loop (HITL) Adjudicative Gate',
    requirementLevel: 'MANDATORY',
    statement: 'No adverse public administrative or legal action may be executed solely through autonomous AI execution. A credentialed human officer MUST conduct independent substantive review and retain final authority to reject model outputs.',
    detailedNotes: [
      'Prohibits "rubber-stamping" of algorithmic recommendations; the reviewing official must attest to having inspected the raw evidentiary record.',
      'Software must log the human reviewer’s active deliberation time before allowing signature or execution.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (MANAGE 2.4, GOVERN 2.2)',
      iso: 'ISO/IEC 42001:2023 A.8.4',
      omb: 'OMB M-24-10 Section 5(c)(v)(A)',
      statutory: 'EU AI Act Article 14 (Human Oversight)'
    }
  },
  {
    id: 'DP-03',
    pillarCode: 'DP',
    title: 'Anti-Blackbox & Auditable Decision Lineage Mandate',
    requirementLevel: 'MUST',
    statement: 'Algorithms deployed in adjudicative proceedings MUST possess fully traceable, mathematically auditable decision trees or certified surrogate explainability models (e.g., TreeSHAP / Integrated Gradients). Fully opaque, un-auditable deep ensembles are prohibited in judicial risk scoring.',
    detailedNotes: [
      'Models must output feature attribution weights alongside each individual classification or risk score.',
      'Uninterpretable embedding projections cannot be used as the sole evidentiary basis for detention or benefit revocation.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (MEASURE 2.8, MAP 1.5)',
      iso: 'ISO/IEC 42001:2023 A.6.2',
      omb: 'OMB M-24-10 Section 5(c)(v)(C)',
      statutory: 'State v. Loomis, 881 N.W.2d 749 (Wis. 2016)'
    }
  },
  {
    id: 'DP-04',
    pillarCode: 'DP',
    title: 'Adversarial Citizen Appeal & Rebuttal Protocol',
    requirementLevel: 'REQUIRED',
    statement: 'Deploying entities must provide affected individuals with a standardized, cost-free mechanism to appeal algorithmic decisions to an administrative law judge, independent tribunal, or human arbiter within 30 days of notification.',
    detailedNotes: [
      'Upon filing an appeal, the full audit package (prompt, model version, feature inputs, and confidence intervals) must be provided to the individual or legal counsel.',
      'Tolling of statutory deadlines occurs automatically until the algorithmic audit file is certified and delivered.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (GOVERN 5.1)',
      iso: 'ISO/IEC 42001:2023 A.9.3',
      omb: 'OMB M-24-10 Section 5(c)(v)(D)',
      statutory: 'Administrative Procedure Act (5 U.S.C. § 706)'
    }
  },

  // PILLAR 2: MODEL PROVENANCE, SUPPLY CHAIN & AIBOM (PS)
  {
    id: 'PS-01',
    pillarCode: 'PS',
    title: 'Cryptographic Checkpoint Signing & Tamper Verification',
    requirementLevel: 'MUST',
    statement: 'All model weights, LoRA adapters, and embedding matrices deployed in production infrastructure MUST be signed with cryptographic keys (Ed25519) and verified against authorized ledger checkpoint hashes prior to runtime initialization.',
    detailedNotes: [
      'Execution runtimes must verify the SHA-256 weight hash against the authorized model registry; mismatched weights abort system boot.',
      'Prevents post-procurement weight poisoning, silent vendor drift, and unauthorized backdoor insertion.'
    ],
    crossWalk: {
      nist: 'NIST SP 800-53 (SI-7, SA-11)',
      iso: 'ISO/IEC 42001:2023 A.10.1',
      omb: 'OMB M-24-10 Section 5(b)(ii)',
      statutory: 'FIPS 140-3 / Executive Order 14110'
    }
  },
  {
    id: 'PS-02',
    pillarCode: 'PS',
    title: 'AI Software Bill of Materials (AIBOM) Requirement',
    requirementLevel: 'MANDATORY',
    statement: 'Vendors must deliver a machine-readable AI Software Bill of Materials (CycloneDX 1.5 or SPDX AI profile) detailing foundation model ancestry, pre-training dataset hashes, fine-tuning checkpoints, and third-party orchestration dependencies.',
    detailedNotes: [
      'AIBOMs must be deposited in an escrow or certified software repository prior to contract execution.',
      'Failure to disclose proprietary sub-model dependencies voids vendor liability indemnification clauses.'
    ],
    crossWalk: {
      nist: 'NIST SP 800-161 Rev. 1 / SA-12',
      iso: 'ISO/IEC 42001:2023 A.9.1',
      omb: 'OMB M-24-10 Section 5(c)(iv)',
      statutory: 'CycloneDX 1.5 Specification'
    }
  },
  {
    id: 'PS-03',
    pillarCode: 'PS',
    title: 'Training Corpus Licensing & Provenance Attestation',
    requirementLevel: 'MANDATORY',
    statement: 'Vendors must provide certified legal attestation that pre-training and fine-tuning datasets do not incorporate non-consensual biometric data, stolen intellectual property, or pirated databases.',
    detailedNotes: [
      'Vendor must demonstrate compliance with state data protection statutes (e.g., California AB 2013 on AI Training Data Transparency).',
      'Scraped facial recognition datasets lacking statutory subject consent are prohibited in municipal deployments.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (MAP 2.1, MEASURE 2.11)',
      iso: 'ISO/IEC 42001:2023 A.8.2',
      omb: 'OMB M-24-10 Section 5(b)(i)',
      statutory: 'Cal. AB 2013 (2024) / BIPA 740 ILCS 14/'
    }
  },
  {
    id: 'PS-04',
    pillarCode: 'PS',
    title: 'Model Registry Mandate & Isolated Runtime Sandboxing',
    requirementLevel: 'REQUIRED',
    statement: 'Deploying organizations must maintain a centralized, version-controlled model registry cataloging every production AI artifact, deployment location, API endpoint, and containerized runtime sandbox.',
    detailedNotes: [
      'No shadow AI models or unsanctioned external API endpoints may be connected to production databases or operational systems.',
      'Open-weights models must be hosted in air-gapped or VPC-isolated enclaves with disabled ambient telemetry.'
    ],
    crossWalk: {
      nist: 'NIST SP 800-53 (CM-8, SC-7)',
      iso: 'ISO/IEC 42001:2023 A.7.1',
      omb: 'OMB M-24-10 Section 5(a)(i)',
      statutory: 'NIST AI RMF GOVERN 1.1'
    }
  },

  // PILLAR 3: DATA INTEGRITY, PRIVACY & ANTI-POISONING (DI)
  {
    id: 'DI-01',
    pillarCode: 'DI',
    title: 'Training & Retrieval Corpus Sanitization',
    requirementLevel: 'MUST',
    statement: 'Retrieval-Augmented Generation (RAG) vector stores and fine-tuning corpora containing sensitive data MUST be cryptographically scrubbed of unredacted juvenile records, sealed dockets, and PII before embedding generation.',
    detailedNotes: [
      'Automated PII detection pipelines must scan documents for SSNs, medical records, and domestic violence shelter addresses.',
      'Vector index updates must enforce immediate mathematical purging upon court-ordered expungements.'
    ],
    crossWalk: {
      nist: 'NIST SP 800-53 (MP-6, PT-2)',
      iso: 'ISO/IEC 42001:2023 A.8.3',
      omb: 'OMB M-24-10 Section 5(c)(v)(B)',
      statutory: 'Privacy Act of 1974 (5 U.S.C. § 552a)'
    }
  },
  {
    id: 'DI-02',
    pillarCode: 'DI',
    title: 'PII Extraction & Differential Privacy Safeguards',
    requirementLevel: 'MANDATORY',
    statement: 'Models exposed to external public interfaces must be validated against membership inference attacks and verbatim memorization extraction using differential privacy bounds (epsilon < 1.0) or certified canary probing.',
    detailedNotes: [
      'Regular automated probe testing with structured canary strings to ensure the model does not regurgitate raw training inputs.',
      'Rate-limiting and entropy thresholding on API outputs to prevent model inversion attacks.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (MEASURE 2.7)',
      iso: 'ISO/IEC 42001:2023 A.8.5',
      omb: 'OMB M-24-10 Section 5(b)(iii)',
      statutory: 'NIST SP 800-188 (De-Identification)'
    }
  },
  {
    id: 'DI-03',
    pillarCode: 'DI',
    title: 'Synthetic Data Degradation & Lineage Limits',
    requirementLevel: 'REQUIRED',
    statement: 'The use of synthetic training data must be explicitly labeled, cataloged, and capped to prevent model collapse, synthetic data loops, and statistical bias reinforcement in decision engines.',
    detailedNotes: [
      'Synthetic datasets must be validated against ground-truth empirical baselines and certified benchmarks.',
      'Models trained primarily on recursive synthetic data are prohibited from high-stakes adjudicative use.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (MEASURE 2.11, MAP 2.2)',
      iso: 'ISO/IEC 42001:2023 A.8.2',
      omb: 'OMB M-24-10 Section 5(c)(i)',
      statutory: 'ISO/IEC 5259 Data Quality for AI'
    }
  },
  {
    id: 'DI-04',
    pillarCode: 'DI',
    title: 'Anti-Poisoning & Out-of-Distribution Validation',
    requirementLevel: 'REQUIRED',
    statement: 'Production RAG pipelines and continuous-learning pipelines must deploy out-of-distribution (OOD) anomaly filters to prevent adversarial data injection into operational knowledge bases.',
    detailedNotes: [
      'Cryptographic hashing and digital signatures required for all external documents ingested into citizen-facing vector stores.',
      'Anomalous document clusters exceeding semantic distance thresholds must be quarantined for human review.'
    ],
    crossWalk: {
      nist: 'NIST SP 800-53 (SI-4, SI-10)',
      iso: 'ISO/IEC 42001:2023 A.9.2',
      omb: 'OMB M-24-10 Section 5(b)(iv)',
      statutory: 'NIST SP 800-218 (SSDF)'
    }
  },

  // PILLAR 4: RED-TEAMING, JAILBREAK & ADVERSARIAL ROBUSTNESS (AR)
  {
    id: 'AR-01',
    pillarCode: 'AR',
    title: 'Direct & Indirect Prompt Injection Firewalls',
    requirementLevel: 'MUST',
    statement: 'Publicly accessible or document-processing AI systems MUST implement layered input sanitization and semantic firewalls capable of neutralizing both direct system prompt overrides and indirect injections hidden in processed documents/webpages.',
    detailedNotes: [
      'Dual-LLM evaluator architecture or deterministic token guardrails (e.g. NeMo Guardrails / Llama Guard) required for all civic portals.',
      'Instruction boundaries must be enforced with cryptographic tokens or structural demarcation markers.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (MEASURE 2.7, MANAGE 2.2)',
      iso: 'ISO/IEC 42001:2023 A.6.1',
      omb: 'OMB M-24-10 Section 5(b)(ii)',
      statutory: 'OWASP Top 10 for LLM (LLM01 / LLM02)'
    }
  },
  {
    id: 'AR-02',
    pillarCode: 'AR',
    title: 'Deterministic Output Validation & Schema Conformance',
    requirementLevel: 'MANDATORY',
    statement: 'AI model outputs that trigger downstream software executions, database queries, or civic service actions MUST be strictly validated against typed JSON schemas prior to execution. Free-form text execution is prohibited.',
    detailedNotes: [
      'Compiler-enforced schema validation ensures model hallucination cannot inject SQL, Bash commands, or malformed API payloads.',
      'Non-conforming outputs must trigger deterministic exception handlers and alert system administrators.'
    ],
    crossWalk: {
      nist: 'NIST SP 800-53 (SI-10, SA-11)',
      iso: 'ISO/IEC 42001:2023 A.8.4',
      omb: 'OMB M-24-10 Section 5(c)(v)',
      statutory: 'JSON Schema Draft 2020-12 / FIPS'
    }
  },
  {
    id: 'AR-03',
    pillarCode: 'AR',
    title: 'Continuous Adversarial Red-Teaming & Stress Testing',
    requirementLevel: 'MANDATORY',
    statement: 'Before deployment and semi-annually thereafter, production AI systems must undergo adversarial red-teaming conducted by certified independent third parties to probe for jailbreaks, policy violations, and safety harms.',
    detailedNotes: [
      'Red-team assessments must test for safety bypasses regarding hazardous materials, voter suppression, and unconstitutional search recommendations.',
      'Executive summaries of red-team reports must be filed with the executive oversight committee.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (MEASURE 2.5, MANAGE 4.1)',
      iso: 'ISO/IEC 42001:2023 A.9.3',
      omb: 'OMB M-24-10 Section 5(c)(ii)',
      statutory: 'White House Executive Order 14110'
    }
  },
  {
    id: 'AR-04',
    pillarCode: 'AR',
    title: 'Hallucination Rate Upper Bounds & Faithfulness Auditing',
    requirementLevel: 'REQUIRED',
    statement: 'High-assurance AI systems providing legal, tax, or statutory guidance must maintain a measured factual hallucination rate below 1.5% across standardized benchmark suites, with mandatory real-time grounding verification against certified statutes or regulations.',
    detailedNotes: [
      'Responses must cite exact section numbers from certified regulatory codes or official statutes.',
      'Un-grounded assertions must be filtered and replaced with a standard disclaimer referring the user to qualified human review.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (MEASURE 2.1, MAP 1.4)',
      iso: 'ISO/IEC 42001:2023 A.7.2',
      omb: 'OMB M-24-10 Section 5(c)(i)',
      statutory: 'Model Civic Accuracy Standard'
    }
  },

  // PILLAR 5: IDENTITY, ACCESS & AGENTIC SANDBOXING (IA)
  {
    id: 'IA-01',
    pillarCode: 'IA',
    title: 'Principle of Least Privilege for Autonomous Agents',
    requirementLevel: 'MUST',
    statement: 'Autonomous AI agents MUST be provisioned with granular, role-scoped API tokens with read-only permissions by default. Write and delete permissions to production databases require explicit supervisor authorization.',
    detailedNotes: [
      'Agents are prohibited from possessing superuser credentials or unrestricted database connection strings.',
      'Tool execution parameters must be restricted to pre-compiled allowlists matching current workflow needs.'
    ],
    crossWalk: {
      nist: 'NIST SP 800-53 (AC-6, SC-2)',
      iso: 'ISO/IEC 42001:2023 A.8.1',
      omb: 'OMB M-24-10 Section 5(a)(ii)',
      statutory: 'NIST SP 800-53 Rev. 5 AC-6'
    }
  },
  {
    id: 'IA-02',
    pillarCode: 'IA',
    title: 'Strict Separation of User Prompt & System Instruction',
    requirementLevel: 'MANDATORY',
    statement: 'Agentic architectures must physically separate system configuration instructions from untrusted user inputs using sandboxed context channels, preventing context bleeding or instruction contamination.',
    detailedNotes: [
      'User-provided content cannot modify core behavioral guidelines or access authorization tokens.',
      'Instruction boundaries must be enforced at the runtime harness level rather than relying solely on LLM prompt obedience.'
    ],
    crossWalk: {
      nist: 'NIST SP 800-53 (SC-7, AC-3)',
      iso: 'ISO/IEC 42001:2023 A.8.3',
      omb: 'OMB M-24-10 Section 5(b)(ii)',
      statutory: 'OWASP LLM01 Security Guidance'
    }
  },
  {
    id: 'IA-03',
    pillarCode: 'IA',
    title: 'Ephemeral Credential Gating for Agentic Tools',
    requirementLevel: 'REQUIRED',
    statement: 'All downstream API credentials utilized by agentic systems must be short-lived, ephemeral tokens (TTL < 15 minutes) issued by a centralized secrets manager with per-tool session rotation.',
    detailedNotes: [
      'Hardcoded API keys inside agent system prompts or memory buffers are strictly prohibited.',
      'Secrets manager must invalidate tokens immediately upon session termination or anomaly alert trigger.'
    ],
    crossWalk: {
      nist: 'NIST SP 800-53 (IA-5, SC-28)',
      iso: 'ISO/IEC 42001:2023 A.8.5',
      omb: 'OMB M-24-10 Section 5(a)(iii)',
      statutory: 'CIS Controls v8 (Control 6)'
    }
  },
  {
    id: 'IA-04',
    pillarCode: 'IA',
    title: 'Immutable Agentic Execution & State Trace Logging',
    requirementLevel: 'MANDATORY',
    statement: 'Every intermediate tool call, parameter valuation, external query, and state transition made by an autonomous agent MUST be captured in a tamper-evident, write-once audit log.',
    detailedNotes: [
      'Audit logs must allow complete deterministic playback of agent reasoning steps for judicial and regulatory inquiries.',
      'Logs must record the exact cryptographic hash of the model checkpoint executing the decision.'
    ],
    crossWalk: {
      nist: 'NIST SP 800-53 (AU-2, AU-12)',
      iso: 'ISO/IEC 42001:2023 A.9.1',
      omb: 'OMB M-24-10 Section 5(c)(iii)',
      statutory: 'Fed. R. Evid. 901 / CJIS 5.4'
    }
  },

  // PILLAR 6: BIAS AUDITING, DISPARATE IMPACT & FAIRNESS (BA)
  {
    id: 'BA-01',
    pillarCode: 'BA',
    title: 'Four-Fifths (80%) Rule Disparate Impact Threshold',
    requirementLevel: 'MUST',
    statement: 'AI systems utilized for scoring, employment, credit, prioritization, or resource allocation MUST be tested for disparate impact across protected classes (race, gender, age, disability). A selection or approval rate for any protected group below four-fifths (80%) of the highest group constitutes actionable non-compliance.',
    detailedNotes: [
      'Testing must evaluate demographic parity, equalized odds, and predictive parity against relevant demographic baselines.',
      'Systems failing the four-fifths rule must be immediately suspended from autonomous production use.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (MEASURE 2.3, GOVERN 1.2)',
      iso: 'ISO/IEC 42001:2023 A.7.3',
      omb: 'OMB M-24-10 Section 5(c)(i)',
      statutory: 'EEOC Uniform Guidelines (29 C.F.R. § 1607.4D)'
    }
  },
  {
    id: 'BA-02',
    pillarCode: 'BA',
    title: 'Pre-Deployment Demographic Parity Validation',
    requirementLevel: 'MANDATORY',
    statement: 'Prior to operational deployment, systems must pass synthetic demographic stress tests demonstrating consistent performance across diverse socio-economic, linguistic, and disability demographics.',
    detailedNotes: [
      'Evaluation benchmarks must include non-standard dialects (e.g., AAVE), non-native English queries, and screen-reader accessibility inputs.',
      'Validation results must be signed by a qualified data ethics statistician.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (MAP 1.3, MEASURE 2.10)',
      iso: 'ISO/IEC 42001:2023 A.8.2',
      omb: 'OMB M-24-10 Section 5(c)(iv)',
      statutory: 'Title VI of Civil Rights Act (42 U.S.C. § 2000d)'
    }
  },
  {
    id: 'BA-03',
    pillarCode: 'BA',
    title: 'Algorithmic Drift & Performance Decay Monitoring',
    requirementLevel: 'REQUIRED',
    statement: 'Production systems must feature automated statistical telemetry continuously tracking output distribution drift, false-positive rate divergence, and demographic classification disparities on a weekly rolling basis.',
    detailedNotes: [
      'Statistical drift exceeding 5% triggers automated administrative warnings and queues the system for human re-calibration.',
      'Longitudinal trend charts must be made accessible to compliance officers and governance auditors.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (MANAGE 4.2, MEASURE 2.4)',
      iso: 'ISO/IEC 42001:2023 A.9.2',
      omb: 'OMB M-24-10 Section 5(c)(vi)',
      statutory: 'Colorado SB 205 (Consumer Protection in AI)'
    }
  },
  {
    id: 'BA-04',
    pillarCode: 'BA',
    title: 'Independent Algorithmic Bias & Disparity Audits',
    requirementLevel: 'MANDATORY',
    statement: 'Annual independent algorithmic audits must be commissioned by the board of directors, audit committee, or oversight body, examining the live real-world outcomes of the deployed model.',
    detailedNotes: [
      'Auditors must have full access to raw input logs, output scores, and ground-truth human adjudications.',
      'Audit reports must be delivered directly to the governing oversight body without prior vendor censorship.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (GOVERN 5.2, MANAGE 2.4)',
      iso: 'ISO/IEC 42001:2023 A.9.3',
      omb: 'OMB M-24-10 Section 5(c)(ii)',
      statutory: 'NYC Local Law 144 / Civil Rights Standard'
    }
  },

  // PILLAR 7: STATUTORY COMPLIANCE & LEGAL LIABILITY (LE)
  {
    id: 'LE-01',
    pillarCode: 'LE',
    title: 'High-Risk AI System Classification & Tiering',
    requirementLevel: 'MUST',
    statement: 'Deploying organizations must formally classify all algorithmic systems into statutory risk tiers aligned with the EU AI Act, NIST AI RMF, and White House OMB M-24-10. Systems affecting critical infrastructure, law enforcement, or statutory entitlements are classified High-Risk by law.',
    detailedNotes: [
      'High-Risk systems require mandatory pre-deployment conformity assessments and ongoing legal/compliance oversight.',
      'Unacceptable Risk systems (e.g. social credit scoring, real-time public biometric identification) are prohibited.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (GOVERN 1.1, MAP 1.1)',
      iso: 'ISO/IEC 42001:2023 A.5.2',
      omb: 'OMB M-24-10 Section 5(c)',
      statutory: 'EU AI Act Regulation 2024/1689 Annex III'
    }
  },
  {
    id: 'LE-02',
    pillarCode: 'LE',
    title: 'Vendor vs. Deployer Joint & Several Liability Allocation',
    requirementLevel: 'MANDATORY',
    statement: 'AI procurement and licensing contracts MUST contain express indemnification provisions holding vendors financially and legally liable for algorithmic errors resulting from flawed training data, algorithmic bias, or defective model architecture.',
    detailedNotes: [
      'Vendors cannot disclaim warranties of fitness for high-assurance, commercial, or adjudicative use in enterprise contracts.',
      'Contractual clauses attempting to shift product liability or constitutional non-compliance entirely onto deployers are void.'
    ],
    crossWalk: {
      nist: 'NIST SP 800-53 (SA-9)',
      iso: 'ISO/IEC 42001:2023 A.5.3',
      omb: 'OMB M-24-10 Section 5(c)(iv)',
      statutory: 'Uniform Commercial Code § 2-315 / Tort Precedent'
    }
  },
  {
    id: 'LE-03',
    pillarCode: 'LE',
    title: 'Mandatory Pre-Deployment AI Impact Assessment (AIA)',
    requirementLevel: 'MANDATORY',
    statement: 'Prior to procuring or executing an AI tool, the sponsoring agency must publish an Algorithmic Impact Assessment (AIA) evaluating necessity, proportionality, civil liberties risks, and alternative non-automated approaches.',
    detailedNotes: [
      'AIA must include a formal public notice and 30-day citizen comment period before council authorization vote.',
      'Re-assessment required whenever significant software updates or model fine-tuning occurs.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (MAP 1.2, GOVERN 2.3)',
      iso: 'ISO/IEC 42001:2023 A.6.2',
      omb: 'OMB M-24-10 Section 5(c)(i)',
      statutory: 'Colorado SB 205 (Impact Assessment Mandate)'
    }
  },
  {
    id: 'LE-04',
    pillarCode: 'LE',
    title: 'Copyright & Training Data Infringement Indemnification',
    requirementLevel: 'REQUIRED',
    statement: 'Commercial AI vendors must provide clients with full intellectual property defense and indemnification against third-party copyright, trade secret, or privacy infringement claims arising from model training or outputs.',
    detailedNotes: [
      'Protects deployer budgets against costly copyright class actions regarding foundation model training datasets.',
      'Vendor must maintain active errors and omissions (E&O) insurance covering algorithmic outputs.'
    ],
    crossWalk: {
      nist: 'NIST SP 800-53 (SA-9, PS-7)',
      iso: 'ISO/IEC 42001:2023 A.5.1',
      omb: 'OMB M-24-10 Section 5(c)(iv)',
      statutory: 'Federal Copyright Act (17 U.S.C. § 501)'
    }
  },

  // PILLAR 8: PUBLIC RECORDS, MODEL REGISTRY & CIVIC TRANSPARENCY (PT)
  {
    id: 'PT-01',
    pillarCode: 'PT',
    title: 'Centralized AI Algorithm & System Registry',
    requirementLevel: 'MUST',
    statement: 'Every deploying organization MUST maintain a centralized, searchable registry cataloging all automated decision systems, predictive algorithms, and LLM implementations deployed across operational departments.',
    detailedNotes: [
      'Registry listings must include vendor name, contract cost, policy objective, input data sources, and date of last bias audit.',
      'Stakeholders must be able to search the registry by operating department or business unit.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (GOVERN 5.1, MAP 3.2)',
      iso: 'ISO/IEC 42001:2023 A.7.1',
      omb: 'OMB M-24-10 Section 5(a)(i)',
      statutory: 'California AB 2013 / Local Algorithmic Transparency'
    }
  },
  {
    id: 'PT-02',
    pillarCode: 'PT',
    title: 'Standardized AI System Cards & Model Transparency Disclosures',
    requirementLevel: 'MANDATORY',
    statement: 'Each deployed system must publish a standardized, plain-language AI System Card disclosing model architecture, known limitations, out-of-scope uses, benchmark evaluation scores, and contact information for oversight inquiries.',
    detailedNotes: [
      'System Cards must be updated annually or within 30 days of significant model retargeting.',
      'Must clearly enumerate what decisions the model is explicitly prohibited from making autonomously.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (MEASURE 2.12, GOVERN 5.1)',
      iso: 'ISO/IEC 42001:2023 A.7.2',
      omb: 'OMB M-24-10 Section 5(a)(i)',
      statutory: 'NIST AI 100-2e2023 (Model Cards)'
    }
  },
  {
    id: 'PT-03',
    pillarCode: 'PT',
    title: 'Open Records FOIA Readiness for Decision Logs',
    requirementLevel: 'REQUIRED',
    statement: 'System prompts, retrieval embeddings indices, and administrative execution logs MUST be structured to allow rapid, automated public disclosure under state Freedom of Information Acts (FOIA / Public Records Acts).',
    detailedNotes: [
      'Deterministic masking engines must sanitize PII while releasing the substantive scoring logic and administrative rationale.',
      'Deploying organizations cannot enter into vendor contracts that restrict regulatory or statutory disclosure of system prompts or evaluation metrics.'
    ],
    crossWalk: {
      nist: 'NIST SP 800-53 (PT-2, SC-28)',
      iso: 'ISO/IEC 42001:2023 A.7.3',
      omb: 'OMB M-24-10 Section 5(a)(i)',
      statutory: 'Freedom of Information Act (5 U.S.C. § 552)'
    }
  },
  {
    id: 'PT-04',
    pillarCode: 'PT',
    title: 'Trade Secret Limitation & Decision Formula Disclosure',
    requirementLevel: 'MUST',
    statement: 'Commercial vendors are prohibited from asserting trade secret or proprietary privilege to conceal the scoring formulas, weighting factors, or training data distributions of algorithms used in public criminal justice, housing, or child welfare determinations.',
    detailedNotes: [
      'In criminal proceedings, defense counsel must be granted access to the underlying algorithmic source code under protective order.',
      'Public interest in constitutional due process strictly supersedes commercial trade secret confidentiality.'
    ],
    crossWalk: {
      nist: 'NIST AI RMF (GOVERN 1.2, MAP 3.1)',
      iso: 'ISO/IEC 42001:2023 A.5.2',
      omb: 'OMB M-24-10 Section 5(c)(v)',
      statutory: 'Brady v. Maryland, 373 U.S. 83 (1963)'
    }
  }
];

export const RAIJ_CROSSWALK_MATRIX: CrossWalkItem[] = [
  {
    controlId: 'DP-01',
    controlName: 'Meaningful Explanation & Contestability',
    pillar: 'Due Process',
    nist: 'AI RMF (GOVERN 1.2, MAP 3.1)',
    iso: 'ISO/IEC 42001 A.7.2',
    omb: 'OMB M-24-10 Sec. 5(c)(v)(C)',
    statutory: 'U.S. Const. Amend. XIV / FCRA § 609'
  },
  {
    controlId: 'DP-02',
    controlName: 'Mandatory Human-in-the-Loop Gate',
    pillar: 'Due Process',
    nist: 'AI RMF (MANAGE 2.4, GOVERN 2.2)',
    iso: 'ISO/IEC 42001 A.8.4',
    omb: 'OMB M-24-10 Sec. 5(c)(v)(A)',
    statutory: 'EU AI Act Art. 14 (Human Oversight)'
  },
  {
    controlId: 'PS-01',
    controlName: 'Cryptographic Checkpoint Signing',
    pillar: 'Model Provenance',
    nist: 'NIST SP 800-53 (SI-7, SA-11)',
    iso: 'ISO/IEC 42001 A.10.1',
    omb: 'OMB M-24-10 Sec. 5(b)(ii)',
    statutory: 'FIPS 140-3 / EO 14110'
  },
  {
    controlId: 'PS-02',
    controlName: 'AI Software Bill of Materials (AIBOM)',
    pillar: 'Model Provenance',
    nist: 'NIST SP 800-161 (SA-12)',
    iso: 'ISO/IEC 42001 A.9.1',
    omb: 'OMB M-24-10 Sec. 5(c)(iv)',
    statutory: 'CycloneDX 1.5 Specification'
  },
  {
    controlId: 'DI-01',
    controlName: 'Corpus Sanitization & Expungement',
    pillar: 'Data Integrity',
    nist: 'NIST SP 800-53 (MP-6, PT-2)',
    iso: 'ISO/IEC 42001 A.8.3',
    omb: 'OMB M-24-10 Sec. 5(c)(v)(B)',
    statutory: 'Privacy Act of 1974 (5 U.S.C. § 552a)'
  },
  {
    controlId: 'DI-02',
    controlName: 'Differential Privacy & Anti-Extraction',
    pillar: 'Data Integrity',
    nist: 'NIST AI RMF (MEASURE 2.7)',
    iso: 'ISO/IEC 42001 A.8.5',
    omb: 'OMB M-24-10 Sec. 5(b)(iii)',
    statutory: 'NIST SP 800-188 De-Identification'
  },
  {
    controlId: 'AR-01',
    controlName: 'Prompt Injection Firewalls',
    pillar: 'Adversarial Robustness',
    nist: 'NIST AI RMF (MEASURE 2.7)',
    iso: 'ISO/IEC 42001 A.6.1',
    omb: 'OMB M-24-10 Sec. 5(b)(ii)',
    statutory: 'OWASP Top 10 for LLM (LLM01)'
  },
  {
    controlId: 'AR-02',
    controlName: 'Deterministic Schema Conformance',
    pillar: 'Adversarial Robustness',
    nist: 'NIST SP 800-53 (SI-10, SA-11)',
    iso: 'ISO/IEC 42001 A.8.4',
    omb: 'OMB M-24-10 Sec. 5(c)(v)',
    statutory: 'JSON Schema Draft 2020-12 / FIPS'
  },
  {
    controlId: 'IA-01',
    controlName: 'Least Privilege for Autonomous Agents',
    pillar: 'Agentic Sandboxing',
    nist: 'NIST SP 800-53 (AC-6, SC-2)',
    iso: 'ISO/IEC 42001 A.8.1',
    omb: 'OMB M-24-10 Sec. 5(a)(ii)',
    statutory: 'NIST SP 800-53 Rev. 5 AC-6'
  },
  {
    controlId: 'IA-04',
    controlName: 'Immutable Execution Trace Logging',
    pillar: 'Agentic Sandboxing',
    nist: 'NIST SP 800-53 (AU-2, AU-12)',
    iso: 'ISO/IEC 42001 A.9.1',
    omb: 'OMB M-24-10 Sec. 5(c)(iii)',
    statutory: 'Fed. R. Evid. 901 / CJIS 5.4'
  },
  {
    controlId: 'BA-01',
    controlName: 'Four-Fifths Rule Disparate Impact',
    pillar: 'Bias & Fairness',
    nist: 'NIST AI RMF (MEASURE 2.3)',
    iso: 'ISO/IEC 42001 A.7.3',
    omb: 'OMB M-24-10 Sec. 5(c)(i)',
    statutory: 'EEOC Uniform Guidelines (29 CFR § 1607)'
  },
  {
    controlId: 'BA-04',
    controlName: 'Independent Civilian Bias Audits',
    pillar: 'Bias & Fairness',
    nist: 'NIST AI RMF (GOVERN 5.2)',
    iso: 'ISO/IEC 42001 A.9.3',
    omb: 'OMB M-24-10 Sec. 5(c)(ii)',
    statutory: 'NYC Local Law 144 / Civil Rights Act'
  },
  {
    controlId: 'LE-01',
    controlName: 'High-Risk Civic AI Classification',
    pillar: 'Statutory Compliance',
    nist: 'NIST AI RMF (GOVERN 1.1, MAP 1.1)',
    iso: 'ISO/IEC 42001 A.5.2',
    omb: 'OMB M-24-10 Sec. 5(c)',
    statutory: 'EU AI Act Annex III / Colorado SB 205'
  },
  {
    controlId: 'LE-02',
    controlName: 'Vendor vs Deployer Joint Liability',
    pillar: 'Statutory Compliance',
    nist: 'NIST SP 800-53 (SA-9)',
    iso: 'ISO/IEC 42001 A.5.3',
    omb: 'OMB M-24-10 Sec. 5(c)(iv)',
    statutory: 'UCC § 2-315 / Strict Products Liability'
  },
  {
    controlId: 'PT-01',
    controlName: 'Public Municipal AI Registry',
    pillar: 'Public Registry & FOIA',
    nist: 'NIST AI RMF (GOVERN 5.1)',
    iso: 'ISO/IEC 42001 A.7.1',
    omb: 'OMB M-24-10 Sec. 5(a)(i)',
    statutory: 'California AB 2013 / Open Data Standards'
  },
  {
    controlId: 'PT-04',
    controlName: 'Trade Secret Limitation in Criminal Justice',
    pillar: 'Public Registry & FOIA',
    nist: 'NIST AI RMF (GOVERN 1.2, MAP 3.1)',
    iso: 'ISO/IEC 42001 A.5.2',
    omb: 'OMB M-24-10 Sec. 5(c)(v)',
    statutory: 'Brady v. Maryland, 373 U.S. 83 (1963)'
  }
];

export const RAIJ_ROLLOUT_PHASES: RolloutPhase[] = [
  {
    phase: 1,
    title: 'Pre-Deployment Algorithmic Impact & Risk Tiering',
    summary: 'Classify systems against High-Risk statutory categories, enact municipal Algorithmic Due Process Ordinance, and complete initial Algorithmic Impact Assessment (AIA).',
    timeframe: 'Days 1 – 30',
    targetMilestones: [
      'Conduct statutory High-Risk categorization under OMB M-24-10 & EU AI Act (LE-01).',
      'Enact municipal Algorithmic Due Process & Accountability Ordinance.',
      'Publish pre-deployment Algorithmic Impact Assessment with 30-day public comment (LE-03).',
      'Contractually enforce vendor joint-and-several indemnification and AIBOM disclosure (LE-02, PS-02).'
    ],
    responsibleStakeholders: [
      'City Council / County Commissioners',
      'City Attorney / Legal Counsel',
      'Municipal AI Ethics Officer / CIO'
    ]
  },
  {
    phase: 2,
    title: 'Model Architecture, Cryptography & Sandboxing',
    summary: 'Enforce cryptographic checkpoint signatures (PS-01), implement prompt injection firewalls (AR-01), configure ephemeral API gating (IA-03), and sanitize training corpora (DI-01).',
    timeframe: 'Days 31 – 60',
    targetMilestones: [
      'Verify Ed25519 cryptographic signatures on model weight checkpoints (PS-01).',
      'Deploy dual-layer input prompt injection firewall and schema conformance parser (AR-01, AR-02).',
      'Configure principle of least privilege with ephemeral short-lived API tokens for agentic tools (IA-01, IA-03).',
      'Sanitize vector stores and training corpora against PII and expunged records (DI-01).'
    ],
    responsibleStakeholders: [
      'Municipal Information Security Officer (CISO)',
      'Lead AI Platform Engineer / Vendor Technical Lead',
      'Database & Records Administrator'
    ]
  },
  {
    phase: 3,
    title: 'Adversarial Red-Teaming & Demographic Disparity Testing',
    summary: 'Execute external red-teaming for jailbreaks and safety bypasses (AR-03), conduct synthetic demographic stress-testing (BA-02), and verify 4/5ths rule compliance (BA-01).',
    timeframe: 'Days 61 – 90',
    targetMilestones: [
      'Engage certified third-party red team to execute adversarial jailbreak and extraction probes (AR-03).',
      'Validate demographic parity across race, gender, and disability categories against the 80% rule (BA-01).',
      'Verify factual grounding mechanisms to cap hallucination rates below 1.5% (AR-04).',
      'Establish human-in-the-loop (HITL) adjudicative decision gate workflows (DP-02).'
    ],
    responsibleStakeholders: [
      'Independent AI Red-Teaming Auditor',
      'Municipal Chief Equity Officer',
      'Departmental Operational Supervisors'
    ]
  },
  {
    phase: 4,
    title: 'Continuous Oversight, Registry & Civilian Tribunal',
    summary: 'Launch Public Municipal AI Registry (PT-01), activate automated drift monitoring (BA-03), establish WORM execution logging (IA-04), and institute citizen appeal tribunals (DP-04).',
    timeframe: 'Day 91 Onward (Continuous)',
    targetMilestones: [
      'Publish public Municipal AI Algorithm Registry and standardized AI System Cards (PT-01, PT-02).',
      'Activate automated weekly drift monitoring and threshold alerting (BA-03).',
      'Deploy WORM immutable logging for all intermediate agentic tool executions (IA-04).',
      'Convene annual civilian independent algorithmic disparity review (BA-04).'
    ],
    responsibleStakeholders: [
      'Civilian Algorithmic Oversight Board',
      'Administrative Law Judges / Hearing Officers',
      'Chief Technology Officer / Municipal Clerk'
    ]
  }
];

export const RAIJ_RAW_MARKDOWN = `# Responsible AI Jurisprudence & Secure Deployment Control Framework (RAIJ-CSF)
**Baseline Security, Algorithmic Due Process, Model Provenance, and Agentic Safety Standard for High-Assurance AI Deployments (Enterprise, Defense, Autonomous Systems & Public Enclaves)**

## 1. Executive Summary & Purpose
The Responsible AI Jurisprudence & Secure Deployment Control Framework (RAIJ-CSF) provides enterprise engineering leaders, security architects, legal/GRC compliance officers, and public sector auditors with an open, vendor-agnostic control standard for developing, procuring, evaluating, and operating artificial intelligence and agentic systems. By synthesizing technical cybersecurity, algorithmic due process, anti-poisoning defenses, disparate impact jurisprudence, and statutory accountability (EU AI Act, White House OMB M-24-10, NIST AI RMF 1.0, ISO/IEC 42001), RAIJ-CSF ensures that high-assurance AI operates strictly within provable safety, statutory compliance, and ethical boundaries across both commercial and public deployments.

---

## 2. Framework Architecture & Pillars
1. **Pillar 1: Algorithmic Due Process & Explainability (DP)** — Counterfactual explanations, adjudicative contestability, anti-blackbox mandates, and mandatory human-in-the-loop (HITL) gates.
2. **Pillar 2: Model Provenance, Supply Chain & AIBOM (PS)** — Cryptographic checkpoint signatures, AI Software Bill of Materials (AIBOM), training data licensing, and open-weights sandboxing.
3. **Pillar 3: Data Integrity, Privacy & Anti-Poisoning (DI)** — Corpus sanitization, differential privacy bounds, synthetic data limits, and out-of-distribution injection filters.
4. **Pillar 4: Red-Teaming, Jailbreak & Adversarial Robustness (AR)** — Direct and indirect prompt injection firewalls, deterministic schema conformance, continuous red-teaming, and hallucination bounds.
5. **Pillar 5: Identity, Access & Agentic Sandboxing (IA)** — Principle of least privilege for autonomous agents, prompt-system context separation, ephemeral credentials, and WORM execution trace logging.
6. **Pillar 6: Bias Auditing, Disparate Impact & Fairness (BA)** — Four-fifths (80%) rule disparity testing, pre-deployment demographic parity, drift monitoring, and independent civilian audits.
7. **Pillar 7: Statutory Compliance & Legal Liability (LE)** — High-Risk civic AI classification, vendor vs. deployer joint liability, mandatory Algorithmic Impact Assessments (AIA), and IP indemnification.
8. **Pillar 8: Public Records, Model Registry & Transparency (PT)** — Public Municipal AI Algorithm Registry, AI System Cards, FOIA readiness for decision logs, and trade secret limitations in justice systems.

---

## 3. Detailed Control Specifications

### Pillar 1: Algorithmic Due Process & Explainability (DP)
* **DP-01: Right to Meaningful Explanation & Adjudicative Contestability:** Any public algorithmic system affecting civil liberties, benefits eligibility, housing, child welfare, or criminal sentencing MUST output human-comprehensible, deterministic rationales identifying decisive legal and factual factors.
* **DP-02: Mandatory Human-in-the-Loop (HITL) Adjudicative Gate:** No adverse public administrative or legal action may be executed solely through autonomous AI execution. A credentialed human officer MUST conduct independent substantive review and retain final authority to reject model outputs.
* **DP-03: Anti-Blackbox & Auditable Decision Lineage Mandate:** Algorithms deployed in adjudicative proceedings MUST possess fully traceable, mathematically auditable decision trees or certified surrogate explainability models. Fully opaque deep ensembles are prohibited in judicial risk scoring.
* **DP-04: Adversarial Citizen Appeal & Rebuttal Protocol:** Municipalities must provide affected individuals with a standardized, cost-free mechanism to appeal algorithmic decisions to an administrative law judge or civilian tribunal within 30 days.

### Pillar 2: Model Provenance, Supply Chain & AIBOM (PS)
* **PS-01: Cryptographic Checkpoint Signing & Tamper Verification:** All model weights, LoRA adapters, and embedding matrices deployed in municipal infrastructure MUST be signed with cryptographic keys (Ed25519) and verified against public ledger checkpoint hashes prior to runtime initialization.
* **PS-02: AI Software Bill of Materials (AIBOM) Requirement:** Vendors must deliver a machine-readable AIBOM (CycloneDX 1.5 or SPDX AI profile) detailing foundation model ancestry, pre-training dataset hashes, fine-tuning checkpoints, and third-party orchestration dependencies.
* **PS-03: Training Corpus Licensing & Provenance Attestation:** Vendors must provide certified legal attestation that pre-training and fine-tuning datasets do not incorporate non-consensual biometric data, stolen intellectual property, or pirated databases.
* **PS-04: Open-Weights Sandboxing & Model Registry Mandate:** Municipal agencies must maintain a centralized, version-controlled model registry cataloging every production AI artifact, deployment location, API endpoint, and containerized runtime sandbox.

### Pillar 3: Data Integrity, Privacy & Anti-Poisoning (DI)
* **DI-01: Training & Retrieval Corpus Sanitization:** RAG vector stores and fine-tuning corpora containing municipal data MUST be cryptographically scrubbed of unredacted juvenile records, sealed criminal dockets, and PII before embedding generation.
* **DI-02: PII Extraction & Differential Privacy Safeguards:** Models exposed to external public interfaces must be validated against membership inference attacks and verbatim memorization extraction using differential privacy bounds (epsilon < 1.0) or certified canary probing.
* **DI-03: Synthetic Data Degradation & Lineage Limits:** The use of synthetic training data must be explicitly labeled, cataloged, and capped to prevent model collapse, synthetic data loops, and statistical bias reinforcement in municipal scoring engines.
* **DI-04: Anti-Poisoning & Out-of-Distribution Validation:** Municipal RAG pipelines and continuous-learning pipelines must deploy out-of-distribution (OOD) anomaly filters to prevent adversarial data injection into municipal knowledge bases.

### Pillar 4: Red-Teaming, Jailbreak & Adversarial Robustness (AR)
* **AR-01: Direct & Indirect Prompt Injection Firewalls:** Publicly accessible or document-processing AI systems MUST implement layered input sanitization and semantic firewalls capable of neutralizing both direct system prompt overrides and indirect injections hidden in processed documents.
* **AR-02: Deterministic Output Validation & Schema Conformance:** AI model outputs that trigger downstream software executions, database queries, or civic service actions MUST be strictly validated against typed JSON schemas prior to execution. Free-form text execution is prohibited.
* **AR-03: Continuous Adversarial Red-Teaming & Stress Testing:** Before deployment and semi-annually thereafter, municipal AI systems must undergo adversarial red-teaming conducted by certified independent third parties.
* **AR-04: Hallucination Rate Upper Bounds & Faithfulness Auditing:** Civic AI systems providing legal, tax, or statutory guidance must maintain a measured factual hallucination rate below 1.5% across standardized benchmark suites, with mandatory real-time grounding verification.

### Pillar 5: Identity, Access & Agentic Sandboxing (IA)
* **IA-01: Principle of Least Privilege for Autonomous Agents:** Autonomous AI agents MUST be provisioned with granular, role-scoped API tokens with read-only permissions by default. Write and delete permissions to municipal databases require explicit supervisor authorization.
* **IA-02: Strict Separation of User Prompt & System Instruction:** Agentic architectures must physically separate system configuration instructions from untrusted citizen inputs using sandboxed context channels.
* **IA-03: Ephemeral Credential Gating for Agentic Tools:** All downstream API credentials utilized by agentic systems must be short-lived, ephemeral tokens (TTL < 15 minutes) issued by a centralized secrets manager.
* **IA-04: Immutable Agentic Execution & State Trace Logging:** Every intermediate tool call, parameter valuation, external query, and state transition made by an autonomous agent MUST be captured in a tamper-evident, write-once audit log.

### Pillar 6: Bias Auditing, Disparate Impact & Fairness (BA)
* **BA-01: Four-Fifths (80%) Rule Disparate Impact Threshold:** Municipal AI systems utilized for scoring, prioritization, or resource allocation MUST be tested for disparate impact across protected classes. A selection rate for any protected group below 80% of the highest group constitutes actionable non-compliance.
* **BA-02: Pre-Deployment Demographic Parity Validation:** Prior to municipal deployment, systems must pass synthetic demographic stress tests demonstrating consistent performance across diverse socio-economic, linguistic, and disability demographics.
* **BA-03: Algorithmic Drift & Performance Decay Monitoring:** Production systems must feature automated statistical telemetry continuously tracking output distribution drift, false-positive rate divergence, and demographic classification disparities on a weekly rolling basis.
* **BA-04: Independent Civilian Bias & Disparity Audits:** Annual independent algorithmic audits must be commissioned by the city council or civilian human rights commission, examining live real-world outcomes on local residents.

### Pillar 7: Statutory Compliance & Legal Liability (LE)
* **LE-01: High-Risk Civic AI Classification & Tiering:** Municipal agencies must formally classify all algorithmic systems into statutory risk tiers aligned with the EU AI Act and White House OMB M-24-10.
* **LE-02: Vendor vs. Deployer Joint & Several Liability Allocation:** Municipal AI procurement contracts MUST contain express indemnification provisions holding vendors financially and legally liable for algorithmic errors resulting from flawed training data or algorithmic bias.
* **LE-03: Mandatory Pre-Deployment AI Impact Assessment (AIA):** Prior to procuring or executing an AI tool, the sponsoring agency must publish an Algorithmic Impact Assessment (AIA) evaluating necessity, proportionality, and civil liberties risks.
* **LE-04: Copyright & Training Data Infringement Indemnification:** Commercial AI vendors must provide municipal clients with full intellectual property defense and indemnification against third-party copyright or privacy claims.

### Pillar 8: Public Records, Model Registry & Civic Transparency (PT)
* **PT-01: Public Municipal AI Algorithm & System Registry:** Every municipality MUST maintain a publicly accessible, searchable online registry cataloging all automated decision systems, predictive algorithms, and LLM implementations deployed across city departments.
* **PT-02: Standardized AI System Cards & Model Transparency Disclosures:** Each deployed system must publish a standardized, plain-language AI System Card disclosing model architecture, known limitations, out-of-scope uses, and benchmark evaluation scores.
* **PT-03: Open Records FOIA Readiness for Decision Logs:** System prompts, retrieval embeddings indices, and administrative execution logs MUST be structured to allow rapid, automated public disclosure under state Freedom of Information Acts.
* **PT-04: Trade Secret Limitation & Decision Formula Disclosure:** Commercial vendors are prohibited from asserting trade secret or proprietary privilege to conceal scoring formulas or weighting factors used in public criminal justice, housing, or child welfare determinations.

---

## 4. Industry Framework Cross-Walk Matrix

| Framework Control ID | NIST AI RMF 1.0 / SP 800-53 | ISO/IEC 42001:2023 | White House OMB M-24-10 | Statutory Precedent & Civil Rights Standard |
| :--- | :--- | :--- | :--- | :--- |
| **DP-01** (Explainability & Contestability) | AI RMF (GOVERN 1.2, MAP 3.1) | ISO/IEC 42001 A.7.2 | OMB M-24-10 Sec. 5(c)(v)(C) | U.S. Const. Amend. XIV / FCRA § 609 |
| **DP-02** (Mandatory HITL Gate) | AI RMF (MANAGE 2.4, GOVERN 2.2) | ISO/IEC 42001 A.8.4 | OMB M-24-10 Sec. 5(c)(v)(A) | EU AI Act Art. 14 (Human Oversight) |
| **PS-01** (Cryptographic Weight Signing) | NIST SP 800-53 (SI-7, SA-11) | ISO/IEC 42001 A.10.1 | OMB M-24-10 Sec. 5(b)(ii) | FIPS 140-3 / EO 14110 |
| **PS-02** (AI Software Bill of Materials) | NIST SP 800-161 (SA-12) | ISO/IEC 42001 A.9.1 | OMB M-24-10 Sec. 5(c)(iv) | CycloneDX 1.5 Specification |
| **DI-01** (Corpus Sanitization & Expungement)| NIST SP 800-53 (MP-6, PT-2) | ISO/IEC 42001 A.8.3 | OMB M-24-10 Sec. 5(c)(v)(B) | Privacy Act of 1974 (5 U.S.C. § 552a) |
| **DI-02** (Differential Privacy Safeguards) | NIST AI RMF (MEASURE 2.7) | ISO/IEC 42001 A.8.5 | OMB M-24-10 Sec. 5(b)(iii) | NIST SP 800-188 De-Identification |
| **AR-01** (Prompt Injection Firewalls) | NIST AI RMF (MEASURE 2.7) | ISO/IEC 42001 A.6.1 | OMB M-24-10 Sec. 5(b)(ii) | OWASP Top 10 for LLM (LLM01) |
| **AR-02** (Deterministic Schema Conformance)| NIST SP 800-53 (SI-10, SA-11) | ISO/IEC 42001 A.8.4 | OMB M-24-10 Sec. 5(c)(v) | JSON Schema Draft 2020-12 / FIPS |
| **IA-01** (Least Privilege for Agents) | NIST SP 800-53 (AC-6, SC-2) | ISO/IEC 42001 A.8.1 | OMB M-24-10 Sec. 5(a)(ii) | NIST SP 800-53 Rev. 5 AC-6 |
| **IA-04** (Immutable Execution Trace Logs) | NIST SP 800-53 (AU-2, AU-12) | ISO/IEC 42001 A.9.1 | OMB M-24-10 Sec. 5(c)(iii) | Fed. R. Evid. 901 / CJIS 5.4 |
| **BA-01** (Four-Fifths Rule Disparity) | NIST AI RMF (MEASURE 2.3) | ISO/IEC 42001 A.7.3 | OMB M-24-10 Sec. 5(c)(i) | EEOC Uniform Guidelines (29 CFR § 1607) |
| **BA-04** (Independent Civilian Audits) | NIST AI RMF (GOVERN 5.2) | ISO/IEC 42001 A.9.3 | OMB M-24-10 Sec. 5(c)(ii) | NYC Local Law 144 / Civil Rights Act |
| **LE-01** (High-Risk Civic AI Classification)| NIST AI RMF (GOVERN 1.1) | ISO/IEC 42001 A.5.2 | OMB M-24-10 Sec. 5(c) | EU AI Act Annex III / Colorado SB 205 |
| **LE-02** (Vendor vs Deployer Liability) | NIST SP 800-53 (SA-9) | ISO/IEC 42001 A.5.3 | OMB M-24-10 Sec. 5(c)(iv) | UCC § 2-315 / Products Liability |
| **PT-01** (Public Municipal AI Registry) | NIST AI RMF (GOVERN 5.1) | ISO/IEC 42001 A.7.1 | OMB M-24-10 Sec. 5(a)(i) | California AB 2013 / Open Data |
| **PT-04** (Trade Secret Limits in Justice) | NIST AI RMF (GOVERN 1.2) | ISO/IEC 42001 A.5.2 | OMB M-24-10 Sec. 5(c)(v) | Brady v. Maryland, 373 U.S. 83 (1963) |

---

## 5. Implementation & Phased Rollout (90-Day Roadmap)
1. **Phase 1: Pre-Deployment Algorithmic Impact & Risk Tiering (Days 1–30):** Classify systems against High-Risk statutory categories, enact municipal Algorithmic Due Process Ordinance, and complete initial Algorithmic Impact Assessment (AIA).
2. **Phase 2: Model Architecture, Cryptography & Sandboxing (Days 31–60):** Enforce cryptographic checkpoint signatures (PS-01), implement prompt injection firewalls (AR-01), configure ephemeral API gating (IA-03), and sanitize training corpora (DI-01).
3. **Phase 3: Adversarial Red-Teaming & Demographic Disparity Testing (Days 61–90):** Execute external red-teaming for jailbreaks and safety bypasses (AR-03), conduct synthetic demographic stress-testing (BA-02), and verify 4/5ths rule compliance (BA-01).
4. **Phase 4: Continuous Oversight, Registry & Civilian Tribunal (Day 91 Onward):** Launch Public Municipal AI Registry (PT-01), activate automated drift monitoring (BA-03), establish WORM execution logging (IA-04), and institute citizen appeal tribunals (DP-04).
`;

export const RAIJ_CSF_FRAMEWORK: GovernanceFrameworkMeta = {
  id: 'raij-csf',
  code: 'RAIJ-CSF',
  title: 'Responsible AI Jurisprudence & Secure Deployment Control Framework',
  subtitle: 'Baseline Security, Algorithmic Due Process, Model Provenance, and Agentic Safety Standard for High-Assurance AI Deployments (Enterprise, Defense, Autonomous Systems & Public Enclaves)',
  version: '1.0.0 (Experimental)',
  status: 'Active Standard',
  category: 'Computer Vision & AI',
  executiveSummary: 'The Responsible AI Jurisprudence & Secure Deployment Control Framework (RAIJ-CSF) provides enterprise engineering leaders, security architects, legal/GRC compliance officers, and public sector auditors with an open, vendor-agnostic control standard for developing, procuring, evaluating, and operating artificial intelligence and agentic systems. By synthesizing technical cybersecurity, algorithmic due process, anti-poisoning defenses, disparate impact jurisprudence, and statutory accountability (EU AI Act, White House OMB M-24-10, NIST AI RMF 1.0, ISO/IEC 42001), RAIJ-CSF ensures that high-assurance AI operates strictly within provable safety, statutory compliance, and ethical boundaries across both commercial and public deployments.',
  scope: 'Applicable to enterprise foundation models, autonomous agentic workflows, automated decisioning/underwriting engines, predictive risk assessment tools, mission-critical workflow agents, and public sector algorithmic enclaves. Fully vendor-agnostic (OpenAI, Anthropic, Google Vertex, AWS Bedrock, HuggingFace, self-hosted open-weights models like Llama/Mistral, or proprietary neural networks).',
  targetAudience: [
    'Chief Technology Officers & VP of Engineering',
    'Chief Information Security Officers & AI Red Teams',
    'General Counsels, GRC Directors & AI Compliance Officers',
    'Enterprise Architects & Machine Learning Operations (MLOps) Leads',
    'Public Sector CIOs, Agency Regulators & Oversight Bodies',
    'Civil Liberties, Legal Advocates & Risk Auditors'
  ],
  pillars: RAIJ_PILLARS,
  controls: RAIJ_CONTROLS,
  crossWalk: RAIJ_CROSSWALK_MATRIX,
  rolloutPhases: RAIJ_ROLLOUT_PHASES,
  markdownExport: RAIJ_RAW_MARKDOWN
};
