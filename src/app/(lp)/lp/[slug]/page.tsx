import { notFound } from "next/navigation";
import { Check } from "@flux-icons/react";
import { getLanding, listServices } from "@/lib/repo";
import { getSite, signatureLine, waLink } from "@/lib/site";
import { buildMeta } from "@/lib/seo";
import { pad2, ROMAN } from "@/lib/utils";
import { Emph } from "@/components/site/emph";
import { FinalCta, Photo } from "@/components/site/blocks";
import { FaqList, faqJsonLd } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { LeadForm } from "@/components/site/lead-form";
import { Monogram } from "@/components/site/brand";
import { WaLink } from "@/components/site/wa-link";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const l = await getLanding(slug);
  if (!l) return {};
  return buildMeta({ title: l.seoTitle || l.title, description: l.metaDescription, path: `/lp/${l.slug}`, noindex: l.noindex });
}

export default async function LandingPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [site, l, services] = await Promise.all([getSite(), getLanding(slug), listServices()]);
  if (!l) notFound();
  const wa = waLink(site, l.whatsappMessage || site.wa.contato);
  const formServices = services.map((s) => ({ slug: s.slug, title: s.title }));

  return (
    <>
      {/* Hero com formulário na primeira dobra */}
      <section className="theme-tinta relative isolate overflow-hidden">
        <Monogram title="" className="pointer-events-none absolute -left-24 -top-10 -z-10 h-[115%] w-auto text-papel opacity-[0.05]" />
        <div className="container-site grid gap-12 py-14 sm:py-20 lg:grid-cols-12 lg:items-start">
          <div className="lg:col-span-6 lg:pt-8">
            <p className="label muted">{l.kicker}</p>
            <h1 className="display display-lg mt-6 rise">
              <Emph text={l.headline} />
            </h1>
            <span className="fio mt-10 w-24" />
            <p className="lead-text mt-6 max-w-xl">{l.subheadline}</p>
            <ul className="mt-10 space-y-3">
              {l.benefits.map((b, i) => (
                <li key={i} className="flex gap-3">
                  <Check className="mt-1 size-4 shrink-0 accent" aria-hidden />
                  <span>{b.title}</span>
                </li>
              ))}
            </ul>
            <WaLink href={wa} label={`lp-${l.slug}-hero`} className="btn btn-ghost mt-10">
              Prefiro falar no WhatsApp
            </WaLink>
          </div>
          <div className="lg:col-span-6">
            <div id="formulario" className="theme-papel rounded-2xl p-6 shadow-2xl sm:p-8">
              <p className="display display-sm">
                {l.ctaLabel}
              </p>
              <p className="mt-2 text-sm muted">Preencha e retornaremos pelo contato informado.</p>
              <LeadForm
                form={`lp:${l.slug}`}
                variant="curto"
                services={formServices}
                defaultService={l.serviceSlug}
                submitLabel={l.ctaLabel}
                className="mt-6"
              />
            </div>
          </div>
        </div>
      </section>

      {l.problem && (
        <section className="theme-papel section">
          <div className="container-site grid gap-10 lg:grid-cols-12">
            <p className="label muted lg:col-span-3">O cenário</p>
            <p className="display display-sm !leading-[1.15] lg:col-span-8">{l.problem}</p>
          </div>
        </section>
      )}

      <section className="theme-tinta section">
        <div className="container-site">
          <h2 className="display display-md">
            O que você <em>ganha.</em>
          </h2>
          <ul className="mt-12 grid gap-x-10 md:grid-cols-3">
            {l.benefits.map((b, i) => (
              <li key={i} className="border-t hairline pt-6 pb-8">
                <span className="roman">{ROMAN[i]}</span>
                <h3 className="mt-5 text-xl font-medium">{b.title}</h3>
                <p className="mt-3 leading-relaxed muted">{b.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="theme-papel section">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <h2 className="display display-md">
              O que está <em>incluído.</em>
            </h2>
            <ul className="mt-8">
              {l.included.map((it, i) => (
                <li key={i} className="flex items-baseline justify-between gap-6 border-b hairline py-4">
                  <span className="flex items-baseline gap-3">
                    <Check className="size-4 shrink-0 translate-y-0.5 accent" aria-hidden />
                    {it}
                  </span>
                  <span className="label tnum muted">{pad2(i + 1)}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="display display-md">
              Como <em>funciona.</em>
            </h2>
            <ol className="mt-8">
              {l.steps.map((s, i) => (
                <li key={i} className="grid grid-cols-[3.5rem_1fr] gap-3 border-t hairline py-5">
                  <span className="tnum text-3xl font-medium accent">{pad2(i + 1)}</span>
                  <div>
                    <p className="font-medium">{s.title}</p>
                    <p className="mt-1 muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {l.faqs.length > 0 && (
        <section className="theme-tinta section">
          <div className="container-site grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="display display-md">
                Perguntas <em>frequentes.</em>
              </h2>
              <Photo src="/images/calculadora.jpg" alt="" className="mt-10 hidden aspect-[4/5] max-w-xs rounded-2xl lg:block" />
            </div>
            <div className="lg:col-span-8">
              <FaqList items={l.faqs} />
            </div>
          </div>
          <JsonLd data={faqJsonLd(l.faqs)} />
        </section>
      )}

      <FinalCta
        title="Uma primeira conversa para entender o *seu caso.*"
        text="Fale com Bruno Freitas pelo WhatsApp ou preencha o formulário no topo da página."
        cta="Falar no WhatsApp"
        waHref={wa}
        label={`lp-${l.slug}-final`}
        signatureLine={signatureLine(site)}
        secondary={{ href: "#formulario", label: "Preencher formulário" }}
      />
    </>
  );
}
