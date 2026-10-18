#!/usr/bin/env node

/**
 * Exultia Autonomous Threat Advisory Bot
 * Monitors Vantage Threat Feed for CISA KEV / Critical CVSS vulnerabilities
 * and broadcasts automated alerts to Bluesky, Telegram, and Dev.to with zero human intervention.
 */

import fs from 'fs';
import path from 'path';

// Automatically load .env.local if present
function loadEnv() {
  const envPath = path.resolve('.env.local');
  if (fs.existsSync(envPath)) {
    const lines = fs.readFileSync(envPath, 'utf-8').split(/\r?\n/);
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx > 0) {
        const key = trimmed.slice(0, eqIdx).trim();
        let val = trimmed.slice(eqIdx + 1).trim();
        if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
          val = val.slice(1, -1);
        }
        if (!process.env[key]) {
          process.env[key] = val;
        }
      }
    }
  }
}
loadEnv();

const STATE_FILE = path.resolve('.posted_advisories.json');
const FEED_URL = process.env.VANTAGE_FEED_URL || 'http://localhost:3000/api/patches/feed?limit=50';

function loadPostedState() {
  if (fs.existsSync(STATE_FILE)) {
    try {
      return JSON.parse(fs.readFileSync(STATE_FILE, 'utf-8'));
    } catch {
      return [];
    }
  }
  return [];
}

function savePostedState(state) {
  fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
}

async function fetchFeed() {
  try {
    const res = await fetch(FEED_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return Array.isArray(data) ? data : (data.patches || []);
  } catch (err) {
    console.error(`[Bot] Failed to fetch threat feed from ${FEED_URL}:`, err.message);
    return [];
  }
}

async function postToBluesky(cve) {
  const handle = process.env.BLUESKY_IDENTIFIER;
  const password = process.env.BLUESKY_PASSWORD;
  if (!handle || !password) {
    console.log(`[Bluesky Dry-Run] Missing BLUESKY_IDENTIFIER/PASSWORD. Post preview:`);
    console.log(`-------------------------------------------------------------------`);
    console.log(`🚨 CRITICAL THREAT ALERT: ${cve.cveId}`);
    console.log(`${cve.title}`);
    console.log(`CVSS: ${cve.cvss} (${cve.severity}) | CISA KEV: ${cve.cisaKev ? 'YES (Active)' : 'NO'}`);
    console.log(`\nVerified zero-downtime hotfix & 10% canary Ansible playbook:`);
    console.log(`https://exultia.tech/cve/${cve.cveId.toLowerCase()}`);
    console.log(`-------------------------------------------------------------------`);
    return false;
  }

  try {
    // 1. Authenticate session
    const authRes = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: handle, password })
    });
    if (!authRes.ok) throw new Error(`Auth failed: ${authRes.status}`);
    const session = await authRes.json();

    // 2. Create post record with clickable link facets
    const linkUrl = `https://exultia.tech/cve/${cve.cveId.toLowerCase()}`;
    const postText = `🚨 CRITICAL ALERT: ${cve.cveId}\n\n${cve.title.slice(0, 120)}\nCVSS: ${cve.cvss} | CISA KEV: ${cve.cisaKev ? 'ACTIVE EXPLOIT' : 'NO'}\n\nZero-downtime hotfix & Ansible playbook:\n${linkUrl}`;

    // Calculate UTF-8 byte offsets for the link facet
    const byteStart = Buffer.from(postText.slice(0, postText.indexOf(linkUrl)), 'utf-8').length;
    const byteEnd = byteStart + Buffer.from(linkUrl, 'utf-8').length;

    const record = {
      $type: 'app.bsky.feed.post',
      text: postText,
      facets: [
        {
          index: { byteStart, byteEnd },
          features: [
            {
              $type: 'app.bsky.richtext.facet#link',
              uri: linkUrl
            }
          ]
        }
      ],
      createdAt: new Date().toISOString()
    };

    const postRes = await fetch('https://bsky.social/xrpc/com.atproto.repo.createRecord', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessJwt}`
      },
      body: JSON.stringify({
        repo: session.did,
        collection: 'app.bsky.feed.post',
        record
      })
    });
    return postRes.ok;
  } catch (err) {
    console.error('[Bluesky Error]:', err.message);
    return false;
  }
}

async function postToTelegram(cve) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.log(`[Telegram Dry-Run] Missing TELEGRAM_BOT_TOKEN/CHAT_ID. Broadcast preview:`);
    console.log(`🚨 *CRITICAL CVE ALERT*: [${cve.cveId}](https://exultia.tech/cve/${cve.cveId.toLowerCase()})`);
    console.log(`*Title*: ${cve.title}`);
    console.log(`*CVSS*: ${cve.cvss} | *CISA KEV*: ${cve.cisaKev ? 'ACTIVE EXPLOIT' : 'NO'}`);
    return false;
  }

  const message = `🚨 *CRITICAL CVE ALERT*: [${cve.cveId}](https://exultia.tech/cve/${cve.cveId.toLowerCase()})\n\n` +
    `*Title*: ${cve.title}\n` +
    `*CVSS Score*: ${cve.cvss} (${cve.severity})\n` +
    `*CISA KEV*: ${cve.cisaKev ? '⚡ ACTIVE IN THE WILD' : 'Standard'}\n` +
    `*Affected*: \`${cve.affectedPackages.join(', ')}\`\n\n` +
    `👉 [Get Zero-Downtime Hotfix & Playbook](https://exultia.tech/cve/${cve.cveId.toLowerCase()})`;

  try {
    const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'Markdown',
        disable_web_page_preview: false
      })
    });
    return res.ok;
  } catch (err) {
    console.error('[Telegram Error]:', err.message);
    return false;
  }
}

