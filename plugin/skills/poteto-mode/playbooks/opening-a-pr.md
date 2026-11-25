### Opening a PR or MR

Use this playbook when opening a change is part of the user's request.

Work from the assigned worktree off the intended base. Keep commits small and focused. Before committing, inspect the diff for redundant defenses, dead paths, type workarounds, and narrated comments. Remove only the additions that can be simplified without changing the intended behavior. Run the pertinent checks.

Use a title of the form type(scope): subject, naming a real symbol when helpful. Keep the body under 40 lines. Use the headings Why, What changed, Scope, Tradeoffs, Blast Radius, and Verification in that order, omitting empty sections.

Resolve the destination with the [runtime's forge helper](../references/codex-runtime.md#forge). For GitHub use gh pr create with the resolved repository, base, and head. For GitLab use glab mr create with the resolved project URL, explicit source branch, target branch, and head project when a fork is involved. Pass each flag separately and use the CLI's body-file or description-file option. Verify the branch actually exists on the intended remote before submitting. Open ready for review unless the user asked for a draft.

For a GitHub stack, base follow-ups on the branch they require. Treat GitLab MRs as individual changes. Report the created URL, head, and verification. Opening a change does not start a babysit.
