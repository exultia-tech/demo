import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

// Users Table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  email: text('email').notNull().unique(),
  name: text('name'),
  passwordHash: text('password_hash').notNull(),
  role: text('role').notNull().default('user'), // user, admin
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Sessions Table
export const sessions = sqliteTable('sessions', {
  id: text('id').primaryKey(), // session token
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Subscriptions & Payment Tiers (Stripe Ready)
export const subscriptions = sqliteTable('subscriptions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  product: text('product').notNull(), // pureide, uvi, inquest
  tier: text('tier').notNull().default('free'), // free, pro, legal, enterprise
  status: text('status').notNull().default('active'), // active, past_due, canceled
  currentPeriodEnd: integer('current_period_end', { mode: 'timestamp' }),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Inquest Case Files & FOIA Appeals
export const inquestCases = sqliteTable('inquest_cases', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
  title: text('title').notNull(),
  agency: text('agency').notNull(),
  foiaTrackingNumber: text('foia_tracking_number'),
  status: text('status').notNull().default('draft'), // draft, submitted, response_received, denied, in_appeal, resolved
  denialCategory: text('denial_category'),
  notes: text('notes'),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

// Bookmarked Threat Advisories & CVE Trackers
export const threatBookmarks = sqliteTable('threat_bookmarks', {
  id: text('id').primaryKey(),
  userId: text('user_id'),
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
