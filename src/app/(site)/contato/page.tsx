import { getGroup, listServices } from "@/lib/repo";
import { getSite, waLink } from "@/lib/site";
import { buildMeta, breadcrumbJsonLd } from "@/lib/seo";
import { PageHero } from "@/components/site/blocks";
import { LeadForm } from "@/components/site/lead-form";
import { WaLink } from "@/components/site/wa-link";
import { BrandIcon } from "@/components/site/icons";
import { socialLinks } from "@/components/site/footer";
import { Tbd } from "@/components/site/tbd";
import { JsonLd } from "@/components/site/json-ld";

export const revalidate = 300;

export async function generateMetadata() {
  const seo = await getGroup<Record<string, string>>("seo");
  return buildMeta({ title: seo.contatoTitle, description: seo.contatoDescription, path: "/contato" });
}

export default async function ContatoPage() {
  const [site, services] = await Promise.all([getSite(), listServices()]);
  const { contato } = site;
  const show = site.geral.showPlaceholders;
  const wa = waLink(site, site.wa.contato);
  const socials = socialLinks(site);
  const mapOk = contato.showAddress && /^https:\/\/(www\.)?google\.com\/maps\/embed/.test(contato.mapsEmbedUrl);
  const cityLine = [contato.city, contato.state].filter(Boolean).join(" · ");

  const rows: [string, React.ReactNode][] = [
    [
      "WhatsApp",
      contato.whatsapp ? (
        <WaLink href={wa} label="contato-info" className="tnum link-underline">
          {contato.phoneDisplay || contato.whatsapp}
        </WaLink>
      ) : (
        <Tbd show={show}>WhatsApp</Tbd>
      ),
    ],
    [
      "E-mail",
      contato.email ? (
        <a href={`mailto:${contato.email}`} className="link-underline break-all">
          {contato.email}
        </a>
      ) : (
        <Tbd show={show}>e-mail profissional</Tbd>
      ),
    ],
    [
      "Endereço",
      contato.showAddress && contato.address ? (
        <span>
          {[contato.address, contato.district].filter(Boolean).join(", ")}
          {contato.zip ? ` · CEP ${contato.zip}` : ""}
        </span>
      ) : (
        <Tbd show={show}>endereço do escritório (ou mantenha oculto)</Tbd>
      ),
    ],
    ["Cidade", cityLine || <Tbd show={show}>cidade e estado</Tbd>],
    ["Horário", contato.hours || <Tbd show={show}>horário de atendimento</Tbd>],
  ];

  return (
    <>
      <PageHero kicker="Contato" title="Vamos conversar sobre a *sua empresa.*" text="Uma primeira conversa para entender o seu caso. Escolha o canal que preferir.">
        <WaLink href={wa} label="contato-hero" className="btn btn-primary">
          Solicitar proposta pelo WhatsApp
        </WaLink>
      </PageHero>

      <section className="theme-papel section" aria-labelledby="formulario">
        <div className="container-site grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <h2 id="formulario" className="display display-md">
              Envie uma <em>mensagem.</em>
            </h2>
            <p className="mt-4 muted">Preencha o formulário e retornaremos pelo contato informado.</p>
            <LeadForm form="contato" variant="contato" services={services.map((s) => ({ slug: s.slug, title: s.title }))} className="mt-10" />
          </div>
          <aside className="lg:col-span-4 lg:col-start-9">
            <div className="theme-tinta rounded-2xl p-7 sm:p-8">
              <p className="label muted">Informações</p>
              <dl className="mt-6">
                {rows.map(([k, v]) => (
                  <div key={k} className="border-b hairline py-4 first:pt-0">
                    <dt className="label muted">{k}</dt>
                    <dd className="mt-1.5">{v}</dd>
                  </div>
                ))}
              </dl>
              {socials.length > 0 && (
                <ul className="mt-6 flex gap-3" aria-label="Redes sociais">
                  {socials.map((s) => (
                    <li key={s.name}>
                      <a
                        href={s.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={s.label}
                        className="flex size-10 items-center justify-center rounded-full border hairline hover:border-current"
                      >
                        <BrandIcon name={s.name} className="size-4" />
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </section>

      {mapOk && (
        <section className="theme-tinta" aria-label="Mapa">
          <iframe
            src={contato.mapsEmbedUrl}
            title={`Mapa: ${site.geral.siteName}`}
            className="h-[420px] w-full grayscale"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </section>
      )}
      <JsonLd data={breadcrumbJsonLd([{ name: "Início", path: "/" }, { name: "Contato", path: "/contato" }])} />
    </>
  );
}
