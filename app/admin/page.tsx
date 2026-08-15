import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/session";
import { isAdminUser } from "@/lib/admin";
import AdminList from "./AdminList";

export const revalidate = 0;

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (!isAdminUser(user)) {
    return (
      <main className="mx-auto max-w-sm px-6 py-24 text-center">
        <h1 className="text-xl font-extrabold text-ink">Bu sayfaya erişimin yok</h1>
        <p className="mt-3 text-sm text-steel">
          {user ? "Bu hesap yönetici olarak tanımlı değil." : "Önce giriş yapman gerekiyor."}
        </p>
        {!user && (
          <Link href="/giris" className="mt-6 inline-block rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-white hover:bg-steel transition-colors focus-ring">
            Giriş yap
          </Link>
        )}
      </main>
    );
  }

  const products = await prisma.product.findMany({
    include: { _count: { select: { reviews: true } } },
    orderBy: { createdAt: "desc" },
  });

  const reviews = await prisma.review.findMany({
    include: { user: true, product: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <p className="text-xs font-semibold uppercase tracking-wide text-steelLight">Yönetim</p>
      <h1 className="mt-2 text-2xl font-extrabold text-ink">Moderasyon Paneli</h1>
      <p className="mt-2 mb-8 text-sm text-steel">
        Uygunsuz ürün veya yorumları buradan kaldırabilirsin.
      </p>
      <AdminList
        products={products.map((p) => ({ id: p.id, brand: p.brand, model: p.model, slug: p.slug, reviewCount: p._count.reviews }))}
        reviews={reviews.map((r) => ({
          id: r.id,
          title: r.title,
          body: r.body,
          productModel: r.product.model,
          userDisplayName: r.user.displayName,
          createdAt: r.createdAt.toISOString(),
        }))}
      />
    </main>
  );
}
