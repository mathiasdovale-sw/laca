import "server-only";

import nodemailer from "nodemailer";

/**
 * Envío de mails por el SMTP de Google Workspace.
 * Credenciales en SMTP_USER / SMTP_PASSWORD (contraseña de aplicación).
 */
function getTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASSWORD) {
    throw new Error("Faltan variables SMTP_HOST, SMTP_USER o SMTP_PASSWORD");
  }
  const port = Number(SMTP_PORT ?? 465);

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    // 465 usa SSL desde el inicio; 587 arranca sin cifrar y pasa a STARTTLS.
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  });
}

export async function sendMail({
  to,
  replyTo,
  subject,
  text,
  fromName,
}: {
  to: string;
  replyTo: { name: string; address: string };
  subject: string;
  text: string;
  fromName: string;
}) {
  await getTransport().sendMail({
    // Gmail exige que el remitente sea la cuenta autenticada (o un alias de ella).
    from: { name: fromName, address: process.env.SMTP_USER! },
    to,
    replyTo,
    subject,
    text,
  });
}
