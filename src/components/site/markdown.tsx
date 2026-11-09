import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

/** Renderiza Markdown com segurança (HTML bruto é ignorado). Links internos usam navegação do Next. */
export function Markdown({ children, className = "prose-bf" }: { children: string; className?: string }) {
  return (
    <div className={className}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => <h2>{children}</h2>,
          a: ({ href = "", children }) =>
            href.startsWith("/") ? (
              <Link href={href}>{children}</Link>
            ) : (
              <a href={href} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            ),
          img: ({ src, alt }) =>
            typeof src === "string" ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={alt || ""} loading="lazy" className="w-full rounded-lg" />
            ) : null,
        }}
      >
        {children}
      </ReactMarkdown>
    </div>
  );
}
