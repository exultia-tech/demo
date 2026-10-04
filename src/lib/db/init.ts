import { client } from './index';
import { hashPassword } from '@/lib/auth/crypto';

export async function initializeDatabase(): Promise<void> {
  const ddlStatements = [
    // 1. Users & Sessions
    `CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      email TEXT NOT NULL UNIQUE,
      name TEXT,
      password_hash TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      created_at INTEGER,
      updated_at INTEGER
    );`,
    `CREATE TABLE IF NOT EXISTS sessions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      expires_at INTEGER NOT NULL,
      created_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE IF NOT EXISTS subscriptions (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      product TEXT NOT NULL,
      tier TEXT NOT NULL DEFAULT 'free',
      status TEXT NOT NULL DEFAULT 'active',
      current_period_end INTEGER,
      created_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE IF NOT EXISTS inquiries (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      organization TEXT,
      product TEXT NOT NULL,
      tier TEXT,
      message TEXT,
      created_at INTEGER
    );`,
    `CREATE TABLE IF NOT EXISTS api_tokens (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      token_prefix TEXT NOT NULL,
      token_hash TEXT NOT NULL,
      scopes_json TEXT NOT NULL DEFAULT '["read:feeds"]',
      last_used_at INTEGER,
      expires_at INTEGER,
      created_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE IF NOT EXISTS oauth_accounts (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      provider TEXT NOT NULL,
      provider_account_id TEXT NOT NULL,
      email TEXT,
      access_token TEXT,
      scope TEXT,
      created_at INTEGER,
      updated_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE IF NOT EXISTS github_workflows (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      owner TEXT NOT NULL,
      repo TEXT NOT NULL,
      workflow_file TEXT NOT NULL DEFAULT 'build-ide.yml',
      default_branch TEXT NOT NULL DEFAULT 'main',
      personal_access_token TEXT,
      installation_id TEXT,
      is_active INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER,
      updated_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );`,

    // 2. Vantage
    `CREATE TABLE IF NOT EXISTS uvi_threats (
      uvi_id TEXT PRIMARY KEY,
      legacy_uvi_id TEXT,
      title TEXT NOT NULL,
      headline TEXT NOT NULL,
      summary TEXT NOT NULL,
      technical_details TEXT,
      global_impact TEXT,
      severity TEXT NOT NULL,
      cvss_score REAL NOT NULL DEFAULT 0,
      cvss_vector TEXT,
      cwe TEXT,
      domain_category TEXT NOT NULL,
      attack_vector TEXT,
      attack_complexity TEXT,
      privileges_required TEXT,
      user_interaction TEXT,
      scope TEXT,
      cve_list_json TEXT,
      ghsa_id TEXT,
      osv_id TEXT,
      msrc_id TEXT,
      has_direct_build_impact INTEGER NOT NULL DEFAULT 0,
      workstation_vector TEXT,
      build_pipeline_risk TEXT,
      recommendation_for_ide_builds TEXT,
      is_known_exploited INTEGER NOT NULL DEFAULT 0,
      ransomware_use INTEGER NOT NULL DEFAULT 0,
      disclosure_type TEXT,
      operational_domain TEXT,
      action_directive TEXT,
      weaponization_stage TEXT,
      exposure_horizon TEXT,
      published_date TEXT NOT NULL,
      last_updated_date TEXT NOT NULL,
      raw_record_json TEXT NOT NULL,
      ingested_at INTEGER
    );`,
    `CREATE INDEX IF NOT EXISTS idx_uvi_severity ON uvi_threats(severity);`,
    `CREATE INDEX IF NOT EXISTS idx_uvi_cvss ON uvi_threats(cvss_score DESC);`,
    `CREATE INDEX IF NOT EXISTS idx_uvi_domain ON uvi_threats(domain_category);`,
    `CREATE INDEX IF NOT EXISTS idx_uvi_op_domain ON uvi_threats(operational_domain);`,
    `CREATE INDEX IF NOT EXISTS idx_uvi_build_impact ON uvi_threats(has_direct_build_impact);`,
    `CREATE INDEX IF NOT EXISTS idx_uvi_kev ON uvi_threats(is_known_exploited);`,
    `CREATE INDEX IF NOT EXISTS idx_uvi_published ON uvi_threats(published_date DESC);`,

    `CREATE TABLE IF NOT EXISTS uvi_sync_logs (
      id TEXT PRIMARY KEY,
      status TEXT NOT NULL,
      total_records INTEGER NOT NULL,
      direct_build_impact_count INTEGER NOT NULL DEFAULT 0,
      non_cve_threats_count INTEGER NOT NULL DEFAULT 0,
      informational_disclosures_count INTEGER NOT NULL DEFAULT 0,
      duration_ms INTEGER NOT NULL DEFAULT 0,
      details_json TEXT,
      synced_at INTEGER
    );`,

    `CREATE TABLE IF NOT EXISTS threat_bookmarks (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      threat_id TEXT NOT NULL,
      sourceName TEXT NOT NULL,
      title TEXT NOT NULL,
      severity TEXT NOT NULL,
      bookmarked_at INTEGER
    );`,

    // 3. PureIDE Workstations & Security Controls
    `CREATE TABLE IF NOT EXISTS pureide_workstations (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      hostname TEXT NOT NULL,
      os_platform TEXT NOT NULL,
      os_version TEXT,
      agent_version TEXT NOT NULL,
      containment_mode TEXT NOT NULL DEFAULT 'strict',
      status TEXT NOT NULL DEFAULT 'online',
      last_heartbeat_at INTEGER,
      created_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );`,
    `CREATE TABLE IF NOT EXISTS pureide_security_events (
      id TEXT PRIMARY KEY,
      workstation_id TEXT,
      user_id TEXT,
      event_type TEXT NOT NULL,
      severity TEXT NOT NULL,
      threat_uvi_id TEXT,
      details TEXT NOT NULL,
      raw_payload_json TEXT,
      timestamp INTEGER,
      FOREIGN KEY (workstation_id) REFERENCES pureide_workstations(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );`,
    `CREATE TABLE IF NOT EXISTS pureide_policies (
      id TEXT PRIMARY KEY,
      organization_id TEXT,
      name TEXT NOT NULL,
      allowlist_publishers_json TEXT,
      blocklist_extensions_json TEXT,
      sandbox_profile TEXT NOT NULL DEFAULT 'hermetic',
      enable_token_redaction INTEGER NOT NULL DEFAULT 1,
      enable_egress_firewall INTEGER NOT NULL DEFAULT 1,
      created_at INTEGER,
      updated_at INTEGER
    );`,
    `CREATE TABLE IF NOT EXISTS pureide_builds (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      build_number TEXT NOT NULL,
      target_os TEXT NOT NULL,
      target_arch TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'ready',
      sha256 TEXT,
      download_url TEXT,
      created_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );`,

    // 4. Inquest Legal Discovery & FOIA Appeals
    `CREATE TABLE IF NOT EXISTS inquest_cases (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      case_number TEXT,
      title TEXT NOT NULL,
      agency TEXT NOT NULL,
      jurisdiction TEXT,
      foia_tracking_number TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      exemption_codes TEXT,
      denial_category TEXT,
      estimated_timeline TEXT,
      notes TEXT,
      created_at INTEGER,
      updated_at INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
    );`,
    `CREATE TABLE IF NOT EXISTS inquest_evidence_records (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      file_name TEXT NOT NULL,
      bates_number TEXT,
      file_hash TEXT,
      ocr_text TEXT,
      redaction_tags_json TEXT,
      relevance_score REAL DEFAULT 1.0,
      uploaded_at INTEGER,
      FOREIGN KEY (case_id) REFERENCES inquest_cases(id) ON DELETE CASCADE
    );`,
    `CREATE TABLE IF NOT EXISTS inquest_statutory_appeals (
      id TEXT PRIMARY KEY,
      case_id TEXT NOT NULL,
      appeal_type TEXT NOT NULL,
      target_agency TEXT NOT NULL,
      generated_brief_markdown TEXT NOT NULL,
      statutory_precedents_json TEXT,
      filing_deadline TEXT,
      status TEXT NOT NULL DEFAULT 'draft',
      created_at INTEGER,
      updated_at INTEGER,
      FOREIGN KEY (case_id) REFERENCES inquest_cases(id) ON DELETE CASCADE
    );`
  ];

  for (const sql of ddlStatements) {
    try {
      await client.execute(sql);
    } catch (e) {
      console.warn('DDL execution error (ignored if exists):', e);
    }
  }

  // Safe schema migrations for existing tables
  try {
    await client.execute(`ALTER TABLE inquest_cases ADD COLUMN user_id TEXT;`).catch(() => {});
    await client.execute(`ALTER TABLE inquest_cases ADD COLUMN case_number TEXT;`).catch(() => {});
    await client.execute(`ALTER TABLE inquest_cases ADD COLUMN jurisdiction TEXT;`).catch(() => {});
    await client.execute(`ALTER TABLE inquest_cases ADD COLUMN exemption_codes TEXT;`).catch(() => {});
    await client.execute(`ALTER TABLE inquest_cases ADD COLUMN estimated_timeline TEXT;`).catch(() => {});
    // Normalize legacy millisecond timestamps to Unix epoch seconds
    await client.execute(`UPDATE users SET created_at = CAST(created_at / 1000 AS INTEGER) WHERE created_at > 2000000000;`).catch(() => {});
    await client.execute(`UPDATE users SET updated_at = CAST(updated_at / 1000 AS INTEGER) WHERE updated_at > 2000000000;`).catch(() => {});
  } catch (e: any) {
    console.warn('Inquest migration notice:', e?.message || e);
  }
}

