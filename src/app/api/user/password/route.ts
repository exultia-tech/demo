import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword } from '@/lib/auth/crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const sessionUser = await getCurrentUser();
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ error: 'Current password and new password are required' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters' }, { status: 400 });
    }

    const userRecord = await db.query.users.findFirst({
      where: eq(users.id, sessionUser.id),
    });

    if (!userRecord) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const isValid = verifyPassword(currentPassword, userRecord.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: 'Current password is incorrect' }, { status: 400 });
    }

    const newHash = hashPassword(newPassword);

    await db.update(users)
      .set({
        passwordHash: newHash,
        updatedAt: new Date(),
      })
      .where(eq(users.id, sessionUser.id));

    return NextResponse.json({
      success: true,
      message: 'Password updated successfully',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to update password' }, { status: 500 });
  }
}
