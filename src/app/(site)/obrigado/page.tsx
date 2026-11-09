import Link from "next/link";
import type { Metadata } from "next";
import { getSite, waLink } from "@/lib/site";
import { Monogram } from "@/components/site/brand";
import { WaLink } from "@/components/site/wa-link";

export const metadata: Metadata = { title: "Mensagem recebida", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function ObrigadoPage() {
  const site = await getSite();
  return (
    <section className="theme-tinta relative overflow-hidden">
      <Monogram title="" className="pointer-events-none absolute -right-20 top-0 h-[120%] w-auto text-papel opacity-[0.05]" />
      <div className="container-site relative flex min-h-[70svh] flex-col justify-center py-24">
        <p className="label muted">Mensagem recebida</p>
        <h1 className="display display-lg mt-6 max-w-3xl">
          Obrigado pelo contato. <em>Já recebemos seus dados.</em>
        </h1>
        <span className="fio mt-10 w-24" />
        <p className="lead-text mt-6 max-w-xl">
          Vamos analisar as informações e retornar pelo telefone ou e-mail informado. Se preferir, adiante a conversa pelo WhatsApp.
        </p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <WaLink href={waLink(site, site.wa.contato)} label="obrigado" className="btn btn-primary">
            Falar no WhatsApp
          </WaLink>
          <Link href="/blog" className="btn btn-ghost">
            Ler artigos do blog
          </Link>
        </div>
      </div>
    </section>
  );
}
