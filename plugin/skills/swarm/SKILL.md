---
name: swarm
description: "Fan out N parallel workers, drain them, and return one report. Use for $pstack-codex:swarm, 'swarm this', or parallel coverage, races, gauntlets, and exploration."
---

# Swarm

## Start

Track the phases with `update_plan` when available.

1. Frame
2. Fan out
3. Aggregate
4. Report

## Phase A: Frame

1. State the done predicate and the artifact or report the swarm must return.
2. Choose the shape. Partition into slices, race N workers on identical briefs, or mix both. For a race or mixed shape, declare `first pass`, `rank all`, or `best-of` before spawning.
3. Read [Codex runtime](../poteto-mode/references/codex-runtime.md) and use the optional `swarm workers` role for model and reasoning overrides. Use Codex defaults when the role is absent. When the user asks for a model race, name each arm up front and state which models actually ran.
4. Give each repository-writing worker its own Git worktree at the exact starting branch or commit. Include scoped uncommitted input when the work depends on it. For a worker writing only a standalone artifact, give it a separate output directory. A read-only worker gets the path and changes it may inspect. A worker verifying or measuring commits records the exact SHA and, for measurements, the sampling method and order.

## Phase B: Fan out

Use `spawn_agent` for workers, in one wave when capacity allows. Pass `model` or `reasoning_effort` only for supported overrides, following the fallback rules in the runtime guide. Pass a no-edit brief to read-only workers. Use Codex to await results. If subagents are unavailable, report which independent slices could not run and mark any sequential substitute as a single-agent pass.

Confirm each assigned checkout is at the intended starting state before allowing edits.

Every brief stands alone. Include the goal, scope, exact slice or race arm, how to verify, and what to report. Reports use `PASS`, `ISSUES`, or `BLOCKED` with evidence. A worker that can prove a defect reports `ISSUES` and lists every issue it can prove, not only the first.

If a worker drops out, proceed with N-1 and note it.

## Phase C: Aggregate

Read the terminal results. Drop a result that does not record the SHAs and method its brief names, and respawn that worker once. After a second miss, record a gap. A gap does not count as a pass. For coverage, every required slice needs a result. For a race, apply the selection rule declared up front. Use first pass, rank all, or best-of. Do not paste raw worker dumps.

## Phase D: Report

Return one consolidated in-chat report with a result table, issue one-liners, gaps or dropouts, and the race rule when used.
