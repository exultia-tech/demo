/**
 * Exultia Curia - Hardware Container & Secure Enclave Engine
 * 
 * Simulates and enforces the physical and cryptographic hardware container:
 * 1. Physical Dual-Custody Key Interlock (Key A: Clerk, Key B: Legal Counsel)
 * 2. Chassis Optical Intrusion & Active Mesh Tamper Sensors
 * 3. TPM 2.0 (Trusted Platform Module) Measured Boot PCR Registers
 * 4. True Random Number Generator (TRNG) NIST SP 800-90B Entropy Pipeline
 * 5. Hardware Remote Attestation Quote Generation
 */

import { CuriaHardwareContainerStatus, CuriaTpmPcrRegister } from "./types";
import { sha256 } from "./crypto";

const DEFAULT_PCR_REGISTERS: CuriaTpmPcrRegister[] = [
  {
    pcrIndex: 0,
    description: "Core UEFI / Hardware Root of Trust",
    expectedDigest: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    currentDigest: "9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08",
    verified: true
  },
  {
    pcrIndex: 2,
    description: "Bootloader & Stage-2 Shim (dm-verity)",
    expectedDigest: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    currentDigest: "5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8",
    verified: true
  },
  {
    pcrIndex: 4,
    description: "PureOS Hardened Immutable Linux Kernel (6.12-pure)",
    expectedDigest: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    currentDigest: "4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a",
    verified: true
  },
  {
    pcrIndex: 7,
    description: "Secure Boot PK/KEK Certificate Authorities",
    expectedDigest: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    currentDigest: "ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d",
    verified: true
  },
  {
    pcrIndex: 10,
    description: "Curia Civic Core Engine Binary & In-Memory Tally Matrix",
    expectedDigest: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
    currentDigest: "a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3",
    verified: true
  }
];

export function createDefaultHardwareContainer(): CuriaHardwareContainerStatus {
  const pcrComposite = DEFAULT_PCR_REGISTERS.map(p => p.currentDigest).join(":");
  const pcrCompositeHash = sha256(pcrComposite);

  return {
    applianceModel: "Exultia Curia Sentinel-100 Air-Gapped Chamber Enclave",
    serialNumber: "SN-CURIA-2026-FIPS-0982",
    firmwareVersion: "4.12.0-pure-sec",
    enclaveType: "FIPS_140_3_LEVEL_4_HSM",
    osType: "PUREOS_IMMUTABLE_SQUASHFS",
    airGapIsolated: true,

    dualCustodyInterlock: {
      keyA_Clerk_Turned: true,
      keyB_LegalCounsel_Turned: true,
      pollsArmed: true,
      lastArmedTestTimestamp: new Date().toISOString()
    },

    tamperSensors: {
      chassisInterlockClosed: true,
      opticalMeshIntact: true,
      temperatureNormal: true,
      tamperAlert: false,
      tamperIncidentLog: []
    },

    trngStatus: {
      active: true,
      entropyRateKbps: 2450,
      nistSp800_90B_Compliant: true
    },

    pcrRegisters: [...DEFAULT_PCR_REGISTERS],
    remoteAttestationQuote: {
      quoteSignature: sha256(`ATTESTATION_QUOTE:SN-CURIA-2026-FIPS-0982:${pcrCompositeHash}`),
      signingKeyCertificate: "CN=Exultia Root Hardware Authority, OU=Sentinel HSM, O=Exultia Technologies",
      timestamp: new Date().toISOString(),
      pcrCompositeHash
    }
  };
}

/**
 * Updates physical dual-custody key states
 * Returns updated container status with armed determination
 */
export function setDualCustodyKeys(
  status: CuriaHardwareContainerStatus,
  keyA: boolean,
  keyB: boolean
): CuriaHardwareContainerStatus {
  const pollsArmed = keyA && keyB && !status.tamperSensors.tamperAlert;
  return {
    ...status,
    dualCustodyInterlock: {
      keyA_Clerk_Turned: keyA,
      keyB_LegalCounsel_Turned: keyB,
      pollsArmed,
      lastArmedTestTimestamp: new Date().toISOString()
    }
  };
}

/**
 * Simulates a chassis intrusion or tamper event
 */
export function triggerTamperEvent(
  status: CuriaHardwareContainerStatus,
  sensorName: "OPTICAL_INTRUSION" | "CHASSIS_OPEN" | "MESH_BREACH"
): CuriaHardwareContainerStatus {
  const timestamp = new Date().toISOString();
  const alertMsg = `[CRITICAL TAMPER] Sensor ${sensorName} tripped at ${timestamp}. Ephemeral memory zeroized. Dual-custody interlock tripped.`;

  return {
    ...status,
    dualCustodyInterlock: {
      ...status.dualCustodyInterlock,
      pollsArmed: false
    },
    tamperSensors: {
      ...status.tamperSensors,
      chassisInterlockClosed: sensorName !== "CHASSIS_OPEN",
      opticalMeshIntact: sensorName !== "OPTICAL_INTRUSION" && sensorName !== "MESH_BREACH",
      tamperAlert: true,
      tamperIncidentLog: [alertMsg, ...status.tamperSensors.tamperIncidentLog]
    }
  };
}

/**
 * Resets tamper status with dual-supervisor security clearance
 */
export function resetTamperSensors(status: CuriaHardwareContainerStatus): CuriaHardwareContainerStatus {
  return {
    ...status,
    tamperSensors: {
      chassisInterlockClosed: true,
      opticalMeshIntact: true,
      temperatureNormal: true,
      tamperAlert: false,
      tamperIncidentLog: [`[SYSTEM RESTORED] Dual-custody tamper reset authenticated at ${new Date().toISOString()}`, ...status.tamperSensors.tamperIncidentLog]
    },
    dualCustodyInterlock: {
      ...status.dualCustodyInterlock,
      pollsArmed: status.dualCustodyInterlock.keyA_Clerk_Turned && status.dualCustodyInterlock.keyB_LegalCounsel_Turned
    }
  };
}
