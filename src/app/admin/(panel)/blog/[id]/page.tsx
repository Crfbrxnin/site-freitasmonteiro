import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostById, listCategories, listServices } from "@/lib/repo";
import { postFields } from "@/lib/admin-schemas";
import { SchemaForm } from "@/components/admin/schema-form";
import { DangerButton, Notice, PageTitle } from "@/components/admin/ui";
import { deletePostAction, savePostAction } from "../../../actions";

export default async function EditPost({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<Record<string, string>> }) {
  const [{ id }, sp] = await Promise.all([params, searchParams]);
  const isNew = id === "novo";
  const [post, categories, services] = await Promise.all([
    isNew ? Promise.resolve(null) : getPostById(Number(id)),
    listCategories(),
    listServices({ includeInactive: true }),
  ]);
  if (!isNew && !post) notFound();
  const initial = post
    ? { ...post, categoryId: post.categoryId ? String(post.categoryId) : "" }
    : { status: "draft", publishedAt: new Date().toISOString(), author: "Bruno Freitas", content: "## Subtítulo\n\nEscreva aqui o conteúdo do artigo." };
  const live = post && post.status === "published" && Date.parse(post.publishedAt) <= Date.now();
  return (
    <>
      <PageTitle
        title={isNew ? "Novo artigo" : "Editar artigo"}
        description={post?.title}
        action={
          live ? (
            <Link href={`/blog/${post!.slug}`} target="_blank" className="btn btn-ghost !min-h-11">
              Ver artigo
            </Link>
          ) : undefined
        }
      />
      {sp.criado && <Notice>Artigo criado.</Notice>}
      <SchemaForm
        fields={postFields(categories, services.map((s) => ({ slug: s.slug, title: s.title })))}
        initial={initial}
        action={savePostAction.bind(null, post?.id ?? null)}
        submitLabel="Salvar artigo"
      />
      {post && (
        <form action={deletePostAction} className="mt-10 border-t hairline pt-6">
          <input type="hidden" name="id" value={post.id} />
          <DangerButton confirm={`Excluir o artigo "${post.title}"?`}>Excluir artigo</DangerButton>
        </form>
      )}
    </>
  );
}
