---
name: automate-me
description: Capture the user's durable working preferences in a personal or project mode skill. Use when asked to automate me, or create or refresh a personal mode skill.
---

# Automate me

A guided flow for turning the user's working conventions into a skill agents will follow. The output is one `-mode` skill tailored to them (e.g. `jay-mode`, `priya-mode`).

Mine the available conversations, author with the Codex skill creator, and apply [unslop](../unslop/SKILL.md) to the resulting prose.

## Flow

### 0. Check for an existing skill

Look for an existing matching mode skill in `.agents/skills/` or `~/.agents/skills/`, including personal category directories. If one exists and the user has not specified an update, confirm whether to update it or start fresh:

- Update the existing skill (default for repeat runs)
- Start fresh (rare, ask why before doing it)

Update mode changes the rest of the flow:
- Step 1 mines only history since the skill was last edited (`git log -1 --format=%cI <path>`).
- Step 2 asks what's changed or missing, not what to capture from zero.
- Step 4 edits the existing file in place. Preserve sections the user hasn't contradicted. Revise ones with new evidence. Add new sections only for genuinely new rules.

### 1. Mine their history

Use the current conversation and any prior chats the user explicitly identifies or supplies. Read the [Codex runtime guide](../poteto-mode/references/codex-runtime.md) for accessing named chats. If no historical evidence is available, work from the current conversation and direct questions.

Look for recurring patterns across the supplied chats. When several independent source slices are available, use `spawn_agent` with no-edit briefs and the exact evidence paths or chat IDs. Await the findings. Give each worker the same return format, with an evidence link or ID for each observation. Default signals worth hunting:

- Response preferences (length, tone, format, "dumb it down" corrections)
- Delegation habits (subagents, models, specialized workflows, parallelism)
- Verification posture (what "done" means, unit tests vs live repro, reviewers)
- Code and prose discipline (style, principles cited, lint/format tools)
- Process conventions (worktrees, commits, PRs, review/merge tooling)
- Meta preferences (fixing skills mid-task, proposing new ones)

Cross-check patterns across sources. When a preference comes from one conversation, confirm it directly before codifying it.

### 2. Ask the user directly

Confirm preferences the evidence could not establish. Use Codex's structured input tool when available, or ask the same choices directly in chat.

Start with one or two concise questions about the areas that matter most. Follow up on their choices, then ask for any convention the options missed.

Don't dump 20 questions.

### 3. Cluster findings

Group the combined signals into sections. Common ones (use only what applies):

- **Response style**: length, tone, format.
- **Autonomy**: how much to do without asking, MCP tool use.
- **Understand first**: which skills to reach for when scoping or investigating a change.
- **Subagents**: default, parallelism, model-to-task, specialized workflows.
- **Prose / code discipline**: principles, lint tools, style guides.
- **Review and verify**: repro posture, verification skills, live-testing tools.
- **Process**: git worktrees, commits, PRs, review/merge tooling.
- **Skills**: skill-authoring habits, fix-the-skill-first, proposing new skills.

The **poteto-mode** skill shows the shape. Read it for granularity. Don't copy its content. The user's rules are not the same as poteto-mode's.

### 4. Draft the skill

Use `$skill-creator` when available. Otherwise write a skill directory with `SKILL.md`, a stable `name`, and a focused `description`.

- Save the mode under `.agents/skills/<handle>-mode/`, preserving an existing project category. Use `~/.agents/skills/<handle>-mode/` when the user chooses personal scope.
- Handle: the user's first name or chosen identifier.
- Describe the user's name and the request to work in their style. Use a single YAML scalar and keep general development requests outside the trigger.
- Tell the user to select the mode from the Codex skill picker when they want it to apply.
- In `agents/openai.yaml`, set `policy.allow_implicit_invocation: false` unless the user asks for implicit activation.

### 5. Iterate on prose

Apply [unslop](../unslop/SKILL.md) and the skill creator's writing guidance.

Show the draft to the user and take feedback. Expect multiple iterations. Cut ruthlessly. A mode skill is not a manual.

### 6. Land it

For a project submission, use a dedicated worktree. Commit or open a PR or MR when authorized, following the [forge routing guide](../poteto-mode/references/codex-runtime.md#forge). For a personal skill, update the approved local directory.

## Guardrails

- **Don't overfit to one conversation.** A preference stated once and contradicted another time is noise. Require multiple instances before codifying it.
- **Don't be clever.** Restating other skills' contents, inventing metaphors, or writing "poetic" prose for an agent reader is cost without benefit. Keep it operational.
- **Reference, don't inline.** Other skills the user relies on should appear as path references, not pasted excerpts. Same for any principle docs they maintain elsewhere.
- **Keep sections minimal.** Only add a section if the user has a specific, non-default rule there. "Communicate clearly" is not a section. "Short paragraphs. Tables when comparing options. Bullets only when items are genuinely parallel." is.
- **Name conventions generic.** Use "the user" or "the human" in imperatives, not the author's first name.
- **Don't force symmetry.** If a user has no process rules worth writing down, skip the Process section entirely.

## Evaluation

Read a representative result with the user and revise anything that misses their conventions.

Run a description-optimization loop only if the skill's trigger accuracy turns out to be a problem in practice.

## When not to use

- For a task-specific skill, use `$skill-creator` directly.
- User wants to capture one narrow workflow (e.g. "how I write commit messages"). That's a regular skill, not a mode skill.
