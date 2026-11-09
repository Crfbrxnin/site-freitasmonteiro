import "server-only";
import type { Row } from "@libsql/client";
import { db } from "./db";
import { GROUP_MAP } from "./settings-schema";
import type {
  Category,
  Landing,
  LandingData,
  Lead,
  LeadStatus,
  Post,
  Service,
  ServiceData,
  Testimonial,
  User,
} from "./types";

const s = (v: unknown) => (v == null ? "" : String(v));
const n = (v: unknown) => Number(v ?? 0);
const nowIso = () => new Date().toISOString();

/* ───────────── Settings ───────────── */

export async function getGroup<T = Record<string, any>>(key: string): Promise<T> {
  const group = GROUP_MAP[key];
  if (!group) throw new Error(`Grupo de conteúdo desconhecido: ${key}`);
  const c = await db();
  const r = await c.execute({ sql: "SELECT value FROM settings WHERE key = ?", args: [key] });
  let stored: Record<string, unknown> = {};
  if (r.rows[0]) {
    try {
      stored = JSON.parse(s(r.rows[0].value));
    } catch {
      stored = {};
    }
  }
  return { ...group.defaults, ...stored } as T;
}

export async function saveGroup(key: string, value: Record<string, unknown>) {
  const c = await db();
  await c.execute({
    sql: `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
          ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`,
    args: [key, JSON.stringify(value), nowIso()],
  });
}

/* ───────────── Services ───────────── */

function rowToService(r: Row): Service {
  const data = JSON.parse(s(r.data)) as ServiceData;
  return {
    ...data,
    id: n(r.id),
    slug: s(r.slug),
    title: s(r.title),
    position: n(r.position),
    active: n(r.active) === 1,
    updatedAt: s(r.updated_at),
  };
}

export async function listServices(opts: { includeInactive?: boolean } = {}) {
  const c = await db();
  const r = await c.execute(
    `SELECT * FROM services ${opts.includeInactive ? "" : "WHERE active = 1"} ORDER BY position, id`,
  );
  return r.rows.map(rowToService);
}

export async function getService(slugOrId: string | number, opts: { includeInactive?: boolean } = {}) {
  const c = await db();
  const byId = typeof slugOrId === "number";
  const r = await c.execute({
    sql: `SELECT * FROM services WHERE ${byId ? "id" : "slug"} = ? ${opts.includeInactive ? "" : "AND active = 1"}`,
    args: [slugOrId],
  });
  return r.rows[0] ? rowToService(r.rows[0]) : null;
}

export async function saveService(
  id: number | null,
  v: { slug: string; title: string; position: number; active: boolean; data: ServiceData },
) {
  const c = await db();
  if (id) {
    await c.execute({
      sql: "UPDATE services SET slug = ?, title = ?, data = ?, position = ?, active = ?, updated_at = ? WHERE id = ?",
      args: [v.slug, v.title, JSON.stringify(v.data), v.position, v.active ? 1 : 0, nowIso(), id],
    });
    return id;
  }
  const r = await c.execute({
    sql: "INSERT INTO services (slug, title, data, position, active) VALUES (?, ?, ?, ?, ?)",
    args: [v.slug, v.title, JSON.stringify(v.data), v.position, v.active ? 1 : 0],
  });
  return Number(r.lastInsertRowid);
}

export async function deleteService(id: number) {
  const c = await db();
  await c.execute({ sql: "DELETE FROM services WHERE id = ?", args: [id] });
}

/* ───────────── Landing pages ───────────── */

function rowToLanding(r: Row): Landing {
  const data = JSON.parse(s(r.data)) as LandingData;
  return { ...data, id: n(r.id), slug: s(r.slug), title: s(r.title), active: n(r.active) === 1, updatedAt: s(r.updated_at) };
}

export async function listLandings(opts: { includeInactive?: boolean } = {}) {
  const c = await db();
  const r = await c.execute(`SELECT * FROM landing_pages ${opts.includeInactive ? "" : "WHERE active = 1"} ORDER BY id`);
  return r.rows.map(rowToLanding);
}

