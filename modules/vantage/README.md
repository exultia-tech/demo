# Exultia Vantage Core Module

Unidirectional threat intelligence synchronization client and air-gapped cache engine.

## Architectural Boundary

Vantage operates strictly on a **unidirectional pull model**:
- Host daemons poll static signed JSON manifests via standard HTTPS.
- Zero private customer data, host IPs, or source code ever leave the local network.
- Offline environments can transfer cache digests (`feed_latest.json` + `feed_latest.sha256`) across hardware data diodes.

## Execution

```bash
# Sync latest threat intelligence to local host cache
python3 vantage_sync.py https://exultia.tech/api/threat-feed
```
