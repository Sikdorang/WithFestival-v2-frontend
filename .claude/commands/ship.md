---
description: Run the pre-launch checklist via parallel fan-out to specialist personas, then synthesize a go/no-go decision
argument-hint: [args]
---

Read `.cursor/commands/ship.md` and follow it exactly.

Arguments (passed to it as `ARGUMENTS`): $ARGUMENTS

Claude Code mapping: personas in `.cursor/agents/` are registered as subagents (`code-reviewer`, `security-auditor`, `test-engineer`) — spawn those via the Agent tool when the command fans out. Skills it names are registered under `.claude/skills/`.
