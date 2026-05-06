interface Props { v: string; l: string; }

export function AuthStat({ v, l }: Props) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-[32px] leading-none">{v}</span>
      <span className="font-mono text-[10px] tracking-[0.18em] uppercase text-fg-3 mt-1">{l}</span>
    </div>
  );
}
