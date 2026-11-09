"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { captureAttribution, readConsent, writeConsent, type Consent } from "@/lib/client";

/**
 * Captura de origem (UTM), aviso de cookies e scripts de análise.
 * GA4 e Meta Pixel só carregam depois do consentimento — e só se estiverem configurados no painel.
 */
export function Tracking({ ga4Id, metaPixelId }: { ga4Id: string; metaPixelId: string }) {
  const [consent, setConsent] = useState<Consent>(null);
  const [ready, setReady] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const pathname = usePathname();
  const needsConsent = Boolean(ga4Id || metaPixelId);

  useEffect(() => {
    captureAttribution();
    const c = readConsent();
    setConsent(c);
    setShowBanner(needsConsent && c === null);
    setReady(true);
    const open = () => setShowBanner(true);
    window.addEventListener("bf:open-consent", open);
    return () => window.removeEventListener("bf:open-consent", open);
  }, [needsConsent]);

  useEffect(() => {
    if (consent === "granted" && ga4Id) window.gtag?.("event", "page_view", { page_path: pathname });
    if (consent === "granted" && metaPixelId) window.fbq?.("track", "PageView");
  }, [pathname, consent, ga4Id, metaPixelId]);

  const decide = (v: "granted" | "denied") => {
    writeConsent(v);
    setConsent(v);
    setShowBanner(false);
  };

  return (
    <>
      {ready && consent === "granted" && ga4Id && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4Id}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga4Id}',{send_page_view:false,anonymize_ip:true});gtag('event','page_view',{page_path:location.pathname});`}
          </Script>
        </>
      )}
      {ready && consent === "granted" && metaPixelId && (
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${metaPixelId}');fbq('track','PageView');`}
        </Script>
      )}

      {showBanner && (
        <div
          role="dialog"
          aria-live="polite"
          aria-label="Preferências de cookies"
          className="theme-papel fixed inset-x-3 bottom-3 z-50 rounded-2xl p-5 shadow-2xl ring-1 ring-tinta/10 sm:inset-x-auto sm:left-6 sm:bottom-6 sm:max-w-md"
        >
          <p className="text-[0.95rem] leading-relaxed">
            Usamos cookies de análise e publicidade para medir visitas e melhorar o site, somente com a sua autorização.{" "}
            <Link href="/politica-de-privacidade" className="underline underline-offset-2">
              Política de Privacidade
            </Link>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn btn-primary !min-h-10 !px-4" onClick={() => decide("granted")}>
              Aceitar
            </button>
            <button type="button" className="btn btn-ghost !min-h-10 !px-4" onClick={() => decide("denied")}>
              Somente essenciais
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export function ConsentLink({ className }: { className?: string }) {
  return (
    <button type="button" className={className} onClick={() => window.dispatchEvent(new Event("bf:open-consent"))}>
      Preferências de cookies
    </button>
  );
}
