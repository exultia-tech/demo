import { createClient } from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';
import * as schema from './schema';

function initClient() {
  let url = process.env.TURSO_DATABASE_URL || process.env.DATABASE_URL || 'file:local.db';
  const authToken = process.env.TURSO_AUTH_TOKEN || undefined;
  try {
    if (!url || (!url.startsWith('libsql://') && !url.startsWith('https://') && !url.startsWith('http://') && !url.startsWith('file:'))) {
      url = 'file:local.db';
    }
    return createClient({ url, authToken });
  } catch {
    return createClient({ url: 'file:local.db' });
  }
}

export const client = initClient();

export const db = drizzle(client, { schema });
export * from './schema';
