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

export function formatNaturalPost(cve) {
  const linkUrl = `https://exultia.tech/cve/${cve.cveId.toLowerCase()}`;
  const rawPkg = (cve.affectedPackages && cve.affectedPackages[0]) || 'Linux systems';
  const pkgClean = rawPkg.split(/[<=>\s]/)[0];

  let friendlyPkg = pkgClean;
  if (pkgClean.toLowerCase() === 'openssh-server' || pkgClean.toLowerCase() === 'openssh') friendlyPkg = 'OpenSSH';
  if (pkgClean.toLowerCase() === 'xz-utils' || pkgClean.toLowerCase() === 'xz') friendlyPkg = 'XZ Utils';
  if (pkgClean.toLowerCase() === 'cups-browsed' || pkgClean.toLowerCase() === 'cups') friendlyPkg = 'CUPS';
  if (pkgClean.toLowerCase() === 'runc') friendlyPkg = 'runc';

  // 1. WHAT: Specific vulnerability & affected software
  let what = `Critical vulnerability in ${friendlyPkg} (${cve.cveId}).`;
  if (cve.cveId === 'CVE-2024-6387') {
    what = `Remote root race condition in OpenSSH (${cve.cveId}).`;
  } else if (cve.cveId === 'CVE-2024-3094') {
    what = `Supply chain backdoor in XZ Utils (${cve.cveId}).`;
  } else if (cve.cveId === 'CVE-2024-47176') {
    what = `Remote code execution flaw in CUPS (${cve.cveId}).`;
  } else if (cve.cveId === 'CVE-2024-21626') {
    what = `Container escape flaw in runc (${cve.cveId}).`;
  }

  // 2. HOW: How it works / why it matters
  let how = '';
  if (cve.cveId === 'CVE-2024-6387') {
    how = "Attackers hit a race condition in sshd's SIGALRM handler when LoginGraceTime expires to get unauthenticated root.";
  } else if (cve.cveId === 'CVE-2024-3094') {
    how = 'Malicious tarballs in 5.6.x hook sshd pre-auth functions via systemd notify to achieve unauthorized access.';
  } else if (cve.cveId === 'CVE-2024-47176') {
    how = 'Binds unauthenticated UDP to port 631 allowing attackers to inject arbitrary remote commands.';
  } else if (cve.cveId === 'CVE-2024-21626') {
    how = 'Leaked file descriptors allow attackers to escape containers and access the host as root.';
  } else {
    const cleanTitle = cve.title.replace(/^.+?:\s*/, '').replace(/\(CVE-[^)]+\)/, '').trim();
    how = `Attackers can exploit ${cleanTitle.toLowerCase()} to compromise vulnerable hosts.`;
    if (how.length > 130) {
      how = how.slice(0, 127) + '...';
    }
  }

  // 3. Remediation link
  const fix = `Remediation:  ${linkUrl}`;

  const postText = `${what}\n\n${how}\n\n${fix}`;
  return { what, how, fix, postText, linkUrl };
}

async function postToBluesky(cve) {
  const handle = process.env.BLUESKY_IDENTIFIER;
  const password = process.env.BLUESKY_PASSWORD;
  const { postText, linkUrl } = formatNaturalPost(cve);

  if (!handle || !password) {
    console.log(`[Bluesky Dry-Run] Missing credentials. Post preview:`);
    console.log(`-------------------------------------------------------------------`);
    console.log(postText);
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
  const { what, how, linkUrl } = formatNaturalPost(cve);

  if (!token || !chatId) {
    console.log(`[Telegram Dry-Run] Missing TELEGRAM_BOT_TOKEN/CHAT_ID. Broadcast preview:`);
    console.log(`*${cve.cveId}*: ${what}\n\n${how}\n\nRemediation:  ${linkUrl}`);
    return false;
  }

  const message = `*${cve.cveId}*: ${what}\n\n${how}\n\nRemediation:  ${linkUrl}`;

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
  const isLivePublish = process.argv.includes('--publish');
  const maxLimit = 1; // Strict safety limit: at most 1 alert per run

  console.log(`[Bot] Running Exultia Advisory Dispatcher (Mode: ${isLivePublish ? 'LIVE PUBLISH' : 'DRY-RUN SAFE MODE'})...`);
  const posted = loadPostedState();
  const feed = await fetchFeed();

  // Filter: Genuine CVE vulnerabilities for awareness (CVSS >= 8.5)
  const candidates = feed.filter(item => 
    item.cveId &&
    item.cveId.toUpperCase().startsWith('CVE-') &&
    (item.cvss >= 8.5 || item.cisaKev === true) &&
    !posted.includes(item.cveId)
  ).slice(0, maxLimit);

  if (candidates.length === 0) {
    console.log('[Bot] No unposted high-severity CVEs found.');
    return;
  }

  console.log(`[Bot] Selected ${candidates.length} CVE vulnerability for awareness broadcast.`);

  for (const cve of candidates) {
    console.log(`\n>>> Processing ${cve.cveId}: ${cve.title}`);
    if (isLivePublish) {
      await postToBluesky(cve);
      await postToTelegram(cve);
      await postToDevTo(cve);
      posted.push(cve.cveId);
    } else {
      const { postText } = formatNaturalPost(cve);
      console.log('[Bot] Running in SAFE DRY-RUN mode. Pass --publish to broadcast live.');
      console.log('-------------------------------------------------------------------');
      console.log(postText);
      console.log('-------------------------------------------------------------------');
    }
  }

  if (isLivePublish) {
    savePostedState(posted);
  }
  console.log('\n[Bot] Advisory cycle complete.');
}

main();
