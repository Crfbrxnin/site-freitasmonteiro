import Link from "next/link";
import { notFound } from "next/navigation";
import { getLead, getService } from "@/lib/repo";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL } from "@/lib/lead-status";
import { formatDateTime, whatsappHref } from "@/lib/utils";
import { Card, DangerButton, Notice, PageTitle } from "@/components/admin/ui";
import { deleteLeadAction, updateLeadAction } from "../../../actions";

export default async function LeadDetail({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string>> }) {
  const [{ id }, sp, user] = await Promise.all([params, searchParams, requireUser()]);
  const lead = await getLead(Number(id));
  if (!lead) notFound();
  const service = lead.service ? await getService(lead.service, { includeInactive: true }) : null;
  let delivery: { channel: string; ok: boolean; detail: string }[] = [];
  try {
    delivery = lead.delivery ? JSON.parse(lead.delivery) : [];
  } catch {
    /* */
  }
  const wa = whatsappHref(lead.phone.replace(/\D/g, "").length <= 11 ? `55${lead.phone}` : lead.phone, `Olá, ${lead.name.split(" ")[0]}. Aqui é da Bruno Freitas Contabilidade, recebemos seu contato pelo site.`);
  const rows: [string, string][] = [
    ["E-mail", lead.email],
    ["Telefone / WhatsApp", lead.phone],
    ["Empresa / atividade", lead.company],
    ["CNPJ", lead.cnpj],
    ["Tipo de empresa", lead.companyType],
    ["Porte / enquadramento", lead.companySize],
    ["Serviço", service?.title || lead.service],
    ["Formulário", lead.form],
    ["Página do envio", lead.page],
    ["Página de entrada / referência", lead.referrer],
    ["utm_source", lead.utmSource],
    ["utm_medium", lead.utmMedium],
    ["utm_campaign", lead.utmCampaign],
    ["utm_term", lead.utmTerm],
    ["utm_content", lead.utmContent],
    ["Consentimento registrado em", lead.consentAt ? formatDateTime(lead.consentAt) : ""],
  ];
  return (
    <>
      <PageTitle
        title={lead.name}
        description={`Recebido em ${formatDateTime(lead.createdAt)}`}
        action={
          <div className="flex gap-2">
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="btn btn-primary !min-h-11">
                Responder no WhatsApp
              </a>
            )}
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="btn btn-ghost !min-h-11">
                E-mail
              </a>
            )}
          </div>
        }
      />
      {sp.ok && <Notice>Lead atualizado.</Notice>}
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <div className="space-y-6">
          {lead.message && (
            <Card>
              <p className="label muted">Mensagem</p>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed">{lead.message}</p>
            </Card>
          )}
          <Card>
            <dl className="divide-y divide-[var(--line)] text-sm">
              {rows
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="grid gap-1 py-2.5 sm:grid-cols-[14rem_1fr]">
                    <dt className="muted">{k}</dt>
                    <dd className="break-words">{v}</dd>
                  </div>
                ))}
            </dl>
          </Card>
          <Card>
            <p className="label muted">Encaminhamento</p>
            {delivery.length === 0 ? (
              <p className="mt-3 text-sm muted">Nenhuma integração (e-mail ou webhook) configurada no momento do envio. O lead está salvo apenas no painel.</p>
            ) : (
              <ul className="mt-3 space-y-1 text-sm">
                {delivery.map((d, i) => (
                  <li key={i}>
                    {d.ok ? "✓" : "✕"} {d.channel === "email" ? "E-mail" : "Webhook"} — {d.detail}
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
        <div>
          <Card>
            <form action={updateLeadAction} className="space-y-4">
              <input type="hidden" name="id" value={lead.id} />
              <label className="block">
                <span className="field-label">Situação</span>
                <select name="status" defaultValue={lead.status} className="field">
                  {Object.entries(STATUS_LABEL).map(([v, l]) => (
                    <option key={v} value={v}>
                      {l}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="field-label">Anotações internas</span>
                <textarea name="notes" defaultValue={lead.notes} className="field min-h-40" />
              </label>
              <button className="btn btn-primary w-full !min-h-11">Salvar</button>
            </form>
          </Card>
          {user.role === "admin" && (
            <form action={deleteLeadAction} className="mt-6">
              <input type="hidden" name="id" value={lead.id} />
              <DangerButton confirm="Excluir este lead definitivamente? Use para atender pedidos de exclusão (LGPD).">Excluir lead (LGPD)</DangerButton>
            </form>
          )}
          <Link href="/admin/leads" className="mt-6 block text-sm underline underline-offset-2">
            ← Voltar para leads
          </Link>
        </div>
      </div>
    </>
  );
}
