import Link from "next/link";
export default function Footer() {
  return (
    <footer className="py-8">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4 px-6 text-xs text-steelLight">
        <span>© {new Date().getFullYear()} Yorum Tezgahı</span>
        <div className="flex gap-5">
          <Link href="/gizlilik" className="hover:text-ink">Gizlilik Politikası</Link>
          <Link href="/kosullar" className="hover:text-ink">Kullanım Şartları</Link>
        </div>
      </div>
    </footer>
  );
}
