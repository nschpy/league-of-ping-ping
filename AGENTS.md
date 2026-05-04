# CLAUDE.md

This file provides guidance when working with code in this repository.

## Project Overview

**League of Ping Pong** — a competitive platform for table tennis matches with MMR rating system. Users register with a starting rating of 1000 points and compete in matches that update their rating based on results.

## Commands

```bash
# Install all dependencies
npm run install:all

# Run both frontend and backend
npm run dev:all

# Run frontend only (Vite + React)
cd frontend && npm run dev

# Run backend only (TypeScript)
cd backend && npm run dev

# Build everything
npm run build:all

# Lint both
npm run lint:all
```

## Architecture

### Frontend (`frontend/`)
- React 19 + TypeScript + Vite
- Uses `vite` for dev server and building
- Entry point: `src/main.tsx` → `src/App.tsx`

### Backend (`backend/`)
- Fastify 5 + Mongoose 8 + TypeScript (ESM, `module: nodenext`, strict mode)
- Build outputs to `.build/`
- Entry point: `src/server.ts` → `src/app.ts`
- All routes under prefix `/api/v1/`
- For API development, use the **fastify-best-practices** skill

```
backend/src/
  server.ts                      # entrypoint: listen + graceful shutdown (SIGTERM/SIGINT)
  app.ts                         # buildApp(): регистрация плагинов + все роуты
  config/
    env.ts                       # process.env: MONGODB_URI, PORT, JWT_SECRET, JWT_TTL, CORS_ORIGINS, BCRYPT_ROUNDS
  plugins/
    mongoose.ts                  # mongoose.connect на старте, disconnect через onClose hook
    error-handler.ts             # setErrorHandler: DomainError → HTTP response
    jwt.ts                       # @fastify/jwt: app.authenticate, app.requireRole(...roles)
  shared/
    errors.ts                    # DomainError, NotFoundError, ConflictError, ValidationError, InvalidStateError,
                                 #   UnauthorizedError (401), ForbiddenError (403)
    pagination.ts                # PaginationQuery, PaginationResult<T>, buildPagination()
    ids.ts                       # toObjectId(string) — валидация и конвертация ObjectId
    tier.ts                      # tierFor(mmr) → { name, prev, next }  (Bronze/Silver/Gold/Platinum/Diamond/Master)
  modules/
    auth/
      auth.types.ts              # SignUpInput, SignInInput, AuthResponse
      auth.errors.ts             # InvalidCredentialsError
      auth.service.ts            # signUp (create user + JWT), signIn (bcrypt.compare + JWT)
      auth.routes.ts             # POST /auth/signup, POST /auth/signin, GET /auth/me
      index.ts                   # barrel
    user/
      user.model.ts              # IUser: displayName, username (unique), email (unique), passwordHash,
                                 #   country?, bio?, avatarColor, mmr, peakMmr, wins, losses, streak,
                                 #   recentResults, role (player|referee|admin), timestamps
      user.types.ts              # CreateUserInput, UpdateUserInput, UserFilter, UserPublic, UserSortBy
      user.errors.ts             # UserNotFoundError, DuplicateUsernameError, DuplicateEmailError
      user.repository.ts         # CRUD + applyGameResult (aggregation pipeline: mmr/peak/wins/losses/streak/recent)
      user.service.ts            # bcrypt-хеш, verifyPassword, applyGameResult, toPublicUser
      user.routes.ts             # GET /users, GET /users/:id, GET /users/:id/mmr-history,
                                 #   GET /users/:id/games, PATCH /users/me
      index.ts                   # barrel + singleton userService
    game/
      game.model.ts              # IGame: player1/2Id, refereeId, format, status, sets[],
                                 #   winnerId, player*MmrChange/Before, scheduledAt, court, notes,
                                 #   startedAt, completedAt, cancelledAt, timestamps
      game.types.ts              # CreateGameInput (+ court, scheduledAt, notes), RecordSetInput, GameFilter
      game.errors.ts             # GameNotFoundError, InvalidStateTransitionError, InvalidSetScoreError, SetLimitExceededError
      game.state.ts              # requiredWins, maxSets, isValidSetScore (≥11, отрыв ≥2), tallyWins, isWinCondition
      game.mmr-core.service.ts   # calculateDeltas(winnerMmr, loserMmr, format) — K: bo1=12, bo3=24, bo5=32
      game.repository.ts         # CRUD + pushSet / pushSetAndComplete (атомарные $push + $expr)
      game.service.ts            # стейт-машина: create, findById, findAll, start, recordSet, cancel, delete
      game.routes.ts             # POST /games, GET /games, GET /games/:id,
                                 #   POST /games/:id/start|sets|cancel, DELETE /games/:id
      index.ts                   # barrel + singleton gameService
    leaderboard/
      leaderboard.service.ts     # getLeaderboard (sorted by mmr, tier/search filter), getUserRank
      leaderboard.routes.ts      # GET /leaderboard, GET /leaderboard/me/rank
    mmr/
      mmr.routes.ts              # GET /mmr/forecast?aId=&bId=&format= → expA/expB/aWin/bWin
```

#### Сущности

**User** (`users` collection) — `displayName`, `username` (unique handle), `email` (unique), `passwordHash`, `country` (ISO-2), `bio`, `avatarColor` (0–5), `mmr` (default 1000), `peakMmr`, `wins`, `losses`, `streak` (>0 — win streak, <0 — loss streak), `recentResults` (до 6 символов `"W"`/`"L"`), `role` (`player | referee | admin`), timestamps.

**Game** (`games` collection) — `player1Id`, `player2Id`, `refereeId`, `format` (`bo1 | bo3 | bo5`), `status` (`pending | in_progress | completed | cancelled`), `sets` (embedded), `winnerId`, `player*MmrChange`, `player*MmrBefore`, `scheduledAt`, `court`, `notes`, `startedAt`, `completedAt`, `cancelledAt`, timestamps.

**Set** (embedded в Game) — `setNumber`, `player1Score`, `player2Score`, `winnerId`.

#### MMR

Elo-формула с K-фактором по формату: BO1=12, BO3=24, BO5=32. Рассчитывается в `game.mmr-core.service.ts`. При завершении игры `GameService.recordSet` вызывает `UserService.applyGameResult` — атомарное обновление всей статистики игрока одной MongoDB aggregation pipeline операцией.

### Database
- MongoDB (Mongoose 8)
- Use the **mongodb** skill when designing schemas or writing queries

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js with TypeScript (Fastify recommended)
- **Database**: MongoDB (via mongodb skill)