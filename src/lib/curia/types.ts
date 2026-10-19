/**
 * Exultia Curia - Cryptographically Defensible Civic Governance & Voting Platform
 * Core TypeScript Data Models & Primitives
 * 
 * Compliant with:
 * - RFC 6962: Certificate Transparency / Binary Merkle Append-Only Tree
 * - Federal Rules of Evidence (FRE) 902(13) & 902(14): Self-Authenticating Electronic Records
 * - Robert's Rules of Order Newly Revised (12th Ed.) Parliamentary Procedure
 * - Statutory Open Meeting Acts (e.g., California Brown Act § 54950, Florida Sunshine Law)
 * - FIDO2 / WebAuthn Hardware Non-Repudiation
 * - FIPS 140-3 Hardware Security Module (HSM) & TPM 2.0 Enclave Integrity
 */

export type CuriaSessionType = "MUNICIPAL_COUNCIL" | "CORPORATE_BOARD" | "UNION_DELEGATE" | "EXECUTIVE_SESSION";

export type CuriaVoteParadigm = "PUBLIC_ROLL_CALL" | "SECRET_BALLOT_HOMOMORPHIC";

export type CuriaMotionStatus = "DRAFT" | "FROZEN" | "VOTING" | "PASSED" | "FAILED" | "TABLED";

export type CuriaVoteChoice = "AYE" | "NAY" | "ABSTAIN" | "RECUSE";

export type CuriaDelegateRole = "PRESIDING_OFFICER" | "MUNICIPAL_CLERK" | "LEGAL_COUNSEL" | "DELEGATE" | "ALTERNATE";

export interface CuriaDelegate {
  id: string;
  name: string;
  title: string;
  district?: string;
  role: CuriaDelegateRole;
  votingWeight: number; // typically 1.0; supports weighted shareholder or delegation voting
  publicKeyEd25519: string; // Base64 encoded Ed25519 public key
  hardwareTokenType: "YUBIKEY_5C_FIPS" | "TITAN_SECURITY_KEY" | "APPLE_SECURE_ENCLAVE" | "NITROKEY_PRO";
  fido2CredentialId: string;
  present: boolean;
  recusedReason?: string;
}

export interface CuriaMotion {
  id: string;
  sessionNumber: string;
  title: string;
  canonicalText: string;
  motionTextHash: string; // SHA-256 hex digest of canonical text
  author: string;
  mover: string;
  seconder?: string;
  statutoryThreshold: "SIMPLE_MAJORITY" | "TWO_THIRDS" | "UNANIMOUS";
  status: CuriaMotionStatus;
  createdAt: string;
  frozenAt?: string;
  votingOpenedAt?: string;
  votingClosedAt?: string;
  gavelOperator: string;
  requiredQuorum: number;
}

export interface CuriaVote {
  id: string;
  motionId: string;
  delegateId: string;
  delegateName: string;
  choice: CuriaVoteChoice;
  timestamp: string;
  nonce: string;
  motionTextHash: string;
  // Ed25519 Signature over canonical payload:
  // SHA-256(motionId || motionTextHash || choice || timestamp || nonce || delegateId)
  signature: string;
  publicKeyEd25519: string;
  voterReceiptHash: string; // SHA-256 of the complete vote record
  hardwareAttestation: {
    fido2Aaguid: string;
    authenticatorType: string;
    userPresenceVerified: boolean;
    userVerification: "BIOMETRIC" | "PIN";
  };
}

export interface CuriaSecretBallot {
  ballotId: string;
  motionId: string;
  voterTrackingCode: string; // Anonymous hash given to voter for bulletin-board verification
  timestamp: string;
  // Paillier Additive Homomorphic Ciphertext: c = g^m * r^n mod n^2
  encryptedChoice: string; 
  // Non-Interactive Zero-Knowledge Proof (Schnorr/Fiat-Shamir) that m in {0, 1}
  zeroKnowledgeProof: {
    challenge: string;
    response: string;
    validityStatement: string;
  };
  inclusionLeafHash: string;
}

