import Link from "next/link";
import { listLandings } from "@/lib/repo";
import { Badge, ButtonLink, PageTitle } from "@/components/admin/ui";

export default async function AdminLandings() {
  const items = await listLandings({ includeInactive: true });
  return (
    <>
      <PageTitle
        title="Landing pages"
        description="Páginas de campanha para Google Ads e Meta Ads, sem menu de navegação. Use os endereços com parâmetros UTM, por exemplo: /lp/abertura-de-empresa?utm_source=google&utm_medium=cpc&utm_campaign=abertura."
        action={<ButtonLink href="/admin/landing-pages/novo">Nova landing page</ButtonLink>}
      />
      <ul className="divide-y divide-[var(--line)] rounded-2xl border hairline bg-[var(--surface)]">
        {items.map((l) => (
          <li key={l.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <Link href={`/admin/landing-pages/${l.id}`} className="font-medium hover:underline">
                {l.title}
              </Link>
              <p className="truncate text-xs muted">/lp/{l.slug}</p>
            </div>
            {l.noindex && <Badge>Fora do Google</Badge>}
            {l.active ? <Badge tone="ok">Ativa</Badge> : <Badge>Inativa</Badge>}
            <Link href={`/lp/${l.slug}`} target="_blank" className="text-sm underline underline-offset-2">
              Ver
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
