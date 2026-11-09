import "server-only";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SignJWT, jwtVerify } from "jose";
import { randomBytes } from "node:crypto";
import { getUserById } from "./repo";
import type { Role } from "./types";

const COOKIE = "bf_session";
const MAX_AGE = 60 * 60 * 8; // 8 horas

type G = { __bfDevSecret?: Uint8Array };
const g = globalThis as unknown as G;

function secret(): Uint8Array {
  const env = process.env.SESSION_SECRET;
  if (env && env.length >= 32) return new TextEncoder().encode(env);
  if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
    throw new Error("SESSION_SECRET ausente ou curto (mínimo 32 caracteres). Configure-o nas variáveis de ambiente.");
  }
  // Desenvolvimento: segredo aleatório por processo (as sessões expiram ao reiniciar).
  g.__bfDevSecret ??= randomBytes(48);
  return g.__bfDevSecret;
}

export async function createSession(user: { id: number; role: Role; sessionVersion: number }) {
  const token = await new SignJWT({ role: user.role, v: user.sessionVersion })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime(`${MAX_AGE}s`)
    .sign(secret());
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE,
  });
}

export async function destroySession() {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export type SessionUser = { id: number; email: string; name: string; role: Role };

/** Lê e valida a sessão (assinatura, expiração e versão — trocar a senha derruba sessões antigas). */
export async function getSessionUser(): Promise<SessionUser | null> {
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, secret(), { algorithms: ["HS256"] });
    const user = await getUserById(Number(payload.sub));
    if (!user || user.sessionVersion !== Number(payload.v)) return null;
    return { id: user.id, email: user.email, name: user.name, role: user.role };
  } catch {
    return null;
  }
}

export async function requireUser(): Promise<SessionUser> {
  const user = await getSessionUser();
  if (!user) redirect("/admin/login");
  return user;
}

export async function requireAdmin(): Promise<SessionUser> {
  const user = await requireUser();
  if (user.role !== "admin") redirect("/admin?erro=permissao");
  return user;
}

/* Limite simples de tentativas (memória do processo). Em múltiplas instâncias, use um serviço externo. */
type Bucket = { count: number; reset: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const b = buckets.get(key);
  if (!b || b.reset < now) {
    buckets.set(key, { count: 1, reset: now + windowMs });
    if (buckets.size > 5000) for (const [k, v] of buckets) if (v.reset < now) buckets.delete(k);
    return true;
  }
  b.count += 1;
  return b.count <= max;
}

export function clearRateLimit(key: string) {
  buckets.delete(key);
}
