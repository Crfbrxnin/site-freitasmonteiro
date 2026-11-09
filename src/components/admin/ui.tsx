import Link from "next/link";
import { cx } from "@/lib/utils";

export function PageTitle({ title, description, action }: { title: string; description?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-10 flex flex-col gap-4 border-b hairline pb-6 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="display display-md">{title}</h1>
        {description && <p className="mt-3 max-w-2xl muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function Notice({ tone = "ok", children }: { tone?: "ok" | "warn" | "error"; children: React.ReactNode }) {
  return (
    <div
      role="status"
      className={cx(
        "mb-6 rounded-xl border px-4 py-3 text-sm",
        tone === "ok" && "border-[#2f6b4f]/30 bg-[#2f6b4f]/8 text-[#1f4d38]",
        tone === "warn" && "border-[#8a6a1f]/30 bg-[#8a6a1f]/10 text-[#5c4614]",
        tone === "error" && "border-[#9b2c35]/30 bg-[#9b2c35]/8 text-[#7a1f28]",
      )}
    >
      {children}
    </div>
  );
}

export function Card({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cx("rounded-2xl border hairline bg-[var(--surface)] p-6", className)}>{children}</div>;
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: "neutral" | "ok" | "warn" | "vinho" }) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        tone === "neutral" && "bg-tinta/8",
        tone === "ok" && "bg-[#2f6b4f]/12 text-[#1f4d38]",
        tone === "warn" && "bg-[#8a6a1f]/15 text-[#5c4614]",
        tone === "vinho" && "bg-vinho text-papel",
      )}
    >
      {children}
    </span>
  );
}

export function ButtonLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="btn btn-primary !min-h-11">
      {children}
    </Link>
  );
}

export { DangerButton } from "./confirm-button";
