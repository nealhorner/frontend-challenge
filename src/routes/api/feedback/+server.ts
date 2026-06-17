import { json } from '@sveltejs/kit';
import { sendEmail } from '$lib/server/email';
import { FEEDBACK_EMAIL } from '$env/static/private';
import type { RequestHandler } from './$types';

const FEEDBACK_TYPES = ['general', 'bug', 'question'] as const;
type FeedbackType = (typeof FEEDBACK_TYPES)[number];

const TYPE_LABELS: Record<FeedbackType, string> = {
  general: 'General Feedback',
  bug: 'Bug Report',
  question: 'Question Issue'
};

export const POST: RequestHandler = async ({ request, locals }) => {
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
    ['Type', typeLabel],
    ['From', senderEmail],
    ...(questionId && typeof questionId === 'string'
      ? ([['Question ID', questionId]] as const)
      : []),
    ['Subject', subject.trim()]
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
    <p style="white-space:pre-wrap;">${message.trim().replace(/</g, '&lt;').replace(/>/g, '&gt;')}</p>
  `;

  try {
    await sendEmail({ to: FEEDBACK_EMAIL, subject: emailSubject, html });
  } catch (err) {
    console.error('Failed to send feedback email:', err);
    return json({ error: 'Failed to send feedback' }, { status: 500 });
  }

  return json({ ok: true });
};
