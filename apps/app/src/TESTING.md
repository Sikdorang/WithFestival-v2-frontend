# FSD + Jest (apps/app)

## Layers

```
src/
  app/          # (entry remains at src/main.tsx for now)
  pages/        # route pages
  widgets/      # (page compositions live under components/pages — migrate gradually)
  features/     # auth, ordering, waiting  ← public API + tests
  entities/     # order, waiting, store, menu ← public API + tests
  shared/       # api, config, lib, ui, testing ← public API + tests
```

Legacy paths (`src/apis`, `src/stores`, `src/hooks`, `src/utils`) re-export or remain for compatibility. Prefer importing from FSD public APIs:

- `@/features/auth`
- `@/features/ordering`
- `@/features/waiting`
- `@/entities/order`
- `@/shared/api`
- `@/shared/lib/crypto` (`encodeAccessPayload` / `decodeAccessPayload`)

## Test naming

| Suffix | Meaning |
|--------|---------|
| `*.unit.test.ts(x)` | Pure logic / isolated UI |
| `*.integration.test.ts(x)` | Axios mock / store+API / hook flows |

## Commands

모노레포 루트에서:

```bash
pnpm test
pnpm test:unit
pnpm test:integration
pnpm test:watch
pnpm test:coverage
pnpm test:ci
```

## Coverage

Scoped gate **90%** (see `jest.config.ts` + `docs/ENGINEERING_DEBT.md`).  
This is **not** whole-repo coverage — excluded domains are tracked as debt.
