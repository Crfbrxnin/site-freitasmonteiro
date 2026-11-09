import Link from "next/link";
import { listServices } from "@/lib/repo";
import { Badge, ButtonLink, PageTitle } from "@/components/admin/ui";
import { ServiceIcon } from "@/components/site/icons";

export default async function AdminServices() {
  const services = await listServices({ includeInactive: true });
  return (
    <>
      <PageTitle
        title="Serviços"
        description="Adicione, edite, desative ou reordene os serviços. Cada serviço gera uma página própria em /servicos/<url>."
        action={<ButtonLink href="/admin/servicos/novo">Novo serviço</ButtonLink>}
      />
      <ul className="divide-y divide-[var(--line)] rounded-2xl border hairline bg-[var(--surface)]">
        {services.map((s) => (
          <li key={s.id} className="flex items-center gap-4 px-5 py-4">
            <span className="tnum w-6 text-sm muted">{s.position}</span>
            <ServiceIcon name={s.icon} className="size-5 text-vinho" />
            <div className="min-w-0 flex-1">
              <Link href={`/admin/servicos/${s.id}`} className="font-medium hover:underline">
                {s.title}
              </Link>
              <p className="truncate text-xs muted">/servicos/{s.slug}</p>
            </div>
            {s.active ? <Badge tone="ok">Ativo</Badge> : <Badge>Inativo</Badge>}
            <Link href={`/servicos/${s.slug}`} target="_blank" className="hidden text-sm underline underline-offset-2 sm:inline">
              Ver
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
