# P2 文件与依赖地图

日期：2026-10-30（UTC+08:00）。产品参考提交：`7bbfd027758002cc519fc889cea3c8a2b5233717`。本轮仅准备，未启动P2执行。

用户已确认P2为最后一轮开发：账户注册/登录/退出/设置与访客保留纳入，原题按87条矩阵逐项查缺并给证据。

## Files to Modify

| File | Purpose | Changes Needed |
| --- | --- | --- |
| docs/waves/P2/{PLAN,ROLES,ACCEPTANCE,state.json,PREPARATION,BASELINE,DELIVERABLES}.md（state为json） | 本轮准备 | 明确提交目标、现状/缺口、任务、所有权和启动边界 |
| specs/p2/delivery.md | 冻结交付契约 | 逐条报告格式、验收SHA、双门槛、源码包/清单及隐私规则 |
| docs/waves/P2/tasks/ | 执行任务包 | 精确基准、依赖、允许路径和可观察完成条件；准备包不授权派发 |
| AGENTS.md、NEXT-WAVES.md、CONSTITUTION.md | 当前授权入口 | 记录仅P2准备；不沿用P1.2自动启动授权 |
| backend账户模块、Identity/Api/Db、V4__accounts.sql（启动后） | 后端账户开发 | 注册/登录/退出/资料/密码/会话事务，V4扩展现有库，原任务/素材owner不改 |
| frontend账户页面、providers/shell及lib账户兼容（启动后） | 用户入口/生命周期 | 明确访客、表单/个人中心/账户动作与旧请求隔离，保护原上传/提交/轮询 |
| frontend/src/app/api/[...path]/route.ts（启动后） | Next同源消费 | Frontend唯一owner补PATCH导出，沿用lib/proxy；Acceptance经前端入口验资料更新及错误/鉴权透传，原GET/POST保持 |
| specs/p2/identity.md | 账户契约 | 已按确认方案冻结API、注册保留作品、登录不合并、退出撤销等语义 |
| README.md（P2启动后） | 招聘方运行入口 | 以最终版本/命令/接口/演示/限制/投入/AI流程为主，历史阶段下沉至链接 |
| docs/submission/（P2启动后） | 评估者提交说明与版本清单 | 源码获取、验收commit、Compose启动、演示、限制；不含内部协调信息 |
| docs/reports/（P2启动后） | 给用户看的逐条符合性报告 | R-01～R-14及R-13九子项逐条对应源码、运行证据、限制、结论 |
| THIRD-PARTY-NOTICES.md、LICENSE（P2启动后按审计结论） | 来源和原创许可范围 | 原创与第三方分开；不能覆盖第三方原许可或提前声称全仓纯MIT |
| docs/waves/P2/{handoffs,reviews,evidence}/（执行后） | 实际证据与处置 | 只存脱敏摘要，标实际SHA/时间/环境/exit；失败不删除 |
| 仓库外delivery目录（执行后） | 最终附件 | ZIP、提交说明、用户报告、manifest/SHA256；不含缓存、运行卷或私密原始证据 |

## Dependencies

| File | Relationship |
| --- | --- |
| docs/requirements/REQUIREMENTS.md及用户2026-10-30重贴题面 | 原始R编号和交卷限制；不得把6文件/100MB当成产品上传限制 |
| backend/src/main/java/com/quvideo/studio/{Api,Tasks,Pipeline,Processing,Db,FilesService,Identity,Simulation}.java | 逐条源码依据 |
| frontend/src/{app,components,lib}/ | 页面、上传、提交、历史、身份与轮询的实现依据 |
| backend/src/main/resources/db/migration/V1～V3、demo/；frontend/public/ink/ | 初始化、离线演示图片与启动闭环 |
| specs/{api.yaml,task-lifecycle,frontend-state,data-model}.md（API为yaml） | 业务契约与说明一致性 |
| compose.yaml、compose.test.yaml、前后端Dockerfile、.env.example、依赖/锁文件 | 启动、测试、打包可复现；准备阶段只读 |
| docs/waves/P0～P1.2/及docs/audit/effort.md | 历史证据，不直接冒称最终候选已通过 |
| frontend/src/components/react-bits/{LICENSE,ADAPTATIONS}.md、来源manifest | 未来公开源码的许可/复用核对 |
| 全Git分支、标签、历史、附件/Actions记录 | 原仓库转公开前的披露范围，不能只审HEAD |

## Test Files

| Test | Coverage |
| --- | --- |
| backend/src/test/java/com/quvideo/studio/PipelineTest.java、DatabaseIntegrationTest.java | 步骤顺序、三阶段失败中断、事务/派发、用户隔离、重启边界 |
| frontend/src/lib/{use-tasks,session-lifecycle}.test.tsx | 多任务不串扰、查询异常区分、停止/取消、迟到身份响应 |
| frontend/src/components/{upload,submission}.test.tsx | 文件和提交竞态、未就绪禁提交、受理解锁、未知POST不重发 |
| tests/test_api.py | 独立Java/Next同源接口闭环 |
| tests/p1.1/、tests/p1.2/、.github/workflows/ci.yml | 现有浏览器/动效/资源/后台及所有CI门槛；不为交付变绿而降低 |
| P2独立干净源码包运行记录（启动后） | 脱离现有目录/缓存/数据库是否仍能启动，验证最终交付物 |

## Reference Patterns

| File | Pattern |
| --- | --- |
| docs/waves/P0/ACCEPTANCE.md | 原题逐条追踪，历史版本不冒称当前 |
| docs/waves/P1.2/evidence/ci/41021360156-pass.json | 命名SHA、真实jobs、逐轮数据和artifact哈希 |
| docs/agents/PROTOCOL.md | 单owner、依赖冻结、独立验收、有界修复、Leader签署 |
| docs/waves/P1.2/handoffs/pointer-footer-fix.md | 有限用户修正的事实与验收边界 |

## Risk Assessment

- API变化：计划兼容扩展账户API/Session字段，保留旧session端点；API错误语义与generation必须双方按契约验证。
- Database migration：计划V4账户凭据增量表，V1～V3不改；旧数据副本迁移/配套回滚验收，编号归Leader。
- Configuration change：只计划说明核对；干净运行使用独立项目/端口/空卷，不动当前3000预览和产品卷。
- 公开风险：题面/参考截图/邮件图、个人绝对路径、第三方受限许可、历史对象必须单独审计；不自动公开、删历史或force-push。

Leader已核对入口、直接依赖、原行为测试与历史交付模式；本地图可用于准备文件编写。独立准备审阅只审文档可执行性，不是产品最终验收。
