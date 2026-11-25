# pstack-codex

pstack 的 Codex 适配。用 `poteto-mode` 选择开发流程、委派子代理、审查改动并验证实际行为。

基于 Lauren Tan 的 pstack **0.15.48**，取自 `cursor/plugins` 提交 [`ca782ed8b3c2c521cead8e1720d55c3a5dbf2347`](https://github.com/cursor/plugins/tree/ca782ed8b3c2c521cead8e1720d55c3a5dbf2347/pstack)。上游使用 MIT 许可证。本插件版本为 `0.15.48-codex.0`。

## 安装

首版面向 Codex 桌面端 Local / Worktree 和本机 Codex CLI。用以下命令从 GitHub 注册 Marketplace 并安装插件。

```sh
codex plugin marketplace add Vamdawn/pstack-codex
codex plugin add pstack-codex@pstack-codex
```

Codex 从 GitHub 获取 Marketplace，安装时只复制 `plugin/` 里的插件文件。

也可以注册 Marketplace 后，在桌面端 Plugins 目录的 `pstack-codex` 来源中安装。新开任务，使用：

```text
$pstack-codex:poteto-mode 找到这个回归的原因，修复并运行对应的检查。
```

使用 `$pstack-codex:setup-pstack` 检查当前可用能力，或用 `$pstack-codex:poteto-help` 查找具体工作流。插件默认显式调用，项目设置中的角色模型和推理强度为可选项。

## 使用范围

- 并行写入使用各自的 Git worktree。纯审查读取指定工作区，需要落盘的复现使用独立 worktree。
- GitHub 使用 `gh` 和随包的 `watch-pr`。GitLab 使用 `glab`，支持单个 MR 的查询和持续监控。明确指定的 PR/MR URL 或 remote 优先，其次使用当前分支跟踪的 remote，再尝试 `origin` 或唯一 remote。自建实例可通过项目本地 Git 配置声明，例如 `git config --local --add pstack.gitlabHost gitlab.example.net`。
- 涉及 PR/MR 的技能需要 Git、Bun 和对应 forge 的已认证 CLI。GitHub `watch-pr` 首次运行会把锁定的 Bun 依赖安装到私有临时缓存，需要访问 npm。工作树审计还用到 Bash 和 `jq`。`statechart` 按上游方式使用 TypeScript 运行时、TLC 和 Java。交互验证使用项目已有的浏览器、PTY 或其他驱动。
- 当前会话的持续检查按完成条件或阻塞状态结束，留下续跑记录。定时执行可由用户在 Codex Scheduled 单独设置。
- `make-bot-ui` 和 Benny 自动化留待后续。GitLab 首版覆盖单 MR。

[使用指南](plugin/docs/guide/README.md) · [模型与工作区约定](plugin/skills/poteto-mode/references/codex-runtime.md) · [逐技能适配清单](plugin/docs/compatibility.md)

## 维护

需要跟进上游时，从本 README 记录的提交查看 `pstack/` 差异，手动应用适合 Codex 的改动，更新适配清单并重新验收。每次换上游版本，版本号从 `<上游版本>-codex.0` 开始。同一上游版本的适配修复递增 `N`。

```sh
node checks/check-package.mjs
node --test checks/*.test.mjs
bun test plugin/skills/poteto-mode/scripts/forge
```
