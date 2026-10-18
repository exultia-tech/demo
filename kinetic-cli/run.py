#!/usr/bin/env python3
"""
Exultia Kinetic Standalone Compiled Binary Entrypoint.
"""
import sys
import os

# Ensure package is on sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from kinetic_cli.main import cli_entry

if __name__ == "__main__":
    cli_entry()