export async function getLanding(slugOrId: string | number, opts: { includeInactive?: boolean } = {}) {
  const c = await db();
  const byId = typeof slugOrId === "number";
  const r = await c.execute({
    sql: `SELECT * FROM landing_pages WHERE ${byId ? "id" : "slug"} = ? ${opts.includeInactive ? "" : "AND active = 1"}`,
    args: [slugOrId],
  });
  return r.rows[0] ? rowToLanding(r.rows[0]) : null;
}

export async function saveLanding(id: number | null, v: { slug: string; title: string; active: boolean; data: LandingData }) {
  const c = await db();
  if (id) {
    await c.execute({
      sql: "UPDATE landing_pages SET slug = ?, title = ?, data = ?, active = ?, updated_at = ? WHERE id = ?",
      args: [v.slug, v.title, JSON.stringify(v.data), v.active ? 1 : 0, nowIso(), id],
    });
    return id;
  }
  const r = await c.execute({
    sql: "INSERT INTO landing_pages (slug, title, data, active) VALUES (?, ?, ?, ?)",
    args: [v.slug, v.title, JSON.stringify(v.data), v.active ? 1 : 0],
  });
  return Number(r.lastInsertRowid);
}

export async function deleteLanding(id: number) {
  const c = await db();
  await c.execute({ sql: "DELETE FROM landing_pages WHERE id = ?", args: [id] });
}

/* ───────────── Categories ───────────── */

export async function listCategories(): Promise<Category[]> {
  const c = await db();
  const r = await c.execute({
    sql: `SELECT c.*, (SELECT COUNT(*) FROM posts p WHERE p.category_id = c.id AND p.status = 'published' AND p.published_at <= ?) AS post_count
          FROM categories c ORDER BY position, name`,
    args: [nowIso()],
  });
  return r.rows.map((row) => ({
    id: n(row.id),
    slug: s(row.slug),
    name: s(row.name),
    description: s(row.description),
    position: n(row.position),
    postCount: n(row.post_count),
  }));
}

export async function getCategory(slug: string) {
  return (await listCategories()).find((c) => c.slug === slug) ?? null;
}

export async function saveCategory(id: number | null, v: { slug: string; name: string; description: string; position: number }) {
  const c = await db();
  if (id) {
    await c.execute({
      sql: "UPDATE categories SET slug = ?, name = ?, description = ?, position = ? WHERE id = ?",
      args: [v.slug, v.name, v.description, v.position, id],
    });
  } else {
    await c.execute({
      sql: "INSERT INTO categories (slug, name, description, position) VALUES (?, ?, ?, ?)",
      args: [v.slug, v.name, v.description, v.position],
    });
  }
}

export async function deleteCategory(id: number) {
  const c = await db();
  await c.batch(
    [
      { sql: "UPDATE posts SET category_id = NULL WHERE category_id = ?", args: [id] },
      { sql: "DELETE FROM categories WHERE id = ?", args: [id] },
    ],
    "write",
  );
}

/* ───────────── Posts ───────────── */

const POST_SELECT = `SELECT p.*, c.name AS category_name, c.slug AS category_slug FROM posts p LEFT JOIN categories c ON c.id = p.category_id`;

function rowToPost(r: Row): Post {
  return {
    id: n(r.id),
    slug: s(r.slug),
    title: s(r.title),
    excerpt: s(r.excerpt),
    content: s(r.content),
    coverImage: s(r.cover_image),
    coverAlt: s(r.cover_alt),
    categoryId: r.category_id == null ? null : n(r.category_id),
    categoryName: r.category_name == null ? null : s(r.category_name),
    categorySlug: r.category_slug == null ? null : s(r.category_slug),
    author: s(r.author),
    status: s(r.status) as Post["status"],
    publishedAt: s(r.published_at),
    metaTitle: s(r.meta_title),
    metaDescription: s(r.meta_description),
    serviceSlug: s(r.service_slug),
    createdAt: s(r.created_at),
    updatedAt: s(r.updated_at),
  };
}

