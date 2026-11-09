import type { Faq } from "@/lib/types";
import { pad2 } from "@/lib/utils";

/** Perguntas frequentes com <details> nativo (acessível, sem JavaScript). Numeração arábica 01, 02 em Outfit. */
export function FaqList({ items }: { items: Faq[] }) {
  if (!items.length) return null;
  return (
    <div className="border-t hairline">
      {items.map((f, i) => (
        <details key={i} className="group border-b hairline">
          <summary className="flex cursor-pointer list-none items-start gap-5 py-6 [&::-webkit-details-marker]:hidden">
            <span className="tnum label pt-1.5 muted">{pad2(i + 1)}</span>
            <span className="flex-1 text-lg font-normal leading-snug sm:text-xl">{f.q}</span>
            <span aria-hidden className="relative mt-2 size-4 shrink-0">
              <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
              <span className="absolute left-1/2 top-0 h-4 w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
            </span>
          </summary>
          <p className="pb-7 pl-11 pr-8 leading-relaxed muted">{f.a}</p>
        </details>
      ))}
    </div>
  );
}

export function faqJsonLd(items: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
