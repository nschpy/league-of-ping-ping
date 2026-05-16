import type { TierInfo } from '../../core/tier.js'
import { getTierForMmr } from '../../core/tier.js'
import type { IUser } from '../../core/models/User.js'
import { UserModel } from '../../core/models/User.js'
import type { IGame } from '../../core/models/Game.js'
import { GameModel } from '../../core/models/Game.js'
import { UserRepository } from './user.repository.js'

// ---------------------------------------------------------------------------
// Result types
// ---------------------------------------------------------------------------

export interface MeStatsResult {
  mmr: number
  tier: TierInfo
  lastDelta: number | null
  winRate: { percent: number; wins: number; total: number } | null
  currentStreak: { kind: 'W' | 'L'; count: number } | null
  bestWinStreak: number | null
  avgSetsPerWin: number | null
  favoriteFormat: { format: string; percent: number } | null
  avgSetPointDiff: number | null
}

export interface RecentGameItem {
  id: string
  opponent: { id: string; nickname: string; mmr: number }
  format: string
  sets: { user: number; opponent: number }
  setScores: Array<{ user: number; opponent: number }>
  mmrDelta: number
  outcome: 'win' | 'loss'
  completedAt: string
}

export type LiveGameResult = {
  id: string
  opponent: { id: string; nickname: string; mmr: number }
  format: 'bo1' | 'bo3' | 'bo5'
  currentSetNumber: number
  currentSetScore: { user: number; opponent: number }
  setsWon: { user: number; opponent: number }
} | null

export interface RecentGamesResult {
  items: RecentGameItem[]
}

export interface ChallengeSuggestionItem {
  id: string
  nickname: string
  mmr: number
  h2h: { wins: number; losses: number }
}

export interface ChallengeSuggestionsResult {
  items: ChallengeSuggestionItem[]
}

export interface LeaderboardEntry {
  rank: number
  id: string
  nickname: string
  mmr: number
  isMe: boolean
}

export interface LeaderboardResult {
  top: LeaderboardEntry[]
  me: Omit<LeaderboardEntry, 'isMe'> | null
}

export interface ProfileResult {
  user: {
    id: string
    nickname: string
    email?: string
    city: string | null
    mmr: number
    tier: TierInfo
    rank: number
    createdAt: string
    isMe: boolean
  }
  stats: {
    totalGames: number
    wins: number
    losses: number
    winRate: { percent: number; wins: number; total: number } | null
    currentStreak: { kind: 'W' | 'L'; count: number } | null
    bestWinStreak: number | null
    avgSetsPerWin: number | null
    lastDelta: number | null
  }
  achievements: Array<{ key: string; label: string; sub: string }>
  mmrHistory: {
    bucket: 'month' | 'match'
    points: Array<{ label: string; mmr: number }>
  }
}

// ---------------------------------------------------------------------------
// Helper: populated user shape from GameModel.populate
// ---------------------------------------------------------------------------

interface PopulatedUser {
  _id: { toString(): string }
  nickname: string
  mmr: number
}

