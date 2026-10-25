#!/bin/sh
# Exultia Bullshit Validator Launcher (POSIX Shell)
set -e

if command -v python3 >/dev/null 2>&1; then
    exec python3 "$(dirname "$0")/validate.py" "$@"
elif command -v python >/dev/null 2>&1; then
    exec python "$(dirname "$0")/validate.py" "$@"
else
    echo "[!] Python 3 is required to run the Exultia Bullshit Validator."
    exit 1
fi
