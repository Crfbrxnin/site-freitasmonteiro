import { getGroup, listServices } from "@/lib/repo";
import { getSite, signatureLine, waLink } from "@/lib/site";
import { buildMeta, breadcrumbJsonLd } from "@/lib/seo";
import { FinalCta, PageHero, ServiceGrid, Steps } from "@/components/site/blocks";
import { SectionHead } from "@/components/site/section-head";
import { WaLink } from "@/components/site/wa-link";
import { JsonLd } from "@/components/site/json-ld";
import Link from "next/link";
import type { Step } from "@/lib/types";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const seo = await getGroup<Record<string, string>>("seo");
  return buildMeta({ title: seo.servicosTitle, description: seo.servicosDescription, path: "/servicos" });
}

export default async function ServicosPage() {
  const [site, services, home] = await Promise.all([getSite(), listServices(), getGroup<{ steps: Step[]; servicesIntro: string }>("home")]);
  const wa = waLink(site, site.wa.servicos);
  return (
    <>
      <PageHero kicker="Serviços" title="Soluções contábeis para cada *fase da empresa.*" text={home.servicesIntro}>
        <div className="flex flex-col gap-3 sm:flex-row">
          <WaLink href={wa} label="servicos-hero" className="btn btn-primary">
            Qual serviço é o meu?
          </WaLink>
          <Link href="/orcamento" className="btn btn-ghost">
            Solicitar orçamento
          </Link>
        </div>
      </PageHero>
      <section className="theme-tinta pb-24" aria-label="Lista de serviços">
        <div className="container-site">
          <ServiceGrid services={services} headingLevel="h2" />
        </div>
      </section>
      <section className="theme-papel section">
        <div className="container-site">
          <SectionHead label="Como funciona" />
          <h2 className="display display-md mt-12 max-w-2xl">
            Do primeiro contato à <em>proposta.</em>
          </h2>
          <Steps steps={home.steps} className="mt-12" />
        </div>
      </section>
      <FinalCta
        title="Não sabe por onde *começar?*"
        text="Conte o momento da sua empresa. A partir disso, indicamos os serviços adequados."
        cta="Falar com um especialista"
        waHref={wa}
        label="cta-final-servicos"
        signatureLine={signatureLine(site)}
        secondary={{ href: "/diagnostico", label: "Diagnóstico contábil inicial" }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Início", path: "/" }, { name: "Serviços", path: "/servicos" }])} />
    </>
  );
}
