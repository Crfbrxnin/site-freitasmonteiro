import Link from "next/link";
import { Search } from "@flux-icons/react";
import { PostCard } from "./blocks";
import type { Category, Post } from "@/lib/types";
import { cx } from "@/lib/utils";

export function BlogIndex({
  posts,
  categories,
  activeCategory,
  q,
  page,
  pages,
  basePath,
  total,
}: {
  posts: Post[];
  categories: Category[];
  activeCategory?: string;
  q?: string;
  page: number;
  pages: number;
  basePath: string;
  total: number;
}) {
  const href = (p: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (p > 1) params.set("pagina", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  };

  return (
    <section className="theme-papel section !pt-14">
      <div className="container-site">
        <div className="flex flex-col gap-6 border-b hairline pb-8 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Categorias" className="-mx-1 overflow-x-auto">
            <ul className="flex gap-2 px-1 lg:flex-wrap">
              <li>
                <Link
                  href="/blog"
                  aria-current={!activeCategory ? "page" : undefined}
                  className={cx("label inline-flex whitespace-nowrap rounded-full border px-4 py-2.5", !activeCategory ? "bg-tinta text-papel border-tinta" : "hairline hover:border-current")}
                >
                  Todos
                </Link>
              </li>
              {categories.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/blog/categoria/${c.slug}`}
                    aria-current={activeCategory === c.slug ? "page" : undefined}
                    className={cx(
                      "label inline-flex whitespace-nowrap rounded-full border px-4 py-2.5",
                      activeCategory === c.slug ? "bg-tinta text-papel border-tinta" : "hairline hover:border-current",
                    )}
                  >
                    {c.name}
                    {c.postCount ? <span className="ml-2 tnum opacity-60">{c.postCount}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <form action="/blog" method="get" role="search" className="relative w-full lg:max-w-xs">
            <label htmlFor="busca" className="sr-only">
              Buscar no blog
            </label>
            <input id="busca" name="q" defaultValue={q} placeholder="Buscar artigos" className="field !rounded-full !pl-11" type="search" />
            <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 opacity-60" aria-hidden />
          </form>
        </div>

        {q && (
          <p className="mt-8 muted" role="status">
            {total} {total === 1 ? "resultado" : "resultados"} para “{q}”.{" "}
            <Link href="/blog" className="underline underline-offset-2">
              Limpar busca
            </Link>
          </p>
        )}

        {posts.length ? (
          <div className="mt-12 grid gap-x-8 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <PostCard key={p.id} post={p} priority={i < 3} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center">
            <p className="display display-md">Nenhum artigo <em>encontrado.</em></p>
            <p className="mt-4 muted">Tente outro termo ou navegue pelas categorias.</p>
          </div>
        )}

        {pages > 1 && (
          <nav aria-label="Paginação" className="mt-20 flex items-center justify-between border-t hairline pt-8">
            {page > 1 ? (
              <Link href={href(page - 1)} className="label link-underline" rel="prev">
                Anteriores
              </Link>
            ) : (
              <span />
            )}
            <ol className="flex gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <li key={p}>
                  <Link
                    href={href(p)}
                    aria-current={p === page ? "page" : undefined}
                    className={cx("tnum flex size-10 items-center justify-center rounded-full text-sm", p === page ? "bg-tinta text-papel" : "hover:bg-[var(--surface)]")}
                  >
                    {p}
                  </Link>
                </li>
              ))}
            </ol>
            {page < pages ? (
              <Link href={href(page + 1)} className="label link-underline" rel="next">
                Próximos
              </Link>
            ) : (
              <span />
            )}
          </nav>
        )}
      </div>
    </section>
  );
}
