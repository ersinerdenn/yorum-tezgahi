import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import RatingTag from "../../components/RatingTag";
import ReviewForm from "./ReviewForm";
import ReviewItem from "./ReviewItem";

export const revalidate = 0;

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const [product, user] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: params.slug },
      include: { subcategory: true, reviews: { include: { user: true, metricScores: true }, orderBy: { createdAt: "desc" } } },
    }),
    getCurrentUser(),
  ]);

  if (!product) notFound();

  const reviewCount = product.reviews.length;
  const avgRating = reviewCount > 0 ? product.reviews.reduce((s, r) => s + r.overallRating, 0) / reviewCount : 0;
  const metricSchema: { key: string; label: string }[] = JSON.parse(product.subcategory.metricSchema);

  return (
    <main className="mx-auto max-w-3xl px-6 pb-24">
      <div className="pt-10 pb-8">
        <Link href={`/kategori/${product.subcategory.slug}`} className="text-xs font-semibold uppercase tracking-wide text-steelLight hover:text-ink">← {product.subcategory.name}</Link>
        <p className="mt-4 text-xs font-medium text-steelLight">{product.brand}</p>
        <h1 className="mt-1 text-3xl font-extrabold text-ink sm:text-4xl">{product.model}</h1>
        <div className="mt-4 flex items-center gap-3">
          <RatingTag score={avgRating} size="lg" />
          <span className="text-sm text-steel">{reviewCount} yorum</span>
        </div>
      </div>

      <section className="border-t border-line py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-ink">Yorumlar</h2>
          {user ? <ReviewForm productSlug={product.slug} metricSchema={metricSchema} /> : (
            <Link href="/giris" className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-white hover:bg-steel transition-colors focus-ring">Yorum yazmak için giriş yap</Link>
          )}
        </div>

        {reviewCount === 0 ? (
          <p className="mt-6 rounded-xl border border-dashed border-line bg-white p-6 text-sm text-steel">Bu ürün için henüz yorum yapılmadı. İlk yorumu sen yazabilirsin.</p>
        ) : (
          <div className="mt-6 space-y-4">
            {product.reviews.map((r) => (
              <ReviewItem
                key={r.id}
                review={{ ...r, createdAt: r.createdAt.toISOString() }}
                metricSchema={metricSchema}
                isOwner={user?.id === r.userId}
              />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
