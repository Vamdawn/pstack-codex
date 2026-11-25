---
name: poteto-help
description: Guides users through pstack setup, $pstack-codex:poteto-mode, and picking the skill, playbook, or principle for a task. Type $pstack-codex:poteto-help with a question.
---

# Poteto help

Answer the user's question about pstack, hand them a prompt they can send, and link the file the answer came from. For a help question, don't start the work. The user asked how, and a pstack run spends real tokens, so let them send the prompt.

A message that asks for work, such as "use pstack to fix this bug", is not a help question. Read [`poteto-mode`](../poteto-mode/SKILL.md), do the work under it when the user explicitly requested the mode.

This file maps questions to the skills and guide pages that hold the answers. Those files own the details. Read the file you route to before you quote it, and trust it when it disagrees with this map. Link the installed plugin files or their source checkout. Use the namespace pstack-codex in skill invocations.

## Find out what they need

Infer the need from the message and the conversation. A named situation, such as "which skill reviews a PR?", goes straight to its section. If the need is still unclear, ask one multiple-choice question with these options, then answer only the section they pick:

- Get set up
- Start a task with `$pstack-codex:poteto-mode`
- Pick a skill for a situation
- Fix a run that went wrong
- Make pstack my own

Check the state that changes the answer, and mention it only when it does:

- A missing .pstack-codex.json means each role inherits Codex defaults.
- No `verify-*` skill or other app harness in the project means agents have no scripted way to drive the app. Mention `$pstack-codex:create-verification-skill` when the question is about proving a change works.
- No formal verification skill in the project means no property is checked past what tests reach. Mention `$pstack-codex:create-formal-verification-skill` when the question is about a race, an invariant, or another case tests rarely hit. When one exists and the code it covers changed after the commit it records as last in sync, mention `$pstack-codex:maintain-formal-verification-skill` if the question touches that code.

## Get set up

Follow [Setup](../../docs/guide/01-setup.md). Invoke [setup-pstack](../setup-pstack/SKILL.md) to inspect the project and optionally set model overrides. The [Codex runtime reference](../poteto-mode/references/codex-runtime.md) lists model roles, workspace isolation, and GitHub and GitLab capabilities.

Each review candidate consumes its own model context. Use a smaller configured panel or leave role settings to Codex when that fits the task. Set expectations about the available models and subagents.

## Start a task with poteto-mode

Explicitly invoke poteto-mode with a goal and proof that can pass or fail. The skill selects a playbook and records its steps in the available Codex plan. A new task takes a new mention. Read [prompting](references/prompting.md) when helping the user phrase a request.

## Pick a skill

The default answer is `$pstack-codex:poteto-mode`, which runs most of the others when its steps need them. Name a skill directly when the user wants more or less of something than the playbook gives. Read the skill before you recommend it, and give one example prompt.

