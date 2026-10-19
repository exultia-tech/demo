/**
 * Exultia Curia - Civic Sessions & Governance In-Memory Store
 * 
 * Provides production-ready simulations of real-world legislative, municipal,
 * and executive governing sessions.
 */

import { 
  CuriaSessionState, 
  CuriaDelegate, 
  CuriaMotion, 
  CuriaVote, 
  CuriaSecretBallot,
  CuriaTallyResult,
  CuriaVoteChoice,
  CuriaCanvassDossier
} from "./types";
import { 
  sha256, 
  buildMerkleTree, 
  generateMerkleInclusionProof, 
  generateEd25519KeyPair, 
  signVotePayload, 
  buildCanonicalVotePayload, 
  generateCanvassDossier,
  simulatePaillierEncryption
} from "./crypto";
import { 
  createDefaultHardwareContainer, 
  setDualCustodyKeys, 
  triggerTamperEvent, 
  resetTamperSensors 
} from "./hardware-container";

// In-memory keypair storage for simulated delegates so votes can be legitimately signed
const DELEGATE_PRIVATE_KEYS = new Map<string, string>();

function makeDelegate(
  id: string,
  name: string,
  title: string,
  district: string,
  role: CuriaDelegate["role"],
  tokenType: CuriaDelegate["hardwareTokenType"],
  weight = 1.0
): CuriaDelegate {
  const { publicKey, privateKey } = generateEd25519KeyPair();
  DELEGATE_PRIVATE_KEYS.set(id, privateKey);

  return {
    id,
    name,
    title,
    district,
    role,
    votingWeight: weight,
    publicKeyEd25519: publicKey,
    hardwareTokenType: tokenType,
    fido2CredentialId: `FIDO2-CRED-${id}-${sha256(id).substring(0, 12)}`,
    present: true
  };
}

const SF_DELEGATES: CuriaDelegate[] = [
  makeDelegate("del_sf_1", "Connie Chan", "Supervisor, District 1 (Richmond)", "District 1", "DELEGATE", "YUBIKEY_5C_FIPS"),
  makeDelegate("del_sf_2", "Catherine Stefani", "Supervisor, District 2 (Marina)", "District 2", "DELEGATE", "TITAN_SECURITY_KEY"),
  makeDelegate("del_sf_3", "Aaron Peskin", "Board President, District 3 (North Beach)", "District 3", "PRESIDING_OFFICER", "YUBIKEY_5C_FIPS"),
  makeDelegate("del_sf_4", "Joel Engardio", "Supervisor, District 4 (Sunset)", "District 4", "DELEGATE", "APPLE_SECURE_ENCLAVE"),
  makeDelegate("del_sf_5", "Dean Preston", "Supervisor, District 5 (Haight)", "District 5", "DELEGATE", "NITROKEY_PRO"),
  makeDelegate("del_sf_6", "Matt Dorsey", "Supervisor, District 6 (SoMa)", "District 6", "DELEGATE", "YUBIKEY_5C_FIPS"),
  makeDelegate("del_sf_7", "Myrna Melgar", "Supervisor, District 7 (West Portal)", "District 7", "DELEGATE", "APPLE_SECURE_ENCLAVE"),
  makeDelegate("del_sf_8", "Rafael Mandelman", "Supervisor, District 8 (Castro)", "District 8", "DELEGATE", "TITAN_SECURITY_KEY"),
  makeDelegate("del_sf_9", "Hillary Ronen", "Supervisor, District 9 (Mission)", "District 9", "DELEGATE", "YUBIKEY_5C_FIPS"),
  makeDelegate("del_sf_10", "Shamann Walton", "Supervisor, District 10 (Bayview)", "District 10", "DELEGATE", "NITROKEY_PRO"),
  makeDelegate("del_sf_11", "Ahsha Safaí", "Supervisor, District 11 (Excelsior)", "District 11", "DELEGATE", "YUBIKEY_5C_FIPS"),
  makeDelegate("del_sf_clerk", "Angela Calvillo", "Clerk of the Board of Supervisors", "Citywide", "MUNICIPAL_CLERK", "YUBIKEY_5C_FIPS", 0.0),
  makeDelegate("del_sf_counsel", "David Chiu", "City Attorney of San Francisco", "Citywide", "LEGAL_COUNSEL", "YUBIKEY_5C_FIPS", 0.0)
];

