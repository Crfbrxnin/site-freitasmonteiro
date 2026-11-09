import { listCategories } from "@/lib/repo";
import { DangerButton, Notice, PageTitle } from "@/components/admin/ui";
import { deleteCategoryAction, saveCategoryAction } from "../../actions";

export default async function AdminCategories({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const cats = await listCategories();
  const row = (c?: (typeof cats)[number]) => (
    <form action={saveCategoryAction} className="grid gap-3 sm:grid-cols-[1fr_1fr_2fr_5rem_auto] sm:items-end">
      {c && <input type="hidden" name="id" value={c.id} />}
      <label>
        <span className="field-label text-xs">Nome</span>
        <input name="name" defaultValue={c?.name} className="field !min-h-10 !py-2" required />
      </label>
      <label>
        <span className="field-label text-xs">URL</span>
        <input name="slug" defaultValue={c?.slug} className="field !min-h-10 !py-2" placeholder="gerada do nome" />
      </label>
      <label>
        <span className="field-label text-xs">Descrição (SEO da página da categoria)</span>
        <input name="description" defaultValue={c?.description} className="field !min-h-10 !py-2" />
      </label>
      <label>
        <span className="field-label text-xs">Ordem</span>
        <input name="position" type="number" defaultValue={c?.position ?? cats.length + 1} className="field !min-h-10 !py-2 tnum" />
      </label>
      <button className="btn btn-primary !min-h-10 !px-4">{c ? "Salvar" : "Adicionar"}</button>
    </form>
  );
  return (
    <>
      <PageTitle title="Categorias do blog" description="As categorias organizam os artigos e geram páginas próprias em /blog/categoria/<url>." />
      {sp.ok && <Notice>Categorias atualizadas.</Notice>}
      {sp.erro && <Notice tone="error">{sp.erro === "url" ? "Já existe uma categoria com esta URL." : "Informe o nome da categoria."}</Notice>}
      <ul className="space-y-4">
        {cats.map((c) => (
          <li key={c.id} className="rounded-2xl border hairline bg-[var(--surface)] p-5">
            {row(c)}
            <div className="mt-3 flex items-center justify-between text-xs muted">
              <span>{c.postCount} artigo(s) publicados</span>
              <form action={deleteCategoryAction}>
                <input type="hidden" name="id" value={c.id} />
                <DangerButton confirm={`Excluir "${c.name}"? Os artigos ficarão sem categoria.`}>Excluir</DangerButton>
              </form>
            </div>
          </li>
        ))}
      </ul>
      <h2 className="display display-sm mt-12">Nova categoria</h2>
      <div className="mt-4 rounded-2xl border border-dashed hairline p-5">{row()}</div>
    </>
  );
}
