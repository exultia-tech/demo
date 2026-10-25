#!/bin/sh
# Exultia Quick-Test Launcher (curl -sSL ... | bash)
set -e

TMP_DIR="${TMPDIR:-/tmp}/exultia-validator-$$"
cleanup() {
    rm -rf "$TMP_DIR" 2>/dev/null || true
}
trap cleanup EXIT INT TERM

echo "--> Cloning Exultia Bullshit Validator..."
git clone --depth=1 -q https://github.com/exultia-tech/demo.git "$TMP_DIR"
cd "$TMP_DIR"

if command -v python3 >/dev/null 2>&1; then
    exec python3 validate.py "$@"
elif command -v python >/dev/null 2>&1; then
    exec python validate.py "$@"
elif [ -f "./bin/kinetic" ]; then
    chmod +x ./bin/kinetic
    exec ./bin/kinetic test
else
    echo "Error: Python 3 or standalone binary is required."
    exit 1
fi
