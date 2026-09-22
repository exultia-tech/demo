import { NextResponse } from 'next/server';
import { db, client, inquestCases, inquestEvidenceRecords, inquestStatutoryAppeals } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { getCurrentUser } from '@/lib/auth/session';
import { initializeDatabase } from '@/lib/db/init';

export const dynamic = 'force-dynamic';

let hasInitedInquest = false;

// GET /api/inquest/cases - List cases and evidence
export async function GET(req: Request) {
  try {
    await initializeDatabase();
    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get('id');
    const user = await getCurrentUser();

    if (caseId) {
      const caseRecord = await db.query.inquestCases.findFirst({
        where: eq(inquestCases.id, caseId),
      });

      if (!caseRecord) {
        return NextResponse.json({ error: 'Case not found' }, { status: 404 });
      }

      const evidence = await db.select().from(inquestEvidenceRecords).where(eq(inquestEvidenceRecords.caseId, caseId));
      const appeals = await db.select().from(inquestStatutoryAppeals).where(eq(inquestStatutoryAppeals.caseId, caseId));

      return NextResponse.json({
        case: caseRecord,
        evidence,
        appeals
      });
    }

    let casesQuery = db.select().from(inquestCases);
    if (user && user.role !== 'admin') {
      // @ts-ignore
      casesQuery = casesQuery.where(eq(inquestCases.userId, user.id));
    }

    const cases = await casesQuery.orderBy(desc(inquestCases.createdAt)).limit(100);

    return NextResponse.json({
      cases,
      total: cases.length
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to fetch Inquest cases' }, { status: 500 });
  }
}

// POST /api/inquest/cases - Create or update legal case
export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { title, agency, jurisdiction, foiaTrackingNumber, exemptionCodes, denialCategory, notes } = body;

    if (!title || !agency) {
      return NextResponse.json({ error: 'Title and agency are required' }, { status: 400 });
    }

    const caseId = `case_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const caseNumber = `INQ-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    await db.insert(inquestCases).values({
      id: caseId,
      userId: user?.id || null,
      caseNumber,
      title: title.trim(),
      agency: agency.trim(),
      jurisdiction: jurisdiction?.trim() || 'Federal FOIA / 5 U.S.C. § 552',
      foiaTrackingNumber: foiaTrackingNumber?.trim() || null,
      status: 'draft',
      exemptionCodes: exemptionCodes || null,
      denialCategory: denialCategory || null,
      notes: notes || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      caseId,
      caseNumber
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || 'Failed to create Inquest case' }, { status: 500 });
  }
}
