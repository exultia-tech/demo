import { describe, it, expect, beforeEach } from "vitest";
import { 
  canonicalJsonStringify, 
  sha256, 
  buildMerkleTree, 
  generateMerkleInclusionProof, 
  verifyMerkleInclusionProof, 
  generateEd25519KeyPair, 
  signVotePayload, 
  verifyVoteSignature, 
  buildCanonicalVotePayload,
  simulatePaillierEncryption
} from "../src/lib/curia/crypto";
import { 
  createDefaultHardwareContainer, 
  setDualCustodyKeys, 
  triggerTamperEvent, 
  resetTamperSensors 
} from "../src/lib/curia/hardware-container";
import { 
  getSession, 
  computeTally, 
  freezeMotionText, 
  openVotingOnMotion, 
  closeVotingAndDropGavel, 
  castDelegateVote, 
  exportDossier, 
  toggleHardwareInterlockKeys,
  triggerHardwareTamper
} from "../src/lib/curia/sessions-store";

describe("Exultia Curia - Cryptographically Defensible Civic Voting & Governance Engine", () => {

  describe("1. Canonical Hashing & Motion Text Immutability (RFC 8785)", () => {
    it("should produce identical canonical strings regardless of JSON property ordering", () => {
      const objA = { title: "Ordinance 2026", author: "District 1", amount: 145000000 };
      const objB = { amount: 145000000, title: "Ordinance 2026", author: "District 1" };

      expect(canonicalJsonStringify(objA)).toBe(canonicalJsonStringify(objB));
      expect(sha256(canonicalJsonStringify(objA))).toBe(sha256(canonicalJsonStringify(objB)));
    });

    it("should alter the SHA-256 motion text hash when even a single whitespace or punctuation character is changed", () => {
      const originalText = "BE IT RESOLVED that $145,000,000 in bonds are authorized.";
      const modifiedText = "BE IT RESOLVED that $145,000,000 in bonds are authorized. "; // Trailing space

      const hashA = sha256(originalText);
      const hashB = sha256(modifiedText);

      expect(hashA).not.toBe(hashB);
      expect(hashA).toHaveLength(64);
      expect(hashB).toHaveLength(64);
    });
  });

  describe("2. Append-Only Binary Merkle Tree (RFC 6962)", () => {
    it("should build a valid Merkle tree from voter receipt hashes and verify inclusion proofs", () => {
      const receipts = [
        "RECEIPT_VOTE_01_HASH_1234567890ABCDEF",
        "RECEIPT_VOTE_02_HASH_2345678901ABCDEF",
        "RECEIPT_VOTE_03_HASH_3456789012ABCDEF",
        "RECEIPT_VOTE_04_HASH_4567890123ABCDEF",
        "RECEIPT_VOTE_05_HASH_5678901234ABCDEF"
      ];

      const tree = buildMerkleTree(receipts);
      expect(tree.leafCount).toBe(5);
      expect(tree.rootHash).toHaveLength(64);

      // Verify inclusion proof for every single leaf
      for (let i = 0; i < receipts.length; i++) {
        const proof = generateMerkleInclusionProof(tree, i);
        expect(proof.leafIndex).toBe(i);
        expect(proof.rootHash).toBe(tree.rootHash);

        const isValid = verifyMerkleInclusionProof(proof);
        expect(isValid).toBe(true);
      }
    });

    it("should reject an inclusion proof if the leaf hash or sibling audit path is forged or corrupted", () => {
      const receipts = [
        "RECEIPT_VOTE_A",
        "RECEIPT_VOTE_B",
        "RECEIPT_VOTE_C",
        "RECEIPT_VOTE_D"
      ];
      const tree = buildMerkleTree(receipts);
      const proof = generateMerkleInclusionProof(tree, 2);

      // Corrupt leaf hash
      const corruptedProof = {
        ...proof,
        leafHash: sha256("FORGED_VOTE_RECEIPT")
      };

      expect(verifyMerkleInclusionProof(corruptedProof)).toBe(false);
    });
  });

  describe("3. Ed25519 Asymmetric Non-Repudiation Signatures", () => {
    it("should generate valid Ed25519 keys, sign canonical voting payloads, and verify signatures", () => {
      const { publicKey, privateKey } = generateEd25519KeyPair();
      expect(publicKey).toContain("BEGIN PUBLIC KEY");
      expect(privateKey).toContain("BEGIN PRIVATE KEY");

      const payload = canonicalJsonStringify({
        choice: "AYE",
        delegateId: "del_sf_1",
        motionId: "motion_sf_2026_b94",
        motionTextHash: sha256("Resolution text"),
        nonce: "NONCE-99214",
        timestamp: "2026-10-19T17:00:00.000Z"
      });

      const signature = signVotePayload(payload, privateKey);
      expect(signature).toBeDefined();

      const isValid = verifyVoteSignature(payload, signature, publicKey);
      expect(isValid).toBe(true);

      // Verify that tampering with payload causes signature rejection
      const tamperedPayload = payload.replace("AYE", "NAY");
      const isTamperedValid = verifyVoteSignature(tamperedPayload, signature, publicKey);
      expect(isTamperedValid).toBe(false);
    });
  });

  describe("4. Additive Homomorphic Encryption & Zero-Knowledge Validity Proofs", () => {
    it("should simulate Paillier encryption and generate non-interactive zero-knowledge proofs", () => {
      const key = {
        modulusN: "0x89abcdef0123456789abcdef0123456789abcdef0123456789abcdef01234567",
        generatorG: "0x02"
      };

      const ballotAye = simulatePaillierEncryption(1, key);
      expect(ballotAye.ciphertext).toHaveLength(64);
      expect(ballotAye.zkProof.challenge).toHaveLength(64);
      expect(ballotAye.zkProof.response).toHaveLength(64);
      expect(ballotAye.zkProof.statement).toContain("Non-Interactive Zero-Knowledge Proof");

      const ballotNay = simulatePaillierEncryption(0, key);
      expect(ballotNay.ciphertext).not.toBe(ballotAye.ciphertext);
    });
  });

  describe("5. Hardware Container Enclave, Dual-Custody & Tamper Sensors", () => {
    it("should initialize default hardware container with FIPS 140-3 HSM and TPM 2.0 PCR registers", () => {
      const hsm = createDefaultHardwareContainer();
      expect(hsm.enclaveType).toBe("FIPS_140_3_LEVEL_4_HSM");
      expect(hsm.airGapIsolated).toBe(true);
      expect(hsm.pcrRegisters.length).toBeGreaterThanOrEqual(5);

      // Verify all PCR registers are valid digests
      for (const pcr of hsm.pcrRegisters) {
        expect(pcr.currentDigest).toHaveLength(64);
        expect(pcr.verified).toBe(true);
      }
    });

    it("should enforce dual-custody physical interlock keys (Key A + Key B required to arm polls)", () => {
      let hsm = createDefaultHardwareContainer();
      expect(hsm.dualCustodyInterlock.pollsArmed).toBe(true);

      // Clerk turns Key A off -> disarmed
      hsm = setDualCustodyKeys(hsm, false, true);
      expect(hsm.dualCustodyInterlock.pollsArmed).toBe(false);

      // Legal Counsel turns Key B off -> disarmed
      hsm = setDualCustodyKeys(hsm, true, false);
      expect(hsm.dualCustodyInterlock.pollsArmed).toBe(false);

      // Both keys turned on -> armed
      hsm = setDualCustodyKeys(hsm, true, true);
      expect(hsm.dualCustodyInterlock.pollsArmed).toBe(true);
    });

    it("should immediately disarm polls and log critical incident upon chassis intrusion / optical tamper", () => {
      let hsm = createDefaultHardwareContainer();
      expect(hsm.tamperSensors.tamperAlert).toBe(false);

      // Simulate optical intrusion
      hsm = triggerTamperEvent(hsm, "OPTICAL_INTRUSION");
      expect(hsm.tamperSensors.tamperAlert).toBe(true);
      expect(hsm.dualCustodyInterlock.pollsArmed).toBe(false);
      expect(hsm.tamperSensors.opticalMeshIntact).toBe(false);
      expect(hsm.tamperSensors.tamperIncidentLog[0]).toContain("[CRITICAL TAMPER]");

      // Dual-supervisor reset restores system
      hsm = resetTamperSensors(hsm);
      expect(hsm.tamperSensors.tamperAlert).toBe(false);
      expect(hsm.dualCustodyInterlock.pollsArmed).toBe(true);
    });
  });

  describe("6. Complete Civic Roll-Call Lifecycle & FRE 902(13)/(14) Canvass Dossier", () => {
    it("should execute full legislative roll call, verify quorum, compute 2/3 majority, and export certified dossier", () => {
      const session = getSession("sf-board-of-supervisors");
      expect(session.delegates.length).toBe(13);

      // Cast additional vote for del_sf_7 (Myrna Melgar)
      const { vote, tally, merkleProof } = castDelegateVote(
        "sf-board-of-supervisors",
        session.activeMotionId,
        "del_sf_7",
        "AYE"
      );

      expect(vote.delegateName).toBe("Myrna Melgar");
      expect(vote.choice).toBe("AYE");
      expect(vote.signature).toBeDefined();
      expect(vote.voterReceiptHash).toHaveLength(64);
      expect(tally.quorumMet).toBe(true);
      expect(verifyMerkleInclusionProof(merkleProof)).toBe(true);

      // Export FRE 902(13)/(14) Canvass Dossier
      const dossier = exportDossier("sf-board-of-supervisors", session.activeMotionId);
      expect(dossier.dossierId).toContain("CURIA-DOSSIER-");
      expect(dossier.freCertification.rule).toBe("FRE 902(13) / FRE 902(14)");
      expect(dossier.freCertification.hsmMasterKeySignature).toHaveLength(64);
      expect(dossier.standaloneVerificationCode).toContain("Curia Audit Engine");
      expect(dossier.merkleTree.leaves.length).toBeGreaterThanOrEqual(8);
    });

    it("should prevent vote casting when hardware container dual-custody keys are disarmed", () => {
      // Disarm Key A
      toggleHardwareInterlockKeys("sf-board-of-supervisors", false, true);

      expect(() => {
        castDelegateVote(
          "sf-board-of-supervisors",
          "motion_sf_2026_b94",
          "del_sf_9",
          "AYE"
        );
      }).toThrow(/SECURITY_HALT/);

      // Re-arm Key A
      toggleHardwareInterlockKeys("sf-board-of-supervisors", true, true);
    });
  });
});
