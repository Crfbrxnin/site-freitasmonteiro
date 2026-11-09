import type { Field } from "./settings-schema";
import { ICONS } from "@/components/site/icons";

const iconOptions = Object.entries(ICONS).map(([value, { label }]) => ({ value, label }));

const stepFields: Field[] = [
  { name: "title", label: "Título", type: "text" },
  { name: "text", label: "Texto", type: "textarea" },
];
const faqFields: Field[] = [
  { name: "q", label: "Pergunta", type: "text" },
  { name: "a", label: "Resposta", type: "textarea" },
];

export const SERVICE_FIELDS: Field[] = [
  { name: "title", label: "Nome do serviço", type: "text", required: true },
  { name: "slug", label: "URL amigável", type: "text", help: "Endereço: /servicos/<url>. Use letras minúsculas e hífens. Deixe vazio para gerar a partir do nome." },
  { name: "active", label: "Serviço ativo (visível no site)", type: "boolean" },
  { name: "position", label: "Ordem de exibição", type: "number" },
  { name: "icon", label: "Ícone", type: "icon" },
  { name: "short", label: "Descrição curta (card)", type: "textarea", recommended: 160 },
  { name: "seoTitle", label: "Metatítulo (SEO)", type: "text", recommended: 60 },
  { name: "metaDescription", label: "Metadescrição (SEO)", type: "textarea", recommended: 155 },
  { name: "headline", label: "Título da página (H1)", type: "text", help: "Use *asteriscos* para a palavra em itálico." },
  { name: "subheadline", label: "Subtítulo", type: "textarea" },
  { name: "problem", label: "Problema que o serviço resolve", type: "textarea" },
  { name: "benefits", label: "Benefícios", type: "items", fields: stepFields },
  { name: "included", label: "O que está incluído", type: "list" },
  { name: "audience", label: "Para quem é indicado", type: "list" },
  { name: "steps", label: "Etapas do atendimento", type: "items", fields: stepFields },
  { name: "faqs", label: "Perguntas frequentes", type: "items", fields: faqFields },
  { name: "whatsappMessage", label: "Mensagem automática do WhatsApp", type: "textarea" },
];

export const LANDING_FIELDS: Field[] = [
  { name: "title", label: "Nome interno da landing page", type: "text", required: true },
  { name: "slug", label: "URL amigável", type: "text", help: "Endereço: /lp/<url>. Use nos anúncios com parâmetros UTM." },
  { name: "active", label: "Página ativa", type: "boolean" },
  { name: "noindex", label: "Ocultar do Google (recomendado para páginas de anúncio)", type: "boolean" },
  { name: "seoTitle", label: "Metatítulo", type: "text", recommended: 60 },
  { name: "metaDescription", label: "Metadescrição", type: "textarea", recommended: 155 },
  { name: "kicker", label: "Chamada acima do título", type: "text" },
  { name: "headline", label: "Título (H1)", type: "text", help: "Use *asteriscos* para a palavra em itálico." },
  { name: "subheadline", label: "Subtítulo", type: "textarea" },
  { name: "problem", label: "Cenário / problema", type: "textarea" },
  { name: "benefits", label: "Benefícios", type: "items", fields: stepFields },
  { name: "included", label: "O que está incluído", type: "list" },
  { name: "steps", label: "Como funciona", type: "items", fields: stepFields },
  { name: "faqs", label: "Perguntas frequentes", type: "items", fields: faqFields },
  { name: "ctaLabel", label: "Texto do botão do formulário", type: "text" },
  { name: "serviceSlug", label: "Serviço pré-selecionado no formulário (URL do serviço)", type: "text" },
  { name: "whatsappMessage", label: "Mensagem automática do WhatsApp", type: "textarea" },
];

export function postFields(categories: { id: number; name: string }[], services: { slug: string; title: string }[]): Field[] {
  return [
    { name: "title", label: "Título do artigo (H1)", type: "text", required: true },
    { name: "slug", label: "URL amigável", type: "text", help: "Endereço: /blog/<url>. Deixe vazio para gerar a partir do título." },
    {
      name: "status",
      label: "Situação",
      type: "select",
      options: [
        { value: "draft", label: "Rascunho (não aparece no site)" },
        { value: "published", label: "Publicado / programado" },
      ],
    },
    { name: "publishedAt", label: "Data de publicação", type: "datetime", help: "Com uma data futura, o artigo fica programado e aparece automaticamente." },
    { name: "categoryId", label: "Categoria", type: "select", options: [{ value: "", label: "Sem categoria" }, ...categories.map((c) => ({ value: String(c.id), label: c.name }))] },
    { name: "author", label: "Autor", type: "text" },
    { name: "excerpt", label: "Resumo", type: "textarea", recommended: 200 },
    { name: "coverImage", label: "Imagem de capa", type: "image" },
    { name: "coverAlt", label: "Descrição da imagem de capa (acessibilidade)", type: "text" },
    { name: "content", label: "Conteúdo", type: "markdown", help: "Use ## para subtítulos (H2) e ### para H3. Links internos: [texto](/servicos/...)." },
    {
      name: "serviceSlug",
      label: "Serviço relacionado (link interno e CTA)",
      type: "select",
      options: [{ value: "", label: "Nenhum" }, ...services.map((s) => ({ value: s.slug, label: s.title }))],
    },
    { name: "metaTitle", label: "Metatítulo (SEO)", type: "text", recommended: 60 },
    { name: "metaDescription", label: "Metadescrição (SEO)", type: "textarea", recommended: 155 },
  ];
}

export { iconOptions };
