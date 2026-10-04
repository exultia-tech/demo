import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getLicenseAuditSummary } from '@/lib/licensing/audit';
import { initializeDatabase } from '@/lib/db/init';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await initializeDatabase();

    const sessionUser = await getCurrentUser();
    // Allow admins or test personas to inspect the license audit report
    if (!sessionUser || sessionUser.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized. Admin credentials required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const windowHoursParam = parseInt(searchParams.get('windowHours') || '168', 10); // default 7 days
    const windowHours = isNaN(windowHoursParam) || windowHoursParam < 1 ? 168 : windowHoursParam;

    const summary = await getLicenseAuditSummary(windowHours);

    return NextResponse.json({
      success: true,
      windowHours,
      summary,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message || 'Failed to retrieve license audit report' }, { status: 500 });
  }
}
