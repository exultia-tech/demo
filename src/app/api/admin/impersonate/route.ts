import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, users, subscriptions } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser, startImpersonation, stopImpersonation, IMPERSONATOR_COOKIE_NAME } from '@/lib/auth/session';
import { verifySignedPayload } from '@/lib/auth/crypto';
import { initializeDatabase } from '@/lib/db/init';

export const dynamic = 'force-dynamic';

export interface TestPersonaMeta {
  id: string;
  email: string;
  name: string;
  role: string;
  badge: string;
  themeColor: string;
  entitlements: {
    pureide: 'free' | 'pro' | 'enterprise';
    uvi: 'free' | 'pro' | 'enterprise';
    inquest: 'free' | 'legal' | 'enterprise';
  };
  headline: string;
  description: string;
  keyFeatures: string[];
}

export const TEST_PERSONAS: TestPersonaMeta[] = [
  {
    id: 'usr_admin_default',
    email: 'admin@exultia.tech',
    name: 'Exultia Administrator',
    role: 'admin',
    badge: 'Root Admin',
    themeColor: '#F59E0B',
    entitlements: {
      pureide: 'enterprise',
      uvi: 'enterprise',
      inquest: 'enterprise',
    },
    headline: 'Full Administrative Privileges & System Controls',
    description: 'Root operator account with complete administrative control and universal enterprise privileges.',
    keyFeatures: ['System Administration', 'Zero-Trust Telemetry Attestation', 'Hermetic Enclave Attestation', 'CISO Advisory Hotline']
  }
];

export async function GET() {
  try {
    await initializeDatabase();
    const currentUser = await getCurrentUser();
    
    // Check if user has admin privileges or is currently impersonating
    const cookieStore = await cookies();
    const isImpersonating = !!cookieStore.get(IMPERSONATOR_COOKIE_NAME)?.value || currentUser?.isImpersonating;

    if (!currentUser || (currentUser.role !== 'admin' && !isImpersonating)) {
      return NextResponse.json({ error: 'Administrative privileges required' }, { status: 403 });
    }

    const personasWithCurrent = TEST_PERSONAS.map(p => ({
      ...p,
      isCurrent: currentUser.email.toLowerCase() === p.email.toLowerCase(),
    }));

    return NextResponse.json({
      success: true,
      currentUser,
      isImpersonating: !!currentUser.isImpersonating,
      impersonatedBy: currentUser.impersonatedBy || null,
      personas: personasWithCurrent,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to list personas' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await initializeDatabase();
    const currentUser = await getCurrentUser();
    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(IMPERSONATOR_COOKIE_NAME)?.value;
    const existingImpersonatorAdminId = rawCookie ? verifySignedPayload(rawCookie) : null;

    // Must be admin OR already legitimately impersonating
    if (!currentUser || (currentUser.role !== 'admin' && !existingImpersonatorAdminId && !currentUser.isImpersonating)) {
      return NextResponse.json({ error: 'Administrative privileges required to substitute user personas' }, { status: 403 });
    }

    const { targetEmail } = await req.json();
    if (!targetEmail) {
      return NextResponse.json({ error: 'Target email is required' }, { status: 400 });
    }

    const cleanEmail = targetEmail.trim().toLowerCase();

    // If target email is admin@exultia.tech, revert impersonation instead
    if (cleanEmail === 'admin@exultia.tech') {
      const restoredUser = await stopImpersonation();
      return NextResponse.json({
        success: true,
        message: 'Restored Administrator session',
        user: restoredUser,
        isImpersonating: false,
      });
    }

    // Lookup target user in DB
    const targetUser = await db.query.users.findFirst({
      where: eq(users.email, cleanEmail),
    });

    if (!targetUser) {
      return NextResponse.json({ error: `Test persona with email "${cleanEmail}" was not found in database.` }, { status: 404 });
    }

    // Identify the origin admin ID
    const adminUserId = existingImpersonatorAdminId || (currentUser.role === 'admin' ? currentUser.id : 'usr_admin_default');

    // Switch session
    const impersonatedUser = await startImpersonation(adminUserId, targetUser.id);

    return NextResponse.json({
      success: true,
      message: `Successfully substituted identity to ${targetUser.name || targetUser.email}`,
      user: impersonatedUser,
      isImpersonating: true,
      impersonatedBy: 'admin@exultia.tech',
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to impersonate persona' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    await initializeDatabase();
    const currentUser = await getCurrentUser();
    const cookieStore = await cookies();
    const rawCookie = cookieStore.get(IMPERSONATOR_COOKIE_NAME)?.value;
    const impersonatorAdminId = rawCookie ? verifySignedPayload(rawCookie) : null;

    // Reject unauthenticated requests: Caller MUST have an active session and be an admin or active impersonator
    if (!currentUser || (!impersonatorAdminId && !currentUser.isImpersonating && currentUser.role !== 'admin')) {
      return NextResponse.json({ error: 'Administrative privileges required' }, { status: 403 });
    }

    const restoredUser = await stopImpersonation();
    return NextResponse.json({
      success: true,
      message: 'Impersonation ended. Successfully restored Administrator session.',
      user: restoredUser,
      isImpersonating: false,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to revert impersonation' }, { status: 500 });
  }
}
