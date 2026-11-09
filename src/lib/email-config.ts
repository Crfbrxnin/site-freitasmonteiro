import "server-only";

/** Qual canal de envio de e-mail está configurado na hospedagem (sem expor valores). */
export function emailChannel(): "resend" | "smtp" | null {
  if (process.env.RESEND_API_KEY) return "resend";
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) return "smtp";
  return null;
}

export function emailFrom() {
  return process.env.EMAIL_FROM || process.env.SMTP_FROM || process.env.SMTP_USER || "";
}
