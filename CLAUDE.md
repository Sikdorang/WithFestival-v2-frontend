# WithFestival frontend — Claude Code guide

`.cursor/` is the single source of truth for agent rules, skills, commands, and personas.
This file imports the always-on rules and maps them onto Claude Code. Edit `.cursor/`, not the wrappers.

## Always-on rules (imported from Cursor)

@.cursor/rules/withfestival-frontend.mdc
@.cursor/rules/agent-skills.mdc

## How Claude follows the agent-skills workflow

- Before non-trivial work, route via `.cursor/skills/using-agent-skills/SKILL.md` and read the matching `.cursor/skills/<name>/SKILL.md`. Each is also registered as a Claude skill under `.claude/skills/`.
- Core behaviors from the router are mandatory: surface assumptions, stop on confusion, push back with concrete downsides, prefer the boring solution, stay in scope, verify with evidence (`.cursor/references/definition-of-done.md`).
- Open `.cursor/references/*.md` checklists only when a skill says so.
- `apps/www` and `apps/app` are separate products — a change in one never implies the same change in the other.
- Next.js 16 in `apps/www`: read `node_modules/next/dist/docs/` before writing Next code (see `apps/www/AGENTS.md`).

## Slash commands

| Cursor | Claude Code | Notes |
|--------|-------------|-------|
| `/spec` | `/spec` | |
| `/plan` | `/plan-tasks` | renamed: `/plan` is a Claude built-in (plan mode) |
| `/build` | `/build` | `/build auto` runs the whole plan after one approval |
| `/test` | `/test` | |
| `/review` | `/review-code` | renamed: `/review` is a Claude built-in |
| `/code-simplify` | `/code-simplify` | |
| `/ship` | `/ship` | fans out to the `code-reviewer`, `security-auditor`, `test-engineer` subagents in `.claude/agents/` |

## Repo facts that override stale `.cursor` text

- `apps/app` already has a **Jest** harness (`pnpm --filter app test`, `test:ci` with a scoped 90% coverage gate). Use Jest there, not Vitest.
- `pnpm dev:mock` runs `apps/app` without the backend: `axios-mock-adapter` + in-memory fixtures in `apps/app/src/mocks/` (dev-only, excluded from prod bundles and coverage). Add a handler there when you add an API call.
- `apps/www` has no test harness. When behavior needs tests there, propose a minimal setup before adding one; otherwise give browser proof.
