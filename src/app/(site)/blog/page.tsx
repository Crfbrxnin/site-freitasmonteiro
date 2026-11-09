import { getGroup, listCategories, listPublishedPosts } from "@/lib/repo";
import { buildMeta } from "@/lib/seo";
import { PageHero } from "@/components/site/blocks";
import { BlogIndex } from "@/components/site/blog-index";

export async function generateMetadata({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const seo = await getGroup<Record<string, string>>("seo");
  return buildMeta({ title: seo.blogTitle, description: seo.blogDescription, path: "/blog", noindex: Boolean(sp.q) });
}

export default async function BlogPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const q = (sp.q || "").trim().slice(0, 80);
  const page = Math.max(1, Number(sp.pagina) || 1);
  const [categories, result] = await Promise.all([listCategories(), listPublishedPosts({ q, page, perPage: 9 })]);
  return (
    <>
      <PageHero
        kicker="Blog contábil"
        title="Contabilidade explicada em *linguagem clara.*"
        text="Artigos sobre impostos, MEI, abertura de empresas, gestão e obrigações contábeis para quem empreende."
      />
      <BlogIndex {...result} categories={categories} q={q} basePath="/blog" />
    </>
  );
}
