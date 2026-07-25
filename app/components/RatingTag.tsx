export default function RatingTag({ score, size = "md" }: { score: number; size?: "sm" | "md" | "lg" }) {
  const sizes = { sm: "text-xs px-2 py-1", md: "text-sm px-2.5 py-1.5", lg: "text-lg px-4 py-2" };
  return (
    <span className={`inspection-tag inline-flex items-center gap-1.5 font-mono font-medium ${sizes[size]}`}>
      <span aria-hidden>★</span>
      {score.toFixed(1)}
    </span>
  );
}
