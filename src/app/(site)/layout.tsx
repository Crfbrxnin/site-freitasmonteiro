import { Header, type NavItem } from "@/components/site/header";
import { Footer, socialLinks } from "@/components/site/footer";
import { WhatsappFloat } from "@/components/site/whatsapp-float";
import { Tracking } from "@/components/site/tracking";
import { JsonLd } from "@/components/site/json-ld";
import { getSite, signatureLine, waLink } from "@/lib/site";
import { listLandings, listServices } from "@/lib/repo";
import { organizationJsonLd } from "@/lib/seo";

const NAV: NavItem[] = [
  { href: "/", label: "Início" },
  { href: "/sobre", label: "Sobre nós" },
  { href: "/servicos", label: "Serviços" },
  { href: "/blog", label: "Blog" },
  { href: "/contato", label: "Contato" },
];

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const [site, services, landings] = await Promise.all([getSite(), listServices(), listLandings()]);
  const socials = socialLinks(site);
  return (
    <>
      <Header
        nav={NAV}
        waHref={waLink(site, site.wa.home)}
        signatureLine={signatureLine(site)}
        socials={site.redes.showInHeader ? socials : []}
      />
      <main id="conteudo">{children}</main>
      <Footer site={site} services={services} />
      <WhatsappFloat
        map={{
          number: site.contato.whatsapp,
          label: site.wa.floatLabel,
          fallback: site.wa.home,
          byPath: {
            home: site.wa.home,
            sobre: site.wa.sobre,
            servicos: site.wa.servicos,
            contato: site.wa.contato,
            orcamento: site.wa.orcamento,
            diagnostico: site.wa.diagnostico,
            blog: site.wa.blog,
          },
          services: Object.fromEntries(services.map((s) => [s.slug, s.whatsappMessage])),
          landings: Object.fromEntries(landings.map((l) => [l.slug, l.whatsappMessage])),
        }}
      />
      <Tracking ga4Id={site.tracking.ga4Id} metaPixelId={site.tracking.metaPixelId} />
      <JsonLd data={organizationJsonLd(site)} />
    </>
  );
}