const INITIAL_MOTION_TEXT = `CITY AND COUNTY OF SAN FRANCISCO
BOARD OF SUPERVISORS LEGISLATIVE RESOLUTION NO. 2026-B94

TITLE: AUTHORIZING ISSUANCE OF ONE HUNDRED FORTY-FIVE MILLION DOLLARS ($145,000,000) GENERAL OBLIGATION INFRASTRUCTURE BONDS FOR MUNICIPAL SECURE OPEN-ACCESS FIBER BROADBAND & ZERO-TRUST CIVIC SENSORS.

BE IT ORDAINED BY THE PEOPLE OF THE CITY AND COUNTY OF SAN FRANCISCO:
Section 1. Findings and Determinations. The Board finds that high-speed, secure, municipally owned telecommunications infrastructure is an essential public utility vital for public health, emergency services coordination, and digital equity.
Section 2. Authorization of Debt. Pursuant to California Government Code Section 43600 and the San Francisco Administrative Code, the Director of Public Works is hereby authorized to issue general obligation bonds not exceeding $145,000,000.
Section 3. Cryptographic Audit Requirement. All procurement contracts, expenditure ledgers, and deployment milestones funded under this ordinance shall be entered into an append-only RFC 6962 Merkle tree transparency log accessible via public civic endpoints.`;

const INITIAL_MOTION_SF: CuriaMotion = {
  id: "motion_sf_2026_b94",
  sessionNumber: "SF-BOS-2026-10-19-REG",
  title: "Ordinance 2026-B94: $145M Municipal Fiber-Optic Broadband & Civic Network Bond",
  canonicalText: INITIAL_MOTION_TEXT,
  motionTextHash: sha256(INITIAL_MOTION_TEXT),
  author: "Supervisor Connie Chan (District 1)",
  mover: "Supervisor Connie Chan",
  seconder: "Board President Aaron Peskin",
  statutoryThreshold: "TWO_THIRDS",
  status: "VOTING",
  createdAt: "2026-10-19T14:00:00.000Z",
  frozenAt: "2026-10-19T17:00:00.000Z",
  votingOpenedAt: "2026-10-19T17:05:00.000Z",
  gavelOperator: "Angela Calvillo, Clerk of the Board",
  requiredQuorum: 6
};

// Global in-memory storage for Curia sessions
const SESSIONS: Map<string, CuriaSessionState> = new Map();

function initDefaultSessions() {
  if (SESSIONS.size > 0) return;

  const sfSession: CuriaSessionState = {
    id: "sf-board-of-supervisors",
    title: "San Francisco Board of Supervisors - Regular Legislative Meeting",
    governingBody: "San Francisco Board of Supervisors",
    jurisdiction: "City and County of San Francisco, California",
    statutoryRegime: "California Ralph M. Brown Act (§ 54950) & SF Sunshine Ordinance (Ch. 67)",
    sessionType: "MUNICIPAL_COUNCIL",
    paradigm: "PUBLIC_ROLL_CALL",
    status: "ACTIVE",
    delegates: SF_DELEGATES,
    motions: [INITIAL_MOTION_SF],
    activeMotionId: INITIAL_MOTION_SF.id,
    votes: {
      [INITIAL_MOTION_SF.id]: []
    },
    secretBallots: {},
    hardwareContainer: createDefaultHardwareContainer()
  };

  SESSIONS.set(sfSession.id, sfSession);

  // Pre-seed 7 realistic roll-call votes so the dashboard is immediately rich and interactive
  const preSeedVotes: { delegateId: string; choice: CuriaVoteChoice }[] = [
    { delegateId: "del_sf_1", choice: "AYE" },
    { delegateId: "del_sf_2", choice: "AYE" },
    { delegateId: "del_sf_3", choice: "AYE" },
    { delegateId: "del_sf_4", choice: "NAY" },
    { delegateId: "del_sf_5", choice: "AYE" },
    { delegateId: "del_sf_6", choice: "AYE" },
    { delegateId: "del_sf_8", choice: "ABSTAIN" }
  ];

  for (const pv of preSeedVotes) {
    castVoteInternal(sfSession, INITIAL_MOTION_SF.id, pv.delegateId, pv.choice);
  }
}

