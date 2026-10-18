import { db, users, apiTokens, subscriptions } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { verifyPassword } from '@/lib/auth/crypto';
import { getCurrentUser } from '@/lib/auth/session';

export type AxiomTier = 'free' | 'pro' | 'enterprise';

export interface AxiomAuthContext {
  user: {
    id: string;
    email: string;
    name?: string | null;
    role: string;
  };
  tier: AxiomTier;
}

/**
 * Resolves authenticated user and active Axiom tier via Session Cookie OR Bearer PAT.
 */
export async function resolveAxiomAuthAndTier(req: Request): Promise<AxiomAuthContext | null> {
  let authenticatedUser: { id: string; email: string; name?: string | null; role: string } | null = null;
  let validTokenRecord: any = null;

  // 1. Check session cookie
  const sessionUser = await getCurrentUser();
  if (sessionUser) {
    authenticatedUser = {
      id: sessionUser.id,
      email: sessionUser.email,
      name: sessionUser.name,
      role: sessionUser.role,
    };
  } else {
    // 2. Check Bearer authorization header
    const authHeader = req.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const rawToken = authHeader.split(' ')[1];
      const prefix = `${rawToken.substring(0, 16)}...`;

      const matchingTokens = await db.query.apiTokens.findMany({
        where: eq(apiTokens.tokenPrefix, prefix),
      });

      for (const t of matchingTokens) {
        if (verifyPassword(rawToken, t.tokenHash)) {
          validTokenRecord = t;
          break;
        }
      }

      if (validTokenRecord) {
        if (validTokenRecord.expiresAt && new Date() > validTokenRecord.expiresAt) {
          return null; // Expired
        }

        const userRecord = await db.query.users.findFirst({
          where: eq(users.id, validTokenRecord.userId),
        });

        if (userRecord) {
          authenticatedUser = {
            id: userRecord.id,
            email: userRecord.email,
            name: userRecord.name,
            role: userRecord.role,
          };
          db.update(apiTokens)
            .set({ lastUsedAt: new Date() })
            .where(eq(apiTokens.id, validTokenRecord.id))
            .execute()
            .catch(() => {});
        }
      }
    }
  }

  if (!authenticatedUser) return null;

  let tier: AxiomTier = 'free';
  if (authenticatedUser.role === 'admin') {
    tier = 'enterprise';
  } else {
    const userSubs = await db.query.subscriptions.findMany({
      where: and(
        eq(subscriptions.userId, authenticatedUser.id),
        eq(subscriptions.status, 'active')
      ),
    });

    const axiomSub = userSubs.find(s => s.product === 'axiom');
    const multiSub = userSubs.find(s => s.product === 'multipass');

    const rawTier = (axiomSub?.tier || multiSub?.tier || 'free').toLowerCase();
    if (rawTier === 'enterprise') {
      tier = 'enterprise';
    } else if (rawTier === 'pro') {
      tier = 'pro';
    } else {
      tier = 'free';
    }
  }

  return {
    user: authenticatedUser,
    tier,
  };
}
