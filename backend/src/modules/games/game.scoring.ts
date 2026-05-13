export type GameFormat = 'bo1' | 'bo3' | 'bo5'
export type SetScores = { a: number; b: number }

export function setsToWin(format: GameFormat): number {
  if (format === 'bo1') return 1
  if (format === 'bo3') return 2
  return 3
}

export function isSetComplete(scores: SetScores): boolean {
  const { a, b } = scores
  return (a >= 11 || b >= 11) && Math.abs(a - b) >= 2
}

export function setWinner(scores: SetScores): 'p1' | 'p2' | null {
  if (!isSetComplete(scores)) return null
  return scores.a > scores.b ? 'p1' : 'p2'
}

export function gameWinner(
  sets: Array<{ player1Score: number; player2Score: number }>,
  format: GameFormat,
): 'p1' | 'p2' | null {
  const target = setsToWin(format)
  let p1Wins = 0
  let p2Wins = 0

  for (const set of sets) {
    const winner = setWinner({ a: set.player1Score, b: set.player2Score })
    if (winner === 'p1') p1Wins++
    else if (winner === 'p2') p2Wins++
  }

  if (p1Wins >= target) return 'p1'
  if (p2Wins >= target) return 'p2'
  return null
}
