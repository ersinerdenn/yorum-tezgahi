export default function Logo({ className = "h-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 500 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bubbleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Amblem */}
      <g transform="translate(10, 10)">
        <path d="M 15 85 L 85 85 L 80 93 L 20 93 Z" fill="#D97706" />
        <rect x="25" y="93" width="8" height="12" rx="2" fill="#B45309" />
        <rect x="67" y="93" width="8" height="12" rx="2" fill="#B45309" />
        <path
          d="M 20 25 C 20 16.716 26.716 10 35 10 L 65 10 C 73.284 10 80 16.716 80 25 L 80 50 C 80 58.284 73.284 65 65 65 L 42 65 L 28 77 L 31 65 L 35 65 C 26.716 65 20 58.284 20 50 Z"
          fill="url(#bubbleGrad)"
        />
        <path d="M 38 32 L 62 32" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        <path d="M 43 43 L 57 43" stroke="#F59E0B" strokeWidth="4" strokeLinecap="round" />
        <circle cx="68" cy="22" r="4" fill="#F59E0B" />
      </g>

      {/* Yazı */}
      <g transform="translate(120, 0)">
        <text x="0" y="62" fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" fontWeight="800" fontSize="42" fill="#0F172A" letterSpacing="-1">
          yorum
        </text>
        <text x="135" y="62" fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" fontWeight="400" fontSize="42" fill="#D97706" letterSpacing="1">
          TEZGAHI
        </text>
        <text x="2" y="88" fontFamily="system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif" fontWeight="500" fontSize="14" fill="#64748B" letterSpacing="3">
          .COM | FİKİR &amp; DEĞERLENDİRME ATÖLYESİ
        </text>
      </g>
    </svg>
  );
}
