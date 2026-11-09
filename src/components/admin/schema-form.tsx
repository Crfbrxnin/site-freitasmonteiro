"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowDown, ArrowUp, Bin, Plus } from "@flux-icons/react";
import type { Field } from "@/lib/settings-schema";
import { ICONS } from "@/components/site/icons";
import { cx } from "@/lib/utils";

export type ActionState = { ok?: boolean; error?: string; message?: string } | null;
type Values = Record<string, any>;

function emptyFor(f: Field): any {
  switch (f.type) {
    case "boolean":
      return false;
    case "list":
      return [];
    case "items":
      return [];
    case "number":
      return 0;
    default:
      return "";
  }
}

/** Formulário genérico do painel, guiado por esquema. Envia tudo como JSON para a server action. */
export function SchemaForm({
  fields,
  initial,
  action,
  submitLabel = "Salvar alterações",
  extra,
}: {
  fields: Field[];
  initial: Values;
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  submitLabel?: string;
  extra?: React.ReactNode;
}) {
  const [values, setValues] = useState<Values>(() => {
    const v: Values = {};
    for (const f of fields) v[f.name] = initial[f.name] ?? emptyFor(f);
    return v;
  });
  const [state, formAction, pending] = useActionState(action, null);
  const set = (name: string, value: any) => setValues((v) => ({ ...v, [name]: value }));

  return (
    <form action={formAction} className="space-y-8">
      <input type="hidden" name="payload" value={JSON.stringify(values)} />
      {fields.map((f) => (
        <FieldInput key={f.name} field={f} value={values[f.name]} onChange={(v) => set(f.name, v)} />
      ))}
      {extra}
      <div className="sticky bottom-0 z-10 -mx-6 flex flex-wrap items-center gap-4 border-t hairline bg-[var(--bg)]/95 px-6 py-4 backdrop-blur sm:-mx-8 sm:px-8">
        <button type="submit" className="btn btn-primary !min-h-11" disabled={pending}>
          {pending ? "Salvando…" : submitLabel}
        </button>
        <p role="status" aria-live="polite" className={cx("text-sm", state?.error ? "text-[#9b2c35]" : "muted")}>
          {state?.error || state?.message || ""}
        </p>
      </div>
    </form>
  );
}

function Counter({ value, max }: { value: string; max?: number }) {
  if (!max) return null;
  const n = (value || "").length;
  return (
    <span className={cx("tnum text-xs", n > max ? "text-[#9b2c35]" : "muted")}>
      {n}/{max}
    </span>
  );
}

function Label({ field, value }: { field: Field; value?: string }) {
  return (
    <div className="mb-1.5 flex items-baseline justify-between gap-3">
      <span className="field-label !mb-0">
        {field.label}
        {field.required && <span aria-hidden> *</span>}
      </span>
      <Counter value={value || ""} max={field.recommended} />
    </div>
  );
}

function Help({ text }: { text?: string }) {
  return text ? <p className="mt-1.5 text-xs leading-relaxed muted">{text}</p> : null;
}

