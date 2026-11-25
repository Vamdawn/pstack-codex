# Codex runtime

Use the capabilities exposed in this Codex session. Resolve bundled paths relative to the loaded skill file. Use the namespaced mention $pstack-codex:<skill> when giving the operator an invocation. Inside a routed workflow, open the relevant bundled `SKILL.md` by its absolute path and follow it. Project-local skills belong under `.agents/skills/`.

## Delegation

Use `spawn_agent` for an independent worker, `wait_agent` for its result, and the available follow-up or interrupt tool when needed. Use `update_plan` for a tracked plan if available. A host may expose different tool names or fewer fields. Use its documented equivalent and pass only supported parameters. If a structured request tool is unavailable, ask the operator directly when a decision is required.

Start the brief with the absolute path to `worker.md`, then the task, goal, permitted writes, working directory, exact base, and acceptance evidence. A worker adopting the whole style also receives the absolute paths to `references/agents/poteto-agent.md` and the mode's `SKILL.md`. A comment review worker receives `references/agents/comment-sicko.md`. Use a fresh context for independence. If the host can enforce read-only access, use it. A no-edit brief is a behavioral constraint. Reviewers that only read inspect the named checkout or supplied diff. A reviewer that must produce a file, delete comments, or write a repro is a writer.

Create a separate Git worktree for every writing subagent and pass its absolute path. Give each writer its own branch if the work needs one. Base it on the exact commit under review and keep each writer's processes, ports, and mutable outputs separate where they can collide. In a repository with no commits, take a single-writer path until a base exists. Establish the worktree before spawning a writer. If Codex protects the source repository's Git metadata, use a permitted local clone in a private scratch directory and create the worker worktree in that clone at the same commit. Verify the commit and scoped baseline before dispatch. Treat the clone as a scratch copy and review its changes before transferring an accepted delta. If no isolated worktree can be created, do not parallelize writes on the checkout. A candidate that produces only a standalone artifact can use an isolated output directory and read the source without editing it.

A worktree created at HEAD starts with committed files. When the task depends on pending changes, capture the scoped tracked diff, including staged and unstaged changes and binary data, relative to that base. Apply it to the dedicated worktree and copy only the needed untracked files chosen from the scope. Check the destination against the intended snapshot before dispatch. Preserve the caller's index and worktree. Record the baseline before the agent edits so review can distinguish inherited changes from new ones. The parent checks the result and integrates only the accepted delta.

If no subagent can run, proceed serially where useful and label the result self-review. An independent verification requirement stays incomplete until an independent verifier runs. Report unsupported model overrides and worktree limits when they affect the result.

## Model configuration

The optional `.pstack-codex.json` file lives at the current project's Git root. Read its roles object once when starting a task or when the operator changes it. It may contain entries such as:

    {
      "roles": {
        "feature, refactoring": { "model": "a-model-available-in-codex", "reasoningEffort": "high" },
        "arena runners": [{}, { "reasoningEffort": "high" }]
      }
    }

Single roles are `feature, refactoring` (one literal key), `bug-fix`, `perf-issue`, `hillclimb`, `judgment and prose`, and `swarm workers`. Ordered panel roles are `arena runners`, `arena cross-judge pool`, and `interrogate reviewers`. Each single role or entry in a panel is an object with optional `model` and `reasoningEffort`. An empty object inherits both Codex defaults. With no configured panel, arena uses two independent candidates, its judge uses the Codex default, and interrogate uses three independent reviewers, subject to available concurrency. When no override for a field is configured, omit that field from dispatch to leave it to the host. With an override, pass `model` or `reasoning_effort` on `spawn_agent` only when the session supports it. Keep any explicitly requested model on its intended seat. If a model or effort fails and the operator did not require it, try the affected seat without that rejected override, once, and report the fallback. If a specified model is mandatory, mark the seat incomplete when it cannot run. Independent contexts can share a model. Describe model diversity only if the actual dispatch proved it.

Treat a missing configuration file as defaults and a malformed file as a configuration error to report. Leave the file intact. Setup changes it only when the operator requests model overrides and confirms the intended values. Project roles do not imply provider switching or permissions.

## Forge

Read the target from the plugin's Bun helper. Run the following from the repository, substituting the absolute directory of the mode skill for <mode>.

    bun <mode>/scripts/forge/forge resolve [--remote <name> | --url <remote-or-change-url>]

The helper reports provider, host, project, and a change number if the URL contains one. An explicit PR/MR target determines the destination. Otherwise the helper resolves the selected remote, the current branch's upstream, origin, or the sole remote. Carry the resolved host and project through every command. Report ambiguity before acting. For a self-managed instance, register a known host in the repository with git config --local --add pstack.gitlabHost gitlab.example.net or the analogous pstack.githubHost key. Routing uses the configured host names.

- GitHub uses gh with --repo HOST/OWNER/REPO. For the bundled Bun watch-pr script, use GH_HOST=HOST and pass --owner OWNER --repo REPO --pr NUMBER, including --timeout for a bounded wait. It handles individual PRs and GitHub stacks. Its first run may need network and a writable dependency directory to install its locked package dependencies.
- GitLab uses glab with --repo set to the resolved project URL. Watch a single MR with bun <mode>/scripts/forge/forge watch-mr --url <MR URL>, or use the resolved remote and --mr IID. Pass --status-only for one observation or a finite --timeout while waiting. Read the JSON verdict and the reported facts. A missing fact is an unknown. Treat an unknown blocker as open until verified. GitLab stack monitoring is outside this workflow.

The watcher observes. It never changes code, writes review feedback or requests a merge. Perform forge writes only when the operator authorized the action and the exact target is verified.

## Live verification and resumption

Use the project's matching verification skill, a repo test, an available browser or computer-use driver, or an interactive CLI test. Record the actual result for the user-visible surface. If no driver can exercise it, state which check remains incomplete.

Use the current chat, an explicitly named and accessible Codex chat or task, provided transcripts or decision logs, and Git and forge records. Use the host's task reader when the exact ID is available. Avoid sweeping transcript directories. Keep the last proven state, branch, worktree, head, PR/MR, next action, and stop predicate in the resume note or decision trail. Verify the live state against that record before continuing. Wait in the current task with bounded checks. Use Codex Scheduled only for a separately requested recurring task.