interface PopulatedGame extends Omit<IGame, 'player1Id' | 'player2Id'> {
  player1Id: PopulatedUser
  player2Id: PopulatedUser
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

interface ComputedStats {
  totalGames: number
  wins: number
  losses: number
  winRate: { percent: number; wins: number; total: number } | null
  currentStreak: { kind: 'W' | 'L'; count: number } | null
  bestWinStreak: number | null
  avgSetsPerWin: number | null
  lastDelta: number | null
  favoriteFormat: { format: string; percent: number } | null
  avgSetPointDiff: number | null
}

function computeStatsFromGames(games: IGame[], userId: string): ComputedStats {
  const total = games.length
  if (total === 0) {
    return {
      totalGames: 0,
      wins: 0,
      losses: 0,
      winRate: null,
      currentStreak: null,
      bestWinStreak: null,
      avgSetsPerWin: null,
      lastDelta: null,
      favoriteFormat: null,
      avgSetPointDiff: null,
    }
  }

  // lastDelta
  const mostRecent = games[0]!
  const isP1Most = String(mostRecent.player1Id) === userId
  const lastDelta = isP1Most ? mostRecent.player1MmrChange : mostRecent.player2MmrChange

  // wins / losses
  const wins = games.filter((g) => String(g.winnerId) === userId).length
  const losses = total - wins
  const winRate = {
    percent: Math.round((wins / total) * 100),
    wins,
    total,
  }

  // currentStreak
  let currentStreak: { kind: 'W' | 'L'; count: number } | null = null
  {
    const firstKind: 'W' | 'L' = String(games[0]!.winnerId) === userId ? 'W' : 'L'
    let count = 0
    for (const g of games) {
      const kind: 'W' | 'L' = String(g.winnerId) === userId ? 'W' : 'L'
      if (kind === firstKind) {
        count++
      } else {
        break
      }
    }
    currentStreak = { kind: firstKind, count }
  }

  // bestWinStreak
  let bestWinStreak = 0
  {
    let streak = 0
    for (const g of games) {
      if (String(g.winnerId) === userId) {
        streak++
        if (streak > bestWinStreak) bestWinStreak = streak
      } else {
        streak = 0
      }
    }
  }

  // avgSetsPerWin: for each game the user won, count opponent set wins
  let avgSetsPerWin: number | null = null
  {
    if (wins > 0) {
      let totalOpponentSets = 0
      for (const g of games) {
        if (String(g.winnerId) !== userId) continue
        const userIsP1 = String(g.player1Id) === userId
        for (const s of g.sets) {
          const oppScore = userIsP1 ? s.player2Score : s.player1Score
          const userScore = userIsP1 ? s.player1Score : s.player2Score
          if (oppScore > userScore) {
            totalOpponentSets++
          }
        }
      }
      avgSetsPerWin = Math.round((totalOpponentSets / wins) * 10) / 10
    }
  }

  // favoriteFormat
  let favoriteFormat: { format: string; percent: number } | null = null
  {
    const formatCounts: Record<string, number> = {}
    for (const g of games) {
      formatCounts[g.format] = (formatCounts[g.format] ?? 0) + 1
    }
    let maxCount = 0
    let maxFormat = ''
    for (const [fmt, cnt] of Object.entries(formatCounts)) {
      if (cnt > maxCount) {
        maxCount = cnt
        maxFormat = fmt
      }
    }
    favoriteFormat = {
      format: maxFormat,
      percent: Math.round((maxCount / total) * 100),
    }
  }

  // avgSetPointDiff
  let avgSetPointDiff: number | null = null
  {
    let totalDiff = 0
    let setCount = 0
    for (const g of games) {
      const userIsP1 = String(g.player1Id) === userId
      for (const s of g.sets) {
        const userScore = userIsP1 ? s.player1Score : s.player2Score
        const oppScore = userIsP1 ? s.player2Score : s.player1Score
        totalDiff += userScore - oppScore
        setCount++
      }
    }
    if (setCount > 0) {
      avgSetPointDiff = Math.round((totalDiff / setCount) * 10) / 10
    }
  }

  return {
    totalGames: total,
    wins,
    losses,
    winRate,
    currentStreak,
    bestWinStreak,
    avgSetsPerWin,
    lastDelta,
    favoriteFormat,
    avgSetPointDiff,
  }
}

function deriveAchievements(params: {
  rank: number
  winRate: { percent: number; total: number } | null
  bestWinStreak: number | null
  totalGames: number
}): Array<{ key: string; label: string; sub: string }> {
  const { rank, winRate, bestWinStreak, totalGames } = params
  const results: Array<{ key: string; label: string; sub: string }> = []

  if (rank <= 3) {
    results.push({ key: 'top3', label: 'Топ-3', sub: '#' + rank })
  } else if (rank <= 10) {
    results.push({ key: 'top10', label: 'Топ-10', sub: '#' + rank })
  }

  if (bestWinStreak != null && bestWinStreak >= 5) {
    results.push({ key: 'streak', label: 'Серия ' + bestWinStreak + 'W', sub: 'рекорд' })
  }

  if (winRate != null && winRate.percent >= 60 && winRate.total >= 10) {
    results.push({ key: 'winrate', label: winRate.percent + '% WR', sub: 'выше среднего' })
  }

  if (totalGames >= 50) {
    results.push({ key: 'veteran', label: totalGames + ' матчей', sub: 'ветеран' })
  }

  return results.slice(0, 3)
}

// Pure helper: compute MMR history from pre-fetched ASC-sorted games + user createdAt.
// Extracted so getProfile can reuse already-fetched games without an extra DB round-trip.
function buildMmrHistoryFromGames(
  gamesAsc: IGame[],
  userId: string,
  createdAt: Date,
): { bucket: 'month' | 'match'; points: Array<{ label: string; mmr: number }> } {
  const MONTHS_RU = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек']

  const allPoints: Array<{ date: Date; mmr: number }> = [{ date: createdAt, mmr: 1000 }]

  for (const g of gamesAsc) {
    const isP1 = String(g.player1Id) === userId
    const mmrBefore = isP1 ? g.player1MmrBefore : g.player2MmrBefore
    const mmrChange = isP1 ? g.player1MmrChange : g.player2MmrChange
    if (mmrBefore == null || mmrChange == null) continue
    const date = g.completedAt instanceof Date ? g.completedAt : new Date(g.completedAt as unknown as string)
    allPoints.push({ date, mmr: mmrBefore + mmrChange })
  }

  if (allPoints.length === 1) {
    return { bucket: 'match', points: [{ label: 'старт', mmr: 1000 }] }
  }

  const gamePoints = allPoints.slice(1)
  const distinctMonths = new Set(
    gamePoints.map((p) => `${p.date.getFullYear()}-${String(p.date.getMonth() + 1).padStart(2, '0')}`),
  )
  const bucket: 'month' | 'match' = distinctMonths.size >= 3 ? 'month' : 'match'

  if (bucket === 'month') {
    const byMonth: Map<string, { mmr: number; monthIndex: number; year: number }> = new Map()
    for (const p of allPoints) {
      const key = `${p.date.getFullYear()}-${String(p.date.getMonth() + 1).padStart(2, '0')}`
      byMonth.set(key, { mmr: p.mmr, monthIndex: p.date.getMonth(), year: p.date.getFullYear() })
    }
    const sorted = [...byMonth.entries()].sort(([a], [b]) => a.localeCompare(b))

    // Cap to last 12 months so chart labels don't overlap
    const capped = sorted.slice(-12)

    // Include year suffix when history spans multiple calendar years to avoid duplicate labels
    const years = new Set(capped.map(([, v]) => v.year))
    const multiYear = years.size > 1

    let points = capped.map(([, v]) => ({
      label: multiYear ? `${MONTHS_RU[v.monthIndex]!} ${String(v.year).slice(-2)}` : MONTHS_RU[v.monthIndex]!,
      mmr: v.mmr,
    }))

    // Frontend chart requires ≥ 2 points to draw a line
    if (points.length === 1) points = [points[0]!, points[0]!]
    return { bucket: 'month', points }
  } else {
    const recent = allPoints.slice(-10)
    const points = recent.map((p, i) => {
      if (i === 0 && recent[0] === allPoints[0]) return { label: 'старт', mmr: p.mmr }
      const d = p.date
      return { label: `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`, mmr: p.mmr }
    })
    return { bucket: 'match', points }
  }
}

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

export const UserService = {
  async getMeStats(userId: string): Promise<MeStatsResult> {
    const user = await UserRepository.findById(userId)
    if (user == null) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 })
    }

    const mmr = user.mmr
    const tier = getTierForMmr(mmr)

    const games = await GameModel.find(
      {
        $or: [{ player1Id: userId }, { player2Id: userId }],
        status: 'completed',
      },
    )
      .sort({ completedAt: -1 })
      .lean<IGame[]>()

    const computed = computeStatsFromGames(games, userId)

    return {
      mmr,
      tier,
      lastDelta: computed.lastDelta,
      winRate: computed.winRate,
      currentStreak: computed.currentStreak,
      bestWinStreak: computed.bestWinStreak,
      avgSetsPerWin: computed.avgSetsPerWin,
      favoriteFormat: computed.favoriteFormat,
      avgSetPointDiff: computed.avgSetPointDiff,
    }
  },

  async getMmrHistory(userId: string): Promise<{
    bucket: 'month' | 'match'
    points: Array<{ label: string; mmr: number }>
  }> {
    const user = await UserRepository.findById(userId)
    if (user == null) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 })
    }
    const games = await GameModel.find(
      { $or: [{ player1Id: userId }, { player2Id: userId }], status: 'completed' },
    ).sort({ completedAt: 1 }).lean<IGame[]>()

    const userWithTs = user as IUser & { createdAt: Date }
    const createdAt = userWithTs.createdAt instanceof Date ? userWithTs.createdAt : new Date()
    return buildMmrHistoryFromGames(games, userId, createdAt)
  },

  async getProfile(userId: string, viewerId: string): Promise<ProfileResult> {
    const user = await UserRepository.findById(userId)
    if (user == null) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 })
    }

    const tier = getTierForMmr(user.mmr)
    const rank = await UserRepository.countWithHigherMmr(user.mmr, userId) + 1

    // Fetch once, sorted DESC for stats; reverse for history (no extra DB call)
    const games = await GameModel.find(
      { $or: [{ player1Id: userId }, { player2Id: userId }], status: 'completed' },
    ).sort({ completedAt: -1 }).lean<IGame[]>()

    const stats = computeStatsFromGames(games, userId)
    const achievements = deriveAchievements({
      rank,
      winRate: stats.winRate,
      bestWinStreak: stats.bestWinStreak,
      totalGames: stats.totalGames,
    })

    const userWithTs = user as IUser & { _id: { toString(): string }; createdAt: Date }
    const createdAt = userWithTs.createdAt instanceof Date ? userWithTs.createdAt : new Date()
    const mmrHistory = buildMmrHistoryFromGames([...games].reverse(), userId, createdAt)

    const isMe = viewerId === userId
    const profileUser: ProfileResult['user'] = {
      id: userWithTs._id.toString(),
      nickname: user.nickname,
      ...(isMe ? { email: user.email } : {}),
      city: user.city ?? null,
      mmr: user.mmr,
      tier,
      rank,
      createdAt: createdAt.toISOString(),
      isMe,
    }

    return {
      user: profileUser,
      stats: {
        totalGames: stats.totalGames,
        wins: stats.wins,
        losses: stats.losses,
        winRate: stats.winRate,
        currentStreak: stats.currentStreak,
        bestWinStreak: stats.bestWinStreak,
        avgSetsPerWin: stats.avgSetsPerWin,
        lastDelta: stats.lastDelta,
      },
      achievements,
      mmrHistory,
    }
  },

  async updateMe(userId: string, patch: { nickname?: string; city?: string | null }): Promise<IUser> {
    if (patch.nickname !== undefined) {
      const existing = await UserRepository.findByNickname(patch.nickname, userId)
      if (existing != null) {
        throw Object.assign(new Error('Nickname already taken'), { statusCode: 409 })
      }
    }

    // Build $set and $unset ops separately: null city clears the field via $unset
    const setOp: Record<string, unknown> = {}
    const unsetOp: Record<string, 1> = {}
    if (patch.nickname !== undefined) setOp.nickname = patch.nickname
    if (patch.city !== undefined) {
      if (patch.city === null) unsetOp.city = 1
      else setOp.city = patch.city
    }

    const mongoOp: Record<string, Record<string, unknown>> = {}
    if (Object.keys(setOp).length > 0) mongoOp.$set = setOp
    if (Object.keys(unsetOp).length > 0) mongoOp.$unset = unsetOp

    // Nothing to update — return current user without a DB write
    if (Object.keys(mongoOp).length === 0) {
      const current = await UserRepository.findById(userId)
      if (current == null) throw Object.assign(new Error('User not found'), { statusCode: 404 })
      return current
    }

    const updated = await UserModel.findByIdAndUpdate(userId, mongoOp, { new: true }).lean<IUser>()
    if (updated == null) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 })
    }
    return updated
  },

  async getRecentGames(userId: string, limit: number, outcome?: 'win' | 'loss'): Promise<RecentGamesResult> {
    const filter: Record<string, unknown> = {
      $or: [{ player1Id: userId }, { player2Id: userId }],
      status: 'completed',
    }
    if (outcome === 'win') {
      filter.winnerId = userId
    } else if (outcome === 'loss') {
      // For completed games, winnerId is always set (not null), so $ne userId = loss
      filter.winnerId = { $ne: userId }
    }

    const games = await GameModel.find(filter)
      .populate<{ player1Id: PopulatedUser; player2Id: PopulatedUser }>('player1Id player2Id', 'nickname mmr')
      .sort({ completedAt: -1 })
      .limit(limit)
      .lean<PopulatedGame[]>()

    const items: RecentGameItem[] = games.map((g) => {
      const userIsP1 = g.player1Id._id.toString() === userId
      const opponent = userIsP1 ? g.player2Id : g.player1Id
      const mmrDelta = userIsP1 ? (g.player1MmrChange ?? 0) : (g.player2MmrChange ?? 0)
      const gameOutcome: 'win' | 'loss' = String(g.winnerId) === userId ? 'win' : 'loss'

      // Count sets won by each side
      let userSetsWon = 0
      let oppSetsWon = 0
      const setScores: Array<{ user: number; opponent: number }> = []
      for (const s of g.sets) {
        const uScore = userIsP1 ? s.player1Score : s.player2Score
        const oScore = userIsP1 ? s.player2Score : s.player1Score
        setScores.push({ user: uScore, opponent: oScore })
        if (uScore > oScore) userSetsWon++
        else if (oScore > uScore) oppSetsWon++
      }

      return {
        id: (g._id as { toString(): string }).toString(),
        opponent: { id: opponent._id.toString(), nickname: opponent.nickname, mmr: opponent.mmr },
        format: g.format,
        sets: { user: userSetsWon, opponent: oppSetsWon },
        setScores,
        mmrDelta,
        outcome: gameOutcome,
        completedAt: g.completedAt != null ? (g.completedAt as unknown as Date).toISOString() : '',
      }
    })

    return { items }
  },

  async getLiveGame(userId: string): Promise<LiveGameResult> {
    const results = await GameModel.find({
      status: 'in_progress',
      $or: [{ player1Id: userId }, { player2Id: userId }],
    })
      .populate<{ player1Id: PopulatedUser; player2Id: PopulatedUser }>('player1Id player2Id', 'nickname mmr')
      .sort({ startedAt: -1 })
      .limit(1)
      .lean<PopulatedGame[]>()
    const g = results[0] ?? null

    if (g == null) return null

    const userIsP1 = g.player1Id._id.toString() === userId
    const opponent = userIsP1 ? g.player2Id : g.player1Id

    // Find current open set (last set with completedAt == null)
    const openSetIndex = g.sets.reduce<number>((last, s, i) => (s.completedAt == null ? i : last), -1)
    let currentSetNumber: number
    let currentSetScore: { user: number; opponent: number }

    if (openSetIndex === -1) {
      // No open set — game transition state
      currentSetNumber = g.sets.length + 1
      currentSetScore = { user: 0, opponent: 0 }
    } else {
      const openSet = g.sets[openSetIndex]!
      currentSetNumber = openSetIndex + 1
      currentSetScore = {
        user: userIsP1 ? openSet.player1Score : openSet.player2Score,
        opponent: userIsP1 ? openSet.player2Score : openSet.player1Score,
      }
    }

    // Count sets won from completed sets
    let userSetsWon = 0
    let oppSetsWon = 0
    for (const s of g.sets) {
      if (s.completedAt == null) continue
      const uScore = userIsP1 ? s.player1Score : s.player2Score
      const oScore = userIsP1 ? s.player2Score : s.player1Score
      if (uScore > oScore) userSetsWon++
      else if (oScore > uScore) oppSetsWon++
    }

    return {
      id: (g._id as { toString(): string }).toString(),
      opponent: { id: opponent._id.toString(), nickname: opponent.nickname, mmr: opponent.mmr },
      format: g.format as 'bo1' | 'bo3' | 'bo5',
      currentSetNumber,
      currentSetScore,
      setsWon: { user: userSetsWon, opponent: oppSetsWon },
    }
  },

  async getChallengeSuggestions(userId: string, limit: number): Promise<ChallengeSuggestionsResult> {
    const user = await UserRepository.findById(userId)
    if (user == null) {
      throw Object.assign(new Error('User not found'), { statusCode: 404 })
    }

    // First try ±100 window
    let candidates = await UserRepository.findByMmrWindow(user.mmr, 100, userId, limit)

    // Expand to ±200 to fill if needed
    if (candidates.length < limit) {
      const wider = await UserRepository.findByMmrWindow(user.mmr, 200, userId, limit)
      // Merge: keep existing order; add new ones that weren't in the first pass
      const existingIds = new Set(candidates.map((c) => String((c as IUser & { _id: { toString(): string } })._id)))
      const extras = wider.filter((c) => {
        const cid = String((c as IUser & { _id: { toString(): string } })._id)
        return !existingIds.has(cid)
      })
      candidates = [...candidates, ...extras].slice(0, limit)
    }

    const items: ChallengeSuggestionItem[] = await Promise.all(
      candidates.map(async (candidate) => {
        const cid = String((candidate as IUser & { _id: { toString(): string } })._id)

        const h2hGames = await GameModel.find({
          status: 'completed',
          $or: [
            { player1Id: userId, player2Id: cid },
            { player1Id: cid, player2Id: userId },
          ],
        })
          .select('winnerId')
          .lean<Pick<IGame, 'winnerId'>[]>()

        const h2hWins = h2hGames.filter((g) => String(g.winnerId) === userId).length
        const h2hLosses = h2hGames.length - h2hWins

        return {
          id: cid,
          nickname: candidate.nickname,
          mmr: candidate.mmr,
          h2h: { wins: h2hWins, losses: h2hLosses },
        }
      }),
    )

    return { items }
  },

  async getLeaderboard(userId: string, limit: number): Promise<LeaderboardResult> {
    const topUsers = await UserRepository.findTopByMmr(limit)

    const top: LeaderboardEntry[] = topUsers.map((u, i) => ({
      rank: i + 1,
      id: String((u as IUser & { _id: { toString(): string } })._id),
      nickname: u.nickname,
      mmr: u.mmr,
      isMe: String((u as IUser & { _id: { toString(): string } })._id) === userId,
    }))

    const userInTop = top.some((entry) => entry.id === userId)

    if (userInTop) {
      return { top, me: null }
    }

    // User is not in top N — compute their rank and details
    const me = await UserRepository.findById(userId)
    if (me == null) {
      return { top, me: null }
    }

    const higherCount = await UserRepository.countWithHigherMmr(me.mmr, userId)
    const rank = higherCount + 1

    return {
      top,
      me: {
        rank,
        id: String((me as IUser & { _id: { toString(): string } })._id),
        nickname: me.nickname,
        mmr: me.mmr,
      },
    }
  },
}
