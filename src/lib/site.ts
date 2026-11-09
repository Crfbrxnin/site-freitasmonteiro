import "server-only";
import { cache } from "react";
import { getGroup } from "./repo";
import { whatsappHref } from "./utils";

export type Geral = {
  siteName: string;
  tagline: string;
  legalName: string;
  cnpj: string;
  professional: string;
  crc: string;
  officeCrc: string;
  ogImage: string;
  showPlaceholders: boolean;
};

export type Contato = {
  whatsapp: string;
  phoneDisplay: string;
  email: string;
  address: string;
  district: string;
  city: string;
  state: string;
  zip: string;
  hours: string;
  serviceArea: string;
  showAddress: boolean;
  mapsEmbedUrl: string;
};

export type Redes = { instagram: string; facebook: string; linkedin: string; youtube: string; tiktok: string; showInHeader: boolean };
export type WaMessages = Record<"home" | "sobre" | "servicos" | "contato" | "orcamento" | "diagnostico" | "blog" | "floatLabel", string>;

export type PublicSite = {
  geral: Geral;
  contato: Contato;
  redes: Redes;
  wa: WaMessages;
  /** Somente o necessário para os scripts do navegador (sem segredos). */
  tracking: { ga4Id: string; metaPixelId: string; gscVerification: string };
};

/** Dados públicos do site, lidos uma vez por requisição. Nunca inclui webhooks, segredos ou e-mail de destino dos leads. */
export const getSite = cache(async (): Promise<PublicSite> => {
  const [geral, contato, redes, wa, integ] = await Promise.all([
    getGroup<Geral>("geral"),
    getGroup<Contato>("contato"),
    getGroup<Redes>("redes"),
    getGroup<WaMessages>("whatsapp"),
    getGroup<Record<string, string>>("integracoes"),
  ]);
  return {
    geral,
    contato,
    redes,
    wa,
    tracking: {
      ga4Id: /^G-[A-Z0-9]+$/i.test(integ.ga4Id || "") ? integ.ga4Id : "",
      metaPixelId: /^\d{6,20}$/.test(integ.metaPixelId || "") ? integ.metaPixelId : "",
      gscVerification: (integ.gscVerification || "").replace(/[^A-Za-z0-9_\-]/g, ""),
    },
  };
});

/** Link do WhatsApp com a mensagem da origem; sem número configurado, cai para a página de contato. */
export function waLink(site: PublicSite, message: string) {
  return whatsappHref(site.contato.whatsapp, message) || "/contato";
}

export function signatureLine(site: PublicSite) {
  return [site.geral.professional, site.geral.crc].filter(Boolean).join(" · ");
}
