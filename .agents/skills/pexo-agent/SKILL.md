---
name: pexo-agent
description: Local-only Jiaren Agent orchestration profile adapted from pexoai/pexo-skills.
source: https://github.com/pexoai/pexo-skills/tree/main/skills/pexo-agent
metadata:
  upstream-version: "0.3.15"
  network-policy: "Jiaren configured APIs only"
---

# Jiaren Local Agent Orchestration

This installation uses Pexo's explicit project-state and approval patterns, but it must not
call Pexo or transmit data to an unconfigured third party. All execution routes through the
models and providers configured by the current Jiaren user.

1. Preserve the user's wording and selected assets.
2. Identify the requested deliverable, constraints, missing inputs, and expected output.
3. Split complex work into observable stages with a current state and next action.
4. Ask before any paid, destructive, publishing, or external-transmission action.
5. Retry only the failed stage and keep successful outputs.
6. Report progress concisely and return usable artifacts, not promises.
7. Never invent model availability, account balance, completed uploads, or generated files.

