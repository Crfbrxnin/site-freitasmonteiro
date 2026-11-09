"use client";

/* Utilitários do navegador: consentimento, UTM e eventos de conversão. Nada aqui contém segredos. */

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export const CONSENT_KEY = "bf_consent";
export type Consent = "granted" | "denied" | null;

export function readConsent(): Consent {
  try {
    const v = localStorage.getItem(CONSENT_KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(v: "granted" | "denied") {
  try {
    localStorage.setItem(CONSENT_KEY, v);
  } catch {
    /* navegação privada */
  }
  document.cookie = `${CONSENT_KEY}=${v}; Max-Age=${60 * 60 * 24 * 180}; Path=/; SameSite=Lax`;
  window.dispatchEvent(new CustomEvent("bf:consent", { detail: v }));
}

const UTM_KEY = "bf_attribution";
const UTM_FIELDS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"] as const;
export type Attribution = Partial<Record<(typeof UTM_FIELDS)[number] | "landing" | "referrer", string>>;

/** Primeiro toque da sessão: guarda UTMs, página de entrada e referência (sessionStorage, sem identificadores). */
export function captureAttribution() {
  try {
    const url = new URL(window.location.href);
    const fromUrl: Attribution = {};
    for (const k of UTM_FIELDS) {
      const v = url.searchParams.get(k);
      if (v) fromUrl[k] = v.slice(0, 120);
    }
    const existing = sessionStorage.getItem(UTM_KEY);
    if (existing && !fromUrl.utm_source) return;
    const ref = document.referrer && !document.referrer.startsWith(window.location.origin) ? document.referrer : "";
    const data: Attribution = { ...fromUrl, landing: url.pathname, referrer: ref.slice(0, 200) };
    if (!fromUrl.utm_source && ref) {
      try {
        data.utm_source = new URL(ref).hostname.replace(/^www\./, "");
        data.utm_medium = "referral";
      } catch {
        /* ignore */
      }
    }
    sessionStorage.setItem(UTM_KEY, JSON.stringify(data));
  } catch {
    /* ignore */
  }
}

export function readAttribution(): Attribution {
  try {
    return JSON.parse(sessionStorage.getItem(UTM_KEY) || "{}");
  } catch {
    return {};
  }
}

/** Envia um evento de conversão: métrica própria (sem dados pessoais) + GA4/Meta quando autorizados e configurados. */
export function track(event: "whatsapp_click" | "generate_lead", params: { label?: string; form?: string } = {}) {
  const path = window.location.pathname;
  try {
    const body = JSON.stringify({ type: event, path, label: params.label || params.form || "" , source: readAttribution().utm_source || "" });
    if (event === "whatsapp_click") {
      if (navigator.sendBeacon) navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
      else fetch("/api/events", { method: "POST", body, headers: { "content-type": "application/json" }, keepalive: true });
    }
  } catch {
    /* ignore */
  }
  if (readConsent() !== "granted") return;
  window.gtag?.("event", event, { page_path: path, ...params });
  if (event === "generate_lead") window.fbq?.("track", "Lead");
  if (event === "whatsapp_click") window.fbq?.("track", "Contact");
}
