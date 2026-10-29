# P0 开发与验收报告

日期：2026-10-29；状态：completed；作者董信步。用户于17:15明确启动 P0，本阶段完成后停止，未进入 P1、公开部署或代为交卷。

## 交付与版本

- 私有仓库：[XB-Dong/quvideo-material-studio](https://github.com/XB-Dong/quvideo-material-studio)。
- 验收 commit：[4dd397f2f5b2cb74ca21aba08482d0cae5b0a0de](https://github.com/XB-Dong/quvideo-material-studio/commit/4dd397f2f5b2cb74ca21aba08482d0cae5b0a0de)。报告封存提交在交付消息注明，避免自引用；封存不改应用代码。
- [CI运行40854073869](https://github.com/XB-Dong/quvideo-material-studio/actions/runs/40854073869)：frontend、backend、integration 全部 success。干净 Linux runner 内完成容器安装/测试/生产构建/三服务启动与独立 API 验收。
- 启动：根目录 docker compose up --build；[本地入口](http://localhost:3000)。本机三服务已运行；停止用 docker compose down，保留命名卷。
- 最终源码压缩包从封存提交用 git archive 导出到仓库外，路径在交付消息给出。保留 CI、SQL、图片和完整前后端；不含 .git、.env、node_modules、target、.next 或运行卷。

## 完成内容

覆盖全部 R-01 至 R-13，并完成主动选择的 R-14 Compose。Java/MyBatis/MySQL 管理模板、真实图片上传、匿名身份、任务受理、三步骤后台处理、个人历史和结果；Next App Router 管理上传/提交/任务/查询独立状态，多任务轮询、刷新恢复与预览。模拟成功/指定阶段失败/耗时可由请求控制，不调用真实 AI。

P0 采用深色基本视觉与原创程序图片，参考题图列表/双栏/历史布局。用户新增的蓝紫视觉、优秀热门素材、动态氛围和交互动画，已沉淀为 NEXT-WAVES 的 P1 需求和验收方向；不是本阶段遗留必需项。

## 多 Agent 执行与发现处置

Leader 负责规格、共享配置、调度、集成、实际运行与报告；Frontend、Backend、Acceptance 分别在外部 managed worktree 和 codex/ 分支工作，最多三子并行。Acceptance 在验收设计后承担独立只读审核，再执行真实 API。所有实现者自测与独立审核/验收分开记录。

| 发现 | 处置 | 验证 |
| --- | --- | --- |
| afterCommit 队列拒绝使用原事务资源可能不落失败 | Processing 独立 REQUIRES_NEW | 真实MySQL饱和队列回归通过 |
| FINALIZE步骤与任务成功分事务可能矛盾 | 最后一步/结果地址/任务成功原子提交 | 注入最终DB失败回滚回归，独立审核关闭 |
| 迟到401可能清除新身份 | 请求generation、AbortSignal和作用域事件 | 新增真实api/provider回归，独立审核关闭 |
| 身份变化未清提交锁/旧finally干扰新提交 | 取消旧POST、重置锁、提交generation | 延迟POST/重连/旧finally回归，独立审核关闭 |

代码、提交、检查和限制详见 handoffs/ 与 reviews/。三个工作树完成集成后已归档，后端忽略的 Surefire 原始报告在归档前另行保留于本机外部证据目录。实际模型路由无法独立核实，记录为 null。

## 实际验证

| 验证 | 结果与边界 |
| --- | --- |
| 前端lint/typecheck/生产build | 本地容器和GitHub CI通过；npm依赖安装报告0漏洞 |
| 前端行为测试 | 16/16，包括多任务、异常恢复、终态/卸载停止、身份与上传/提交竞态 |
| Java测试和构建 | 12/12，0失败/错误/跳过；6个真实MySQL集成 + 6个pipeline |
| 独立API | 本地8/8，11.840秒；最终验收提交另由GitHub integration通过 |
| OpenAPI完整schema校验 | 0.7.2容器工具校验OK；最初YAML描述逗号问题已修正 |
| 浏览器 | 真实选择文件、提交、连续任务、预览Esc焦点返回、刷新、桌面双栏与375px无横向溢出 |
| 请求故障/硬重启 | 停机查询保留状态；恢复后运行/排队任务INTERRUPTED，既有终态不变 |
| 合成备份恢复 | MySQL隔离schema三表计数相同；文件tar恢复逐文件cmp通过 |

证据：[集成检查](evidence/integrated-checks.md)、[独立API](evidence/acceptance/live-api-620eb4a.md)、[浏览器与恢复](evidence/ui-and-recovery.md)、[需求矩阵](ACCEPTANCE.md)。浏览器测试没有伪装为自动E2E；磁盘耗尽、20MP防御分支未逐项真实注入，不声称全分支覆盖。公网/生产环境没有部署或运行验证，本题不要求。

## 投入与 AI 工作流

P0 会话执行从2026-10-29 17:15:26+08:00记录，最终封存时间见 state.executionCompletedAt；约一小时墙钟，包括并行实现、修复、容器/浏览器/远端CI和交付整理。并行时间不简单累加成人类工时；准备阶段和作者人工投入没有精确计时，如实保留未知，作者交卷前可补充本人投入。

使用 Codex，采用需求/契约先行、自包含任务包、隔离工作树、实现者测试、独立审核/黑盒、Leader处置与集成。上表最终事务与身份竞态就是实际修正实例；保留初次编译/工具网络失败与修正事实，没有捏造正式TDD历史。未提供私人聊天、账号或完整提示词。[实际投入](../../audit/effort.md)和 README 包含进一步说明。

## 限制与交接

匿名会话过期/清Cookie无法找回；单实例本地有界队列；重启自动收束失败而非续跑；没有受理幂等/自动重试；结果为固定原创图，没有真实处理输入图；孤立上传暂无配额/清理；Flyway有MySQL版本范围提示但实际检查通过。使用本地卷，需要同时备份DB和文件。

私有仓库对评估者是否可读需作者确认账号权限，或直接提供源码包；本次没有邀请未知账号或公开仓库。交卷由作者通过原沟通渠道完成，交卷后不能修改。P0 到此停止，下一阶段前先审阅 NEXT-WAVES 并明确启动。
