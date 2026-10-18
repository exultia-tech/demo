#!/usr/bin/env node

/**
 * Bluesky Feed Purge Tool
 * Deletes all posts published by the authenticated Bluesky account.
 */

import fs from 'fs';
import path from 'path';

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

async function purgeAll() {
  const handle = process.env.BLUESKY_IDENTIFIER;
  const password = process.env.BLUESKY_PASSWORD;

  if (!handle || !password) {
    console.error('Missing BLUESKY_IDENTIFIER or BLUESKY_PASSWORD in .env.local');
    process.exit(1);
  }

  console.log(`Connecting to Bluesky as ${handle}...`);
  const authRes = await fetch('https://bsky.social/xrpc/com.atproto.server.createSession', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ identifier: handle, password })
  });

  if (!authRes.ok) {
    console.error('Authentication failed:', authRes.status);
    process.exit(1);
  }

  const session = await authRes.json();
  const did = session.did;
  const jwt = session.accessJwt;

  let totalDeleted = 0;
  while (true) {
    const listRes = await fetch(`https://bsky.social/xrpc/com.atproto.repo.listRecords?repo=${did}&collection=app.bsky.feed.post&limit=100`, {
      headers: { Authorization: `Bearer ${jwt}` }
    });
    if (!listRes.ok) {
      console.error('Failed to list records:', listRes.status);
      break;
    }
    const data = await listRes.json();
    const records = data.records || [];
    if (records.length === 0) {
      break;
    }

    console.log(`Deleting ${records.length} post(s)...`);
    for (const rec of records) {
      const rkey = rec.uri.split('/').pop();
      const delRes = await fetch('https://bsky.social/xrpc/com.atproto.repo.deleteRecord', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${jwt}`
        },
        body: JSON.stringify({
          repo: did,
          collection: 'app.bsky.feed.post',
          rkey
        })
      });
      if (delRes.ok) {
        totalDeleted++;
      }
    }
  }

  console.log(`Purge complete. Total posts deleted: ${totalDeleted}`);
}

purgeAll();
