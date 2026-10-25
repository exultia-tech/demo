# Exultia Valkyrie Core Module

On-demand Breach & Attack Simulation (BAS) and non-destructive canary exploitability prober.

## Concept

Unlike weaponized penetration tests that risk application crashes or kernel panics, Valkyrie injects non-destructive, HMAC-SHA256 signed canary handshakes to mathematically prove whether a target is susceptible to a given CVE before remediation.

## Components

1. `valkyrie_probe_runner.py`: CLI execution script for safe protocol probes.
2. `probes_catalog.json`: Machine-readable repository of canary probe vectors.

## Execution

```bash
# Probe OpenSSH RegreSSHion vulnerability window
python3 valkyrie_probe_runner.py 192.168.1.50 --probe regresshion --port 22

# Probe mock C2 beacon listeners
python3 valkyrie_probe_runner.py 127.0.0.1 --probe c2-check --port 4444
```
