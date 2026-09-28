import { NextRequest, NextResponse } from 'next/server';
import { scriptStore } from '@/lib/fix-list-store';
import { queryThreatFeedFromDb } from '@/lib/db/threats-query';
import { compileRemediationBlock } from '@/lib/fix-list-compiler';

// Map UI class IDs to UVI database query parameters
const CLASS_QUERY_MAP: Record<string, { domain?: string; scope?: string; action?: string }> = {
  network:   { scope: 'non-cve',       domain: 'MALWARE_C2_BOTNET' },
  config:    { action: 'PATCH',         scope: 'all' },
  service:   { domain: 'VULNERABILITIES_EXPLOITATION', scope: 'all' },
  phishing:  { domain: 'PHISHING_FRAUD' },
  kev:       { scope: 'all' },
};

export async function POST(request: NextRequest) {
  try {
    const { os, cron, proxy, preview, classes = [], networkMode = 'localhost', firewallFormat = 'plain' } = await request.json();

    let script = `#!/bin/sh\n`;
    script += `# ============================================================\n`;
    script += `# Exultia Targeted Remediation Client\n`;
    script += `# OS Target: ${os}\n`;
    script += `# Generated: ${new Date().toISOString()}\n`;
    script += `# Transmission: One-time (auto-deleted after download)\n`;
    script += `# ============================================================\n\n`;

    // Logging helpers
    script += `log_msg() { printf '[Exultia] %s\\n' "$1"; }\n`;
    script += `log_err() { printf '[Exultia ERROR] %s\\n' "$1" >&2; }\n\n`;

    // Package manager auto-detection (Linux/Unix)
    // Sets PKG_MGR and PKG_INSTALL / PKG_UPGRADE / PKG_QUERY for use throughout
    script += `# ── Package Manager Detection ──────────────────────────────\n`;
    script += `detect_pkg_mgr() {\n`;
    script += `  if command -v apt-get >/dev/null 2>&1; then\n`;
    script += `    PKG_MGR="apt-get"\n`;
    script += `    PKG_INSTALL="apt-get install -y"\n`;
    script += `    PKG_UPGRADE="apt-get install -y --only-upgrade"\n`;
    script += `    PKG_QUERY="dpkg -l"\n`;
    script += `  elif command -v dnf >/dev/null 2>&1; then\n`;
    script += `    PKG_MGR="dnf"\n`;
    script += `    PKG_INSTALL="dnf install -y"\n`;
    script += `    PKG_UPGRADE="dnf upgrade -y"\n`;
    script += `    PKG_QUERY="rpm -q"\n`;
    script += `  elif command -v yum >/dev/null 2>&1; then\n`;
    script += `    PKG_MGR="yum"\n`;
    script += `    PKG_INSTALL="yum install -y"\n`;
    script += `    PKG_UPGRADE="yum update -y"\n`;
    script += `    PKG_QUERY="rpm -q"\n`;
    script += `  elif command -v zypper >/dev/null 2>&1; then\n`;
    script += `    PKG_MGR="zypper"\n`;
    script += `    PKG_INSTALL="zypper install -y"\n`;
    script += `    PKG_UPGRADE="zypper update -y"\n`;
    script += `    PKG_QUERY="rpm -q"\n`;
    script += `  elif command -v pacman >/dev/null 2>&1; then\n`;
    script += `    PKG_MGR="pacman"\n`;
    script += `    PKG_INSTALL="pacman -S --noconfirm"\n`;
    script += `    PKG_UPGRADE="pacman -Syu --noconfirm"\n`;
    script += `    PKG_QUERY="pacman -Q"\n`;
    script += `  elif command -v pkg >/dev/null 2>&1; then\n`;
    script += `    PKG_MGR="pkg"\n`;
    script += `    PKG_INSTALL="pkg install -y"\n`;
    script += `    PKG_UPGRADE="pkg upgrade -y"\n`;
    script += `    PKG_QUERY="pkg info"\n`;
    script += `  elif command -v chocolatey >/dev/null 2>&1; then\n`;
    script += `    PKG_MGR="chocolatey"\n`;
    script += `    PKG_INSTALL="chocolatey install -y"\n`;
    script += `    PKG_UPGRADE="chocolatey upgrade -y"\n`;
    script += `    PKG_QUERY="chocolatey list --local-only"\n`;
    script += `  elif command -v choco >/dev/null 2>&1; then\n`;
    script += `    PKG_MGR="choco"\n`;
    script += `    PKG_INSTALL="choco install -y"\n`;
    script += `    PKG_UPGRADE="choco upgrade -y"\n`;
    script += `    PKG_QUERY="choco list --local-only"\n`;
    script += `  elif command -v brew >/dev/null 2>&1; then\n`;
    script += `    PKG_MGR="brew"\n`;
    script += `    PKG_INSTALL="brew install"\n`;
    script += `    PKG_UPGRADE="brew upgrade"\n`;
    script += `    PKG_QUERY="brew list"\n`;
    script += `  else\n`;
    script += `    PKG_MGR="unknown"\n`;
    script += `    PKG_INSTALL=""\n`;
    script += `    PKG_UPGRADE=""\n`;
    script += `    PKG_QUERY=""\n`;
    script += `    log_err "No supported package manager detected. Package upgrades will be skipped."\n`;
    script += `  fi\n`;
    script += `  log_msg "Package manager detected: $PKG_MGR"\n`;
    script += `}\n`;
    script += `detect_pkg_mgr\n\n`;

    if (proxy) {
      script += `# Corporate Proxy Configuration\n`;
      script += `export http_proxy="${proxy}"\n`;
      script += `export https_proxy="${proxy}"\n\n`;
    }

    script += `log_msg "Initiating targeted threat remediation for ${os}..."\n\n`;

    // Collect all unique advisories matching selected classes from DB
    const seenIds = new Set<string>();
    const advisoriesToPatch: any[] = [];

    for (const cls of classes) {
      const queryParams = CLASS_QUERY_MAP[cls] || {};

      // For KEV class, query known-exploited threats
      const isKevClass = cls === 'kev';
      const result = await queryThreatFeedFromDb({
        ...queryParams,
        kevOnly: isKevClass,
        limit: 20,
        page: 1,
        sortBy: 'cvss_desc',
      });

      for (const advisory of result.advisories) {
        if (!seenIds.has(advisory.uviId)) {
          seenIds.add(advisory.uviId);
          advisoriesToPatch.push({ advisory, cls });
        }
      }
    }

    if (advisoriesToPatch.length === 0) {
      script += `log_msg "No active threats matched the selected remediation classes."\n`;
    } else {
      script += `# ============================================================\n`;
      script += `# ${advisoriesToPatch.length} threat(s) identified from UVI registry\n`;
      script += `# ============================================================\n\n`;

      for (const { advisory } of advisoriesToPatch) {
        script += compileRemediationBlock(advisory, os, networkMode, firewallFormat);
      }
    }

    // Cron setup
    if (cron) {
      script += `\n# ──────────────────────────────────────────\n`;
      script += `# Auto-deploy: Daily cron job registration\n`;
      script += `# ──────────────────────────────────────────\n`;
      script += `SCRIPT_PATH=$(readlink -f "$0" 2>/dev/null || echo "$PWD/$0")\n`;
      // Use RANDOM if available (bash), fallback to awk for POSIX sh
      script += `if [ -n "$RANDOM" ]; then RAND_MIN=$((RANDOM % 60)); else RAND_MIN=$(awk 'BEGIN{srand();print int(rand()*60)}'); fi\n`;
      script += `CRON_JOB="$RAND_MIN 2 * * * \$SCRIPT_PATH"\n`;
      script += `(crontab -l 2>/dev/null | grep -v "$SCRIPT_PATH"; echo "$CRON_JOB") | crontab -\n`;
      script += `log_msg "Daily cron registered to run at minute $RAND_MIN past 02:00."\n`;
    }

    script += `\nlog_msg "Remediation complete."\n`;

    const id = crypto.randomUUID();
    if (!preview) {
      scriptStore.set(id, script);
    }

    return NextResponse.json({ id, script, threatCount: advisoriesToPatch.length });

  } catch (err) {
    console.error('Fix list generation error:', err);
    return NextResponse.json({ error: 'Failed to generate script' }, { status: 500 });
  }
}
