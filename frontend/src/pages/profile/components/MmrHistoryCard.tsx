import { useId } from 'react'
import type { ProfileResult } from '@/lib/types/profile'

const CHART_W = 700
const CHART_H = 160

export function MmrHistoryCard({ history }: { history: ProfileResult['mmrHistory'] }) {
  const gradId = useId()
  // Ensure at least 2 points for the chart (duplicate single point for flat line)
  const rawPoints = history.points.length === 0
    ? [{ label: '—', mmr: 1000 }]
    : history.points

  const points = rawPoints.length === 1
    ? [rawPoints[0]!, rawPoints[0]!]
    : rawPoints

  const vals = points.map(p => p.mmr)
  const minVal = Math.min(...vals) - 40
  const maxVal = Math.max(...vals) + 40
  const range = maxVal - minVal || 1 // guard against flat line with same mmr

  const totalDelta =
    history.points.length >= 2
      ? history.points[history.points.length - 1]!.mmr - history.points[0]!.mmr
      : null

  const pts: [number, number][] = vals.map((v, i) => [
    (i / (vals.length - 1)) * CHART_W,
    CHART_H - ((v - minVal) / range) * CHART_H,
  ])

  const pathD = pts
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p[0].toFixed(1)},${p[1].toFixed(1)}`)
    .join(' ')

  const areaD =
    pathD +
    ` L${CHART_W},${CHART_H + 10} L0,${CHART_H + 10} Z`

  // Deduplicate labels for display (use rawPoints labels at proportional positions)
  const labelPoints: Array<{ x: number; y: number; mmr: number; label: string }> =
    history.points.length === 1
      ? [
          {
            x: pts[pts.length - 1]![0],
            y: pts[pts.length - 1]![1],
            mmr: rawPoints[0]!.mmr,
            label: rawPoints[0]!.label,
          },
        ]
      : pts.map((p, i) => ({
          x: p[0],
          y: p[1],
          mmr: points[i]!.mmr,
          label: points[i]!.label,
        }))

  return (
    <div className="bg-card rounded-lg border border-border shadow-sm p-5 md:p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div
          className="text-foreground"
          style={{ fontFamily: 'var(--font-display)', fontSize: 18, fontWeight: 700 }}
        >
          История MMR
        </div>
        {totalDelta !== null && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-muted-foreground">за период</span>
            <span
              className={
                totalDelta > 0
                  ? 'text-[11px] font-mono font-bold text-success'
                  : totalDelta < 0
                    ? 'text-[11px] font-mono font-bold text-destructive'
                    : 'text-[11px] font-mono text-muted-foreground'
              }
            >
              {totalDelta > 0 ? `+${totalDelta}` : totalDelta} pts
            </span>
          </div>
        )}
      </div>

      {/* SVG Chart */}
      <svg
        viewBox={`0 0 ${CHART_W} ${CHART_H + 30}`}
        style={{ width: '100%', height: 180, display: 'block' }}
        aria-hidden="true"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.2" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Dashed horizontal gridlines at 25%, 50%, 75% */}
        {[0.25, 0.5, 0.75].map(p => (
          <line
            key={p}
            x1="0"
            y1={CHART_H * p}
            x2={CHART_W}
            y2={CHART_H * p}
            stroke="var(--border)"
            strokeWidth="1"
            strokeDasharray="1 5"
          />
        ))}

        {/* Area fill */}
        <path d={areaD} fill={`url(#${gradId})`} />

        {/* Line */}
        <path
          d={pathD}
          stroke="var(--primary)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Data points + labels */}
        {labelPoints.map((p, i) => {
          const isLast = i === labelPoints.length - 1
          return (
            <g key={i}>
              <circle
                cx={p.x}
                cy={p.y}
                r={isLast ? 5 : 3.5}
                fill="var(--background)"
                stroke="var(--primary)"
                strokeWidth="2"
              />
              {/* MMR label above point */}
              <text
                x={p.x}
                y={p.y - 12}
                textAnchor="middle"
                fontSize="11"
                fontWeight="700"
                fontFamily="var(--font-mono, monospace)"
                fill="var(--primary)"
                opacity={isLast ? 1 : 0.6}
              >
                {p.mmr}
              </text>
              {/* Month label below axis */}
              <text
                x={p.x}
                y={CHART_H + 22}
                textAnchor="middle"
                fontSize="10"
                fontFamily="var(--font-mono, monospace)"
                fill="var(--muted-foreground)"
                opacity="0.6"
                letterSpacing="0.04em"
              >
                {p.label}
              </text>
            </g>
          )
        })}
      </svg>
    </div>
  )
}
