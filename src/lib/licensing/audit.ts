import { db, licenseAuditLogs, users, subscriptions } from '@/lib/db';
import { eq, and, gt, desc } from 'drizzle-orm';

export interface ClientConnectionInfo {
  ipAddress: string;
  userAgent: string;
}

export type ComplianceTier = 'COMPLIANT' | 'MONITORED' | 'SUSPECTED_SHARING';

export interface UserComplianceReport {
  userId: string;
  email: string;
  name: string | null;
  activeProducts: string[];
  subscriptionTiers: Record<string, string>;
  uniqueIpsCount: number;
  uniqueDevicesCount: number;
  recentIps: string[];
  recentDevices: string[];
  totalTouches: number;
  lastActive: Date | null;
  complianceStatus: ComplianceTier;
  flagReason?: string;
}

/**
 * Extracts clean IP address and User-Agent from standard incoming HTTP request headers.
 */
export function extractClientInfo(req: Request): ClientConnectionInfo {
  const forwardedFor = req.headers.get('x-forwarded-for');
  const realIp = req.headers.get('x-real-ip');
  const cfIp = req.headers.get('cf-connecting-ip');

  let ipAddress = '127.0.0.1';
  if (cfIp) {
    ipAddress = cfIp.trim();
  } else if (forwardedFor) {
    ipAddress = forwardedFor.split(',')[0].trim();
  } else if (realIp) {
    ipAddress = realIp.trim();
  }

  const userAgent = req.headers.get('user-agent')?.trim() || 'unknown';

  return { ipAddress, userAgent };
}

/**
 * Records a lightweight license activity touch with a 15-minute debounce window.
 * Ensures zero database bloat for normal users while capturing distinct IP/Device combinations.
 */
export async function recordLicenseActivity(
  userId: string,
  product: string,
  req: Request,
  action: string = 'access'
): Promise<void> {
  try {
    if (!userId) return;

    const { ipAddress, userAgent } = extractClientInfo(req);
    const now = new Date();
    const fifteenMinutesAgo = new Date(now.getTime() - 15 * 60 * 1000);

    // Check if an identical device/IP touch was already registered in the past 15 minutes
    const existingRecent = await db.query.licenseAuditLogs.findFirst({
      where: and(
        eq(licenseAuditLogs.userId, userId),
        eq(licenseAuditLogs.product, product),
        eq(licenseAuditLogs.ipAddress, ipAddress),
        eq(licenseAuditLogs.userAgent, userAgent),
        gt(licenseAuditLogs.timestamp, fifteenMinutesAgo)
      ),
    });

    if (existingRecent) {
      // Refresh the timestamp without creating an extra row
      await db
        .update(licenseAuditLogs)
        .set({ timestamp: now, action })
        .where(eq(licenseAuditLogs.id, existingRecent.id));
      return;
    }

    // Insert new unique device touch
    await db.insert(licenseAuditLogs).values({
      id: crypto.randomUUID(),
      userId,
      product,
      ipAddress,
      userAgent,
      action,
      timestamp: now,
    });
  } catch (error) {
    // Non-blocking telemetry failure: log silently to prevent interrupting user actions
    console.error('[LicenseAudit] Failed to record license activity touch:', error);
  }
}

/**
 * Generates an aggregated compliance audit report for all active accounts over a specified time window.
 */
