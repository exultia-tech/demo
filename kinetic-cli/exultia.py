#!/usr/bin/env python3
"""
Exultia Unified Autonomous Daemon & CLI Entrypoint (`exultia`).
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from kinetic_cli.main import cli_entry

if __name__ == "__main__":
    cli_entry()

