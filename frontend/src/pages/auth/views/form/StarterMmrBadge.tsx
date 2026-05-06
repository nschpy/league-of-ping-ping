export function StarterMmrBadge() {
  return (
    <div className="starter-badge">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M3 17l6-6 4 4 8-8" /><path d="M14 7h7v7" />
      </svg>
      <span>Starter MMR</span>
      <span className="font-mono font-bold text-base">1000</span>
      <span className="ml-auto font-mono text-[10px] tracking-[0.16em] uppercase">Unranked</span>
    </div>
  );
}
