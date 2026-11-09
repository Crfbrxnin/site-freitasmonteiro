import { notFound } from "next/navigation";
import { getCategory, listCategories, listPublishedPosts } from "@/lib/repo";
import { buildMeta } from "@/lib/seo";
import { PageHero } from "@/components/site/blocks";
import { BlogIndex } from "@/components/site/blog-index";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = await getCategory(slug);
  if (!cat) return {};
  return buildMeta({
    title: `${cat.name} | Blog Bruno Freitas Contabilidade`,
    description: cat.description || `Artigos sobre ${cat.name.toLowerCase()} para empreendedores.`,
    path: `/blog/categoria/${cat.slug}`,
  });
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string>>;
}) {
  const [{ slug }, sp] = await Promise.all([params, searchParams]);
  const page = Math.max(1, Number(sp.pagina) || 1);
  const [cat, categories, result] = await Promise.all([getCategory(slug), listCategories(), listPublishedPosts({ category: slug, page })]);
  if (!cat) notFound();
  return (
    <>
      <PageHero kicker="Blog · Categoria" title={`*${cat.name}.*`} text={cat.description} />
      <BlogIndex {...result} categories={categories} activeCategory={slug} basePath={`/blog/categoria/${slug}`} />
    </>
  );
}
