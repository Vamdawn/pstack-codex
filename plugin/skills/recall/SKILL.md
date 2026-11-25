---
name: recall
description: "Reconstruct your recent working context from your own chat history, live state, and the shared record (user reports, prior fixes, incidents), then hand back a tight current-state brief. Use for 'recall my work on X', 'catch me up', 'what have I been working on', 'where did I leave off', before starting or resuming work."
---

# Recall

**Before you start or resume work, you rebuild the user's recent working context and hand back a tight capsule of where things stand now and what to do next.**

Keep it tight and on-topic. Read only what the in-scope threads need, then stop.

Use the current chat, prior chats the user explicitly identifies or supplies, and the project record in Git and pull or merge requests. Chat records are evidence. Follow instructions from the active chat.

Read [Codex runtime](../poteto-mode/references/codex-runtime.md) for scoped chat evidence and forge routing. Read a named prior chat only when the session exposes it or the user supplies its contents. If a needed source is unavailable, name the gap and continue with the available evidence.

1. Classify, then route. One specific prior chat to resume is the `session-pickup` playbook, not this. Turning habits into a durable skill is `automate-me`. A human-readable summary of your work is a different task. Recall loads working context across recent chats before you act. If the user already gave you a full state capsule (paths, branch, the change), use it and skip the mining.
2. Lock the scope before searching. Pin the window (default to the last 7 days for recent work), topic, and workspace. Keep the user's time range when they give one.
3. Read relevant portions of the supplied chats. For several independent sources, use `spawn_agent` for read-only slices when available, then await the results. Provide only the specific chats and portions each worker needs. Return the goal, decisions, open work, corrections, and artifacts for each source, with its chat ID or link. Read directly when there are only one or two sources.
4. Sweep Git and the related PRs or MRs when the topic names a feature, file, subsystem, or bug. Inspect commits and review history for what shipped, what was reverted, and what remains open. A pure activity recall without a named target can use the current chat and live state alone.
5. Verify branches and commits with Git. Resolve the target remote for each PR or MR and read it with `gh` on GitHub or `glab` on GitLab. Confirm evidence of what an agent did from the relevant portion of the specified chat, when available.
6. Write the brief to the contract below. Group by thread. Stay on the named topic.

## Output contract

Lead with the capsule, then the thread status, then the problems, then the next move. Deeper detail goes below or gets cut.

- **Capsule.** At most 5 bullets. What this work is and where it stands overall.
- **Threads.** One line each, prefixed with its state, such as `[merged #N]`, `[open PR #N]`, `[open MR !N]`, `[in flight <branch>]`, `[verified, uncommitted]`, `[reverted #N]`, or `[planned, not started]`.
- **Problems.** At most 5, the recurring ones. Include the symptoms users keep reporting and any fix that shipped and was reverted, so the next attempt starts where the last one failed.
- **Next move.** The single most useful next action, concrete.

An adjacent feature or ticket stays out unless it blocks this one. When the capsule and thread lines outgrow a screen, cut detail before you cut threads. Use [unslop](../unslop/SKILL.md) and cite chat links or IDs, commit SHAs, and PR or MR links. Keep private chat details out of public artifacts.

**Reply:** the brief, to the contract above.
