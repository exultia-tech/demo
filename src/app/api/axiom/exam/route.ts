import { NextResponse } from 'next/server';
import { createHmac, randomBytes, timingSafeEqual } from 'crypto';
import { MOCK_EXAM_DB } from '@/lib/axiom-exam-data';
import { getCurrentUser } from '@/lib/auth/session';
import { recordLicenseActivity } from '@/lib/licensing/audit';

export const dynamic = 'force-dynamic';

/**
 * Server-driven exam sessions.
 *
 * The full question bank, correct answers and explanations never leave the
 * server in bulk. The client receives ONE question at a time (without the
 * answer), submits its choice, and only gets correctness/explanations when
 * the server decides to reveal them (instant validation, checkpoint score,
 * or the final review after the exam is finished).
 *
 * Session state lives in a signed (HMAC) token, so it cannot be tampered
 * with, and a per-instance counter rejects replay of earlier tokens.
 */

const SECRET =
  process.env.EXAM_SESSION_SECRET ||
  process.env.SESSION_SECRET ||
  process.env.TURSO_AUTH_TOKEN ||
  'dev-only-exam-secret';

const NO_STORE = { 'Cache-Control': 'no-store, max-age=0' };
const GRACE_MS = 5000;
const MAX_MINUTES = 600;

interface SessionPayload {
  sid: string;
  seed: number;
  n: number; // total questions
  i: number; // current question index
  a: string; // answers so far, one char each: '0'-'9' or 'x' for skipped
  iv: boolean; // instant validation
  ci: number; // checkpoint interval (0 = off)
  c: string | null; // cert filter
  exp: number; // epoch ms deadline
}

// Best-effort replay protection (per server instance).
const latestIndex = new Map<string, number>();

function b64u(buf: Buffer) {
  return buf.toString('base64url');
}

function signToken(p: SessionPayload): string {
  const body = b64u(Buffer.from(JSON.stringify(p), 'utf8'));
  const sig = b64u(createHmac('sha256', SECRET).update(body).digest());
  return `${body}.${sig}`;
}

function verifyToken(token: unknown): SessionPayload | null {
  if (typeof token !== 'string') return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = createHmac('sha256', SECRET).update(body).digest();
  let given: Buffer;
  try {
    given = Buffer.from(sig, 'base64url');
  } catch {
    return null;
  }
  if (given.length !== expected.length || !timingSafeEqual(given, expected)) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8')) as SessionPayload;
  } catch {
    return null;
  }
}

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Deterministic server-side shuffle: position -> index into the question bank */
function orderFor(seed: number, n: number, certFilter: string | null): number[] {
  const idx = [];
  for (let k = 0; k < MOCK_EXAM_DB.length; k++) {
    if (!certFilter || MOCK_EXAM_DB[k].cert === certFilter) {
      idx.push(k);
    }
  }
  const rnd = mulberry32(seed);
  for (let k = idx.length - 1; k > 0; k--) {
    const j = Math.floor(rnd() * (k + 1));
    [idx[k], idx[j]] = [idx[j], idx[k]];
  }
  return idx.slice(0, n);
}

function publicQuestion(bankIdx: number, position: number) {
  const q = MOCK_EXAM_DB[bankIdx];
  return { id: `p${position}`, cert: q.cert, question: q.question, options: q.options };
}

function charToAnswer(c: string): number {
  return c === 'x' ? -1 : Number(c);
}

function buildFinal(p: SessionPayload) {
  const order = orderFor(p.seed, p.n, p.c);
  // Unanswered questions are marked skipped
  const answers = p.a.padEnd(p.n, 'x');
  let score = 0;
  const review = order.map((bankIdx, pos) => {
    const q = MOCK_EXAM_DB[bankIdx];
    const userAnswer = charToAnswer(answers[pos]);
    if (userAnswer === q.correctAnswer) score++;
    return {
      question: q.question,
      options: q.options,
      userAnswer,
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
    };
  });
  latestIndex.delete(p.sid);
  return { done: true as const, score, total: p.n, review };
}

