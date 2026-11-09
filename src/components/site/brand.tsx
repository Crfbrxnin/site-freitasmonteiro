import { cx } from "@/lib/utils";

/**
 * Monograma BF — reconstruído a partir da construção do manual:
 * caixa 100 × 120, traço 10, raio do bojo superior/inferior 16/27, inclinação 8° à direita, pontas arredondadas.
 * Abaixo de 64 px o traço sobe para 12 (+15%), conforme a regra de redução.
 */
export function Monogram({
  className,
  title = "Bruno Freitas",
  small = false,
  animated = false,
}: {
  className?: string;
  title?: string;
  small?: boolean;
  animated?: boolean;
}) {
  const sw = small ? 12 : 10;
  return (
    <svg
      viewBox="0 0 92 120"
      className={cx(animated && "draw", className)}
      role={title ? "img" : undefined}
      aria-label={title || undefined}
      aria-hidden={title ? undefined : true}
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <g transform="skewX(-8)">
        {/* Haste do F/B + braço de cima do F (passa por cima de tudo) */}
        <path pathLength={1} d="M24 110 V22 A16 16 0 0 1 40 6 H80" />
        {/* Bojo superior do B, suspenso, preso só na cintura */}
        <path pathLength={1} d="M44 24 H50 A16 16 0 0 1 50 56 H24" />
        {/* Bojo inferior, maior, fecha a forma */}
        <path pathLength={1} d="M24 56 H52 A27 27 0 0 1 52 110 H44" />
      </g>
    </svg>
  );
}

/** Assinatura completa: símbolo, fio vertical, nome em caixa alta (12%) e a linha "Contador · CRC". */
export function Signature({
  line,
  className,
  compact = false,
}: {
  line: string;
  className?: string;
  compact?: boolean;
}) {
  return (
    <span className={cx("inline-flex items-center gap-3", className)}>
      <Monogram className={compact ? "h-8 w-auto" : "h-10 w-auto"} small title="" />
      <span aria-hidden className={cx("w-px self-stretch bg-current opacity-40", compact ? "my-1" : "my-0.5")} />
      <span className="flex flex-col leading-none">
        <span className="font-medium tracking-[0.12em] uppercase text-[0.95rem]">Bruno Freitas</span>
        {line && !compact && <span className="mt-1.5 text-[0.68rem] font-light tracking-[0.02em] opacity-80">{line}</span>}
      </span>
    </span>
  );
}