export function FieldInput({ field, value, onChange }: { field: Field; value: any; onChange: (v: any) => void }) {
  const id = `f-${field.name}`;
  switch (field.type) {
    case "boolean":
      return (
        <div>
          <label className="flex items-start gap-3">
            <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="mt-1 size-4 accent-vinho" />
            <span className="text-[0.95rem] font-medium">{field.label}</span>
          </label>
          <Help text={field.help} />
        </div>
      );
    case "textarea":
      return (
        <label className="block" htmlFor={id}>
          <Label field={field} value={value} />
          <textarea id={id} className="field min-h-24" value={value || ""} onChange={(e) => onChange(e.target.value)} placeholder={field.placeholder} />
          <Help text={field.help} />
        </label>
      );
    case "markdown":
      return <MarkdownField field={field} value={value || ""} onChange={onChange} />;
    case "image":
      return <ImageField field={field} value={value || ""} onChange={onChange} />;
    case "number":
      return (
        <label className="block max-w-40" htmlFor={id}>
          <Label field={field} />
          <input id={id} type="number" className="field tnum" value={value ?? 0} onChange={(e) => onChange(Number(e.target.value))} />
          <Help text={field.help} />
        </label>
      );
    case "datetime":
      return <DateTimeField field={field} value={value} onChange={onChange} />;
    case "select":
      return (
        <label className="block max-w-xl" htmlFor={id}>
          <Label field={field} />
          <select id={id} className="field" value={value == null ? "" : String(value)} onChange={(e) => onChange(e.target.value)}>
            {field.options?.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          <Help text={field.help} />
        </label>
      );
    case "icon":
      return (
        <fieldset>
          <legend className="field-label">{field.label}</legend>
          <div className="grid grid-cols-6 gap-2 sm:grid-cols-9 lg:grid-cols-13">
            {Object.entries(ICONS).map(([key, { label, Icon }]) => (
              <button
                key={key}
                type="button"
                title={label}
                aria-label={label}
                aria-pressed={value === key}
                onClick={() => onChange(key)}
                className={cx(
                  "flex aspect-square items-center justify-center rounded-lg border transition-colors",
                  value === key ? "border-vinho bg-vinho text-papel" : "hairline hover:border-current",
                )}
              >
                <Icon className="size-5" strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </fieldset>
      );
    case "list":
      return <ListField field={field} value={Array.isArray(value) ? value : []} onChange={onChange} />;
    case "items":
      return <ItemsField field={field} value={Array.isArray(value) ? value : []} onChange={onChange} />;
    default:
      return (
        <label className="block" htmlFor={id}>
          <Label field={field} value={value} />
          <input
            id={id}
            type={field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
            className="field"
            value={value ?? ""}
            maxLength={field.maxLength}
            placeholder={field.placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          <Help text={field.help} />
        </label>
      );
  }
}

/** Renderizado só no navegador: o fuso horário do servidor pode ser diferente do fuso de quem edita. */
function DateTimeField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const id = `f-${field.name}`;
  return (
    <label className="block max-w-xs" htmlFor={id}>
      <Label field={field} />
      <input
        id={id}
        type="datetime-local"
        className="field tnum"
        value={mounted && value ? toLocalInput(value) : ""}
        onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : "")}
      />
      <Help text={field.help} />
    </label>
  );
}

function toLocalInput(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const off = d.getTimezoneOffset();
  return new Date(d.getTime() - off * 60000).toISOString().slice(0, 16);
}

function move<T>(arr: T[], i: number, dir: -1 | 1) {
  const j = i + dir;
  if (j < 0 || j >= arr.length) return arr;
  const copy = [...arr];
  [copy[i], copy[j]] = [copy[j], copy[i]];
  return copy;
}

function RowTools({ i, len, onMove, onRemove }: { i: number; len: number; onMove: (d: -1 | 1) => void; onRemove: () => void }) {
  const b = "flex size-8 items-center justify-center rounded-md border hairline hover:border-current disabled:opacity-30";
  return (
    <div className="flex shrink-0 gap-1">
      <button type="button" className={b} onClick={() => onMove(-1)} disabled={i === 0} aria-label="Mover para cima">
        <ArrowUp className="size-4" />
      </button>
      <button type="button" className={b} onClick={() => onMove(1)} disabled={i === len - 1} aria-label="Mover para baixo">
        <ArrowDown className="size-4" />
      </button>
      <button type="button" className={b} onClick={onRemove} aria-label="Remover">
        <Bin className="size-4" />
      </button>
    </div>
  );
}

function ListField({ field, value, onChange }: { field: Field; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <fieldset>
      <legend className="field-label">{field.label}</legend>
      <ul className="space-y-2">
        {value.map((item, i) => (
          <li key={i} className="flex items-center gap-2">
            <span className="tnum w-6 text-xs muted">{String(i + 1).padStart(2, "0")}</span>
            <input
              className="field !min-h-10 !py-2"
              value={item}
              aria-label={`${field.label} ${i + 1}`}
              onChange={(e) => onChange(value.map((v, j) => (j === i ? e.target.value : v)))}
            />
            <RowTools i={i} len={value.length} onMove={(d) => onChange(move(value, i, d))} onRemove={() => onChange(value.filter((_, j) => j !== i))} />
          </li>
        ))}
      </ul>
      <button type="button" className="mt-3 inline-flex items-center gap-2 text-sm font-medium" onClick={() => onChange([...value, ""])}>
        <Plus className="size-4" /> Adicionar item
      </button>
      <Help text={field.help} />
    </fieldset>
  );
}

function ItemsField({ field, value, onChange }: { field: Field; value: Values[]; onChange: (v: Values[]) => void }) {
  const sub = field.fields || [];
  const blank = () => Object.fromEntries(sub.map((f) => [f.name, emptyFor(f)]));
  return (
    <fieldset>
      <legend className="field-label">{field.label}</legend>
      <ol className="space-y-3">
        {value.map((item, i) => (
          <li key={i} className="rounded-xl border hairline bg-[var(--surface)] p-4">
            <div className="mb-3 flex items-center justify-between">
              <span className="label tnum muted">{String(i + 1).padStart(2, "0")}</span>
              <RowTools i={i} len={value.length} onMove={(d) => onChange(move(value, i, d))} onRemove={() => onChange(value.filter((_, j) => j !== i))} />
            </div>
            <div className="space-y-4">
              {sub.map((sf) => (
                <FieldInput
                  key={sf.name}
                  field={{ ...sf, name: `${field.name}-${i}-${sf.name}` }}
                  value={item[sf.name]}
                  onChange={(v) => onChange(value.map((it, j) => (j === i ? { ...it, [sf.name]: v } : it)))}
                />
              ))}
            </div>
          </li>
        ))}
      </ol>
      <button type="button" className="mt-3 inline-flex items-center gap-2 text-sm font-medium" onClick={() => onChange([...value, blank()])}>
        <Plus className="size-4" /> Adicionar
      </button>
      <Help text={field.help} />
    </fieldset>
  );
}

function MarkdownField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const [tab, setTab] = useState<"edit" | "preview">("edit");
  const ref = useRef<HTMLTextAreaElement>(null);
  const wrap = (before: string, after = "", placeholder = "texto") => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e } = el;
    const sel = value.slice(s, e) || placeholder;
    const next = value.slice(0, s) + before + sel + after + value.slice(e);
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, s + before.length + sel.length);
    });
  };
  const tools: [string, () => void][] = [
    ["H2", () => wrap("\n## ", "\n", "Subtítulo")],
    ["H3", () => wrap("\n### ", "\n", "Seção")],
    ["Negrito", () => wrap("**", "**")],
    ["Itálico", () => wrap("*", "*")],
    ["Lista", () => wrap("\n- ", "\n", "item")],
    ["Link", () => wrap("[", "](/servicos/)", "texto do link")],
    ["Citação", () => wrap("\n> ", "\n", "citação")],
  ];
  return (
    <div>
      <div className="mb-1.5 flex flex-wrap items-center justify-between gap-2">
        <span className="field-label !mb-0">{field.label}</span>
        <div className="flex rounded-full border hairline p-0.5 text-xs">
          {(["edit", "preview"] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={cx("rounded-full px-3 py-1", tab === t && "bg-tinta text-papel")}
              aria-pressed={tab === t}
            >
              {t === "edit" ? "Editar" : "Pré-visualizar"}
            </button>
          ))}
        </div>
      </div>
      {tab === "edit" ? (
        <>
          <div className="flex flex-wrap gap-1 rounded-t-[0.6rem] border border-b-0 hairline bg-[var(--surface)] p-1.5">
            {tools.map(([label, fn]) => (
              <button key={label} type="button" onClick={fn} className="rounded px-2.5 py-1 text-xs font-medium hover:bg-[var(--line)]">
                {label}
              </button>
            ))}
          </div>
          <textarea
            ref={ref}
            className="field !rounded-t-none min-h-[28rem] font-mono !text-[0.9rem] leading-relaxed"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            aria-label={field.label}
          />
        </>
      ) : (
        <div className="prose-bf min-h-[28rem] rounded-[0.6rem] border hairline bg-[var(--surface)] p-6">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{value || "_Sem conteúdo._"}</ReactMarkdown>
        </div>
      )}
      <Help text={field.help} />
    </div>
  );
}

