---
name: arena
description: "Spawn N parallel candidates at the same task, pick a base, graft the strongest parts of the losers into it. Use for $pstack-codex:arena, 'arena this', 'throw it in the arena', or when one attempt at a non-trivial artifact would lock in the wrong shape."
---

# Arena

Use `update_plan` when available to track Frame, Fan out, Cross-judge, Pick, Graft, and Verify.

## Phase A: Frame

Every candidate gets the same prompt, so the prompt is the contract.

1. State the artifact each candidate is producing.
2. Derive the rubric, 3-6 concrete gradeable criteria for what success looks like on *this* task. It is the picker's tool in Phase D. Candidates only see the task.
3. Read [Codex runtime](../poteto-mode/references/codex-runtime.md) and take runners from the optional `arena runners` role list. If it is absent, run two or more candidates with Codex defaults. Use different supported model overrides when diversity matters and repeat a model for generation-bound work. If an optional override is unavailable, use Codex defaults and disclose it. If the task requires that exact model, mark its seat incomplete. Keep at least two completed candidates before making a comparative pick.
4. Give every candidate that edits the repository an isolated Git worktree at the same starting state. Apply the same scoped uncommitted changes to each if its brief depends on them. For a candidate that only writes a standalone artifact, give it a separate output directory.

## Phase B: Fan out

Use `spawn_agent` for each runner, in one wave when the session has capacity. Give it the task, shared evidence paths, its exact worktree or output directory, and the artifact and rationale you expect. Pass `model` and `reasoning_effort` only for supported overrides. Wait for results through Codex. If subagents are unavailable, compare any locally produced alternatives as a single-agent result and report that the independent race could not run.

If a candidate produces no output, note the dropout and proceed when at least two candidates completed. Otherwise report the race as incomplete.

## Phase C: Cross-judge

After the candidates finish, use `spawn_agent` for one fresh judge with a no-edit brief and the candidate paths or diffs. Choose a supported entry from `arena cross-judge pool` that differs from the parent model if available. Otherwise use Codex defaults and disclose the actual degree of model diversity. If a distinct model is required and unavailable, record the judge seat as incomplete. While you read in Phase D, the judge scores each candidate against the rubric and recommends a base.

## Phase D: Pick a base

Read every candidate end to end before picking. Score each against the rubric criterion by criterion, not on holistic feel, and compare with the cross-judge when Phase C ran one. Agreement on the base confirms the pick. Disagreement means one of you is biased or the rubric was ambiguous. Read both rationales before deciding.

Pick the base a future maintainer can extend most easily without breaking invariants. When two feel tied, prefer the cleaner boundary or smaller API, per the Laziness Protocol.

## Phase E: Graft

Walk each losing candidate once more for what is worth porting into the base, usually one or two things per candidate, not most of it. Fold each graft in by hand, per the **redesign-from-first-principles** principle skill, so the result stays coherent under one mental model. Don't paste mechanically.

If the candidates converge on one shape, that is strong agreement. Note it and ship the consensus shape. No graft is needed. If they wildly diverge, Phase A was under-specified. Reframe and re-run rather than averaging the divergence.

## Phase F: Verify

Verify the synthesized artifact like any other output, per the **prove-it-works** principle skill. If verification finds a problem the arena missed, either Phase A was wrong (re-frame and re-run) or a candidate caught it and you missed the graft (go back to Phase E). Don't paper over it.

## Outputs

One synthesized artifact, with a short synthesis note alongside naming the base and why, the cross-judge's verdict or that Phase C skipped the judge, each graft with its source candidate, what was rejected and why, any convergence or dropouts, and the verification result.
