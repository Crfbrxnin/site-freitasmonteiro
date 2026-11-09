import Image from "next/image";
import { getGroup } from "@/lib/repo";
import { getSite, signatureLine, waLink } from "@/lib/site";
import { buildMeta, breadcrumbJsonLd } from "@/lib/seo";
import { ROMAN } from "@/lib/utils";
import type { Step } from "@/lib/types";
import { Emph } from "@/components/site/emph";
import { Markdown } from "@/components/site/markdown";
import { SectionHead } from "@/components/site/section-head";
import { FinalCta, PageHero, Photo } from "@/components/site/blocks";
import { Tbd } from "@/components/site/tbd";
import { Monogram } from "@/components/site/brand";
import { JsonLd } from "@/components/site/json-ld";
import { WaLink } from "@/components/site/wa-link";

export const revalidate = 300;

type Sobre = {
  title: string;
  intro: string;
  positioningTitle: string;
  positioningText: string;
  principles: Step[];
  history: string;
  bioName: string;
  bioRole: string;
  bio: string;
  photo: string;
  photoAlt: string;
  mission: string;
  vision: string;
  values: Step[];
  philosophy: string;
  team: { name: string; role: string; qualification: string; photo: string }[];
};

export async function generateMetadata() {
  const seo = await getGroup<Record<string, string>>("seo");
  return buildMeta({ title: seo.sobreTitle, description: seo.sobreDescription, path: "/sobre" });
}

export default async function SobrePage() {
  const [site, s] = await Promise.all([getSite(), getGroup<Sobre>("sobre")]);
  const show = site.geral.showPlaceholders;
  const wa = waLink(site, site.wa.sobre);

  return (
    <>
      <PageHero kicker="Sobre nós" title={s.title} text={s.intro}>
        <WaLink href={wa} label="sobre-hero" className="btn btn-primary">
          Conversar com Bruno Freitas
        </WaLink>
      </PageHero>

      {/* Posicionamento e princípios (Manual da Marca) */}
      <section className="theme-vinho section" aria-labelledby="posicionamento">
        <div className="container-site grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <p className="label muted">Posicionamento</p>
            <h2 id="posicionamento" className="display display-lg mt-6">
              <Emph text={s.positioningTitle} />
            </h2>
            <p className="lead-text mt-8 max-w-lg">{s.positioningText}</p>
          </div>
          <div className="lg:col-span-5 lg:col-start-8 lg:pt-24">
            <p className="label muted">Princípios</p>
            <ul className="mt-5">
              {s.principles.map((p, i) => (
                <li key={i} className="grid grid-cols-[3rem_1fr] gap-3 border-t hairline py-5">
                  <span className="roman">{ROMAN[i]}</span>
                  <p className="leading-relaxed">
                    <strong className="font-medium">{p.title}.</strong> <span className="muted">{p.text}</span>
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Bruno Freitas */}
      <section className="theme-tinta section" aria-labelledby="bruno">
        <div className="container-site">
          <SectionHead label="Quem atende" index={1} total={3} />
          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:items-start">
            <div className="lg:col-span-5">
              <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border hairline">
                {s.photo ? (
                  <Photo src={s.photo} alt={s.photoAlt || s.bioName} className="absolute inset-0" />
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-[var(--surface)] p-8 text-center">
                    <Monogram title="" className="h-28 w-auto opacity-30" />
                    <Tbd show={show}>foto profissional de Bruno Freitas</Tbd>
                  </div>
                )}
              </div>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <h2 id="bruno" className="display display-lg">
                Prazer, <em>{s.bioName.split(" ")[0]}.</em>
              </h2>
              <p className="label mt-5 muted">{[s.bioName, s.bioRole].filter(Boolean).join(" · ")}</p>
              <span className="fio mt-8 w-20" />
              <div className="mt-8">
                {s.bio ? <Markdown>{s.bio}</Markdown> : <Tbd show={show}>apresentação de Bruno Freitas (formação e trajetória verificadas)</Tbd>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* História, missão, visão, valores */}
      <section className="theme-papel section" aria-labelledby="historia">
        <div className="container-site">
          <SectionHead label="O escritório" index={2} total={3} />
          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="historia" className="display display-md">
                Nossa <em>história.</em>
              </h2>
            </div>
            <div className="lg:col-span-7">
              {s.history ? <Markdown>{s.history}</Markdown> : <Tbd show={show}>história do escritório</Tbd>}
            </div>
          </div>

          <dl className="mt-20 grid gap-px overflow-hidden rounded-2xl border hairline bg-[var(--line)] md:grid-cols-2">
            {[
              ["Missão", s.mission],
              ["Visão", s.vision],
            ].map(([k, v]) => (
              <div key={k} className="bg-[var(--bg)] p-8 sm:p-10">
                <dt className="label muted">{k}</dt>
                <dd className="display display-sm mt-5">{v || <Tbd show={show}>{k.toLowerCase()}</Tbd>}</dd>
              </div>
            ))}
          </dl>

          {(s.values.length > 0 || show) && (
            <div className="mt-20">
              <h3 className="display display-md">
                Nossos <em>valores.</em>
              </h3>
              {s.values.length > 0 ? (
                <ul className="mt-10 grid gap-x-10 md:grid-cols-2 lg:grid-cols-3">
                  {s.values.map((v, i) => (
                    <li key={i} className="flex gap-5 border-t hairline py-6">
                      <span className="roman w-8 shrink-0">{ROMAN[i]}</span>
                      <div>
                        <p className="text-lg font-medium">{v.title}</p>
                        <p className="mt-2 leading-relaxed muted">{v.text}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-8">
                  <Tbd show={show}>valores do escritório</Tbd>
                </p>
              )}
            </div>
          )}
        </div>
      </section>

      {/* Filosofia + equipe */}
      <section className="theme-tinta section relative overflow-hidden" aria-labelledby="filosofia">
        <div className="container-site">
          <SectionHead label="Atendimento" index={3} total={3} />
          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="filosofia" className="display display-md">
                Filosofia de <em>atendimento.</em>
              </h2>
              <Photo src="/images/edificio.jpg" alt="Fachada de edifício comercial" className="mt-10 hidden aspect-[4/5] max-w-sm rounded-2xl lg:block" />
            </div>
            <div className="lg:col-span-7">
              <Markdown>{s.philosophy}</Markdown>

              {(s.team.length > 0 || show) && (
                <div className="mt-16">
                  <h3 className="label muted">Equipe</h3>
                  {s.team.length > 0 ? (
                    <ul className="mt-6 grid gap-6 sm:grid-cols-2">
                      {s.team.map((m, i) => (
                        <li key={i} className="flex items-center gap-4 border-t hairline pt-5">
                          {m.photo && (
                            <Image src={m.photo} alt={m.name} width={64} height={64} className="size-16 rounded-full object-cover grayscale" />
                          )}
                          <div>
                            <p className="font-medium">{m.name}</p>
                            <p className="text-sm muted">{[m.role, m.qualification].filter(Boolean).join(" · ")}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-6">
                      <Tbd show={show}>equipe e qualificações verificadas</Tbd>
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <FinalCta
        title="Quer entender os *seus números?*"
        text="Uma primeira conversa para entender o seu caso, sem compromisso de contratação."
        cta="Falar no WhatsApp"
        waHref={wa}
        label="cta-final-sobre"
        signatureLine={signatureLine(site)}
        secondary={{ href: "/servicos", label: "Ver serviços" }}
      />
      <JsonLd data={breadcrumbJsonLd([{ name: "Início", path: "/" }, { name: "Sobre nós", path: "/sobre" }])} />
    </>
  );
}
