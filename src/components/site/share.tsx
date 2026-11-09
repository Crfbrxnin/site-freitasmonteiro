"use client";

import { useState } from "react";
import { Link2, Share2 } from "@flux-icons/react";
import { BrandIcon } from "./icons";

export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const links = [
    { name: "whatsapp" as const, label: "Compartilhar no WhatsApp", href: `https://wa.me/?text=${enc(`${title} ${url}`)}` },
    { name: "linkedin" as const, label: "Compartilhar no LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
    { name: "facebook" as const, label: "Compartilhar no Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
  ];
  const nativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        /* cancelado */
      }
    }
  };
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* sem permissão */
    }
  };
  const btn = "flex size-10 items-center justify-center rounded-full border hairline hover:border-current transition-colors";
  return (
    <div className="flex items-center gap-2">
      <span className="label muted mr-2">Compartilhar</span>
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={l.label} className={btn}>
          <BrandIcon name={l.name} className="size-4" />
        </a>
      ))}
      <button type="button" onClick={copy} aria-label="Copiar link" className={btn}>
        <Link2 className="size-4" />
      </button>
      <button type="button" onClick={nativeShare} aria-label="Mais opções de compartilhamento" className={`${btn} sm:hidden`}>
        <Share2 className="size-4" />
      </button>
      <span role="status" aria-live="polite" className="text-xs muted">
        {copied ? "Link copiado" : ""}
      </span>
    </div>
  );
}
