import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { db, githubWorkflows } from '@/lib/db';
import { eq, and } from 'drizzle-orm';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isEnterprise = user.role === 'admin' || user.subscriptions?.some(
    s => s.status === 'active' && (s.tier.toLowerCase() === 'enterprise' || s.tier.toLowerCase() === 'developer')
  );

  const workflows = await db.query.githubWorkflows.findMany({
    where: eq(githubWorkflows.userId, user.id),
  });

  return NextResponse.json({
    success: true,
    isEnterprise: Boolean(isEnterprise),
    workflows: workflows.map(w => ({
      id: w.id,
      owner: w.owner,
      repo: w.repo,
      workflowFile: w.workflowFile,
      defaultBranch: w.defaultBranch,
      isActive: w.isActive,
      hasCustomToken: Boolean(w.personalAccessToken),
      installationId: w.installationId,
      updatedAt: w.updatedAt,
    })),
  });
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const isEnterprise = user.role === 'admin' || user.subscriptions?.some(
    s => s.status === 'active' && (s.tier.toLowerCase() === 'enterprise' || s.tier.toLowerCase() === 'developer')
  );

  if (!isEnterprise) {
    return NextResponse.json({
      error: 'Enhanced Workflows and GitHub Actions integration are exclusive to Enterprise subscribers. Free accounts are limited to basic account management.',
      requiresUpgrade: true,
      requiredTier: 'enterprise'
    }, { status: 403 });
  }

  try {
    const body = await req.json();
    const {
      owner,
      repo,
      workflowFile = 'build-ide.yml',
      defaultBranch = 'main',
      personalAccessToken,
      installationId,
    } = body;

    if (!owner || !repo) {
      return NextResponse.json({ error: 'Owner and repo are required' }, { status: 400 });
    }

    const cleanOwner = owner.trim().replace(/[^a-zA-Z0-9\-_.]/g, '');
    const cleanRepo = repo.trim().replace(/[^a-zA-Z0-9\-_.]/g, '');
    const cleanWorkflow = (workflowFile || 'build-ide.yml').trim().replace(/[^a-zA-Z0-9\-_.\\/]/g, '');

    const existing = await db.query.githubWorkflows.findFirst({
      where: and(
        eq(githubWorkflows.userId, user.id),
        eq(githubWorkflows.owner, cleanOwner),
        eq(githubWorkflows.repo, cleanRepo)
      ),
    });

    if (existing) {
      await db.update(githubWorkflows)
        .set({
          workflowFile: cleanWorkflow,
          defaultBranch,
          personalAccessToken: personalAccessToken ? personalAccessToken.trim() : existing.personalAccessToken,
          installationId: installationId || existing.installationId,
          isActive: true,
          updatedAt: new Date(),
        })
        .where(eq(githubWorkflows.id, existing.id));

      return NextResponse.json({ success: true, message: 'Workflow configuration updated' });
    }

    await db.insert(githubWorkflows).values({
      id: `ghw_${Date.now()}_${crypto.randomBytes(3).toString('hex')}`,
      userId: user.id,
      owner: cleanOwner,
      repo: cleanRepo,
      workflowFile: cleanWorkflow,
      defaultBranch,
      personalAccessToken: personalAccessToken ? personalAccessToken.trim() : null,
      installationId: installationId || null,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json({ success: true, message: 'GitHub workflow linked successfully' });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to link workflow' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const searchParams = req.nextUrl.searchParams;
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Missing workflow id' }, { status: 400 });
  }

  await db.delete(githubWorkflows)
    .where(and(eq(githubWorkflows.id, id), eq(githubWorkflows.userId, user.id)));

  return NextResponse.json({ success: true, message: 'Workflow unlinked' });
}
