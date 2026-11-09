import { cx } from "@/lib/utils";

/** Cabeçalho de seção do manual: nome à esquerda, numeração à direita, sobre um fio fino. */
export function SectionHead({ label, index, total, className }: { label: string; index?: number; total?: number; className?: string }) {
  return (
    <div className={cx("flex items-center justify-between border-b hairline pb-3 label", className)}>
      <span>{label}</span>
      {index != null && (
        <span className="tnum muted">
          {String(index).padStart(2, "0")}
          {total ? ` / ${String(total).padStart(2, "0")}` : ""}
        </span>
      )}
    </div>
  );
}
