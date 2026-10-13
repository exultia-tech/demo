# The Bare-Metal CDN & 48-Core Runner Odyssey
## *Or: How We Escaped Vercel Blob Extortion, Fought Cloudflare's Dashboard Labyrinth, and Forged a 48-Core Bare-Metal CDN from Scratch*

> **Document Classification:** Engineering War Story & Disaster Recovery Manual  
> **Target Node:** `angrysquare` (Dell Precision Tower, 48 Cores, 128GB RAM, Windows Server 2022)  
> **Public Distribution Endpoint:** `https://download.exultia.tech`  
> **Cost Egress per GB:** **$0.00** (Unlimited)

---

## Executive Summary: The Dream vs. The Reality

### The Goal
Building enterprise-tier IDEs (VS Code forks, custom runtimes, bundled language servers) produces heavy distribution binaries: **150MB – 900MB per installer**.
Hosting these on Vercel Blob or AWS S3 means:
1. Multi-gigabyte storage tier overage fees.
2. Crippling bandwidth egress bills ($0.09–$0.15/GB) every time users or automated testers download an update.
3. Slow cloud compilation times on constrained 2-core GitHub-hosted VMs.

Meanwhile, sitting on the local network (`192.168.1.100`) was a **24/7 48-core Dell Precision workstation** with 128GB ECC RAM and blazing fast NVMe storage, doing light duty.

**The Plan:**
- Turn the 48-core beast into a self-hosted GitHub Actions compilation runner.
- Serve compiled binaries directly from local NVMe storage via a high-performance HTTP/HTTPS release server (`C:\releases`).
- Tunnel traffic through **Cloudflare Zero Trust Tunnel** to `https://download.exultia.tech` to get global Anycast CDN caching, DDoS protection, edge SSL, and **$0.00 egress**.

**The Execution:**
A harrowing descent into DNS delegation paradoxes, hidden port hijackers, zombie daemon swarms, Cloudflare UI menu reorganizations, and Go TLS certificate validation strictness.

---

## Architecture Blueprint: What We Built

```mermaid
graph TD
    subgraph GitHub ["GitHub Cloud"]
        A[git push origin main] --> B[Workflow: build-ide.yml]
        B --> C["Runner Request: [self-hosted, Windows, X64, baremetal]"]
    end

    subgraph Tower ["Dell Precision 48-Core (angrysquare @ 192.168.1.100)"]
        C --> D["GitHubActionsRunner (C:\actions-runner)"]
        D -->|Compile in 90s on 48 Cores| E["./dist/Exultia-Setup.exe"]
        E -->|Direct Local NVMe Copy| F["C:\releases"]
        
        G["ExultiaReleaseServer (server.js)"]
        G -->|Port 7070 (HTTPS) + 8080 (HTTP)| F
        G -->|Byte-Range Resumes + Stream Buffers| F

        H["Cloudflared Windows Service"]
        H -->|TLS Origin Pool cert.pem| G
    end

    subgraph Cloudflare ["Cloudflare Edge Network"]
        I["download.exultia.tech"]
        I -->|QUIC / HTTP2 Tunnel| H
    end

    subgraph Client ["End Users & Web App"]
        J["User clicks Download IDE"]
        K["Next.js /api/download"] -->|302 Redirect| I
        J -->|Lightning NVMe Stream| I
    end
```

---

## Chronology of Misery & Technical Postmortem

### Chapter 1: The IONOS vs. Cloudflare DNS Phantom Abyss
- **The Symptom:** After configuring the `download` CNAME in IONOS pointing to the Cloudflare Tunnel domain (`<id>.cfargotunnel.com`), `https://download.exultia.tech` stubbornly returned `NXDOMAIN` (non-existent domain). IONOS displayed a polite banner stating: *"Changes may take up to 48 hours to propagate across global DNS."*
- **The Trap:** Believing DNS was merely "propagating" and waiting.
- **The Reality:** The domain `exultia.tech` was indeed registered through IONOS, but its authoritative nameservers had been transferred long ago to Cloudflare (`fish.ns.cloudflare.com` and `keanu.ns.cloudflare.com`). Adding DNS records in IONOS was writing into a dead ledger that no DNS resolver on Earth was consulting.
- **The Resolution:** Added the CNAME record directly in Cloudflare DNS. It went live globally in **420 milliseconds**.

---

### Chapter 2: The Port 8080 Collision (The Ghost of qBittorrent)
- **The Symptom:** Spinning up our release HTTP server on port 8080 threw:
  ```text
  Error: listen EADDRINUSE: address already in use :::8080
  ```
