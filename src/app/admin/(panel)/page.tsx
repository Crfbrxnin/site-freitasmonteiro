import Link from "next/link";
import { getGroup, getMetrics, listLeads, listPublicTestimonials, listServices } from "@/lib/repo";
import { getSite } from "@/lib/site";
import { requireUser } from "@/lib/auth";
import { STATUS_LABEL } from "@/lib/lead-status";
import { formatDateTime } from "@/lib/utils";
import { Badge, Card, Notice, PageTitle } from "@/components/admin/ui";

function Bars({ rows, empty }: { rows: { key: string; count: number }[]; empty: string }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  if (!rows.length) return <p className="mt-4 text-sm muted">{empty}</p>;
  return (
    <ul className="mt-4 space-y-3">
      {rows.map((r) => (
        <li key={r.key} className="text-sm">
          <div className="flex justify-between gap-3">
            <span className="truncate">{r.key || "—"}</span>
            <span className="tnum font-medium">{r.count}</span>
          </div>
          <div className="mt-1 h-1.5 rounded-full bg-[var(--line)]">
            <div className="h-1.5 rounded-full bg-vinho" style={{ width: `${(r.count / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function Dashboard({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const [user, sp] = await Promise.all([requireUser(), searchParams]);
  const [m, site, recent, sobre, integ, testimonials, services] = await Promise.all([
    getMetrics(30),
    getSite(),
    listLeads({ limit: 6 }),
    getGroup<Record<string, any>>("sobre"),
    getGroup<Record<string, string>>("integracoes"),
    listPublicTestimonials(),
    listServices(),
  ]);
  const smtp = Boolean(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS);
  const conv = m.leadsPeriod + m.whatsappClicks;

  const checklist: { done: boolean; label: string; href: string }[] = [
    { done: Boolean(site.contato.whatsapp), label: "Número do WhatsApp", href: "/admin/conteudo/contato" },
    { done: Boolean(site.contato.email), label: "E-mail profissional", href: "/admin/conteudo/contato" },
    { done: Boolean(site.contato.hours), label: "Horário de atendimento", href: "/admin/conteudo/contato" },
    { done: Boolean(site.contato.serviceArea), label: "Região atendida (SEO local)", href: "/admin/conteudo/contato" },
    { done: Boolean(site.geral.legalName && site.geral.cnpj), label: "Razão social e CNPJ", href: "/admin/conteudo/geral" },
    { done: Boolean(sobre.photo), label: "Foto profissional de Bruno Freitas", href: "/admin/conteudo/sobre" },
    { done: Boolean(sobre.bio && sobre.history), label: "Apresentação e história do escritório", href: "/admin/conteudo/sobre" },
    { done: Boolean(sobre.mission && sobre.vision && sobre.values?.length), label: "Missão, visão e valores", href: "/admin/conteudo/sobre" },
    { done: testimonials.length > 0, label: "Depoimentos autorizados", href: "/admin/depoimentos" },
    { done: Boolean(integ.ga4Id), label: "Google Analytics 4", href: "/admin/conteudo/integracoes" },
    { done: Boolean(integ.gscVerification), label: "Google Search Console", href: "/admin/conteudo/integracoes" },
    { done: Boolean(integ.leadEmailTo && smtp), label: "E-mail de notificação de leads (SMTP)", href: "/admin/conteudo/integracoes" },
    { done: Boolean(process.env.SITE_URL && !process.env.SITE_URL.includes("localhost")), label: "Domínio definido em SITE_URL", href: "/admin" },
    { done: !site.geral.showPlaceholders, label: "Desligar o modo de configuração antes de divulgar", href: "/admin/conteudo/geral" },
  ];
  const pending = checklist.filter((c) => !c.done).length;

  return (
    <>
      <PageTitle title={`Olá${user.name && user.name !== "Administrador" ? `, ${user.name.split(" ")[0]}` : ""}.`} description="Resumo dos últimos 30 dias e pendências de configuração do site." />
      {sp.erro === "permissao" && <Notice tone="error">Esta área é restrita a administradores.</Notice>}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          ["Leads (30 dias)", m.leadsPeriod],
          ["Cliques no WhatsApp (30 dias)", m.whatsappClicks],
          ["Contatos totais (30 dias)", conv],
          ["Leads desde o início", m.leadsTotal],
        ].map(([k, v]) => (
          <Card key={k as string}>
            <p className="text-sm muted">{k}</p>
            <p className="tnum mt-3 text-4xl font-medium">{v}</p>
          </Card>
        ))}
      </div>
      <p className="mt-3 text-xs muted">
        Métricas próprias do site, sem cookies nem dados pessoais. Visitas e taxa de conversão ficam no Google Analytics 4, quando configurado e autorizado pelo visitante.
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        <Card>
          <p className="font-medium">Leads por origem (UTM)</p>
          <Bars rows={m.bySource} empty="Sem leads no período." />
        </Card>
        <Card>
          <p className="font-medium">Leads por formulário</p>
          <Bars rows={m.byForm} empty="Sem leads no período." />
        </Card>
        <Card>
          <p className="font-medium">Cliques no WhatsApp por página</p>
          <Bars rows={m.whatsappByPath} empty="Sem cliques registrados no período." />
        </Card>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_24rem]">
        <Card>
          <div className="flex items-center justify-between">
            <p className="font-medium">Últimos leads</p>
            <Link href="/admin/leads" className="text-sm underline underline-offset-2">
              Ver todos
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-[var(--line)]">
            {recent.leads.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-4 py-3 text-sm">
                <div className="min-w-0">
                  <Link href={`/admin/leads/${l.id}`} className="font-medium hover:underline">
                    {l.name}
                  </Link>
                  <p className="truncate text-xs muted">
                    {formatDateTime(l.createdAt)} · {l.form}
                  </p>
                </div>
                <Badge tone={l.status === "novo" ? "vinho" : "neutral"}>{STATUS_LABEL[l.status]}</Badge>
              </li>
            ))}
            {recent.leads.length === 0 && <li className="py-6 text-sm muted">Nenhum lead ainda.</li>}
          </ul>
          <div className="mt-6 border-t hairline pt-4">
            <p className="text-sm font-medium">Funil</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {Object.entries(STATUS_LABEL).map(([k, label]) => (
                <Link key={k} href={`/admin/leads?status=${k}`} className="rounded-full border hairline px-3 py-1 text-xs">
                  {label}: <span className="tnum font-medium">{m.byStatus.find((s) => s.key === k)?.count ?? 0}</span>
                </Link>
              ))}
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center justify-between">
            <p className="font-medium">Pendências de configuração</p>
            <Badge tone={pending ? "warn" : "ok"}>{pending ? `${pending} pendente(s)` : "Tudo pronto"}</Badge>
          </div>
          <ul className="mt-4 space-y-2 text-sm">
            {checklist.map((c) => (
              <li key={c.label} className="flex items-start gap-2">
                <span aria-hidden className={c.done ? "text-[#2f6b4f]" : "text-[#8a6a1f]"}>
                  {c.done ? "✓" : "○"}
                </span>
                {c.done ? (
                  <span className="muted line-through decoration-1">{c.label}</span>
                ) : (
                  <Link href={c.href} className="hover:underline">
                    {c.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs muted">
            Revise também os {services.length} serviços e os artigos iniciais do blog, que foram escritos como ponto de partida.
          </p>
        </Card>
      </div>
    </>
  );
}
