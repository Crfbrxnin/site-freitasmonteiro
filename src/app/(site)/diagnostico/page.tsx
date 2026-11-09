import { Check } from "@flux-icons/react";
import { getGroup, listServices } from "@/lib/repo";
import { getSite, waLink } from "@/lib/site";
import { buildMeta } from "@/lib/seo";
import { ROMAN, pad2 } from "@/lib/utils";
import { Photo } from "@/components/site/blocks";
import { LeadForm } from "@/components/site/lead-form";
import { WaLink } from "@/components/site/wa-link";
import { FaqList, faqJsonLd } from "@/components/site/faq";
import { JsonLd } from "@/components/site/json-ld";
import { SectionHead } from "@/components/site/section-head";

export const revalidate = 300;

export async function generateMetadata() {
  const seo = await getGroup<Record<string, string>>("seo");
  return buildMeta({ title: seo.diagnosticoTitle, description: seo.diagnosticoDescription, path: "/diagnostico" });
}

const CHECK = [
  "Situação cadastral e fiscal da empresa",
  "Regime tributário em relação à atividade e ao faturamento",
  "Rotina de documentos e obrigações em dia",
  "Organização da folha e do pró-labore",
  "Relatórios disponíveis para tomada de decisão",
];

const SIGNS = [
  { title: "Você não sabe quanto a empresa realmente lucra", text: "As guias chegam, mas os números não são explicados." },
  { title: "Prazos e pendências causam insegurança", text: "Não há clareza sobre o que vence e o que está em atraso." },
  { title: "A empresa cresceu e a contabilidade não acompanhou", text: "O enquadramento e a rotina foram definidos para outro momento." },
];

const FAQS = [
  { q: "O diagnóstico tem custo?", a: "As condições da análise inicial são informadas no primeiro contato, antes de qualquer compromisso." },
  { q: "Que informações vou precisar enviar?", a: "Inicialmente, dados básicos da empresa. Se a análise avançar, indicamos os documentos necessários." },
  { q: "Sou obrigado a contratar depois?", a: "Não. A análise inicial serve para você entender a situação da empresa e as alternativas disponíveis." },
];

export default async function DiagnosticoPage() {
  const [site, services] = await Promise.all([getSite(), listServices()]);
  const wa = waLink(site, site.wa.diagnostico);
  return (
    <>
      <section className="theme-tinta relative overflow-hidden">
        <Photo src="/images/travessia-vertical.jpg" alt="" priority sizes="40vw" className="absolute inset-y-0 right-0 hidden w-[36%] lg:block" />
        <div className="container-site relative grid gap-12 py-16 sm:py-24 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="label muted">Diagnóstico contábil inicial</p>
            <h1 className="display display-lg mt-6 rise">
              Descubra como organizar melhor a <em>contabilidade da sua empresa.</em>
            </h1>
            <span className="fio mt-10 w-24" />
            <p className="lead-text mt-6 max-w-xl">
              Solicite uma análise inicial. Olhamos a situação atual da empresa e indicamos pontos de organização e melhoria.
            </p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <a href="#solicitar" className="btn btn-primary">
                Solicitar análise inicial
              </a>
              <WaLink href={wa} label="diagnostico-hero" className="btn btn-ghost">
                Falar no WhatsApp
              </WaLink>
            </div>
          </div>
        </div>
      </section>

      <section className="theme-papel section">
        <div className="container-site grid gap-16 lg:grid-cols-2">
          <div>
            <SectionHead label="Sinais" />
            <h2 className="display display-md mt-8">
              Faz sentido para você <em>se…</em>
            </h2>
            <ul className="mt-8">
              {SIGNS.map((s, i) => (
                <li key={i} className="flex gap-5 border-t hairline py-6">
                  <span className="roman w-8 shrink-0">{ROMAN[i]}</span>
                  <div>
                    <p className="text-lg font-medium">{s.title}</p>
                    <p className="mt-1 muted">{s.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHead label="O que olhamos" />
            <h2 className="display display-md mt-8">
              Pontos da <em>análise.</em>
            </h2>
            <ul className="mt-8">
              {CHECK.map((c, i) => (
                <li key={i} className="flex items-baseline justify-between gap-4 border-b hairline py-4">
                  <span className="flex items-baseline gap-3">
                    <Check className="size-4 shrink-0 translate-y-0.5 accent" aria-hidden /> {c}
                  </span>
                  <span className="label tnum muted">{pad2(i + 1)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-sm muted">O escopo da análise pode variar conforme o porte e a situação da empresa.</p>
          </div>
        </div>
      </section>

      <section id="solicitar" className="theme-vinho section" aria-labelledby="solicitar-titulo">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <h2 id="solicitar-titulo" className="display display-md">
              Solicitar <em>análise inicial.</em>
            </h2>
            <p className="lead-text mt-6">Retornamos para entender o caso e combinar os próximos passos.</p>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <LeadForm
              form="diagnostico"
              variant="orcamento"
              services={services.map((s) => ({ slug: s.slug, title: s.title }))}
              submitLabel="Solicitar análise inicial"
            />
          </div>
        </div>
      </section>

      <section className="theme-tinta section">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <h2 className="display display-md lg:col-span-4">
            Perguntas <em>frequentes.</em>
          </h2>
          <div className="lg:col-span-8">
            <FaqList items={FAQS} />
          </div>
        </div>
        <JsonLd data={faqJsonLd(FAQS)} />
      </section>
    </>
  );
}
