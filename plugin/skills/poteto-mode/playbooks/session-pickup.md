### Session pickup

**You own the resume point. Read the prior trail, don't redo it.**

1. Locate the prior trail using the current chat, the exact Codex chat or task ID supplied by the user when accessible, a provided transcript or decision log, or a named branch, PR, or MR. Read the overview and last messages first, then find the decision points. Delegate large supplied records to a read-only subagent when available and keep the reduced timeline here. See the [runtime guidance](../references/codex-runtime.md#live-verification-and-resumption).
2. Reconstruct operational state. The branch and worktree, what already landed (`git log`, `git diff` against the base), the open todos, the decisions made. The prior trail is authoritative input. Verify mutable facts against the worktree and forge. Report missing history only where it affects the resume point.
3. Diff done vs pending. Compare what shipped against what was planned, name the resume point, do not re-run the prior repro or redo completed work. A "let me verify from scratch" pass means you're treating the trail as untrustworthy when it's authoritative.
4. Route the remaining work to the matching playbook and pick the verdict: continue the execution, ship a finished recommendation, ratify or override a prior conclusion, or postmortem a failed run. The pickup playbook ends here. The routed playbook owns the rest.
5. Verify the inherited claims against the original goal on the real artifact (the **principle-prove-it-works** skill). A passing prior self-report is not the proof.

**Reply:** where the prior agent stopped, what you inherited vs redid (ideally nothing redone), the resume point, and the outcome.
