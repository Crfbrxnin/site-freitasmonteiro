import Link from "next/link";
import { Monogram } from "@/components/site/brand";

export default function NotFound() {
  return (
    <main className="theme-tinta relative flex min-h-svh items-center overflow-hidden">
      <Monogram title="" className="pointer-events-none absolute -right-24 top-1/2 h-[120%] w-auto -translate-y-1/2 text-papel opacity-[0.05]" />
      <div className="container-site relative py-24">
        <p className="label muted tnum">Erro 404</p>
        <h1 className="display display-xl mt-6 max-w-4xl">
          Esta página não fecha <em>a conta.</em>
        </h1>
        <span className="fio mt-10 w-24" />
        <p className="lead-text mt-6 max-w-xl">O endereço pode ter mudado ou a página foi removida. Siga por um dos caminhos abaixo.</p>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/" className="btn btn-primary">
            Voltar ao início
          </Link>
          <Link href="/servicos" className="btn btn-ghost">
            Ver serviços
          </Link>
          <Link href="/contato" className="btn btn-ghost">
            Contato
          </Link>
        </div>
      </div>
    </main>
  );
}
