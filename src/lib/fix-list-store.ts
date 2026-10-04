import { db } from './db';
import { fixListScripts } from './db/schema';
import { eq } from 'drizzle-orm';

export const scriptStore = {
  async set(id: string, data: { script: string, filenamePattern?: string }) {
    await db.insert(fixListScripts).values({
      id,
      script: data.script,
      filenamePattern: data.filenamePattern || null
    });
  },
  
  async get(id: string) {
    const result = await db.select().from(fixListScripts).where(eq(fixListScripts.id, id)).limit(1);
    if (result.length > 0) {
      return result[0];
    }
    return undefined;
  },

  async delete(id: string) {
    await db.delete(fixListScripts).where(eq(fixListScripts.id, id));
  }
};
