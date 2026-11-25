---
name: no-comments
description: "Spawn Comment Sicko, fix accepted findings, and offer encodings for claimed constraints."
---

# No comments

Spawn Comment Sicko. Act on accepted findings.

Defer to Comment Sicko's fresh perspective.

## Scope

Use the caller's files or diff. Otherwise use the current diff against the base branch, default `main`, including the working tree.

## Steps

1. Prepare an isolated worktree at the source checkout's HEAD. Carry in the scoped uncommitted changes before taking the baseline for the review. Follow [Codex runtime](../poteto-mode/references/codex-runtime.md) and use `spawn_agent` with the absolute path to [the Comment Sicko role](../poteto-mode/references/agents/comment-sicko.md), the review scope, and the isolated worktree path. The role may edit comments in scope and reports application-code findings for the lead. If the worktree or subagent is unavailable, report the independent pass as incomplete.
2. Inspect its report and the diff from the supplied baseline, preserving the user's existing edits. Reject application-code edits, scope escapes, exception-protected deletions, misstated `MUST KILL` reasons, and flags that treat kept intentional code as guilty. Reshape flags on our-code surprises stay actionable and their comments stay deleted. A keep survives only with proof it is about something we cannot change. Audit missed scoped lint and TypeScript suppressions. Correctness or safety suppressions stay actionable `MUST KILL`s. Before accepting thin `IMPORTANT` or `do not remove` findings, trace their symbol or read [why](../why/SKILL.md). Restore deletions only with exact exceptions and scoped proof. Ambiguous deletions stay deleted. Delete keeps that are refuted or still ambiguous. Transfer only accepted edits to the source checkout after checking the scoped baseline still matches. If it drifted, revalidate before applying. Rerun a rejected report once from the original baseline in the isolated worktree. Reject a second, report it open, and fail the pass.
3. Fix trivial accepted flags directly by deleting a dead path, dropping a parameter, or using the real API. If any fix needs a shape, read and follow [architect](../architect/SKILL.md) once for the accepted set and surrounding code. Stop at the sketch. Step 4 implements.
4. Implement the smallest root-cause fix in scope. Remove every named workaround. If the root cause is out of scope, land the smallest in-scope fix and report the rest open. The **principle-fix-root-causes** and **principle-redesign-from-first-principles** skills guide intent only. Neither authorizes widening the fence nor fixing instances outside it. Never bolt on symptom guards.
5. Constraint comments say `do not remove`, `do not change wording`, or `talk to X before changing`. Leave keeps about things we cannot change. Offer the cheapest in-scope type, runtime, test, or CI lint. Wait for interactive approval. Unattended and eval require caller pre-approval. If approved, encode then delete. Otherwise delete, report the constraint open, and sketch out-of-scope work.
6. Report the deletion count, restored comments, reruns, architect sketch, fixes, encoding offers, encodings, unenforced constraints, and other open work.
