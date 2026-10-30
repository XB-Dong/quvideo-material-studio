# P2 多Agent角色与文件所有权

Leader+最多三个原生worker，默认继承模型/推理，实际无可验证值为null。P2尚未启动；准备只可读现状/编写规格及指定独立准备审核，不创建新开发worktree或运行产品。

| Role | 独占写入 | 职责 |
| --- | --- | --- |
| Leader | AGENTS/CONSTITUTION/NEXT-WAVES、specs/**、state/PLAN/矩阵、README、docs/submission/**、docs/reports/**、docs/audit/effort.md、依赖/CI/Compose、许可/清理处置、打包/manifest | 亲自逐条审原题、建缺口task、冻结、转交owner、集成和报告/最终签署 |
| Backend | backend/src/main/java/com/quvideo/studio/{Identity,AccountService,PasswordHasher,AuthThrottle,Api,Db}.java及必要新账户模块、账户作者测试；经Leader冻结并转交V4迁移 | 注册/登录/退出/资料/改密、事务/会话/权限和迁移；不重写Pipeline/Tasks语义，不擅改pom/编号 |
| Frontend | frontend/src/components/{providers,shell}.tsx、新account/**与账户路由/作用域样式；经明确转交src/lib/{types,api,session-generation}.ts的账户兼容部分；自身账户测试 | 显式入口/完整表单/个人中心，持久Provider串行认证、取消/旧响应保护；原业务测试断言保留 |
| Acceptance | tests/p2/**（有必要才新增）、evidence/acceptance/**、handoffs/acceptance.md、仓库外GIF/元数据 | 独立核心/账户/迁移和解压ZIP空卷检查、独占性能窗口；其后录真实动图，不改作者测试 |
| Reviewer（Backend释放后） | reviews/provenance-review.md、implementation-review.md、final-review.md及自身handoff | 产品/历史/报告只读，来源/许可、真实GIF整段观看和逐条证据；不改被审对象 |

相对evidence/reviews/handoffs均在docs/waves/P2/。准备Reviewer只写reviews/preparation-review.md，不签产品最终门槛，也不授权启动。

启动后使用app-managed外部worktree和codex/分支，优先复用合适干净树。dispatch前Leader记录精确base/specVersion/依赖/路径。共享转交具体到文件和范围：V4由Leader冻结后仅Backend写；types/api/session-generation/providers仅账户兼容改动转交Frontend，旧断言不得删弱。契约先冻结再消费，变更要消费者复核。

普通worker为Backend/Frontend/Acceptance；Backend释放后Reviewer替换，不加第四个worker。Leader持文档，无需闲置Docs/Asset。查到其他原题缺陷沿原根因建有界task，释放席位后交唯一writer，不换编号重置失败。

录制在性能窗口后。Acceptance测性能时其他角色不跑浏览器/构建。安装/构建/测试/应用与GIF工具只在容器，宿主只做Git/文件/元数据和打包。启动后按用户要求自主决定，不提问；未授权公开/改历史/交卷留用户操作说明。
