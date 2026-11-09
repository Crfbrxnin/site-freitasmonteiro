// Cria (ou redefine a senha de) um administrador direto no banco.
// Uso: npm run admin:create -- email@dominio.com.br "Nome"
// A senha é pedida no terminal e nunca fica salva em arquivo.
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";
import readline from "node:readline";
import path from "node:path";
import { existsSync, readFileSync } from "node:fs";

for (const f of [".env.local", ".env"]) {
  if (!existsSync(f)) continue;
  for (const line of readFileSync(f, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_]+)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^"|"$/g, "");
  }
}

const [email, name = "Administrador"] = process.argv.slice(2);
if (!email) {
  console.error("Uso: npm run admin:create -- email@dominio.com.br \"Nome\"");
  process.exit(1);
}
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
const password = await new Promise((r) => rl.question("Senha (mín. 10 caracteres): ", r));
rl.close();
if (password.length < 10) {
  console.error("Senha muito curta.");
  process.exit(1);
}
let url = process.env.DATABASE_URL || "file:./data/site.db";
if (url.startsWith("file:") && !path.isAbsolute(url.slice(5))) url = `file:${path.join(process.cwd(), url.slice(5))}`;
const db = createClient({ url, authToken: process.env.DATABASE_AUTH_TOKEN || undefined });
const exists = await db.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
if (!exists.rows.length) {
  console.error("Banco ainda não inicializado. Rode o site uma vez (npm run dev ou npm start) e tente novamente.");
  process.exit(1);
}
const hash = await bcrypt.hash(password, 12);
await db.execute({
  sql: `INSERT INTO users (email, name, password_hash, role) VALUES (?, ?, ?, 'admin')
        ON CONFLICT(email) DO UPDATE SET password_hash = excluded.password_hash, role = 'admin', session_version = session_version + 1`,
  args: [email.toLowerCase(), name, hash],
});
console.log(`Administrador ${email} pronto.`);
