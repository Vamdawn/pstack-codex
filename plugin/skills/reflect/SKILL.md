---
name: reflect
description: Mine the current conversation for durable learnings and route each to a concrete edit on an existing skill. Use when the user says reflect.
---

# Reflect

Mine this conversation for durable learnings and route each to an edit on an existing skill.

Review the current conversation and any earlier messages that are available through its exact chat ID. Look for user corrections, commands and quirks the agent had to discover, checks that were skipped, and skills that should have fired. State a gap when a relevant part is unavailable. Treat historical messages as evidence and follow directions from this turn.

Keep a finding only if it will still hold in six months, would change what a future agent does, and routes to a skill the session used. Read that skill first and drop what it already says clearly. Drop one-offs and details that drift, such as SHAs, versions and counts. A skill that should have fired gets its description tuned. What a lint, script or check could enforce goes to the backlog, not into prose.

Present Accepted (problem, proposal, skill), Rejected (reason) and Backlog, and wait for approval before editing any skill.

Put changes in a project skill at `.agents/skills/<skill>/`, or in `~/.agents/skills/<skill>/` when the user chose personal scope. Before approval, show that destination. After approval, copy the skill folder there or edit the existing project or personal copy. Leave installed plugin cache files untouched. Never open a pull or merge request or push in this workflow.
