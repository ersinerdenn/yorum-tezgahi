import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import LogoutButton from "./LogoutButton";
import Logo from "./Logo";

export default async function Navbar() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-50 border-b border-ink bg-paper/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
        <Link href="/" className="shrink-0 py-1">
          <Logo className="h-12 w-auto sm:h-14" />
        </Link>
        <form action="/ara" className="hidden flex-1 items-center border border-ink bg-white sm:flex">
          <input name="q" type="text" placeholder="Marka, model veya ürün ara…" className="w-full bg-transparent px-3 py-2 text-sm outline-none placeholder:text-steelLight" />
          <button type="submit" className="border-l border-ink px-3 py-2 font-mono text-xs uppercase tracking-wide text-steel hover:bg-ink hover:text-paper transition-colors focus-ring">Ara</button>
        </form>
        <nav className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/kategoriler" className="hidden text-steel hover:text-ink sm:inline">Kategoriler</Link>
          <Link href="/urun-ekle" className="hidden text-steel hover:text-ink sm:inline">Ürün ekle</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden font-mono text-xs text-steel sm:inline">{user.displayName}</span>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/giris" className="border border-ink px-3 py-1.5 font-medium hover:bg-ink hover:text-paper transition-colors focus-ring">Giriş yap</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