function castVoteInternal(
  session: CuriaSessionState,
  motionId: string,
  delegateId: string,
  choice: CuriaVoteChoice
): CuriaVote {
  const delegate = session.delegates.find(d => d.id === delegateId);
  if (!delegate) throw new Error(`Delegate ${delegateId} not found`);

  const motion = session.motions.find(m => m.id === motionId);
  if (!motion) throw new Error(`Motion ${motionId} not found`);

  const privateKey = DELEGATE_PRIVATE_KEYS.get(delegateId);
  if (!privateKey) throw new Error(`Private key for delegate ${delegateId} not in enclave`);

  const timestamp = new Date().toISOString();
  const nonce = `NONCE-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;

  const canonicalPayload = buildCanonicalVotePayload({
    id: "",
    motionId,
    delegateId,
    delegateName: delegate.name,
    choice,
    timestamp,
    nonce,
    motionTextHash: motion.motionTextHash,
    publicKeyEd25519: delegate.publicKeyEd25519,
    hardwareAttestation: {
      fido2Aaguid: "ea9b8d66-4d01-11eb-ae93-0242ac130002",
      authenticatorType: delegate.hardwareTokenType,
      userPresenceVerified: true,
      userVerification: "BIOMETRIC"
    }
  });

  const signature = signVotePayload(canonicalPayload, privateKey);
  const voteId = `VOTE-${motionId}-${delegateId}`;
  const voterReceiptHash = sha256(`VOTE_RECEIPT:${canonicalPayload}:${signature}`);

  const vote: CuriaVote = {
    id: voteId,
    motionId,
    delegateId,
    delegateName: delegate.name,
    choice,
    timestamp,
    nonce,
    motionTextHash: motion.motionTextHash,
    signature,
    publicKeyEd25519: delegate.publicKeyEd25519,
    voterReceiptHash,
    hardwareAttestation: {
      fido2Aaguid: "ea9b8d66-4d01-11eb-ae93-0242ac130002",
      authenticatorType: delegate.hardwareTokenType,
      userPresenceVerified: true,
      userVerification: "BIOMETRIC"
    }
  };

  // Upsert vote
  if (!session.votes[motionId]) {
    session.votes[motionId] = [];
  }
  const existingIdx = session.votes[motionId].findIndex(v => v.delegateId === delegateId);
  if (existingIdx >= 0) {
    session.votes[motionId][existingIdx] = vote;
  } else {
    session.votes[motionId].push(vote);
  }

  return vote;
}

export function getSession(sessionId = "sf-board-of-supervisors"): CuriaSessionState {
  initDefaultSessions();
  const session = SESSIONS.get(sessionId);
  if (!session) throw new Error(`Session ${sessionId} not found`);
  return session;
}

export function computeTally(session: CuriaSessionState, motionId: string): CuriaTallyResult {
  const motion = session.motions.find(m => m.id === motionId);
  if (!motion) throw new Error(`Motion ${motionId} not found`);

  const votes = session.votes[motionId] || [];
  const votingEligible = session.delegates.filter(d => d.votingWeight > 0);

  let ayes = 0;
  let nays = 0;
  let abstains = 0;
  let recuses = 0;
  let ayeWeight = 0;
  let nayWeight = 0;

  for (const v of votes) {
    const delegate = session.delegates.find(d => d.id === v.delegateId);
    const weight = delegate ? delegate.votingWeight : 1.0;

    if (v.choice === "AYE") {
      ayes++;
      ayeWeight += weight;
    } else if (v.choice === "NAY") {
      nays++;
      nayWeight += weight;
    } else if (v.choice === "ABSTAIN") {
      abstains++;
    } else if (v.choice === "RECUSE") {
      recuses++;
    }
  }

  const quorumMet = (ayes + nays + abstains) >= motion.requiredQuorum;
  
  // Calculate outcome
  let outcome: CuriaTallyResult["outcome"] = "IN_PROGRESS";
  if (motion.status === "PASSED") outcome = "PASSED";
  else if (motion.status === "FAILED") outcome = "FAILED";
  else if (!quorumMet && votes.length === votingEligible.length) outcome = "NO_QUORUM";
  else if (votes.length === votingEligible.length) {
    if (motion.statutoryThreshold === "TWO_THIRDS") {
      outcome = (ayeWeight / (ayeWeight + nayWeight)) >= (2 / 3) ? "PASSED" : "FAILED";
    } else {
      outcome = ayeWeight > nayWeight ? "PASSED" : "FAILED";
    }
  }

  // Merkle tree of vote receipt hashes
  const receiptHashes = votes.map(v => v.voterReceiptHash);
  const merkle = buildMerkleTree(receiptHashes);

  return {
    motionId,
    paradigm: session.paradigm,
    totalEligible: votingEligible.length,
    totalCast: votes.length,
    quorumMet,
    quorumThreshold: motion.requiredQuorum,
    ayeCount: ayes,
    nayCount: nays,
    abstainCount: abstains,
    recuseCount: recuses,
    ayeWeight,
    nayWeight,
    outcome,
    merkleRootHash: merkle.rootHash,
    timestamp: new Date().toISOString()
  };
}

export function freezeMotionText(
  sessionId: string, 
  motionId: string, 
  updatedText?: string
): CuriaMotion {
  const session = getSession(sessionId);
  const motion = session.motions.find(m => m.id === motionId);
  if (!motion) throw new Error(`Motion ${motionId} not found`);

  if (updatedText) {
    motion.canonicalText = updatedText;
  }
  motion.motionTextHash = sha256(motion.canonicalText);
  motion.frozenAt = new Date().toISOString();
  motion.status = "FROZEN";
  return motion;
}

export function openVotingOnMotion(sessionId: string, motionId: string): CuriaMotion {
  const session = getSession(sessionId);
  const motion = session.motions.find(m => m.id === motionId);
  if (!motion) throw new Error(`Motion ${motionId} not found`);

  // Ensure Hardware Container Dual-Custody keys are ARMED
  if (!session.hardwareContainer.dualCustodyInterlock.pollsArmed) {
    throw new Error("SECURITY_ERROR: Hardware container dual-custody physical interlock keys are not armed or tamper alert is active.");
  }

  motion.status = "VOTING";
  motion.votingOpenedAt = new Date().toISOString();
  return motion;
}

export function closeVotingAndDropGavel(sessionId: string, motionId: string): CuriaTallyResult {
  const session = getSession(sessionId);
  const motion = session.motions.find(m => m.id === motionId);
  if (!motion) throw new Error(`Motion ${motionId} not found`);

  const tally = computeTally(session, motionId);
  motion.status = tally.outcome === "PASSED" ? "PASSED" : "FAILED";
  motion.votingClosedAt = new Date().toISOString();
  return tally;
}

export function castDelegateVote(
  sessionId: string,
  motionId: string,
  delegateId: string,
  choice: CuriaVoteChoice
) {
  const session = getSession(sessionId);
  
  if (!session.hardwareContainer.dualCustodyInterlock.pollsArmed) {
    throw new Error("SECURITY_HALT: Hardware container physical interlock disarmed. Voting suspended.");
  }

  const vote = castVoteInternal(session, motionId, delegateId, choice);
  const tally = computeTally(session, motionId);

  const votes = session.votes[motionId];
  const receiptHashes = votes.map(v => v.voterReceiptHash);
  const tree = buildMerkleTree(receiptHashes);
  const leafIdx = votes.findIndex(v => v.delegateId === delegateId);
  const merkleProof = generateMerkleInclusionProof(tree, leafIdx);

  return { vote, tally, merkleProof };
}

export function exportDossier(sessionId: string, motionId: string): CuriaCanvassDossier {
  const session = getSession(sessionId);
  const motion = session.motions.find(m => m.id === motionId);
  if (!motion) throw new Error(`Motion ${motionId} not found`);

  const tally = computeTally(session, motionId);
  const votes = session.votes[motionId] || [];
  const receiptHashes = votes.map(v => v.voterReceiptHash);
  const merkleTreeResult = buildMerkleTree(receiptHashes);

  const merkleSnapshot = {
    rootHash: merkleTreeResult.rootHash,
    treeSize: merkleTreeResult.leafCount,
    timestamp: new Date().toISOString(),
    leaves: receiptHashes
  };

  return generateCanvassDossier(
    motion,
    tally,
    votes,
    merkleSnapshot,
    session.hardwareContainer,
    session.jurisdiction,
    session.statutoryRegime
  );
}

export function toggleHardwareInterlockKeys(sessionId: string, keyA: boolean, keyB: boolean) {
  const session = getSession(sessionId);
  session.hardwareContainer = setDualCustodyKeys(session.hardwareContainer, keyA, keyB);
  return session.hardwareContainer;
}

export function triggerHardwareTamper(sessionId: string, sensor: "OPTICAL_INTRUSION" | "CHASSIS_OPEN" | "MESH_BREACH") {
  const session = getSession(sessionId);
  session.hardwareContainer = triggerTamperEvent(session.hardwareContainer, sensor);
  return session.hardwareContainer;
}

export function resetHardwareTamper(sessionId: string) {
  const session = getSession(sessionId);
  session.hardwareContainer = resetTamperSensors(session.hardwareContainer);
  return session.hardwareContainer;
}