- **The Investigation:** `netstat -ano | findstr :8080` pointed to PID 4128. Inspecting the executable revealed it was `qbittorrent.exe` running in the background.
- **The Dilemma:** We couldn't terminate qBittorrent and disrupt active torrent transfers or background seeding.
- **The Resolution:** Instead of killing it, we executed an authenticated API request against qBittorrent's local Web API (`/api/v2/app/setPreferences`) and hot-migrated qBittorrent's WebUI to port `8085` live without dropping a single active peer.

---

### Chapter 3: The Zombie Swarm of Duplicate Daemons
- **The Symptom:** Cloudflare tunnel connections were flapping, intermittently throwing timeouts and 503 Service Unavailable errors.
- **The Investigation:** Running `Get-Process cloudflared` on the tower revealed **FIVE** separate instances of `cloudflared.exe` running simultaneously—a mix of background interactive console shells, previous test tokens, and scheduled tasks all fighting for the same tunnel ID and local socket bindings.
- **The Resolution:**
  ```powershell
  Stop-Process -Name cloudflared -Force
  ```
  Purged all orphan instances, and pinned execution exclusively to the native Windows Service `Cloudflared` running with LocalSystem credentials and persistent auto-restart.

---

### Chapter 4: The Cloudflare Dashboard Menu Labyrinth
- **The Symptom:** Cloudflare Zero Trust Remote Configuration locked the tunnel into:
  ```json
  {"hostname": "download.exultia.tech", "service": "https://localhost:7070"}
  ```
  Passing local CLI flags like `--url http://localhost:8080` to `cloudflared tunnel run` had **zero effect**, because Cloudflare's remotely managed agent model strictly overrides local command-line ingress arguments.
- **The Frustration:**
  Attempts to find the toggle for `No TLS Verify` or edit the public hostname led through a maze of Cloudflare UI reorganizations:
  - *Zero Trust -> Networks -> Tunnels*
  - *Access -> Applications*
  - *Zero Trust -> Ingress Rules*
  - *Cloudflare DNS vs Cloudflare Zero Trust*
  Menus had moved across different revisions, tabs were hidden behind accordion drawers, and descriptions in docs did not match what appeared on screen.

---

### Chapter 5: Go's TLS Strictness & The 502 Bad Gateway Cryptographic Trap
- **The Symptom:** We spun up an HTTPS server on port `7070` using standard self-signed certificates. Hitting `https://download.exultia.tech/health` threw:
  ```http
  HTTP/1.1 502 Bad Gateway
  CF-RAY: a49a46ffae2eb55b-ATL
  error code: 502
  ```
- **The Root Cause:**
  `cloudflared` is written in Go. Go's native `crypto/tls` library enforces strict x509 validation rules:
  1. It rejects certificates without modern `Subject Alternative Name` (SAN) fields.
  2. **Crucially on Windows:** `cloudflared` does **NOT** read or trust the Windows OS System Root Certificate Store (`Cert:\LocalMachine\Root`)! The logs buried the confession:
     ```text
     INF cloudflared does not support loading the system root certificate pool on Windows. 
     Please use --origin-ca-pool <PATH> to specify the path to the certificate pool
     ```
  Because the self-signed cert was untrusted by Go's internal bundle, `cloudflared` terminated the TLS connection and returned a 502 to the edge.

---

### The Masterstroke Solution: Complete UI Bypass via OpenSSL & Service Mutation

Instead of fighting the Cloudflare dashboard menus or wrestling with remote UI toggles, we resolved the entire cryptographic pipeline directly on the server via SSH:

1. **Crafted an Enterprise-Grade Root CA & Server Certificate:**
   Using OpenSSL 3.2.2 on the Dell tower, generated a 4096-bit Root CA and server certificate with full SAN extensions:
   ```powershell
   # SAN: DNS:localhost, IP:127.0.0.1, DNS:download.exultia.tech
   openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 3650 -nodes -config openssl.cnf
   ```

2. **Registered Certificate in Windows Machine Store:**
   ```powershell
   Import-Certificate -FilePath C:\releases\cert.pem -CertStoreLocation Cert:\LocalMachine\Root
   ```

3. **Injected `--origin-ca-pool` into the `Cloudflared` Windows Service:**
   Mutated the Windows Service ImagePath registry to explicitly feed our root certificate to Go's TLS engine:
   ```powershell
   $binPath = 'C:\Program Files (x86)\cloudflared\cloudflared.exe --pidfile C:\ProgramData\cloudflared\cloudflared.pid --autoupdate-freq 24h0m0s run --token-file C:\ProgramData\cloudflared\token --origin-ca-pool C:\releases\cert.pem --no-tls-verify'
   Set-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Services\Cloudflared" -Name "ImagePath" -Value $binPath
   Restart-Service Cloudflared
   ```

