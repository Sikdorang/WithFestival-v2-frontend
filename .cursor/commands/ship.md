---
description: Run the pre-launch checklist via parallel fan-out to specialist personas, then synthesize a go/no-go decision
---

Read and follow `.cursor/skills/shipping-and-launch/SKILL.md`.

`/ship` is a **fan-out orchestrator** for this **frontend** repo. Run three specialist personas in parallel against the current change, then merge into a go/no-go with a rollback plan.

## Phase A — Parallel fan-out

Spawn three subagents concurrently (single turn, parallel). Each should load its persona from `.cursor/agents/`:

1. **code-reviewer** — `.cursor/agents/code-reviewer.md` + `code-review-and-quality` (five-axis review)
2. **security-auditor** — `.cursor/agents/security-auditor.md` + frontend security checklist (XSS, secrets in env, token storage, dependency CVEs). Skip server password hashing / SQL.
3. **test-engineer** — `.cursor/agents/test-engineer.md` + coverage gaps (happy path, edge, error). Note missing harness if none exists.

Constraints:
- Personas do not call each other.
- Each returns only its report.

**Skip fan-out only if** all are true: ≤2 files, &lt;50 lines, and no auth/tokens/secrets/config/env. Otherwise default to fan-out.

## Phase B — Merge

1. **Code Quality** — Critical/Important from code-reviewer; lint/build failures
2. **Security** — Promote Critical/High security findings to blockers
3. **Performance** — CWV / bundle risks
4. **Accessibility** — keyboard, SR, contrast (`.cursor/references/accessibility-checklist.md`)
5. **Frontend ops** — env vars (`NEXT_PUBLIC_*` / `VITE_*`), feature flags, Sentry (app), Vercel/static deploy notes
6. **Documentation** — README/ADR/changelog as needed

## Phase C — Decision

```markdown
## Ship Decision: GO | NO-GO

### Blockers
### Recommended fixes
### Acknowledged risks
### Rollback plan
### Specialist reports
```

Rules: Critical finding → default NO-GO unless user accepts risk. Rollback plan mandatory before GO. Frontend deploy only (www / app) — no backend migrations.
