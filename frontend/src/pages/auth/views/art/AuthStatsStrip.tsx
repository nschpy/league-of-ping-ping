import { AuthStat } from './AuthStat';

const STATS = [
  { v: '312',   l: 'Active players' },
  { v: '1,847', l: 'Matches played' },
  { v: 'K=24',  l: 'MMR factor'     },
] as const;

export function AuthStatsStrip() {
  return (
    <div className="flex gap-8 pt-6 border-t border-line mt-7">
      {STATS.map((s) => <AuthStat key={s.l} v={s.v} l={s.l} />)}
    </div>
  );
}
