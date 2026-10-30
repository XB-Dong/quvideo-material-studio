# P2 独立准备审核

rootTaskId：`P2-PREP-REVIEW`；specVersion：`P2-1.0.0`。Reviewer为原生子Agent `p11_design_review`，actualProvider/model/reasoning均为null。审核日期2026-10-30（UTC+08:00），预算上限20分钟，并非实际工时声明。

审核源为分支`codex/p2-preparation`上的精确候选`8461e445eaf935e9ab9ee4894ae684c9c64ea034`，产品参考`7bbfd027758002cc519fc889cea3c8a2b5233717`；两者已通过只读Git解析确认可达。本报告只审核准备完整性与可执行性，不是产品、安全、账户或最终交付验收，也不授权启动P2。

**最终准备结论：修订候选`1790a91df75852ddcb3b823f37d8a1bb7c7dd1fc`准备审核通过，三个发现均closed，无开放blocking/major/minor。** 下文保留846初审发现，末段记录逐项复核依据。P2仍未启动，产品与交付门槛not_run。

## 审核范围和实际操作

已读AGENTS、CONSTITUTION、NEXT-WAVES、README入口、Agent协议；P2的PLAN、ROLES、CONTEXT-MAP、ACCEPTANCE、state、REQUIREMENTS-MATRIX、requirement-checklist、GAP-LEDGER、DELIVERABLES、MEDIA、REPORT-DRAFT、EFFORT、PREPARATION、BASELINE；`specs/p2/{delivery,identity}.md`与全部10个task包。对照用户原题R-01～R-14、九类README说明、提交和容器验收规则，及用户确认的最后开发波次、账户/访客、真实GIF、逐条报告和投入估算要求。

为核消费者边界，只读检查现有Java Identity/Api/RequestFilter、前端Providers/API/session-generation/通用proxy/Next catch-all route，及已有迁移文件。读取准备包中的CI41024631245摘要：精确7bb源、三job成功、日志/浏览器artifact字段均明确标为既有基线；本Reviewer未重新查询远端、重跑该CI或将其当新账户通过。已直接读到的摘要不是本轮产品运行。

实际仅执行Git、Get-Content、rg及PowerShell内联JSON/路径/依赖数据核对：checklist为87条且ID唯一，全部指向现有task；state为10个task，Markdown包的精确base/specVersion存在且对应；包含runtimeDependencies的DAG无环。候选相对产品参考的frontend/backend/Compose/CI差异为空。没有运行项目脚本、安装、容器、浏览器、录制、打包、改产品、建worktree、commit或push；唯一写入本审核文件。

## 准备内容判断

- 原题覆盖：87条是追踪单元数，不冒称原题恰有87条独立需求。矩阵覆盖技术职责、Java数据、素材双端校验、异步三阶段/失败/只读查询、多任务/请求异常/生命周期/刷新/身份、基本可用性、CI/核心测试、README九项、Compose及提交/验收边界。未发现遗漏必需原题要求；R-14明确为官方推荐且项目已采纳，6文件/100MB没有误用作产品上传限制。
- 新旧范围区分：旧匿名身份已有实现与隔离；注册/登录/退出/改资料/改密码明确尚未实现，未以旧匿名CI替代。注册同userId保留作品、登录不合并访客、退出换新访客、改密撤销旧会话及后台任务继续均有可观察标准。邮箱未验证、无找回邮件等范围如实说明，没有假按钮要求。
- 身份保护：事务、旧token撤销、V4增量迁移、匹配备份回滚、密码参数/盐及节流已有明确实现/测试约束；Provider串行认证、generation、未知POST恢复与AUTH_INVALID不误派过期事件已有要求。实现时仍须覆盖原session初始化/重试与新认证动作的共同生命周期，不能只给新表单加锁。本结论不等于这些尚未编码的行为已成立。
- 交付与证据：默认ZIP解决私库可读性；真实GIF要求连续输入/真实服务端阶段、山水可辨、整段播放、元数据及性能错峰；不以录屏代断言。报告要求每条精确源码、运行版本/时间/环境/结果/限制；外置manifest避免自身哈希循环。公开/历史处理与本次合法分发分开，影响当前分发的许可问题必须在提交前处置，不能只推到未来。未授权公开、改历史、联系招聘方或交卷。
- 角色与投入：Leader+BE/FE/Acceptance，BE释放后Reviewer替换，没有第四个worker；共享文件需明确转交，最终只有Leader签署。估算、已记录墙钟和未知分列，不累加并行worker，不把2～4小时假设或5～8小时预算当实测。各task预算是有界计划，不要求耗尽；实际新增缺陷必须补task并更新窗口，不为守估计弱化门槛。

## 发现与处置

### P2-PREP-01 · major · PATCH契约没有覆盖Next同源消费者及owner

- 位置：`specs/p2/identity.md:25`；`docs/waves/P2/tasks/P2-FE-USER.md:30`及ROLES/CONTEXT-MAP/state的FE允许路径；现有`frontend/src/app/api/[...path]/route.ts`仅导出GET/POST。
- 触发：Frontend按冻结契约提交`PATCH /api/account/profile`，使用现有Next同源入口。
- 预期：同源PATCH携cookie/body到Java，返回账户昵称/明确错误code；访客权限与原GET/POST行为保持，文件有唯一writer和实际独立验收。
- 实际：通用`lib/proxy.ts`具备method/body透传能力，但catch-all未导出PATCH，Next会在到达Java前拒绝该方法；准备包也未授权Frontend修改此route。单独完成Java账户API与前端表单不足以完成改资料。
- 建议：准备中明确Frontend唯一拥有该route的有界PATCH导出，规格/地图/角色/包/state同步，Acceptance增加真实同源PATCH成功、访客鉴权/错误code及原方法回归；本轮不改产品。若选择改API方法，需全部消费者与验收同步，不能留下不一致。
- 处置：Leader已明确接受，计划只改准备契约和路径，待集中修订后复核。**当前候选open，阻塞PREP通过**；这不是已运行复现的新产品失败。

