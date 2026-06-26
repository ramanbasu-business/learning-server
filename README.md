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

## Tech stack

| Concern | Choice |
|---|---|
| Runtime | Node.js, Express 5, TypeScript |
| Controllers / routing | [`tsoa`](https://tsoa-community.github.io/docs/) — decorator-based controllers (`src/controllers/`) generate both the Express routes (`src/generated/routes.ts`) and an OpenAPI 3 spec (`spec/`) |
| HTTP client to core API | axios (`src/clients/coreApiClient.ts`) |
| Realtime | `ws` (raw WebSocket, upgrade-routed by URL path) |
| Error handling | Centralized Express error middleware in `index.ts`; throw `ApiError(status, message)` from controllers for typed HTTP errors |

## Project layout

```
src/
  index.ts                  # HTTP + WS server bootstrap, RegisterRoutes(app), error middleware
  config/env.ts              # env var loading
  clients/coreApiClient.ts   # axios client for learning-core-api
  controllers/UsersController.ts  # tsoa controller — source of truth for /api/users routes + spec
  services/userService.ts    # DTO assembly over coreApiClient
  types/dtos.ts               # BFF-internal DTOs (UserDto, UserResponse, RoleResponse)
  types/core-api.generated.ts # generated types for learning-core-api responses (see below)
  errors/ApiError.ts          # typed HTTP error thrown from controllers
  generated/routes.ts         # tsoa-generated Express routes (build output, not hand-edited)
```

## API contract pipeline

This service sits in the middle of a two-stage typed-API pipeline:

```
learning-core-api  --openapi-typescript-->  learning-server (src/types/core-api.generated.ts)
learning-server    --tsoa + openapi-typescript-->  learning-client (src/types/bff-api.generated.ts)
```

- `npm run tsoa:gen` reads `src/controllers/*.ts` and emits `spec/swagger.json` (OpenAPI) + `src/generated/routes.ts` (Express routes) — this is what actually serves requests, so controllers are the one place to add/change BFF endpoints.
- `npm run fetch:core-api-spec` fetches the **live** OpenAPI spec from `learning-core-api` (`http://localhost:5002/openapi/v1.json` by default, override with `CORE_API_URL_OPENAPI`) and writes it to `../learning-core-api/spec/swagger.json`. Requires `learning-core-api` to be running.
- `npm run generate:types` runs the fetch above, then `openapi-typescript` against that spec to produce `src/types/core-api.generated.ts` — typed shapes for calls made via `coreApiClient`.
- `learning-client` separately generates its own types from **this** service's `spec/swagger.json` (see its README).

## Environment variables (`.env`)

| Var | Purpose | Default |
|---|---|---|
| `API_PORT` | HTTP + WS listen port | `5001` |
| `CORS_ORIGIN` | Allowed origin(s) for the client | — |
| `CORE_API_URL` | Base URL of `learning-core-api` | `http://localhost:5002` |
| `CORE_API_URL_OPENAPI` | Override for fetching the core API's OpenAPI spec (used only by `fetch:core-api-spec`) | `http://localhost:5002/openapi/v1.json` |

## How to run

```bash
npm install
npm run dev
```

`dev` runs `build` (tsoa codegen + `tsc`) then starts the compiled server with `--watch`. Requires `learning-core-api` running (default `http://localhost:5002`).

To regenerate the BFF's own OpenAPI spec/routes after changing a controller:

```bash
npm run tsoa:gen
```

To refresh the BFF's typed view of `learning-core-api` (requires the core API running):

```bash
npm run generate:types
```

## Production build

```bash
npm run build
npm start
```

## Shared package

Consumes `@learning/shared` as a normal package dependency (installed from `git+https://github.com/ramanbasu-business/learning-shared.git`). Must be installable before deployment.
