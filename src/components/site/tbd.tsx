/** Marcação "A definir" — só aparece com o modo de configuração ligado (Painel › Identidade). */
export function Tbd({ show, children }: { show: boolean; children: string }) {
  if (!show) return null;
  return (
    <span className="tbd" title="Campo editável no painel administrativo">
      <span aria-hidden>✎</span> A definir: {children}
    </span>
  );
}
