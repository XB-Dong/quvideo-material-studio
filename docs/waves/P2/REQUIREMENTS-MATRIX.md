# Leader逐条需求、差距与证据矩阵

基线：`7bbfd027758002cc519fc889cea3c8a2b5233717`。这是Leader拆解的87条追踪单元；不是最终通过证书。原题每个分句、提交/验收规则和用户确认的新账户/动图要求均须覆盖。R-14是官方推荐、本项目已采纳；U/MEDIA/OPEN是用户要求，不篡改原题。

每项未满足有明确task；所有已有项也须在P2-VERIFY/REPORT绑定最终证据。执行发现其他缺口由Leader沿原需求追加有owner/可观察标准的有界task，不能只写“尽可能”略过。完整机器可核对字段及每项observable见[checklist](requirement-checklist.json)。表内相关测试不表示每个防御输入都实注入过；最终报告必须点明此条实际观察，不能仅贴一条绿CI链接。

证据键：E-SRC=本轮直接阅读源码/配置；E-FE=7bb基线前端行为测试及名称；E-JAVA=7bb Java真实MySQL测试；E-API=7bb独立8API；E-BROWSER=7bb的22/6和25/16浏览器及交互/9轮/native；E-CI=41024631245精确run/jobs和只读日志/产物摘要，见[evidence](evidence/preparation/ci-baseline.json)；E-DOC=当前说明（需最终对齐）；E-SOURCE=第三方来源材料（尚不代表公开审计通过）；E-HISTORY=明确旧SHA的历史实测；E-NONE=当前无实现/无新证据。

源码简称：Java文件位于backend/src/main/java/com/quvideo/studio/，Java测试位于backend/src/test/java/com/quvideo/studio/；组件在frontend/src/components/，lib在frontend/src/lib/，SQL在backend/src/main/resources/db/migration/。原题与README九子项详细解释见[报告底稿](REPORT-DRAFT.md)。

