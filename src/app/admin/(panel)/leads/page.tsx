import Link from "next/link";
import { listLeads, listServices } from "@/lib/repo";
import { formatDateTime } from "@/lib/utils";
import { Badge, Notice, PageTitle } from "@/components/admin/ui";
import { STATUS_LABEL } from "@/lib/lead-status";


export default async function AdminLeads({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const page = Math.max(1, Number(sp.pagina) || 1);
  const [{ leads, total }, services] = await Promise.all([
    listLeads({ status: sp.status, q: sp.q, limit: 50, offset: (page - 1) * 50 }),
    listServices({ includeInactive: true }),
  ]);
  const svc = Object.fromEntries(services.map((s) => [s.slug, s.title]));
  const qs = new URLSearchParams(Object.entries({ status: sp.status || "", q: sp.q || "" }).filter(([, v]) => v)).toString();
  return (
    <>
      <PageTitle
        title="Leads"
        description="Contatos recebidos pelos formulários do site, com a origem (página e UTM)."
        action={
          <a href={`/admin/leads-export${qs ? `?${qs}` : ""}`} className="btn btn-ghost !min-h-11">
            Exportar CSV
          </a>
        }
      />
      {sp.excluido && <Notice>Lead excluído.</Notice>}
      <form className="mb-6 flex flex-col gap-3 sm:flex-row">
        <input name="q" defaultValue={sp.q} placeholder="Buscar por nome, e-mail, telefone ou empresa" className="field sm:max-w-sm" />
        <select name="status" defaultValue={sp.status || ""} className="field sm:max-w-52">
          <option value="">Todas as situações</option>
          {Object.entries(STATUS_LABEL).map(([v, l]) => (
            <option key={v} value={v}>
              {l}
            </option>
          ))}
        </select>
        <button className="btn btn-primary !min-h-12">Filtrar</button>
      </form>
      <p className="mb-3 text-sm muted">{total} lead(s)</p>
      <div className="overflow-x-auto rounded-2xl border hairline bg-[var(--surface)]">
        <table className="w-full min-w-[46rem] text-left text-sm">
          <thead className="border-b hairline">
            <tr className="label text-[0.65rem] muted">
              <th className="px-4 py-3">Data</th>
              <th className="px-4 py-3">Nome</th>
              <th className="px-4 py-3">Serviço</th>
              <th className="px-4 py-3">Origem</th>
              <th className="px-4 py-3">Situação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--line)]">
            {leads.map((l) => (
              <tr key={l.id} className="hover:bg-[var(--line)]/30">
                <td className="tnum whitespace-nowrap px-4 py-3 muted">{formatDateTime(l.createdAt)}</td>
                <td className="px-4 py-3">
                  <Link href={`/admin/leads/${l.id}`} className="font-medium hover:underline">
                    {l.name}
                  </Link>
                  <span className="block text-xs muted">{l.company || l.email}</span>
                </td>
                <td className="px-4 py-3">{svc[l.service] || "—"}</td>
                <td className="px-4 py-3 text-xs">
                  <span className="block">{l.form}</span>
                  <span className="muted">{[l.utmSource, l.utmCampaign].filter(Boolean).join(" · ") || "direto / orgânico"}</span>
                </td>
                <td className="px-4 py-3">
                  <Badge tone={l.status === "novo" ? "vinho" : l.status === "cliente" ? "ok" : "neutral"}>{STATUS_LABEL[l.status] || l.status}</Badge>
                </td>
              </tr>
            ))}
            {leads.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center muted">
                  Nenhum lead ainda. Os envios dos formulários aparecerão aqui.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {total > 50 && (
        <div className="mt-6 flex justify-between text-sm">
          {page > 1 ? <Link href={`/admin/leads?${qs}&pagina=${page - 1}`}>← Anteriores</Link> : <span />}
          {page * 50 < total && <Link href={`/admin/leads?${qs}&pagina=${page + 1}`}>Próximos →</Link>}
        </div>
      )}
    </>
  );
}
