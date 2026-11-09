import { listTestimonials } from "@/lib/repo";
import { Badge, DangerButton, Notice, PageTitle } from "@/components/admin/ui";
import { deleteTestimonialAction, saveTestimonialAction } from "../../actions";

export default async function AdminTestimonials({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const items = await listTestimonials();
  const form = (t?: (typeof items)[number]) => (
    <form action={saveTestimonialAction} className="grid gap-4 sm:grid-cols-2">
      {t && <input type="hidden" name="id" value={t.id} />}
      <label>
        <span className="field-label">Nome do cliente</span>
        <input name="name" defaultValue={t?.name} className="field" required />
      </label>
      <label>
        <span className="field-label">Empresa / cargo</span>
        <input name="company" defaultValue={t?.company} className="field" />
      </label>
      <label className="sm:col-span-2">
        <span className="field-label">Depoimento (texto exato autorizado)</span>
        <textarea name="text" defaultValue={t?.text} className="field min-h-24" required />
      </label>
      <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="authorized" defaultChecked={t?.authorized} className="size-4 accent-vinho" />
          Tenho autorização por escrito do cliente para publicar
        </label>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" name="active" defaultChecked={t ? t.active : true} className="size-4 accent-vinho" />
          Exibir no site
        </label>
        <label className="flex items-center gap-2 text-sm">
          Ordem <input name="position" type="number" defaultValue={t?.position ?? items.length + 1} className="field !min-h-9 !w-20 !py-1 tnum" />
        </label>
        <button className="btn btn-primary !min-h-10 !px-4 ml-auto">{t ? "Salvar" : "Adicionar depoimento"}</button>
      </div>
    </form>
  );
  return (
    <>
      <PageTitle
        title="Depoimentos"
        description="Somente depoimentos reais, com autorização registrada, aparecem no site. Sem nenhum depoimento autorizado, a seção fica oculta (ou com espaços reservados no modo de configuração)."
      />
      {sp.ok && <Notice>Depoimentos atualizados.</Notice>}
      {sp.erro && <Notice tone="error">Preencha nome e depoimento.</Notice>}
      <ul className="space-y-5">
        {items.map((t) => (
          <li key={t.id} className="rounded-2xl border hairline bg-[var(--surface)] p-5">
            <div className="mb-4 flex gap-2">
              {t.authorized ? <Badge tone="ok">Autorizado</Badge> : <Badge tone="warn">Sem autorização — não aparece</Badge>}
              {!t.active && <Badge>Oculto</Badge>}
            </div>
            {form(t)}
            <form action={deleteTestimonialAction} className="mt-4">
              <input type="hidden" name="id" value={t.id} />
              <DangerButton>Excluir</DangerButton>
            </form>
          </li>
        ))}
      </ul>
      <h2 className="display display-sm mt-12">Novo depoimento</h2>
      <div className="mt-4 rounded-2xl border border-dashed hairline p-5">{form()}</div>
    </>
  );
}
