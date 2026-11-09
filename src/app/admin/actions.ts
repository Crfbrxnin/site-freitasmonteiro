"use server";

import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  clearRateLimit,
  createSession,
  destroySession,
  rateLimit,
  requireAdmin,
  requireUser,
} from "@/lib/auth";
import * as repo from "@/lib/repo";
import { GROUP_MAP, type Field } from "@/lib/settings-schema";
import { LANDING_FIELDS, SERVICE_FIELDS, postFields } from "@/lib/admin-schemas";
import { slugify } from "@/lib/utils";
import type { LandingData, LeadStatus, PostStatus, ServiceData } from "@/lib/types";

type State = { ok?: boolean; error?: string; message?: string; email?: string } | null;

/** Mantém apenas os campos do esquema e converte cada valor para o tipo esperado. */
function coerce(fields: Field[], raw: Record<string, unknown>): Record<string, any> {
  const out: Record<string, any> = {};
  for (const f of fields) {
    const v = raw?.[f.name];
    switch (f.type) {
      case "boolean":
        out[f.name] = Boolean(v);
        break;
      case "number":
        out[f.name] = Number.isFinite(Number(v)) ? Number(v) : 0;
        break;
      case "list":
        out[f.name] = Array.isArray(v) ? v.map((x) => String(x ?? "").trim().slice(0, 500)).filter(Boolean) : [];
        break;
      case "items":
        out[f.name] = Array.isArray(v)
          ? v
              .map((item) => coerce(f.fields || [], (item as Record<string, unknown>) || {}))
              .filter((item) => Object.values(item).some((x) => (typeof x === "string" ? x.trim() : x)))
          : [];
        break;
      case "url": {
        const s = String(v ?? "").trim().slice(0, 600);
        out[f.name] = s === "" || /^https:\/\//.test(s) ? s : "";
        break;
      }
      case "image": {
        const s = String(v ?? "").trim().slice(0, 600);
        out[f.name] = s === "" || /^(\/[\w\-./]+|https:\/\/)/.test(s) ? s : "";
        break;
      }
      case "markdown":
        out[f.name] = String(v ?? "").slice(0, 100_000);
        break;
      default:
        out[f.name] = String(v ?? "").trim().slice(0, f.type === "textarea" ? 5000 : 500);
    }
  }
  return out;
}

function payload(fd: FormData): Record<string, unknown> {
  try {
    return JSON.parse(String(fd.get("payload") || "{}"));
  } catch {
    return {};
  }
}

function refreshSite() {
  revalidatePath("/", "layout");
}

/* ───────────── Autenticação ───────────── */

