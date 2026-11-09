import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "@flux-icons/react";
import { getPublishedPost, getRelatedPosts, getService } from "@/lib/repo";
import { getSite, waLink } from "@/lib/site";
import { buildMeta, breadcrumbJsonLd } from "@/lib/seo";
import { formatDate, readingTime, siteUrl } from "@/lib/utils";
import { Breadcrumbs, PostCard } from "@/components/site/blocks";
import { Markdown } from "@/components/site/markdown";
import { ShareButtons } from "@/components/site/share";
import { JsonLd } from "@/components/site/json-ld";
import { WaLink } from "@/components/site/wa-link";
import { SectionHead } from "@/components/site/section-head";
import { ServiceIcon } from "@/components/site/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) return {};
  return buildMeta({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt,
    path: `/blog/${post.slug}`,
    image: post.coverImage || undefined,
    type: "article",
    publishedTime: post.publishedAt,
  });
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPublishedPost(slug);
  if (!post) notFound();
  const [site, related, service] = await Promise.all([
    getSite(),
    getRelatedPosts(post),
    post.serviceSlug ? getService(post.serviceSlug) : Promise.resolve(null),
  ]);
  const url = siteUrl(`/blog/${post.slug}`);
  const minutes = readingTime(post.content);
  const wa = waLink(site, `Olá! Li o artigo "${post.title}" no site e gostaria de tirar uma dúvida.`);

  return (
    <>
      <article>
        <header className="theme-tinta">
          <div className="container-site pb-14 pt-10 sm:pb-20">
            <Breadcrumbs
              items={[
                { name: "Blog", href: "/blog" },
                ...(post.categorySlug ? [{ name: post.categoryName || "", href: `/blog/categoria/${post.categorySlug}` }] : []),
                { name: "Artigo" },
              ]}
            />
            <div className="mx-auto mt-14 max-w-4xl">
              {post.categoryName && <p className="label accent">{post.categoryName}</p>}
              <h1 className="display display-lg mt-5">{post.title}</h1>
              <p className="lead-text mt-6 max-w-2xl">{post.excerpt}</p>
              <span className="fio mt-10 w-20" />
              <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm muted">
                <span>
                  Por <span className="text-[var(--fg)]">{post.author || site.geral.siteName}</span>
                </span>
                <time dateTime={post.publishedAt} className="tnum">
                  {formatDate(post.publishedAt)}
                </time>
                <span className="tnum">{minutes} min de leitura</span>
              </div>
            </div>
          </div>
        </header>

        {post.coverImage && (
          <div className="theme-papel">
            <div className="container-site">
              <div className="relative mx-auto -mt-px aspect-[16/9] max-w-5xl overflow-hidden rounded-b-2xl bg-tinta">
                <Image src={post.coverImage} alt={post.coverAlt || ""} fill priority sizes="(min-width: 1024px) 64rem, 100vw" className="object-cover grayscale contrast-[1.15]" />
              </div>
            </div>
          </div>
        )}

        <div className="theme-papel section !pt-14">
          <div className="container-site">
            <div className="mx-auto max-w-[44rem]">
              <Markdown>{post.content}</Markdown>

              {/* CTA para WhatsApp + link interno para o serviço */}
              <aside className="theme-vinho mt-16 rounded-2xl p-8 sm:p-10" aria-label="Fale com um contador">
                <p className="label muted">Ficou com dúvida?</p>
                <p className="display display-sm mt-4">
                  Quer entender como isso se aplica à <em>sua empresa?</em>
                </p>
                <p className="mt-4 muted">Uma primeira conversa para entender o seu caso.</p>
                <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                  <WaLink href={wa} label={`artigo-${post.slug}`} className="btn btn-primary">
                    Falar no WhatsApp
                  </WaLink>
                  {service && (
                    <Link href={`/servicos/${service.slug}`} className="btn btn-ghost">
                      <ServiceIcon name={service.icon} className="size-4" /> {service.title}
                    </Link>
                  )}
                </div>
              </aside>

              <div className="mt-12 border-t hairline pt-8">
                <ShareButtons url={url} title={post.title} />
              </div>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="theme-tinta section" aria-labelledby="relacionados">
          <div className="container-site">
            <SectionHead label="Continue lendo" />
            <div className="mt-10 flex items-end justify-between gap-6">
              <h2 id="relacionados" className="display display-md">
                Artigos <em>relacionados.</em>
              </h2>
              <Link href="/blog" className="label hidden items-center gap-2 link-underline sm:inline-flex">
                Todos os artigos <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "BlogPosting",
          headline: post.title,
          description: post.metaDescription || post.excerpt,
          image: post.coverImage ? siteUrl(post.coverImage) : undefined,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt || post.publishedAt,
          author: { "@type": "Person", name: post.author || "Bruno Freitas" },
          publisher: { "@id": siteUrl("/#organizacao") },
          mainEntityOfPage: url,
          articleSection: post.categoryName || undefined,
          inLanguage: "pt-BR",
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Blog", path: "/blog" },
          { name: post.title, path: `/blog/${post.slug}` },
        ])}
      />
    </>
  );
}