function ImageField({ field, value, onChange }: { field: Field; value: string; onChange: (v: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  async function upload(file: File) {
    setBusy(true);
    setErr("");
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Falha no envio");
      onChange(data.url);
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Falha no envio");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div>
      <span className="field-label">{field.label}</span>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
        <div className="flex size-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border hairline bg-[var(--surface)]">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt="" className="size-full object-cover" />
          ) : (
            <span className="text-xs muted">Sem imagem</span>
          )}
        </div>
        <div className="flex-1 space-y-2">
          <input
            className="field !min-h-10 !py-2 text-sm"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="/api/media/... ou /images/..."
            aria-label={`${field.label} — endereço`}
          />
          <div className="flex flex-wrap items-center gap-3">
            <label className="btn btn-ghost !min-h-9 !px-4 !text-[0.7rem]">
              {busy ? "Enviando…" : "Enviar imagem"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/avif"
                className="sr-only"
                disabled={busy}
                onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
              />
            </label>
            {value && (
              <button type="button" className="text-sm underline underline-offset-2" onClick={() => onChange("")}>
                Remover
              </button>
            )}
          </div>
          {err && <p className="field-error">{err}</p>}
          <Help text={field.help || "JPG, PNG, WebP ou AVIF até 4 MB."} />
        </div>
      </div>
    </div>
  );
}