| 条款 | 要求 | 实现入口 | 现有证据/状态 | 收尾或补齐task |
| --- | --- | --- | --- | --- |
| R-01.a | Next.js App Router、React、TypeScript | frontend/src/app; frontend/package-lock.json | E-SRC/E-FE；baseline_implemented_related_evidence | P2-VERIFY |
| R-01.b | Java、Spring Boot、MyBatis、MySQL | backend/pom.xml; Api.java; Db.java; compose.yaml | E-SRC/E-JAVA；baseline_implemented_related_evidence | P2-VERIFY |
| R-01.c | 模板/素材/任务/个人记录由Java提供、状态历史持久化 | Api/Tasks/Db/FilesService/Identity.java; lib/proxy.ts | E-API/E-JAVA；baseline_implemented_related_evidence | P2-VERIFY |
| R-01.d | 准确兼容版本和职责在README说明，方案自选 | README版本表; package-lock/pom; Dockerfiles | E-DOC/E-CI；documentation_needs_final_alignment | P2-DOCS |
| R-02.a | 分类、模板卡片、标题、封面 | catalog.tsx; Api/Db.java; V2/V3 SQL | E-API/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-02.b | 分类筛选与点击详情 | catalog.tsx; app/templates/[id]/page.tsx | E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-02.c | Java数据而非前端写死页面 | Api.templates/categories; Db.java | E-API/E-SRC；baseline_implemented_related_evidence | P2-VERIFY |
| R-02.d | 模板自行构造、不同素材数量、无需CRUD | V2/V3 SQL; demo-* templates | E-API；baseline_implemented_related_evidence | P2-VERIFY |
| R-02.e | 示例本地可访问或合法资源，无付费/内部依赖 | backend/resources/demo; THIRD-PARTY-NOTICES.md | E-API/E-SOURCE；baseline_implemented_related_evidence | P2-AUDIT |
| R-03.a | 详情标题、描述、封面、要求及对应上传位 | studio.tsx; API template | E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-03.b | 选择、预览、替换、移除 | studio.tsx UploadSlot; upload.test.tsx | E-FE/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-03.c | 上传中/失败反馈 | UploadSlot; upload.test.tsx | E-FE/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-03.d | 前端校验数量/类型/大小 | studio.tsx; submission/upload tests | E-FE；baseline_implemented_related_evidence | P2-VERIFY |
| R-03.e | 服务端校验素材与制作参数 | FilesService/Tasks/Simulation.java | E-JAVA/E-API；baseline_implemented_related_evidence | P2-VERIFY |
| R-03.f | 未准备好/提交中防重复 | studio.tsx Maker; submission.test.tsx | E-FE/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-03.g | 不存在/加载/空数据/请求失败反馈 | state-panel; app/loading/error/not-found; catalog/studio/history | E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-03.h | 服务端可用文件，非只浏览器blob | FilesService.java; material-files卷 | E-API/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-04.a | 检查建任务后返回ID，不等待制作 | Tasks.create/afterCommit; Api.create | E-JAVA/E-API；baseline_implemented_related_evidence | P2-VERIFY |
| R-04.b | Java后台执行，关闭页面不中断 | Processing/Pipeline.java | E-API/E-HISTORY；baseline_implemented_related_evidence | P2-VERIFY |
| R-04.c | 多任务可排队或并行 | Processing有界单线程FIFO | E-JAVA/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-05.a | 素材检查→模拟生成→结果整理顺序 | Simulation.STAGES; Pipeline.run | E-JAVA；baseline_implemented_related_evidence | P2-VERIFY |
| R-05.b | 每步独立可观察执行边界，非前端定时文案 | Processing/Db begin/end; task_steps | E-JAVA/E-API；baseline_implemented_related_evidence | P2-VERIFY |
| R-05.c | 状态/阶段/结果或失败原因持久化，可查任务/历史 | Tasks.view/history; Db; V1 SQL | E-JAVA/E-API；baseline_implemented_related_evidence | P2-VERIFY |
| R-05.d | 整理成功后可预览结果地址 | Processing.success; Api result; history preview | E-API/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-05.e | 查询只读，不驱动任务下一步 | Tasks.get/history; Pipeline | E-JAVA/E-API；baseline_implemented_related_evidence | P2-VERIFY |
| R-05.f | 等待/处理/成功/失败，终态不回退 | Db状态迁移; types.mergeTask | E-JAVA/E-FE/E-API；baseline_implemented_related_evidence | P2-VERIFY |
| R-06.a | 可重复指定阶段失败 | Simulation.failAt; Pipeline | E-JAVA/E-API；baseline_implemented_related_evidence | P2-VERIFY |
| R-06.b | 失败停止后续并保存阶段/原因 | Pipeline return; Processing.fail | E-JAVA/E-API；baseline_implemented_related_evidence | P2-VERIFY |
| R-06.c | 耗时可调，能看处理中/多任务 | simulation.delayMs; env配置 | E-API/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-06.d | README写清模拟操作，不要求随机/重试UI | README指定失败与耗时 | E-DOC；documentation_needs_final_alignment | P2-DOCS |
| R-07.a | 上传/提交/等待处理/成功/失败分别表达 | studio/history; state-panel | E-FE/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-07.b | 受理成功展示任务并解除提交态 | Maker; useTasks.add; submission tests | E-FE/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-07.c | 展示真实当前阶段/失败原因/成功图 | history.tsx; Task fields | E-API/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-07.d | 查询暂不可用≠任务失败，保留信息并能恢复 | use-tasks queryError/refresh; history | E-FE/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-08.a | 连续多任务，状态/阶段/错误/结果不串 | userId/task.id query keys; mergeTask | E-FE/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-08.b | 自动跟踪未结束 | use-tasks active分页/refetchInterval | E-FE/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-08.c | 单任务结束停跟踪，无活动任务不轮询 | terminal/refetchInterval false | E-FE/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-08.d | 离页/切用户清理请求/订阅 | AbortSignal; providers generation; use-tasks | E-FE/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-08.e | 旧响应不覆盖当前用户/其他任务 | api/session-generation/types; lifecycle tests | E-FE；baseline_implemented_related_evidence | P2-VERIFY |
| R-09.a | 个人历史、创建时间、状态、成功或失败原因 | Tasks.history; history.tsx; task-time | E-API/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-09.b | 刷新从Java恢复并继续跟踪 | use-tasks active/history; Java/MySQL | E-FE/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-09.c | 成功结果图片预览 | ResultPreview; authenticated original result | E-BROWSER/E-JAVA；baseline_implemented_related_evidence | P2-VERIFY |
| R-10.a | 自行设计身份方案 | Identity.java; users/sessions; providers | E-JAVA/E-API；guest_implemented_account_extension_missing | P2-BE-USER |
| R-10.b | 个人任务记录按身份管理 | Tasks/Db owner; media owner guards | E-JAVA/E-API/E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-10.c | README说明身份和演示 | README身份限制/无痕演示 | E-DOC；documentation_needs_final_alignment | P2-DOCS |
| R-11.a | 列表/制作/历史布局层级间距反馈 | catalog/studio/history; globals/journey CSS | E-BROWSER/E-HISTORY；baseline_implemented_related_evidence | P2-VERIFY |
| R-11.b | 桌面主界面、小屏可操作 | responsive CSS; 375px场景 | E-BROWSER；baseline_implemented_related_evidence | P2-VERIFY |
| R-11.c | 合适语义、键盘焦点 | Link/input/button/native dialog | E-BROWSER/E-FE；baseline_implemented_related_evidence | P2-VERIFY |
| R-11.d | 上传和图标按钮有标签 | UploadSlot; Modal close; aria labels | E-BROWSER/E-SRC；baseline_implemented_related_evidence | P2-VERIFY |
| R-11.e | 参考主要布局，品牌素材可替换，不扩题外功能 | UI refs; 原创布局/合法素材; Shell | E-SOURCE/E-HISTORY；baseline_implemented_related_evidence | P2-REPORT |
| R-12.a | push/PR触发CI | ci.yml on push/pull_request | E-CI/E-SRC；baseline_implemented_related_evidence | P2-VERIFY |
| R-12.b | 前端lint/TypeScript/构建 | frontend-check/Dockerfile/CI | E-FE/E-CI；baseline_implemented_related_evidence | P2-VERIFY |
| R-12.c | Java测试和构建 | backend-check; mvn verify/package | E-JAVA/E-CI；baseline_implemented_related_evidence | P2-VERIFY |
| R-12.d | 关键测试：后端顺序/中断，前端多任务/查询异常 | Pipeline/DatabaseIntegration/use-tasks tests | E-JAVA/E-FE；baseline_implemented_related_evidence | P2-VERIFY |
| R-12.e | 压缩包保留CI配置 | ci.yml; archive entries | E-SRC；pending_final_package | P2-SEAL |
| R-13.0 | 完整前后端、版本锁、结构/种子、CI、README；注明验收commit | frontend/backend/locks/migration/CI/README | E-SRC/E-DOC；pending_final_package | P2-SEAL |
| R-13.1 | 技术版本/结构/构建测试启动/连接 | README; lock/pom/Compose | E-DOC/E-CI；documentation_needs_final_alignment | P2-DOCS |
| R-13.2 | 配置示例/初始化/模拟数据素材 | env example; V1-V3; demo/ink | E-DOC/E-API；account_migration_and_final_docs_pending | P2-DOCS |
| R-13.3 | 主要接口字段/状态/阶段/执行方式 | specs/api.yaml; README; Tasks/Pipeline | E-DOC/E-SRC；documentation_needs_final_alignment | P2-DOCS |
| R-13.4 | 成功/指定失败/耗时/多任务/刷新演示 | README模拟fetch; demo | E-DOC/E-BROWSER；documentation_needs_final_alignment | P2-DOCS |
| R-13.5 | 身份与个人记录设计/演示 | Identity/providers; README | E-DOC/E-API；documentation_needs_final_alignment | P2-DOCS |
| R-13.6 | 完成/未完成/已知限制/实际投入/重启边界 | effort; Processing启动中断; README | E-DOC/E-JAVA；documentation_needs_final_alignment | P2-REPORT |
| R-13.7 | 部署回滚基本步骤 | docs/delivery; README; historical恢复 | E-DOC/E-HISTORY；account_migration_and_final_docs_pending | P2-DOCS |
| R-13.8 | 使用AI与拆分上下文/生成修改/验证修正实例 | README; effort; handoffs/reviews | E-DOC/E-HISTORY；documentation_needs_final_alignment | P2-REPORT |
| R-13.9 | 脚手架/开源代码/素材来源与复用 | THIRD-PARTY-NOTICES; manifests; RB LICENSE | E-SOURCE；provenance_review_pending | P2-AUDIT |
| R-14.a | 推荐docker compose up --build三服务 | compose.yaml; Dockerfiles | E-CI/E-API；baseline_implemented_related_evidence | P2-VERIFY |
| R-14.b | Dockerfile、非敏感配置示例、说明 | Dockerfiles; .env.example; README | E-DOC/E-SRC；pending_final_package | P2-SEAL |
| R-14.c | 初始化数据、素材可用 | Flyway V1-V3/demo; planned V4 | E-API/E-CI；baseline_implemented_related_evidence | P2-VERIFY |
| R-14.d | 无需公网/真实部署截图，可读源码与容器运行 | 交付说明 | E-DOC；baseline_implemented_related_evidence | P2-REPORT |
| SUB.a | 原沟通渠道交源码链接或压缩包 | DELIVERABLES; original题面 | E-DOC；user_submission_boundary | P2-SEAL |
| SUB.b | 日期按双方约定 | PLAN deadline=null | E-DOC；user_submission_boundary | P2-REPORT |
| SUB.c | 最多6文件、单个不超过100MB | DELIVERABLES; manifest schema | E-DOC；pending_final_package | P2-SEAL |
| SUB.d | 交卷后不可改 | 提交说明/停止规则 | E-DOC；user_submission_boundary | P2-SEAL |
| ACC.a | 先审源码/执行入口/依赖脚本/材料 | README; entrypoint/locks/Compose | E-SRC/E-DOC；baseline_implemented_related_evidence | P2-REVIEW |
| ACC.b | 安装/构建/测试/执行在容器 | Dockerfiles; CI; test entries | E-CI；baseline_implemented_related_evidence | P2-VERIFY |
| ACC.c | 源码实现和实际运行分别记录 | 报告格式/矩阵/证据schema | E-DOC；documentation_needs_final_alignment | P2-REPORT |
| ACC.d | 未验证如实记录，不隐藏问题；复杂度不等于质量 | REPORT-DRAFT; failures; limits | E-HISTORY/E-DOC；documentation_needs_final_alignment | P2-REPORT |
| U-01 | 注册账户并保留当前访客作品 | specs/p2/identity.md（尚未编码） | E-NONE；not_implemented | P2-BE-USER |
| U-02 | 登录已有账户读取本人历史 | specs/p2/identity.md | E-NONE；not_implemented | P2-BE-USER |
| U-03 | 退出和旧session撤销 | specs/p2/identity.md | E-NONE；not_implemented | P2-BE-USER |
| U-04 | 账户设置：昵称/邮箱展示、改昵称/改密码 | specs/p2/identity.md | E-NONE；not_implemented | P2-BE-USER |
| U-05 | 清晰访客/登录/注册/个人中心入口 | specs/p2/identity.md; Shell现仅当前身份 | E-NONE；not_implemented | P2-FE-USER |
| U-06 | 切账户旧请求/缓存/私有预览不串 | 原generation保护+计划账户扩展 | E-FE（旧匿名范围）；account_extension_not_implemented | P2-FE-USER |
| U-07 | 保留访客直接体验 | 原POST session; planned账户兼容 | E-JAVA/E-BROWSER（旧范围）；baseline_implemented_related_evidence | P2-VERIFY |
| MEDIA-01 | 附件用动图，首页山水动态为重点 | MEDIA.md | E-NONE；not_recorded | P2-MEDIA |
| MEDIA-02 | 上传/制作/历史真实流程动图 | MEDIA.md | E-NONE；not_recorded | P2-MEDIA |
| OPEN-01 | 为将来公开私库准备来源/许可/隐私/历史处理 | NOTICES; RB LICENSE; refs/history | E-SOURCE；public_readiness_not_audited | P2-AUDIT |
