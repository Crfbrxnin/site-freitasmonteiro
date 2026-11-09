"use client";

import type { ReactNode } from "react";
import { track } from "@/lib/client";

/** Link para o WhatsApp (ou para /contato, quando o número ainda não foi configurado) com registro de conversão. */
export function WaLink({
  href,
  label,
  className,
  children,
  ariaLabel,
}: {
  href: string;
  label: string;
  className?: string;
  children: ReactNode;
  ariaLabel?: string;
}) {
  const external = href.startsWith("http");
  return (
    <a
      href={href}
      className={className}
      aria-label={ariaLabel}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      onClick={() => external && track("whatsapp_click", { label })}
    >
      {children}
    </a>
  );
}
