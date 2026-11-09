import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "@/lib/auth";
import { recordEvent } from "@/lib/repo";

export const runtime = "nodejs";

/** Métrica própria de conversão (cliques no WhatsApp). Não grava IP nem identificadores. */
export async function POST(req: NextRequest) {
  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "local";
  if (!rateLimit(`evt:${ip}`, 30, 60_000)) return new NextResponse(null, { status: 204 });
  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body || body.type !== "whatsapp_click") return new NextResponse(null, { status: 204 });
  await recordEvent({
    type: "whatsapp_click",
    path: String(body.path || "").replace(/[^\w\-/]/g, "").slice(0, 200),
    label: String(body.label || "").slice(0, 120),
    source: String(body.source || "").slice(0, 80),
  });
  return new NextResponse(null, { status: 204 });
}
