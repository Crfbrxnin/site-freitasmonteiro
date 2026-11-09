import { requireAdmin } from "@/lib/auth";
import { listUsers } from "@/lib/repo";
import { formatDateTime } from "@/lib/utils";
import { Badge, DangerButton, Notice, PageTitle } from "@/components/admin/ui";
import { CreateUserForm } from "@/components/admin/forms";
import { deleteUserAction, updateUserRoleAction } from "../../actions";

export default async function AdminUsers({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const [me, sp] = await Promise.all([requireAdmin(), searchParams]);
  const users = await listUsers();
  return (
    <>
      <PageTitle
        title="Usuários"
        description="Administradores gerenciam tudo, inclusive integrações, usuários e exclusão de leads. Editores cuidam de conteúdo, blog e acompanhamento de leads."
      />
      {sp.ok && <Notice>Usuários atualizados.</Notice>}
      {sp.erro && <Notice tone="error">Você não pode alterar ou excluir o próprio usuário por aqui.</Notice>}
      <ul className="divide-y divide-[var(--line)] rounded-2xl border hairline bg-[var(--surface)]">
        {users.map((u) => (
          <li key={u.id} className="flex flex-wrap items-center gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                {u.name || u.email} {u.id === me.id && <span className="text-xs muted">(você)</span>}
              </p>
              <p className="text-xs muted">
                {u.email} · último acesso: {u.lastLoginAt ? formatDateTime(u.lastLoginAt) : "nunca"}
              </p>
            </div>
            <Badge tone={u.role === "admin" ? "vinho" : "neutral"}>{u.role === "admin" ? "Administrador" : "Editor"}</Badge>
            {u.id !== me.id && (
              <>
                <form action={updateUserRoleAction}>
                  <input type="hidden" name="id" value={u.id} />
                  <input type="hidden" name="role" value={u.role === "admin" ? "editor" : "admin"} />
                  <button className="text-sm underline underline-offset-2">Tornar {u.role === "admin" ? "editor" : "administrador"}</button>
                </form>
                <form action={deleteUserAction}>
                  <input type="hidden" name="id" value={u.id} />
                  <DangerButton confirm={`Excluir ${u.email}?`}>Excluir</DangerButton>
                </form>
              </>
            )}
          </li>
        ))}
      </ul>
      <h2 className="display display-sm mt-12">Novo usuário</h2>
      <CreateUserForm />
    </>
  );
}
