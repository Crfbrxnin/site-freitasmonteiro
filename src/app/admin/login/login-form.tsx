"use client";

import { useActionState } from "react";
import { loginAction } from "../actions";

export function LoginForm() {
  const [state, action, pending] = useActionState(loginAction, null);
  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block">
        <span className="field-label">E-mail</span>
        <input name="email" type="email" autoComplete="username" required className="field" defaultValue={state?.email} key={state?.email} />
      </label>
      <label className="block">
        <span className="field-label">Senha</span>
        <input name="password" type="password" autoComplete="current-password" required className="field" />
      </label>
      {state?.error && (
        <p role="alert" className="field-error">
          {state.error}
        </p>
      )}
      <button className="btn btn-primary w-full" disabled={pending}>
        {pending ? "Entrando…" : "Entrar"}
      </button>
    </form>
  );
}
