import Link from "next/link";
import { Signature } from "@/components/site/brand";
import { Footer } from "@/components/site/footer";
import { Tracking } from "@/components/site/tracking";
import { WhatsappFloat } from "@/components/site/whatsapp-float";
import { listLandings } from "@/lib/repo";
import { getSite, signatureLine } from "@/lib/site";

/** Layout enxuto para campanhas: sem menu de navegação, foco na conversão. */
export default async function LandingLayout({ children }: { children: React.ReactNode }) {
  const [site, landings] = await Promise.all([getSite(), listLandings()]);
  return (
    <>
      <header className="theme-tinta border-b hairline">
        <div className="container-site flex h-20 items-center justify-between">
          <Link href="/" aria-label="Bruno Freitas Contabilidade — site completo">
            <Signature line={signatureLine(site)} />
          </Link>
        </div>
      </header>
      <main id="conteudo">{children}</main>
      <Footer site={site} services={[]} minimal />
      <WhatsappFloat
        map={{
          number: site.contato.whatsapp,
          label: site.wa.floatLabel,
          fallback: site.wa.home,
          byPath: {},
          services: {},
          landings: Object.fromEntries(landings.map((l) => [l.slug, l.whatsappMessage])),
        }}
      />
      <Tracking ga4Id={site.tracking.ga4Id} metaPixelId={site.tracking.metaPixelId} />
    </>
  );
}
