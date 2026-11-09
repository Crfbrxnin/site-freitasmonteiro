import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "@flux-icons/react";
import { Emph } from "./emph";
import { ServiceIcon } from "./icons";
import { WaLink } from "./wa-link";
import { Signature } from "./brand";
import type { Post, Service, Step } from "@/lib/types";
import { cx, formatDate, pad2, readingTime } from "@/lib/utils";

/** Foto P&B que "surge do fundo" (degradê do manual). */
export function Photo({
  src,
  alt,
  className,
  sizes = "(min-width: 1024px) 40vw, 100vw",
  tone = "tinta",
  priority = false,
  fade = true,
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  tone?: "tinta" | "vinho" | "papel";
  priority?: boolean;
  fade?: boolean;
}) {
  return (
    <div className={cx(/\b(absolute|fixed)\b/.test(className || "") ? "" : "relative", "overflow-hidden", `photo-${tone}`, fade && "photo-fade", className)}>
      <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-cover" />
    </div>
  );
}

export function ServiceGrid({ services, headingLevel = "h3" }: { services: Service[]; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  return (
    <ul className="grid border-l border-t hairline sm:grid-cols-2 lg:grid-cols-4">
      {services.map((s, i) => (
        <li key={s.slug} className="group relative flex flex-col border-b border-r hairline p-6 transition-colors duration-300 hover:bg-[var(--surface)] sm:p-7">
          <div className="flex items-start justify-between">
            <ServiceIcon name={s.icon} className="size-7 accent" />
            <span className="label tnum muted">{pad2(i + 1)}</span>
          </div>
          <H className="display mt-10 text-[1.85rem] leading-[1]">{s.title}</H>
          <p className="mt-4 flex-1 text-[0.95rem] leading-relaxed muted">{s.short}</p>
          <Link
            href={`/servicos/${s.slug}`}
            className="label mt-8 inline-flex items-center gap-2 after:absolute after:inset-0"
            aria-label={`Saiba mais sobre ${s.title}`}
          >
            Saiba mais <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function Steps({ steps, className }: { steps: Step[]; className?: string }) {
  return (
    <ol className={cx("grid gap-px overflow-hidden rounded-2xl border hairline bg-[var(--line)] md:grid-cols-3", className)}>
      {steps.map((s, i) => (
        <li key={i} className="bg-[var(--bg)] p-7 sm:p-9">
          <span className="tnum font-medium text-5xl tracking-tight accent sm:text-6xl">{pad2(i + 1)}</span>
          <h3 className="mt-8 text-xl font-medium">{s.title}</h3>
          <p className="mt-3 leading-relaxed muted">{s.text}</p>
        </li>
      ))}
    </ol>
  );
}

export function PostCard({ post, priority = false }: { post: Post; priority?: boolean }) {
  return (
    <article className="group relative flex flex-col">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-tinta">
        {post.coverImage ? (
          <Image
            src={post.coverImage}
            alt={post.coverAlt || ""}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover grayscale contrast-[1.15] transition-transform duration-700 ease-out group-hover:scale-[1.03]"
          />
        ) : (
          <div className="absolute inset-0 flex items-end p-6 text-papel">
            <span className="display text-3xl">{post.categoryName}</span>
          </div>
        )}
      </div>
      <div className="mt-5 flex items-center gap-3 label muted">
        {post.categoryName && <span className="accent">{post.categoryName}</span>}
        <span aria-hidden className="h-px w-5 bg-current opacity-40" />
        <time dateTime={post.publishedAt} className="tnum">
          {formatDate(post.publishedAt, { day: "2-digit", month: "short", year: "numeric" })}
        </time>
      </div>
      <h3 className="display mt-3 text-[1.9rem] leading-[1.02]">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-3 leading-relaxed muted">{post.excerpt}</p>
      <span className="label mt-5 inline-flex items-center gap-2">
        Ler artigo <span className="tnum muted">· {readingTime(post.content)} min</span>
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </span>
    </article>
  );
}

/** Chamada final (vinho), com a assinatura completa do manual. */
export function FinalCta({
  title,
  text,
  cta,
  waHref,
  label,
  signatureLine,
  secondary,
}: {
  title: string;
  text: string;
  cta: string;
  waHref: string;
  label: string;
  signatureLine: string;
  secondary?: { href: string; label: string };
}) {
  return (
    <section className="theme-vinho relative overflow-hidden section" aria-labelledby="cta-final">
      <div className="container-site relative grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <h2 id="cta-final" className="display display-lg max-w-4xl">
            <Emph text={title} />
          </h2>
          <span className="fio mt-10 w-24" />
          <p className="lead-text mt-6 max-w-xl">{text}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <WaLink href={waHref} label={label} className="btn btn-primary">
              {cta}
            </WaLink>
            {secondary && (
              <Link href={secondary.href} className="btn btn-ghost">
                {secondary.label}
              </Link>
            )}
          </div>
        </div>
        <div className="lg:col-span-4 lg:justify-self-end">
          <Signature line={signatureLine} />
        </div>
      </div>
    </section>
  );
}

export function PageHero({
  kicker,
  title,
  text,
  children,
  image,
}: {
  kicker: string;
  title: string;
  text?: string;
  children?: React.ReactNode;
  image?: { src: string; alt: string };
}) {
  return (
    <section className="theme-tinta relative overflow-hidden">
      {image && (
        <Photo
          src={image.src}
          alt={image.alt}
          priority
          sizes="50vw"
          className="absolute inset-y-0 right-0 hidden w-[42%] lg:block"
        />
      )}
      <div className="container-site relative pb-16 pt-14 sm:pb-24 sm:pt-20">
        <p className="label muted rise">{kicker}</p>
        <h1 className="display display-lg mt-6 max-w-4xl rise rise-1">
          <Emph text={title} />
        </h1>
        {text && (
          <>
            <span className="fio mt-10 w-24 rise rise-2" />
            <p className="lead-text mt-6 max-w-2xl rise rise-2">{text}</p>
          </>
        )}
        {children && <div className="mt-10 rise rise-3">{children}</div>}
      </div>
    </section>
  );
}

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  return (
    <nav aria-label="Trilha de navegação" className="label muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {it.href ? (
              <Link href={it.href} className="hover:text-[var(--fg)]">
                {it.name}
              </Link>
            ) : (
              <span aria-current="page" className="text-[var(--fg)]">
                {it.name}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
