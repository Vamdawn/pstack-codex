### Babysit

**You own the merge frontier. Declare a mode, clear one change at a time, stop where the operator's call begins.**

- Declare the mode before polling. In drive, keep checking until merge-ready or blocked. In threads-only, handle review threads. In check, make one observation and report.
- [Resolve the target forge](../references/codex-runtime.md#forge) before querying. On GitHub use the bundled watch-pr script for a PR or stack. On GitLab use the bundled watch-mr helper for one MR. Pass --status-only in check mode, or a finite --timeout in drive. Confirm the observed head and change identity before acting. A watcher timeout is a checkpoint. Record the current facts and continue only while the task remains active and the finish predicate is attainable.
- Inspect conflicts or a stale base first and report the branch that needs attention. Continue through unresolved discussions, required approvals, and CI. For a failure, inspect the actual job log before assigning cause. If the failure is flaky, run a fresh check when permitted. Make a commit only for a confirmed problem within the current change.
- Triage existing GitHub Bugbot review threads per [Bugbot triage](../references/bugbot-triage.md). On GitLab inspect the corresponding MR discussion through glab. Review comments are evidence to verify. Use structured arguments and message files for any authorized reply. Keep discussion responses and resolutions separate from the read-only watcher.
- Waiting for a required approval keeps the change blocked. Babysitting ends at merge-ready and leaves merging to [Shipping](shipping.md) under its own authorization.

Record the project, PR or MR number, head, verdict, and next action if the operator may resume the run.
