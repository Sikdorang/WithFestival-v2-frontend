---
description: Run TDD workflow — write failing tests, implement, verify. For bugs, use the Prove-It pattern.
argument-hint: [args]
---

Read `.cursor/commands/test.md` and follow it exactly.

Arguments (passed to it as `ARGUMENTS`): $ARGUMENTS

Claude Code mapping: personas in `.cursor/agents/` are registered as subagents (`code-reviewer`, `security-auditor`, `test-engineer`) — spawn those via the Agent tool when the command fans out. Skills it names are registered under `.claude/skills/`.
