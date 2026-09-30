import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, users, subscriptions } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import { getCurrentUser, startImpersonation, stopImpersonation, IMPERSONATOR_COOKIE_NAME } from '@/lib/auth/session';
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
      inquest: 'legal',
    },
    headline: 'Full Administrative Privileges & System Controls',
    description: 'Root operator account with complete administrative control, DB seed access, and persona substitution powers.',
    keyFeatures: ['Full Persona Switcher', 'Database Seed Management', 'Hermetic Enclave Attestation', 'CISO Advisory Hotline']
  },
  {
    id: 'usr_test_free',
    email: 'free@exultia.tech',
    name: 'Alex Rivera (Community Free)',
    role: 'user',
    badge: 'Community / Free',
    themeColor: '#94A3B8',
    entitlements: {
      pureide: 'free',
      uvi: 'free',
      inquest: 'free',
    },
    headline: 'Zero-Cost Baseline Community Tier Across All Products',
    description: 'Tests upgrade barriers, rate limit warnings (60 req/min), standard compiler triggers, and trial capabilities.',
    keyFeatures: ['Telemetry Stripping Simulator', 'Public Feed Browsing', '3 Active FOIA Request Limit', 'Standard Bates Counter']
  },
  {
    id: 'usr_test_pro',
    email: 'pro@exultia.tech',
    name: 'Jordan Vance (Pro Developer)',
    role: 'user',
    badge: 'Pro Developer',
    themeColor: '#3B82F6',
    entitlements: {
      pureide: 'pro',
      uvi: 'pro',
      inquest: 'free',
    },
    headline: 'PureIDE Pro & Vantage Threat Intel Pro Workstation',
    description: 'Tests live socket egress firewall rules, automated token redaction, dedicated cloud compiler runners, and real-time CVSS v4 streaming.',
    keyFeatures: ['Live Egress Socket Firewall', 'Secrets Scanner & Token Redactor', '10,000 req/min Threat API', 'Automated SBOM Builder']
  },
  {
    id: 'usr_test_legal',
    email: 'legal@exultia.tech',
    name: 'Elena Rostova, Esq. (Legal Pro)',
    role: 'user',
    badge: 'Legal Discovery Pro',
    themeColor: '#06B6D4',
    entitlements: {
      pureide: 'free',
      uvi: 'free',
      inquest: 'legal',
    },
    headline: 'Inquest Legal Discovery & Statutory FOIA Appeals Pro',
    description: 'Tests automated 9-exemption statutory appeal brief generation, Exemption 4/7(A) burden-of-proof scanner, and OCR evidence indexing.',
    keyFeatures: ['Statutory Administrative Appeal Builder', 'Glomar Challenge Defense Engine', 'Unlimited Case Dockets', 'Bates Vault Indexing']
  },
  {
    id: 'usr_test_enterprise',
    email: 'enterprise@exultia.tech',
    name: 'Marcus Sterling (Enterprise SecLead)',
    role: 'user',
    badge: 'Hermetic Enterprise',
    themeColor: '#8B5CF6',
    entitlements: {
      pureide: 'enterprise',
      uvi: 'enterprise',
      inquest: 'enterprise',
    },
    headline: 'Hermetic Enterprise Architecture Suite (All Products Max Tier)',
    description: 'Tests hermetic offline binary cosign, zero-egress hardware attestation, high-throughput webhook dispatchers, and APA court complaint builders.',
    keyFeatures: ['Hermetic Offline Binary Cosign', 'Streaming Webhook Dispatcher', 'Daily Raw Parquet Dumps', 'Federal APA Court Complaint Generator']
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
    const existingImpersonatorAdminId = cookieStore.get(IMPERSONATOR_COOKIE_NAME)?.value;

    // Must be admin OR already impersonating
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
