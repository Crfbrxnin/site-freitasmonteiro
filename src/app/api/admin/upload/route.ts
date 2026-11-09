import { randomBytes } from "node:crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { insertMedia } from "@/lib/repo";

export const runtime = "nodejs";

const MAX = 4 * 1024 * 1024;

/** Confere a assinatura do arquivo (não confia apenas no tipo informado pelo navegador). SVG não é aceito. */
function sniff(b: Uint8Array): string | null {
  if (b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff) return "image/jpeg";
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) return "image/png";
  const ascii = (s: number, e: number) => String.fromCharCode(...b.slice(s, e));
  if (ascii(0, 4) === "RIFF" && ascii(8, 12) === "WEBP") return "image/webp";
  if (ascii(4, 8) === "ftyp" && /avif|avis/.test(ascii(8, 12))) return "image/avif";
  return null;
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Sessão expirada. Entre novamente." }, { status: 401 });
  const origin = req.headers.get("origin");
  if (origin && new URL(origin).host !== req.headers.get("host")) {
    return NextResponse.json({ error: "Origem não permitida." }, { status: 403 });
  }
  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  if (file.size > MAX) return NextResponse.json({ error: "Arquivo maior que 4 MB. Reduza a imagem e tente novamente." }, { status: 413 });
  const bytes = new Uint8Array(await file.arrayBuffer());
  const mime = sniff(bytes);
  if (!mime) return NextResponse.json({ error: "Formato não aceito. Use JPG, PNG, WebP ou AVIF." }, { status: 415 });
  const id = randomBytes(12).toString("hex");
  await insertMedia({ id, filename: file.name.slice(0, 160), mime, data: bytes, alt: String(form?.get("alt") || "").slice(0, 200) });
  return NextResponse.json({ url: `/api/media/${id}`, id });
}
