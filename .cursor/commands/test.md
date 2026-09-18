---
description: Run TDD workflow — write failing tests, implement, verify. For bugs, use the Prove-It pattern.
---

Read and follow `.cursor/skills/test-driven-development/SKILL.md`. Patterns: `.cursor/references/testing-patterns.md`.

This repo currently has **no default test harness**. Do not skip tests — introduce Vitest (+ React Testing Library) for the app you touch when adding behavior.

For new features:
1. Write tests that describe expected behavior (they should FAIL)
2. Implement code to make them pass
3. Refactor while keeping tests green

For bug fixes (Prove-It):
1. Write a test that reproduces the bug (must FAIL)
2. Confirm it fails
3. Implement the fix
4. Confirm it passes
5. Run related tests / build for regressions

For browser UI issues, also follow `.cursor/skills/browser-testing-with-devtools/SKILL.md`.
