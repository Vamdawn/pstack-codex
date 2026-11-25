---
name: setup-pstack
description: Configure optional project-local model or reasoning overrides for pstack Codex roles and check the capabilities available in this session.
---

# Setup pstack

Read the [Codex runtime guide](../poteto-mode/references/codex-runtime.md) for the project configuration schema and dispatch rules.

1. Find the project's Git root and check whether it has a `.pstack-codex.json` file. Show the existing role settings. When the file is absent, every role uses Codex defaults.
2. Check the available `spawn_agent` parameters before proposing overrides. Use only model identifiers exposed by the active Codex host or supplied by the operator. Check the reasoning effort values for the intended model when the host exposes them. State any field the host cannot use.
3. If the user wants role overrides, show the proposed role values and confirm them using the available input tool or directly in the chat. The runtime guide lists the literal role keys. Use ordered arrays for the arena runners, arena judge pool, and interrogate reviewers. An empty seat object inherits Codex defaults and still counts as one seat.
4. Write or update `.pstack-codex.json` only for approved settings. Merge the changed roles, preserve other roles and config, and read the JSON back. Report malformed input or config and keep the existing file intact until its repair is requested.

For example, a high-effort feature and two arena seats, one of which inherits both fields:

```json
{
  "roles": {
    "feature, refactoring": { "reasoningEffort": "high" },
    "arena runners": [{}, { "reasoningEffort": "high" }]
  }
}
```

Tell the user what changed and which roles inherit. If the project lacks a live verification harness or a formal verification skill and the user wants one, read [create-verification-skill](../create-verification-skill/SKILL.md) or [create-formal-verification-skill](../create-formal-verification-skill/SKILL.md).
