"use client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/"); router.refresh();
  }
  return (
    <button onClick={logout} className="rounded-full border border-line px-4 py-2 font-medium text-ink hover:bg-[#F4F4F5] transition-colors focus-ring">
      Çıkış yap
    </button>
  );
}
