---
description: Conduct a five-axis code review — correctness, readability, architecture, security, performance
---

Read and follow `.cursor/skills/code-review-and-quality/SKILL.md`.
Persona (optional deep dive): `.cursor/agents/code-reviewer.md`.

Review current changes (staged or recent commits) across:

1. **Correctness** — Matches spec? Edge cases? Tests / browser proof adequate?
2. **Readability** — Clear names? Straightforward logic?
3. **Architecture** — Fits `www` vs `app` patterns? Clean boundaries?
4. **Security** — XSS, secrets, token storage? (`.cursor/skills/security-and-hardening/SKILL.md` + `.cursor/references/security-checklist.md`)
5. **Performance** — Bundle bloat, CWV risks? (`.cursor/skills/performance-optimization/SKILL.md` + `.cursor/references/performance-checklist.md`)

Categorize findings as Critical, Important, or Suggestion.
Output a structured review with specific file:line references and fix recommendations.

Skip backend-only concerns (SQL, DB indexes, server pooling).
