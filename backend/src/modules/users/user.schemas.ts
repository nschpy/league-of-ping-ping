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
