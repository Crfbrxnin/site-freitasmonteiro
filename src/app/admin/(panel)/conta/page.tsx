import { requireUser } from "@/lib/auth";
import { PageTitle } from "@/components/admin/ui";
import { ChangePasswordForm } from "@/components/admin/forms";
import { logoutAction } from "../../actions";

export default async function AccountPage() {
  const user = await requireUser();
  return (
    <>
      <PageTitle title="Minha conta" description={`${user.email} · ${user.role === "admin" ? "Administrador" : "Editor"}`} />
      <ChangePasswordForm />
      <form action={logoutAction} className="mt-12 border-t hairline pt-6">
        <button className="btn btn-ghost !min-h-11">Sair do painel</button>
      </form>
    </>
  );
}
