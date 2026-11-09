import Link from "next/link";
import { notFound } from "next/navigation";
import { Check } from "@flux-icons/react";
import { getService, listPublishedPosts, listServices } from "@/lib/repo";
import { getSite, waLink } from "@/lib/site";
import { buildMeta, breadcrumbJsonLd } from "@/lib/seo";
import { pad2, ROMAN, siteUrl } from "@/lib/utils";
import { Breadcrumbs, Photo, PostCard, Steps } from "@/components/site/blocks";
import { Emph } from "@/components/site/emph";
import { FaqList, faqJsonLd } from "@/components/site/faq";
import { LeadForm } from "@/components/site/lead-form";
import { ServiceIcon } from "@/components/site/icons";
import { JsonLd } from "@/components/site/json-ld";
import { SectionHead } from "@/components/site/section-head";
import { WaLink } from "@/components/site/wa-link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const s = await getService(slug);
  if (!s) return {};
  return buildMeta({ title: s.seoTitle || s.title, description: s.metaDescription || s.short, path: `/servicos/${s.slug}` });
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [site, service, services, { posts }] = await Promise.all([
    getSite(),
    getService(slug),
    listServices(),
    listPublishedPosts({ perPage: 30 }),
  ]);
  if (!service) notFound();
  const wa = waLink(site, service.whatsappMessage || site.wa.servicos);
  const related = posts.filter((p) => p.serviceSlug === service.slug).slice(0, 3);
  const others = services.filter((s) => s.slug !== service.slug);

  return (
    <>
      {/* Hero */}
      <section className="theme-tinta relative overflow-hidden">
        <Photo
          src="/images/calculadora.jpg"
          alt=""
          priority
          sizes="40vw"
          className="absolute inset-y-0 right-0 hidden w-[38%] lg:block"
        />
        <div className="container-site relative pb-20 pt-10 sm:pb-28">
          <Breadcrumbs items={[{ name: "Início", href: "/" }, { name: "Serviços", href: "/servicos" }, { name: service.title }]} />
          <div className="mt-14 flex items-center gap-4">
            <ServiceIcon name={service.icon} className="size-8 accent" />
            <p className="label">{service.title}</p>
          </div>
          <h1 className="display display-lg mt-6 max-w-4xl rise">
            <Emph text={service.headline || service.title} />
          </h1>
          <span className="fio mt-10 w-24" />
          <p className="lead-text mt-6 max-w-2xl">{service.subheadline}</p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <WaLink href={wa} label={`servico-${service.slug}`} className="btn btn-primary">
              Falar no WhatsApp
            </WaLink>
            <Link href="#proposta" className="btn btn-ghost">
              Solicitar proposta
            </Link>
          </div>
        </div>
      </section>

      {/* Problema */}
      {service.problem && (
        <section className="theme-papel section" aria-labelledby="problema">
          <div className="container-site grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHead label="O problema" />
              <h2 id="problema" className="display display-md mt-8">
                O que este serviço <em>resolve.</em>
              </h2>
            </div>
            <p className="display display-sm !leading-[1.15] lg:col-span-7 lg:col-start-6">{service.problem}</p>
          </div>
        </section>
      )}

      {/* Benefícios */}
      {service.benefits.length > 0 && (
        <section className="theme-tinta section" aria-labelledby="beneficios">
          <div className="container-site">
            <SectionHead label="Benefícios" />
            <h2 id="beneficios" className="display display-md mt-12 max-w-2xl">
              O que muda para a <em>sua empresa.</em>
            </h2>
            <ul className="mt-12 grid gap-x-10 md:grid-cols-3">
              {service.benefits.map((b, i) => (
                <li key={i} className="border-t hairline pt-6 pb-8">
                  <span className="roman">{ROMAN[i]}</span>
                  <h3 className="mt-5 text-xl font-medium">{b.title}</h3>
                  <p className="mt-3 leading-relaxed muted">{b.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* Incluído + Para quem */}
      <section className="theme-papel section" aria-labelledby="incluido">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <SectionHead label="Escopo" />
            <h2 id="incluido" className="display display-md mt-8">
              O que está <em>incluído.</em>
            </h2>
            <ul className="mt-10">
              {service.included.map((it, i) => (
                <li key={i} className="flex items-baseline justify-between gap-6 border-b hairline py-4">
                  <span className="flex items-baseline gap-3">
                    <Check className="size-4 shrink-0 translate-y-0.5 accent" aria-hidden />
                    <span>{it}</span>
                  </span>
                  <span className="label tnum muted">{pad2(i + 1)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm muted">O escopo final é definido na proposta, de acordo com a necessidade da empresa.</p>
          </div>
          <div className="lg:col-span-4 lg:col-start-9">
            <SectionHead label="Indicação" />
            <h2 className="display display-sm mt-8">
              Para quem é <em>indicado.</em>
            </h2>
            <ul className="mt-8 space-y-4">
              {service.audience.map((a, i) => (
                <li key={i} className="flex gap-4 leading-relaxed">
                  <span className="roman !text-xl w-6 shrink-0">{ROMAN[i]}</span>
                  {a}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Etapas */}
      {service.steps.length > 0 && (
        <section className="theme-vinho section" aria-labelledby="etapas">
          <div className="container-site">
            <SectionHead label="Etapas do atendimento" />
            <h2 id="etapas" className="display display-md mt-12">
              Como <em>trabalhamos.</em>
            </h2>
            <ol className="mt-12 grid gap-px overflow-hidden rounded-2xl border hairline bg-[var(--line)] md:grid-cols-2 lg:grid-cols-4">
              {service.steps.map((s, i) => (
                <li key={i} className="bg-[var(--bg)] p-7">
                  <span className="tnum text-5xl font-medium accent">{pad2(i + 1)}</span>
                  <h3 className="mt-8 text-lg font-medium">{s.title}</h3>
                  <p className="mt-2 leading-relaxed muted">{s.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>
      )}

      {/* FAQ */}
      {service.faqs.length > 0 && (
        <section className="theme-tinta section" aria-labelledby="faq">
          <div className="container-site grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHead label="Dúvidas" />
              <h2 id="faq" className="display display-md mt-8">
                Perguntas <em>frequentes.</em>
              </h2>
            </div>
            <div className="lg:col-span-8">
              <FaqList items={service.faqs} />
            </div>
          </div>
          <JsonLd data={faqJsonLd(service.faqs)} />
        </section>
      )}

      {/* Proposta */}
      <section id="proposta" className="theme-papel section" aria-labelledby="proposta-titulo">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHead label="Proposta" />
            <h2 id="proposta-titulo" className="display display-md mt-8">
              Solicite uma <em>proposta.</em>
            </h2>
            <p className="lead-text mt-6">Conte sobre a sua empresa. Analisamos a necessidade e retornamos com uma proposta personalizada.</p>
            <WaLink href={wa} label={`servico-form-${service.slug}`} className="btn btn-ghost mt-8">
              Prefiro o WhatsApp
            </WaLink>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <LeadForm
              form={`servico:${service.slug}`}
              variant="orcamento"
              services={services.map((s) => ({ slug: s.slug, title: s.title }))}
              defaultService={service.slug}
              submitLabel="Solicitar proposta"
            />
          </div>
        </div>
      </section>

      {/* Conteúdo relacionado e outros serviços (links internos) */}
      <section className="theme-tinta section">
        <div className="container-site">
          {related.length > 0 && (
            <div className="mb-20">
              <SectionHead label="Artigos relacionados" />
              <div className="mt-10 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
                {related.map((p) => (
                  <PostCard key={p.id} post={p} />
                ))}
              </div>
            </div>
          )}
          <SectionHead label="Outros serviços" />
          <ul className="mt-6 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {others.map((o) => (
              <li key={o.slug} className="border-b hairline">
                <Link href={`/servicos/${o.slug}`} className="flex items-center justify-between gap-4 py-4 hover:text-rose">
                  <span>{o.title}</span>
                  <ServiceIcon name={o.icon} className="size-5 shrink-0 opacity-60" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Service",
          name: service.title,
          description: service.metaDescription || service.short,
          url: siteUrl(`/servicos/${service.slug}`),
          serviceType: service.title,
          provider: { "@id": siteUrl("/#organizacao") },
          areaServed: site.contato.serviceArea || site.contato.city || undefined,
        }}
      />
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Início", path: "/" },
          { name: "Serviços", path: "/servicos" },
          { name: service.title, path: `/servicos/${service.slug}` },
        ])}
      />
    </>
  );
}
