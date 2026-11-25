# pstack-codex

pstack adapted for Codex. Use `poteto-mode` to choose a development workflow, delegate to subagents, review changes, and verify behavior.

Based on Lauren Tan's pstack **0.15.48** from the `cursor/plugins` repository. Upstream is MIT-licensed. This plugin is version `0.15.48-codex.0`. [Upstream commit](https://github.com/cursor/plugins/tree/ca782ed8b3c2c521cead8e1720d55c3a5dbf2347/pstack)

## Installation

This release supports Codex desktop in Local and Worktree modes and the local Codex CLI. Run these commands to register the GitHub marketplace and install the plugin.

```sh
codex plugin marketplace add Vamdawn/pstack-codex
codex plugin add pstack-codex@pstack-codex
```

Codex fetches the marketplace from GitHub and copies only the files in `plugin/` during installation.

After registering the marketplace, you can also install the plugin from the `pstack-codex` source in the desktop Plugins directory. Start a new chat and invoke the skill explicitly.

```text
$pstack-codex:poteto-mode Find the cause of this regression, fix it, and run the relevant checks.
```

Use `$pstack-codex:setup-pstack` to check available capabilities or `$pstack-codex:poteto-help` to find a workflow. Skills require explicit invocation by default. You can optionally set a model and reasoning effort per role in the project configuration.

## Usage and requirements

- Use separate Git worktrees for parallel edits. Read-only reviews inspect the specified workspace. Reproductions that write files use an isolated worktree.
- GitHub workflows use `gh` and the bundled `watch-pr`. GitLab workflows use `glab` to inspect and monitor a single merge request. The plugin checks for an explicit PR or MR URL or remote first, then the current branch's tracking remote, then `origin` or the repository's only remote. Register a self-managed instance in the project's local Git configuration, for example with `git config --local --add pstack.gitlabHost gitlab.example.net`.
- PR and MR skills require Git, Bun, and an authenticated CLI for the hosting service. On its first run, GitHub's `watch-pr` installs locked dependencies into a private temporary cache and needs npm access. Worktree auditing also uses Bash and `jq`. The `statechart` skill uses a TypeScript runtime, TLC, and Java, as in upstream pstack. Interactive verification uses the project's existing browser, PTY, or other driver.
- Monitoring in the current chat ends when the completion condition is met or a blocker is reached. It leaves a note for resuming the work. You can configure scheduled runs separately in Codex Scheduled.
- `make-bot-ui` and Benny automation are deferred. GitLab support in this release covers one merge request at a time.

[User guide](plugin/docs/guide/README.md) · [Model and workspace conventions](plugin/skills/poteto-mode/references/codex-runtime.md) · [Skill compatibility](plugin/docs/compatibility.md)

## Maintenance

To update from upstream, review changes under `pstack/` since the commit linked above. Apply the changes that fit Codex, update the compatibility list, and rerun verification. Start each new upstream release at `<upstream-version>-codex.0`. Increment `N` in `<upstream-version>-codex.N` for adaptation fixes on the same upstream release.

```sh
node checks/check-package.mjs
node --test checks/*.test.mjs
bun test plugin/skills/poteto-mode/scripts/forge
```
