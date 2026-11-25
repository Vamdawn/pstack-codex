# Git remote routing and GitLab monitoring

Run the helper with Bun. The bundled GitHub `watch-pr` command continues to handle GitHub checks and PR stacks.

## Resolve a target

```sh
bun <skill-dir>/scripts/forge/forge resolve
bun <skill-dir>/scripts/forge/forge resolve --remote upstream
bun <skill-dir>/scripts/forge/forge resolve --url https://gitlab.com/team/service/-/merge_requests/42
```

The output contains `provider`, `host`, `project`, and, when available, `remote` or the PR/MR `number`. A PR/MR link selects its exact destination project. With no override, the helper uses the tracked remote, then `origin`, then the sole remote. Use `--remote` or `--url` when a different destination is intended.

For a known self-managed instance, register its API host in local Git config. Set up authentication in `glab` separately.

```sh
git config --local --add pstack.gitlabHost gitlab.example.com
```

The helper recognizes GitHub Enterprise hosts configured with `pstack.githubHost` for routing. An explicit HTTP remote port is used only for that GitLab call. For SSH remotes, configure a custom API port or protocol in the host-specific CLI settings. The helper strips SSH ports because SSH and API ports can differ.

## Inspect or watch a GitLab MR

```sh
bun <skill-dir>/scripts/forge/forge watch-mr --remote upstream --mr 42 --status-only
bun <skill-dir>/scripts/forge/forge watch-mr --url https://gitlab.com/team/service/-/merge_requests/42 --timeout 600
```

Without an IID or an MR link, the helper uses the unique open MR for the current or tracked branch within the selected source and target project. For a fork MR, use the destination MR URL.

The helper uses read-only `glab api` calls. It checks GitLab's merge status, the MR head pipeline, aggregate approvals, and all paginated discussions. `READY` requires a confirmed successful head pipeline, mergeability, satisfied approval policy, and no unresolved discussions. An unavailable or unrecognized prerequisite cannot produce `READY`. Re-check the result before any merge operation.

Each changed observation is one JSON line. Polling defaults to every 30 seconds for 15 minutes. Use `--interval` and `--timeout` to adjust it.

| Exit | Meaning |
| --- | --- |
| 0 | `READY`, `MERGED`, or one known observation with `--status-only` |
| 1 | `UNKNOWN`, or polling stopped at `BLOCKED` or `CLOSED` |
| 2 | Invalid arguments or the target could not be identified |
| 3 | The watch deadline expired |

[GitLab MR API](https://docs.gitlab.com/api/merge_requests/) · [Approvals API](https://docs.gitlab.com/api/merge_request_approvals/) · [Discussions API](https://docs.gitlab.com/api/discussions/) · [glab api](https://docs.gitlab.com/cli/api/)
