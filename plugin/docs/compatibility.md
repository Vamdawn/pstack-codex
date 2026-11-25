# 技能适配清单

覆盖上游的 59 个主技能。状态说明技能的移植方式。环境要求按每个工作流实际使用的工具判断。

| 技能 | 状态 | 备注 |
|---|---|---|
| `architect` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/architect/SKILL.md) |
| `arena` | 已适配 | 独立候选工作树与可选模型席位。[技能](../skills/arena/SKILL.md) |
| `automate-me` | 已适配 | 当前或明确指定的会话历史和项目技能路径。[技能](../skills/automate-me/SKILL.md) |
| `benchmark-checklist` | 条件可用 | 需要执行项目基准并查看测量环境。[技能](../skills/benchmark-checklist/SKILL.md) |
| `blast-radius` | 条件可用 | 需要项目代码和可执行验证，较大改动调用 arena。[技能](../skills/blast-radius/SKILL.md) |
| `bro` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/bro/SKILL.md) |
| `correct` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/correct/SKILL.md) |
| `create-formal-verification-skill` | 已适配 | 项目级技能及可执行的验证工具。[技能](../skills/create-formal-verification-skill/SKILL.md) |
| `create-verification-skill` | 已适配 | 项目级技能路径和应用驱动。[技能](../skills/create-verification-skill/SKILL.md) |
| `figure-it-out` | 已适配 | Codex 计划、独立工作树与决策日志。[技能](../skills/figure-it-out/SKILL.md) |
| `how` | 已适配 | 独立只读审查，缺委派时明确报告。[技能](../skills/how/SKILL.md) |
| `in-your-own-words` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/in-your-own-words/SKILL.md) |
| `interrogate` | 已适配 | 审查工作树含指定未提交内容，允许隔离写复现。[技能](../skills/interrogate/SKILL.md) |
| `ketchup-video` | 已适配 | 继承当前会话范围，需要本地视频渲染能力。[技能](../skills/ketchup-video/SKILL.md) |
| `ketchup` | 已适配 | 已知任务与 PR/MR 的状态。[技能](../skills/ketchup/SKILL.md) |
| `maintain-formal-verification-skill` | 已适配 | 项目技能与已有运行命令。[技能](../skills/maintain-formal-verification-skill/SKILL.md) |
| `maintain-verification-skill` | 已适配 | 并行审查与真实应用验证。[技能](../skills/maintain-verification-skill/SKILL.md) |
| `make-bot-ui` | 暂缓 | 需要替代 Cursor 的 webhook routine 和密钥交接。 |
| `no-comments` | 已适配 | 独立评论审查工作树和接受后的变更回传。[技能](../skills/no-comments/SKILL.md) |
| `poteto-help` | 已适配 | Codex 安装、调用及能力说明。[技能](../skills/poteto-help/SKILL.md) |
| `poteto-mode` | 已适配 | 显式路由、Codex 委派、GitHub/GitLab 分流与验证。[技能](../skills/poteto-mode/SKILL.md) |
| `principle-attack-the-premise` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-attack-the-premise/SKILL.md) |
| `principle-boundary-discipline` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-boundary-discipline/SKILL.md) |
| `principle-build-the-lever` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-build-the-lever/SKILL.md) |
| `principle-encode-lessons-in-structure` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-encode-lessons-in-structure/SKILL.md) |
| `principle-exhaust-the-design-space` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-exhaust-the-design-space/SKILL.md) |
| `principle-experience-first` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-experience-first/SKILL.md) |
| `principle-explain-the-number` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-explain-the-number/SKILL.md) |
| `principle-fix-root-causes` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-fix-root-causes/SKILL.md) |
| `principle-foundational-thinking` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-foundational-thinking/SKILL.md) |
| `principle-guard-the-context-window` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-guard-the-context-window/SKILL.md) |
| `principle-laziness-protocol` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-laziness-protocol/SKILL.md) |
| `principle-make-operations-idempotent` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-make-operations-idempotent/SKILL.md) |
| `principle-migrate-callers-then-delete-legacy-apis` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-migrate-callers-then-delete-legacy-apis/SKILL.md) |
| `principle-minimize-reader-load` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-minimize-reader-load/SKILL.md) |
| `principle-model-the-domain` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-model-the-domain/SKILL.md) |
| `principle-never-block-on-the-human` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-never-block-on-the-human/SKILL.md) |
| `principle-outcome-oriented-execution` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-outcome-oriented-execution/SKILL.md) |
| `principle-prove-it-works` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-prove-it-works/SKILL.md) |
| `principle-redesign-from-first-principles` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-redesign-from-first-principles/SKILL.md) |
| `principle-separate-before-serializing-shared-state` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-separate-before-serializing-shared-state/SKILL.md) |
| `principle-sequence-verifiable-units` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-sequence-verifiable-units/SKILL.md) |
| `principle-subtract-before-you-add` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-subtract-before-you-add/SKILL.md) |
| `principle-test-behavior-not-implementation` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-test-behavior-not-implementation/SKILL.md) |
| `principle-type-system-discipline` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/principle-type-system-discipline/SKILL.md) |
| `recall` | 已适配 | 当前或明确指定的会话，叠加 Git、PR/MR 证据。[技能](../skills/recall/SKILL.md) |
| `reflect` | 已适配 | 指定上下文和项目技能副本。[技能](../skills/reflect/SKILL.md) |
| `reframe` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/reframe/SKILL.md) |
| `setup-pstack` | 已适配 | 可选的按角色模型、推理强度与能力检查。[技能](../skills/setup-pstack/SKILL.md) |
| `sharpen` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/sharpen/SKILL.md) |
| `show-me-your-work` | 已适配 | 决策记录与明确可用的运行证据。[技能](../skills/show-me-your-work/SKILL.md) |
| `statechart` | 条件可用 | 保留 TypeScript、TLC/Java 和可选 SVG 渲染。[技能](../skills/statechart/SKILL.md) |
| `swarm` | 已适配 | 本机 Codex 委派，写入者各用独立工作树。[技能](../skills/swarm/SKILL.md) |
| `tdd` | 条件可用 | 需要项目测试或等价的可执行检查。[技能](../skills/tdd/SKILL.md) |
| `teach` | 已适配 | 调用已适配的 how、why 及可用的图表能力。[技能](../skills/teach/SKILL.md) |
| `technical-writing` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/technical-writing/SKILL.md) |
| `typescript-best-practices` | 已适配 | 显式调用，覆盖 TypeScript 文件。[技能](../skills/typescript-best-practices/SKILL.md) |
| `unslop` | 直接可用 | 沿用上游指令，使用 Codex 调用方式。[技能](../skills/unslop/SKILL.md) |
| `why` | 已适配 | Git 和对应 PR/MR 决策记录。[技能](../skills/why/SKILL.md) |

Benny 是主技能清单外的自动化包，首版暂缓。GitLab 首版支持单 MR，GitHub 继续支持 PR 栈。
