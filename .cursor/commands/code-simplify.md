---
description: Simplify code for clarity and maintainability — reduce complexity without changing behavior
---

Read and follow `.cursor/skills/code-simplification/SKILL.md`.

Simplify recently changed code (or the specified scope) while preserving exact behavior:

1. Study project conventions (`.cursor/rules/withfestival-frontend.mdc`, app-local Prettier/ESLint)
2. Identify the target code — recent changes unless a broader scope is specified
3. Understand purpose, callers, edge cases, and test/browser coverage before touching it
4. Scan for simplification opportunities (nesting, long functions, ternaries, names, duplication, dead code)
5. Apply each simplification incrementally — re-run tests/build after each change
6. Verify tests pass (or browser proof), build succeeds, and the diff is clean

If verification fails after a simplification, revert that change and reconsider. Follow up with `code-review-and-quality`.