export async function loginAction(_: State, fd: FormData): Promise<State> {
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const password = String(fd.get("password") || "");
  const ip = ((await headers()).get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  const key = `login:${ip}:${email}`;
  if (!rateLimit(key, 6, 15 * 60 * 1000) || !rateLimit(`login-ip:${ip}`, 30, 15 * 60 * 1000)) {
    return { error: "Muitas tentativas. Aguarde 15 minutos e tente novamente.", email };
  }
  const user = email ? await repo.getUserAuth(email) : null;
  // Compara mesmo sem usuário para não revelar quais e-mails existem.
  const ok = await bcrypt.compare(password, user?.passwordHash || "$2b$12$H.Sjs8632IMD6Vv9UzQMB.ff1c8aQfxCi7TbTXSZT/8/A.x7Pbhtm");
  if (!user || !ok) return { error: "E-mail ou senha inválidos.", email };
  clearRateLimit(key);
  await repo.touchLogin(user.id);
  await createSession(user);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function changePasswordAction(_: State, fd: FormData): Promise<State> {
  const me = await requireUser();
  const current = String(fd.get("current") || "");
  const next = String(fd.get("next") || "");
  const confirm = String(fd.get("confirm") || "");
  if (next.length < 10) return { error: "A nova senha precisa ter pelo menos 10 caracteres." };
  if (next !== confirm) return { error: "A confirmação não confere." };
  const user = await repo.getUserById(me.id);
  if (!user || !(await bcrypt.compare(current, user.passwordHash))) return { error: "Senha atual incorreta." };
  await repo.updateUserPassword(me.id, await bcrypt.hash(next, 12));
  const fresh = await repo.getUserById(me.id);
  if (fresh) await createSession(fresh);
  return { ok: true, message: "Senha alterada. Outras sessões foram encerradas." };
}

/* ───────────── Conteúdo (grupos) ───────────── */

export async function saveGroupAction(key: string, _: State, fd: FormData): Promise<State> {
  const group = GROUP_MAP[key];
  if (!group) return { error: "Grupo inválido." };
  if (group.adminOnly) await requireAdmin();
  else await requireUser();
  const data = coerce(group.fields, payload(fd));
  if (key === "contato") data.whatsapp = String(data.whatsapp || "").replace(/\D/g, "");
  if (key === "contato") data.state = String(data.state || "").toUpperCase().slice(0, 2);
  await repo.saveGroup(key, data);
  refreshSite();
  return { ok: true, message: "Alterações salvas e publicadas." };
}

/* ───────────── Serviços ───────────── */

export async function saveServiceAction(id: number | null, _: State, fd: FormData): Promise<State> {
  await requireUser();
  const d = coerce(SERVICE_FIELDS, payload(fd));
  if (!d.title) return { error: "Informe o nome do serviço." };
  const slug = slugify(d.slug || d.title);
  if (!slug) return { error: "URL inválida." };
  if (await repo.slugExists("services", slug, id)) return { error: "Já existe um serviço com esta URL." };
  const { title, active, position, slug: _s, ...rest } = d;
  const newId = await repo.saveService(id, { slug, title, active, position, data: rest as ServiceData });
  refreshSite();
  if (!id) redirect(`/admin/servicos/${newId}?criado=1`);
  return { ok: true, message: "Serviço salvo." };
}

export async function deleteServiceAction(fd: FormData) {
  await requireUser();
  await repo.deleteService(Number(fd.get("id")));
  refreshSite();
  redirect("/admin/servicos");
}

/* ───────────── Landing pages ───────────── */

export async function saveLandingAction(id: number | null, _: State, fd: FormData): Promise<State> {
  await requireUser();
  const d = coerce(LANDING_FIELDS, payload(fd));
  if (!d.title) return { error: "Informe o nome da landing page." };
  const slug = slugify(d.slug || d.title);
  if (await repo.slugExists("landing_pages", slug, id)) return { error: "Já existe uma landing page com esta URL." };
  const { title, active, slug: _s, ...rest } = d;
  const newId = await repo.saveLanding(id, { slug, title, active, data: rest as LandingData });
  refreshSite();
  if (!id) redirect(`/admin/landing-pages/${newId}?criado=1`);
  return { ok: true, message: "Landing page salva." };
}

export async function deleteLandingAction(fd: FormData) {
  await requireUser();
  await repo.deleteLanding(Number(fd.get("id")));
  refreshSite();
  redirect("/admin/landing-pages");
}

/* ───────────── Blog ───────────── */

export async function savePostAction(id: number | null, _: State, fd: FormData): Promise<State> {
  await requireUser();
  const [categories, services] = await Promise.all([repo.listCategories(), repo.listServices({ includeInactive: true })]);
  const d = coerce(postFields(categories, services), payload(fd));
  if (!d.title) return { error: "Informe o título do artigo." };
  const slug = slugify(d.slug || d.title);
  if (await repo.slugExists("posts", slug, id)) return { error: "Já existe um artigo com esta URL." };
  const status: PostStatus = d.status === "published" ? "published" : "draft";
  const date = d.publishedAt && !Number.isNaN(Date.parse(d.publishedAt)) ? new Date(d.publishedAt).toISOString() : new Date().toISOString();
  const categoryId = d.categoryId && categories.some((c) => String(c.id) === d.categoryId) ? Number(d.categoryId) : null;
  const newId = await repo.savePost(id, {
    slug,
    title: d.title,
    excerpt: d.excerpt,
    content: d.content,
    coverImage: d.coverImage,
    coverAlt: d.coverAlt,
    categoryId,
    author: d.author,
    status,
    publishedAt: date,
    metaTitle: d.metaTitle,
    metaDescription: d.metaDescription,
    serviceSlug: d.serviceSlug,
  });
  refreshSite();
  if (!id) redirect(`/admin/blog/${newId}?criado=1`);
  const scheduled = status === "published" && Date.parse(date) > Date.now();
  return {
    ok: true,
    message: status === "draft" ? "Rascunho salvo." : scheduled ? "Artigo programado." : "Artigo publicado.",
  };
}

export async function deletePostAction(fd: FormData) {
  await requireUser();
  await repo.deletePost(Number(fd.get("id")));
  refreshSite();
  redirect("/admin/blog");
}

/* ───────────── Categorias ───────────── */

export async function saveCategoryAction(fd: FormData) {
  await requireUser();
  const id = Number(fd.get("id")) || null;
  const name = String(fd.get("name") || "").trim().slice(0, 80);
  if (!name) redirect("/admin/categorias?erro=nome");
  const slug = slugify(String(fd.get("slug") || "") || name);
  if (await repo.slugExists("categories", slug, id)) redirect("/admin/categorias?erro=url");
  await repo.saveCategory(id, {
    slug,
    name,
    description: String(fd.get("description") || "").trim().slice(0, 300),
    position: Number(fd.get("position")) || 0,
  });
  refreshSite();
  redirect("/admin/categorias?ok=1");
}

export async function deleteCategoryAction(fd: FormData) {
  await requireUser();
  await repo.deleteCategory(Number(fd.get("id")));
  refreshSite();
  redirect("/admin/categorias?ok=1");
}

/* ───────────── Depoimentos ───────────── */

export async function saveTestimonialAction(fd: FormData) {
  await requireUser();
  const id = Number(fd.get("id")) || null;
  const name = String(fd.get("name") || "").trim().slice(0, 120);
  const text = String(fd.get("text") || "").trim().slice(0, 1200);
  if (!name || !text) redirect("/admin/depoimentos?erro=campos");
  await repo.saveTestimonial(id, {
    name,
    text,
    company: String(fd.get("company") || "").trim().slice(0, 160),
    authorized: fd.get("authorized") === "on",
    active: fd.get("active") === "on",
    position: Number(fd.get("position")) || 0,
  });
  refreshSite();
  redirect("/admin/depoimentos?ok=1");
}

export async function deleteTestimonialAction(fd: FormData) {
  await requireUser();
  await repo.deleteTestimonial(Number(fd.get("id")));
  refreshSite();
  redirect("/admin/depoimentos?ok=1");
}

/* ───────────── Leads ───────────── */

const STATUSES: LeadStatus[] = ["novo", "em_contato", "proposta", "cliente", "descartado"];

export async function updateLeadAction(fd: FormData) {
  await requireUser();
  const id = Number(fd.get("id"));
  const status = String(fd.get("status")) as LeadStatus;
  await repo.updateLead(id, {
    status: STATUSES.includes(status) ? status : "novo",
    notes: String(fd.get("notes") || "").slice(0, 5000),
  });
  revalidatePath("/admin/leads");
  redirect(`/admin/leads/${id}?ok=1`);
}

export async function deleteLeadAction(fd: FormData) {
  await requireAdmin();
  await repo.deleteLead(Number(fd.get("id")));
  revalidatePath("/admin/leads");
  redirect("/admin/leads?excluido=1");
}

/* ───────────── Mídia ───────────── */

export async function deleteMediaAction(fd: FormData) {
  await requireUser();
  await repo.deleteMedia(String(fd.get("id")));
  redirect("/admin/midia?ok=1");
}

/* ───────────── Usuários ───────────── */

export async function createUserAction(_: State, fd: FormData): Promise<State> {
  await requireAdmin();
  const email = String(fd.get("email") || "").trim().toLowerCase();
  const name = String(fd.get("name") || "").trim().slice(0, 120);
  const password = String(fd.get("password") || "");
  const role = fd.get("role") === "admin" ? "admin" : "editor";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: "E-mail inválido." };
  if (password.length < 10) return { error: "A senha precisa ter pelo menos 10 caracteres." };
  if (await repo.getUserAuth(email)) return { error: "Já existe um usuário com este e-mail." };
  await repo.createUser({ email, name, role, passwordHash: await bcrypt.hash(password, 12) });
  revalidatePath("/admin/usuarios");
  return { ok: true, message: "Usuário criado. Envie a senha por um canal seguro." };
}

export async function updateUserRoleAction(fd: FormData) {
  const me = await requireAdmin();
  const id = Number(fd.get("id"));
  if (id === me.id) redirect("/admin/usuarios?erro=proprio");
  await repo.updateUserRole(id, fd.get("role") === "admin" ? "admin" : "editor");
  redirect("/admin/usuarios?ok=1");
}

export async function deleteUserAction(fd: FormData) {
  const me = await requireAdmin();
  const id = Number(fd.get("id"));
  if (id === me.id) redirect("/admin/usuarios?erro=proprio");
  await repo.deleteUser(id);
  redirect("/admin/usuarios?ok=1");
}
