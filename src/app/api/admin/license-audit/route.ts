import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getLicenseAuditSummary, getRecentAuditFeed } from '@/lib/licensing/audit';
import { db, users, subscriptions, apiTokens, inquestCases, uviThreats, licenseAuditLogs } from '@/lib/db';
import { initializeDatabase } from '@/lib/db/init';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    await initializeDatabase();

    const sessionUser = await getCurrentUser();
    // Allow admins, root personas, or impersonating admins to inspect the license audit report
    const isAuthorized = sessionUser && (
      sessionUser.role === 'admin' ||
      sessionUser.isImpersonating ||
      sessionUser.email === 'admin@exultia.tech'
    );

    if (!isAuthorized) {
      return NextResponse.json({ error: 'Unauthorized. Admin credentials required.' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const windowHoursParam = parseInt(searchParams.get('windowHours') || '168', 10); // default 7 days
    const windowHours = isNaN(windowHoursParam) || windowHoursParam < 1 ? 168 : windowHoursParam;

    const [summary, recentActivity, allUsers, allSubs, allTokens, allCases, allThreats, totalTouches] = await Promise.all([
      getLicenseAuditSummary(windowHours),
      getRecentAuditFeed(30),
      db.select().from(users),
      db.select().from(subscriptions),
      db.select().from(apiTokens),
      db.select().from(inquestCases),
      db.select().from(uviThreats),
      db.select().from(licenseAuditLogs),
    ]);

    const systemStats = {
      totalUsers: allUsers.length,
      totalSubscriptions: allSubs.length,
      activePaidSubscriptions: allSubs.filter(s => s.status === 'active' && s.tier !== 'free').length,
      totalApiTokens: allTokens.length,
      totalCases: allCases.length,
      totalThreats: allThreats.length,
      totalRecordedTouches: totalTouches.length,
    };

    return NextResponse.json({
      success: true,
      windowHours,
      summary,
      recentActivity,
      systemStats,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    return NextResponse.json({ error: message || 'Failed to retrieve license audit report' }, { status: 500 });
  }
}
