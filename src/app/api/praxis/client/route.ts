import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const os = searchParams.get('os') || 'linux';
  const cron = searchParams.get('cron') === 'true';
  const lang = searchParams.get('lang') || 'bash';

  // In production, this should be the actual deployment URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://exultia.tech';

  if (lang === 'bash') {
    let script = `#!/bin/sh
# Exultia Lightweight Praxis Client
# OS Target: ${os}
# 
# This script retrieves and applies threat remediations from Exultia.
# Zero system telemetry is collected.

FEED_URL="${baseUrl}/api/praxis/feed?os=${os}"

fetch_and_apply() {
  # Attempt to use curl, fallback to wget
  if command -v curl >/dev/null 2>&1; then
    PAYLOAD=$(curl -sL "$FEED_URL")
  elif command -v wget >/dev/null 2>&1; then
    PAYLOAD=$(wget -qO- "$FEED_URL")
  else
    echo "Error: Neither curl nor wget is available."
    exit 1
  fi

  if [ -n "$PAYLOAD" ]; then
    echo "Executing remediation payload..."
    # Execute the payload in a subshell
    echo "$PAYLOAD" | sh
  else
    echo "No new remediations available."
  fi
}

`;

    if (cron) {
      script += `setup_cron() {
  # Attempt to resolve absolute path of this script
  SCRIPT_PATH=$(readlink -f "$0" 2>/dev/null || echo "$PWD/$0")
  
  # Generate a random minute (0-59) to prevent thundering herd
  # RANDOM is a bash extension, fallback to awk if unavailable
  if [ -n "$RANDOM" ]; then
    RAND_MIN=$((RANDOM % 60))
  else
    RAND_MIN=$(awk 'BEGIN{srand();print int(rand()*60)}')
  fi
  
  CRON_JOB="$RAND_MIN * * * * $SCRIPT_PATH"
  
  # Update crontab if this job isn't already there
  if ! crontab -l 2>/dev/null | grep -qF "$SCRIPT_PATH"; then
    echo "Installing cron job to run daily..."
    (crontab -l 2>/dev/null; echo "$CRON_JOB") | crontab -
  fi
}

setup_cron
`;
    }

    script += `\nfetch_and_apply\n`;

    return new NextResponse(script, {
      headers: {
        'Content-Type': 'text/plain',
        'Cache-Control': 'no-store'
      }
    });
  }

  return new NextResponse('Unsupported language configuration.', { status: 400 });
}
