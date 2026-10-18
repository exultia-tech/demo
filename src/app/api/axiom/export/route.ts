import { NextResponse } from 'next/server';
import { MOCK_EXAM_DB } from '@/lib/axiom-exam-data';
import { 
  generateAxiomStudentHistory, 
  formatAxiomCsv, 
  formatAxiomCertificateHtml 
} from '@/lib/axiom-data';
import { resolveAxiomAuthAndTier } from '@/lib/axiom-server-auth';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const format = (url.searchParams.get('format') || 'json').toLowerCase();
    const type = (url.searchParams.get('type') || 'all').toLowerCase();
    const certFilter = url.searchParams.get('cert') || undefined;

    // 1. Resolve User and Tier via Session Cookie OR Bearer PAT
    const auth = await resolveAxiomAuthAndTier(req);

    if (!auth) {
      return NextResponse.json({ 
        error: 'Authentication required. Sign in or provide a valid Bearer API token.',
        code: 'UNAUTHORIZED'
      }, { status: 401 });
    }

    const authenticatedUser = auth.user;
    const userTier = auth.tier;

    // =========================================================================
    // CASE A: LMS EXAM SIMULATOR EMBEDDING FEED / SCORM EXPORT
    // GATED STRICTLY BY ENTERPRISE TIER
    // =========================================================================
    const isLmsRequest = 
      type === 'lms_embed' || 
      type === 'lms_feed' || 
      type === 'lms' || 
      format === 'scorm' || 
      url.searchParams.get('lms') === 'true';

    if (isLmsRequest) {
      if (userTier !== 'enterprise') {
        return NextResponse.json({
          error: 'Active Axiom Enterprise LMS tier required.',
          code: 'ENTERPRISE_TIER_REQUIRED',
          message: 'The API feed for embedding the exam simulator in an LMS system (Canvas, Blackboard, Moodle, SCORM, LTI) is restricted to Enterprise subscribers. Axiom Pro allows export of course history, certificates, and scores, but live LMS simulator embedding requires Axiom Enterprise.'
        }, { status: 403 });
      }

      // Enterprise LMS content delivery with seeded quota protection
      let limit = 250;
      const limitParam = url.searchParams.get('limit');
      if (limitParam && !isNaN(Number(limitParam))) {
        limit = Math.min(250, Math.max(1, Number(limitParam)));
      }

      const now = new Date();
      const seedString = `${authenticatedUser.id}_${now.getUTCFullYear()}_${now.getUTCMonth()}`;
      let seed = 0;
      for (let i = 0; i < seedString.length; i++) {
        seed = Math.imul(31, seed) + seedString.charCodeAt(i) | 0;
      }

      const random = () => {
        let t = seed += 0x6D2B79F5;
        t = Math.imul(t ^ t >>> 15, t | 1);
        t ^= t + Math.imul(t ^ t >>> 7, t | 61);
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
      };

      const indices = Array.from({ length: MOCK_EXAM_DB.length }, (_, i) => i);
      for (let i = indices.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [indices[i], indices[j]] = [indices[j], indices[i]];
      }

      const questionBlock = indices.slice(0, limit).map(idx => MOCK_EXAM_DB[idx]);

      const lmsFormat = questionBlock.map(q => ({
        guid: q.id,
        domain: q.domain,
        difficulty: q.difficulty,
        stem: q.question,
        options: q.options,
        correct_index: q.correctAnswer,
        explanation: q.explanation,
        tags: ['Security', 'Certification', 'Axiom', 'Enterprise_LMS'],
        last_updated: new Date().toISOString()
      }));

      return NextResponse.json({
        success: true,
        meta: {
          total_questions: lmsFormat.length,
          quota_limit: 250,
          quota_remaining: 250 - lmsFormat.length,
          format: "LMS_SCORM_COMPATIBLE_JSON",
          license: "ENTERPRISE_INSTITUTIONAL_LMS_FEED",
          exported_by: authenticatedUser.email,
          tier: "enterprise",
          timestamp: new Date().toISOString()
        },
        data: lmsFormat
      });
    }

    // =========================================================================
    // CASE B: COURSE HISTORY, EXAM CERTIFICATES, AND SCORES EXPORT
    // UNLOCKED BY PRO TIER (AND ENTERPRISE)
    // =========================================================================
    if (userTier === 'free') {
      return NextResponse.json({
        error: 'Active Axiom Pro or Enterprise tier required.',
        code: 'UPGRADE_REQUIRED',
        message: 'Exporting course history, verified exam certificates, and detailed score transcripts requires an active Axiom Pro subscription ($49/mo). Upgrade to Pro to unlock conventional file and API exports.'
      }, { status: 403 });
    }

    // Generate comprehensive student progress transcript
    const exportData = generateAxiomStudentHistory(
      authenticatedUser.id,
      authenticatedUser.email,
      authenticatedUser.name,
      userTier
    );

    // Apply optional certification filter
    if (certFilter) {
      exportData.courseHistory = exportData.courseHistory.filter(c => c.courseId.includes(certFilter));
      exportData.examScores = exportData.examScores.filter(s => s.certId.includes(certFilter));
      exportData.certificates = exportData.certificates.filter(c => c.certId.includes(certFilter));
    }

    // Return in requested format
    // Format 1: CSV Conventional File Download
    if (format === 'csv') {
      const csvContent = formatAxiomCsv(exportData);
      return new NextResponse(csvContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv; charset=utf-8',
          'Content-Disposition': `attachment; filename="axiom-transcript-${authenticatedUser.id.slice(-6)}.csv"`,
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    }

    // Format 2: Printable HTML Certificate Document
    if (format === 'certificate' || format === 'html') {
      const certToPrint = exportData.certificates[0];
      if (!certToPrint) {
        return NextResponse.json({ error: 'No certificate records found for this student account' }, { status: 404 });
      }
      const htmlContent = formatAxiomCertificateHtml(certToPrint);
      return new NextResponse(htmlContent, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-store, max-age=0'
        }
      });
    }

    // Format 3: Structured JSON (API Query or JSON file)
    let filteredData: any = exportData;
    if (type === 'history') {
      filteredData = {
        meta: exportData.meta,
        candidate: exportData.candidate,
        courseHistory: exportData.courseHistory
      };
    } else if (type === 'scores') {
      filteredData = {
        meta: exportData.meta,
        candidate: exportData.candidate,
        examScores: exportData.examScores
      };
    } else if (type === 'certificate' || type === 'certificates') {
      filteredData = {
        meta: exportData.meta,
        candidate: exportData.candidate,
        certificates: exportData.certificates
      };
    }

    return NextResponse.json({
      success: true,
      ...filteredData
    });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ error: message || 'Failed to process Axiom export' }, { status: 500 });
  }
}
