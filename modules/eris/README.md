# Exultia Eris Core Module

Controlled vulnerability proving ground, adversary emulation, and chaos inoculation testing lab.

## Components

1. `eris-chaos-template.sh`: Universal POSIX script template for controlled host inoculations.
   - Arms an independent background watchdog timer (default 10 minutes) enforcing automated teardown.
   - Injects mock C2 listener sockets, permissive daemon configs, and SUID canary traps.
   - Enforces production hostname checks to prevent accidental execution outside sandboxes.
2. `docker-compose.chaos.yml`: Ephemeral container proving ground.
   - Runs on an internal bridge network (`internal: true`) with dropped root capabilities.
   - Isolated from production networks and external gateways.

## Usage

```bash
# Launch inoculation on a disposable test VM with 10-minute auto-rollback
sudo sh eris-chaos-template.sh 10

# Force immediate manual teardown
sudo sh eris-chaos-template.sh --teardown

# Spin up isolated container lab
docker compose -f docker-compose.chaos.yml up -d
```