export async function listPublishedPosts(opts: { q?: string; category?: string; page?: number; perPage?: number; excludeId?: number } = {}) {
  const c = await db();
  const where = ["p.status = 'published'", "p.published_at <= ?"];
  const args: (string | number)[] = [nowIso()];
  if (opts.category) {
    where.push("c.slug = ?");
    args.push(opts.category);
  }
  if (opts.q) {
    where.push("(p.title LIKE ? OR p.excerpt LIKE ? OR p.content LIKE ?)");
    const like = `%${opts.q.replace(/[%_]/g, "")}%`;
    args.push(like, like, like);
  }
  if (opts.excludeId) {
    where.push("p.id <> ?");
    args.push(opts.excludeId);
  }
  const perPage = opts.perPage ?? 9;
  const page = Math.max(1, opts.page ?? 1);
  const whereSql = `WHERE ${where.join(" AND ")}`;
  const [rows, total] = await Promise.all([
    c.execute({
      sql: `${POST_SELECT} ${whereSql} ORDER BY p.published_at DESC LIMIT ? OFFSET ?`,
      args: [...args, perPage, (page - 1) * perPage],
    }),
    c.execute({ sql: `SELECT COUNT(*) AS n FROM posts p LEFT JOIN categories c ON c.id = p.category_id ${whereSql}`, args }),
  ]);
  const count = n(total.rows[0].n);
  return { posts: rows.rows.map(rowToPost), total: count, page, pages: Math.max(1, Math.ceil(count / perPage)) };
}

export async function getPublishedPost(slug: string) {
  const c = await db();
  const r = await c.execute({
    sql: `${POST_SELECT} WHERE p.slug = ? AND p.status = 'published' AND p.published_at <= ?`,
    args: [slug, nowIso()],
  });
  return r.rows[0] ? rowToPost(r.rows[0]) : null;
}

export async function getRelatedPosts(post: Post, limit = 3) {
  const c = await db();
  const r = await c.execute({
    sql: `${POST_SELECT} WHERE p.status = 'published' AND p.published_at <= ? AND p.id <> ?
          ORDER BY (p.category_id IS ?) DESC, p.published_at DESC LIMIT ?`,
    args: [nowIso(), post.id, post.categoryId, limit],
  });
  return r.rows.map(rowToPost);
}

export async function listAllPosts() {
  const c = await db();
  const r = await c.execute(`${POST_SELECT} ORDER BY p.published_at DESC`);
  return r.rows.map(rowToPost);
}

export async function getPostById(id: number) {
  const c = await db();
  const r = await c.execute({ sql: `${POST_SELECT} WHERE p.id = ?`, args: [id] });
  return r.rows[0] ? rowToPost(r.rows[0]) : null;
}

export type PostInput = Omit<Post, "id" | "categoryName" | "categorySlug" | "createdAt" | "updatedAt">;

