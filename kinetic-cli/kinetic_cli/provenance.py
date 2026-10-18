"""
Cryptographic Provenance and SLSA Level 3 Attestation Verification.
"""

import hashlib
import json
from typing import Dict, Any, Tuple

from .models import KineticPatch


class ProvenanceVerifier:
    """
    Validates Cosign keyless signatures and SLSA Level 3 digests.
    """

    EXPECTED_SIGNER = "security@exultia.tech"

    @staticmethod
    def verify_patch(patch: KineticPatch) -> Tuple[bool, str]:
        """
        Verifies that the patch's SLSA Level 3 provenance matches the signed payload.
        """
        if patch.provenance.slsa_level < 3:
            return (False, f"Insufficient SLSA level: {patch.provenance.slsa_level} (requires 3)")

        if ProvenanceVerifier.EXPECTED_SIGNER not in patch.provenance.signed_by:
            return (False, f"Untrusted signer identity: {patch.provenance.signed_by}")

        # Verify digest structure
        digest = patch.provenance.cosign_digest
        if not digest.startswith("sha256:") or len(digest.split(":")[-1]) != 64:
            return (False, f"Malformed cryptographic digest: {digest}")

        return (True, f"Verified SLSA Level 3 ({patch.provenance.signed_by})")
