#!/usr/bin/env node

/**
 * Exultia Autonomous Threat Advisory Bot
 * Monitors Vantage Threat Feed for CISA KEV / Critical CVSS vulnerabilities
 * and broadcasts automated alerts to Bluesky, Telegram, and Dev.to with zero human intervention.
 */

import fs from 'fs';
import path from 'path';

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

    // 2. Create post record
    const postText = `🚨 CRITICAL ALERT: ${cve.cveId}\n\n${cve.title}\nCVSS: ${cve.cvss} | CISA KEV: ${cve.cisaKev ? 'ACTIVE' : 'NO'}\n\nZero-downtime hotfix & Ansible playbook:\nhttps://exultia.tech/cve/${cve.cveId.toLowerCase()}`;
    const record = {
      $type: 'app.bsky.feed.post',
      text: postText,
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

async function main() {
  console.log('[Bot] Running Exultia Autonomous Advisory Dispatcher...');
  const posted = loadPostedState();
  const feed = await fetchFeed();

  // Find critical / CISA KEV items
  const candidates = feed.filter(item => 
    (item.severity === 'CRITICAL' || item.cisaKev || item.cvss >= 8.5) &&
    !posted.includes(item.cveId)
  );

  console.log(`[Bot] Found ${candidates.length} new high-priority candidate CVE(s) to broadcast.`);

  for (const cve of candidates) {
    console.log(`\n>>> Processing ${cve.cveId}: ${cve.title}`);
    await postToBluesky(cve);
    await postToTelegram(cve);
    await postToDevTo(cve);
    posted.push(cve.cveId);
  }

  savePostedState(posted);
  console.log('\n[Bot] Advisory cycle complete.');
}

main();
