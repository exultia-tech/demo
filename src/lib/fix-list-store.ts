// In-memory store for one-time fix-list scripts
// In a serverless production environment, this would be Redis or Turso with a TTL.

export const scriptStore = new Map<string, string>();
