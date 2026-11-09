import type { MetadataRoute } from "next";
import { listCategories, listLandings, listPublishedPosts, listServices } from "@/lib/repo";
import { siteUrl } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [services, categories, { posts }, landings] = await Promise.all([
    listServices(),
    listCategories(),
    listPublishedPosts({ perPage: 1000 }),
    listLandings(),
  ]);
  const fixed = ["/", "/sobre", "/servicos", "/blog", "/contato", "/orcamento", "/diagnostico", "/politica-de-privacidade"];
  return [
    ...fixed.map((p) => ({ url: siteUrl(p), changeFrequency: "monthly" as const, priority: p === "/" ? 1 : 0.7 })),
    ...services.map((s) => ({ url: siteUrl(`/servicos/${s.slug}`), lastModified: s.updatedAt, priority: 0.8 })),
    ...categories.filter((c) => c.postCount).map((c) => ({ url: siteUrl(`/blog/categoria/${c.slug}`), priority: 0.5 })),
    ...posts.map((p) => ({ url: siteUrl(`/blog/${p.slug}`), lastModified: p.updatedAt || p.publishedAt, priority: 0.6 })),
    ...landings.filter((l) => !l.noindex).map((l) => ({ url: siteUrl(`/lp/${l.slug}`), priority: 0.5 })),
  ];
}