### P2-PREP-02 · minor · 最终ZIP必需项仍只列V1～V3

- 位置：`docs/waves/P2/DELIVERABLES.md:18`。
- 触发：按该ZIP核验清单制作包含账户功能的最终包。
- 预期：明确包含冻结并实际使用的V4账户迁移，空库初始化与V3副本升级均使用最终包对应的迁移集合。
- 实际：清单逐名列Flyway V1/V2/V3，未列计划中的V4；其他规格虽有V4，最终必需entries口径仍可能漏检。没有声称目前实际包已漏文件，因为P2包尚未生成。
- 建议：改为V1～V4（含实际账户迁移）及相应种子/必要资源，Final Reviewer核对精确entries；未来若迁移编号变更按实际冻结列表同步。
- 处置：待Leader修订后复核，当前open。

### P2-PREP-03 · minor · VERIFY之前的候选ZIP生产步骤需显式分配

- 位置：`docs/waves/P2/tasks/P2-VERIFY.md:26`、`P2-DOCS.md`、`P2-SEAL.md`及PLAN任务表。
- 触发：到达VERIFY要求“测试Leader的候选ZIP”，后续REVIEW也要求读候选包，但明确的外部打包写入产物目前只列在SEAL，而SEAL依赖二者完成。
- 预期：VERIFY前有Leader负责的候选包生产点、精确source SHA/hash/排除规则；最终包封存时明确与已经独立运行的候选包如何对应。
- 实际：文案已暗示候选ZIP存在，未明确是DOCS末尾还是VERIFY协调前由Leader产出，任务产物/允许路径和前置条件缺少这一小段。DAG本身无环，不能将文案缺口误报为已存在循环。
- 建议：在DOCS末尾或独立明确的Leader子步骤产出候选ZIP并交VERIFY/REVIEW；SEAL若重新生成，核对可执行树/必要文件/打包转换完全等价及最终entries/hash，任何可执行或必需配置变化重新验收。报告文档后续封存与运行源精确区分。
- 处置：待Leader明确后复核，当前open。

## 初审结论（846候选）

**当前候选尚未准备通过：0个blocking、1个open major、2个open minor。** 主体准备包已覆盖原题与用户新增目标，需先关闭PATCH消费者契约缺口，并收敛两处交付清单/时序表述。修订只由Leader完成，本Reviewer随后只读复核并更新此文件。

PREP即使通过也只意味着可执行准备就绪，仍须停在ready_not_started等待用户明确启动P2。USER/CORE/CI/CLEAN/MEDIA/PACK/PROV/OPEN/TRUTH/SEAL等产品与最终交付门槛均未在本轮执行或代签；没有新账户、美学、性能、真实GIF或最终源码包通过结论。

## 集中修订的有界复核

Leader已逐项接受三个发现，只修改准备文件。已实际只读核对846至精确`1790a91df75852ddcb3b823f37d8a1bb7c7dd1fc`的diff（含中间cb667ce修订，1790仅规范packet末空行），并读取FINDINGS处置；没有运行项目脚本、容器或浏览器，也没有修改源码或其他审核报告。

| 发现 | 实际复核 | 最终状态 |
| --- | --- | --- |
| P2-PREP-01 major | identity明确Frontend独占catch-all route的PATCH导出、沿用原通用proxy并保留GET/POST；ROLES、地图、FE packet/state同步允许路径。identity与VERIFY要求从前端同源入口实测账户200、非法400、过期401、访客/Origin403、code/cookie透传，非Java直连代替。准备消费者及owner已闭环；route实际尚未开发，不宣称其现已支持PATCH。 | closed，准备缺口修复 |
| P2-PREP-02 minor | DELIVERABLES最终ZIP必需项明确V1/V2/V3/V4账户迁移与种子；原空库/旧数据副本升级和最终entries核对要求保持。 | closed |
| P2-PREP-03 minor | PLAN/DOCS明确DOCS末、VERIFY前由Leader生成冻结SHA候选ZIP及entries/manifest，state同步外部写范围与确定仓库外根目录。VERIFY绑定该包hash；SEAL对比可执行源、锁、配置、迁移/种子、素材、入口/命令和最终entries/hash，执行差异重验、非执行差异明示，不能称旧候选运行了最终包字节。 | closed |

附带调整已核对：state分列总87=R条款69+提交/验收8+用户10，独立内联JSON计数一致；10任务含runtimeDependencies的DAG仍无环。两份最终脱敏GIF的精确路径由Acceptance独占`docs/submission/media/home-ink.gif`与`creation-history.gif`，ROLES明确Leader仍持其余说明与引用，避免父路径所有权重叠。原始录制留仓库外；成片/报告晚于候选包加入时须记录非执行差异，若影响构建/运行则重验，未把录制提前插入性能窗口。

修订候选相对7bb的frontend/backend/Compose/CI差异仍为空；执行授权仍false，全部10包not_dispatched，没有将准备修订伪作产品实现。`git diff --check`无输出；本轮JSON/Git核对是数据检查，不等同Leader后续完整准备checker或运行验收。

**PREP独立审核通过，可收敛为ready_not_started并冻结准备包。** 这只表示计划、契约、消费者、所有权与交付顺序可执行；不自动启动P2，也不代签任何账户、产品美学/性能、CI、干净包运行、GIF/许可分发或最终交付结果。用户明确启动后才按精确集成SHA重新核对并派发。唯一准备审核文件至此写入完成，可由Leader封存；本Reviewer不commit或push。
