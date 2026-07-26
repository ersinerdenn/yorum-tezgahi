import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import LogoutButton from "./LogoutButton";
import Logo from "./Logo";

export default async function Navbar() {
  const user = await getCurrentUser();
  return (
    <header className="sticky top-0 z-50 border-b border-line bg-white/80 backdrop-blur">
      <div className="mx-auto flex max-w-5xl items-center gap-6 px-6 py-2">
        <Link href="/" className="shrink-0 py-1">
          <Logo className="h-11 w-auto sm:h-12" />
        </Link>
        <form action="/ara" className="hidden flex-1 items-center rounded-full bg-[#F4F4F5] px-4 py-2.5 sm:flex">
          <input name="q" type="text" placeholder="Marka, model veya ürün ara…" className="w-full bg-transparent text-sm outline-none placeholder:text-steelLight" />
          <button type="submit" className="text-steel hover:text-ink focus-ring" aria-label="Ara">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          </button>
        </form>
        <nav className="ml-auto flex items-center gap-4 text-sm">
          <Link href="/kategoriler" className="hidden text-steel hover:text-ink sm:inline">Kategoriler</Link>
          <Link href="/urun-ekle" className="hidden text-steel hover:text-ink sm:inline">Ürün ekle</Link>
          {user ? (
            <div className="flex items-center gap-3">
              <span className="hidden text-xs text-steel sm:inline">{user.displayName}</span>
              <LogoutButton />
            </div>
          ) : (
            <Link href="/giris" className="rounded-full bg-ink px-4 py-2 font-medium text-white hover:bg-steel transition-colors focus-ring">Giriş yap</Link>
          )}
        </nav>
      </div>
    </header>
  );
}
