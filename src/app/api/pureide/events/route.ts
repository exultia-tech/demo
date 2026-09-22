import { NextResponse } from 'next/server';
import { db, pureideWorkstations, pureideSecurityEvents, pureidePolicies } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

// GET /api/pureide/events - List security events and registered workstations
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const workstationId = searchParams.get('workstationId');
    const limit = parseInt(searchParams.get('limit') || '50', 10);

    const user = await getCurrentUser();

    let eventsQuery = db.select().from(pureideSecurityEvents);
    if (workstationId) {
      // @ts-ignore
      eventsQuery = eventsQuery.where(eq(pureideSecurityEvents.workstationId, workstationId));
    }

    const events = await eventsQuery
      .orderBy(desc(pureideSecurityEvents.timestamp))
      .limit(limit);

    const workstations = user ? await db.select().from(pureideWorkstations).where(eq(pureideWorkstations.userId, user.id)) : [];
    const policies = await db.select().from(pureidePolicies).limit(10);

    return NextResponse.json({
      events,
      workstations,
      policies,
      status: 'active'
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch PureIDE events' }, { status: 500 });
  }
}

// POST /api/pureide/events - Ingest security event or workstation heartbeat
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, workstation, event } = body;

    const user = await getCurrentUser();

    // 1. Register / Heartbeat Workstation
    if (action === 'heartbeat' && workstation) {
      const wsId = workstation.id || `ws_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db.insert(pureideWorkstations).values({
        id: wsId,
        userId: user?.id || null,
        hostname: workstation.hostname || 'developer-workstation',
        osPlatform: workstation.osPlatform || 'linux',
        osVersion: workstation.osVersion || null,
        agentVersion: workstation.agentVersion || '3.2.0-pureide',
        containmentMode: workstation.containmentMode || 'strict',
        status: 'online',
        lastHeartbeatAt: new Date(),
        createdAt: new Date(),
      }).onConflictDoUpdate({
        target: pureideWorkstations.id,
        set: {
          status: 'online',
          lastHeartbeatAt: new Date(),
          agentVersion: workstation.agentVersion || '3.2.0-pureide',
          containmentMode: workstation.containmentMode || 'strict',
        }
      });

      return NextResponse.json({ success: true, workstationId: wsId });
    }

    // 2. Log Security Interception Event
    if (event) {
      const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      await db.insert(pureideSecurityEvents).values({
        id: eventId,
        workstationId: event.workstationId || null,
        userId: user?.id || null,
        eventType: event.eventType || 'EXTENSION_BLOCKED',
        severity: event.severity || 'HIGH',
        threatUviId: event.threatUviId || null,
        details: event.details || 'Blocked suspicious activity on developer workstation',
        rawPayloadJson: event.rawPayloadJson ? JSON.stringify(event.rawPayloadJson) : null,
        timestamp: new Date(),
      });

      return NextResponse.json({ success: true, eventId });
    }

    return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to process PureIDE event' }, { status: 500 });
  }
}
