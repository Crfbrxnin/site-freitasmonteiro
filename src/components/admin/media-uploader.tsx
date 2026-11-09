"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function MediaUploader() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");
  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    setBusy(true);
    setMsg("");
    let ok = 0;
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (res.ok) ok++;
      else setMsg((await res.json().catch(() => ({}))).error || "Falha no envio.");
    }
    setBusy(false);
    if (ok) router.refresh();
  }
  return (
    <div className="rounded-2xl border border-dashed hairline p-8 text-center">
      <label className="btn btn-primary cursor-pointer">
        {busy ? "Enviando…" : "Enviar imagens"}
        <input type="file" multiple accept="image/jpeg,image/png,image/webp,image/avif" className="sr-only" onChange={(e) => onFiles(e.target.files)} disabled={busy} />
      </label>
      <p className="mt-3 text-sm muted">JPG, PNG, WebP ou AVIF até 4 MB cada. As fotos são exibidas em preto e branco no site, como pede o manual.</p>
      {msg && <p className="field-error mt-2">{msg}</p>}
    </div>
  );
}
