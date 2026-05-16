import type { TierInfo } from '../../core/tier.js'
import { getTierForMmr } from '../../core/tier.js'
import type { IUser } from '../../core/models/User.js'
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

    if (games.length === 0) {
      return {
        mmr,
        tier,
        lastDelta: null,
        winRate: null,
        currentStreak: null,
        bestWinStreak: null,
        favoriteFormat: null,
        avgSetPointDiff: null,
      }
    }

    // lastDelta
    const mostRecent = games[0]!
    const isP1 = String(mostRecent.player1Id) === userId
    const lastDelta = isP1 ? mostRecent.player1MmrChange : mostRecent.player2MmrChange

    // winRate
    const total = games.length
    const wins = games.filter((g) => String(g.winnerId) === userId).length
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
      mmr,
      tier,
      lastDelta,
      winRate,
      currentStreak,
      bestWinStreak,
      favoriteFormat,
      avgSetPointDiff,
    }
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
