# P2 多Agent角色与文件所有权

Leader+最多三个原生worker，默认继承模型/推理，实际无可验证值为null。P2尚未启动；准备只可读现状/编写规格及指定独立准备审核，不创建新开发worktree或运行产品。

| Role | 独占写入 | 职责 |
| --- | --- | --- |
| Leader | AGENTS/CONSTITUTION/NEXT-WAVES、specs/**、state/PLAN/矩阵、README、docs/submission/**、docs/reports/**、docs/audit/effort.md、依赖/CI/Compose、许可/清理处置、打包/manifest | 亲自逐条审原题、建缺口task、冻结、转交owner、集成和报告/最终签署 |
| Backend | backend/src/main/java/com/quvideo/studio/{Identity,AccountService,PasswordHasher,AuthThrottle,Api,Db}.java及必要新账户模块、账户作者测试；经Leader冻结并转交V4迁移 | 注册/登录/退出/资料/改密、事务/会话/权限和迁移；不重写Pipeline/Tasks语义，不擅改pom/编号 |
| Frontend | frontend/src/components/{providers,shell}.tsx、新account/**与账户路由/作用域样式、frontend/src/app/api/[...path]/route.ts的PATCH导出；经明确转交src/lib/{types,api,session-generation}.ts的账户兼容部分；自身账户测试 | 显式入口/完整表单/个人中心，持久Provider串行认证、取消/旧响应保护；原业务测试断言保留 |
| Acceptance | tests/p2/**（有必要才新增）、evidence/acceptance/**、handoffs/acceptance.md、仓库外录制源/元数据、docs/submission/media/下两份脱敏成片GIF | 独立核心/账户/迁移和解压ZIP空卷检查、独占性能窗口；其后录真实动图，不改作者测试 |
| Reviewer（Backend释放后） | reviews/provenance-review.md、implementation-review.md、final-review.md及自身handoff | 产品/历史/报告只读，来源/许可、真实GIF整段观看和逐条证据；不改被审对象 |

相对evidence/reviews/handoffs均在docs/waves/P2/。准备Reviewer只写reviews/preparation-review.md，不签产品最终门槛，也不授权启动。

启动后使用app-managed外部worktree和codex/分支，优先复用合适干净树。dispatch前Leader记录精确base/specVersion/依赖/路径。共享转交具体到文件和范围：V4由Leader冻结后仅Backend写；Next api catch-all的PATCH消费扩展明确仅Frontend写，原GET/POST与lib/proxy通用实现保留；types/api/session-generation/providers仅账户兼容改动转交Frontend，旧断言不得删弱。契约先冻结再消费，变更要消费者复核。

普通worker为Backend/Frontend/Acceptance；Backend释放后Reviewer替换，不加第四个worker。Leader持文档，无需闲置Docs/Asset。查到其他原题缺陷沿原根因建有界task，释放席位后交唯一writer，不换编号重置失败。

录制在性能窗口后。Acceptance测性能时其他角色不跑浏览器/构建。安装/构建/测试/应用与GIF工具只在容器，宿主只做Git/文件/元数据和打包。启动后按用户要求自主决定，不提问；未授权公开/改历史/交卷留用户操作说明。

媒体文件唯一owner明确转交Acceptance：docs/submission/media/home-ink.gif与creation-history.gif；Leader仍持有docs/submission其余说明文本/README引用。两成片可纳入最终ZIP并同字节复制为附件，原始录制只在仓库外。

执行owner冻结：2026-10-30T17:07:41.6287747+08:00 Leader将V4__accounts.sql编号与唯一写权转交Backend；将Next api/[...path]/route.ts PATCH扩展及types/api/session-generation/providers的账户兼容范围唯一转交Frontend。两GIF成片仍Acceptance专属，其余共享契约/依赖/CI/Compose/说明/报告由Leader持有。注册升级撤销全部旧guest sessions，API与密码参数按identity.md冻结。
