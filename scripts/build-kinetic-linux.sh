#!/bin/bash
set -euo pipefail

echo "=========================================================="
echo "  Compiling Exultia Kinetic Native Single-File ELF Binary"
echo "=========================================================="

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BUILD_VENV="/tmp/kinetic-build-venv"
BUILD_WORK="/tmp/pyinstaller-build"

echo "[0/4] Auditing Python Build Runtime Security & EOL Status..."
python3 "$REPO_ROOT/scripts/verify-python-runtime.py"

echo "[1/4] Preparing isolated Linux build virtualenv..."
if [ ! -d "$BUILD_VENV" ]; then
    python3 -m venv "$BUILD_VENV"
fi
source "$BUILD_VENV/bin/activate"

echo "[2/4] Ensuring PyInstaller is present in build environment..."
pip install --upgrade pip >/dev/null 2>&1
pip install pyinstaller >/dev/null 2>&1

mkdir -p "$REPO_ROOT/bin/dist" "$REPO_ROOT/public/downloads/kinetic"
mkdir -p "$BUILD_WORK"

echo "[3/4] Compiling native single-file Linux ELF binary via PyInstaller..."
pyinstaller --onefile \
    --clean \
    --strip \
    --name kinetic \
    --distpath "$REPO_ROOT/bin/dist" \
    --workpath "$BUILD_WORK" \
    "$REPO_ROOT/kinetic-cli/run.py"

# Deploy to public download distribution store
cp -fp "$REPO_ROOT/bin/dist/kinetic" "$REPO_ROOT/public/downloads/kinetic/kinetic"
chmod +x "$REPO_ROOT/public/downloads/kinetic/kinetic"

echo "[4/4] Updating SHA-256 Checksum Manifest..."
cd "$REPO_ROOT/public/downloads/kinetic"
sha256sum kinetic > SHA256SUMS.txt
if [ -f "kinetic.exe" ]; then
    sha256sum kinetic.exe >> SHA256SUMS.txt
fi
if [ -f "kinetic.pyz" ]; then
    sha256sum kinetic.pyz >> SHA256SUMS.txt
fi

echo "=========================================================="
echo "  Compilation Succeeded! Native Linux ELF Binary Ready:"
ls -lh "$REPO_ROOT/public/downloads/kinetic/kinetic"
if command -v file >/dev/null 2>&1; then
    file "$REPO_ROOT/public/downloads/kinetic/kinetic"
fi
cat "$REPO_ROOT/public/downloads/kinetic/SHA256SUMS.txt"
echo "=========================================================="
