#!/usr/bin/env python3
"""
Exultia Shorthand CLI Entrypoint (`xul`).
Supports both `xul <subcommand>` and `xul --<command>` (e.g. `xul --status`, `xul --patch`, `xul --daemon`).
"""
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from kinetic_cli.main import cli_entry

if __name__ == "__main__":
    cli_entry()

