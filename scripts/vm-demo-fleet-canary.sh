#!/bin/bash
# ==============================================================================
# Exultia Kinetic - Multi-Node Staged Fleet Rollout Demo
# ==============================================================================

CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BOLD='\033[1m'
NC='\033[0m'

CURRENT_HOST=$(hostname)

echo -e "${CYAN}${BOLD}"
echo "======================================================================"
echo "  EXULTIA KINETIC - MULTI-NODE FLEET STAGED ROLLOUT DEMO"
echo "  Current Node: ${CURRENT_HOST}"
echo "======================================================================"
echo -e "${NC}"

echo -e "${BOLD}Enterprise Staged Ring Hierarchy:${NC}"
echo "  • Ring 0 (Canary Host  : exultia-canary-02) -> Receives hotfix first (10% slice)"
echo "  • Ring 1 (Production   : exultia-prod-01)   -> Deploys after canary health check passes"
echo "  • Ring 2 (Broad Fleet)                      -> Complete fleet automation"
echo ""

if [ "$CURRENT_HOST" = "exultia-canary-02" ]; then
    echo -e "${YELLOW}★ YOU ARE ON THE CANARY NODE (Ring 0)${NC}"
    echo "This node evaluates hot-mitigations against live health probes before wide rollout."
    echo ""
    echo "Running synthetic canary validation cycle:"
    sudo kinetic test
else
    echo -e "${GREEN}★ YOU ARE ON THE PRODUCTION NODE (Ring 1)${NC}"
    echo "This node only receives hotfixes once the canary node validates zero regressions."
    echo ""
    echo "Inspecting production baseline:"
    sudo kinetic status
fi

echo ""
echo -e "${BOLD}Multi-Node Management Tip:${NC}"
echo "You can switch between both test VMs anytime from Windows PowerShell:"
echo "  • Switch to Production Node: wsl -d exultia-node-1"
echo "  • Switch to Canary Node    : wsl -d exultia-node-2"
echo ""
echo -e "${GREEN}${BOLD}✔ Fleet Verification Check Complete.${NC}"
