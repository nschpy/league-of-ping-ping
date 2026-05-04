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
- For API development, use the **fastify-best-practices** skill

```
backend/src/
  server.ts                      # entrypoint: listen + graceful shutdown (SIGTERM/SIGINT)
  app.ts                         # buildApp(): Fastify instance + plugin registration
  config/
    env.ts                       # загрузка и валидация process.env (MONGODB_URI, PORT, ...)
  plugins/
    mongoose.ts                  # mongoose.connect на старте, disconnect через onClose hook
    error-handler.ts             # setErrorHandler: DomainError → HTTP response
  shared/
    errors.ts                    # DomainError, NotFoundError, ConflictError, ValidationError, InvalidStateError
    pagination.ts                # PaginationQuery, PaginationResult<T>, buildPagination()
    ids.ts                       # toObjectId(string) — валидация и конвертация ObjectId
  modules/
    user/
      user.model.ts              # Mongoose Schema + Model + IUser interface + индексы (mmr, unique username/email)
      user.types.ts              # CreateUserInput, UpdateUserInput, UserFilter, UserPublic
      user.errors.ts             # UserNotFoundError, DuplicateUsernameError, DuplicateEmailError
      user.repository.ts         # CRUD: create, findById, findByUsername, findByEmail, findAll, updateOne, deleteOne, incrementMmr
      user.service.ts            # бизнес-логика: bcrypt-хеш, маппинг E11000 → доменные ошибки, toPublicUser
      index.ts                   # barrel + singleton userService
    game/
      game.model.ts              # Game Schema + embedded Set Schema + IGame/ISet interfaces + индексы
      game.types.ts              # CreateGameInput, RecordSetInput, GameFilter
      game.errors.ts             # GameNotFoundError, InvalidStateTransitionError, InvalidSetScoreError, SetLimitExceededError
      game.state.ts              # requiredWins, maxSets, isValidSetScore (≥11, отрыв ≥2), tallyWins, isWinCondition
      game.repository.ts         # CRUD + атомарные pushSet / pushSetAndComplete (findOneAndUpdate с $push + $expr)
      game.service.ts            # стейт-машина: create, findById, findAll, start, recordSet, cancel, delete
      index.ts                   # barrel + singleton gameService
```

#### Сущности

**User** (`users` collection) — поля: `username` (unique), `email` (unique), `passwordHash`, `mmr` (default 1000), `role` (`player | referee | admin`), timestamps.

**Game** (`games` collection) — поля: `player1Id`, `player2Id`, `refereeId`, `format` (`bo1 | bo3 | bo5`), `status` (`pending | in_progress | completed | cancelled`), `sets` (embedded array), `winnerId`, `player*MmrChange`, `player*MmrBefore`, `startedAt`, `completedAt`, `cancelledAt`, timestamps.

**Set** (embedded в Game) — `setNumber`, `player1Score`, `player2Score`, `winnerId`.

#### MMR

Расчёт MMR — TODO-хук в `game.service.ts` (вызывается при завершении игры, поля в схеме зарезервированы).

### Database
- MongoDB (Mongoose 8)
- Use the **mongodb** skill when designing schemas or writing queries

## Technology Stack

- **Frontend**: React 19, TypeScript, Vite
- **Backend**: Node.js with TypeScript (Fastify recommended)
- **Database**: MongoDB (via mongodb skill)