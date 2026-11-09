import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { Monogram } from "@/components/site/brand";
import { logoutAction } from "../actions";
import { AdminNav } from "@/components/admin/admin-nav";

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await requireUser();
  const groups = [
    { title: "Visão geral", items: [["/admin", "Painel"], ["/admin/leads", "Leads"]] },
    {
      title: "Conteúdo",
      items: [
        ["/admin/conteudo/home", "Página inicial"],
        ["/admin/conteudo/sobre", "Sobre nós"],
        ["/admin/servicos", "Serviços"],
        ["/admin/blog", "Blog"],
        ["/admin/categorias", "Categorias"],
        ["/admin/depoimentos", "Depoimentos"],
        ["/admin/landing-pages", "Landing pages"],
        ["/admin/midia", "Mídia"],
      ],
    },
    {
      title: "Configurações",
      items: [
        ["/admin/conteudo/geral", "Identidade e dados legais"],
        ["/admin/conteudo/contato", "Contato e localização"],
        ["/admin/conteudo/whatsapp", "Mensagens do WhatsApp"],
        ["/admin/conteudo/redes", "Redes sociais"],
        ["/admin/conteudo/seo", "SEO das páginas"],
        ["/admin/conteudo/privacidade", "Política de Privacidade"],
        ...(user.role === "admin" ? [["/admin/conteudo/integracoes", "Integrações"]] : []),
      ],
    },
    {
      title: "Conta",
      items: [...(user.role === "admin" ? [["/admin/usuarios", "Usuários"]] : []), ["/admin/conta", "Minha conta"]],
    },
  ] as { title: string; items: [string, string][] }[];

  return (
    <div className="lg:grid lg:min-h-svh lg:grid-cols-[17rem_1fr]">
      <aside className="theme-tinta relative">
        <div className="lg:sticky lg:top-0 lg:flex lg:h-svh lg:flex-col lg:overflow-y-auto">
        <div className="flex items-center justify-between gap-3 p-5 lg:block lg:p-6">
          <Link href="/admin" className="flex items-center gap-3">
            <Monogram className="h-9 w-auto" small title="" />
            <span className="leading-tight">
              <span className="block text-sm font-medium tracking-[0.12em] uppercase">Bruno Freitas</span>
              <span className="text-xs muted">Painel</span>
            </span>
          </Link>
          <AdminNav groups={groups} />
        </div>
        <div className="hidden border-t hairline p-6 text-sm lg:mt-auto lg:block">
          <p className="truncate font-medium">{user.name || user.email}</p>
          <p className="text-xs muted">{user.role === "admin" ? "Administrador" : "Editor"}</p>
          <div className="mt-4 flex gap-4">
            <Link href="/" target="_blank" className="underline underline-offset-2">
              Ver site
            </Link>
            <form action={logoutAction}>
              <button className="underline underline-offset-2">Sair</button>
            </form>
          </div>
        </div>
        </div>
      </aside>
      <div className="min-w-0">
        <div className="mx-auto max-w-6xl px-6 py-8 sm:px-8 lg:py-12">{children}</div>
      </div>
    </div>
  );
}
