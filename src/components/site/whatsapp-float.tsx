"use client";

import { usePathname } from "next/navigation";
import { BrandIcon } from "./icons";
import { track } from "@/lib/client";
import { whatsappHref } from "@/lib/utils";

export type WaMap = {
  number: string;
  label: string;
  byPath: Record<string, string>;
  services: Record<string, string>;
  landings: Record<string, string>;
  fallback: string;
};

/** Mensagem automática conforme a origem do clique. */
function messageFor(path: string, m: WaMap) {
  const seg = path.split("/").filter(Boolean);
  if (seg[0] === "servicos" && seg[1] && m.services[seg[1]]) return m.services[seg[1]];
  if (seg[0] === "lp" && seg[1] && m.landings[seg[1]]) return m.landings[seg[1]];
  const key = seg[0] || "home";
  return m.byPath[key] || m.fallback;
}

export function WhatsappFloat({ map }: { map: WaMap }) {
  const pathname = usePathname();
  if (!map.number) return null;
  const href = whatsappHref(map.number, messageFor(pathname, map));
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={map.label}
      onClick={() => track("whatsapp_click", { label: "botao-flutuante" })}
      className="group fixed bottom-5 right-5 z-30 flex items-center gap-3 sm:bottom-7 sm:right-7"
    >
      <span className="pointer-events-none hidden translate-x-2 rounded-full bg-papel px-4 py-2 text-sm font-medium text-tinta opacity-0 shadow-lg transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100 md:block">
        {map.label}
      </span>
      <span className="flex size-14 items-center justify-center rounded-full bg-papel text-tinta shadow-[0_10px_30px_-8px_rgba(20,17,18,0.55)] ring-1 ring-tinta/10 transition-transform duration-300 group-hover:-translate-y-0.5">
        <BrandIcon name="whatsapp" className="size-6" />
      </span>
    </a>
  );
}
