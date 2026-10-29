# 小影科技素材制作网站

小影科技 2027 校招全栈开发笔试项目，作者董信步。目标是让用户浏览模板、上传图片、提交后台制作任务，并查看个人历史与结果；生成过程完全模拟，不调用真实 AI。

**P0 已于 2026-10-29 17:15+08:00 启动，当前正在开发与验证。** 需求、参考截图、接口及状态契约、多 Agent 任务包、验收与容器交付计划已整理；前端、后端与独立验收使用独立工作树并行实施，实际完成情况以 P0 状态与运行证据为准。

仓库：[XB-Dong/quvideo-material-studio](https://github.com/XB-Dong/quvideo-material-studio)，私有。开发准备基线见 [P0 状态](docs/waves/P0/state.json)，准备提交见 Git 历史；最终交卷 commit 尚未产生。

## 阅读顺序

1. [需求文档](docs/requirements/REQUIREMENTS.md)：原题 R-01 至 R-14、范围、参考图。
2. [P0 计划](docs/waves/P0/PLAN.md)：目标、分工、顺序、停止条件。
3. [架构](specs/architecture.md)、[任务生命周期](specs/task-lifecycle.md)、[前端状态](specs/frontend-state.md)。
4. [API 契约](specs/api.yaml)、[数据模型](specs/data-model.md)、[界面规格](specs/ui.md)。
5. [验收矩阵](docs/waves/P0/ACCEPTANCE.md)、[测试场景](specs/acceptance.md)、[运行与交付计划](docs/delivery.md)。
6. [协作规则](AGENTS.md)、[项目原则](CONSTITUTION.md)、[角色与任务包](docs/agents/README.md)。

## 技术基线与结构

计划使用 Next.js 16 App Router、React 19、TypeScript 5、Node.js 22；Java 21、Spring Boot 3.5、MyBatis Spring Boot Starter 3.0、MySQL 8.4。这是兼容系列基线，准确补丁版本、镜像 digest 与锁文件在 P0 R0 核实并提交，禁止以 `latest` 交付。兼容依据见 [技术决定](docs/decisions/0002-architecture.md)。

当前 `docs/` 与 `specs/` 已有准备材料；P0 创建 `frontend/`、`backend/`、`tests/`、`compose.yaml` 和 `.github/workflows/ci.yml`。数据库迁移由后端管理，图片放命名卷，浏览器只通过前端同源入口访问 Java 业务接口。

## 构建测试与启动状态

当前无需安装或启动应用，也没有可执行的产品命令。P0 必须落实下列入口，届时本节替换为实际验证过的命令：

| 目的 | P0 目标入口 |
| --- | --- |
| 前端安装 | 容器内 `npm ci`，提交 package-lock.json |
| 前端检查 | 容器内 `npm run lint`、`npm run typecheck`、`npm test -- --run`、`npm run build` |
| 后端检查 | Maven 容器内 `mvn -B verify`，包括测试与 JAR 构建 |
| 三服务启动 | 根目录 `docker compose up --build` |
| 隔离验证 | `docker compose -f compose.yaml -f compose.test.yaml run --rm ...`，准确服务名随 R0 落地 |

配置项、无真实凭据示例、前后端及数据库连接、初始化、成功/指定失败/耗时、多任务、刷新恢复、身份隔离、部署回滚的预定方案均在 [交付计划](docs/delivery.md)。`.env.example` 目前只是配置契约草案，应用尚未读取。

## 当前完成程度与限制

准备工件已编写；产品功能、依赖解析、CI、容器构建、数据库初始化和浏览器闭环均未运行，不宣称通过。服务重启自动恢复执行、受理幂等、自动重试、真实 AI、复杂账户系统不在 P0 范围。运行中任务重启后以中断失败收束的规则见任务生命周期。

匿名会话方案通过 HttpOnly Cookie 由 Java 识别个人记录，另一浏览器/无痕窗口演示另一用户；不是生产账户服务。完整接口字段以 API 契约为准。

## AI 与来源

使用 Codex 辅助拆分需求、设计契约、生成文档；尚未开始产品编码。后续按“任务包 → 实现与行为测试 → 独立验收/审核 → 复现修正 → 集成验证”工作；具体过程、实际投入与取舍记录在 [投入记录](docs/audit/effort.md)，不把估算冒充实际工时。

开发方法参考 ccagent 和 classroom-annotator，未复制其业务代码、密钥或部署配置。题目截图仅供本次作业参考；演示素材将使用原创合成图片。详见 [来源说明](THIRD-PARTY-NOTICES.md)。

P0 完成后，README 必须补齐实际版本与命令、全部配置、初始化与素材说明、接口摘要、演示步骤、已完成/未完成/未验证项、实际投入、AI 修正实例、部署回滚、最终验收 commit 和私有源码授权读取方式。准备文档不能替代最终交付。
