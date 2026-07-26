"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import RatingTag from "../../components/RatingTag";

type Metric = { key: string; label: string };
type MetricScoreRow = { id: string; key: string; score: number };
type ReviewData = {
  id: string;
  overallRating: number;
  title: string;
  body: string;
  usageDuration: string | null;
  verifiedPurchase: boolean;
  receiptUrl: string | null;
  createdAt: string;
  user: { displayName: string };
  metricScores: MetricScoreRow[];
};

export default function ReviewItem({
  review,
  metricSchema,
  isOwner,
}: {
  review: ReviewData;
  metricSchema: Metric[];
  isOwner: boolean;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [overallRating, setOverallRating] = useState(review.overallRating);
  const [title, setTitle] = useState(review.title);
  const [body, setBody] = useState(review.body);
  const [usageDuration, setUsageDuration] = useState(review.usageDuration ?? "");
  const [metricScores, setMetricScores] = useState<Record<string, number>>(
    Object.fromEntries(metricSchema.map((m) => [m.key, review.metricScores.find((s) => s.key === m.key)?.score ?? 5]))
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function saveEdit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch(`/api/reviews/${review.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ overallRating, title, body, usageDuration: usageDuration || undefined, metricScores }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Güncellenemedi.");
      return;
    }
    setEditing(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!confirm("Bu yorumu silmek istediğine emin misin? Bu işlem geri alınamaz.")) return;
    setDeleting(true);
    const res = await fetch(`/api/reviews/${review.id}`, { method: "DELETE" });
    setDeleting(false);
    if (!res.ok) {
      alert("Yorum silinemedi, tekrar dene.");
      return;
    }
    router.refresh();
  }

  if (editing) {
    return (
      <form onSubmit={saveEdit} className="space-y-5 rounded-2xl border border-line bg-white p-6 shadow-sm">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-steel">Genel puan</label>
          <div className="mt-2 flex gap-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                type="button"
                key={n}
                onClick={() => setOverallRating(n)}
                className={`h-9 w-9 rounded-full text-sm font-medium transition-colors ${overallRating === n ? "bg-ink text-white" : "bg-[#F4F4F5] text-steel"}`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-steel">Başlık</label>
          <input required value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus-ring" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-steel">Deneyimin</label>
          <textarea required minLength={10} value={body} onChange={(e) => setBody(e.target.value)} rows={4} className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus-ring" />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide text-steel">Ne kadardır kullanıyorsun?</label>
          <input value={usageDuration} onChange={(e) => setUsageDuration(e.target.value)} className="mt-1 w-full rounded-lg border border-line bg-white px-3 py-2 text-sm outline-none focus-ring" />
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
                      <button
                        type="button"
                        key={n}
                        onClick={() => setMetricScores((s) => ({ ...s, [m.key]: n }))}
                        className={`h-7 w-7 rounded-full text-xs font-medium transition-colors ${metricScores[m.key] === n ? "bg-ink text-white" : "bg-[#F4F4F5] text-steel"}`}
                      >
                        {n}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {error && <p className="text-sm text-rust">{error}</p>}
        <div className="flex gap-3">
          <button type="submit" disabled={loading} className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-steel disabled:opacity-50">
            {loading ? "Kaydediliyor…" : "Değişiklikleri kaydet"}
          </button>
          <button type="button" onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-steel hover:text-ink">
            Vazgeç
          </button>
        </div>
      </form>
    );
  }

  return (
    <article className="rounded-2xl border border-line bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-3">
          <RatingTag score={review.overallRating} size="sm" />
          <h3 className="font-semibold text-ink">{review.title}</h3>
        </div>
        {review.verifiedPurchase && <span className="text-xs font-medium text-teal">● Doğrulanmış Alışveriş</span>}
      </div>

      <p className="mt-3 text-sm leading-relaxed text-ink">{review.body}</p>

      {review.receiptUrl && (
        <a href={review.receiptUrl} target="_blank" rel="noopener noreferrer" className="mt-3 inline-block">
          <img src={review.receiptUrl} alt="Fiş / fatura" className="h-20 w-20 rounded-lg border border-line object-cover hover:opacity-80 transition-opacity" />
        </a>
      )}

      {review.metricScores.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-4 border-t border-line pt-4">
          {review.metricScores.map((m) => {
            const label = metricSchema.find((ms) => ms.key === m.key)?.label ?? m.key;
            return (
              <span key={m.id} className="text-xs text-steel">
                {label}: <span className="font-semibold text-ink">{m.score}/5</span>
              </span>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3 text-xs text-steelLight">
        <span>
          {review.user.displayName}
          {review.usageDuration ? ` — ${review.usageDuration}` : ""}
        </span>
        <div className="flex items-center gap-3">
          <span>{new Date(review.createdAt).toLocaleDateString("tr-TR")}</span>
          {isOwner && (
            <>
              <button onClick={() => setEditing(true)} className="font-medium text-steel hover:text-ink">
                Düzenle
              </button>
              <button onClick={handleDelete} disabled={deleting} className="font-medium text-rust hover:text-rust/80 disabled:opacity-50">
                {deleting ? "Siliniyor…" : "Sil"}
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
