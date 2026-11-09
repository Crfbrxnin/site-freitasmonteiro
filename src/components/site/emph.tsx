import { Fragment } from "react";

/** Converte *trecho* em <em> (itálico de ênfase do manual). Todo o resto é texto puro (sem HTML). */
export function Emph({ text }: { text: string }) {
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean);
  return (
    <>
      {parts.map((p, i) =>
        p.startsWith("*") && p.endsWith("*") && p.length > 2 ? <em key={i}>{p.slice(1, -1)}</em> : <Fragment key={i}>{p}</Fragment>,
      )}
    </>
  );
}
