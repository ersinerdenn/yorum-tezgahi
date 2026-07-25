"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }
  return (
    <button onClick={logout} className="border border-ink px-3 py-1.5 font-medium hover:bg-ink hover:text-paper transition-colors focus-ring">
      Çıkış yap
    </button>
  );
}
