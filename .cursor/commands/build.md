---
description: Implement tasks incrementally — build, test, verify, commit. Add "auto" to run the whole plan in one approved pass.
---

Read and follow `.cursor/skills/incremental-implementation/SKILL.md` alongside `.cursor/skills/test-driven-development/SKILL.md`. For UI, also use `.cursor/skills/frontend-ui-engineering/SKILL.md`.

## Modes

- **`/build`** — implement the *next* pending task, then stop.
- **`/build auto`** — generate the plan if needed, get a single approval, then implement *every* task without stopping between them.

`$ARGUMENTS` selects the mode. Treat `auto` (canonical) or `all` as autonomous mode; anything else (or empty) is single-task mode.

## Default: one task

Pick the next pending task from the plan. Then:

1. Read the task's acceptance criteria
2. Load relevant context (existing code, patterns, types) — stay in the correct app
3. Write a failing test for the expected behavior (RED). If no harness exists yet, add the minimal Vitest (+ RTL) setup for that app, then write the failing test
4. Implement the minimum code to pass (GREEN)
5. Run the test suite for the touched package; run `pnpm --filter <app> build` (or root `pnpm build` if needed)
6. For UI slices, verify with `.cursor/skills/browser-testing-with-devtools/SKILL.md` when browser MCP is available
7. Commit with a descriptive message (only if the user asked to commit, or confirm first)
8. Mark the task complete and stop

## Autonomous: `/build auto`

1. **Require a spec** at `SPEC.md`, `docs/SPEC.md`, or under `spec/`. Otherwise stop and tell the user to run `/spec`.
2. **Clean baseline** — if unrelated uncommitted changes exist, stop and ask.
3. **Plan if needed** via planning-and-task-breakdown.
4. **Single checkpoint** — wait for unambiguous approval ("approve", "go", "yes").
5. **Execute every task** in dependency order with the full RED → GREEN → verify → commit loop. One commit per task; never `git add -A` blindly.
6. **Stop and ask** on failing tests/builds without an obvious fix, ambiguous specs, or high-risk changes (auth token handling, secrets, irreversible deletes, deploys). Use `.cursor/skills/debugging-and-error-recovery/SKILL.md` when broken.
7. **Summarize** tasks completed, tests added, commits made, anything left for the user.

Frontend only — do not implement backend services.
