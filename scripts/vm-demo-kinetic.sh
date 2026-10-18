#!/bin/bash
# ==============================================================================
# Exultia Kinetic - Interactive Live Hotfix & Sub-Second Rollback Walkthrough
# ==============================================================================

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BOLD='\033[1m'
NC='\033[0m'

echo -e "${CYAN}${BOLD}"
echo "======================================================================"
echo "  EXULTIA KINETIC - LIVE ENTERPRISE HOTFIX & ROLLBACK DEMO"
echo "  Host: $(hostname) | Kernel: $(uname -r)"
echo "======================================================================"
echo -e "${NC}"

echo -e "${BOLD}Step 1: Inspect Current Kinetic Host Baseline State${NC}"
echo "Running: sudo kinetic status"
echo "----------------------------------------------------------------------"
sudo kinetic status
echo ""

echo -e "${YELLOW}Press [ENTER] to simulate emergency hot-mitigation for CVE-2024-6387 (RegreSSHion)...${NC}"
read -r

echo -e "\n${BOLD}Step 2: Applying Autonomous Hotfix for CVE-2024-6387${NC}"
echo "Notice how Kinetic creates a pre-image SHA-256 snapshot, injects the drop-in,"
echo "and verifies the live daemon state without requiring a host reboot:"
echo "Running: sudo kinetic apply --cve=CVE-2024-6387"
echo "----------------------------------------------------------------------"
sudo kinetic apply --cve=CVE-2024-6387
echo ""

echo -e "${BOLD}Step 3: Verifying Host Protection State${NC}"
echo "Checking drop-in configuration file:"
cat /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf 2>/dev/null || echo "(No drop-in found)"
echo ""
echo "Running: sudo kinetic status"
echo "----------------------------------------------------------------------"
sudo kinetic status
echo ""

echo -e "${YELLOW}Press [ENTER] to execute a Sub-Second Deterministic Rollback...${NC}"
read -r

echo -e "\n${BOLD}Step 4: Executing Atomic Deterministic Rollback${NC}"
echo "Restoring the pre-mitigation state directly from the cryptographic snapshot:"
echo "Running: sudo kinetic rollback --cve=CVE-2024-6387"
echo "----------------------------------------------------------------------"
sudo kinetic rollback --cve=CVE-2024-6387
echo ""

echo -e "${BOLD}Step 5: Verifying Clean Baseline Restored${NC}"
if [ -f /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf ]; then
    echo -e "${RED}[FAIL] Hotfix file still exists!${NC}"
else
    echo -e "${GREEN}[PASS] Verified: /etc/ssh/sshd_config.d/00-exultia-regrsshion-fix.conf was cleanly removed.${NC}"
fi
echo ""
sudo kinetic status
echo ""
echo -e "${GREEN}${BOLD}✔ Demo Complete! Kinetic safely mitigated and rolled back without service disruption.${NC}"
