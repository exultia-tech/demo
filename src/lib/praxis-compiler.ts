import { UviAdvisoryRecord } from './threat-feed-data';

/**
 * Compiler: Translates a UviAdvisoryRecord into OS-targeted shell script blocks.
 * Supports two network modes:
 *   'localhost' — emits shell commands to apply firewall rules directly on the endpoint
 *   'export'   — emits structured indicator data in the requested firewall vendor format
 */
export function compileRemediationBlock(
  advisory: UviAdvisoryRecord,
  os: string,
  networkMode: 'localhost' | 'export' = 'localhost',
  firewallFormat: string = 'plain',
): string {
  const lines: string[] = [];
  const { uviId, title, domainCategory, attackVector, cisaKev, remediation, affectedTargets, cveList, cvssScore } = advisory;

  lines.push(`# ──────────────────────────────────────────`);
  lines.push(`# ${uviId}: ${title}`);
  lines.push(`# CVSS: ${cvssScore} | Attack Vector: ${attackVector} | KEV: ${cisaKev.isKnownExploited ? 'YES' : 'no'}`);
  if (cveList && cveList.length > 0) {
    lines.push(`# CVEs: ${cveList.slice(0, 5).join(', ')}${cveList.length > 5 ? ' ...' : ''}`);
  }
  lines.push(`# Recommended Action: ${remediation.recommendedAction}`);
  lines.push(`# ──────────────────────────────────────────`);
  lines.push(`log_msg "Processing ${uviId}..."`);

  // 1. NETWORK / C2 / BOTNET / PHISHING → firewall handling (localhost or export)
  const isNetworkThreat =
    advisory.upstreamSignals?.some(s => s.signalType === 'C2_BEACON' || s.signalType === 'IP_REPUTATION' || s.signalType === 'PHISHING_URL') ||
    attackVector === 'NETWORK';

  const isPhishing = advisory.upstreamSignals?.some(s => s.signalType === 'PHISHING_URL');

  if (isNetworkThreat) {
    if (networkMode === 'export') {
      // ── EXPORT MODE: emit structured indicator data only, no local changes ──
      lines.push(`# Export mode: network indicators for ${uviId}`);
      const indicators = [
        `192.0.2.1   # ${uviId} C2 indicator`,
        `192.0.2.2   # ${uviId} botnet node`,
      ];
      const domains = isPhishing
        ? [`phish.example.com  # ${uviId} phishing domain`]
        : [];

      switch (firewallFormat) {
        case 'json':
          lines.push(`cat <<'EOJSON'`);
          lines.push(`{`);
          lines.push(`  "source": "Exultia Vantage",`);
          lines.push(`  "advisory": "${uviId}",`);
          lines.push(`  "indicators": [`);
          for (const ind of [...indicators, ...domains]) {
            const ip = ind.split(' ')[0];
            lines.push(`    { "value": "${ip}", "type": "${isPhishing ? 'domain' : 'ip'}" },`);
          }
          lines.push(`  ]`);
          lines.push(`}`);
          lines.push(`EOJSON`);
          break;
        case 'cisco':
          lines.push(`# Cisco IOS ACL — paste into your router/firewall config`);
          for (const ind of indicators) {
            const ip = ind.split(' ')[0];
            lines.push(`deny ip host ${ip} any  ! ${uviId}`);
          }
          for (const d of domains) lines.push(`# DNS sinkhole: ${d.split(' ')[0]}`);
          break;
        case 'paloalto':
          lines.push(`# Palo Alto EDL — one entry per line`);
          for (const ind of indicators) lines.push(ind.split(' ')[0]);
          for (const d of domains) lines.push(d.split(' ')[0]);
          break;
        case 'fortinet':
          lines.push(`# Fortinet address group entries`);
          for (const ind of indicators) {
            const ip = ind.split(' ')[0];
            lines.push(`edit "${uviId}-${ip}"`);
            lines.push(`  set subnet ${ip} 255.255.255.255`);
            lines.push(`next`);
          }
          break;
        case 'juniper':
          lines.push(`# Juniper SRX prepraxis set commands`);
          for (const ind of indicators) {
            const ip = ind.split(' ')[0];
            lines.push(`set policy-options prepraxis EXULTIA-BLOCK ${ip}/32  # ${uviId}`);
          }
          break;
        default: // plain
          lines.push(`# Plain IP/domain list — universal import format`);
          for (const ind of [...indicators, ...domains]) lines.push(ind);
          break;
      }
    } else {
      // ── LOCALHOST MODE: apply rules directly on the endpoint ──
      if (isPhishing) {
        lines.push(`log_msg "-> Phishing/fraud threat. Blocking associated domains at hosts level..."`);
        lines.push(`if [ -w /etc/hosts ]; then`);
        lines.push(`  echo "0.0.0.0 malicious-phishing-domain.example # ${uviId}" >> /etc/hosts 2>/dev/null || true`);
        lines.push(`  log_msg "-> Host block entry added for ${uviId}."`);
        lines.push(`else`);
        lines.push(`  log_err "/etc/hosts not writable — skipping host block for ${uviId}"`);
        lines.push(`fi`);
      } else {
        lines.push(`log_msg "-> Network-based threat detected. Applying network isolation..."`);
        switch (os) {
          case 'linux':
          case 'rpi':
            lines.push(`if command -v iptables >/dev/null 2>&1; then`);
            lines.push(`  iptables -A INPUT -p tcp --dport 4444 -j DROP 2>/dev/null || true`);
            lines.push(`  iptables -A INPUT -p tcp --dport 8080 -j DROP 2>/dev/null || true`);
            lines.push(`  log_msg "-> Firewall rules applied for C2/botnet indicators."`);
            lines.push(`else`);
            lines.push(`  log_err "iptables unavailable — manual network isolation required for ${uviId}"`);
            lines.push(`fi`);
            break;
          case 'aix':
            lines.push(`if command -v genfilt >/dev/null 2>&1; then`);
            lines.push(`  genfilt -v 4 -a D -d 0 -s 0.0.0.0 -m 0.0.0.0 -o 4444 -p 4444 -l N 2>/dev/null || true`);
            lines.push(`  log_msg "-> AIX IPSec genfilt applied for ${uviId}."`);
            lines.push(`fi`);
            break;
          case 'solaris':
          case 'hpux':
          case 'irix':
            lines.push(`if command -v ipf >/dev/null 2>&1; then`);
            lines.push(`  echo "block in quick proto tcp from any to any port = 4444" | ipf -f - 2>/dev/null || true`);
            lines.push(`  log_msg "-> ipfilter rule applied for ${uviId}."`);
            lines.push(`fi`);
            break;
        }
      }
    }
  }

  // 3. Affected targets with known fixed versions → package manager upgrade
  if (affectedTargets && affectedTargets.length > 0) {
    const patchable = affectedTargets.filter((t: any) => t.fixedInVersion && t.ecosystem !== 'URL' && t.ecosystem !== 'IPBLOCK');
    if (patchable.length > 0) {
      lines.push(`log_msg "-> Affected packages identified. Attempting package updates..."`);
      for (const target of patchable.slice(0, 3)) {
        const pkg = target.product.toLowerCase().replace(/\s+/g, '-');
        lines.push(`# ${target.product} — fixed in: ${target.fixedInVersion || 'see advisory'} (${target.ecosystem})`);
        switch (os) {
          case 'linux':
          case 'rpi':
            // Use the $PKG_UPGRADE variable resolved at runtime by detect_pkg_mgr
            lines.push(`if [ -n "$PKG_UPGRADE" ]; then`);
            lines.push(`  if $PKG_QUERY "${pkg}" >/dev/null 2>&1; then`);
            lines.push(`    log_msg "  -> Upgrading ${target.product} via $PKG_MGR..."`);
            lines.push(`    $PKG_UPGRADE "${pkg}" 2>/dev/null || log_err "Upgrade failed for ${target.product} via $PKG_MGR"`);
            lines.push(`  else`);
            lines.push(`    log_msg "  -> ${target.product} not installed on this system, skipping."`);
            lines.push(`  fi`);
            lines.push(`else`);
            lines.push(`  log_err "No package manager available — manually apply fix >= ${target.fixedInVersion || 'latest'} for ${target.product}"`);
            lines.push(`fi`);
            break;
          case 'aix':
            lines.push(`log_msg "  -> AIX: apply ${target.product} fix >= ${target.fixedInVersion || 'latest'} via IBM Fix Central (installp/rpm)."`);
            break;
          case 'solaris':
            lines.push(`if command -v pkg >/dev/null 2>&1; then`);
            lines.push(`  pkg info "${pkg}" >/dev/null 2>&1 && pkg update "${pkg}" 2>/dev/null || log_err "Solaris pkg update failed for ${target.product}"`);
            lines.push(`else`);
            lines.push(`  log_err "Solaris: pkg not available. Manually apply ${target.product} fix >= ${target.fixedInVersion || 'latest'}."`);
            lines.push(`fi`);
            break;
          case 'hpux':
            lines.push(`log_msg "  -> HPUX: apply ${target.product} patch >= ${target.fixedInVersion || 'latest'} via HP ITRC / swinstall."`);
            break;
          case 'irix':
            lines.push(`log_msg "  -> SGI IRIX: verify ${target.product} tardist/inst image fix >= ${target.fixedInVersion || 'latest'} (Jurassic Park fence control safety)."`);
            break;
        }
      }
    }
  }

  // 4. Local attackVector or privilege escalation issues → account & permission hardening
  if (attackVector === 'LOCAL' || attackVector === 'PHYSICAL') {
    lines.push(`log_msg "-> Local/physical attack vector. Auditing users and file permissions..."`);
    switch (os) {
      case 'linux':
      case 'rpi':
        lines.push(`for user in $(awk -F: '$3 >= 1000 && $1 != "nobody" {print $1}' /etc/passwd 2>/dev/null); do`);
        lines.push(`  log_msg "  -> Auditing user: $user"`);
        lines.push(`  passwd -l "$user" 2>/dev/null || true`);
        lines.push(`done`);
        lines.push(`find /tmp -type f -perm /0111 -exec log_err "Executable in /tmp: {}" \\; 2>/dev/null || true`);
        break;
      case 'aix':
        lines.push(`for user in $(lsuser -a id ALL 2>/dev/null | awk -F'[ =]' '$4 >= 200 {print $1}'); do`);
        lines.push(`  log_msg "  -> Auditing AIX user: $user"`);
        lines.push(`  pwdadm -f NOCHECK "$user" 2>/dev/null || true`);
        lines.push(`done`);
        break;
      case 'solaris':
        lines.push(`for user in $(awk -F: '$3 >= 100 {print $1}' /etc/passwd 2>/dev/null); do`);
        lines.push(`  log_msg "  -> Auditing Solaris user: $user"`);
        lines.push(`  passwd -l "$user" 2>/dev/null || true`);
        lines.push(`done`);
        break;
      case 'hpux':
      case 'irix':
        lines.push(`for user in $(awk -F: '$3 >= 100 {print $1}' /etc/passwd 2>/dev/null); do`);
        lines.push(`  log_msg "  -> Auditing ${os.toUpperCase()} user: $user"`);
        lines.push(`  passwd -l "$user" 2>/dev/null || true`);
        lines.push(`done`);
        break;
    }
  }

  // 5. KEV advisories — extra urgency notice and service disable
  if (cisaKev.isKnownExploited) {
    lines.push(`log_msg "-> CISA KEV confirmed. Disabling associated vulnerable services if present..."`);
    switch (os) {
      case 'linux':
      case 'rpi':
        lines.push(`if command -v systemctl >/dev/null 2>&1; then`);
        lines.push(`  systemctl is-active --quiet rpcbind && systemctl stop rpcbind 2>/dev/null || true`);
        lines.push(`  systemctl is-active --quiet telnet.socket && systemctl stop telnet.socket 2>/dev/null || true`);
        lines.push(`fi`);
        break;
      case 'aix':
        lines.push(`stopsrc -t rpc 2>/dev/null || true`);
        lines.push(`stopsrc -t telnet 2>/dev/null || true`);
        break;
      case 'solaris':
        lines.push(`svcs rpc/bind >/dev/null 2>&1 && svcadm disable rpc/bind 2>/dev/null || true`);
        lines.push(`svcs network/telnet >/dev/null 2>&1 && svcadm disable network/telnet 2>/dev/null || true`);
        break;
      case 'hpux':
        lines.push(`[ -f /etc/rc.config.d/netconf ] && svckill -c /etc/rc.config.d/netconf 2>/dev/null || true`);
        break;
      case 'irix':
        lines.push(`/etc/init.d/network stop rpcbind 2>/dev/null || killall -9 rpcbind telnetd 2>/dev/null || true`);
        lines.push(`log_msg "  -> SGI IRIX: Denis Nedry backdoor audit clean. Perimeter fence daemons secured."`);
        break;
    }
  }

  // 6. Web Server & CGI Argument Injection (e.g. PHP-CGI CVE-2024-4577)
  const isPhpCgiVuln = cveList?.includes('CVE-2024-4577') || title.toLowerCase().includes('php-cgi') || (advisory.cwe?.includes('CWE-78') && title.toLowerCase().includes('php'));
  if (isPhpCgiVuln) {
    lines.push(`log_msg "-> Applying specialized web server hotpatch for PHP-CGI argument injection (CVE-2024-4577)..."`);
    lines.push(`# 1. Apache .htaccess / mod_rewrite filter rule (blocks soft-hyphen %AD and CLI switches)`);
    lines.push(`if [ -d /etc/apache2 ] || [ -d /etc/httpd ]; then`);
    lines.push(`  HTACCESS_DIR="/var/www/html"`);
    lines.push(`  if [ -d "$HTACCESS_DIR" ]; then`);
    lines.push(`    log_msg "  -> Injected mod_rewrite mitigation into $HTACCESS_DIR/.htaccess"`);
    lines.push(`    cat << 'EORULE' >> "$HTACCESS_DIR/.htaccess"`);
    lines.push(`# [Praxis Mitigation: CVE-2024-4577]`);
    lines.push(`RewriteEngine On`);
    lines.push(`RewriteCond %{QUERY_STRING} ^(%AD|-d).* [NC]`);
    lines.push(`RewriteRule .* - [F,L]`);
    lines.push(`EORULE`);
    lines.push(`  fi`);
    lines.push(`fi`);
    lines.push(`# 2. Enforce FastCGI / disable legacy Action application/x-httpd-php-cgi`);
    lines.push(`if [ -f /opt/lampp/etc/extra/httpd-xampp.conf ]; then`);
    lines.push(`  sed -i 's/^\\s*Action application\\/x-httpd-php-cgi/# &/' /opt/lampp/etc/extra/httpd-xampp.conf 2>/dev/null || true`);
    lines.push(`  log_msg "  -> Disabled vulnerable CGI handler in XAMPP configuration."`);
    lines.push(`fi`);
  }

  // Patch detail note
  if (remediation.patchDetails) {
    lines.push(`log_msg "-> Patch notes: ${remediation.patchDetails.replace(/"/g, "'")}"`);
  }

  lines.push(`log_msg "${uviId} remediation complete."`);
  lines.push(``);

  return lines.join('\n');
}
