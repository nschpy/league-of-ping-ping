import { Type, type Static } from '@sinclair/typebox'

// ---------------------------------------------------------------------------
// Existing schemas
// ---------------------------------------------------------------------------

export const UserSearchResponse = Type.Array(Type.Object({
  id: Type.String(),
  nickname: Type.String(),
  mmr: Type.Integer(),
}))
export type UserSearchResponse_type = Static<typeof UserSearchResponse>

export const UserByIdResponse = Type.Object({
  id: Type.String(),
  nickname: Type.String(),
  mmr: Type.Integer(),
})
export type UserByIdResponse_type = Static<typeof UserByIdResponse>

export const ErrorResponse = Type.Object({
  statusCode: Type.Number(),
  error: Type.String(),
  message: Type.String(),
})

// ---------------------------------------------------------------------------
// GET /users/me/stats
// ---------------------------------------------------------------------------

const TierSchema = Type.Object({
  name: Type.String(),
  nextName: Type.Union([Type.String(), Type.Null()]),
  progress: Type.Number(),
  pointsToNext: Type.Union([Type.Integer(), Type.Null()]),
})

const WinRateSchema = Type.Object({
  percent: Type.Integer(),
  wins: Type.Integer(),
  total: Type.Integer(),
})

const CurrentStreakSchema = Type.Object({
  kind: Type.Union([Type.Literal('W'), Type.Literal('L')]),
  count: Type.Integer(),
})

const FavoriteFormatSchema = Type.Object({
  format: Type.String(),
  percent: Type.Integer(),
})

export const MeStatsResponse = Type.Object({
  mmr: Type.Integer(),
  tier: TierSchema,
  lastDelta: Type.Union([Type.Integer(), Type.Null()]),
  winRate: Type.Union([WinRateSchema, Type.Null()]),
  currentStreak: Type.Union([CurrentStreakSchema, Type.Null()]),
  bestWinStreak: Type.Union([Type.Integer(), Type.Null()]),
  avgSetsPerWin: Type.Union([Type.Number(), Type.Null()]),
  favoriteFormat: Type.Union([FavoriteFormatSchema, Type.Null()]),
  avgSetPointDiff: Type.Union([Type.Number(), Type.Null()]),
})
export type MeStatsResponse_type = Static<typeof MeStatsResponse>

// ---------------------------------------------------------------------------
// GET /users/me/games/recent
// ---------------------------------------------------------------------------

const RecentGameItem = Type.Object({
  id: Type.String(),
  opponent: Type.Object({
    id: Type.String(),
    nickname: Type.String(),
    mmr: Type.Integer(),
  }),
  format: Type.String(),
  sets: Type.Object({
    user: Type.Integer(),
    opponent: Type.Integer(),
  }),
  setScores: Type.Array(Type.Object({
    user: Type.Integer(),
    opponent: Type.Integer(),
  })),
  mmrDelta: Type.Integer(),
  outcome: Type.Union([Type.Literal('win'), Type.Literal('loss')]),
  completedAt: Type.String(),
})

export const RecentGamesResponse = Type.Object({
  items: Type.Array(RecentGameItem),
})
export type RecentGamesResponse_type = Static<typeof RecentGamesResponse>

// ---------------------------------------------------------------------------
// GET /users/me/games/live
// ---------------------------------------------------------------------------

export const LiveGameResponse = Type.Union([
  Type.Object({
    id: Type.String(),
    opponent: Type.Object({
      id: Type.String(),
      nickname: Type.String(),
      mmr: Type.Integer(),
    }),
    format: Type.Union([Type.Literal('bo1'), Type.Literal('bo3'), Type.Literal('bo5')]),
    currentSetNumber: Type.Integer(),
    currentSetScore: Type.Object({
      user: Type.Integer(),
      opponent: Type.Integer(),
    }),
    setsWon: Type.Object({
      user: Type.Integer(),
      opponent: Type.Integer(),
    }),
  }),
  Type.Null(),
])
export type LiveGameResponse_type = Static<typeof LiveGameResponse>

