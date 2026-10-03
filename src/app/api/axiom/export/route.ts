import { NextResponse } from 'next/server';
import { db, users, apiTokens, subscriptions } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { verifyPassword } from '@/lib/auth/crypto';
import { MOCK_EXAM_DB } from '@/lib/axiom-exam-data';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Missing or invalid Authorization header. Provide an Exultia PAT.' }, { status: 401 });
    }

    const rawToken = authHeader.split(' ')[1];
    const prefix = `${rawToken.substring(0, 16)}...`;

    // 1. Find matching tokens by prefix to avoid O(N) full table scan for hashes
    const matchingTokens = await db.query.apiTokens.findMany({
      where: eq(apiTokens.tokenPrefix, prefix),
    });

    let validTokenRecord = null;
    for (const t of matchingTokens) {
      if (verifyPassword(rawToken, t.tokenHash)) {
        validTokenRecord = t;
        break;
      }
    }

    if (!validTokenRecord) {
      return NextResponse.json({ error: 'Invalid API token.' }, { status: 401 });
    }

    // 2. Check token expiry
    if (validTokenRecord.expiresAt && new Date() > validTokenRecord.expiresAt) {
      return NextResponse.json({ error: 'API token has expired.' }, { status: 403 });
    }

    // 3. Get the user
    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, validTokenRecord.userId),
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'Associated user account not found.' }, { status: 404 });
    }

    // 4. Check Enterprise LMS Entitlement
    const axiomSub = await db.query.subscriptions.findFirst({
      where: and(
        eq(subscriptions.userId, userRecord.id),
        eq(subscriptions.product, 'axiom'),
        eq(subscriptions.status, 'active')
      ),
    });

    if (!axiomSub || axiomSub.tier !== 'enterprise') {
      return NextResponse.json({ 
        error: 'Active Axiom Enterprise LMS tier required.', 
        code: 'UPGRADE_REQUIRED',
        message: 'Your current tier does not grant API endpoint access for LMS synchronization. Upgrade to Axiom Enterprise to unlock this endpoint.'
      }, { status: 403 });
    }

    // 5. Enforce Content Protection & Quota via Stateless Seeded Sync
    // To prevent a user from paying $499 for 1 month and dumping the entire 15,000 question bank,
    // we use a deterministic Seeded PRNG. The seed is composed of: userId + Month + Year.
    // This guarantees the user gets the EXACT same 250 questions for the entire month,
    // but automatically rotates to a fresh batch on the 1st of the next month.
    
    // Parse requested limit, cap at 250 max.
    const url = new URL(req.url);
    const limitParam = url.searchParams.get('limit');
    let limit = 250;
    if (limitParam && !isNaN(Number(limitParam))) {
        limit = Math.min(250, Math.max(1, Number(limitParam)));
    }

    // Seed string
    const now = new Date();
    const seedString = `${userRecord.id}_${now.getUTCFullYear()}_${now.getUTCMonth()}`;
    
    // Simple fast string hasher
    let seed = 0;
    for (let i = 0; i < seedString.length; i++) {
        seed = Math.imul(31, seed) + seedString.charCodeAt(i) | 0;
    }

    // Mulberry32 PRNG
    const random = () => {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };

    // Shuffle the indices deterministically
    const indices = Array.from({ length: MOCK_EXAM_DB.length }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    // Get the assigned question block
    const questionBlock = indices.slice(0, limit).map(idx => MOCK_EXAM_DB[idx]);

    // 6. Build LMS Export format
    const lmsFormat = questionBlock.map(q => ({
      guid: q.id,
      domain: q.domain,
      difficulty: q.difficulty,
      stem: q.question,
      options: q.options,
      correct_index: q.correctAnswer,
      explanation: q.explanation,
      tags: ['Security', 'Certification', 'Axiom'],
      last_updated: new Date().toISOString()
    }));

    // Update lastUsedAt asynchronously
    db.update(apiTokens)
      .set({ lastUsedAt: new Date() })
      .where(eq(apiTokens.id, validTokenRecord.id))
      .execute();

    return NextResponse.json({
      success: true,
      meta: {
        total_questions: lmsFormat.length,
        quota_limit: 250,
        quota_remaining: 250 - lmsFormat.length,
        format: "LMS_SCORM_COMPATIBLE_JSON",
        license: "ENTERPRISE_INTERNAL_ONLY",
        exported_by: userRecord.email,
        timestamp: new Date().toISOString()
      },
      data: lmsFormat
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to export LMS content' }, { status: 500 });
  }
}