export async function savePost(id: number | null, v: PostInput) {
  const c = await db();
  const args = [
    v.slug, v.title, v.excerpt, v.content, v.coverImage, v.coverAlt, v.categoryId, v.author, v.status,
    v.publishedAt, v.metaTitle, v.metaDescription, v.serviceSlug,
  ];
  if (id) {
    await c.execute({
      sql: `UPDATE posts SET slug=?, title=?, excerpt=?, content=?, cover_image=?, cover_alt=?, category_id=?, author=?, status=?,
            published_at=?, meta_title=?, meta_description=?, service_slug=?, updated_at=? WHERE id = ?`,
      args: [...args, nowIso(), id],
    });
    return id;
  }
  const r = await c.execute({
    sql: `INSERT INTO posts (slug, title, excerpt, content, cover_image, cover_alt, category_id, author, status, published_at,
          meta_title, meta_description, service_slug) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args,
  });
  return Number(r.lastInsertRowid);
}

export async function deletePost(id: number) {
  const c = await db();
  await c.execute({ sql: "DELETE FROM posts WHERE id = ?", args: [id] });
}

export async function slugExists(table: "posts" | "services" | "landing_pages" | "categories", slug: string, exceptId?: number | null) {
  const c = await db();
  const r = await c.execute({ sql: `SELECT id FROM ${table} WHERE slug = ? AND id <> ?`, args: [slug, exceptId ?? 0] });
  return r.rows.length > 0;
}

/* ───────────── Testimonials ───────────── */

function rowToTestimonial(r: Row): Testimonial {
  return {
    id: n(r.id),
    name: s(r.name),
    company: s(r.company),
    text: s(r.text),
    authorized: n(r.authorized) === 1,
    active: n(r.active) === 1,
    position: n(r.position),
  };
}

/** Depoimentos exibidos no site: somente ativos E com autorização registrada. */
export async function listPublicTestimonials() {
  const c = await db();
  const r = await c.execute("SELECT * FROM testimonials WHERE active = 1 AND authorized = 1 ORDER BY position, id");
  return r.rows.map(rowToTestimonial);
}

export async function listTestimonials() {
  const c = await db();
  const r = await c.execute("SELECT * FROM testimonials ORDER BY position, id");
  return r.rows.map(rowToTestimonial);
}

export async function saveTestimonial(id: number | null, v: Omit<Testimonial, "id">) {
  const c = await db();
  const args = [v.name, v.company, v.text, v.authorized ? 1 : 0, v.active ? 1 : 0, v.position];
  if (id) {
    await c.execute({
      sql: "UPDATE testimonials SET name=?, company=?, text=?, authorized=?, active=?, position=? WHERE id = ?",
      args: [...args, id],
    });
  } else {
    await c.execute({ sql: "INSERT INTO testimonials (name, company, text, authorized, active, position) VALUES (?,?,?,?,?,?)", args });
  }
}

export async function deleteTestimonial(id: number) {
  const c = await db();
  await c.execute({ sql: "DELETE FROM testimonials WHERE id = ?", args: [id] });
}

/* ───────────── Leads ───────────── */

function rowToLead(r: Row): Lead {
  return {
    id: n(r.id),
    createdAt: s(r.created_at),
    form: s(r.form),
    name: s(r.name),
    email: s(r.email),
    phone: s(r.phone),
    company: s(r.company),
    cnpj: s(r.cnpj),
    companyType: s(r.company_type),
    companySize: s(r.company_size),
    service: s(r.service),
    message: s(r.message),
    page: s(r.page),
    referrer: s(r.referrer),
    utmSource: s(r.utm_source),
    utmMedium: s(r.utm_medium),
    utmCampaign: s(r.utm_campaign),
    utmTerm: s(r.utm_term),
    utmContent: s(r.utm_content),
    consentAt: s(r.consent_at),
    status: s(r.status) as LeadStatus,
    notes: s(r.notes),
    delivery: s(r.delivery),
  };
}

export type LeadInput = Omit<Lead, "id" | "createdAt" | "status" | "notes" | "delivery">;

export async function insertLead(v: LeadInput) {
  const c = await db();
  const r = await c.execute({
    sql: `INSERT INTO leads (form, name, email, phone, company, cnpj, company_type, company_size, service, message, page, referrer,
          utm_source, utm_medium, utm_campaign, utm_term, utm_content, consent_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    args: [
      v.form, v.name, v.email, v.phone, v.company, v.cnpj, v.companyType, v.companySize, v.service, v.message, v.page, v.referrer,
      v.utmSource, v.utmMedium, v.utmCampaign, v.utmTerm, v.utmContent, v.consentAt,
    ],
  });
  return Number(r.lastInsertRowid);
}

export async function setLeadDelivery(id: number, delivery: string) {
  const c = await db();
  await c.execute({ sql: "UPDATE leads SET delivery = ? WHERE id = ?", args: [delivery, id] });
}

export async function listLeads(opts: { status?: string; q?: string; limit?: number; offset?: number } = {}) {
  const c = await db();
  const where: string[] = [];
  const args: (string | number)[] = [];
  if (opts.status) {
    where.push("status = ?");
    args.push(opts.status);
  }
  if (opts.q) {
    where.push("(name LIKE ? OR email LIKE ? OR phone LIKE ? OR company LIKE ?)");
    const like = `%${opts.q}%`;
    args.push(like, like, like, like);
  }
  const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
  const [rows, total] = await Promise.all([
    c.execute({
      sql: `SELECT * FROM leads ${whereSql} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      args: [...args, opts.limit ?? 50, opts.offset ?? 0],
    }),
    c.execute({ sql: `SELECT COUNT(*) AS n FROM leads ${whereSql}`, args }),
  ]);
  return { leads: rows.rows.map(rowToLead), total: n(total.rows[0].n) };
}

export async function getLead(id: number) {
  const c = await db();
  const r = await c.execute({ sql: "SELECT * FROM leads WHERE id = ?", args: [id] });
  return r.rows[0] ? rowToLead(r.rows[0]) : null;
}

export async function updateLead(id: number, v: { status: LeadStatus; notes: string }) {
  const c = await db();
  await c.execute({ sql: "UPDATE leads SET status = ?, notes = ? WHERE id = ?", args: [v.status, v.notes, id] });
}

export async function deleteLead(id: number) {
  const c = await db();
  await c.execute({ sql: "DELETE FROM leads WHERE id = ?", args: [id] });
}

/* ───────────── Events (métricas próprias, sem dados pessoais) ───────────── */

export async function recordEvent(v: { type: string; path: string; label: string; source: string }) {
  const c = await db();
  await c.execute({
    sql: "INSERT INTO events (type, path, label, source) VALUES (?, ?, ?, ?)",
    args: [v.type.slice(0, 40), v.path.slice(0, 200), v.label.slice(0, 120), v.source.slice(0, 80)],
  });
}

export async function getMetrics(days = 30) {
  const c = await db();
  const since = new Date(Date.now() - days * 864e5).toISOString();
  const [leadsTotal, leadsPeriod, byForm, bySource, byStatus, waClicks, waByPath, byDay] = await Promise.all([
    c.execute("SELECT COUNT(*) AS n FROM leads"),
    c.execute({ sql: "SELECT COUNT(*) AS n FROM leads WHERE created_at >= ?", args: [since] }),
    c.execute({ sql: "SELECT form AS k, COUNT(*) AS n FROM leads WHERE created_at >= ? GROUP BY form ORDER BY n DESC", args: [since] }),
    c.execute({
      sql: "SELECT COALESCE(NULLIF(utm_source, ''), 'direto / orgânico') AS k, COUNT(*) AS n FROM leads WHERE created_at >= ? GROUP BY k ORDER BY n DESC LIMIT 8",
      args: [since],
    }),
    c.execute("SELECT status AS k, COUNT(*) AS n FROM leads GROUP BY status"),
    c.execute({ sql: "SELECT COUNT(*) AS n FROM events WHERE type = 'whatsapp_click' AND created_at >= ?", args: [since] }),
    c.execute({
      sql: "SELECT path AS k, COUNT(*) AS n FROM events WHERE type = 'whatsapp_click' AND created_at >= ? GROUP BY path ORDER BY n DESC LIMIT 8",
      args: [since],
    }),
    c.execute({
      sql: `SELECT substr(created_at, 1, 10) AS d, SUM(CASE WHEN type='whatsapp_click' THEN 1 ELSE 0 END) AS wa, 0 AS leads
            FROM events WHERE created_at >= ? GROUP BY d
            UNION ALL SELECT substr(created_at, 1, 10) AS d, 0 AS wa, COUNT(*) AS leads FROM leads WHERE created_at >= ? GROUP BY d`,
      args: [since, since],
    }),
  ]);
  const kv = (rows: Row[]) => rows.map((r) => ({ key: s(r.k), count: n(r.n) }));
  const days_: Record<string, { wa: number; leads: number }> = {};
  for (const r of byDay.rows) {
    const d = s(r.d);
    days_[d] ??= { wa: 0, leads: 0 };
    days_[d].wa += n(r.wa);
    days_[d].leads += n(r.leads);
  }
  return {
    days,
    leadsTotal: n(leadsTotal.rows[0].n),
    leadsPeriod: n(leadsPeriod.rows[0].n),
    whatsappClicks: n(waClicks.rows[0].n),
    byForm: kv(byForm.rows),
    bySource: kv(bySource.rows),
    byStatus: kv(byStatus.rows),
    whatsappByPath: kv(waByPath.rows),
    daily: days_,
  };
}

/* ───────────── Media ───────────── */

export async function insertMedia(v: { id: string; filename: string; mime: string; data: Uint8Array; alt: string }) {
  const c = await db();
  await c.execute({
    sql: "INSERT INTO media (id, filename, mime, size, data, alt) VALUES (?, ?, ?, ?, ?, ?)",
    args: [v.id, v.filename, v.mime, v.data.byteLength, v.data, v.alt],
  });
}

export async function getMedia(id: string) {
  const c = await db();
  const r = await c.execute({ sql: "SELECT mime, data FROM media WHERE id = ?", args: [id] });
  if (!r.rows[0]) return null;
  return { mime: s(r.rows[0].mime), data: r.rows[0].data as ArrayBuffer };
}

export async function listMedia() {
  const c = await db();
  const r = await c.execute("SELECT id, filename, mime, size, alt, created_at FROM media ORDER BY created_at DESC");
  return r.rows.map((row) => ({
    id: s(row.id),
    filename: s(row.filename),
    mime: s(row.mime),
    size: n(row.size),
    alt: s(row.alt),
    createdAt: s(row.created_at),
    url: `/api/media/${s(row.id)}`,
  }));
}

export async function deleteMedia(id: string) {
  const c = await db();
  await c.execute({ sql: "DELETE FROM media WHERE id = ?", args: [id] });
}

/* ───────────── Users ───────────── */

function rowToUser(r: Row): User {
  return {
    id: n(r.id),
    email: s(r.email),
    name: s(r.name),
    role: s(r.role) as User["role"],
    createdAt: s(r.created_at),
    lastLoginAt: r.last_login_at == null ? null : s(r.last_login_at),
  };
}

export async function listUsers() {
  const c = await db();
  const r = await c.execute("SELECT * FROM users ORDER BY id");
  return r.rows.map(rowToUser);
}

export async function countUsers() {
  const c = await db();
  const r = await c.execute("SELECT COUNT(*) AS n FROM users");
  return n(r.rows[0].n);
}

export async function getUserAuth(email: string) {
  const c = await db();
  const r = await c.execute({ sql: "SELECT * FROM users WHERE email = ?", args: [email] });
  if (!r.rows[0]) return null;
  return { ...rowToUser(r.rows[0]), passwordHash: s(r.rows[0].password_hash), sessionVersion: n(r.rows[0].session_version) };
}

export async function getUserById(id: number) {
  const c = await db();
  const r = await c.execute({ sql: "SELECT * FROM users WHERE id = ?", args: [id] });
  if (!r.rows[0]) return null;
  return { ...rowToUser(r.rows[0]), sessionVersion: n(r.rows[0].session_version), passwordHash: s(r.rows[0].password_hash) };
}

export async function createUser(v: { email: string; name: string; passwordHash: string; role: User["role"] }) {
  const c = await db();
  await c.execute({
    sql: "INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, ?)",
    args: [v.email, v.name, v.passwordHash, v.role],
  });
}

export async function updateUserPassword(id: number, passwordHash: string) {
  const c = await db();
  await c.execute({
    sql: "UPDATE users SET password_hash = ?, session_version = session_version + 1 WHERE id = ?",
    args: [passwordHash, id],
  });
}

export async function updateUserRole(id: number, role: User["role"]) {
  const c = await db();
  await c.execute({ sql: "UPDATE users SET role = ?, session_version = session_version + 1 WHERE id = ?", args: [role, id] });
}

export async function deleteUser(id: number) {
  const c = await db();
  await c.execute({ sql: "DELETE FROM users WHERE id = ?", args: [id] });
}

export async function touchLogin(id: number) {
  const c = await db();
  await c.execute({ sql: "UPDATE users SET last_login_at = ? WHERE id = ?", args: [nowIso(), id] });
}
