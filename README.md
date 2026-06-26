# learning-server

Node/Express **BFF (Backend for Frontend)** for `learning-client`. Owns no database — it aggregates and reshapes calls to `learning-core-api` for the UI, and terminates WebSocket connections for chat/notifications.

## Architecture

```
React (learning-client, :5000)
    │  HTTP (REST) + WebSocket
    ▼
Node BFF (learning-server, :5001)   ← this repo
    │  HTTP (axios)
    ▼
.NET Core API (learning-core-api, :5002)
    │
    ▼
PostgreSQL
```

Responsibilities:
- **Request aggregation / DTO shaping** — `userService.ts` calls `coreApiClient` (axios wrapper, `src/clients/coreApiClient.ts`) against `learning-core-api` and maps responses into `UserDto` (`src/types/dtos.ts`) for the client.
- **Auth passthrough** — `POST /api/users/auth` forwards credentials to `learning-core-api`'s `/api/users/auth` endpoint; the BFF does not hash or store passwords itself.
- **WebSocket relay** — `src/index.ts` runs a single HTTP server with two `noServer` `WebSocketServer` instances (`/chat`, `/notifications`), broadcasting messages to all connected clients on that channel.

This BFF intentionally does **not** own Postgres or RabbitMQ — both belong to `learning-core-api`. There is no DB driver or message-queue client in this codebase.

> Not yet implemented (planned): JWT issuance/verification and Redis-backed sessions/cache, which would make this the single owner of session state.

## Project layout

```
src/
  index.ts              # HTTP + WS server bootstrap
  config/env.ts          # env var loading
  clients/coreApiClient.ts  # axios client for learning-core-api
  routes/userRoutes.ts    # /api/users routes
  services/userService.ts # DTO assembly over coreApiClient
  types/dtos.ts           # shared response shapes
```

## Environment variables (`.env`)

| Var | Purpose | Default |
|---|---|---|
| `API_PORT` | HTTP + WS listen port | `5001` |
| `CORS_ORIGIN` | Allowed origin(s) for the client | — |
| `CORE_API_URL` | Base URL of `learning-core-api` | `http://localhost:5002` |

## Local development

```bash
npm install
npm run dev
```

Requires `learning-core-api` running (default `http://localhost:5002`).

## Production build

```bash
npm run build
npm start
```

## Shared package

Consumes `@learning/shared` as a normal package dependency (installed from `git+https://github.com/ramanbasu-business/learning-shared.git`). Must be installable before deployment.