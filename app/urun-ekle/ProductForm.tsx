"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

type SubcategoryOption = { slug: string; name: string; categoryName: string };

export default function ProductForm({ subcategories }: { subcategories: SubcategoryOption[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const preselected = searchParams.get("kategori") || "";

  const [subcategorySlug, setSubcategorySlug] = useState(preselected);
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subcategorySlug, brand, model }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.error || "Ürün eklenemedi.");
      return;
    }

    const data = await res.json();
    router.push(`/urun/${data.slug}`);
  }

  return (
    <form onSubmit={submit} className="space-y-5 border border-ink bg-white p-5">
      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-steel">Kategori</label>
        <select
          required
          value={subcategorySlug}
          onChange={(e) => setSubcategorySlug(e.target.value)}
          className="mt-1 w-full border border-ink bg-white px-3 py-2.5 text-sm outline-none focus-ring"
        >
          <option value="" disabled>Bir kategori seç</option>
          {subcategories.map((s) => (
            <option key={s.slug} value={s.slug}>
              {s.categoryName} — {s.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-steel">Marka</label>
        <input
          required
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="ör. Apple, Decathlon, Nike…"
          className="mt-1 w-full border border-ink bg-white px-3 py-2.5 text-sm outline-none focus-ring"
        />
      </div>

      <div>
        <label className="font-mono text-xs uppercase tracking-wide text-steel">Model / Ürün adı</label>
        <input
          required
          value={model}
          onChange={(e) => setModel(e.target.value)}
          placeholder="ör. iPhone 15 Pro, Air Max 90…"
          className="mt-1 w-full border border-ink bg-white px-3 py-2.5 text-sm outline-none focus-ring"
        />
      </div>

      {error && <p className="text-sm text-rust">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full border border-ink bg-ink px-4 py-2.5 font-medium text-paper transition-colors hover:bg-steel disabled:opacity-50"
      >
        {loading ? "Ekleniyor…" : "Ürünü ekle"}
      </button>
    </form>
  );
}
