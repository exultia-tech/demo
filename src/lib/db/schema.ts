import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

// ============================================================================
// 1. Users, Authentication & Subscriptions
// ============================================================================

export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('user'), // user, admin, enterprise_admin
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(), // session token
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  product: text('product').notNull(), // pureide, uvi, inquest
  tier: text('tier').notNull().default('free'), // free, pro, legal, enterprise
  status: text('status').notNull().default('active'), // active, past_due, canceled
  currentPeriodEnd: integer('current_period_end', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const inquiries = sqliteTable('inquiries', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  organization: text('organization'),
  product: text('product').notNull(), // pureide, uvi, inquest
  tier: text('tier'), // pro, legal, enterprise
  message: text('message'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const apiTokens = sqliteTable('api_tokens', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  tokenPrefix: text('token_prefix').notNull(), // e.g. "exultia_pat_..."
  tokenHash: text('token_hash').notNull(),
  scopesJson: text('scopes_json').notNull().default('["read:feeds"]'),
  lastUsedAt: integer('last_used_at', { mode: 'timestamp' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ============================================================================
// 2. Vantage Feed & Catalog
// ============================================================================

export const uviThreats = sqliteTable('uvi_threats', {
  uviId: text('uvi_id').primaryKey(), // e.g. Vantage-2026-09-00000001
  legacyUviId: text('legacy_uvi_id'),
  title: text('title').notNull(),
  headline: text('headline').notNull(),
  summary: text('summary').notNull(),
  technicalDetails: text('technical_details'),
  globalImpact: text('global_impact'),
  severity: text('severity').notNull(), // CRITICAL, HIGH, MEDIUM, LOW, INFORMATIONAL
  cvssScore: real('cvss_score').notNull().default(0),
  cvssVector: text('cvss_vector'),
  cwe: text('cwe'),
  domainCategory: text('domain_category').notNull(),
  attackVector: text('attack_vector'),
  attackComplexity: text('attack_complexity'),
  privilegesRequired: text('privileges_required'),
  userInteraction: text('user_interaction'),
  scope: text('scope'),
  cveListJson: text('cve_list_json'), // JSON array string
  ghsaId: text('ghsa_id'),
  osvId: text('osv_id'),
  msrcId: text('msrc_id'),
  hasDirectBuildImpact: integer('has_direct_build_impact').notNull().default(0),
  workstationVector: text('workstation_vector'),
  buildPipelineRisk: text('build_pipeline_risk'),
  recommendationForIdeBuilds: text('recommendation_for_ide_builds'),
  isKnownExploited: integer('is_known_exploited').notNull().default(0),
  ransomwareUse: integer('ransomware_use').notNull().default(0),
  disclosureType: text('disclosure_type'),
  operationalDomain: text('operational_domain'), // PATCH, ENDPOINT, IDENTITY, SUPPLY, PIPELINE, AGENT, NETWORK
  actionDirective: text('action_directive'),
  weaponizationStage: text('weaponization_stage'),
  exposureHorizon: text('exposure_horizon'),
  publishedDate: text('published_date').notNull(),
  lastUpdatedDate: text('last_updated_date').notNull(),
  rawRecordJson: text('raw_record_json').notNull(), // Complete serialized UviAdvisoryRecord
  ingestedAt: integer('ingested_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const uviSyncLogs = sqliteTable('uvi_sync_logs', {
  id: text('id').primaryKey(),
  status: text('status').notNull(), // SUCCESS, PARTIAL, FAILED
  totalRecords: integer('total_records').notNull(),
  directBuildImpactCount: integer('direct_build_impact_count').notNull().default(0),
  nonCveThreatsCount: integer('non_cve_threats_count').notNull().default(0),
  informationalDisclosuresCount: integer('informational_disclosures_count').notNull().default(0),
  durationMs: integer('duration_ms').notNull().default(0),
  detailsJson: text('details_json'),
  syncedAt: integer('synced_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const threatBookmarks = sqliteTable('threat_bookmarks', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  threatId: text('threat_id').notNull(),
  sourceName: text('source_name').notNull(),
  title: text('title').notNull(),
  severity: text('severity').notNull(),
  bookmarkedAt: integer('bookmarked_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ============================================================================
// 3. PureIDE Workstation Security, Telemetry & Policy Control
// ============================================================================

export const pureideWorkstations = sqliteTable('pureide_workstations', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  hostname: text('hostname').notNull(),
  osPlatform: text('os_platform').notNull(), // windows, macos, linux
  osVersion: text('os_version'),
  agentVersion: text('agent_version').notNull(),
  containmentMode: text('containment_mode').notNull().default('strict'), // strict, monitor, airgap
  status: text('status').notNull().default('online'), // online, offline, isolated
  lastHeartbeatAt: integer('last_heartbeat_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const pureideSecurityEvents = sqliteTable('pureide_security_events', {
  id: text('id').primaryKey(),
  workstationId: text('workstation_id').references(() => pureideWorkstations.id, { onDelete: 'cascade' }),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  eventType: text('event_type').notNull(), // EXTENSION_BLOCKED, C2_BLOCKED, HOOK_KILLED, SECRETS_INTERCEPTED, ANOMALY
  severity: text('severity').notNull(), // CRITICAL, HIGH, MEDIUM, LOW
  threatUviId: text('threat_uvi_id'),
  details: text('details').notNull(),
  rawPayloadJson: text('raw_payload_json'),
  timestamp: integer('timestamp', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const pureidePolicies = sqliteTable('pureide_policies', {
  id: text('id').primaryKey(),
  organizationId: text('organization_id'),
  name: text('name').notNull(),
  allowlistPublishersJson: text('allowlist_publishers_json'),
  blocklistExtensionsJson: text('blocklist_extensions_json'),
  sandboxProfile: text('sandbox_profile').notNull().default('hermetic'), // hermetic, permissive, strict_airgap
  enableTokenRedaction: integer('enable_token_redaction').notNull().default(1),
  enableEgressFirewall: integer('enable_egress_firewall').notNull().default(1),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const pureideBuilds = sqliteTable('pureide_builds', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  buildNumber: text('build_number').notNull(),
  targetOs: text('target_os').notNull(), // windows-x64, macos-arm64, linux-x64
  targetArch: text('target_arch').notNull(),
  status: text('status').notNull().default('ready'),
  sha256: text('sha256'),
  downloadUrl: text('download_url'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// ============================================================================
// 4. Inquest Legal Discovery, FOIA Appeals & Document Evidence
// ============================================================================

export const inquestCases = sqliteTable('inquest_cases', {
  id: text('id').primaryKey(),
  userId: text('user_id').references(() => users.id, { onDelete: 'set null' }),
  caseNumber: text('case_number'),
  title: text('title').notNull(),
  agency: text('agency').notNull(),
  jurisdiction: text('jurisdiction'),
  foiaTrackingNumber: text('foia_tracking_number'),
  status: text('status').notNull().default('draft'), // draft, submitted, response_received, denied, in_appeal, in_litigation, resolved
  exemptionCodes: text('exemption_codes'), // e.g. "Exemption 4, Exemption 7(A)"
  denialCategory: text('denial_category'),
  estimatedTimeline: text('estimated_timeline'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const inquestEvidenceRecords = sqliteTable('inquest_evidence_records', {
  id: text('id').primaryKey(),
  caseId: text('case_id').notNull().references(() => inquestCases.id, { onDelete: 'cascade' }),
  fileName: text('file_name').notNull(),
  batesNumber: text('bates_number'),
  fileHash: text('file_hash'),
  ocrText: text('ocr_text'),
  redactionTagsJson: text('redaction_tags_json'),
  relevanceScore: real('relevance_score').default(1.0),
  uploadedAt: integer('uploaded_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const inquestStatutoryAppeals = sqliteTable('inquest_statutory_appeals', {
  id: text('id').primaryKey(),
  caseId: text('case_id').notNull().references(() => inquestCases.id, { onDelete: 'cascade' }),
  appealType: text('appeal_type').notNull(), // ADMINISTRATIVE_APPEAL, GLOMAR_CHALLENGE, EXPEDITION_REQUEST, JUDICIAL_COMPLAINT
  targetAgency: text('target_agency').notNull(),
  generatedBriefMarkdown: text('generated_brief_markdown').notNull(),
  statutoryPrecedentsJson: text('statutory_precedents_json'),
  filingDeadline: text('filing_deadline'),
  status: text('status').notNull().default('draft'), // draft, finalized, submitted, granted, denied
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
