import { getGroup } from "@/lib/repo";
import { getSite } from "@/lib/site";
import { buildMeta } from "@/lib/seo";
import { PageHero } from "@/components/site/blocks";
import { Markdown } from "@/components/site/markdown";

export const revalidate = 300;

export async function generateMetadata() {
  return buildMeta({
    title: "Política de Privacidade | Bruno Freitas Contabilidade",
    description: "Como tratamos os dados pessoais enviados pelo site, conforme a LGPD.",
    path: "/politica-de-privacidade",
  });
}

export default async function PrivacidadePage() {
  const [site, p] = await Promise.all([getSite(), getGroup<Record<string, string>>("privacidade")]);
  const tbd = (label: string) => `[a definir: ${label}]`;
  const map: Record<string, string> = {
    razao_social: site.geral.legalName || site.geral.siteName,
    cnpj: site.geral.cnpj || tbd("CNPJ"),
    encarregado: p.dpoName || site.geral.siteName,
    email_privacidade: p.dpoEmail || site.contato.email || tbd("e-mail para privacidade"),
    data_atualizacao: p.updatedAt || tbd("data"),
  };
  const content = (p.content || "").replace(/\{\{(\w+)\}\}/g, (_, k: string) => map[k] ?? "");
  return (
    <>
      <PageHero kicker="LGPD" title="Política de *Privacidade.*" />
      <section className="theme-papel section !pt-14">
        <div className="container-site">
          <div className="mx-auto max-w-[44rem]">
            <Markdown>{content}</Markdown>
          </div>
        </div>
      </section>
    </>
  );
}