| The user wants to | Skill |
|---|---|
| Do any non-trivial task with rigor | [`$pstack-codex:poteto-mode`](../poteto-mode/SKILL.md) |
| Check that the agent understood their goal and the problem before it starts | [`$pstack-codex:in-your-own-words`](../in-your-own-words/SKILL.md) |
| Get a prompt rewritten deeper, not bigger, before sending it: what a top professional would add, their raw material and methods, and an outside check. It returns the prompt and doesn't do the task | [`$pstack-codex:sharpen`](../sharpen/SKILL.md) |
| Learn the expert words for what they're building, including words borrowed from neighboring fields, with every cited source checked, and get their description rewritten with them | [`$pstack-codex:reframe`](../reframe/SKILL.md) |
| Know how code works now, or where new code should live | [`$pstack-codex:how`](../how/SKILL.md) |
| Know why code is shaped this way, or where a number came from | [`$pstack-codex:why`](../why/SKILL.md) |
| Understand a change or subsystem, explained plainly | [`$pstack-codex:teach`](../teach/SKILL.md) |
| Catch up on their own recent work on a topic | [`$pstack-codex:recall`](../recall/SKILL.md) |
| Catch up on what changed in this chat since their last message, in plain words and small visuals, with every item waiting on them listed and decidable from the reply alone | [`$pstack-codex:ketchup`](../ketchup/SKILL.md) |
| Catch up like `$pstack-codex:ketchup`, in a short subtitled video of slides, with the waiting calls as text under it | [`$pstack-codex:ketchup-video`](../ketchup-video/SKILL.md) |
| Know what a small diff could break outside itself | [`$pstack-codex:blast-radius`](../blast-radius/SKILL.md) |
| Settle types and module shape before code that crosses a function boundary | [`$pstack-codex:architect`](../architect/SKILL.md) |
| Get several attempts at one brief, merged into the best one | [`$pstack-codex:arena`](../arena/SKILL.md) |
| Run parallel checks over slices, or race workers, as Codex subagents | [`$pstack-codex:swarm`](../swarm/SKILL.md) |
| Have different models review a diff and try to break it | [`$pstack-codex:interrogate`](../interrogate/SKILL.md) |
| Fix a bug test-first when a cheap local test exists | [`$pstack-codex:tdd`](../tdd/SKILL.md) |
| Apply TypeScript rules to `.ts` or `.tsx` work | [`$pstack-codex:typescript-best-practices`](../typescript-best-practices/SKILL.md) |
| Strip comments before review, using a reviewer that didn't write them | [`$pstack-codex:no-comments`](../no-comments/SKILL.md) |
| Clean AI tells out of prose | [`$pstack-codex:unslop`](../unslop/SKILL.md) |
| Write docs, an RFC, a README, a PR description, or a commit message to a standard | [`$pstack-codex:technical-writing`](../technical-writing/SKILL.md) |
| Hear the last reply again in plain words | [`$pstack-codex:bro`](../bro/SKILL.md) |
| Give agents a scripted way to drive the app and prove behavior | [`$pstack-codex:create-verification-skill`](../create-verification-skill/SKILL.md) |
| Bring a verification skill and its feature map back in line with the app | [`$pstack-codex:maintain-verification-skill`](../maintain-verification-skill/SKILL.md) |
| Formally verify a race, invariant, or other property that tests rarely reach | [`$pstack-codex:create-formal-verification-skill`](../create-formal-verification-skill/SKILL.md) |
| Bring a formal verification back in line after the code it covers changed, and learn whether a failure is drift or a bug | [`$pstack-codex:maintain-formal-verification-skill`](../maintain-formal-verification-skill/SKILL.md) |
| Show a PM or designer what the user sees as a chart checked by a TLA+ model, with the shortest path to each state that breaks a rule | [`$pstack-codex:statechart`](../statechart/SKILL.md) |
| Vet a performance number before reporting or acting on it | [`$pstack-codex:benchmark-checklist`](../benchmark-checklist/SKILL.md) |
| Run a large or cross-cutting change, or one to review after stepping away | [`$pstack-codex:figure-it-out`](../figure-it-out/SKILL.md) |
| Keep a decision log during a run, and review it afterward | [`$pstack-codex:show-me-your-work`](../show-me-your-work/SKILL.md) |
| Check setup and optionally configure models and reasoning effort by role | [`$pstack-codex:setup-pstack`](../setup-pstack/SKILL.md) |
| Turn their own working habits into a personal mode skill | [`$pstack-codex:automate-me`](../automate-me/SKILL.md) |
| Turn what a finished task taught into skill edits | [`$pstack-codex:reflect`](../reflect/SKILL.md) |
| Stop agents from repeating the same mistakes in this repo | [`$pstack-codex:correct`](../correct/SKILL.md) |
| Find their way around pstack | `$pstack-codex:poteto-help` |

If a skill directory next to this one is missing from the table, read its frontmatter and route by its description. The `principle-*` directories are covered under principles below.

Close calls:

