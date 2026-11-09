import { after, NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { rateLimit } from "@/lib/auth";
import { deliverLead } from "@/lib/notify";
import { getService, insertLead, setLeadDelivery, type LeadInput } from "@/lib/repo";

export const runtime = "nodejs";

const str = (max: number) => z.string().trim().max(max).optional().default("");

const Schema = z.object({
  form: z.string().trim().min(1).max(80),
  name: z.string().trim().min(3, "Informe seu nome.").max(120),
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(160),
  phone: z
    .string()
    .trim()
    .refine((v) => v.replace(/\D/g, "").length >= 10 && v.replace(/\D/g, "").length <= 13, "Informe um telefone com DDD."),
  company: str(160),
  cnpj: str(20).refine((v) => !v || v.replace(/\D/g, "").length === 14, "CNPJ deve ter 14 dígitos."),
  companyType: str(80),
  companySize: str(80),
  service: str(120),
  message: str(3000),
  consent: z.literal(true, { message: "É preciso autorizar o uso dos dados para enviarmos o retorno." }),
  website: z.string().optional().default(""),
  startedAt: z.coerce.number().optional().default(0),
  page: str(200),
  turnstileToken: z.string().optional().default(""),
  attribution: z.record(z.string(), z.string().max(200)).optional().default({}),
});

async function verifyTurnstile(token: string, ip: string) {
  const secret = process.env.TURNSTILE_SECRET_KEY;
  if (!secret || !process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY) return true;
  if (!token) return false;
  const body = new URLSearchParams({ secret, response: token, remoteip: ip });
  const res = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", { method: "POST", body });
  const data = (await res.json().catch(() => ({}))) as { success?: boolean };
  return Boolean(data.success);
}

export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";

  if (!rateLimit(`lead:${ip}`, 5, 10 * 60 * 1000)) {
    return NextResponse.json({ ok: false, message: "Muitas tentativas seguidas. Aguarde alguns minutos ou fale pelo WhatsApp." }, { status: 429 });
  }

  const json = await req.json().catch(() => null);
  const parsed = Schema.safeParse(json);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const k = String(issue.path[0] ?? "form");
      errors[k] ??= issue.message.startsWith("Invalid") || issue.message.startsWith("Expected") ? "Verifique este campo." : issue.message;
    }
    return NextResponse.json({ ok: false, errors, message: "Revise os campos destacados." }, { status: 400 });
  }
  const d = parsed.data;

  // Antispam: honeypot preenchido ou envio rápido demais → resposta neutra, nada é gravado.
  const elapsed = Date.now() - d.startedAt;
  if (d.website || !d.startedAt || elapsed < 2500) {
    return NextResponse.json({ ok: true });
  }
  if (!(await verifyTurnstile(d.turnstileToken, ip))) {
    return NextResponse.json({ ok: false, errors: { turnstile: "Confirme a verificação de segurança." } }, { status: 400 });
  }

  const service = d.service ? await getService(d.service) : null;
  const a = d.attribution;
  const lead: LeadInput = {
    form: d.form,
    name: d.name,
    email: d.email,
    phone: d.phone,
    company: d.company,
    cnpj: d.cnpj,
    companyType: d.companyType,
    companySize: d.companySize,
    service: service?.slug || "",
    message: d.message,
    page: d.page,
    referrer: a.referrer || "",
    utmSource: a.utm_source || "",
    utmMedium: a.utm_medium || "",
    utmCampaign: a.utm_campaign || "",
    utmTerm: a.utm_term || "",
    utmContent: a.utm_content || "",
    consentAt: new Date().toISOString(),
  };

  const id = await insertLead(lead);

  after(async () => {
    const results = await deliverLead(id, lead, service?.title || "");
    await setLeadDelivery(id, JSON.stringify(results));
  });

  return NextResponse.json({ ok: true });
}
