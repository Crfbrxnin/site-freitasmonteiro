"use client";

import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { readAttribution, track } from "@/lib/client";
import { COMPANY_SIZES, COMPANY_TYPES, cx } from "@/lib/utils";

type Variant = "contato" | "orcamento" | "curto";

const TURNSTILE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";

function maskPhone(v: string) {
  const d = v.replace(/\D/g, "").slice(0, 13);
  const local = d.startsWith("55") && d.length > 11 ? d.slice(2) : d;
  if (local.length <= 2) return local;
  if (local.length <= 6) return `(${local.slice(0, 2)}) ${local.slice(2)}`;
  if (local.length <= 10) return `(${local.slice(0, 2)}) ${local.slice(2, 6)}-${local.slice(6)}`;
  return `(${local.slice(0, 2)}) ${local.slice(2, 7)}-${local.slice(7, 11)}`;
}

export function LeadForm({
  form,
  variant = "contato",
  services,
  defaultService = "",
  submitLabel = "Solicitar contato",
  className,
}: {
  form: string;
  variant?: Variant;
  services: { slug: string; title: string }[];
  defaultService?: string;
  submitLabel?: string;
  className?: string;
}) {
  const router = useRouter();
  const id = useId();
  const startedAt = useRef<number>(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [phone, setPhone] = useState("");

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (sending) return;
    const fd = new FormData(e.currentTarget);
    const payload: Record<string, unknown> = Object.fromEntries(fd.entries());
    payload.consent = fd.get("consent") === "on";
    payload.form = form;
    payload.startedAt = startedAt.current;
    payload.page = window.location.pathname;
    payload.attribution = readAttribution();
    payload.turnstileToken = fd.get("cf-turnstile-response") || "";

    setSending(true);
    setErrors({});
    setMessage("");
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        setErrors(data.errors || {});
        setMessage(data.message || "Não foi possível enviar agora. Tente novamente em instantes ou fale pelo WhatsApp.");
        setSending(false);
        const first = Object.keys(data.errors || {})[0];
        if (first) document.getElementById(`${id}-${first}`)?.focus();
        return;
      }
      track("generate_lead", { form });
      router.push(`/obrigado?origem=${encodeURIComponent(form)}`);
    } catch {
      setMessage("Sem conexão no momento. Verifique a internet e tente novamente.");
      setSending(false);
    }
  }

  const f = (name: string) => ({
    id: `${id}-${name}`,
    name,
    "aria-invalid": errors[name] ? true : undefined,
    "aria-describedby": errors[name] ? `${id}-${name}-err` : undefined,
  });
  const err = (name: string) =>
    errors[name] ? (
      <p id={`${id}-${name}-err`} className="field-error">
        {errors[name]}
      </p>
    ) : null;

  return (
    <form onSubmit={onSubmit} noValidate className={cx("grid gap-5 sm:grid-cols-2", className)}>
      {TURNSTILE_KEY && <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer />}

      <div className="sm:col-span-2">
        <label htmlFor={`${id}-name`} className="field-label">
          {variant === "orcamento" ? "Nome" : "Nome completo"} <span aria-hidden>*</span>
        </label>
        <input {...f("name")} className="field" autoComplete="name" required maxLength={120} />
        {err("name")}
      </div>

      <div>
        <label htmlFor={`${id}-phone`} className="field-label">
          {variant === "contato" ? "Telefone / WhatsApp" : "WhatsApp"} <span aria-hidden>*</span>
        </label>
        <input
          {...f("phone")}
          className="field tnum"
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          required
          placeholder="(21) 90000-0000"
          value={phone}
          onChange={(e) => setPhone(maskPhone(e.target.value))}
        />
        {err("phone")}
      </div>

      <div>
        <label htmlFor={`${id}-email`} className="field-label">
          E-mail <span aria-hidden>*</span>
        </label>
        <input {...f("email")} className="field" type="email" autoComplete="email" required maxLength={160} />
        {err("email")}
      </div>

      {variant === "orcamento" && (
        <>
          <div>
            <label htmlFor={`${id}-company`} className="field-label">
              Empresa ou atividade <span aria-hidden>*</span>
            </label>
            <input {...f("company")} className="field" autoComplete="organization" required maxLength={160} />
            {err("company")}
          </div>
          <div>
            <label htmlFor={`${id}-cnpj`} className="field-label">
              CNPJ <span className="font-light muted">(opcional)</span>
            </label>
            <input {...f("cnpj")} className="field tnum" inputMode="numeric" maxLength={18} placeholder="00.000.000/0000-00" />
            {err("cnpj")}
          </div>
          <div>
            <label htmlFor={`${id}-companySize`} className="field-label">
              Porte ou enquadramento <span className="font-light muted">(se souber)</span>
            </label>
            <select {...f("companySize")} className="field" defaultValue="">
              <option value="">Selecione</option>
              {[...COMPANY_TYPES.filter((t) => !t.startsWith("Ainda") && !t.startsWith("Não")), ...COMPANY_SIZES].map((o) => (
                <option key={o}>{o}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {variant === "contato" && (
        <div>
          <label htmlFor={`${id}-companyType`} className="field-label">
            Tipo de empresa
          </label>
          <select {...f("companyType")} className="field" defaultValue="">
            <option value="">Selecione</option>
            {COMPANY_TYPES.map((o) => (
              <option key={o}>{o}</option>
            ))}
          </select>
        </div>
      )}

      <div className={variant === "curto" ? "sm:col-span-2" : ""}>
        <label htmlFor={`${id}-service`} className="field-label">
          {variant === "orcamento" ? "Serviço desejado" : "Serviço de interesse"}
        </label>
        <select {...f("service")} className="field" defaultValue={defaultService}>
          <option value="">Ainda não sei / quero orientação</option>
          {services.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.title}
            </option>
          ))}
        </select>
      </div>

      <div className="sm:col-span-2">
        <label htmlFor={`${id}-message`} className="field-label">
          {variant === "orcamento" ? "Mensagem adicional" : "Mensagem"}
        </label>
        <textarea
          {...f("message")}
          className="field min-h-32 resize-y"
          maxLength={3000}
          placeholder="Conte um pouco sobre a sua empresa e o que você precisa."
        />
        {err("message")}
      </div>

      {/* Honeypot: invisível para pessoas, preenchido por robôs. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Não preencha este campo
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className="sm:col-span-2">
        <label className="flex items-start gap-3 text-sm leading-relaxed">
          <input
            {...f("consent")}
            type="checkbox"
            required
            className="mt-1 size-4 shrink-0 accent-current"
          />
          <span className="muted">
            Autorizo o uso dos meus dados para retorno deste contato e envio de proposta, conforme a{" "}
            <Link href="/politica-de-privacidade" className="underline underline-offset-2" target="_blank">
              Política de Privacidade
            </Link>
            .
          </span>
        </label>
        {err("consent")}
      </div>

      {TURNSTILE_KEY && (
        <div className="sm:col-span-2">
          <div className="cf-turnstile" data-sitekey={TURNSTILE_KEY} data-language="pt-br" />
          {err("turnstile")}
        </div>
      )}

      <div className="sm:col-span-2 flex flex-col gap-4 sm:flex-row sm:items-center">
        <button type="submit" className="btn btn-primary" disabled={sending}>
          {sending ? "Enviando…" : submitLabel}
        </button>
        <p className="text-xs muted">* Campos obrigatórios. O retorno é feito pelo contato informado.</p>
      </div>

      <p role="status" aria-live="polite" className={cx("sm:col-span-2 text-sm", message ? "" : "sr-only")}>
        {message}
      </p>
    </form>
  );
}
