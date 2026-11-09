import Link from "next/link";
import { ArrowRight } from "@flux-icons/react";
import { getGroup, listPublicTestimonials, listPublishedPosts, listServices } from "@/lib/repo";
import { getSite, signatureLine, waLink } from "@/lib/site";
import { buildMeta } from "@/lib/seo";
import { ROMAN } from "@/lib/utils";
import type { Benefit, Step } from "@/lib/types";
import { Monogram } from "@/components/site/brand";
import { Emph } from "@/components/site/emph";
import { SectionHead } from "@/components/site/section-head";
import { FinalCta, Photo, PostCard, ServiceGrid, Steps } from "@/components/site/blocks";
import { WaLink } from "@/components/site/wa-link";
import { ServiceIcon } from "@/components/site/icons";

export const revalidate = 300;

type Home = {
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  heroImage: string;
  heroImageAlt: string;
  benefitsTitle: string;
  benefitsIntro: string;
  benefits: Benefit[];
  servicesTitle: string;
  servicesIntro: string;
  whyTitle: string;
  whyIntro: string;
  whyItems: Step[];
  stepsTitle: string;
  steps: Step[];
  stepsCta: string;
  testimonialsTitle: string;
  blogTitle: string;
  finalTitle: string;
  finalText: string;
  finalCta: string;
};

export async function generateMetadata() {
  const seo = await getGroup<Record<string, string>>("seo");
  return buildMeta({ title: seo.homeTitle, description: seo.homeDescription, path: "/" });
}

