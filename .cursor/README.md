# Cursor agent skills (frontend)

Adapted from [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) (MIT) for **WithFestival-v2-frontend** only.

## Layout

| Path | Purpose |
|------|---------|
| `commands/` | Slash commands: `/spec` `/plan` `/build` `/test` `/review` `/code-simplify` `/ship` |
| `skills/` | 19 lifecycle skills + `using-agent-skills` router |
| `references/` | Frontend-trimmed checklists |
| `agents/` | Personas for `/ship` and deep reviews |
| `rules/` | Always-on routing + monorepo conventions |

## Excluded (backend / not FE-fit)

Not installed: `observability-and-instrumentation`, `interview-me`, `constraint-driven-development`, `source-driven-development`, `doubt-driven-development`, `/constraints`, `/webperf`, `web-performance-auditor`.

## Usage

1. Type `/spec`, `/plan`, `/build`, … in Agent chat, or
2. Ask for work normally — agent should route via `using-agent-skills`.

## Upstream updates

```bash
# from a fresh clone of addyosmani/agent-skills
# copy only the skill folders listed in skills/using-agent-skills, then re-apply FE scope banners
```
