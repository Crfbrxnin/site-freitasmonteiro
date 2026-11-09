import { redirect } from "next/navigation";
import { getSessionUser, isSessionSecretConfigured } from "@/lib/auth";
import { countUsers } from "@/lib/repo";
import { Monogram } from "@/components/site/brand";
import { LoginForm } from "./login-form";

export default async function LoginPage() {
  if (await getSessionUser()) redirect("/admin");
  const users = await countUsers();
  return (
    <main className="grid min-h-svh lg:grid-cols-2">
      <section className="theme-tinta relative hidden overflow-hidden lg:block">
        <Monogram title="" className="absolute -left-10 top-1/2 h-[110%] w-auto -translate-y-1/2 text-papel opacity-[0.07]" />
        <div className="relative flex h-full flex-col justify-end p-14">
          <p className="display display-lg">
            Números claros <em>para decidir.</em>
          </p>
          <p className="mt-6 label muted">Painel administrativo</p>
        </div>
      </section>
      <section className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <Monogram className="h-14 w-auto text-vinho" />
          <h1 className="display display-md mt-8">Entrar no painel</h1>
          {!isSessionSecretConfigured() ? (
            <div role="alert" className="mt-6 rounded-xl border border-[#9b2c35]/30 bg-[#9b2c35]/8 p-5 text-sm leading-relaxed text-[#7a1f28]">
              <p className="font-medium">Configuração incompleta: SESSION_SECRET.</p>
              <p className="mt-2">
                Defina a variável <code>SESSION_SECRET</code> na hospedagem com uma sequência aleatória de pelo menos 32 caracteres (recomendado: 48 ou mais) e aguarde a
                nova publicação. Sem ela, não é possível entrar no painel.
              </p>
            </div>
          ) : users === 0 ? (
            <div className="mt-6 rounded-xl border hairline bg-[var(--surface)] p-5 text-sm leading-relaxed">
              <p className="font-medium">Nenhum usuário cadastrado.</p>
              <p className="mt-2 muted">
                Defina <code>ADMIN_EMAIL</code> e <code>ADMIN_PASSWORD</code> (mínimo de 10 caracteres) nas variáveis de ambiente e reinicie o
                servidor, ou rode <code>npm run admin:create</code>.
              </p>
            </div>
          ) : (
            <LoginForm />
          )}
        </div>
      </section>
    </main>
  );
}
