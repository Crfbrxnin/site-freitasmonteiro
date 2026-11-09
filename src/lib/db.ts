import "server-only";
import { createClient, type Client, type InStatement } from "@libsql/client";
import { mkdirSync } from "node:fs";
import path from "node:path";
import bcrypt from "bcryptjs";
import { SEED_SERVICES } from "./seed-services";
import { SEED_CATEGORIES, SEED_LANDINGS, SEED_POSTS } from "./seed-content";

const SCHEMA_VERSION = 1;

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS meta (key TEXT PRIMARY KEY, value TEXT NOT NULL)`,
  `CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name TEXT NOT NULL DEFAULT '',
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'editor' CHECK (role IN ('admin','editor')),
    session_version INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    last_login_at TEXT
  )`,
  `CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  )`,
  `CREATE TABLE IF NOT EXISTS services (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    data TEXT NOT NULL,
    position INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  )`,
  `CREATE TABLE IF NOT EXISTS landing_pages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    data TEXT NOT NULL,
    active INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  )`,
  `CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT NOT NULL DEFAULT '',
    position INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    content TEXT NOT NULL DEFAULT '',
    cover_image TEXT NOT NULL DEFAULT '',
    cover_alt TEXT NOT NULL DEFAULT '',
    category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
    author TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published')),
    published_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    meta_title TEXT NOT NULL DEFAULT '',
    meta_description TEXT NOT NULL DEFAULT '',
    service_slug TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    updated_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  )`,
  `CREATE INDEX IF NOT EXISTS posts_pub ON posts (status, published_at)`,
  `CREATE TABLE IF NOT EXISTS testimonials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    company TEXT NOT NULL DEFAULT '',
    text TEXT NOT NULL,
    authorized INTEGER NOT NULL DEFAULT 0,
    active INTEGER NOT NULL DEFAULT 1,
    position INTEGER NOT NULL DEFAULT 0
  )`,
  `CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now')),
    form TEXT NOT NULL DEFAULT '',
    name TEXT NOT NULL,
    email TEXT NOT NULL DEFAULT '',
    phone TEXT NOT NULL DEFAULT '',
    company TEXT NOT NULL DEFAULT '',
    cnpj TEXT NOT NULL DEFAULT '',
    company_type TEXT NOT NULL DEFAULT '',
    company_size TEXT NOT NULL DEFAULT '',
    service TEXT NOT NULL DEFAULT '',
    message TEXT NOT NULL DEFAULT '',
    page TEXT NOT NULL DEFAULT '',
    referrer TEXT NOT NULL DEFAULT '',
    utm_source TEXT NOT NULL DEFAULT '',
    utm_medium TEXT NOT NULL DEFAULT '',
    utm_campaign TEXT NOT NULL DEFAULT '',
    utm_term TEXT NOT NULL DEFAULT '',
    utm_content TEXT NOT NULL DEFAULT '',
    consent_at TEXT NOT NULL DEFAULT '',
    status TEXT NOT NULL DEFAULT 'novo',
    notes TEXT NOT NULL DEFAULT '',
    delivery TEXT NOT NULL DEFAULT ''
  )`,
  `CREATE INDEX IF NOT EXISTS leads_created ON leads (created_at)`,
  `CREATE TABLE IF NOT EXISTS media (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    mime TEXT NOT NULL,
    size INTEGER NOT NULL,
    data BLOB NOT NULL,
    alt TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  )`,
  `CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    type TEXT NOT NULL,
    path TEXT NOT NULL DEFAULT '',
    label TEXT NOT NULL DEFAULT '',
    source TEXT NOT NULL DEFAULT '',
    created_at TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ','now'))
  )`,
  `CREATE INDEX IF NOT EXISTS events_type ON events (type, created_at)`,
];

function resolveUrl(): string {
  const url = process.env.DATABASE_URL || "file:./data/site.db";
  if (url.startsWith("file:")) {
    const file = url.slice(5);
    const abs = path.isAbsolute(file) ? file : path.join(/* turbopackIgnore: true */ process.cwd(), file);
    mkdirSync(path.dirname(abs), { recursive: true });
    return `file:${abs}`;
  }
  return url;
}

type Global = { __bfDb?: Client; __bfReady?: Promise<void> };
const g = globalThis as unknown as Global;

function client(): Client {
  if (!g.__bfDb) {
    g.__bfDb = createClient({ url: resolveUrl(), authToken: process.env.DATABASE_AUTH_TOKEN || undefined });
  }
  return g.__bfDb;
}

async function migrateAndSeed(c: Client) {
  const isFile = resolveUrl().startsWith("file:");
  if (isFile) {
    await c.execute("PRAGMA busy_timeout = 8000");
    await c.execute("PRAGMA journal_mode = WAL").catch(() => undefined);
  }
  await c.execute("PRAGMA foreign_keys = ON");
  await c.batch(SCHEMA, "write");

  const seeded = await c.execute({ sql: "SELECT value FROM meta WHERE key = 'seeded'", args: [] });
  if (seeded.rows.length === 0) {
    const stmts: InStatement[] = [
      { sql: "INSERT OR IGNORE INTO meta (key, value) VALUES ('seeded', ?)", args: [new Date().toISOString()] },
      { sql: "INSERT OR REPLACE INTO meta (key, value) VALUES ('schema_version', ?)", args: [String(SCHEMA_VERSION)] },
    ];
    SEED_SERVICES.forEach(({ slug, title, ...data }, i) =>
      stmts.push({
        sql: "INSERT OR IGNORE INTO services (slug, title, data, position) VALUES (?, ?, ?, ?)",
        args: [slug, title, JSON.stringify(data), i + 1],
      }),
    );
    SEED_LANDINGS.forEach(({ slug, title, ...data }) =>
      stmts.push({
        sql: "INSERT OR IGNORE INTO landing_pages (slug, title, data) VALUES (?, ?, ?)",
        args: [slug, title, JSON.stringify(data)],
      }),
    );
    SEED_CATEGORIES.forEach((cat, i) =>
      stmts.push({
        sql: "INSERT OR IGNORE INTO categories (slug, name, description, position) VALUES (?, ?, ?, ?)",
        args: [cat.slug, cat.name, cat.description, i + 1],
      }),
    );
    SEED_POSTS.forEach((p) =>
      stmts.push({
        sql: `INSERT OR IGNORE INTO posts (slug, title, excerpt, content, cover_image, cover_alt, category_id, author, status,
                published_at, meta_title, meta_description, service_slug)
              VALUES (?, ?, ?, ?, ?, ?, (SELECT id FROM categories WHERE slug = ?), ?, 'published', ?, ?, ?, ?)`,
        args: [p.slug, p.title, p.excerpt, p.content, p.coverImage, p.coverAlt, p.category, "Bruno Freitas", p.publishedAt, p.metaTitle, p.metaDescription, p.serviceSlug],
      }),
    );
    await c.batch(stmts, "write");
  }

  // Primeiro administrador, a partir das variáveis de ambiente (somente se não houver usuários).
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (email && password) {
    const count = await c.execute("SELECT COUNT(*) AS n FROM users");
    if (Number(count.rows[0].n) === 0) {
      if (password.length < 10) {
        console.warn("[admin] ADMIN_PASSWORD precisa ter pelo menos 10 caracteres. Usuário não criado.");
      } else {
        const hash = await bcrypt.hash(password, 12);
        await c.execute({
          sql: "INSERT OR IGNORE INTO users (email, name, password_hash, role) VALUES (?, ?, ?, 'admin')",
          args: [email, "Administrador", hash],
        });
      }
    }
  }
}

/** Retorna o cliente do banco já migrado e com o conteúdo inicial. */
export async function db(): Promise<Client> {
  const c = client();
  if (!g.__bfReady) {
    g.__bfReady = migrateAndSeed(c).catch((err) => {
      g.__bfReady = undefined;
      throw err;
    });
  }
  await g.__bfReady;
  return c;
}

export function isRemoteDb() {
  return !resolveUrl().startsWith("file:");
}
