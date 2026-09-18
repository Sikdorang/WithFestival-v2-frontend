---
description: Start spec-driven development — write a structured specification before writing code
---

Read and follow `.cursor/skills/spec-driven-development/SKILL.md`.

This is a **frontend** monorepo (`apps/www`, `apps/app`). Spec only UI, client data flows, and browser behavior — not backend services.

Begin by understanding what the user wants to build. Ask clarifying questions about:
1. The objective and target users
2. Which app (`www` vs `app`) and core features / acceptance criteria
3. Tech constraints already in the monorepo
4. Known boundaries (what to always do, ask first about, and never do)

Then generate a structured spec covering: objective, commands, project structure, code style, testing strategy, and boundaries.

If the request bundles several independently testable capabilities, first propose a capability map (module ids, dependency direction, build order) per the skill's Phase 0 and get it approved, then spec each module in dependency order.

Save the spec as `SPEC.md` in the project root (or `docs/SPEC.md`) and confirm with the user before proceeding.
