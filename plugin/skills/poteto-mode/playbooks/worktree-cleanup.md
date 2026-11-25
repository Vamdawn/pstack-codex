### Worktree and simulator cleanup

1. Record disk usage and list worktrees with git worktree list --porcelain. Run scripts/worktree-audit.sh with the intended base and repository. Pass --remote or --url when the target needs to be pinned. Use the observed Git and PR or MR facts, including tracked changes, untracked files, branch reachability, and open changes. Pass --recent-worktree <absolute-path> only for recent use established by an explicitly provided chat, task, or decision record. Treat activity as unknown when it cannot be established.
2. Report candidates, usage, and the reason for each recommendation. Keep worktrees with uncommitted work, an open change, or known active use out of the removable set. Unknown usage requires operator review before removal.
3. Act only on the operator's confirmed cleanup set. Check each worktree again immediately before removing it. Use git worktree remove for clean worktrees. Surface modified files, ignored artifacts or active processes if the normal removal fails. A forced removal needs specific authorization tied to the affected path and content.
4. If simulator or cache cleanup was separately requested, identify the eligible local artifacts and the effect of deleting them first. Re-list worktrees and measure reclaimed disk after authorized cleanup.

Report the before and after disk usage, worktrees removed, and worktrees kept or pending review.
