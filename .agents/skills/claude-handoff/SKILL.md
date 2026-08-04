---
name: claude-handoff
description: Safe handoff rules adapted from mattpocock/skills claude-handoff.
source: https://github.com/mattpocock/skills/tree/main/skills/in-progress/claude-handoff
---

# Agent Handoff

When a task changes stage or specialist, produce a compact handoff containing:

- objective and user decisions;
- completed work and verified evidence;
- current files or artifacts;
- unresolved risks and exact next action;
- suggested skills for the next stage.

Reference existing artifacts instead of duplicating them. Redact credentials, tokens,
personal data, and unrelated local paths. A handoff is state transfer, not a new interpretation
of the user's request.

