"use client";

import { useRouter } from "next/navigation";

type ProductRow = { id: string; brand: string; model: string; slug: string; reviewCount: number };
type ReviewRow = { id: string; title: string; body: string; productModel: string; userDisplayName: string; createdAt: string };

export default function AdminList({ products, reviews }: { products: ProductRow[]; reviews: ReviewRow[] }) {
  const router = useRouter();

  async function deleteProduct(id: string) {
    if (!confirm("Bu ürünü ve tüm yorumlarını silmek istediğine emin misin?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (!res.ok) { alert("Silinemedi."); return; }
    router.refresh();
  }

  async function deleteReview(id: string) {
    if (!confirm("Bu yorumu silmek istediğine emin misin?")) return;
    const res = await fetch(`/api/reviews/${id}`, { method: "DELETE" });
    if (!res.ok) { alert("Silinemedi."); return; }
    router.refresh();
  }

  return (
    <div className="space-y-10">
      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-steel">Ürünler ({products.length})</h2>
        <div className="space-y-2">
          {products.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-3">
              <span className="text-sm text-ink">{p.brand} — {p.model} <span className="text-steelLight">({p.reviewCount} yorum)</span></span>
              <button onClick={() => deleteProduct(p.id)} className="text-xs font-medium text-rust hover:text-rust/80">Sil</button>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-bold uppercase tracking-wide text-steel">Son Yorumlar ({reviews.length})</h2>
        <div className="space-y-2">
          {reviews.map((r) => (
            <div key={r.id} className="flex items-center justify-between gap-4 rounded-lg border border-line bg-white px-4 py-3">
              <div className="min-w-0">
                <p className="truncate text-sm text-ink">{r.title} — <span className="text-steelLight">{r.productModel}</span></p>
                <p className="text-xs text-steelLight">{r.userDisplayName} · {new Date(r.createdAt).toLocaleDateString("tr-TR")}</p>
              </div>
              <button onClick={() => deleteReview(r.id)} className="shrink-0 text-xs font-medium text-rust hover:text-rust/80">Sil</button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
