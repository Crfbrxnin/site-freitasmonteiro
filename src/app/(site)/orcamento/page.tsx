import { getGroup, listServices } from "@/lib/repo";
import { getSite, waLink } from "@/lib/site";
import { buildMeta } from "@/lib/seo";
import { PageHero, Steps } from "@/components/site/blocks";
import { LeadForm } from "@/components/site/lead-form";
import { WaLink } from "@/components/site/wa-link";
import type { Step } from "@/lib/types";

export const revalidate = 300;

export async function generateMetadata() {
  const seo = await getGroup<Record<string, string>>("seo");
  return buildMeta({ title: seo.orcamentoTitle, description: seo.orcamentoDescription, path: "/orcamento" });
}

export default async function OrcamentoPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const sp = await searchParams;
  const [site, services, home] = await Promise.all([getSite(), listServices(), getGroup<{ steps: Step[] }>("home")]);
  const wa = waLink(site, site.wa.orcamento);
  const defaultService = services.some((s) => s.slug === sp.servico) ? sp.servico : "";
  return (
    <>
      <PageHero
        kicker="Orçamento"
        title="Solicite uma *proposta contábil.*"
        text="Quanto mais você contar sobre a empresa, mais precisa será a proposta. Os honorários são apresentados na proposta, de acordo com o escopo."
      />
      <section className="theme-papel section" aria-label="Formulário de orçamento">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <LeadForm
              form="orcamento"
              variant="orcamento"
              services={services.map((s) => ({ slug: s.slug, title: s.title }))}
              defaultService={defaultService}
              submitLabel="Solicitar orçamento"
            />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <p className="label muted">Prefere conversar?</p>
            <p className="display display-sm mt-4">
              Fale direto pelo <em>WhatsApp.</em>
            </p>
            <WaLink href={wa} label="orcamento-lateral" className="btn btn-primary mt-6">
              Abrir WhatsApp
            </WaLink>
          </aside>
        </div>
      </section>
      <section className="theme-tinta section">
        <div className="container-site">
          <h2 className="display display-md">
            O que acontece <em>depois.</em>
          </h2>
          <Steps steps={home.steps} className="mt-10" />
        </div>
      </section>
    </>
  );
}