export interface CuriaTallyResult {
  motionId: string;
  paradigm: CuriaVoteParadigm;
  totalEligible: number;
  totalCast: number;
  quorumMet: boolean;
  quorumThreshold: number;
  ayeCount: number;
  nayCount: number;
  abstainCount: number;
  recuseCount: number;
  ayeWeight: number;
  nayWeight: number;
  outcome: "PASSED" | "FAILED" | "IN_PROGRESS" | "NO_QUORUM";
  merkleRootHash: string;
  timestamp: string;
}

export interface CuriaMerkleProofStep {
  position: "LEFT" | "RIGHT";
  hash: string;
}

export interface CuriaMerkleInclusionProof {
  leafIndex: number;
  leafHash: string;
  totalLeaves: number;
  auditPath: CuriaMerkleProofStep[];
  rootHash: string;
}

export interface CuriaMerkleTreeSnapshot {
  rootHash: string;
  treeSize: number;
  timestamp: string;
  leaves: string[];
}

export interface CuriaTpmPcrRegister {
  pcrIndex: number;
  description: string;
  expectedDigest: string;
  currentDigest: string;
  verified: boolean;
}

export interface CuriaHardwareContainerStatus {
  applianceModel: string;
  serialNumber: string;
  firmwareVersion: string;
  enclaveType: "FIPS_140_3_LEVEL_4_HSM" | "TPM_2_0_MEASURED_BOOT" | "INTEL_SGX_ENCLAVE";
  osType: "PUREOS_IMMUTABLE_SQUASHFS" | "HARDENED_LINUX_RO";
  airGapIsolated: boolean;
  
  // Physical Dual-Custody Key Interlock
  dualCustodyInterlock: {
    keyA_Clerk_Turned: boolean;
    keyB_LegalCounsel_Turned: boolean;
    pollsArmed: boolean;
    lastArmedTestTimestamp?: string;
  };

  // Physical Tamper Sensors
  tamperSensors: {
    chassisInterlockClosed: boolean;
    opticalMeshIntact: boolean;
    temperatureNormal: boolean;
    tamperAlert: boolean;
    tamperIncidentLog: string[];
  };

  // Entropy & True Random Number Generator (TRNG)
  trngStatus: {
    active: boolean;
    entropyRateKbps: number;
    nistSp800_90B_Compliant: boolean;
  };

  // Measured Boot TPM 2.0 PCRs
  pcrRegisters: CuriaTpmPcrRegister[];
  remoteAttestationQuote: {
    quoteSignature: string;
    signingKeyCertificate: string;
    timestamp: string;
    pcrCompositeHash: string;
  };
}

export interface CuriaCanvassDossier {
  dossierId: string;
  jurisdiction: string;
  statutoryRegime: string;
  sessionNumber: string;
  motionTitle: string;
  motionTextHash: string;
  canonicalMotionText: string;
  paradigm: CuriaVoteParadigm;
  gavelTime: string;
  tally: CuriaTallyResult;
  votes: CuriaVote[];
  merkleTree: CuriaMerkleTreeSnapshot;
  hardwareContainer: CuriaHardwareContainerStatus;
  
  // Federal Rules of Evidence 902(13)/(14) Certification
  freCertification: {
    rule: "FRE 902(13) / FRE 902(14)";
    statement: string;
    certifyingOfficer: string;
    certifyingOfficerTitle: string;
    certifyingOfficerSignature: string;
    hsmMasterKeySignature: string;
    timestampIso: string;
  };
  
  // Standalone executable verification script bundled inside dossier
  standaloneVerificationCode: string;
}

export interface CuriaSessionState {
  id: string;
  title: string;
  governingBody: string;
  jurisdiction: string;
  statutoryRegime: string;
  sessionType: CuriaSessionType;
  paradigm: CuriaVoteParadigm;
  status: "ACTIVE" | "ADJOURNED";
  delegates: CuriaDelegate[];
  motions: CuriaMotion[];
  activeMotionId: string;
  votes: Record<string, CuriaVote[]>; // motionId -> CuriaVote[]
  secretBallots: Record<string, CuriaSecretBallot[]>; // motionId -> CuriaSecretBallot[]
  hardwareContainer: CuriaHardwareContainerStatus;
}
