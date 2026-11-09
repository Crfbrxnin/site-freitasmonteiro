import "server-only";
import nodemailer from "nodemailer";
import { getGroup } from "./repo";
import type { LeadInput } from "./repo";
import { siteUrl } from "./utils";

type Result = { channel: "email" | "webhook"; ok: boolean; detail: string };

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

/** Encaminha o lead para e-mail (SMTP) e/ou webhook de CRM, quando configurados. Retorna o resultado de cada canal. */
export async function deliverLead(id: number, lead: LeadInput, serviceTitle: string): Promise<Result[]> {
  const integ = await getGroup<Record<string, string>>("integracoes");
  const results: Result[] = [];
  const rows: [string, string][] = [
    ["Formulário", lead.form],
    ["Nome", lead.name],
    ["E-mail", lead.email],
    ["Telefone/WhatsApp", lead.phone],
    ["Empresa/atividade", lead.company],
    ["CNPJ", lead.cnpj],
    ["Tipo de empresa", lead.companyType],
    ["Porte/enquadramento", lead.companySize],
    ["Serviço", serviceTitle || lead.service],
    ["Mensagem", lead.message],
    ["Página", lead.page],
    ["Origem (UTM)", [lead.utmSource, lead.utmMedium, lead.utmCampaign].filter(Boolean).join(" / ")],
  ];

  const smtpReady = process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS;
  if (integ.leadEmailTo && smtpReady) {
    try {
      const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: Number(process.env.SMTP_PORT) === 465,
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
      });
      const html = `<h2 style="font-family:Georgia,serif">Novo contato pelo site</h2><table cellpadding="6" style="border-collapse:collapse;font-family:Arial,sans-serif;font-size:14px">${rows
        .filter(([, v]) => v)
        .map(([k, v]) => `<tr><td style="color:#666;vertical-align:top">${esc(k)}</td><td>${esc(v).replace(/\n/g, "<br>")}</td></tr>`)
        .join("")}</table><p><a href="${siteUrl(`/admin/leads/${id}`)}">Abrir no painel</a></p>`;
      await transport.sendMail({
        from: process.env.SMTP_FROM || process.env.SMTP_USER,
        to: integ.leadEmailTo,
        replyTo: lead.email || undefined,
        subject: `Novo lead: ${lead.name}${serviceTitle ? ` — ${serviceTitle}` : ""}`,
        text: rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n"),
        html,
      });
      results.push({ channel: "email", ok: true, detail: `enviado para ${integ.leadEmailTo}` });
    } catch (e) {
      results.push({ channel: "email", ok: false, detail: e instanceof Error ? e.message.slice(0, 200) : "erro" });
    }
  }

  if (integ.webhookUrl && /^https:\/\//.test(integ.webhookUrl)) {
    try {
      const res = await fetch(integ.webhookUrl, {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(integ.webhookSecret ? { "x-webhook-secret": integ.webhookSecret } : {}),
        },
        body: JSON.stringify({ event: "lead.created", id, createdAt: new Date().toISOString(), serviceTitle, ...lead }),
        signal: AbortSignal.timeout(8000),
      });
      results.push({ channel: "webhook", ok: res.ok, detail: `HTTP ${res.status}` });
    } catch (e) {
      results.push({ channel: "webhook", ok: false, detail: e instanceof Error ? e.message.slice(0, 200) : "erro" });
    }
  }
  return results;
}
