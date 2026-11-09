import { getSessionUser } from "@/lib/auth";
import { listLeads } from "@/lib/repo";

export const runtime = "nodejs";

const cell = (v: string) => {
  let s = String(v ?? "");
  if (/^[=+\-@\t\r]/.test(s)) s = `'${s}`; // evita injeção de fórmulas em planilhas
  return `"${s.replace(/"/g, '""')}"`;
};

export async function GET(req: Request) {
  const user = await getSessionUser();
  if (!user) return new Response("Não autorizado", { status: 401 });
  const url = new URL(req.url);
  const { leads } = await listLeads({ status: url.searchParams.get("status") || undefined, q: url.searchParams.get("q") || undefined, limit: 100000 });
  const cols = [
    ["createdAt", "Data"], ["name", "Nome"], ["email", "E-mail"], ["phone", "Telefone"], ["company", "Empresa"], ["cnpj", "CNPJ"],
    ["companyType", "Tipo de empresa"], ["companySize", "Porte"], ["service", "Serviço"], ["message", "Mensagem"], ["form", "Formulário"],
    ["page", "Página"], ["utmSource", "utm_source"], ["utmMedium", "utm_medium"], ["utmCampaign", "utm_campaign"], ["utmTerm", "utm_term"],
    ["utmContent", "utm_content"], ["status", "Situação"], ["notes", "Anotações"],
  ] as const;
  const lines = [cols.map(([, l]) => cell(l)).join(";"), ...leads.map((l) => cols.map(([k]) => cell(String(l[k] ?? ""))).join(";"))];
  return new Response("﻿" + lines.join("\r\n"), {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