- `$pstack-codex:how` explains what the code does. `$pstack-codex:why` explains the reasons. `$pstack-codex:teach` runs one or both and explains the result plainly.
- `$pstack-codex:arena` gives every worker the same brief and merges the best parts. `$pstack-codex:swarm` splits work into slices or a race and returns one report.
- `$pstack-codex:interrogate` reviews the diff. `$pstack-codex:blast-radius` looks for breakage outside the diff and proves the one fact that makes the change safe.
- `$pstack-codex:recall` rebuilds context across recent chats. `$pstack-codex:ketchup` covers only this chat since the user's last message. Resuming one specific chat or branch is the Session pickup playbook.
- `$pstack-codex:figure-it-out` designs one rigorous run. The Autonomous run playbook drives one task to a finish condition.

Use the project's own UI or CLI verification tools and Codex's skill-creator for authoring. The relevant playbooks describe these workflows.

## Playbooks and principles

Playbooks are step lists inside `$pstack-codex:poteto-mode`, not skills, so they have no slash command. Inside `$pstack-codex:poteto-mode`, describing the task picks one, and these phrases name one directly:

- "babysit this pr" or "check on pr 123" runs Babysit. It drives the PR to merge-ready and stops there. It doesn't merge unless the user asks to merge, land, or ship.
- "land the stack" runs Shipping.
- "take over this branch" runs Session pickup.
- "pause safely" runs Pause safely.
- "full autopilot on this queue" runs Autopilot-full. "autopilot, don't merge" runs Autopilot-stack.
- "run the eval playbook" runs Eval.

The Playbooks section of [`poteto-mode`](../poteto-mode/SKILL.md) lists every playbook. [Guide page 6](../../docs/guide/06-verify-and-ship.md) covers opening, babysitting, and landing a PR.

For work that spans phases or stacked PRs, asking `$pstack-codex:poteto-mode` for a plan runs the [Multi-phase plan playbook](../poteto-mode/playbooks/multi-phase-plan.md), which writes the plan and doesn't implement it. For a design question, the Prototype playbook or `$pstack-codex:architect` settles it in code first.

Principles are one-rule skills that `$pstack-codex:poteto-mode` reads and cites in its replies. The user rarely invokes one. They steer with the names instead, as in "apply prove it works. show me the real output." Typing `/principle-<name>` still loads one on demand. [Guide page 8](../../docs/guide/08-principles.md) lists them.

## Fix a run that went wrong

| Symptom | Fix |
|---|---|
| The mode stopped applying after a few turns | Invoke the mode explicitly for the next task. |
| A question got treated as the next step of the last task | Say "new task", or say the turn doesn't need the mode. |
| A new model choice had no effect | Check .pstack-codex.json, then start a fresh task with the mode skill and verify the reported dispatch. |
| Runs cost more than expected | See the cost paragraph under Get set up. |
| A skill didn't load on its own | Select the namespaced skill explicitly, or let the active playbook route to it. |
| Parallel agents overwrote each other | Give each agent its own worktree, or run them as Codex subagents, which each get their own machine. |
| An overnight run moved but finished nothing | Give the run an observable finish condition and retain a checkpoint. See [guide page 7](../../docs/guide/07-overnight.md). |
| The reply claims success from a green build | Ask for the real command, flow, stored value, or profile. That's the prove-it-works principle. |

For a run that drifts, [`references/prompting.md`](references/prompting.md) has one-line steers. [Guide page 10](../../docs/guide/10-recipes-and-pitfalls.md) has more pitfalls and the recipes worth copying.

## Make pstack my own

- [`$pstack-codex:automate-me`](../automate-me/SKILL.md) drafts a personal mode skill from the user's own history, to use alongside `$pstack-codex:poteto-mode`.
- [`$pstack-codex:reflect`](../reflect/SKILL.md) after a session turns its lessons into skill edits the user approves.
- `$pstack-codex:poteto-mode write a skill for <workflow>` runs the authoring playbook. The eval playbook tests a skill change blind.
- Fix a misbehaving skill in its own PR, not inside the feature work where it went wrong.

[Guide page 9](../../docs/guide/09-make-it-yours.md) covers each of these.

## Reply

Lead with the answer. Give at most one example prompt in a code block, adapted from [`references/recipes.md`](references/recipes.md) when one fits, then the link to that file. Keep it short unless the user asked for the whole map.