export async function POST(request: Request) {
  // Non-blocking trust-but-verify license telemetry
  getCurrentUser().then(user => {
    if (user) {
      recordLicenseActivity(user.id, 'axiom', request, 'exam_access');
    }
  }).catch(() => {});

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400, headers: NO_STORE });
  }

  const action = body.action;

  // ---- START ----
  if (action === 'start') {
    const certFilter = typeof body.cert === 'string' ? body.cert : null;
    let bankSize = 0;
    for (let k = 0; k < MOCK_EXAM_DB.length; k++) {
      if (!certFilter || MOCK_EXAM_DB[k].cert === certFilter) bankSize++;
    }
    const n = Math.min(Math.max(1, Math.floor(Number(body.count) || 1)), bankSize);
    const minutes = Math.min(Math.max(1, Number(body.durationMinutes) || 90), MAX_MINUTES);
    const ci = Math.max(0, Math.floor(Number(body.checkpointInterval) || 0));
    const seed = randomBytes(4).readUInt32BE(0);
    const payload: SessionPayload = {
      sid: randomBytes(12).toString('hex'),
      seed,
      n,
      i: 0,
      a: '',
      iv: !!body.instantValidation,
      ci,
      c: certFilter,
      exp: Date.now() + minutes * 60_000 + GRACE_MS,
    };
    latestIndex.set(payload.sid, 0);
    const order = orderFor(seed, n, certFilter);
    return NextResponse.json(
      { token: signToken(payload), total: n, index: 0, question: publicQuestion(order[0], 0) },
      { headers: NO_STORE }
    );
  }

  const p = verifyToken(body.token);
  if (!p) {
    return NextResponse.json({ error: 'Invalid session' }, { status: 401, headers: NO_STORE });
  }

  // ---- FINISH (manual / timer expiry) ----
  if (action === 'finish') {
    return NextResponse.json(buildFinal(p), { headers: NO_STORE });
  }

  // ---- ANSWER ----
  if (action === 'answer') {
    const seen = latestIndex.get(p.sid);
    if (seen !== undefined && seen !== p.i) {
      return NextResponse.json({ error: 'Stale session' }, { status: 409, headers: NO_STORE });
    }
    if (Date.now() > p.exp) {
      return NextResponse.json(buildFinal(p), { headers: NO_STORE });
    }
    if (p.i >= p.n) {
      return NextResponse.json(buildFinal(p), { headers: NO_STORE });
    }

    const order = orderFor(p.seed, p.n, p.c);
    const q = MOCK_EXAM_DB[order[p.i]];
    let ans = Number(body.answer);
    if (!Number.isInteger(ans) || ans < 0 || ans >= q.options.length) ans = -1;

    const feedback = p.iv
      ? { correct: ans === q.correctAnswer, correctAnswer: q.correctAnswer, explanation: q.explanation }
      : undefined;

    const next: SessionPayload = { ...p, i: p.i + 1, a: p.a + (ans < 0 ? 'x' : String(ans)) };

    if (next.i >= next.n) {
      // Exam complete. With instant validation the client still sees feedback for
      // the last question before the final review is requested.
      if (feedback) {
        latestIndex.set(next.sid, next.i);
        return NextResponse.json(
          { feedback, last: true, token: signToken(next) },
          { headers: NO_STORE }
        );
      }
      return NextResponse.json(buildFinal(next), { headers: NO_STORE });
    }

    latestIndex.set(next.sid, next.i);

    let checkpointScore: number | undefined;
    if (next.ci > 0 && next.i % next.ci === 0) {
      let s = 0;
      for (let k = next.i - next.ci; k < next.i; k++) {
        if (charToAnswer(next.a[k]) === MOCK_EXAM_DB[order[k]].correctAnswer) s++;
      }
      checkpointScore = s;
    }

    return NextResponse.json(
      {
        token: signToken(next),
        index: next.i,
        question: publicQuestion(order[next.i], next.i),
        feedback,
        checkpointScore,
      },
      { headers: NO_STORE }
    );
  }

  return NextResponse.json({ error: 'Unknown action' }, { status: 400, headers: NO_STORE });
}
