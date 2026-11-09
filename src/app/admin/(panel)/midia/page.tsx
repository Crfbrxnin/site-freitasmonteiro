import { listMedia } from "@/lib/repo";
import { DangerButton, Notice, PageTitle } from "@/components/admin/ui";
import { MediaUploader } from "@/components/admin/media-uploader";
import { CopyButton } from "@/components/admin/copy-button";
import { deleteMediaAction } from "../../actions";

export default async function AdminMedia({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const items = await listMedia();
  return (
    <>
      <PageTitle
        title="Mídia"
        description="Imagens enviadas ao site. Copie o endereço para usar em artigos (Markdown: ![descrição](endereço)) ou em qualquer campo de imagem."
      />
      {sp.ok && <Notice>Biblioteca atualizada.</Notice>}
      <MediaUploader />
      <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((m) => (
          <li key={m.id} className="overflow-hidden rounded-2xl border hairline bg-[var(--surface)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={m.url} alt={m.alt} className="aspect-[4/3] w-full object-cover" loading="lazy" />
            <div className="space-y-2 p-3 text-xs">
              <p className="truncate font-medium">{m.filename}</p>
              <p className="tnum muted">{Math.round(m.size / 1024)} KB</p>
              <div className="flex items-center justify-between">
                <CopyButton text={m.url} />
                <form action={deleteMediaAction}>
                  <input type="hidden" name="id" value={m.id} />
                  <DangerButton confirm="Excluir esta imagem? Páginas que a usam ficarão sem imagem.">Excluir</DangerButton>
                </form>
              </div>
            </div>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p className="mt-8 muted">Nenhuma imagem enviada ainda.</p>}
    </>
  );
}
