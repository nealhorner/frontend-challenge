import { json } from '@sveltejs/kit';
import { sendEmail, escapeHtml } from '$lib/server/email';
import type { RequestHandler } from './$types';

const FEEDBACK_EMAIL = process.env.FEEDBACK_EMAIL ?? '';

const FEEDBACK_TYPES = ['general', 'bug', 'question'] as const;
type FeedbackType = (typeof FEEDBACK_TYPES)[number];

const TYPE_LABELS: Record<FeedbackType, string> = {
  general: 'General Feedback',
  bug: 'Bug Report',
  question: 'Question Issue'
};

// Simple per-IP rate limit: max 5 submissions per hour per server instance.
// Per-instance on serverless, but still prevents single-session abuse.
const _rateMap = new Map<string, { count: number; windowStart: number }>();
const WINDOW_MS = 60 * 60_000;
const MAX_PER_WINDOW = 5;

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = _rateMap.get(ip);
  if (!entry || now - entry.windowStart > WINDOW_MS) {
    _rateMap.set(ip, { count: 1, windowStart: now });
    return true;
  }
  if (entry.count >= MAX_PER_WINDOW) return false;
  entry.count++;
  return true;
}

export const POST: RequestHandler = async ({ request, locals }) => {
  const ip =
    request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    request.headers.get('x-real-ip') ??
    'unknown';
  if (!checkRateLimit(ip)) {
    return json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request body' }, { status: 400 });
  }

  if (typeof body !== 'object' || body === null) {
    return json({ error: 'Invalid request body' }, { status: 400 });
  }

  const { type, subject, message, replyTo, questionId } = body as Record<string, unknown>;

  if (!FEEDBACK_TYPES.includes(type as FeedbackType)) {
    return json({ error: 'Invalid feedback type' }, { status: 400 });
  }
  if (typeof subject !== 'string' || subject.trim().length === 0) {
    return json({ error: 'Subject is required' }, { status: 400 });
  }
  if (typeof message !== 'string' || message.trim().length === 0) {
    return json({ error: 'Message is required' }, { status: 400 });
  }
  if (subject.trim().length > 200) {
    return json({ error: 'Subject must be 200 characters or fewer' }, { status: 400 });
  }
  if (message.trim().length > 5000) {
    return json({ error: 'Message must be 5000 characters or fewer' }, { status: 400 });
  }

  const senderEmail =
    typeof replyTo === 'string' && replyTo.trim()
      ? replyTo.trim()
      : (locals.user?.email ?? 'Anonymous');

  const typeLabel = TYPE_LABELS[type as FeedbackType];
  const emailSubject = `[Frontend Challenge] ${typeLabel}: ${subject.trim()}`;

  const rows = [
    ['Type', escapeHtml(typeLabel)],
    ['From', escapeHtml(senderEmail)],
    ...(questionId && typeof questionId === 'string'
      ? ([['Question ID', escapeHtml(questionId)]] as const)
      : []),
    ['Subject', escapeHtml(subject.trim())]
  ] as const;

  const tableRows = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:6px 12px;font-weight:600;white-space:nowrap;vertical-align:top;">${label}</td>
        <td style="padding:6px 12px;">${value}</td>
      </tr>`
    )
    .join('');

  const html = `
    <table style="border-collapse:collapse;margin-bottom:24px;">
      ${tableRows}
    </table>
    <p style="white-space:pre-wrap;">${escapeHtml(message.trim())}</p>
  `;

  try {
    await sendEmail({ to: FEEDBACK_EMAIL, subject: emailSubject, html });
  } catch (err) {
    console.error('Failed to send feedback email:', err);
    return json({ error: 'Failed to send feedback' }, { status: 500 });
  }

  return json({ ok: true });
};
