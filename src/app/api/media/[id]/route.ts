import { getMedia } from "@/lib/repo";

export const runtime = "nodejs";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  if (!/^[a-z0-9]{16,40}$/.test(id)) return new Response("Not found", { status: 404 });
  const media = await getMedia(id);
  if (!media) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(media.data), {
    headers: {
      "content-type": media.mime,
      "cache-control": "public, max-age=31536000, immutable",
      "x-content-type-options": "nosniff",
      "content-security-policy": "default-src 'none'; style-src 'unsafe-inline'; sandbox",
    },
  });
}
