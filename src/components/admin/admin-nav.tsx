"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "@flux-icons/react";
import { cx } from "@/lib/utils";

export function AdminNav({ groups }: { groups: { title: string; items: [string, string][] }[] }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);
  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  return (
    <>
      <button
        type="button"
        className="flex size-10 items-center justify-center rounded-full border hairline lg:hidden"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="admin-nav"
        aria-label="Menu do painel"
      >
        {open ? <X className="size-5" /> : <Menu className="size-5" />}
      </button>
      <nav
        id="admin-nav"
        aria-label="Painel"
        className={cx("absolute inset-x-0 top-[4.5rem] z-30 bg-tinta px-5 pb-6 lg:static lg:mt-8 lg:block lg:p-0", open ? "block" : "hidden")}
      >
        {groups.map((g) => (
          <div key={g.title} className="mt-6 first:mt-0">
            <p className="label px-3 text-[0.65rem] muted">{g.title}</p>
            <ul className="mt-2">
              {g.items.map(([href, label]) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active(href) ? "page" : undefined}
                    className={cx(
                      "block rounded-lg px-3 py-2 text-[0.92rem] transition-colors",
                      active(href) ? "bg-papel/10 text-papel" : "text-papel/75 hover:bg-papel/5 hover:text-papel",
                    )}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
        <div className="mt-6 flex gap-4 border-t hairline px-3 pt-5 text-sm lg:hidden">
          <Link href="/" target="_blank" className="underline underline-offset-2">
            Ver site
          </Link>
        </div>
      </nav>
    </>
  );
}
