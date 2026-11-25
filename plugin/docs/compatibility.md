# Skill compatibility

This list covers the 59 core upstream skills. Each status describes how the skill was brought to Codex. Runtime requirements depend on the tools that each workflow uses.

| Skill | Status | Notes |
|---|---|---|
| `architect` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/architect/SKILL.md) |
| `arena` | Adapted | Uses a separate worktree for each candidate and supports optional model assignments. [Skill](../skills/arena/SKILL.md) |
| `automate-me` | Adapted | Uses the current or explicitly selected chat history and project skill paths. [Skill](../skills/automate-me/SKILL.md) |
| `benchmark-checklist` | Conditional | Requires running project benchmarks and inspecting the measurement environment. [Skill](../skills/benchmark-checklist/SKILL.md) |
| `blast-radius` | Conditional | Requires project code and runnable verification. Uses arena for larger changes. [Skill](../skills/blast-radius/SKILL.md) |
| `bro` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/bro/SKILL.md) |
| `correct` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/correct/SKILL.md) |
| `create-formal-verification-skill` | Adapted | Creates project-level skills and runnable verification tools. [Skill](../skills/create-formal-verification-skill/SKILL.md) |
| `create-verification-skill` | Adapted | Uses project-level skill paths and an application driver. [Skill](../skills/create-verification-skill/SKILL.md) |
| `figure-it-out` | Adapted | Uses Codex planning, separate worktrees, and a decision log. [Skill](../skills/figure-it-out/SKILL.md) |
| `how` | Adapted | Runs an independent read-only review and reports when delegation is unavailable. [Skill](../skills/how/SKILL.md) |
| `in-your-own-words` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/in-your-own-words/SKILL.md) |
| `interrogate` | Adapted | Includes specified uncommitted changes in the review worktree and allows isolated reproductions that write files. [Skill](../skills/interrogate/SKILL.md) |
| `ketchup-video` | Adapted | Uses the current chat's scope and requires local video rendering. [Skill](../skills/ketchup-video/SKILL.md) |
| `ketchup` | Adapted | Reports the status of known tasks, pull requests, and merge requests. [Skill](../skills/ketchup/SKILL.md) |
| `maintain-formal-verification-skill` | Adapted | Uses project-level skills and existing verification commands. [Skill](../skills/maintain-formal-verification-skill/SKILL.md) |
| `maintain-verification-skill` | Adapted | Uses parallel review and verifies behavior in the actual application. [Skill](../skills/maintain-verification-skill/SKILL.md) |
| `make-bot-ui` | Deferred | Requires replacements for Cursor's webhook routines and secret handoff. |
| `no-comments` | Adapted | Reviews comments in a separate worktree and brings back accepted changes. [Skill](../skills/no-comments/SKILL.md) |
| `poteto-help` | Adapted | Explains how to install and invoke the plugin and which capabilities it supports. [Skill](../skills/poteto-help/SKILL.md) |
| `poteto-mode` | Adapted | Routes explicit invocations, delegates in Codex, handles GitHub and GitLab workflows, and verifies results. [Skill](../skills/poteto-mode/SKILL.md) |
| `principle-attack-the-premise` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-attack-the-premise/SKILL.md) |
| `principle-boundary-discipline` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-boundary-discipline/SKILL.md) |
| `principle-build-the-lever` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-build-the-lever/SKILL.md) |
| `principle-encode-lessons-in-structure` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-encode-lessons-in-structure/SKILL.md) |
| `principle-exhaust-the-design-space` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-exhaust-the-design-space/SKILL.md) |
| `principle-experience-first` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-experience-first/SKILL.md) |
| `principle-explain-the-number` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-explain-the-number/SKILL.md) |
| `principle-fix-root-causes` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-fix-root-causes/SKILL.md) |
| `principle-foundational-thinking` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-foundational-thinking/SKILL.md) |
| `principle-guard-the-context-window` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-guard-the-context-window/SKILL.md) |
| `principle-laziness-protocol` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-laziness-protocol/SKILL.md) |
| `principle-make-operations-idempotent` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-make-operations-idempotent/SKILL.md) |
| `principle-migrate-callers-then-delete-legacy-apis` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) |
| `principle-minimize-reader-load` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-minimize-reader-load/SKILL.md) |
| `principle-model-the-domain` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-model-the-domain/SKILL.md) |
| `principle-never-block-on-the-human` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-never-block-on-the-human/SKILL.md) |
| `principle-outcome-oriented-execution` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-outcome-oriented-execution/SKILL.md) |
| `principle-prove-it-works` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-prove-it-works/SKILL.md) |
| `principle-redesign-from-first-principles` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-redesign-from-first-principles/SKILL.md) |
| `principle-separate-before-serializing-shared-state` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-separate-before-serializing-shared-state/SKILL.md) |
| `principle-sequence-verifiable-units` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-sequence-verifiable-units/SKILL.md) |
| `principle-subtract-before-you-add` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-subtract-before-you-add/SKILL.md) |
| `principle-test-behavior-not-implementation` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-test-behavior-not-implementation/SKILL.md) |
| `principle-type-system-discipline` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/principle-type-system-discipline/SKILL.md) |
| `recall` | Adapted | Uses the current or explicitly selected chat and incorporates Git, PR, and MR evidence. [Skill](../skills/recall/SKILL.md) |
| `reflect` | Adapted | Uses the specified context and project-local copies of skills. [Skill](../skills/reflect/SKILL.md) |
| `reframe` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/reframe/SKILL.md) |
| `setup-pstack` | Adapted | Checks available capabilities and supports optional per-role model and reasoning settings. [Skill](../skills/setup-pstack/SKILL.md) |
| `sharpen` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/sharpen/SKILL.md) |
| `show-me-your-work` | Adapted | Records decisions and points to available evidence from the run. [Skill](../skills/show-me-your-work/SKILL.md) |
| `statechart` | Conditional | Retains TypeScript, TLC with Java, and optional SVG rendering. [Skill](../skills/statechart/SKILL.md) |
| `swarm` | Adapted | Delegates locally in Codex and gives each worker that writes files a separate worktree. [Skill](../skills/swarm/SKILL.md) |
| `tdd` | Conditional | Requires project tests or equivalent runnable checks. [Skill](../skills/tdd/SKILL.md) |
| `teach` | Adapted | Uses the adapted how and why skills and any available diagram tools. [Skill](../skills/teach/SKILL.md) |
| `technical-writing` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/technical-writing/SKILL.md) |
| `typescript-best-practices` | Adapted | Runs on explicit invocation and covers TypeScript files. [Skill](../skills/typescript-best-practices/SKILL.md) |
| `unslop` | Usable as-is | Uses upstream instructions with Codex invocation syntax. [Skill](../skills/unslop/SKILL.md) |
| `why` | Adapted | Uses Git history and decision records from the relevant PR or MR. [Skill](../skills/why/SKILL.md) |

Benny is a separate automation package and is deferred for this release. GitLab support covers individual merge requests. GitHub also supports stacked pull requests.
