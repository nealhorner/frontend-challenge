import { Resend } from 'resend';
import { RESEND_API_KEY, EMAIL_FROM } from '$env/static/private';

// Lazy singleton — defers instantiation to first call so the module is safe
// to import during build analysis when RESEND_API_KEY may be empty.
let _resend: Resend | undefined;
const getResend = () => (_resend ??= new Resend(RESEND_API_KEY));

export async function sendEmail({
  to,
  subject,
  html
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const { error } = await getResend().emails.send({ from: EMAIL_FROM, to, subject, html });
  if (error) {
    throw new Error(`Failed to send email to ${to}: ${error.message}`);
  }
}
