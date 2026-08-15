"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

const SORT_OPTIONS = [
  { value: "yeni", label: "En yeni" },
  { value: "eski", label: "En eski" },
  { value: "yuksek", label: "En yüksek puan" },
  { value: "dusuk", label: "En düşük puan" },
];

export default function ReviewFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentSort = searchParams.get("sirala") || "yeni";
  const onlyVerified = searchParams.get("dogrulanmis") === "1";

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === null) params.delete(key); else params.set(key, value);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3 text-sm">
      <select value={currentSort} onChange={(e) => updateParam("sirala", e.target.value)} className="rounded-full border border-line bg-white px-3 py-1.5 text-sm text-ink outline-none focus-ring">
        {SORT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
      </select>
      <label className="flex items-center gap-1.5 text-steel">
        <input type="checkbox" checked={onlyVerified} onChange={(e) => updateParam("dogrulanmis", e.target.checked ? "1" : null)} className="h-4 w-4 rounded border-line accent-amber" />
        Sadece doğrulanmış alışverişler
      </label>
    </div>
  );
}
