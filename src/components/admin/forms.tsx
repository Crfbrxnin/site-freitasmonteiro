"use client";

import { useActionState } from "react";
import { changePasswordAction, createUserAction } from "@/app/admin/actions";

function Status({ state }: { state: { error?: string; message?: string } | null }) {
  if (!state) return null;
  return (
    <p role="status" className={state.error ? "field-error" : "text-sm text-[#1f4d38]"}>
      {state.error || state.message}
    </p>
  );
}

export function CreateUserForm() {
  const [state, action, pending] = useActionState(createUserAction, null);
  return (
    <form action={action} className="mt-4 grid gap-4 rounded-2xl border border-dashed hairline p-5 sm:grid-cols-2">
      <label>
        <span className="field-label">Nome</span>
        <input name="name" className="field" />
      </label>
      <label>
        <span className="field-label">E-mail</span>
        <input name="email" type="email" required className="field" autoComplete="off" />
      </label>
      <label>
        <span className="field-label">Senha inicial (mín. 10 caracteres)</span>
        <input name="password" type="password" required minLength={10} className="field" autoComplete="new-password" />
      </label>
      <label>
        <span className="field-label">Permissão</span>
        <select name="role" className="field" defaultValue="editor">
          <option value="editor">Editor</option>
          <option value="admin">Administrador</option>
        </select>
      </label>
      <div className="flex items-center gap-4 sm:col-span-2">
        <button className="btn btn-primary !min-h-11" disabled={pending}>
          Criar usuário
        </button>
        <Status state={state} />
      </div>
    </form>
  );
}

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState(changePasswordAction, null);
  return (
    <form action={action} className="max-w-md space-y-4">
      <label className="block">
        <span className="field-label">Senha atual</span>
        <input name="current" type="password" required className="field" autoComplete="current-password" />
      </label>
      <label className="block">
        <span className="field-label">Nova senha (mín. 10 caracteres)</span>
        <input name="next" type="password" required minLength={10} className="field" autoComplete="new-password" />
      </label>
      <label className="block">
        <span className="field-label">Confirmar nova senha</span>
        <input name="confirm" type="password" required minLength={10} className="field" autoComplete="new-password" />
      </label>
      <button className="btn btn-primary !min-h-11" disabled={pending}>
        Alterar senha
      </button>
      <Status state={state} />
    </form>
  );
}
