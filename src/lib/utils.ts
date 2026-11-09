export function slugify(input: string) {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function formatDate(iso: string, opts: Intl.DateTimeFormatOptions = { day: "2-digit", month: "long", year: "numeric" }) {
  if (!iso) return "";
  return new Intl.DateTimeFormat("pt-BR", { timeZone: "America/Sao_Paulo", ...opts }).format(new Date(iso));
}

export function formatDateTime(iso: string) {
  return formatDate(iso, { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function readingTime(markdown: string) {
  const words = markdown.replace(/[#>*_`\-\[\]()!]/g, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

export function siteUrl(path = "") {
  const fallback = process.env.NODE_ENV === "production" ? "https://freitasmonteiro.com.br" : "http://localhost:3000";
  const base = (process.env.SITE_URL || fallback).replace(/\/+$/, "");
  return `${base}${path}`;
}

/** Remove os marcadores de ênfase (*palavra*) para usar o texto em metatags e títulos simples. */
export function plain(text: string) {
  return text.replace(/\*/g, "");
}

export function whatsappHref(number: string, message: string) {
  const digits = number.replace(/\D/g, "");
  if (!digits) return "";
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

export function cx(...parts: (string | false | null | undefined)[]) {
  return parts.filter(Boolean).join(" ");
}

export const ROMAN = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii", "ix", "x", "xi", "xii"];

export const pad2 = (n: number) => String(n).padStart(2, "0");

export const COMPANY_TYPES = [
  "MEI",
  "Microempresa (ME)",
  "Empresa de Pequeno Porte (EPP)",
  "Empresa de médio ou grande porte",
  "Profissional autônomo / liberal",
  "Ainda não tenho empresa",
  "Organização sem fins lucrativos",
  "Não sei informar",
];

export const COMPANY_SIZES = [
  "Simples Nacional",
  "Lucro Presumido",
  "Lucro Real",
  "MEI (SIMEI)",
  "Não sei informar",
];
