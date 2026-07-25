"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Metric = { key: string; label: string };

export default function ReviewForm({
  productSlug,
  metricSchema,
}: {
  productSlug: string;
  metricSchema: Metric[];
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [overallRating, setOverallRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [usageDuration, setUsageDuration] = useState("");
  const [metricScores, setMetricScores] = useState<Record<string, number>>(
    Object.fromEntries(metricSchema.map((m) => [m.key, 5]))
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productSlug,
        overallRating,
        title,
        body,
        usageDuration: usageDuration || undefined,
        metricScores,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Yorum gönderilemedi.");
      return;
    }

    setOpen(false);
    setTitle("");
    setBody("");
    setUsageDuration("");
    router.refresh();
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="border border-ink px-4 py-2 text-sm font-medium hover:bg-ink hover:text-paper transition-colors focus-ring"
      >
        Yorum yaz
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="mt-6 space-y-5 border border-ink bg-white p-5">
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-steel">Genel puan</label>
        <div className="mt-2 flex gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              type="button"
              key={n}
              onClick={() => setOverallRating(n)}
              className={`h-9 w-9 border font-mono text-sm ${
                overallRating === n ? "border-ink bg-ink text-paper" : "border-line text-steel"
              }`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-steel">Başlık</label>
        <input
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Kısa bir özet"
          className="mt-1 w-full border border-ink bg-white px-3 py-2 text-sm outline-none focus-ring"
        />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-steel">Deneyimin</label>
        <textarea
          required
          minLength={10}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          placeholder="Neyi beğendin, neyi beğenmedin?"
          className="mt-1 w-full border border-ink bg-white px-3 py-2 text-sm outline-none focus-ring"
        />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-steel">
          Ne kadardır kullanıyorsun? <span className="text-steelLight normal-case">(isteğe bağlı)</span>
        </label>
        <input
          value={usageDuration}
          onChange={(e) => setUsageDuration(e.target.value)}
          placeholder="ör. 3 aydır kullanıyorum"
          className="mt-1 w-full border border-ink bg-white px-3 py-2 text-sm outline-none focus-ring"
        />
      </div>

      {metricSchema.length > 0 && (
        <div className="border-t border-line pt-4">
          <p className="mb-3 font-mono text-xs uppercase tracking-wide text-steel">Detaylı puanlar</p>
          <div className="space-y-3">
            {metricSchema.map((m) => (
              <div key={m.key} className="flex items-center justify-between gap-4">
                <span className="text-sm">{m.label}</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      type="button"
                      key={n}
                      onClick={() => setMetricScores((s) => ({ ...s, [m.key]: n }))}
                      className={`h-7 w-7 border font-mono text-xs ${
                        metricScores[m.key] === n ? "border-ink bg-ink text-paper" : "border-line text-steel"
                      }`}
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
        <button
          type="submit"
          disabled={loading}
          className="border border-ink bg-ink px-4 py-2 text-sm font-medium text-paper hover:bg-steel disabled:opacity-50"
        >
          {loading ? "Gönderiliyor…" : "Yorumu paylaş"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="px-4 py-2 text-sm text-steel hover:text-ink"
        >
          Vazgeç
        </button>
      </div>
    </form>
  );
}
