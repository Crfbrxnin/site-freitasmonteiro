import "server-only";
import type { Metadata } from "next";
import { getSite, type PublicSite } from "./site";
import { plain, siteUrl } from "./utils";

export async function buildMeta(opts: {
  title: string;
  description: string;
  path: string;
  image?: string;
  noindex?: boolean;
  type?: "website" | "article";
  publishedTime?: string;
}): Promise<Metadata> {
  const site = await getSite();
  const image = opts.image || site.geral.ogImage || "/og.jpg";
  const title = plain(opts.title);
  return {
    title: { absolute: title },
    description: opts.description,
    alternates: { canonical: siteUrl(opts.path) },
    robots: opts.noindex ? { index: false, follow: true } : undefined,
    openGraph: {
      type: opts.type || "website",
      locale: "pt_BR",
      url: siteUrl(opts.path),
      siteName: site.geral.siteName,
      title,
      description: opts.description,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
      ...(opts.publishedTime ? { publishedTime: opts.publishedTime } : {}),
    },
    twitter: { card: "summary_large_image", title, description: opts.description, images: [image] },
  };
}

/** LocalBusiness / AccountingService com SEO local configurável. Só inclui dados cadastrados (nada inventado). */
export function organizationJsonLd(site: PublicSite) {
  const { geral, contato, redes } = site;
  const sameAs = [redes.instagram, redes.facebook, redes.linkedin, redes.youtube, redes.tiktok].filter((u) => /^https:\/\//.test(u));
  const address =
    contato.city || contato.state
      ? {
          "@type": "PostalAddress",
          addressLocality: contato.city || undefined,
          addressRegion: contato.state || undefined,
          addressCountry: "BR",
          ...(contato.showAddress && contato.address ? { streetAddress: contato.address, postalCode: contato.zip || undefined } : {}),
        }
      : undefined;
  return {
    "@context": "https://schema.org",
    "@type": "AccountingService",
    "@id": siteUrl("/#organizacao"),
    name: geral.siteName,
    legalName: geral.legalName || undefined,
    description: geral.tagline,
    url: siteUrl("/"),
    logo: siteUrl("/icon.svg"),
    image: siteUrl(geral.ogImage || "/og.jpg"),
    telephone: contato.whatsapp ? `+${contato.whatsapp.replace(/\D/g, "")}` : undefined,
    email: contato.email || undefined,
    address,
    areaServed: contato.serviceArea || contato.city || undefined,
    openingHours: undefined,
    sameAs: sameAs.length ? sameAs : undefined,
    founder: { "@type": "Person", name: "Bruno Freitas", jobTitle: geral.professional || "Contador", identifier: geral.crc || undefined },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: siteUrl(it.path) })),
  };
}