export default async function HomePage() {
  const [site, home, services, testimonials, { posts }] = await Promise.all([
    getSite(),
    getGroup<Home>("home"),
    listServices(),
    listPublicTestimonials(),
    listPublishedPosts({ perPage: 3 }),
  ]);
  const wa = waLink(site, site.wa.home);
  const city = site.contato.city;
  const showTestimonials = testimonials.length > 0 || site.geral.showPlaceholders;
  const total = 5 + (showTestimonials ? 1 : 0) + (posts.length ? 1 : 0);
  let idx = 0;

  return (
    <>
      {/* ───────── Hero ───────── */}
      <section className="theme-tinta relative isolate overflow-hidden">
        <Monogram
          title=""
          className="pointer-events-none absolute -right-[18%] -top-[6%] -z-10 h-[125%] w-auto text-papel opacity-[0.06] sm:-right-[8%] lg:right-[30%] lg:h-[130%] lg:opacity-[0.07]"
        />
        <div className="container-site grid min-h-[calc(100svh-5rem)] items-center gap-12 py-14 lg:grid-cols-12 lg:py-10">
          <div className="lg:col-span-7">
            <p className="label muted rise">Contabilidade e gestão financeira{city ? ` · ${city}` : ""}</p>
            <h1 className="display display-xl mt-7 rise rise-1">
              <Emph text={home.heroTitle} />
            </h1>
            <span className="fio mt-10 w-28 rise rise-2" />
            <p className="lead-text mt-7 max-w-xl rise rise-2">{home.heroSubtitle}</p>
            <div className="mt-10 flex flex-col gap-3 sm:flex-row rise rise-3">
              <WaLink href={wa} label="hero" className="btn btn-primary">
                {home.heroPrimaryCta}
              </WaLink>
              <Link href="#servicos" className="btn btn-ghost">
                {home.heroSecondaryCta}
              </Link>
            </div>
          </div>

          <div className="relative lg:col-span-5 rise rise-2">
            <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:aspect-[3/4.4] lg:max-w-none">
              {home.heroImage ? (
                <Photo src={home.heroImage} alt={home.heroImageAlt || ""} priority className="absolute inset-0 rounded-[1.25rem]" />
              ) : (
                <Photo
                  src="/images/calculadora-vertical.jpg"
                  alt="Calculadora e óculos sobre um caderno de anotações"
                  priority
                  className="photo-fade-x absolute inset-0 rounded-[1.25rem]"
                />
              )}
              {/* Livro-caixa: recurso gráfico próprio da marca (sem valores fictícios). */}
              <div className="theme-papel absolute z-10 -bottom-6 left-4 right-4 rounded-2xl p-5 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.6)] sm:left-auto sm:right-[-1rem] sm:w-72 lg:-left-16 lg:right-auto">
                <div className="flex items-center justify-between label">
                  <span>Livro-caixa</span>
                  <span className="muted tnum">01 · 3/3</span>
                </div>
                <dl className="mt-4 text-[0.95rem]">
                  {["Entrou", "Saiu", "Sobrou"].map((k, i) => (
                    <div key={k} className={`flex items-baseline justify-between border-b hairline py-2.5 ${i === 2 ? "font-medium" : ""}`}>
                      <dt>{k}</dt>
                      <dd className="tnum">R$ ———</dd>
                    </div>
                  ))}
                </dl>
                <p className="display mt-4 text-2xl leading-none">
                  Números claros <em>para decidir.</em>
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ───────── Benefícios ───────── */}
      <section className="theme-papel section" aria-labelledby="beneficios">
        <div className="container-site">
          <SectionHead label="Benefícios" index={++idx} total={total} />
          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="beneficios" className="display display-md">
                <Emph text={home.benefitsTitle} />
              </h2>
              <p className="lead-text mt-6 max-w-md">{home.benefitsIntro}</p>
            </div>
            <ul className="grid gap-x-10 lg:col-span-7 md:grid-cols-2">
              {home.benefits.map((b, i) => (
                <li key={i} className="flex gap-5 border-t hairline py-6">
                  <span className="roman w-8 shrink-0">{ROMAN[i]}</span>
                  <div>
                    <h3 className="flex items-center gap-2 text-lg font-medium leading-snug">
                      {b.title}
                    </h3>
                    <p className="mt-2 leading-relaxed muted">{b.text}</p>
                  </div>
                  {b.icon && <ServiceIcon name={b.icon} className="ml-auto size-5 shrink-0 opacity-40" />}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ───────── Serviços ───────── */}
      <section id="servicos" className="theme-tinta section" aria-labelledby="servicos-titulo">
        <div className="container-site">
          <SectionHead label="Serviços" index={++idx} total={total} />
          <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 id="servicos-titulo" className="display display-lg">
                <Emph text={home.servicesTitle} />
              </h2>
              <p className="lead-text mt-5 max-w-xl">{home.servicesIntro}</p>
            </div>
            <Link href="/servicos" className="label inline-flex shrink-0 items-center gap-2 link-underline">
              Ver todos os serviços <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-12">
            <ServiceGrid services={services} />
          </div>
        </div>
      </section>

      {/* ───────── Por que escolher ───────── */}
      <section className="theme-vinho section relative overflow-hidden" aria-labelledby="diferenciais">
        <div className="container-site">
          <SectionHead label="Diferenciais" index={++idx} total={total} />
          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <h2 id="diferenciais" className="display display-md">
                <Emph text={home.whyTitle} />
              </h2>
              <p className="lead-text mt-6 max-w-md">{home.whyIntro}</p>
              <Photo
                src="/images/travessia.jpg"
                alt="Pessoa de terno atravessando uma faixa de pedestres"
                tone="vinho"
                fade={false}
                className="mt-10 hidden aspect-[4/5] max-w-sm rounded-2xl lg:block"
              />
            </div>
            <ol className="lg:col-span-7">
              {home.whyItems.map((w, i) => (
                <li key={i} className="grid grid-cols-[3rem_1fr] gap-4 border-t hairline py-7 sm:grid-cols-[4rem_14rem_1fr] sm:gap-6">
                  <span className="roman">{ROMAN[i]}</span>
                  <h3 className="display text-3xl leading-none">{w.title}</h3>
                  <p className="col-start-2 leading-relaxed muted sm:col-start-3">{w.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      {/* ───────── Como funciona ───────── */}
      <section className="theme-papel section" aria-labelledby="como-funciona">
        <div className="container-site">
          <SectionHead label="Atendimento" index={++idx} total={total} />
          <h2 id="como-funciona" className="display display-lg mt-12 max-w-3xl">
            <Emph text={home.stepsTitle} />
          </h2>
          <Steps steps={home.steps} className="mt-12" />
          <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center">
            <WaLink href={wa} label="como-funciona" className="btn btn-primary">
              {home.stepsCta}
            </WaLink>
            <Link href="/orcamento" className="btn btn-ghost">
              Prefiro preencher um formulário
            </Link>
          </div>
        </div>
      </section>

      {/* ───────── Depoimentos ───────── */}
      {showTestimonials && (
        <section className="theme-tinta section" aria-labelledby="depoimentos">
          <div className="container-site">
            <SectionHead label="Depoimentos" index={++idx} total={total} />
            <h2 id="depoimentos" className="display display-md mt-12">
              <Emph text={home.testimonialsTitle} />
            </h2>
            {testimonials.length > 0 ? (
              <ul className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {testimonials.map((t) => (
                  <li key={t.id} className="flex flex-col rounded-2xl border hairline p-7">
                    <span aria-hidden className="display text-6xl leading-none accent">“</span>
                    <blockquote className="mt-2 flex-1 text-lg leading-relaxed">{t.text}</blockquote>
                    <p className="mt-6 border-t hairline pt-4">
                      <span className="font-medium">{t.name}</span>
                      {t.company && <span className="block text-sm muted">{t.company}</span>}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <>
                <ul className="mt-12 grid gap-6 md:grid-cols-3">
                  {[1, 2, 3].map((n) => (
                    <li key={n} className="rounded-2xl border border-dashed hairline p-7">
                      <span className="tbd">Espaço reservado · depoimento {n}</span>
                      <p className="mt-6 text-lg leading-relaxed muted">
                        Depoimento real de cliente, publicado somente com autorização registrada.
                      </p>
                      <p className="mt-6 border-t hairline pt-4 text-sm muted">Nome do cliente · Empresa</p>
                    </li>
                  ))}
                </ul>
                <p className="mt-6 text-sm muted">
                  Esta seção aparece só no modo de configuração. Cadastre depoimentos autorizados em Painel › Depoimentos.
                </p>
              </>
            )}
          </div>
        </section>
      )}

      {/* ───────── Blog ───────── */}
      {posts.length > 0 && (
        <section className="theme-papel section" aria-labelledby="blog">
          <div className="container-site">
            <SectionHead label="Blog" index={++idx} total={total} />
            <div className="mt-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
              <h2 id="blog" className="display display-md">
                <Emph text={home.blogTitle} />
              </h2>
              <Link href="/blog" className="label inline-flex shrink-0 items-center gap-2 link-underline">
                Ver todos os artigos <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-12 grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p) => (
                <PostCard key={p.id} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}

      <FinalCta
        title={home.finalTitle}
        text={home.finalText}
        cta={home.finalCta}
        waHref={wa}
        label="cta-final-home"
        signatureLine={signatureLine(site)}
        secondary={{ href: "/diagnostico", label: "Solicitar diagnóstico inicial" }}
      />
    </>
  );
}

