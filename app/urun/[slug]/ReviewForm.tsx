"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

type Metric = { key: string; label: string };

export default function ReviewForm({ productSlug, metricSchema }: { productSlug: string; metricSchema: Metric[] }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [overallRating, setOverallRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [usageDuration, setUsageDuration] = useState("");
  const [metricScores, setMetricScores] = useState<Record<string, number>>(Object.fromEntries(metricSchema.map((m) => [m.key, 5])));
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(""); setLoading(true);

    let receiptUrl: string | undefined;

    if (receiptFile) {
      const fd = new FormData();
      fd.append("file", receiptFile);
      const uploadRes = await fetch("/api/upload-receipt", { method: "POST", body: fd });
      if (!uploadRes.ok) {
        const data = await uploadRes.json().catch(() => ({}));
        setLoading(false);
        setError(data.error || "Fiş yüklenemedi.");
        return;
      }
      const uploadData = await uploadRes.json();
      receiptUrl = uploadData.url;
    }

    const res = await fetch("/api/reviews", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productSlug, overallRating, title, body, usageDuration: usageDuration || undefined, metricScores, receiptUrl }),
    });
    setLoading(false);
    if (!res.ok) { const data = await res.json().catch(() => ({})); setError(data.error || "Yorum gönderilemedi."); return; }
    setOpen(false); setTitle(""); setBody(""); setUsageDuration(""); setReceiptFile(null);
    router.refresh();
  }

  if (!open) {
    return <button onClick={() => setOpen(true)} className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-steel transition-colors focus-ring">Yorum yaz</button>;
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-5 rounded-2xl border border-line bg-white p-6 shadow-sm">
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-steel">Genel puan</label>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button type="button" key={n} onClick={() => setOverallRating(n)} className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${overallRating === n ? "bg-ink text-white" : "bg-[#F4F4F5] text-steel"}`}>{n}</button>
          ))}
        </div>
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-steel">Başlık</label>
        <input required value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Kısa bir özet" className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus-ring" />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-steel">Deneyimin</label>
        <textarea required minLength={10} value={body} onChange={(e) => setBody(e.target.value)} rows={4} placeholder="Neyi beğendin, neyi beğenmedin?" className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus-ring" />
      </div>
      <div>
        <label className="text-xs font-semibold uppercase tracking-wide text-steel">Ne kadardır kullanıyorsun? <span className="text-steelLight normal-case">(isteğe bağlı)</span></label>
        <input value={usageDuration} onChange={(e) => setUsageDuration(e.target.value)} placeholder="ör. 3 aydır kullanıyorum" className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus-ring" />
      </div>
      {metricSchema.length > 0 && (
        <div className="border-t border-line pt-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-steel">Detaylı puanlar</p>
          <div className="space-y-3">
            {metricSchema.map((m) => (
              <div key={m.key} className="flex items-center justify-between gap-4">
                <span className="text-sm text-ink">{m.label}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button type="button" key={n} onClick={() => setMetricScores((s) => ({ ...s, [m.key]: n }))} className={`h-7 w-7 rounded-full text-xs font-medium transition-colors ${metricScores[m.key] === n ? "bg-ink text-white" : "bg-[#F4F4F5] text-steel"}`}>{n}</button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {error && <p className="text-sm text-rust">{error}</p>}
      <div className="rounded-lg border border-dashed border-line bg-[#FAFAF9] p-4">
        <label className="text-xs font-semibold uppercase tracking-wide text-steel">
          Fiş / fatura fotoğrafı <span className="text-steelLight normal-case">(isteğe bağlı, "Doğrulanmış Alışveriş" rozeti kazandırır)</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setReceiptFile(e.target.files?.[0] ?? null)}
          className="mt-2 block w-full text-sm text-steel file:mr-3 file:rounded-full file:border-0 file:bg-ink file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white"
        />
        {receiptFile && <p className="mt-2 text-xs text-teal">✓ {receiptFile.name} seçildi</p>}
      </div>
      <div className="flex gap-3">
        <button type="submit" disabled={loading} className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-steel disabled:opacity-50">{loading ? "Gönderiliyor…" : "Yorumu paylaş"}</button>
        <button type="button" onClick={() => setOpen(false)} className="px-4 py-2 text-sm text-steel hover:text-ink">Vazgeç</button>
      </div>
    </form>
  );
}