export async function getLicenseAuditSummary(hoursWindow: number = 168): Promise<{
  totalAccountsAudited: number;
  flaggedAccountsCount: number;
  reports: UserComplianceReport[];
}> {
  const windowStart = new Date(Date.now() - hoursWindow * 60 * 60 * 1000);

  const logs = await db.query.licenseAuditLogs.findMany({
    where: gt(licenseAuditLogs.timestamp, windowStart),
    orderBy: [desc(licenseAuditLogs.timestamp)],
  });

  const allUsers = await db.query.users.findMany();
  const allSubs = await db.query.subscriptions.findMany({
    where: eq(subscriptions.status, 'active'),
  });

  const userMap = new Map(allUsers.map(u => [u.id, u]));
  const subMap = new Map<string, Record<string, string>>();

  for (const s of allSubs) {
    if (!subMap.has(s.userId)) {
      subMap.set(s.userId, {});
    }
    subMap.get(s.userId)![s.product] = s.tier;
  }

  // Aggregate logs by userId
  const userLogs = new Map<string, typeof logs>();
  for (const log of logs) {
    if (!userLogs.has(log.userId)) {
      userLogs.set(log.userId, []);
    }
    userLogs.get(log.userId)!.push(log);
  }

  const reports: UserComplianceReport[] = [];

  for (const [userId, items] of userLogs.entries()) {
    const user = userMap.get(userId);
    const userSubTiers = subMap.get(userId) || {};

    const uniqueIps = Array.from(new Set(items.map(i => i.ipAddress)));
    const uniqueDevices = Array.from(new Set(items.map(i => i.userAgent)));
    const activeProducts = Array.from(new Set(items.map(i => i.product)));

    let complianceStatus: ComplianceTier = 'COMPLIANT';
    let flagReason: string | undefined;

    // Check if the user is on an Enterprise plan (Enterprise permits multi-seat volume)
    const isEnterprise = Object.values(userSubTiers).some(t => t.toLowerCase() === 'enterprise');

    if (!isEnterprise) {
      if (uniqueIps.length >= 5 || uniqueDevices.length >= 5) {
        complianceStatus = 'SUSPECTED_SHARING';
        flagReason = `High concurrency on single-user license: ${uniqueIps.length} distinct IP addresses and ${uniqueDevices.length} distinct devices observed within ${hoursWindow}h.`;
      } else if (uniqueIps.length >= 3 || uniqueDevices.length >= 3) {
        complianceStatus = 'MONITORED';
        flagReason = `Moderate concurrency: ${uniqueIps.length} IPs, ${uniqueDevices.length} devices. Typical for multi-device owners (laptop + desktop + phone).`;
      }
    }

    reports.push({
      userId,
      email: user?.email || 'unknown',
      name: user?.name || null,
      activeProducts,
      subscriptionTiers: userSubTiers,
      uniqueIpsCount: uniqueIps.length,
      uniqueDevicesCount: uniqueDevices.length,
      recentIps: uniqueIps.slice(0, 5),
      recentDevices: uniqueDevices.slice(0, 5),
      totalTouches: items.length,
      lastActive: items[0]?.timestamp || null,
      complianceStatus,
      flagReason,
    });
  }

  // Also include registered users who may not have generated touches in this window yet
  for (const user of allUsers) {
    if (!userLogs.has(user.id)) {
      const userSubTiers = subMap.get(user.id) || {};
      reports.push({
        userId: user.id,
        email: user.email,
        name: user.name,
        activeProducts: Object.keys(userSubTiers),
        subscriptionTiers: userSubTiers,
        uniqueIpsCount: 0,
        uniqueDevicesCount: 0,
        recentIps: [],
        recentDevices: [],
        totalTouches: 0,
        lastActive: null,
        complianceStatus: 'COMPLIANT',
      });
    }
  }

  // Sort by suspected sharing first, then total touches
  reports.sort((a, b) => {
    if (a.complianceStatus === 'SUSPECTED_SHARING' && b.complianceStatus !== 'SUSPECTED_SHARING') return -1;
    if (b.complianceStatus === 'SUSPECTED_SHARING' && a.complianceStatus !== 'SUSPECTED_SHARING') return 1;
    return b.uniqueIpsCount - a.uniqueIpsCount;
  });

  const flaggedAccountsCount = reports.filter(r => r.complianceStatus === 'SUSPECTED_SHARING').length;

  return {
    totalAccountsAudited: reports.length,
    flaggedAccountsCount,
    reports,
  };
}

export interface RecentTouchRecord {
  id: string;
  userId: string;
  userEmail: string;
  product: string;
  action: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date | null;
}

export async function getRecentAuditFeed(limit: number = 30): Promise<RecentTouchRecord[]> {
  const rawLogs = await db.query.licenseAuditLogs.findMany({
    orderBy: [desc(licenseAuditLogs.timestamp)],
    limit,
  });

  const allUsers = await db.query.users.findMany();
  const userMap = new Map(allUsers.map(u => [u.id, u.email]));

  return rawLogs.map(l => ({
    id: l.id,
    userId: l.userId,
    userEmail: userMap.get(l.userId) || l.userId,
    product: l.product,
    action: l.action,
    ipAddress: l.ipAddress,
    userAgent: l.userAgent,
    timestamp: l.timestamp,
  }));
}
