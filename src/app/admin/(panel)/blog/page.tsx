import Link from "next/link";
import { listAllPosts } from "@/lib/repo";
import { formatDateTime } from "@/lib/utils";
import { Badge, ButtonLink, PageTitle } from "@/components/admin/ui";

export default async function AdminBlog({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const posts = await listAllPosts();
  const now = Date.now();
  const filter = sp.filtro || "";
  const state = (p: (typeof posts)[number]) =>
    p.status === "draft" ? "rascunho" : Date.parse(p.publishedAt) > now ? "programado" : "publicado";
  const list = filter ? posts.filter((p) => state(p) === filter) : posts;
  return (
    <>
      <PageTitle
        title="Blog"
        description="Publique, edite, programe e exclua artigos. Artigos com data futura aparecem automaticamente na data marcada."
        action={<ButtonLink href="/admin/blog/novo">Novo artigo</ButtonLink>}
      />
      <div className="mb-5 flex flex-wrap gap-2 text-sm">
        {[
          ["", "Todos"],
          ["publicado", "Publicados"],
          ["programado", "Programados"],
          ["rascunho", "Rascunhos"],
        ].map(([v, l]) => (
          <Link
            key={v}
            href={v ? `/admin/blog?filtro=${v}` : "/admin/blog"}
            className={`rounded-full border px-3 py-1 ${filter === v ? "border-tinta bg-tinta text-papel" : "hairline"}`}
          >
            {l}
          </Link>
        ))}
      </div>
      <ul className="divide-y divide-[var(--line)] rounded-2xl border hairline bg-[var(--surface)]">
        {list.map((p) => {
          const st = state(p);
          return (
            <li key={p.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4">
              <div className="min-w-0 flex-1">
                <Link href={`/admin/blog/${p.id}`} className="font-medium hover:underline">
                  {p.title}
                </Link>
                <p className="text-xs muted">
                  {p.categoryName || "Sem categoria"} · {formatDateTime(p.publishedAt)}
                </p>
              </div>
              <Badge tone={st === "publicado" ? "ok" : st === "programado" ? "warn" : "neutral"}>
                {st === "publicado" ? "Publicado" : st === "programado" ? "Programado" : "Rascunho"}
              </Badge>
              {st === "publicado" && (
                <Link href={`/blog/${p.slug}`} target="_blank" className="text-sm underline underline-offset-2">
                  Ver
                </Link>
              )}
            </li>
          );
        })}
        {list.length === 0 && <li className="px-5 py-10 text-center muted">Nenhum artigo.</li>}
      </ul>
    </>
  );
}
