# P0 启动前文件地图

检查日期：2026-10-29。初始工作区仅有空 `.git`，没有应用源码、依赖、测试或已有项目约定。当前只进行文档与仓库初始化。

## Files to Modify

| File | Purpose | Changes Needed |
| --- | --- | --- |
| README.md | 交付入口 | 当前状态、阅读顺序、准备与执行边界 |
| AGENTS.md / CONSTITUTION.md | 协作与质量 | 单写所有权、隔离工作树、证据和停止条件 |
| docs/requirements/ | 需求来源 | R-01 至 R-14、参考图及范围说明 |
| specs/ | 产品契约 | 架构、API、数据、任务、前端、UI、验收 |
| docs/waves/P0/ | 执行准备 | 计划、任务包、验收矩阵、状态与交接 |
| docs/agents/ | 角色职责 | 主控、前端、后端、验收、只读审核 |
| docs/decisions/ | 决策 | 范围、实现选型、协作、参考方法 |
| docs/audit/ | 准备证据 | 投入、验证、报告、限制 |
| .github/ | 协作模板 | PR 模板与 P0 CI 检查清单 |

## Dependencies

需求 → 规格 → 任务包 → 验收用例 → 真实运行证据 → 阶段报告。接口与数据变更必须同步消费者；当前无运行依赖。

## Test Files

当前无产品测试。P0 规划 JUnit/Mockito、真实 MySQL 集成测试、Vitest/React Testing Library，以及 Compose 人工闭环；不把文档检查称为产品测试。

## Reference Patterns

| Source | Pattern |
| --- | --- |
| XB-Dong/ccagent 的 AGENTS、CONSTITUTION、docs/waves | 波次工件集中存放，规格与证据追踪，任务包和单写所有权 |
| XB-Dong/classroom-annotator 的 P0-PLAN、AGENTS | 原生子 Agent、外部工作树、独立验收、任务交接与累计修复记录 |

## Risk Assessment

- 无现有 API 兼容风险；P0 新增 API 与数据库迁移。
- 准备阶段不安装依赖、运行应用或数据库、不创建开发工作树、不派发开发 Agent。
- 参考仓库文档仅是方法来源，不是本项目授权来源。
- 地图已由主 Agent 对照空目录与用户批准的计划审阅；后续产品实现仍等待明确的 P0 启动指令。