// ---------------------------------------------------------------------------
// GET /users/me/challenges/suggestions
// ---------------------------------------------------------------------------

const ChallengeSuggestionItem = Type.Object({
  id: Type.String(),
  nickname: Type.String(),
  mmr: Type.Integer(),
  h2h: Type.Object({
    wins: Type.Integer(),
    losses: Type.Integer(),
  }),
})

export const ChallengeSuggestionsResponse = Type.Object({
  items: Type.Array(ChallengeSuggestionItem),
})
export type ChallengeSuggestionsResponse_type = Static<typeof ChallengeSuggestionsResponse>

// ---------------------------------------------------------------------------
// GET /leaderboard
// ---------------------------------------------------------------------------

const LeaderboardEntry = Type.Object({
  rank: Type.Integer(),
  id: Type.String(),
  nickname: Type.String(),
  mmr: Type.Integer(),
  isMe: Type.Boolean(),
})

const LeaderboardMeEntry = Type.Object({
  rank: Type.Integer(),
  id: Type.String(),
  nickname: Type.String(),
  mmr: Type.Integer(),
})

export const LeaderboardResponse = Type.Object({
  top: Type.Array(LeaderboardEntry),
  me: Type.Union([LeaderboardMeEntry, Type.Null()]),
})
export type LeaderboardResponse_type = Static<typeof LeaderboardResponse>

// ---------------------------------------------------------------------------
// Profile schemas
// ---------------------------------------------------------------------------

export const AchievementItem = Type.Object({
  key: Type.String(),
  label: Type.String(),
  sub: Type.String(),
})

export const MmrHistoryPoint = Type.Object({
  label: Type.String(),
  mmr: Type.Integer(),
})

export const ProfileUserSchema = Type.Object({
  id: Type.String(),
  nickname: Type.String(),
  email: Type.Optional(Type.String()),
  city: Type.Union([Type.String(), Type.Null()]),
  mmr: Type.Integer(),
  tier: TierSchema,
  rank: Type.Integer(),
  createdAt: Type.String(),
  isMe: Type.Boolean(),
})

export const ProfileStatsSchema = Type.Object({
  totalGames: Type.Integer(),
  wins: Type.Integer(),
  losses: Type.Integer(),
  winRate: Type.Union([WinRateSchema, Type.Null()]),
  currentStreak: Type.Union([CurrentStreakSchema, Type.Null()]),
  bestWinStreak: Type.Union([Type.Integer(), Type.Null()]),
  avgSetsPerWin: Type.Union([Type.Number(), Type.Null()]),
  lastDelta: Type.Union([Type.Integer(), Type.Null()]),
})

export const ProfileResponse = Type.Object({
  user: ProfileUserSchema,
  stats: ProfileStatsSchema,
  achievements: Type.Array(AchievementItem),
  mmrHistory: Type.Object({
    bucket: Type.Union([Type.Literal('month'), Type.Literal('match')]),
    points: Type.Array(MmrHistoryPoint),
  }),
})
export type ProfileResponse_type = Static<typeof ProfileResponse>

// ---------------------------------------------------------------------------
// PATCH /users/me
// ---------------------------------------------------------------------------

export const PatchMeBody = Type.Object({
  nickname: Type.Optional(Type.String({ minLength: 3, maxLength: 20, pattern: '^[a-zA-Z0-9._-]+$' })),
  city: Type.Optional(Type.Union([Type.String({ maxLength: 64 }), Type.Null()])),
})
export type PatchMeBody_type = Static<typeof PatchMeBody>

export const PatchMeResponse = Type.Object({
  id: Type.String(),
  nickname: Type.String(),
  email: Type.String(),
  city: Type.Union([Type.String(), Type.Null()]),
  mmr: Type.Integer(),
  role: Type.String(),
})
export type PatchMeResponse_type = Static<typeof PatchMeResponse>
