import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Inquest Case Files & FOIA Appeals
export const inquestCases = sqliteTable('inquest_cases', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  agency: text('agency').notNull(),
  foiaTrackingNumber: text('foia_tracking_number'),
  status: text('status').notNull().default('draft'), // draft, submitted, response_received, denied, in_appeal, resolved
  denialCategory: text('denial_category'), // (b)(4), (b)(5), (b)(6), glomar, glomar_overruled, etc.
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Bookmarked Threat Advisories & CVE Trackers
export const threatBookmarks = sqliteTable('threat_bookmarks', {
  id: text('id').primaryKey(),
  threatId: text('threat_id').notNull(),
  sourceName: text('source_name').notNull(),
  title: text('title').notNull(),
  severity: text('severity').notNull(),
  bookmarkedAt: integer('bookmarked_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// User Submissions / Inquiries / License Requests
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