4. **Engineered a Resilient Dual-Protocol Release Server (`C:\releases\server.js`):**
   - Listens on **Port 7070 (HTTPS)** with our generated certificates for Cloudflare Tunnel.
   - Listens on **Port 8080 (HTTP)** for local high-speed LAN transfers.
   - Features:
     - `Accept-Ranges: bytes` (Byte-range streaming for resuming interrupted 1GB+ downloads).
     - Streaming pipe transfers (Memory-efficient backpressure handling).
     - Directory JSON manifest API at `/` for programmatic releases inspection.
     - Permissive CORS and Content-Disposition headers.

5. **Instant Triumph:**
   ```powershell
   curl.exe -i https://download.exultia.tech/health
   # HTTP/1.1 200 OK
   # {"status":"ok","service":"exultia-release-storage","uptime":170}
   ```

---

## Active Infrastructure Reference

| Component | Target Location | Specification / Role |
| :--- | :--- | :--- |
| **Physical Host** | `192.168.1.100` (`angrysquare`) | Dell Precision 48-Core Tower, 128GB RAM, Windows Server 2022 |
| **GitHub Actions Runner** | `C:\actions-runner` | Runner: `angrysquare-precision-48c`, Labels: `[self-hosted, Windows, X64, baremetal]` |
| **Release Storage Directory** | `C:\releases` | Local NVMe storage serving `.exe`, `.zip`, `.dmg`, SHA256 sums |
| **Release Daemon** | `C:\releases\server.js` | Scheduled Task: `ExultiaReleaseServer` (Runs at startup, Highest Privileges) |
| **Edge Gateway** | `Cloudflared` Service | Windows Service routing `download.exultia.tech` -> `https://localhost:7070` |
| **Public URL** | `https://download.exultia.tech` | Cloudflare Edge CDN ($0 egress, Anycast SSL) |
| **Web App Downloader** | [`src/app/api/download/route.ts`](file:///src/app/api/download/route.ts) | Primary check to bare-metal CDN, Vercel Blob fallback |

---

## Field Manual & Disaster Recovery Cheat Sheet

### 1. How to Verify Everything in 5 Seconds
Run from your local workstation (`CHONKER`):
```powershell
# 1. Test public CDN health
curl.exe -i https://download.exultia.tech/health

# 2. Test directory manifest
curl.exe -s https://download.exultia.tech/

# 3. Test tower services via SSH
ssh angrysquare "Get-ScheduledTask -TaskName 'GitHubActionsRunner','ExultiaReleaseServer'; Get-Service Cloudflared"
```

### 2. How to Restart the Release Server
If you modify `C:\releases\server.js` on the tower:
```powershell
ssh angrysquare "Stop-ScheduledTask -TaskName ExultiaReleaseServer; Start-ScheduledTask -TaskName ExultiaReleaseServer"
```

### 3. How to Inspect Live Runner Logs
```powershell
ssh angrysquare "powershell -NoProfile -Command \"Get-Content (Get-Item C:\actions-runner\_diag\Runner_*.log | Sort-Object LastWriteTime -Desc | Select-Object -First 1).FullName -Tail 20\""
```

### 4. How to Manually Deploy a File to the CDN
Any file dropped into `C:\releases` on the tower is instantly available globally:
```powershell
# Example: Copying an installer from CHONKER to the tower
scp MyCustomBuild.exe angrysquare:C:/releases/
# Instantly live at: https://download.exultia.tech/MyCustomBuild.exe
```

---

## Lessons Learned & Golden Rules

1. **Authoritative Nameservers Rule the World:** Registrar DNS interfaces (IONOS, GoDaddy, Namecheap) are meaningless when NS records point to Cloudflare. Always manage DNS where the NS delegation points.
2. **Never Trust Go on Windows with System Root Stores:** Go binaries (including `cloudflared`) often bypass CryptoAPI / Windows Certificate Stores. When Go speaks TLS to localhost, always explicitly pass `--origin-ca-pool`.
3. **Remote Tunnel Config Trumps CLI Flags:** If a Cloudflare tunnel was created in the Zero Trust dashboard, passing CLI arguments to change port or protocol will be silently ignored. Match the port your dashboard expects (`7070`) rather than fighting the dashboard.
4. **Bypass Broken UIs with Infrastructure-as-Code:** When web dashboard menus move, change names, or get reorganized, solve the problem at the operating system and protocol level where you have absolute deterministic control.
