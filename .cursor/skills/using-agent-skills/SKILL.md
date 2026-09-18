---
name: using-agent-skills
description: Discovers and invokes agent skills. Use when starting a session, or when you need to decide which skill or workflow applies to the piece of work at hand. This is the meta-skill that governs how all other skills are discovered and invoked.
---

# Using Agent Skills (Frontend)

## Overview

This project uses a **frontend-only** subset of [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills). Skills live under `.cursor/skills/`. Do not invent backend work (DB, server migrations, API server implementation) — this repo is the WithFestival frontend monorepo only.

Slash entry points: `/spec` `/plan` `/build` `/test` `/review` `/code-simplify` `/ship`

## Skill Discovery

```
Task arrives
    │
    ├── Have a rough concept, need variants? → idea-refine
    ├── New project/feature/change? ──→ spec-driven-development
    ├── Have a spec, need tasks? ──────→ planning-and-task-breakdown
    ├── Implementing code? ────────────→ incremental-implementation
    │   ├── UI work? ─────────────────→ frontend-ui-engineering
    │   ├── Client API / module contracts? → api-and-interface-design
    │   └── Need better context? ─────→ context-engineering
    ├── Writing/running tests? ────────→ test-driven-development
    │   └── Browser-based? ───────────→ browser-testing-with-devtools
    ├── Something broke? ──────────────→ debugging-and-error-recovery
    ├── Reviewing code? ───────────────→ code-review-and-quality
    │   ├── Too complex? ─────────────→ code-simplification
    │   ├── Security concerns? ───────→ security-and-hardening
    │   └── Performance concerns? ────→ performance-optimization
    ├── Committing/branching? ─────────→ git-workflow-and-versioning
    ├── CI/CD pipeline work? ──────────→ ci-cd-and-automation
    ├── Deprecating/migrating? ────────→ deprecation-and-migration
    ├── Writing docs/ADRs? ───────────→ documentation-and-adrs
    └── Deploying/launching? ─────────→ shipping-and-launch
```

## Core Operating Behaviors

These behaviors apply at all times, across all skills. They are non-negotiable.

### 1. Surface Assumptions

Before implementing anything non-trivial, explicitly state your assumptions:

```
ASSUMPTIONS I'M MAKING:
1. [assumption about requirements]
2. [assumption about architecture]
3. [assumption about scope]
→ Correct me now or I'll proceed with these.
```

### 2. Manage Confusion Actively

1. **STOP.** Do not proceed with a guess.
2. Name the specific confusion.
3. Present the tradeoff or ask the clarifying question.
4. Wait for resolution before continuing.

### 3. Push Back When Warranted

Point out issues with concrete downsides, propose alternatives, accept an informed override.

### 4. Enforce Simplicity

Prefer the boring, obvious solution. Cleverness is expensive.

### 5. Maintain Scope Discipline

Touch only what you're asked to touch. Do not renovate adjacent systems.

### 6. Verify, Don't Assume

Evidence required: passing tests (or browser DevTools proof when no harness yet), build output, runtime data. See `../../references/definition-of-done.md`.

## Frontend Scope Rules

1. **This repo is frontend only** — `apps/www` (Next.js) and `apps/app` (Vite SPA). Never implement or modify a backend service here.
2. **API skill = client contracts** — types, axios modules, React Query hooks, error mapping, auth headers. Not server endpoints.
3. **Security = browser threats** — XSS, open redirects, secret leakage in `NEXT_PUBLIC_*` / `VITE_*`, token storage, CSP/CORS as consumed by the client. Password hashing and DB auth are out of scope.
4. **Performance = Core Web Vitals + bundles** — LCP/INP/CLS, code splitting, images, fonts. No DB query plans.
5. **App boundaries** — changes in `www` do not imply the same change in `app` (and vice versa).

## Skill Rules

1. Check for an applicable skill before starting work.
2. Skills are workflows, not suggestions — follow steps; don't skip verification.
3. Multiple skills can apply in sequence.
4. When in doubt on non-trivial work, start with `spec-driven-development`.

## Lifecycle Sequence

```
1.  idea-refine                 → Refine vague ideas
2.  spec-driven-development     → Define what we're building
3.  planning-and-task-breakdown → Break into verifiable chunks
4.  context-engineering         → Load the right context
5.  incremental-implementation  → Build slice by slice
6.  frontend-ui-engineering     → UI + a11y when UI is involved
7.  api-and-interface-design    → Client API / module contracts when needed
8.  test-driven-development     → Prove each slice works
9.  browser-testing-with-devtools → Runtime proof in the browser
10. code-review-and-quality     → Review before merge
11. code-simplification         → Reduce unnecessary complexity
12. git-workflow-and-versioning → Clean commit history
13. documentation-and-adrs      → Document decisions
14. deprecation-and-migration   → Retire old UI/paths when needed
15. shipping-and-launch         → Deploy safely
```

Bug fix path: `debugging-and-error-recovery` → `test-driven-development` → `code-review-and-quality`.

## Quick Reference

| Phase | Skill | One-Line Summary |
|-------|-------|-----------------|
| Define | idea-refine | Refine ideas through structured divergent/convergent thinking |
| Define | spec-driven-development | Requirements and acceptance criteria before code |
| Plan | planning-and-task-breakdown | Decompose into small, verifiable tasks |
| Build | incremental-implementation | Thin vertical slices, verify each before expanding |
| Build | context-engineering | Right context at the right time |
| Build | frontend-ui-engineering | Production-quality UI with accessibility |
| Build | api-and-interface-design | Stable client/module contracts |
| Verify | test-driven-development | Failing test first, then make it pass |
| Verify | browser-testing-with-devtools | Chrome DevTools MCP for runtime verification |
| Verify | debugging-and-error-recovery | Reproduce → localize → fix → guard |
| Review | code-review-and-quality | Five-axis review with quality gates |
| Review | code-simplification | Preserve behavior while reducing complexity |
| Review | security-and-hardening | Frontend OWASP, secrets, XSS, auth tokens |
| Review | performance-optimization | Measure first — Core Web Vitals, bundles |
| Ship | git-workflow-and-versioning | Atomic commits, clean history |
| Ship | ci-cd-and-automation | Automated quality gates on every change |
| Ship | deprecation-and-migration | Remove old UI paths and migrate users safely |
| Ship | documentation-and-adrs | Document the why, not just the what |
| Ship | shipping-and-launch | Pre-launch checklist, monitoring, rollback plan |
