# Engineering debt (WithFestival-v2-frontend)

Living list of intentional gaps. Update when items are closed.

## Coverage scope (gate: 90%)

`apps/app` Jest coverage is **narrow by design**: FSD layers + the legacy modules they wrap (auth/order/waiting stores·APIs·hooks, shared crypto/api, ProtectedRoute, QuantityController).

### Included (see `apps/app/jest.config.ts` → `collectCoverageFrom`)

- `src/shared/**`, `src/entities/**`, `src/features/**`
- `src/stores/**`, selected `src/apis/**`, `useLogin` / `useOrder` / `useWaiting`
- `authLoader`, `ProtectedRoute`, `QuantityController`, key constants

### Explicitly excluded (debt)

| Area | Why excluded now | Next step |
|------|------------------|-----------|
| `apis/coupon`, `dating`, `loveAlarm`, `message`, `mission`, `reservation` | Not behind FSD public API yet | Add entity slices + tests |
| `pages/**`, most `components/pages/**` | UI-heavy; needs RTL + MSW/browser | Feature-level integration tests |
| `apps/www` | No test harness | Add Vitest/Jest smoke for contact API / lib |
| PWA / SocketProvider deep paths | Needs fake timers + socket mock | Dedicated reliability suite |

Saying “90% coverage” in reviews means **90% of the scoped surface above**, not the whole monorepo.

## Client secrets (done / remaining)

- [x] Removed `VITE_SECRET_KEY` + client AES pretending to encrypt QR payloads
- [x] QR/deep-link uses base64url JSON (`encodeAccessPayload` / `decodeAccessPayload`) — honest, not secret
- [ ] **Server-signed short-TTL booth access tokens** (backend + FE verify) — replaces opaque payloads for integrity
- [ ] Move access tokens from `sessionStorage` to httpOnly cookie (API cooperation)

## CI (done)

- [x] `.github/workflows/ci.yml` — lint, check-types, test:ci, build

## FSD / shared packages

- [ ] Finish migrating imports to `@/features/*`, `@/entities/*`, `@/shared/*`; delete unused legacy barrels
- [ ] Add `widgets/` or stop advertising it in docs
- [ ] **`@repo/ui`**: unused Turbo scaffold — delete package or replace with real DS
- [ ] Wire `apps/www` to `@repo/tailwind-config` **or** drop the unused dependency
- [ ] Point apps at `@repo/eslint-config` / `@repo/typescript-config`
- [ ] Remove nested `apps/*/package-lock.json`; single `packageManager` (root pnpm)

## Ops / DX

- [x] Sentry: DSN from env, no console log integration, basic PII scrub
- [ ] Confirm Sentry org/project/source maps in real deploy env
- [ ] Socket reconnect + Sentry capture on connect_error
- [ ] GlobalErrorBoundary → `Sentry.captureException`

## Idempotency (FE)

### Evaluation (2026-09)

| Path | Risk if double-submit | Before | After (FE) |
|------|----------------------|--------|------------|
| `POST /orders` | Duplicate paid orders | Debounce only; no key; `isLoading` not on Depositor CTA | In-flight lock + `Idempotency-Key` + CTA loading |
| `POST .../waitings` | Duplicate queue entries | Debounce + stale `isLoading` check | Lock at form + hook + `Idempotency-Key` |
| `POST .../reservations` | Duplicate bookings | `isSubmitting` race | Lock + `Idempotency-Key` |
| `POST /api/contact` | Duplicate Notion rows | Button loading only | Client key + in-memory replay cache |
| Admin PATCH toggles | Low (mostly idempotent states) | Debounce | Unchanged (debt) |
| Login / menu CRUD | Medium–low | Loading flags | Unchanged |

**Server must honor `Idempotency-Key`** on order/waiting/reservation for network retries to be safe. FE alone cannot dedupe across devices or after unlock.

### Remaining

- [ ] Backend: store key → response for create order / waiting / reservation (TTL ≥ 24h recommended)
- [ ] Extend keys to menu create, dating profile, coupon issue if product requires
- [ ] Contact: durable store (Redis/KV) — current Map is best-effort per process
