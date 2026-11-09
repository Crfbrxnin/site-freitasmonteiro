"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "@flux-icons/react";
import { Signature } from "./brand";
import { WaLink } from "./wa-link";
import { BrandIcon } from "./icons";
import type { BrandName } from "./brand-paths";
import { cx } from "@/lib/utils";

export type NavItem = { href: string; label: string };

export function Header({
  nav,
  waHref,
  signatureLine,
  socials,
}: {
  nav: NavItem[];
  waHref: string;
  signatureLine: string;
  socials: { name: BrandName; href: string; label: string }[];
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header
      className={cx(
        "theme-tinta sticky top-0 z-40 transition-[border-color,background-color] duration-300",
        scrolled ? "border-b hairline bg-tinta/95 backdrop-blur" : "border-b border-transparent",
      )}
    >
      <a href="#conteudo" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 btn btn-primary">
        Pular para o conteúdo
      </a>
      <div className="container-site flex h-20 items-center justify-between gap-6">
        <Link href="/" aria-label="Bruno Freitas Contabilidade — página inicial" className="shrink-0">
          <span className="hidden sm:block">
            <Signature line={signatureLine} />
          </span>
          <span className="block sm:hidden">
            <Signature line="" compact />
          </span>
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className={cx(
                    "label py-2 transition-opacity",
                    isActive(item.href) ? "opacity-100 border-b border-current" : "opacity-75 hover:opacity-100",
                  )}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          {socials.length > 0 && (
            <ul className="hidden items-center gap-3 xl:flex" aria-label="Redes sociais">
              {socials.map((s) => (
                <li key={s.name}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="opacity-70 hover:opacity-100">
                    <BrandIcon name={s.name} className="size-4" />
                  </a>
                </li>
              ))}
            </ul>
          )}
          <WaLink href={waHref} label="header" className="btn btn-primary hidden !min-h-11 !px-5 md:inline-flex">
            Falar com um contador
          </WaLink>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border hairline lg:hidden"
            aria-expanded={open}
            aria-controls="menu-movel"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <div
        id="menu-movel"
        hidden={!open}
        className="theme-tinta fixed inset-x-0 bottom-0 top-20 z-40 overflow-y-auto border-t hairline lg:hidden"
      >
        <nav aria-label="Menu" className="container-site flex min-h-full flex-col py-8">
          <ul className="flex-1">
            {nav.map((item, i) => (
              <li key={item.href} className="border-b hairline">
                <Link
                  href={item.href}
                  aria-current={isActive(item.href) ? "page" : undefined}
                  className="flex items-baseline justify-between py-5"
                >
                  <span className="display text-4xl">{item.label}</span>
                  <span className="label tnum muted">{String(i + 1).padStart(2, "0")}</span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 space-y-6">
            <WaLink href={waHref} label="menu-movel" className="btn btn-primary w-full">
              Falar com um contador
            </WaLink>
            {socials.length > 0 && (
              <ul className="flex gap-5" aria-label="Redes sociais">
                {socials.map((s) => (
                  <li key={s.name}>
                    <a href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                      <BrandIcon name={s.name} className="size-5" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
