# Set up pstack-codex

## Install

Register the GitHub marketplace and install the plugin.

```sh
codex plugin marketplace add Vamdawn/pstack-codex
codex plugin add pstack-codex@pstack-codex
```

After registering the marketplace, you can also install the plugin from the `pstack-codex` source in the desktop Plugins directory. Start a new Codex chat in the project you intend to work on.

## Pick your models

Invoke $pstack-codex:setup-pstack to check the project and configure the roles you want to override. The role overrides live in .pstack-codex.json at the Git root. Unconfigured roles use the user's Codex defaults. Optional override fields select a supported model or reasoning effort per role. An array provides one entry per configured panel seat. See the [runtime configuration](../../skills/poteto-mode/references/codex-runtime.md#model-configuration) for the available roles and fallback rules.

## Configure the project's tools

Install the forge CLI used by the project only when you need PR or MR work. GitHub uses gh and the bundled Bun watcher. GitLab uses glab and the bundled Bun single-MR watcher. Authenticate in the selected CLI on the correct host. For a self-managed instance, add the hostname to the repository's Git config. An explicit PR or MR URL pins the target.

    git config --local --add pstack.gitlabHost gitlab.example.net
    git config --local --add pstack.githubHost github.example.net

If your agents need to drive an app, reuse the project's verification skill or invoke $pstack-codex:create-verification-skill. It writes .agents/skills/verify-<app>/ and proves one flow end to end. [Verify and ship](./06-verify-and-ship.md#create-a-project-verification-skill) covers the driver and evidence.

## Run your first task

In a Codex chat, explicitly select the mode skill and state a goal with a finish condition.

    $pstack-codex:poteto-mode fix the duplicate notification. reproduce it first, then show the regression check passing.

Continue the active task with ordinary follow-ups. Explicitly mention the mode again for a new task. Use $pstack-codex:poteto-help to choose a skill or diagnose a missing capability.

Next: [Route work through poteto-mode](./02-poteto-mode.md).
