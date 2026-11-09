import Link from "next/link";
import { Monogram, Signature } from "./brand";
import { BrandIcon } from "./icons";
import { WaLink } from "./wa-link";
import { Tbd } from "./tbd";
import { ConsentLink } from "./tracking";
import type { BrandName } from "./brand-paths";
import { signatureLine, waLink, type PublicSite } from "@/lib/site";
import type { Service } from "@/lib/types";

export function socialLinks(site: PublicSite): { name: BrandName; href: string; label: string }[] {
  const r = site.redes;
  const list: { name: BrandName; href: string; label: string }[] = [
    { name: "instagram", href: r.instagram, label: "Instagram" },
    { name: "facebook", href: r.facebook, label: "Facebook" },
    { name: "linkedin", href: r.linkedin, label: "LinkedIn" },
    { name: "youtube", href: r.youtube, label: "YouTube" },
    { name: "tiktok", href: r.tiktok, label: "TikTok" },
  ];
  return list.filter((s) => /^https:\/\//.test(s.href));
}

export function Footer({ site, services, minimal = false }: { site: PublicSite; services: Service[]; minimal?: boolean }) {
  const { geral, contato } = site;
  const show = geral.showPlaceholders;
  const socials = socialLinks(site);
  const wa = waLink(site, site.wa.home);
  const year = new Date().getFullYear();
  const cityLine = [contato.city, contato.state].filter(Boolean).join(" · ");
  const address = contato.showAddress ? [contato.address, contato.district, cityLine, contato.zip].filter(Boolean).join(", ") : "";

  return (
    <footer className="theme-tinta relative overflow-hidden border-t hairline">
      <Monogram
        title=""
        className="pointer-events-none absolute -right-16 -bottom-24 h-[30rem] w-auto text-papel opacity-[0.045] sm:h-[38rem]"
      />
      <div className="container-site relative py-16 sm:py-20">
        {!minimal && (
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="label muted">{geral.siteName}</p>
              <p className="display display-md mt-5 max-w-md">
                <em>{geral.tagline}</em>
              </p>
              <WaLink href={wa} label="rodape" className="btn btn-primary mt-8">
                Falar no WhatsApp
              </WaLink>
            </div>

            <nav aria-label="Rodapé" className="lg:col-span-2">
              <p className="label muted">Navegação</p>
              <ul className="mt-5 space-y-3">
                {[
                  ["/", "Início"],
                  ["/sobre", "Sobre nós"],
                  ["/servicos", "Serviços"],
                  ["/blog", "Blog"],
                  ["/contato", "Contato"],
                  ["/orcamento", "Solicitar orçamento"],
                  ["/politica-de-privacidade", "Política de Privacidade"],
                ].map(([href, label]) => (
                  <li key={href}>
                    <Link href={href} className="hover:text-rose">
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="lg:col-span-2">
              <p className="label muted">Serviços</p>
              <ul className="mt-5 space-y-3">
                {services.map((s) => (
                  <li key={s.slug}>
                    <Link href={`/servicos/${s.slug}`} className="hover:text-rose">
                      {s.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:col-span-3">
              <p className="label muted">Contato</p>
              <ul className="mt-5 space-y-3">
                <li>
                  {contato.whatsapp ? (
                    <WaLink href={wa} label="rodape-telefone" className="tnum hover:text-rose">
                      WhatsApp {contato.phoneDisplay || contato.whatsapp}
                    </WaLink>
                  ) : (
                    <Tbd show={show}>WhatsApp</Tbd>
                  )}
                </li>
                <li>
                  {contato.email ? (
                    <a href={`mailto:${contato.email}`} className="hover:text-rose break-all">
                      {contato.email}
                    </a>
                  ) : (
                    <Tbd show={show}>e-mail profissional</Tbd>
                  )}
                </li>
                <li className="muted">{address || cityLine || <Tbd show={show}>endereço</Tbd>}</li>
                {contato.hours ? <li className="muted">{contato.hours}</li> : <li><Tbd show={show}>horário de atendimento</Tbd></li>}
              </ul>
              {socials.length > 0 && (
                <ul className="mt-6 flex gap-4" aria-label="Redes sociais">
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
          </div>
        )}

        <div className={minimal ? "" : "mt-16 border-t hairline pt-8"}>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <Signature line={signatureLine(site)} />
            <div className="space-y-1 text-xs muted sm:text-right">
              <p>
                © {year} {geral.legalName || geral.siteName}
                {geral.cnpj ? ` · CNPJ ${geral.cnpj}` : ""}
                {geral.officeCrc ? ` · ${geral.officeCrc}` : ""}
              </p>
              {show && !geral.legalName && <Tbd show>razão social e CNPJ</Tbd>}
              <p className="flex flex-wrap gap-x-4 sm:justify-end">
                <Link href="/politica-de-privacidade" className="hover:text-papel">
                  Política de Privacidade
                </Link>
                {(site.tracking.ga4Id || site.tracking.metaPixelId) && <ConsentLink className="hover:text-papel" />}
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
