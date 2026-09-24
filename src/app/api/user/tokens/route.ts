import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { db, apiTokens } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { hashPassword, generateToken } from '@/lib/auth/crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const tokens = await db.query.apiTokens.findMany({
      where: eq(apiTokens.userId, sessionUser.id),
      orderBy: (tokens, { desc }) => [desc(tokens.createdAt)],
    });

    return NextResponse.json({
      success: true,
      tokens: tokens.map(t => {
        let scopes: string[] = [];
        try {
          scopes = JSON.parse(t.scopesJson);
        } catch {
          scopes = ['read:feeds'];
        }

        return {
          id: t.id,
          name: t.name,
          tokenPrefix: t.tokenPrefix,
          scopes,
          lastUsedAt: t.lastUsedAt,
          expiresAt: t.expiresAt,
          createdAt: t.createdAt,
        };
      }),
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to fetch API tokens' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { name, scopes, expiryDays } = body;

    if (!name || !name.trim()) {
      return NextResponse.json({ error: 'Token description / name is required' }, { status: 400 });
    }

    const rawSecret = `exultia_pat_${generateToken()}`;
    const tokenPrefix = `${rawSecret.substring(0, 16)}...`;
    const tokenHash = hashPassword(rawSecret);
    const tokenId = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const selectedScopes = Array.isArray(scopes) && scopes.length > 0
      ? scopes
      : ['read:threats', 'read:stats'];

    const expiresAt = expiryDays && Number(expiryDays) > 0
      ? new Date(Date.now() + Number(expiryDays) * 24 * 60 * 60 * 1000)
      : null;

    await db.insert(apiTokens).values({
      id: tokenId,
      userId: sessionUser.id,
      name: name.trim(),
      tokenPrefix,
      tokenHash,
      scopesJson: JSON.stringify(selectedScopes),
      lastUsedAt: null,
      expiresAt,
      createdAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      message: 'Personal Access Token created successfully. Copy this token now; you will not be able to see it again.',
      token: {
        id: tokenId,
        name: name.trim(),
        rawToken: rawSecret,
        tokenPrefix,
        scopes: selectedScopes,
        expiresAt,
        createdAt: new Date(),
      }
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to generate token' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Token ID is required' }, { status: 400 });
    }

    const deleted = await db.delete(apiTokens)
      .where(and(
        eq(apiTokens.id, id),
        eq(apiTokens.userId, sessionUser.id)
      ));

    return NextResponse.json({
      success: true,
      message: 'API token revoked successfully',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to revoke token' }, { status: 500 });
  }
}