async function postToDevTo(cve) {
  const apiKey = process.env.DEVTO_API_KEY;
  if (!apiKey) {
    console.log(`[Dev.to Dry-Run] Missing DEVTO_API_KEY. Article preview:`);
    console.log(`Title: Emergency Remediation Guide: ${cve.cveId} (${cve.title})`);
    console.log(`Canonical URL: https://exultia.tech/cve/${cve.cveId.toLowerCase()}`);
    return false;
  }

  const markdownBody = `# ${cve.cveId}: Rapid Enterprise Remediation Guide

**Vulnerability:** ${cve.title}  
**CVSS Severity:** ${cve.cvss} (${cve.severity})  
**CISA KEV Exploit Status:** ${cve.cisaKev ? 'Active in the wild' : 'Monitoring'}  

---

## Technical Overview
${cve.remediationTier.tier1_hotMitigation.summary}

### Affected Packages
\`\`\`text
${cve.affectedPackages.join('\n')}
\`\`\`

---

## ⚡ Zero-Downtime Hotfix (No Reboot)
Execute directly to neutralize the vulnerability with sentinel verification:

\`\`\`bash
${cve.remediationTier.tier1_hotMitigation.commands.join('\n')}
\`\`\`

### Verification Probe
\`\`\`bash
${cve.remediationTier.tier1_hotMitigation.verificationCommand}
\`\`\`

### Deterministic Sub-Second Rollback
\`\`\`bash
${cve.remediationTier.tier1_hotMitigation.rollbackCommand}
\`\`\`

---

*Canonical Advisory & Live Playbooks: [Exultia Praxis](https://exultia.tech/cve/${cve.cveId.toLowerCase()})*
`;

  try {
    const res = await fetch('https://dev.to/api/articles', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        article: {
          title: `Emergency Remediation: ${cve.cveId} - ${cve.title.slice(0, 50)}`,
          published: true,
          body_markdown: markdownBody,
          tags: ['security', 'devops', 'linux', 'cve'],
          canonical_url: `https://exultia.tech/cve/${cve.cveId.toLowerCase()}`
        }
      })
    });
    return res.ok;
  } catch (err) {
    console.error('[Dev.to Error]:', err.message);
    return false;
  }
}

  const isLivePublish = process.argv.includes('--publish');
  const maxLimit = 1; // Strict safety limit: at most 1 alert per run

  console.log(`[Bot] Running Exultia Advisory Dispatcher (Mode: ${isLivePublish ? 'LIVE PUBLISH' : 'DRY-RUN SAFE MODE'})...`);
  const posted = loadPostedState();
  const feed = await fetchFeed();

  // Strict Filter: Genuine CVEs only, CISA KEV active, CVSS >= 9.0
  const candidates = feed.filter(item => 
    item.cveId &&
    item.cveId.toUpperCase().startsWith('CVE-') &&
    item.cisaKev === true &&
    item.cvss >= 9.0 &&
    !posted.includes(item.cveId)
  ).slice(0, maxLimit);

  if (candidates.length === 0) {
    console.log('[Bot] No new high-priority CISA KEV CVEs to broadcast.');
    return;
  }

  console.log(`[Bot] Selected ${candidates.length} vetted CISA KEV CVE for broadcast.`);

  for (const cve of candidates) {
    console.log(`\n>>> Processing ${cve.cveId}: ${cve.title}`);
    if (isLivePublish) {
      await postToBluesky(cve);
      await postToTelegram(cve);
      await postToDevTo(cve);
      posted.push(cve.cveId);
    } else {
      console.log('[Bot] Running in SAFE DRY-RUN mode. Pass --publish to broadcast live.');
      await postToBluesky(cve);
    }
  }

  if (isLivePublish) {
    savePostedState(posted);
  }
  console.log('\n[Bot] Advisory cycle complete.');
}

main();
